// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import DashboardLayout from "../../components/DashboardLayout";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import AddVendorModal from "../../components/AddVendorModal";
// import api from "../../api/api";

// import {
//   ChartBarIcon,
//   ArrowUpIcon,
//   ArrowDownIcon,
//   UserIcon,
// } from "@heroicons/react/24/outline";

// const VendorDetails = () => {
//   const { id } = useParams();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [vendor, setVendor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch vendor data from API
//   useEffect(() => {
//     const fetchVendor = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Log the request details for debugging
//         console.log("Fetching vendor with ID:", id);
//         console.log("Request URL:", `/vendor/${id}`);

//         const response = await api.get(`/vendor/${id}`);

//         const result = response.data;

//         if (result.success) {
//           setVendor(result.data);
//           console.log("Vendor data loaded successfully:", result.data);
//         } else {
//           setError(result.message || "Failed to fetch vendor data");
//           console.error("Failed to fetch vendor:", result.message);
//         }
//       } catch (error) {
//         console.error("Error fetching vendor:", error);
//         console.error("Error response:", error.response);

//         // Handle different error scenarios
//         if (error.response?.status === 404) {
//           setError("Vendor not found. Please check the vendor ID.");
//         } else if (error.response?.status === 401) {
//           setError("Unauthorized. Please log in again.");
//         } else if (error.response?.status === 403) {
//           setError(
//             "Access denied. You don't have permission to view this vendor.",
//           );
//         } else {
//           setError(
//             error.response?.data?.message ||
//               error.message ||
//               "Error fetching vendor data. Please try again.",
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchVendor();
//     } else {
//       setError("No vendor ID provided");
//       setLoading(false);
//     }
//   }, [id]);

//   // Pie chart data (order overview)
//   const chartData = [
//     { name: "Completed", value: 40, color: "#222f5cff" },
//     { name: "In Progress", value: 25, color: "#16A34A" },
//     { name: "Pending", value: 20, color: "#FACC15" },
//     { name: "Cancelled", value: 15, color: "#DC2626" },
//   ];

//   const stats = [
//     {
//       title: "Category Use",
//       value: "1007",
//       icon: ChartBarIcon,
//       color: "text-red-500",
//     },
//     {
//       title: "Sub Category Use",
//       value: "1007",
//       icon: ArrowUpIcon,
//       color: "text-black",
//     },
//     {
//       title: "Product Refund",
//       value: "1007",
//       icon: ArrowDownIcon,
//       color: "text-green-500",
//     },
//     {
//       title: "Product in Review",
//       value: "1007",
//       icon: ChartBarIcon,
//       color: "text-red-500",
//     },
//     {
//       title: "Total Order",
//       value: "1007",
//       icon: ArrowUpIcon,
//       color: "text-black",
//     },
//     {
//       title: "Total Delivered",
//       value: "1007",
//       icon: ArrowDownIcon,
//       color: "text-green-500",
//     },
//     {
//       title: "Total Cancelled Order",
//       value: "1007",
//       icon: ChartBarIcon,
//       color: "text-red-500",
//     },
//     {
//       title: "Total Riders",
//       value: "1007",
//       icon: ArrowUpIcon,
//       color: "text-black",
//     },
//     {
//       title: "Pricing",
//       value: "1007",
//       icon: ArrowDownIcon,
//       color: "text-green-500",
//     },
//     {
//       title: "Inventory",
//       value: "1007",
//       icon: ChartBarIcon,
//       color: "text-red-500",
//     },
//     { title: "Account", value: "1007", icon: ArrowUpIcon, color: "text-black" },
//     {
//       title: "Ticket",
//       value: "1007",
//       icon: ArrowDownIcon,
//       color: "text-green-500",
//     },
//   ];

//   const invoices = [
//     {
//       title: "Redesign Website",
//       id: "#INV-00024",
//       payment: "$5600",
//       status: "Paid",
//     },
//     {
//       title: "Module Completion",
//       id: "#INV-00023",
//       payment: "$4175",
//       status: "Paid",
//     },
//     {
//       title: "Change CRM Module",
//       id: "#INV-00022",
//       payment: "$3500",
//       status: "Unpaid",
//     },
//     {
//       title: "Charges on live Board",
//       id: "#INV-00021",
//       payment: "$1457",
//       status: "Paid",
//     },
//     {
//       title: "Hospital Management",
//       id: "#INV-00020",
//       payment: "$6545",
//       status: "Unpaid",
//     },
//   ];

//   const partners = [
//     {
//       id: 1,
//       name: "Anthony Lewis",
//       role: "Finance",
//       date: "28 September 2025",
//       status: "Running",
//       statusColor: "bg-green-100 text-green-600",
//       avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//     {
//       id: 2,
//       name: "Brian Villalobos",
//       role: "PHP Developer",
//       date: "",
//       status: "In Active",
//       statusColor: "bg-red-100 text-red-500",
//       avatar: "https://randomuser.me/api/portraits/men/12.jpg",
//     },
//     {
//       id: 3,
//       name: "Stephan Peralt",
//       role: "Executive",
//       date: "",
//       status: "Online",
//       statusColor: "bg-blue-100 text-blue-500",
//       avatar: "https://randomuser.me/api/portraits/men/45.jpg",
//     },
//     {
//       id: 4,
//       name: "Doglas Martini",
//       role: "Project Manager",
//       date: "",
//       status: "Online",
//       statusColor: "bg-pink-100 text-pink-500",
//       avatar: "https://randomuser.me/api/portraits/women/60.jpg",
//     },
//     {
//       id: 5,
//       name: "Anthony Lewis",
//       role: "UI/UX Designer",
//       date: "",
//       status: "In Active",
//       statusColor: "bg-red-100 text-red-500",
//       avatar: "https://randomuser.me/api/portraits/men/14.jpg",
//     },
//   ];

//   const vendorInvoices = [
//     {
//       id: "#INV002",
//       title: "Redesign Website",
//       company: "Logistics",
//       payment: "$3560",
//       status: "Unpaid",
//       avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//     {
//       id: "#INV005",
//       title: "Module Completion",
//       company: "Vip Corp",
//       payment: "$4175",
//       status: "Unpaid",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//     {
//       id: "#INV003",
//       title: "Change on Emp Module",
//       company: "Ignis LLP",
//       payment: "$6985",
//       status: "Unpaid",
//       avatar: "https://randomuser.me/api/portraits/men/54.jpg",
//     },
//     {
//       id: "#INV004",
//       title: "Changes on the Board",
//       company: "Ignis LLP",
//       payment: "$1457",
//       status: "Unpaid",
//       avatar: "https://randomuser.me/api/portraits/women/65.jpg",
//     },
//     {
//       id: "#INV006",
//       title: "Hospital Management",
//       company: "HCL Corp",
//       payment: "$6458",
//       status: "Paid",
//       avatar: "https://randomuser.me/api/portraits/men/76.jpg",
//     },
//   ];

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-[70vh]">
//           <p className="text-lg text-gray-600">Loading vendor details...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error || !vendor) {
//     return (
//       <DashboardLayout>
//         <div className="flex flex-col items-center justify-center h-[70vh]">
//           <p className="text-lg text-gray-600 mb-4">
//             {error || "Vendor not found"}
//           </p>
//           <button
//             onClick={() => window.history.back()}
//             className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
//           >
//             Go Back
//           </button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // Format date helper
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   return (
//     <DashboardLayout>
//       <div>
//         {/* Add Vendor Button */}
//         <div className="w-full md:w-auto flex justify-end">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-black text-white w-48 sm:w-56 px-4 sm:px-5 py-2 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
//           >
//             + Add Vendor
//           </button>
//         </div>

//         {/* Modal */}
//         {isModalOpen && (
//           <AddVendorModal
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//           />
//         )}
//       </div>
//       {/* Main Grid for Three Columns */}
//       <div className="max-w-[100%] mx-auto mt-4 grid pl-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//         {/* Column 1 - Vendor & Store Info */}
//         <div className="space-y-1 w-full">
//           {/* Vendor Info */}
//           <div>
//             <div className="border border-orange-500 rounded-lg shadow p-4 bg-[#FEF0E9] min-h-[140px] relative">
//               {/* Orange Badge Icon */}
//               <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-5 sm:w-6 h-5 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center text-white z-10">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   className="w-3 h-3"
//                 >
//                   <path d="M12 2L2 7v7c0 5 5 10 10 10s10-5 10-10V7l-10-5zm0 2.18l7 3.5v5.32c0 4-3.2 8-7 8s-7-4-7-8V7.68l7-3.5zM12 8l-2 4h4l-2-4zm0 6.5l-1.5 3h3L12 14.5z" />
//                 </svg>
//               </div>

//               <div className="flex flex-col sm:flex-row justify-between items-start w-full">
//                 {/* Left Section */}
//                 <div className="flex items-center sm:ml-12 ml-8 w-full sm:w-auto gap-3 relative z-0">
//                   {/* Vendor Image */}
//                   <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm flex-shrink-0">
//                     IMG
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-black">Store ID</p>
//                     <p className="text-gray-400">{vendor.storeId || "N/A"}</p>
//                   </div>
//                 </div>

//                 {/* Right Section */}
//                 <div className="flex flex-col items-start sm:items-end mt-3 sm:mt-0 w-full sm:w-auto">
//                   <p className="text-gray-500 font-semibold text-xs sm:text-sm">
//                     Status
//                   </p>
//                   <p
//                     className={`text-lg font-bold ${vendor.isActive ? "text-green-500" : "text-red-500"}`}
//                   >
//                     {vendor.isActive ? "Active" : "Inactive"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Store Image */}
//           <div className="mb-4">
//             <h2 className="font-semibold text-gray-700 mb-2">Store Image</h2>
//             <div className="border rounded-sm shadow p-4 bg-gray-100 text-center min-h-[150px] sm:min-h-[120px] flex items-center justify-center">
//               {vendor.storeImage && vendor.storeImage.length > 0 ? (
//                 <img
//                   src={vendor.storeImage[0].url}
//                   alt="Store"
//                   className="max-w-full max-h-full object-contain rounded"
//                 />
//               ) : (
//                 <span className="text-gray-400">No image available</span>
//               )}
//             </div>
//           </div>

//           {/* Store Location */}
//           <div className="mb-4">
//             <h2 className="font-semibold text-gray-700 mb-2">Store Location</h2>
//             <div className="border rounded-sm shadow p-4 bg-gray-100 text-center min-h-[200px] sm:min-h-[180px] flex items-center justify-center">
//               MAP
//             </div>
//           </div>

//           {/* Store Details */}
//           <div>
//             <h2 className="font-semibold text-gray-700 mb-2">Store Details</h2>
//             <div className="border border-orange-500 rounded-lg shadow p-4 bg-[#FEF0E9] text-sm space-y-1">
//               <p>
//                 <strong>Lat :</strong> {vendor.storeAddress?.latitude || "N/A"}{" "}
//                 &nbsp; <strong>Long :</strong>{" "}
//                 {vendor.storeAddress?.longitude || "N/A"}
//               </p>
//               <p>
//                 <strong>Authorized Person :</strong>{" "}
//                 {vendor.vendorName || "N/A"}
//               </p>
//               <p>
//                 <strong>Contact :</strong> {vendor.contactNumber || "N/A"}
//                 {vendor.contactNumberVerified && (
//                   <span className="ml-1 text-green-600">✓</span>
//                 )}
//               </p>
//               <p>
//                 <strong>Alt Contact :</strong>{" "}
//                 {vendor.altContactNumber || "N/A"}
//               </p>
//               <p>
//                 <strong>Email :</strong> {vendor.email || "N/A"}
//               </p>
//               <p>
//                 <strong>DOB :</strong> {formatDate(vendor.dateOfBirth)}
//               </p>
//               <p>
//                 <strong>Age :</strong> {vendor.age || "N/A"}
//               </p>
//               <p>
//                 <strong>Gender :</strong>{" "}
//                 {vendor.gender
//                   ? vendor.gender.charAt(0).toUpperCase() +
//                     vendor.gender.slice(1)
//                   : "N/A"}
//               </p>
//               <p>
//                 <strong>Service Radius :</strong>{" "}
//                 {vendor.serviceRadius || "N/A"} km
//               </p>
//             </div>
//           </div>

//           {/* Store Address */}
//           <div>
//             <h2 className="font-semibold text-gray-700 mb-2">Store Address</h2>
//             <div className="border rounded-lg shadow p-4 bg-[#9797FD] text-sm space-y-1">
//               <p>
//                 <strong>Address 1 :</strong>{" "}
//                 {vendor.storeAddress?.line1 || "N/A"}
//               </p>
//               <p>
//                 <strong>Address 2 :</strong>{" "}
//                 {vendor.storeAddress?.line2 || "N/A"}
//               </p>
//               <p>
//                 <strong>City :</strong> {vendor.storeAddress?.city || "N/A"}
//               </p>
//               <p>
//                 <strong>State :</strong> {vendor.storeAddress?.state || "N/A"}
//               </p>
//               <p>
//                 <strong>PIN :</strong> {vendor.storeAddress?.pinCode || "N/A"}
//               </p>
//             </div>
//           </div>

//           {/* Store Login Credentials */}
//           <div>
//             <h2 className="font-bold mt-4 mb-3 inline-block border-b-4 border-black pb-1 text-orange-500">
//               Store Login Credentials
//             </h2>

//             <div className="rounded-lg p-4 bg-white text-sm space-y-1">
//               <p>
//                 <strong>Username :</strong> {vendor?.username || "N/A"}
//               </p>
//               <p>
//                 <strong>Password :</strong>{" "}
//                 {vendor?.password ? "••••••••" : "N/A"}
//               </p>
//               <p>
//                 <strong>Secret KEY :</strong>{" "}
//                 {vendor?.secretKey ? "•••••" : "N/A"}
//               </p>

//               {/* Centered Large Button */}
//               <div className="mt-8 flex justify-center">
//                 <button className="text-black border mt-4 border-black px-8 py-2 rounded-full w-72 hover:bg-orange-500 transition">
//                   Change Credential
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Column 2 - Main Info & Charts */}
//         <div className="space-y-4">
//           {/* Vendor Info Card */}
//           <div className="flex border-2 border-orange-300 rounded-md p-2.5 bg-[#FEF0E9] h-20 relative items-center justify-between">
//             {/* Orange Badge Icon */}
//             <div className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//                 className="w-3 h-3"
//               >
//                 <path d="M12 2L2 7v7c0 5 5 10 10 10s10-5 10-10V7l-10-5zm0 2.18l7 3.5v5.32c0 4-3.2 8-7 8s-7-4-7-8V7.68l7-3.5zM12 8l-2 4h4l-2-4zm0 6.5l-1.5 3h3L12 14.5z" />
//               </svg>
//             </div>

//             {/* Left: Vendor Info */}
//             <div className="flex items-center gap-2 ml-6">
//               {vendor.storeImage && vendor.storeImage.length > 0 ? (
//                 <img
//                   src={vendor.storeImage[0].url}
//                   alt="Vendor"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
//                   {vendor.vendorName?.charAt(0) || "V"}
//                 </div>
//               )}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800">
//                   {vendor.vendorName || "N/A"}
//                 </h3>
//                 <p className="text-xs text-gray-600">
//                   {vendor.storeName || "Store"}
//                 </p>
//               </div>
//             </div>

//             {/* Right: Status */}
//             <div className="text-right mr-2">
//               <p className="text-xs text-gray-500 font-semibold">Status</p>
//               <p
//                 className={`text-lg font-bold ${vendor.isActive ? "text-green-600" : "text-red-600"}`}
//               >
//                 {vendor.isActive ? "Active" : "Inactive"}
//               </p>
//             </div>
//           </div>

//           {/* Order Overview */}
//           <div className="bg-white shadow rounded p-4 h-[490px] relative">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-semibold">Order Overview</h3>
//               <button className="text-xs border rounded px-2 py-0 flex items-center gap-2">
//                 📅 Today
//               </button>
//             </div>
//             <hr></hr>
//             {/* Pie Chart */}
//             <div className="mt-4">
//               {" "}
//               {/* added margin-top to move pie chart down */}
//               <ResponsiveContainer width="100%" height={240}>
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     dataKey="value"
//                     cx="50%"
//                     cy="50%"
//                     startAngle={180}
//                     endAngle={0}
//                     innerRadius={80}
//                     outerRadius={120}
//                     paddingAngle={2}
//                   >
//                     {chartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-center">
//               <p className="text-gray-500 text-sm">Total Attendance</p>
//               <p className="text-2xl font-bold">120</p>
//             </div>

//             <div className="mt-4 space-y-2">
//               {chartData.map((entry, idx) => (
//                 <div
//                   key={idx}
//                   className="flex justify-between items-center text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span
//                       className="inline-block w-3 h-3 rounded-full"
//                       style={{ backgroundColor: entry.color }}
//                     ></span>
//                     <span>{entry.name}</span>
//                   </div>
//                   <span className="font-medium">{entry.value}%</span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between items-center border-t mt-4 pt-2">
//               {/* Left: Order List */}
//               <div className="flex items-center gap-4">
//                 <p className="text-sm font-semibold text-gray-700">
//                   Order List
//                 </p>

//                 {/* Avatars */}
//                 <div className="flex items-center gap-1">
//                   <img
//                     src="https://i.pravatar.cc/20?img=1"
//                     alt="user1"
//                     className="w-6 h-6 rounded-full border"
//                   />
//                   <img
//                     src="https://i.pravatar.cc/20?img=2"
//                     alt="user2"
//                     className="w-6 h-6 rounded-full border"
//                   />
//                   <img
//                     src="https://i.pravatar.cc/20?img=3"
//                     alt="user3"
//                     className="w-6 h-6 rounded-full border"
//                   />
//                   <span className="text-xs bg-orange-500 text-white rounded-full px-2">
//                     +1
//                   </span>
//                 </div>
//               </div>

//               {/* Right: View Details Button */}
//               <button className="text-orange-600 text-sm font-medium">
//                 View Details
//               </button>
//             </div>
//           </div>

//           {/* Announcement */}
//           <div className="bg-white shadow rounded p-3 min-h-[375px]">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-semibold text-gray-800">Announcement</h3>
//               <button className="text-xs bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium px-3 py-1 transition">
//                 View All
//               </button>
//             </div>

//             <hr className="border-gray-200 mb-2" />

//             <div className="flex flex-col">
//               <button className="bg-[#3B7080] text-white text-xs px-3 py-1 rounded mb-2 w-max">
//                 Invitation
//               </button>

//               <p className="text-sm text-gray-700 mb-1 font-medium">
//                 We are now open new shop...
//               </p>
//               <p className="text-xs text-gray-500 mb-2">
//                 📅 24 Sept 2025 | 🕒 10:30 AM
//               </p>
//               <p className="text-sm text-gray-700">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
//                 eget ultricies mauris. Pellentesque habitant morbi tristique
//                 senectus et netus et malesuada fames ac turpis egestas.
//                 Curabitur vitae lectus non sapien bibendum commodo. Integer ut
//                 augue at metus convallis malesuada. Fusce sed enim eu nunc
//                 lacinia facilisis.lorem ipsum dolor sit amet, consecteturlorem
//                 ipsum dolor sit amet, consectetur adipiscing elit. Sed
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Column 3 - Stat Cards */}
//         <div className="space-y-4">
//           {/* Vendor Info Card */}
//           <div className="flex border-2 border-orange-300 rounded-md p-2.5 bg-[#FEF0E9] h-20 relative items-center justify-between">
//             {/* Orange Badge Icon */}
//             <div className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//                 className="w-3 h-3"
//               >
//                 <path d="M12 2L2 7v7c0 5 5 10 10 10s10-5 10-10V7l-10-5zm0 2.18l7 3.5v5.32c0 4-3.2 8-7 8s-7-4-7-8V7.68l7-3.5zM12 8l-2 4h4l-2-4zm0 6.5l-1.5 3h3L12 14.5z" />
//               </svg>
//             </div>

//             {/* Left: Vendor Info */}
//             <div className="flex items-center gap-2 ml-6">
//               {vendor.storeImage && vendor.storeImage.length > 0 ? (
//                 <img
//                   src={vendor.storeImage[0].url}
//                   alt="Vendor"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
//                   {vendor.vendorName?.charAt(0) || "V"}
//                 </div>
//               )}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800">
//                   {vendor.vendorName || "N/A"}
//                 </h3>
//                 <p className="text-xs text-gray-600">
//                   {vendor.storeName || "Store"}
//                 </p>
//               </div>
//             </div>

//             {/* Right: Status */}
//             <div className="text-right mr-2">
//               <p className="text-xs text-gray-500 font-semibold">Status</p>
//               <p
//                 className={`text-lg font-bold ${vendor.isActive ? "text-green-600" : "text-red-600"}`}
//               >
//                 {vendor.isActive ? "Active" : "Inactive"}
//               </p>
//             </div>
//           </div>

//           {/* Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {[
//               {
//                 title: "Category Use",
//                 value: "1007",
//                 iconColor: "bg-black",
//                 iconType: "svgHuman",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-purple-200 text-purple-700",
//               },
//               {
//                 title: "Sub Category Use",
//                 value: "1007",
//                 iconColor: "bg-green-700",
//                 iconType: "lawm",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-orange-100 text-orange-600",
//               },
//               {
//                 title: "Product Published",
//                 value: "1007",
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Product In Review",
//                 value: "1007",
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Total Order",
//                 value: "1007",
//                 iconColor: "bg-black",
//                 iconType: "svgHuman",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-purple-200 text-purple-700",
//               },
//               {
//                 title: "Total Delivered Order",
//                 value: "1007",
//                 iconColor: "bg-green-500",
//                 iconType: "lawm",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-orange-100 text-orange-600",
//               },
//               {
//                 title: "Total Canceled Order",
//                 value: "1007",
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Total Riders",
//                 value: "1007",
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Ratings",
//                 value: "1007",
//                 iconColor: "bg-black",
//                 iconType: "svgHuman",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-purple-200 text-purple-700",
//               },
//               {
//                 title: "Inventory",
//                 value: "1007",
//                 iconColor: "bg-green-500",
//                 iconType: "lawm",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-orange-100 text-orange-600",
//               },
//               {
//                 title: "Amount",
//                 value: "1007",
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Ticket",
//                 value: "1007",
//                 iconColor: "bg-green-500",
//                 iconType: "lawm",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//             ].map((card, idx) => (
//               <div
//                 key={idx}
//                 className="flex flex-col justify-between bg-white p-2 rounded-lg shadow h-[80px]"
//               >
//                 {/* Top section */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     {/* Colored ball with icon inside */}
//                     <div
//                       className={`w-6 h-6 flex items-center justify-center rounded-full ${card.iconColor}`}
//                     >
//                       {card.iconType === "svgHuman" ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="currentColor"
//                           viewBox="0 0 24 24"
//                           className="w-4 h-4 text-white"
//                         >
//                           <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                         </svg>
//                       ) : card.iconType === "lawm" ? (
//                         <span className="text-white text-xs font-bold">律</span>
//                       ) : card.iconType === "redIcon" ? (
//                         <span className="text-white text-xs font-bold">輪</span>
//                       ) : null}
//                     </div>
//                     <span className="text-gray-500 text-xs">{card.title}</span>
//                   </div>
//                   <div
//                     className={`px-2 py-0.5 rounded ${card.percentageColor} text-xs`}
//                   >
//                     {card.percentage}
//                   </div>
//                 </div>

//                 {/* Bottom-left value */}
//                 <div className="text-sm font-bold text-gray-800 flex justify-start">
//                   {card.value}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="bg-white border rounded shadow-sm w-full max-w-3xl mx-auto">
//             {/* Header */}
//             <div className="flex justify-between items-center border-b px-4 py-2">
//               <h2 className="font-semibold text-gray-800 text-sm">
//                 Delivery Partner
//               </h2>
//               <button className="text-xs bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium px-3 py-1 transition">
//                 View All
//               </button>
//             </div>

//             {/* Table Header */}
//             <div className="grid grid-cols-3 bg-gray-50 text-gray-600 text-xs font-semibold px-4 py-2 border-b">
//               <span>Name</span>
//               <span className="text-center">Status</span>
//               <span className="text-right">Status</span>
//             </div>

//             {/* Table Rows */}
//             <div>
//               {partners.map((partner) => (
//                 <div
//                   key={partner.id}
//                   className="grid grid-cols-3 items-center px-4 py-2 border-b last:border-0"
//                 >
//                   {/* Left: Profile */}
//                   <div className="flex items-center gap-2">
//                     <img
//                       src={partner.avatar}
//                       alt={partner.name}
//                       className="w-8 h-8 rounded-full object-cover"
//                     />
//                     <p className="font-medium text-gray-800 text-sm truncate">
//                       {partner.name}
//                     </p>
//                   </div>

//                   {/* Center: Date */}
//                   <div className="text-center text-xs text-gray-700">
//                     {partner.date}
//                   </div>

//                   {/* Right: Status */}
//                   <div className="flex justify-end">
//                     <span
//                       className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${partner.statusColor}`}
//                     >
//                       {partner.status}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white shadow rounded-md border border-blue-300 max-w-7xl w-[98%] mx-auto p-3 mt-4">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-3 relative">
//           {/* Left: Heading */}
//           <h2 className="text-lg font-semibold text-gray-700">Invoices</h2>

//           {/* Center: Select + Button */}
//           <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
//             <select className="border rounded px-2 py-1 text-sm w-full sm:w-auto">
//               <option>Invoices</option>
//               <option>Payments</option>
//             </select>
//             <button className="bg-gray-200 text-sm px-3 py-1 rounded flex items-center gap-1 w-full sm:w-auto">
//               This Week
//             </button>
//           </div>
//         </div>

//         {/* Table Header */}
//         <div className="grid grid-cols-3 bg-gray-50 text-gray-600 text-sm font-semibold px-2 py-2 rounded-t">
//           <span>Name</span>
//           <span className="text-center">Payment</span>
//           <span className="text-right">Status</span>
//         </div>

//         {/* Invoice List */}
//         <div>
//           {vendorInvoices.map((inv) => (
//             <div
//               key={inv.id}
//               className="grid grid-cols-3 items-center px-2 py-2 border-b last:border-0 hover:bg-gray-50"
//             >
//               {/* Name */}
//               <div className="flex items-center gap-3">
//                 <img
//                   src={inv.avatar}
//                   alt="avatar"
//                   className="w-9 h-9 rounded-full"
//                 />
//                 <div className="text-sm">
//                   <p className="font-medium">{inv.title}</p>
//                   <p className="text-gray-500">
//                     {inv.id} • {inv.company}
//                   </p>
//                 </div>
//               </div>

//               {/* Payment */}
//               <div className="text-center text-gray-700 font-semibold">
//                 {inv.payment}
//               </div>

//               {/* Status */}
//               <div className="flex justify-end">
//                 <span
//                   className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                     inv.status === "Paid"
//                       ? "bg-green-100 text-green-600"
//                       : "bg-red-100 text-red-600"
//                   }`}
//                 >
//                   {inv.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* View All */}
//         <div className="text-center mt-3">
//           <button className="text-gray-500 text-sm hover:underline">
//             View All
//           </button>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default VendorDetails;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import DashboardLayout from "../../components/DashboardLayout";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import api from "../../api/api";
// import { TrendingUp, TrendingDown } from "lucide-react";

// const VendorDetails = () => {
//   const { id } = useParams();

//   const [vendor, setVendor] = useState(null);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch vendor data
//   useEffect(() => {
//     const fetchVendorData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         console.log("========================================");
//         console.log("🚀 STARTING VENDOR DATA FETCH");
//         console.log("========================================");
//         console.log("Vendor ID:", id);
//         console.log(
//           "Full URL will be:",
//           `${api.defaults.baseURL}/vendor/${id}`,
//         );

//         // Try /vendor/${id} first (as per user's route), then fallback to /api/vendor/${id}
//         let response;
//         let endpointUsed = "";

//         try {
//           endpointUsed = `/vendor/${id}`;
//           console.log("📍 Trying endpoint 1:", endpointUsed);
//           console.log("Full URL:", `${api.defaults.baseURL}${endpointUsed}`);
//           response = await api.get(endpointUsed);
//           console.log("✅ Endpoint 1 SUCCESS!");
//         } catch (firstError) {
//           console.log("❌ Endpoint 1 FAILED");
//           console.log("Error status:", firstError.response?.status);
//           console.log("Error message:", firstError.message);
//           console.log("Error data:", firstError.response?.data);

//           if (firstError.response?.status === 404) {
//             endpointUsed = `/api/vendor/${id}`;
//             console.log("📍 Trying endpoint 2:", endpointUsed);
//             console.log("Full URL:", `${api.defaults.baseURL}${endpointUsed}`);
//             response = await api.get(endpointUsed);
//             console.log("✅ Endpoint 2 SUCCESS!");
//           } else {
//             throw firstError;
//           }
//         }

//         console.log("========================================");
//         console.log("📦 RAW RESPONSE RECEIVED");
//         console.log("========================================");
//         console.log("Endpoint used:", endpointUsed);
//         console.log("Response status:", response.status);
//         console.log("Response status text:", response.statusText);
//         console.log("Response headers:", response.headers);
//         console.log("Full response object:", response);
//         console.log("Response.data:", response.data);
//         console.log("Response.data type:", typeof response.data);
//         console.log("Response.data is array?", Array.isArray(response.data));

//         const result = response.data;

//         console.log("========================================");
//         console.log("🔍 ANALYZING RESPONSE STRUCTURE");
//         console.log("========================================");
//         console.log("Result:", result);
//         console.log("Result type:", typeof result);
//         console.log(
//           "Result keys:",
//           result ? Object.keys(result) : "Result is null/undefined",
//         );

//         if (result) {
//           console.log("Result.success:", result.success);
//           console.log("Result.message:", result.message);
//           console.log("Result.data:", result.data);
//           console.log("Result.data type:", typeof result.data);
//           console.log(
//             "Result.data keys:",
//             result.data
//               ? Object.keys(result.data)
//               : "result.data is null/undefined",
//           );

//           // Log full JSON structure
//           console.log("========================================");
//           console.log("📄 FULL JSON RESPONSE");
//           console.log("========================================");
//           console.log(JSON.stringify(result, null, 2));
//           console.log("========================================");
//         }

//         if (result && result.success) {
//           console.log("========================================");
//           console.log("✅ API CALL SUCCESSFUL");
//           console.log("========================================");

//           // Handle different response structures
//           let dataToUse = result.data;

//           console.log("Initial dataToUse:", dataToUse);
//           console.log("dataToUse type:", typeof dataToUse);
//           console.log(
//             "dataToUse keys:",
//             dataToUse ? Object.keys(dataToUse) : "dataToUse is null/undefined",
//           );

//           // If result.data doesn't exist, maybe data is directly in result
//           if (!dataToUse && result.vendor) {
//             console.log("⚠️ result.data is null, but result.vendor exists");
//             console.log("Using result directly as dataToUse");
//             dataToUse = result;
//           }

//           // Check if data exists
//           if (!dataToUse) {
//             console.error("❌ No data found in response");
//             console.error("Result structure:", result);
//             setError("No data received from API");
//             return;
//           }

//           console.log("========================================");
//           console.log("📊 EXTRACTING DATA");
//           console.log("========================================");
//           console.log("Using data structure:", dataToUse);
//           console.log("Data keys:", Object.keys(dataToUse));

//           // Set the full dashboard data
//           setDashboardData(dataToUse);
//           console.log("✅ Dashboard data set");

//           // Try multiple ways to get vendor data
//           let vendorData = {};

//           // Method 1: Check if vendor is in dataToUse.vendor
//           if (dataToUse.vendor && Object.keys(dataToUse.vendor).length > 0) {
//             vendorData = dataToUse.vendor;
//             console.log("✅ Found vendor in dataToUse.vendor");
//           }
//           // Method 2: Check if vendor data is directly in dataToUse (flat structure)
//           else if (dataToUse.id || dataToUse.vendorName || dataToUse.storeId) {
//             console.log(
//               "⚠️ Vendor data appears to be directly in dataToUse (flat structure)",
//             );
//             vendorData = dataToUse;
//             console.log("✅ Using dataToUse directly as vendor data");
//           }
//           // Method 3: Check if vendor is in result directly
//           else if (result.vendor && Object.keys(result.vendor).length > 0) {
//             vendorData = result.vendor;
//             console.log("✅ Found vendor in result.vendor");
//           }
//           // Method 4: Check if result itself is vendor data
//           else if (result.id || result.vendorName || result.storeId) {
//             console.log("⚠️ Result appears to be vendor data directly");
//             vendorData = result;
//             console.log("✅ Using result directly as vendor data");
//           } else {
//             console.warn(
//               "⚠️ Could not find vendor data in any expected location",
//             );
//             console.warn("dataToUse:", dataToUse);
//             console.warn("result:", result);
//             vendorData = {};
//           }

//           setVendor(vendorData);
//           console.log("✅ Vendor data set");
//           console.log("Vendor data keys:", Object.keys(vendorData));
//           console.log("Vendor data sample:", {
//             id: vendorData.id,
//             vendorName: vendorData.vendorName,
//             storeId: vendorData.storeId,
//             storeName: vendorData.storeName,
//             isActive: vendorData.isActive,
//           });

//           console.log("========================================");
//           console.log("🔎 EXTRACTED DATA DETAILS");
//           console.log("========================================");
//           console.log("Vendor data:", vendorData);
//           console.log("Vendor data keys:", Object.keys(vendorData));
//           console.log("Vendor data length:", Object.keys(vendorData).length);
//           console.log("StoreInfo:", dataToUse.storeInfo);
//           console.log(
//             "StoreInfo keys:",
//             dataToUse.storeInfo
//               ? Object.keys(dataToUse.storeInfo)
//               : "No storeInfo",
//           );
//           console.log("StoreDetails:", dataToUse.storeDetails);
//           console.log(
//             "StoreDetails keys:",
//             dataToUse.storeDetails
//               ? Object.keys(dataToUse.storeDetails)
//               : "No storeDetails",
//           );
//           console.log("StoreAddress:", dataToUse.storeAddress);
//           console.log(
//             "StoreAddress keys:",
//             dataToUse.storeAddress
//               ? Object.keys(dataToUse.storeAddress)
//               : "No storeAddress",
//           );
//           console.log("OrderOverview:", dataToUse.orderOverview);
//           console.log(
//             "OrderOverview keys:",
//             dataToUse.orderOverview
//               ? Object.keys(dataToUse.orderOverview)
//               : "No orderOverview",
//           );
//           console.log("Metrics:", dataToUse.metrics);
//           console.log(
//             "Metrics keys:",
//             dataToUse.metrics ? Object.keys(dataToUse.metrics) : "No metrics",
//           );
//           console.log("Wallet:", dataToUse.wallet);
//           console.log(
//             "Wallet keys:",
//             dataToUse.wallet ? Object.keys(dataToUse.wallet) : "No wallet",
//           );
//           console.log("DeliveryPartners:", dataToUse.deliveryPartners);
//           console.log(
//             "DeliveryPartners length:",
//             dataToUse.deliveryPartners ? dataToUse.deliveryPartners.length : 0,
//           );
//           console.log("Invoices:", dataToUse.invoices);
//           console.log(
//             "Invoices length:",
//             dataToUse.invoices ? dataToUse.invoices.length : 0,
//           );
//           console.log("========================================");

//           // If vendor is empty but we have other data, still proceed
//           if (!vendorData || Object.keys(vendorData).length === 0) {
//             console.warn(
//               "⚠️ Vendor object is empty, but proceeding with dashboard data",
//             );
//           } else {
//             console.log(
//               "✅ Vendor data has",
//               Object.keys(vendorData).length,
//               "keys",
//             );
//           }

//           console.log("========================================");
//           console.log("✅ DATA LOADING COMPLETE");
//           console.log("========================================");
//         } else {
//           console.error("========================================");
//           console.error("❌ API RETURNED SUCCESS: FALSE");
//           console.error("========================================");
//           console.error("Result:", result);
//           console.error("Result.success:", result?.success);
//           console.error("Result.message:", result?.message);
//           setError(result?.message || "Failed to fetch vendor data");
//         }
//       } catch (error) {
//         console.error("========================================");
//         console.error("❌ ERROR FETCHING VENDOR DATA");
//         console.error("========================================");
//         console.error("Error object:", error);
//         console.error("Error message:", error.message);
//         console.error("Error stack:", error.stack);
//         console.error("Error response:", error.response);
//         console.error("Error response status:", error.response?.status);
//         console.error(
//           "Error response status text:",
//           error.response?.statusText,
//         );
//         console.error("Error response data:", error.response?.data);
//         console.error("Error response headers:", error.response?.headers);
//         console.error("Error config:", error.config);
//         console.error("Error config URL:", error.config?.url);
//         console.error("Error config method:", error.config?.method);
//         console.error("========================================");

//         if (error.response?.status === 404) {
//           setError("Vendor not found. Please check the vendor ID.");
//         } else if (error.response?.status === 401) {
//           setError("Unauthorized. Please log in again.");
//         } else if (error.response?.status === 403) {
//           setError(
//             "Access denied. You don't have permission to view this vendor.",
//           );
//         } else {
//           setError(
//             error.response?.data?.message ||
//               error.message ||
//               "Error fetching vendor data.",
//           );
//         }
//       } finally {
//         console.log("========================================");
//         console.log("🏁 FETCH COMPLETE - Setting loading to false");
//         console.log("========================================");
//         setLoading(false);
//       }
//     };

//     if (id) {
//       console.log("========================================");
//       console.log("🎯 VENDOR ID FOUND, STARTING FETCH");
//       console.log("========================================");
//       fetchVendorData();
//     } else {
//       console.error("❌ No vendor ID provided");
//       setError("No vendor ID provided");
//       setLoading(false);
//     }
//   }, [id]);

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-[70vh]">
//           <p className="text-lg text-gray-600">Loading vendor details...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // Show error only if there's an actual error
//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="flex flex-col items-center justify-center h-[70vh]">
//           <p className="text-lg text-gray-600 mb-4">
//             {error || "Vendor not found"}
//           </p>
//           <div className="text-sm text-gray-500 mb-4">Vendor ID: {id}</div>
//           <button
//             onClick={() => window.history.back()}
//             className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
//           >
//             Go Back
//           </button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // Use dashboardData if vendor is empty - always try to get vendor from dashboardData
//   const vendorData = dashboardData?.vendor || vendor || {};

//   // If no data at all, show error
//   if (!dashboardData && (!vendor || Object.keys(vendor).length === 0)) {
//     return (
//       <DashboardLayout>
//         <div className="flex flex-col items-center justify-center h-[70vh]">
//           <p className="text-lg text-gray-600 mb-4">
//             Vendor data not available
//           </p>
//           <div className="text-sm text-gray-500 mb-4">Vendor ID: {id}</div>
//           <button
//             onClick={() => window.history.back()}
//             className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
//           >
//             Go Back
//           </button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // Format date helper
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Get data from the new structure - use vendorData from above
//   const storeInfo = dashboardData?.storeInfo || {};
//   const storeDetails = dashboardData?.storeDetails || {};
//   const storeAddress = dashboardData?.storeAddress || {};
//   const orderOverview = dashboardData?.orderOverview || {};
//   const metrics = dashboardData?.metrics || {};
//   const wallet = dashboardData?.wallet || {};
//   const partners = dashboardData?.deliveryPartners || [];
//   const vendorInvoices = dashboardData?.invoices || [];
//   const orderList = orderOverview?.orderList || [];
//   const recentTransactions = wallet?.recentTransactions || [];

//   // Debug logs for data extraction
//   console.log("========================================");
//   console.log("🔍 RENDER - DATA EXTRACTION CHECK");
//   console.log("========================================");
//   console.log("dashboardData:", dashboardData);
//   console.log(
//     "dashboardData keys:",
//     dashboardData ? Object.keys(dashboardData) : "No dashboardData",
//   );
//   console.log("wallet:", wallet);
//   console.log("wallet keys:", wallet ? Object.keys(wallet) : "No wallet");
//   console.log("wallet.earningWallet:", wallet?.earningWallet);
//   console.log("wallet.formattedEarningWallet:", wallet?.formattedEarningWallet);
//   console.log("wallet.recentTransactions:", wallet?.recentTransactions);
//   console.log("vendorInvoices:", vendorInvoices);
//   console.log("vendorInvoices length:", vendorInvoices?.length || 0);
//   console.log("metrics:", metrics);
//   console.log("metrics keys:", metrics ? Object.keys(metrics) : "No metrics");
//   console.log("========================================");

//   // Prepare chart data from API - handle new structure with count and percentage
//   const chartData = orderOverview?.statusDistribution
//     ? [
//         {
//           name: "Completed",
//           value:
//             orderOverview.statusDistribution.completed?.percentage ||
//             orderOverview.statusDistribution.completed ||
//             0,
//           count: orderOverview.statusDistribution.completed?.count || 0,
//           color: "#222f5cff",
//         },
//         {
//           name: "In Progress",
//           value:
//             orderOverview.statusDistribution.in_progress?.percentage ||
//             orderOverview.statusDistribution.in_progress ||
//             0,
//           count: orderOverview.statusDistribution.in_progress?.count || 0,
//           color: "#16A34A",
//         },
//         {
//           name: "Pending",
//           value:
//             orderOverview.statusDistribution.pending?.percentage ||
//             orderOverview.statusDistribution.pending ||
//             0,
//           count: orderOverview.statusDistribution.pending?.count || 0,
//           color: "#FACC15",
//         },
//         {
//           name: "Cancelled",
//           value:
//             orderOverview.statusDistribution.cancelled?.percentage ||
//             orderOverview.statusDistribution.cancelled ||
//             0,
//           count: orderOverview.statusDistribution.cancelled?.count || 0,
//           color: "#DC2626",
//         },
//       ]
//     : [
//         { name: "Completed", value: 40, count: 0, color: "#222f5cff" },
//         { name: "In Progress", value: 25, count: 0, color: "#16A34A" },
//         { name: "Pending", value: 20, count: 0, color: "#FACC15" },
//         { name: "Cancelled", value: 15, count: 0, color: "#DC2626" },
//       ];

//   return (
//     <DashboardLayout>
//       {/* Main Grid for Three Columns */}
//       <div className="w-full mt-4 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {/* Column 1 - Vendor & Store Info */}
//         <div className="space-y-4 w-full flex flex-col">
//           {/* Vendor Info */}
//           <div>
//             <div className="border-2 border-[#FF7B1D] rounded-xl shadow-lg p-6 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 min-h-[160px] relative hover:shadow-xl transition-all duration-300">
//               {/* Orange Badge Icon */}
//               <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-full flex items-center justify-center text-white z-10 shadow-lg">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   className="w-4 h-4"
//                 >
//                   <path d="M12 2L2 7v7c0 5 5 10 10 10s10-5 10-10V7l-10-5zm0 2.18l7 3.5v5.32c0 4-3.2 8-7 8s-7-4-7-8V7.68l7-3.5zM12 8l-2 4h4l-2-4zm0 6.5l-1.5 3h3L12 14.5z" />
//                 </svg>
//               </div>

//               <div className="flex flex-col sm:flex-row justify-between items-start w-full">
//                 {/* Left Section */}
//                 <div className="flex items-center sm:ml-14 ml-10 w-full sm:w-auto gap-4 relative z-0">
//                   {/* Vendor Image */}
//                   <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold flex-shrink-0 overflow-hidden border-4 border-white shadow-lg">
//                     {storeInfo.storeImage && storeInfo.storeImage.length > 0 ? (
//                       <img
//                         src={storeInfo.storeImage[0].url}
//                         alt="Store"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       "IMG"
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                       Store ID
//                     </p>
//                     <p className="text-lg font-bold text-gray-900">
//                       {storeInfo.storeId || vendorData.storeId || "N/A"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Right Section */}
//                 <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 w-full sm:w-auto">
//                   <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide mb-1">
//                     Status
//                   </p>
//                   <div
//                     className={`px-4 py-2 rounded-lg font-bold text-sm ${
//                       vendorData.isActive
//                         ? "bg-green-100 text-green-700 border-2 border-green-300"
//                         : "bg-red-100 text-red-700 border-2 border-red-300"
//                     }`}
//                   >
//                     {vendorData.isActive ? "✓ Active" : "✗ Inactive"}
//                   </div>
//                 </div>
//               </div>

//               {/* Performance Badge */}
//               {storeInfo.performance !== undefined && (
//                 <div className="mt-4 flex justify-center">
//                   <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
//                     ⭐ Performance: {storeInfo.performance}%
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Store Image */}
//           <div className="mb-4">
//             <h2 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
//               <span className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 p-2 rounded-lg">
//                 <svg
//                   className="w-5 h-5 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                   />
//                 </svg>
//               </span>
//               Store Image
//             </h2>
//             <div className="border-2 border-gray-200 rounded-xl shadow-lg p-6 bg-gradient-to-br from-gray-50 to-white text-center min-h-[180px] sm:min-h-[200px] flex items-center justify-center hover:shadow-xl transition-all duration-300">
//               {storeInfo.storeImage && storeInfo.storeImage.length > 0 ? (
//                 <img
//                   src={storeInfo.storeImage[0].url}
//                   alt="Store"
//                   className="max-w-full max-h-full object-contain rounded-lg shadow-md"
//                 />
//               ) : vendorData.storeImage && vendorData.storeImage.length > 0 ? (
//                 <img
//                   src={vendorData.storeImage[0].url}
//                   alt="Store"
//                   className="max-w-full max-h-full object-contain rounded-lg shadow-md"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center gap-2">
//                   <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
//                     <svg
//                       className="w-8 h-8 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                       />
//                     </svg>
//                   </div>
//                   <span className="text-gray-500 font-medium">
//                     No image available
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Store Location */}
//           <div className="mb-4">
//             <h2 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
//               <span className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
//                 <svg
//                   className="w-5 h-5 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//               </span>
//               Store Location
//             </h2>
//             <div className="border-2 border-gray-200 rounded-xl shadow-lg p-6 bg-gradient-to-br from-blue-50 to-white text-center min-h-[220px] sm:min-h-[240px] flex items-center justify-center hover:shadow-xl transition-all duration-300">
//               <div className="flex flex-col items-center gap-3">
//                 <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
//                   <svg
//                     className="w-10 h-10 text-blue-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 </div>
//                 <p className="text-gray-600 font-semibold">Map View</p>
//                 <p className="text-xs text-gray-500">Location visualization</p>
//               </div>
//             </div>
//           </div>

//           {/* Store Details */}
//           <div className="w-full">
//             <h2 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
//               <span className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 p-2 rounded-lg">
//                 <svg
//                   className="w-5 h-5 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                   />
//                 </svg>
//               </span>
//               Store Details
//             </h2>
//             <div className="border-2 border-[#FF7B1D] rounded-xl shadow-lg p-6 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 text-sm space-y-3 hover:shadow-xl transition-all duration-300 w-full">
//               <div className="grid grid-cols-1 gap-3 w-full">
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Latitude:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {storeDetails.latitude ||
//                       vendorData.storeAddress?.latitude ||
//                       "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Longitude:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {storeDetails.longitude ||
//                       vendorData.storeAddress?.longitude ||
//                       "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Authorized Person:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {storeDetails.authorizedPerson ||
//                       vendorData.vendorName ||
//                       "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Contact:
//                   </span>
//                   <span className="font-bold text-gray-900 flex items-center gap-2 text-right ml-2">
//                     {storeDetails.contact || vendorData.contactNumber || "N/A"}
//                     {vendorData.contactNumberVerified && (
//                       <span className="text-green-600 font-bold">✓</span>
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Alt Contact:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {storeDetails.altContact ||
//                       vendorData.altContactNumber ||
//                       "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Email:
//                   </span>
//                   <span className="font-bold text-gray-900 text-xs text-right break-all ml-2">
//                     {storeDetails.email || vendorData.email || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     DOB:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {storeDetails.dateOfBirth ||
//                       vendorData.dateOfBirth ||
//                       "N/A"}
//                     {vendorData.age && ` (${vendorData.age} yrs)`}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Gender:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {storeDetails.gender ||
//                       (vendorData.gender
//                         ? vendorData.gender.charAt(0).toUpperCase() +
//                           vendorData.gender.slice(1)
//                         : "N/A")}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Service Radius:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {vendorData.serviceRadius || "N/A"} km
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     Handling Charge:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {vendorData.handlingChargePercentage || "N/A"}%
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-200 w-full">
//                   <span className="font-semibold text-gray-700 flex-shrink-0">
//                     FSSAI Number:
//                   </span>
//                   <span className="font-bold text-gray-900 text-right break-words ml-2">
//                     {vendorData.fssaiNumber || "N/A"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Store Address */}
//           <div className="w-full">
//             <h2 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
//               <span className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
//                 <svg
//                   className="w-5 h-5 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//               </span>
//               Store Address
//             </h2>
//             <div className="border-2 border-purple-300 rounded-xl shadow-lg p-6 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 text-sm space-y-3 hover:shadow-xl transition-all duration-300 w-full">
//               <div className="grid grid-cols-1 gap-3 w-full">
//                 <div className="p-3 bg-white/70 rounded-lg border border-purple-200 w-full">
//                   <span className="font-semibold text-gray-700 block mb-1">
//                     Address Line 1:
//                   </span>
//                   <span className="text-gray-900 font-medium break-words">
//                     {storeAddress.addressLine1 ||
//                       vendorData.storeAddress?.line1 ||
//                       "N/A"}
//                   </span>
//                 </div>
//                 <div className="p-3 bg-white/70 rounded-lg border border-purple-200 w-full">
//                   <span className="font-semibold text-gray-700 block mb-1">
//                     Address Line 2:
//                   </span>
//                   <span className="text-gray-900 font-medium break-words">
//                     {storeAddress.addressLine2 ||
//                       vendorData.storeAddress?.line2 ||
//                       "N/A"}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3 w-full">
//                   <div className="p-3 bg-white/70 rounded-lg border border-purple-200">
//                     <span className="font-semibold text-gray-700 block mb-1">
//                       City:
//                     </span>
//                     <span className="text-gray-900 font-medium">
//                       {storeAddress.city ||
//                         vendorData.storeAddress?.city ||
//                         "N/A"}
//                     </span>
//                   </div>
//                   <div className="p-3 bg-white/70 rounded-lg border border-purple-200">
//                     <span className="font-semibold text-gray-700 block mb-1">
//                       State:
//                     </span>
//                     <span className="text-gray-900 font-medium">
//                       {storeAddress.state ||
//                         vendorData.storeAddress?.state ||
//                         "N/A"}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="p-3 bg-white/70 rounded-lg border border-purple-200 w-full">
//                   <span className="font-semibold text-gray-700 block mb-1">
//                     PIN Code:
//                   </span>
//                   <span className="text-gray-900 font-medium text-lg">
//                     {storeAddress.pinCode ||
//                       vendorData.storeAddress?.pinCode ||
//                       "N/A"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bank Details Section */}
//           {vendorData.bankDetails && (
//             <div className="w-full">
//               <h2 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
//                 <span className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg">
//                   <svg
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//                     />
//                   </svg>
//                 </span>
//                 Bank Details
//               </h2>
//               <div className="border-2 border-indigo-300 rounded-xl shadow-lg p-6 bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 text-sm space-y-3 hover:shadow-xl transition-all duration-300 w-full">
//                 <div className="grid grid-cols-1 gap-3 w-full">
//                   <div className="p-3 bg-white/70 rounded-lg border border-indigo-200">
//                     <span className="font-semibold text-gray-700 block mb-1">
//                       Bank Name:
//                     </span>
//                     <span className="text-gray-900 font-bold text-base">
//                       {vendorData.bankDetails.bankName || "N/A"}
//                     </span>
//                   </div>
//                   <div className="p-3 bg-white/70 rounded-lg border border-indigo-200">
//                     <span className="font-semibold text-gray-700 block mb-1">
//                       Account Number:
//                     </span>
//                     <span className="text-gray-900 font-bold text-base">
//                       {vendorData.bankDetails.accountNumber || "N/A"}
//                     </span>
//                   </div>
//                   <div className="p-3 bg-white/70 rounded-lg border border-indigo-200">
//                     <span className="font-semibold text-gray-700 block mb-1">
//                       IFSC Code:
//                     </span>
//                     <span className="text-gray-900 font-bold text-base">
//                       {vendorData.bankDetails.ifsc || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//                 {vendorData.bankDetails.cancelCheque?.url && (
//                   <div className="mt-4 p-4 bg-white rounded-lg border-2 border-indigo-200">
//                     <p className="font-bold text-gray-800 mb-3 text-sm">
//                       Cancel Cheque:
//                     </p>
//                     <img
//                       src={vendorData.bankDetails.cancelCheque.url}
//                       alt="Cancel Cheque"
//                       className="max-w-full max-h-40 object-contain rounded-lg shadow-md"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Documents Section */}
//           {vendorData.documents && (
//             <div className="w-full">
//               <h2 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
//                 <span className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2 rounded-lg">
//                   <svg
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                 </span>
//                 Documents
//               </h2>
//               <div className="border-2 border-cyan-300 rounded-xl shadow-lg p-6 bg-gradient-to-br from-cyan-50 via-white to-cyan-50 text-sm space-y-4 hover:shadow-xl transition-all duration-300 w-full">
//                 <div className="grid grid-cols-1 gap-4 w-full">
//                   {vendorData.documents.panCardFront?.url && (
//                     <div className="p-4 bg-white rounded-lg border-2 border-cyan-200 hover:border-cyan-400 transition-all">
//                       <p className="font-bold text-gray-800 mb-2 text-sm">
//                         PAN Card (Front):
//                       </p>
//                       <img
//                         src={vendorData.documents.panCardFront.url}
//                         alt="PAN Front"
//                         className="max-w-full max-h-40 object-contain rounded-lg shadow-md"
//                       />
//                     </div>
//                   )}
//                   {vendorData.documents.panCardBack?.url && (
//                     <div className="p-4 bg-white rounded-lg border-2 border-cyan-200 hover:border-cyan-400 transition-all">
//                       <p className="font-bold text-gray-800 mb-2 text-sm">
//                         PAN Card (Back):
//                       </p>
//                       <img
//                         src={vendorData.documents.panCardBack.url}
//                         alt="PAN Back"
//                         className="max-w-full max-h-40 object-contain rounded-lg shadow-md"
//                       />
//                     </div>
//                   )}
//                   {vendorData.documents.aadharCardFront?.url && (
//                     <div className="p-4 bg-white rounded-lg border-2 border-cyan-200 hover:border-cyan-400 transition-all">
//                       <p className="font-bold text-gray-800 mb-2 text-sm">
//                         Aadhar Card (Front):
//                       </p>
//                       <img
//                         src={vendorData.documents.aadharCardFront.url}
//                         alt="Aadhar Front"
//                         className="max-w-full max-h-40 object-contain rounded-lg shadow-md"
//                       />
//                     </div>
//                   )}
//                   {vendorData.documents.aadharCardBack?.url && (
//                     <div className="p-4 bg-white rounded-lg border-2 border-cyan-200 hover:border-cyan-400 transition-all">
//                       <p className="font-bold text-gray-800 mb-2 text-sm">
//                         Aadhar Card (Back):
//                       </p>
//                       <img
//                         src={vendorData.documents.aadharCardBack.url}
//                         alt="Aadhar Back"
//                         className="max-w-full max-h-40 object-contain rounded-lg shadow-md"
//                       />
//                     </div>
//                   )}
//                   {vendorData.documents.drivingLicense?.url && (
//                     <div className="p-4 bg-white rounded-lg border-2 border-cyan-200 hover:border-cyan-400 transition-all">
//                       <p className="font-bold text-gray-800 mb-2 text-sm">
//                         Driving License:
//                       </p>
//                       <img
//                         src={vendorData.documents.drivingLicense.url}
//                         alt="Driving License"
//                         className="max-w-full max-h-40 object-contain rounded-lg shadow-md"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Column 2 - Main Info & Charts */}
//         <div className="space-y-4 w-full flex flex-col">
//           {/* Vendor Info Card */}
//           <div className="flex border-2 border-orange-300 rounded-md p-2.5 bg-[#FEF0E9] h-20 relative items-center justify-between">
//             {/* Orange Badge Icon */}
//             <div className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//                 className="w-3 h-3"
//               >
//                 <path d="M12 2L2 7v7c0 5 5 10 10 10s10-5 10-10V7l-10-5zm0 2.18l7 3.5v5.32c0 4-3.2 8-7 8s-7-4-7-8V7.68l7-3.5zM12 8l-2 4h4l-2-4zm0 6.5l-1.5 3h3L12 14.5z" />
//               </svg>
//             </div>

//             {/* Left: Vendor Info */}
//             <div className="flex items-center gap-2 ml-6">
//               {vendorData.profileImage?.url ? (
//                 <img
//                   src={vendorData.profileImage.url}
//                   alt="Vendor"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               ) : storeInfo.storeImage && storeInfo.storeImage.length > 0 ? (
//                 <img
//                   src={storeInfo.storeImage[0].url}
//                   alt="Vendor"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               ) : vendorData.storeImage && vendorData.storeImage.length > 0 ? (
//                 <img
//                   src={vendorData.storeImage[0].url}
//                   alt="Vendor"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
//                   {vendorData.vendorName?.charAt(0) || "V"}
//                 </div>
//               )}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800">
//                   {storeInfo.storeName || vendorData.vendorName || "N/A"}
//                 </h3>
//                 <p className="text-xs text-gray-600">
//                   {vendorData.storeName || "Store"}
//                 </p>
//               </div>
//             </div>

//             {/* Right: Status */}
//             <div className="text-right mr-2">
//               <p className="text-xs text-gray-500 font-semibold">Status</p>
//               <p
//                 className={`text-lg font-bold ${vendor.isActive ? "text-green-600" : "text-red-600"}`}
//               >
//                 {vendor.isActive ? "Active" : "Inactive"}
//               </p>
//             </div>
//           </div>

//           {/* Order Overview */}
//           <div className="bg-white shadow-xl border-2 border-gray-200 rounded-xl p-6 h-[520px] relative hover:shadow-2xl transition-all duration-300">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
//                 <span className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
//                   <svg
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                     />
//                   </svg>
//                 </span>
//                 Order Overview
//               </h3>
//               <button className="text-xs border-2 border-[#FF7B1D] rounded-lg px-3 py-1.5 bg-[#FF7B1D] text-white font-semibold hover:bg-orange-600 transition-all flex items-center gap-2">
//                 📅 Today
//               </button>
//             </div>
//             <hr className="border-gray-300 mb-4"></hr>
//             {/* Pie Chart */}
//             <div className="mt-4">
//               <ResponsiveContainer width="100%" height={240}>
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     dataKey="value"
//                     cx="50%"
//                     cy="50%"
//                     startAngle={180}
//                     endAngle={0}
//                     innerRadius={80}
//                     outerRadius={120}
//                     paddingAngle={2}
//                   >
//                     {chartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-center">
//               <p className="text-gray-500 text-sm">Total Orders</p>
//               <p className="text-2xl font-bold">
//                 {orderOverview?.totalOrders ||
//                   orderOverview?.totalAttendance ||
//                   0}
//               </p>
//             </div>

//             <div className="mt-6 space-y-3">
//               {chartData.map((entry, idx) => (
//                 <div
//                   key={idx}
//                   className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span
//                       className="inline-block w-4 h-4 rounded-full shadow-sm"
//                       style={{ backgroundColor: entry.color }}
//                     ></span>
//                     <span className="font-semibold text-gray-800">
//                       {entry.name}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <span className="font-bold text-gray-900 text-base">
//                       {entry.value}%
//                     </span>
//                     <span className="text-xs text-gray-600 ml-2">
//                       ({entry.count || 0})
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between items-center border-t-2 border-gray-200 mt-6 pt-4">
//               {/* Left: Order List */}
//               <div className="flex items-center gap-4">
//                 <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">
//                   Order List
//                 </p>

//                 {/* Avatars - Show order count */}
//                 <div className="flex items-center gap-2">
//                   {orderList.slice(0, 3).map((order, idx) => (
//                     <div
//                       key={order.id}
//                       className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#FF7B1D] to-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-md"
//                     >
//                       {idx + 1}
//                     </div>
//                   ))}
//                   {orderList.length > 3 && (
//                     <span className="text-xs bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white rounded-full px-3 py-1 font-bold shadow-md">
//                       +{orderList.length - 3}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Right: View Details Button */}
//               <button className="text-[#FF7B1D] text-sm font-bold hover:text-orange-600 transition-colors border-2 border-[#FF7B1D] px-4 py-1.5 rounded-lg hover:bg-[#FF7B1D] hover:text-white transition-all">
//                 View Details
//               </button>
//             </div>
//           </div>

//           {/* Announcement */}
//           <div className="bg-white shadow-xl border-2 border-gray-200 rounded-xl p-6 min-h-[400px] hover:shadow-2xl transition-all duration-300">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
//                 <span className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
//                   <svg
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
//                     />
//                   </svg>
//                 </span>
//                 Announcement
//               </h3>
//               <button className="text-xs border-2 border-amber-500 rounded-lg px-3 py-1.5 bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-all">
//                 View All
//               </button>
//             </div>

//             <hr className="border-gray-300 mb-4" />

//             <div className="flex flex-col gap-4">
//               <button className="bg-gradient-to-r from-[#3B7080] to-teal-600 text-white text-sm px-4 py-2 rounded-lg font-bold w-max shadow-lg hover:shadow-xl transition-all">
//                 📢 Invitation
//               </button>

//               <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-lg border-2 border-amber-200">
//                 <p className="text-base text-gray-800 mb-2 font-bold">
//                   We are now open new shop...
//                 </p>
//                 <p className="text-xs text-gray-600 mb-3 font-medium">
//                   {vendorData.createdAt
//                     ? `📅 ${formatDate(vendorData.createdAt)} | Created by: ${vendorData.createdBy?.name || "Admin"}`
//                     : "📅 24 Sept 2025 | 🕒 10:30 AM"}
//                 </p>
//                 {vendorData.createdBy && (
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-gray-700">
//                         Created By:
//                       </span>
//                       <span className="text-gray-900 font-semibold">
//                         {vendorData.createdBy.name}
//                       </span>
//                       <span className="text-gray-600 text-xs">
//                         ({vendorData.createdBy.email})
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-gray-700">
//                         Last Updated:
//                       </span>
//                       <span className="text-gray-900 font-semibold">
//                         {vendorData.updatedAt
//                           ? formatDate(vendorData.updatedAt)
//                           : "N/A"}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Column 3 - Stat Cards */}
//         <div className="space-y-4 w-full flex flex-col">
//           {/* Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {[
//               {
//                 title: "Category Use",
//                 value: metrics.categoryUse || 0,
//                 iconColor: "bg-black",
//                 iconType: "svgHuman",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-purple-200 text-purple-700",
//               },
//               {
//                 title: "Sub Category Use",
//                 value: metrics.subCategoryUse || 0,
//                 iconColor: "bg-green-700",
//                 iconType: "lawm",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-orange-100 text-orange-600",
//               },
//               {
//                 title: "Total Products",
//                 value: metrics.totalProducts || 0,
//                 iconColor: "bg-blue-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Product Published",
//                 value: metrics.productPublished || 0,
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Product In Review",
//                 value: metrics.productInReview || 0,
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Total Order",
//                 value: metrics.totalOrder || 0,
//                 iconColor: "bg-black",
//                 iconType: "svgHuman",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-purple-200 text-purple-700",
//               },
//               {
//                 title: "Total Delivered Order",
//                 value: metrics.totalDeliveredOrder || 0,
//                 iconColor: "bg-green-500",
//                 iconType: "lawm",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-orange-100 text-orange-600",
//               },
//               {
//                 title: "Total Canceled Order",
//                 value: metrics.totalCanceledOrder || 0,
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Total Riders",
//                 value: metrics.totalRiders || 0,
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Ratings",
//                 value: metrics.ratings || 0,
//                 iconColor: "bg-black",
//                 iconType: "svgHuman",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-purple-200 text-purple-700",
//               },
//               {
//                 title: "Inventory",
//                 value: metrics.inventory || 0,
//                 iconColor: "bg-green-500",
//                 iconType: "lawm",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-orange-100 text-orange-600",
//               },
//               {
//                 title: "Amount",
//                 value: metrics.amount
//                   ? `₹${parseFloat(metrics.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
//                   : "₹0.00",
//                 iconColor: "bg-red-500",
//                 iconType: "redIcon",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//               {
//                 title: "Ticket",
//                 value: metrics.ticket || 0,
//                 iconColor: "bg-green-500",
//                 iconType: "lawm",
//                 percentage: "+19.01%",
//                 percentageColor: "bg-gray-200 text-gray-700",
//               },
//             ].map((card, idx) => (
//               <div
//                 key={idx}
//                 className="flex flex-col justify-between bg-white p-4 rounded-xl shadow-lg border-2 border-gray-200 h-[100px] hover:shadow-xl hover:border-[#FF7B1D] transition-all duration-300"
//               >
//                 {/* Top section */}
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     {/* Colored ball with icon inside */}
//                     <div
//                       className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-lg ${card.iconColor}`}
//                     >
//                       {card.iconType === "svgHuman" ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="currentColor"
//                           viewBox="0 0 24 24"
//                           className="w-5 h-5 text-white"
//                         >
//                           <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                         </svg>
//                       ) : card.iconType === "lawm" ? (
//                         <span className="text-white text-sm font-bold">律</span>
//                       ) : card.iconType === "redIcon" ? (
//                         <span className="text-white text-sm font-bold">輪</span>
//                       ) : null}
//                     </div>
//                     <span className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
//                       {card.title}
//                     </span>
//                   </div>
//                   <div
//                     className={`px-3 py-1 rounded-lg border-2 ${card.percentageColor} text-xs font-bold`}
//                   >
//                     {card.percentage}
//                   </div>
//                 </div>

//                 {/* Bottom-left value */}
//                 <div className="text-xl font-bold text-gray-900 flex justify-start">
//                   {card.value}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Delivery Partners */}
//           <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg w-full hover:shadow-xl transition-all duration-300">
//             {/* Header */}
//             <div className="flex justify-between items-center border-b-2 border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
//               <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
//                 <span className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
//                   <svg
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                     />
//                   </svg>
//                 </span>
//                 Delivery Partners
//               </h2>
//               <button className="text-xs border-2 border-blue-500 rounded-lg px-4 py-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all">
//                 View All
//               </button>
//             </div>

//             {partners.length > 0 ? (
//               <>
//                 {/* Table Header */}
//                 <div className="grid grid-cols-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wide px-6 py-3 border-b-2 border-gray-200">
//                   <span>Name</span>
//                   <span className="text-center">Date</span>
//                   <span className="text-right">Status</span>
//                 </div>

//                 {/* Table Rows */}
//                 <div>
//                   {partners.map((partner) => (
//                     <div
//                       key={partner.id}
//                       className="grid grid-cols-3 items-center px-6 py-4 border-b-2 border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
//                     >
//                       {/* Left: Profile */}
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-md border-2 border-white">
//                           {partner.name?.charAt(0) || "R"}
//                         </div>
//                         <div>
//                           <p className="font-bold text-gray-900 text-sm truncate">
//                             {partner.name}
//                           </p>
//                           <p className="text-xs text-gray-600 font-medium">
//                             {partner.mobileNumber}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Center: Date */}
//                       <div className="text-center text-xs text-gray-700 font-semibold">
//                         {partner.joinedDate
//                           ? formatDate(partner.joinedDate)
//                           : "N/A"}
//                       </div>

//                       {/* Right: Status */}
//                       <div className="flex justify-end">
//                         <span
//                           className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${
//                             partner.status === "Online"
//                               ? "bg-blue-100 text-blue-700 border-blue-300"
//                               : partner.status === "Offline"
//                                 ? "bg-gray-100 text-gray-700 border-gray-300"
//                                 : "bg-green-100 text-green-700 border-green-300"
//                           }`}
//                         >
//                           {partner.status}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8 text-gray-500 text-sm">
//                 No delivery partners found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default VendorDetails;
/////////////////////////////////////

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import api from "../../api/api";
import {
  TrendingUp,
  TrendingDown,
  X,
  ZoomIn,
  ExternalLink,
  ChevronRight,
  Package,
  ShoppingCart,
  Truck,
  Star,
  Wallet,
  Tag,
  BarChart2,
  Users,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  Building2,
  ShieldCheck,
} from "lucide-react";

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({ image, title, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,20,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#FF7B1D] to-[#ff5e00]">
          <span className="text-white font-bold tracking-wide">{title}</span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div
          className="flex items-center justify-center bg-gray-950 p-6"
          style={{ minHeight: 320, maxHeight: "72vh" }}
        >
          <img
            src={image}
            alt={title}
            className="max-w-full object-contain rounded-lg"
            style={{ maxHeight: "64vh" }}
          />
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Press ESC or click outside to close
          </span>
          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FF7B1D] hover:text-orange-600"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Full Size
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Clickable Image ──────────────────────────────────────────────────────────
const ClickableImage = ({ src, alt, label, onView, className }) => (
  <div
    className="group relative cursor-pointer"
    onClick={() => onView(src, label || alt)}
  >
    <img src={src} alt={alt} className={className} />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center rounded-lg">
      <div className="opacity-0 group-hover:opacity-100 transition-all bg-white rounded-full p-2.5 shadow-xl">
        <ZoomIn className="w-5 h-5 text-[#FF7B1D]" />
      </div>
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({
  icon: Icon,
  title,
  color = "from-[#FF7B1D] to-orange-600",
  action,
}) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-bold text-gray-800 text-base flex items-center gap-2.5">
      <span className={`bg-gradient-to-br ${color} p-2 rounded-xl shadow-md`}>
        <Icon className="w-4 h-4 text-white" />
      </span>
      {title}
    </h2>
    {action}
  </div>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, mono }) => (
  <div className="flex items-center justify-between py-2.5 px-3 bg-white/70 rounded-xl border border-orange-100 hover:border-orange-300 hover:bg-white transition-all">
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">
      {label}
    </span>
    <span
      className={`text-sm font-bold text-gray-900 text-right ml-2 break-all ${mono ? "font-mono" : ""}`}
    >
      {value}
    </span>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, gradient, trend }) => (
  <div className="relative bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 overflow-hidden group">
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br ${gradient}`}
    />
    <div className="flex items-start justify-between mb-3">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
        {trend}
      </span>
    </div>
    <p className="text-xl font-black text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wide">
      {title}
    </p>
  </div>
);

const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPagination, setOrdersPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [ordersPage, setOrdersPage] = useState(1);

  const openLightbox = useCallback((src, title) => {
    if (src) setLightbox({ src, title });
  }, []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  // Fetch vendor orders
  const fetchVendorOrders = async (page = 1) => {
    if (!id) return;
    try {
      setOrdersLoading(true);
      console.log("========================================");
      console.log("📦 FETCHING VENDOR ORDERS");
      console.log("========================================");
      console.log("Vendor ID:", id);
      console.log("Page:", page);

      const response = await api.get(`/api/admin/vendors/${id}/orders`, {
        params: {
          page: page,
          limit: 20,
        },
      });

      console.log("Orders API Response:", response.data);

      if (response.data && response.data.success) {
        setOrders(response.data.data || []);
        setOrdersPagination(
          response.data.pagination || {
            page: page,
            limit: 20,
            total: response.data.count || 0,
            pages: Math.ceil((response.data.count || 0) / 20),
          },
        );
        console.log("✅ Orders fetched successfully");
        console.log("Total orders:", response.data.count);
        console.log("Orders data:", response.data.data);
      } else {
        console.error("❌ Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
      console.error("Error response:", error.response);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && id) {
      fetchVendorOrders(ordersPage);
    }
  }, [activeTab, id, ordersPage]);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        let endpointUsed = "";

        console.log("========================================");
        console.log("🔍 FETCHING VENDOR DATA");
        console.log("========================================");
        console.log("Vendor ID:", id);

        // Try /api/vendor/:id first (correct endpoint)
        try {
          endpointUsed = `/api/vendor/${id}`;
          console.log("📍 Trying endpoint 1:", endpointUsed);
          response = await api.get(endpointUsed);
          console.log("✅ Endpoint 1 SUCCESS!");
        } catch (e) {
          console.log("❌ Endpoint 1 FAILED");
          console.log("Error status:", e.response?.status);
          console.log("Error message:", e.message);
          console.log("Error data:", e.response?.data);

          // Fallback to /vendor/:id if /api/vendor/:id fails
          if (e.response?.status === 404) {
            try {
              endpointUsed = `/vendor/${id}`;
              console.log("📍 Trying endpoint 2 (fallback):", endpointUsed);
              response = await api.get(endpointUsed);
              console.log("✅ Endpoint 2 SUCCESS!");
            } catch (fallbackError) {
              console.log("❌ Endpoint 2 also FAILED");
              console.log("Fallback error:", fallbackError);
              throw fallbackError;
            }
          } else {
            throw e;
          }
        }

        console.log("========================================");
        console.log("📦 RAW API RESPONSE");
        console.log("========================================");
        console.log("Endpoint used:", endpointUsed);
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        console.log("Full response object:", response);
        console.log("Response.data:", response.data);
        console.log("Response.data type:", typeof response.data);
        console.log(
          "Response.data keys:",
          response.data ? Object.keys(response.data) : "No data",
        );

        const result = response.data;
        console.log("========================================");
        console.log("📊 PROCESSED RESULT");
        console.log("========================================");
        console.log("Result:", result);
        console.log("Result.success:", result?.success);
        console.log("Result.data:", result?.data);
        console.log("Result.vendor:", result?.vendor);

        if (result?.success) {
          let dataToUse = result.data || (result.vendor ? result : null);
          console.log("Data to use:", dataToUse);
          console.log(
            "Data to use keys:",
            dataToUse ? Object.keys(dataToUse) : "No data",
          );

          if (!dataToUse) {
            console.error("❌ No data received from API");
            setError("No data received from API");
            return;
          }

          // Log metrics
          if (dataToUse.metrics) {
            console.log("========================================");
            console.log("📈 METRICS DATA");
            console.log("========================================");
            console.log("Metrics:", dataToUse.metrics);
            console.log("Metrics keys:", Object.keys(dataToUse.metrics));
            console.log("Category Use:", dataToUse.metrics.categoryUse);
            console.log("Sub Category Use:", dataToUse.metrics.subCategoryUse);
            console.log("Total Products:", dataToUse.metrics.totalProducts);
            console.log(
              "Product Published:",
              dataToUse.metrics.productPublished,
            );
            console.log(
              "Product In Review:",
              dataToUse.metrics.productInReview,
            );
            console.log("Total Order:", dataToUse.metrics.totalOrder);
            console.log(
              "Total Delivered Order:",
              dataToUse.metrics.totalDeliveredOrder,
            );
            console.log(
              "Total Canceled Order:",
              dataToUse.metrics.totalCanceledOrder,
            );
            console.log("Total Riders:", dataToUse.metrics.totalRiders);
            console.log("Ratings:", dataToUse.metrics.ratings);
            console.log("Inventory:", dataToUse.metrics.inventory);
            console.log("Amount (Revenue):", dataToUse.metrics.amount);
          }

          // Log order overview
          if (dataToUse.orderOverview) {
            console.log("========================================");
            console.log("📋 ORDER OVERVIEW DATA");
            console.log("========================================");
            console.log("Order Overview:", dataToUse.orderOverview);
            console.log("Total Orders:", dataToUse.orderOverview.totalOrders);
            console.log(
              "Status Distribution:",
              dataToUse.orderOverview.statusDistribution,
            );
            if (dataToUse.orderOverview.statusDistribution) {
              console.log(
                "Completed:",
                dataToUse.orderOverview.statusDistribution.completed,
              );
              console.log(
                "In Progress:",
                dataToUse.orderOverview.statusDistribution.in_progress,
              );
              console.log(
                "Pending:",
                dataToUse.orderOverview.statusDistribution.pending,
              );
              console.log(
                "Cancelled:",
                dataToUse.orderOverview.statusDistribution.cancelled,
              );
            }
          }

          setDashboardData(dataToUse);
          let vendorData = {};
          if (dataToUse.vendor && Object.keys(dataToUse.vendor).length > 0)
            vendorData = dataToUse.vendor;
          else if (dataToUse.id || dataToUse.vendorName || dataToUse.storeId)
            vendorData = dataToUse;
          else if (result.vendor && Object.keys(result.vendor).length > 0)
            vendorData = result.vendor;
          else if (result.id || result.vendorName || result.storeId)
            vendorData = result;

          console.log("========================================");
          console.log("👤 VENDOR DATA EXTRACTED");
          console.log("========================================");
          console.log("Vendor Data:", vendorData);
          console.log("Vendor Data keys:", Object.keys(vendorData));

          setVendor(vendorData);
          console.log("✅ Data set successfully!");
          console.log("========================================");
        } else {
          console.error("❌ API returned success: false");
          console.error("Error message:", result?.message);
          setError(result?.message || "Failed to fetch vendor data");
        }
      } catch (err) {
        console.log("========================================");
        console.log("❌ ERROR FETCHING VENDOR DATA");
        console.log("========================================");
        console.error("Error:", err);
        console.error("Error response:", err.response);
        console.error("Error status:", err.response?.status);
        console.error("Error data:", err.response?.data);
        console.error("Error message:", err.message);
        console.log("========================================");

        if (err.response?.status === 404) {
          setError("Vendor not found.");
        } else if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("Access denied.");
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Error fetching vendor data.",
          );
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVendorData();
    else {
      setError("No vendor ID provided");
      setLoading(false);
    }
  }, [id]);

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <div className="w-14 h-14 border-4 border-orange-200 border-t-[#FF7B1D] rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading vendor details...</p>
        </div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-700 font-semibold">{error}</p>
          <p className="text-sm text-gray-400">Vendor ID: {id}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            ← Go Back
          </button>
        </div>
      </DashboardLayout>
    );

  const vendorData = dashboardData?.vendor || vendor || {};
  const storeInfo = dashboardData?.storeInfo || {};
  const storeDetails = dashboardData?.storeDetails || {};
  const storeAddress = dashboardData?.storeAddress || {};
  const orderOverview = dashboardData?.orderOverview || {};
  const metrics = dashboardData?.metrics || {};
  const wallet = dashboardData?.wallet || {};
  const partners = dashboardData?.deliveryPartners || [];
  const vendorInvoices = dashboardData?.invoices || [];
  const orderList = orderOverview?.orderList || [];

  // Helper function to safely extract percentage value
  const getPercentageValue = (statusObj) => {
    if (!statusObj) return 0;
    if (typeof statusObj === "number") return statusObj;
    if (typeof statusObj === "object" && statusObj.percentage !== undefined) {
      return typeof statusObj.percentage === "number"
        ? statusObj.percentage
        : 0;
    }
    return 0;
  };

  // Helper function to safely extract count value
  const getCountValue = (statusObj) => {
    if (!statusObj) return 0;
    if (typeof statusObj === "object" && statusObj.count !== undefined) {
      return typeof statusObj.count === "number" ? statusObj.count : 0;
    }
    return 0;
  };

  const chartData = [
    {
      name: "Completed",
      value:
        getPercentageValue(orderOverview?.statusDistribution?.completed) || 40,
      count: getCountValue(orderOverview?.statusDistribution?.completed),
      color: "#1e3a5f",
    },
    {
      name: "In Progress",
      value:
        getPercentageValue(orderOverview?.statusDistribution?.in_progress) ||
        25,
      count: getCountValue(orderOverview?.statusDistribution?.in_progress),
      color: "#16A34A",
    },
    {
      name: "Pending",
      value:
        getPercentageValue(orderOverview?.statusDistribution?.pending) || 20,
      count: getCountValue(orderOverview?.statusDistribution?.pending),
      color: "#F59E0B",
    },
    {
      name: "Cancelled",
      value:
        getPercentageValue(orderOverview?.statusDistribution?.cancelled) || 15,
      count: getCountValue(orderOverview?.statusDistribution?.cancelled),
      color: "#EF4444",
    },
  ];

  const statCards = [
    {
      title: "Category Use",
      value: metrics.categoryUse || 0,
      icon: Tag,
      gradient: "from-violet-500 to-purple-600",
      trend: "+19%",
    },
    {
      title: "Sub Category",
      value: metrics.subCategoryUse || 0,
      icon: BarChart2,
      gradient: "from-emerald-500 to-green-600",
      trend: "+12%",
    },
    {
      title: "Total Products",
      value: metrics.totalProducts || 0,
      icon: Package,
      gradient: "from-blue-500 to-indigo-600",
      trend: "+8%",
    },
    {
      title: "Published",
      value: metrics.productPublished || 0,
      icon: ShieldCheck,
      gradient: "from-cyan-500 to-teal-600",
      trend: "+5%",
    },
    {
      title: "In Review",
      value: metrics.productInReview || 0,
      icon: Clock,
      gradient: "from-amber-500 to-yellow-600",
      trend: "+3%",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrder || 0,
      icon: ShoppingCart,
      gradient: "from-[#FF7B1D] to-orange-600",
      trend: "+19%",
    },
    {
      title: "Delivered",
      value: metrics.totalDeliveredOrder || 0,
      icon: Truck,
      gradient: "from-lime-500 to-green-600",
      trend: "+22%",
    },
    {
      title: "Cancelled",
      value: metrics.totalCanceledOrder || 0,
      icon: X,
      gradient: "from-red-500 to-rose-600",
      trend: "-4%",
    },
    {
      title: "Riders",
      value: metrics.totalRiders || 0,
      icon: Users,
      gradient: "from-sky-500 to-blue-600",
      trend: "+11%",
    },
    {
      title: "Ratings",
      value: metrics.ratings || 0,
      icon: Star,
      gradient: "from-yellow-400 to-amber-500",
      trend: "+0.2",
    },
    {
      title: "Inventory",
      value: metrics.inventory || 0,
      icon: Building2,
      gradient: "from-pink-500 to-rose-500",
      trend: "+7%",
    },
    {
      title: "Revenue",
      value: metrics.amount
        ? `₹${parseFloat(metrics.amount).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`
        : "₹0",
      icon: Wallet,
      gradient: "from-[#FF7B1D] to-red-500",
      trend: "+14%",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "docs", label: "Documents" },
    { id: "partners", label: "Partners" },
  ];

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .animate-fadeIn { animation: fadeIn 0.25s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      {lightbox && (
        <Lightbox
          image={lightbox.src}
          title={lightbox.title}
          onClose={closeLightbox}
        />
      )}

      {/* ── Hero Header ────────────────────────────────────────── */}
      <div className="mx-0 mt-4 mb-6 rounded-sm bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-0 ml-6 sm:p-7 shadow-sm overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #FF7B1D 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ff5e00 0%, transparent 50%)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-[#FF7B1D]/40 overflow-hidden bg-orange-900 flex items-center justify-center text-white text-2xl font-black shadow-xl cursor-pointer flex-shrink-0"
            onClick={() => {
              const u = storeInfo.storeImage?.[0]?.url;
              if (u) openLightbox(u, "Store Image");
            }}
          >
            {storeInfo.storeImage?.[0]?.url ? (
              <img
                src={storeInfo.storeImage[0].url}
                alt="Store"
                className="w-full h-full object-cover"
              />
            ) : (
              (storeInfo.storeName || vendorData.vendorName || "V").charAt(0)
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-white truncate">
                {storeInfo.storeName || vendorData.vendorName || "Vendor"}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold border ${vendorData.isActive ? "bg-green-500/20 text-green-300 border-green-500/40" : "bg-red-500/20 text-red-300 border-red-500/40"}`}
              >
                {vendorData.isActive ? "● Active" : "○ Inactive"}
              </span>
            </div>
            <p className="text-orange-300 text-sm font-semibold">
              Store ID: {storeInfo.storeId || vendorData.storeId || id}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {storeAddress.city || vendorData.storeAddress?.city || ""}
              {storeAddress.state ? `, ${storeAddress.state}` : ""}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3 flex-wrap">
            {[
              {
                label: "Total Orders",
                value: (() => {
                  const total =
                    orderOverview?.totalOrders || metrics.totalOrder || 0;
                  if (typeof total === "number") return total;
                  if (typeof total === "object" && total !== null) {
                    return total.count || total.value || 0;
                  }
                  return 0;
                })(),
              },
              { label: "Rating", value: metrics.ratings || "—" },
              { label: "Products", value: metrics.totalProducts || 0 },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 text-center border border-white/10"
              >
                <p className="text-white font-black text-lg">{s.value}</p>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Bar */}
        {storeInfo.performance !== undefined && (
          <div className="mt-5 relative">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Performance Score</span>
              <span className="text-[#FF7B1D] font-bold">
                {storeInfo.performance}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-full transition-all duration-1000"
                style={{ width: `${storeInfo.performance}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Tab Nav ────────────────────────────────────────────── */}
      <div className="px-0 ml-6 mb-4 flex gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === t.id ? "bg-[#FF7B1D] text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Main Content ───────────────────────────────────────── */}
      <div className="px-0 ml-6 pb-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Col 1: Store Info + Address + Bank */}
            <div className="space-y-4">
              {/* Store Image */}
              {(() => {
                const storeImgUrl =
                  storeInfo.storeImage?.[0]?.url ||
                  vendorData.storeImage?.[0]?.url ||
                  vendorData.profileImage?.url ||
                  null;
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                    <div className="px-5 pt-5 pb-3">
                      <SectionHeader
                        icon={FileText}
                        title="Store Image"
                        color="from-[#FF7B1D] to-orange-600"
                      />
                    </div>
                    <div className="mx-5 mb-5 rounded-xl overflow-hidden border-2 border-orange-200 h-52 bg-gradient-to-br from-gray-50 to-orange-50 relative">
                      {storeImgUrl ? (
                        <div
                          className="group relative w-full h-full cursor-pointer"
                          onClick={() =>
                            openLightbox(storeImgUrl, "Store Image")
                          }
                        >
                          <img
                            src={storeImgUrl}
                            alt="Store"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          {/* Error fallback */}
                          <div className="hidden w-full h-full absolute inset-0 flex-col items-center justify-center gap-2 text-gray-400">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-sm">
                              Image failed to load
                            </span>
                          </div>
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all bg-white rounded-full p-3 shadow-xl">
                              <ZoomIn className="w-6 h-6 text-[#FF7B1D]" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                            <FileText className="w-7 h-7 text-orange-300" />
                          </div>
                          <span className="text-sm font-medium">
                            No image available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Store Details */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border-2 border-orange-200 shadow-md p-5">
                <SectionHeader
                  icon={Building2}
                  title="Store Details"
                  color="from-[#FF7B1D] to-orange-600"
                />
                <div className="space-y-1.5">
                  {[
                    [
                      "Authorized Person",
                      storeDetails.authorizedPerson || vendorData.vendorName,
                    ],
                    [
                      "Contact",
                      storeDetails.contact || vendorData.contactNumber,
                    ],
                    [
                      "Alt Contact",
                      storeDetails.altContact || vendorData.altContactNumber,
                    ],
                    ["Email", storeDetails.email || vendorData.email],
                    ["DOB", storeDetails.dateOfBirth || vendorData.dateOfBirth],
                    ["Gender", storeDetails.gender || vendorData.gender],
                    [
                      "Latitude",
                      storeDetails.latitude ||
                        vendorData.storeAddress?.latitude,
                    ],
                    [
                      "Longitude",
                      storeDetails.longitude ||
                        vendorData.storeAddress?.longitude,
                    ],
                    [
                      "Service Radius",
                      vendorData.serviceRadius
                        ? `${vendorData.serviceRadius} km`
                        : null,
                    ],
                    [
                      "Handling Charge",
                      vendorData.handlingChargePercentage
                        ? `${vendorData.handlingChargePercentage}%`
                        : null,
                    ],
                    ["FSSAI No.", vendorData.fssaiNumber],
                  ]
                    .filter(([, v]) => v)
                    .map(([l, v]) => (
                      <InfoRow key={l} label={l} value={v} />
                    ))}
                </div>
              </div>

              {/* Store Address */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-200 shadow-md p-5">
                <SectionHeader
                  icon={MapPin}
                  title="Store Address"
                  color="from-purple-500 to-purple-600"
                />
                <div className="space-y-2">
                  <div className="p-3 bg-white/80 rounded-xl border border-purple-100">
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">
                      Address Line 1
                    </p>
                    <p className="text-sm font-bold text-gray-900 break-words">
                      {storeAddress.addressLine1 ||
                        vendorData.storeAddress?.line1 ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-purple-100">
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">
                      Address Line 2
                    </p>
                    <p className="text-sm font-bold text-gray-900 break-words">
                      {storeAddress.addressLine2 ||
                        vendorData.storeAddress?.line2 ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white/80 rounded-xl border border-purple-100">
                      <p className="text-xs font-semibold text-gray-500 mb-0.5">
                        City
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {storeAddress.city ||
                          vendorData.storeAddress?.city ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="p-3 bg-white/80 rounded-xl border border-purple-100">
                      <p className="text-xs font-semibold text-gray-500 mb-0.5">
                        State
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {storeAddress.state ||
                          vendorData.storeAddress?.state ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500">
                      PIN Code
                    </p>
                    <p className="text-lg font-black text-purple-700">
                      {storeAddress.pinCode ||
                        vendorData.storeAddress?.pinCode ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              {vendorData.bankDetails && (
                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border-2 border-indigo-200 shadow-md p-5">
                  <SectionHeader
                    icon={CreditCard}
                    title="Bank Details"
                    color="from-indigo-500 to-indigo-600"
                  />
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      ["Bank", vendorData.bankDetails.bankName],
                      ["Account", vendorData.bankDetails.accountNumber],
                      ["IFSC", vendorData.bankDetails.ifsc],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        className="p-3 bg-white rounded-xl border border-indigo-100 text-center"
                      >
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          {l}
                        </p>
                        <p className="text-xs font-black text-gray-900 break-all">
                          {v || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                  {vendorData.bankDetails.cancelCheque?.url && (
                    <div className="p-3 bg-white rounded-xl border-2 border-indigo-100">
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Cancel Cheque
                      </p>
                      <ClickableImage
                        src={vendorData.bankDetails.cancelCheque.url}
                        alt="Cancel Cheque"
                        label="Cancel Cheque"
                        onView={openLightbox}
                        className="max-w-full h-28 object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Col 2: Order Chart + Announcement */}
            <div className="space-y-4">
              {/* Order Overview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                    <span className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-md">
                      <BarChart2 className="w-4 h-4 text-white" />
                    </span>
                    Order Overview
                  </h3>
                  <span className="text-xs bg-[#FF7B1D] text-white font-bold px-3 py-1.5 rounded-lg">
                    Today
                  </span>
                </div>

                {/* Donut Chart */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        startAngle={210}
                        endAngle={-30}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v, n) => [`${v}%`, n]}
                        contentStyle={{
                          borderRadius: 10,
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-3xl font-black text-gray-900">
                      {typeof orderOverview?.totalOrders === "number"
                        ? orderOverview.totalOrders
                        : typeof orderOverview?.totalOrders === "object"
                          ? orderOverview.totalOrders?.count ||
                            orderOverview.totalOrders?.value ||
                            0
                          : 0}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      Total Orders
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {chartData.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs font-semibold text-gray-700">
                          {entry.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-gray-900">
                          {entry.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcement */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                    <span className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-xl shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                        />
                      </svg>
                    </span>
                    Announcements
                  </h3>
                  <button className="text-xs bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-all">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-md">
                    📢 Invitation
                  </span>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200">
                    <p className="font-bold text-gray-900 mb-1">
                      We are now open new shop...
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      📅{" "}
                      {vendorData.createdAt
                        ? formatDate(vendorData.createdAt)
                        : "24 Sept 2025"}{" "}
                      · {vendorData.createdBy?.name || "Admin"}
                    </p>
                    {vendorData.createdBy && (
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-gray-600">
                            Created By:
                          </span>
                          <span className="font-bold text-gray-900">
                            {vendorData.createdBy.name}
                          </span>
                          <span className="text-gray-500">
                            ({vendorData.createdBy.email})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-gray-600">
                            Last Updated:
                          </span>
                          <span className="font-bold text-gray-900">
                            {vendorData.updatedAt
                              ? formatDate(vendorData.updatedAt)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Location Map */}
              {(() => {
                const lat =
                  storeDetails.latitude ||
                  vendorData.storeAddress?.latitude ||
                  vendorData.latitude;
                const lng =
                  storeDetails.longitude ||
                  vendorData.storeAddress?.longitude ||
                  vendorData.longitude;
                const hasCoords = lat && lng;
                const city =
                  storeAddress.city || vendorData.storeAddress?.city || "";
                const state =
                  storeAddress.state || vendorData.storeAddress?.state || "";
                const storeName =
                  storeInfo.storeName || vendorData.vendorName || "Store";

                // Build Google Maps embed URL
                const mapQuery = hasCoords
                  ? `${lat},${lng}`
                  : encodeURIComponent(
                      [storeName, city, state].filter(Boolean).join(", "),
                    );
                const embedUrl = hasCoords
                  ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed&t=m`
                  : `https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed&t=m`;
                const directionsUrl = hasCoords
                  ? `https://www.google.com/maps?q=${lat},${lng}`
                  : `https://www.google.com/maps/search/${mapQuery}`;

                return (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                      <SectionHeader
                        icon={MapPin}
                        title="Store Location"
                        color="from-blue-500 to-blue-600"
                      />
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all -mt-3"
                      >
                        <ExternalLink className="w-3 h-3" /> Open Maps
                      </a>
                    </div>

                    {/* Coords badge */}
                    {hasCoords && (
                      <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="text-xs font-mono text-blue-700 font-semibold">
                          {parseFloat(lat).toFixed(6)},{" "}
                          {parseFloat(lng).toFixed(6)}
                        </span>
                      </div>
                    )}

                    {/* Map iframe */}
                    <div
                      className="mx-5 mb-5 rounded-xl overflow-hidden border-2 border-blue-100 shadow-inner"
                      style={{ height: 260 }}
                    >
                      <iframe
                        title="Store Location"
                        width="100%"
                        height="100%"
                        style={{ border: 0, display: "block" }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={embedUrl}
                      />
                    </div>

                    {/* Address beneath map */}
                    {(city || state) && (
                      <div className="mx-5 mb-5 flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600 font-medium">
                          {[
                            storeAddress.addressLine1 ||
                              vendorData.storeAddress?.line1,
                            city,
                            state,
                            storeAddress.pinCode ||
                              vendorData.storeAddress?.pinCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Col 3: Stat Cards */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {statCards.map((c, i) => (
                  <StatCard key={i} {...c} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#FF7B1D]" />
                Order List
              </h2>
              <span className="text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full">
                {ordersPagination.total || 0} Orders
              </span>
            </div>

            {ordersLoading ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-[#FF7B1D] rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 font-medium">Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <>
                <div className="divide-y divide-gray-50">
                  {orders.map((order, i) => (
                    <div
                      key={order._id || i}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7B1D] to-orange-600 flex items-center justify-center text-white text-xs font-black">
                            {(ordersPage - 1) * 20 + i + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {order.orderNumber ||
                                `Order #${(ordersPage - 1) * 20 + i + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.createdAt
                                ? formatDate(order.createdAt)
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            order.status === "delivered" ||
                            order.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : order.status === "cancelled"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
                        {/* User Info */}
                        {order.user && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Customer
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.user.userName || "N/A"}
                            </p>
                            {order.user.contactNumber && (
                              <p className="text-xs text-gray-500">
                                {order.user.contactNumber}
                              </p>
                            )}
                            {order.user.email && (
                              <p className="text-xs text-gray-500">
                                {order.user.email}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Items Count */}
                        {order.items && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Items</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        )}

                        {/* Amount */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Amount</p>
                          <p className="text-sm font-bold text-[#FF7B1D]">
                            ₹
                            {order.vendorSubtotal
                              ? parseFloat(order.vendorSubtotal).toLocaleString(
                                  "en-IN",
                                  { minimumFractionDigits: 2 },
                                )
                              : "0.00"}
                          </p>
                        </div>
                      </div>

                      {/* Rider Info */}
                      {order.rider && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Rider</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {order.rider.name || order.rider.riderName || "N/A"}
                          </p>
                          {order.rider.contactNumber && (
                            <p className="text-xs text-gray-500">
                              {order.rider.contactNumber}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {ordersPagination.pages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {(ordersPage - 1) * ordersPagination.limit + 1} to{" "}
                      {Math.min(
                        ordersPage * ordersPagination.limit,
                        ordersPagination.total,
                      )}{" "}
                      of {ordersPagination.total} orders
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOrdersPage((p) => Math.max(p - 1, 1))}
                        disabled={ordersPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <div className="flex gap-1">
                        {Array.from(
                          { length: Math.min(ordersPagination.pages, 5) },
                          (_, i) => {
                            let pageNum;
                            if (ordersPagination.pages <= 5) {
                              pageNum = i + 1;
                            } else if (ordersPage <= 3) {
                              pageNum = i + 1;
                            } else if (
                              ordersPage >=
                              ordersPagination.pages - 2
                            ) {
                              pageNum = ordersPagination.pages - 4 + i;
                            } else {
                              pageNum = ordersPage - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setOrdersPage(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                  ordersPage === pageNum
                                    ? "bg-[#FF7B1D] text-white"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setOrdersPage((p) =>
                            Math.min(p + 1, ordersPagination.pages),
                          )
                        }
                        disabled={ordersPage === ordersPagination.pages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "docs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorData.documents ? (
              <>
                {/* PAN Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
                  <SectionHeader
                    icon={FileText}
                    title="PAN Card"
                    color="from-cyan-500 to-cyan-600"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {["panCardFront", "panCardBack"].map((key, i) => (
                      <div
                        key={key}
                        className="rounded-xl overflow-hidden border-2 border-gray-100"
                      >
                        <p className="text-center text-xs font-bold text-gray-500 py-2 bg-gray-50">
                          {i === 0 ? "Front" : "Back"}
                        </p>
                        {vendorData.documents[key]?.url ? (
                          <div className="p-2">
                            <ClickableImage
                              src={vendorData.documents[key].url}
                              alt={`PAN ${i === 0 ? "Front" : "Back"}`}
                              label={`PAN Card ${i === 0 ? "Front" : "Back"}`}
                              onView={openLightbox}
                              className="w-full h-28 object-contain rounded-lg"
                            />
                            <p className="text-center text-xs text-[#FF7B1D] font-semibold mt-1">
                              Click to view
                            </p>
                          </div>
                        ) : (
                          <div className="h-28 flex items-center justify-center bg-gray-50 m-2 rounded-lg">
                            <p className="text-xs text-gray-400">
                              Not uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aadhar Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
                  <SectionHeader
                    icon={ShieldCheck}
                    title="Aadhar Card"
                    color="from-indigo-500 to-indigo-600"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {["aadharCardFront", "aadharCardBack"].map((key, i) => (
                      <div
                        key={key}
                        className="rounded-xl overflow-hidden border-2 border-gray-100"
                      >
                        <p className="text-center text-xs font-bold text-gray-500 py-2 bg-gray-50">
                          {i === 0 ? "Front" : "Back"}
                        </p>
                        {vendorData.documents[key]?.url ? (
                          <div className="p-2">
                            <ClickableImage
                              src={vendorData.documents[key].url}
                              alt={`Aadhar ${i === 0 ? "Front" : "Back"}`}
                              label={`Aadhar Card ${i === 0 ? "Front" : "Back"}`}
                              onView={openLightbox}
                              className="w-full h-28 object-contain rounded-lg"
                            />
                            <p className="text-center text-xs text-[#FF7B1D] font-semibold mt-1">
                              Click to view
                            </p>
                          </div>
                        ) : (
                          <div className="h-28 flex items-center justify-center bg-gray-50 m-2 rounded-lg">
                            <p className="text-xs text-gray-400">
                              Not uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driving License */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
                  <SectionHeader
                    icon={CreditCard}
                    title="Driving License"
                    color="from-violet-500 to-violet-600"
                  />
                  {vendorData.documents.drivingLicense?.url ? (
                    <div className="rounded-xl overflow-hidden border-2 border-gray-100 p-3">
                      <ClickableImage
                        src={vendorData.documents.drivingLicense.url}
                        alt="Driving License"
                        label="Driving License"
                        onView={openLightbox}
                        className="w-full h-36 object-contain rounded-lg"
                      />
                      <p className="text-center text-xs text-[#FF7B1D] font-semibold mt-2">
                        Click to view
                      </p>
                    </div>
                  ) : (
                    <div className="h-36 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-sm text-gray-400">Not uploaded</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="col-span-3 py-16 text-center">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">
                  No documents uploaded
                </p>
              </div>
            )}
          </div>
        )}

        {/* PARTNERS TAB */}
        {activeTab === "partners" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <h2 className="font-black text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Delivery Partners
              </h2>
              <span className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full">
                {partners.length} Partners
              </span>
            </div>
            {partners.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="hidden sm:grid sm:grid-cols-4 bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wide px-6 py-3 border-b border-gray-100">
                  <span>Partner</span>
                  <span>Contact</span>
                  <span className="text-center">Joined</span>
                  <span className="text-right">Status</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {partners.map((partner, i) => (
                    <div
                      key={partner.id || i}
                      className="px-6 py-4 flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 hover:bg-blue-50/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">
                          {partner.name?.charAt(0) || "R"}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">
                          {partner.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium sm:ml-0 ml-13">
                        {partner.mobileNumber || "—"}
                      </span>
                      <span className="text-sm text-gray-600 font-medium text-center">
                        {partner.joinedDate
                          ? formatDate(partner.joinedDate)
                          : "—"}
                      </span>
                      <div className="flex sm:justify-end">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            partner.status === "Online"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : partner.status === "Offline"
                                ? "bg-gray-50 text-gray-600 border-gray-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          {partner.status || "Available"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-16 text-center">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">
                  No delivery partners found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VendorDetails;
