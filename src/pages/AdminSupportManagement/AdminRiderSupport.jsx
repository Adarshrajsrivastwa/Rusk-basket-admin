import React, { useState, useEffect, useCallback, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  X,
  Send,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../api/api";

const AdminRiderSupport = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showTicketDetailModal, setShowTicketDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const itemsPerPage = 8;

  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const searchQueryRef = useRef(searchQuery);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTicket?.messages]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const statusFilter = activeTab !== "all" ? activeTab : undefined;
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        createdByModel: "Rider",
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchQueryRef.current)
        params.append("search", searchQueryRef.current);

      const response = await api.get(`/api/admin/tickets?${params.toString()}`);
      if (response.data && response.data.success) {
        const ticketsData = response.data.data?.tickets || [];
        const paginationData = response.data.data?.pagination || {};
        setTickets(ticketsData);
        setTotalTickets(paginationData.total || 0);
        setTotalPages(paginationData.totalPages || paginationData.pages || 1);
        setError("");
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load tickets",
        );
        setTickets([]);
        setTotalTickets(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to load tickets.",
      );
      setTickets([]);
      setTotalTickets(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await api.get(`/api/admin/tickets/${ticketId}`);
      if (response.data.success) {
        setSelectedTicket(response.data.data.ticket);
        setShowTicketDetailModal(true);
        setStatusUpdate(response.data.data.ticket.status);
        setAdminResponse(response.data.data.ticket.adminResponse || "");
      } else {
        setError(response.data.message || "Failed to load ticket details");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ticket details");
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedTicket) return;
    setSendingMessage(true);
    setError("");
    try {
      const response = await api.post(
        `/api/admin/tickets/${selectedTicket._id}/messages`,
        {
          message: messageInput.trim(),
        },
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
          "Failed to send message. Please try again.",
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !statusUpdate) return;
    setUpdatingStatus(true);
    setError("");
    try {
      const payload = { status: statusUpdate };
      if (adminResponse) payload.adminResponse = adminResponse;
      const response = await api.patch(
        `/api/admin/tickets/${selectedTicket._id}/status`,
        payload,
      );
      if (response.data.success) {
        await fetchTicketDetails(selectedTicket._id);
        fetchTickets();
      } else {
        setError(response.data.message || "Failed to update status");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update status. Please try again.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTickets();
  };

  const stats = {
    total: totalTickets,
    active: tickets.filter((t) => t.status === "active").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

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
      className:
        "bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100",
      dot: "bg-blue-500",
    },
    pending: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      dot: "bg-amber-500",
    },
    resolved: {
      label: "Resolved",
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      dot: "bg-emerald-500",
    },
    closed: {
      label: "Closed",
      className:
        "bg-gray-100 text-gray-500 border border-gray-200 ring-1 ring-gray-100",
      dot: "bg-gray-400",
    },
  };

  const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig.closed;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 8 ? "w-16 ml-auto" : "w-[70%]"}`}
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
        <td colSpan="9" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No tickets found
            </p>
            <p className="text-gray-300 text-xs">
              {searchQueryRef.current
                ? "No tickets match your search criteria."
                : "No tickets available at the moment."}
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "pending", label: "Pending" },
    { key: "resolved", label: "Resolved" },
    { key: "closed", label: "Closed" },
  ];

  const statCards = [
    {
      label: "Total Tickets",
      value: stats.total,
      icon: MessageSquare,
      border: "border-[#FF7B1D]",
      text: "text-[#FF7B1D]",
      iconColor: "text-[#FF7B1D]",
    },
    {
      label: "Active",
      value: stats.active,
      icon: AlertCircle,
      border: "border-blue-500",
      text: "text-blue-600",
      iconColor: "text-blue-500",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      border: "border-amber-400",
      text: "text-amber-500",
      iconColor: "text-amber-400",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      border: "border-emerald-500",
      text: "text-emerald-600",
      iconColor: "text-emerald-500",
    },
    {
      label: "Closed",
      value: stats.closed,
      icon: CheckCircle,
      border: "border-gray-400",
      text: "text-gray-500",
      iconColor: "text-gray-400",
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
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-animate { animation: modalIn 0.22s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div className="min-h-screen px-1 pt-4">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5 max-w-full">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 ${card.border} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold mt-0.5 ${card.text}`}>
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center`}
                >
                  <card.icon className={card.iconColor} size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
          {/* LEFT: Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
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

          {/* RIGHT: Search */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[400px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by ticket number or complaint..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors flex items-center gap-1.5"
            >
              <Search size={14} /> Search
            </button>
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-3 text-sm flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
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
                Rider Support Tickets
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                {tickets.length} of {totalTickets} tickets
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
                    "Rider",
                    "Complaint",
                    "Category",
                    "Status",
                    "Messages",
                    "Created At",
                    "Action",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 8 ? "text-right pr-5" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {loading ? (
                <TableSkeleton />
              ) : tickets.length === 0 ? (
                <EmptyState />
              ) : (
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr
                      key={ticket._id}
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* S.N */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                      </td>

                      {/* Ticket No */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-orange-50 border border-orange-200 px-2 py-1 rounded-md text-orange-600 font-semibold">
                          {ticket.ticketNumber}
                        </span>
                      </td>

                      {/* Rider */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <Truck size={12} className="text-[#FF7B1D]" />
                          </div>
                          <span className="text-gray-700 text-sm font-medium">
                            {ticket.rider?.fullName || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Complaint */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="text-gray-600 text-xs truncate">
                          {ticket.complaint}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                          {categoryLabels[ticket.category] || ticket.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={ticket.status} />
                      </td>

                      {/* Messages */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                          <MessageSquare size={10} />
                          {ticket.messages?.length || 0}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        {formatDate(ticket.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex justify-end">
                          <button
                            onClick={() => fetchTicketDetails(ticket._id)}
                            className="action-btn bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-700"
                            title="View Ticket"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
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
        {!loading && tickets.length > 0 && (
          <div className="flex items-center justify-between mt-5 mb-6">
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

      {/* ── Ticket Detail Modal ── */}
      {showTicketDetailModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="modal-animate bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-base font-bold text-white">
                  Ticket:{" "}
                  <span className="font-mono">
                    {selectedTicket.ticketNumber}
                  </span>
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  {formatDate(selectedTicket.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedTicket.status} />
                <button
                  onClick={() => {
                    setShowTicketDetailModal(false);
                    setSelectedTicket(null);
                    setMessageInput("");
                    setError("");
                    setStatusUpdate("");
                    setAdminResponse("");
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium mb-1.5">
                    Rider
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <Truck size={13} className="text-[#FF7B1D]" />
                    </div>
                    <span className="text-gray-800 text-sm font-semibold">
                      {selectedTicket.rider?.fullName || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium mb-1.5">
                    Category
                  </p>
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                    {categoryLabels[selectedTicket.category] ||
                      selectedTicket.category}
                  </span>
                </div>
              </div>

              {/* Complaint */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  Complaint
                </p>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed">
                  {selectedTicket.complaint}
                </div>
              </div>

              {/* Status + Admin Response */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1.5">
                    Update Status
                  </p>
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white text-gray-700 transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1.5">
                    Admin Response{" "}
                    <span className="text-gray-300">(Optional)</span>
                  </p>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Add your response..."
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white text-gray-700 resize-none transition-all placeholder:text-gray-300"
                  />
                </div>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || !statusUpdate}
                  className="w-fit px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {updatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>

              {/* Messages */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-2">
                  Messages{" "}
                  <span className="text-gray-300">
                    ({selectedTicket.messages?.length || 0})
                  </span>
                </p>
                <div className="space-y-2.5 max-h-64 overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gray-50">
                  {selectedTicket.messages &&
                  selectedTicket.messages.length > 0 ? (
                    <>
                      {selectedTicket.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl text-xs ${
                            msg.senderModel === "Rider"
                              ? "bg-white border border-emerald-100 border-l-4 border-l-emerald-400"
                              : msg.senderModel === "Admin"
                                ? "bg-white border border-orange-100 border-l-4 border-l-[#FF7B1D]"
                                : "bg-white border border-gray-100"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-800">
                              {msg.senderModel === "Rider"
                                ? msg.sender?.fullName || "Rider"
                                : msg.senderModel === "Admin"
                                  ? msg.sender?.name || "Admin"
                                  : "Unknown"}
                            </span>
                            <span className="text-gray-400 text-[10px]">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-6">
                      <MessageSquare size={24} className="text-gray-200" />
                      <p className="text-gray-300 text-xs">No messages yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Message */}
              {selectedTicket.status !== "closed" && (
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1.5">
                    Add Message
                  </p>
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      rows="3"
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm text-gray-700 resize-none transition-all placeholder:text-gray-300"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendingMessage}
                      className="px-4 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shrink-0"
                    >
                      <Send size={14} />
                      {sendingMessage ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowTicketDetailModal(false);
                    setSelectedTicket(null);
                    setMessageInput("");
                    setError("");
                    setStatusUpdate("");
                    setAdminResponse("");
                  }}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminRiderSupport;
