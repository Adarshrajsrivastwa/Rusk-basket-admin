import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Fruits",
    stock: 0,
    lowStockThreshold: 10,
    price: 0,
    vendor: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (product) {
      // Convert "N/A" or invalid dates to empty string for date input
      const formatDateForInput = (dateValue) => {
        if (!dateValue || dateValue === "N/A" || dateValue === "n/a") {
          return "";
        }
        // If it's already in yyyy-MM-dd format, return as is
        if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          return dateValue;
        }
        // Try to parse and format the date
        try {
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split("T")[0];
          }
        } catch (e) {
          // If parsing fails, return empty string
        }
        return "";
      };

      setFormData({
        name: product.name,
        category: product.category,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        price: product.price,
        vendor: product.vendor,
        expiryDate: formatDateForInput(product.expiryDate),
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm max-w-2xl w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#FF7B1D]">
          <h2 className="text-2xl font-bold text-black">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black bg-white"
              >
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
                <option value="Frozen">Frozen</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => handleChange("vendor", e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
                placeholder="Enter vendor name"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  handleChange("price", parseFloat(e.target.value) || 0)
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  handleChange("stock", parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Low Stock Alert <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) =>
                  handleChange(
                    "lowStockThreshold",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
                placeholder="10"
                min="0"
              />
            </div>

            {/* Expiry Date */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-black mb-2">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-black py-3 px-6 rounded font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-[#FF7B1D] text-white py-3 px-6 rounded font-semibold hover:bg-orange-600 transition-colors"
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
