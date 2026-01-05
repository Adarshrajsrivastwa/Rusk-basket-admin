import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const SingleProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const vendors = ["Vendor 1", "Vendor 2", "Vendor 3"];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const product = {
    id,
    name: "Rosewhal natural looms naans without oil",
    description:
      "Rosewhal natural looms naans without oil Rosewhal natural looms naans without oil...",
    inventory: "In Stock",
    actualPrice: "250",
    mrp: "300",
    sellPrice: "300",
    category: "Kitchen Item",
    subCategory: "Kitchen Item",
    sku: "HSN5468",
    tags: ["Kitchen Item", "Rosewhal", "Kitchen Item"],
    mainImage:
      "https://via.placeholder.com/600x600.png?text=Main+Product+Image",
    images: Array(8).fill("https://via.placeholder.com/100x100.png?text=Image"),
  };

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

  if (loading)
    return (
      <DashboardLayout>
        <SkeletonLoader />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-[96%] mx-auto mt-2 mb-10">
        {/* ---------- Top Header Buttons ---------- */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Left Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {["All", "In Review", "Approved", "Rejected"].map((label, i) => (
              <button
                key={i}
                className={`px-4 py-[6px] text-[13px] bg-white hover:bg-orange-100 rounded border ${
                  label === "All" ? "border-orange-500" : "border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}

            {/* Select Vendor Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-[6px] text-[13px] bg-white hover:bg-orange-100 rounded border border-gray-300 flex items-center gap-1"
              >
                Select Vendor <span className="text-sm">▾</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
                  {vendors.map((vendor, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-[13px]"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {vendor}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search and Add New Product */}
          <div className="ml-auto flex flex-wrap gap-2 items-center">
            <div className="flex flex-1 min-w-[200px] md:min-w-[300px] lg:min-w-[400px] items-center border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Product Search by Product Name, Vendor Name, Category etc."
                className="px-3 py-[6px] text-[13px] w-full focus:outline-none"
              />
              <button className="bg-[#ff7f27] text-white px-4 py-[6px] text-[13px] hover:bg-[#e96e17]">
                Search
              </button>
            </div>

            <button className="bg-black text-white px-4 py-[6px] text-[13px] rounded hover:bg-gray-800">
              + Add New Product
            </button>
          </div>
        </div>

        {/* ---------- Product Detail Section ---------- */}
        <div className="bg-white border border-gray-300 p-4 text-[13px] rounded shadow-sm">
          {/* Product Title */}
          <p className="font-semibold">
            Product Title: <span className="font-normal">{product.name}</span>
          </p>

          {/* Product Description */}
          <p className="mt-1 leading-relaxed">
            <span className="font-semibold">Product Description: </span>
            {product.description}
          </p>

          {/* Product Info Grid */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-1 max-w-3xl text-[13px]">
            <p>
              <span className="font-semibold">Inventory:</span>{" "}
              {product.inventory}
            </p>
            <p>
              <span className="font-semibold">Actual Price:</span> ₹
              {product.actualPrice}
            </p>
            <p>
              <span className="font-semibold">MRP:</span> ₹{product.mrp}
            </p>
            <p>
              <span className="font-semibold">Sell Price:</span> ₹
              {product.sellPrice}
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
            <p>
              <span className="font-semibold">Sub Category:</span>{" "}
              {product.subCategory}
            </p>
            <p>
              <span className="font-semibold">SKU/HSN:</span> {product.sku}
            </p>
          </div>

          {/* Tags */}
          <p className="mt-3 leading-relaxed">
            <span className="font-semibold">Tags:</span>{" "}
            {product.tags.join(", ")}
          </p>

          {/* ---------- Image Section ---------- */}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            {/* Left: Large Image */}
            <div className="lg:w-3/4 w-full border border-red-300 bg-[#ffe3e3] h-[300px] sm:h-[400px] lg:h-[670px] rounded overflow-hidden flex justify-center items-center">
              <img
                src={product.mainImage}
                alt={product.name}
                className="object-contain h-full w-full"
              />
            </div>

            {/* Right: Image Grid */}
            <div className="lg:w-1/4 w-full flex flex-col">
              <div className="border border-orange-300 rounded bg-white h-[150px] sm:h-[180px] lg:h-[220px] mb-3 flex justify-center items-center overflow-hidden">
                <img
                  src="https://via.placeholder.com/180x180.png?text=Preview"
                  alt="preview"
                  className="object-cover h-full w-full"
                />
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="border border-orange-300 rounded bg-white h-[75px] sm:h-[100px] flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SingleProduct;
