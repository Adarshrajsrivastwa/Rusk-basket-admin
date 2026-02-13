import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [adminProfile, setAdminProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user role
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  // Fetch vendor profile data
  const fetchVendorProfile = useCallback(async () => {
    if (userRole !== "vendor") return;
    
    try {
      setLoadingProfile(true);
      
      // Check if token exists
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      const response = await api.get("/api/vendor/profile");
      if (response.data && response.data.success) {
        setVendorProfile(response.data.data);
      }
    } catch (error) {
      // Only log if it's not a network error or 401/403 (expected when not logged in)
      const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';
      if (isDev && 
          error.response?.status !== 401 && 
          error.response?.status !== 403) {
        console.warn("Error fetching vendor profile:", error.message);
      }
      // Don't show error to user for profile fetch, just log it
      // The profile will show default values if fetch fails
    } finally {
      setLoadingProfile(false);
    }
  }, [userRole]);

  // Fetch admin profile data
  const fetchAdminProfile = useCallback(async () => {
    if (userRole !== "admin") return;
    
    try {
      setLoadingProfile(true);
      
      // Check if token exists
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      const response = await api.get("/api/admin/profile");
      console.log("========================================");
      console.log("👤 ADMIN PROFILE RESPONSE:");
      console.log("Full response:", response.data);
      if (response.data && response.data.success) {
        console.log("Admin profile data:", response.data.data);
        console.log("Profile image:", response.data.data?.profileImage);
        console.log("Profile image URL:", response.data.data?.profileImage?.url);
        setAdminProfile(response.data.data);
      }
      console.log("========================================");
    } catch (error) {
      // Only log if it's not a network error or 401/403 (expected when not logged in)
      const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';
      if (isDev && 
          error.response?.status !== 401 && 
          error.response?.status !== 403) {
        console.warn("Error fetching admin profile:", error.message);
      }
      // Don't show error to user for profile fetch, just log it
      // The profile will show default values if fetch fails
    } finally {
      setLoadingProfile(false);
    }
  }, [userRole]);

  // Fetch profile on mount and when role changes
  useEffect(() => {
    if (userRole === "vendor") {
      fetchVendorProfile();
    } else if (userRole === "admin") {
      fetchAdminProfile();
    }
  }, [userRole, fetchVendorProfile, fetchAdminProfile]);

  // Refresh profile when navigating back to pages (in case profile was updated)
  useEffect(() => {
    if (userRole === "vendor" && location.pathname.includes("/vendor")) {
      // Small delay to ensure profile update is complete
      const timer = setTimeout(() => {
        fetchVendorProfile();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (userRole === "admin" && location.pathname.includes("/dashboard")) {
      // Refresh admin profile when on dashboard
      const timer = setTimeout(() => {
        fetchAdminProfile();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, userRole, fetchVendorProfile, fetchAdminProfile]);

  // Fetch unread notification count (for vendors and admin)
  const fetchUnreadCount = async () => {
    if (userRole !== "vendor" && userRole !== "admin") return;
    
    try {
      // Check if token exists
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setUnreadCount(0);
        return;
      }

      let response;
      if (userRole === "vendor") {
        // Fetch vendor notifications
        response = await api.get("/api/vendor/notifications/unread-count");
      } else if (userRole === "admin") {
        // Fetch admin notifications (support tickets, etc.)
        response = await api.get("/api/admin/notifications/unread-count");
      }

      if (response && response.data && response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      // Only log if it's not a network error or 401/403/404 (expected when not logged in or endpoint doesn't exist)
      const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';
      if (isDev && 
          error.response?.status !== 401 && 
          error.response?.status !== 403 &&
          error.response?.status !== 404) {
        console.warn("Error fetching unread count:", error.message);
      }
      // Don't show error to user, just set count to 0
      setUnreadCount(0);
    }
  };

  // Initialize notification fetching for vendors and admin
  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (role === "vendor" || role === "admin") {
      // Fetch initial count
      fetchUnreadCount();

      // Refresh count every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => {
        clearInterval(interval);
      };
    }
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
    if (userRole === "admin") {
      return "/topbar-notifications";
    }
    return "/topbar-notifications";
  };

  // Get user name (vendor or admin)
  const getUserName = () => {
    if (userRole === "vendor" && vendorProfile) {
      return vendorProfile.vendorName || vendorProfile.storeName || "Vendor";
    }
    if (userRole === "admin" && adminProfile) {
      return adminProfile.name || "Admin";
    }
    return "User";
  };

  // Get user email (vendor or admin)
  const getUserEmail = () => {
    if (userRole === "vendor" && vendorProfile) {
      return vendorProfile.email || vendorProfile.contactNumber || "";
    }
    if (userRole === "admin" && adminProfile) {
      return adminProfile.email || adminProfile.mobile || "";
    }
    return "";
  };

  // Get user photo (vendor or admin)
  const getUserPhoto = () => {
    if (userRole === "vendor" && vendorProfile) {
      // Priority: profileImage > profilePhoto > storeImage
      // Check for profileImage (new field we added)
      if (vendorProfile.profileImage) {
        // Handle both array and object formats
        if (Array.isArray(vendorProfile.profileImage) && vendorProfile.profileImage.length > 0) {
          return vendorProfile.profileImage[0].url || vendorProfile.profileImage[0];
        }
        // If it's a string URL
        if (typeof vendorProfile.profileImage === 'string') {
          return vendorProfile.profileImage;
        }
        // If it's an object with url property
        if (vendorProfile.profileImage.url) {
          return vendorProfile.profileImage.url;
        }
      }
      // Check for profilePhoto (legacy field)
      if (vendorProfile.profilePhoto && vendorProfile.profilePhoto.url) {
        return vendorProfile.profilePhoto.url;
      }
      // Check for storeImage (fallback)
      if (vendorProfile.storeImage && vendorProfile.storeImage.length > 0) {
        return vendorProfile.storeImage[0].url;
      }
    }
    if (userRole === "admin" && adminProfile) {
      console.log("========================================");
      console.log("🖼️ GETTING ADMIN PROFILE PHOTO:");
      console.log("Admin profile:", adminProfile);
      console.log("Profile image:", adminProfile.profileImage);
      console.log("Profile image type:", typeof adminProfile.profileImage);
      console.log("========================================");
      
      // Check for profileImage
      if (adminProfile.profileImage) {
        // Handle both array and object formats
        if (Array.isArray(adminProfile.profileImage) && adminProfile.profileImage.length > 0) {
          const imageUrl = adminProfile.profileImage[0].url || adminProfile.profileImage[0];
          console.log("✅ Found image in array format:", imageUrl);
          return imageUrl;
        }
        // If it's a string URL
        if (typeof adminProfile.profileImage === 'string') {
          console.log("✅ Found image as string:", adminProfile.profileImage);
          return adminProfile.profileImage;
        }
        // If it's an object with url property
        if (adminProfile.profileImage.url) {
          console.log("✅ Found image URL:", adminProfile.profileImage.url);
          return adminProfile.profileImage.url;
        }
      } else {
        console.log("❌ No profileImage found in adminProfile");
      }
    }
    // Default avatar
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
    console.log("🔄 Using default avatar:", defaultAvatar);
    return defaultAvatar;
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
          {unreadCount === 0 && (userRole === "vendor" || userRole === "admin") && (
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
              src={getUserPhoto()}
              alt={getUserName()}
              className="w-8 h-8 rounded-full border-2 border-gray-600 cursor-pointer object-cover"
              onError={(e) => {
                console.error("❌ Image failed to load:", e.target.src);
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
              }}
              onLoad={() => {
                console.log("✅ Profile image loaded successfully:", getUserPhoto());
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#343d46] rounded-full" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center gap-3">
                  <img
                    src={getUserPhoto()}
                    alt={getUserName()}
                    className="w-12 h-12 rounded-full border-2 border-orange-200 object-cover"
                    onError={(e) => {
                      console.error("❌ Dropdown image failed to load:", e.target.src);
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
                    }}
                    onLoad={() => {
                      console.log("✅ Dropdown profile image loaded successfully:", getUserPhoto());
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {loadingProfile ? "Loading..." : getUserName()}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {getUserEmail()}
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
