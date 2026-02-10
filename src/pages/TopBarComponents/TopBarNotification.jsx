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
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Map notification types to icons
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
    general: FiInfo,
  };
  return iconMap[type] || FiInfo;
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
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
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
      
      // Only fetch for vendors
      if (userRole !== "vendor") {
        setLoading(false);
        return;
      }

      // Check if token exists
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setError("Please login to view notifications");
        setLoading(false);
        return;
      }

      // Debug: Log token info in development
      if (process.env.NODE_ENV === 'development' || true) {
        const decoded = decodeToken(token);
        console.log('Token info:', {
          hasToken: !!token,
          tokenLength: token.length,
          decoded: decoded,
          decodedRole: decoded?.role,
          decodedId: decoded?.id,
          userRole: localStorage.getItem("userRole"),
        });
        // Log full decoded token
        if (decoded) {
          console.log('Full decoded token:', JSON.stringify(decoded, null, 2));
        }
      }

      const response = await api.get("/api/vendor/notifications", {
        params: {
          page: 1,
          limit: 50,
        },
      });

      if (response.data && response.data.success) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
        setError(null); // Clear any previous errors
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data || {};
        const backendMessage = errorData.message || errorData.error || '';
        
        // Log full error response for debugging
        console.log('Full error response:', {
          status: status,
          data: errorData,
          message: backendMessage,
          error: errorData.error,
          debug: errorData.debug,
        });
        
        if (status === 401) {
          setError(backendMessage || "Authentication required. Please login again.");
          // Clear storage and redirect will be handled by axios interceptor
        } else if (status === 403) {
          // Show specific backend error message for 403
          if (backendMessage) {
            setError(backendMessage);
          } else if (errorData.debug) {
            // In development, show debug info
            const debugInfo = typeof errorData.debug === 'object' 
              ? JSON.stringify(errorData.debug, null, 2)
              : errorData.debug;
            setError(`Access denied: ${debugInfo}`);
          } else {
            // Check if role mismatch
            const storedRole = localStorage.getItem("userRole");
            if (storedRole !== "vendor") {
              setError(`Access denied. You are logged in as "${storedRole || 'unknown'}", but vendor privileges are required. Please login as a vendor.`);
            } else {
              setError("Access denied. Vendor privileges required. Your account may be inactive. Please contact support or try logging in again.");
            }
          }
        } else if (status === 404) {
          setError("Notifications endpoint not found.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          const errorMessage = backendMessage || `Error ${status}: Failed to load notifications.`;
          setError(errorMessage);
        }
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setError(error.message || "Failed to load notifications. Please try again.");
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
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await api.get("/api/vendor/notifications/unread-count");
      if (response.data && response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
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
      await api.put(`/api/vendor/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.put("/api/vendor/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
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
      await api.delete(`/api/vendor/notifications/${notificationId}`);
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
    if (!window.confirm("Are you sure you want to delete all notifications? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete("/api/vendor/notifications");
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      setError("Failed to delete all notifications");
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  const closeModal = () => setSelectedNotification(null);

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-4 bg-black text-white pt-[72px] px-4 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <FiBell className="text-orange-400" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <button
                onClick={deleteAllNotifications}
                className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white transition"
              >
                Delete All
              </button>
            )}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-md text-white transition"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Notification List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="bg-[#111] rounded-xl shadow-xl divide-y divide-gray-800 border border-gray-800">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification._id}
                  className={`w-full text-left flex items-start gap-4 p-4 transition duration-200 ${
                    notification.isRead
                      ? "bg-[#0a0a0a] text-gray-400"
                      : "hover:bg-[#1a1a1a] bg-[#151515]"
                  }`}
                >
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className="flex-1 flex items-start gap-4"
                  >
                    <div
                      className={`p-2 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.isRead ? "bg-[#1a1a1a]" : "bg-[#1e1e1e]"
                      }`}
                    >
                      <Icon className="text-orange-400 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-sm sm:text-base ${
                          notification.isRead ? "text-gray-400" : "text-white"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="text-gray-500 text-xs mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => deleteNotification(notification._id, e)}
                    className="text-gray-500 hover:text-red-400 transition p-2 flex-shrink-0"
                    title="Delete notification"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiBell className="text-4xl text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">You're all caught up! 🎉</p>
            <p className="text-gray-500 text-sm mt-2">
              No notifications at the moment
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedNotification && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm transition"
            onClick={closeModal}
          >
            <div
              className="bg-[#111] border border-gray-800 rounded-xl shadow-2xl w-[90%] max-w-md p-6 relative text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                {(() => {
                  const Icon = getNotificationIcon(selectedNotification.type);
                  return (
                    <div className="p-2 bg-[#1e1e1e] rounded-full">
                      <Icon className="text-orange-400 text-xl" />
                    </div>
                  );
                })()}
                <h2 className="text-lg font-semibold text-orange-400">
                  {selectedNotification.title}
                </h2>
              </div>

              <p className="text-gray-300 text-sm mb-2">
                {selectedNotification.message}
              </p>
              <div className="text-gray-400 text-xs mb-4">
                {formatTimeAgo(selectedNotification.createdAt)}
              </div>

              {selectedNotification.data && (
                <div className="border-t border-gray-800 pt-3 mb-4">
                  {selectedNotification.data.orderNumber && (
                    <p className="text-gray-200 text-sm">
                      <strong>Order Number:</strong> {selectedNotification.data.orderNumber}
                    </p>
                  )}
                  {selectedNotification.data.total && (
                    <p className="text-gray-200 text-sm mt-1">
                      <strong>Total:</strong> ₹{selectedNotification.data.total.toFixed(2)}
                    </p>
                  )}
                  {selectedNotification.data.itemCount && (
                    <p className="text-gray-200 text-sm mt-1">
                      <strong>Items:</strong> {selectedNotification.data.itemCount}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    deleteNotification(selectedNotification._id, { stopPropagation: () => {} });
                    closeModal();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md transition"
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-1.5 rounded-md transition"
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
