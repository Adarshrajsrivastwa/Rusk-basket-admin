import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import AddProduct from "../../components/AddProduct";
import { BASE_URL } from "../../api/api";
import { Edit } from "lucide-react";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const vendors = ["Vendor 1", "Vendor 2", "Vendor 3"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from localStorage
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        if (!token) {
          setError("Please login to view product details");
          setLoading(false);
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        let foundProduct = null;

        // Try to fetch from all products list first (more reliable)
        try {
          console.log("Fetching all products to find product with ID:", id);
          const productsResponse = await fetch(
            `${BASE_URL}/api/admin/products?limit=1000`,
            {
              method: "GET",
              headers: headers,
              credentials: "include",
            },
          );

          if (productsResponse.ok) {
            const productsResult = await productsResponse.json();

            if (productsResult.success && Array.isArray(productsResult.data)) {
              // Try to find product by _id, productNumber, or productno
              foundProduct = productsResult.data.find(
                (p) =>
                  p._id === id ||
                  p.id === id ||
                  p.productNumber === id ||
                  p.productno === id,
              );

              if (foundProduct) {
                console.log("Found product in products list:", foundProduct);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching from products list:", err);
        }

        // If not found in list, try direct endpoints
        if (!foundProduct) {
          console.log("Product not found in list, trying direct endpoints");

          // Try admin-specific endpoint
          try {
            const response = await fetch(
              `${BASE_URL}/api/admin/products/${id}`,
              {
                method: "GET",
                headers: headers,
                credentials: "include",
              },
            );

            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                foundProduct = data.data;
                console.log("Found product via admin endpoint:", foundProduct);
              }
            }
          } catch (err) {
            console.error("Admin endpoint error:", err);
          }
        }

        // If still not found, try general product endpoint
        if (!foundProduct) {
          try {
            const response = await fetch(`${BASE_URL}/api/product/${id}`, {
              method: "GET",
              headers: headers,
              credentials: "include",
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                foundProduct = data.data;
                console.log(
                  "Found product via general endpoint:",
                  foundProduct,
                );
              }
            }
          } catch (err) {
            console.error("General endpoint error:", err);
          }
        }

        // If product found, normalize and set it
        if (foundProduct) {
          const normalizedProduct = {
            ...foundProduct,
            productNumber:
              foundProduct.productNumber ||
              foundProduct.productno ||
              foundProduct._id,
            approvalStatus:
              foundProduct.approvalStatus || foundProduct.status || "pending",
            productName:
              foundProduct.productName ||
              foundProduct.name ||
              "Unnamed Product",
            description: foundProduct.description || "",
            inventory: foundProduct.inventory || 0,
            initialInventory: foundProduct.initialInventory || 0,
            actualPrice: foundProduct.actualPrice || 0,
            regularPrice: foundProduct.regularPrice || 0,
            salePrice: foundProduct.salePrice || 0,
            cashback: foundProduct.cashback || 0,
            tax: foundProduct.tax || 0,
            discountPercentage: foundProduct.discountPercentage || 0,
            skuHsn: foundProduct.skuHsn || "N/A",
            isActive:
              foundProduct.isActive !== undefined
                ? foundProduct.isActive
                : true,
            hasOffer:
              foundProduct.hasOffer !== undefined
                ? foundProduct.hasOffer
                : false,
          };

          setProduct(normalizedProduct);

          // Set first image as selected by default
          if (normalizedProduct.images && normalizedProduct.images.length > 0) {
            setSelectedImage(normalizedProduct.images[0].url);
          } else if (normalizedProduct.thumbnail) {
            setSelectedImage(normalizedProduct.thumbnail);
          }
        } else {
          // Product not found
          console.error("Product not found with ID:", id);
          setError(
            `Product not found with ID: ${id}. This product may have been deleted or the ID is incorrect.`,
          );
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Error fetching product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

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
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex w-48 items-center justify-center gap-2 px-6 py-2 text-[13px] bg-[#FF7B1D] hover:bg-orange-600 rounded border border-gray-300 transition-colors text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
            <p className="font-semibold mb-2">Error Loading Product</p>
            <p>{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="max-w-[96%] mx-auto mt-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex w-48 items-center justify-center gap-2 px-6 py-2 text-[13px] bg-[#FF7B1D] hover:bg-orange-600 rounded border border-gray-300 transition-colors text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded">
            Product not found
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get approval status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      approved: "bg-green-100 text-green-800 border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return statusStyles[status] || statusStyles.pending;
  };

  // Format status label
  const getStatusLabel = (status) => {
    if (!status) return "pending";
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") return "pending";
    if (statusLower === "approved") return "Approved";
    if (statusLower === "rejected") return "Rejected";
    return status.toUpperCase();
  };

  // Handle Edit Product
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  // Handle product update success
  const handleProductUpdated = () => {
    setIsEditModalOpen(false);
    // Refresh product data
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <div className="max-w-[96%] mx-auto mt-2 mb-10">
        {/* ---------- Back Button and Edit Button ---------- */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex w-48 items-center justify-center gap-2 px-6 py-2 text-[13px] bg-[#FF7B1D] hover:bg-orange-600 rounded border border-gray-300 transition-colors text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          {product && (
            <button
              onClick={handleEdit}
              className="flex items-center justify-center gap-2 px-6 py-2 text-[13px] bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
              title="Edit Product"
            >
              <Edit size={16} />
              Edit Product
            </button>
          )}
        </div>

        {/* ---------- Product Detail Section ---------- */}
        <div className="bg-white border border-gray-300 p-4 text-[13px] rounded shadow-sm">
          {/* Status Badge */}
          <div className="mb-3">
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-medium border ${getStatusBadge(
                product.approvalStatus,
              )}`}
            >
              {getStatusLabel(product.approvalStatus || "pending")}
            </span>
            {product.isActive && (
              <span className="ml-2 inline-block px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                ACTIVE
              </span>
            )}
            {product.hasOffer && (
              <span className="ml-2 inline-block px-3 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-300">
                🔥 OFFER ACTIVE
              </span>
            )}
          </div>

          {/* Product Title */}
          <p className="font-semibold">
            Product Title:{" "}
            <span className="font-normal">
              {product.productName || "Unnamed Product"}
            </span>
          </p>

          {/* Product Number */}
          <p className="mt-1">
            <span className="font-semibold">Product Number:</span>{" "}
            {product.productNumber || product.productno || product._id || "N/A"}
          </p>

          {/* Product ID (Internal) */}
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold">Internal ID:</span>{" "}
            {product._id || product.id}
          </p>

          {/* Product Description */}
          <p className="mt-1 leading-relaxed">
            <span className="font-semibold">Product Description: </span>
            {product.description || "No description available"}
          </p>

          {/* Product Info Grid */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-1 max-w-4xl text-[13px]">
            <p>
              <span className="font-semibold">Inventory:</span>{" "}
              {product.inventory || 0} units
            </p>
            <p>
              <span className="font-semibold">Initial Inventory:</span>{" "}
              {product.initialInventory || 0}
            </p>
            <p>
              <span className="font-semibold">Actual Price:</span> ₹
              {product.actualPrice || 0}
            </p>
            <p>
              <span className="font-semibold">Regular Price:</span> ₹
              {product.regularPrice || 0}
            </p>
            <p>
              <span className="font-semibold">Sale Price:</span> ₹
              {product.salePrice || 0}
            </p>
            {product.originalSalePrice && (
              <p>
                <span className="font-semibold">Original Sale Price:</span> ₹
                {product.originalSalePrice}
              </p>
            )}
            <p>
              <span className="font-semibold">Discount:</span>{" "}
              {product.discountPercentage || 0}%
            </p>
            <p>
              <span className="font-semibold">Cashback:</span> ₹
              {product.cashback || 0}
            </p>
            <p>
              <span className="font-semibold">Tax:</span> {product.tax || 0}%
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
              <span className="font-semibold">SKU/HSN:</span>{" "}
              {product.skuHsn || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Product Type:</span>{" "}
              {product.productType?.value || "N/A"}{" "}
              {product.productType?.unit || ""}
            </p>
          </div>

          {/* Vendor Information */}
          {product.vendor && (
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="font-semibold mb-1">Vendor Information:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[13px]">
                <p>
                  <span className="font-semibold">Store Name:</span>{" "}
                  {product.vendor.storeName}
                </p>
                <p>
                  <span className="font-semibold">Vendor Name:</span>{" "}
                  {product.vendor.vendorName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {product.vendor.email}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {product.vendor.contactNumber}
                </p>
              </div>
            </div>
          )}

          {/* Offer Information */}
          {product.hasOffer && product.offer && (
            <div className="mt-3 p-3 bg-purple-50 rounded border border-purple-200">
              <p className="font-semibold mb-1">🔥 Active Offer:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 text-[13px]">
                <p>
                  <span className="font-semibold">Discount:</span>{" "}
                  {product.offer.discountPercentage}%
                </p>
                <p>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {formatDate(product.offer.startDate)}
                </p>
                <p>
                  <span className="font-semibold">End Date:</span>{" "}
                  {formatDate(product.offer.endDate)}
                </p>
                {product.offer.isDailyOffer && (
                  <p className="text-purple-700 font-semibold">
                    ⭐ Daily Offer
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Approval Information */}
          {product.approvedBy && (
            <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
              <p className="font-semibold mb-1">Approval Details:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[13px]">
                <p>
                  <span className="font-semibold">Approved By:</span>{" "}
                  {product.approvedBy.name}
                </p>
                <p>
                  <span className="font-semibold">Approved At:</span>{" "}
                  {formatDate(product.approvedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <p className="mt-3 leading-relaxed">
              <span className="font-semibold">Tags:</span>{" "}
              <span className="inline-flex flex-wrap gap-1">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </p>
          )}

          {/* Location */}
          {product.latitude && product.longitude && (
            <p className="mt-2">
              <span className="font-semibold">Location:</span>{" "}
              {product.latitude}, {product.longitude}
            </p>
          )}

          {/* Timestamps */}
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
            <p>
              <span className="font-semibold">Created:</span>{" "}
              {formatDate(product.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Last Updated:</span>{" "}
              {formatDate(product.updatedAt)}
            </p>
          </div>

          {/* ---------- Image Section ---------- */}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            {/* Left: Large Image */}
            <div className="lg:w-3/4 w-full border border-gray-300 bg-gray-50 h-[300px] sm:h-[400px] lg:h-[670px] rounded overflow-hidden flex justify-center items-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.productName}
                  className="object-contain h-full w-full"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <p>No image available</p>
                </div>
              )}
            </div>

            {/* Right: Image Grid */}
            <div className="lg:w-1/4 w-full flex flex-col">
              {/* Thumbnail Preview */}
              {product.thumbnail && (
                <div className="border border-orange-300 rounded bg-white h-[150px] sm:h-[180px] lg:h-[220px] mb-3 flex justify-center items-center overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt="thumbnail"
                    className="object-cover h-full w-full cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedImage(product.thumbnail)}
                  />
                </div>
              )}

              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, i) => (
                    <div
                      key={i}
                      className={`border rounded bg-white h-[75px] sm:h-[100px] flex items-center justify-center overflow-hidden cursor-pointer ${
                        selectedImage === img.url
                          ? "border-orange-500 border-2"
                          : "border-orange-300"
                      }`}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={`product-${i}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 sm:col-span-2 text-center text-gray-400 text-sm">
                    No additional images
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {product && (
        <AddProduct
          key={`edit-${product._id || product.id}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isEditMode={true}
          editingProduct={product}
          onProductAdded={handleProductUpdated}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </DashboardLayout>
  );
};

export default SingleProduct;
