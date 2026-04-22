import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Download,
  Eye,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api`;

const AllOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab") || "all";
  const highlightOrderId = queryParams.get("orderId");

  const [activeTab, setActiveTab] = useState(tabFromQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const getAuthToken = () =>
    localStorage.getItem("token") || localStorage.getItem("authToken");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login to view orders");
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);
      if (activeTab !== "all") params.append("status", activeTab);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const response = await fetch(
        `${API_BASE_URL}/admin/orders?${params.toString()}`,
        { method: "GET", headers, credentials: "include" },
      );

      if (!response.ok)
        throw new Error(`Failed to fetch orders: ${response.status}`);
      const result = await response.json();

      if (result.success && result.orders && Array.isArray(result.orders)) {
        const transformedOrders = result.orders.map((order) => ({
          id: order._id || order.orderId,
          _id: order._id || order.orderId,
          orderId: order.orderNumber || order.orderId || order._id,
          date: order.date || "N/A",
          vendor: order.vendor || "Unknown Vendor",
          user:
            order.userName ||
            order.username ||
            order.user?.userName ||
            order.user?.contactNumber ||
            "",
          cartValue: order.cartValue || 0,
          payment: order.paymentStatus || "pending",
          status: formatStatus(order.status),
          rawStatus: order.status,
          originalOrder: order,
        }));
        setOrders(transformedOrders);
        setTotalOrders(result.pagination?.total || result.count || 0);
        setTotalPages(result.pagination?.pages || 1);
      } else {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders. Please check console for details.");
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";
    const statusMap = {
      pending: "New Order",
      ready: "Ready",
      assigned: "Assigned",
      delivered: "Delivered",
      cancelled: "Cancel",
      cancel: "Cancel",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeTab]);

  useEffect(() => {
    if (!loading && highlightOrderId && highlightRef.current) {
      setTimeout(
        () =>
          highlightRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        100,
      );
    }
  }, [loading, highlightOrderId]);

  useEffect(() => {
    setActiveTab(tabFromQuery);
    setCurrentPage(1);
  }, [tabFromQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  const getFilteredOrders = () => {
    if (!searchQuery.trim()) return orders;
    const searchLower = searchQuery.toLowerCase();
    const toStr = (v) => {
      if (v == null) return "";
      if (Array.isArray(v)) return v.join(" ");
      if (typeof v === "object") {
        try {
          return JSON.stringify(v);
        } catch {
          return String(v);
        }
      }
      return String(v);
    };
    return orders.filter((order) => {
      const haystack = [
        order.orderId,
        order.id,
        order._id,
        order.date,
        order.vendor,
        order.user,
        order.cartValue,
        order.payment,
        order.status,
        order.rawStatus,
        order.originalOrder
          ? [
              toStr(order.originalOrder.orderNumber),
              toStr(order.originalOrder.userName),
              toStr(order.originalOrder.user?.userName),
              toStr(order.originalOrder.user?.name),
              toStr(order.originalOrder.user?.contactNumber),
              toStr(order.originalOrder.user?.email),
              toStr(order.originalOrder.vendor?.vendorName),
              toStr(order.originalOrder.paymentMethod),
              order.originalOrder.items
                ? order.originalOrder.items
                    .map((i) => toStr(i.productName) + " " + toStr(i.sku))
                    .join(" ")
                : "",
            ].join(" ")
          : "",
      ]
        .map(toStr)
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchLower);
    });
  };

  const filteredOrders = getFilteredOrders();

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    navigate(`/orders/all?tab=${tabKey}`);
  };

  const handleDownloadInvoice = (orderId) =>
    navigate(`/invoice/view/${orderId}`, {
      state: { orderId },
      replace: false,
    });

  const StatusBadge = ({ status }) => {
    const s = status || "Pending";
    const config = {
      "New Order": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        ring: "ring-blue-100",
        dot: "bg-blue-500",
      },
      Ready: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        ring: "ring-purple-100",
        dot: "bg-purple-500",
      },
      Assigned: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        ring: "ring-amber-100",
        dot: "bg-amber-500",
      },
      Delivered: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        ring: "ring-emerald-100",
        dot: "bg-emerald-500",
      },
      Cancel: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        ring: "ring-red-100",
        dot: "bg-red-500",
      },
      Pending: {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
        ring: "ring-gray-100",
        dot: "bg-gray-400",
      },
    };
    const c = config[s] || config["Pending"];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border} ring-1 ${c.ring}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {s}
      </span>
    );
  };

  const PaymentBadge = ({ payment }) => {
    const p = (payment || "pending").toLowerCase();
    const isPaid = p === "paid" || p === "completed" || p === "success";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
          isPaid
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100"
            : "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`}
        />
        {payment}
      </span>
    );
  };

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-28" : j === 7 ? "w-16 ml-auto" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="8" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No orders found</p>
            <p className="text-gray-300 text-xs">
              Try adjusting your filters or search query
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "New Order" },
    { key: "ready", label: "Ready" },
    { key: "assigned", label: "Assigned" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancel" },
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
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full max-w-full mx-auto px-1 mt-3 mb-3">
        {/* LEFT: Tab Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
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
        </div>

        {/* RIGHT: Search */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search orders..."
            className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Order Management
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredOrders.length} of {totalOrders} orders
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90 w-12">
                  S.N
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Order ID
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Date
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Vendor
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Cart Value
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Payment
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Status
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-bold text-white tracking-wider uppercase opacity-90 pr-5">
                  Actions
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredOrders.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {filteredOrders.map((order, idx) => {
                  const isHighlighted = order.id === highlightOrderId;
                  return (
                    <tr
                      key={order.id}
                      ref={isHighlighted ? highlightRef : null}
                      className={`row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group ${
                        isHighlighted
                          ? "bg-yellow-50 ring-1 ring-yellow-300"
                          : ""
                      }`}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* S.N */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </span>
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          {String(order.orderId || "").slice(0, 12)}…
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        {order.date}
                      </td>

                      {/* Vendor */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-gray-700">
                          {order.vendor}
                        </span>
                      </td>

                      {/* Cart Value */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-gray-800">
                          ₹{order.cartValue?.toLocaleString("en-IN") || 0}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3.5">
                        <PaymentBadge payment={order.payment} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              handleDownloadInvoice(order._id || order.id)
                            }
                            className="action-btn bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-700"
                            title="View Invoice"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/order/${order.id}`)}
                            className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                            title="View Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {!loading && filteredOrders.length > 0 && (
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
    </DashboardLayout>
  );
};

export default AllOrder;
