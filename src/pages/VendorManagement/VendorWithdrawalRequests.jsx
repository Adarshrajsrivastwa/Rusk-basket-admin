import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/api";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  User,
  AlertCircle,
  Loader2,
  Store,
} from "lucide-react";

const AdminVendorWithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorIdFilter, setVendorIdFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch withdrawal requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (vendorIdFilter) {
        params.vendorId = vendorIdFilter;
      }

      console.log("========================================");
      console.log("📥 FETCHING VENDOR WITHDRAWAL REQUESTS:");
      console.log("API Endpoint: /api/admin/vendors/withdrawal-requests");
      console.log("Params:", params);
      console.log("========================================");

      const response = await api.get(
        "/api/admin/vendors/withdrawal-requests",
        { params }
      );

      console.log("========================================");
      console.log("✅ RESPONSE RECEIVED:");
      console.log("Status:", response.status);
      console.log("Full response:", response.data);
      console.log("========================================");

      const result = response.data;

      if (result.success) {
        const requestsData = result.data || [];
        console.log("========================================");
        console.log("📋 REQUESTS DATA:");
        console.log("Total requests:", requestsData.length);
        if (requestsData.length > 0) {
          console.log("First request structure:", requestsData[0]);
          console.log("First request keys:", Object.keys(requestsData[0]));
          console.log("First request _id:", requestsData[0]._id);
          console.log("First request requestId:", requestsData[0].requestId);
        }
        console.log("========================================");
        setRequests(requestsData);
      } else {
        setError(result.message || "Failed to fetch withdrawal requests");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      
      // Check for backend routing issue
      if (error.response?.status === 500) {
        const errorData = error.response?.data;
        if (typeof errorData === 'string' && errorData.includes('Cast to ObjectId failed')) {
          setError(
            "⚠️ Backend routing issue detected. " +
            "The route '/api/admin/vendors/withdrawal-requests' is being matched by '/api/admin/vendors/:vendorId'. " +
            "Please ensure the withdrawal-requests route is defined BEFORE the :vendorId route in your backend routes file."
          );
        } else {
          setError(
            error.response?.data?.message ||
            "Server error occurred. Please check backend logs."
          );
        }
      } else {
        setError(
          error.response?.data?.message ||
          "Error fetching withdrawal requests. Please try again."
        );
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests on mount and when filters change
  useEffect(() => {
    fetchRequests();
  }, [statusFilter, vendorIdFilter]);

  // Handle approve request
  const handleApprove = async (requestId) => {
    // Validate requestId
    if (!requestId || requestId === "undefined") {
      console.error("Invalid requestId:", requestId);
      setError("Invalid request ID. Please refresh the page and try again.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to approve this withdrawal request?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(requestId);
      setError(null);
      setSuccess(null);

      console.log("========================================");
      console.log("✅ APPROVING WITHDRAWAL REQUEST:");
      console.log("Request ID:", requestId);
      console.log("API Endpoint: /api/admin/vendors/withdrawal-requests/" + requestId + "/approve");
      console.log("Method: PUT");
      console.log("========================================");

      const response = await api.put(
        `/api/admin/vendors/withdrawal-requests/${requestId}/approve`
      );

      console.log("========================================");
      console.log("✅ APPROVE RESPONSE:");
      console.log("Status:", response.status);
      console.log("Response:", response.data);
      console.log("========================================");

      const result = response.data;

      if (result.success) {
        setSuccess("Withdrawal request approved successfully!");
        fetchRequests();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      setError(
        error.response?.data?.message || "Error approving withdrawal request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reject request
  const handleReject = async (requestId) => {
    // Validate requestId
    if (!requestId || requestId === "undefined") {
      console.error("Invalid requestId:", requestId);
      setError("Invalid request ID. Please refresh the page and try again.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to reject this withdrawal request?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(requestId);
      setError(null);
      setSuccess(null);

      console.log("========================================");
      console.log("❌ REJECTING WITHDRAWAL REQUEST:");
      console.log("Request ID:", requestId);
      console.log("API Endpoint: /api/admin/vendors/withdrawal-requests/" + requestId + "/reject");
      console.log("Method: PUT");
      console.log("========================================");

      const response = await api.put(
        `/api/admin/vendors/withdrawal-requests/${requestId}/reject`
      );

      console.log("========================================");
      console.log("❌ REJECT RESPONSE:");
      console.log("Status:", response.status);
      console.log("Response:", response.data);
      console.log("========================================");

      const result = response.data;

      if (result.success) {
        setSuccess("Withdrawal request rejected successfully!");
        fetchRequests();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      setError(
        error.response?.data?.message || "Error rejecting withdrawal request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString("en-IN")}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Filter requests by search query
  const filteredRequests = requests.filter((request) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const requestId = request._id || request.requestId;
      return (
        request.vendor?.storeName?.toLowerCase().includes(searchLower) ||
        request.vendor?.vendorName?.toLowerCase().includes(searchLower) ||
        request.vendor?.mobile?.toLowerCase().includes(searchLower) ||
        request.vendor?.contactNumber?.toLowerCase().includes(searchLower) ||
        request.vendor?._id?.toLowerCase().includes(searchLower) ||
        request.vendor?.vendorId?.toLowerCase().includes(searchLower) ||
        requestId?.toLowerCase().includes(searchLower) ||
        request.amount?.toString().includes(searchLower)
      );
    }
    return true;
  });

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr
          key={i}
          className="border-b border-gray-200 animate-pulse bg-white rounded-sm"
        >
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="p-3">
              <div className="h-4 bg-gray-200 rounded w-[80%]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Empty State
  const EmptyState = () => (
    <tbody>
      <tr>
        <td
          colSpan="7"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No withdrawal requests found.
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 mx-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
          <CheckCircle size={24} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 mx-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
          <AlertCircle size={24} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Vendor Withdrawal Requests
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage vendor withdrawal requests
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 pl-4 max-w-[99%] mx-auto mb-4">
        {/* Status Filter */}
        <div className="flex gap-2 items-center overflow-x-auto pb-2 lg:pb-0">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-[#FF7B1D] text-white border-orange-500"
                  : "border-gray-400 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Vendor ID Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <input
            type="text"
            placeholder="Filter by Vendor ID"
            value={vendorIdFilter}
            onChange={(e) => setVendorIdFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Search */}
        <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[400px]">
          <input
            type="text"
            placeholder="Search by Vendor Name, Store, Mobile, ID..."
            className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pl-4 max-w-[99%] mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {requests.length}
              </p>
            </div>
            <DollarSign className="text-orange-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <AlertCircle className="text-yellow-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {requests.filter((r) => r.status === "approved").length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {requests.filter((r) => r.status === "rejected").length}
              </p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Request ID</th>
              <th className="p-3 text-left">Vendor Name</th>
              <th className="p-3 text-left">Store Name</th>
              <th className="p-3 text-left">Vendor Mobile</th>
              <th className="p-3 text-left">Request Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Request Date</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredRequests.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {filteredRequests.map((request, idx) => {
                // Use requestId if _id is not available (API returns requestId)
                const requestId = request._id || request.requestId;
                
                // Ensure request has valid ID
                if (!requestId) {
                  console.warn("Request missing both _id and requestId:", request);
                  return null;
                }
                
                return (
                <tr
                  key={requestId || `request-${idx}`}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-mono text-xs">
                    {requestId?.slice(-8) || "N/A"}
                  </td>
                  <td className="p-3 font-medium">
                    {request.vendor?.vendorName || "N/A"}
                  </td>
                  <td className="p-3">{request.vendor?.storeName || "N/A"}</td>
                  <td className="p-3">{request.vendor?.mobile || request.vendor?.contactNumber || "N/A"}</td>
                  <td className="p-3 font-semibold text-green-600">
                    {formatCurrency(request.amount)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status
                        ? request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)
                        : "Pending"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      {request.status === "pending" && requestId && (
                        <>
                          <button
                            onClick={() => {
                              if (requestId) {
                                handleApprove(requestId);
                              } else {
                                console.error("Cannot approve: requestId is undefined", request);
                                setError("Invalid request ID. Please refresh the page.");
                              }
                            }}
                            disabled={actionLoading === requestId || !requestId}
                            className="px-3 py-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                            title="Approve"
                          >
                            {actionLoading === requestId ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              if (requestId) {
                                handleReject(requestId);
                              } else {
                                console.error("Cannot reject: requestId is undefined", request);
                                setError("Invalid request ID. Please refresh the page.");
                              }
                            }}
                            disabled={actionLoading === requestId || !requestId}
                            className="px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                            title="Reject"
                          >
                            {actionLoading === requestId ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Reject
                          </button>
                        </>
                      )}
                      {request.status !== "pending" && (
                        <span className="text-gray-400 text-xs">
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
    </DashboardLayout>
  );
};

export default AdminVendorWithdrawalRequests;
