import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import AddProductModal from "../../components/AddProduct";
import api from "../../api/api";

const PendingProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState(null);

  // Modal states (same as AllProduct)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const canvasRef = useRef(null);

  // Fetch Pending Products
  const fetchPendingProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/product/pending`, {
        params: {
          page: page,
          limit: itemsPerPage,
        },
      });

      if (response.data.success) {
        // Transform products to include productNumber
        const transformedProducts = response.data.data.map((product) => ({
          ...product,
          productId: product.productNumber || product._id,
        }));
        setProducts(transformedProducts);
        setTotalProducts(response.data.pagination.total);
        setTotalPages(
          response.data.pagination.pages ||
            response.data.pagination.totalPages ||
            1,
        );
      }
    } catch (error) {
      console.error("Error fetching pending products:", error);
      if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        alert("Failed to fetch pending products. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount and page change
  useEffect(() => {
    fetchPendingProducts(currentPage);
  }, [currentPage]);

  // Approve Product Function
  const handleApprove = async (productId) => {
    if (!window.confirm("Are you sure you want to approve this product?")) {
      return;
    }

    setProcessingId(productId);

    try {
      const response = await api.put(`/api/product/approve/${productId}`, {});

      if (response.data.success) {
        alert("Product approved successfully!");
        // Refresh the product list
        fetchPendingProducts(currentPage);
      }
    } catch (error) {
      console.error("Error approving product:", error);
      if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to approve product. Please try again.",
        );
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Reject Product Function
  const handleReject = async (productId) => {
    const reason = prompt("Please provide a reason for rejection (optional):");

    if (reason === null) return; // User cancelled

    setProcessingId(productId);

    try {
      const response = await api.put(`/api/product/reject/${productId}`, {
        rejectionReason: reason || "No reason provided",
      });

      if (response.data.success) {
        alert("Product rejected successfully!");
        // Refresh the product list
        fetchPendingProducts(currentPage);
      }
    } catch (error) {
      console.error("Error rejecting product:", error);
      if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to reject product. Please try again.",
        );
      }
    } finally {
      setProcessingId(null);
    }
  };

  // 🟢 Handle Edit Product (same as AllProduct)
  const handleEdit = async (productId) => {
    try {
      // Find product from current list
      let product = products.find(
        (p) => p._id === productId || p.id === productId,
      );

      if (!product) {
        // If product not in current list, fetch it from API
        const response = await api.get(`/api/admin/products/${productId}`);
        if (response.data.success) {
          product = response.data.data;
        } else {
          // Try general product endpoint as fallback
          try {
            const fallbackResponse = await api.get(`/api/product/${productId}`);
            if (fallbackResponse.data.success) {
              product = fallbackResponse.data.data;
            }
          } catch (fallbackError) {
            console.error("Fallback endpoint also failed:", fallbackError);
          }
        }
      }

      if (product) {
        // Normalize product data for edit modal
        const normalizedProduct = {
          ...product,
          id: product._id || product.id,
          productId: product._id || product.id || product.productId,
          productNumber:
            product.productNumber || product.productno || product._id,
          name: product.productName || product.name,
          productName: product.productName || product.name,
          sku: product.skuHsn || product.sku,
          skuHsn: product.skuHsn || product.sku,
          // Ensure category and subCategory are properly formatted
          category:
            product.category?._id ||
            product.category?.$oid ||
            product.category ||
            null,
          subCategory:
            product.subCategory?._id ||
            product.subCategory?.$oid ||
            product.subCategory ||
            null,
        };

        setEditingProduct(normalizedProduct);
        setIsEditMode(true);
        setIsModalOpen(true);
      } else {
        alert("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      alert("Failed to load product for editing");
    }
  };

  // 🟢 Handle Product Updated (same as AllProduct)
  const handleProductUpdated = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProduct(null);
    // Refresh products list
    fetchPendingProducts(currentPage);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // Get vendor name safely
  const getVendorName = (product) => {
    return product.vendor?.vendorName || product.vendor || "No Vendor";
  };

  // Filtering logic - Fixed to handle null vendors
  const filteredByVendor =
    selectedVendor === "All Vendors"
      ? products
      : products.filter((p) => {
          const vendorName = getVendorName(p);
          return vendorName === selectedVendor;
        });

  const searchedProducts = filteredByVendor.filter((product) => {
    if (!searchQuery.trim()) {
      return true; // Show all products if search is empty
    }

    const searchLower = searchQuery.toLowerCase();
    
    // Helper function to safely convert values to searchable strings
    const toSearchableString = (value) => {
      if (value === null || value === undefined) return "";
      if (typeof value === "number") return value.toString();
      if (typeof value === "boolean") return value.toString();
      if (Array.isArray(value)) return value.join(" ");
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };
    
    // Search through all product fields
    const searchableFields = [
      // IDs
      toSearchableString(product.productNumber),
      toSearchableString(product.productId),
      toSearchableString(product._id),
      toSearchableString(product.productno),
      // Names
      toSearchableString(product.productName),
      toSearchableString(product.name),
      // Vendor
      toSearchableString(getVendorName(product)),
      toSearchableString(product.vendor?.vendorName),
      toSearchableString(product.vendor),
      // Categories
      toSearchableString(product.category?.name),
      toSearchableString(product.category),
      toSearchableString(product.subCategory?.name),
      toSearchableString(product.subCategory),
      // Description
      toSearchableString(product.description),
      // SKU
      toSearchableString(product.sku),
      toSearchableString(product.skuHsn),
      // Status
      toSearchableString(product.status),
      toSearchableString(product.approvalStatus),
      // Price (convert to string for searching)
      toSearchableString(product.salePrice),
      toSearchableString(product.regularPrice),
      toSearchableString(product.actualPrice),
      // Inventory
      toSearchableString(product.inventory),
      toSearchableString(product.currentInventory),
      toSearchableString(product.initialInventory),
      // Cashback
      toSearchableString(product.cashback),
      // Tags (handle both string and array)
      toSearchableString(product.tags),
      // Date
      toSearchableString(product.date),
      toSearchableString(product.createdAt),
      // Additional fields that might exist
      toSearchableString(product.productType),
      toSearchableString(product.discountPercentage),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableFields.includes(searchLower);
  });

  const EmptyState = () => (
    <tbody>
      <tr>
        <td
          colSpan="9"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No pending products found.
        </td>
      </tr>
    </tbody>
  );

  // Get unique vendors - handle null vendors
  const uniqueVendors = [
    ...new Set(
      products
        .map((p) => getVendorName(p))
        .filter((name) => name !== "No Vendor"),
    ),
  ];

  return (
    <DashboardLayout>
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-col lg:flex-row lg:items-center ml-8 lg:justify-between gap-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
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
              placeholder="Search by ID, Name, Vendor, Category, SKU, Price, Status..."
              className="flex-1 px-4 text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-4 sm:px-6 h-full transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="text-sm font-semibold text-gray-700">
          Total Pending: {searchedProducts.length}
        </div>
      </div>

      <div className="bg-white rounded-sm ml-8 shadow-sm overflow-x-auto max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Product ID</th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Sub Category</th>
              <th className="p-3 text-left">Sale Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 pr-6 text-center">Actions</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              {Array.from({ length: itemsPerPage }).map((_, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 animate-pulse bg-white"
                >
                  {Array.from({ length: 10 }).map((__, j) => (
                    <td key={j} className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-[80%]"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : searchedProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {searchedProducts.map((product, idx) => (
                <tr
                  key={product._id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="p-3 font-mono text-xs">
                    {product.productNumber || product._id}
                  </td>
                  <td className="p-3 font-medium">{product.productName}</td>
                  <td className="p-3">{formatDate(product.createdAt)}</td>
                  <td className="p-3">
                    <span
                      className={
                        getVendorName(product) === "No Vendor"
                          ? "text-gray-400 italic"
                          : ""
                      }
                    >
                      {getVendorName(product)}
                    </span>
                  </td>
                  <td className="p-3">{product.category?.name || "N/A"}</td>
                  <td className="p-3">{product.subCategory?.name || "N/A"}</td>
                  <td className="p-3 font-semibold">
                    {formatPrice(product.salePrice)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        product.approvalStatus === "pending"
                          ? "text-yellow-600"
                          : product.approvalStatus === "approved"
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {(() => {
                        const status =
                          product.approvalStatus?.toLowerCase() || "pending";
                        if (status === "pending") return "pending";
                        if (status === "approved") return "Approved";
                        if (status === "rejected") return "Rejected";
                        return (
                          product.approvalStatus?.charAt(0).toUpperCase() +
                            product.approvalStatus?.slice(1) || "Pending"
                        );
                      })()}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="View product details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* 🟢 Edit Button - Now opens modal instead of navigating */}
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="text-orange-600 hover:text-orange-700 transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      {/* Approve Button */}
                      <button
                        onClick={() => handleApprove(product._id)}
                        disabled={processingId === product._id}
                        className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Approve product"
                      >
                        {processingId === product._id ? (
                          <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => handleReject(product._id)}
                        disabled={processingId === product._id}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Reject product"
                      >
                        {processingId === product._id ? (
                          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-end pl-8 items-center gap-6 mt-8 max-w-[95%] mx-auto mb-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className={`px-1 hover:text-orange-500 transition-colors ${
                      currentPage === page
                        ? "text-orange-600 font-semibold"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                ),
              );
            })()}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* 🟢 Add Product Modal - Same as AllProduct */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingProduct(null);
        }}
        onSuccess={handleProductUpdated}
        onProductAdded={fetchPendingProducts}
        onProductUpdated={handleProductUpdated}
        isEditMode={isEditMode}
        editingProduct={editingProduct}
      />
    </DashboardLayout>
  );
};

export default PendingProduct;
