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
} from "react-icons/fi";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api/api";

// ─── Main Page ─────────────────────────────────────────────────────────────────
const VendorSalesReport = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    setCurrentPage(1);
  }, [search, dateFrom, dateTo, data]);

  // Aggregates
  const totalSales = filtered.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const totalQty = filtered.reduce((s, r) => s + (r.quantity || 0), 0);
  const totalGst = filtered.reduce((s, r) => s + (r.gstAmount || 0), 0);
  const totalTaxable = filtered.reduce((s, r) => s + (r.taxableAmount || 0), 0);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const currentRows = filtered.slice(indexOfFirst, indexOfFirst + itemsPerPage);

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

  const stats = [
    {
      icon: <FiDollarSign className="w-5 h-5 text-orange-600" />,
      label: "Total Sales",
      value: `₹${totalSales.toFixed(2)}`,
      bg: "bg-orange-50",
      border: "border-orange-200",
      color: "text-orange-600",
    },
    {
      icon: <FiShoppingCart className="w-5 h-5 text-blue-600" />,
      label: "Total Quantity",
      value: totalQty,
      bg: "bg-blue-50",
      border: "border-blue-200",
      color: "text-blue-600",
    },
    {
      icon: <FiPercent className="w-5 h-5 text-emerald-600" />,
      label: "GST Collected",
      value: `₹${totalGst.toFixed(2)}`,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      color: "text-emerald-600",
    },
    {
      icon: <FiPackage className="w-5 h-5 text-gray-500" />,
      label: "Taxable Amount",
      value: `₹${totalTaxable.toFixed(2)}`,
      bg: "bg-gray-50",
      border: "border-gray-200",
      color: "text-gray-600",
    },
  ];

  // ── Skeleton (same as AllProduct) ──
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 10 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${
                  j === 0 ? "w-6" : j === 9 ? "w-[70%] ml-auto" : "w-[70%]"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // ── Empty State (same as AllProduct) ──
  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan={10} className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <FiPackage className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No records found
            </p>
            <p className="text-gray-300 text-xs">Try adjusting your filters</p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
      `}</style>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-full mx-auto px-1 mt-3 mb-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-2xl border ${s.border} shadow-sm p-4 flex items-center justify-between`}
          >
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}
            >
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar (AllProduct-style: LEFT = filters, RIGHT = actions) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full max-w-full mx-auto px-1 mb-3">
        {/* LEFT: Search + Date Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date From */}
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 h-[36px] bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-200 transition-all">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="2"
                width="14"
                height="13"
                rx="2"
                stroke="#FF7B1D"
                strokeWidth="1.4"
              />
              <path
                d="M5 1v3M11 1v3M1 6h14"
                stroke="#FF7B1D"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <label className="text-xs text-gray-400 font-medium whitespace-nowrap">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border-none bg-transparent text-xs text-gray-700 outline-none cursor-pointer w-[110px]"
            />
            {dateFrom && (
              <button
                onClick={() => setDateFrom("")}
                className="text-gray-300 hover:text-gray-500 text-sm leading-none ml-1"
                title="Clear date"
              >
                ✕
              </button>
            )}
          </div>

          {/* Date To */}
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 h-[36px] bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-200 transition-all">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="2"
                width="14"
                height="13"
                rx="2"
                stroke="#FF7B1D"
                strokeWidth="1.4"
              />
              <path
                d="M5 1v3M11 1v3M1 6h14"
                stroke="#FF7B1D"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <label className="text-xs text-gray-400 font-medium whitespace-nowrap">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border-none bg-transparent text-xs text-gray-700 outline-none cursor-pointer w-[110px]"
            />
            {dateTo && (
              <button
                onClick={() => setDateTo("")}
                className="text-gray-300 hover:text-gray-500 text-sm leading-none ml-1"
                title="Clear date"
              >
                ✕
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 hidden sm:block" />

          {/* Clear All */}
          {(search || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setSearch("");
                setDateFrom("");
                setDateTo("");
              }}
              className="text-xs text-[#FF7B1D] hover:text-orange-700 font-semibold whitespace-nowrap px-2"
            >
              Clear All
            </button>
          )}
        </div>

        {/* RIGHT: Search + Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search (AllProduct-style with orange button) */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[300px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search product or HSN code..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
              Search
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchReport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 text-xs font-semibold hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 rounded-xl transition-all shadow-sm disabled:opacity-60 h-[38px]"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={13} />
            Refresh
          </button>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 h-[38px]"
          >
            <FiDownload size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mx-1 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-3 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button
            onClick={fetchReport}
            className="underline text-[#FF7B1D] ml-2 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Table Card (AllProduct-style) ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Sales Transactions
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  { label: "#", align: "text-left w-12" },
                  { label: "Date", align: "text-left" },
                  { label: "Product", align: "text-left" },
                  { label: "HSN Code", align: "text-left" },
                  { label: "GST %", align: "text-center" },
                  { label: "Sale Price", align: "text-right" },
                  { label: "Qty", align: "text-center" },
                  { label: "Total Amt", align: "text-right" },
                  { label: "GST Amt", align: "text-right" },
                  { label: "Taxable Amt", align: "text-right" },
                ].map(({ label, align }) => (
                  <th
                    key={label}
                    className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${align}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <tbody>
                  {currentRows.map((row, idx) => (
                    <tr
                      key={row.srNo}
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* # */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {row.srNo}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1"
                              y="2"
                              width="14"
                              height="13"
                              rx="2"
                              stroke="#d1d5db"
                              strokeWidth="1.4"
                            />
                            <path
                              d="M5 1v3M11 1v3M1 6h14"
                              stroke="#d1d5db"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                          {new Date(row.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3.5 font-semibold text-gray-800 max-w-[180px]">
                        <span className="truncate block">
                          {row.productName}
                        </span>
                      </td>

                      {/* HSN Code */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          {row.hsnCode}
                        </span>
                      </td>

                      {/* GST % */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                          {row.gstSlab}%
                        </span>
                      </td>

                      {/* Sale Price */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-bold text-gray-800">
                          ₹{row.salePrice?.toFixed(2)}
                        </span>
                      </td>

                      {/* Qty */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                          {row.quantity}
                        </span>
                      </td>

                      {/* Total Amt */}
                      <td className="px-4 py-3.5 text-right font-bold text-gray-800 text-sm">
                        ₹{row.totalAmount?.toFixed(2)}
                      </td>

                      {/* GST Amt */}
                      <td className="px-4 py-3.5 text-right text-[#FF7B1D] font-medium text-xs">
                        ₹{row.gstAmount?.toFixed(2)}
                      </td>

                      {/* Taxable Amt */}
                      <td className="px-4 py-3.5 text-right text-gray-700 font-semibold text-xs">
                        ₹{row.taxableAmount?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Totals Footer Row */}
                <tfoot>
                  <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white font-bold text-xs">
                    <td colSpan={6} className="px-4 py-3.5 opacity-90">
                      Totals — {filtered.length} item
                      {filtered.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3.5 text-center">{totalQty}</td>
                    <td className="px-4 py-3.5 text-right">
                      ₹{totalSales.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      ₹{totalGst.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      ₹{totalTaxable.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </>
            )}
          </table>
        </div>
      </div>

      {/* ── Pagination (AllProduct-style) ── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-1 mt-5 mb-6">
          <p className="text-xs text-gray-400 font-medium">
            Page{" "}
            <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
            of <span className="text-gray-600 font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const visiblePages = new Set([
                  1,
                  2,
                  totalPages - 1,
                  totalPages,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                ]);
                for (let i = 1; i <= totalPages; i++) {
                  if (visiblePages.has(i)) pages.push(i);
                  else if (pages[pages.length - 1] !== "...") pages.push("...");
                }
                return pages.map((page, idx) =>
                  page === "..." ? (
                    <span key={idx} className="px-1 text-gray-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === page
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center mt-4 mb-2">
        All amounts are in Indian Rupees (₹) · GST amounts are calculated based
        on your registered GST slab
      </p>
    </DashboardLayout>
  );
};

export default VendorSalesReport;
