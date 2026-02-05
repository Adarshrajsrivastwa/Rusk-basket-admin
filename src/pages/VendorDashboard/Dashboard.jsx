import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Bell,
  Search,
  User,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/analytics/vendor/overview`,
        {
          method: "GET",
          credentials: "include",
          headers: headers,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setDashboardData(result.data);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get stats from API data
  const getStats = () => {
    if (!dashboardData || !dashboardData.metrics) {
      return [
        {
          label: "Total Revenue",
          value: "$0.00",
          change: "+0%",
          icon: DollarSign,
          color: "bg-green-500",
          changeType: "positive",
        },
        {
          label: "Total Orders",
          value: "0",
          change: "+0%",
          icon: ShoppingCart,
          color: "bg-blue-500",
          changeType: "positive",
        },
        {
          label: "Products",
          value: "0",
          change: "0",
          icon: Package,
          color: "bg-purple-500",
          changeType: "positive",
        },
        {
          label: "Growth",
          value: "0%",
          change: "+0%",
          icon: TrendingUp,
          color: "bg-orange-500",
          changeType: "positive",
        },
      ];
    }

    const { metrics } = dashboardData;

    return [
      {
        label: "Total Revenue",
        value: metrics.totalRevenue?.formattedValue || "$0.00",
        change: metrics.totalRevenue?.change || "+0%",
        icon: DollarSign,
        color: "bg-green-500",
        changeType: metrics.totalRevenue?.changeType || "positive",
      },
      {
        label: "Total Orders",
        value: metrics.totalOrders?.formattedValue || "0",
        change: metrics.totalOrders?.change || "+0%",
        icon: ShoppingCart,
        color: "bg-blue-500",
        changeType: metrics.totalOrders?.changeType || "positive",
      },
      {
        label: "Products",
        value: metrics.products?.formattedValue || "0",
        change: metrics.products?.change || "0",
        icon: Package,
        color: "bg-purple-500",
        changeType: metrics.products?.changeType || "positive",
      },
      {
        label: "Growth",
        value: metrics.growth?.formattedValue || "0%",
        change: metrics.growth?.change || "+0%",
        icon: TrendingUp,
        color: "bg-orange-500",
        changeType: metrics.growth?.changeType || "positive",
      },
    ];
  };

  const stats = getStats();
  const recentOrders = dashboardData?.recentOrders || [];
  const lowStockProducts = dashboardData?.lowStockAlert || [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen">
          <main className="p-0 ml-6">
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
                    <div className="bg-gray-200 w-16 h-4 rounded"></div>
                  </div>
                  <div className="bg-gray-200 w-24 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 w-32 h-8 rounded"></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="bg-gray-200 w-48 h-6 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-200 w-full h-12 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="bg-gray-200 w-40 h-6 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-200 w-full h-20 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </DashboardLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen">
          <main className="p-0 ml-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-red-800 font-bold text-xl mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </main>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        {/* Dashboard Content */}
        <main className="p-0 ml-6">
          {/* Header with Refresh */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                Refresh
              </span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`text-sm font-semibold ${getChangeColor(
                      stat.changeType,
                    )}`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Orders
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No recent orders</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Orders will appear here once customers start placing them
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Order ID
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Customer
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Product
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Amount
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2 text-sm font-medium text-gray-900">
                            {order.id || order.orderNumber || "N/A"}
                          </td>
                          <td className="py-3 px-2 text-sm text-gray-600">
                            {order.customer || order.customerName || "N/A"}
                          </td>
                          <td className="py-3 px-2 text-sm text-gray-600">
                            {order.product || order.productName || "N/A"}
                          </td>
                          <td className="py-3 px-2 text-sm font-medium text-gray-900">
                            {order.amount || order.totalAmount
                              ? `₹${(order.amount || order.totalAmount).toLocaleString()}`
                              : "N/A"}
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status,
                              )}`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Low Stock Alert
                </h3>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    All stock levels are good
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Products running low on stock will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lowStockProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name ||
                            product.productName ||
                            "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.sku || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          {product.stock || product.quantity || 0}
                        </p>
                        <p className="text-xs text-gray-600">in stock</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                    View All Inventory
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
