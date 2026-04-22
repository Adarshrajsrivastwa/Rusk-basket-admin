import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FiBell,
  FiCheckCircle,
  FiInfo,
  FiAlertCircle,
  FiClock,
  FiShoppingCart,
  FiCreditCard,
  FiX,
} from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api/api";

// Helper function to decode JWT token (for debugging)
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const getNotificationIcon = (type) => {
  const iconMap = {
    order_created: FiShoppingCart,
    order_updated: FiInfo,
    order_cancelled: FiAlertCircle,
    order_delivered: FiCheckCircle,
    product_approved: FiCheckCircle,
    product_rejected: FiAlertCircle,
    invoice_generated: FiCreditCard,
    payment_received: FiCreditCard,
    ticket_created: FiAlertCircle,
    general: FiInfo,
  };
  return iconMap[type] || FiInfo;
};

const getIconColor = (type) => {
  const colorMap = {
    order_created: "text-blue-500",
    order_updated: "text-amber-500",
    order_cancelled: "text-red-500",
    order_delivered: "text-emerald-500",
    product_approved: "text-emerald-500",
    product_rejected: "text-red-500",
    invoice_generated: "text-purple-500",
    payment_received: "text-emerald-500",
    ticket_created: "text-orange-500",
    general: "text-orange-500",
  };
  return colorMap[type] || "text-orange-500";
};

const getIconBg = (type) => {
  const bgMap = {
    order_created: "bg-blue-50 border-blue-100",
    order_updated: "bg-amber-50 border-amber-100",
    order_cancelled: "bg-red-50 border-red-100",
    order_delivered: "bg-emerald-50 border-emerald-100",
    product_approved: "bg-emerald-50 border-emerald-100",
    product_rejected: "bg-red-50 border-red-100",
    invoice_generated: "bg-purple-50 border-purple-100",
    payment_received: "bg-emerald-50 border-emerald-100",
    ticket_created: "bg-orange-50 border-orange-100",
    general: "bg-orange-50 border-orange-100",
  };
  return bgMap[type] || "bg-orange-50 border-orange-100";
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const ITEMS_PER_PAGE = 10;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "vendor" && userRole !== "admin") {
        setLoading(false);
        return;
      }
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setError("Please login to view notifications");
        setLoading(false);
        return;
      }

      let response;
      if (userRole === "vendor") {
        response = await api.get("/api/vendor/notifications", {
          params: { page: 1, limit: 100 },
        });
      } else if (userRole === "admin") {
        response = await api.get("/api/admin/notifications", {
          params: { page: 1, limit: 100 },
        });
      }

      if (response && response.data && response.data.success) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
        setError(null);
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response) {
        const status = error.response.status;
        const backendMessage = error.response.data?.message || "";
        if (status === 401)
          setError(
            backendMessage || "Authentication required. Please login again.",
          );
        else if (status === 403)
          setError(
            backendMessage || "Access denied. Vendor privileges required.",
          );
        else if (status === 404) setError("Notifications endpoint not found.");
        else if (status >= 500)
          setError("Server error. Please try again later.");
        else
          setError(
            backendMessage || `Error ${status}: Failed to load notifications.`,
          );
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          error.message || "Failed to load notifications. Please try again.",
        );
      }
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      if (!token) {
        setUnreadCount(0);
        return;
      }
      let response;
      if (userRole === "vendor")
        response = await api.get("/api/vendor/notifications/unread-count");
      else if (userRole === "admin")
        response = await api.get("/api/admin/notifications/unread-count");
      if (response && response.data && response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchNotifications();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const userRole = localStorage.getItem("userRole");
      const endpoint =
        userRole === "vendor"
          ? `/api/vendor/notifications/${notificationId}/read`
          : `/api/admin/notifications/${notificationId}/read`;
      await api.put(endpoint);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, readAt: new Date() }
            : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userRole = localStorage.getItem("userRole");
      const endpoint =
        userRole === "vendor"
          ? "/api/vendor/notifications/read-all"
          : "/api/admin/notifications/read-all";
      await api.put(endpoint);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() })),
      );
      setUnreadCount(0);
      setError(null);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) await markAsRead(notification._id);
  };

  const closeModal = () => setSelectedNotification(null);

  // Filtering by tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE),
  );
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "read", label: "Read" },
  ];

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-50">
          {Array.from({ length: 4 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-48" : j === 2 ? "w-64" : "w-24"}`}
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
        <td colSpan="4" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <FiBell className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              You're all caught up! 🎉
            </p>
            <p className="text-gray-300 text-xs">
              No notifications at the moment
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
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
      `}</style>

      <div className="w-full max-w-full mx-auto px-1 mt-3">
        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          {/* Left: Tabs */}
          <div className="flex flex-wrap items-center gap-2">
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
                  {tab.key === "unread" && unreadCount > 0 && (
                    <span className="ml-1.5 bg-[#FF7B1D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#FF7B1D] hover:text-orange-600 border border-orange-200 hover:border-orange-400 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-all"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Right: Count */}
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredNotifications.length} notification
              {filteredNotifications.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-3 text-sm">
            <FiAlertCircle className="flex-shrink-0" size={16} />
            <p>{error}</p>
          </div>
        )}

        {/* ── Table Card ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Notification Center
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                Page {currentPage} of {totalPages}
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
                    Type
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                    Title & Message
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold text-white tracking-wider uppercase opacity-90 pr-5">
                    Time
                  </th>
                </tr>
              </thead>

              {loading ? (
                <TableSkeleton />
              ) : paginatedNotifications.length === 0 ? (
                <EmptyState />
              ) : (
                <tbody>
                  {paginatedNotifications.map((notification, idx) => {
                    const Icon = getNotificationIcon(notification.type);
                    const iconColor = getIconColor(notification.type);
                    const iconBg = getIconBg(notification.type);
                    return (
                      <tr
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group cursor-pointer"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        {/* S.N */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                          </span>
                        </td>

                        {/* Type Icon */}
                        <td className="px-4 py-3.5">
                          <div
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border ${iconBg}`}
                          >
                            <Icon className={`${iconColor} text-base`} />
                          </div>
                        </td>

                        {/* Title & Message */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <p
                            className={`text-sm font-semibold mb-0.5 ${notification.isRead ? "text-gray-500" : "text-gray-800"}`}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={`text-xs line-clamp-1 ${notification.isRead ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {notification.message}
                          </p>
                        </td>

                        {/* Read/Unread Badge */}
                        <td className="px-4 py-3.5">
                          {notification.isRead ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200 ring-1 ring-gray-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                              Read
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Unread
                            </span>
                          )}
                        </td>

                        {/* Time */}
                        <td className="px-4 py-3.5 pr-5 text-right">
                          <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
                            <FiClock size={11} />
                            <span>{formatTimeAgo(notification.createdAt)}</span>
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
        {!loading && filteredNotifications.length > ITEMS_PER_PAGE && (
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

      {/* ── Detail Modal ── */}
      {selectedNotification && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getNotificationIcon(selectedNotification.type);
                  return (
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="text-white text-base" />
                    </div>
                  );
                })()}
                <h2 className="text-white font-bold text-base">
                  {selectedNotification.title}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6">
              {/* Time */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <FiClock size={12} />
                <span>{formatTimeAgo(selectedNotification.createdAt)}</span>
                <span className="mx-1">·</span>
                {selectedNotification.isRead ? (
                  <span className="text-gray-400">Read</span>
                ) : (
                  <span className="text-amber-600 font-semibold">Unread</span>
                )}
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Additional data */}
              {selectedNotification.data && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-5">
                  <h3 className="text-xs font-bold text-[#FF7B1D] mb-3 uppercase tracking-wide">
                    Details
                  </h3>
                  <div className="space-y-2">
                    {selectedNotification.type === "ticket_created" && (
                      <>
                        {selectedNotification.data.ticketNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs">
                              Ticket Number:
                            </span>
                            <span className="text-gray-800 font-semibold text-xs">
                              {selectedNotification.data.ticketNumber}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.category && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs">
                              Category:
                            </span>
                            <span className="text-gray-800 font-semibold text-xs capitalize">
                              {selectedNotification.data.category.replace(
                                /_/g,
                                " ",
                              )}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.status && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs">
                              Status:
                            </span>
                            <span
                              className={`font-semibold text-xs capitalize ${selectedNotification.data.status === "active" ? "text-amber-600" : selectedNotification.data.status === "resolved" ? "text-emerald-600" : "text-gray-500"}`}
                            >
                              {selectedNotification.data.status}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.vendorName && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs">
                              Vendor:
                            </span>
                            <span className="text-gray-800 font-semibold text-xs">
                              {selectedNotification.data.vendorName}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.complaint && (
                          <div className="flex flex-col gap-1 pt-2 border-t border-orange-200">
                            <span className="text-gray-500 text-xs">
                              Complaint:
                            </span>
                            <span className="text-gray-700 text-xs">
                              {selectedNotification.data.complaint}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.orderId && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs">
                              Order ID:
                            </span>
                            <span className="text-gray-800 font-semibold text-xs font-mono">
                              {selectedNotification.data.orderId}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {selectedNotification.data.orderNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">
                          Order Number:
                        </span>
                        <span className="text-gray-800 font-semibold text-xs">
                          {selectedNotification.data.orderNumber}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.total && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Total:</span>
                        <span className="text-gray-800 font-semibold text-xs">
                          ₹{selectedNotification.data.total.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.itemCount && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Items:</span>
                        <span className="text-gray-800 font-semibold text-xs">
                          {selectedNotification.data.itemCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Close button only */}
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-orange-200"
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

export default Notifications;
