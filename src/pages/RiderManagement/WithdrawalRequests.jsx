// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import api from "../../api/api";
// import {
//   DollarSign,
//   CheckCircle,
//   XCircle,
//   Search,
//   Filter,
//   Calendar,
//   User,
//   AlertCircle,
//   Loader2,
//   X,
// } from "lucide-react";

// const WithdrawalRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [actionLoading, setActionLoading] = useState(null);

//   // Filters
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [riderIdFilter, setRiderIdFilter] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch withdrawal requests
//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = {};
//       if (statusFilter !== "all") {
//         params.status = statusFilter;
//       }
//       if (riderIdFilter) {
//         params.riderId = riderIdFilter;
//       }

//       const response = await api.get("/api/admin/riders/withdrawal-requests", {
//         params,
//       });

//       const result = response.data;

//       if (result.success) {
//         // API returns data as array directly
//         const requestsData = Array.isArray(result.data) ? result.data : [];

//         setRequests(requestsData);
//       } else {
//         setError(result.message || "Failed to fetch withdrawal requests");
//         setRequests([]);
//       }
//     } catch (error) {
//       console.error("Error fetching withdrawal requests:", error);

//       // Check for backend routing issue
//       if (error.response?.status === 500) {
//         const errorData = error.response?.data;
//         if (
//           typeof errorData === "string" &&
//           errorData.includes("Cast to ObjectId failed")
//         ) {
//           setError(
//             "⚠️ Backend routing issue detected. " +
//               "The route '/api/admin/riders/withdrawal-requests' is being matched by '/api/admin/riders/:riderId'. " +
//               "Please ensure the withdrawal-requests route is defined BEFORE the :riderId route in your backend routes file.",
//           );
//         } else {
//           setError(
//             error.response?.data?.message ||
//               "Server error occurred. Please check backend logs.",
//           );
//         }
//       } else {
//         setError(
//           error.response?.data?.message ||
//             "Error fetching withdrawal requests. Please try again.",
//         );
//       }
//       setRequests([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch requests on mount and when filters change
//   useEffect(() => {
//     fetchRequests();
//   }, [statusFilter, riderIdFilter]);

//   // Handle approve request
//   const handleApprove = async (requestId) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to approve this withdrawal request?",
//       )
//     ) {
//       return;
//     }

//     try {
//       setActionLoading(requestId);
//       setError(null);
//       setSuccess(null);

//       const response = await api.put(
//         `/api/admin/riders/withdrawal-requests/${requestId}/approve`,
//       );

//       const result = response.data;

//       if (result.success) {
//         setSuccess("Withdrawal request approved successfully!");
//         fetchRequests();
//         setTimeout(() => setSuccess(null), 3000);
//       } else {
//         setError(result.message || "Failed to approve request");
//       }
//     } catch (error) {
//       console.error("Error approving request:", error);
//       setError(
//         error.response?.data?.message || "Error approving withdrawal request",
//       );
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Handle reject request
//   const handleReject = async (requestId) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to reject this withdrawal request?",
//       )
//     ) {
//       return;
//     }

//     try {
//       setActionLoading(requestId);
//       setError(null);
//       setSuccess(null);

//       const response = await api.put(
//         `/api/admin/riders/withdrawal-requests/${requestId}/reject`,
//       );

//       const result = response.data;

//       if (result.success) {
//         setSuccess("Withdrawal request rejected successfully!");
//         fetchRequests();
//         setTimeout(() => setSuccess(null), 3000);
//       } else {
//         setError(result.message || "Failed to reject request");
//       }
//     } catch (error) {
//       console.error("Error rejecting request:", error);
//       setError(
//         error.response?.data?.message || "Error rejecting withdrawal request",
//       );
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Format currency (amount might already be formatted from API)
//   const formatCurrency = (amount) => {
//     if (!amount) return "₹0";
//     // If already formatted (contains ₹), return as is
//     if (typeof amount === "string" && amount.includes("₹")) {
//       return amount;
//     }
//     // Otherwise format it
//     return `₹${parseFloat(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return "bg-green-100 text-green-800 border-green-300";
//       case "rejected":
//         return "bg-red-100 text-red-800 border-red-300";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-300";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-300";
//     }
//   };

//   // Filter requests by search query
//   const filteredRequests = requests.filter((request) => {
//     if (searchQuery) {
//       const searchLower = searchQuery.toLowerCase();
//       return (
//         request.riderName?.toLowerCase().includes(searchLower) ||
//         request.riderMobile?.toLowerCase().includes(searchLower) ||
//         request.riderId?.toLowerCase().includes(searchLower) ||
//         request.requestId?.toLowerCase().includes(searchLower) ||
//         request.requestAmount?.toLowerCase().includes(searchLower) ||
//         request.description?.toLowerCase().includes(searchLower)
//       );
//     }
//     return true;
//   });

//   // Skeleton Loader
//   const TableSkeleton = () => (
//     <tbody>
//       {Array.from({ length: 8 }).map((_, i) => (
//         <tr
//           key={i}
//           className="border-b border-gray-200 animate-pulse bg-white rounded-sm"
//         >
//           {Array.from({ length: 8 }).map((__, j) => (
//             <td key={j} className="p-3">
//               <div className="h-4 bg-gray-200 rounded w-[80%]" />
//             </td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   );

//   // Empty State
//   const EmptyState = () => (
//     <tbody>
//       <tr>
//         <td
//           colSpan="8"
//           className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
//         >
//           No withdrawal requests found.
//         </td>
//       </tr>
//     </tbody>
//   );

//   return (
//     <DashboardLayout>
//       {/* Success/Error Messages */}
//       {success && (
//         <div className="mb-4 mx-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
//           <CheckCircle size={24} />
//           <span className="font-medium">{success}</span>
//         </div>
//       )}
//       {error && (
//         <div className="mb-4 mx-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
//           <AlertCircle size={24} />
//           <span className="font-medium">{error}</span>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-0 mb-2">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Rider Withdrawal Requests
//           </h1>
//           <p className="text-sm text-gray-600 mt-1">
//             Manage rider withdrawal requests
//           </p>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="flex flex-col lg:flex-row lg:items-center gap-3 pl-4 max-w-[99%] mx-auto mb-4">
//         {/* Status Filter */}
//         <div className="flex gap-2 items-center overflow-x-auto pb-2 lg:pb-0">
//           {["all", "pending", "approved", "rejected"].map((status) => (
//             <button
//               key={status}
//               onClick={() => setStatusFilter(status)}
//               className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap transition-colors ${
//                 statusFilter === status
//                   ? "bg-[#FF7B1D] text-white border-orange-500"
//                   : "border-gray-400 text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               {status === "all"
//                 ? "All"
//                 : status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* Rider ID Filter */}
//         <div className="flex items-center gap-2">
//           <Filter size={18} className="text-gray-600" />
//           <input
//             type="text"
//             placeholder="Filter by Rider ID"
//             value={riderIdFilter}
//             onChange={(e) => setRiderIdFilter(e.target.value)}
//             className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//           />
//         </div>

//         {/* Search */}
//         <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[400px]">
//           <input
//             type="text"
//             placeholder="Search by Rider Name, Mobile, ID..."
//             className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full transition-colors">
//             <Search size={18} />
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pl-4 max-w-[99%] mx-auto">
//         <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Requests</p>
//               <p className="text-2xl font-bold text-gray-800 mt-1">
//                 {requests.length}
//               </p>
//             </div>
//             <DollarSign className="text-orange-500" size={32} />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Pending</p>
//               <p className="text-2xl font-bold text-yellow-600 mt-1">
//                 {requests.filter((r) => r.status === "pending").length}
//               </p>
//             </div>
//             <AlertCircle className="text-yellow-500" size={32} />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Approved</p>
//               <p className="text-2xl font-bold text-green-600 mt-1">
//                 {requests.filter((r) => r.status === "approved").length}
//               </p>
//             </div>
//             <CheckCircle className="text-green-500" size={32} />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Rejected</p>
//               <p className="text-2xl font-bold text-red-600 mt-1">
//                 {requests.filter((r) => r.status === "rejected").length}
//               </p>
//             </div>
//             <XCircle className="text-red-500" size={32} />
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-[#FF7B1D] text-black">
//               <th className="p-3 text-left">S.N</th>
//               <th className="p-3 text-left">Request ID</th>
//               <th className="p-3 text-left">Rider Name</th>
//               <th className="p-3 text-left">Rider Mobile</th>
//               <th className="p-3 text-left">Request Amount</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Request Date</th>
//               <th className="p-3 pr-6 text-right">Action</th>
//             </tr>
//           </thead>

//           {loading ? (
//             <TableSkeleton />
//           ) : filteredRequests.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <tbody>
//               {filteredRequests.map((request, idx) => (
//                 <tr
//                   key={request.requestId || request._id}
//                   className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
//                 >
//                   <td className="p-3">{request.sNo || idx + 1}</td>
//                   <td className="p-3 font-mono text-xs">
//                     {request.requestId?.slice(-8) ||
//                       request._id?.slice(-8) ||
//                       "N/A"}
//                   </td>
//                   <td className="p-3 font-medium">
//                     {request.riderName || "N/A"}
//                   </td>
//                   <td className="p-3">{request.riderMobile || "N/A"}</td>
//                   <td className="p-3 font-semibold text-green-600">
//                     {formatCurrency(request.requestAmount)}
//                   </td>
//                   <td className="p-3">
//                     <span
//                       className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
//                         request.status,
//                       )}`}
//                     >
//                       {request.status
//                         ? request.status.charAt(0).toUpperCase() +
//                           request.status.slice(1)
//                         : "Pending"}
//                     </span>
//                   </td>
//                   <td className="p-3 text-gray-600">
//                     {formatDate(request.requestedAt || request.createdAt)}
//                   </td>
//                   <td className="p-3 text-right">
//                     <div className="flex justify-end gap-2">
//                       {request.status === "pending" && (
//                         <>
//                           <button
//                             onClick={() =>
//                               handleApprove(request.requestId || request._id)
//                             }
//                             disabled={
//                               actionLoading ===
//                               (request.requestId || request._id)
//                             }
//                             className="px-3 py-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors flex items-center gap-1 disabled:opacity-50"
//                             title="Approve"
//                           >
//                             {actionLoading ===
//                             (request.requestId || request._id) ? (
//                               <Loader2 size={14} className="animate-spin" />
//                             ) : (
//                               <CheckCircle size={14} />
//                             )}
//                             Approve
//                           </button>
//                           <button
//                             onClick={() =>
//                               handleReject(request.requestId || request._id)
//                             }
//                             disabled={
//                               actionLoading ===
//                               (request.requestId || request._id)
//                             }
//                             className="px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex items-center gap-1 disabled:opacity-50"
//                             title="Reject"
//                           >
//                             {actionLoading ===
//                             (request.requestId || request._id) ? (
//                               <Loader2 size={14} className="animate-spin" />
//                             ) : (
//                               <XCircle size={14} />
//                             )}
//                             Reject
//                           </button>
//                         </>
//                       )}
//                       {request.status !== "pending" && (
//                         <span className="text-gray-400 text-xs">
//                           {request.status === "approved"
//                             ? "Approved"
//                             : "Rejected"}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           )}
//         </table>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default WithdrawalRequests;
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/api";
import { BASE_URL } from "../../api/api";
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
  X,
  Eye,
  FileText,
  Car,
  CreditCard,
  MapPin,
  Phone,
  Shield,
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

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [riderIdFilter, setRiderIdFilter] = useState("");
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
      if (riderIdFilter) {
        params.riderId = riderIdFilter;
      }

      const response = await api.get("/api/admin/riders/withdrawal-requests", {
        params,
      });

      const result = response.data;

      if (result.success) {
        // API returns data as array directly
        const requestsData = Array.isArray(result.data) ? result.data : [];

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
        if (
          typeof errorData === "string" &&
          errorData.includes("Cast to ObjectId failed")
        ) {
          setError(
            "⚠️ Backend routing issue detected. " +
              "The route '/api/admin/riders/withdrawal-requests' is being matched by '/api/admin/riders/:riderId'. " +
              "Please ensure the withdrawal-requests route is defined BEFORE the :riderId route in your backend routes file.",
          );
        } else {
          setError(
            error.response?.data?.message ||
              "Server error occurred. Please check backend logs.",
          );
        }
      } else {
        setError(
          error.response?.data?.message ||
            "Error fetching withdrawal requests. Please try again.",
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
  }, [statusFilter, riderIdFilter]);

  // Handle approve request
  const handleApprove = async (requestId) => {
    if (
      !window.confirm(
        "Are you sure you want to approve this withdrawal request?",
      )
    ) {
      return;
    }

    try {
      setActionLoading(requestId);
      setError(null);
      setSuccess(null);

      const response = await api.put(
        `/api/admin/riders/withdrawal-requests/${requestId}/approve`,
      );

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
        error.response?.data?.message || "Error approving withdrawal request",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reject request
  const handleReject = async (requestId) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this withdrawal request?",
      )
    ) {
      return;
    }

    try {
      setActionLoading(requestId);
      setError(null);
      setSuccess(null);

      const response = await api.put(
        `/api/admin/riders/withdrawal-requests/${requestId}/reject`,
      );

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
        error.response?.data?.message || "Error rejecting withdrawal request",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Get authorization headers
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch rider details
  const fetchRiderDetails = async (riderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${riderId}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError(result.message || "Failed to fetch rider details");
        }
        return;
      }

      if (result.success) {
        setSelectedRider(result.data);
      } else {
        setError("Failed to fetch rider details");
      }
    } catch (err) {
      setError("Error fetching rider details: " + err.message);
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

  // Format date for modal (without time)
  const formatDateModal = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  // Get status color for rider modal
  const getRiderStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border border-green-200";
      case "rejected":
      case "suspended":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  // Get status text for rider modal
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

  // Format currency (amount might already be formatted from API)
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    // If already formatted (contains ₹), return as is
    if (typeof amount === "string" && amount.includes("₹")) {
      return amount;
    }
    // Otherwise format it
    return `₹${parseFloat(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
      return (
        request.riderName?.toLowerCase().includes(searchLower) ||
        request.riderMobile?.toLowerCase().includes(searchLower) ||
        request.riderId?.toLowerCase().includes(searchLower) ||
        request.requestId?.toLowerCase().includes(searchLower) ||
        request.requestAmount?.toLowerCase().includes(searchLower) ||
        request.description?.toLowerCase().includes(searchLower)
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
          {Array.from({ length: 8 }).map((__, j) => (
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
          colSpan="8"
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
            Rider Withdrawal Requests
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage rider withdrawal requests
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

        {/* Rider ID Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <input
            type="text"
            placeholder="Filter by Rider ID"
            value={riderIdFilter}
            onChange={(e) => setRiderIdFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Search */}
        <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[400px]">
          <input
            type="text"
            placeholder="Search by Rider Name, Mobile, ID..."
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
              <th className="p-3 text-left">Rider Name</th>
              <th className="p-3 text-left">Rider Mobile</th>
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
              {filteredRequests.map((request, idx) => (
                <tr
                  key={request.requestId || request._id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">{request.sNo || idx + 1}</td>
                  <td className="p-3 font-mono text-xs">
                    {request.requestId?.slice(-8) ||
                      request._id?.slice(-8) ||
                      "N/A"}
                  </td>
                  <td className="p-3 font-medium">
                    {request.riderName || "N/A"}
                  </td>
                  <td className="p-3">{request.riderMobile || "N/A"}</td>
                  <td className="p-3 font-semibold text-green-600">
                    {formatCurrency(request.requestAmount)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        request.status,
                      )}`}
                    >
                      {request.status
                        ? request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)
                        : "Pending"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {formatDate(request.requestedAt || request.createdAt)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      {/* Eye Icon - Clickable to view rider details */}
                      <button
                        onClick={() => {
                          // Get rider ID from request
                          const riderId = request.riderId || request.rider?._id || request.rider?.riderId;
                          
                          if (riderId) {
                            fetchRiderDetails(riderId);
                          } else {
                            console.error("Rider ID not found in request:", request);
                            setError("Rider ID not found. Cannot fetch rider details.");
                          }
                        }}
                        className="text-[#FF7B1D] p-1 hover:text-orange-600 transition-colors cursor-pointer"
                        title="View Rider Details"
                      >
                        <Eye size={20} />
                      </button>

                      {/* Approve/Reject buttons - Only for pending requests */}
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleApprove(request.requestId || request._id)
                            }
                            disabled={
                              actionLoading ===
                              (request.requestId || request._id)
                            }
                            className="px-3 py-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                            title="Approve"
                          >
                            {actionLoading ===
                            (request.requestId || request._id) ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleReject(request.requestId || request._id)
                            }
                            disabled={
                              actionLoading ===
                              (request.requestId || request._id)
                            }
                            className="px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                            title="Reject"
                          >
                            {actionLoading ===
                            (request.requestId || request._id) ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Reject
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

      {/* Rider Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-sm max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#FF7B1D] to-[#FF9B4D] text-white p-6 flex justify-between items-center rounded-t-2xl shadow-lg z-10">
              <div>
                <h2 className="text-3xl font-bold">
                  Rider Application Details
                </h2>
                <p className="text-white text-opacity-90 mt-1">
                  Complete verification and review
                </p>
              </div>
              <button
                onClick={() => setSelectedRider(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center text-3xl transition"
              >
                ×
              </button>
            </div>

            <div className="p-8">
              {/* Personal Information */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
                  <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                    <User className="text-[#FF7B1D]" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Personal Information
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Full Name
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.fullName}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Date of Birth (Age)
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {formatDateModal(selectedRider.dateOfBirth)} (
                      {selectedRider.age} years)
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Blood Group
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.bloodGroup || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                      <Phone size={16} />
                      Mobile Number
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.mobileNumber}
                      {selectedRider.mobileNumberVerified && (
                        <span className="ml-2 text-green-600 text-xs">
                          ✓ Verified
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                      <Phone size={16} />
                      WhatsApp Number
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.whatsappNumber || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Father's Name
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.fathersName || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Mother's Name
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.mothersName || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Emergency Contact
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.emergencyContactPerson?.name || "N/A"} (
                      {selectedRider.emergencyContactPerson?.relation ||
                        "N/A"}
                      )
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedRider.emergencyContactPerson?.contactNumber ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                      <MapPin size={16} />
                      Current Address
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.currentAddress?.line1},{" "}
                      {selectedRider.currentAddress?.line2}
                      <br />
                      {selectedRider.currentAddress?.city},{" "}
                      {selectedRider.currentAddress?.state} -{" "}
                      {selectedRider.currentAddress?.pinCode}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Languages
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.language?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Identity Documents */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
                  <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                    <FileText className="text-[#FF7B1D]" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Identity Documents
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Aadhaar Number
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.documents?.aadharCard?.aadharId || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Document Images */}
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedRider.documents?.profile?.url && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <User size={16} />
                        Profile Photo
                      </p>
                      <img
                        src={selectedRider.documents.profile.url}
                        alt="Profile"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(selectedRider.documents.profile.url)
                        }
                      />
                    </div>
                  )}
                  {selectedRider.documents?.aadharCard?.photo?.url && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <Shield size={16} />
                        Aadhaar Card
                      </p>
                      <img
                        src={selectedRider.documents.aadharCard.photo.url}
                        alt="Aadhaar"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(
                            selectedRider.documents.aadharCard.photo.url,
                          )
                        }
                      />
                    </div>
                  )}
                  {selectedRider.documents?.panCard?.front?.url && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <CreditCard size={16} />
                        PAN Card (Front)
                      </p>
                      <img
                        src={selectedRider.documents.panCard.front.url}
                        alt="PAN Front"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(
                            selectedRider.documents.panCard.front.url,
                          )
                        }
                      />
                    </div>
                  )}
                  {selectedRider.documents?.panCard?.back?.url && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <CreditCard size={16} />
                        PAN Card (Back)
                      </p>
                      <img
                        src={selectedRider.documents.panCard.back.url}
                        alt="PAN Back"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(
                            selectedRider.documents.panCard.back.url,
                          )
                        }
                      />
                    </div>
                  )}
                  {selectedRider.documents?.drivingLicense?.front?.url && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <FileText size={16} />
                        Driving License (Front)
                      </p>
                      <img
                        src={selectedRider.documents.drivingLicense.front.url}
                        alt="DL Front"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(
                            selectedRider.documents.drivingLicense.front.url,
                          )
                        }
                      />
                    </div>
                  )}
                  {selectedRider.documents?.drivingLicense?.back?.url && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <FileText size={16} />
                        Driving License (Back)
                      </p>
                      <img
                        src={selectedRider.documents.drivingLicense.back.url}
                        alt="DL Back"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(
                            selectedRider.documents.drivingLicense.back.url,
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
                  <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                    <CreditCard className="text-[#FF7B1D]" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Bank Account Details
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Account Holder Name
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.documents?.bankDetails
                        ?.accountHolderName || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Account Number
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.documents?.bankDetails?.accountNumber ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      IFSC Code
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.documents?.bankDetails?.ifsc || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Bank Name
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.documents?.bankDetails?.bankName ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Branch Name
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedRider.documents?.bankDetails?.branchName ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                {selectedRider.documents?.bankDetails?.cancelCheque?.url && (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                    <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                      <FileText size={16} />
                      Cancelled Cheque
                    </p>
                    <img
                      src={
                        selectedRider.documents.bankDetails.cancelCheque.url
                      }
                      alt="Cancelled Cheque"
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                      onClick={() =>
                        setImageModal(
                          selectedRider.documents.bankDetails.cancelCheque
                            .url,
                        )
                      }
                    />
                  </div>
                )}
              </div>

              {/* Work Details */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
                  <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                    <Car className="text-[#FF7B1D]" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Work Details
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Vehicle Type
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.workDetails?.vehicleType || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Experience
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.workDetails?.experience || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 font-semibold mb-1">
                      Preferred Shift
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {selectedRider.workDetails?.shift || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Display */}
              {selectedRider.approvalStatus !== "pending" && (
                <div className="pt-6 border-t-2 border-gray-200">
                  <div
                    className={`text-center py-4 rounded-xl font-semibold text-lg ${getRiderStatusColor(
                      selectedRider.approvalStatus,
                    )}`}
                  >
                    ✓ Application{" "}
                    {getRiderStatusText(selectedRider.approvalStatus)}
                    {selectedRider.approvedAt && (
                      <span> on {formatDateModal(selectedRider.approvedAt)}</span>
                    )}
                    {selectedRider.approvedBy && (
                      <div className="text-sm mt-2">
                        By: {selectedRider.approvedBy.name}
                      </div>
                    )}
                  </div>
                  {selectedRider.rejectionReason && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-700 font-semibold mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-red-900">
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
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-6xl w-full">
            <img
              src={imageModal}
              alt="Document"
              className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setImageModal(null)}
              className="absolute -top-4 -right-4 bg-white text-gray-900 rounded-full w-12 h-12 flex items-center justify-center text-3xl hover:bg-[#FF7B1D] hover:text-white transition shadow-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WithdrawalRequests;
