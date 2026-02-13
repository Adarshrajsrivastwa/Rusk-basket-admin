// AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AddVendorModal from "../../components/AddVendorModal";
import NotificationsPage from "../../pages/SuperAdminDashboard/ViewAllNotification";
import VendorDetails from "../../pages/VendorManagement/VendorDetails";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";

import {
  ShoppingCart,
  Store,
  Bike,
  Users,
  Package,
  DollarSign,
  Bell,
  Headphones,
  ArrowUp,
  Edit,
  UserPlus,
  Eye,
  Briefcase,
} from "lucide-react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
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

  // If notifications view is active, show NotificationsPage
  if (showNotifications) {
    return (
      <DashboardLayout>
        <NotificationsPage onBack={() => setShowNotifications(false)} />
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
              <div className="mt-4 bg-white rounded-sm shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                  <img
                    src={
                      adminProfile?.profilePhoto?.url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        adminProfile?.name || "Admin",
                      )}&background=F26422&color=fff&size=128`
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        adminProfile?.name || "Admin",
                      )}&background=F26422&color=fff&size=128`;
                    }}
                  />
                  <div className="flex flex-col gap-1 w-full">
                    <h2 className="text-lg font-semibold flex flex-wrap items-center gap-2">
                      Welcome Back,{" "}
                      <span className="text-gray-700">
                        {adminProfile?.name || "Admin"}
                      </span>
                      <Edit
                        size={16}
                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={() => navigate("/profile")}
                      />
                    </h2>
                    <p className="text-sm text-gray-600">
                      You have{" "}
                      <span className="text-red-500 font-semibold">
                        {dashboardData?.summary?.newOrders ||
                          stats?.orders?.new ||
                          0}
                      </span>{" "}
                      New Orders &{" "}
                      <span className="text-red-500 font-semibold">
                        {dashboardData?.summary?.pendingOrders ||
                          stats?.orders?.pending ||
                          0}
                      </span>{" "}
                      Pending Orders
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-500 text-white w-full sm:w-44 px-3 sm:px-4 py-2 rounded-sm shadow hover:bg-gray-700 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
                  >
                    + Add Vendor
                  </button>
                  {/* <button
                    onClick={() => navigate("/vendor/:id")}
                    className="bg-[#F26422] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-[#d95a1f] transition-colors"
                  >
                    <Eye size={18} /> View
                  </button> */}
                </div>
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {/* Orders Card */}
                <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-[#F26422] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <ShoppingCart className="text-[#F26422]" size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <ArrowUp size={16} />
                      {stats?.orders.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {stats?.orders.total.toLocaleString()}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-blue-600 font-medium">
                      New: {stats?.orders.new}
                    </span>
                    <span className="text-orange-600 font-medium">
                      Pending: {stats?.orders.pending}
                    </span>
                  </div>
                </div>

                {/* Vendors Card */}
                <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Store className="text-purple-600" size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <ArrowUp size={16} />
                      {stats?.vendors.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Vendors
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {stats?.vendors.total}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-medium">
                      Active: {stats?.vendors.active}
                    </span>
                    <span className="text-gray-500 font-medium">
                      New: {stats?.vendors.newThisMonth}
                    </span>
                  </div>
                </div>

                {/* Riders Card */}
                <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Bike className="text-blue-600" size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <ArrowUp size={16} />
                      {stats?.riders.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Riders
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {stats?.riders.total}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-medium">
                      Online: {stats?.riders.active}
                    </span>
                    <span className="text-orange-600 font-medium">
                      Delivering: {stats?.riders.onDelivery}
                    </span>
                  </div>
                </div>

                {/* Users Card */}
                <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Users className="text-green-600" size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <ArrowUp size={16} />
                      {stats?.users.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Users
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {stats?.users.total.toLocaleString()}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-medium">
                      Active: {stats?.users.active.toLocaleString()}
                    </span>
                    <span className="text-blue-600 font-medium">
                      New: {stats?.users.newThisMonth}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {/* Rider Job Posts Card */}
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-2 rounded-lg">
                        <Briefcase className="text-cyan-600" size={20} />
                      </div>
                      <h3 className="text-gray-700 font-semibold">
                        Rider Jobs
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                      <ArrowUp size={14} />
                      {stats?.riderJobPosts.growth}%
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Posts:</span>
                      <span className="font-bold text-gray-800">
                        {stats?.riderJobPosts.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active:</span>
                      <span className="font-semibold text-green-600">
                        {stats?.riderJobPosts.active.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New This Month:</span>
                      <span className="font-semibold text-blue-600">
                        {stats?.riderJobPosts.newThisMonth}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inventory Card */}
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Package className="text-indigo-600" size={20} />
                    </div>
                    <h3 className="text-gray-700 font-semibold">Inventory</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Products:</span>
                      <span className="font-bold text-gray-800">
                        {stats?.inventory.totalProducts.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">In Stock:</span>
                      <span className="font-semibold text-green-600">
                        {stats?.inventory.inStock.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Low Stock:</span>
                      <span className="font-semibold text-orange-600">
                        {stats?.inventory.lowStock}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Out of Stock:</span>
                      <span className="font-semibold text-red-600">
                        {stats?.inventory.outOfStock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <DollarSign className="text-emerald-600" size={20} />
                      </div>
                      <h3 className="text-gray-700 font-semibold">Revenue</h3>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                      <ArrowUp size={14} />
                      {stats?.revenue.growth}%
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Today:</span>
                      <span className="font-bold text-gray-800">
                        ₹{stats?.revenue.today.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Week:</span>
                      <span className="font-semibold text-blue-600">
                        ₹{stats?.revenue.thisWeek.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Month:</span>
                      <span className="font-semibold text-green-600">
                        ₹{stats?.revenue.thisMonth.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notifications Card */}
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-yellow-100 p-2 rounded-lg relative">
                      <Bell className="text-yellow-600" size={20} />
                      {stats?.notifications?.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {stats?.notifications.unread}
                        </span>
                      )}
                    </div>
                    <h3 className="text-gray-700 font-semibold">
                      Notifications
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                      <p className="text-sm font-semibold text-gray-800">
                        {stats?.notifications?.unread || 0} Unread
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {dashboardData?.notifications?.message ||
                          "No new notifications"}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNotifications(true)}
                      className="w-full bg-[#F26422] text-white py-2 rounded-md text-sm font-medium hover:bg-[#d95a1f] transition-colors"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>

                {/* Tickets Card */}
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Headphones className="text-pink-600" size={20} />
                    </div>
                    <h3 className="text-gray-700 font-semibold">
                      Support Tickets
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Open:</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold text-xs">
                        {stats?.tickets.open}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">In Progress:</span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold text-xs">
                        {stats?.tickets.inProgress}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Escalated:</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold text-xs">
                        {stats?.tickets.escalated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Resolved:</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold text-xs">
                        {stats?.tickets.resolved}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 mb-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      Recent Orders
                    </h3>
                    {/* <button
                      onClick={() => navigate("/orders")}
                      className="text-[#F26422] text-sm font-semibold hover:underline"
                    >
                      View All
                    </button> */}
                  </div>
                  {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Order ID
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Customer
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Amount
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-[#F26422]">
                                {order.id}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {order.customer}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                ₹{order.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 text-xs font-bold rounded-full ${
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
                    <div className="text-center py-8 text-gray-500">
                      No recent orders
                    </div>
                  )}
                </div>

                {/* Top Vendors */}
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      Top Vendors
                    </h3>
                    {/* <button
                      onClick={() => navigate("/vendors")}
                      className="text-[#F26422] text-sm font-semibold hover:underline"
                    >
                      View All
                    </button> */}
                  </div>
                  {topVendors.length > 0 ? (
                    <div className="space-y-3">
                      {topVendors.map((vendor) => (
                        <div
                          key={vendor.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => navigate(`/vendor/${vendor.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-[#F26422] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                              {vendor.rank}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {vendor.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {vendor.orders} orders
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {vendor.sales > 0 && (
                              <p className="font-bold text-gray-800">
                                ₹{vendor.sales.toLocaleString()}
                              </p>
                            )}
                            {vendor.rating > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-xs font-semibold text-gray-600">
                                  {vendor.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No vendors data available
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
