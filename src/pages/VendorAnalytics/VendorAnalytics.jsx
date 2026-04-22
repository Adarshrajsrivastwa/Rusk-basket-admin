import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  IndianRupee,
  Loader2,
  BarChart2,
  CheckCircle,
  Clock,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  AreaChart,
  Area,
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
} from "recharts";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api/analytics/vendor`;

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const opts = { method: "GET", credentials: "include", headers };

        const [dashRes, salesRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard`, opts),
          fetch(`${API_BASE_URL}/sales`, opts),
          fetch(`${API_BASE_URL}/products`, opts),
        ]);
        const [dj, sj, pj] = await Promise.all([
          dashRes.json(),
          salesRes.json(),
          prodRes.json(),
        ]);

        if (dj.success) setDashboardData(dj.data);
        if (sj.success) setSalesData(sj.data.sales || []);
        if (pj.success) setProductsData(pj.data.products || []);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(v);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const chartSalesData = salesData.map((s) => ({
    date: formatDate(s.period),
    revenue: s.revenue || 0,
    orders: s.orders || 0,
  }));

  const ORANGE_SHADES = [
    "#FF7B1D",
    "#FE9C4B",
    "#FFC285",
    "#FFDDAC",
    "#FF9F66",
    "#FFB380",
  ];

  const topProductsChart = productsData.slice(0, 6).map((p, i) => ({
    name: p.productName?.substring(0, 18) || "Unknown",
    sales: p.metrics?.totalRevenue || 0,
    color: ORANGE_SHADES[i % ORANGE_SHADES.length],
  }));

  const orderStatusData = (dashboardData?.orders?.statusDistribution || []).map(
    (s, i) => ({
      status: s.status.replace(/_/g, " "),
      value: s.count,
      color: ["#FF7B1D", "#22C55E", "#EF4444", "#FFA500", "#3B82F6"][i % 5],
    }),
  );

  const paymentMethodData = (
    dashboardData?.orders?.paymentMethodDistribution || []
  ).map((m, i) => ({
    method: m.method.toUpperCase(),
    value: m.count,
    color: ["#FF7B1D", "#FFA500", "#FFB84D", "#FFC976"][i % 4],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}:{" "}
            {p.name === "Revenue (₹)"
              ? `₹${p.value.toLocaleString("en-IN")}`
              : p.value}
          </p>
        ))}
      </div>
    );
  };

  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#FF7B1D] animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">
              Loading analytics…
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate { animation: fadeSlideIn 0.3s ease forwards; }
      `}</style>

      <div className="px-1 mt-3 space-y-5">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Total Revenue",
              value: formatCurrency(dashboardData?.revenue?.total || 0),
              sub: `All time: ${formatCurrency(dashboardData?.revenue?.allTimeTotal || 0)}`,
              subColor: "text-[#FF7B1D]",
              icon: IndianRupee,
              border: "border-[#FF7B1D]",
              iconBg: "bg-orange-50",
              iconColor: "text-[#FF7B1D]",
              delay: 0,
            },
            {
              label: "Total Orders",
              value: dashboardData?.revenue?.totalOrders || 0,
              sub: `All time: ${dashboardData?.revenue?.allTimeTotalOrders || 0}`,
              subColor: "text-[#FF7B1D]",
              icon: ShoppingCart,
              border: "border-blue-400",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-500",
              delay: 60,
            },
            {
              label: "Avg Order Value",
              value: formatCurrency(
                dashboardData?.revenue?.averageOrderValue || 0,
              ),
              sub: "Per transaction",
              subColor: "text-emerald-600",
              icon: TrendingUp,
              border: "border-emerald-400",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-500",
              delay: 120,
            },
            {
              label: "Active Products",
              value: dashboardData?.products?.total || 0,
              sub: `${dashboardData?.products?.approved || 0} approved`,
              subColor: "text-emerald-600",
              icon: Package,
              border: "border-purple-400",
              iconBg: "bg-purple-50",
              iconColor: "text-purple-500",
              delay: 180,
            },
          ].map(
            ({
              label,
              value,
              sub,
              subColor,
              icon: Icon,
              border,
              iconBg,
              iconColor,
              delay,
            }) => (
              <div
                key={label}
                className={`card-animate bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-l-4 ${border}`}
                style={{ animationDelay: `${delay}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {value}
                    </p>
                    <p className={`text-xs mt-1.5 font-semibold ${subColor}`}>
                      {sub}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* ── Revenue & Orders Trend ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Revenue & Orders Trend
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {chartSalesData.length} data points
            </span>
          </div>
          <div className="p-5">
            {chartSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={chartSalesData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#FF7B1D"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#FF7B1D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#22C55E"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF7B1D"
                    strokeWidth={2}
                    fill="url(#gRevenue)"
                    name="Revenue (₹)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#FF7B1D" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#22C55E"
                    strokeWidth={2}
                    fill="url(#gOrders)"
                    name="Orders"
                    dot={false}
                    activeDot={{ r: 4, fill: "#22C55E" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] gap-2">
                <BarChart2 className="w-10 h-10 text-gray-200" />
                <p className="text-gray-400 text-sm">No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Top Products + Order Status ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Products Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Top Selling Products
              </span>
            </div>
            <div className="p-5">
              {topProductsChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topProductsChart}
                    margin={{ top: 4, right: 4, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="name"
                      stroke="#9ca3af"
                      tick={{ fontSize: 10 }}
                      angle={-40}
                      textAnchor="end"
                    />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: 12,
                      }}
                      formatter={(v) => [
                        `₹${v.toLocaleString("en-IN")}`,
                        "Revenue",
                      ]}
                    />
                    <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                      {topProductsChart.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] gap-2">
                  <Package className="w-10 h-10 text-gray-200" />
                  <p className="text-gray-400 text-sm">
                    No product data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Status Pie */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Order Status Distribution
              </span>
            </div>
            <div className="p-5">
              {orderStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      dataKey="value"
                      nameKey="status"
                      labelLine={false}
                      label={({ status, value, percent }) =>
                        percent > 0.05 ? `${status}: ${value}` : ""
                      }
                    >
                      {orderStatusData.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] gap-2">
                  <ShoppingCart className="w-10 h-10 text-gray-200" />
                  <p className="text-gray-400 text-sm">
                    No order data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Payment Methods ── */}
        {paymentMethodData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Payment Methods Distribution
              </span>
            </div>
            <div className="p-5 flex justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="method"
                    labelLine={false}
                    label={({ method, value, percent }) =>
                      percent > 0.05 ? `${method}: ${value}` : ""
                    }
                  >
                    {paymentMethodData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Top Performing Products Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Top Performing Products
              </span>
            </div>
            {productsData.length > 0 && (
              <span className="text-xs text-gray-400 font-medium">
                {productsData.length} products
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            {productsData.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                    {[
                      "S.N",
                      "Product Name",
                      "Qty Sold",
                      "Revenue",
                      "Avg Price",
                      "Orders",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 text-left"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productsData.map((product, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    >
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-semibold text-gray-800">
                          {product.productName}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                          {product.metrics?.totalQuantity || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-[#FF7B1D] border border-orange-200 px-2.5 py-1 rounded-full text-xs font-bold">
                          {formatCurrency(product.metrics?.totalRevenue || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 font-medium">
                        {formatCurrency(product.metrics?.averagePrice || 0)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                          {product.metrics?.orderCount || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <Package className="w-7 h-7 text-orange-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No product data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          {[
            {
              title: "Revenue Summary",
              border: "border-[#FF7B1D]",
              titleColor: "text-[#FF7B1D]",
              bg: "from-orange-50",
              rows: [
                {
                  label: "Total Revenue",
                  value: formatCurrency(
                    dashboardData?.revenue?.totalItemRevenue || 0,
                  ),
                  valueColor: "text-[#FF7B1D]",
                },
                {
                  label: "Items Sold",
                  value: dashboardData?.revenue?.totalItemsSold || 0,
                  valueColor: "text-gray-800",
                },
                {
                  label: "Cashback Given",
                  value: formatCurrency(
                    dashboardData?.revenue?.totalCashback || 0,
                  ),
                  valueColor: "text-gray-800",
                },
              ],
            },
            {
              title: "Product Status",
              border: "border-emerald-400",
              titleColor: "text-emerald-600",
              bg: "from-emerald-50",
              rows: [
                {
                  label: "Total Products",
                  value: dashboardData?.products?.total || 0,
                  valueColor: "text-gray-800",
                },
                {
                  label: "Approved",
                  value: dashboardData?.products?.approved || 0,
                  valueColor: "text-emerald-600",
                },
                {
                  label: "Pending",
                  value: dashboardData?.products?.pending || 0,
                  valueColor: "text-orange-500",
                },
              ],
            },
            {
              title: "Order Statistics",
              border: "border-blue-400",
              titleColor: "text-blue-600",
              bg: "from-blue-50",
              rows: [
                {
                  label: "Total Orders",
                  value: dashboardData?.revenue?.totalOrders || 0,
                  valueColor: "text-gray-800",
                },
                {
                  label: "Avg Order Value",
                  value: formatCurrency(
                    dashboardData?.revenue?.averageOrderValue || 0,
                  ),
                  valueColor: "text-gray-800",
                },
                {
                  label: "All Time Orders",
                  value: dashboardData?.revenue?.allTimeTotalOrders || 0,
                  valueColor: "text-gray-800",
                },
              ],
            },
          ].map(({ title, border, titleColor, bg, rows }) => (
            <div
              key={title}
              className={`bg-gradient-to-br ${bg} to-white rounded-2xl border border-gray-100 shadow-sm border-l-4 ${border} p-5`}
            >
              <h3 className={`text-sm font-bold mb-4 ${titleColor}`}>
                {title}
              </h3>
              <div className="space-y-3">
                {rows.map(({ label, value, valueColor }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className={`text-sm font-bold ${valueColor}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
