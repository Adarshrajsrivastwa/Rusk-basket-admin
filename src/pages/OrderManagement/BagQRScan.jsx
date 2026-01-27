// import React, { useState } from "react";
// import {
//   Package,
//   QrCode,
//   History,
//   Truck,
//   CheckCircle,
//   User,
//   Phone,
//   MapPin,
//   Download,
//   Printer,
//   Search,
//   AlertCircle,
//   Clock,
//   Plus,
//   X,
// } from "lucide-react";

// // Stat Card Component
// export const StatCard = ({ icon, label, value, color, small = false }) => (
//   <div
//     className={`bg-white p-5 rounded-lg shadow-md border-t-4 border-${color}-500 hover:shadow-xl transition-all`}
//   >
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-600 font-bold mb-1">{label}</p>
//         <p
//           className={`${
//             small ? "text-xl" : "text-3xl"
//           } font-bold text-${color}-600`}
//         >
//           {value}
//         </p>
//       </div>
//       {icon}
//     </div>
//   </div>
// );

// // Tab Button Component
// export const TabButton = ({ active, onClick, icon, label }) => (
//   <button
//     onClick={onClick}
//     className={`px-6 py-4 font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
//       active
//         ? "border-b-4 border-orange-500 text-orange-500"
//         : "text-gray-600 hover:text-orange-500"
//     }`}
//   >
//     {icon}
//     {label}
//   </button>
// );

// // Info Row Component
// export const InfoRow = ({ label, value, highlight = false }) => (
//   <div className="flex justify-between items-center py-3 border-b border-gray-200">
//     <span className="text-gray-700 font-semibold text-sm">{label}:</span>
//     <span
//       className={`${
//         highlight
//           ? "font-bold text-orange-500 text-base"
//           : "font-semibold text-gray-900"
//       }`}
//     >
//       {value}
//     </span>
//   </div>
// );

// // Add Extra Item Modal
// export const AddExtraItemModal = ({
//   isOpen,
//   onClose,
//   onAddItem,
//   availableProducts,
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [searchBy, setSearchBy] = useState("all");

//   if (!isOpen) return null;

//   const filteredProducts = availableProducts.filter((product) => {
//     const query = searchQuery.toLowerCase();
//     if (!query) return true;

//     switch (searchBy) {
//       case "sku":
//         return product.sku.toLowerCase().includes(query);
//       case "category":
//         return product.category.toLowerCase().includes(query);
//       case "name":
//         return product.name.toLowerCase().includes(query);
//       default:
//         return (
//           product.name.toLowerCase().includes(query) ||
//           product.sku.toLowerCase().includes(query) ||
//           product.category.toLowerCase().includes(query)
//         );
//     }
//   });

//   const handleAdd = () => {
//     if (!selectedProduct) {
//       alert("⚠️ Please select a product!");
//       return;
//     }
//     if (quantity < 1) {
//       alert("⚠️ Quantity must be at least 1!");
//       return;
//     }
//     onAddItem(selectedProduct, quantity);
//     setSelectedProduct(null);
//     setQuantity(1);
//     setSearchQuery("");
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 border-t-4 border-purple-500 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <Plus size={28} className="text-purple-500" />
//             Add Extra Item to Bag
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg mb-4">
//           <p className="text-purple-900 font-semibold text-sm">
//             💡 Add complimentary items, free gifts, or additional products that
//             weren't in the original order
//           </p>
//         </div>

//         <div className="mb-4 space-y-3">
//           <div className="flex gap-2 flex-wrap">
//             <button
//               onClick={() => setSearchBy("all")}
//               className={`px-4 py-2 rounded-lg font-semibold transition-all ${
//                 searchBy === "all"
//                   ? "bg-purple-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setSearchBy("name")}
//               className={`px-4 py-2 rounded-lg font-semibold transition-all ${
//                 searchBy === "name"
//                   ? "bg-purple-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               Product Name
//             </button>
//             <button
//               onClick={() => setSearchBy("sku")}
//               className={`px-4 py-2 rounded-lg font-semibold transition-all ${
//                 searchBy === "sku"
//                   ? "bg-purple-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               SKU
//             </button>
//             <button
//               onClick={() => setSearchBy("category")}
//               className={`px-4 py-2 rounded-lg font-semibold transition-all ${
//                 searchBy === "category"
//                   ? "bg-purple-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               Category
//             </button>
//           </div>

//           <div className="relative">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder={`Search by ${
//                 searchBy === "all" ? "name, SKU, or category" : searchBy
//               }...`}
//               className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-medium"
//             />
//           </div>
//         </div>

//         <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
//           {filteredProducts.length === 0 ? (
//             <div className="text-center py-8">
//               <Package className="mx-auto text-gray-300 mb-3" size={48} />
//               <p className="text-gray-500 font-medium">No products found</p>
//             </div>
//           ) : (
//             filteredProducts.map((product) => (
//               <div
//                 key={product.id}
//                 onClick={() => setSelectedProduct(product)}
//                 className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                   selectedProduct?.id === product.id
//                     ? "border-purple-500 bg-purple-50 shadow-lg"
//                     : "border-gray-200 hover:border-purple-300 hover:shadow-md"
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-white rounded-lg border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
//                     <Package className="text-purple-500" size={32} />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between mb-2">
//                       <h4 className="text-lg font-bold text-gray-900">
//                         {product.name}
//                       </h4>
//                       {selectedProduct?.id === product.id && (
//                         <CheckCircle className="text-purple-600" size={24} />
//                       )}
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="text-gray-700">
//                         <span className="font-semibold">SKU:</span>{" "}
//                         {product.sku}
//                       </div>
//                       <div className="text-gray-700">
//                         <span className="font-semibold">Category:</span>{" "}
//                         {product.category}
//                       </div>
//                       <div className="text-gray-700">
//                         <span className="font-semibold">Price:</span> ₹
//                         {product.price.toLocaleString("en-IN")}
//                       </div>
//                       <div className="text-gray-700">
//                         <span className="font-semibold">Seller:</span>{" "}
//                         {product.seller}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {selectedProduct && (
//           <div className="bg-purple-50 border-2 border-purple-500 p-4 rounded-lg mb-4">
//             <h4 className="font-bold text-purple-900 mb-3">
//               Selected: {selectedProduct.name}
//             </h4>
//             <div className="flex items-center gap-4">
//               <label className="text-sm font-bold text-purple-900">
//                 Quantity:
//               </label>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
//                 >
//                   −
//                 </button>
//                 <input
//                   type="number"
//                   value={quantity}
//                   onChange={(e) =>
//                     setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                   }
//                   min="1"
//                   className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-center font-bold text-lg focus:border-purple-500 focus:outline-none"
//                 />
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAdd}
//             disabled={!selectedProduct}
//             className={`flex-1 ${
//               !selectedProduct
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-purple-600 hover:bg-purple-700"
//             } text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2`}
//           >
//             <Plus size={20} />
//             Add to Bag
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Packing Tab Content
// export const PackingTab = ({
//   products,
//   bagDetails,
//   setIsScanModalOpen,
//   handleManualUpdate,
//   handleRemoveExtraItem,
//   setIsAddExtraItemModalOpen,
// }) => (
//   <div className="space-y-4">
//     <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
//       <h2 className="text-2xl font-bold text-gray-900">Scan Items to Pack</h2>
//       <div className="flex gap-3">
//         <button
//           onClick={() => setIsAddExtraItemModalOpen(true)}
//           disabled={bagDetails.sealed}
//           className={`${
//             bagDetails.sealed
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-purple-500 hover:bg-purple-600"
//           } text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2`}
//         >
//           <Plus size={20} />
//           Add Extra Item
//         </button>
//         <button
//           onClick={() => setIsScanModalOpen(true)}
//           disabled={bagDetails.sealed}
//           className={`${
//             bagDetails.sealed
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-orange-500 hover:bg-orange-600"
//           } text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2`}
//         >
//           <QrCode size={20} />
//           Scan QR Code
//         </button>
//       </div>
//     </div>

//     <div className="space-y-4">
//       {products.map((product) => {
//         const isComplete = product.scanned === product.quantity;
//         const isPartial =
//           product.scanned > 0 && product.scanned < product.quantity;
//         const isExtra = product.isExtra || false;

//         return (
//           <div
//             key={product.id}
//             className={`p-5 rounded-lg border-2 ${
//               isExtra
//                 ? "bg-purple-50 border-purple-500"
//                 : isComplete
//                   ? "bg-green-50 border-green-500"
//                   : isPartial
//                     ? "bg-yellow-50 border-yellow-500"
//                     : "bg-white border-gray-200"
//             } hover:shadow-lg transition-all`}
//           >
//             <div className="flex justify-between items-start gap-4">
//               <div className="flex-1">
//                 <div className="flex items-start gap-3 mb-3">
//                   <div className="flex-shrink-0">
//                     {isExtra ? (
//                       <Plus className="text-purple-500" size={32} />
//                     ) : isComplete ? (
//                       <CheckCircle className="text-green-500" size={32} />
//                     ) : isPartial ? (
//                       <AlertCircle className="text-yellow-500" size={32} />
//                     ) : (
//                       <Package className="text-gray-400" size={32} />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <h3 className="font-bold text-gray-900 text-lg">
//                         {product.name}
//                       </h3>
//                       {isExtra && (
//                         <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
//                           EXTRA
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex flex-wrap gap-3 text-sm text-gray-600">
//                       <span className="font-medium">SKU: {product.sku}</span>
//                       <span>•</span>
//                       <span className="font-medium">
//                         ₹{product.price.toLocaleString("en-IN")}
//                       </span>
//                       <span>•</span>
//                       <span className="text-blue-600 font-medium">
//                         {product.seller}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 mt-3 flex-wrap">
//                   <span
//                     className={`px-4 py-2 rounded-lg font-bold text-sm ${
//                       isExtra
//                         ? "bg-purple-600 text-white"
//                         : isComplete
//                           ? "bg-green-600 text-white"
//                           : isPartial
//                             ? "bg-yellow-600 text-white"
//                             : "bg-gray-300 text-gray-700"
//                     }`}
//                   >
//                     Scanned: {product.scanned}/{product.quantity}
//                   </span>
//                   {!bagDetails.sealed && (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           handleManualUpdate(product.id, "decrement")
//                         }
//                         disabled={product.scanned === 0}
//                         className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold disabled:bg-gray-300 transition-all"
//                       >
//                         −
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleManualUpdate(product.id, "increment")
//                         }
//                         disabled={product.scanned >= product.quantity}
//                         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold disabled:bg-gray-300 transition-all"
//                       >
//                         +
//                       </button>
//                     </div>
//                   )}
//                   {isExtra && !bagDetails.sealed && (
//                     <button
//                       onClick={() => handleRemoveExtraItem(product.id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1"
//                     >
//                       <X size={16} />
//                       Remove Extra
//                     </button>
//                   )}
//                 </div>
//               </div>
//               <div className="w-20 h-20 bg-white rounded-lg border-2 border-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
//                 <QrCode className="text-orange-500" size={40} />
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// );

// // Scan History Tab
// export const HistoryTab = ({ scanHistory }) => (
//   <div className="space-y-4">
//     <h2 className="text-2xl font-bold text-gray-900 mb-4">
//       Scan History ({scanHistory.length})
//     </h2>

//     {scanHistory.length === 0 ? (
//       <div className="text-center py-16">
//         <History className="mx-auto text-gray-300 mb-4" size={64} />
//         <p className="text-gray-500 font-medium">
//           No scans yet. Start scanning items!
//         </p>
//       </div>
//     ) : (
//       <div className="space-y-3">
//         {scanHistory.map((scan) => (
//           <div
//             key={scan.id}
//             className="bg-white p-5 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all"
//           >
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <span
//                     className={`px-3 py-1 rounded-lg text-xs font-bold ${
//                       scan.status === "scanned"
//                         ? "bg-green-100 text-green-700 border border-green-300"
//                         : scan.status === "extra_added"
//                           ? "bg-purple-100 text-purple-700 border border-purple-300"
//                           : "bg-blue-100 text-blue-700 border border-blue-300"
//                     }`}
//                   >
//                     {scan.status === "scanned"
//                       ? "✓ SCANNED"
//                       : scan.status === "extra_added"
//                         ? "➕ EXTRA ADDED"
//                         : "✓ MANUAL"}
//                   </span>
//                   <p className="font-bold text-gray-900">{scan.productName}</p>
//                 </div>
//                 <p className="text-sm text-gray-600 font-medium">
//                   SKU: {scan.sku}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-2">
//                   {scan.time} • {scan.operator}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// // Bag Details Tab
// export const BagDetailsTab = ({ bagDetails, id, orderValue, totalItems }) => (
//   <div className="space-y-6">
//     <h2 className="text-2xl font-bold text-gray-900 mb-4">Bag Information</h2>

//     {!bagDetails.sealed ? (
//       <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-white p-8 rounded-lg border-2 border-orange-500">
//         <Package className="mx-auto text-orange-500 mb-4" size={64} />
//         <h3 className="text-xl font-bold text-gray-900 mb-2">
//           Bag Not Sealed Yet
//         </h3>
//         <p className="text-gray-600 font-medium mb-4">
//           Complete scanning all items to seal the bag
//         </p>
//       </div>
//     ) : (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border-2 border-orange-500 shadow-lg">
//           <h3 className="font-bold text-xl mb-5 text-gray-900 border-b-2 border-orange-500 pb-3 flex items-center gap-2">
//             <Package size={24} />
//             Bag Details
//           </h3>
//           <div className="space-y-4">
//             <InfoRow label="Bag Number" value={bagDetails.bagNo} highlight />
//             <InfoRow label="Order ID" value={id || "OD8038403974"} />
//             <InfoRow label="Total Items" value={totalItems} />
//             <InfoRow
//               label="Order Value"
//               value={`₹${orderValue.toLocaleString("en-IN")}`}
//             />
//             <InfoRow label="Weight" value={bagDetails.weight} />
//             <InfoRow label="Dimensions" value={bagDetails.dimensions} />
//             <InfoRow label="Status" value={bagDetails.status} highlight />
//             <InfoRow label="Start Time" value={bagDetails.startTime} />
//             <InfoRow label="Complete Time" value={bagDetails.completeTime} />
//             <InfoRow label="Sealed" value="Yes ✅" highlight />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center shadow-lg">
//           <div className="w-64 h-64 bg-gradient-to-br from-orange-100 to-white rounded-lg flex items-center justify-center mb-4 border-4 border-orange-500 shadow-md">
//             <QrCode className="text-orange-500" size={160} />
//           </div>
//           <p className="font-bold text-xl text-gray-900 mb-2">
//             {bagDetails.bagQRCode}
//           </p>
//           <p className="text-sm text-gray-600 font-medium mb-4">
//             Scan this QR to track bag
//           </p>
//           <div className="flex gap-3">
//             <button
//               onClick={() =>
//                 alert(`📥 Downloading QR Code: ${bagDetails.bagQRCode}`)
//               }
//               className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
//             >
//               <Download size={18} />
//               Download
//             </button>
//             <button
//               onClick={() => window.print()}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
//             >
//               <Printer size={18} />
//               Print
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// );

// // Delivery Tab
// export const DeliveryTab = ({
//   assignmentStatus,
//   selectedPartner,
//   bagDetails,
//   handleAssignPartner,
//   handleMarkPickedUp,
//   id,
//   totalItems,
//   orderValue,
// }) => (
//   <div className="space-y-6">
//     <div className="flex justify-between items-center">
//       <h2 className="text-2xl font-bold text-gray-900">
//         Delivery Partner Assignment
//       </h2>
//       {assignmentStatus === "pending" && (
//         <button
//           onClick={handleAssignPartner}
//           disabled={!bagDetails.sealed}
//           className={`${
//             !bagDetails.sealed
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-orange-500 hover:bg-orange-600"
//           } text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2`}
//         >
//           <Truck size={20} />
//           Assign Partner
//         </button>
//       )}
//     </div>

//     {assignmentStatus === "pending" && !selectedPartner && (
//       <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg border-2 border-blue-500">
//         <Truck className="mx-auto text-blue-500 mb-4" size={64} />
//         <h3 className="text-xl font-bold text-gray-900 mb-2">
//           No Delivery Partner Assigned
//         </h3>
//         <p className="text-gray-600 font-medium mb-4">
//           {bagDetails.sealed
//             ? "Click 'Assign Partner' to assign a delivery partner for this bag"
//             : "Complete and seal the bag first to assign a delivery partner"}
//         </p>
//       </div>
//     )}

//     {(assignmentStatus === "assigned" || assignmentStatus === "picked_up") &&
//       selectedPartner && (
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border-2 border-green-500 shadow-lg">
//             <div className="flex items-center gap-2 mb-4">
//               <CheckCircle className="text-green-600" size={24} />
//               <h3 className="font-bold text-xl text-gray-900">
//                 {assignmentStatus === "picked_up"
//                   ? "Bag Picked Up - Out for Delivery"
//                   : "Partner Assigned"}
//               </h3>
//             </div>

//             <div className="flex items-start gap-6">
//               <img
//                 src={selectedPartner.avatar}
//                 alt={selectedPartner.name}
//                 className="w-24 h-24 rounded-full border-4 border-green-500 shadow-lg"
//               />
//               <div className="flex-1">
//                 <h4 className="text-2xl font-bold text-gray-900 mb-2">
//                   {selectedPartner.name}
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <Phone size={18} className="text-green-600" />
//                     <span className="font-medium">{selectedPartner.phone}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <Truck size={18} className="text-green-600" />
//                     <span className="font-medium">
//                       {selectedPartner.vehicle} - {selectedPartner.vehicleNo}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <MapPin size={18} className="text-green-600" />
//                     <span className="font-medium">
//                       {selectedPartner.currentLocation}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <User size={18} className="text-green-600" />
//                     <span className="font-medium">
//                       ⭐ {selectedPartner.rating} ({selectedPartner.deliveries}{" "}
//                       deliveries)
//                     </span>
//                   </div>
//                 </div>

//                 {assignmentStatus === "assigned" && (
//                   <div className="mt-4">
//                     <button
//                       onClick={handleMarkPickedUp}
//                       className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
//                     >
//                       <CheckCircle size={20} />
//                       Mark as Picked Up
//                     </button>
//                   </div>
//                 )}

//                 {assignmentStatus === "picked_up" && (
//                   <div className="mt-4 bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
//                     <p className="text-blue-900 font-semibold flex items-center gap-2">
//                       <Truck size={20} />
//                       Out for Delivery - Expected delivery today
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-md">
//             <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
//               <Package size={20} />
//               Assignment Details
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <InfoRow label="Bag Number" value={bagDetails.bagNo} />
//               <InfoRow label="Order ID" value={id || "OD8038403974"} />
//               <InfoRow label="Total Items" value={totalItems} />
//               <InfoRow
//                 label="Order Value"
//                 value={`₹${orderValue.toLocaleString("en-IN")}`}
//               />
//               <InfoRow
//                 label="Assignment Time"
//                 value={new Date().toLocaleString()}
//               />
//               <InfoRow
//                 label="Status"
//                 value={
//                   assignmentStatus === "picked_up"
//                     ? "Out for Delivery"
//                     : "Assigned"
//                 }
//                 highlight
//               />
//             </div>
//           </div>
//         </div>
//       )}
//   </div>
// );

// // Scan Modal Component
// export const ScanModal = ({
//   isOpen,
//   onClose,
//   scanInput,
//   setScanInput,
//   onSubmit,
//   products,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border-t-4 border-orange-500">
//         <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//           <QrCode size={28} />
//           Scan Item QR Code
//         </h3>
//         <div className="space-y-4">
//           <div className="text-center py-6 bg-gradient-to-br from-orange-50 to-white rounded-lg border-2 border-dashed border-orange-500">
//             <QrCode className="text-orange-500 mx-auto mb-3" size={64} />
//             <p className="text-gray-700 font-semibold">
//               Scan or enter product QR code
//             </p>
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">
//               QR Code / SKU
//             </label>
//             <input
//               type="text"
//               value={scanInput}
//               onChange={(e) => setScanInput(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") {
//                   onSubmit();
//                 }
//               }}
//               placeholder="Scan or type QR code / SKU"
//               autoFocus
//               className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none font-semibold text-lg"
//             />
//             <p className="text-xs text-gray-500 mt-2 font-medium">
//               Press Enter or click Submit after scanning
//             </p>
//           </div>

//           <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg max-h-48 overflow-y-auto">
//             <p className="text-xs font-bold text-blue-900 mb-2">
//               📋 Items in this Order:
//             </p>
//             <div className="space-y-1">
//               {products.map((p) => (
//                 <p
//                   key={p.id}
//                   className={`text-xs font-semibold ${
//                     p.scanned === p.quantity
//                       ? "text-green-700 line-through"
//                       : "text-blue-800"
//                   }`}
//                 >
//                   {p.sku}: {p.name.substring(0, 35)}... ({p.scanned}/
//                   {p.quantity})
//                 </p>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onSubmit}
//             disabled={!scanInput.trim()}
//             className={`flex-1 ${
//               !scanInput.trim()
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-orange-500 hover:bg-orange-600"
//             } text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2`}
//           >
//             <CheckCircle size={20} />
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Delivery Partner Modal Component
// export const DeliveryPartnerModal = ({
//   isOpen,
//   onClose,
//   searchPartner,
//   setSearchPartner,
//   availablePartners,
//   selectedPartner,
//   setSelectedPartner,
//   onConfirm,
//   bagDetails,
//   orderId,
//   totalItems,
//   orderValue,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6 border-t-4 border-blue-500 max-h-[90vh] overflow-y-auto">
//         <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//           <Truck size={28} />
//           Assign Delivery Partner
//         </h3>

//         <div className="mb-4">
//           <div className="relative">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <input
//               type="text"
//               value={searchPartner}
//               onChange={(e) => setSearchPartner(e.target.value)}
//               placeholder="Search delivery partner by name..."
//               className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
//             />
//           </div>
//         </div>

//         <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
//           {availablePartners.length === 0 ? (
//             <div className="text-center py-8">
//               <User className="mx-auto text-gray-300 mb-3" size={48} />
//               <p className="text-gray-500 font-medium">
//                 No available partners found
//               </p>
//             </div>
//           ) : (
//             availablePartners.map((partner) => (
//               <div
//                 key={partner.id}
//                 onClick={() => setSelectedPartner(partner)}
//                 className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                   selectedPartner?.id === partner.id
//                     ? "border-blue-500 bg-blue-50 shadow-lg"
//                     : "border-gray-200 hover:border-blue-300 hover:shadow-md"
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={partner.avatar}
//                     alt={partner.name}
//                     className="w-16 h-16 rounded-full border-2 border-blue-500"
//                   />
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between mb-2">
//                       <h4 className="text-lg font-bold text-gray-900">
//                         {partner.name}
//                       </h4>
//                       {selectedPartner?.id === partner.id && (
//                         <CheckCircle className="text-blue-600" size={24} />
//                       )}
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="flex items-center gap-1 text-gray-700">
//                         <Phone size={14} />
//                         <span className="font-medium">{partner.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-1 text-gray-700">
//                         <Truck size={14} />
//                         <span className="font-medium">
//                           {partner.vehicle} - {partner.vehicleNo}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1 text-gray-700">
//                         <MapPin size={14} />
//                         <span className="font-medium">
//                           {partner.currentLocation}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1 text-gray-700">
//                         <span className="font-medium">
//                           ⭐ {partner.rating} ({partner.deliveries} deliveries)
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {selectedPartner && (
//           <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-4">
//             <h4 className="font-bold text-orange-900 mb-2">
//               Assignment Summary:
//             </h4>
//             <div className="grid grid-cols-2 gap-2 text-sm text-orange-900">
//               <p>
//                 <span className="font-semibold">Bag:</span> {bagDetails.bagNo}
//               </p>
//               <p>
//                 <span className="font-semibold">Order:</span> {orderId}
//               </p>
//               <p>
//                 <span className="font-semibold">Items:</span> {totalItems}
//               </p>
//               <p>
//                 <span className="font-semibold">Value:</span> ₹
//                 {orderValue.toLocaleString("en-IN")}
//               </p>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={!selectedPartner}
//             className={`flex-1 ${
//               !selectedPartner
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2`}
//           >
//             <CheckCircle size={20} />
//             Confirm Assignment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState } from "react";
import {
  Package,
  QrCode,
  History,
  Truck,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Download,
  Printer,
  Search,
  AlertCircle,
  Clock,
  Plus,
  X,
} from "lucide-react";

// Stat Card Component
export const StatCard = ({ icon, label, value, color, small = false }) => (
  <div
    className={`bg-white p-5 rounded-lg shadow-md border-t-4 border-${color}-500 hover:shadow-xl transition-all`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-bold mb-1">{label}</p>
        <p
          className={`${
            small ? "text-xl" : "text-3xl"
          } font-bold text-${color}-600`}
        >
          {value}
        </p>
      </div>
      {icon}
    </div>
  </div>
);

// Tab Button Component
export const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
      active
        ? "border-b-4 border-orange-500 text-orange-500"
        : "text-gray-600 hover:text-orange-500"
    }`}
  >
    {icon}
    {label}
  </button>
);

// Info Row Component
export const InfoRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200">
    <span className="text-gray-700 font-semibold text-sm">{label}:</span>
    <span
      className={`${
        highlight
          ? "font-bold text-orange-500 text-base"
          : "font-semibold text-gray-900"
      }`}
    >
      {value}
    </span>
  </div>
);

// Add Extra Item Modal
export const AddExtraItemModal = ({
  isOpen,
  onClose,
  onAddItem,
  availableProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchBy, setSearchBy] = useState("all");

  if (!isOpen) return null;

  const filteredProducts = availableProducts.filter((product) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;

    switch (searchBy) {
      case "sku":
        return product.sku.toLowerCase().includes(query);
      case "category":
        return product.category.toLowerCase().includes(query);
      case "name":
        return product.name.toLowerCase().includes(query);
      default:
        return (
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
    }
  });

  const handleAdd = () => {
    if (!selectedProduct) {
      alert("⚠️ Please select a product!");
      return;
    }
    if (quantity < 1) {
      alert("⚠️ Quantity must be at least 1!");
      return;
    }
    onAddItem(selectedProduct, quantity);
    setSelectedProduct(null);
    setQuantity(1);
    setSearchQuery("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 border-t-4 border-purple-500 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus size={28} className="text-purple-500" />
            Add Extra Item to Bag
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg mb-4">
          <p className="text-purple-900 font-semibold text-sm">
            💡 Add complimentary items, free gifts, or additional products that
            weren't in the original order
          </p>
        </div>

        <div className="mb-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSearchBy("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                searchBy === "all"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSearchBy("name")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                searchBy === "name"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Product Name
            </button>
            <button
              onClick={() => setSearchBy("sku")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                searchBy === "sku"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              SKU
            </button>
            <button
              onClick={() => setSearchBy("category")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                searchBy === "category"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Category
            </button>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${
                searchBy === "all" ? "name, SKU, or category" : searchBy
              }...`}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">No products found</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedProduct?.id === product.id
                    ? "border-purple-500 bg-purple-50 shadow-lg"
                    : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
                    <Package className="text-purple-500" size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-gray-900">
                        {product.name}
                      </h4>
                      {selectedProduct?.id === product.id && (
                        <CheckCircle className="text-purple-600" size={24} />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-700">
                        <span className="font-semibold">SKU:</span>{" "}
                        {product.sku}
                      </div>
                      <div className="text-gray-700">
                        <span className="font-semibold">Category:</span>{" "}
                        {product.category}
                      </div>
                      <div className="text-gray-700">
                        <span className="font-semibold">Price:</span> ₹
                        {product.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-gray-700">
                        <span className="font-semibold">Seller:</span>{" "}
                        {product.seller}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedProduct && (
          <div className="bg-purple-50 border-2 border-purple-500 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-purple-900 mb-3">
              Selected: {selectedProduct.name}
            </h4>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-purple-900">
                Quantity:
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-center font-bold text-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedProduct}
            className={`flex-1 ${
              !selectedProduct
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2`}
          >
            <Plus size={20} />
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

// Packing Tab Content
export const PackingTab = ({
  products,
  bagDetails,
  setIsScanModalOpen,
  handleManualUpdate,
  handleRemoveExtraItem,
  setIsAddExtraItemModalOpen,
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
      <h2 className="text-2xl font-bold text-gray-900">Scan Items to Pack</h2>
      <div className="flex gap-3">
        <button
          onClick={() => setIsAddExtraItemModalOpen(true)}
          disabled={bagDetails.sealed}
          className={`${
            bagDetails.sealed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          } text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2`}
        >
          <Plus size={20} />
          Add Extra Item
        </button>
        <button
          onClick={() => setIsScanModalOpen(true)}
          disabled={bagDetails.sealed}
          className={`${
            bagDetails.sealed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2`}
        >
          <QrCode size={20} />
          Scan QR Code
        </button>
      </div>
    </div>

    <div className="space-y-4">
      {products.map((product) => {
        const isComplete = product.scanned === product.quantity;
        const isPartial =
          product.scanned > 0 && product.scanned < product.quantity;
        const isExtra = product.isExtra || false;

        return (
          <div
            key={product.id}
            className={`p-5 rounded-lg border-2 ${
              isExtra
                ? "bg-purple-50 border-purple-500"
                : isComplete
                  ? "bg-green-50 border-green-500"
                  : isPartial
                    ? "bg-yellow-50 border-yellow-500"
                    : "bg-white border-gray-200"
            } hover:shadow-lg transition-all`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    {isExtra ? (
                      <Plus className="text-purple-500" size={32} />
                    ) : isComplete ? (
                      <CheckCircle className="text-green-500" size={32} />
                    ) : isPartial ? (
                      <AlertCircle className="text-yellow-500" size={32} />
                    ) : (
                      <Package className="text-gray-400" size={32} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {product.name}
                      </h3>
                      {isExtra && (
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                          EXTRA
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="font-medium">SKU: {product.sku}</span>
                      <span>•</span>
                      <span className="font-medium">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">
                        {product.seller}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <span
                    className={`px-4 py-2 rounded-lg font-bold text-sm ${
                      isExtra
                        ? "bg-purple-600 text-white"
                        : isComplete
                          ? "bg-green-600 text-white"
                          : isPartial
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    Scanned: {product.scanned}/{product.quantity}
                  </span>
                  {!bagDetails.sealed && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleManualUpdate(product.id, "decrement")
                        }
                        disabled={product.scanned === 0}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold disabled:bg-gray-300 transition-all"
                      >
                        −
                      </button>
                      <button
                        onClick={() =>
                          handleManualUpdate(product.id, "increment")
                        }
                        disabled={product.scanned >= product.quantity}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold disabled:bg-gray-300 transition-all"
                      >
                        +
                      </button>
                    </div>
                  )}
                  {isExtra && !bagDetails.sealed && (
                    <button
                      onClick={() => handleRemoveExtraItem(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1"
                    >
                      <X size={16} />
                      Remove Extra
                    </button>
                  )}
                </div>
              </div>
              <div className="w-20 h-20 bg-white rounded-lg border-2 border-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
                <QrCode className="text-orange-500" size={40} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Scan History Tab
export const HistoryTab = ({ scanHistory }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Scan History ({scanHistory.length})
    </h2>

    {scanHistory.length === 0 ? (
      <div className="text-center py-16">
        <History className="mx-auto text-gray-300 mb-4" size={64} />
        <p className="text-gray-500 font-medium">
          No scans yet. Start scanning items!
        </p>
      </div>
    ) : (
      <div className="space-y-3">
        {scanHistory.map((scan) => (
          <div
            key={scan.id}
            className="bg-white p-5 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      scan.status === "scanned"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : scan.status === "extra_added"
                          ? "bg-purple-100 text-purple-700 border border-purple-300"
                          : "bg-blue-100 text-blue-700 border border-blue-300"
                    }`}
                  >
                    {scan.status === "scanned"
                      ? "✓ SCANNED"
                      : scan.status === "extra_added"
                        ? "➕ EXTRA ADDED"
                        : "✓ MANUAL"}
                  </span>
                  <p className="font-bold text-gray-900">{scan.productName}</p>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  SKU: {scan.sku}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {scan.time} • {scan.operator}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Bag Details Tab
export const BagDetailsTab = ({ bagDetails, id, orderValue, totalItems }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Bag Information</h2>

    {!bagDetails.sealed ? (
      <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-white p-8 rounded-lg border-2 border-orange-500">
        <Package className="mx-auto text-orange-500 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Bag Not Sealed Yet
        </h3>
        <p className="text-gray-600 font-medium mb-4">
          Complete scanning all items to seal the bag
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border-2 border-orange-500 shadow-lg">
          <h3 className="font-bold text-xl mb-5 text-gray-900 border-b-2 border-orange-500 pb-3 flex items-center gap-2">
            <Package size={24} />
            Bag Details
          </h3>
          <div className="space-y-4">
            <InfoRow label="Bag Number" value={bagDetails.bagNo} highlight />
            <InfoRow label="Order ID" value={id || "OD8038403974"} />
            <InfoRow label="Total Items" value={totalItems} />
            <InfoRow
              label="Order Value"
              value={`₹${orderValue.toLocaleString("en-IN")}`}
            />
            <InfoRow label="Weight" value={bagDetails.weight} />
            <InfoRow label="Dimensions" value={bagDetails.dimensions} />
            <InfoRow label="Status" value={bagDetails.status} highlight />
            <InfoRow label="Start Time" value={bagDetails.startTime} />
            <InfoRow label="Complete Time" value={bagDetails.completeTime} />
            <InfoRow label="Sealed" value="Yes ✅" highlight />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center shadow-lg">
          <div className="w-64 h-64 bg-gradient-to-br from-orange-100 to-white rounded-lg flex items-center justify-center mb-4 border-4 border-orange-500 shadow-md">
            <QrCode className="text-orange-500" size={160} />
          </div>
          <p className="font-bold text-xl text-gray-900 mb-2">
            {bagDetails.bagQRCode}
          </p>
          <p className="text-sm text-gray-600 font-medium mb-4">
            Scan this QR to track bag
          </p>
          <div className="flex gap-3">
            <button
              onClick={() =>
                alert(`📥 Downloading QR Code: ${bagDetails.bagQRCode}`)
              }
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Printer size={18} />
              Print
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

// Delivery Tab
export const DeliveryTab = ({
  assignmentStatus,
  selectedPartner,
  bagDetails,
  handleAssignPartner,
  handleMarkPickedUp,
  id,
  totalItems,
  orderValue,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">
        Delivery Partner Assignment
      </h2>
      {assignmentStatus === "pending" && (
        <button
          onClick={handleAssignPartner}
          disabled={!bagDetails.sealed}
          className={`${
            !bagDetails.sealed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2`}
        >
          <Truck size={20} />
          Assign Partner
        </button>
      )}
    </div>

    {assignmentStatus === "pending" && !selectedPartner && (
      <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg border-2 border-blue-500">
        <Truck className="mx-auto text-blue-500 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No Delivery Partner Assigned
        </h3>
        <p className="text-gray-600 font-medium mb-4">
          {bagDetails.sealed
            ? "Click 'Assign Partner' to assign a delivery partner for this bag"
            : "Complete and seal the bag first to assign a delivery partner"}
        </p>
      </div>
    )}

    {(assignmentStatus === "assigned" || assignmentStatus === "picked_up") &&
      selectedPartner && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border-2 border-green-500 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <h3 className="font-bold text-xl text-gray-900">
                {assignmentStatus === "picked_up"
                  ? "Bag Picked Up - Out for Delivery"
                  : "Partner Assigned"}
              </h3>
            </div>

            <div className="flex items-start gap-6">
              <img
                src={selectedPartner.avatar}
                alt={selectedPartner.name}
                className="w-24 h-24 rounded-full border-4 border-green-500 shadow-lg"
              />
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedPartner.name}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={18} className="text-green-600" />
                    <span className="font-medium">{selectedPartner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Truck size={18} className="text-green-600" />
                    <span className="font-medium">
                      {selectedPartner.vehicle} - {selectedPartner.vehicleNo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={18} className="text-green-600" />
                    <span className="font-medium">
                      {selectedPartner.currentLocation}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={18} className="text-green-600" />
                    <span className="font-medium">
                      ⭐ {selectedPartner.rating} ({selectedPartner.deliveries}{" "}
                      deliveries)
                    </span>
                  </div>
                </div>

                {assignmentStatus === "assigned" && (
                  <div className="mt-4">
                    <button
                      onClick={handleMarkPickedUp}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Mark as Picked Up
                    </button>
                  </div>
                )}

                {assignmentStatus === "picked_up" && (
                  <div className="mt-4 bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
                    <p className="text-blue-900 font-semibold flex items-center gap-2">
                      <Truck size={20} />
                      Out for Delivery - Expected delivery today
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-md">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} />
              Assignment Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Bag Number" value={bagDetails.bagNo} />
              <InfoRow label="Order ID" value={id || "OD8038403974"} />
              <InfoRow label="Total Items" value={totalItems} />
              <InfoRow
                label="Order Value"
                value={`₹${orderValue.toLocaleString("en-IN")}`}
              />
              <InfoRow
                label="Assignment Time"
                value={new Date().toLocaleString()}
              />
              <InfoRow
                label="Status"
                value={
                  assignmentStatus === "picked_up"
                    ? "Out for Delivery"
                    : "Assigned"
                }
                highlight
              />
            </div>
          </div>
        </div>
      )}
  </div>
);

// Scan Modal Component
export const ScanModal = ({
  isOpen,
  onClose,
  scanInput,
  setScanInput,
  onSubmit,
  products,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border-t-4 border-orange-500">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <QrCode size={28} />
          Scan Item QR Code
        </h3>
        <div className="space-y-4">
          <div className="text-center py-6 bg-gradient-to-br from-orange-50 to-white rounded-lg border-2 border-dashed border-orange-500">
            <QrCode className="text-orange-500 mx-auto mb-3" size={64} />
            <p className="text-gray-700 font-semibold">
              Scan or enter product QR code
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              QR Code / SKU
            </label>
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSubmit();
                }
              }}
              placeholder="Scan or type QR code / SKU"
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none font-semibold text-lg"
            />
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Press Enter or click Submit after scanning
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg max-h-48 overflow-y-auto">
            <p className="text-xs font-bold text-blue-900 mb-2">
              📋 Items in this Order:
            </p>
            <div className="space-y-1">
              {products.map((p) => (
                <p
                  key={p.id}
                  className={`text-xs font-semibold ${
                    p.scanned === p.quantity
                      ? "text-green-700 line-through"
                      : "text-blue-800"
                  }`}
                >
                  {p.sku}: {p.name.substring(0, 35)}... ({p.scanned}/
                  {p.quantity})
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!scanInput.trim()}
            className={`flex-1 ${
              !scanInput.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2`}
          >
            <CheckCircle size={20} />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// Delivery Partner Modal Component
export const DeliveryPartnerModal = ({
  isOpen,
  onClose,
  searchPartner,
  setSearchPartner,
  availablePartners,
  selectedPartner,
  setSelectedPartner,
  onConfirm,
  bagDetails,
  orderId,
  totalItems,
  orderValue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6 border-t-4 border-blue-500 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Truck size={28} />
          Assign Delivery Partner
        </h3>

        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchPartner}
              onChange={(e) => setSearchPartner(e.target.value)}
              placeholder="Search delivery partner by name..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {availablePartners.length === 0 ? (
            <div className="text-center py-8">
              <User className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">
                No available partners found
              </p>
            </div>
          ) : (
            availablePartners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPartner?.id === partner.id
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-16 h-16 rounded-full border-2 border-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-gray-900">
                        {partner.name}
                      </h4>
                      {selectedPartner?.id === partner.id && (
                        <CheckCircle className="text-blue-600" size={24} />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Phone size={14} />
                        <span className="font-medium">{partner.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Truck size={14} />
                        <span className="font-medium">
                          {partner.vehicle} - {partner.vehicleNo}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <MapPin size={14} />
                        <span className="font-medium">
                          {partner.currentLocation}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <span className="font-medium">
                          ⭐ {partner.rating} ({partner.deliveries} deliveries)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedPartner && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-4">
            <h4 className="font-bold text-orange-900 mb-2">
              Assignment Summary:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-orange-900">
              <p>
                <span className="font-semibold">Bag:</span> {bagDetails.bagNo}
              </p>
              <p>
                <span className="font-semibold">Order:</span> {orderId}
              </p>
              <p>
                <span className="font-semibold">Items:</span> {totalItems}
              </p>
              <p>
                <span className="font-semibold">Value:</span> ₹
                {orderValue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedPartner}
            className={`flex-1 ${
              !selectedPartner
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2`}
          >
            <CheckCircle size={20} />
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};
