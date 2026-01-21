// import React, { useState, useEffect, useRef } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import { Eye, Edit, Trash2, Download } from "lucide-react";
// import AddProductModal from "../../components/AddProduct";
// import { useNavigate } from "react-router-dom";
// import JsBarcode from "jsbarcode";

// const AllProduct = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedVendor, setSelectedVendor] = useState("All Vendors");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();
//   const itemsPerPage = 8;

//   // Hidden canvas for barcode generation
//   const canvasRef = useRef(null);

//   // 🟢 Download Barcode Function
//   const handleDownloadBarcode = (productId) => {
//     const canvas = canvasRef.current;
//     JsBarcode(canvas, productId, {
//       format: "CODE128",
//       displayValue: true,
//       fontSize: 16,
//       lineColor: "#000000",
//       background: "#ffffff",
//     });

//     const link = document.createElement("a");
//     link.download = `${productId}-barcode.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   // Simulated API data
//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => {
//       setProducts([
//         {
//           id: "PR101",
//           date: "2025-01-15",
//           vendor: "Manish Electronics",
//           category: "Electronics",
//           subCategory: "Audio",
//           price: "₹2,499",
//           status: "Approved",
//         },
//         {
//           id: "PR102",
//           date: "2025-02-05",
//           vendor: "Anish Gadgets",
//           category: "Electronics",
//           subCategory: "Audio",
//           price: "₹1,999",
//           status: "In Review",
//         },
//         {
//           id: "PR103",
//           date: "2025-03-12",
//           vendor: "Ravi Sports",
//           category: "Footwear",
//           subCategory: "Sports Shoes",
//           price: "₹3,299",
//           status: "Rejected",
//         },
//         {
//           id: "PR104",
//           date: "2025-04-20",
//           vendor: "WorkSpace Ltd",
//           category: "Furniture",
//           subCategory: "Chairs",
//           price: "₹4,999",
//           status: "Approved",
//         },
//         {
//           id: "PR105",
//           date: "2025-05-02",
//           vendor: "Tech World",
//           category: "Electronics",
//           subCategory: "Wearables",
//           price: "₹5,999",
//           status: "In Review",
//         },
//         {
//           id: "PR106",
//           date: "2025-06-15",
//           vendor: "StyleHub",
//           category: "Clothing",
//           subCategory: "Men",
//           price: "₹2,199",
//           status: "Approved",
//         },
//         {
//           id: "PR107",
//           date: "2025-07-01",
//           vendor: "Techify",
//           category: "Accessories",
//           subCategory: "Computer",
//           price: "₹1,299",
//           status: "Approved",
//         },
//         {
//           id: "PR108",
//           date: "2025-07-19",
//           vendor: "Ravi Sports",
//           category: "Footwear",
//           subCategory: "Men",
//           price: "₹3,499",
//           status: "Rejected",
//         },
//         {
//           id: "PR109",
//           date: "2025-08-11",
//           vendor: "Manish Electronics",
//           category: "Electronics",
//           subCategory: "Displays",
//           price: "₹8,999",
//           status: "Approved",
//         },
//         {
//           id: "PR110",
//           date: "2025-09-07",
//           vendor: "Fitness Zone",
//           category: "Sports",
//           subCategory: "Accessories",
//           price: "₹999",
//           status: "In Review",
//         },
//       ]);
//       setLoading(false);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, []);

//   const statusColors = {
//     Approved: "text-green-600 font-semibold",
//     "In Review": "text-yellow-600 font-semibold",
//     Rejected: "text-red-600 font-semibold",
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//     }
//   };

//   // Filtering + Pagination logic
//   const filteredByTab = products.filter((p) => {
//     if (activeTab === "approved") return p.status === "Approved";
//     if (activeTab === "in_review") return p.status === "In Review";
//     if (activeTab === "rejected") return p.status === "Rejected";
//     return true;
//   });

//   const filteredByVendor =
//     selectedVendor === "All Vendors"
//       ? filteredByTab
//       : filteredByTab.filter((p) => p.vendor === selectedVendor);

//   const searchedProducts = filteredByVendor.filter((product) =>
//     [product.id, product.vendor, product.category]
//       .join(" ")
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentProducts = searchedProducts.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(searchedProducts.length / itemsPerPage);

//   const TableSkeleton = () => (
//     <tbody>
//       {Array.from({ length: itemsPerPage }).map((_, idx) => (
//         <tr
//           key={idx}
//           className="border-b border-gray-200 animate-pulse bg-white"
//         >
//           {Array.from({ length: 9 }).map((__, j) => (
//             <td key={j} className="p-3">
//               <div className="h-4 bg-gray-200 rounded w-[80%]"></div>
//             </td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   );

//   const EmptyState = () => (
//     <tbody>
//       <tr>
//         <td
//           colSpan="9"
//           className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
//         >
//           No products found.
//         </td>
//       </tr>
//     </tbody>
//   );

//   return (
//     <DashboardLayout>
//       {/* Hidden Canvas for Barcode Generation */}
//       <canvas ref={canvasRef} className="hidden" />

//       {/* Header Section */}
//       <div className="flex flex-col lg:flex-row lg:items-center ml-8 lg:justify-between gap-4 max-w-[99%] mx-auto mt-0 mb-2">
//         <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
//           {/* Tabs */}
//           <div className="flex gap-2 items-center overflow-x-auto pb-2 lg:pb-0">
//             {[
//               { key: "all", label: "All" },
//               { key: "in_review", label: "In Review" },
//               { key: "approved", label: "Approved" },
//               { key: "rejected", label: "Rejected" },
//             ].map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => {
//                   setActiveTab(tab.key);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap ${
//                   activeTab === tab.key
//                     ? "bg-[#FF7B1D] text-white border-orange-500"
//                     : "border-gray-400 text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Vendor Filter */}
//           <div className="flex items-center">
//             <select
//               value={selectedVendor}
//               onChange={(e) => {
//                 setSelectedVendor(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="border border-black rounded text-sm px-3 h-[36px] text-gray-800 focus:outline-none"
//             >
//               <option>All Vendors</option>
//               {[...new Set(products.map((p) => p.vendor))].map((vendor) => (
//                 <option key={vendor} value={vendor}>
//                   {vendor}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Search */}
//           <div className="flex items-center border border-black rounded overflow-hidden h-[36px] w-full max-w-[100%] lg:max-w-[400px]">
//             <input
//               type="text"
//               placeholder="Search Product by ID, Vendor, or Category..."
//               className="flex-1 px-4 text-sm text-gray-800 focus:outline-none h-full"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-4 sm:px-6 h-full">
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Add Product Button */}
//         <div className="w-full md:w-auto flex justify-start md:justify-end mt-2 md:mt-0">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-black text-white w-52 sm:w-60 px-4 sm:px-10 py-2.5 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
//           >
//             + Add Product
//           </button>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-sm ml-8 shadow-sm overflow-x-auto max-w-[99%] mx-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-[#FF7B1D] text-black">
//               <th className="p-3 text-left">S.N</th>
//               <th className="p-3 text-left">Product ID</th>
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Vendor</th>
//               <th className="p-3 text-left">Category</th>
//               <th className="p-3 text-left">Sub Category</th>
//               <th className="p-3 text-left">Sell Price</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 pr-6 text-right">Action</th>
//             </tr>
//           </thead>

//           {loading ? (
//             <TableSkeleton />
//           ) : searchedProducts.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <tbody>
//               {currentProducts.map((product, idx) => (
//                 <tr
//                   key={product.id}
//                   className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
//                 >
//                   <td className="p-3">{indexOfFirst + idx + 1}</td>
//                   <td className="p-3">{product.id}</td>
//                   <td className="p-3">{product.date}</td>
//                   <td className="p-3">{product.vendor}</td>
//                   <td className="p-3">{product.category}</td>
//                   <td className="p-3">{product.subCategory}</td>
//                   <td className="p-3">{product.price}</td>
//                   <td className={`p-3 ${statusColors[product.status]}`}>
//                     {product.status}
//                   </td>
//                   <td className="p-3 text-right">
//                     <div className="flex justify-end gap-3 text-orange-600">
//                       {/* 🟢 Download Barcode Button */}
//                       <button
//                         onClick={() => handleDownloadBarcode(product.id)}
//                         className="text-orange-600 hover:text-blue-700"
//                         title="Download barcode"
//                       >
//                         <Download className="w-4 h-4" />
//                       </button>

//                       <button className="hover:text-blue-700">
//                         <Edit className="w-4 h-4" />
//                       </button>

//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="hover:text-blue-700"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>

//                       <button
//                         onClick={() => navigate(`/products/${product.id}`)}
//                         className="hover:text-blue-700"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           )}
//         </table>
//       </div>

//       <AddProductModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </DashboardLayout>
//   );
// };

// export default AllProduct;
// import React, { useState, useEffect, useRef } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import { Eye, Edit, Trash2, Download } from "lucide-react";
// import AddProductModal from "../../components/AddProduct";
// import { useNavigate } from "react-router-dom";
// import JsBarcode from "jsbarcode";

// const AllProduct = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedVendor, setSelectedVendor] = useState("All Vendors");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();
//   const itemsPerPage = 7;

//   // Hidden canvas for barcode generation
//   const canvasRef = useRef(null);

//   // 🟢 Fetch products from API
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         ""
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch products");
//       }

//       const result = await response.json();

//       if (result.success && result.data) {
//         // Transform API data to match component structure
//         const transformedProducts = result.data.map((product) => ({
//           id: product._id || product.id,
//           productId: product._id || product.id,
//           date: product.createdAt
//             ? new Date(product.createdAt).toISOString().split("T")[0]
//             : "N/A",
//           vendor: product.vendor || "Unknown Vendor",
//           category: product.category || "Uncategorized",
//           subCategory: product.subCategory || "N/A",
//           price: `₹${product.salePrice || product.regularPrice || 0}`,
//           regularPrice: product.regularPrice || 0,
//           salePrice: product.salePrice || 0,
//           status: product.status || "In Review",
//           name: product.name,
//           images: product.images || [],
//           description: product.description || "",
//           sku: product.sku || "",
//           inventory: product.inventory || 0,
//           cashback: product.cashback || 0,
//           tags: product.tags || "",
//         }));

//         setProducts(transformedProducts);
//       } else {
//         console.error("Invalid API response format:", result);
//         setProducts([]);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       // Show error message to user
//       alert("Failed to load products. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch products on component mount
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // 🟢 Handle successful product addition
//   const handleProductAdded = (newProduct) => {
//     console.log("New product added:", newProduct);
//     // Refresh the product list
//     fetchProducts();
//   };

//   // 🟢 Download Barcode Function
//   const handleDownloadBarcode = (productId) => {
//     const canvas = canvasRef.current;
//     JsBarcode(canvas, productId, {
//       format: "CODE128",
//       displayValue: true,
//       fontSize: 16,
//       lineColor: "#000000",
//       background: "#ffffff",
//     });

//     const link = document.createElement("a");
//     link.download = `${productId}-barcode.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   const statusColors = {
//     Approved: "text-green-600 font-semibold",
//     "In Review": "text-yellow-600 font-semibold",
//     Rejected: "text-red-600 font-semibold",
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         const response = await fetch(
//           ``,
//           {
//             method: "DELETE",
//           }
//         );

//         if (response.ok) {
//           // Remove from local state
//           setProducts((prev) => prev.filter((p) => p.id !== id));
//           alert("Product deleted successfully!");
//         } else {
//           const result = await response.json();
//           alert(result.message || "Failed to delete product");
//         }
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         alert("Failed to delete product. Please try again.");
//       }
//     }
//   };

//   // Filtering + Pagination logic
//   const filteredByTab = products.filter((p) => {
//     if (activeTab === "approved") return p.status === "Approved";
//     if (activeTab === "in_review") return p.status === "In Review";
//     if (activeTab === "rejected") return p.status === "Rejected";
//     return true;
//   });

//   const filteredByVendor =
//     selectedVendor === "All Vendors"
//       ? filteredByTab
//       : filteredByTab.filter((p) => p.vendor === selectedVendor);

//   const searchedProducts = filteredByVendor.filter((product) =>
//     [product.productId, product.vendor, product.category, product.name]
//       .join(" ")
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentProducts = searchedProducts.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(searchedProducts.length / itemsPerPage);

//   const TableSkeleton = () => (
//     <tbody>
//       {Array.from({ length: itemsPerPage }).map((_, idx) => (
//         <tr
//           key={idx}
//           className="border-b border-gray-200 animate-pulse bg-white"
//         >
//           {Array.from({ length: 9 }).map((__, j) => (
//             <td key={j} className="p-3">
//               <div className="h-4 bg-gray-200 rounded w-[80%]"></div>
//             </td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   );

//   const EmptyState = () => (
//     <tbody>
//       <tr>
//         <td
//           colSpan="9"
//           className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
//         >
//           No products found.
//         </td>
//       </tr>
//     </tbody>
//   );

//   // Get unique vendors for dropdown
//   const uniqueVendors = [...new Set(products.map((p) => p.vendor))];

//   return (
//     <DashboardLayout>
//       {/* Hidden Canvas for Barcode Generation */}
//       <canvas ref={canvasRef} className="hidden" />

//       {/* Header Section */}
//       <div className="flex flex-col lg:flex-row lg:items-center ml-8 lg:justify-between gap-4 max-w-[99%] mx-auto mt-0 mb-2">
//         <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
//           {/* Tabs */}
//           <div className="flex gap-2 items-center overflow-x-auto pb-2 lg:pb-0">
//             {[
//               { key: "all", label: "All" },
//               { key: "in_review", label: "In Review" },
//               { key: "approved", label: "Approved" },
//               { key: "rejected", label: "Rejected" },
//             ].map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => {
//                   setActiveTab(tab.key);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap ${
//                   activeTab === tab.key
//                     ? "bg-[#FF7B1D] text-white border-orange-500"
//                     : "border-gray-400 text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Vendor Filter */}
//           <div className="flex items-center">
//             <select
//               value={selectedVendor}
//               onChange={(e) => {
//                 setSelectedVendor(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="border border-black rounded text-sm px-3 h-[36px] text-gray-800 focus:outline-none"
//             >
//               <option>All Vendors</option>
//               {uniqueVendors.map((vendor) => (
//                 <option key={vendor} value={vendor}>
//                   {vendor}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Search */}
//           <div className="flex items-center border border-black rounded overflow-hidden h-[36px] w-full max-w-[100%] lg:max-w-[400px]">
//             <input
//               type="text"
//               placeholder="Search Product by ID, Name, Vendor, or Category..."
//               className="flex-1 px-4 text-sm text-gray-800 focus:outline-none h-full"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-4 sm:px-6 h-full">
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Add Product Button */}
//         {/* <div className="w-full md:w-auto flex justify-start md:justify-end mt-2 md:mt-0">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-black text-white w-52 sm:w-60 px-4 sm:px-10 py-2.5 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
//           >
//             + Add Product
//           </button>
//         </div> */}
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-sm ml-8 shadow-sm overflow-x-auto max-w-[99%] mx-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-[#FF7B1D] text-black">
//               <th className="p-3 text-left">S.N</th>
//               <th className="p-3 text-left">Product ID</th>
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Vendor</th>
//               <th className="p-3 text-left">Category</th>
//               <th className="p-3 text-left">Sub Category</th>
//               <th className="p-3 text-left">Sell Price</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 pr-6 text-right">Action</th>
//             </tr>
//           </thead>

//           {loading ? (
//             <TableSkeleton />
//           ) : searchedProducts.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <tbody>
//               {currentProducts.map((product, idx) => (
//                 <tr
//                   key={product.id}
//                   className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
//                 >
//                   <td className="p-3">{indexOfFirst + idx + 1}</td>
//                   <td className="p-3">{product.productId}</td>
//                   <td className="p-3">{product.date}</td>
//                   <td className="p-3">{product.vendor}</td>
//                   <td className="p-3">{product.category}</td>
//                   <td className="p-3">{product.subCategory}</td>
//                   <td className="p-3">{product.price}</td>
//                   <td className={`p-3 ${statusColors[product.status]}`}>
//                     {product.status}
//                   </td>
//                   <td className="p-3 text-right">
//                     <div className="flex justify-end gap-3 text-orange-600">
//                       {/* 🟢 Download Barcode Button */}
//                       <button
//                         onClick={() => handleDownloadBarcode(product.productId)}
//                         className="text-orange-600 hover:text-blue-700"
//                         title="Download barcode"
//                       >
//                         <Download className="w-4 h-4" />
//                       </button>

//                       <button className="hover:text-blue-700">
//                         <Edit className="w-4 h-4" />
//                       </button>

//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="hover:text-blue-700"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>

//                       <button
//                         onClick={() => navigate(`/products/${product.id}`)}
//                         className="hover:text-blue-700"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           )}
//         </table>
//       </div>

//       {/* Pagination */}
//       {!loading && searchedProducts.length > itemsPerPage && (
//         <div className="flex justify-end pl-8 items-center gap-6 mt-8 max-w-[95%] mx-auto mb-6">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={currentPage === 1}
//           >
//             Back
//           </button>

//           <div className="flex items-center gap-2 text-sm text-black font-medium">
//             {(() => {
//               const pages = [];
//               const visiblePages = new Set([
//                 1,
//                 2,
//                 totalPages - 1,
//                 totalPages,
//                 currentPage - 1,
//                 currentPage,
//                 currentPage + 1,
//               ]);
//               for (let i = 1; i <= totalPages; i++) {
//                 if (visiblePages.has(i)) pages.push(i);
//                 else if (pages[pages.length - 1] !== "...") pages.push("...");
//               }
//               return pages.map((page, idx) =>
//                 page === "..." ? (
//                   <span key={idx} className="px-1 text-black select-none">
//                     ...
//                   </span>
//                 ) : (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-1 ${
//                       currentPage === page
//                         ? "text-orange-600 font-semibold"
//                         : ""
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               );
//             })()}
//           </div>

//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       <AddProductModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleProductAdded}
//       />
//     </DashboardLayout>
//   );
// };

// export default AllProduct;
import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2, Download } from "lucide-react";
import AddProductModal from "../../components/AddProduct";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";

const AllProduct = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 7;

  const canvasRef = useRef(null);

  // 🟢 Fetch products from API with authorization
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await api.get(
        "/product?latitude=23.2599&longitude=77.4126&page=1&limit=100"
      );

      const result = response.data;

      if (result.success && result.data) {
        // Transform API data to match component structure
        const transformedProducts = result.data.map((product) => ({
          id: product._id || product.id,
          productId: product._id || product.id,
          date: product.createdAt
            ? new Date(product.createdAt).toISOString().split("T")[0]
            : "N/A",
          vendor: product.vendor?.name || "Unknown Vendor",
          category: product.category?.name || "Uncategorized",
          subCategory: product.subCategory?.name || "N/A",
          price: `₹${product.salePrice || product.regularPrice || 0}`,
          regularPrice: product.regularPrice || 0,
          salePrice: product.salePrice || 0,
          actualPrice: product.actualPrice || 0,
          status: product.status || "In Review",
          name: product.productName || product.name || "Unnamed Product",
          images: product.images || [],
          description: product.description || "",
          sku: product.skuHsn || product.sku || "",
          inventory: product.inventory || 0,
          cashback: product.cashback || 0,
          tags: product.tags || "",
        }));

        setProducts(transformedProducts);
      } else {
        console.error("Invalid API response format:", result);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🟢 Handle successful product addition
  const handleProductAdded = (newProduct) => {
    console.log("New product added:", newProduct);
    fetchProducts();
  };

  // 🟢 Download Barcode Function
  const handleDownloadBarcode = (productId) => {
    const canvas = canvasRef.current;
    JsBarcode(canvas, productId, {
      format: "CODE128",
      displayValue: true,
      fontSize: 16,
      lineColor: "#000000",
      background: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `${productId}-barcode.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const statusColors = {
    Approved: "text-green-600 font-semibold",
    "In Review": "text-yellow-600 font-semibold",
    Rejected: "text-red-600 font-semibold",
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await api.delete(`/product/${id}`);

        const result = response.data;

        if (result.success) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          alert("Product deleted successfully!");
        } else {
          alert(result.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(error.response?.data?.message || "Failed to delete product. Please try again.");
      }
    }
  };

  // Filtering + Pagination logic
  const filteredByTab = products.filter((p) => {
    if (activeTab === "approved") return p.status === "Approved";
    if (activeTab === "in_review") return p.status === "In Review";
    if (activeTab === "rejected") return p.status === "Rejected";
    return true;
  });

  const filteredByVendor =
    selectedVendor === "All Vendors"
      ? filteredByTab
      : filteredByTab.filter((p) => p.vendor === selectedVendor);

  const searchedProducts = filteredByVendor.filter((product) =>
    [product.productId, product.vendor, product.category, product.name]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = searchedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(searchedProducts.length / itemsPerPage);

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr
          key={idx}
          className="border-b border-gray-200 animate-pulse bg-white"
        >
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="p-3">
              <div className="h-4 bg-gray-200 rounded w-[80%]"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td
          colSpan="9"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No products found.
        </td>
      </tr>
    </tbody>
  );

  const uniqueVendors = [...new Set(products.map((p) => p.vendor))];

  return (
    <DashboardLayout>
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-col lg:flex-row lg:items-center ml-8 lg:justify-between gap-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
          <div className="flex gap-2 items-center overflow-x-auto pb-2 lg:pb-0">
            {[
              { key: "all", label: "All" },
              { key: "in_review", label: "In Review" },
              { key: "approved", label: "Approved" },
              { key: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-[#FF7B1D] text-white border-orange-500"
                    : "border-gray-400 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <select
              value={selectedVendor}
              onChange={(e) => {
                setSelectedVendor(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-black rounded text-sm px-3 h-[36px] text-gray-800 focus:outline-none"
            >
              <option>All Vendors</option>
              {uniqueVendors.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center border border-black rounded overflow-hidden h-[36px] w-full max-w-[100%] lg:max-w-[400px]">
            <input
              type="text"
              placeholder="Search Product by ID, Name, Vendor, or Category..."
              className="flex-1 px-4 text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-4 sm:px-6 h-full">
              Search
            </button>
          </div>
        </div>

        {/* <div className="w-full md:w-auto flex justify-start md:justify-end mt-2 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white w-52 sm:w-60 px-4 sm:px-10 py-2.5 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
          >
            + Add Product
          </button>
        </div> */}
      </div>

      <div className="bg-white rounded-sm ml-8 shadow-sm overflow-x-auto max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Product ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Sub Category</th>
              <th className="p-3 text-left">Sell Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : searchedProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {currentProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">{indexOfFirst + idx + 1}</td>
                  <td className="p-3">{product.productId}</td>
                  <td className="p-3">{product.date}</td>
                  <td className="p-3">{product.vendor}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.subCategory}</td>
                  <td className="p-3">{product.price}</td>
                  <td className={`p-3 ${statusColors[product.status]}`}>
                    {product.status}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-3 text-orange-600">
                      <button
                        onClick={() => handleDownloadBarcode(product.productId)}
                        className="text-orange-600 hover:text-blue-700"
                        title="Download barcode"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button className="hover:text-blue-700">
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="hover:text-blue-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {!loading && searchedProducts.length > itemsPerPage && (
        <div className="flex justify-end pl-8 items-center gap-6 mt-8 max-w-[95%] mx-auto mb-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            Back
          </button>

          <div className="flex items-center gap-2 text-sm text-black font-medium">
            {(() => {
              const pages = [];
              const visiblePages = new Set([
                1,
                2,
                totalPages - 1,
                totalPages,
                currentPage - 1,
                currentPage,
                currentPage + 1,
              ]);
              for (let i = 1; i <= totalPages; i++) {
                if (visiblePages.has(i)) pages.push(i);
                else if (pages[pages.length - 1] !== "...") pages.push("...");
              }
              return pages.map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-1 text-black select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-1 ${
                      currentPage === page
                        ? "text-orange-600 font-semibold"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })()}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProductAdded}
      />
    </DashboardLayout>
  );
};

export default AllProduct;
