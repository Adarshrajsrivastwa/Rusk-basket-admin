import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/api";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminVendorWithdrawalRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      const response = await api.get("/api/admin/vendors/withdrawal-requests", {
        params,
      });
      const result = response.data;
      if (result.success) {
        setRequests(result.data || []);
      } else {
        setError(result.message || "Failed to fetch withdrawal requests");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      if (error.response?.status === 500) {
        const errorData = error.response?.data;
        if (
          typeof errorData === "string" &&
          errorData.includes("Cast to ObjectId failed")
        ) {
          setError(
            "⚠️ Backend routing issue detected. Ensure withdrawal-requests route is defined BEFORE the :vendorId route.",
          );
        } else {
          setError(error.response?.data?.message || "Server error occurred.");
        }
      } else {
        setError(
          error.response?.data?.message ||
            "Error fetching withdrawal requests.",
        );
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleApprove = async (requestId) => {
    if (!requestId || requestId === "undefined") {
      setError("Invalid request ID.");
      return;
    }
    if (!window.confirm("Approve this withdrawal request?")) return;
    try {
      setActionLoading(requestId);
      setError(null);
      setSuccess(null);
      const response = await api.put(
        `/api/admin/vendors/withdrawal-requests/${requestId}/approve`,
      );
      if (response.data.success) {
        setSuccess("Withdrawal request approved successfully!");
        fetchRequests();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message || "Failed to approve");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error approving request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!requestId || requestId === "undefined") {
      setError("Invalid request ID.");
      return;
    }
    if (!window.confirm("Reject this withdrawal request?")) return;
    try {
      setActionLoading(requestId);
      setError(null);
      setSuccess(null);
      const response = await api.put(
        `/api/admin/vendors/withdrawal-requests/${requestId}/reject`,
      );
      if (response.data.success) {
        setSuccess("Withdrawal request rejected successfully!");
        fetchRequests();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message || "Failed to reject");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error rejecting request");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) =>
    `₹${parseFloat(amount || 0).toLocaleString("en-IN")}`;

  const filteredRequests = requests.filter((request) => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    const requestId = request._id || request.requestId;
    return (
      request.vendor?.storeName?.toLowerCase().includes(s) ||
      request.vendor?.vendorName?.toLowerCase().includes(s) ||
      request.vendor?.mobile?.toLowerCase().includes(s) ||
      request.vendor?.contactNumber?.toLowerCase().includes(s) ||
      request.vendor?._id?.toLowerCase().includes(s) ||
      requestId?.toLowerCase().includes(s) ||
      request.amount?.toString().includes(s)
    );
  });

  const statCards = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: DollarSign,
      color: "orange",
      iconColor: "text-orange-500",
      bg: "bg-orange-50",
      ring: "ring-orange-100",
      border: "border-orange-200",
    },
    {
      label: "Pending",
      value: requests.filter((r) => r.status === "pending").length,
      icon: AlertCircle,
      color: "amber",
      iconColor: "text-amber-500",
      bg: "bg-amber-50",
      ring: "ring-amber-100",
      border: "border-amber-200",
      textColor: "text-amber-600",
    },
    {
      label: "Approved",
      value: requests.filter((r) => r.status === "approved").length,
      icon: CheckCircle,
      color: "emerald",
      iconColor: "text-emerald-500",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      border: "border-emerald-200",
      textColor: "text-emerald-600",
    },
    {
      label: "Rejected",
      value: requests.filter((r) => r.status === "rejected").length,
      icon: XCircle,
      color: "red",
      iconColor: "text-red-400",
      bg: "bg-red-50",
      ring: "ring-red-100",
      border: "border-red-200",
      textColor: "text-red-600",
    },
  ];

  const StatusBadge = ({ status }) => {
    const s = (status || "pending").toLowerCase();
    const styles = {
      approved:
        "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
      rejected: "bg-red-50 text-red-700 border-red-200 ring-red-100",
      pending: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
    };
    const dots = {
      approved: "bg-emerald-500",
      rejected: "bg-red-500",
      pending: "bg-amber-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${styles[s] || "bg-gray-50 text-gray-600 border-gray-200 ring-gray-100"}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${dots[s] || "bg-gray-400"}`}
        />
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-24" : j === 8 ? "w-20 ml-auto" : "w-[70%]"}`}
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
        <td colSpan="9" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No withdrawal requests found
            </p>
            <p className="text-gray-300 text-xs">
              Try adjusting your filters or search query
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Toast Messages ── */}
      {success && (
        <div className="mb-3 mx-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-3 mx-1 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-1 mt-3 mb-4">
        {statCards.map(
          ({
            label,
            value,
            icon: Icon,
            iconColor,
            bg,
            ring,
            border,
            textColor,
          }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p
                  className={`text-2xl font-bold mt-0.5 ${textColor || "text-gray-800"}`}
                >
                  {value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${bg} border ${border} ring-1 ${ring} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
            </div>
          ),
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full px-1 mb-3">
        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                statusFilter === tab.key
                  ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[420px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search by vendor name, store, mobile, ID..."
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
              Withdrawal Requests
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredRequests.length} of {requests.length} requests
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  "S.N",
                  "Request ID",
                  "Vendor Name",
                  "Store Name",
                  "Mobile",
                  "Amount",
                  "Status",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right text-xs font-bold text-white tracking-wider uppercase opacity-90 pr-5">
                  Actions
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredRequests.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {filteredRequests.map((request, idx) => {
                  const requestId = request._id || request.requestId;
                  if (!requestId) return null;
                  return (
                    <tr
                      key={requestId}
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* S.N */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {idx + 1}
                        </span>
                      </td>

                      {/* Request ID */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          …{requestId?.slice(-8) || "N/A"}
                        </span>
                      </td>

                      {/* Vendor Name */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-gray-800">
                          {request.vendor?.vendorName || "N/A"}
                        </span>
                      </td>

                      {/* Store Name */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                          {request.vendor?.storeName || "N/A"}
                        </span>
                      </td>

                      {/* Mobile */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        {request.vendor?.mobile ||
                          request.vendor?.contactNumber ||
                          "N/A"}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                          {formatCurrency(request.amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={request.status} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-gray-400 text-xs">
                        {formatDate(request.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}
                          <button
                            onClick={() => {
                              const vendorId =
                                request.vendor?._id ||
                                request.vendorId ||
                                request.vendor?.vendorId;
                              if (vendorId) navigate(`/vendor/${vendorId}`);
                              else setError("Vendor ID not found.");
                            }}
                            className="action-btn bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-700"
                            title="View Vendor"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Approve / Reject — only pending */}
                          {request.status === "pending" && requestId && (
                            <>
                              <button
                                onClick={() => handleApprove(requestId)}
                                disabled={actionLoading === requestId}
                                className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Approve"
                              >
                                {actionLoading === requestId ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(requestId)}
                                disabled={actionLoading === requestId}
                                className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Reject"
                              >
                                {actionLoading === requestId ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </>
                          )}

                          {request.status !== "pending" && (
                            <span className="text-[11px] text-gray-300 italic px-1">
                              {request.status === "approved"
                                ? "Approved"
                                : "Rejected"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* ── Bottom spacing ── */}
      <div className="mb-6" />
    </DashboardLayout>
  );
};

export default AdminVendorWithdrawalRequests;
