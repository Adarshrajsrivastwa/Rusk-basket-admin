import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import api from "../../api/api";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Bell,
  Search,
  User,
  RefreshCw,
  Briefcase,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Fetch unread notification count
  const fetchUnreadNotificationCount = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setUnreadNotificationCount(0);
        return;
      }

      const response = await api.get("/api/vendor/notifications/unread-count");
      if (response.data && response.data.success) {
        setUnreadNotificationCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      setUnreadNotificationCount(0);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
    fetchVendorJobPosts();
    fetchInventoryData();
    fetchUnreadNotificationCount();
  }, []);

  // Fetch vendor's job posts
  const fetchVendorJobPosts = async () => {
    setJobsLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const apiUrl = `${BASE_URL}/api/vendor/my-job-posts`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        const jobs = data.data || [];
        setJobPosts(jobs);
      } else {
        setJobPosts([]);
      }
    } catch (error) {
      setJobPosts([]);
    } finally {
      setJobsLoading(false);
    }
  };


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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory data
  const fetchInventoryData = async () => {
    try {
      setInventoryLoading(true);

      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/analytics/vendor/inventory`,
        {
          method: "GET",
          credentials: "include",
          headers: headers,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory data: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setInventoryData(result.data);
      }
    } catch (err) {
    } finally {
      setInventoryLoading(false);
    }
  };

  // Get stats from API data
  const getStats = () => {
    if (!dashboardData || !dashboardData.metrics) {
      return [
        {
          label: "Total Revenue",
          value: "₹0.00",
          change: "+0%",
          icon: IndianRupee,
          color: "bg-gradient-to-br from-green-500 to-green-600",
          changeType: "positive",
        },
        {
          label: "Total Orders",
          value: "0",
          change: "+0%",
          icon: ShoppingCart,
          color: "bg-gradient-to-br from-blue-500 to-blue-600",
          changeType: "positive",
        },
        {
          label: "Products",
          value: "0",
          change: "0",
          icon: Package,
          color: "bg-gradient-to-br from-purple-500 to-purple-600",
          changeType: "positive",
        },
        {
          label: "Growth",
          value: "0%",
          change: "+0%",
          icon: TrendingUp,
          color: "bg-gradient-to-br from-[#FF7B1D] to-orange-600",
          changeType: "positive",
        },
      ];
    }

    const { metrics } = dashboardData;

    return [
      {
        label: "Total Revenue",
        value: metrics.totalRevenue?.formattedValue || "₹0.00",
        change: metrics.totalRevenue?.change || "+0%",
        icon: IndianRupee,
        color: "bg-gradient-to-br from-green-500 to-green-600",
        changeType: metrics.totalRevenue?.changeType || "positive",
      },
      {
        label: "Total Orders",
        value: metrics.totalOrders?.formattedValue || "0",
        change: metrics.totalOrders?.change || "+0%",
        icon: ShoppingCart,
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
        changeType: metrics.totalOrders?.changeType || "positive",
      },
      {
        label: "Products",
        value: metrics.products?.formattedValue || "0",
        change: metrics.products?.change || "0",
        icon: Package,
        color: "bg-gradient-to-br from-purple-500 to-purple-600",
        changeType: metrics.products?.changeType || "positive",
      },
      {
        label: "Growth",
        value: metrics.growth?.formattedValue || "0%",
        change: metrics.growth?.change || "+0%",
        icon: TrendingUp,
        color: "bg-gradient-to-br from-[#FF7B1D] to-orange-600",
        changeType: metrics.growth?.changeType || "positive",
      },
    ];
  };

  const stats = getStats();
  const recentOrders = dashboardData?.recentOrders || [];
  
  // Get low stock products from inventory API or fallback to dashboard data
  const getLowStockProducts = () => {
    if (inventoryData?.inventory) {
      // Filter products with low stock (stockPercentage < 20 or stockStatus !== 'in_stock')
      return inventoryData.inventory.filter(
        (product) =>
          product.stockPercentage < 20 ||
          product.stockStatus === "out_of_stock" ||
          product.stockStatus === "low_stock"
      );
    }
    // Fallback to dashboard data if inventory API data not available
    return dashboardData?.lowStockAlert || [];
  };
  
  const lowStockProducts = getLowStockProducts();

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            <button
              onClick={() => {
                fetchDashboardData();
                fetchInventoryData();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#FF7B1D] rounded-lg hover:bg-[#FF7B1D] hover:text-white transition-all shadow-sm"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-semibold">Refresh</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-xl hover:border-[#FF7B1D] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-bold ${getChangeColor(
                        stat.changeType,
                      )}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
                  {stat.label}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Notifications Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md border-2 border-yellow-200 p-6 mb-8 hover:shadow-xl hover:border-[#FF7B1D] transition-all duration-300 cursor-pointer" onClick={() => navigate("/vendor/notifications")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg relative">
                <Bell className="text-white" size={24} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center font-bold px-1.5 animate-pulse">
                    {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-gray-800 font-bold text-lg">
                  Notifications
                </h3>
                <p className="text-xs text-gray-600">Stay updated with your store</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border-2 border-orange-300 rounded-lg p-4 shadow-sm">
                <p className="text-lg font-bold text-gray-900">
                  {unreadNotificationCount || 0} Unread
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {unreadNotificationCount > 0
                    ? "You have pending notifications"
                    : "No new notifications"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/vendor/notifications");
                }}
                className="w-full bg-[#FF7B1D] text-white py-3 rounded-lg text-sm font-bold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                View All Notifications
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Recent Orders
                  </h3>
                  <p className="text-sm text-gray-500">Latest customer orders</p>
                </div>
                <button 
                  onClick={() => navigate("/vendor/orders")}
                  className="text-[#FF7B1D] hover:text-orange-600 text-sm font-semibold flex items-center gap-1 hover:underline"
                >
                  View All
                  <ArrowUpRight className="w-4 h-4" />
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
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                          Order ID
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                          Customer
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                          Product
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                          Amount
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-orange-50 transition-colors">
                          <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                            {order.orderId || order.id || order.orderNumber || "N/A"}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">
                            {order.customer || order.customerName || "N/A"}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">
                            {order.product || order.productName || "N/A"}
                          </td>
                          <td className="py-4 px-4 text-sm font-bold text-gray-900">
                            {order.amount || order.totalAmount
                              ? `₹${(order.amount || order.totalAmount).toLocaleString()}`
                              : "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
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
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Low Stock Alert
                  </h3>
                  <p className="text-sm text-gray-500">Products needing attention</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
              </div>

              {inventoryLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-gray-500 text-sm mt-2">Loading inventory...</p>
                </div>
              ) : lowStockProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    All stock levels are good
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Products running low on stock will appear here
                  </p>
                  {inventoryData?.summary && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Total Products</p>
                          <p className="font-semibold text-gray-900">
                            {inventoryData.summary.totalProducts}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">In Stock</p>
                          <p className="font-semibold text-green-600">
                            {inventoryData.summary.inStock}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product, index) => (
                    <div
                      key={product.productId || index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {product.productName ||
                            product.name ||
                            "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.skuHsn || product.sku || "N/A"}
                        </p>
                        {product.category && (
                          <p className="text-xs text-gray-500 mt-1">
                            {product.category.name}
                            {product.subCategory && ` / ${product.subCategory.name}`}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-orange-600">
                          {product.currentInventory ||
                            product.stock ||
                            product.quantity ||
                            0}
                        </p>
                        <p className="text-xs text-gray-600">
                          {product.stockPercentage !== undefined
                            ? `${product.stockPercentage}%`
                            : "in stock"}
                        </p>
                        {product.stockStatus && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                              product.stockStatus === "out_of_stock"
                                ? "bg-red-100 text-red-700"
                                : product.stockStatus === "low_stock"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {product.stockStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {inventoryData?.summary && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className="font-semibold text-gray-900">
                            {inventoryData.summary.totalProducts}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">In Stock</p>
                          <p className="font-semibold text-green-600">
                            {inventoryData.summary.inStock}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Out of Stock</p>
                          <p className="font-semibold text-red-600">
                            {inventoryData.summary.outOfStock}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => window.location.href = "/vendor/inventory"}
                    className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View All Inventory
                  </button>
                </div>
              )}
            </div>

            {/* Job Postings Section */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 mt-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 p-2 rounded-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      My Job Postings
                    </h3>
                    <p className="text-sm text-gray-500">Manage your delivery job listings</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/vendor/jobs")}
                  className="text-[#FF7B1D] hover:text-orange-600 text-sm font-semibold flex items-center gap-1 hover:underline"
                >
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {jobsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-gray-500 text-sm mt-2">Loading job posts...</p>
                </div>
              ) : jobPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No job posts found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Create your first job posting to hire delivery executives
                  </p>
                  <button
                    onClick={() => window.location.href = "/vendor/jobs"}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Job Post
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobPosts.slice(0, 3).map((job) => (
                    <div
                      key={job._id}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#FF7B1D] transition-all bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {job.jobTitle}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                job.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {job.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-4 h-4 text-green-600" />
                              <span>
                                <strong>Joining Bonus:</strong> ₹{job.joiningBonus}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-4 h-4 text-blue-600" />
                              <span>
                                <strong>Onboarding Fee:</strong> ₹{job.onboardingFee}
                              </span>
                            </div>
                          </div>

                          {job.location && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p>{job.location.line1}</p>
                                {job.location.line2 && <p>{job.location.line2}</p>}
                                <p>
                                  {job.location.city}, {job.location.state} - {job.location.pinCode}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {jobPosts.length > 3 && (
                    <button
                      onClick={() => window.location.href = "/vendor/jobs"}
                      className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border-t border-gray-200 pt-4"
                    >
                      View All {jobPosts.length} Job Posts
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
