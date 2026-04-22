import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Eye,
  Edit,
  Trash2,
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
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api`;

const AllProduct = () => {
  const [activeTab, setActiveTab] = useState("in_review");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const canvasRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedProductForQR, setSelectedProductForQR] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  const getAuthToken = () =>
    localStorage.getItem("token") || localStorage.getItem("authToken");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login to view products");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/vendor/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`Failed to fetch products: ${response.status}`);
      const result = await response.json();
      if (result.success && result.data && Array.isArray(result.data)) {
        const transformedProducts = result.data.map((product) => {
          let vendorName = "Unknown Vendor";
          if (product.vendor) {
            if (typeof product.vendor === "string") vendorName = product.vendor;
            else
              vendorName =
                product.vendor.vendorName ||
                product.vendor.storeName ||
                product.vendor.name ||
                "Unknown Vendor";
          }
          let displayStatus = "In Review";
          if (product.approvalStatus) {
            const s = product.approvalStatus.toLowerCase();
            if (s === "approved") displayStatus = "Approved";
            else if (s === "pending") displayStatus = "In Review";
            else if (s === "rejected") displayStatus = "Rejected";
          }
          const getCatName = (c) => {
            if (!c) return "Uncategorized";
            if (typeof c === "object")
              return c.name || c.code || "Uncategorized";
            return c;
          };
          return {
            id: product._id,
            productId: product.productNumber || product._id,
            date: product.createdAt
              ? new Date(product.createdAt).toISOString().split("T")[0]
              : "N/A",
            vendor: vendorName,
            category: getCatName(product.category),
            subCategory: product.subCategory
              ? typeof product.subCategory === "object"
                ? product.subCategory.name || "N/A"
                : product.subCategory
              : "N/A",
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
            categoryObj: product.category,
            subCategoryObj: product.subCategory,
            actualPrice: product.actualPrice || 0,
            isActive: product.isActive || false,
          };
        });
        setProducts(transformedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      alert("Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = async () => setTimeout(() => fetchProducts(), 500);

  const handleEdit = (product) => {
    setEditingProduct({
      id: product.id,
      productId: product.productId,
      name: product.productName,
      productName: product.productName,
      description: product.description,
      sku: product.skuHsn,
      skuHsn: product.skuHsn,
      inventory: product.inventory,
      category: product.categoryObj,
      subCategory: product.subCategoryObj,
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
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleProductUpdated = async () => {
    setIsEditMode(false);
    setEditingProduct(null);
    setTimeout(() => fetchProducts(), 500);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProduct(null);
  };

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

  const handleGenerateQR = async (product) => {
    try {
      const productId =
        product.productId || product.productNumber || product._id;
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
    } catch {
      alert("Failed to generate QR code.");
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    const productId =
      selectedProductForQR?.productId ||
      selectedProductForQR?.productNumber ||
      selectedProductForQR?._id;
    link.download = `${productId}-qr-code.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/product/vendor/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Product deleted successfully!");
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete product");
      }
    } catch {
      alert("Failed to delete product.");
    }
  };

  // Filtering + Pagination
  const filteredByTab = products.filter((p) => {
    if (activeTab === "approved") return p.status === "Approved";
    if (activeTab === "in_review") return p.status === "In Review";
    if (activeTab === "rejected") return p.status === "Rejected";
    return true;
  });

  const searchedProducts = filteredByTab.filter((product) =>
    [product.productId, product.vendor, product.category, product.name]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(searchedProducts.length / itemsPerPage),
  );
  const currentProducts = searchedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      Approved:
        "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100",
      "In Review":
        "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100",
      Rejected: "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-100",
    };
    const dots = {
      Approved: "bg-emerald-500",
      "In Review": "bg-amber-500",
      Rejected: "bg-red-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${dots[status] || "bg-gray-400"}`}
        />
        {status}
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
    { key: "in_review", label: "In Review" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <DashboardLayout>
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={qrCanvasRef} className="hidden" />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full max-w-full mx-auto px-1 mt-3 mb-3">
        {/* LEFT: Tabs */}
        <div className="flex flex-wrap items-center gap-2">
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
        </div>

        {/* RIGHT: Search + Add */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[340px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by ID, Name, Vendor..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
              Search
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 h-[38px] px-5 bg-gray-900 hover:bg-[#FF7B1D] text-white text-xs font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap"
          >
            + Add Product
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
              {searchedProducts.length} product
              {searchedProducts.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  "S.N",
                  "Product ID",
                  "Product Name",
                  "Stock",
                  "Sell Price",
                  "Regular Price",
                  "Status",
                  "Category",
                  "Sub Category",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 8 ? "text-right pr-5" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
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
                {currentProducts.map((product, idx) => (
                  <tr
                    key={product.id}
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
                        {String(product.productId || "").slice(0, 10)}…
                      </span>
                    </td>

                    {/* Product Name */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-700 max-w-[150px] truncate block">
                        {product.name}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-sm font-bold ${product.inventory <= 10 ? "text-red-500" : product.inventory <= 50 ? "text-amber-500" : "text-emerald-600"}`}
                      >
                        {product.inventory}
                      </span>
                    </td>

                    {/* Sell Price */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-gray-800">
                        {product.price}
                      </span>
                    </td>

                    {/* Regular Price */}
                    <td className="px-4 py-3.5 text-xs text-gray-400 font-medium">
                      ₹{product.regularPrice}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={product.status} />
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                        {product.category}
                      </span>
                    </td>

                    {/* Sub Category */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                        {product.subCategory}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleGenerateQR(product)}
                          className="action-btn bg-violet-50 text-violet-500 hover:bg-violet-100 hover:text-violet-700"
                          title="Generate QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/vendor/products/${product.id}`)
                          }
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View product"
                        >
                          <Eye className="w-3.5 h-3.5" />
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
                  {selectedProductForQR.productId ||
                    selectedProductForQR.productNumber ||
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
        onClose={handleModalClose}
        onSuccess={isEditMode ? handleProductUpdated : handleProductAdded}
        isEditMode={isEditMode}
        editingProduct={editingProduct}
      />
    </DashboardLayout>
  );
};

export default AllProduct;
