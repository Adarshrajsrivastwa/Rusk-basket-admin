import React, { useState, useEffect } from "react";
import {
  Package,
  QrCode,
  History,
  Truck,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Download,
  Printer,
  Search,
  AlertCircle,
  Clock,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BASE_URL } from "../../api/api";

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, color, small = false }) => {
  const colorMap = {
    orange: {
      border: "border-[#FF7B1D]",
      text: "text-[#FF7B1D]",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
    },
    green: {
      border: "border-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
    },
    blue: {
      border: "border-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    purple: {
      border: "border-violet-500",
      text: "text-violet-600",
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
    },
    red: {
      border: "border-red-500",
      text: "text-red-600",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
    },
  };
  const c = colorMap[color] || colorMap.orange;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${c.border} shadow-sm hover:shadow-md transition-all duration-200 p-5`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p
            className={`${small ? "text-2xl" : "text-3xl"} font-bold ${c.text}`}
          >
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// ─── Tab Button ───────────────────────────────────────────────────────────────
export const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
      active
        ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {icon && <span className="w-4 h-4">{icon}</span>}
    {label}
  </button>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────
export const InfoRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    <span
      className={`text-sm font-semibold ${
        highlight ? "text-[#FF7B1D]" : "text-gray-800"
      }`}
    >
      {value}
    </span>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, type = "order" }) => {
  const statusMap = {
    complete: {
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-500",
      label: "Complete",
    },
    sealed: {
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-500",
      label: "Sealed",
    },
    partial: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      dot: "bg-amber-500",
      label: "Partial",
    },
    pending: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      dot: "bg-amber-500",
      label: "Pending",
    },
    assigned: {
      cls: "bg-blue-50 text-blue-700 border border-blue-200",
      dot: "bg-blue-500",
      label: "Assigned",
    },
    picked_up: {
      cls: "bg-violet-50 text-violet-700 border border-violet-200",
      dot: "bg-violet-500",
      label: "Out for Delivery",
    },
    extra: {
      cls: "bg-violet-50 text-violet-700 border border-violet-200",
      dot: "bg-violet-500",
      label: "Extra",
    },
  };
  const s = statusMap[status?.toLowerCase()] || statusMap.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ─── Add Extra Item Modal ─────────────────────────────────────────────────────
export const AddExtraItemModal = ({ isOpen, onClose, onAddItem, orderId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});
  const [searchBy, setSearchBy] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) fetchVendorProducts();
    else {
      setSelectedProducts({});
      setSearchQuery("");
    }
  }, [isOpen]);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication required.");
        return;
      }
      const res = await fetch(`${BASE_URL}/api/vendor/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const approved = result.data
          .filter((p) => p.approvalStatus?.toLowerCase() === "approved")
          .map((p) => ({
            _id: p._id,
            productId: p._id,
            id: p._id,
            name: p.productName || "Unnamed",
            sku: p.skuHsn || "N/A",
            category: p.category?.name || "General",
            price: p.salePrice || p.regularPrice || 0,
            thumbnail: p.thumbnail?.url || p.images?.[0]?.url || null,
            inventory: p.inventory || 0,
          }));
        setProducts(approved);
      }
    } catch (err) {
      alert(`Failed to load products: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (searchBy === "sku") return p.sku.toLowerCase().includes(q);
    if (searchBy === "category") return p.category.toLowerCase().includes(q);
    if (searchBy === "name") return p.name.toLowerCase().includes(q);
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleQty = (productId, qty) => {
    const n = parseInt(qty) || 0;
    if (n < 0) return;
    setSelectedProducts((prev) => ({ ...prev, [productId]: n }));
  };
  const inc = (id) =>
    setSelectedProducts((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const dec = (id) =>
    setSelectedProducts((p) => {
      const cur = p[id] || 0;
      if (cur <= 0) return p;
      return { ...p, [id]: cur - 1 };
    });

  const selectedCount = Object.keys(selectedProducts).filter(
    (id) => selectedProducts[id] > 0,
  ).length;

  const handleSubmit = async () => {
    const toAdd = Object.keys(selectedProducts).filter(
      (id) => selectedProducts[id] > 0,
    );
    if (!toAdd.length) {
      alert("Please add at least one product.");
      return;
    }
    try {
      setSubmitting(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication required.");
        return;
      }
      const orderRes = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${orderId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!orderRes.ok) throw new Error("Failed to fetch order");
      const orderResult = await orderRes.json();
      const mongoId = orderResult.data?._id || orderId;
      const items = toAdd
        .map((id) => ({
          productId: id,
          quantity: Number(selectedProducts[id]),
        }))
        .filter((i) => i.quantity > 0);
      const res = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${mongoId}/items`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items }),
        },
      );
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.message || "Failed");
      alert(`${toAdd.length} product(s) added successfully!`);
      toAdd.forEach((id) => {
        const p = products.find((x) => x.productId === id);
        if (p) onAddItem(p, selectedProducts[id]);
      });
      setSelectedProducts({});
      setSearchQuery("");
      onClose();
    } catch (err) {
      alert(`Failed to add items: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 border-t-4 border-t-violet-500 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Plus className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Add Extra Item to Bag
              </h3>
              <p className="text-xs text-gray-400">
                Add complimentary or additional products
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 space-y-3">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {filterTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setSearchBy(t.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${searchBy === t.key ? "bg-white text-violet-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] shadow-sm bg-white">
            <Search className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${searchBy === "all" ? "name, SKU or category" : searchBy}...`}
              className="flex-1 px-3 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" />
              <p className="text-xs text-gray-400">Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">
                No products found
              </p>
              <p className="text-xs text-gray-300">
                {searchQuery
                  ? "Try adjusting your search"
                  : "No products available"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((product) => {
                const qty = selectedProducts[product.productId] || 0;
                const selected = qty > 0;
                return (
                  <div
                    key={product.productId}
                    className={`rounded-xl border transition-all duration-150 ${selected ? "border-violet-300 bg-violet-50/50 shadow-sm" : "border-gray-100 hover:border-violet-200 bg-white"}`}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0 overflow-hidden">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-800 truncate pr-2">
                            {product.name}
                          </h4>
                          {selected && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 border border-violet-200 flex-shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                              Qty: {qty}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
                          <span>
                            SKU:{" "}
                            <span className="font-medium text-gray-600">
                              {product.sku}
                            </span>
                          </span>
                          <span>
                            Category:{" "}
                            <span className="font-medium text-gray-600">
                              {product.category}
                            </span>
                          </span>
                          <span>
                            Price:{" "}
                            <span className="font-semibold text-gray-800">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                          </span>
                          <span>
                            Stock:{" "}
                            <span className="font-medium text-gray-600">
                              {product.inventory}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-400">
                            Qty:
                          </span>
                          <button
                            onClick={() => dec(product.productId)}
                            disabled={qty <= 0}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={qty}
                            onChange={(e) =>
                              handleQty(product.productId, e.target.value)
                            }
                            className="w-14 h-7 border border-gray-200 rounded-lg text-center text-sm font-semibold focus:border-violet-400 focus:outline-none bg-white"
                          />
                          <button
                            onClick={() => inc(product.productId)}
                            className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected summary */}
        {selectedCount > 0 && (
          <div className="px-6 py-3 border-t border-violet-100 bg-violet-50/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-violet-700">
                {selectedCount} product{selectedCount !== 1 ? "s" : ""} selected
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(selectedProducts)
                  .filter((id) => selectedProducts[id] > 0)
                  .map((id) => {
                    const p = products.find((x) => x.productId === id);
                    return p ? (
                      <span
                        key={id}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-violet-200 text-xs font-medium text-violet-700"
                      >
                        {p.name.split(" ").slice(0, 2).join(" ")} ×
                        {selectedProducts[id]}
                        <button
                          onClick={() => handleQty(id, 0)}
                          className="text-violet-400 hover:text-red-500 transition-colors ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedCount === 0 || submitting}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${selectedCount === 0 || submitting ? "bg-gray-300 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-200"}`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Items ({selectedCount})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Packing Tab ──────────────────────────────────────────────────────────────
export const PackingTab = ({
  products,
  bagDetails,
  setIsScanModalOpen,
  handleManualUpdate,
  handleRemoveExtraItem,
  setIsAddExtraItemModalOpen,
}) => {
  const totalScanned = products.reduce((s, p) => s + p.scanned, 0);
  const totalQty = products.reduce((s, p) => s + p.quantity, 0);
  const pct = totalQty > 0 ? Math.round((totalScanned / totalQty) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-800">
            Scan Items to Pack
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {totalScanned} of {totalQty} items scanned
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddExtraItemModalOpen(true)}
            disabled={bagDetails.sealed}
            className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${bagDetails.sealed ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200"}`}
          >
            <Plus className="w-3.5 h-3.5" /> Add Extra Item
          </button>
          <button
            onClick={() => setIsScanModalOpen(true)}
            disabled={bagDetails.sealed}
            className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${bagDetails.sealed ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#FF7B1D] hover:bg-orange-500 text-white shadow-sm shadow-orange-200"}`}
          >
            <QrCode className="w-3.5 h-3.5" /> Scan QR Code
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">
            Packing Progress
          </span>
          <span className="text-xs font-bold text-[#FF7B1D]">{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Product rows */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
          <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
          <span className="text-sm font-semibold text-gray-700">
            Order Items ({products.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  "#",
                  "Product",
                  "SKU",
                  "Price",
                  "Progress",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 6 ? "text-right pr-5" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => {
                const complete = product.scanned === product.quantity;
                const partial = product.scanned > 0 && !complete;
                const status = product.isExtra
                  ? "extra"
                  : complete
                    ? "complete"
                    : partial
                      ? "partial"
                      : "pending";

                return (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-[#FF7B1D] transition-colors">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-gray-800 text-sm">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-gray-800">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          complete
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : partial
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-gray-50 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {product.scanned}/{product.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        {!bagDetails.sealed && (
                          <>
                            <button
                              onClick={() =>
                                handleManualUpdate(product.id, "decrement")
                              }
                              disabled={product.scanned === 0}
                              className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              −
                            </button>
                            <button
                              onClick={() =>
                                handleManualUpdate(product.id, "increment")
                              }
                              disabled={
                                product.scanned >= product.quantity &&
                                !product.isExtra
                              }
                              className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              +
                            </button>
                          </>
                        )}
                        {product.isExtra && !bagDetails.sealed && (
                          <button
                            onClick={() => handleRemoveExtraItem(product.id)}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all"
                            title="Remove extra item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── History Tab ──────────────────────────────────────────────────────────────
export const HistoryTab = ({ scanHistory }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-bold text-gray-800">Scan History</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {scanHistory.length} total scans
        </p>
      </div>
    </div>

    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
        <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
        <span className="text-sm font-semibold text-gray-700">Scan Log</span>
      </div>

      {scanHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
            <History className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400 font-medium">No scans yet</p>
          <p className="text-xs text-gray-300">
            Start scanning items to see history
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {["#", "Product", "SKU", "Type", "Time", "Operator"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {scanHistory.map((scan, idx) => {
                const typeStyles = {
                  scanned:
                    "bg-emerald-50 text-emerald-700 border border-emerald-200",
                  extra_added:
                    "bg-violet-50 text-violet-700 border border-violet-200",
                  manual: "bg-blue-50 text-blue-700 border border-blue-200",
                };
                const typeLabels = {
                  scanned: "Scanned",
                  extra_added: "Extra Added",
                  manual: "Manual",
                };
                return (
                  <tr
                    key={scan.id}
                    className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 20}ms` }}
                  >
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-[#FF7B1D] transition-colors">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-800 text-sm">
                      {scan.productName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {scan.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${typeStyles[scan.status] || typeStyles.scanned}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {typeLabels[scan.status] || scan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {scan.time}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {scan.operator}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

// ─── Bag Details Tab ──────────────────────────────────────────────────────────
export const BagDetailsTab = ({ bagDetails, id, orderValue, totalItems }) => (
  <div className="space-y-5">
    <div>
      <h2 className="text-sm font-bold text-gray-800">Bag Information</h2>
      <p className="text-xs text-gray-400 mt-0.5">Bag details and QR code</p>
    </div>

    {!bagDetails.sealed ? (
      <div className="rounded-2xl border border-dashed border-orange-300 bg-orange-50/50 p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7 text-[#FF7B1D]" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 mb-1">
          Bag Not Sealed Yet
        </h3>
        <p className="text-xs text-gray-400">
          Complete scanning all items to seal the bag
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Details card */}
        <div className="bg-white rounded-2xl border border-gray-100 border-t-4 border-t-[#FF7B1D] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-bold text-gray-800">Bag Details</span>
          </div>
          <div className="space-y-0.5">
            <InfoRow label="Bag Number" value={bagDetails.bagNo} highlight />
            <InfoRow label="Order ID" value={id || "OD8038403974"} />
            <InfoRow label="Total Items" value={totalItems} />
            <InfoRow
              label="Order Value"
              value={`₹${orderValue.toLocaleString("en-IN")}`}
            />
            <InfoRow label="Weight" value={bagDetails.weight} />
            <InfoRow label="Dimensions" value={bagDetails.dimensions} />
            <InfoRow label="Status" value={bagDetails.status} highlight />
            <InfoRow label="Start Time" value={bagDetails.startTime} />
            <InfoRow label="Complete Time" value={bagDetails.completeTime} />
            <InfoRow label="Sealed" value="Yes ✅" highlight />
          </div>
        </div>

        {/* QR card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center gap-4">
          <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 flex items-center justify-center">
            <QrCode className="w-24 h-24 text-[#FF7B1D] opacity-80" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">
              {bagDetails.bagQRCode}
            </p>
            <p className="text-xs text-gray-400 mt-1">Scan to track bag</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => alert(`Downloading QR: ${bagDetails.bagQRCode}`)}
              className="h-9 px-4 rounded-xl bg-[#FF7B1D] hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-orange-200"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button
              onClick={() => window.print()}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-blue-200"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

// ─── Delivery Tab ─────────────────────────────────────────────────────────────
export const DeliveryTab = ({
  assignmentStatus,
  selectedPartner,
  bagDetails,
  handleAssignPartner,
  handleMarkPickedUp,
  id,
  totalItems,
  orderValue,
}) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 className="text-sm font-bold text-gray-800">
          Delivery Partner Assignment
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Assign and track delivery
        </p>
      </div>
      {assignmentStatus === "pending" && (
        <button
          onClick={handleAssignPartner}
          disabled={!bagDetails.sealed}
          className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${!bagDetails.sealed ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#FF7B1D] hover:bg-orange-500 text-white shadow-sm shadow-orange-200"}`}
        >
          <Truck className="w-3.5 h-3.5" /> Assign Partner
        </button>
      )}
    </div>

    {assignmentStatus === "pending" && !selectedPartner && (
      <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Truck className="w-7 h-7 text-blue-600" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 mb-1">
          No Partner Assigned
        </h3>
        <p className="text-xs text-gray-400">
          {bagDetails.sealed
            ? "Click 'Assign Partner' to assign delivery"
            : "Seal the bag first to assign a partner"}
        </p>
      </div>
    )}

    {(assignmentStatus === "assigned" || assignmentStatus === "picked_up") &&
      selectedPartner && (
        <div className="space-y-4">
          {/* Partner card */}
          <div className="bg-white rounded-2xl border border-gray-100 border-t-4 border-t-emerald-500 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-gray-800">
                {assignmentStatus === "picked_up"
                  ? "Out for Delivery"
                  : "Partner Assigned"}
              </span>
              <StatusBadge status={assignmentStatus} />
            </div>

            <div className="flex items-start gap-4">
              <img
                src={selectedPartner.avatar}
                alt={selectedPartner.name}
                className="w-16 h-16 rounded-xl border-2 border-emerald-200 object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800 mb-2">
                  {selectedPartner.name}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      icon: <Phone className="w-3.5 h-3.5 text-emerald-500" />,
                      text: selectedPartner.phone,
                    },
                    {
                      icon: <Truck className="w-3.5 h-3.5 text-emerald-500" />,
                      text: `${selectedPartner.vehicle} · ${selectedPartner.vehicleNo}`,
                    },
                    {
                      icon: <MapPin className="w-3.5 h-3.5 text-emerald-500" />,
                      text: selectedPartner.currentLocation,
                    },
                    {
                      icon: <User className="w-3.5 h-3.5 text-emerald-500" />,
                      text: `★ ${selectedPartner.rating} (${selectedPartner.deliveries} deliveries)`,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-gray-600"
                    >
                      {item.icon}{" "}
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
                {assignmentStatus === "assigned" && (
                  <button
                    onClick={handleMarkPickedUp}
                    className="mt-3 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-200"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Mark as Picked Up
                  </button>
                )}
                {assignmentStatus === "picked_up" && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-medium text-blue-700">
                    <Truck className="w-3.5 h-3.5" /> Out for delivery —
                    expected today
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assignment summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-bold text-gray-800">
                Assignment Details
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
              <InfoRow label="Bag Number" value={bagDetails.bagNo} />
              <InfoRow label="Order ID" value={id || "OD8038403974"} />
              <InfoRow label="Total Items" value={totalItems} />
              <InfoRow
                label="Order Value"
                value={`₹${orderValue.toLocaleString("en-IN")}`}
              />
              <InfoRow
                label="Assigned At"
                value={new Date().toLocaleString()}
              />
              <InfoRow
                label="Status"
                value={
                  assignmentStatus === "picked_up"
                    ? "Out for Delivery"
                    : "Assigned"
                }
                highlight
              />
            </div>
          </div>
        </div>
      )}
  </div>
);

// ─── Scan Modal ───────────────────────────────────────────────────────────────
export const ScanModal = ({
  isOpen,
  onClose,
  scanInput,
  setScanInput,
  onSubmit,
  products,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 border-t-4 border-t-[#FF7B1D]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-[#FF7B1D]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Scan Item QR Code
              </h3>
              <p className="text-xs text-gray-400">
                Scan or enter product QR / SKU
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 p-8 text-center">
            <QrCode className="w-12 h-12 text-[#FF7B1D] mx-auto mb-2 opacity-80" />
            <p className="text-xs text-gray-500 font-medium">
              Point scanner at QR code
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              QR Code / SKU
            </label>
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSubmit()}
              placeholder="Scan or type QR code / SKU"
              autoFocus
              className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:border-[#FF7B1D] focus:outline-none text-sm font-medium"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Press Enter or click Submit after scanning
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 max-h-40 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Items in Order
            </p>
            <div className="space-y-1.5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between ${p.scanned === p.quantity ? "opacity-40" : ""}`}
                >
                  <span
                    className={`text-xs font-medium ${p.scanned === p.quantity ? "line-through text-gray-400" : "text-gray-700"}`}
                  >
                    {p.name.substring(0, 30)}
                    {p.name.length > 30 ? "…" : ""}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.scanned === p.quantity ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}
                  >
                    {p.scanned}/{p.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!scanInput.trim()}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${!scanInput.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-[#FF7B1D] hover:bg-orange-500 shadow-sm shadow-orange-200"}`}
          >
            <CheckCircle className="w-4 h-4" /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delivery Partner Modal ───────────────────────────────────────────────────
export const DeliveryPartnerModal = ({
  isOpen,
  onClose,
  searchPartner,
  setSearchPartner,
  availablePartners,
  selectedPartner,
  setSelectedPartner,
  onConfirm,
  bagDetails,
  orderId,
  totalItems,
  orderValue,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 border-t-4 border-t-blue-500 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Assign Delivery Partner
              </h3>
              <p className="text-xs text-gray-400">
                Select an available partner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] shadow-sm bg-white">
            <Search className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchPartner}
              onChange={(e) => setSearchPartner(e.target.value)}
              placeholder="Search by partner name..."
              className="flex-1 px-3 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Partner list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {availablePartners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">
                No available partners
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availablePartners.map((partner) => {
                const sel = selectedPartner?.id === partner.id;
                return (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className={`rounded-xl border transition-all duration-150 cursor-pointer ${sel ? "border-blue-300 bg-blue-50/50 shadow-sm" : "border-gray-100 hover:border-blue-200 bg-white"}`}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className={`w-14 h-14 rounded-xl object-cover border-2 transition-all ${sel ? "border-blue-400" : "border-gray-100"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-800">
                            {partner.name}
                          </h4>
                          {sel && (
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                          {[
                            {
                              icon: <Phone className="w-3 h-3 text-blue-500" />,
                              text: partner.phone,
                            },
                            {
                              icon: <Truck className="w-3 h-3 text-blue-500" />,
                              text: `${partner.vehicle} · ${partner.vehicleNo}`,
                            },
                            {
                              icon: (
                                <MapPin className="w-3 h-3 text-blue-500" />
                              ),
                              text: partner.currentLocation,
                            },
                            {
                              icon: <User className="w-3 h-3 text-blue-500" />,
                              text: `★ ${partner.rating} (${partner.deliveries} deliveries)`,
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 text-xs text-gray-500"
                            >
                              {item.icon}{" "}
                              <span className="font-medium truncate">
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Assignment summary */}
        {selectedPartner && (
          <div className="px-6 py-3 border-t border-orange-100 bg-orange-50/50 flex-shrink-0">
            <p className="text-xs font-semibold text-[#FF7B1D] mb-2">
              Assignment Preview
            </p>
            <div className="grid grid-cols-4 gap-4 text-xs">
              {[
                { label: "Bag", value: bagDetails.bagNo },
                { label: "Order", value: orderId },
                { label: "Items", value: totalItems },
                {
                  label: "Value",
                  value: `₹${orderValue.toLocaleString("en-IN")}`,
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-gray-400">{item.label}</p>
                  <p className="font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedPartner}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${!selectedPartner ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200"}`}
          >
            <CheckCircle className="w-4 h-4" /> Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};
