import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Eye,
} from "lucide-react";
import api from "../../api/api";

const VendorSupport = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showTicketDetailModal, setShowTicketDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const itemsPerPage = 8;

  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [newTicket, setNewTicket] = useState({
    complaint: "",
    category: "general_queries",
    orderId: "",
  });

  const fetchRecentOrders = async () => {
    setLoadingOrders(true);
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const response = await api.get(
        `/api/vendor/orders?status=delivered&limit=100`,
      );
      if (response.data.success) {
        const orders =
          response.data.data || response.data.orders || response.data || [];
        const recentDeliveredOrders = orders
          .filter((order) => {
            if (order.status !== "delivered") return false;
            const deliveredDate = order.deliveredAt
              ? new Date(order.deliveredAt)
              : order.updatedAt
                ? new Date(order.updatedAt)
                : null;
            if (!deliveredDate) return false;
            return deliveredDate >= oneWeekAgo;
          })
          .sort((a, b) => {
            const dateA = a.deliveredAt
              ? new Date(a.deliveredAt)
              : a.updatedAt
                ? new Date(a.updatedAt)
                : new Date(a.createdAt);
            const dateB = b.deliveredAt
              ? new Date(b.deliveredAt)
              : b.updatedAt
                ? new Date(b.updatedAt)
                : new Date(b.createdAt);
            return dateB - dateA;
          });
        setRecentOrders(recentDeliveredOrders);
      }
    } catch (err) {
      setRecentOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const statusFilter = activeTab !== "all" ? activeTab : undefined;
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      const response = await api.get(
        `/api/vendor/tickets?${params.toString()}`,
      );
      if (response.data.success) {
        setTickets(response.data.data.tickets || []);
        setTotalTickets(response.data.data.pagination?.total || 0);
        setTotalPages(response.data.data.pagination?.totalPages || 1);
      } else {
        setError(response.data.message || "Failed to load tickets");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load tickets. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab, currentPage]);

  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await api.get(`/api/vendor/tickets/${ticketId}`);
      if (response.data.success) {
        setSelectedTicket(response.data.data.ticket);
        setShowTicketDetailModal(true);
      } else {
        setError(response.data.message || "Failed to load ticket details");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ticket details");
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.complaint || newTicket.complaint.trim().length < 10) {
      setError("Complaint must be at least 10 characters long");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        complaint: newTicket.complaint.trim(),
        category: newTicket.category,
      };
      if (newTicket.orderId) payload.orderId = newTicket.orderId;
      const response = await api.post("/api/vendor/tickets", payload);
      if (response.data.success) {
        setShowNewTicketModal(false);
        setNewTicket({
          complaint: "",
          category: "general_queries",
          orderId: "",
        });
        fetchTickets();
      } else {
        setError(response.data.message || "Failed to create ticket");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create ticket.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedTicket) return;
    setSendingMessage(true);
    setError("");
    try {
      const response = await api.post(
        `/api/vendor/tickets/${selectedTicket._id}/messages`,
        { message: messageInput.trim() },
      );
      if (response.data.success) {
        setMessageInput("");
        await fetchTicketDetails(selectedTicket._id);
        fetchTickets();
      } else {
        setError(response.data.message || "Failed to send message");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to send message.",
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTickets();
  };

  const stats = [
    {
      label: "Total Tickets",
      value: totalTickets,
      icon: MessageSquare,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
    {
      label: "Active",
      value: tickets.filter((t) => t.status === "active").length,
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Pending",
      value: tickets.filter((t) => t.status === "pending").length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "resolved").length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      label: "Closed",
      value: tickets.filter((t) => t.status === "closed").length,
      icon: CheckCircle,
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
  ];

  const categoryLabels = {
    order_delivery: "Order & Delivery",
    account_profile: "Account & Profile",
    payments_refunds: "Payments & Refunds",
    login_otp: "Login & OTP",
    general_queries: "General Queries",
  };

  const statusConfig = {
    active: {
      label: "Active",
      style:
        "bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100",
      dot: "bg-blue-500",
    },
    pending: {
      label: "Pending",
      style:
        "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      dot: "bg-amber-500",
    },
    resolved: {
      label: "Resolved",
      style:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      dot: "bg-emerald-500",
    },
    closed: {
      label: "Closed",
      style:
        "bg-gray-50 text-gray-600 border border-gray-200 ring-1 ring-gray-100",
      dot: "bg-gray-400",
    },
  };

  const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig.closed;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.style}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
    );
  };

  const CategoryBadge = ({ category }) => (
    <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
      {categoryLabels[category] || category}
    </span>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const tabs = [
    { key: "all", label: "All Tickets" },
    { key: "active", label: "Active" },
    { key: "pending", label: "Pending" },
    { key: "resolved", label: "Resolved" },
    { key: "closed", label: "Closed" },
  ];

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div className="h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse w-[70%]" />
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
              <Ticket className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No tickets found
            </p>
            <p className="text-gray-300 text-xs">
              Raise a new ticket to get support
            </p>
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
      `}</style>

      <div className="px-1 mt-3">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`bg-white rounded-2xl border ${stat.border} shadow-sm p-4 flex items-center justify-between`}
              >
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold mt-0.5 ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tab Pills */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                  }}
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

          {/* Search + New Ticket */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
              <input
                type="text"
                placeholder="Search by Ticket Number or Complaint..."
                className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button
                onClick={handleSearch}
                className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors"
              >
                Search
              </button>
            </div>
            <button
              onClick={() => {
                setShowNewTicketModal(true);
                fetchRecentOrders();
              }}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap h-[38px]"
            >
              <Plus size={15} />
              New Ticket
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Table Card ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Support Tickets
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                {totalTickets} ticket{totalTickets !== 1 ? "s" : ""} total
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                  {[
                    "S.N",
                    "Ticket No.",
                    "Complaint",
                    "Category",
                    "Status",
                    "Messages",
                    "Created At",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 7 ? "text-right pr-5" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {loading && tickets.length === 0 ? (
                <TableSkeleton />
              ) : tickets.length === 0 ? (
                <EmptyState />
              ) : (
                <tbody>
                  {tickets.map((ticket, idx) => (
                    <tr
                      key={ticket._id}
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* S.N */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </span>
                      </td>

                      {/* Ticket Number */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-orange-600 font-semibold group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          {ticket.ticketNumber}
                        </span>
                      </td>

                      {/* Complaint */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="text-sm text-gray-700 truncate">
                          {ticket.complaint}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <CategoryBadge category={ticket.category} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={ticket.status} />
                      </td>

                      {/* Messages */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-100">
                          <MessageSquare className="w-3 h-3" />
                          {ticket.messages?.length || 0}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(ticket.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => fetchTicketDetails(ticket._id)}
                            className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                            title="View Ticket"
                          >
                            <Eye className="w-3.5 h-3.5" />
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

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-1 mt-5 mb-6">
            <p className="text-xs text-gray-400 font-medium">
              Page{" "}
              <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
              of{" "}
              <span className="text-gray-600 font-semibold">{totalPages}</span>
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
                    else if (pages[pages.length - 1] !== "...")
                      pages.push("...");
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── New Ticket Modal ── */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="sticky top-0 bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Raise New Ticket
                </h2>
                <p className="text-xs text-orange-100 mt-0.5">
                  Describe your issue and we'll get back to you
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNewTicketModal(false);
                  setError("");
                  setNewTicket({
                    complaint: "",
                    category: "general_queries",
                    orderId: "",
                  });
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, category: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all bg-white"
                >
                  <option value="general_queries">General Queries</option>
                  <option value="order_delivery">Order & Delivery</option>
                  <option value="account_profile">Account & Profile</option>
                  <option value="payments_refunds">Payments & Refunds</option>
                  <option value="login_otp">Login & OTP</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                  Complaint <span className="text-red-500">*</span>
                  <span className="text-gray-400 normal-case font-normal ml-1">
                    (Min 10 characters)
                  </span>
                </label>
                <textarea
                  value={newTicket.complaint}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, complaint: e.target.value })
                  }
                  placeholder="Describe your issue in detail..."
                  rows="5"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {newTicket.complaint.length} characters
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                  Select Order{" "}
                  <span className="text-gray-400 normal-case font-normal">
                    (Optional — Last 1 Week Delivered)
                  </span>
                </label>
                <select
                  value={newTicket.orderId}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, orderId: e.target.value })
                  }
                  disabled={loadingOrders}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all bg-white disabled:opacity-50"
                >
                  <option value="">
                    {loadingOrders
                      ? "Loading orders..."
                      : recentOrders.length === 0
                        ? "No recent delivered orders"
                        : "Select an order (optional)"}
                  </option>
                  {recentOrders.map((order) => {
                    const orderNumber =
                      order.orderNumber || order.orderId || order._id;
                    const amount =
                      order.totalAmount ||
                      order.vendorSubtotal ||
                      order.amount ||
                      "N/A";
                    const deliveryDate =
                      order.deliveredAt || order.updatedAt || order.createdAt;
                    return (
                      <option key={order._id} value={order._id}>
                        {orderNumber} —{" "}
                        {amount !== "N/A" ? `₹${amount}` : amount} —{" "}
                        {formatDate(deliveryDate)}
                      </option>
                    );
                  })}
                </select>
                {recentOrders.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {recentOrders.length} delivered order(s) from last 1 week
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  setShowNewTicketModal(false);
                  setError("");
                  setNewTicket({
                    complaint: "",
                    category: "general_queries",
                    orderId: "",
                  });
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={
                  !newTicket.complaint ||
                  newTicket.complaint.trim().length < 10 ||
                  loading
                }
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ticket Detail Modal ── */}
      {showTicketDetailModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="sticky top-0 bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Ticket: {selectedTicket.ticketNumber}
                </h2>
                <p className="text-xs text-orange-100 mt-0.5">
                  {formatDate(selectedTicket.createdAt)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTicketDetailModal(false);
                  setSelectedTicket(null);
                  setMessageInput("");
                  setError("");
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                    Status
                  </p>
                  <StatusBadge status={selectedTicket.status} />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                    Category
                  </p>
                  <CategoryBadge category={selectedTicket.category} />
                </div>
              </div>

              {/* Complaint */}
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                  Complaint
                </p>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {selectedTicket.complaint}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Messages
                  </p>
                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-orange-100">
                    <MessageSquare className="w-3 h-3" />
                    {selectedTicket.messages?.length || 0}
                  </span>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto rounded-xl border border-gray-100 p-4 bg-gray-50">
                  {selectedTicket.messages &&
                  selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-sm ${
                          msg.senderModel === "Vendor"
                            ? "bg-orange-50 border border-orange-100 ml-4"
                            : "bg-blue-50 border border-blue-100 mr-4"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-xs font-semibold ${msg.senderModel === "Vendor" ? "text-orange-600" : "text-blue-600"}`}
                          >
                            {msg.senderModel === "Vendor"
                              ? msg.sender?.vendorName ||
                                msg.sender?.storeName ||
                                "You"
                              : msg.sender?.name || "Admin"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No messages yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Message */}
              {selectedTicket.status !== "closed" && (
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                    Add Message
                  </p>
                  <div className="flex gap-2">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      rows="3"
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all resize-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendingMessage}
                      className="px-4 bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1.5"
                    >
                      <Send size={16} />
                      <span className="text-xs">
                        {sendingMessage ? "..." : "Send"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {selectedTicket.status === "closed" && (
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
                  <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-500">
                    This ticket is closed. No further messages can be added.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  setShowTicketDetailModal(false);
                  setSelectedTicket(null);
                  setMessageInput("");
                  setError("");
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-600 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default VendorSupport;
