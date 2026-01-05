import React from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  CreditCard,
  Wallet,
} from "lucide-react";

const VendorSummaryCards = ({ filteredData }) => {
  const totalRevenue = filteredData.reduce((sum, v) => sum + v.totalRevenue, 0);
  const totalOrders = filteredData.reduce((sum, v) => sum + v.totalOrders, 0);
  const codRevenue = filteredData.reduce((sum, v) => sum + v.codRevenue, 0);
  const prepaidRevenue = filteredData.reduce(
    (sum, v) => sum + v.prepaidRevenue,
    0
  );
  const avgRating =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, v) => sum + v.avgRating, 0) /
          filteredData.length
        ).toFixed(1)
      : 0;
  const totalVendors = filteredData.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Vendors */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-semibold">
              Total Vendors
            </p>
            <p className="text-4xl font-bold mt-2">{totalVendors}</p>
          </div>
          <Package className="w-12 h-12 text-orange-200" />
        </div>
      </div>

      {/* Combined Revenue */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-sm p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-semibold">
              Combined Revenue
            </p>
            <p className="text-4xl font-bold mt-2">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-12 h-12 text-green-200" />
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-semibold">Total Orders</p>
            <p className="text-4xl font-bold mt-2">
              {totalOrders.toLocaleString()}
            </p>
          </div>
          <ShoppingCart className="w-12 h-12 text-blue-200" />
        </div>
      </div>

      {/* COD Revenue */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-sm p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-semibold">COD Revenue</p>
            <p className="text-4xl font-bold mt-2">
              ₹{codRevenue.toLocaleString()}
            </p>
            <p className="text-purple-100 text-xs mt-1">
              {totalRevenue > 0
                ? ((codRevenue / totalRevenue) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </div>
          <Wallet className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      {/* Prepaid Revenue */}
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-sm p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-pink-100 text-sm font-semibold">
              Prepaid Revenue
            </p>
            <p className="text-4xl font-bold mt-2">
              ₹{prepaidRevenue.toLocaleString()}
            </p>
            <p className="text-pink-100 text-xs mt-1">
              {totalRevenue > 0
                ? ((prepaidRevenue / totalRevenue) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </div>
          <CreditCard className="w-12 h-12 text-pink-200" />
        </div>
      </div>

      {/* Average Rating */}
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-sm p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-sm font-semibold">Avg Rating</p>
            <p className="text-4xl font-bold mt-2">{avgRating} ⭐</p>
          </div>
          <TrendingUp className="w-12 h-12 text-yellow-200" />
        </div>
      </div>
    </div>
  );
};

export default VendorSummaryCards;
