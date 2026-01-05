import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Package, TrendingUp, AlertCircle } from "lucide-react";

const CategoryWiseAnalysis = ({ categoryData, subCategoryData }) => {
  const COLORS = [
    "#FF7B1D",
    "#FFA04D",
    "#FFB870",
    "#FFD099",
    "#FFE8C2",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
  ];

  // Sort categories by revenue
  const sortedCategories = [...categoryData].sort(
    (a, b) => b.revenue - a.revenue
  );

  return (
    <div className="space-y-6 mb-6">
      {/* Category Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Category-wise Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                stroke="#666"
                angle={-15}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #FF7B1D",
                }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#FF7B1D" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sortedCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {sortedCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #FF7B1D",
                }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Cards */}
      <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-6 h-6 text-[#FF7B1D]" />
          Category Performance Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((category, index) => (
            <div
              key={category.id}
              className="border-2 border-gray-200 rounded-sm p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.productCount} products
                  </p>
                </div>
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-sm ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : "bg-[#FF7B1D]"
                  }`}
                >
                  {index + 1}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-bold text-green-600">
                    ₹{category.revenue.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm text-gray-600">Orders</span>
                  <span className="font-bold text-blue-600">
                    {category.orders.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span className="text-sm text-gray-600">Growth</span>
                  <span className="font-bold text-purple-600">
                    +{category.growth}%
                  </span>
                </div>
              </div>

              {/* Payment Split */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>COD: ₹{category.codRevenue.toLocaleString()}</span>
                  <span>
                    Prepaid: ₹{category.prepaidRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Category Analysis */}
      <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#FF7B1D]" />
          Sub-Category Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#FF7B1D]">
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  Rank
                </th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  Sub-Category
                </th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  Revenue
                </th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  Orders
                </th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  Products
                </th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  COD
                </th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  Prepaid
                </th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody>
              {[...subCategoryData]
                .sort((a, b) => b.revenue - a.revenue)
                .map((subCat, index) => (
                  <tr
                    key={subCat.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-sm ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-orange-600"
                            : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">
                      {subCat.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {subCat.categoryName}
                    </td>
                    <td className="py-3 px-4 text-green-600 font-bold">
                      ₹{subCat.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {subCat.orders.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {subCat.productCount}
                    </td>
                    <td className="py-3 px-4 text-purple-600">
                      ₹{subCat.codRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-pink-600">
                      ₹{subCat.prepaidRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      +{subCat.growth}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseAnalysis;
