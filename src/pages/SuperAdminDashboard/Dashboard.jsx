// AdminDashboard.jsx — redesigned to match AllProduct design system
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AddVendorModal from "../../components/AddVendorModal";
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
  ArrowUp,
  ArrowUpRight,
  Edit,
  UserPlus,
  Briefcase,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Shared micro-components (mirrors AllProduct)
───────────────────────────────────────────── */

/** Tiny coloured dot badge — same as AllProduct's StatusBadge */
const StatBadge = ({ label, color = "orange" }) => {
  const palette = {
    orange: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
    red: "bg-red-50 text-red-700 border-red-200 ring-red-100",
    purple: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100",
  };
  const dot = {
    orange: "bg-amber-500",
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${palette[color]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[color]}`} />
      {label}
    </span>
  );
};

/** Order status badge — same pattern as AllProduct StatusBadge */
const OrderStatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const map = {
    delivered: { color: "green", label: "Delivered" },
    pending: { color: "orange", label: "Pending" },
    "in transit": { color: "blue", label: "In Transit" },
    cancelled: { color: "red", label: "Cancelled" },
  };
  const cfg = map[s] || { color: "blue", label: status };
  return <StatBadge label={cfg.label} color={cfg.color} />;
};

/** Growth chip — mirrors AllProduct's action-btn style */
const GrowthChip = ({ value = 0 }) => (
  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
    <ArrowUp size={13} />
    {value}%
  </div>
);

/* ─────────────────────────────────────────────
   Skeleton rows — mirrors AllProduct TableSkeleton
───────────────────────────────────────────── */
const SkeletonRows = ({ cols = 4, rows = 3 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="border-b border-gray-100">
        {Array.from({ length: cols }).map((__, j) => (
          <td key={j} className="px-4 py-3.5">
            <div
              className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${
                j === 0 ? "w-8" : j === 1 ? "w-28" : "w-[60%]"
              }`}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

/* ─────────────────────────────────────────────
   Metric card — new compact version matching
   AllProduct's table-card style
───────────────────────────────────────────── */
const MetricCard = ({
  icon: Icon,
  label,
  value,
  growth,
  rows = [],
  accentColor = "#FF7B1D",
  borderHover = "hover:border-[#FF7B1D]",
}) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${borderHover} hover:shadow-md transition-all duration-200 group`}
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className="p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform"
          style={{ background: accentColor }}
        >
          <Icon className="text-white" size={18} />
        </div>
        <span className="text-sm font-bold text-gray-700">{label}</span>
      </div>
      {growth !== undefined && <GrowthChip value={growth} />}
    </div>

    {/* Big number */}
    {value !== undefined && (
      <p className="text-3xl font-bold text-gray-900 mb-4 tabular-nums">
        {value}
      </p>
    )}

    {/* Sub-rows — same look as AllProduct inventory rows */}
    <div className="space-y-2">
      {rows.map(
        ({
          label: rl,
          value: rv,
          bg = "bg-gray-50",
          text = "text-gray-900",
        }) => (
          <div
            key={rl}
            className={`flex justify-between items-center px-3 py-2 ${bg} rounded-xl`}
          >
            <span className="text-xs text-gray-500 font-medium">{rl}</span>
            <span className={`text-xs font-bold ${text}`}>{rv}</span>
          </div>
        ),
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Full page skeleton — mirrors AllProduct
───────────────────────────────────────────── */
const PageSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-4 w-full">
    {/* Welcome bar */}
    <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl" />
    {/* Cards row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-gray-100 rounded-2xl h-36 border border-gray-200"
        />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-gray-100 rounded-2xl h-40 border border-gray-200"
        />
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Main Component
═══════════════════════════════════════════ */
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  /* fetch admin profile */
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const res = await fetch(`${BASE_URL}/api/admin/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const result = await res.json();
          if (result.success) setAdminProfile(result.data);
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };
    fetchAdminProfile();
  }, []);

  /* fetch dashboard data */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const res = await fetch(
          `${BASE_URL}/api/analytics/admin/dashboard/overview`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (result.success) setDashboardData(result.data);
        else throw new Error("API returned unsuccessful response");
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDashboard();
  }, []);

  /* memoised stats */
  const stats = useMemo(() => {
    if (!dashboardData) return null;
    const m = dashboardData.metrics;
    return {
      orders: {
        total: m.totalOrders.total,
        new: m.totalOrders.new,
        pending: m.totalOrders.pending,
        delivered: m.totalOrders.total - m.totalOrders.pending,
        growth: m.totalOrders.increasePercent,
      },
      vendors: {
        total: m.totalVendors.total,
        active: m.totalVendors.active,
        inactive: m.totalVendors.total - m.totalVendors.active,
        newThisMonth: m.totalVendors.new,
        growth: m.totalVendors.increasePercent,
      },
      riders: {
        total: m.totalRiders.total,
        active: m.totalRiders.online,
        offline: m.totalRiders.total - m.totalRiders.online,
        onDelivery: m.totalRiders.delivering,
        growth: m.totalRiders.increasePercent,
      },
      users: {
        total: m.totalUsers.total,
        active: m.totalUsers.active,
        newThisMonth: m.totalUsers.new,
        growth: m.totalUsers.increasePercent,
      },
      riderJobPosts: {
        total: m.riderJobPosts?.total || 0,
        active: m.riderJobPosts?.active || 0,
        newThisMonth: m.riderJobPosts?.new || 0,
        growth: m.riderJobPosts?.increasePercent || 0,
      },
      inventory: dashboardData.inventory,
      revenue: {
        today: dashboardData.revenue.today,
        thisWeek: dashboardData.revenue.thisWeek,
        thisMonth: dashboardData.revenue.thisMonth,
        growth: dashboardData.revenue.increasePercent,
      },
      notifications: {
        unread: dashboardData.notifications?.unread || 0,
        message: dashboardData.notifications?.message || "No new notifications",
      },
      tickets: dashboardData.supportTickets,
    };
  }, [dashboardData]);

  const recentOrders = useMemo(
    () =>
      (dashboardData?.recentOrders || []).slice(0, 10).map((o) => ({
        id: o.orderId,
        customer: o.customer,
        amount: o.amount,
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
      })),
    [dashboardData?.recentOrders],
  );

  const topVendors = useMemo(
    () =>
      (dashboardData?.topVendors || []).slice(0, 10).map((v) => ({
        id: v.vendorId,
        name: v.vendorName || v.storeName,
        orders: v.orders,
        rank: v.rank,
      })),
    [dashboardData?.topVendors],
  );

  /* paginated orders */
  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ordersPerPage;
    return recentOrders.slice(start, start + ordersPerPage);
  }, [recentOrders, ordersPage]);

  const ordersTotalPages = Math.ceil(recentOrders.length / ordersPerPage);

  /* ── Error state ── */
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-sm shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-7 h-7 text-red-300" />
            </div>
            <h3 className="text-gray-800 font-bold mb-1">
              Error Loading Dashboard
            </h3>
            <p className="text-sm text-gray-400 mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FF7B1D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all shadow-sm shadow-orange-200"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ══════════════════════════════
     RENDER
  ══════════════════════════════ */
  return (
    <DashboardLayout>
      {/* Global animations — same as AllProduct */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .card-animate { animation: fadeSlideIn 0.3s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div className="pl-0 sm:pl-6 min-h-screen">
        <div className="max-w-[100%] mx-auto mt-2 px-0">
          {loading ? (
            <PageSkeleton />
          ) : (
            <>
              {/* ── Welcome Banner ── */}
              <div className="mb-6 bg-gradient-to-r from-[#FF7B1D] to-orange-500 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card-animate">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={
                        adminProfile?.profilePhoto?.url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          adminProfile?.name || "Admin",
                        )}&background=fff&color=FF7B1D&size=128`
                      }
                      alt="Profile"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white/80 shadow-md"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          adminProfile?.name || "Admin",
                        )}&background=fff&color=FF7B1D&size=128`;
                      }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-white">
                        Welcome back,{" "}
                        <span className="text-orange-100">
                          {adminProfile?.name || "Admin"}
                        </span>
                      </h2>
                      <Edit
                        size={15}
                        className="text-white/70 cursor-pointer hover:text-white transition-colors"
                        onClick={() => navigate("/profile")}
                      />
                    </div>
                    <p className="text-xs text-orange-100">
                      <span className="text-white font-bold">
                        {dashboardData?.summary?.newOrders ||
                          stats?.orders?.new ||
                          0}
                      </span>{" "}
                      new orders &nbsp;·&nbsp;
                      <span className="text-white font-bold">
                        {dashboardData?.summary?.pendingOrders ||
                          stats?.orders?.pending ||
                          0}
                      </span>{" "}
                      pending
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-all"
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#FF7B1D] text-sm font-bold hover:bg-orange-50 transition-all shadow-sm"
                  >
                    <UserPlus size={15} /> Add Vendor
                  </button>
                </div>
              </div>

              {/* ── Primary Stats Row ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Orders */}
                <div
                  className="card-animate bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#FF7B1D] hover:shadow-md transition-all group"
                  style={{ animationDelay: "30ms" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FF7B1D] to-orange-500 shadow-sm group-hover:scale-110 transition-transform">
                        <ShoppingCart className="text-white" size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        Orders
                      </span>
                    </div>
                    <GrowthChip value={stats?.orders.growth ?? 0} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-4 tabular-nums">
                    {stats?.orders.total.toLocaleString() ?? "—"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between px-3 py-2 bg-blue-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        New
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        {stats?.orders.new ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-amber-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        Pending
                      </span>
                      <span className="text-xs font-bold text-amber-600">
                        {stats?.orders.pending ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-emerald-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        Delivered
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {stats?.orders.delivered ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vendors */}
                <div
                  className="card-animate bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-purple-400 hover:shadow-md transition-all group"
                  style={{ animationDelay: "60ms" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Store className="text-white" size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        Vendors
                      </span>
                    </div>
                    <GrowthChip value={stats?.vendors.growth ?? 0} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-4 tabular-nums">
                    {stats?.vendors.total ?? "—"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between px-3 py-2 bg-emerald-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        Active
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {stats?.vendors.active ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-gray-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        Inactive
                      </span>
                      <span className="text-xs font-bold text-gray-600">
                        {stats?.vendors.inactive ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-purple-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        New this month
                      </span>
                      <span className="text-xs font-bold text-purple-600">
                        {stats?.vendors.newThisMonth ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Riders */}
                <div
                  className="card-animate bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-blue-400 hover:shadow-md transition-all group"
                  style={{ animationDelay: "90ms" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Bike className="text-white" size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        Riders
                      </span>
                    </div>
                    <GrowthChip value={stats?.riders.growth ?? 0} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-4 tabular-nums">
                    {stats?.riders.total ?? "—"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between px-3 py-2 bg-emerald-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        Online
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {stats?.riders.active ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-amber-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        Delivering
                      </span>
                      <span className="text-xs font-bold text-amber-600">
                        {stats?.riders.onDelivery ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-gray-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        Offline
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {stats?.riders.offline ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Users */}
                <div
                  className="card-animate bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-emerald-400 hover:shadow-md transition-all group"
                  style={{ animationDelay: "120ms" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Users className="text-white" size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        Users
                      </span>
                    </div>
                    <GrowthChip value={stats?.users.growth ?? 0} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-4 tabular-nums">
                    {stats?.users.total.toLocaleString() ?? "—"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between px-3 py-2 bg-emerald-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        Active
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {stats?.users.active.toLocaleString() ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-blue-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium">
                        New this month
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        {stats?.users.newThisMonth ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Secondary Stats Row ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Rider Job Posts */}
                <MetricCard
                  icon={Briefcase}
                  label="Rider Jobs"
                  accentColor="linear-gradient(135deg,#06b6d4,#0891b2)"
                  borderHover="hover:border-cyan-400"
                  growth={stats?.riderJobPosts.growth ?? 0}
                  rows={[
                    {
                      label: "Total Posts",
                      value: (stats?.riderJobPosts.total ?? 0).toLocaleString(),
                      bg: "bg-gray-50",
                    },
                    {
                      label: "Active",
                      value: (
                        stats?.riderJobPosts.active ?? 0
                      ).toLocaleString(),
                      bg: "bg-emerald-50",
                      text: "text-emerald-600",
                    },
                    {
                      label: "New this month",
                      value: stats?.riderJobPosts.newThisMonth ?? 0,
                      bg: "bg-blue-50",
                      text: "text-blue-600",
                    },
                  ]}
                />

                {/* Inventory */}
                <MetricCard
                  icon={Package}
                  label="Inventory"
                  accentColor="linear-gradient(135deg,#6366f1,#4f46e5)"
                  borderHover="hover:border-indigo-400"
                  rows={[
                    {
                      label: "Total Products",
                      value: (
                        stats?.inventory.totalProducts ?? 0
                      ).toLocaleString(),
                      bg: "bg-gray-50",
                    },
                    {
                      label: "In Stock",
                      value: (stats?.inventory.inStock ?? 0).toLocaleString(),
                      bg: "bg-emerald-50",
                      text: "text-emerald-600",
                    },
                    {
                      label: "Low Stock",
                      value: stats?.inventory.lowStock ?? 0,
                      bg: "bg-amber-50",
                      text: "text-amber-600",
                    },
                    {
                      label: "Out of Stock",
                      value: stats?.inventory.outOfStock ?? 0,
                      bg: "bg-red-50",
                      text: "text-red-500",
                    },
                  ]}
                />

                {/* Revenue */}
                <MetricCard
                  icon={IndianRupee}
                  label="Revenue"
                  accentColor="linear-gradient(135deg,#10b981,#059669)"
                  borderHover="hover:border-emerald-400"
                  growth={stats?.revenue.growth ?? 0}
                  rows={[
                    {
                      label: "Today",
                      value: `₹${(stats?.revenue.today ?? 0).toLocaleString()}`,
                      bg: "bg-gray-50",
                    },
                    {
                      label: "This Week",
                      value: `₹${(stats?.revenue.thisWeek ?? 0).toLocaleString()}`,
                      bg: "bg-blue-50",
                      text: "text-blue-600",
                    },
                    {
                      label: "This Month",
                      value: `₹${(stats?.revenue.thisMonth ?? 0).toLocaleString()}`,
                      bg: "bg-emerald-50",
                      text: "text-emerald-600",
                    },
                  ]}
                />

                {/* Notifications */}
                <div
                  className="card-animate bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#FF7B1D] hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate("/topbar-notifications")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-sm group-hover:scale-110 transition-transform">
                        <Bell className="text-white" size={18} />
                        {(stats?.notifications?.unread ?? 0) > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                            {stats.notifications.unread}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        Notifications
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                      <span className="text-xs text-gray-500 font-medium">
                        Unread
                      </span>
                      <span className="text-xs font-bold text-amber-600">
                        {stats?.notifications?.unread || 0}
                      </span>
                    </div>
                    <div className="px-3 py-2 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400 truncate">
                        {stats?.notifications?.message ||
                          "No new notifications"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/topbar-notifications");
                    }}
                    className="w-full bg-[#FF7B1D] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shadow-sm shadow-orange-200"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>

              {/* ── Recent Activity ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Recent Orders table — mirrors AllProduct table card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card header — same gradient as AllProduct thead */}
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                      <span className="text-sm font-semibold text-gray-700">
                        Recent Orders
                      </span>
                    </div>
                    <button
                      onClick={() => navigate("/orders/all")}
                      className="text-[#FF7B1D] hover:text-orange-600 text-xs font-semibold flex items-center gap-1 hover:underline"
                    >
                      View All <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                          {["Order ID", "Customer", "Amount", "Status"].map(
                            (h) => (
                              <th
                                key={h}
                                className="px-4 py-3 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90"
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>

                      {!stats ? (
                        <tbody>
                          <SkeletonRows cols={4} rows={5} />
                        </tbody>
                      ) : paginatedOrders.length === 0 ? (
                        <tbody>
                          <tr>
                            <td colSpan={4} className="py-16 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                                  <ShoppingCart className="w-7 h-7 text-orange-300" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">
                                  No recent orders
                                </p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {paginatedOrders.map((order, idx) => (
                            <tr
                              key={order.id}
                              className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors group"
                              style={{ animationDelay: `${idx * 30}ms` }}
                            >
                              <td className="px-4 py-3.5">
                                <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                                  {String(order.id).slice(0, 10)}…
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-sm text-gray-700">
                                {order.customer}
                              </td>
                              <td className="px-4 py-3.5 text-sm font-bold text-gray-900">
                                ₹{order.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3.5">
                                <OrderStatusBadge status={order.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>

                  {/* Mini pagination — same style as AllProduct */}
                  {recentOrders.length > ordersPerPage && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 bg-gray-50/60">
                      <p className="text-xs text-gray-400">
                        Page{" "}
                        <span className="text-gray-600 font-semibold">
                          {ordersPage}
                        </span>{" "}
                        of{" "}
                        <span className="text-gray-600 font-semibold">
                          {ordersTotalPages}
                        </span>
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() =>
                            setOrdersPage((p) => Math.max(p - 1, 1))
                          }
                          disabled={ordersPage === 1}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          <ChevronLeft size={13} /> Prev
                        </button>
                        <button
                          onClick={() =>
                            setOrdersPage((p) =>
                              Math.min(p + 1, ordersTotalPages),
                            )
                          }
                          disabled={ordersPage === ordersTotalPages}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          Next <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Vendors table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Top Vendors
                      </span>
                    </div>
                    <button
                      onClick={() => navigate("/vendor/all")}
                      className="text-[#FF7B1D] hover:text-orange-600 text-xs font-semibold flex items-center gap-1 hover:underline"
                    >
                      View All <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-500 to-purple-400">
                          {["Rank", "Vendor", "Orders", ""].map((h, i) => (
                            <th
                              key={i}
                              className={`px-4 py-3 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 3 ? "text-right pr-5" : "text-left"}`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {!stats ? (
                        <tbody>
                          <SkeletonRows cols={4} rows={5} />
                        </tbody>
                      ) : topVendors.length === 0 ? (
                        <tbody>
                          <tr>
                            <td colSpan={4} className="py-16 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                                  <Store className="w-7 h-7 text-purple-300" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">
                                  No vendor data
                                </p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {topVendors.map((vendor, idx) => (
                            <tr
                              key={vendor.id}
                              className="row-animate border-b border-gray-50 hover:bg-purple-50/30 transition-colors cursor-pointer group"
                              style={{ animationDelay: `${idx * 30}ms` }}
                              onClick={() => navigate(`/vendor/${vendor.id}`)}
                            >
                              <td className="px-4 py-3.5">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#FF7B1D] to-orange-400 text-white text-xs font-bold shadow-sm">
                                  {vendor.rank}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-sm font-semibold text-gray-800">
                                {vendor.name}
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                                  {vendor.orders} orders
                                </span>
                              </td>
                              <td className="px-4 py-3.5 pr-5 text-right">
                                <button className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 ml-auto">
                                  <TrendingUp size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
