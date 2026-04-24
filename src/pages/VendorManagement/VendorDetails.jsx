import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import api from "../../api/api";
import {
  TrendingUp,
  TrendingDown,
  X,
  ZoomIn,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart,
  Truck,
  Star,
  Wallet,
  Tag,
  BarChart2,
  Users,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  Building2,
  ShieldCheck,
} from "lucide-react";

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({ image, title, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,20,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ animation: "fadeSlideIn 0.25s ease forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#FF7B1D] to-orange-400">
          <span className="text-white font-bold tracking-wide">{title}</span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div
          className="flex items-center justify-center bg-gray-950 p-6"
          style={{ minHeight: 320, maxHeight: "72vh" }}
        >
          <img
            src={image}
            alt={title}
            className="max-w-full object-contain rounded-lg"
            style={{ maxHeight: "64vh" }}
          />
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Press ESC or click outside to close
          </span>
          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FF7B1D] hover:text-orange-600"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Full Size
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Clickable Image ─────────────────────────────────────────────────────────
const ClickableImage = ({ src, alt, label, onView, className }) => (
  <div
    className="group relative cursor-pointer"
    onClick={() => onView(src, label || alt)}
  >
    <img src={src} alt={alt} className={className} />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center rounded-lg">
      <div className="opacity-0 group-hover:opacity-100 transition-all bg-white rounded-full p-2.5 shadow-xl">
        <ZoomIn className="w-5 h-5 text-[#FF7B1D]" />
      </div>
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({
  icon: Icon,
  title,
  color = "from-[#FF7B1D] to-orange-400",
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div
      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}
    >
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <span className="text-sm font-semibold text-gray-700">{title}</span>
  </div>
);

// ─── Info Row (matches AllProduct's mono badge style) ────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors mb-1.5">
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">
      {label}
    </span>
    <span className="text-xs font-bold text-gray-800 text-right ml-2 break-all">
      {value || "N/A"}
    </span>
  </div>
);

// ─── Stat Card (matches AllProduct action-btn style) ─────────────────────────
const StatCard = ({ title, value, icon: Icon, gradient, trend }) => {
  const isNegative = trend?.startsWith("-");
  return (
    <div className="bg-white rounded-xl p-3.5 border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-start justify-between mb-2.5">
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
            isNegative
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {trend}
        </span>
      </div>
      <p className="text-lg font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-0.5">
        {title}
      </p>
    </div>
  );
};

// ─── Status Badge (identical to AllProduct) ──────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  const styles = {
    active:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
    delivered:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
    completed:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
    pending:
      "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
    cancelled:
      "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
    rejected:
      "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
  };
  const dots = {
    active: "bg-emerald-500",
    delivered: "bg-emerald-500",
    completed: "bg-emerald-500",
    pending: "bg-amber-500",
    cancelled: "bg-red-500",
    rejected: "bg-red-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[s] || "bg-gray-100 text-gray-600 border border-gray-200"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[s] || "bg-gray-400"}`}
      />
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
};

// ─── Table Skeleton (matches AllProduct) ─────────────────────────────────────
const TableSkeleton = ({ cols = 6, rows = 8 }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, idx) => (
      <tr key={idx} className="border-b border-gray-100">
        {Array.from({ length: cols }).map((__, j) => (
          <td key={j} className="px-4 py-3.5">
            <div
              className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 0 ? "w-10" : "w-[70%]"}`}
            />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

// ─── Empty State (matches AllProduct) ────────────────────────────────────────
const EmptyState = ({
  icon: Icon = Package,
  label = "No data found",
  cols = 6,
}) => (
  <tbody>
    <tr>
      <td colSpan={cols} className="py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Icon className="w-8 h-8 text-orange-300" />
          </div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-gray-300 text-xs">Try adjusting your filters</p>
        </div>
      </td>
    </tr>
  </tbody>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPagination, setOrdersPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [ordersPage, setOrdersPage] = useState(1);
  const [orderSearch, setOrderSearch] = useState("");

  const openLightbox = useCallback((src, title) => {
    if (src) setLightbox({ src, title });
  }, []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const fetchVendorOrders = async (page = 1) => {
    if (!id) return;
    try {
      setOrdersLoading(true);
      const response = await api.get(`/api/admin/vendors/${id}/orders`, {
        params: { page, limit: 20 },
      });
      if (response.data?.success) {
        setOrders(response.data.data || []);
        setOrdersPagination(
          response.data.pagination || {
            page,
            limit: 20,
            total: response.data.count || 0,
            pages: Math.ceil((response.data.count || 0) / 20),
          },
        );
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders" && id) fetchVendorOrders(ordersPage);
  }, [activeTab, id, ordersPage]);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        try {
          response = await api.get(`/api/vendor/${id}`);
        } catch (e) {
          if (e.response?.status === 404) {
            response = await api.get(`/vendor/${id}`);
          } else throw e;
        }
        const result = response.data;
        if (result?.success) {
          let dataToUse = result.data || (result.vendor ? result : null);
          if (!dataToUse) {
            setError("No data received from API");
            return;
          }
          setDashboardData(dataToUse);
          let vendorData = {};
          if (dataToUse.vendor && Object.keys(dataToUse.vendor).length > 0)
            vendorData = dataToUse.vendor;
          else if (dataToUse.id || dataToUse.vendorName || dataToUse.storeId)
            vendorData = dataToUse;
          else if (result.vendor && Object.keys(result.vendor).length > 0)
            vendorData = result.vendor;
          else if (result.id || result.vendorName || result.storeId)
            vendorData = result;
          setVendor(vendorData);
        } else {
          setError(result?.message || "Failed to fetch vendor data");
        }
      } catch (err) {
        if (err.response?.status === 404) setError("Vendor not found.");
        else if (err.response?.status === 401)
          setError("Unauthorized. Please log in again.");
        else if (err.response?.status === 403) setError("Access denied.");
        else
          setError(
            err.response?.data?.message ||
              err.message ||
              "Error fetching vendor data.",
          );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVendorData();
    else {
      setError("No vendor ID provided");
      setLoading(false);
    }
  }, [id]);

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) =>
    `₹${parseFloat(price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <div className="w-14 h-14 border-4 border-orange-200 border-t-[#FF7B1D] rounded-full animate-spin" />
          <p className="text-gray-400 font-medium text-sm">
            Loading vendor details...
          </p>
        </div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Package className="w-8 h-8 text-orange-300" />
          </div>
          <p className="text-gray-700 font-semibold text-sm">{error}</p>
          <p className="text-xs text-gray-400">Vendor ID: {id}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all"
          >
            ← Go Back
          </button>
        </div>
      </DashboardLayout>
    );

  // ── Data extraction ───────────────────────────────────────────────────────
  const vendorData = dashboardData?.vendor || vendor || {};
  const storeInfo = dashboardData?.storeInfo || {};
  const storeDetails = dashboardData?.storeDetails || {};
  const storeAddress = dashboardData?.storeAddress || {};
  const orderOverview = dashboardData?.orderOverview || {};
  const metrics = dashboardData?.metrics || {};
  const partners = dashboardData?.deliveryPartners || [];

  const getVal = (obj) => {
    if (!obj) return 0;
    if (typeof obj === "number") return obj;
    if (typeof obj === "object")
      return obj.percentage ?? obj.count ?? obj.value ?? 0;
    return 0;
  };

  const getCount = (obj) => {
    if (!obj) return 0;
    if (typeof obj === "object" && obj.count !== undefined) return obj.count;
    return 0;
  };

  const chartData = [
    {
      name: "Completed",
      value: getVal(orderOverview?.statusDistribution?.completed) || 40,
      count: getCount(orderOverview?.statusDistribution?.completed),
      color: "#1e3a5f",
    },
    {
      name: "In Progress",
      value: getVal(orderOverview?.statusDistribution?.in_progress) || 25,
      count: getCount(orderOverview?.statusDistribution?.in_progress),
      color: "#16A34A",
    },
    {
      name: "Pending",
      value: getVal(orderOverview?.statusDistribution?.pending) || 20,
      count: getCount(orderOverview?.statusDistribution?.pending),
      color: "#F59E0B",
    },
    {
      name: "Cancelled",
      value: getVal(orderOverview?.statusDistribution?.cancelled) || 15,
      count: getCount(orderOverview?.statusDistribution?.cancelled),
      color: "#EF4444",
    },
  ];

  const totalOrders = (() => {
    const t = orderOverview?.totalOrders || metrics.totalOrder || 0;
    if (typeof t === "number") return t;
    if (typeof t === "object") return t.count || t.value || 0;
    return 0;
  })();

  const statCards = [
    {
      title: "Category Use",
      value: metrics.categoryUse || 0,
      icon: Tag,
      gradient: "from-violet-500 to-purple-600",
      trend: "+19%",
    },
    {
      title: "Sub Category",
      value: metrics.subCategoryUse || 0,
      icon: BarChart2,
      gradient: "from-emerald-500 to-green-600",
      trend: "+12%",
    },
    {
      title: "Total Products",
      value: metrics.totalProducts || 0,
      icon: Package,
      gradient: "from-blue-500 to-indigo-600",
      trend: "+8%",
    },
    {
      title: "Published",
      value: metrics.productPublished || 0,
      icon: ShieldCheck,
      gradient: "from-cyan-500 to-teal-600",
      trend: "+5%",
    },
    {
      title: "In Review",
      value: metrics.productInReview || 0,
      icon: Clock,
      gradient: "from-amber-500 to-yellow-600",
      trend: "+3%",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrder || 0,
      icon: ShoppingCart,
      gradient: "from-[#FF7B1D] to-orange-600",
      trend: "+19%",
    },
    {
      title: "Delivered",
      value: metrics.totalDeliveredOrder || 0,
      icon: Truck,
      gradient: "from-lime-500 to-green-600",
      trend: "+22%",
    },
    {
      title: "Cancelled",
      value: metrics.totalCanceledOrder || 0,
      icon: X,
      gradient: "from-red-500 to-rose-600",
      trend: "-4%",
    },
    {
      title: "Riders",
      value: metrics.totalRiders || 0,
      icon: Users,
      gradient: "from-sky-500 to-blue-600",
      trend: "+11%",
    },
    {
      title: "Ratings",
      value: metrics.ratings || 0,
      icon: Star,
      gradient: "from-yellow-400 to-amber-500",
      trend: "+0.2",
    },
    {
      title: "Inventory",
      value: metrics.inventory || 0,
      icon: Building2,
      gradient: "from-pink-500 to-rose-500",
      trend: "+7%",
    },
    {
      title: "Revenue",
      value: metrics.amount
        ? `₹${parseFloat(metrics.amount).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`
        : "₹0",
      icon: Wallet,
      gradient: "from-[#FF7B1D] to-red-500",
      trend: "+14%",
    },
  ];

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "orders", label: "Orders" },
    { key: "docs", label: "Documents" },
    { key: "partners", label: "Partners" },
  ];

  const filteredOrders = orders.filter((o) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      (o.orderNumber || "").toLowerCase().includes(q) ||
      (o.user?.userName || "").toLowerCase().includes(q) ||
      (o.status || "").toLowerCase().includes(q)
    );
  });

  // Map embed
  const lat =
    storeDetails.latitude ||
    vendorData.storeAddress?.latitude ||
    vendorData.latitude;
  const lng =
    storeDetails.longitude ||
    vendorData.storeAddress?.longitude ||
    vendorData.longitude;
  const hasCoords = lat && lng;
  const city = storeAddress.city || vendorData.storeAddress?.city || "";
  const state = storeAddress.state || vendorData.storeAddress?.state || "";
  const storeName = storeInfo.storeName || vendorData.vendorName || "Store";
  const mapQuery = hasCoords
    ? `${lat},${lng}`
    : encodeURIComponent([storeName, city, state].filter(Boolean).join(", "));
  const embedUrl = hasCoords
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed&t=m`
    : `https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed&t=m`;
  const directionsUrl = hasCoords
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps/search/${mapQuery}`;

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {lightbox && (
        <Lightbox
          image={lightbox.src}
          title={lightbox.title}
          onClose={closeLightbox}
        />
      )}

      {/* ── Hero Header (dark, same gradient as AllProduct's orange header theme) ── */}
      <div
        className="mx-1 mt-3 mb-4 rounded-2xl overflow-hidden relative"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #1a1a2e 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,123,29,.15) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(255,94,0,.1) 0%, transparent 50%)",
          }}
        />

        <div className="relative p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 overflow-hidden flex items-center justify-center text-white text-2xl font-black shadow-xl flex-shrink-0 cursor-pointer"
              style={{
                borderColor: "rgba(255,123,29,.5)",
                background: "#7c2d12",
                minWidth: 64,
                minHeight: 64,
              }}
              onClick={() => {
                const u = storeInfo.storeImage?.[0]?.url;
                if (u) openLightbox(u, "Store Image");
              }}
            >
              {storeInfo.storeImage?.[0]?.url ? (
                <img
                  src={storeInfo.storeImage[0].url}
                  alt="Store"
                  className="w-full h-full object-cover"
                />
              ) : (
                (storeInfo.storeName || vendorData.vendorName || "V").charAt(0)
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-black text-white truncate">
                  {storeInfo.storeName || vendorData.vendorName || "Vendor"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    vendorData.isActive
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-red-500/20 text-red-300 border-red-500/40"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${vendorData.isActive ? "bg-emerald-400" : "bg-red-400"}`}
                  />
                  {vendorData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-orange-400 text-xs font-semibold mb-0.5">
                Store ID: {storeInfo.storeId || vendorData.storeId || id}
              </p>
              <p className="text-gray-500 text-xs">
                {[city, state].filter(Boolean).join(", ")}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Total Orders", value: totalOrders },
                { label: "Rating", value: metrics.ratings || "—" },
                { label: "Products", value: metrics.totalProducts || 0 },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-4 py-2 text-center border"
                  style={{
                    background: "rgba(255,255,255,.08)",
                    borderColor: "rgba(255,255,255,.12)",
                  }}
                >
                  <p className="text-white font-black text-base">{s.value}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Bar */}
          {storeInfo.performance !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">Performance Score</span>
                <span className="text-orange-400 font-bold">
                  {storeInfo.performance}%
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,.1)" }}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF7B1D] to-orange-400 transition-all duration-1000"
                  style={{ width: `${storeInfo.performance}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Toolbar: Tabs + Search (mirrors AllProduct toolbar) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mx-1 mb-3">
        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search (only for orders tab) */}
        {activeTab === "orders" && (
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[320px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search orders..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
              Search
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="mx-1 grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
          {/* Col 1 ─ Store Info */}
          <div className="space-y-4">
            {/* Store Image Card */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
                <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  Store Image
                </span>
              </div>
              <div className="p-4">
                {(() => {
                  const url =
                    storeInfo.storeImage?.[0]?.url ||
                    vendorData.storeImage?.[0]?.url ||
                    vendorData.profileImage?.url;
                  return url ? (
                    <ClickableImage
                      src={url}
                      alt="Store"
                      label="Store Image"
                      onView={openLightbox}
                      className="w-full h-48 object-cover rounded-xl border border-gray-100"
                    />
                  ) : (
                    <div className="h-48 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-orange-300" />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        No image available
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Store Details Card */}
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  Store Details
                </span>
              </div>
              <div className="p-4 space-y-0">
                {[
                  [
                    "Authorized Person",
                    storeDetails.authorizedPerson || vendorData.vendorName,
                  ],
                  ["Contact", storeDetails.contact || vendorData.contactNumber],
                  [
                    "Alt Contact",
                    storeDetails.altContact || vendorData.altContactNumber,
                  ],
                  ["Email", storeDetails.email || vendorData.email],
                  ["DOB", storeDetails.dateOfBirth || vendorData.dateOfBirth],
                  ["Gender", storeDetails.gender || vendorData.gender],
                  [
                    "Latitude",
                    storeDetails.latitude || vendorData.storeAddress?.latitude,
                  ],
                  [
                    "Longitude",
                    storeDetails.longitude ||
                      vendorData.storeAddress?.longitude,
                  ],
                  [
                    "Service Radius",
                    vendorData.serviceRadius
                      ? `${vendorData.serviceRadius} km`
                      : null,
                  ],
                  [
                    "Handling Charge",
                    vendorData.handlingChargePercentage
                      ? `${vendorData.handlingChargePercentage}%`
                      : null,
                  ],
                  ["FSSAI No.", vendorData.fssaiNumber],
                ]
                  .filter(([, v]) => v)
                  .map(([l, v]) => (
                    <InfoRow key={l} label={l} value={v} />
                  ))}
              </div>
            </div>

            {/* Store Address Card */}
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  Store Address
                </span>
              </div>
              <div className="p-4 space-y-2">
                <InfoRow
                  label="Address Line 1"
                  value={
                    storeAddress.addressLine1 || vendorData.storeAddress?.line1
                  }
                />
                <InfoRow
                  label="Address Line 2"
                  value={
                    storeAddress.addressLine2 || vendorData.storeAddress?.line2
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <InfoRow
                    label="City"
                    value={storeAddress.city || vendorData.storeAddress?.city}
                  />
                  <InfoRow
                    label="State"
                    value={storeAddress.state || vendorData.storeAddress?.state}
                  />
                </div>
                <InfoRow
                  label="PIN Code"
                  value={
                    storeAddress.pinCode || vendorData.storeAddress?.pinCode
                  }
                />
              </div>
            </div>

            {/* Bank Details Card */}
            {vendorData.bankDetails && (
              <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <span className="text-sm font-semibold text-gray-700">
                    Bank Details
                  </span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      ["Bank", vendorData.bankDetails.bankName],
                      ["Account", vendorData.bankDetails.accountNumber],
                      ["IFSC", vendorData.bankDetails.ifsc],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-center"
                      >
                        <p className="text-xs text-gray-400 font-semibold mb-1">
                          {l}
                        </p>
                        <p className="text-xs font-bold text-gray-800 break-all">
                          {v || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                  {vendorData.bankDetails.cancelCheque?.url && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        Cancel Cheque
                      </p>
                      <ClickableImage
                        src={vendorData.bankDetails.cancelCheque.url}
                        alt="Cancel Cheque"
                        label="Cancel Cheque"
                        onView={openLightbox}
                        className="max-w-full h-28 object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Col 2 ─ Order Chart + Map + Announcement */}
          <div className="space-y-4">
            {/* Order Overview Chart Card */}
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <span className="text-sm font-semibold text-gray-700">
                    Order Overview
                  </span>
                </div>
                <span className="text-xs bg-[#FF7B1D] text-white font-semibold px-3 py-1 rounded-lg">
                  Today
                </span>
              </div>
              <div className="p-4">
                <div className="relative">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        startAngle={210}
                        endAngle={-30}
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={3}
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v, n) => [`${v}%`, n]}
                        contentStyle={{
                          borderRadius: 10,
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,.1)",
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-black text-gray-900">
                      {totalOrders}
                    </p>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                      Total Orders
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {chartData.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: entry.color }}
                        />
                        <span className="text-xs font-semibold text-gray-600">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-gray-800">
                        {entry.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Announcement Card */}
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <span className="text-sm font-semibold text-gray-700">
                    Announcements
                  </span>
                </div>
                <button className="text-xs bg-amber-500 text-white font-semibold px-3 py-1 rounded-lg hover:bg-amber-600 transition-colors">
                  View All
                </button>
              </div>
              <div className="p-4">
                <span className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs px-3 py-1 rounded-lg font-semibold mb-3">
                  📢 Invitation
                </span>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="font-semibold text-gray-800 text-sm mb-1">
                    We are now open new shop...
                  </p>
                  <p className="text-xs text-gray-400">
                    📅{" "}
                    {vendorData.createdAt
                      ? formatDate(vendorData.createdAt)
                      : "24 Sept 2025"}{" "}
                    · {vendorData.createdBy?.name || "Admin"}
                  </p>
                  {vendorData.createdBy && (
                    <div className="mt-2 pt-2 border-t border-amber-200 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400 font-medium">
                          Created By:
                        </span>
                        <span className="font-bold text-gray-700">
                          {vendorData.createdBy.name}
                        </span>
                        <span className="text-gray-400">
                          ({vendorData.createdBy.email})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400 font-medium">
                          Last Updated:
                        </span>
                        <span className="font-bold text-gray-700">
                          {formatDate(vendorData.updatedAt)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Store Location Map Card */}
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <span className="text-sm font-semibold text-gray-700">
                    Store Location
                  </span>
                </div>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> Open Maps
                </a>
              </div>
              <div className="p-4">
                {hasCoords && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 mb-3">
                    <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    <span className="text-xs font-mono text-blue-600 font-semibold">
                      {parseFloat(lat).toFixed(6)}, {parseFloat(lng).toFixed(6)}
                    </span>
                  </div>
                )}
                <div
                  className="rounded-xl overflow-hidden border-2 border-gray-100"
                  style={{ height: 220 }}
                >
                  <iframe
                    title="Store Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={embedUrl}
                  />
                </div>
                {(city || state) && (
                  <div className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100 mt-3">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-500 font-medium">
                      {[
                        storeAddress.addressLine1 ||
                          vendorData.storeAddress?.line1,
                        city,
                        state,
                        storeAddress.pinCode ||
                          vendorData.storeAddress?.pinCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Col 3 ─ Stat Cards */}
          <div className="grid grid-cols-2 gap-2.5 content-start">
            {statCards.map((c, i) => (
              <StatCard key={i} {...c} />
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ORDERS TAB  (mirrors AllProduct table exactly)
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "orders" && (
        <div className="mx-1 mb-6">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            {/* Card Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  Order List
                </span>
              </div>
              {!ordersLoading && (
                <span className="text-xs text-gray-400 font-medium">
                  {filteredOrders.length} of {ordersPagination.total} orders
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                    {[
                      "S.N",
                      "Order ID",
                      "Date",
                      "Customer",
                      "Contact",
                      "Amount",
                      "Items",
                      "Status",
                      "Actions",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 0 ? "w-12" : ""} ${i === 8 ? "text-right pr-5" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                {ordersLoading ? (
                  <TableSkeleton cols={9} rows={8} />
                ) : filteredOrders.length === 0 ? (
                  <EmptyState
                    icon={ShoppingCart}
                    label="No orders found"
                    cols={9}
                  />
                ) : (
                  <tbody>
                    {filteredOrders.map((order, idx) => (
                      <tr
                        key={order._id || idx}
                        className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        {/* S.N */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            {(ordersPage - 1) * ordersPagination.limit +
                              idx +
                              1}
                          </span>
                        </td>

                        {/* Order ID */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                            {(order.orderNumber || order._id || "").slice(
                              0,
                              12,
                            )}
                            …
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 text-gray-500 text-xs">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-700">
                            {order.user?.userName || "—"}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3.5 text-gray-500 text-xs">
                          {order.user?.contactNumber || "—"}
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-bold text-gray-800">
                            {formatPrice(order.vendorSubtotal)}
                          </span>
                        </td>

                        {/* Items */}
                        <td className="px-4 py-3.5">
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                            {order.items?.length || 0} item
                            {(order.items?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <StatusBadge status={order.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                              title="View order"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>

          {/* Pagination (identical to AllProduct) */}
          {!ordersLoading &&
            filteredOrders.length > 0 &&
            ordersPagination.pages > 1 && (
              <div className="flex items-center justify-between px-1 mt-5">
                <p className="text-xs text-gray-400 font-medium">
                  Page{" "}
                  <span className="text-gray-600 font-semibold">
                    {ordersPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-600 font-semibold">
                    {ordersPagination.pages}
                  </span>
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setOrdersPage((p) => Math.max(p - 1, 1))}
                    disabled={ordersPage === 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      const visible = new Set([
                        1,
                        2,
                        ordersPagination.pages - 1,
                        ordersPagination.pages,
                        ordersPage - 1,
                        ordersPage,
                        ordersPage + 1,
                      ]);
                      for (let i = 1; i <= ordersPagination.pages; i++) {
                        if (visible.has(i)) pages.push(i);
                        else if (pages[pages.length - 1] !== "...")
                          pages.push("...");
                      }
                      return pages.map((page, idx) =>
                        page === "..." ? (
                          <span
                            key={idx}
                            className="px-1 text-gray-400 text-xs"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setOrdersPage(page)}
                            className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                              ordersPage === page
                                ? "bg-[#FF7B1D] text-white shadow-sm shadow-orange-200"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      );
                    })()}
                  </div>
                  <button
                    onClick={() =>
                      setOrdersPage((p) =>
                        Math.min(p + 1, ordersPagination.pages),
                      )
                    }
                    disabled={ordersPage === ordersPagination.pages}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          DOCUMENTS TAB
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "docs" && (
        <div className="mx-1 mb-6">
          {vendorData.documents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* PAN Card */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <span className="text-sm font-semibold text-gray-700">
                    PAN Card
                  </span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {["panCardFront", "panCardBack"].map((key, i) => (
                    <div
                      key={key}
                      className="rounded-xl overflow-hidden border border-gray-100"
                    >
                      <p className="text-center text-xs font-semibold text-gray-400 py-2 bg-gray-50 border-b border-gray-100">
                        {i === 0 ? "Front" : "Back"}
                      </p>
                      {vendorData.documents[key]?.url ? (
                        <div className="p-2">
                          <ClickableImage
                            src={vendorData.documents[key].url}
                            alt={`PAN ${i === 0 ? "Front" : "Back"}`}
                            label={`PAN Card ${i === 0 ? "Front" : "Back"}`}
                            onView={openLightbox}
                            className="w-full h-24 object-contain rounded-lg"
                          />
                          <p className="text-center text-xs text-[#FF7B1D] font-semibold mt-1.5">
                            Click to view
                          </p>
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center bg-gray-50 m-2 rounded-lg border border-dashed border-gray-200">
                          <p className="text-xs text-gray-300 font-medium">
                            Not uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Aadhar Card */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <span className="text-sm font-semibold text-gray-700">
                    Aadhar Card
                  </span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {["aadharCardFront", "aadharCardBack"].map((key, i) => (
                    <div
                      key={key}
                      className="rounded-xl overflow-hidden border border-gray-100"
                    >
                      <p className="text-center text-xs font-semibold text-gray-400 py-2 bg-gray-50 border-b border-gray-100">
                        {i === 0 ? "Front" : "Back"}
                      </p>
                      {vendorData.documents[key]?.url ? (
                        <div className="p-2">
                          <ClickableImage
                            src={vendorData.documents[key].url}
                            alt={`Aadhar ${i === 0 ? "Front" : "Back"}`}
                            label={`Aadhar Card ${i === 0 ? "Front" : "Back"}`}
                            onView={openLightbox}
                            className="w-full h-24 object-contain rounded-lg"
                          />
                          <p className="text-center text-xs text-[#FF7B1D] font-semibold mt-1.5">
                            Click to view
                          </p>
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center bg-gray-50 m-2 rounded-lg border border-dashed border-gray-200">
                          <p className="text-xs text-gray-300 font-medium">
                            Not uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Driving License */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <span className="text-sm font-semibold text-gray-700">
                    Driving License
                  </span>
                </div>
                <div className="p-4">
                  {vendorData.documents.drivingLicense?.url ? (
                    <div className="rounded-xl overflow-hidden border border-gray-100 p-3">
                      <ClickableImage
                        src={vendorData.documents.drivingLicense.url}
                        alt="Driving License"
                        label="Driving License"
                        onView={openLightbox}
                        className="w-full h-32 object-contain rounded-lg"
                      />
                      <p className="text-center text-xs text-[#FF7B1D] font-semibold mt-1.5">
                        Click to view
                      </p>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-sm text-gray-300 font-medium">
                        Not uploaded
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 shadow-sm bg-white py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-orange-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No documents uploaded
                </p>
                <p className="text-gray-300 text-xs">
                  Documents will appear here once uploaded
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PARTNERS TAB  (same table card as AllProduct)
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "partners" && (
        <div className="mx-1 mb-6">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            {/* Card Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  Delivery Partners
                </span>
              </div>
              {partners.length > 0 && (
                <span className="text-xs text-gray-400 font-medium">
                  {partners.length} partners
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                    {["S.N", "Partner", "Contact", "Joined", "Status"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 0 ? "w-12 text-left" : i === 4 ? "text-right pr-5" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                {partners.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    label="No delivery partners found"
                    cols={5}
                  />
                ) : (
                  <tbody>
                    {partners.map((partner, idx) => (
                      <tr
                        key={partner.id || idx}
                        className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        {/* S.N */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            {idx + 1}
                          </span>
                        </td>

                        {/* Partner */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {partner.name?.charAt(0) || "R"}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {partner.name || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3.5 text-gray-500 text-xs">
                          {partner.mobileNumber || "—"}
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3.5 text-gray-500 text-xs">
                          {partner.joinedDate
                            ? formatDate(partner.joinedDate)
                            : "—"}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 pr-5 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              partner.status === "Online"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : partner.status === "Offline"
                                  ? "bg-gray-100 text-gray-600 border-gray-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                partner.status === "Online"
                                  ? "bg-blue-500"
                                  : partner.status === "Offline"
                                    ? "bg-gray-400"
                                    : "bg-emerald-500"
                              }`}
                            />
                            {partner.status || "Available"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default VendorDetails;
