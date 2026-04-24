import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import {
  ArrowLeft,
  Search,
  Package,
  Plus,
  X,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";

const AddExtraItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState({});
  const [addingItems, setAddingItems] = useState(false);

  useEffect(() => {
    fetchVendorProducts();
  }, []);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication required. Please login again.");
        navigate("/login");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/vendor/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setProducts(
          result.data.map((p) => ({
            _id: p._id,
            productId: p._id,
            name: p.productName || "Unnamed Product",
            sku: p.skuHsn || "N/A",
            category: p.category?.name || "General",
            price: p.salePrice || p.regularPrice || 0,
            thumbnail: p.thumbnail?.url || p.images?.[0]?.url || null,
            inventory: p.inventory || 0,
          })),
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      alert(`Failed to load products: ${error.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (searchBy === "sku") return product.sku.toLowerCase().includes(q);
    if (searchBy === "category")
      return product.category.toLowerCase().includes(q);
    if (searchBy === "name") return product.name.toLowerCase().includes(q);
    return (
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q)
    );
  });

  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) => {
      const next = { ...prev };
      if (next[productId]) delete next[productId];
      else next[productId] = 1;
      return next;
    });
  };

  const handleQty = (productId, val, e) => {
    e?.stopPropagation();
    const qty = parseInt(val) || 1;
    if (qty < 1) return;
    setSelectedProducts((prev) => ({ ...prev, [productId]: qty }));
  };

  const inc = (id, e) => {
    e.stopPropagation();
    setSelectedProducts((p) => ({ ...p, [id]: (p[id] || 1) + 1 }));
  };
  const dec = (id, e) => {
    e.stopPropagation();
    setSelectedProducts((p) => {
      const cur = p[id] || 1;
      if (cur <= 1) return p;
      return { ...p, [id]: cur - 1 };
    });
  };

  const handleAddItems = async () => {
    const selectedItems = Object.keys(selectedProducts);
    if (!selectedItems.length) {
      alert("Please select at least one product!");
      return;
    }
    try {
      setAddingItems(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication required.");
        return;
      }

      const orderResponse = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!orderResponse.ok) throw new Error("Failed to fetch order details");
      const orderResult = await orderResponse.json();
      const mongoOrderId = orderResult.data?._id || id;

      const items = selectedItems.map((productId) => ({
        productId,
        quantity: selectedProducts[productId],
      }));

      const response = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${mongoOrderId}/items`,
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
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Failed to add items");

      alert(`${selectedItems.length} product(s) added successfully!`);
      navigate(`/orders/${id}/bag-qr-scan`);
    } catch (error) {
      alert(`Failed to add items: ${error.message}`);
    } finally {
      setAddingItems(false);
    }
  };

  const selectedCount = Object.keys(selectedProducts).length;

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
  ];

  // Skeleton loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${
                  j === 0
                    ? "w-8"
                    : j === 1
                      ? "w-10"
                      : j === 6
                        ? "w-20 ml-auto"
                        : "w-[70%]"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div className="w-full px-1 mt-3">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/orders/${id}/bag-qr-scan`)}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-orange-50 hover:border-orange-200 hover:text-[#FF7B1D] text-gray-600 flex items-center justify-center transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Add Extra Items
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Order <span className="font-mono text-gray-500">{id}</span>
              </p>
            </div>
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                <span className="font-bold text-[#FF7B1D]">
                  {selectedCount}
                </span>{" "}
                product{selectedCount !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={() => setSelectedProducts({})}
                className="h-8 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Clear
              </button>
              <button
                onClick={handleAddItems}
                disabled={addingItems}
                className={`h-8 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  addingItems
                    ? "bg-gray-300 cursor-not-allowed text-white"
                    : "bg-[#FF7B1D] hover:bg-orange-500 text-white shadow-sm shadow-orange-200"
                }`}
              >
                {addingItems ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Add to Order
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Info Banner ── */}
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 border border-violet-100">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-3.5 h-3.5 text-violet-600" />
          </div>
          <p className="text-xs text-violet-700 font-medium">
            Add complimentary items, free gifts, or additional products not in
            the original order. Select products, set quantities, then click{" "}
            <strong>Add to Order</strong>.
          </p>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSearchBy(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  searchBy === tab.key
                    ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
            <input
              type="text"
              placeholder={`Search by ${searchBy === "all" ? "name, SKU or category" : searchBy}...`}
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors flex items-center justify-center">
              <Search className="w-4 h-4" />
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
                Product Catalogue
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                {filteredProducts.length} of {products.length} products
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                  {[
                    "S.N",
                    "Product",
                    "SKU",
                    "Category",
                    "Price",
                    "Stock",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90 ${
                        i === 6 ? "text-right pr-5" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {loading ? (
                <TableSkeleton />
              ) : filteredProducts.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                          <Package className="w-8 h-8 text-orange-300" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">
                          No products found
                        </p>
                        <p className="text-gray-300 text-xs">
                          {searchQuery
                            ? "Try adjusting your search"
                            : "No products available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {filteredProducts.map((product, idx) => {
                    const isSelected = !!selectedProducts[product.productId];
                    const qty = selectedProducts[product.productId] || 1;

                    return (
                      <tr
                        key={product.productId}
                        onClick={() => handleProductSelect(product.productId)}
                        className={`row-animate border-b border-gray-50 transition-colors duration-150 group cursor-pointer ${
                          isSelected
                            ? "bg-orange-50/60"
                            : "hover:bg-orange-50/40"
                        }`}
                        style={{ animationDelay: `${idx * 20}ms` }}
                      >
                        {/* S.N */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors ${
                              isSelected
                                ? "bg-[#FF7B1D] text-white"
                                : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-[#FF7B1D]"
                            }`}
                          >
                            {isSelected ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                              idx + 1
                            )}
                          </span>
                        </td>

                        {/* Product */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0 overflow-hidden">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-4 h-4 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <span
                              className={`font-medium text-sm ${
                                isSelected ? "text-[#FF7B1D]" : "text-gray-800"
                              }`}
                            >
                              {product.name}
                            </span>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                            {product.sku}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5">
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-bold text-gray-800">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                              product.inventory > 10
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : product.inventory > 0
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {product.inventory}
                          </span>
                        </td>

                        {/* Actions / Qty */}
                        <td className="px-4 py-3.5 pr-5">
                          <div className="flex items-center justify-end gap-2">
                            {isSelected ? (
                              // Quantity stepper when selected
                              <div
                                className="flex items-center gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => dec(product.productId, e)}
                                  disabled={qty <= 1}
                                  className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={qty}
                                  onChange={(e) =>
                                    handleQty(
                                      product.productId,
                                      e.target.value,
                                      e,
                                    )
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-12 h-7 border border-orange-300 rounded-lg text-center text-xs font-bold focus:border-[#FF7B1D] focus:outline-none bg-white"
                                />
                                <button
                                  onClick={(e) => inc(product.productId, e)}
                                  className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm transition-all"
                                >
                                  +
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductSelect(product.productId);
                                  }}
                                  className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                                  title="Remove"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              // Add button when not selected
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductSelect(product.productId);
                                }}
                                className="action-btn bg-orange-50 text-[#FF7B1D] hover:bg-orange-100"
                                title="Add product"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
        </div>

        {/* ── Sticky Footer Bar ── */}
        {selectedCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Selected pills */}
              <div className="flex items-center gap-3 overflow-x-auto flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap flex-shrink-0">
                  <span className="text-[#FF7B1D] font-bold">
                    {selectedCount}
                  </span>{" "}
                  selected:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                  {Object.keys(selectedProducts).map((productId) => {
                    const p = products.find((x) => x.productId === productId);
                    return p ? (
                      <span
                        key={productId}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-medium text-orange-700 whitespace-nowrap flex-shrink-0"
                      >
                        {p.name.split(" ").slice(0, 2).join(" ")} ×
                        {selectedProducts[productId]}
                        <button
                          onClick={() => handleProductSelect(productId)}
                          className="text-orange-400 hover:text-red-500 transition-colors ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedProducts({})}
                  className="h-9 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Clear All
                </button>
                <button
                  onClick={handleAddItems}
                  disabled={addingItems}
                  className={`h-9 px-5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    addingItems
                      ? "bg-gray-300 cursor-not-allowed text-white"
                      : "bg-[#FF7B1D] hover:bg-orange-500 text-white shadow-sm shadow-orange-200"
                  }`}
                >
                  {addingItems ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Add {selectedCount} Item{selectedCount !== 1 ? "s" : ""}{" "}
                      to Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom padding when footer bar is visible */}
        {selectedCount > 0 && <div className="h-20" />}
      </div>
    </DashboardLayout>
  );
};

export default AddExtraItemPage;
