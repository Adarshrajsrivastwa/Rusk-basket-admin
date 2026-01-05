// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AddVendorModal from "../../components/AddVendorModal";
import NotificationsPage from "../../pages/SuperAdminDashboard/ViewAllNotification";
import VendorDetails from "../../pages/VendorManagement/VendorDetails";
import { useNavigate } from "react-router-dom";

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
} from "lucide-react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();

  // Dashboard Stats Data
  const stats = {
    orders: {
      total: 1245,
      new: 21,
      pending: 14,
      delivered: 1180,
      cancelled: 30,
      growth: 12.5,
    },
    vendors: {
      total: 156,
      active: 142,
      inactive: 14,
      newThisMonth: 8,
      growth: 5.2,
    },
    riders: {
      total: 89,
      active: 76,
      offline: 13,
      onDelivery: 45,
      growth: 8.7,
    },
    users: {
      total: 5420,
      active: 4890,
      newThisMonth: 234,
      growth: 15.3,
    },
    inventory: {
      totalProducts: 3456,
      inStock: 3120,
      lowStock: 256,
      outOfStock: 80,
    },
    revenue: {
      today: 45678,
      thisWeek: 234567,
      thisMonth: 987654,
      growth: 18.9,
    },
    notifications: {
      unread: 15,
      total: 48,
    },
    tickets: {
      open: 23,
      inProgress: 12,
      resolved: 156,
      escalated: 5,
    },
  };

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      amount: 1250,
      status: "Delivered",
      date: "2025-10-22",
    },
    {
      id: "ORD-002",
      customer: "Sarah Wilson",
      amount: 890,
      status: "Pending",
      date: "2025-10-22",
    },
    {
      id: "ORD-003",
      customer: "Mike Brown",
      amount: 2340,
      status: "In Transit",
      date: "2025-10-21",
    },
    {
      id: "ORD-004",
      customer: "Emily Davis",
      amount: 560,
      status: "Processing",
      date: "2025-10-21",
    },
  ];

  const topVendors = [
    { id: 1, name: "TechStore", sales: 45678, orders: 234, rating: 4.8 },
    { id: 2, name: "Fashion Hub", sales: 38920, orders: 189, rating: 4.6 },
    { id: 3, name: "ElectroMart", sales: 32450, orders: 156, rating: 4.7 },
    { id: 4, name: "BookWorld", sales: 28900, orders: 145, rating: 4.5 },
  ];

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
    </div>
  );

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
                    src="https://i.pravatar.cc/50"
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col gap-1 w-full">
                    <h2 className="text-lg font-semibold flex flex-wrap items-center gap-2">
                      Welcome Back,{" "}
                      <span className="text-gray-700">NK Yadav</span>
                      <Edit
                        size={16}
                        className="text-gray-500 cursor-pointer"
                      />
                    </h2>
                    <p className="text-sm text-gray-600">
                      You have{" "}
                      <span className="text-red-500 font-semibold">
                        {stats.orders.new}
                      </span>{" "}
                      New Orders &{" "}
                      <span className="text-red-500 font-semibold">
                        {stats.orders.pending}
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
                  <button
                    onClick={() => navigate("/vendor/:id")}
                    className="bg-[#F26422] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-[#d95a1f] transition-colors"
                  >
                    <Eye size={18} /> View
                  </button>
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
                      {stats.orders.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {stats.orders.total.toLocaleString()}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-blue-600 font-medium">
                      New: {stats.orders.new}
                    </span>
                    <span className="text-orange-600 font-medium">
                      Pending: {stats.orders.pending}
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
                      {stats.vendors.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Vendors
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {stats.vendors.total}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-medium">
                      Active: {stats.vendors.active}
                    </span>
                    <span className="text-gray-500 font-medium">
                      New: {stats.vendors.newThisMonth}
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
                      {stats.riders.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Riders
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {stats.riders.total}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-medium">
                      Online: {stats.riders.active}
                    </span>
                    <span className="text-orange-600 font-medium">
                      Delivering: {stats.riders.onDelivery}
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
                      {stats.users.growth}%
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    Total Users
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {stats.users.total.toLocaleString()}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-medium">
                      Active: {stats.users.active.toLocaleString()}
                    </span>
                    <span className="text-blue-600 font-medium">
                      New: {stats.users.newThisMonth}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
                        {stats.inventory.totalProducts.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">In Stock:</span>
                      <span className="font-semibold text-green-600">
                        {stats.inventory.inStock.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Low Stock:</span>
                      <span className="font-semibold text-orange-600">
                        {stats.inventory.lowStock}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Out of Stock:</span>
                      <span className="font-semibold text-red-600">
                        {stats.inventory.outOfStock}
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
                      {stats.revenue.growth}%
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Today:</span>
                      <span className="font-bold text-gray-800">
                        ₹{stats.revenue.today.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Week:</span>
                      <span className="font-semibold text-blue-600">
                        ₹{stats.revenue.thisWeek.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Month:</span>
                      <span className="font-semibold text-green-600">
                        ₹{stats.revenue.thisMonth.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notifications Card */}
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-yellow-100 p-2 rounded-lg relative">
                      <Bell className="text-yellow-600" size={20} />
                      {stats.notifications.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {stats.notifications.unread}
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
                        {stats.notifications.unread} Unread
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        You have pending notifications
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
                        {stats.tickets.open}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">In Progress:</span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold text-xs">
                        {stats.tickets.inProgress}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Escalated:</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold text-xs">
                        {stats.tickets.escalated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Resolved:</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold text-xs">
                        {stats.tickets.resolved}
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
                    <button
                      onClick={() => navigate("/orders")}
                      className="text-[#F26422] text-sm font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
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
                </div>

                {/* Top Vendors */}
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      Top Vendors
                    </h3>
                    <button
                      onClick={() => navigate("/vendors")}
                      className="text-[#F26422] text-sm font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {topVendors.map((vendor, index) => (
                      <div
                        key={vendor.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/vendor/${vendor.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-[#F26422] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
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
                          <p className="font-bold text-gray-800">
                            ₹{vendor.sales.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-xs font-semibold text-gray-600">
                              {vendor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
