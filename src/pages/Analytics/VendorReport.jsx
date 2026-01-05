import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  Package,
  BarChart3,
  DollarSign, // Note: Keeping the DollarSign icon for layout, though the currency is Rupee
  Calendar,
  Download,
  // Removed unused icons like Filter, TrendingUp, AlertTriangle
} from "lucide-react";

// 1. Import Recharts components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Data for the Monthly Growth Chart (matches the table data)
// Assuming the data is in Thousands (K) to match the original $K notation,
// but now representing Lakhs (Lakh = 100,000) for a more realistic Rupee equivalent
// For simplicity, keeping the 'K' notation in the chart, but displaying '₹'
const monthlyGrowthData = [
  { month: "Jul 25", revenue: 114.2, vendors: 4, products: 156 },
  { month: "Aug 25", revenue: 124.3, vendors: 6, products: 187 },
  { month: "Sep 25", revenue: 137.4, vendors: 8, products: 298 },
  { month: "Oct 25", revenue: 156.8, vendors: 5, products: 234 },
];

// Data for Category Sales Chart (matches the existing list data)
const categorySalesData = [
  {
    category: "Electronics",
    sales: 45200,
    vendors: 38,
    percentage: 29,
    fill: "#FF7B1D",
  },
  {
    category: "Fashion",
    sales: 38900,
    vendors: 45,
    percentage: 25,
    fill: "#FE9C4B",
  },
  {
    category: "Home & Garden",
    sales: 28600,
    vendors: 28,
    percentage: 18,
    fill: "#FFC285",
  },
  {
    category: "Beauty & Health",
    sales: 24800,
    vendors: 31,
    percentage: 16,
    fill: "#FFDDAC",
  },
];

// Custom tooltip for the Line Chart
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-300 rounded shadow-md">
        <p className="font-bold text-black">{label}</p>
        <p className="text-sm text-[#FF7B1D]">
          Revenue:{" "}
          <span className="font-semibold">₹{payload[0].value.toFixed(1)}K</span>
        </p>
        <p className="text-sm text-blue-500">
          New Vendors: <span className="font-semibold">{payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for the Bar Chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-300 rounded shadow-md">
        <p className="font-bold text-black">{label}</p>
        <p className="text-sm text-black">
          Sales:{" "}
          <span className="font-semibold">
            ₹{(payload[0].value / 1000).toFixed(1)}K
          </span>
        </p>
        <p className="text-sm text-gray-500">
          {payload[0].payload.vendors} vendors
        </p>
      </div>
    );
  }
  return null;
};

const VendorReport = () => {
  const [dateRange, setDateRange] = useState("thisMonth");

  // Helper function for currency formatting (using standard Intl.NumberFormat)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0, // No decimal for the main cards/table
    }).format(amount);
  };

  // Re-define vendor data with raw numeric values for consistent Rupee formatting
  const topVendorsData = [
    {
      name: "TechGear Solutions",
      products: 324,
      orders: 1834,
      revenue: 52400, // Changed to number
      rating: 4.8,
      status: "Active",
    },
    {
      name: "Fashion Hub Co.",
      products: 587,
      orders: 2156,
      revenue: 48200, // Changed to number
      rating: 4.7,
      status: "Active",
    },
    {
      name: "Home Essentials Ltd.",
      products: 412,
      orders: 987,
      revenue: 41800, // Changed to number
      rating: 4.6,
      status: "Active",
    },
    {
      name: "Sports World Inc.",
      products: 298,
      orders: 743,
      revenue: 38600, // Changed to number
      rating: 4.5,
      status: "Review",
    },
    {
      name: "Beauty & Glow",
      products: 645,
      orders: 1456,
      revenue: 36900, // Changed to number
      rating: 4.9,
      status: "Active",
    },
    {
      name: "Digital Electronics Pro",
      products: 278,
      orders: 654,
      revenue: 34500, // Changed to number
      rating: 4.4,
      status: "Active",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-0 ml-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Vendor Report
            </h1>
            <p className="text-gray-600">
              This vendor report summarizes key performance insights.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Calendar className="w-5 h-5 text-[#FF7B1D]" />

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-2 border-gray-300 rounded-sm px-4 py-2 focus:border-[#FF7B1D] focus:outline-none"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="thisYear">This Year</option>
            </select>

            <button className="flex items-center gap-2 bg-[#FF7B1D] text-white px-4 py-2 rounded-sm hover:bg-[#E66A0D] transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* --- */}

        {/* Top Statistics Cards - CURRENCY UPDATED */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* ... (Your existing stat cards) ... */}
          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Vendors</p>
                <p className="text-3xl font-bold text-black mt-2">142</p>
                <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
                  5 new this month
                </p>
              </div>
              <Users className="w-12 h-12 text-[#FF7B1D]" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-black mt-2">8,432</p>
                <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
                  ↑ 234 new items
                </p>
              </div>
              <Package className="w-12 h-12 text-[#FF7B1D]" />
            </div>
          </div>

          {/* Total Revenue - CURRENCY UPDATED */}
          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                {/* 156.8K * 1000 = 156800. Using 'Lakh' (INR notation for 100,000) for large numbers */}
                <p className="text-3xl font-bold text-black mt-2">₹1.57 Lakh</p>
                <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
                  +14.2% growth
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-[#FF7B1D]" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Rating</p>
                <p className="text-3xl font-bold text-black mt-2">4.6/5</p>
                <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
                  Based on 12,453 reviews
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-[#FF7B1D]" />
            </div>
          </div>
        </div>

        {/* --- */}

        {/* Top Performing Vendors Table - CURRENCY UPDATED */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            🥇 Top Performing Vendors
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#FF7B1D]">
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Vendor Name
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Products
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Sales
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Rating
                  </th>
                  <th className="text-left py-3 px-4 text-black font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {topVendorsData.map((vendor, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-semibold text-black">
                      {vendor.name}
                    </td>
                    <td className="py-3 px-4 text-black">{vendor.products}</td>
                    <td className="py-3 px-4 text-black">{vendor.orders}</td>
                    {/* Revenue - CURRENCY UPDATED */}
                    <td className="py-3 px-4 font-semibold text-black">
                      {formatCurrency(vendor.revenue)}
                    </td>
                    <td className="py-3 px-4 text-black">{vendor.rating}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          vendor.status === "Active"
                            ? "bg-[#FF7B1D] text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- */}

        {/* Sales & Inventory Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* CATEGORY-WISE SALES: Bar Chart - CURRENCY UPDATED (YAxis/Tooltip) */}
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              📈 Category-wise Sales
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categorySalesData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="category"
                    angle={-15}
                    textAnchor="end"
                    height={40}
                    style={{ fontSize: "12px" }}
                    interval={0}
                  />
                  {/* YAxis - CURRENCY UPDATED */}
                  <YAxis
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  {/* Tooltip - CURRENCY UPDATED */}
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="sales" name="Sales">
                    {categorySalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* INVENTORY STATUS - CURRENCY UPDATED (Wastage) */}
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              📦 Inventory Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-white border-2 border-[#FF7B1D] rounded-sm">
                <div>
                  <p className="font-semibold text-black">Active Products</p>
                  <p className="text-sm text-gray-600">Ready for sale</p>
                </div>
                <span className="text-2xl font-bold text-[#FF7B1D]">7,856</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white border-2 border-yellow-500 rounded-sm">
                <div>
                  <p className="font-semibold text-black">Pending Review</p>
                  <p className="text-sm text-gray-600">Awaiting approval</p>
                </div>
                <span className="text-2xl font-bold text-yellow-600">342</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white border-2 border-red-500 rounded-sm">
                <div>
                  <p className="font-semibold text-black">Out of Stock</p>
                  <p className="text-sm text-gray-600">Need restocking</p>
                </div>
                <span className="text-2xl font-bold text-red-600">234</span>
              </div>
              {/* Wastage This Month - CURRENCY UPDATED */}
              <div className="flex justify-between items-center p-4 bg-red-50 border-2 border-red-400 rounded-sm">
                <div>
                  <p className="font-semibold text-black">Wastage This Month</p>
                  <p className="text-sm text-gray-600">Expired/Damaged items</p>
                </div>
                <span className="text-2xl font-bold text-red-600">₹3,240</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- */}

        {/* Revenue & Payouts - CURRENCY UPDATED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* REVENUE & PAYOUTS OVERVIEW - CURRENCY UPDATED */}
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              💰 Revenue & Payouts Overview
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-white border-l-4 border-[#FF7B1D] rounded">
                <p className="text-sm text-gray-600">Total Revenue (Month)</p>
                {/* $156,800 -> ₹1,56,800 */}
                <p className="text-3xl font-bold text-black">₹1,56,800</p>
                <p className="text-sm text-green-600 mt-1">
                  ↑ 14.2% from last month
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-white border-l-4 border-green-500 rounded">
                <p className="text-sm text-gray-600">Settled Payouts</p>
                {/* $124,340 -> ₹1,24,340 */}
                <p className="text-3xl font-bold text-black">₹1,24,340</p>
                <p className="text-sm text-gray-600 mt-1">
                  79.3% of total revenue
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-white border-l-4 border-yellow-500 rounded">
                <p className="text-sm text-gray-600">Pending Payouts</p>
                {/* $32,460 -> ₹32,460 */}
                <p className="text-3xl font-bold text-black">₹32,460</p>
                <p className="text-sm text-gray-600 mt-1">
                  20.7% pending settlement
                </p>
              </div>
            </div>
          </div>

          {/* VENDOR PERFORMANCE - UNCHANGED */}
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              ⭐ Vendor Performance
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-black">Excellent (4.5-5.0)</span>
                  <span className="font-semibold text-black">68 vendors</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#FF7B1D] h-3 rounded-full"
                    style={{ width: "48%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-black">Good (4.0-4.4)</span>
                  <span className="font-semibold text-black">52 vendors</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#FF7B1D] h-3 rounded-full"
                    style={{ width: "37%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-black">Average (3.5-3.9)</span>
                  <span className="font-semibold text-black">18 vendors</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#FF7B1D] h-3 rounded-full"
                    style={{ width: "13%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-black">Below Average (&lt;3.5)</span>
                  <span className="font-semibold text-black">4 vendors</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: "3%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- */}

        {/* Monthly Vendor Growth: Line Chart - CURRENCY UPDATED (YAxis/Tooltip) */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            📈 Monthly Vendor Growth & Revenue
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyGrowthData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                {/* YAxis (Revenue) - CURRENCY UPDATED */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#FF7B1D"
                  tickFormatter={(value) => `₹${value}K`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#3B82F6"
                  domain={[0, "auto"]}
                />
                {/* Tooltip - CURRENCY UPDATED */}
                <Tooltip content={<CustomLineTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF7B1D"
                  activeDot={{ r: 8 }}
                  name="Revenue (K)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="vendors"
                  stroke="#3B82F6"
                  name="New Vendors"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- */}

        {/* Recent Vendor Activity - UNCHANGED */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            🔔 Recent Vendor Activity
          </h2>
          <div className="space-y-3">
            {[
              {
                vendor: "TechGear Solutions",
                activity: "Added 12 new products",
                time: "2 hours ago",
              },
              {
                vendor: "Fashion Hub Co.",
                activity: "Updated pricing on 45 items",
                time: "5 hours ago",
              },
              {
                vendor: "Beauty & Glow",
                activity: "Launched new product line",
                time: "1 day ago",
              },
              {
                vendor: "New Vendor Registration",
                activity: "Organic Foods Plus joined",
                time: "2 days ago",
              },
              {
                vendor: "Home Essentials Ltd.",
                activity: "Restocked 67 out-of-stock items",
                time: "2 days ago",
              },
              {
                vendor: "Sports World Inc.",
                activity: "Under review for quality concerns",
                time: "3 days ago",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border-2 border-[#FF7B1D] rounded hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-black">{item.vendor}</p>
                <p className="text-sm text-gray-600">{item.activity}</p>
                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorReport;
