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
  RefreshCw,
  Briefcase,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
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

  const fetchUnreadNotificationCount = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setUnreadNotificationCount(0);
        return;
      }
      const response = await api.get("/api/vendor/notifications/unread-count");
      if (response.data?.success)
        setUnreadNotificationCount(response.data.unreadCount || 0);
    } catch {
      setUnreadNotificationCount(0);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchVendorJobPosts();
    fetchInventoryData();
    fetchUnreadNotificationCount();
  }, []);

  const fetchVendorJobPosts = async () => {
    setJobsLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/vendor/my-job-posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      const data = await response.json();
      setJobPosts(data.success ? data.data || [] : []);
    } catch {
      setJobPosts([]);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await fetch(
        `${BASE_URL}/api/analytics/vendor/overview`,
        {
          method: "GET",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (!response.ok)
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      const result = await response.json();
      if (result.success && result.data) setDashboardData(result.data);
      else throw new Error("Invalid API response");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryData = async () => {
    try {
      setInventoryLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await fetch(
        `${BASE_URL}/api/analytics/vendor/inventory`,
        {
          method: "GET",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (!response.ok)
        throw new Error(`Failed to fetch inventory data: ${response.status}`);
      const result = await response.json();
      if (result.success && result.data) setInventoryData(result.data);
    } catch {
    } finally {
      setInventoryLoading(false);
    }
  };

  const getStats = () => {
    const m = dashboardData?.metrics;
    return [
      {
        label: "Total Revenue",
        value: m?.totalRevenue?.formattedValue || "₹0.00",
        change: m?.totalRevenue?.change || "+0%",
        icon: IndianRupee,
        iconBg: "bg-emerald-50 border-emerald-100",
        iconColor: "text-emerald-600",
        changeType: m?.totalRevenue?.changeType || "positive",
      },
      {
        label: "Total Orders",
        value: m?.totalOrders?.formattedValue || "0",
        change: m?.totalOrders?.change || "+0%",
        icon: ShoppingCart,
        iconBg: "bg-blue-50 border-blue-100",
        iconColor: "text-blue-600",
        changeType: m?.totalOrders?.changeType || "positive",
      },
      {
        label: "Products",
        value: m?.products?.formattedValue || "0",
        change: m?.products?.change || "0",
        icon: Package,
        iconBg: "bg-violet-50 border-violet-100",
        iconColor: "text-violet-600",
        changeType: m?.products?.changeType || "positive",
      },
      {
        label: "Growth",
        value: m?.growth?.formattedValue || "0%",
        change: m?.growth?.change || "+0%",
        icon: TrendingUp,
        iconBg: "bg-orange-50 border-orange-100",
        iconColor: "text-[#FF7B1D]",
        changeType: m?.growth?.changeType || "positive",
      },
    ];
  };

  const stats = getStats();
  const recentOrders = dashboardData?.recentOrders || [];

  const getLowStockProducts = () => {
    if (inventoryData?.inventory) {
      return inventoryData.inventory.filter(
        (p) =>
          p.stockPercentage < 20 ||
          p.stockStatus === "out_of_stock" ||
          p.stockStatus === "low_stock",
      );
    }
    return dashboardData?.lowStockAlert || [];
  };
  const lowStockProducts = getLowStockProducts();

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    const styles = {
      completed:
        "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
      delivered:
        "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
      processing: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
      pending: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
      shipped: "bg-violet-50 text-violet-700 border-violet-200 ring-violet-100",
      cancelled: "bg-red-50 text-red-700 border-red-200 ring-red-100",
      canceled: "bg-red-50 text-red-700 border-red-200 ring-red-100",
    };
    const dots = {
      completed: "bg-emerald-500",
      delivered: "bg-emerald-500",
      processing: "bg-blue-500",
      confirmed: "bg-blue-500",
      pending: "bg-amber-500",
      shipped: "bg-violet-500",
      cancelled: "bg-red-500",
      canceled: "bg-red-500",
    };
    const cls =
      styles[s] || "bg-gray-50 text-gray-600 border-gray-200 ring-gray-100";
    const dot = dots[s] || "bg-gray-400";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${cls}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {status || "Pending"}
      </span>
    );
  };

  // ── Loading ──
  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full px-1 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-100" />
                  <div className="w-16 h-4 rounded-full bg-gray-100" />
                </div>
                <div className="w-20 h-3 rounded-full bg-gray-100 mb-2" />
                <div className="w-28 h-7 rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-72" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-72" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <DashboardLayout>
        <div className="w-full px-1 mt-3">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-red-700 font-bold text-lg mb-1">
              Error Loading Dashboard
            </h3>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 bg-[#FF7B1D] hover:bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-enter { animation: fadeSlideIn 0.3s ease forwards; }
      `}</style>

      <div className="w-full px-1 mt-3 space-y-4">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Welcome back! Here's your store summary.
            </p>
          </div>
          <button
            onClick={() => {
              fetchDashboardData();
              fetchInventoryData();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="card-enter bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-orange-200 transition-all duration-200 group"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center ${stat.iconBg} group-hover:scale-105 transition-transform`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${stat.changeType === "positive" ? "text-emerald-600" : "text-red-500"}`}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Notifications Banner ── */}
        <div
          className="card-enter rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white cursor-pointer hover:shadow-md hover:border-orange-200 transition-all duration-200"
          style={{ animationDelay: "240ms" }}
          onClick={() => navigate("/vendor/notifications")}
        >
          {/* Card Header — same orange gradient as table headers */}
          <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/70" />
              <span className="text-sm font-bold text-white">
                Notification Center
              </span>
            </div>
            <div className="flex items-center gap-2 relative">
              <Bell className="w-5 h-5 text-white" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 animate-pulse">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </div>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {unreadNotificationCount || 0}
                <span className="text-sm font-medium text-gray-400 ml-1.5">
                  unread
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {unreadNotificationCount > 0
                  ? "You have pending notifications"
                  : "All caught up — no new notifications"}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/vendor/notifications");
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-orange-50 hover:bg-[#FF7B1D] hover:text-white text-[#FF7B1D] border border-orange-200 hover:border-[#FF7B1D] transition-all"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Recent Orders + Low Stock ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Orders */}
          <div
            className="card-enter lg:col-span-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white"
            style={{ animationDelay: "300ms" }}
          >
            {/* Card Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  Recent Orders
                </span>
              </div>
              <button
                onClick={() => navigate("/vendor/orders")}
                className="flex items-center gap-1 text-xs font-semibold text-[#FF7B1D] hover:text-orange-600 transition-colors"
              >
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <ShoppingCart className="w-7 h-7 text-orange-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No recent orders
                </p>
                <p className="text-gray-300 text-xs">
                  Orders will appear here once customers place them
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                      <th className="px-4 py-3 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                            {(
                              order.orderId ||
                              order.id ||
                              order.orderNumber ||
                              "N/A"
                            )
                              .toString()
                              .slice(0, 10)}
                            …
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600">
                          {order.customer || order.customerName || "N/A"}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600 max-w-[140px] truncate">
                          {order.product || order.productName || "N/A"}
                        </td>
                        <td className="px-4 py-3.5 text-xs font-bold text-gray-800">
                          {order.amount || order.totalAmount
                            ? `₹${(order.amount || order.totalAmount).toLocaleString()}`
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3.5">
                          {getStatusBadge(order.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div
            className="card-enter rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white"
            style={{ animationDelay: "360ms" }}
          >
            {/* Card Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  Low Stock Alert
                </span>
              </div>
              <div className="w-7 h-7 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-[#FF7B1D]" />
              </div>
            </div>

            <div className="p-4">
              {inventoryLoading ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-[#FF7B1D]" />
                  <p className="text-gray-400 text-xs">Loading inventory...</p>
                </div>
              ) : lowStockProducts.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
                    All stock levels good
                  </p>
                  {inventoryData?.summary && (
                    <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="font-bold text-gray-700 text-sm">
                          {inventoryData.summary.totalProducts}
                        </p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">In Stock</p>
                        <p className="font-bold text-emerald-600 text-sm">
                          {inventoryData.summary.inStock}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {lowStockProducts.slice(0, 4).map((product, idx) => {
                    const stockStatus = product.stockStatus || "";
                    const isOut = stockStatus === "out_of_stock";
                    const isLow = stockStatus === "low_stock";
                    return (
                      <div
                        key={product.productId || idx}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-orange-200 hover:bg-orange-50/30 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 truncate">
                            {product.productName || product.name || "Unknown"}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {product.skuHsn || product.sku || "—"}
                          </p>
                        </div>
                        <div className="text-right ml-3 flex-shrink-0">
                          <p
                            className={`text-sm font-bold ${isOut ? "text-red-500" : "text-[#FF7B1D]"}`}
                          >
                            {product.currentInventory ||
                              product.stock ||
                              product.quantity ||
                              0}
                          </p>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isOut ? "bg-red-50 text-red-600" : isLow ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
                          >
                            {stockStatus.replace("_", " ") || "low"}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {inventoryData?.summary && (
                    <div className="grid grid-cols-3 gap-1.5 pt-2 mt-1 border-t border-gray-100">
                      {[
                        {
                          label: "Total",
                          val: inventoryData.summary.totalProducts,
                          color: "text-gray-700",
                        },
                        {
                          label: "In Stock",
                          val: inventoryData.summary.inStock,
                          color: "text-emerald-600",
                        },
                        {
                          label: "Out",
                          val: inventoryData.summary.outOfStock,
                          color: "text-red-500",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-gray-50 rounded-lg p-2 text-center"
                        >
                          <p className="text-[10px] text-gray-400">
                            {item.label}
                          </p>
                          <p className={`text-sm font-bold ${item.color}`}>
                            {item.val}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => navigate("/vendor/inventory")}
                    className="w-full py-2 text-xs font-semibold text-[#FF7B1D] hover:text-orange-600 border-t border-gray-100 pt-3 mt-1 transition-colors"
                  >
                    View All Inventory →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Job Postings ── */}
        <div
          className="card-enter rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white"
          style={{ animationDelay: "420ms" }}
        >
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                My Job Postings
              </span>
              {jobPosts.length > 0 && (
                <span className="text-xs text-gray-400 font-medium">
                  · {jobPosts.length} total
                </span>
              )}
            </div>
            <button
              onClick={() => navigate("/vendor/jobs")}
              className="flex items-center gap-1 text-xs font-semibold text-[#FF7B1D] hover:text-orange-600 transition-colors"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4">
            {jobsLoading ? (
              <div className="flex flex-col items-center py-10 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-[#FF7B1D]" />
                <p className="text-gray-400 text-xs">Loading job posts...</p>
              </div>
            ) : jobPosts.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-orange-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No job posts found
                </p>
                <p className="text-gray-300 text-xs">
                  Create your first job posting to hire delivery executives
                </p>
                <button
                  onClick={() => navigate("/vendor/jobs")}
                  className="mt-1 px-5 py-2 bg-[#FF7B1D] hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Create Job Post
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {jobPosts.slice(0, 3).map((job, idx) => (
                  <div
                    key={job._id}
                    className="rounded-xl border border-gray-100 bg-gray-50 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-sm transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#FF7B1D] transition-colors">
                          {job.jobTitle}
                        </h4>
                      </div>
                      <span
                        className={`ml-2 flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ring-1 ${job.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100" : "bg-gray-100 text-gray-500 border-gray-200 ring-gray-100"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${job.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                        />
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>
                          Joining Bonus:{" "}
                          <strong className="text-gray-700">
                            ₹{job.joiningBonus}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>
                          Onboarding Fee:{" "}
                          <strong className="text-gray-700">
                            ₹{job.onboardingFee}
                          </strong>
                        </span>
                      </div>
                      {job.location && (
                        <div className="flex items-start gap-1.5 mt-1 pt-1.5 border-t border-gray-200">
                          <MapPin className="w-3.5 h-3.5 text-[#FF7B1D] flex-shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            {job.location.line1}
                            {job.location.line2
                              ? `, ${job.location.line2}`
                              : ""}
                            , {job.location.city}, {job.location.state} –{" "}
                            {job.location.pinCode}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {jobPosts.length > 3 && (
              <button
                onClick={() => navigate("/vendor/jobs")}
                className="w-full py-2.5 text-xs font-semibold text-[#FF7B1D] hover:text-orange-600 border-t border-gray-100 mt-3 pt-3 transition-colors"
              >
                View All {jobPosts.length} Job Posts →
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
