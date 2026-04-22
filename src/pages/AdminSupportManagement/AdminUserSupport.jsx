import React, { useState, useEffect, useCallback, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  X,
  Send,
  User,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import api from "../../api/api";

/* ─── Status badge ────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    active: {
      style:
        "bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100",
      dot: "bg-blue-500",
      label: "Active",
    },
    pending: {
      style:
        "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      dot: "bg-amber-500",
      label: "Pending",
    },
    resolved: {
      style:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      dot: "bg-emerald-500",
      label: "Resolved",
    },
    closed: {
      style:
        "bg-gray-100 text-gray-600 border border-gray-200 ring-1 ring-gray-100",
      dot: "bg-gray-400",
      label: "Closed",
    },
  };
  const cfg = map[status] || map.closed;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/* ─── Table skeleton ──────────────────────────────────────────────── */
const TableSkeleton = () => (
  <tbody>
    {Array.from({ length: 10 }).map((_, i) => (
      <tr key={i} className="border-b border-gray-100">
        {Array.from({ length: 9 }).map((__, j) => (
          <td key={j} className="px-4 py-3.5">
            <div
              className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${
                j === 1 ? "w-24" : j === 8 ? "w-16 ml-auto" : "w-[70%]"
              }`}
            />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

/* ─── Empty state ─────────────────────────────────────────────────── */
const EmptyState = ({ searching }) => (
  <tbody>
    <tr>
      <td colSpan="9" className="py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-orange-300" />
          </div>
          <p className="text-gray-400 text-sm font-medium">No Tickets Found</p>
          <p className="text-gray-300 text-xs">
            {searching
              ? "No tickets match your search criteria"
              : "There are no tickets available at the moment"}
          </p>
        </div>
      </td>
    </tr>
  </tbody>
);

/* ─── Constants ───────────────────────────────────────────────────── */
const categoryLabels = {
  order_delivery: "Order & Delivery",
  account_profile: "Account & Profile",
  payments_refunds: "Payments & Refunds",
  login_otp: "Login & OTP",
  general_queries: "General Queries",
};

const formatDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ═══════════════════════════════════════════════════════════════════ */
const AdminUserSupport = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
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

  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  /* Refs — stable, never trigger re-renders */
  const searchRef = useRef(searchQuery);
  const activeTabRef = useRef(activeTab);
  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    searchRef.current = searchQuery;
  }, [searchQuery]);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  /* ── Core fetch — stable callback (empty deps, reads via refs) ── */
  const fetchTickets = useCallback(
    async (pageOverride = null, searchOverride = null) => {
      setLoading(true);
      setError("");
      try {
        const tab = activeTabRef.current;
        const page = pageOverride ?? currentPageRef.current;
        const search = searchOverride ?? searchRef.current;

        const params = new URLSearchParams({
          page: page.toString(),
          limit: itemsPerPage.toString(),
          createdByModel: "User",
        });
        if (tab !== "all") params.append("status", tab);
        if (search?.trim()) params.append("search", search.trim());

        const res = await api.get(`/api/admin/tickets?${params}`);
        if (res.data?.success) {
          const data = res.data.data?.tickets || [];
          const pg = res.data.data?.pagination || {};
          setTickets(data);
          setTotalTickets(pg.total || 0);
          setTotalPages(pg.totalPages || pg.pages || 1);
        } else {
          setError(res.data?.message || "Failed to load tickets");
          setTickets([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to load tickets.",
        );
        setTickets([]);
      } finally {
        setLoading(false);
      }
    },
    [], // stable
  );

  /* Trigger on tab / page change */
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  /* ── Ticket detail ── */
  const fetchTicketDetails = async (id) => {
    try {
      const res = await api.get(`/api/admin/tickets/${id}`);
      if (res.data.success) {
        const t = res.data.data.ticket;
        setSelectedTicket(t);
        setStatusUpdate(t.status);
        setAdminResponse(t.adminResponse || "");
        setShowModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ticket details");
    }
  };

  /* ── Send message ── */
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedTicket) return;
    setSendingMessage(true);
    try {
      const res = await api.post(
        `/api/admin/tickets/${selectedTicket._id}/messages`,
        { message: messageInput.trim() },
      );
      if (res.data.success) {
        setMessageInput("");
        await fetchTicketDetails(selectedTicket._id);
        fetchTickets();
      } else setError(res.data.message || "Failed to send message");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to send message",
      );
    } finally {
      setSendingMessage(false);
    }
  };

  /* ── Update status ── */
  const handleUpdateStatus = async () => {
    if (!selectedTicket || !statusUpdate) return;
    setUpdatingStatus(true);
    try {
      const payload = { status: statusUpdate };
      if (adminResponse) payload.adminResponse = adminResponse;
      const res = await api.patch(
        `/api/admin/tickets/${selectedTicket._id}/status`,
        payload,
      );
      if (res.data.success) {
        await fetchTicketDetails(selectedTicket._id);
        fetchTickets();
      } else setError(res.data.message || "Failed to update status");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update status",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTickets(1, searchQuery);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
    setMessageInput("");
    setError("");
    setStatusUpdate("");
    setAdminResponse("");
  };

  /* ── Counts ── */
  const statTotal = totalTickets;
  const statActive = tickets.filter((t) => t.status === "active").length;
  const statPending = tickets.filter((t) => t.status === "pending").length;
  const statResolved = tickets.filter((t) => t.status === "resolved").length;
  const statClosed = tickets.filter((t) => t.status === "closed").length;

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "pending", label: "Pending" },
    { key: "resolved", label: "Resolved" },
    { key: "closed", label: "Closed" },
  ];

  /* ── Pagination pages array ── */
  const buildPages = () => {
    const pages = [];
    const visible = new Set([
      1,
      2,
      totalPages - 1,
      totalPages,
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ]);
    for (let i = 1; i <= totalPages; i++) {
      if (visible.has(i)) pages.push(i);
      else if (pages[pages.length - 1] !== "...") pages.push("...");
    }
    return pages;
  };

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */
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
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div className="min-h-screen p-4">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
          {[
            {
              label: "Total Tickets",
              value: statTotal,
              border: "border-[#FF7B1D]",
              text: "text-[#FF7B1D]",
              iconBg: "bg-orange-50",
              icon: <MessageSquare className="w-5 h-5 text-[#FF7B1D]" />,
            },
            {
              label: "Active",
              value: statActive,
              border: "border-blue-500",
              text: "text-blue-600",
              iconBg: "bg-blue-50",
              icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
            },
            {
              label: "Pending",
              value: statPending,
              border: "border-amber-500",
              text: "text-amber-600",
              iconBg: "bg-amber-50",
              icon: <Clock className="w-5 h-5 text-amber-500" />,
            },
            {
              label: "Resolved",
              value: statResolved,
              border: "border-emerald-500",
              text: "text-emerald-600",
              iconBg: "bg-emerald-50",
              icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
            },
            {
              label: "Closed",
              value: statClosed,
              border: "border-gray-400",
              text: "text-gray-600",
              iconBg: "bg-gray-100",
              icon: <CheckCircle className="w-5 h-5 text-gray-400" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${s.border} px-4 py-3 flex items-center justify-between`}
            >
              <div>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${s.text}`}>
                  {s.value}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}
              >
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar: Tabs + Search ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 px-1">
          {/* Tab pills */}
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

          {/* Search bar */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by ticket number or complaint…"
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* ── Table Card ── */}
        <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                User Support Tickets
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
                    "User",
                    "Complaint",
                    "Category",
                    "Status",
                    "Messages",
                    "Created At",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${
                        i === 0
                          ? "text-left w-12"
                          : i === 8
                            ? "text-right pr-5"
                            : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {loading ? (
                <TableSkeleton />
              ) : tickets.length === 0 ? (
                <EmptyState searching={!!searchQuery.trim()} />
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

                      {/* Ticket No */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-orange-600 font-semibold group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          {ticket.ticketNumber}
                        </span>
                      </td>

                      {/* User */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <User
                            size={13}
                            className="text-orange-400 shrink-0"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {ticket.user?.userName || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Complaint */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="text-xs text-gray-600 truncate">
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
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                          <MessageSquare size={11} />
                          {ticket.messages?.length || 0}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(ticket.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => fetchTicketDetails(ticket._id)}
                            className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                            title="View ticket"
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
        {!loading && tickets.length > 0 && (
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
                {buildPages().map((page, idx) =>
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
                )}
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

      {/* ══════════════════════════════════════════════════════════════
          Ticket Detail Modal
      ══════════════════════════════════════════════════════════════ */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-gray-100">
            {/* Modal header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Ticket #{selectedTicket.ticketNumber}
                </h2>
                <p className="text-xs text-orange-100 mt-0.5">
                  {formatDate(selectedTicket.createdAt)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1 font-medium">User</p>
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-orange-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      {selectedTicket.user?.userName || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1 font-medium">
                    Category
                  </p>
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                    {categoryLabels[selectedTicket.category] ||
                      selectedTicket.category}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-2 font-medium">
                    Update Status
                  </p>
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white text-gray-700"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Complaint */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  Complaint
                </p>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                  {selectedTicket.complaint}
                </div>
              </div>

              {/* Admin response + update button */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  Admin Response{" "}
                  <span className="text-gray-300">(optional)</span>
                </p>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Type your response…"
                  rows="3"
                  className="w-full text-sm px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                />
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || !statusUpdate}
                  className="mt-2 bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-semibold px-5 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {updatingStatus ? "Updating…" : "Update Status"}
                </button>
              </div>

              {/* Messages thread */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  Messages ({selectedTicket.messages?.length || 0})
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto rounded-xl border border-gray-100 p-3 bg-gray-50">
                  {selectedTicket.messages?.length ? (
                    selectedTicket.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl text-sm ${
                          msg.senderModel === "User"
                            ? "bg-blue-50 border-l-4 border-blue-400"
                            : msg.senderModel === "Admin"
                              ? "bg-orange-50 border-l-4 border-orange-400"
                              : "bg-white border-l-4 border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-semibold text-gray-700">
                            {msg.senderModel === "User"
                              ? msg.sender?.userName || "User"
                              : msg.senderModel === "Admin"
                                ? msg.sender?.name || "Admin"
                                : "Unknown"}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-xs text-center py-4">
                      No messages yet
                    </p>
                  )}
                </div>
              </div>

              {/* Add message */}
              {selectedTicket.status !== "closed" && (
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1.5">
                    Add Message
                  </p>
                  <div className="flex gap-2">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message…"
                      rows="3"
                      className="flex-1 text-sm px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendingMessage}
                      className="bg-[#FF7B1D] hover:bg-orange-500 text-white px-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex flex-col items-center justify-center gap-1"
                    >
                      <Send size={16} />
                      <span className="text-xs font-semibold">
                        {sendingMessage ? "…" : "Send"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
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

export default AdminUserSupport;
