// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import { Download, Eye, Edit2, Trash2, Plus } from "lucide-react";
// import ProductModal from "../../pages/InventoryManagement/ProductModal";

// const InventoryManagement = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const itemsPerPage = 8;

//   const [products, setProducts] = useState([]);

//   // Simulate API call
//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => {
//       setProducts([
//         {
//           id: 1,
//           name: "Organic Apples",
//           category: "Fruits",
//           stock: 45,
//           lowStockThreshold: 20,
//           price: 120,
//           vendor: "Fresh Farms",
//           expiryDate: "2025-11-15",
//           status: "In Stock",
//         },
//         {
//           id: 2,
//           name: "Fresh Milk",
//           category: "Dairy",
//           stock: 8,
//           lowStockThreshold: 15,
//           price: 60,
//           vendor: "Dairy Co",
//           expiryDate: "2025-10-28",
//           status: "Low Stock",
//         },
//         {
//           id: 3,
//           name: "Brown Bread",
//           category: "Bakery",
//           stock: 0,
//           lowStockThreshold: 10,
//           price: 45,
//           vendor: "Baker's Best",
//           expiryDate: "2025-10-26",
//           status: "Out of Stock",
//         },
//         {
//           id: 4,
//           name: "Green Tea",
//           category: "Beverages",
//           stock: 35,
//           lowStockThreshold: 25,
//           price: 150,
//           vendor: "Tea House",
//           expiryDate: "2026-05-10",
//           status: "In Stock",
//         },
//         {
//           id: 5,
//           name: "Yogurt Cups",
//           category: "Dairy",
//           stock: 12,
//           lowStockThreshold: 20,
//           price: 80,
//           vendor: "Dairy Co",
//           expiryDate: "2025-10-30",
//           status: "Low Stock",
//         },
//         {
//           id: 6,
//           name: "Bananas",
//           category: "Fruits",
//           stock: 60,
//           lowStockThreshold: 30,
//           price: 40,
//           vendor: "Fresh Farms",
//           expiryDate: "2025-11-01",
//           status: "In Stock",
//         },
//         {
//           id: 7,
//           name: "Orange Juice",
//           category: "Beverages",
//           stock: 5,
//           lowStockThreshold: 10,
//           price: 90,
//           vendor: "Juice Bar",
//           expiryDate: "2025-11-05",
//           status: "Low Stock",
//         },
//         {
//           id: 8,
//           name: "Whole Wheat Bread",
//           category: "Bakery",
//           stock: 25,
//           lowStockThreshold: 15,
//           price: 50,
//           vendor: "Baker's Best",
//           expiryDate: "2025-10-29",
//           status: "In Stock",
//         },
//         {
//           id: 9,
//           name: "Cheese",
//           category: "Dairy",
//           stock: 0,
//           lowStockThreshold: 8,
//           price: 200,
//           vendor: "Dairy Co",
//           expiryDate: "2025-11-20",
//           status: "Out of Stock",
//         },
//       ]);
//       setLoading(false);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, []);

//   const statusColors = {
//     "In Stock": "text-green-600 font-semibold",
//     "Low Stock": "text-yellow-600 font-semibold",
//     "Out of Stock": "text-red-600 font-semibold",
//   };

//   // Filter products based on active tab
//   const filteredProducts = products.filter((product) => {
//     const matchesTab =
//       activeTab === "all" ||
//       (activeTab === "instock" && product.status === "In Stock") ||
//       (activeTab === "lowstock" && product.status === "Low Stock") ||
//       (activeTab === "outofstock" && product.status === "Out of Stock");

//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.vendor.toLowerCase().includes(searchTerm.toLowerCase());

//     return matchesTab && matchesSearch;
//   });

//   // Pagination
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

//   // Skeleton Loader
//   const TableSkeleton = () => (
//     <tbody>
//       {Array.from({ length: itemsPerPage }).map((_, idx) => (
//         <tr
//           key={idx}
//           className="animate-pulse border-b border-gray-200 bg-white"
//         >
//           {Array.from({ length: 9 }).map((__, j) => (
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
//           colSpan="9"
//           className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
//         >
//           No products found.
//         </td>
//       </tr>
//     </tbody>
//   );

//   const handleTabClick = (tabKey) => {
//     setActiveTab(tabKey);
//     setCurrentPage(1);
//   };

//   const handleSearch = () => {
//     setCurrentPage(1);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setShowModal(true);
//   };

//   const handleAddNew = () => {
//     setEditingProduct(null);
//     setShowModal(true);
//   };

//   const handleSaveProduct = (productData) => {
//     if (editingProduct) {
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === editingProduct.id ? { ...p, ...productData } : p
//         )
//       );
//     } else {
//       const newProduct = {
//         id: Date.now(),
//         ...productData,
//         status:
//           productData.stock === 0
//             ? "Out of Stock"
//             : productData.stock <= productData.lowStockThreshold
//             ? "Low Stock"
//             : "In Stock",
//       };
//       setProducts((prev) => [...prev, newProduct]);
//     }
//     setShowModal(false);
//     setEditingProduct(null);
//   };

//   return (
//     <DashboardLayout>
//       {/* Tabs + Search + Add Button */}
//       <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-2 w-full pl-4 max-w-[99%] mx-auto mt-0 mb-2">
//         <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
//           {[
//             { key: "all", label: "All Products" },
//             { key: "instock", label: "In Stock" },
//             { key: "lowstock", label: "Low Stock" },
//             { key: "outofstock", label: "Out of Stock" },
//           ].map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => handleTabClick(tab.key)}
//               className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap transition-colors ${
//                 activeTab === tab.key
//                   ? "bg-[#FF7B1D] text-white border-orange-500"
//                   : "bg-white text-black border-gray-300 hover:bg-gray-100"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 w-full mt-4 lg:w-auto">
//           {/* Search Bar */}
//           {/* <div className="flex items-center border border-black rounded overflow-hidden h-[36px] w-full sm:w-[400px]">
//             <input
//               type="text"
//               placeholder="Search by name, category, or vendor"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="flex-1 px-4 text-sm focus:outline-none h-full"
//             />
//             <button
//               onClick={handleSearch}
//               className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-4 sm:px-6 h-full text-sm"
//             >
//               Search
//             </button>
//           </div> */}
//         </div>

//         {/* <div className="mt-3 sm:mt-0">
//           <button
//             onClick={handleAddNew}
//             className="bg-black hover:bg-gray-800 text-white w-44 sm:w-44 px-6 py-2 rounded-sm text-sm whitespace-nowrap flex items-center justify-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Product
//           </button>
//         </div> */}
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
//         <table className="w-full text-sm border-collapse min-w-[700px]">
//           <thead>
//             <tr className="bg-[#FF7B1D] text-black">
//               <th className="p-3 text-left">S.N</th>
//               <th className="p-3 text-left">Product Name</th>
//               <th className="p-3 text-left">Category</th>
//               <th className="p-3 text-left">Stock</th>
//               <th className="p-3 text-left">Price</th>
//               <th className="p-3 text-left">Vendor</th>
//               <th className="p-3 text-left">Expiry Date</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 pr-6 text-right">Action</th>
//             </tr>
//           </thead>

//           {loading ? (
//             <TableSkeleton />
//           ) : filteredProducts.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <tbody>
//               {currentProducts.map((product, idx) => (
//                 <tr
//                   key={product.id}
//                   className="shadow-sm rounded-sm hover:bg-gray-50 transition border-b-4 border-gray-200 bg-white"
//                 >
//                   <td className="p-3">{indexOfFirst + idx + 1}</td>
//                   <td className="p-3 font-semibold">{product.name}</td>
//                   <td className="p-3">{product.category}</td>
//                   <td className="p-3">
//                     {product.stock} / {product.lowStockThreshold}
//                   </td>
//                   <td className="p-3">₹{product.price}</td>
//                   <td className="p-3">{product.vendor}</td>
//                   <td className="p-3">{product.expiryDate}</td>
//                   <td className={`p-3 ${statusColors[product.status]}`}>
//                     {product.status}
//                   </td>
//                   <td className="p-3">
//                     <div className="flex gap-2 justify-end">
//                       <button className="text-orange-600 hover:text-blue-700">
//                         <Download className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="text-orange-600 hover:text-blue-700"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="text-orange-600 hover:text-blue-700"
//                       >
//                         <Trash2 className="w-4 h-4" />
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
//       {!loading && filteredProducts.length > 0 && (
//         <div className="flex justify-end items-center gap-4 mt-6 max-w-[98%] mx-auto">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-10 py-3 text-sm font-medium rounded-0"
//           >
//             Back
//           </button>
//           <div className="flex gap-2 text-sm text-black font-medium flex-wrap items-center">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`px-3 py-1 rounded ${
//                   currentPage === page ? "text-orange-600 font-semibold" : ""
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             className="bg-[#247606] hover:bg-green-700 text-white px-10 py-3 text-sm font-medium rounded-0"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Product Modal */}
//       {showModal && (
//         <ProductModal
//           product={editingProduct}
//           onClose={() => {
//             setShowModal(false);
//             setEditingProduct(null);
//           }}
//           onSave={handleSaveProduct}
//         />
//       )}
//     </DashboardLayout>
//   );
// };

// export default InventoryManagement;
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Download, Eye, Edit2, Trash2, Plus } from "lucide-react";
import ProductModal from "../../pages/InventoryManagement/ProductModal";

const API_URL = "http://46.202.164.93/api/vendor/inventory";

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20,
  });
  const [error, setError] = useState(null);

  const itemsPerPage = 8;

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

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}?page=${currentPage}`, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result = await response.json();

      if (result.success) {
        // Transform API data to match your component structure
        const transformedProducts = result.data.products.map(
          (product, index) => ({
            id: product.productId,
            name: product.productName,
            category: "General", // Not provided by API, set default or fetch separately
            stock: product.inventory + product.totalSkuInventory,
            lowStockThreshold: 20, // Not provided by API, set default
            price: 0, // Not provided by API, needs to be fetched or added
            vendor: "Direct", // Not provided by API
            expiryDate: "N/A", // Not provided by API
            status: product.isActive
              ? product.inventory + product.totalSkuInventory === 0
                ? "Out of Stock"
                : product.inventory + product.totalSkuInventory < 20
                ? "Low Stock"
                : "In Stock"
              : "Inactive",
            approvalStatus: product.approvalStatus,
            isActive: product.isActive,
            skus: product.skus,
            totalSkuInventory: product.totalSkuInventory,
          })
        );

        setProducts(transformedProducts);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Error loading products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    "In Stock": "text-green-600 font-semibold",
    "Low Stock": "text-yellow-600 font-semibold",
    "Out of Stock": "text-red-600 font-semibold",
    Inactive: "text-gray-600 font-semibold",
  };

  // Filter products based on active tab
  const filteredProducts = products.filter((product) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "instock" && product.status === "In Stock") ||
      (activeTab === "lowstock" && product.status === "Low Stock") ||
      (activeTab === "outofstock" && product.status === "Out of Stock");

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr
          key={idx}
          className="animate-pulse border-b border-gray-200 bg-white"
        >
          {Array.from({ length: 9 }).map((__, j) => (
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
          colSpan="9"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          {error ? error : "No products found."}
        </td>
      </tr>
    </tbody>
  );

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: headers,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to delete product");
        }

        alert("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
        alert(err.message || "Failed to delete product");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (editingProduct) {
        // Update existing product via API
        const response = await fetch(`${API_URL}/${editingProduct.id}`, {
          method: "PUT",
          credentials: "include",
          headers: headers,
          body: JSON.stringify(productData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update product");
        }

        alert("Product updated successfully");

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...productData } : p
          )
        );
      } else {
        // Add new product via API
        const response = await fetch(`${API_URL}/create`, {
          method: "POST",
          credentials: "include",
          headers: headers,
          body: JSON.stringify(productData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to create product");
        }

        alert("Product created successfully");

        const newProduct = {
          id: result.data.productId || Date.now(),
          ...productData,
          status:
            productData.stock === 0
              ? "Out of Stock"
              : productData.stock <= productData.lowStockThreshold
              ? "Low Stock"
              : "In Stock",
        };
        setProducts((prev) => [...prev, newProduct]);
      }

      setShowModal(false);
      setEditingProduct(null);
      // Refetch products to get updated data
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  return (
    <DashboardLayout>
      {/* Tabs + Search + Add Button */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-2 w-full pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
          {[
            { key: "all", label: "All Products" },
            { key: "instock", label: "In Stock" },
            { key: "lowstock", label: "Low Stock" },
            { key: "outofstock", label: "Out of Stock" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-[#FF7B1D] text-white border-orange-500"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-sm text-sm whitespace-nowrap disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Expiry Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {currentProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  className="shadow-sm rounded-sm hover:bg-gray-50 transition border-b-4 border-gray-200 bg-white"
                >
                  <td className="p-3">{indexOfFirst + idx + 1}</td>
                  <td className="p-3 font-semibold">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">
                    {product.stock} / {product.lowStockThreshold}
                  </td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">{product.vendor}</td>
                  <td className="p-3">{product.expiryDate}</td>
                  <td className={`p-3 ${statusColors[product.status]}`}>
                    {product.status}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <button className="text-orange-600 hover:text-blue-700">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-orange-600 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-orange-600 hover:text-blue-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredProducts.length > 0 && (
        <div className="flex justify-between items-center mt-6 max-w-[98%] mx-auto">
          <div className="text-sm text-gray-600">
            {/* Showing {indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filteredProducts.length)} of{" "}
            {pagination.totalProducts} products */}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-10 py-3 text-sm font-medium rounded-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <div className="flex gap-2 text-sm text-black font-medium flex-wrap items-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "text-orange-600 font-semibold"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-[#247606] hover:bg-green-700 text-white px-10 py-3 text-sm font-medium rounded-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </DashboardLayout>
  );
};

export default InventoryManagement;
