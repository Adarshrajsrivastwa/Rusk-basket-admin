import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  MessageSquare,
  User,
  X,
  Star,
  Send,
} from "lucide-react";
import api from "../../api/api";
import { BASE_URL } from "../../api/api";

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

  // Fetch recent delivered orders (last 1 week)
  const fetchRecentOrders = async () => {
    setLoadingOrders(true);
    try {
      // Calculate date 1 week ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Fetch orders with delivered status
      const response = await api.get(
        `/api/vendor/orders?status=delivered&limit=100`,
      );

      if (response.data.success) {
        // Handle different response structures
        const orders =
          response.data.data || response.data.orders || response.data || [];

        // Filter orders delivered in last 1 week
        const recentDeliveredOrders = orders.filter((order) => {
          // Check if order has delivered status
          if (order.status !== "delivered") return false;

          // Check if order has a delivery date
          const deliveredDate = order.deliveredAt
            ? new Date(order.deliveredAt)
            : order.updatedAt
              ? new Date(order.updatedAt)
              : null;

          if (!deliveredDate) return false;

          // Check if delivered within last 1 week
          return deliveredDate >= oneWeekAgo;
        });

        // Sort by most recent first
        recentDeliveredOrders.sort((a, b) => {
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
      console.error("Error fetching recent orders:", err);
      // Don't show error, just set empty array
      setRecentOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const statusFilter = activeTab !== "all" ? activeTab : undefined;
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (statusFilter) {
        params.append("status", statusFilter);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

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
      console.error("Error fetching tickets:", err);
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

  // Fetch single ticket details
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
      console.error("Error fetching ticket details:", err);
      setError(err.response?.data?.message || "Failed to load ticket details");
    }
  };

  // Create new ticket
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
      if (newTicket.orderId) {
        payload.orderId = newTicket.orderId;
      }

      const response = await api.post("/api/vendor/tickets", payload);
      if (response.data.success) {
        setShowNewTicketModal(false);
        setNewTicket({
          complaint: "",
          category: "general_queries",
          orderId: "",
        });
        fetchTickets(); // Refresh list
      } else {
        setError(response.data.message || "Failed to create ticket");
      }
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create ticket. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Add message to ticket
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
        return " text-blue-700";
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
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 ml-6">
        <div className="max-w-8xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.total}
                  </p>
                </div>
                <MessageSquare className="text-orange-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.active}
                  </p>
                </div>
                <AlertCircle className="text-orange-500" size={24} />
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

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.resolved}
                  </p>
                </div>
                <CheckCircle className="text-orange-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Closed</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.closed}
                  </p>
                </div>
                <CheckCircle className="text-orange-500" size={24} />
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
                        ? "bg-orange-500 text-white"
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
                        ? "bg-orange-500 text-white"
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
                        ? "bg-orange-500 text-white"
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
                        ? "bg-orange-500 text-white"
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
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Closed
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowNewTicketModal(true);
                    fetchRecentOrders(); // Fetch orders when modal opens
                  }}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors font-medium"
                >
                  <Plus size={20} />
                  New Ticket
                </button>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors font-medium"
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
                    <thead className="bg-orange-500 text-black">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          S.N
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold ">
                          Ticket Number
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
                            <span className="font-medium text-orange-600">
                              {ticket.ticketNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="text-sm text-gray-900 truncate">
                                {ticket.complaint}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className=" text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
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
                            <span className=" text-orange-600 text-xs px-2 py-1 rounded-sm">
                              {ticket.messages?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {formatDate(ticket.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => fetchTicketDetails(ticket._id)}
                              className=" text-orange-600 px-3 py-1 rounded text-sm font-bold hover:bg-orange-100 transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {tickets.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No tickets found</p>
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
                        ? "text-orange-600 font-semibold"
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

        {/* New Ticket Modal */}
        {showNewTicketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-orange-500 text-white rounded-t-lg">
                <h2 className="text-2xl font-bold">Raise New Ticket</h2>
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
                  className="text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="general_queries">General Queries</option>
                    <option value="order_delivery">Order & Delivery</option>
                    <option value="account_profile">Account & Profile</option>
                    <option value="payments_refunds">Payments & Refunds</option>
                    <option value="login_otp">Login & OTP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint * (Min 10 characters)
                  </label>
                  <textarea
                    value={newTicket.complaint}
                    onChange={(e) =>
                      setNewTicket({
                        ...newTicket,
                        complaint: e.target.value,
                      })
                    }
                    placeholder="Describe your issue in detail..."
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Order (Optional) - Last 1 Week Delivered Orders
                  </label>
                  <select
                    value={newTicket.orderId}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, orderId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={loadingOrders}
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
                          {orderNumber} -{" "}
                          {amount !== "N/A" ? `₹${amount}` : amount} -{" "}
                          {formatDate(deliveryDate)}
                        </option>
                      );
                    })}
                  </select>
                  {recentOrders.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Showing {recentOrders.length} delivered order(s) from last
                      1 week
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-4 justify-end">
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
                  className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
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
                  className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Detail Modal */}
        {showTicketDetailModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-orange-500 text-white rounded-t-lg">
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
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                          selectedTicket.status,
                        )}`}
                      >
                        {statusLabels[selectedTicket.status] ||
                          selectedTicket.status}
                      </span>
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
                            msg.senderModel === "Vendor"
                              ? "bg-orange-50 border-l-4 border-orange-500"
                              : "bg-blue-50 border-l-4 border-blue-500"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">
                              {msg.senderModel === "Vendor"
                                ? msg.sender?.vendorName ||
                                  msg.sender?.storeName ||
                                  "You"
                                : msg.sender?.name || "Admin"}
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
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sendingMessage}
                        className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
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

export default VendorSupport;
