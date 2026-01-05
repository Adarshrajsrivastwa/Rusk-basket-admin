import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const PaymentBreakdown = ({ vendorData }) => {
  // Payment type distribution
  const paymentDistribution = [
    {
      name: "COD",
      value: vendorData.reduce((sum, v) => sum + v.codRevenue, 0),
      orders: vendorData.reduce((sum, v) => sum + v.codOrders, 0),
    },
    {
      name: "Prepaid",
      value: vendorData.reduce((sum, v) => sum + v.prepaidRevenue, 0),
      orders: vendorData.reduce((sum, v) => sum + v.prepaidOrders, 0),
    },
  ];

  // Vendor-wise payment breakdown
  const vendorPaymentData = vendorData.map((vendor) => ({
    name: vendor.name.split(" ")[0], // Short name
    cod: vendor.codRevenue,
    prepaid: vendor.prepaidRevenue,
  }));

  const COLORS = ["#8B5CF6", "#EC4899"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Payment Distribution Pie Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Payment Type Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, orders }) =>
                `${name}: ₹${(value / 1000).toFixed(1)}K (${orders} orders)`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentDistribution.map((entry, index) => (
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

        {/* Payment Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-sm p-4">
            <p className="text-sm text-gray-600">COD Orders</p>
            <p className="text-2xl font-bold text-purple-600">
              {paymentDistribution[0].orders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ₹{paymentDistribution[0].value.toLocaleString()}
            </p>
          </div>
          <div className="bg-pink-50 border-2 border-pink-200 rounded-sm p-4">
            <p className="text-sm text-gray-600">Prepaid Orders</p>
            <p className="text-2xl font-bold text-pink-600">
              {paymentDistribution[1].orders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ₹{paymentDistribution[1].value.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Vendor-wise Payment Comparison */}
      <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vendor-wise Payment Revenue
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendorPaymentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "2px solid #FF7B1D",
              }}
              formatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="cod" fill="#8B5CF6" name="COD Revenue" />
            <Bar dataKey="prepaid" fill="#EC4899" name="Prepaid Revenue" />
          </BarChart>
        </ResponsiveContainer>

        {/* Payment Preference Insights */}
        <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-sm">
          <p className="text-sm font-semibold text-blue-900">💡 Insight</p>
          <p className="text-xs text-blue-700 mt-1">
            {paymentDistribution[0].value > paymentDistribution[1].value
              ? `COD is the preferred payment method with ${(
                  (paymentDistribution[0].value /
                    (paymentDistribution[0].value +
                      paymentDistribution[1].value)) *
                  100
                ).toFixed(1)}% of total revenue.`
              : `Prepaid is the preferred payment method with ${(
                  (paymentDistribution[1].value /
                    (paymentDistribution[0].value +
                      paymentDistribution[1].value)) *
                  100
                ).toFixed(1)}% of total revenue.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentBreakdown;
