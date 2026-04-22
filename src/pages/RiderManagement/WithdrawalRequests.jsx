import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/api";
import { BASE_URL } from "../../api/api";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  X,
  Eye,
  FileText,
  Car,
  CreditCard,
  MapPin,
  Phone,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  Banknote,
  Clock,
} from "lucide-react";

const API_BASE_URL = `${BASE_URL}/api/rider`;

const WithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      const response = await api.get("/api/admin/riders/withdrawal-requests", {
        params,
      });
      const result = response.data;
      if (result.success) {
        setRequests(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.message || "Failed to fetch withdrawal requests");
        setRequests([]);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error fetching withdrawal requests.",
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleApprove = async (requestId) => {
    if (!window.confirm("Approve this withdrawal request?")) return;
    try {
      setActionLoading(requestId);
      setError(null);
      setSuccess(null);
      const response = await api.put(
        `/api/admin/riders/withdrawal-requests/${requestId}/approve`,
      );
      if (response.data.success) {
        setSuccess("Withdrawal request approved successfully!");
        fetchRequests();
        setTimeout(() => setSuccess(null), 3000);
      } else setError(response.data.message || "Failed to approve");
    } catch (error) {
      setError(error.response?.data?.message || "Error approving request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm("Reject this withdrawal request?")) return;
    try {
      setActionLoading(requestId);
      setError(null);
      setSuccess(null);
      const response = await api.put(
        `/api/admin/riders/withdrawal-requests/${requestId}/reject`,
      );
      if (response.data.success) {
        setSuccess("Withdrawal request rejected successfully!");
        fetchRequests();
        setTimeout(() => setSuccess(null), 3000);
      } else setError(response.data.message || "Failed to reject");
    } catch (error) {
      setError(error.response?.data?.message || "Error rejecting request");
    } finally {
      setActionLoading(null);
    }
  };

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchRiderDetails = async (riderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${riderId}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (result.success) setSelectedRider(result.data);
      else setError("Failed to fetch rider details");
    } catch (err) {
      setError("Error fetching rider details: " + err.message);
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

  const formatDateModal = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    if (typeof amount === "string" && amount.includes("₹")) return amount;
    return `₹${parseFloat(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getRiderStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "rejected":
      case "suspended":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getRiderStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
      case "suspended":
        return "Rejected";
      default:
        return "Pending Review";
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      req.riderName?.toLowerCase().includes(q) ||
      req.riderMobile?.toLowerCase().includes(q) ||
      req.riderId?.toLowerCase().includes(q) ||
      req.requestId?.toLowerCase().includes(q)
    );
  });

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  const StatusBadge = ({ status }) => {
    const s = (status || "pending").toLowerCase();
    const styles = {
      approved:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      pending:
        "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      rejected:
        "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
    };
    const dots = {
      approved: "bg-emerald-500",
      pending: "bg-amber-500",
      rejected: "bg-red-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[s] || "bg-gray-100 text-gray-600 border border-gray-200"}`}
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
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 7 ? "w-16 ml-auto" : "w-[70%]"}`}
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
        <td colSpan="8" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Banknote className="w-8 h-8 text-orange-300" />
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

  const statCards = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    {
      label: "Pending",
      value: requests.filter((r) => r.status === "pending").length,
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Approved",
      value: requests.filter((r) => r.status === "approved").length,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Rejected",
      value: requests.filter((r) => r.status === "rejected").length,
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
    },
  ];

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
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* Toast Messages */}
      {success && (
        <div className="mb-3 mx-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-3 mx-1 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 px-1">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border ${card.border} shadow-sm px-4 py-3.5 flex items-center justify-between`}
          >
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">
                {card.label}
              </p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full px-1 mb-3">
        {/* Tabs */}
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

      {/* Table Card */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Rider Withdrawal Requests
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
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90 w-12">
                  S.N
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Request ID
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Rider Name
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Mobile
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Amount
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Date
                </th>
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
                {filteredRequests.map((request, idx) => (
                  <tr
                    key={request.requestId || request._id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {request.sNo || idx + 1}
                      </span>
                    </td>

                    {/* Request ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {(request.requestId || request._id || "").slice(-8)}
                      </span>
                    </td>

                    {/* Rider Name */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {request.riderName || "N/A"}
                      </span>
                    </td>

                    {/* Mobile */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {request.riderMobile || "N/A"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                        {formatCurrency(request.requestAmount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={request.status} />
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-gray-500 text-xs">
                      {formatDate(request.requestedAt || request.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View — emerald, same as AllProduct Eye */}
                        <button
                          onClick={() => {
                            const riderId =
                              request.riderId ||
                              request.rider?._id ||
                              request.rider?.riderId;
                            if (riderId) fetchRiderDetails(riderId);
                            else setError("Rider ID not found.");
                          }}
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View Rider Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {request.status === "pending" && (
                          <>
                            {/* Approve — blue, same as AllProduct Edit */}
                            <button
                              onClick={() =>
                                handleApprove(request.requestId || request._id)
                              }
                              disabled={
                                actionLoading ===
                                (request.requestId || request._id)
                              }
                              className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 disabled:opacity-50"
                              title="Approve"
                            >
                              {actionLoading ===
                              (request.requestId || request._id) ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {/* Reject — violet, same as AllProduct QrCode */}
                            <button
                              onClick={() =>
                                handleReject(request.requestId || request._id)
                              }
                              disabled={
                                actionLoading ===
                                (request.requestId || request._id)
                              }
                              className="action-btn bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                              title="Reject"
                            >
                              {actionLoading ===
                              (request.requestId || request._id) ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* ── Rider Details Modal ── */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Rider Application Details
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  Complete verification and review
                </p>
              </div>
              <button
                onClick={() => setSelectedRider(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Section Helper */}
              {[
                {
                  icon: <User className="w-4 h-4 text-[#FF7B1D]" />,
                  title: "Personal Information",
                },
              ].map(() => null)}

              {/* Personal Info */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-100">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#FF7B1D]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Personal Information
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { label: "Full Name", value: selectedRider.fullName },
                    {
                      label: "Date of Birth",
                      value: `${formatDateModal(selectedRider.dateOfBirth)} (${selectedRider.age} yrs)`,
                    },
                    { label: "Blood Group", value: selectedRider.bloodGroup },
                    {
                      label: "Mobile Number",
                      value: `${selectedRider.mobileNumber}${selectedRider.mobileNumberVerified ? " ✓" : ""}`,
                    },
                    { label: "WhatsApp", value: selectedRider.whatsappNumber },
                    {
                      label: "Father's Name",
                      value: selectedRider.fathersName,
                    },
                    {
                      label: "Mother's Name",
                      value: selectedRider.mothersName,
                    },
                    {
                      label: "Languages",
                      value: selectedRider.language?.join(", "),
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                    >
                      <p className="text-xs text-gray-400 font-medium mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.value || "N/A"}
                      </p>
                    </div>
                  ))}
                  <div className="md:col-span-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Current Address
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedRider.currentAddress?.line1},{" "}
                      {selectedRider.currentAddress?.line2}
                      <br />
                      {selectedRider.currentAddress?.city},{" "}
                      {selectedRider.currentAddress?.state} -{" "}
                      {selectedRider.currentAddress?.pinCode}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      Emergency Contact
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedRider.emergencyContactPerson?.name || "N/A"} (
                      {selectedRider.emergencyContactPerson?.relation || "N/A"})
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedRider.emergencyContactPerson?.contactNumber ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Identity Documents */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-100">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#FF7B1D]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Identity Documents
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 mb-4 w-fit">
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    Aadhaar Number
                  </p>
                  <p className="text-sm font-semibold text-gray-800 font-mono">
                    {selectedRider.documents?.aadharCard?.aadharId || "N/A"}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    {
                      url: selectedRider.documents?.profile?.url,
                      label: "Profile Photo",
                      icon: <User className="w-3.5 h-3.5" />,
                    },
                    {
                      url: selectedRider.documents?.aadharCard?.photo?.url,
                      label: "Aadhaar Card",
                      icon: <Shield className="w-3.5 h-3.5" />,
                    },
                    {
                      url: selectedRider.documents?.panCard?.front?.url,
                      label: "PAN Card (Front)",
                      icon: <CreditCard className="w-3.5 h-3.5" />,
                    },
                    {
                      url: selectedRider.documents?.panCard?.back?.url,
                      label: "PAN Card (Back)",
                      icon: <CreditCard className="w-3.5 h-3.5" />,
                    },
                    {
                      url: selectedRider.documents?.drivingLicense?.front?.url,
                      label: "Driving License (Front)",
                      icon: <FileText className="w-3.5 h-3.5" />,
                    },
                    {
                      url: selectedRider.documents?.drivingLicense?.back?.url,
                      label: "Driving License (Back)",
                      icon: <FileText className="w-3.5 h-3.5" />,
                    },
                  ]
                    .filter((d) => d.url)
                    .map((doc, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl border-2 border-gray-100 hover:border-orange-200 transition-colors p-3"
                      >
                        <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5 text-[#FF7B1D]">
                          {doc.icon} {doc.label}
                        </p>
                        <img
                          src={doc.url}
                          alt={doc.label}
                          className="w-full h-44 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-sm"
                          onClick={() => setImageModal(doc.url)}
                        />
                      </div>
                    ))}
                </div>
              </section>

              {/* Bank Details */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-100">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-[#FF7B1D]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Bank Account Details
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  {[
                    {
                      label: "Account Holder",
                      value:
                        selectedRider.documents?.bankDetails?.accountHolderName,
                    },
                    {
                      label: "Account Number",
                      value:
                        selectedRider.documents?.bankDetails?.accountNumber,
                    },
                    {
                      label: "IFSC Code",
                      value: selectedRider.documents?.bankDetails?.ifsc,
                    },
                    {
                      label: "Bank Name",
                      value: selectedRider.documents?.bankDetails?.bankName,
                    },
                    {
                      label: "Branch Name",
                      value: selectedRider.documents?.bankDetails?.branchName,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 ${i === 4 ? "md:col-span-2" : ""}`}
                    >
                      <p className="text-xs text-gray-400 font-medium mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 font-mono">
                        {item.value || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
                {selectedRider.documents?.bankDetails?.cancelCheque?.url && (
                  <div className="bg-white rounded-xl border-2 border-gray-100 hover:border-orange-200 transition-colors p-3">
                    <p className="text-xs font-semibold text-[#FF7B1D] mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Cancelled Cheque
                    </p>
                    <img
                      src={selectedRider.documents.bankDetails.cancelCheque.url}
                      alt="Cancelled Cheque"
                      className="w-full h-44 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-sm"
                      onClick={() =>
                        setImageModal(
                          selectedRider.documents.bankDetails.cancelCheque.url,
                        )
                      }
                    />
                  </div>
                )}
              </section>

              {/* Work Details */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-100">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Car className="w-4 h-4 text-[#FF7B1D]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Work Details
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Vehicle Type",
                      value: selectedRider.workDetails?.vehicleType,
                    },
                    {
                      label: "Experience",
                      value: selectedRider.workDetails?.experience,
                    },
                    {
                      label: "Preferred Shift",
                      value: selectedRider.workDetails?.shift,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                    >
                      <p className="text-xs text-gray-400 font-medium mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.value || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Status Banner */}
              {selectedRider.approvalStatus !== "pending" && (
                <div
                  className={`rounded-xl px-5 py-4 text-sm font-semibold text-center ${getRiderStatusColor(selectedRider.approvalStatus)}`}
                >
                  ✓ Application{" "}
                  {getRiderStatusText(selectedRider.approvalStatus)}
                  {selectedRider.approvedAt && (
                    <span> on {formatDateModal(selectedRider.approvedAt)}</span>
                  )}
                  {selectedRider.approvedBy && (
                    <div className="text-xs mt-1 font-normal">
                      By: {selectedRider.approvedBy.name}
                    </div>
                  )}
                  {selectedRider.rejectionReason && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-left">
                      <p className="text-xs font-semibold text-red-600 mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-800 font-normal">
                        {selectedRider.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModal && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[60]"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-5xl w-full">
            <img
              src={imageModal}
              alt="Document"
              className="max-w-full max-h-[88vh] object-contain mx-auto rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setImageModal(null)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-[#FF7B1D] hover:text-white transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WithdrawalRequests;
