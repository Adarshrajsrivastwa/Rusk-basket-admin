import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/api";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  Wallet,
  X,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const VendorWithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        "/api/vendor/wallet/earning/withdrawal-requests",
      );
      const result = response.data;
      if (result.success) {
        setRequests(result.data || []);
        if (result.earningWallet?.currentBalance !== undefined) {
          setAvailableBalance(
            parseFloat(result.earningWallet.currentBalance) || 0,
          );
          setShowWalletPopup(true);
        }
      } else {
        setError(result.message || "Failed to fetch withdrawal requests");
        setRequests([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching withdrawal requests",
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (parseFloat(withdrawalAmount) > availableBalance) {
      setError("Withdrawal amount cannot exceed available balance");
      return;
    }
    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      const response = await api.post("/api/vendor/wallet/earning/send", {
        amount: parseFloat(withdrawalAmount),
      });
      const result = response.data;
      if (result.success) {
        setSuccess("Withdrawal request created successfully!");
        setIsCreateModalOpen(false);
        setWithdrawalAmount("");
        fetchRequests();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to create withdrawal request");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error creating withdrawal request",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (v) =>
    `₹${parseFloat(v || 0).toLocaleString("en-IN")}`;

  const STATUS_CONFIG = {
    approved: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
      dot: "bg-emerald-500",
      label: "Approved",
    },
    rejected: {
      cls: "bg-red-50 text-red-700 border-red-200 ring-red-100",
      dot: "bg-red-500",
      label: "Rejected",
    },
    pending: {
      cls: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
      dot: "bg-amber-500",
      label: "Pending",
    },
  };

  const StatusBadge = ({ status }) => {
    const key = status?.toLowerCase() || "pending";
    const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.pending;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${cfg.cls}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
    );
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const currentRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: 5 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-28" : "w-[70%]"}`}
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
              <Wallet className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No withdrawal requests found
            </p>
            <p className="text-gray-300 text-xs">
              Create your first withdrawal request
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

      {/* ── Alerts ── */}
      {success && (
        <div className="mx-1 mb-3 mt-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div className="mx-1 mb-3 mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 mt-3 px-1">
        {[
          {
            label: "Available Balance",
            value: formatCurrency(availableBalance),
            icon: IndianRupee,
            border: "border-[#FF7B1D]",
            iconBg: "bg-orange-50",
            iconColor: "text-[#FF7B1D]",
            valueColor: "text-[#FF7B1D]",
            delay: 0,
          },
          {
            label: "Total Requests",
            value: requests.length,
            icon: Wallet,
            border: "border-blue-400",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
            valueColor: "text-gray-800",
            delay: 60,
          },
          {
            label: "Pending",
            value: requests.filter((r) => r.status === "pending").length,
            icon: AlertCircle,
            border: "border-amber-400",
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
            valueColor: "text-amber-600",
            delay: 120,
          },
          {
            label: "Approved",
            value: requests.filter((r) => r.status === "approved").length,
            icon: CheckCircle,
            border: "border-emerald-400",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-500",
            valueColor: "text-emerald-600",
            delay: 180,
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

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
          <span className="text-sm font-semibold text-gray-700">
            Withdrawal Requests
          </span>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-lg">
              {requests.length} total
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200"
        >
          <Plus className="w-4 h-4" />
          Create Request
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Request History
            </span>
          </div>
          {!loading && requests.length > 0 && (
            <span className="text-xs text-gray-400 font-medium">
              {currentRequests.length} of {requests.length} requests
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {["S.N", "Request ID", "Amount", "Status", "Date"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 text-left"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : requests.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {currentRequests.map((req, idx) => (
                  <tr
                    key={req._id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </span>
                    </td>

                    {/* Request ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        …{req._id?.slice(-10) || "N/A"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        {formatCurrency(req.amount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {formatDate(req.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {!loading && requests.length > itemsPerPage && (
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

      {/* ── Create Withdrawal Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Create Withdrawal Request
                </h2>
                <p className="text-xs text-orange-100 mt-0.5">
                  Enter the amount you want to withdraw
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setWithdrawalAmount("");
                  setError(null);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Balance display */}
              <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Available Balance
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 mt-0.5">
                    {formatCurrency(availableBalance)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Withdrawal Amount <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={availableBalance}
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    required
                    className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-[#FF7B1D] outline-none text-sm transition-all"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Maximum: {formatCurrency(availableBalance)}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setWithdrawalAmount("");
                  setError(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-orange-200 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Create Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Wallet Balance Popup ── */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-white" />
                <h2 className="text-lg font-bold text-white">Wallet Balance</h2>
              </div>
              <button
                onClick={() => setShowWalletPopup(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="w-10 h-10 text-emerald-500" />
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Available Balance
                </p>
                <p className="text-4xl font-bold text-emerald-600">
                  {formatCurrency(availableBalance)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Available for withdrawal
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowWalletPopup(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-orange-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-sm shadow-orange-200"
                >
                  <Plus className="w-4 h-4" /> Create Withdrawal Request
                </button>
                <button
                  onClick={() => setShowWalletPopup(false)}
                  className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default VendorWithdrawalRequests;
