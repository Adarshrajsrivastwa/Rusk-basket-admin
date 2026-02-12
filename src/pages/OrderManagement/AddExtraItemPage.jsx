import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import { ArrowLeft, Search, Package, Plus, X } from "lucide-react";

const AddExtraItemPage = () => {
  const { id } = useParams(); // Order ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState({}); // { productId: quantity }
  const [addingItems, setAddingItems] = useState(false);

  // Fetch vendor products
  useEffect(() => {
    fetchVendorProducts();
  }, []);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        alert("⚠️ Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${BASE_URL}/api/vendor/products`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        const transformedProducts = result.data.map((product) => ({
          _id: product._id,
          productId: product._id,
          name: product.productName || "Unnamed Product",
          sku: product.skuHsn || "N/A",
          category: product.category?.name || "General",
          price: product.salePrice || product.regularPrice || 0,
          thumbnail: product.thumbnail?.url || product.images?.[0]?.url || null,
          inventory: product.inventory || 0,
        }));

        setProducts(transformedProducts);
      } else {
        console.error("Invalid API response format:", result);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      alert(`Failed to load products: ${error.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;

    switch (searchBy) {
      case "sku":
        return product.sku.toLowerCase().includes(query);
      case "category":
        return product.category.toLowerCase().includes(query);
      case "name":
        return product.name.toLowerCase().includes(query);
      default:
        return (
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
    }
  });

  // Handle product selection
  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) => {
      const newSelected = { ...prev };
      if (newSelected[productId]) {
        delete newSelected[productId];
      } else {
        newSelected[productId] = 1; // Default quantity 1
      }
      return newSelected;
    });
  };

  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    const qty = parseInt(quantity) || 1;
    if (qty < 1) return;

    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

  // Handle add items to order
  const handleAddItems = async () => {
    const selectedItems = Object.keys(selectedProducts);
    if (selectedItems.length === 0) {
      alert("⚠️ Please select at least one product!");
      return;
    }

    try {
      setAddingItems(true);

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        alert("⚠️ Authentication required. Please login again.");
        return;
      }

      // Get orderId - need to fetch order data first or get from context
      // For now, using the id from params (orderNumber)
      // We need MongoDB _id, so we might need to fetch order details first
      const orderId = id;

      if (!orderId) {
        alert("⚠️ Order ID not found. Please go back and try again.");
        return;
      }

      // First, fetch order to get MongoDB _id
      const orderResponse = await fetch(
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

      if (!orderResponse.ok) {
        throw new Error("Failed to fetch order details");
      }

      const orderResult = await orderResponse.json();
      const mongoOrderId = orderResult.data?._id || orderId;

      const items = selectedItems.map((productId) => ({
        productId: productId,
        quantity: selectedProducts[productId],
      }));

      const requestBody = {
        items: items,
      };

      const apiUrl = `${BASE_URL}/api/checkout/vendor/order/${mongoOrderId}/items`;

      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to add items: ${response.status}`);
      }

      alert(
        `✅ Items Added Successfully!\n\n${selectedItems.length} product(s) added to the order.`,
      );

      // Navigate back to bag QR scan page
      navigate(`/orders/${orderId}/bag-qr-scan`);
    } catch (error) {
      console.error("Error adding items:", error);
      alert(`❌ Failed to add items: ${error.message}\n\nPlease try again.`);
    } finally {
      setAddingItems(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/orders/${id}/bag-qr-scan`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Add Extra Items to Order
            </h1>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              <strong>Add complimentary items, free gifts, or additional products</strong> that
              weren't in the original order. Select products and specify quantities, then click
              "Add to Order".
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "All" },
                { key: "name", label: "Product Name" },
                { key: "sku", label: "SKU" },
                { key: "category", label: "Category" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSearchBy(filter.key)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    searchBy === filter.key
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">No products found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "No products available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredProducts.map((product) => {
              const isSelected = !!selectedProducts[product.productId];
              const quantity = selectedProducts[product.productId] || 1;

              return (
                <div
                  key={product.productId}
                  className={`bg-white rounded-lg shadow-sm border-2 p-4 transition-all cursor-pointer ${
                    isSelected
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => handleProductSelect(product.productId)}
                >
                  <div className="flex items-start gap-3">
                    {/* Product Image/Icon */}
                    <div className="flex-shrink-0">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">
                        {product.name}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>SKU:</strong> {product.sku}
                        </p>
                        <p>
                          <strong>Price:</strong> ₹{product.price}
                        </p>
                        <p>
                          <strong>Category:</strong> {product.category}
                        </p>
                        <p>
                          <strong>Stock:</strong> {product.inventory}
                        </p>
                      </div>

                      {/* Quantity Input (only if selected) */}
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Quantity:
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(
                                  product.productId,
                                  quantity - 1,
                                );
                              }}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(
                                  product.productId,
                                  e.target.value,
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm font-semibold"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(
                                  product.productId,
                                  quantity + 1,
                                );
                              }}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        {Object.keys(selectedProducts).length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <strong className="text-purple-600">
                  {Object.keys(selectedProducts).length}
                </strong>{" "}
                product(s) selected
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProducts({})}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleAddItems}
                  disabled={addingItems}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all flex items-center gap-2 ${
                    addingItems
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
                >
                  {addingItems ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddExtraItemPage;
