import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  Package,
  BarChart3,
  DollarSign,
  Calendar,
  Download,
  Loader2,
} from "lucide-react";

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

// API Base URL - Update this to your actual API URL
const API_BASE_URL = "http://46.202.164.93/api/analytics/admin";

// Custom tooltip for the Line Chart
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-300 rounded shadow-md">
        <p className="font-bold text-black">{label}</p>
        <p className="text-sm text-[#FF7B1D]">
          Revenue:{" "}
          <span className="font-semibold">₹{payload[0].value.toFixed(2)}</span>
        </p>
        <p className="text-sm text-blue-500">
          Orders:{" "}
          <span className="font-semibold">{payload[1]?.value || 0}</span>
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
          <span className="font-semibold">₹{payload[0].value.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-500">
          {payload[0].payload.orders || 0} orders
        </p>
      </div>
    );
  }
  return null;
};

const VendorReport = () => {
  const [dateRange, setDateRange] = useState("thisMonth");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  // Fetch all analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Get token from localStorage
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const fetchOptions = {
          method: "GET",
          credentials: "include",
          headers: headers,
        };

        // Fetch dashboard data
        const dashboardRes = await fetch(
          `${API_BASE_URL}/dashboard`,
          fetchOptions
        );
        const dashboardJson = await dashboardRes.json();

        // Fetch sales data
        const salesRes = await fetch(`${API_BASE_URL}/sales`, fetchOptions);
        const salesJson = await salesRes.json();

        // Fetch vendors data
        const vendorsRes = await fetch(`${API_BASE_URL}/vendors`, fetchOptions);
        const vendorsJson = await vendorsRes.json();

        // Fetch products data
        const productsRes = await fetch(
          `${API_BASE_URL}/products`,
          fetchOptions
        );
        const productsJson = await productsRes.json();

        if (dashboardJson.success) setDashboardData(dashboardJson.data);
        if (salesJson.success) setSalesData(salesJson.data.sales);
        if (vendorsJson.success) setVendorsData(vendorsJson.data.vendors);
        if (productsJson.success) setProductsData(productsJson.data.products);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        alert(
          "Failed to fetch analytics data. Please check your authentication."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange]);

  // Helper function for currency formatting (using standard Intl.NumberFormat)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Prepare chart data from API
  const monthlyGrowthData = salesData.map((sale) => ({
    month: formatDate(sale.period),
    revenue: sale.revenue,
    orders: sale.orders,
  }));

  // Get top vendors sorted by revenue
  const topVendorsData = vendorsData
    .sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue)
    .slice(0, 6)
    .map((vendor) => ({
      vendorId: vendor.vendorId,
      name: `Vendor ${vendor.vendorId.slice(-6)}`,
      revenue: vendor.metrics.totalRevenue,
      orders: vendor.metrics.totalOrders,
      products: vendor.metrics.totalItems,
      rating: 4.5, // Default rating since not in API
      status: "Active", // Default status
    }));

  // Prepare products chart data
  const productsChartData = productsData.slice(0, 4).map((product, idx) => {
    const colors = ["#FF7B1D", "#FE9C4B", "#FFC285", "#FFDDAC"];
    return {
      category: product.productName,
      sales: product.metrics.totalRevenue,
      orders: product.metrics.orderCount,
      fill: colors[idx % colors.length],
    };
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#FF7B1D] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading vendor report...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-0 ml-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              All Analytics
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

        {/* Top Statistics Cards - API INTEGRATED */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Vendors</p>
                <p className="text-3xl font-bold text-black mt-2">
                  {dashboardData?.vendors?.active || 0}
                </p>
                <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
                  {dashboardData?.vendors?.new || 0} new this month
                </p>
              </div>
              <Users className="w-12 h-12 text-[#FF7B1D]" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-black mt-2">
                  {dashboardData?.products?.total || 0}
                </p>
                <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
                  ↑ {dashboardData?.products?.active || 0} active items
                </p>
              </div>
              <Package className="w-12 h-12 text-[#FF7B1D]" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-black mt-2">
                  {formatCurrency(dashboardData?.revenue?.total || 0)}
                </p>
                <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
                  {dashboardData?.revenue?.totalOrders || 0} orders
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-[#FF7B1D]" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Order Value</p>
                <p className="text-3xl font-bold text-black mt-2">
                  {formatCurrency(
                    dashboardData?.revenue?.averageOrderValue || 0
                  )}
                </p>
                <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
                  Per transaction
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-[#FF7B1D]" />
            </div>
          </div>
        </div>

        {/* Top Performing Vendors Table - API INTEGRATED */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            🥇 Top Performing Vendors
          </h2>
          <div className="overflow-x-auto">
            {topVendorsData.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#FF7B1D]">
                    <th className="text-left py-3 px-4 text-black font-semibold">
                      Vendor ID
                    </th>
                    <th className="text-left py-3 px-4 text-black font-semibold">
                      Products
                    </th>
                    <th className="text-left py-3 px-4 text-black font-semibold">
                      Orders
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
                      <td className="py-3 px-4 text-black">
                        {vendor.products}
                      </td>
                      <td className="py-3 px-4 text-black">{vendor.orders}</td>
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
            ) : (
              <p className="text-center text-gray-500 py-8">
                No vendor data available
              </p>
            )}
          </div>
        </div>

        {/* Sales & Inventory Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* CATEGORY-WISE SALES: Bar Chart - API INTEGRATED */}
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              📈 Top Products Sales
            </h2>
            <div className="h-80">
              {productsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productsChartData}
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
                    <YAxis
                      tickFormatter={(value) =>
                        `₹${(value / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="sales" name="Sales">
                      {productsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No product data available</p>
                </div>
              )}
            </div>
          </div>

          {/* INVENTORY STATUS - API INTEGRATED */}
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
                <span className="text-2xl font-bold text-[#FF7B1D]">
                  {dashboardData?.products?.active || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white border-2 border-yellow-500 rounded-sm">
                <div>
                  <p className="font-semibold text-black">Pending Review</p>
                  <p className="text-sm text-gray-600">Awaiting approval</p>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {dashboardData?.products?.pending || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white border-2 border-green-500 rounded-sm">
                <div>
                  <p className="font-semibold text-black">Approved Products</p>
                  <p className="text-sm text-gray-600">Verified items</p>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {dashboardData?.products?.approved || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 border-2 border-red-400 rounded-sm">
                <div>
                  <p className="font-semibold text-black">Total Discount</p>
                  <p className="text-sm text-gray-600">Applied this month</p>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {formatCurrency(dashboardData?.revenue?.totalDiscount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue & Payouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* REVENUE & PAYOUTS OVERVIEW - API INTEGRATED */}
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              💰 Revenue & Payouts Overview
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-white border-l-4 border-[#FF7B1D] rounded">
                <p className="text-sm text-gray-600">Total Revenue (Month)</p>
                <p className="text-3xl font-bold text-black">
                  {formatCurrency(dashboardData?.revenue?.total || 0)}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {dashboardData?.revenue?.totalOrders || 0} orders completed
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-white border-l-4 border-green-500 rounded">
                <p className="text-sm text-gray-600">Total Tax Collected</p>
                <p className="text-3xl font-bold text-black">
                  {formatCurrency(dashboardData?.revenue?.totalTax || 0)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  From all transactions
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-white border-l-4 border-yellow-500 rounded">
                <p className="text-sm text-gray-600">Shipping Charges</p>
                <p className="text-3xl font-bold text-black">
                  {formatCurrency(dashboardData?.revenue?.totalShipping || 0)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total shipping collected
                </p>
              </div>
            </div>
          </div>

          {/* VENDOR PERFORMANCE - API INTEGRATED */}
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              ⭐ Order Status Distribution
            </h2>
            <div className="space-y-4">
              {dashboardData?.orders?.statusDistribution?.map((status, idx) => {
                const totalOrders =
                  dashboardData.orders.statusDistribution.reduce(
                    (sum, s) => sum + s.count,
                    0
                  );
                const percentage = ((status.count / totalOrders) * 100).toFixed(
                  0
                );

                return (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-black capitalize">
                        {status.status.replace(/_/g, " ")}
                      </span>
                      <span className="font-semibold text-black">
                        {status.count} orders ({formatCurrency(status.revenue)})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#FF7B1D] h-3 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Vendor Growth: Line Chart - API INTEGRATED */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            📈 Revenue & Orders Timeline
          </h2>
          <div className="h-80">
            {monthlyGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyGrowthData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#FF7B1D"
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#3B82F6"
                    domain={[0, "auto"]}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF7B1D"
                    activeDot={{ r: 8 }}
                    name="Revenue (₹)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#3B82F6"
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Vendor Activity - API INTEGRATED */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            🔔 Top Products Performance
          </h2>
          <div className="space-y-3">
            {productsData.slice(0, 6).map((product, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border-2 border-[#FF7B1D] rounded hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-black">
                  {product.productName}
                </p>
                <p className="text-sm text-gray-600">
                  Revenue: {formatCurrency(product.metrics.totalRevenue)} |
                  Quantity Sold: {product.metrics.totalQuantity}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {product.metrics.orderCount} orders | Avg Price:{" "}
                  {formatCurrency(product.metrics.averagePrice)}
                </p>
              </div>
            ))}
            {productsData.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No product activity available
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorReport;
