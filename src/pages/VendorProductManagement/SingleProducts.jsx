import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import AddProductModal from "../../components/AddProduct";

const API_BASE_URL = "http://46.202.164.93/api";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const vendors = ["Vendor 1", "Vendor 2", "Vendor 3"];

  // Utility function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/product/${id}`, {
          headers: headers,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const result = await response.json();

        if (result.success && result.data) {
          setProduct(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle Edit Product
  const handleEdit = () => {
    if (!product) return;

    setIsEditModalOpen(true);
  };

  // Handle Product Updated
  const handleProductUpdated = async (updatedProduct) => {
    console.log("Product updated, refreshing:", updatedProduct);
    setIsEditModalOpen(false);

    // Refresh product data
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Handle Delete Product
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = getAuthToken();

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/product/vendor/${id}`, {
        method: "DELETE",
        headers: headers,
        credentials: "include",
      });

      if (response.ok) {
        alert("Product deleted successfully!");
        navigate("/vendor/products");
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Handle Search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/vendor/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle Add New Product
  const handleAddNewProduct = () => {
    navigate("/vendor/products");
  };

  // ✅ Skeleton Loader
  const SkeletonLoader = () => (
    <div className="max-w-[96%] mx-auto mt-4 mb-10 animate-pulse">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-2 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded w-[100px]"></div>
          ))}
          <div className="h-8 bg-gray-200 rounded w-40 mt-2"></div>
        </div>
        <div className="ml-auto flex flex-wrap gap-2 items-center w-full md:w-auto mt-2">
          <div className="h-8 bg-gray-200 rounded w-full md:w-[400px]"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>

        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="lg:w-3/4 w-full h-[300px] sm:h-[400px] lg:h-[670px] bg-gray-200 rounded"></div>
          <div className="lg:w-1/4 w-full flex flex-col gap-3">
            <div className="h-[150px] sm:h-[180px] lg:h-[220px] bg-gray-200 rounded"></div>
            <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[75px] sm:h-[100px] bg-gray-200 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <SkeletonLoader />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-[96%] mx-auto mt-4 mb-10">
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
            <p className="font-semibold">Error loading product</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="max-w-[96%] mx-auto mt-4 mb-10">
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded">
            <p>Product not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get images
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[selectedImage]?.url
      : product.thumbnail ||
        "https://via.placeholder.com/600x600.png?text=No+Image";

  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [];

  // Format product type display
  const getProductType = () => {
    if (product.productType) {
      return `${product.productType.value} ${product.productType.unit}`;
    }
    return "N/A";
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[96%] mx-auto mt-2 mb-10">
        {/* ---------- Top Header Buttons ---------- */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Left Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/vendor/products")}
              className="px-4 py-[6px] text-[13px] bg-white hover:bg-orange-100 rounded border border-orange-500"
            >
              All
            </button>
            {["In Review", "Approved", "Rejected"].map((label, i) => (
              <button
                key={i}
                className="px-4 py-[6px] text-[13px] bg-white hover:bg-orange-100 rounded border border-gray-300"
              >
                {label}
              </button>
            ))}

            {/* Select Vendor Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-[6px] text-[13px] bg-white hover:bg-orange-100 rounded border border-gray-300 flex items-center gap-1"
              >
                {product.vendor?.storeName ||
                  product.vendor?.vendorName ||
                  "Select Vendor"}{" "}
                <span className="text-sm">▾</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
                  {vendors.map((vendor, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-[13px]"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {vendor}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search and Add New Product */}
          <div className="ml-auto flex flex-wrap gap-2 items-center">
            <div className="flex flex-1 min-w-[200px] md:min-w-[300px] lg:min-w-[400px] items-center border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Product Search by Product Name, Vendor Name, Category etc."
                className="px-3 py-[6px] text-[13px] w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-[#ff7f27] text-white px-4 py-[6px] text-[13px] hover:bg-[#e96e17]"
              >
                Search
              </button>
            </div>

            <button
              onClick={handleAddNewProduct}
              className="bg-black text-white px-4 py-[6px] text-[13px] rounded hover:bg-gray-800"
            >
              + Add New Product
            </button>
          </div>
        </div>

        {/* ---------- Product Detail Section ---------- */}
        <div className="bg-white border border-gray-300 p-4 text-[13px] rounded shadow-sm">
          {/* Product Title with Status and Action Buttons */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-[15px]">
                  Product Title:{" "}
                  <span className="font-normal">{product.productName}</span>
                </p>
                <span
                  className={`px-2 py-1 text-[11px] font-semibold rounded border ${getStatusColor(
                    product.approvalStatus
                  )}`}
                >
                  {product.approvalStatus?.toUpperCase() || "PENDING"}
                </span>
                {product.isActive && (
                  <span className="px-2 py-1 text-[11px] font-semibold rounded border bg-blue-50 text-blue-600 border-blue-200">
                    ACTIVE
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-[12px] bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Edit Product"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-[12px] bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="Delete Product"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Product Description */}
          <p className="mt-1 leading-relaxed">
            <span className="font-semibold">Product Description: </span>
            {product.description || "No description available"}
          </p>

          {/* Vendor Information */}
          {product.vendor && (
            <p className="mt-1 leading-relaxed">
              <span className="font-semibold">Vendor: </span>
              {product.vendor.vendorName} ({product.vendor.storeName}) -{" "}
              {product.vendor.contactNumber}
              {product.vendor.email && ` - ${product.vendor.email}`}
            </p>
          )}

          {/* Product Info Grid */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-1 max-w-3xl text-[13px]">
            <p>
              <span className="font-semibold">Inventory:</span>{" "}
              <span
                className={
                  product.inventory <= 10
                    ? "text-red-600 font-semibold"
                    : product.inventory <= 50
                    ? "text-yellow-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {product.inventory} units
              </span>
            </p>
            <p>
              <span className="font-semibold">Actual Price:</span> ₹
              {product.actualPrice}
            </p>
            <p>
              <span className="font-semibold">Regular Price (MRP):</span> ₹
              {product.regularPrice}
            </p>
            <p>
              <span className="font-semibold">Sale Price:</span>{" "}
              <span className="text-green-600 font-semibold">
                ₹{product.salePrice}
              </span>
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.category?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Sub Category:</span>{" "}
              {product.subCategory?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">SKU/HSN:</span> {product.skuHsn}
            </p>
            <p>
              <span className="font-semibold">Product Type:</span>{" "}
              {getProductType()}
            </p>
            {product.cashback > 0 && (
              <p>
                <span className="font-semibold">Cashback:</span>{" "}
                <span className="text-green-600 font-semibold">
                  {product.cashback}%
                </span>
              </p>
            )}
            {product.discountPercentage > 0 && (
              <p>
                <span className="font-semibold">Discount:</span>{" "}
                <span className="text-orange-600 font-semibold">
                  {product.discountPercentage}%
                </span>
              </p>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <p className="mt-3 leading-relaxed">
              <span className="font-semibold">Tags:</span>{" "}
              {Array.isArray(product.tags)
                ? product.tags.join(", ")
                : product.tags}
            </p>
          )}

          {/* Location */}
          {product.latitude && product.longitude && (
            <p className="mt-1 leading-relaxed">
              <span className="font-semibold">Location:</span> Lat:{" "}
              {product.latitude}, Long: {product.longitude}
            </p>
          )}

          {/* ---------- Image Section ---------- */}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            {/* Left: Large Image */}
            <div className="lg:w-3/4 w-full border-2 border-gray-300 bg-gray-50 h-[300px] sm:h-[400px] lg:h-[670px] rounded overflow-hidden flex justify-center items-center">
              <img
                src={mainImage}
                alt={product.productName}
                className="object-contain h-full w-full p-4"
              />
            </div>

            {/* Right: Image Grid */}
            <div className="lg:w-1/4 w-full flex flex-col">
              {/* Preview/Selected Image */}
              <div className="border-2 border-orange-400 rounded bg-white h-[150px] sm:h-[180px] lg:h-[220px] mb-3 flex justify-center items-center overflow-hidden">
                <img
                  src={mainImage}
                  alt="preview"
                  className="object-contain h-full w-full p-2"
                />
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
                {galleryImages.length > 0 ? (
                  galleryImages.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`border-2 rounded bg-white h-[75px] sm:h-[100px] flex items-center justify-center overflow-hidden cursor-pointer transition-all ${
                        selectedImage === i
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.productName}-${i}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 text-[12px] py-4">
                    No additional images
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleProductUpdated}
        isEditMode={true}
        editingProduct={
          product
            ? {
                id: product._id,
                productId: product._id,
                name: product.productName,
                productName: product.productName,
                description: product.description,
                sku: product.skuHsn,
                skuHsn: product.skuHsn,
                inventory: product.inventory,
                category: product.category,
                subCategory: product.subCategory,
                actualPrice: product.actualPrice,
                regularPrice: product.regularPrice,
                salePrice: product.salePrice,
                cashback: product.cashback,
                productType: product.productType,
                tags: product.tags,
                images: product.images,
              }
            : null
        }
      />
    </DashboardLayout>
  );
};

export default SingleProduct;
