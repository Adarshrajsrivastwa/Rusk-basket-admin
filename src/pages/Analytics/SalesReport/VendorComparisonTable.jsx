import React, { useState } from "react";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";

const VendorComparisonTable = ({ vendorData }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "totalRevenue",
    direction: "desc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const sortedVendors = [...vendorData].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === "desc" ? (
      <TrendingDown className="w-4 h-4 text-[#FF7B1D]" />
    ) : (
      <TrendingUp className="w-4 h-4 text-[#FF7B1D]" />
    );
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Vendor Performance Comparison
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#FF7B1D]">
              <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                Rank
              </th>
              <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                Vendor Name
              </th>
              <th
                className="text-left py-3 px-4 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("totalRevenue")}
              >
                <div className="flex items-center gap-2">
                  Total Revenue
                  <SortIcon columnKey="totalRevenue" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("totalOrders")}
              >
                <div className="flex items-center gap-2">
                  Orders
                  <SortIcon columnKey="totalOrders" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("codRevenue")}
              >
                <div className="flex items-center gap-2">
                  COD Revenue
                  <SortIcon columnKey="codRevenue" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("prepaidRevenue")}
              >
                <div className="flex items-center gap-2">
                  Prepaid Revenue
                  <SortIcon columnKey="prepaidRevenue" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("avgOrderValue")}
              >
                <div className="flex items-center gap-2">
                  Avg Order
                  <SortIcon columnKey="avgOrderValue" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                Products
              </th>
              <th
                className="text-left py-3 px-4 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("avgRating")}
              >
                <div className="flex items-center gap-2">
                  Rating
                  <SortIcon columnKey="avgRating" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("growth")}
              >
                <div className="flex items-center gap-2">
                  Growth
                  <SortIcon columnKey="growth" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedVendors.map((vendor, index) => {
              const codPercentage = (
                (vendor.codRevenue / vendor.totalRevenue) *
                100
              ).toFixed(0);
              const prepaidPercentage = (
                (vendor.prepaidRevenue / vendor.totalRevenue) *
                100
              ).toFixed(0);

              return (
                <tr
                  key={vendor.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
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
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-gray-900 font-semibold">
                        {vendor.name}
                      </p>
                      <p className="text-xs text-gray-500">{vendor.location}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-green-600 font-bold">
                    ₹{vendor.totalRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-semibold">
                    {vendor.totalOrders.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-purple-600 font-semibold">
                        ₹{vendor.codRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {codPercentage}% of total
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-pink-600 font-semibold">
                        ₹{vendor.prepaidRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {prepaidPercentage}% of total
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    ₹{vendor.avgOrderValue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {vendor.productsSold}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-semibold">
                      ⭐ {vendor.avgRating}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        vendor.growth > 15
                          ? "text-green-600"
                          : vendor.growth > 10
                          ? "text-blue-600"
                          : "text-orange-600"
                      }`}
                    >
                      {vendor.growth > 0 ? "↑" : "↓"} {Math.abs(vendor.growth)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-sm border-2 border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Vendors</p>
            <p className="text-xl font-bold text-gray-900">
              {vendorData.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Combined Revenue</p>
            <p className="text-xl font-bold text-green-600">
              ₹
              {vendorData
                .reduce((sum, v) => sum + v.totalRevenue, 0)
                .toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-xl font-bold text-blue-600">
              {vendorData
                .reduce((sum, v) => sum + v.totalOrders, 0)
                .toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg Growth</p>
            <p className="text-xl font-bold text-purple-600">
              {(
                vendorData.reduce((sum, v) => sum + v.growth, 0) /
                vendorData.length
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorComparisonTable;
