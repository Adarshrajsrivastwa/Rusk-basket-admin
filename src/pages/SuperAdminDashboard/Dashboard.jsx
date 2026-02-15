// AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AddVendorModal from "../../components/AddVendorModal";
import VendorDetails from "../../pages/VendorManagement/VendorDetails";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";

import {
  ShoppingCart,
  Store,
  Bike,
  Users,
  Package,
  IndianRupee,
  Bell,
  Headphones,
  ArrowUp,
  ArrowUpRight,
  Edit,
  UserPlus,
  Eye,
  Briefcase,
  RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  const navigate = useNavigate();

  // Fetch admin profile data
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}/api/admin/profile`, {
          method: "GET",
          credentials: "include",
          headers: headers,
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setAdminProfile(result.data);
          }
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        // Don't set error, just use default values
      }
    };

    fetchAdminProfile();
  }, []);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get token from localStorage
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${BASE_URL}/api/analytics/admin/dashboard/overview`,
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

        console.log("========================================");
        console.log("ADMIN DASHBOARD API RESPONSE:");
        console.log("Full response:", result);
        console.log("Response success:", result.success);
        console.log("Response data:", result.data);
        console.log("========================================");

        if (result.data) {
          console.log("Dashboard data keys:", Object.keys(result.data));
          console.log("Notifications data:", result.data.notifications);
          console.log("Notifications type:", typeof result.data.notifications);
          console.log(
            "Notifications unread:",
            result.data.notifications?.unread,
          );
          console.log(
            "Notifications message:",
            result.data.notifications?.message,
          );
          console.log("Notifications total:", result.data.notifications?.total);
          console.log(
            "Full notifications object:",
            JSON.stringify(result.data.notifications, null, 2),
          );
        }
        console.log("========================================");

        if (result.success) {
          setDashboardData(result.data);
          console.log("Dashboard data set successfully");
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform API data to match component structure - memoized for performance
  const stats = useMemo(() => {
    if (!dashboardData) return null;

    return {
      orders: {
        total: dashboardData.metrics.totalOrders.total,
        new: dashboardData.metrics.totalOrders.new,
        pending: dashboardData.metrics.totalOrders.pending,
        delivered:
          dashboardData.metrics.totalOrders.total -
          dashboardData.metrics.totalOrders.pending,
        cancelled: 0,
        growth: dashboardData.metrics.totalOrders.increasePercent,
      },
      vendors: {
        total: dashboardData.metrics.totalVendors.total,
        active: dashboardData.metrics.totalVendors.active,
        inactive:
          dashboardData.metrics.totalVendors.total -
          dashboardData.metrics.totalVendors.active,
        newThisMonth: dashboardData.metrics.totalVendors.new,
        growth: dashboardData.metrics.totalVendors.increasePercent,
      },
      riders: {
        total: dashboardData.metrics.totalRiders.total,
        active: dashboardData.metrics.totalRiders.online,
        offline:
          dashboardData.metrics.totalRiders.total -
          dashboardData.metrics.totalRiders.online,
        onDelivery: dashboardData.metrics.totalRiders.delivering,
        growth: dashboardData.metrics.totalRiders.increasePercent,
      },
      users: {
        total: dashboardData.metrics.totalUsers.total,
        active: dashboardData.metrics.totalUsers.active,
        newThisMonth: dashboardData.metrics.totalUsers.new,
        growth: dashboardData.metrics.totalUsers.increasePercent,
      },
      riderJobPosts: {
        total: dashboardData.metrics.riderJobPosts?.total || 0,
        active: dashboardData.metrics.riderJobPosts?.active || 0,
        newThisMonth: dashboardData.metrics.riderJobPosts?.new || 0,
        growth: dashboardData.metrics.riderJobPosts?.increasePercent || 0,
      },
      inventory: {
        totalProducts: dashboardData.inventory.totalProducts,
        inStock: dashboardData.inventory.inStock,
        lowStock: dashboardData.inventory.lowStock,
        outOfStock: dashboardData.inventory.outOfStock,
      },
      revenue: {
        today: dashboardData.revenue.today,
        thisWeek: dashboardData.revenue.thisWeek,
        thisMonth: dashboardData.revenue.thisMonth,
        growth: dashboardData.revenue.increasePercent,
      },
      notifications: {
        unread: dashboardData.notifications?.unread || 0,
        total:
          dashboardData.notifications?.total ||
          dashboardData.notifications?.unread ||
          0,
      },
      tickets: {
        open: dashboardData.supportTickets.open,
        inProgress: dashboardData.supportTickets.inProgress,
        resolved: dashboardData.supportTickets.resolved,
        escalated: dashboardData.supportTickets.escalated,
      },
    };
  }, [dashboardData]);

  // Transform recent orders from API - memoized for performance
  const recentOrders = useMemo(() => {
    return (
      dashboardData?.recentOrders.map((order) => ({
        id: order.orderId,
        customer: order.customer,
        amount: order.amount,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        date: new Date().toISOString().split("T")[0],
      })) || []
    );
  }, [dashboardData?.recentOrders]);

  // Transform top vendors from API - memoized for performance
  const topVendors = useMemo(() => {
    return (
      dashboardData?.topVendors.map((vendor) => ({
        id: vendor.vendorId,
        name: vendor.vendorName || vendor.storeName,
        sales: 0, // Not provided in API
        orders: vendor.orders,
        rating: 0, // Not provided in API
        rank: vendor.rank,
      })) || []
    );
  }, [dashboardData?.topVendors]);

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="animate-pulse flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-gray-200 rounded p-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-5 w-[150px] bg-gray-300 rounded"></div>
            <div className="h-4 w-[250px] bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="h-8 w-full sm:w-32 bg-gray-300 rounded"></div>
          <div className="h-8 w-full sm:w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
        ))}
      </div>
    </div>
  );

  // Error State
  if (error && !loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-semibold mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="pl-0 sm:pl-6 min-h-screen">
        <div className="max-w-[100%] mx-auto mt-4 px-4">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mt-6 mb-8 bg-gradient-to-r from-[#FF7B1D] to-orange-600 rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                  <div className="relative">
                    <img
                      src={
                        adminProfile?.profilePhoto?.url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          adminProfile?.name || "Admin",
                        )}&background=fff&color=FF7B1D&size=128`
                      }
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          adminProfile?.name || "Admin",
                        )}&background=fff&color=FF7B1D&size=128`;
                      }}
                    />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-white flex flex-wrap items-center gap-2">
                      Welcome Back,{" "}
                      <span className="text-orange-100">
                        {adminProfile?.name || "Admin"}
                      </span>
                      <Edit
                        size={18}
                        className="text-white cursor-pointer hover:text-orange-100 transition-colors"
                        onClick={() => navigate("/profile")}
                      />
                    </h2>
                    <p className="text-sm text-orange-50">
                      You have{" "}
                      <span className="text-white font-bold text-base">
                        {dashboardData?.summary?.newOrders ||
                          stats?.orders?.new ||
                          0}
                      </span>{" "}
                      New Orders &{" "}
                      <span className="text-white font-bold text-base">
                        {dashboardData?.summary?.pendingOrders ||
                          stats?.orders?.pending ||
                          0}
                      </span>{" "}
                      Pending Orders
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white w-full sm:w-auto px-5 py-2.5 rounded-lg shadow-md hover:bg-white/30 transition-all flex items-center justify-center gap-2 font-semibold"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-[#FF7B1D] w-full sm:w-auto px-5 py-2.5 rounded-lg shadow-md hover:bg-orange-50 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <UserPlus size={18} />
                    Add Vendor
                  </button>
                </div>
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Orders Card */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-xl hover:border-[#FF7B1D] transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <ShoppingCart className="text-white" size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                      <ArrowUp size={16} />
                      {stats?.orders.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
                    Total Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-3">
                    {stats?.orders.total.toLocaleString()}
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-blue-600 font-semibold">
                      New: {stats?.orders.new}
                    </span>
                    <span className="text-orange-600 font-semibold">
                      Pending: {stats?.orders.pending}
                    </span>
                  </div>
                </div>

                {/* Vendors Card */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-xl hover:border-purple-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Store className="text-white" size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                      <ArrowUp size={16} />
                      {stats?.vendors.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
                    Total Vendors
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-3">
                    {stats?.vendors.total}
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600 font-semibold">
                      Active: {stats?.vendors.active}
                    </span>
                    <span className="text-gray-600 font-semibold">
                      New: {stats?.vendors.newThisMonth}
                    </span>
                  </div>
                </div>

                {/* Riders Card */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Bike className="text-white" size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                      <ArrowUp size={16} />
                      {stats?.riders.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
                    Total Riders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-3">
                    {stats?.riders.total}
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600 font-semibold">
                      Online: {stats?.riders.active}
                    </span>
                    <span className="text-orange-600 font-semibold">
                      Delivering: {stats?.riders.onDelivery}
                    </span>
                  </div>
                </div>

                {/* Users Card */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-xl hover:border-green-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="text-white" size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                      <ArrowUp size={16} />
                      {stats?.users.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
                    Total Users
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-3">
                    {stats?.users.total.toLocaleString()}
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600 font-semibold">
                      Active: {stats?.users.active.toLocaleString()}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      New: {stats?.users.newThisMonth}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Rider Job Posts Card */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 hover:shadow-xl hover:border-cyan-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <Briefcase className="text-white" size={20} />
                      </div>
                      <h3 className="text-gray-700 font-bold">
                        Rider Jobs
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <ArrowUp size={14} />
                      {stats?.riderJobPosts.growth}%
                    </div>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Total Posts:</span>
                      <span className="font-bold text-gray-900">
                        {stats?.riderJobPosts.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Active:</span>
                      <span className="font-bold text-green-600">
                        {stats?.riderJobPosts.active.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                      <span className="text-gray-600 font-medium">New This Month:</span>
                      <span className="font-bold text-blue-600">
                        {stats?.riderJobPosts.newThisMonth}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inventory Card */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 hover:shadow-xl hover:border-indigo-500 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Package className="text-white" size={20} />
                    </div>
                    <h3 className="text-gray-700 font-bold">Inventory</h3>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Total Products:</span>
                      <span className="font-bold text-gray-900">
                        {stats?.inventory.totalProducts.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-gray-600 font-medium">In Stock:</span>
                      <span className="font-bold text-green-600">
                        {stats?.inventory.inStock.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Low Stock:</span>
                      <span className="font-bold text-orange-600">
                        {stats?.inventory.lowStock}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Out of Stock:</span>
                      <span className="font-bold text-red-600">
                        {stats?.inventory.outOfStock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 hover:shadow-xl hover:border-emerald-500 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <IndianRupee className="text-white" size={20} />
                      </div>
                      <h3 className="text-gray-700 font-bold">Revenue</h3>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <ArrowUp size={14} />
                      {stats?.revenue.growth}%
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Today:</span>
                      <span className="font-bold text-gray-900">
                        ₹{stats?.revenue.today.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                      <span className="text-gray-600 font-medium">This Week:</span>
                      <span className="font-bold text-blue-600">
                        ₹{stats?.revenue.thisWeek.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-gray-600 font-medium">This Month:</span>
                      <span className="font-bold text-green-600">
                        ₹{stats?.revenue.thisMonth.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notifications Card */}
                <div 
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md border-2 border-yellow-200 p-5 hover:shadow-xl hover:border-[#FF7B1D] transition-all duration-300 cursor-pointer"
                  onClick={() => navigate("/topbar-notifications")}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2.5 rounded-xl shadow-lg relative">
                      <Bell className="text-white" size={20} />
                      {stats?.notifications?.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center font-bold px-1.5 animate-pulse">
                          {stats?.notifications.unread}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-gray-800 font-bold">
                        Notifications
                      </h3>
                      <p className="text-xs text-gray-600">Stay updated</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white border-2 border-orange-300 rounded-lg p-3 shadow-sm">
                      <p className="text-base font-bold text-gray-900">
                        {stats?.notifications?.unread || 0} Unread
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {dashboardData?.notifications?.message ||
                          "No new notifications"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/topbar-notifications");
                      }}
                      className="w-full bg-[#FF7B1D] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>

                {/* Tickets Card */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 hover:shadow-xl hover:border-pink-500 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Headphones className="text-white" size={20} />
                    </div>
                    <h3 className="text-gray-700 font-bold">
                      Support Tickets
                    </h3>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Open:</span>
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                        {stats?.tickets.open}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                      <span className="text-gray-600 font-medium">In Progress:</span>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                        {stats?.tickets.inProgress}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Escalated:</span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                        {stats?.tickets.escalated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Resolved:</span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-xs">
                        {stats?.tickets.resolved}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Recent Orders
                      </h3>
                      <p className="text-sm text-gray-500">Latest customer orders</p>
                    </div>
                    <button
                      onClick={() => navigate("/orders/all")}
                      className="text-[#FF7B1D] hover:text-orange-600 text-sm font-semibold flex items-center gap-1 hover:underline"
                    >
                      View All
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                              Order ID
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                              Customer
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                              Amount
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-orange-50 transition-colors">
                              <td className="px-4 py-4 text-sm font-bold text-[#FF7B1D]">
                                {order.id}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-700">
                                {order.customer}
                              </td>
                              <td className="px-4 py-4 text-sm font-bold text-gray-900">
                                ₹{order.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-700"
                                      : order.status === "Pending"
                                        ? "bg-orange-100 text-orange-700"
                                        : order.status === "In Transit"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No recent orders</p>
                    </div>
                  )}
                </div>

                {/* Top Vendors */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Top Vendors
                      </h3>
                      <p className="text-sm text-gray-500">Best performing vendors</p>
                    </div>
                    <button
                      onClick={() => navigate("/vendor/all")}
                      className="text-[#FF7B1D] hover:text-orange-600 text-sm font-semibold flex items-center gap-1 hover:underline"
                    >
                      View All
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  {topVendors.length > 0 ? (
                    <div className="space-y-3">
                      {topVendors.map((vendor) => (
                        <div
                          key={vendor.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-[#FF7B1D] hover:shadow-md transition-all cursor-pointer"
                          onClick={() => navigate(`/vendor/${vendor.id}`)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                              {vendor.rank}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                {vendor.name}
                              </p>
                              <p className="text-xs text-gray-600 font-medium">
                                {vendor.orders} orders
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {vendor.sales > 0 && (
                              <p className="font-bold text-gray-900 text-lg">
                                ₹{vendor.sales.toLocaleString()}
                              </p>
                            )}
                            {vendor.rating > 0 && (
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-yellow-500 text-sm">★</span>
                                <span className="text-xs font-bold text-gray-700">
                                  {vendor.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No vendors data available</p>
                    </div>
                  )}
                </div>
              </div>

            </>
          )}
        </div>
      </div>
      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
