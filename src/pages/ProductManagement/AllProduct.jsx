import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Eye,
  Edit,
  Download,
  QrCode,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddProductModal from "../../components/AddProduct";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import api from "../../api/api";

const AllProduct = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const canvasRef = useRef(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedProductForQR, setSelectedProductForQR] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  const extractId = (id) => {
    if (!id) return "";
    if (typeof id === "string") {
      if (/^[0-9a-fA-F]{24}$/.test(id)) return id;
    }
    if (typeof id === "object" && id !== null) {
      if (id.$oid && /^[0-9a-fA-F]{24}$/.test(id.$oid)) return id.$oid;
      if (typeof id.toHexString === "function") {
        try {
          const h = id.toHexString();
          if (/^[0-9a-fA-F]{24}$/.test(h)) return h;
        } catch (_) {}
      }
      for (const key of ["_id", "id"]) {
        if (id[key] && /^[0-9a-fA-F]{24}$/.test(String(id[key])))
          return String(id[key]);
      }
      try {
        const m = JSON.stringify(id).match(/"([0-9a-fA-F]{24})"/);
        if (m) return m[1];
      } catch (_) {}
    }
    return "";
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/products", {
        params: { page, limit: itemsPerPage },
      });
      if (response.data.success) {
        const responseData = response.data;
        const transformedProducts = (responseData.data || []).map(
          (product) => ({
            ...product,
            productId: product.productId || product._id,
            productNumber:
              product.productno ||
              product.productNumber ||
              product.productId ||
              product._id,
            date: product.date || "N/A",
            vendor: product.vendor || "No Vendor",
            category: product.category || "N/A",
            subCategory: product.subCategory || "N/A",
            salePrice: product.salePrice || 0,
            status: product.status || "pending",
          }),
        );
        setProducts(transformedProducts);
        if (responseData.pagination) {
          setTotalProducts(
            responseData.pagination.total || responseData.count || 0,
          );
          setTotalPages(responseData.pagination.pages || 1);
        } else {
          setTotalProducts(responseData.count || 0);
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response?.status === 401)
        alert("Unauthorized. Please login again.");
      else alert("Failed to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleProductAdded = () => fetchProducts(currentPage);

  const handleGenerateQR = async (product) => {
    try {
      const productId =
        product.productNumber || product.productId || product._id;
      if (!productId) {
        alert("Product ID not found!");
        return;
      }
      const qrDataUrl = await QRCode.toDataURL(productId, {
        width: 300,
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
      });
      setSelectedProductForQR(product);
      setQrCodeDataUrl(qrDataUrl);
      setQrModalOpen(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code.");
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    const productId =
      selectedProductForQR?.productNumber ||
      selectedProductForQR?.productId ||
      selectedProductForQR?._id;
    link.download = `${productId}-qr-code.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await api.delete(`/api/admin/products/${id}`);
        if (response.data.success) {
          alert("Product deleted successfully!");
          fetchProducts(currentPage);
        }
      } catch (error) {
        alert("Failed to delete product.");
      }
    }
  };

  const handleEdit = async (productId) => {
    try {
      let rawProduct = null;
      try {
        const res = await api.get(`/api/admin/products/${productId}`);
        rawProduct =
          res.data?.data?.data || res.data?.data || res.data?.product || null;
        if (Array.isArray(rawProduct)) rawProduct = rawProduct[0];
      } catch (fetchErr) {
        try {
          const fallback = await api.get(`/api/product/${productId}`);
          rawProduct = fallback.data?.data || fallback.data?.product || null;
        } catch (fallbackErr) {
          console.error("Both endpoints failed:", fallbackErr);
        }
      }
      if (!rawProduct)
        rawProduct = products.find(
          (p) => p._id === productId || p.id === productId,
        );
      if (!rawProduct) {
        alert("Product not found");
        return;
      }

      const categoryId =
        extractId(rawProduct.category?._id) ||
        extractId(rawProduct.category) ||
        "";
      const subCategoryId =
        extractId(rawProduct.subCategory?._id) ||
        extractId(rawProduct.subCategory) ||
        "";

      const normalizedProduct = {
        ...rawProduct,
        _id: rawProduct._id || rawProduct.id || productId,
        id: rawProduct._id || rawProduct.id || productId,
        productId: rawProduct._id || rawProduct.id || productId,
        name: rawProduct.productName || rawProduct.name || "",
        productName: rawProduct.productName || rawProduct.name || "",
        sku: rawProduct.skuHsn || rawProduct.sku || "",
        skuHsn: rawProduct.skuHsn || rawProduct.sku || "",
        category: categoryId,
        subCategory: subCategoryId,
        actualPrice: rawProduct.actualPrice ?? 0,
        regularPrice: rawProduct.regularPrice ?? 0,
        salePrice: rawProduct.salePrice ?? 0,
        cashback: rawProduct.cashback ?? 0,
        tax: rawProduct.tax ?? 0,
        inventory: rawProduct.inventory ?? 0,
        productType: rawProduct.productType || null,
        images: Array.isArray(rawProduct.images) ? rawProduct.images : [],
        tags: Array.isArray(rawProduct.tags) ? rawProduct.tags : [],
      };
      setEditingProduct(normalizedProduct);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      alert("Failed to load product for editing");
    }
  };

  const handleProductUpdated = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProduct(null);
    fetchProducts(currentPage);
  };

  const handleView = (id) => navigate(`/products/${id}`);

  const getStatusLabel = (status) => {
    if (!status) return "pending";
    const s = status.toLowerCase();
    if (s === "pending") return "pending";
    if (s === "approved") return "approved";
    if (s === "rejected") return "rejected";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatPrice = (price) => `₹${price?.toLocaleString("en-IN") || 0}`;
  const getVendorName = (product) => product.vendor || "No Vendor";

  // ── Filtering ──
  const filteredByTab = products.filter((p) => {
    const status = (p.status || "").toLowerCase();
    if (activeTab === "approved") return status === "approved";
    if (activeTab === "pending") return status === "pending";
    if (activeTab === "rejected") return status === "rejected";
    return true;
  });

  const filteredByVendor =
    selectedVendor === "All Vendors"
      ? filteredByTab
      : filteredByTab.filter((p) => getVendorName(p) === selectedVendor);

  const filteredByDate = !selectedDate
    ? filteredByVendor
    : filteredByVendor.filter((p) => {
        if (p.date && p.date !== "N/A") {
          return p.date === selectedDate || p.date.startsWith(selectedDate);
        }
        if (p.createdAt) return p.createdAt.startsWith(selectedDate);
        return false;
      });

  const filteredByCategory =
    selectedCategory === "All Categories"
      ? filteredByDate
      : filteredByDate.filter(
          (p) =>
            (p.category || "").toLowerCase() === selectedCategory.toLowerCase(),
        );

  const searchedProducts = filteredByCategory.filter((product) => {
    if (!searchQuery.trim()) return true;
    const searchLower = searchQuery.toLowerCase();
    const toStr = (v) => {
      if (v == null) return "";
      if (Array.isArray(v)) return v.join(" ");
      if (typeof v === "object") return JSON.stringify(v);
      return String(v);
    };
    const haystack = [
      product.productNumber,
      product.productId,
      product._id,
      product.productno,
      product.productName,
      product.name,
      getVendorName(product),
      product.category,
      product.subCategory,
      product.description,
      product.sku,
      product.skuHsn,
      product.status,
      getStatusLabel(product.status),
      product.salePrice,
      product.regularPrice,
      product.actualPrice,
      product.inventory,
      product.cashback,
      product.tags,
      product.date,
      product.createdAt,
    ]
      .map(toStr)
      .join(" ")
      .toLowerCase();
    return haystack.includes(searchLower);
  });

  const uniqueVendors = [
    ...new Set(
      products
        .map((p) => getVendorName(p))
        .filter((name) => name !== "No Vendor"),
    ),
  ];

  const uniqueCategories = [
    ...new Set(products.map((p) => p.category).filter((c) => c && c !== "N/A")),
  ];

  const StatusBadge = ({ status }) => {
    const s = getStatusLabel(status);
    const styles = {
      approved:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      pending:
        "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      rejected:
        "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
    };
    const dots = {
      approved: "bg-emerald-500",
      pending: "bg-amber-500",
      rejected: "bg-red-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[s] || "bg-gray-100 text-gray-600 border border-gray-200"}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${dots[s] || "bg-gray-400"}`}
        />
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-24" : j === 8 ? "w-16 ml-auto" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="9" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Package className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No products found
            </p>
            <p className="text-gray-300 text-xs">
              Try adjusting your filters or search query
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <DashboardLayout>
      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate {
          animation: fadeSlideIn 0.25s ease forwards;
        }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.5;
          cursor: pointer;
        }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full max-w-full mx-auto px-1 mt-3 mb-3">
        {/* LEFT: Tabs + Vendor + Date + Category */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Pills */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Vendor Dropdown */}
          <select
            value={selectedVendor}
            onChange={(e) => {
              setSelectedVendor(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-xl text-sm px-3 h-[36px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm"
          >
            <option>All Vendors</option>
            {uniqueVendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 hidden sm:block" />

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 h-[36px] bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-200 transition-all">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="2"
                width="14"
                height="13"
                rx="2"
                stroke="#FF7B1D"
                strokeWidth="1.4"
              />
              <path
                d="M5 1v3M11 1v3M1 6h14"
                stroke="#FF7B1D"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border-none bg-transparent text-xs text-gray-700 outline-none cursor-pointer w-[110px]"
            />
            {selectedDate && (
              <button
                onClick={() => {
                  setSelectedDate("");
                  setCurrentPage(1);
                }}
                className="text-gray-300 hover:text-gray-500 text-sm leading-none ml-1"
                title="Clear date"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-xl text-sm px-3 h-[36px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm"
          >
            <option>All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* RIGHT: Search */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Product Inventory
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {searchedProducts.length} of {totalProducts} products
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90 w-12">
                  S.N
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Product ID
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Date
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Vendor
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Category
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Sub Category
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Sale Price
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Status
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-bold text-white tracking-wider uppercase opacity-90 pr-5">
                  Actions
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : searchedProducts.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {searchedProducts.map((product, idx) => (
                  <tr
                    key={product._id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </span>
                    </td>

                    {/* Product ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {(
                          product.productNumber ||
                          product.productId ||
                          product._id ||
                          ""
                        ).slice(0, 12)}
                        …
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-gray-500 text-xs">
                      {product.date}
                    </td>

                    {/* Vendor */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-sm font-medium ${!product.vendor || product.vendor === "No Vendor" ? "text-gray-300 italic text-xs" : "text-gray-700"}`}
                      >
                        {product.vendor || "No Vendor"}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                        {product.category || "N/A"}
                      </span>
                    </td>

                    {/* Sub Category */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                        {product.subCategory || "N/A"}
                      </span>
                    </td>

                    {/* Sale Price */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-gray-800">
                        {formatPrice(product.salePrice)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={product.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleView(product._id)}
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View product"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleGenerateQR(product)}
                          className="action-btn bg-violet-50 text-violet-500 hover:bg-violet-100 hover:text-violet-700"
                          title="Generate QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
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

      {/* ── Pagination ── */}
      {!loading && searchedProducts.length > 0 && (
        <div className="flex items-center justify-between px-1 mt-5 mb-6">
          <p className="text-xs text-gray-400 font-medium">
            Page{" "}
            <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
            of <span className="text-gray-600 font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <div className="flex items-center gap-1">
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
                    <span key={idx} className="px-1 text-gray-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === page
                          ? "bg-[#FF7B1D] text-white shadow-sm shadow-orange-200"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                );
              })()}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── QR Modal ── */}
      {qrModalOpen && selectedProductForQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">QR Code</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Scan to identify product
                </p>
              </div>
              <button
                onClick={() => {
                  setQrModalOpen(false);
                  setSelectedProductForQR(null);
                  setQrCodeDataUrl(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              {qrCodeDataUrl && (
                <div className="p-4 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-56 h-56"
                  />
                </div>
              )}
              <div className="text-center w-full bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">Product ID</p>
                <p className="text-sm font-bold text-gray-800 font-mono break-all">
                  {selectedProductForQR.productNumber ||
                    selectedProductForQR.productId ||
                    selectedProductForQR._id}
                </p>
              </div>
              <button
                onClick={handleDownloadQR}
                className="w-full bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:from-orange-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-sm shadow-orange-200"
              >
                <Download className="w-4 h-4" /> Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingProduct(null);
        }}
        onSuccess={isEditMode ? handleProductUpdated : handleProductAdded}
        onProductAdded={handleProductAdded}
        onProductUpdated={handleProductUpdated}
        isEditMode={isEditMode}
        editingProduct={editingProduct}
      />
    </DashboardLayout>
  );
};

export default AllProduct;
