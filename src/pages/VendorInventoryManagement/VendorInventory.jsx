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
import { Download, Eye, Edit2, Trash2, Plus, RefreshCw, X, Check } from "lucide-react";
import ProductModal from "../../pages/InventoryManagement/ProductModal";
import { BASE_URL } from "../../api/api";

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
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState(false);
  const [selectedProductForUpdate, setSelectedProductForUpdate] = useState(null);
  const [updateStockAmount, setUpdateStockAmount] = useState("");
  const [updatingStock, setUpdatingStock] = useState(false);

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

  // Fetch vendor ID first, then products
  useEffect(() => {
    fetchVendorIdAndProducts();
  }, [currentPage]);

  const fetchVendorIdAndProducts = async () => {
    try {
      // First, try to get vendorId from profile or first product
      // If not available, we'll get it from the API response
      await fetchProducts();
    } catch (err) {
      console.error("Error fetching vendor ID and products:", err);
    }
  };

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

      // Try to get vendorId from localStorage or fetch from profile
      let currentVendorId = vendorId;
      if (!currentVendorId) {
        // Try to get from localStorage first
        const storedVendorId = localStorage.getItem("vendorId");
        if (storedVendorId) {
          currentVendorId = storedVendorId;
          setVendorId(currentVendorId);
        } else {
          // Try to fetch vendor profile
          try {
            const profileResponse = await fetch(`${BASE_URL}/api/vendor/profile`, {
              method: "GET",
              credentials: "include",
              headers: headers,
            });
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.success && profileData.data?._id) {
                currentVendorId = profileData.data._id;
                setVendorId(currentVendorId);
                localStorage.setItem("vendorId", currentVendorId);
              }
            }
          } catch (e) {
            // Could not fetch vendor profile, will try fallback endpoint
          }
        }
      }

      // Use the analytics inventory endpoint
      const apiUrl = `${BASE_URL}/api/analytics/vendor/inventory?page=${currentPage}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "No error details");
        console.error("API Error:", response.status, errorText);
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Extract vendorId from first product if not already set
        if (!currentVendorId && result.data?.inventory?.length > 0 && result.data.inventory[0].vendor?._id) {
          currentVendorId = result.data.inventory[0].vendor._id;
          setVendorId(currentVendorId);
        }

        // Transform API data to match your component structure
        const transformedProducts = result.data.inventory.map(
          (product, index) => {
            // Map stock status to display label
            const getStockStatusLabel = (status) => {
              switch (status) {
                case "in_stock":
                  return "In Stock";
                case "out_of_stock":
                  return "Out of Stock";
                case "low_stock":
                  return "Low Stock";
                default:
                  return "In Stock";
              }
            };

            return {
            id: product.productId,
            productId: product.productId,
            n: (result.data.pagination?.currentPage - 1) * (result.data.pagination?.limit || 20) + index + 1,
            name: product.productName,
            category: product.category?.name || "General",
            subCategory: product.subCategory?.name || "N/A",
            stock: product.currentInventory || 0,
            initialInventory: product.initialInventory || 0,
            lowStockThreshold: 20, // Default threshold
            price: product.regularPrice || 0,
            regularPrice: product.regularPrice || 0,
            salePrice: 0,
            actualPrice: product.regularPrice || 0,
            vendor: product.vendor?.storeName || product.vendor?.vendorName || "N/A",
            vendorId: product.vendor?._id,
            expiryDate: null,
            status: getStockStatusLabel(product.stockStatus),
            stockStatus: product.stockStatus || "in_stock",
            stockStatusLabel: getStockStatusLabel(product.stockStatus),
            stockPercentage: product.stockPercentage || 100,
            approvalStatus: "approved",
            isActive: true,
            skuHsn: product.skuHsn || "N/A",
            thumbnail: null,
            createdAt: null,
          };
          }
        );

        setProducts(transformedProducts);
        setPagination(result.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProducts: result.data.summary?.totalProducts || 0,
          limit: 20,
        });
        setSummary(result.data.summary || null);
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

  // Calculate when product will be out of stock
  const calculateOutOfStockDate = (product) => {
    const currentStock = product.stock || 0;
    const lowStockThreshold = product.lowStockThreshold || 20;
    
    if (currentStock === 0) {
      return "Already Out of Stock";
    }
    
    // Assuming average daily sales rate (this can be improved with actual sales data)
    // For now, using a simple calculation: if stock is below threshold, estimate based on stock level
    const averageDailySales = Math.max(1, Math.floor(currentStock / 10)); // Rough estimate
    const daysUntilOutOfStock = Math.floor(currentStock / averageDailySales);
    
    if (daysUntilOutOfStock <= 0) {
      return "Already Out of Stock";
    } else if (daysUntilOutOfStock <= 3) {
      return `${daysUntilOutOfStock} days (Critical)`;
    } else if (daysUntilOutOfStock <= 7) {
      return `${daysUntilOutOfStock} days (Low)`;
    } else if (currentStock < lowStockThreshold) {
      return `${daysUntilOutOfStock} days (Warning)`;
    } else {
      return `${daysUntilOutOfStock} days`;
    }
  };

  const getOutOfStockColor = (product) => {
    const currentStock = product.stock || 0;
    const lowStockThreshold = product.lowStockThreshold || 20;
    const averageDailySales = Math.max(1, Math.floor(currentStock / 10));
    const daysUntilOutOfStock = Math.floor(currentStock / averageDailySales);
    
    if (currentStock === 0 || daysUntilOutOfStock <= 0) {
      return "text-red-600 font-bold";
    } else if (daysUntilOutOfStock <= 3) {
      return "text-red-600 font-semibold";
    } else if (daysUntilOutOfStock <= 7) {
      return "text-orange-600 font-semibold";
    } else if (currentStock < lowStockThreshold) {
      return "text-yellow-600 font-semibold";
    } else {
      return "text-gray-600";
    }
  };

  // Filter products based on active tab
  const filteredProducts = products.filter((product) => {
    // Match tab filter based on stockStatus
    let matchesTab = false;
    if (activeTab === "all") {
      matchesTab = true;
    } else if (activeTab === "instock") {
      matchesTab = product.stockStatus === "in_stock" || product.status === "In Stock";
    } else if (activeTab === "lowstock") {
      matchesTab = product.stockStatus === "low_stock" || product.status === "Low Stock" || (product.stockPercentage < 20 && product.stockStatus !== "out_of_stock");
    } else if (activeTab === "outofstock") {
      matchesTab = product.stockStatus === "out_of_stock" || product.status === "Out of Stock" || product.stock === 0;
    }

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.subCategory && product.subCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.skuHsn && product.skuHsn.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  // Pagination - use API pagination if available, otherwise use client-side pagination
  const useApiPagination = pagination && pagination.totalPages > 0;
  const indexOfLast = useApiPagination ? filteredProducts.length : currentPage * itemsPerPage;
  const indexOfFirst = useApiPagination ? 0 : indexOfLast - itemsPerPage;
  const currentProducts = useApiPagination ? filteredProducts : filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = useApiPagination ? pagination.totalPages : Math.ceil(filteredProducts.length / itemsPerPage);

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr
          key={idx}
          className="animate-pulse border-b border-gray-200 bg-white"
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
        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}/api/product/delete/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: headers,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to delete product");
        }

        alert("Product deleted successfully");
        // Refresh the product list
        fetchProducts();
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

  const handleUpdateStock = (product) => {
    setSelectedProductForUpdate(product);
    setUpdateStockAmount("");
    setIsUpdateStockModalOpen(true);
  };

  const closeUpdateStockModal = () => {
    setIsUpdateStockModalOpen(false);
    setSelectedProductForUpdate(null);
    setUpdateStockAmount("");
    setError(null);
  };

  const handleSubmitStockUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProductForUpdate || !updateStockAmount || parseFloat(updateStockAmount) <= 0) {
      setError("Please enter a valid stock amount to add");
      return;
    }

    setUpdatingStock(true);
    setError(null);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const productId = selectedProductForUpdate.productId || selectedProductForUpdate.id;
      const currentVendorId = vendorId || selectedProductForUpdate.vendorId;
      
      // Try multiple endpoint strategies for stock update
      let response = null;
      let lastError = null;

      // Strategy 1: Try with productId in URL
      if (currentVendorId && productId) {
        try {
          const apiUrl = `${BASE_URL}/api/analytics/vendor/product/${currentVendorId}/stock/${productId}`;
          response = await fetch(apiUrl, {
            method: "PUT",
            credentials: "include",
            headers: headers,
            body: JSON.stringify({
              addedProduct: parseFloat(updateStockAmount),
              stock: (selectedProductForUpdate.stock || 0) + parseFloat(updateStockAmount),
            }),
          });
          if (response.ok) {
            // Success with stock update endpoint 1
          } else {
            lastError = { status: response.status, url: apiUrl };
          }
        } catch (e) {
          lastError = { error: e.message };
        }
      }

      // Strategy 2: Try with productId in body (original)
      if ((!response || !response.ok) && currentVendorId) {
        try {
          const apiUrl = `${BASE_URL}/api/analytics/vendor/product/${currentVendorId}/stock`;
          response = await fetch(apiUrl, {
            method: "PUT",
            credentials: "include",
            headers: headers,
          body: JSON.stringify({
            productId: productId,
            addedProduct: parseFloat(updateStockAmount),
            stock: (selectedProductForUpdate.stock || 0) + parseFloat(updateStockAmount),
          }),
          });
          if (response.ok) {
            // Success with stock update endpoint 2
          } else {
            lastError = { status: response.status, url: apiUrl };
          }
        } catch (e) {
          lastError = { error: e.message };
        }
      }

      // Strategy 3: Try using product update endpoint
      if ((!response || !response.ok) && productId) {
        try {
          const apiUrl = `${BASE_URL}/api/product/update/${productId}`;
          response = await fetch(apiUrl, {
            method: "PUT",
            credentials: "include",
            headers: headers,
            body: JSON.stringify({
              stock: (selectedProductForUpdate.stock || 0) + parseFloat(updateStockAmount),
              inventory: (selectedProductForUpdate.stock || 0) + parseFloat(updateStockAmount),
            }),
          });
          if (response.ok) {
            // Success with stock update endpoint 3
          } else {
            lastError = { status: response.status, url: apiUrl };
          }
        } catch (e) {
          lastError = { error: e.message };
        }
      }

      if (!response || !response.ok) {
        const errorData = response ? await response.json().catch(() => ({})) : {};
        console.error("All stock update endpoints failed. Last error:", lastError);
        throw new Error(errorData.message || `Failed to update stock: ${response?.status || "No response"}. Please check the API endpoint.`);
      }

      const result = await response.json();
      if (result.success) {
        alert("Stock updated successfully!");
        closeUpdateStockModal();
        fetchProducts(); // Refresh the product list
      } else {
        throw new Error(result.message || "Failed to update stock");
      }
    } catch (err) {
      console.error("Error updating stock:", err);
      setError(err.message);
    } finally {
      setUpdatingStock(false);
    }
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
        // Note: The inventory endpoint only accepts inventory-related fields
        // For full product updates, use /api/product/update/:id instead
        // For now, we'll only update inventory if that's what's being changed
        const inventoryUpdatePayload = {
          inventory: productData.stock || 0,
          stock: productData.stock || 0,
        };

        const response = await fetch(`${BASE_URL}/api/product/update/${editingProduct.id}`, {
          method: "PUT",
          credentials: "include",
          headers: headers,
          body: JSON.stringify(inventoryUpdatePayload),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          const errorMessage = result.message || result.error || "Failed to update product";
          throw new Error(errorMessage);
        }

        alert("Product inventory updated successfully");

        // Refresh the product list
        fetchProducts();
      } else {
        // Note: Creating products should use /api/product/add endpoint
        // The inventory endpoint doesn't support product creation
        alert("Please use the Products page to add new products. This page is for inventory management only.");
        setShowModal(false);
        setEditingProduct(null);
        return;
      }

      setShowModal(false);
      setEditingProduct(null);
      // Refetch products to get updated data
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      const errorMessage = err.message || "Failed to save product";
      alert(errorMessage);
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
              <th className="p-3 text-left">Total Inventory</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Sub Category</th>
              <th className="p-3 text-left">Stock Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {currentProducts.map((product, idx) => {
                return (
                <tr
                  key={product.id}
                  className="shadow-sm rounded-sm hover:bg-gray-50 transition border-b-4 border-gray-200 bg-white"
                >
                  <td className="p-3">{product.n !== undefined ? product.n : indexOfFirst + idx + 1}</td>
                  <td className="p-3 font-semibold">{product.name}</td>
                  <td className="p-3 font-semibold">{product.stock || 0}</td>
                  <td className="p-3">{product.category || "N/A"}</td>
                  <td className="p-3">{product.subCategory || "N/A"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stockStatus === "in_stock" 
                        ? "bg-green-100 text-green-700" 
                        : product.stockStatus === "out_of_stock"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {product.stockStatusLabel || product.stockStatus || "In Stock"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleUpdateStock(product)}
                        className="text-orange-600 hover:text-orange-700"
                        title="Update Stock"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredProducts.length > 0 && (
        <div className="flex justify-between items-center mt-6 max-w-[98%] mx-auto">
          <div className="text-sm text-gray-600">
            {pagination && (
              <>
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} of{" "}
                {pagination.totalProducts} products
              </>
            )}
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
              disabled={currentPage === totalPages || currentPage >= totalPages}
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

      {/* Update Stock Modal */}
      {isUpdateStockModalOpen && selectedProductForUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <form onSubmit={handleSubmitStockUpdate}>
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900">
                  Update Stock
                </h3>
                <button
                  type="button"
                  onClick={closeUpdateStockModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-semibold text-gray-800">
                    Product: {selectedProductForUpdate.name}
                  </p>
                  <p className="text-gray-600">
                    SKU: {selectedProductForUpdate.skuHsn || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Current Stock: {selectedProductForUpdate.stock || 0}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="updateStockAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount to Add *
                  </label>
                  <input
                    type="number"
                    id="updateStockAmount"
                    name="updateStockAmount"
                    value={updateStockAmount}
                    onChange={(e) => setUpdateStockAmount(e.target.value)}
                    placeholder="Enter amount to add to stock"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                    min="1"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the quantity to add to current stock
                  </p>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>
              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  type="button"
                  onClick={closeUpdateStockModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={updatingStock}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                  disabled={updatingStock}
                >
                  {updatingStock ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Update Stock
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InventoryManagement;
