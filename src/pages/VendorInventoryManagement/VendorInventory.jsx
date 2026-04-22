import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  RefreshCw,
  X,
  Check,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  const [selectedProductForUpdate, setSelectedProductForUpdate] =
    useState(null);
  const [updateStockAmount, setUpdateStockAmount] = useState("");
  const [updatingStock, setUpdatingStock] = useState(false);

  const itemsPerPage = 10;

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      let currentVendorId = vendorId;
      if (!currentVendorId) {
        const storedVendorId = localStorage.getItem("vendorId");
        if (storedVendorId) {
          currentVendorId = storedVendorId;
          setVendorId(currentVendorId);
        } else {
          try {
            const profileResponse = await fetch(
              `${BASE_URL}/api/vendor/profile`,
              { method: "GET", credentials: "include", headers },
            );
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.success && profileData.data?._id) {
                currentVendorId = profileData.data._id;
                setVendorId(currentVendorId);
                localStorage.setItem("vendorId", currentVendorId);
              }
            }
          } catch {}
        }
      }
      const response = await fetch(
        `${BASE_URL}/api/analytics/vendor/inventory?page=${currentPage}`,
        { method: "GET", credentials: "include", headers },
      );
      if (!response.ok)
        throw new Error(`Failed to fetch products: ${response.status}`);
      const result = await response.json();
      if (result.success && result.data) {
        if (
          !currentVendorId &&
          result.data?.inventory?.length > 0 &&
          result.data.inventory[0].vendor?._id
        ) {
          currentVendorId = result.data.inventory[0].vendor._id;
          setVendorId(currentVendorId);
        }
        const getStockStatusLabel = (s) =>
          ({
            in_stock: "In Stock",
            out_of_stock: "Out of Stock",
            low_stock: "Low Stock",
          })[s] || "In Stock";
        const transformedProducts = result.data.inventory.map(
          (product, index) => ({
            id: product.productId,
            productId: product.productId,
            n:
              (result.data.pagination?.currentPage - 1) *
                (result.data.pagination?.limit || 20) +
              index +
              1,
            name: product.productName,
            category: product.category?.name || "General",
            subCategory: product.subCategory?.name || "N/A",
            stock: product.currentInventory || 0,
            initialInventory: product.initialInventory || 0,
            lowStockThreshold: 20,
            price: product.regularPrice || 0,
            regularPrice: product.regularPrice || 0,
            salePrice: 0,
            actualPrice: product.regularPrice || 0,
            vendor:
              product.vendor?.storeName || product.vendor?.vendorName || "N/A",
            vendorId: product.vendor?._id,
            status: getStockStatusLabel(product.stockStatus),
            stockStatus: product.stockStatus || "in_stock",
            stockStatusLabel: getStockStatusLabel(product.stockStatus),
            stockPercentage: product.stockPercentage || 100,
            skuHsn: product.skuHsn || "N/A",
          }),
        );
        setProducts(transformedProducts);
        setPagination(
          result.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalProducts: result.data.summary?.totalProducts || 0,
            limit: 20,
          },
        );
        setSummary(result.data.summary || null);
      } else {
        setError(result.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message || "Error loading products.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    let matchesTab = false;
    if (activeTab === "all") matchesTab = true;
    else if (activeTab === "instock")
      matchesTab =
        product.stockStatus === "in_stock" || product.status === "In Stock";
    else if (activeTab === "lowstock")
      matchesTab =
        product.stockStatus === "low_stock" ||
        product.status === "Low Stock" ||
        (product.stockPercentage < 20 &&
          product.stockStatus !== "out_of_stock");
    else if (activeTab === "outofstock")
      matchesTab =
        product.stockStatus === "out_of_stock" ||
        product.status === "Out of Stock" ||
        product.stock === 0;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.subCategory &&
        product.subCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.skuHsn &&
        product.skuHsn.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const useApiPagination = pagination && pagination.totalPages > 0;
  const currentProducts = useApiPagination
    ? filteredProducts
    : filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );
  const totalPages = useApiPagination
    ? pagination.totalPages
    : Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await fetch(`${BASE_URL}/api/product/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Failed to delete product");
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
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
    if (
      !selectedProductForUpdate ||
      !updateStockAmount ||
      parseFloat(updateStockAmount) <= 0
    ) {
      setError("Please enter a valid stock amount to add");
      return;
    }
    setUpdatingStock(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const productId =
        selectedProductForUpdate.productId || selectedProductForUpdate.id;
      const currentVendorId = vendorId || selectedProductForUpdate.vendorId;
      let response = null;
      if (currentVendorId && productId) {
        try {
          response = await fetch(
            `${BASE_URL}/api/analytics/vendor/product/${currentVendorId}/stock/${productId}`,
            {
              method: "PUT",
              credentials: "include",
              headers,
              body: JSON.stringify({
                addedProduct: parseFloat(updateStockAmount),
                stock:
                  (selectedProductForUpdate.stock || 0) +
                  parseFloat(updateStockAmount),
              }),
            },
          );
        } catch {}
      }
      if ((!response || !response.ok) && currentVendorId) {
        try {
          response = await fetch(
            `${BASE_URL}/api/analytics/vendor/product/${currentVendorId}/stock`,
            {
              method: "PUT",
              credentials: "include",
              headers,
              body: JSON.stringify({
                productId,
                addedProduct: parseFloat(updateStockAmount),
                stock:
                  (selectedProductForUpdate.stock || 0) +
                  parseFloat(updateStockAmount),
              }),
            },
          );
        } catch {}
      }
      if ((!response || !response.ok) && productId) {
        try {
          response = await fetch(
            `${BASE_URL}/api/product/update/${productId}`,
            {
              method: "PUT",
              credentials: "include",
              headers,
              body: JSON.stringify({
                stock:
                  (selectedProductForUpdate.stock || 0) +
                  parseFloat(updateStockAmount),
                inventory:
                  (selectedProductForUpdate.stock || 0) +
                  parseFloat(updateStockAmount),
              }),
            },
          );
        } catch {}
      }
      if (!response || !response.ok) {
        const errorData = response
          ? await response.json().catch(() => ({}))
          : {};
        throw new Error(
          errorData.message ||
            `Failed to update stock: ${response?.status || "No response"}`,
        );
      }
      const result = await response.json();
      if (result.success) {
        alert("Stock updated successfully!");
        closeUpdateStockModal();
        fetchProducts();
      } else throw new Error(result.message || "Failed to update stock");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingStock(false);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      setLoading(true);
      if (editingProduct) {
        const response = await fetch(
          `${BASE_URL}/api/product/update/${editingProduct.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              inventory: productData.stock || 0,
              stock: productData.stock || 0,
            }),
          },
        );
        const result = await response.json();
        if (!response.ok || !result.success)
          throw new Error(result.message || "Failed to update product");
        alert("Product inventory updated successfully");
        fetchProducts();
      } else {
        alert("Please use the Products page to add new products.");
        setShowModal(false);
        setEditingProduct(null);
        return;
      }
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // ── Summary Stats ──
  const summaryCards = summary
    ? [
        {
          label: "Total Products",
          value: summary.totalProducts || 0,
          color: "text-gray-700",
          bg: "bg-gray-50 border-gray-100",
          dot: "bg-gray-400",
        },
        {
          label: "In Stock",
          value: summary.inStock || 0,
          color: "text-emerald-600",
          bg: "bg-emerald-50 border-emerald-100",
          dot: "bg-emerald-500",
        },
        {
          label: "Low Stock",
          value: summary.lowStock || 0,
          color: "text-amber-600",
          bg: "bg-amber-50 border-amber-100",
          dot: "bg-amber-500",
        },
        {
          label: "Out of Stock",
          value: summary.outOfStock || 0,
          color: "text-red-500",
          bg: "bg-red-50 border-red-100",
          dot: "bg-red-500",
        },
      ]
    : [];

  const StockBadge = ({ stockStatus, label }) => {
    const styles = {
      in_stock:
        "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100",
      low_stock:
        "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100",
      out_of_stock: "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-100",
    };
    const dots = {
      in_stock: "bg-emerald-500",
      low_stock: "bg-amber-500",
      out_of_stock: "bg-red-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[stockStatus] || "bg-gray-50 text-gray-600 border-gray-200"}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${dots[stockStatus] || "bg-gray-400"}`}
        />
        {label || stockStatus}
      </span>
    );
  };

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-36" : j === 6 ? "w-8 ml-auto" : "w-[65%]"}`}
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
        <td colSpan="7" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Package className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {error || "No products found"}
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
    { key: "all", label: "All Products" },
    { key: "instock", label: "In Stock" },
    { key: "lowstock", label: "Low Stock" },
    { key: "outofstock", label: "Out of Stock" },
  ];

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div className="w-full max-w-full mx-auto px-1 mt-3 space-y-3">
        {/* ── Summary Cards ── */}
        {summaryCards.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl border ${card.bg} p-4 flex items-center gap-3`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${card.dot}`}
                />
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    {card.label}
                  </p>
                  <p className={`text-xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* LEFT: Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
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

          {/* RIGHT: Search + Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full sm:w-[300px] shadow-sm bg-white">
              <input
                type="text"
                placeholder="Search product, category, SKU..."
                className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-4 h-full transition-colors">
                Search
              </button>
            </div>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="flex-shrink-0 h-[38px] w-[38px] flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-[#FF7B1D] hover:border-orange-200 hover:bg-orange-50 disabled:opacity-50 transition-all shadow-sm"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Inventory Overview
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                  {[
                    "S.N",
                    "Product Name",
                    "Total Inventory",
                    "Category",
                    "Sub Category",
                    "Stock Status",
                    "Action",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 6 ? "text-right pr-5" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
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
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* S.N */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {product.n !== undefined
                            ? product.n
                            : (currentPage - 1) * itemsPerPage + idx + 1}
                        </span>
                      </td>

                      {/* Product Name */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-gray-700 max-w-[200px] truncate">
                          {product.name}
                        </p>
                        {product.skuHsn && product.skuHsn !== "N/A" && (
                          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                            {product.skuHsn}
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-sm font-bold ${product.stock <= 0 ? "text-red-500" : product.stockPercentage < 20 ? "text-amber-500" : "text-emerald-600"}`}
                        >
                          {product.stock || 0}
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

                      {/* Stock Status */}
                      <td className="px-4 py-3.5">
                        <StockBadge
                          stockStatus={product.stockStatus}
                          label={product.stockStatusLabel}
                        />
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleUpdateStock(product)}
                            className="action-btn bg-orange-50 text-[#FF7B1D] hover:bg-orange-100 hover:text-orange-600"
                            title="Update Stock"
                          >
                            <Plus className="w-3.5 h-3.5" />
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
        {!loading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-1 pb-6">
            <p className="text-xs text-gray-400 font-medium">
              {pagination && (
                <>
                  Page{" "}
                  <span className="text-gray-600 font-semibold">
                    {pagination.currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-600 font-semibold">
                    {pagination.totalPages}
                  </span>
                  <span className="ml-2 text-gray-300">·</span>
                  <span className="ml-2">{pagination.totalProducts} total</span>
                </>
              )}
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
                    else if (pages[pages.length - 1] !== "...")
                      pages.push("...");
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Product Modal ── */}
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

      {/* ── Update Stock Modal ── */}
      {isUpdateStockModalOpen && selectedProductForUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-bold text-base">Update Stock</h3>
              </div>
              <button
                type="button"
                onClick={closeUpdateStockModal}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitStockUpdate}>
              <div className="p-6 space-y-4">
                {/* Product Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {selectedProductForUpdate.name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>
                      SKU:{" "}
                      <span className="font-mono text-gray-600">
                        {selectedProductForUpdate.skuHsn || "N/A"}
                      </span>
                    </span>
                    <span>
                      Current Stock:{" "}
                      <span className="font-bold text-gray-700">
                        {selectedProductForUpdate.stock || 0}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Input */}
                <div>
                  <label
                    htmlFor="updateStockAmount"
                    className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
                  >
                    Amount to Add <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="updateStockAmount"
                    value={updateStockAmount}
                    onChange={(e) => setUpdateStockAmount(e.target.value)}
                    placeholder="Enter quantity to add"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
                    required
                    min="1"
                    step="1"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter the quantity to add to current stock
                  </p>
                </div>

                {/* Preview */}
                {updateStockAmount && parseFloat(updateStockAmount) > 0 && (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      New stock total
                    </span>
                    <span className="text-sm font-bold text-[#FF7B1D]">
                      {(selectedProductForUpdate.stock || 0) +
                        parseFloat(updateStockAmount)}
                    </span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-xl">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 px-6 pb-6">
                <button
                  type="button"
                  onClick={closeUpdateStockModal}
                  disabled={updatingStock}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStock}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white transition-all shadow-sm shadow-orange-200 flex items-center gap-2"
                >
                  {updatingStock ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />{" "}
                      Updating…
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Update Stock
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
