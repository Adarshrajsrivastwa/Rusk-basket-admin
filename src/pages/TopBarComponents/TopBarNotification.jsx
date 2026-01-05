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
} from "react-icons/fi";

// Map of icon names to actual components
const iconMap = {
  check: FiCheckCircle,
  info: FiInfo,
  alert: FiAlertCircle,
  clock: FiClock,
  cart: FiShoppingCart,
  credit: FiCreditCard,
  user: FiUser,
  package: FiPackage,
};

const initialNotifications = [
  {
    id: 1,
    icon: "check",
    title: "Order Completed",
    message: "Your order #12345 has been successfully delivered.",
    time: "2h ago",
    details:
      "Order #12345 was delivered on November 5th, 2025 at 4:32 PM. Thank you for shopping with RushBasket!",
    read: false,
  },
  {
    id: 2,
    icon: "info",
    title: "New Feature",
    message: "Dark mode and quick search have been added to your dashboard.",
    time: "5h ago",
    details:
      "We’ve added Dark Mode and Quick Search for an improved experience. Go to Settings → Appearance to enable Dark Mode.",
    read: false,
  },
  {
    id: 3,
    icon: "alert",
    title: "Payment Reminder",
    message: "Your premium subscription will expire in 3 days.",
    time: "1d ago",
    details:
      "Your subscription will end on November 10th, 2025. Renew now to continue enjoying premium benefits.",
    read: false,
  },
  {
    id: 4,
    icon: "clock",
    title: "Scheduled Maintenance",
    message: "We’ll be performing system updates at 2AM (UTC).",
    time: "2d ago",
    details:
      "Our servers will be temporarily unavailable for maintenance from 2:00 AM to 4:00 AM UTC.",
    read: false,
  },
  {
    id: 5,
    icon: "cart",
    title: "New Order Placed",
    message: "Order #56892 was placed successfully and is being processed.",
    time: "3d ago",
    details:
      "Order #56892 was placed on November 2nd, 2025. You can track your package in the Orders section.",
    read: false,
  },
  {
    id: 6,
    icon: "credit",
    title: "Payment Successful",
    message: "Your payment of $49.99 for the Premium Plan was processed.",
    time: "4d ago",
    details:
      "Your payment has been successfully processed via Visa ending in 0921. Receipt sent to your email.",
    read: false,
  },
  {
    id: 7,
    icon: "user",
    title: "Profile Updated",
    message: "Your account information has been successfully updated.",
    time: "5d ago",
    details:
      "Your account profile was updated on November 1st, 2025. If you didn’t make this change, contact support immediately.",
    read: false,
  },
  {
    id: 8,
    icon: "package",
    title: "Package Shipped",
    message: "Order #56892 is now on its way to your address.",
    time: "6d ago",
    details:
      "Order #56892 has been shipped via DHL. Expected delivery date is November 9th, 2025. Tracking number: DHL548293.",
    read: false,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // ✅ Load notifications from localStorage or initial list
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(initialNotifications);
    }
  }, []);

  // ✅ Save notifications when updated
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // ✅ Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  // ✅ When clicking on a notification
  const handleNotificationClick = (n) => {
    setSelectedNotification(n);
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
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
          </h1>
          <button
            onClick={markAllAsRead}
            className="text-sm bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-md text-white transition"
          >
            Mark all as read
          </button>
        </div>

        {/* Notification List */}
        {notifications.length > 0 ? (
          <div className="bg-[#111] rounded-xl shadow-xl divide-y divide-gray-800 border border-gray-800">
            {notifications.map((n) => {
              const Icon = iconMap[n.icon] || FiInfo;
              return (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left flex items-start gap-4 p-4 transition duration-200 focus:outline-none ${
                    n.read ? "bg-[#0a0a0a] text-gray-400" : "hover:bg-[#1a1a1a]"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full flex items-center justify-center ${
                      n.read ? "bg-[#1a1a1a]" : "bg-[#1e1e1e]"
                    }`}
                  >
                    <Icon className="text-orange-400 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-sm sm:text-base ${
                        n.read ? "text-gray-400" : "text-white"
                      }`}
                    >
                      {n.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-1">
                      {n.message}
                    </p>
                  </div>
                  <div className="text-gray-500 text-xs whitespace-nowrap">
                    {n.time}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiBell className="text-4xl text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">You’re all caught up! 🎉</p>
          </div>
        )}

        {/* ✅ Modal */}
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
                  const Icon = iconMap[selectedNotification.icon] || FiInfo;
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
                {selectedNotification.time}
              </div>
              <div className="border-t border-gray-800 pt-3">
                <p className="text-gray-200 text-sm leading-relaxed">
                  {selectedNotification.details}
                </p>
              </div>

              <div className="mt-5 text-right">
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
