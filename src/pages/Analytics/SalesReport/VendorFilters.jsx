import React from "react";
import { Filter, Download } from "lucide-react";

const VendorFilters = ({
  selectedVendor,
  setSelectedVendor,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedProduct,
  setSelectedProduct,
  paymentType,
  setPaymentType,
  vendors,
  categories,
  subCategories,
  products,
  filteredData, // Pass filtered data from parent
}) => {
  // Excel Download Function
  const handleDownloadExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to download!");
      return;
    }

    // Create CSV content
    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(","), // Header row
      ...filteredData.map((row) =>
        headers
          .map((header) => {
            const cell = row[header];
            // Handle commas and quotes in cell data
            const cellStr = String(cell || "");
            return cellStr.includes(",") || cellStr.includes('"')
              ? `"${cellStr.replace(/"/g, '""')}"`
              : cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `vendor_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-sm shadow-sm p-6 mb-6">
      {/* Header with Download Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#FF7B1D]" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        {/* Download Excel Button - Top Right */}
        <button
          onClick={handleDownloadExcel}
          className="bg-[#FF7B1D] text-white px-4 py-2 rounded-sm hover:bg-[#E66A0C] transition-colors font-semibold text-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vendor Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vendor
          </label>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-sm px-4 py-2 text-gray-700 text-sm outline-none focus:border-[#FF7B1D] transition-colors bg-white"
          >
            <option value="all">All Vendors</option>
            {vendors.map((vendor, idx) => (
              <option key={idx} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory("all");
              setSelectedProduct("all");
            }}
            className="w-full border-2 border-gray-200 rounded-sm px-4 py-2 text-gray-700 text-sm outline-none focus:border-[#FF7B1D] transition-colors bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sub-Category
          </label>
          <select
            value={selectedSubCategory}
            onChange={(e) => {
              setSelectedSubCategory(e.target.value);
              setSelectedProduct("all");
            }}
            disabled={selectedCategory === "all"}
            className="w-full border-2 border-gray-200 rounded-sm px-4 py-2 text-gray-700 text-sm outline-none focus:border-[#FF7B1D] transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All Sub-Categories</option>
            {subCategories
              .filter(
                (sub) =>
                  selectedCategory === "all" ||
                  sub.categoryId === selectedCategory
              )
              .map((subCat, idx) => (
                <option key={idx} value={subCat.id}>
                  {subCat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Product Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            disabled={selectedSubCategory === "all"}
            className="w-full border-2 border-gray-200 rounded-sm px-4 py-2 text-gray-700 text-sm outline-none focus:border-[#FF7B1D] transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All Products</option>
            {products
              .filter(
                (prod) =>
                  selectedSubCategory === "all" ||
                  prod.subCategoryId === selectedSubCategory
              )
              .map((product, idx) => (
                <option key={idx} value={product.id}>
                  {product.name}
                </option>
              ))}
          </select>
        </div>

        {/* Payment Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Type
          </label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-sm px-4 py-2 text-gray-700 text-sm outline-none focus:border-[#FF7B1D] transition-colors bg-white"
          >
            <option value="all">All Payment Types</option>
            <option value="cod">COD (Cash on Delivery)</option>
            <option value="prepaid">Prepaid (Online Payment)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedVendor("all");
              setSelectedCategory("all");
              setSelectedSubCategory("all");
              setSelectedProduct("all");
              setPaymentType("all");
            }}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-sm hover:bg-gray-300 transition-colors font-semibold text-sm"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorFilters;
