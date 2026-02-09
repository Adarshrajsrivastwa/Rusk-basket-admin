import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2, Download } from "lucide-react";
import AddProductModal from "../../components/AddProduct";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import { BASE_URL } from "../../api/api";

// API Base URL - Make sure this matches your AddProduct component
const API_BASE_URL = `${BASE_URL}/api`;

const AllProduct = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 7;

  // Hidden canvas for barcode generation
  const canvasRef = useRef(null);

  // Utility function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  // 🟢 Fetch products from API (GET vendor products)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();

      if (!token) {
        console.error("No auth token found");
        alert("Please login to view products");
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Using the correct vendor products endpoint
      const response = await fetch(`${API_BASE_URL}/vendor/products`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      console.log("Fetch response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch error response:", errorText);
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const result = await response.json();

      console.log("Fetched products raw result:", result);
      console.log("Result.success:", result.success);
      console.log("Result.data:", result.data);

      if (result.success && result.data && Array.isArray(result.data)) {
        console.log("Number of products fetched:", result.data.length);

        // Transform API data to match component structure
        const transformedProducts = result.data.map((product) => {
          console.log("Processing product:", product._id, product.productName);

          // Extract vendor name from vendor object
          let vendorName = "Unknown Vendor";
          if (product.vendor) {
            if (typeof product.vendor === "string") {
              vendorName = product.vendor;
            } else if (product.vendor.vendorName) {
              vendorName = product.vendor.vendorName;
            } else if (product.vendor.storeName) {
              vendorName = product.vendor.storeName;
            } else if (product.vendor.name) {
              vendorName = product.vendor.name;
            }
          }

          // Map approvalStatus to display status
          let displayStatus = "In Review";
          if (product.approvalStatus) {
            const approvalStatus = product.approvalStatus.toLowerCase();
            if (approvalStatus === "approved") {
              displayStatus = "Approved";
            } else if (approvalStatus === "pending") {
              displayStatus = "In Review";
            } else if (approvalStatus === "rejected") {
              displayStatus = "Rejected";
            }
          }

          // Get category name - handle both nested object and ID
          let categoryName = "Uncategorized";
          if (product.category) {
            if (typeof product.category === "object" && product.category.name) {
              categoryName = product.category.name;
            } else if (
              typeof product.category === "object" &&
              product.category._id
            ) {
              categoryName = product.category._id;
            } else if (typeof product.category === "string") {
              categoryName = product.category;
            }
          }

          // Get subcategory name - handle both nested object and ID
          let subCategoryName = "N/A";
          if (product.subCategory) {
            if (
              typeof product.subCategory === "object" &&
              product.subCategory.name
            ) {
              subCategoryName = product.subCategory.name;
            } else if (
              typeof product.subCategory === "object" &&
              product.subCategory._id
            ) {
              subCategoryName = product.subCategory._id;
            } else if (typeof product.subCategory === "string") {
              subCategoryName = product.subCategory;
            }
          }

          return {
            id: product._id,
            productId: product.productNumber || product._id,
            date: product.createdAt
              ? new Date(product.createdAt).toISOString().split("T")[0]
              : "N/A",
            vendor: vendorName,
            category: categoryName,
            subCategory: subCategoryName,
            price: `₹${product.salePrice || product.regularPrice || 0}`,
            regularPrice: product.regularPrice || 0,
            salePrice: product.salePrice || 0,
            status: displayStatus,
            approvalStatus: product.approvalStatus || "pending",
            name: product.productName || "Unnamed Product",
            productName: product.productName || "Unnamed Product",
            images: product.images || [],
            description: product.description || "",
            sku: product.skuHsn || "",
            skuHsn: product.skuHsn || "",
            inventory: product.inventory || 0,
            cashback: product.cashback || 0,
            discountPercentage: product.discountPercentage || 0,
            tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
            productType: product.productType || {},
            // Keep original category and subcategory objects for editing
            categoryObj: product.category,
            subCategoryObj: product.subCategory,
            actualPrice: product.actualPrice || 0,
            isActive: product.isActive || false,
          };
        });

        console.log("Transformed products:", transformedProducts);
        setProducts(transformedProducts);
      } else {
        console.error("Invalid API response format:", result);
        console.log("Result.success:", result.success);
        console.log("Result.data exists:", !!result.data);
        console.log("Result.data is array:", Array.isArray(result.data));
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Error details:", error.message);
      // Show error message to user
      alert("Failed to load products. Please check console for details.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // 🟢 Handle successful product addition
  const handleProductAdded = async (newProduct) => {
    console.log("New product added, refreshing list:", newProduct);
    // Add a small delay to ensure backend has processed
    setTimeout(() => {
      fetchProducts();
    }, 500);
  };

  // 🟢 Handle Edit Product
  const handleEdit = (product) => {
    console.log("Editing product:", product);
    console.log("Product ID:", product.id);
    console.log("Product category:", product.categoryObj);
    console.log("Product subCategory:", product.subCategoryObj);

    // Prepare product data for editing with proper structure
    const editProduct = {
      id: product.id,
      productId: product.productId,
      name: product.productName,
      productName: product.productName,
      description: product.description,
      sku: product.skuHsn,
      skuHsn: product.skuHsn,
      inventory: product.inventory,
      category: product.categoryObj, // Use original object
      subCategory: product.subCategoryObj, // Use original object
      actualPrice: product.actualPrice,
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      cashback: product.cashback,
      discountPercentage: product.discountPercentage,
      productType: product.productType,
      tags: Array.isArray(product.tags)
        ? product.tags
        : product.tags
          ? product.tags.split(", ")
          : [],
      images: product.images,
      approvalStatus: product.approvalStatus,
      isActive: product.isActive,
    };

    console.log("Edit product data prepared:", editProduct);

    setEditingProduct(editProduct);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // 🟢 Handle successful product update
  const handleProductUpdated = async (updatedProduct) => {
    console.log("Product updated, refreshing list:", updatedProduct);
    setIsEditMode(false);
    setEditingProduct(null);
    // Add a small delay to ensure backend has processed
    setTimeout(() => {
      fetchProducts();
    }, 500);
  };

  // 🟢 Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProduct(null);
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
        const token = getAuthToken();

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Using 'delete product vendor' endpoint (DELETE method)
        const response = await fetch(`${API_BASE_URL}/product/vendor/${id}`, {
          method: "DELETE",
          headers: headers,
        });

        console.log("Delete response status:", response.status);

        if (response.ok) {
          const result = await response.json();
          console.log("Delete response:", result);

          // Remove from local state
          setProducts((prev) => prev.filter((p) => p.id !== id));
          alert("Product deleted successfully!");
        } else {
          const result = await response.json();
          console.error("Delete error:", result);
          alert(result.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  // 🟢 Approve Product (PUT approved product(admin))
  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this product?")) {
      try {
        const token = getAuthToken();

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/product/approve/${id}`, {
          method: "PUT",
          headers: headers,
        });

        if (response.ok) {
          // Update local state
          setProducts((prev) =>
            prev.map((p) =>
              p.id === id
                ? { ...p, status: "Approved", approvalStatus: "approved" }
                : p,
            ),
          );
          alert("Product approved successfully!");
        } else {
          const result = await response.json();
          alert(result.message || "Failed to approve product");
        }
      } catch (error) {
        console.error("Error approving product:", error);
        alert("Failed to approve product. Please try again.");
      }
    }
  };

  // 🟢 Reject Product (PUT reject product(admin))
  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this product?")) {
      try {
        const token = getAuthToken();

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/product/reject/${id}`, {
          method: "PUT",
          headers: headers,
        });

        if (response.ok) {
          // Update local state
          setProducts((prev) =>
            prev.map((p) =>
              p.id === id
                ? { ...p, status: "Rejected", approvalStatus: "rejected" }
                : p,
            ),
          );
          alert("Product rejected successfully!");
        } else {
          const result = await response.json();
          alert(result.message || "Failed to reject product");
        }
      } catch (error) {
        console.error("Error rejecting product:", error);
        alert("Failed to reject product. Please try again.");
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
      .includes(searchQuery.toLowerCase()),
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
          {Array.from({ length: 11 }).map((__, j) => (
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
          colSpan="11"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No products found.
        </td>
      </tr>
    </tbody>
  );

  // Get unique vendors for dropdown
  const uniqueVendors = [...new Set(products.map((p) => p.vendor))];

  return (
    <DashboardLayout>
      {/* Hidden Canvas for Barcode Generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center ml-2 sm:ml-8 lg:justify-between gap-4 max-w-[99%] mx-auto mt-0 mb-2 px-2 sm:px-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
          {/* Tabs */}
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
                className={`px-3 sm:px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-[#FF7B1D] text-white border-orange-500"
                    : "border-gray-400 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Vendor Filter */}
          <div className="flex items-center w-full sm:w-auto">
            <select
              value={selectedVendor}
              onChange={(e) => {
                setSelectedVendor(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-black rounded text-xs sm:text-sm px-2 sm:px-3 h-[36px] text-gray-800 focus:outline-none w-full sm:w-auto"
            >
              <option>All Vendors</option>
              {uniqueVendors.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center border border-black rounded overflow-hidden h-[36px] w-full lg:max-w-[400px]">
            <input
              type="text"
              placeholder="Search Product by ID, Name, Vendor, or Category..."
              className="flex-1 px-2 sm:px-4 text-xs sm:text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-xs sm:text-sm px-3 sm:px-6 h-full">
              Search
            </button>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end mt-2 lg:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white w-full sm:w-52 lg:w-60 px-4 sm:px-10 py-2.5 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-sm ml-0 sm:ml-8 shadow-sm overflow-x-auto max-w-[99%] mx-auto">
        <div className="min-w-[1200px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FF7B1D] text-black">
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  S.N
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Product ID
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Product Name
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Stock
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Sell Price
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Regular Price
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Status
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Category
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Sub Category
                </th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap text-xs sm:text-sm">
                  Vendor
                </th>
                <th className="p-2 sm:p-3 pr-6 text-right whitespace-nowrap text-xs sm:text-sm">
                  Action
                </th>
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
                    <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                      {indexOfFirst + idx + 1}
                    </td>
                    <td className="p-2 sm:p-3 font-medium whitespace-nowrap text-xs sm:text-sm">
                      {product.productId}
                    </td>
                    <td className="p-2 sm:p-3 font-medium whitespace-nowrap text-xs sm:text-sm">
                      {product.name}
                    </td>
                    <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                      <span
                        className={`font-semibold ${
                          product.inventory <= 10
                            ? "text-red-600"
                            : product.inventory <= 50
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {product.inventory}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 font-semibold text-green-600 whitespace-nowrap text-xs sm:text-sm">
                      {product.price}
                    </td>
                    <td className="p-2 sm:p-3 text-gray-600 whitespace-nowrap text-xs sm:text-sm">
                      ₹{product.regularPrice}
                    </td>
                    <td
                      className={`p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm ${
                        statusColors[product.status]
                      }`}
                    >
                      {product.status}
                    </td>
                    <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                      {product.category}
                    </td>
                    <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                      {product.subCategory}
                    </td>
                    <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                      {product.vendor}
                    </td>
                    <td className="p-2 sm:p-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2 sm:gap-3 text-orange-600">
                        {/* 🟢 Download Barcode Button */}
                        {/* <button
                          onClick={() =>
                            handleDownloadBarcode(product.productId)
                          }
                          className="text-orange-600 hover:text-blue-700"
                          title="Download barcode"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button> */}

                        {/* 🟢 Approve Button (only show if not approved) */}
                        {/* {product.status !== "Approved" && (
                          <button
                            onClick={() => handleApprove(product.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Approve product"
                          >
                            ✓
                          </button>
                        )} */}

                        {/* 🟢 Reject Button (only show if not rejected) */}
                        {/* {product.status !== "Rejected" && (
                          <button
                            onClick={() => handleReject(product.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Reject product"
                          >
                            ✗
                          </button>
                        )} */}

                        <button
                          onClick={() => handleEdit(product)}
                          className="hover:text-blue-700"
                          title="Edit product"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="hover:text-red-700"
                          title="Delete product"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/vendor/products/${product.id}`)
                          }
                          className="hover:text-blue-700"
                          title="View product details"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && searchedProducts.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between sm:justify-end pl-0 sm:pl-8 items-center gap-4 sm:gap-6 mt-8 max-w-[95%] mx-auto mb-6 px-4 sm:px-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-[#FF7B1D] text-white px-6 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            disabled={currentPage === 1}
          >
            Back
          </button>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-black font-medium overflow-x-auto">
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
                    className={`px-2 sm:px-1 ${
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
            className="bg-[#247606] text-white px-6 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={isEditMode ? handleProductUpdated : handleProductAdded}
        isEditMode={isEditMode}
        editingProduct={editingProduct}
      />
    </DashboardLayout>
  );
};

export default AllProduct;
