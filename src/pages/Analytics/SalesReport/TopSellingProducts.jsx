import React from "react";
import { TrendingUp, Award, Star } from "lucide-react";

const TopSellingProducts = ({ products, paymentType = "all" }) => {
  // Filter products based on payment type
  const filteredProducts = products.map((product) => {
    if (paymentType === "cod") {
      return {
        ...product,
        revenue: product.codRevenue,
        units: product.codUnits,
      };
    } else if (paymentType === "prepaid") {
      return {
        ...product,
        revenue: product.prepaidRevenue,
        units: product.prepaidUnits,
      };
    }
    return {
      ...product,
      revenue: product.totalRevenue,
      units: product.totalUnits,
    };
  });

  // Sort by revenue and get top 10
  const topProducts = filteredProducts
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-[#FF7B1D]" />
          <h2 className="text-xl font-semibold text-gray-900">
            Top 10 Selling Products
          </h2>
        </div>
        {paymentType !== "all" && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
            {paymentType === "cod" ? "COD Only" : "Prepaid Only"}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div
            key={product.id}
            className={`flex items-center justify-between p-4 rounded-sm border-2 transition-all hover:shadow-md ${
              index === 0
                ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300"
                : index === 1
                ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300"
                : index === 2
                ? "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {/* Rank and Product Info */}
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white text-lg ${
                  index === 0
                    ? "bg-yellow-500"
                    : index === 1
                    ? "bg-gray-400"
                    : index === 2
                    ? "bg-orange-600"
                    : "bg-[#FF7B1D]"
                }`}
              >
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>
                  {index < 3 && (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600">
                    {product.category} → {product.subCategory}
                  </span>
                  <span className="text-sm text-gray-500">|</span>
                  <span className="text-sm text-blue-600 font-semibold">
                    {product.vendor}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Stats */}
            <div className="flex items-center gap-6">
              {/* Units Sold */}
              <div className="text-center">
                <p className="text-sm text-gray-600">Units Sold</p>
                <p className="text-xl font-bold text-gray-900">
                  {product.units.toLocaleString()}
                </p>
              </div>

              {/* Revenue */}
              <div className="text-center">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{product.revenue.toLocaleString()}
                </p>
              </div>

              {/* Rating */}
              <div className="text-center">
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <p className="text-lg font-bold text-yellow-600">
                    {product.rating}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-gray-200">
        <div className="text-center p-4 bg-blue-50 rounded-sm">
          <p className="text-sm text-gray-600">Top 10 Revenue</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹
            {topProducts
              .reduce((sum, p) => sum + p.revenue, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-sm">
          <p className="text-sm text-gray-600">Total Units</p>
          <p className="text-2xl font-bold text-green-600">
            {topProducts.reduce((sum, p) => sum + p.units, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-sm">
          <p className="text-sm text-gray-600">Avg Rating</p>
          <p className="text-2xl font-bold text-yellow-600">
            {(
              topProducts.reduce((sum, p) => sum + p.rating, 0) /
              topProducts.length
            ).toFixed(1)}{" "}
            ⭐
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;
