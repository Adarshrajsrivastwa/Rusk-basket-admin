import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Settings,
  IndianRupee,
  Percent,
  Calendar,
  Wallet,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
} from "lucide-react";
import api from "../../api/api";

const VendorCommissionManagement = () => {
  const [vendors, setVendors] = useState([]);
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
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [commissionData, setCommissionData] = useState({
    type: "percentage",
    percentage: 10,
    fixedAmount: 20,
    subscriptionAmount: 999,
    subscriptionPeriod: "monthly",
  });
  const [saving, setSaving] = useState(false);

  const fetchVendors = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/vendors/wallets`, {
        params: { page, limit },
      });
      const result = response.data;
      if (result.success) {
        setVendors(result.data.wallets || []);
        setPagination(
          result.data.pagination || {
            total: 0,
            pages: 1,
            page,
            limit,
          },
        );
      } else {
        setVendors([]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(currentPage, 10);
  }, [currentPage]);

  const handleSetCommission = (vendor) => {
    setSelectedVendor(vendor);
    if (vendor.commissionType || vendor.commission) {
      setCommissionData({
        type: vendor.commissionType || vendor.commission?.type || "percentage",
        percentage:
          vendor.commissionPercentage || vendor.commission?.percentage || 10,
        fixedAmount:
          vendor.commissionFixedAmount || vendor.commission?.fixedAmount || 0,
        subscriptionAmount: vendor.commission?.subscriptionAmount || 0,
        subscriptionPeriod: vendor.commission?.subscriptionPeriod || "monthly",
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
    if (!selectedVendor) return;
    try {
      setSaving(true);
      let payload = { type: commissionData.type };
      if (commissionData.type === "percentage")
        payload.percentage = parseFloat(commissionData.percentage);
      else if (commissionData.type === "fixed")
        payload.fixedAmount = parseFloat(commissionData.fixedAmount);
      else if (commissionData.type === "hybrid") {
        payload.percentage = parseFloat(commissionData.percentage);
        payload.fixedAmount = parseFloat(commissionData.fixedAmount);
      } else if (commissionData.type === "subscription") {
        payload.subscriptionAmount = parseFloat(
          commissionData.subscriptionAmount,
        );
        payload.subscriptionPeriod = commissionData.subscriptionPeriod;
      }

      let response,
        error = null;
      try {
        response = await api.put(
          `/api/admin/vendors/${selectedVendor.vendorId || selectedVendor._id}/commission`,
          payload,
        );
      } catch (e1) {
        if (e1.response?.status === 404) {
          try {
            response = await api.put(
              `/api/vendor/${selectedVendor.vendorId || selectedVendor._id}/commission`,
              payload,
            );
          } catch (e2) {
            error = e2;
          }
        } else {
          error = e1;
        }
      }
      if (error) throw error;

      if (response.data.success) {
        alert("Commission updated successfully!");
        setIsModalOpen(false);
        setSelectedVendor(null);
        fetchVendors(currentPage, 10);
      } else {
        alert(response.data.message || "Failed to update commission");
      }
    } catch (error) {
      console.error("Error updating commission:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Error updating commission.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatCommission = (vendor) => {
    if (!vendor.commissionType && !vendor.commission) return "Not Set";
    const commType = vendor.commissionType || vendor.commission?.type;
    const comm = vendor.commission || {};
    if (commType === "percentage")
      return `${vendor.commissionPercentage || comm.percentage || 0}%`;
    if (commType === "fixed")
      return `₹${vendor.commissionFixedAmount || comm.fixedAmount || 0}`;
    if (commType === "hybrid")
      return `${comm.percentage || 0}% + ₹${comm.fixedAmount || 0}`;
    if (commType === "subscription")
      return `₹${comm.subscriptionAmount || 0}/${comm.subscriptionPeriod || "monthly"}`;
    return "Not Set";
  };

  const filteredVendors = vendors.filter((vendor) => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    return (
      vendor.vendorName?.toLowerCase().includes(s) ||
      vendor.vendorId?.toLowerCase().includes(s) ||
      vendor.storeId?.toLowerCase().includes(s) ||
      vendor.storeName?.toLowerCase().includes(s) ||
      vendor.contactNumber?.toLowerCase().includes(s)
    );
  });

  const commissionTypeLabel = {
    percentage: "Percentage",
    fixed: "Fixed Amount",
    hybrid: "Hybrid",
    subscription: "Subscription",
  };

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 10 }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-24" : j === 6 ? "w-16 ml-auto" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="7" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No vendors found
            </p>
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
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
        .modal-input {
          width: 100%; padding: 10px 14px;
          border: 1px solid #e5e7eb; border-radius: 12px;
          font-size: 13px; color: #374151;
          outline: none; transition: all 0.18s ease;
          background: #fff;
        }
        .modal-input:focus { border-color: #FF7B1D; box-shadow: 0 0 0 3px rgba(255,123,29,0.1); }
        .modal-select {
          width: 100%; padding: 10px 14px;
          border: 1px solid #e5e7eb; border-radius: 12px;
          font-size: 13px; color: #374151;
          outline: none; background: #fff;
          transition: all 0.18s ease; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
          padding-right: 38px;
        }
        .modal-select:focus { border-color: #FF7B1D; box-shadow: 0 0 0 3px rgba(255,123,29,0.1); }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full px-1 mt-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-[#FF7B1D]" />
          <h1 className="text-base font-bold text-gray-800">
            Vendor Commission Management
          </h1>
        </div>

        {/* Search */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search by name, ID, store..."
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
              Commission Overview
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredVendors.length} of {pagination.total} vendors
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  "S.N",
                  "Vendor ID",
                  "Vendor Name",
                  "Store Name",
                  "Earning Wallet",
                  "Commission",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right text-xs font-bold text-white tracking-wider uppercase opacity-90 pr-5">
                  Action
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredVendors.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {filteredVendors.map((vendor, idx) => (
                  <tr
                    key={vendor.vendorId || vendor._id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {(currentPage - 1) * pagination.limit + idx + 1}
                      </span>
                    </td>

                    {/* Vendor ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {vendor.storeId || "N/A"}
                      </span>
                    </td>

                    {/* Vendor Name */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-gray-800">
                        {vendor.vendorName || "N/A"}
                      </span>
                    </td>

                    {/* Store Name */}
                    <td className="px-4 py-3.5 text-gray-600 text-sm">
                      {vendor.storeName || "N/A"}
                    </td>

                    {/* Earning Wallet */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100">
                        <Wallet className="w-3 h-3" />₹
                        {vendor.earningWallet?.toFixed(2) || "0.00"}
                      </span>
                    </td>

                    {/* Commission */}
                    <td className="px-4 py-3.5">
                      {formatCommission(vendor) === "Not Set" ? (
                        <span className="text-xs text-gray-400 italic">
                          Not Set
                        </span>
                      ) : (
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                          {formatCommission(vendor)}
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSetCommission(vendor)}
                          className="action-btn flex items-center gap-1.5 px-3 py-1.5 bg-[#FF7B1D] hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm shadow-orange-100"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Set Commission
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
      {!loading && filteredVendors.length > 0 && pagination.pages > 1 && (
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
                const vis = new Set([
                  1,
                  2,
                  totalPages - 1,
                  totalPages,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                ]);
                for (let i = 1; i <= totalPages; i++) {
                  if (vis.has(i)) pages.push(i);
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
      {isModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-800">
                  Set Commission
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedVendor.vendorName || selectedVendor.storeName}{" "}
                  &nbsp;·&nbsp; {selectedVendor.storeId || "N/A"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedVendor(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet Info Banner */}
            <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Wallet className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Earning Wallet Balance
                </p>
                <p className="text-sm font-bold text-emerald-700">
                  ₹{selectedVendor.earningWallet?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Commission Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Commission Type
                </label>
                <select
                  value={commissionData.type}
                  onChange={(e) =>
                    setCommissionData({
                      ...commissionData,
                      type: e.target.value,
                    })
                  }
                  className="modal-select"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="hybrid">Hybrid (Percentage + Fixed)</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              {/* Percentage */}
              {commissionData.type === "percentage" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-[#FF7B1D]" />{" "}
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
                    className="modal-input"
                    placeholder="10"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    e.g. 10% of each order value
                  </p>
                  <p className="mt-0.5 text-[11px] text-orange-500 font-medium">
                    ⚠️ Depends upon total transaction amount
                  </p>
                </div>
              )}

              {/* Fixed */}
              {commissionData.type === "fixed" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-[#FF7B1D]" /> Fixed
                    Amount (₹)
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
                    className="modal-input"
                    placeholder="20"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    e.g. ₹20 per order
                  </p>
                </div>
              )}

              {/* Hybrid */}
              {commissionData.type === "hybrid" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-[#FF7B1D]" />{" "}
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
                      className="modal-input"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-[#FF7B1D]" />{" "}
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
                      className="modal-input"
                      placeholder="20"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    e.g. 5% + ₹20 per order
                  </p>
                  <p className="text-[11px] text-orange-500 font-medium">
                    ⚠️ Percentage depends upon total transaction amount
                  </p>
                </div>
              )}

              {/* Subscription */}
              {commissionData.type === "subscription" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-[#FF7B1D]" />{" "}
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
                      className="modal-input"
                      placeholder="999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FF7B1D]" />{" "}
                      Subscription Period
                    </label>
                    <select
                      value={commissionData.subscriptionPeriod}
                      onChange={(e) =>
                        setCommissionData({
                          ...commissionData,
                          subscriptionPeriod: e.target.value,
                        })
                      }
                      className="modal-select"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    e.g. ₹999/month — vendor pays flat subscription
                  </p>
                </div>
              )}

              {/* Preview Card */}
              <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3.5">
                <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1">
                  Preview
                </p>
                <p className="text-lg font-bold text-[#FF7B1D]">
                  {commissionData.type === "percentage" &&
                    `${commissionData.percentage || 0}%`}
                  {commissionData.type === "fixed" &&
                    `₹${commissionData.fixedAmount || 0} per order`}
                  {commissionData.type === "hybrid" &&
                    `${commissionData.percentage || 0}% + ₹${commissionData.fixedAmount || 0} per order`}
                  {commissionData.type === "subscription" &&
                    `₹${commissionData.subscriptionAmount || 0} / ${commissionData.subscriptionPeriod || "monthly"}`}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Type:{" "}
                  <span className="font-medium text-gray-600">
                    {commissionTypeLabel[commissionData.type]}
                  </span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedVendor(null);
                }}
                disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCommission}
                disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Saving...
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

export default VendorCommissionManagement;
