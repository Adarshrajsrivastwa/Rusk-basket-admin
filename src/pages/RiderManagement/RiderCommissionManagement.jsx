import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Settings,
  IndianRupee,
  Percent,
  Calendar,
  Wallet,
  DollarSign,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  BadgePercent,
  Layers,
  RefreshCw,
} from "lucide-react";
import api from "../../api/api";

const RiderCommissionManagement = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [commissionData, setCommissionData] = useState({
    type: "percentage",
    percentage: 10,
    fixedAmount: 0,
    subscriptionAmount: 0,
    subscriptionPeriod: "monthly",
  });
  const [saving, setSaving] = useState(false);

  const fetchRiders = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/riders/wallets`, {
        params: { page, limit },
      });
      const result = response.data;
      if (result.success) {
        setRiders(result.data.wallets || []);
        setPagination(
          result.data.pagination || { total: 0, pages: 1, page, limit },
        );
      } else {
        setRiders([]);
      }
    } catch (error) {
      console.error("Error fetching riders:", error);
      setRiders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders(currentPage, 10);
  }, [currentPage]);

  const handleSetCommission = (rider) => {
    setSelectedRider(rider);
    if (rider.commission || rider.commissionType) {
      setCommissionData({
        type: rider.commissionType || rider.commission?.type || "percentage",
        percentage:
          rider.commissionPercentage || rider.commission?.percentage || 10,
        fixedAmount: rider.commission?.fixedAmount || 0,
        subscriptionAmount: rider.commission?.subscriptionAmount || 0,
        subscriptionPeriod: rider.commission?.subscriptionPeriod || "monthly",
      });
    } else {
      setCommissionData({
        type: "percentage",
        percentage: 10,
        fixedAmount: 0,
        subscriptionAmount: 0,
        subscriptionPeriod: "monthly",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveCommission = async () => {
    if (!selectedRider) return;
    try {
      setSaving(true);
      let payload = { type: commissionData.type };
      if (commissionData.type === "percentage") {
        payload.percentage = parseFloat(commissionData.percentage);
      } else if (commissionData.type === "fixed") {
        payload.fixedAmount = parseFloat(commissionData.fixedAmount);
      } else if (commissionData.type === "hybrid") {
        payload.percentage = parseFloat(commissionData.percentage);
        payload.fixedAmount = parseFloat(commissionData.fixedAmount);
      } else if (commissionData.type === "subscription") {
        payload.subscriptionAmount = parseFloat(
          commissionData.subscriptionAmount,
        );
        payload.subscriptionPeriod = commissionData.subscriptionPeriod;
      }
      const response = await api.put(
        `/api/admin/riders/${selectedRider.riderId || selectedRider._id}/commission`,
        payload,
      );
      const result = response.data;
      if (result.success) {
        alert("Commission updated successfully!");
        setIsModalOpen(false);
        setSelectedRider(null);
        fetchRiders(currentPage, 10);
      } else {
        alert(result.message || "Failed to update commission");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Error updating commission.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatCommission = (rider) => {
    if (!rider.commissionType && !rider.commission) return null;
    const commType = rider.commissionType || rider.commission?.type;
    const comm = rider.commission || {};
    if (commType === "percentage")
      return {
        label: `${rider.commissionPercentage || comm.percentage || 0}%`,
        type: commType,
      };
    if (commType === "fixed")
      return { label: `₹${comm.fixedAmount || 0}`, type: commType };
    if (commType === "hybrid")
      return {
        label: `${comm.percentage || 0}% + ₹${comm.fixedAmount || 0}`,
        type: commType,
      };
    if (commType === "subscription")
      return {
        label: `₹${comm.subscriptionAmount || 0}/${comm.subscriptionPeriod || "monthly"}`,
        type: commType,
      };
    return null;
  };

  const CommissionBadge = ({ rider }) => {
    const comm = formatCommission(rider);
    if (!comm) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-400 border border-gray-200">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          Not Set
        </span>
      );
    }
    const styles = {
      percentage:
        "bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100",
      fixed:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      hybrid:
        "bg-violet-50 text-violet-700 border border-violet-200 ring-1 ring-violet-100",
      subscription:
        "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
    };
    const dots = {
      percentage: "bg-blue-500",
      fixed: "bg-emerald-500",
      hybrid: "bg-violet-500",
      subscription: "bg-amber-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[comm.type] || "bg-gray-100 text-gray-600"}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${dots[comm.type] || "bg-gray-400"}`}
        />
        {comm.label}
      </span>
    );
  };

  const filteredRiders = riders.filter((rider) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rider.fullName?.toLowerCase().includes(q) ||
      rider.mobileNumber?.toLowerCase().includes(q) ||
      rider.riderId?.toLowerCase().includes(q)
    );
  });

  // ── Skeleton ──
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-28" : j === 6 ? "w-16 ml-auto" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // ── Empty State ──
  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="7" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No riders found</p>
            <p className="text-gray-300 text-xs">
              Try adjusting your search query
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full max-w-full mx-auto px-1 mt-3 mb-3">
        {/* LEFT: info chip */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-xl px-3 h-[36px] text-xs font-semibold text-orange-600">
            <Users className="w-3.5 h-3.5" />
            Rider Commission
          </div>
        </div>

        {/* RIGHT: Search */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search by name, mobile, ID..."
            className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Rider Wallet & Commission
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredRiders.length} of {pagination.total} riders
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90 w-12">
                  S.N
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Rider Name
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Mobile Number
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Wallet Balance
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Due Balance
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Commission
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-bold text-white tracking-wider uppercase opacity-90 pr-5">
                  Action
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredRiders.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {filteredRiders.map((rider, idx) => (
                  <tr
                    key={rider.riderId || rider._id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {(currentPage - 1) * pagination.limit + idx + 1}
                      </span>
                    </td>

                    {/* Rider Name */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {rider.fullName || "N/A"}
                      </span>
                    </td>

                    {/* Mobile */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {rider.mobileNumber || "N/A"}
                      </span>
                    </td>

                    {/* Wallet Balance */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100">
                        <Wallet className="w-3 h-3" />₹
                        {rider.walletBalance?.toFixed(2) || "0.00"}
                      </span>
                    </td>

                    {/* Due Balance */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100">
                        <DollarSign className="w-3 h-3" />₹
                        {rider.dueBalance?.toFixed(2) || "0.00"}
                      </span>
                    </td>

                    {/* Commission */}
                    <td className="px-4 py-3.5">
                      <CommissionBadge rider={rider} />
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSetCommission(rider)}
                          className="action-btn bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-700"
                          title="Set Commission"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {!loading && filteredRiders.length > 0 && (
        <div className="flex items-center justify-between px-1 mt-5 mb-6">
          <p className="text-xs text-gray-400 font-medium">
            Page{" "}
            <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
            of{" "}
            <span className="text-gray-600 font-semibold">
              {pagination.pages}
            </span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const totalPages = pagination.pages;
                const visiblePages = new Set([
                  1,
                  2,
                  totalPages - 1,
                  totalPages,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                ]);
                for (let i = 1; i <= totalPages; i++) {
                  if (visiblePages.has(i)) pages.push(i);
                  else if (pages[pages.length - 1] !== "...") pages.push("...");
                }
                return pages.map((page, idx) =>
                  page === "..." ? (
                    <span key={idx} className="px-1 text-gray-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === page
                          ? "bg-[#FF7B1D] text-white shadow-sm shadow-orange-200"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                );
              })()}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, pagination.pages))
              }
              disabled={currentPage === pagination.pages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Commission Modal ── */}
      {isModalOpen && selectedRider && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Set Commission
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedRider.fullName || "Rider"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedRider(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet Info */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-50/60 to-amber-50/40 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl px-4 py-3 border border-emerald-100 shadow-sm">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <Wallet className="w-3 h-3 text-emerald-500" /> Wallet
                    Balance
                  </p>
                  <p className="text-base font-bold text-emerald-700">
                    ₹{selectedRider.walletBalance?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-white rounded-xl px-4 py-3 border border-amber-100 shadow-sm">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3 text-amber-500" /> Due
                    Balance
                  </p>
                  <p className="text-base font-bold text-amber-700">
                    ₹{selectedRider.dueBalance?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Commission Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Commission Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      value: "percentage",
                      label: "Percentage",
                      icon: <Percent className="w-3.5 h-3.5" />,
                    },
                    {
                      value: "fixed",
                      label: "Fixed Amount",
                      icon: <IndianRupee className="w-3.5 h-3.5" />,
                    },
                    {
                      value: "hybrid",
                      label: "Hybrid",
                      icon: <Layers className="w-3.5 h-3.5" />,
                    },
                    {
                      value: "subscription",
                      label: "Subscription",
                      icon: <RefreshCw className="w-3.5 h-3.5" />,
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setCommissionData({
                          ...commissionData,
                          type: opt.value,
                        })
                      }
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        commissionData.type === opt.value
                          ? "bg-[#FF7B1D] text-white border-[#FF7B1D] shadow-sm shadow-orange-200"
                          : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-500"
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Percentage */}
              {commissionData.type === "percentage" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-blue-500" /> Percentage
                    (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={commissionData.percentage}
                    onChange={(e) =>
                      setCommissionData({
                        ...commissionData,
                        percentage: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
                    placeholder="10"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    Example: 10% of each order value
                  </p>
                </div>
              )}

              {/* Fixed */}
              {commissionData.type === "fixed" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />{" "}
                    Fixed Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={commissionData.fixedAmount}
                    onChange={(e) =>
                      setCommissionData({
                        ...commissionData,
                        fixedAmount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
                    placeholder="20"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    Example: ₹20 per order
                  </p>
                </div>
              )}

              {/* Hybrid */}
              {commissionData.type === "hybrid" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-violet-500" />{" "}
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={commissionData.percentage}
                      onChange={(e) =>
                        setCommissionData({
                          ...commissionData,
                          percentage: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-violet-500" />{" "}
                      Fixed Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={commissionData.fixedAmount}
                      onChange={(e) =>
                        setCommissionData({
                          ...commissionData,
                          fixedAmount: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
                      placeholder="20"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Example: 5% + ₹20 per order
                  </p>
                </div>
              )}

              {/* Subscription */}
              {commissionData.type === "subscription" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-500" />{" "}
                      Subscription Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={commissionData.subscriptionAmount}
                      onChange={(e) =>
                        setCommissionData({
                          ...commissionData,
                          subscriptionAmount: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
                      placeholder="500"
                    />
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      ⚠️ Auto-deducted from rider wallet
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" /> Period
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["monthly", "yearly"].map((period) => (
                        <button
                          key={period}
                          onClick={() =>
                            setCommissionData({
                              ...commissionData,
                              subscriptionPeriod: period,
                            })
                          }
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                            commissionData.subscriptionPeriod === period
                              ? "bg-[#FF7B1D] text-white border-[#FF7B1D] shadow-sm shadow-orange-200"
                              : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-500"
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl px-4 py-3 border border-orange-100">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Preview
                </p>
                <p className="text-lg font-bold text-[#FF7B1D]">
                  {commissionData.type === "percentage" &&
                    `${commissionData.percentage || 0}%`}
                  {commissionData.type === "fixed" &&
                    `₹${commissionData.fixedAmount || 0} / order`}
                  {commissionData.type === "hybrid" &&
                    `${commissionData.percentage || 0}% + ₹${commissionData.fixedAmount || 0} / order`}
                  {commissionData.type === "subscription" &&
                    `₹${commissionData.subscriptionAmount || 0} / ${commissionData.subscriptionPeriod || "monthly"}`}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedRider(null);
                }}
                disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCommission}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Commission"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RiderCommissionManagement;
