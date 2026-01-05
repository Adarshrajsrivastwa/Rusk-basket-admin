import React from "react";
import { TrendingUp, ShoppingCart, Package, IndianRupee } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const AnalyticsDashboard = () => {
  // Data for sales trend chart (in Rupees)
  const salesData = [
    { date: "Mon", revenue: 1548500, orders: 342 },
    { date: "Tue", revenue: 1758000, orders: 398 },
    { date: "Wed", revenue: 1658800, orders: 365 },
    { date: "Thu", revenue: 1960800, orders: 432 },
    { date: "Fri", revenue: 2395287, orders: 521 },
    { date: "Sat", revenue: 2688100, orders: 587 },
    { date: "Sun", revenue: 2169900, orders: 476 },
  ];

  // Data for top selling categories (in Rupees)
  const categoryData = [
    { category: "Fresh Produce", sales: 3839040, percentage: 28 },
    { category: "Dairy & Eggs", sales: 3217680, percentage: 23 },
    { category: "Meat & Seafood", sales: 2692560, percentage: 19 },
    { category: "Bakery", sales: 2066880, percentage: 15 },
    { category: "Beverages", sales: 1369300, percentage: 10 },
    { category: "Snacks", sales: 750380, percentage: 5 },
  ];

  // Data for inventory status
  const inventoryData = [
    { status: "In Stock", value: 68, color: "#22C55E" },
    { status: "Low Stock", value: 22, color: "#FF7B1D" },
    { status: "Out of Stock", value: 10, color: "#EF4444" },
  ];

  // Data for delivery performance
  const deliveryData = [
    { time: "8 AM", deliveries: 45 },
    { time: "10 AM", deliveries: 78 },
    { time: "12 PM", deliveries: 125 },
    { time: "2 PM", deliveries: 142 },
    { time: "4 PM", deliveries: 156 },
    { time: "6 PM", deliveries: 134 },
    { time: "8 PM", deliveries: 98 },
    { time: "10 PM", deliveries: 52 },
  ];

  // Data for customer segments
  const customerSegmentData = [
    { segment: "Regular", value: 45, color: "#FF7B1D" },
    { segment: "Premium", value: 32, color: "#FFA500" },
    { segment: "Occasional", value: 23, color: "#FFB84D" },
  ];

  // Data for payment methods
  const paymentData = [
    { method: "UPI", value: 42, color: "#FF7B1D" },
    { method: "Credit Card", value: 28, color: "#FFA500" },
    { method: "Debit Card", value: 18, color: "#FFB84D" },
    { method: "Cash on Delivery", value: 12, color: "#FFC976" },
  ];

  // Data for order fulfillment funnel
  const orderFunnelData = [
    { stage: "Orders Placed", value: 3547 },
    { stage: "Processing", value: 3421 },
    { stage: "Out for Delivery", value: 3289 },
    { stage: "Delivered", value: 3156 },
    { stage: "Completed", value: 3098 },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white ml-6">
        {/* Top Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">
                Total Revenue
              </p>
              <IndianRupee className="w-6 h-6 text-[#FF7B1D]" />
            </div>
            <p className="text-3xl font-bold text-black mt-2">₹1,24,97,287</p>
            <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
              ↑ 18.5% from last week
            </p>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">
                Total Orders
              </p>
              <ShoppingCart className="w-6 h-6 text-[#FF7B1D]" />
            </div>
            <p className="text-3xl font-bold text-black mt-2">3,121</p>
            <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
              ↑ 12.3% from last week
            </p>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">
                Avg Order Value
              </p>
              <TrendingUp className="w-6 h-6 text-[#FF7B1D]" />
            </div>
            <p className="text-3xl font-bold text-black mt-2">₹4,004</p>
            <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
              ↑ ₹268 from last week
            </p>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">
                Active Products
              </p>
              <Package className="w-6 h-6 text-[#FF7B1D]" />
            </div>
            <p className="text-3xl font-bold text-black mt-2">1,847</p>
            <p className="text-green-600 text-sm mt-2 font-semibold">
              68% in stock
            </p>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">
            Revenue & Orders Trend (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7B1D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF7B1D" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #FF7B1D",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => {
                  if (name === "Revenue (₹)") {
                    return [`₹${value.toLocaleString("en-IN")}`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#FF7B1D"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue (₹)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#22C55E"
                fillOpacity={1}
                fill="url(#colorOrders)"
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance and Inventory Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Top Selling Categories
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="category"
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #FF7B1D",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                />
                <Bar dataKey="sales" fill="#FF7B1D" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Inventory Status
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, value }) => `${status}: ${value}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">
            Delivery Performance by Hour
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deliveryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #FF7B1D",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="deliveries" fill="#22C55E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Fulfillment Funnel */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">
            Order Fulfillment Funnel
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderFunnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis
                dataKey="stage"
                type="category"
                stroke="#6b7280"
                width={150}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #FF7B1D",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#FF7B1D" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Table */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            Top Performing Products
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#FF7B1D]">
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Product Name
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Units Sold
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Stock Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-black">
                    Organic Bananas (1 kg)
                  </td>
                  <td className="py-3 px-4 text-black">Fresh Produce</td>
                  <td className="py-3 px-4 text-black">1,847</td>
                  <td className="py-3 px-4 text-[#FF7B1D] font-semibold">
                    ₹2,16,704
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      In Stock
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-black">
                    Whole Milk (1 Litre)
                  </td>
                  <td className="py-3 px-4 text-black">Dairy & Eggs</td>
                  <td className="py-3 px-4 text-black">1,542</td>
                  <td className="py-3 px-4 text-[#FF7B1D] font-semibold">
                    ₹5,16,672
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      In Stock
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-black">
                    Fresh Chicken Breast (1 kg)
                  </td>
                  <td className="py-3 px-4 text-black">Meat & Seafood</td>
                  <td className="py-3 px-4 text-black">1,234</td>
                  <td className="py-3 px-4 text-[#FF7B1D] font-semibold">
                    ₹12,40,366
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                      Low Stock
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-black">
                    Whole Wheat Bread
                  </td>
                  <td className="py-3 px-4 text-black">Bakery</td>
                  <td className="py-3 px-4 text-black">1,125</td>
                  <td className="py-3 px-4 text-[#FF7B1D] font-semibold">
                    ₹3,76,875
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      In Stock
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-black">
                    Fresh Orange Juice (1 Litre)
                  </td>
                  <td className="py-3 px-4 text-black">Beverages</td>
                  <td className="py-3 px-4 text-black">987</td>
                  <td className="py-3 px-4 text-[#FF7B1D] font-semibold">
                    ₹4,96,194
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                      Out of Stock
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Insights and Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Customer Segments
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, value }) => `${segment}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerSegmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Payment Methods Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ method, value }) => `${method}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-3">
              Today's Performance
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Orders:</span>
                <span className="font-bold text-black">421</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue:</span>
                <span className="font-bold text-[#FF7B1D]">₹16,87,145</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Delivery Time:</span>
                <span className="font-bold text-black">32 min</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-500 rounded-sm shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-3">
              Inventory Alerts
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock Items:</span>
                <span className="font-bold text-orange-600">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Out of Stock:</span>
                <span className="font-bold text-red-600">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiring Soon:</span>
                <span className="font-bold text-orange-600">27</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-500 rounded-sm shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-3">
              Customer Satisfaction
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Rating:</span>
                <span className="font-bold text-black">4.7/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Repeat Rate:</span>
                <span className="font-bold text-green-600">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Rate:</span>
                <span className="font-bold text-black">2.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
