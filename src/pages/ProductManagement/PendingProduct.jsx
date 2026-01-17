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
import axios from "axios";

const API_BASE_URL = "http://46.202.164.93/api";

const PendingProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const canvasRef = useRef(null);

  // Fetch Pending Products
  const fetchPendingProducts = async (page = 1) => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_BASE_URL}/product/pending`, {
        params: {
          page: page,
          limit: itemsPerPage,
        },
        headers: headers,
        withCredentials: true,
      });

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalProducts(response.data.pagination.total);
        setTotalPages(response.data.pagination.pages);
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
      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.put(
        `${API_BASE_URL}/product/approve/${productId}`,
        {},
        {
          headers: headers,
          withCredentials: true,
        }
      );

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
            "Failed to approve product. Please try again."
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
      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.put(
        `${API_BASE_URL}/product/reject/${productId}`,
        {
          rejectionReason: reason || "No reason provided",
        },
        {
          headers: headers,
          withCredentials: true,
        }
      );

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
            "Failed to reject product. Please try again."
        );
      }
    } finally {
      setProcessingId(null);
    }
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

  // Filtering logic
  const filteredByVendor =
    selectedVendor === "All Vendors"
      ? products
      : products.filter((p) => p.vendor?.vendorName === selectedVendor);

  const searchedProducts = filteredByVendor.filter((product) =>
    [
      product._id,
      product.vendor?.vendorName,
      product.category?.name,
      product.productName,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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

  const uniqueVendors = [
    ...new Set(products.map((p) => p.vendor?.vendorName).filter(Boolean)),
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
                  {Array.from({ length: 9 }).map((__, j) => (
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
                  <td className="p-3 font-mono text-xs">{product._id}</td>
                  <td className="p-3">{formatDate(product.createdAt)}</td>
                  <td className="p-3">{product.vendor?.vendorName || "N/A"}</td>
                  <td className="p-3">{product.category?.name || "N/A"}</td>
                  <td className="p-3">{product.subCategory?.name || "N/A"}</td>
                  <td className="p-3">{formatPrice(product.salePrice)}</td>
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
                      {product.approvalStatus.charAt(0).toUpperCase() +
                        product.approvalStatus.slice(1)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      {/* Approve Button */}
                      <button
                        onClick={() => handleApprove(product._id)}
                        disabled={processingId === product._id}
                        className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Approve product"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => handleReject(product._id)}
                        disabled={processingId === product._id}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Reject product"
                      >
                        <XCircle className="w-5 h-5" />
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
    </DashboardLayout>
  );
};

export default PendingProduct;
