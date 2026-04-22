import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import {
  Bike,
  Edit,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Users,
} from "lucide-react";

export default function RiderDueAmountsPage() {
  const [riderDueAmounts, setRiderDueAmounts] = useState([]);
  const [riderDueLoading, setRiderDueLoading] = useState(false);
  const [riderDueSummary, setRiderDueSummary] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    dueAmount: "",
    description: "",
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRiderDueAmounts();
  }, []);

  const fetchRiderDueAmounts = async () => {
    setRiderDueLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(
        `${BASE_URL}/api/vendor/riders/due-amounts`,
        { method: "GET", headers, credentials: "include" },
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch rider due amounts: ${response.status}`,
        );
      const result = await response.json();
      if (result.success) {
        setRiderDueAmounts(result.data || []);
        setRiderDueSummary(result.summary || null);
      } else
        throw new Error(result.message || "Failed to fetch rider due amounts");
    } catch (err) {
      setError(err.message);
    } finally {
      setRiderDueLoading(false);
    }
  };

  const openUpdateModal = (rider) => {
    setSelectedRider(rider);
    setUpdateFormData({
      dueAmount: parseFloat(rider.dueBalance || 0).toFixed(2),
      description: "",
    });
    setIsUpdateModalOpen(true);
    setError(null);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedRider(null);
    setUpdateFormData({ dueAmount: "", description: "" });
    setError(null);
  };

  const handleUpdateDueAmount = async (e) => {
    e.preventDefault();
    if (!selectedRider || !updateFormData.dueAmount) {
      setError("Due amount is required.");
      return;
    }
    setUpdating(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(
        `${BASE_URL}/api/vendor/riders/${selectedRider.riderId}/due-amount`,
        {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify({
            dueAmount: parseFloat(updateFormData.dueAmount),
            description: updateFormData.description,
          }),
        },
      );
      if (!response.ok) {
        const d = await response.json();
        throw new Error(d.message || `Failed to update: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setUpdateSuccess(true);
        closeUpdateModal();
        fetchRiderDueAmounts();
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else throw new Error(result.message || "Failed to update due amount");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const fmt = (v) =>
    `₹${parseFloat(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const filteredRiders = riderDueAmounts.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.fullName || "").toLowerCase().includes(q) ||
      (r.mobileNumber || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const currentRiders = filteredRiders.slice(
    indexOfFirst,
    indexOfFirst + itemsPerPage,
  );

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: 5 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-28" : j === 4 ? "w-16 ml-auto" : "w-[70%]"}`}
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
        <td colSpan="5" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Bike className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {searchQuery
                ? "No riders match your search"
                : "No rider due amounts found"}
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
        .card-animate { animation: fadeSlideIn 0.3s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Success Alert ── */}
      {updateSuccess && (
        <div className="mx-1 mb-3 mt-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" /> Due amount updated
          successfully!
        </div>
      )}

      {/* ── Stats Cards ── */}
      {riderDueSummary && (
        <div className="grid grid-cols-2 gap-3 mb-4 mt-3 px-1">
          {[
            {
              label: "Total Riders",
              value: riderDueSummary.totalRiders || 0,
              icon: Users,
              border: "border-blue-400",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-500",
              valueColor: "text-gray-800",
              delay: 0,
            },
            {
              label: "Total Due Amount",
              value: fmt(riderDueSummary.totalDueAmount || 0),
              icon: IndianRupee,
              border: "border-[#FF7B1D]",
              iconBg: "bg-orange-50",
              iconColor: "text-[#FF7B1D]",
              valueColor: "text-[#FF7B1D]",
              delay: 60,
            },
          ].map(
            ({
              label,
              value,
              icon: Icon,
              border,
              iconBg,
              iconColor,
              valueColor,
              delay,
            }) => (
              <div
                key={label}
                className={`card-animate bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-l-4 ${border}`}
                style={{ animationDelay: `${delay}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className={`text-2xl font-bold mt-1 ${valueColor}`}>
                      {value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 px-1 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
          <span className="text-sm font-semibold text-gray-700">
            Rider Due Amounts
          </span>
          {!riderDueLoading && (
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-lg">
              {filteredRiders.length} riders
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[320px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by name or mobile…"
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-4 h-full transition-colors">
              Search
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchRiderDueAmounts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 transition-all shadow-sm h-[38px]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && !riderDueLoading && (
        <div className="mx-1 mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Rider List
            </span>
          </div>
          {!riderDueLoading && currentRiders.length > 0 && (
            <span className="text-xs text-gray-400 font-medium">
              {currentRiders.length} of {filteredRiders.length} riders
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {["S.N", "Rider Name", "Mobile", "Due Balance", "Actions"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 4 ? "text-right pr-5" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            {riderDueLoading ? (
              <TableSkeleton />
            ) : currentRiders.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {currentRiders.map((rider, idx) => (
                  <tr
                    key={idx}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {indexOfFirst + idx + 1}
                      </span>
                    </td>

                    {/* Rider Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                          <Bike className="w-3.5 h-3.5 text-[#FF7B1D]" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {rider.fullName || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Mobile */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                        {rider.mobileNumber || "N/A"}
                      </span>
                    </td>

                    {/* Due Balance */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          parseFloat(rider.dueBalance || 0) > 0
                            ? "bg-orange-50 text-[#FF7B1D] border-orange-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {fmt(rider.dueBalance)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => openUpdateModal(rider)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Update Due Amount"
                        >
                          <Edit className="w-3.5 h-3.5" />
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
      {!riderDueLoading && filteredRiders.length > itemsPerPage && (
        <div className="flex items-center justify-between px-1 mt-5 mb-6">
          <p className="text-xs text-gray-400 font-medium">
            Page{" "}
            <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
            of <span className="text-gray-600 font-semibold">{totalPages}</span>
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
                const visible = new Set([
                  1,
                  2,
                  totalPages - 1,
                  totalPages,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                ]);
                for (let i = 1; i <= totalPages; i++) {
                  if (visible.has(i)) pages.push(i);
                  else if (pages[pages.length - 1] !== "...") pages.push("...");
                }
                return pages.map((page, i) =>
                  page === "..." ? (
                    <span key={i} className="px-1 text-gray-400 text-xs">
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Update Modal ── */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Update Due Amount
                </h3>
                <p className="text-xs text-orange-100 mt-0.5">
                  Enter the amount paid by rider
                </p>
              </div>
              <button
                type="button"
                onClick={closeUpdateModal}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateDueAmount}>
              <div className="p-6 space-y-4">
                {/* Rider Info Card */}
                {selectedRider && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center">
                        <Bike className="w-5 h-5 text-[#FF7B1D]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedRider.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedRider.mobileNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Current Due</p>
                      <p className="text-sm font-bold text-[#FF7B1D]">
                        {fmt(selectedRider.dueBalance)}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Amount Paid <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={updateFormData.dueAmount}
                      onChange={(e) =>
                        setUpdateFormData((p) => ({
                          ...p,
                          dueAmount: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      required
                      className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-[#FF7B1D] outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Description{" "}
                    <span className="text-gray-400 font-normal normal-case">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    value={updateFormData.description}
                    onChange={(e) =>
                      setUpdateFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Add a description for this update…"
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-[#FF7B1D] outline-none text-sm resize-none transition-all"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  disabled={updating}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-orange-200 flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
