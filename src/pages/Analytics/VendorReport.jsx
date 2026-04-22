import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  Package,
  BarChart3,
  IndianRupee,
  Calendar,
  Download,
  Loader2,
  TrendingUp,
  ShoppingCart,
  Star,
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
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api/analytics/admin`;

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-lg text-xs">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        <p className="text-[#FF7B1D]">
          Revenue:{" "}
          <span className="font-semibold">
            ₹{payload[0]?.value?.toFixed(2)}
          </span>
        </p>
        <p className="text-blue-500">
          Orders:{" "}
          <span className="font-semibold">{payload[1]?.value || 0}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-lg text-xs">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        <p className="text-gray-700">
          Sales:{" "}
          <span className="font-semibold">
            ₹{payload[0]?.value?.toFixed(2)}
          </span>
        </p>
        <p className="text-gray-500">
          {payload[0]?.payload?.orders || 0} orders
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, label, value, sub, color = "orange" }) => {
  const colors = {
    orange: {
      bg: "bg-orange-50",
      icon: "text-[#FF7B1D]",
      sub: "text-[#FF7B1D]",
      dot: "bg-[#FF7B1D]",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-500",
      sub: "text-blue-500",
      dot: "bg-blue-500",
    },
    green: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      sub: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      sub: "text-purple-600",
      dot: "bg-purple-500",
    },
  };
  const c = colors[color];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between group hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
        <p className={`text-xs font-semibold ${c.sub}`}>{sub}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center`}
      >
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
    </div>
  );
};

const SectionCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}
  >
    <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
      <span className="text-sm font-semibold text-gray-700">{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const VendorReport = () => {
  const [dateRange, setDateRange] = useState("thisMonth");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const fetchOptions = { method: "GET", credentials: "include", headers };

        const [dashboardRes, salesRes, vendorsRes, productsRes] =
          await Promise.all([
            fetch(`${API_BASE_URL}/dashboard`, fetchOptions),
            fetch(`${API_BASE_URL}/sales`, fetchOptions),
            fetch(`${API_BASE_URL}/vendors`, fetchOptions),
            fetch(`${API_BASE_URL}/products`, fetchOptions),
          ]);

        const [dashboardJson, salesJson, vendorsJson, productsJson] =
          await Promise.all([
            dashboardRes.json(),
            salesRes.json(),
            vendorsRes.json(),
            productsRes.json(),
          ]);

        if (dashboardJson.success) setDashboardData(dashboardJson.data);
        if (salesJson.success) setSalesData(salesJson.data.sales);
        if (vendorsJson.success) setVendorsData(vendorsJson.data.vendors);
        if (productsJson.success) setProductsData(productsJson.data.products);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, [dateRange]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const monthlyGrowthData = salesData.map((sale) => ({
    month: formatDate(sale.period),
    revenue: sale.revenue,
    orders: sale.orders,
  }));

  const topVendorsData = vendorsData
    .sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue)
    .slice(0, 6)
    .map((vendor) => ({
      vendorId: vendor.vendorId,
      name: `Vendor ${vendor.vendorId.slice(-6)}`,
      revenue: vendor.metrics.totalRevenue,
      orders: vendor.metrics.totalOrders,
      products: vendor.metrics.totalItems,
      rating: 4.5,
      status: "Active",
    }));

  const productsChartData = productsData.slice(0, 4).map((product, idx) => {
    const colors = ["#FF7B1D", "#fb923c", "#fdba74", "#fed7aa"];
    return {
      category: product.productName,
      sales: product.metrics.totalRevenue,
      orders: product.metrics.orderCount,
      fill: colors[idx % colors.length],
    };
  });

  const handleDownload = () => {
    if (!dashboardData) return;
    setDownloading(true);

    try {
      const dateLabel = dateRange.replace(/([A-Z])/g, " $1").trim();
      const now = new Date().toLocaleDateString("en-IN");

      // ── Build CSV rows ──
      const rows = [];

      // Summary
      rows.push(["VENDOR ANALYTICS REPORT"]);
      rows.push([`Period: ${dateLabel}`, `Generated: ${now}`]);
      rows.push([]);

      rows.push(["SUMMARY"]);
      rows.push(["Metric", "Value"]);
      rows.push(["Active Vendors", dashboardData?.vendors?.active || 0]);
      rows.push(["New Vendors This Month", dashboardData?.vendors?.new || 0]);
      rows.push(["Total Products", dashboardData?.products?.total || 0]);
      rows.push(["Active Products", dashboardData?.products?.active || 0]);
      rows.push(["Pending Products", dashboardData?.products?.pending || 0]);
      rows.push(["Approved Products", dashboardData?.products?.approved || 0]);
      rows.push(["Total Revenue (INR)", dashboardData?.revenue?.total || 0]);
      rows.push(["Total Orders", dashboardData?.revenue?.totalOrders || 0]);
      rows.push([
        "Avg Order Value (INR)",
        dashboardData?.revenue?.averageOrderValue || 0,
      ]);
      rows.push(["Total Tax (INR)", dashboardData?.revenue?.totalTax || 0]);
      rows.push([
        "Total Shipping (INR)",
        dashboardData?.revenue?.totalShipping || 0,
      ]);
      rows.push([
        "Total Discount (INR)",
        dashboardData?.revenue?.totalDiscount || 0,
      ]);
      rows.push([]);

      // Top Vendors
      if (topVendorsData.length > 0) {
        rows.push(["TOP PERFORMING VENDORS"]);
        rows.push([
          "Vendor ID",
          "Products",
          "Orders",
          "Revenue (INR)",
          "Rating",
          "Status",
        ]);
        topVendorsData.forEach((v) => {
          rows.push([
            v.name,
            v.products,
            v.orders,
            v.revenue,
            v.rating,
            v.status,
          ]);
        });
        rows.push([]);
      }

      // Sales Timeline
      if (monthlyGrowthData.length > 0) {
        rows.push(["REVENUE & ORDERS TIMELINE"]);
        rows.push(["Period", "Revenue (INR)", "Orders"]);
        monthlyGrowthData.forEach((s) => {
          rows.push([s.month, s.revenue, s.orders]);
        });
        rows.push([]);
      }

      // Top Products
      if (productsData.length > 0) {
        rows.push(["TOP PRODUCTS PERFORMANCE"]);
        rows.push([
          "Product Name",
          "Order Count",
          "Total Revenue (INR)",
          "Total Quantity",
          "Avg Price (INR)",
        ]);
        productsData.slice(0, 10).forEach((p) => {
          rows.push([
            p.productName,
            p.metrics.orderCount,
            p.metrics.totalRevenue,
            p.metrics.totalQuantity,
            p.metrics.averagePrice?.toFixed(2),
          ]);
        });
        rows.push([]);
      }

      // Order Status Distribution
      if (dashboardData?.orders?.statusDistribution?.length > 0) {
        rows.push(["ORDER STATUS DISTRIBUTION"]);
        rows.push(["Status", "Count", "Revenue (INR)"]);
        dashboardData.orders.statusDistribution.forEach((s) => {
          rows.push([s.status.replace(/_/g, " "), s.count, s.revenue]);
        });
      }

      // Convert to CSV string
      const csvContent = rows
        .map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" &&
              (cell.includes(",") || cell.includes('"'))
                ? `"${cell.replace(/"/g, '""')}"`
                : cell,
            )
            .join(","),
        )
        .join("\n");

      // Trigger download
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vendor-analytics-${dateRange}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#FF7B1D] animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">
              Loading analytics...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const inventoryItems = [
    {
      label: "Active Products",
      sub: "Ready for sale",
      value: dashboardData?.products?.active || 0,
      color: "text-[#FF7B1D]",
      border: "border-orange-200",
      bg: "bg-orange-50",
      dot: "bg-[#FF7B1D]",
    },
    {
      label: "Pending Review",
      sub: "Awaiting approval",
      value: dashboardData?.products?.pending || 0,
      color: "text-amber-600",
      border: "border-amber-200",
      bg: "bg-amber-50",
      dot: "bg-amber-500",
    },
    {
      label: "Approved Products",
      sub: "Verified items",
      value: dashboardData?.products?.approved || 0,
      color: "text-emerald-600",
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      dot: "bg-emerald-500",
    },
    {
      label: "Total Discount",
      sub: "Applied this month",
      value: formatCurrency(dashboardData?.revenue?.totalDiscount || 0),
      color: "text-red-500",
      border: "border-red-200",
      bg: "bg-red-50",
      dot: "bg-red-500",
    },
  ];

  const payoutItems = [
    {
      label: "Total Revenue (Month)",
      sub: `${dashboardData?.revenue?.totalOrders || 0} orders completed`,
      value: formatCurrency(dashboardData?.revenue?.total || 0),
      subColor: "text-emerald-600",
      border: "border-l-[#FF7B1D]",
      bg: "bg-orange-50/50",
    },
    {
      label: "Total Tax Collected",
      sub: "From all transactions",
      value: formatCurrency(dashboardData?.revenue?.totalTax || 0),
      subColor: "text-gray-400",
      border: "border-l-emerald-500",
      bg: "bg-emerald-50/50",
    },
    {
      label: "Shipping Charges",
      sub: "Total shipping collected",
      value: formatCurrency(dashboardData?.revenue?.totalShipping || 0),
      subColor: "text-gray-400",
      border: "border-l-amber-500",
      bg: "bg-amber-50/50",
    },
  ];

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div className="px-1 mt-3 pb-8 max-w-full">
        {/* ── Page Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-sm font-bold text-gray-800">All Analytics</h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Key performance insights across vendors, products &amp; revenue
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 h-[38px] bg-white shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#FF7B1D]" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="text-xs text-gray-700 focus:outline-none bg-transparent font-medium"
              >
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="thisYear">This Year</option>
              </select>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading || !dashboardData}
              className="flex items-center gap-1.5 h-[38px] px-4 bg-[#FF7B1D] hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard
            icon={Users}
            label="Active Vendors"
            value={dashboardData?.vendors?.active || 0}
            sub={`${dashboardData?.vendors?.new || 0} new this month`}
            color="orange"
          />
          <StatCard
            icon={Package}
            label="Total Products"
            value={dashboardData?.products?.total || 0}
            sub={`${dashboardData?.products?.active || 0} active items`}
            color="blue"
          />
          <StatCard
            icon={IndianRupee}
            label="Total Revenue"
            value={formatCurrency(dashboardData?.revenue?.total || 0)}
            sub={`${dashboardData?.revenue?.totalOrders || 0} orders`}
            color="green"
          />
          <StatCard
            icon={BarChart3}
            label="Avg Order Value"
            value={formatCurrency(
              dashboardData?.revenue?.averageOrderValue || 0,
            )}
            sub="Per transaction"
            color="purple"
          />
        </div>

        {/* ── Top Vendors Table ── */}
        <div className="mx-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white mb-5">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Top Performing Vendors
              </span>
            </div>
            {topVendorsData.length > 0 && (
              <span className="text-xs text-gray-400 font-medium">
                {topVendorsData.length} vendors
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            {topVendorsData.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                    {[
                      "Vendor ID",
                      "Products",
                      "Orders",
                      "Revenue",
                      "Rating",
                      "Status",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 5 ? "text-right pr-5" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topVendorsData.map((vendor, idx) => (
                    <tr
                      key={idx}
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          {vendor.name}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-700">
                        {vendor.products}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-700">
                        {vendor.orders}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-gray-800">
                          {formatCurrency(vendor.revenue)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {vendor.rating}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 pr-5 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {vendor.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-orange-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No vendor data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Bar Chart */}
          <SectionCard title="Top Products Sales">
            <div className="h-72">
              {productsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productsChartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="category"
                      angle={-12}
                      textAnchor="end"
                      height={40}
                      style={{ fontSize: "10px" }}
                      interval={0}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <YAxis
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                      style={{ fontSize: "10px" }}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}>
                      {productsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">
                    No product data available
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Inventory Status */}
          <SectionCard title="Inventory Status">
            <div className="space-y-3">
              {inventoryItems.map(
                ({ label, sub, value, color, border, bg, dot }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border ${border} ${bg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          {label}
                        </p>
                        <p className="text-[10px] text-gray-400">{sub}</p>
                      </div>
                    </div>
                    <span className={`text-xl font-bold ${color}`}>
                      {value}
                    </span>
                  </div>
                ),
              )}
            </div>
          </SectionCard>
        </div>

        {/* ── Revenue & Order Status Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Revenue & Payouts */}
          <SectionCard title="Revenue & Payouts Overview">
            <div className="space-y-3">
              {payoutItems.map(
                ({ label, sub, value, subColor, border, bg }) => (
                  <div
                    key={label}
                    className={`px-4 py-3.5 rounded-xl border-l-4 ${border} ${bg} border border-gray-100`}
                  >
                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">
                      {label}
                    </p>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                    <p
                      className={`text-[10px] font-semibold mt-0.5 ${subColor}`}
                    >
                      {sub}
                    </p>
                  </div>
                ),
              )}
            </div>
          </SectionCard>

          {/* Order Status Distribution */}
          <SectionCard title="Order Status Distribution">
            <div className="space-y-3">
              {dashboardData?.orders?.statusDistribution?.length > 0 ? (
                dashboardData.orders.statusDistribution.map((status, idx) => {
                  const totalOrders =
                    dashboardData.orders.statusDistribution.reduce(
                      (sum, s) => sum + s.count,
                      0,
                    );
                  const pct = ((status.count / totalOrders) * 100).toFixed(0);
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-gray-600 capitalize">
                          {status.status.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs font-bold text-gray-700">
                          {status.count}{" "}
                          <span className="text-gray-400 font-normal">
                            ({formatCurrency(status.revenue)})
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 text-sm py-8">
                  No order data available
                </p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* ── Line Chart ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white mb-5">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Revenue &amp; Orders Timeline
            </span>
          </div>
          <div className="p-5">
            <div className="h-72">
              {monthlyGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyGrowthData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="month"
                      style={{ fontSize: "10px" }}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="#FF7B1D"
                      tickFormatter={(v) => `₹${v}`}
                      style={{ fontSize: "10px" }}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#3B82F6"
                      domain={[0, "auto"]}
                      style={{ fontSize: "10px" }}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FF7B1D"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#FF7B1D" }}
                      activeDot={{ r: 6 }}
                      name="Revenue (₹)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#3B82F6" }}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">
                    No sales data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Top Products Performance ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Top Products Performance
              </span>
            </div>
            {productsData.length > 0 && (
              <span className="text-xs text-gray-400 font-medium">
                {Math.min(productsData.length, 6)} products
              </span>
            )}
          </div>
          <div className="p-5">
            {productsData.length > 0 ? (
              <div className="space-y-3">
                {productsData.slice(0, 6).map((product, idx) => (
                  <div
                    key={idx}
                    className="row-animate flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {product.productName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {product.metrics.orderCount} orders &nbsp;·&nbsp; Avg{" "}
                          {formatCurrency(product.metrics.averagePrice)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-sm font-bold text-gray-800">
                        {formatCurrency(product.metrics.totalRevenue)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Qty: {product.metrics.totalQuantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-7 h-7 text-orange-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No product activity available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorReport;
