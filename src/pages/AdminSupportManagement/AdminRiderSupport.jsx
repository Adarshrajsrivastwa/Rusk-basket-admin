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

  // Update ref when searchQuery changes
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const statusFilter = activeTab !== "all" ? activeTab : undefined;
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        createdByModel: "Rider", // Filter by Rider
      });
      if (statusFilter) {
        params.append("status", statusFilter);
      }
      if (searchQueryRef.current) {
        params.append("search", searchQueryRef.current);
      }

      const response = await api.get(`/api/admin/tickets?${params.toString()}`);
      if (response.data && response.data.success) {
        const ticketsData = response.data.data?.tickets || [];
        const paginationData = response.data.data?.pagination || {};

        setTickets(ticketsData);
        setTotalTickets(paginationData.total || 0);
        setTotalPages(paginationData.totalPages || paginationData.pages || 1);
        setError(""); // Clear any previous errors
      } else {
        const errorMsg =
          response.data?.message ||
          response.data?.error ||
          "Failed to load tickets";
        setError(errorMsg);
        setTickets([]);
        setTotalTickets(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load tickets. Please try again.";
      setError(errorMsg);
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

  // Fetch single ticket details
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
      console.error("Error fetching ticket details:", err);
      setError(err.response?.data?.message || "Failed to load ticket details");
    }
  };

  // Add admin message to ticket
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedTicket) return;

    setSendingMessage(true);
    setError("");
    try {
      const response = await api.post(
        `/api/admin/tickets/${selectedTicket._id}/messages`,
        { message: messageInput.trim() },
      );
      if (response.data.success) {
        setMessageInput("");
        // Refresh ticket details
        await fetchTicketDetails(selectedTicket._id);
        // Refresh tickets list
        fetchTickets();
      } else {
        setError(response.data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setSendingMessage(false);
    }
  };

  // Update ticket status
  const handleUpdateStatus = async () => {
    if (!selectedTicket || !statusUpdate) return;

    setUpdatingStatus(true);
    setError("");
    try {
      const payload = { status: statusUpdate };
      if (adminResponse) {
        payload.adminResponse = adminResponse;
      }

      const response = await api.patch(
        `/api/admin/tickets/${selectedTicket._id}/status`,
        payload,
      );
      if (response.data.success) {
        // Refresh ticket details
        await fetchTicketDetails(selectedTicket._id);
        // Refresh tickets list
        fetchTickets();
      } else {
        setError(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update status. Please try again.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Search handler
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

  const statusLabels = {
    active: "Active",
    pending: "Pending",
    resolved: "Resolved",
    closed: "Closed",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Rider Support
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-[#FF7B1D]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-[#FF7B1D]">
                    {stats.total}
                  </p>
                </div>
                <MessageSquare className="text-[#FF7B1D]" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.active}
                  </p>
                </div>
                <AlertCircle className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="text-orange-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-[#247606]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-[#247606]">
                    {stats.resolved}
                  </p>
                </div>
                <CheckCircle className="text-[#247606]" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-gray-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Closed</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {stats.closed}
                  </p>
                </div>
                <CheckCircle className="text-gray-500" size={24} />
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-sm shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setActiveTab("all");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      activeTab === "all"
                        ? "bg-[#FF7B1D] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    All Tickets
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("active");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      activeTab === "active"
                        ? "bg-[#FF7B1D] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("pending");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      activeTab === "pending"
                        ? "bg-[#FF7B1D] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("resolved");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      activeTab === "resolved"
                        ? "bg-[#FF7B1D] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Resolved
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("closed");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      activeTab === "closed"
                        ? "bg-[#FF7B1D] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Closed
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by Ticket Number or Complaint..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-[#FF7B1D] text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Tickets List */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            {loading && tickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading tickets...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#FF7B1D] text-black">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          S.N
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Ticket Number
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Rider
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Complaint
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Messages
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tickets.map((ticket, index) => (
                        <tr
                          key={ticket._id}
                          className="hover:bg-orange-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-[#FF7B1D]">
                              {ticket.ticketNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Truck size={16} className="text-[#FF7B1D]" />
                              <span className="text-sm text-gray-900">
                                {ticket.rider?.fullName || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="text-sm text-gray-900 truncate">
                                {ticket.complaint}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                              {categoryLabels[ticket.category] ||
                                ticket.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                                ticket.status,
                              )}`}
                            >
                              {statusLabels[ticket.status] || ticket.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-sm">
                              {ticket.messages?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {formatDate(ticket.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => fetchTicketDetails(ticket._id)}
                              className="bg-[#FF7B1D] text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {tickets.length === 0 && !loading && !error && (
                  <div className="text-center py-12">
                    <MessageSquare
                      className="mx-auto text-gray-400 mb-4"
                      size={48}
                    />
                    <p className="text-gray-500 text-lg font-medium">
                      No Tickets Found
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {searchQueryRef.current
                        ? "No tickets match your search criteria"
                        : "There are no tickets available at the moment"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium rounded hover:bg-orange-600 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Back
              </button>

              <div className="flex items-center gap-2 text-sm text-black font-medium">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-2 py-1 rounded transition-colors ${
                      currentPage === idx + 1
                        ? "text-[#FF7B1D] font-semibold"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="bg-[#247606] text-white px-10 py-3 text-sm font-medium rounded hover:bg-green-800 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Ticket Detail Modal */}
        {showTicketDetailModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-[#FF7B1D] text-white rounded-t-lg">
                <div>
                  <h2 className="text-2xl font-bold">
                    Ticket: {selectedTicket.ticketNumber}
                  </h2>
                  <p className="text-sm mt-1">
                    {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTicketDetailModal(false);
                    setSelectedTicket(null);
                    setMessageInput("");
                    setError("");
                    setStatusUpdate("");
                    setAdminResponse("");
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Ticket Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Rider
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Truck size={16} className="text-[#FF7B1D]" />
                      <span className="text-gray-900">
                        {selectedTicket.rider?.fullName || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        value={statusUpdate}
                        onChange={(e) => setStatusUpdate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Category
                    </label>
                    <div className="mt-1">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        {categoryLabels[selectedTicket.category] ||
                          selectedTicket.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Complaint
                  </label>
                  <div className="mt-1 p-4 bg-gray-50 rounded border">
                    <p className="text-gray-900">{selectedTicket.complaint}</p>
                  </div>
                </div>

                {/* Admin Response */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Admin Response (Optional)
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Add your response..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent"
                  />
                </div>

                {/* Update Status Button */}
                <div>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus || !statusUpdate}
                    className="bg-[#FF7B1D] text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {updatingStatus ? "Updating..." : "Update Status"}
                  </button>
                </div>

                {/* Messages */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Messages ({selectedTicket.messages?.length || 0})
                  </label>
                  <div className="space-y-3 max-h-96 overflow-y-auto border rounded p-4">
                    {selectedTicket.messages &&
                    selectedTicket.messages.length > 0 ? (
                      selectedTicket.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded ${
                            msg.senderModel === "Rider"
                              ? "bg-green-50 border-l-4 border-[#247606]"
                              : msg.senderModel === "Admin"
                                ? "bg-orange-50 border-l-4 border-[#FF7B1D]"
                                : "bg-gray-50 border-l-4 border-gray-500"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">
                              {msg.senderModel === "Rider"
                                ? msg.sender?.fullName || "Rider"
                                : msg.senderModel === "Admin"
                                  ? msg.sender?.name || "Admin"
                                  : "Unknown"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{msg.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No messages yet</p>
                    )}
                  </div>
                </div>

                {/* Add Message */}
                {selectedTicket.status !== "closed" && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Add Message
                    </label>
                    <div className="flex gap-2">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        rows="3"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FF7B1D] focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sendingMessage}
                        className="bg-[#FF7B1D] text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send size={18} />
                        {sendingMessage ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowTicketDetailModal(false);
                    setSelectedTicket(null);
                    setMessageInput("");
                    setError("");
                    setStatusUpdate("");
                    setAdminResponse("");
                  }}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminRiderSupport;
