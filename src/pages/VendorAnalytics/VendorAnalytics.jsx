import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  IndianRupee,
  Loader2,
} from "lucide-react";
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
import { BASE_URL } from "../../api/api";

// API Base URL
const API_BASE_URL = `${BASE_URL}/api/analytics/vendor`;

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  // Fetch analytics data
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

        // Fetch products data
        const productsRes = await fetch(
          `${API_BASE_URL}/products`,
          fetchOptions
        );
        const productsJson = await productsRes.json();

        if (dashboardJson.success) setDashboardData(dashboardJson.data);
        if (salesJson.success) setSalesData(salesJson.data.sales || []);
        if (productsJson.success)
          setProductsData(productsJson.data.products || []);
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
  }, []);

  // Helper function for currency formatting
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
  const chartSalesData = salesData.map((sale) => ({
    date: formatDate(sale.period),
    revenue: sale.revenue || 0,
    orders: sale.orders || 0,
  }));

  // Prepare products chart data
  const topProductsChart = productsData.slice(0, 6).map((product, idx) => {
    const colors = [
      "#FF7B1D",
      "#FE9C4B",
      "#FFC285",
      "#FFDDAC",
      "#FF9F66",
      "#FFB380",
    ];
    return {
      name: product.productName?.substring(0, 20) || "Unknown",
      sales: product.metrics?.totalRevenue || 0,
      color: colors[idx % colors.length],
    };
  });

  // Order status distribution for pie chart
  const orderStatusData =
    dashboardData?.orders?.statusDistribution?.map((status, idx) => {
      const colors = ["#FF7B1D", "#22C55E", "#EF4444", "#FFA500", "#3B82F6"];
      return {
        status: status.status.replace(/_/g, " "),
        value: status.count,
        color: colors[idx % colors.length],
      };
    }) || [];

  // Payment method distribution
  const paymentMethodData =
    dashboardData?.orders?.paymentMethodDistribution?.map((method, idx) => {
      const colors = ["#FF7B1D", "#FFA500", "#FFB84D", "#FFC976"];
      return {
        method: method.method.toUpperCase(),
        value: method.count,
        color: colors[idx % colors.length],
      };
    }) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#FF7B1D] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <p className="text-3xl font-bold text-black mt-2">
              {formatCurrency(dashboardData?.revenue?.total || 0)}
            </p>
            <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
              All Time:{" "}
              {formatCurrency(dashboardData?.revenue?.allTimeTotal || 0)}
            </p>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">
                Total Orders
              </p>
              <ShoppingCart className="w-6 h-6 text-[#FF7B1D]" />
            </div>
            <p className="text-3xl font-bold text-black mt-2">
              {dashboardData?.revenue?.totalOrders || 0}
            </p>
            <p className="text-[#FF7B1D] text-sm mt-2 font-semibold">
              All Time: {dashboardData?.revenue?.allTimeTotalOrders || 0}
            </p>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">
                Avg Order Value
              </p>
              <TrendingUp className="w-6 h-6 text-[#FF7B1D]" />
            </div>
            <p className="text-3xl font-bold text-black mt-2">
              {formatCurrency(dashboardData?.revenue?.averageOrderValue || 0)}
            </p>
            <p className="text-green-600 text-sm mt-2 font-semibold">
              Per transaction
            </p>
          </div>

          <div className="bg-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">
                Active Products
              </p>
              <Package className="w-6 h-6 text-[#FF7B1D]" />
            </div>
            <p className="text-3xl font-bold text-black mt-2">
              {dashboardData?.products?.total || 0}
            </p>
            <p className="text-green-600 text-sm mt-2 font-semibold">
              {dashboardData?.products?.approved || 0} approved
            </p>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">
            Revenue & Orders Trend
          </h2>
          {chartSalesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartSalesData}>
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
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">No sales data available</p>
            </div>
          )}
        </div>

        {/* Top Products and Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Top Selling Products
            </h2>
            {topProductsChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topProductsChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
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
                  <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                    {topProductsChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-gray-500">No product data available</p>
              </div>
            )}
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Order Status Distribution
            </h2>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, value }) => `${status}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-gray-500">No order data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        {paymentMethodData.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">
              Payment Methods Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ method, value }) => `${method}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Products Table */}
        <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            Top Performing Products
          </h2>
          <div className="overflow-x-auto">
            {productsData.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#FF7B1D]">
                    <th className="text-left py-3 px-4 text-black font-semibold">
                      Product Name
                    </th>
                    <th className="text-left py-3 px-4 text-black font-semibold">
                      Quantity Sold
                    </th>
                    <th className="text-left py-3 px-4 text-black font-semibold">
                      Revenue
                    </th>
                    <th className="text-left py-3 px-4 text-black font-semibold">
                      Avg Price
                    </th>
                    <th className="text-left py-3 px-4 text-black font-semibold">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsData.map((product, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-semibold text-black">
                        {product.productName}
                      </td>
                      <td className="py-3 px-4 text-black">
                        {product.metrics?.totalQuantity || 0}
                      </td>
                      <td className="py-3 px-4 text-[#FF7B1D] font-semibold">
                        {formatCurrency(product.metrics?.totalRevenue || 0)}
                      </td>
                      <td className="py-3 px-4 text-black">
                        {formatCurrency(product.metrics?.averagePrice || 0)}
                      </td>
                      <td className="py-3 px-4 text-black">
                        {product.metrics?.orderCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No product data available
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-[#FF7B1D] rounded-sm shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-3">
              Revenue Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-bold text-[#FF7B1D]">
                  {formatCurrency(
                    dashboardData?.revenue?.totalItemRevenue || 0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items Sold:</span>
                <span className="font-bold text-black">
                  {dashboardData?.revenue?.totalItemsSold || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cashback Given:</span>
                <span className="font-bold text-black">
                  {formatCurrency(dashboardData?.revenue?.totalCashback || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-500 rounded-sm shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-3">
              Product Status
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products:</span>
                <span className="font-bold text-black">
                  {dashboardData?.products?.total || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approved:</span>
                <span className="font-bold text-green-600">
                  {dashboardData?.products?.approved || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-bold text-orange-600">
                  {dashboardData?.products?.pending || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-500 rounded-sm shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-3">
              Order Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-bold text-black">
                  {dashboardData?.revenue?.totalOrders || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Order Value:</span>
                <span className="font-bold text-black">
                  {formatCurrency(
                    dashboardData?.revenue?.averageOrderValue || 0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">All Time Orders:</span>
                <span className="font-bold text-black">
                  {dashboardData?.revenue?.allTimeTotalOrders || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
