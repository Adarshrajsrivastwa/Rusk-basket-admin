import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FiDownload,
  FiRefreshCw,
  FiPackage,
  FiDollarSign,
  FiShoppingCart,
  FiPercent,
  FiCalendar,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import api from "../../api/api";

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const VendorSalesReport = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/analytics/vendor/product-sales-report");
      if (res.data?.success) {
        setData(res.data.data || []);
        setFiltered(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load sales report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Apply filters
  useEffect(() => {
    let result = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.productName?.toLowerCase().includes(q) ||
          r.hsnCode?.toLowerCase().includes(q),
      );
    }
    if (dateFrom) result = result.filter((r) => r.date >= dateFrom);
    if (dateTo) result = result.filter((r) => r.date <= dateTo);
    setFiltered(result);
  }, [search, dateFrom, dateTo, data]);

  // Aggregates
  const totalSales = filtered.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const totalQty = filtered.reduce((s, r) => s + (r.quantity || 0), 0);
  const totalGst = filtered.reduce((s, r) => s + (r.gstAmount || 0), 0);
  const totalTaxable = filtered.reduce((s, r) => s + (r.taxableAmount || 0), 0);

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Sr No",
      "Date",
      "Product Name",
      "HSN Code",
      "GST Slab (%)",
      "Sale Price (₹)",
      "Quantity",
      "Total Amount (₹)",
      "GST Amount (₹)",
      "Taxable Amount (₹)",
    ];
    const rows = filtered.map((r) => [
      r.srNo,
      r.date,
      r.productName,
      r.hsnCode,
      r.gstSlab,
      r.salePrice,
      r.quantity,
      r.totalAmount,
      r.gstAmount,
      r.taxableAmount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0 p-0 ml-6 sm:p-6 lg:p-2">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Detailed product-wise sales analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60"
            >
              <FiRefreshCw
                className={loading ? "animate-spin" : ""}
                size={15}
              />
              Refresh
            </button>
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
            >
              <FiDownload size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<FiDollarSign className="text-orange-500" size={20} />}
            label="Total Sales"
            value={`₹${totalSales.toFixed(2)}`}
            color="bg-orange-50"
          />
          <StatCard
            icon={<FiShoppingCart className="text-blue-500" size={20} />}
            label="Total Quantity"
            value={totalQty}
            color="bg-blue-50"
          />
          <StatCard
            icon={<FiPercent className="text-green-500" size={20} />}
            label="GST Collected"
            value={`₹${totalGst.toFixed(2)}`}
            color="bg-green-50"
          />
          <StatCard
            icon={<FiPackage className="text-purple-500" size={20} />}
            label="Taxable Amount"
            value={`₹${totalTaxable.toFixed(2)}`}
            color="bg-purple-50"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search product or HSN code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
            </div>
            {/* Date From */}
            <div className="relative flex items-center gap-1.5">
              <FiCalendar className="text-gray-400" size={15} />
              <label className="text-xs text-gray-500 font-medium whitespace-nowrap">
                From:
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            {/* Date To */}
            <div className="relative flex items-center gap-1.5">
              <FiCalendar className="text-gray-400" size={15} />
              <label className="text-xs text-gray-500 font-medium whitespace-nowrap">
                To:
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            {(search || dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setSearch("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="text-xs text-orange-500 hover:text-orange-700 font-medium px-2 whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <FiFilter size={16} className="text-orange-400" />
              Sales Transactions
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading report...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-400">
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={fetchReport}
                className="mt-3 text-xs text-orange-500 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <FiPackage size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No records found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-5 py-3 text-left font-semibold w-10">
                      #
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Product
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">
                      HSN Code
                    </th>
                    <th className="px-5 py-3 text-center font-semibold">
                      GST %
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Sale Price
                    </th>
                    <th className="px-5 py-3 text-center font-semibold">Qty</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Total Amt
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      GST Amt
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Taxable Amt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((row, idx) => (
                    <tr
                      key={row.srNo}
                      className={`hover:bg-orange-50/40 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-5 py-3.5 text-gray-400 font-medium">
                        {row.srNo}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <FiCalendar size={12} className="text-gray-300" />
                          {new Date(row.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-gray-800">
                          {row.productName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-gray-100 text-gray-600 text-xs font-mono px-2 py-0.5 rounded">
                          {row.hsnCode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {row.gstSlab}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-gray-700 font-medium">
                        ₹{row.salePrice?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {row.quantity}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-gray-800">
                        ₹{row.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-orange-600 font-medium">
                        ₹{row.gstAmount?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-purple-600 font-semibold">
                        ₹{row.taxableAmount?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals Row */}
                <tfoot>
                  <tr className="bg-gradient-to-r from-orange-50 to-white border-t-2 border-orange-200">
                    <td
                      colSpan={6}
                      className="px-5 py-3.5 font-bold text-gray-700 text-sm"
                    >
                      Totals ({filtered.length} items)
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-blue-700">
                      {totalQty}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-800">
                      ₹{totalSales.toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-orange-600">
                      ₹{totalGst.toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-purple-700">
                      ₹{totalTaxable.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-4">
          All amounts are in Indian Rupees (₹) · GST amounts are calculated
          based on your registered GST slab
        </p>
      </div>
    </DashboardLayout>
  );
};

export default VendorSalesReport;
