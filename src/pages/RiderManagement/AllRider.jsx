// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import {
//   CheckCircle,
//   XCircle,
//   Eye,
//   User,
//   FileText,
//   Car,
//   CreditCard,
//   Calendar,
//   MapPin,
//   Phone,
//   Mail,
//   Award,
//   Clock,
//   Shield,
//   Download,
//   AlertCircle,
//   CheckSquare,
//   Loader2,
// } from "lucide-react";

// const API_BASE_URL = "http://46.202.164.93/api/rider";

// const RiderManagement = () => {
//   const [riders, setRiders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedRider, setSelectedRider] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [imageModal, setImageModal] = useState(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   // Get authorization headers
//   const getAuthHeaders = () => {
//     const token =
//       localStorage.getItem("token") || localStorage.getItem("authToken");
//     const headers = {
//       "Content-Type": "application/json",
//     };
//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }
//     return headers;
//   };

//   // Fetch all riders on component mount
//   useEffect(() => {
//     fetchRiders();
//   }, []);

//   const fetchRiders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(API_BASE_URL, {
//         method: "GET",
//         credentials: "include",
//         headers: getAuthHeaders(),
//       });
//       const result = await response.json();

//       if (!response.ok) {
//         if (response.status === 401) {
//           setError("Unauthorized. Please login again.");
//         } else {
//           setError(result.message || "Failed to fetch riders");
//         }
//         return;
//       }

//       if (result.success) {
//         setRiders(result.data);
//       } else {
//         setError("Failed to fetch riders");
//       }
//     } catch (err) {
//       setError("Error connecting to server: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRiderDetails = async (riderId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/${riderId}`, {
//         method: "GET",
//         credentials: "include",
//         headers: getAuthHeaders(),
//       });
//       const result = await response.json();

//       if (!response.ok) {
//         if (response.status === 401) {
//           alert("Unauthorized. Please login again.");
//         } else {
//           alert(result.message || "Failed to fetch rider details");
//         }
//         return;
//       }

//       if (result.success) {
//         setSelectedRider(result.data);
//       } else {
//         alert("Failed to fetch rider details");
//       }
//     } catch (err) {
//       alert("Error fetching rider details: " + err.message);
//     }
//   };

//   const handleAction = async (riderId, action) => {
//     try {
//       setActionLoading(true);
//       const endpoint = action === "approved" ? "approve" : "suspend";

//       const response = await fetch(`${API_BASE_URL}/${riderId}/${endpoint}`, {
//         method: "PUT",
//         credentials: "include",
//         headers: getAuthHeaders(),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         if (response.status === 401) {
//           alert("Unauthorized. Please login again.");
//         } else {
//           alert(result.message || "Action failed");
//         }
//         return;
//       }

//       if (result.success) {
//         alert(
//           `Rider ${
//             action === "approved" ? "Approved" : "Suspended"
//           } Successfully!`
//         );
//         setSelectedRider(null);
//         fetchRiders(); // Refresh the list
//       } else {
//         alert(result.message || "Action failed");
//       }
//     } catch (err) {
//       alert("Error performing action: " + err.message);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const filteredRiders = riders.filter((rider) => {
//     if (filter === "all") return true;
//     if (filter === "pending") return rider.approvalStatus === "pending";
//     if (filter === "approved") return rider.approvalStatus === "approved";
//     if (filter === "rejected")
//       return (
//         rider.approvalStatus === "rejected" ||
//         rider.approvalStatus === "suspended"
//       );
//     return true;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-50 text-green-700 border border-green-200";
//       case "rejected":
//       case "suspended":
//         return "bg-red-50 text-red-700 border border-red-200";
//       default:
//         return "bg-amber-50 text-amber-700 border border-amber-200";
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "approved":
//         return "Approved";
//       case "rejected":
//         return "Rejected";
//       case "suspended":
//         return "Suspended";
//       default:
//         return "Pending Review";
//     }
//   };

//   const stats = {
//     total: riders.length,
//     pending: riders.filter((r) => r.approvalStatus === "pending").length,
//     approved: riders.filter((r) => r.approvalStatus === "approved").length,
//     rejected: riders.filter(
//       (r) => r.approvalStatus === "rejected" || r.approvalStatus === "suspended"
//     ).length,
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-IN");
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="min-h-screen ml-6 p-0 flex items-center justify-center">
//           <div className="text-center">
//             <Loader2
//               className="animate-spin text-[#FF7B1D] mx-auto mb-4"
//               size={48}
//             />
//             <p className="text-gray-600 text-lg">Loading riders...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="min-h-screen ml-6 p-0 flex items-center justify-center">
//           <div className="text-center bg-white rounded-lg shadow-lg p-8">
//             <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
//             <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
//             <button
//               onClick={fetchRiders}
//               className="px-6 py-3 bg-[#FF7B1D] text-white rounded-lg hover:bg-[#FF9B4D] transition"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen ml-6 p-0">
//         <div className="max-w-7xl mx-auto">
//           {/* Header Section */}
//           <div className="bg-white rounded-sm shadow-lg p-8 mb-6 border-l-4 border-[#FF7B1D]">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                   Rider Management System
//                 </h1>
//                 <p className="text-gray-600 text-lg">
//                   Review, verify and manage rider applications efficiently
//                 </p>
//               </div>
//               <div className="hidden md:block">
//                 <div className="bg-gradient-to-br from-[#FF7B1D] to-[#FF9B4D] text-white p-6 rounded-xl shadow-lg">
//                   <div className="text-center">
//                     <p className="text-sm opacity-90">Total Applications</p>
//                     <p className="text-4xl font-bold">{stats.total}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Statistics Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-[#FF7B1D] hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium mb-1">
//                     Total Applications
//                   </p>
//                   <p className="text-3xl font-bold text-gray-900">
//                     {stats.total}
//                   </p>
//                 </div>
//                 <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
//                   <User className="text-[#FF7B1D]" size={24} />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-amber-500 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium mb-1">
//                     Pending Review
//                   </p>
//                   <p className="text-3xl font-bold text-gray-900">
//                     {stats.pending}
//                   </p>
//                 </div>
//                 <div className="bg-amber-100 p-3 rounded-lg">
//                   <Clock className="text-amber-600" size={24} />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium mb-1">
//                     Approved
//                   </p>
//                   <p className="text-3xl font-bold text-gray-900">
//                     {stats.approved}
//                   </p>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-lg">
//                   <CheckCircle className="text-green-600" size={24} />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-red-500 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium mb-1">
//                     Rejected/Suspended
//                   </p>
//                   <p className="text-3xl font-bold text-gray-900">
//                     {stats.rejected}
//                   </p>
//                 </div>
//                 <div className="bg-red-100 p-3 rounded-lg">
//                   <XCircle className="text-red-600" size={24} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filter Tabs */}
//           <div className="bg-white rounded-sm shadow-md p-4 mb-6">
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => setFilter("all")}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                   filter === "all"
//                     ? "bg-[#FF7B1D] text-white shadow-lg scale-105"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 All Applications ({stats.total})
//               </button>
//               <button
//                 onClick={() => setFilter("pending")}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                   filter === "pending"
//                     ? "bg-amber-500 text-white shadow-lg scale-105"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Pending ({stats.pending})
//               </button>
//               <button
//                 onClick={() => setFilter("approved")}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                   filter === "approved"
//                     ? "bg-green-600 text-white shadow-lg scale-105"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Approved ({stats.approved})
//               </button>
//               <button
//                 onClick={() => setFilter("rejected")}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                   filter === "rejected"
//                     ? "bg-red-600 text-white shadow-lg scale-105"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Rejected ({stats.rejected})
//               </button>
//             </div>
//           </div>

//           {/* Riders List */}
//           <div className="grid gap-4">
//             {filteredRiders.map((rider) => (
//               <div
//                 key={rider._id}
//                 className="bg-white rounded-sm shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 border-[#FF7B1D]"
//               >
//                 <div className="p-6">
//                   <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
//                     <div className="flex-1 w-full">
//                       <div className="flex items-center gap-3 mb-4">
//                         <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-full">
//                           <User className="text-[#FF7B1D]" size={24} />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 flex-wrap">
//                             <h3 className="text-2xl font-bold text-gray-900">
//                               {rider.fullName}
//                             </h3>
//                             <span
//                               className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
//                                 rider.approvalStatus
//                               )}`}
//                             >
//                               {getStatusText(rider.approvalStatus)}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
//                             <div className="flex items-center gap-1">
//                               <Phone size={16} />
//                               <span>{rider.mobileNumber}</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <MapPin size={16} />
//                               <span>{rider.city || "N/A"}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
//                         <div>
//                           <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
//                             <Calendar size={14} />
//                             Applied Date
//                           </p>
//                           <p className="text-gray-900 font-medium">
//                             {formatDate(rider.createdAt)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
//                             <User size={14} />
//                             Age
//                           </p>
//                           <p className="text-gray-900 font-medium">
//                             {rider.age || "N/A"} Years
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500 font-semibold mb-1">
//                             Blood Group
//                           </p>
//                           <p className="text-gray-900 font-medium">
//                             {rider.bloodGroup || "N/A"}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
//                             <Car size={14} />
//                             Vehicle Type
//                           </p>
//                           <p className="text-gray-900 font-medium">
//                             {rider.workDetails?.vehicleType || "N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       {rider.approvalStatus === "approved" && (
//                         <div className="mt-4 flex gap-4 text-sm">
//                           <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
//                             <span className="text-green-700 font-semibold">
//                               Approved on: {formatDate(rider.approvedAt)}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <button
//                       onClick={() => fetchRiderDetails(rider._id)}
//                       className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-[#FF7B1D] to-[#FF9B4D] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
//                     >
//                       <Eye size={20} />
//                       View Full Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredRiders.length === 0 && (
//             <div className="bg-white rounded-sm shadow-md p-16 text-center">
//               <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
//               <p className="text-gray-500 text-xl font-medium">
//                 No riders found in this category
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Detailed View Modal */}
//         {selectedRider && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
//             <div className="bg-white rounded-sm max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//               {/* Modal Header */}
//               <div className="sticky top-0 bg-gradient-to-r from-[#FF7B1D] to-[#FF9B4D] text-white p-6 flex justify-between items-center rounded-t-2xl shadow-lg z-10">
//                 <div>
//                   <h2 className="text-3xl font-bold">
//                     Rider Application Details
//                   </h2>
//                   <p className="text-white text-opacity-90 mt-1">
//                     Complete verification and review
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedRider(null)}
//                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center text-3xl transition"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="p-8">
//                 {/* Personal Information */}
//                 <div className="mb-8">
//                   <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
//                     <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
//                       <User className="text-[#FF7B1D]" size={24} />
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Personal Information
//                     </h3>
//                   </div>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Full Name
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.fullName}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Date of Birth (Age)
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {formatDate(selectedRider.dateOfBirth)} (
//                         {selectedRider.age} years)
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Blood Group
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.bloodGroup || "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
//                         <Phone size={16} />
//                         Mobile Number
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.mobileNumber}
//                         {selectedRider.mobileNumberVerified && (
//                           <span className="ml-2 text-green-600 text-xs">
//                             ✓ Verified
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
//                         <Phone size={16} />
//                         WhatsApp Number
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.whatsappNumber || "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Father's Name
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.fathersName || "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Mother's Name
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.mothersName || "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Emergency Contact
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.emergencyContactPerson?.name || "N/A"} (
//                         {selectedRider.emergencyContactPerson?.relation ||
//                           "N/A"}
//                         )
//                       </p>
//                       <p className="text-gray-600 text-sm mt-1">
//                         {selectedRider.emergencyContactPerson?.contactNumber ||
//                           "N/A"}
//                       </p>
//                     </div>
//                     <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
//                         <MapPin size={16} />
//                         Current Address
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.currentAddress?.line1},{" "}
//                         {selectedRider.currentAddress?.line2}
//                         <br />
//                         {selectedRider.currentAddress?.city},{" "}
//                         {selectedRider.currentAddress?.state} -{" "}
//                         {selectedRider.currentAddress?.pinCode}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Languages
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.language?.join(", ") || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Identity Documents */}
//                 <div className="mb-8">
//                   <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
//                     <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
//                       <FileText className="text-[#FF7B1D]" size={24} />
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Identity Documents
//                     </h3>
//                   </div>
//                   <div className="grid md:grid-cols-2 gap-6 mb-6">
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Aadhaar Number
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.documents?.aadharCard?.aadharId || "N/A"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Document Images */}
//                   <div className="grid md:grid-cols-2 gap-6">
//                     {selectedRider.documents?.profile?.url && (
//                       <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
//                         <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
//                           <User size={16} />
//                           Profile Photo
//                         </p>
//                         <img
//                           src={selectedRider.documents.profile.url}
//                           alt="Profile"
//                           className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
//                           onClick={() =>
//                             setImageModal(selectedRider.documents.profile.url)
//                           }
//                         />
//                       </div>
//                     )}
//                     {selectedRider.documents?.aadharCard?.photo?.url && (
//                       <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
//                         <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
//                           <Shield size={16} />
//                           Aadhaar Card
//                         </p>
//                         <img
//                           src={selectedRider.documents.aadharCard.photo.url}
//                           alt="Aadhaar"
//                           className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
//                           onClick={() =>
//                             setImageModal(
//                               selectedRider.documents.aadharCard.photo.url
//                             )
//                           }
//                         />
//                       </div>
//                     )}
//                     {selectedRider.documents?.panCard?.front?.url && (
//                       <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
//                         <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
//                           <CreditCard size={16} />
//                           PAN Card (Front)
//                         </p>
//                         <img
//                           src={selectedRider.documents.panCard.front.url}
//                           alt="PAN Front"
//                           className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
//                           onClick={() =>
//                             setImageModal(
//                               selectedRider.documents.panCard.front.url
//                             )
//                           }
//                         />
//                       </div>
//                     )}
//                     {selectedRider.documents?.panCard?.back?.url && (
//                       <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
//                         <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
//                           <CreditCard size={16} />
//                           PAN Card (Back)
//                         </p>
//                         <img
//                           src={selectedRider.documents.panCard.back.url}
//                           alt="PAN Back"
//                           className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
//                           onClick={() =>
//                             setImageModal(
//                               selectedRider.documents.panCard.back.url
//                             )
//                           }
//                         />
//                       </div>
//                     )}
//                     {selectedRider.documents?.drivingLicense?.front?.url && (
//                       <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
//                         <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
//                           <FileText size={16} />
//                           Driving License (Front)
//                         </p>
//                         <img
//                           src={selectedRider.documents.drivingLicense.front.url}
//                           alt="DL Front"
//                           className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
//                           onClick={() =>
//                             setImageModal(
//                               selectedRider.documents.drivingLicense.front.url
//                             )
//                           }
//                         />
//                       </div>
//                     )}
//                     {selectedRider.documents?.drivingLicense?.back?.url && (
//                       <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
//                         <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
//                           <FileText size={16} />
//                           Driving License (Back)
//                         </p>
//                         <img
//                           src={selectedRider.documents.drivingLicense.back.url}
//                           alt="DL Back"
//                           className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
//                           onClick={() =>
//                             setImageModal(
//                               selectedRider.documents.drivingLicense.back.url
//                             )
//                           }
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Bank Details */}
//                 <div className="mb-8">
//                   <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
//                     <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
//                       <CreditCard className="text-[#FF7B1D]" size={24} />
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Bank Account Details
//                     </h3>
//                   </div>
//                   <div className="grid md:grid-cols-2 gap-6 mb-6">
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Account Holder Name
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.documents?.bankDetails
//                           ?.accountHolderName || "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Account Number
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.documents?.bankDetails?.accountNumber ||
//                           "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         IFSC Code
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.documents?.bankDetails?.ifsc || "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Bank Name
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.documents?.bankDetails?.bankName ||
//                           "N/A"}
//                       </p>
//                     </div>
//                     <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Branch Name
//                       </p>
//                       <p className="text-gray-900 font-medium">
//                         {selectedRider.documents?.bankDetails?.branchName ||
//                           "N/A"}
//                       </p>
//                     </div>
//                   </div>

//                   {selectedRider.documents?.bankDetails?.cancelCheque?.url && (
//                     <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
//                       <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
//                         <FileText size={16} />
//                         Cancelled Cheque
//                       </p>
//                       <img
//                         src={
//                           selectedRider.documents.bankDetails.cancelCheque.url
//                         }
//                         alt="Cancelled Cheque"
//                         className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
//                         onClick={() =>
//                           setImageModal(
//                             selectedRider.documents.bankDetails.cancelCheque.url
//                           )
//                         }
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Work Details */}
//                 <div className="mb-8">
//                   <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
//                     <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
//                       <Car className="text-[#FF7B1D]" size={24} />
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Work Details
//                     </h3>
//                   </div>
//                   <div className="grid md:grid-cols-3 gap-6">
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Vehicle Type
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.workDetails?.vehicleType || "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Experience
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.workDetails?.experience || "N/A"}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-sm text-gray-500 font-semibold mb-1">
//                         Preferred Shift
//                       </p>
//                       <p className="text-gray-900 font-medium text-lg">
//                         {selectedRider.workDetails?.shift || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 {selectedRider.approvalStatus === "pending" && (
//                   <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t-2 border-gray-200">
//                     <button
//                       onClick={() =>
//                         handleAction(selectedRider._id, "rejected")
//                       }
//                       disabled={actionLoading}
//                       className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {actionLoading ? (
//                         <Loader2 className="animate-spin" size={24} />
//                       ) : (
//                         <XCircle size={24} />
//                       )}
//                       Suspend Application
//                     </button>
//                     <button
//                       onClick={() =>
//                         handleAction(selectedRider._id, "approved")
//                       }
//                       disabled={actionLoading}
//                       className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {actionLoading ? (
//                         <Loader2 className="animate-spin" size={24} />
//                       ) : (
//                         <CheckCircle size={24} />
//                       )}
//                       Approve Application
//                     </button>
//                   </div>
//                 )}

//                 {selectedRider.approvalStatus !== "pending" && (
//                   <div className="pt-6 border-t-2 border-gray-200">
//                     <div
//                       className={`text-center py-4 rounded-xl font-semibold text-lg ${getStatusColor(
//                         selectedRider.approvalStatus
//                       )}`}
//                     >
//                       ✓ Application{" "}
//                       {getStatusText(selectedRider.approvalStatus)}
//                       {selectedRider.approvedAt && (
//                         <span> on {formatDate(selectedRider.approvedAt)}</span>
//                       )}
//                       {selectedRider.approvedBy && (
//                         <div className="text-sm mt-2">
//                           By: {selectedRider.approvedBy.name}
//                         </div>
//                       )}
//                     </div>
//                     {selectedRider.rejectionReason && (
//                       <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
//                         <p className="text-sm text-red-700 font-semibold mb-1">
//                           Rejection Reason:
//                         </p>
//                         <p className="text-red-900">
//                           {selectedRider.rejectionReason}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Image Modal */}
//         {imageModal && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50"
//             onClick={() => setImageModal(null)}
//           >
//             <div className="relative max-w-6xl w-full">
//               <img
//                 src={imageModal}
//                 alt="Document"
//                 className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg shadow-2xl"
//               />
//               <button
//                 onClick={() => setImageModal(null)}
//                 className="absolute -top-4 -right-4 bg-white text-gray-900 rounded-full w-12 h-12 flex items-center justify-center text-3xl hover:bg-[#FF7B1D] hover:text-white transition shadow-lg"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default RiderManagement;
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  CheckCircle,
  XCircle,
  Eye,
  User,
  FileText,
  Car,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  Shield,
  Download,
  AlertCircle,
  CheckSquare,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://46.202.164.93/api/rider";

const RiderManagement = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [filter, setFilter] = useState("all");
  const [imageModal, setImageModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  // Fetch all riders on component mount
  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError(result.message || "Failed to fetch riders");
        }
        return;
      }

      if (result.success) {
        setRiders(result.data);
      } else {
        setError("Failed to fetch riders");
      }
    } catch (err) {
      setError("Error connecting to server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
          alert("Unauthorized. Please login again.");
        } else {
          alert(result.message || "Failed to fetch rider details");
        }
        return;
      }

      if (result.success) {
        setSelectedRider(result.data);
      } else {
        alert("Failed to fetch rider details");
      }
    } catch (err) {
      alert("Error fetching rider details: " + err.message);
    }
  };

  const handleAction = async (riderId, action) => {
    try {
      setActionLoading(true);
      const endpoint = action === "approved" ? "approve" : "reject";

      const response = await fetch(`${API_BASE_URL}/${riderId}/${endpoint}`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("Unauthorized. Please login again.");
        } else {
          alert(result.message || "Action failed");
        }
        return;
      }

      if (result.success) {
        alert(
          `Rider ${
            action === "approved" ? "Approved" : "Rejected"
          } Successfully!`
        );
        setSelectedRider(null);
        fetchRiders(); // Refresh the list
      } else {
        alert(result.message || "Action failed");
      }
    } catch (err) {
      alert("Error performing action: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRiders = riders.filter((rider) => {
    if (filter === "all") return true;
    if (filter === "pending") return rider.approvalStatus === "pending";
    if (filter === "approved") return rider.approvalStatus === "approved";
    if (filter === "rejected")
      return (
        rider.approvalStatus === "rejected" ||
        rider.approvalStatus === "suspended"
      );
    return true;
  });

  const getStatusColor = (status) => {
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

  const getStatusText = (status) => {
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

  const stats = {
    total: riders.length,
    pending: riders.filter((r) => r.approvalStatus === "pending").length,
    approved: riders.filter((r) => r.approvalStatus === "approved").length,
    rejected: riders.filter(
      (r) => r.approvalStatus === "rejected" || r.approvalStatus === "suspended"
    ).length,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen ml-6 p-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2
              className="animate-spin text-[#FF7B1D] mx-auto mb-4"
              size={48}
            />
            <p className="text-gray-600 text-lg">Loading riders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen ml-6 p-0 flex items-center justify-center">
          <div className="text-center bg-white rounded-lg shadow-lg p-8">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
            <button
              onClick={fetchRiders}
              className="px-6 py-3 bg-[#FF7B1D] text-white rounded-lg hover:bg-[#FF9B4D] transition"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-6 p-0">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-sm shadow-lg p-8 mb-6 border-l-4 border-[#FF7B1D]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Rider Management System
                </h1>
                <p className="text-gray-600 text-lg">
                  Review, verify and manage rider applications efficiently
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-gradient-to-br from-[#FF7B1D] to-[#FF9B4D] text-white p-6 rounded-xl shadow-lg">
                  <div className="text-center">
                    <p className="text-sm opacity-90">Total Applications</p>
                    <p className="text-4xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-[#FF7B1D] hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                  <User className="text-[#FF7B1D]" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-amber-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Pending Review
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Clock className="text-amber-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Approved
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.approved}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-red-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Rejected
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.rejected}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-sm shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === "all"
                    ? "bg-[#FF7B1D] text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Applications ({stats.total})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === "pending"
                    ? "bg-amber-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === "approved"
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === "rejected"
                    ? "bg-red-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Riders List */}
          <div className="grid gap-4">
            {filteredRiders.map((rider) => (
              <div
                key={rider._id}
                className="bg-white rounded-sm shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 border-[#FF7B1D]"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-full">
                          <User className="text-[#FF7B1D]" size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {rider.fullName}
                            </h3>
                            <span
                              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                                rider.approvalStatus
                              )}`}
                            >
                              {getStatusText(rider.approvalStatus)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone size={16} />
                              <span>{rider.mobileNumber}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span>{rider.city || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Calendar size={14} />
                            Applied Date
                          </p>
                          <p className="text-gray-900 font-medium">
                            {formatDate(rider.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <User size={14} />
                            Age
                          </p>
                          <p className="text-gray-900 font-medium">
                            {rider.age || "N/A"} Years
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1">
                            Blood Group
                          </p>
                          <p className="text-gray-900 font-medium">
                            {rider.bloodGroup || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Car size={14} />
                            Vehicle Type
                          </p>
                          <p className="text-gray-900 font-medium">
                            {rider.workDetails?.vehicleType || "N/A"}
                          </p>
                        </div>
                      </div>

                      {rider.approvalStatus === "approved" && (
                        <div className="mt-4 flex gap-4 text-sm">
                          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                            <span className="text-green-700 font-semibold">
                              Approved on: {formatDate(rider.approvedAt)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => fetchRiderDetails(rider._id)}
                      className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-[#FF7B1D] to-[#FF9B4D] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                    >
                      <Eye size={20} />
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRiders.length === 0 && (
            <div className="bg-white rounded-sm shadow-md p-16 text-center">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-xl font-medium">
                No riders found in this category
              </p>
            </div>
          )}
        </div>

        {/* Detailed View Modal */}
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
                        {formatDate(selectedRider.dateOfBirth)} (
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
                              selectedRider.documents.aadharCard.photo.url
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
                              selectedRider.documents.panCard.front.url
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
                              selectedRider.documents.panCard.back.url
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
                              selectedRider.documents.drivingLicense.front.url
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
                              selectedRider.documents.drivingLicense.back.url
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
                            selectedRider.documents.bankDetails.cancelCheque.url
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

                {/* Action Buttons */}
                {selectedRider.approvalStatus === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t-2 border-gray-200">
                    <button
                      onClick={() =>
                        handleAction(selectedRider._id, "rejected")
                      }
                      disabled={actionLoading}
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <XCircle size={24} />
                      )}
                      Reject Application
                    </button>
                    <button
                      onClick={() =>
                        handleAction(selectedRider._id, "approved")
                      }
                      disabled={actionLoading}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <CheckCircle size={24} />
                      )}
                      Approve Application
                    </button>
                  </div>
                )}

                {selectedRider.approvalStatus !== "pending" && (
                  <div className="pt-6 border-t-2 border-gray-200">
                    <div
                      className={`text-center py-4 rounded-xl font-semibold text-lg ${getStatusColor(
                        selectedRider.approvalStatus
                      )}`}
                    >
                      ✓ Application{" "}
                      {getStatusText(selectedRider.approvalStatus)}
                      {selectedRider.approvedAt && (
                        <span> on {formatDate(selectedRider.approvedAt)}</span>
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
      </div>
    </DashboardLayout>
  );
};

export default RiderManagement;
