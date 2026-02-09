import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiBell,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import api, { BASE_URL } from "../api/api";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [socket, setSocket] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user role
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  // Fetch vendor profile data
  const fetchVendorProfile = async () => {
    if (userRole !== "vendor") return;
    
    try {
      setLoadingProfile(true);
      const response = await api.get("/api/vendor/profile");
      if (response.data.success) {
        setVendorProfile(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching vendor profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch vendor profile on mount
  useEffect(() => {
    if (userRole === "vendor") {
      fetchVendorProfile();
    }
  }, [userRole]);

  // Fetch unread notification count (for vendors)
  const fetchUnreadCount = async () => {
    if (userRole !== "vendor") return;
    
    try {
      const response = await api.get("/api/vendor/notifications/unread-count");
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Initialize socket.io for real-time notifications (vendors only)
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (token && role === "vendor") {
      // Fetch initial count
      fetchUnreadCount();

      // Set up socket.io connection
      import("socket.io-client")
        .then((ioModule) => {
          const io = ioModule.default;
          const socketInstance = io(BASE_URL, {
            auth: { token },
            transports: ["websocket", "polling"],
          });

          socketInstance.on("connect", () => {
            console.log("Header: Socket connected for notifications");
          });

          socketInstance.on("notification", (notification) => {
            console.log("Header: New notification received", notification);
            // Update unread count
            setUnreadCount((prev) => prev + 1);
          });

          // Handle order update events
          socketInstance.on("order_update", (orderData) => {
            console.log("Header: Order update received", orderData);
            // Update unread count for order updates
            setUnreadCount((prev) => prev + 1);
          });

          socketInstance.on("disconnect", () => {
            console.log("Header: Socket disconnected");
          });

          setSocket(socketInstance);

          // Cleanup
          return () => {
            if (socketInstance) {
              socketInstance.disconnect();
            }
          };
        })
        .catch((error) => {
          console.warn("Header: Socket.io-client not available:", error);
        });
    }

    // Refresh count every 30 seconds
    const interval = setInterval(() => {
      if (userRole === "vendor") {
        fetchUnreadCount();
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userRole]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get notification route based on user role
  const getNotificationRoute = () => {
    if (userRole === "vendor") {
      return "/vendor/notifications";
    }
    return "/topbar-notifications";
  };

  // Get vendor name
  const getVendorName = () => {
    if (userRole === "vendor" && vendorProfile) {
      return vendorProfile.vendorName || vendorProfile.storeName || "Vendor";
    }
    return "User";
  };

  // Get vendor email
  const getVendorEmail = () => {
    if (userRole === "vendor" && vendorProfile) {
      return vendorProfile.email || vendorProfile.contactNumber || "";
    }
    return "";
  };

  // Get vendor photo
  const getVendorPhoto = () => {
    if (userRole === "vendor" && vendorProfile) {
      // Check if vendor has profile photo or store image
      if (vendorProfile.profilePhoto && vendorProfile.profilePhoto.url) {
        return vendorProfile.profilePhoto.url;
      }
      if (vendorProfile.storeImage && vendorProfile.storeImage.length > 0) {
        return vendorProfile.storeImage[0].url;
      }
    }
    // Default avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getVendorName())}&background=FF7B1D&color=fff&size=128`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 sm:left-64 h-[56px] flex items-center px-4 sm:px-6 lg:px-8 shadow-md z-50 bg-[#343d46]">
      {/* Sidebar toggle - Mobile */}
      <button className="text-white text-2xl mr-3 sm:hidden">
        <FiMenu />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-[180px] sm:max-w-[300px] md:max-w-md relative mr-2">
        <input
          type="text"
          placeholder="Search in RushBasket..."
          className="w-full h-9 pl-3 pr-20 rounded bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs bg-[#2c323a] px-1 rounded hidden sm:block">
          CTRL + /
        </span>
      </div>

      {/* Right Icons - Only Notification and Profile */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* Notification Button with Real-time Count */}
        <button
          onClick={() => navigate(getNotificationRoute())}
          className="relative text-white text-lg p-2 hover:bg-[#414b57] rounded transition-all"
          title="Notifications"
        >
          <FiBell />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 font-semibold animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          {unreadCount === 0 && userRole === "vendor" && (
            <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs w-3 h-3 rounded-full" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="focus:outline-none flex items-center gap-2"
            title="Profile"
          >
            <img
              src={getVendorPhoto()}
              alt={getVendorName()}
              className="w-8 h-8 rounded-full border-2 border-gray-600 cursor-pointer object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getVendorName())}&background=FF7B1D&color=fff&size=128`;
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#343d46] rounded-full" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center gap-3">
                  <img
                    src={getVendorPhoto()}
                    alt={getVendorName()}
                    className="w-12 h-12 rounded-full border-2 border-orange-200 object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getVendorName())}&background=FF7B1D&color=fff&size=128`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {loadingProfile ? "Loading..." : getVendorName()}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {getVendorEmail()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                {/* Profile Button with Navigation */}
                <button
                  onClick={() => {
                    if (userRole === "vendor") {
                      navigate("/vendor/settings/profile");
                    } else {
                      navigate("/profile");
                    }
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 text-gray-700"
                >
                  <FiUser className="text-orange-500" /> Profile
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  // Clear storage and logout
                  localStorage.clear();
                  sessionStorage.clear();
                  navigate("/", { replace: true });
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 border-t text-red-600"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
