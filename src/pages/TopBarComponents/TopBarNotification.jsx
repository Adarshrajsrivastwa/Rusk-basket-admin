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
  FiUser,
  FiPackage,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import api, { BASE_URL } from "../../api/api";

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

// Map notification types to icons and colors
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

// Get icon color based on type
const getIconColor = (type) => {
  const colorMap = {
    order_created: "text-blue-400",
    order_updated: "text-yellow-400",
    order_cancelled: "text-red-400",
    order_delivered: "text-green-400",
    product_approved: "text-green-400",
    product_rejected: "text-red-400",
    invoice_generated: "text-purple-400",
    payment_received: "text-green-400",
    ticket_created: "text-orange-400",
    general: "text-orange-400",
  };
  return colorMap[type] || "text-orange-400";
};

// Format time ago
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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userRole = localStorage.getItem("userRole");

      // Fetch for vendors and admin
      if (userRole !== "vendor" && userRole !== "admin") {
        setLoading(false);
        return;
      }

      // Check if token exists
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setError("Please login to view notifications");
        setLoading(false);
        return;
      }

      // Debug: Log token info in development
      if (process.env.NODE_ENV === "development" || true) {
        const decoded = decodeToken(token);
        console.log("Token info:", {
          hasToken: !!token,
          tokenLength: token.length,
          decoded: decoded,
          decodedRole: decoded?.role,
          decodedId: decoded?.id,
          userRole: localStorage.getItem("userRole"),
        });
        // Log full decoded token
        if (decoded) {
          console.log("Full decoded token:", JSON.stringify(decoded, null, 2));
        }
      }

      let response;
      console.log("========================================");
      console.log("🔔 FETCHING NOTIFICATIONS:");
      console.log("User Role from localStorage:", userRole);
      console.log("========================================");
      
      if (userRole === "vendor") {
        // Fetch vendor notifications
        console.log("📱 Fetching VENDOR notifications from: /api/vendor/notifications");
        response = await api.get("/api/vendor/notifications", {
          params: {
            page: 1,
            limit: 50,
          },
        });
        console.log("✅ Vendor notifications response:", response.data);
        console.log("Vendor notifications data:", response.data?.data);
        console.log("Vendor notifications count:", response.data?.data?.length);
      } else if (userRole === "admin") {
        // Fetch admin notifications (support tickets, etc.)
        console.log("👤 Fetching ADMIN notifications from: /api/admin/notifications");
        response = await api.get("/api/admin/notifications", {
          params: {
            page: 1,
            limit: 50,
          },
        });
        console.log("✅ Admin notifications response:", response.data);
      } else {
        console.error("❌ Unknown user role:", userRole);
      }
      console.log("========================================");

      if (response && response.data && response.data.success) {
        console.log("========================================");
        console.log("✅ NOTIFICATIONS FETCHED SUCCESSFULLY:");
        console.log("Full response:", JSON.stringify(response.data, null, 2));
        console.log("Notifications array:", response.data.data);
        console.log("Notifications count:", response.data.data?.length || 0);
        console.log("Unread count:", response.data.unreadCount);
        console.log("First notification (if any):", response.data.data?.[0]);
        console.log("========================================");
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
        setError(null); // Clear any previous errors
      } else {
        console.error("❌ Invalid response from server:", response?.data);
        setError("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data || {};
        const backendMessage = errorData.message || errorData.error || "";

        // Log full error response for debugging
        console.log("Full error response:", {
          status: status,
          data: errorData,
          message: backendMessage,
          error: errorData.error,
          debug: errorData.debug,
        });

        if (status === 401) {
          setError(
            backendMessage || "Authentication required. Please login again.",
          );
          // Clear storage and redirect will be handled by axios interceptor
        } else if (status === 403) {
          // Show specific backend error message for 403
          if (backendMessage) {
            setError(backendMessage);
          } else if (errorData.debug) {
            // In development, show debug info
            const debugInfo =
              typeof errorData.debug === "object"
                ? JSON.stringify(errorData.debug, null, 2)
                : errorData.debug;
            setError(`Access denied: ${debugInfo}`);
          } else {
            // Check if role mismatch
            const storedRole = localStorage.getItem("userRole");
            if (storedRole !== "vendor") {
              setError(
                `Access denied. You are logged in as "${storedRole || "unknown"}", but vendor privileges are required. Please login as a vendor.`,
              );
            } else {
              setError(
                "Access denied. Vendor privileges required. Your account may be inactive. Please contact support or try logging in again.",
              );
            }
          }
        } else if (status === 404) {
          setError("Notifications endpoint not found.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          const errorMessage =
            backendMessage || `Error ${status}: Failed to load notifications.`;
          setError(errorMessage);
        }
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setError(
          error.message || "Failed to load notifications. Please try again.",
        );
      }

      // Set empty arrays on error to show empty state
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
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
      if (userRole === "vendor") {
        response = await api.get("/api/vendor/notifications/unread-count");
      } else if (userRole === "admin") {
        response = await api.get("/api/admin/notifications/unread-count");
      }

      if (response && response.data && response.data.success) {
        console.log("Unread count fetched:", response.data.unreadCount);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
      console.error("Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        userRole: localStorage.getItem("userRole"),
      });
      // Don't set error state for unread count, just log it
      setUnreadCount(0);
    }
  };

  // Socket.io removed - using Firebase push notifications instead

  // Fetch notifications on mount and when component becomes visible
  useEffect(() => {
    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    // Refresh when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const userRole = localStorage.getItem("userRole");
      const endpoint =
        userRole === "vendor"
          ? `/api/vendor/notifications/${notificationId}/read`
          : `/api/admin/notifications/${notificationId}/read`;

      await api.put(endpoint);
      
      // Update local state immediately
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, readAt: new Date() }
            : n,
        ),
      );
      
      // Update unread count immediately
      setUnreadCount((prev) => Math.max(0, prev - 1));
      
      // Refresh unread count from server to ensure accuracy
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
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
      setError("Failed to mark all notifications as read");
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId, e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    try {
      const userRole = localStorage.getItem("userRole");
      const endpoint =
        userRole === "vendor"
          ? `/api/vendor/notifications/${notificationId}`
          : `/api/admin/notifications/${notificationId}`;

      await api.delete(endpoint);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      // Update unread count if notification was unread
      const notification = notifications.find((n) => n._id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setError(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Failed to delete notification");
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all notifications? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      const userRole = localStorage.getItem("userRole");
      const endpoint =
        userRole === "vendor"
          ? "/api/vendor/notifications"
          : "/api/admin/notifications";

      await api.delete(endpoint);
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      setError("Failed to delete all notifications");
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  const closeModal = () => setSelectedNotification(null);

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-6 bg-black text-white pt-[72px] px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiBell className="text-orange-500" size={28} />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
                {unreadCount}
              </span>
            )}
          </h1>
          <div className="flex gap-3">
            {notifications.length > 0 && (
              <button
                onClick={deleteAllNotifications}
                className="text-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 px-4 py-2 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 font-medium"
              >
                Delete All
              </button>
            )}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 py-2 rounded-lg text-white transition-all duration-200 shadow-lg hover:shadow-orange-500/50 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-5 py-4 rounded-xl mb-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="flex-shrink-0" size={20} />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Notification List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-orange-500 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-orange-500/20 blur-md"></div>
            </div>
            <p className="text-gray-400 text-lg font-medium">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getIconColor(notification.type);
              return (
                <div
                  key={notification._id}
                  className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    notification.isRead
                      ? "bg-[#0a0a0a]/50 border-gray-800/50 hover:border-gray-700/50 shadow-sm"
                      : "bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-orange-500/30 hover:border-orange-500/50 shadow-lg hover:shadow-orange-500/10"
                  }`}
                >
                  {/* Unread indicator - left border */}
                  {!notification.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-red-500"></div>
                  )}

                  <div className="flex items-start gap-4 p-5 pl-6">
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="flex-1 flex items-start gap-4 text-left"
                    >
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          notification.isRead
                            ? "bg-gray-800/50"
                            : "bg-gradient-to-br from-gray-800 to-gray-900 shadow-md"
                        }`}
                      >
                        <Icon className={`${iconColor} text-xl`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold text-base sm:text-lg mb-1 ${
                            notification.isRead ? "text-gray-400" : "text-white"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p
                          className={`text-sm sm:text-base line-clamp-2 mb-2 ${
                            notification.isRead
                              ? "text-gray-500"
                              : "text-gray-300"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FiClock size={12} />
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                        </div>
                      </div>
                    </button>

                    {/* Delete button - shows on hover */}
                    <button
                      onClick={(e) => deleteNotification(notification._id, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 p-2.5 rounded-lg flex-shrink-0"
                      title="Delete notification"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-2xl opacity-20"></div>
              <FiBell className="relative text-6xl text-gray-700" />
            </div>
            <p className="text-gray-300 text-xl font-semibold mb-2">
              You're all caught up! 🎉
            </p>
            <p className="text-gray-500 text-sm">
              No notifications at the moment
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedNotification && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md transition-all duration-300 px-4"
            onClick={closeModal}
          >
            <div
              className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative text-white transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 p-2 rounded-lg"
              >
                <FiX size={24} />
              </button>

              {/* Header with icon */}
              <div className="flex items-start gap-4 mb-6">
                {(() => {
                  const Icon = getNotificationIcon(selectedNotification.type);
                  const iconColor = getIconColor(selectedNotification.type);
                  return (
                    <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
                      <Icon className={`${iconColor} text-2xl`} />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {selectedNotification.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiClock size={12} />
                    <span>{formatTimeAgo(selectedNotification.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-black/30 rounded-xl p-4 mb-6 border border-gray-800/50">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Additional data */}
              {selectedNotification.data && (
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-5 mb-6">
                  <h3 className="text-sm font-semibold text-orange-400 mb-3 uppercase tracking-wide">
                    Details
                  </h3>
                  <div className="space-y-2">
                    {/* Ticket-specific data */}
                    {selectedNotification.type === "ticket_created" && (
                      <>
                        {selectedNotification.data.ticketNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                              Ticket Number:
                            </span>
                            <span className="text-white font-semibold">
                              {selectedNotification.data.ticketNumber}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.category && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                              Category:
                            </span>
                            <span className="text-white font-semibold capitalize">
                              {selectedNotification.data.category.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.status && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                              Status:
                            </span>
                            <span className={`font-semibold capitalize ${
                              selectedNotification.data.status === "active" 
                                ? "text-orange-400" 
                                : selectedNotification.data.status === "resolved"
                                ? "text-green-400"
                                : "text-gray-400"
                            }`}>
                              {selectedNotification.data.status}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.vendorName && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                              Vendor:
                            </span>
                            <span className="text-white font-semibold">
                              {selectedNotification.data.vendorName}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.complaint && (
                          <div className="flex flex-col gap-1 pt-2 border-t border-orange-500/20">
                            <span className="text-gray-400 text-sm">
                              Complaint:
                            </span>
                            <span className="text-white text-sm">
                              {selectedNotification.data.complaint}
                            </span>
                          </div>
                        )}
                        {selectedNotification.data.orderId && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                              Order ID:
                            </span>
                            <span className="text-white font-semibold">
                              {selectedNotification.data.orderId}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {/* Order-specific data */}
                    {selectedNotification.data.orderNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          Order Number:
                        </span>
                        <span className="text-white font-semibold">
                          {selectedNotification.data.orderNumber}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.total && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total:</span>
                        <span className="text-white font-semibold">
                          ₹{selectedNotification.data.total.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.itemCount && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Items:</span>
                        <span className="text-white font-semibold">
                          {selectedNotification.data.itemCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    deleteNotification(selectedNotification._id, {
                      stopPropagation: () => {},
                    });
                    closeModal();
                  }}
                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/50"
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

export default Notifications;
