// import React, { useState, useRef, useEffect, useCallback } from "react";
// import {
//   FiMenu,
//   FiBell,
//   FiUser,
//   FiLogOut,
// } from "react-icons/fi";
// import { useNavigate, useLocation } from "react-router-dom";
// import api, { BASE_URL } from "../api/api";

// const Header = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [userRole, setUserRole] = useState(null);
//   const [vendorProfile, setVendorProfile] = useState(null);
//   const [adminProfile, setAdminProfile] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get user role
//   useEffect(() => {
//     const role = localStorage.getItem("userRole");
//     setUserRole(role);
//   }, []);

//   // Fetch vendor profile data
//   const fetchVendorProfile = useCallback(async () => {
//     if (userRole !== "vendor") return;

//     try {
//       setLoadingProfile(true);

//       // Check if token exists
//       const token = localStorage.getItem("token") || localStorage.getItem("authToken");
//       if (!token) {
//         setLoadingProfile(false);
//         return;
//       }

//       const response = await api.get("/api/vendor/profile");
//       if (response.data && response.data.success) {
//         setVendorProfile(response.data.data);
//       }
//     } catch (error) {
//       // Only log if it's not a network error or 401/403 (expected when not logged in)
//       const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';
//       if (isDev &&
//           error.response?.status !== 401 &&
//           error.response?.status !== 403) {
//         console.warn("Error fetching vendor profile:", error.message);
//       }
//       // Don't show error to user for profile fetch, just log it
//       // The profile will show default values if fetch fails
//     } finally {
//       setLoadingProfile(false);
//     }
//   }, [userRole]);

//   // Fetch admin profile data
//   const fetchAdminProfile = useCallback(async () => {
//     if (userRole !== "admin") return;

//     try {
//       setLoadingProfile(true);

//       // Check if token exists
//       const token = localStorage.getItem("token") || localStorage.getItem("authToken");
//       if (!token) {
//         setLoadingProfile(false);
//         return;
//       }

//       const response = await api.get("/api/admin/profile");
//       console.log("========================================");
//       console.log("👤 ADMIN PROFILE RESPONSE:");
//       console.log("Full response:", response.data);
//       if (response.data && response.data.success) {
//         console.log("Admin profile data:", response.data.data);
//         console.log("Profile image:", response.data.data?.profileImage);
//         console.log("Profile image URL:", response.data.data?.profileImage?.url);
//         setAdminProfile(response.data.data);
//       }
//       console.log("========================================");
//     } catch (error) {
//       // Only log if it's not a network error or 401/403 (expected when not logged in)
//       const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';
//       if (isDev &&
//           error.response?.status !== 401 &&
//           error.response?.status !== 403) {
//         console.warn("Error fetching admin profile:", error.message);
//       }
//       // Don't show error to user for profile fetch, just log it
//       // The profile will show default values if fetch fails
//     } finally {
//       setLoadingProfile(false);
//     }
//   }, [userRole]);

//   // Fetch profile on mount and when role changes
//   useEffect(() => {
//     if (userRole === "vendor") {
//       fetchVendorProfile();
//     } else if (userRole === "admin") {
//       fetchAdminProfile();
//     }
//   }, [userRole, fetchVendorProfile, fetchAdminProfile]);

//   // Refresh profile when navigating back to pages (in case profile was updated)
//   useEffect(() => {
//     if (userRole === "vendor" && location.pathname.includes("/vendor")) {
//       // Small delay to ensure profile update is complete
//       const timer = setTimeout(() => {
//         fetchVendorProfile();
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (userRole === "admin" && location.pathname.includes("/dashboard")) {
//       // Refresh admin profile when on dashboard
//       const timer = setTimeout(() => {
//         fetchAdminProfile();
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [location.pathname, userRole, fetchVendorProfile, fetchAdminProfile]);

//   // Fetch unread notification count (for vendors and admin)
//   const fetchUnreadCount = async () => {
//     if (userRole !== "vendor" && userRole !== "admin") return;

//     try {
//       // Check if token exists
//       const token = localStorage.getItem("token") || localStorage.getItem("authToken");
//       if (!token) {
//         setUnreadCount(0);
//         return;
//       }

//       let response;
//       if (userRole === "vendor") {
//         // Fetch vendor notifications
//         response = await api.get("/api/vendor/notifications/unread-count");
//       } else if (userRole === "admin") {
//         // Fetch admin notifications (support tickets, etc.)
//         response = await api.get("/api/admin/notifications/unread-count");
//       }

//       if (response && response.data && response.data.success) {
//         setUnreadCount(response.data.unreadCount || 0);
//       }
//     } catch (error) {
//       // Only log if it's not a network error or 401/403/404 (expected when not logged in or endpoint doesn't exist)
//       const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';
//       if (isDev &&
//           error.response?.status !== 401 &&
//           error.response?.status !== 403 &&
//           error.response?.status !== 404) {
//         console.warn("Error fetching unread count:", error.message);
//       }
//       // Don't show error to user, just set count to 0
//       setUnreadCount(0);
//     }
//   };

//   // Initialize notification fetching for vendors and admin
//   useEffect(() => {
//     const role = localStorage.getItem("userRole");

//     if (role === "vendor" || role === "admin") {
//       // Fetch initial count
//       fetchUnreadCount();

//       // Refresh count every 30 seconds
//       const interval = setInterval(() => {
//         fetchUnreadCount();
//       }, 30000);

//       return () => {
//         clearInterval(interval);
//       };
//     }
//   }, [userRole]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Get notification route based on user role
//   const getNotificationRoute = () => {
//     if (userRole === "vendor") {
//       return "/vendor/notifications";
//     }
//     if (userRole === "admin") {
//       return "/topbar-notifications";
//     }
//     return "/topbar-notifications";
//   };

//   // Get user name (vendor or admin)
//   const getUserName = () => {
//     if (userRole === "vendor" && vendorProfile) {
//       return vendorProfile.vendorName || vendorProfile.storeName || "Vendor";
//     }
//     if (userRole === "admin" && adminProfile) {
//       return adminProfile.name || "Admin";
//     }
//     return "User";
//   };

//   // Get user email (vendor or admin)
//   const getUserEmail = () => {
//     if (userRole === "vendor" && vendorProfile) {
//       return vendorProfile.email || vendorProfile.contactNumber || "";
//     }
//     if (userRole === "admin" && adminProfile) {
//       return adminProfile.email || adminProfile.mobile || "";
//     }
//     return "";
//   };

//   // Get user photo (vendor or admin)
//   const getUserPhoto = () => {
//     if (userRole === "vendor" && vendorProfile) {
//       // Priority: profileImage > profilePhoto > storeImage
//       // Check for profileImage (new field we added)
//       if (vendorProfile.profileImage) {
//         // Handle both array and object formats
//         if (Array.isArray(vendorProfile.profileImage) && vendorProfile.profileImage.length > 0) {
//           return vendorProfile.profileImage[0].url || vendorProfile.profileImage[0];
//         }
//         // If it's a string URL
//         if (typeof vendorProfile.profileImage === 'string') {
//           return vendorProfile.profileImage;
//         }
//         // If it's an object with url property
//         if (vendorProfile.profileImage.url) {
//           return vendorProfile.profileImage.url;
//         }
//       }
//       // Check for profilePhoto (legacy field)
//       if (vendorProfile.profilePhoto && vendorProfile.profilePhoto.url) {
//         return vendorProfile.profilePhoto.url;
//       }
//       // Check for storeImage (fallback)
//       if (vendorProfile.storeImage && vendorProfile.storeImage.length > 0) {
//         return vendorProfile.storeImage[0].url;
//       }
//     }
//     if (userRole === "admin" && adminProfile) {
//       console.log("========================================");
//       console.log("🖼️ GETTING ADMIN PROFILE PHOTO:");
//       console.log("Admin profile:", adminProfile);
//       console.log("Profile image:", adminProfile.profileImage);
//       console.log("Profile image type:", typeof adminProfile.profileImage);
//       console.log("========================================");

//       // Check for profileImage
//       if (adminProfile.profileImage) {
//         // Handle both array and object formats
//         if (Array.isArray(adminProfile.profileImage) && adminProfile.profileImage.length > 0) {
//           const imageUrl = adminProfile.profileImage[0].url || adminProfile.profileImage[0];
//           console.log("✅ Found image in array format:", imageUrl);
//           return imageUrl;
//         }
//         // If it's a string URL
//         if (typeof adminProfile.profileImage === 'string') {
//           console.log("✅ Found image as string:", adminProfile.profileImage);
//           return adminProfile.profileImage;
//         }
//         // If it's an object with url property
//         if (adminProfile.profileImage.url) {
//           console.log("✅ Found image URL:", adminProfile.profileImage.url);
//           return adminProfile.profileImage.url;
//         }
//       } else {
//         console.log("❌ No profileImage found in adminProfile");
//       }
//     }
//     // Default avatar
//     const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
//     console.log("🔄 Using default avatar:", defaultAvatar);
//     return defaultAvatar;
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 sm:left-64 h-[56px] flex items-center px-4 sm:px-6 lg:px-8 shadow-md z-50 bg-[#343d46]">
//       {/* Sidebar toggle - Mobile */}
//       <button className="text-white text-2xl mr-3 sm:hidden">
//         <FiMenu />
//       </button>

//       {/* Search Bar */}
//       <div className="flex-1 max-w-[180px] sm:max-w-[300px] md:max-w-md relative mr-2">
//         <input
//           type="text"
//           placeholder="Search in RushBasket..."
//           className="w-full h-9 pl-3 pr-20 rounded bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none"
//         />
//         <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs bg-[#2c323a] px-1 rounded hidden sm:block">
//           CTRL + /
//         </span>
//       </div>

//       {/* Right Icons - Only Notification and Profile */}
//       <div className="flex items-center gap-2 sm:gap-4 ml-auto">
//         {/* Notification Button with Real-time Count */}
//         <button
//           onClick={() => navigate(getNotificationRoute())}
//           className="relative text-white text-lg p-2 hover:bg-[#414b57] rounded transition-all"
//           title="Notifications"
//         >
//           <FiBell />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 font-semibold animate-pulse">
//               {unreadCount > 99 ? "99+" : unreadCount}
//             </span>
//           )}
//           {unreadCount === 0 && (userRole === "vendor" || userRole === "admin") && (
//             <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs w-3 h-3 rounded-full" />
//           )}
//         </button>

//         {/* User Profile Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="focus:outline-none flex items-center gap-2"
//             title="Profile"
//           >
//             <img
//               src={getUserPhoto()}
//               alt={getUserName()}
//               className="w-8 h-8 rounded-full border-2 border-gray-600 cursor-pointer object-cover"
//               onError={(e) => {
//                 console.error("❌ Image failed to load:", e.target.src);
//                 e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
//               }}
//               onLoad={() => {
//                 console.log("✅ Profile image loaded successfully:", getUserPhoto());
//               }}
//             />
//             <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#343d46] rounded-full" />
//           </button>

//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-50">
//               <div className="px-4 py-3 border-b bg-gradient-to-r from-orange-50 to-white">
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={getUserPhoto()}
//                     alt={getUserName()}
//                     className="w-12 h-12 rounded-full border-2 border-orange-200 object-cover"
//                     onError={(e) => {
//                       console.error("❌ Dropdown image failed to load:", e.target.src);
//                       e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
//                     }}
//                     onLoad={() => {
//                       console.log("✅ Dropdown profile image loaded successfully:", getUserPhoto());
//                     }}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-gray-800 truncate">
//                       {loadingProfile ? "Loading..." : getUserName()}
//                     </p>
//                     <p className="text-xs text-gray-500 truncate">
//                       {getUserEmail()}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="py-2">
//                 {/* Profile Button with Navigation */}
//                 <button
//                   onClick={() => {
//                     if (userRole === "vendor") {
//                       navigate("/vendor/settings/profile");
//                     } else {
//                       navigate("/profile");
//                     }
//                     setIsDropdownOpen(false);
//                   }}
//                   className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 text-gray-700"
//                 >
//                   <FiUser className="text-orange-500" /> Profile
//                 </button>
//               </div>

//               {/* Logout Button */}
//               <button
//                 onClick={() => {
//                   // Clear storage and logout
//                   localStorage.clear();
//                   sessionStorage.clear();
//                   navigate("/", { replace: true });
//                   setIsDropdownOpen(false);
//                 }}
//                 className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 border-t text-red-600"
//               >
//                 <FiLogOut /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FiMenu,
  FiBell,
  FiUser,
  FiLogOut,
  FiSearch,
  FiX,
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiDollarSign,
  FiGrid,
  FiUsers,
  FiTag,
  FiFileText,
  FiSettings,
  FiPieChart,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import api, { BASE_URL } from "../api/api";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
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

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      const response = await api.get("/api/vendor/profile");
      if (response.data && response.data.success) {
        setVendorProfile(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching vendor profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  }, [userRole]);

  // Fetch admin profile data
  const fetchAdminProfile = useCallback(async () => {
    if (userRole !== "admin") return;

    try {
      setLoadingProfile(true);

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      const response = await api.get("/api/admin/profile");
      if (response.data && response.data.success) {
        setAdminProfile(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
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

  // Refresh profile when navigating back to pages
  useEffect(() => {
    if (userRole === "vendor" && location.pathname.includes("/vendor")) {
      const timer = setTimeout(() => {
        fetchVendorProfile();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (
      userRole === "admin" &&
      location.pathname.includes("/dashboard")
    ) {
      const timer = setTimeout(() => {
        fetchAdminProfile();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, userRole, fetchVendorProfile, fetchAdminProfile]);

  // Static search data based on routes and user role
  const getSearchablePages = useCallback(() => {
    const adminPages = [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FiPieChart />,
        category: "Main",
      },
      {
        title: "All Products",
        path: "/products/all",
        icon: <FiPackage />,
        category: "Products",
      },
      {
        title: "Pending Products",
        path: "/products/pending",
        icon: <FiPackage />,
        category: "Products",
      },
      {
        title: "Add Product",
        path: "/products/add",
        icon: <FiPackage />,
        category: "Products",
      },
      {
        title: "Trending Products",
        path: "/products/trending",
        icon: <FiPackage />,
        category: "Products",
      },
      {
        title: "Inventory",
        path: "/inventory",
        icon: <FiGrid />,
        category: "Products",
      },
      {
        title: "All Vendors",
        path: "/vendor/all",
        icon: <FiUsers />,
        category: "Vendors",
      },
      {
        title: "All Admins",
        path: "/admin/all",
        icon: <FiUsers />,
        category: "Admins",
      },
      {
        title: "All Categories",
        path: "/category/all",
        icon: <FiGrid />,
        category: "Categories",
      },
      {
        title: "Create Category",
        path: "/category/create",
        icon: <FiGrid />,
        category: "Categories",
      },
      {
        title: "Create Sub Category",
        path: "/category/create-sub",
        icon: <FiGrid />,
        category: "Categories",
      },
      {
        title: "Banners",
        path: "/banners",
        icon: <FiFileText />,
        category: "Marketing",
      },
      {
        title: "All Orders",
        path: "/orders/all",
        icon: <FiShoppingCart />,
        category: "Orders",
      },
      {
        title: "All Riders",
        path: "/Rider",
        icon: <FiTruck />,
        category: "Riders",
      },
      {
        title: "Rider Withdrawal Requests",
        path: "/admin/rider/withdrawal-requests",
        icon: <FiDollarSign />,
        category: "Riders",
      },
      {
        title: "Vendor Withdrawal Requests",
        path: "/admin/vendors/withdrawal-requests",
        icon: <FiDollarSign />,
        category: "Vendors",
      },
      {
        title: "All Coupons",
        path: "/coupons/all",
        icon: <FiTag />,
        category: "Marketing",
      },
      {
        title: "Create Coupon",
        path: "/coupons/create",
        icon: <FiTag />,
        category: "Marketing",
      },
      {
        title: "Notifications",
        path: "/notification",
        icon: <FiBell />,
        category: "Communication",
      },
      {
        title: "Push Notification",
        path: "/notification/push",
        icon: <FiBell />,
        category: "Communication",
      },
      {
        title: "Sales Analytics",
        path: "/analytics/sales",
        icon: <FiPieChart />,
        category: "Analytics",
      },
      {
        title: "Analytics Dashboard",
        path: "/analytics/dashboard",
        icon: <FiPieChart />,
        category: "Analytics",
      },
      {
        title: "Vendor Report",
        path: "/analytics/all",
        icon: <FiPieChart />,
        category: "Analytics",
      },
      {
        title: "Payment Gateways",
        path: "/payment-gateways",
        icon: <FiDollarSign />,
        category: "Settings",
      },
      {
        title: "Suggestions",
        path: "/suggestions",
        icon: <FiFileText />,
        category: "Support",
      },
      {
        title: "Vendor Support",
        path: "/admin/vendor-support",
        icon: <FiUsers />,
        category: "Support",
      },
      {
        title: "User Support",
        path: "/admin/user-support",
        icon: <FiUsers />,
        category: "Support",
      },
      {
        title: "Rider Support",
        path: "/admin/rider-support",
        icon: <FiTruck />,
        category: "Support",
      },
      {
        title: "Rider Job Posting",
        path: "/admin/rider-job-posting",
        icon: <FiTruck />,
        category: "Jobs",
      },
      {
        title: "My Profile",
        path: "/settings/profile",
        icon: <FiUser />,
        category: "Profile",
      },
      {
        title: "All Notifications",
        path: "/notifications/view-all",
        icon: <FiBell />,
        category: "Communication",
      },
    ];

    const vendorPages = [
      {
        title: "Dashboard",
        path: "/vendor/dashboard",
        icon: <FiPieChart />,
        category: "Main",
      },
      {
        title: "Products",
        path: "/vendor/products",
        icon: <FiPackage />,
        category: "Products",
      },
      {
        title: "Inventory",
        path: "/vendor/inventory",
        icon: <FiGrid />,
        category: "Products",
      },
      {
        title: "Orders",
        path: "/vendor/orders",
        icon: <FiShoppingCart />,
        category: "Orders",
      },
      {
        title: "Analytics",
        path: "/vendor/analytics",
        icon: <FiPieChart />,
        category: "Analytics",
      },
      {
        title: "Rider Jobs",
        path: "/vendor/jobs",
        icon: <FiTruck />,
        category: "Jobs",
      },
      {
        title: "Rider Due Amounts",
        path: "/vendor/rider-due-amounts",
        icon: <FiDollarSign />,
        category: "Finance",
      },
      {
        title: "Withdrawal Requests",
        path: "/vendor/withdrawal-requests",
        icon: <FiDollarSign />,
        category: "Finance",
      },
      {
        title: "Daily Offers",
        path: "/vendor/daily-offers",
        icon: <FiTag />,
        category: "Marketing",
      },
      {
        title: "Notifications",
        path: "/vendor/notifications",
        icon: <FiBell />,
        category: "Communication",
      },
      {
        title: "Support",
        path: "/vendor-support",
        icon: <FiFileText />,
        category: "Support",
      },
      {
        title: "Profile Settings",
        path: "/vendor/settings/profile",
        icon: <FiSettings />,
        category: "Profile",
      },
      {
        title: "Update Profile",
        path: "/vendor/update-profile",
        icon: <FiUser />,
        category: "Profile",
      },
    ];

    if (userRole === "admin") {
      return adminPages;
    } else if (userRole === "vendor") {
      return vendorPages;
    }
    return [];
  }, [userRole]);

  // Perform search with both API and static pages
  const performSearch = useCallback(
    async (query) => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      const lowerQuery = query.toLowerCase().trim();

      try {
        // Get static page matches
        const pages = getSearchablePages();
        const pageMatches = pages
          .filter(
            (page) =>
              page.title.toLowerCase().includes(lowerQuery) ||
              page.category.toLowerCase().includes(lowerQuery) ||
              page.path.toLowerCase().includes(lowerQuery),
          )
          .map((page) => ({
            ...page,
            type: "page",
            subtitle: page.category,
          }));

        // Try to fetch API results
        let apiResults = [];
        try {
          let endpoint = "";

          if (userRole === "vendor") {
            endpoint = `/api/vendor/search?q=${encodeURIComponent(query)}`;
          } else if (userRole === "admin") {
            endpoint = `/api/admin/search?q=${encodeURIComponent(query)}`;
          }

          if (endpoint) {
            const response = await api.get(endpoint);
            if (response.data && response.data.success) {
              apiResults = response.data.results || [];
            }
          }
        } catch (error) {
          console.error("API search error:", error);
          // Continue with page matches even if API fails
        }

        // Combine and prioritize results: API results first, then page matches
        const combinedResults = [
          ...apiResults.slice(0, 5), // Top 5 API results
          ...pageMatches.slice(0, 10), // Top 10 page matches
        ].slice(0, 15); // Limit total to 15 results

        setSearchResults(combinedResults);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [userRole, getSearchablePages],
  );

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, performSearch]);

  // Handle search result click
  const handleResultClick = (result) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);

    // Navigate based on result type
    if (result.type === "page") {
      navigate(result.path);
    } else if (result.type === "product") {
      if (userRole === "vendor") {
        navigate(`/vendor/products/${result.id}`);
      } else {
        navigate(`/products/${result.id}`);
      }
    } else if (result.type === "order") {
      if (userRole === "vendor") {
        navigate(`/vendor/orders`); // Vendor orders page
      } else {
        navigate(`/order/${result.id}`);
      }
    } else if (result.type === "vendor") {
      navigate(`/vendor/${result.id}`);
    } else if (result.type === "rider") {
      navigate(`/Rider`);
    } else if (result.type === "category") {
      navigate(`/category/view/${result.id}`);
    } else if (result.type === "coupon") {
      navigate(`/coupons/${result.id}`);
    } else if (result.url || result.path) {
      navigate(result.url || result.path);
    }
  };

  // Keyboard shortcut for search (Ctrl + /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }

      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    if (userRole !== "vendor" && userRole !== "admin") return;

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
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
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  // Initialize notification fetching
  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (role === "vendor" || role === "admin") {
      fetchUnreadCount();
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [userRole]);

  // Close dropdown when clicking outside
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

  // Get user name
  const getUserName = () => {
    if (userRole === "vendor" && vendorProfile) {
      return vendorProfile.vendorName || vendorProfile.storeName || "Vendor";
    }
    if (userRole === "admin" && adminProfile) {
      return adminProfile.name || "Admin";
    }
    return "User";
  };

  // Get user email
  const getUserEmail = () => {
    if (userRole === "vendor" && vendorProfile) {
      return vendorProfile.email || vendorProfile.contactNumber || "";
    }
    if (userRole === "admin" && adminProfile) {
      return adminProfile.email || adminProfile.mobile || "";
    }
    return "";
  };

  // Get user photo
  const getUserPhoto = () => {
    if (userRole === "vendor" && vendorProfile) {
      if (vendorProfile.profileImage) {
        if (
          Array.isArray(vendorProfile.profileImage) &&
          vendorProfile.profileImage.length > 0
        ) {
          return (
            vendorProfile.profileImage[0].url || vendorProfile.profileImage[0]
          );
        }
        if (typeof vendorProfile.profileImage === "string") {
          return vendorProfile.profileImage;
        }
        if (vendorProfile.profileImage.url) {
          return vendorProfile.profileImage.url;
        }
      }
      if (vendorProfile.profilePhoto && vendorProfile.profilePhoto.url) {
        return vendorProfile.profilePhoto.url;
      }
      if (vendorProfile.storeImage && vendorProfile.storeImage.length > 0) {
        return vendorProfile.storeImage[0].url;
      }
    }
    if (userRole === "admin" && adminProfile) {
      if (adminProfile.profileImage) {
        if (
          Array.isArray(adminProfile.profileImage) &&
          adminProfile.profileImage.length > 0
        ) {
          return (
            adminProfile.profileImage[0].url || adminProfile.profileImage[0]
          );
        }
        if (typeof adminProfile.profileImage === "string") {
          return adminProfile.profileImage;
        }
        if (adminProfile.profileImage.url) {
          return adminProfile.profileImage.url;
        }
      }
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
  };

  // Get icon for result type
  const getResultIcon = (result) => {
    if (result.icon) return result.icon;

    switch (result.type) {
      case "page":
        return <FiFileText className="text-gray-500" />;
      case "product":
        return <FiPackage className="text-blue-500" />;
      case "order":
        return <FiShoppingCart className="text-green-500" />;
      case "vendor":
        return <FiUsers className="text-purple-500" />;
      case "rider":
        return <FiTruck className="text-orange-500" />;
      case "category":
        return <FiGrid className="text-indigo-500" />;
      case "coupon":
        return <FiTag className="text-red-500" />;
      default:
        return <FiSearch className="text-gray-500" />;
    }
  };

  // Render search result item
  const renderSearchResult = (result, index) => {
    return (
      <button
        key={index}
        onClick={() => handleResultClick(result)}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b last:border-b-0 group"
      >
        <div className="text-lg flex-shrink-0">{getResultIcon(result)}</div>
        {result.image && (
          <img
            src={result.image}
            alt={result.title}
            className="w-10 h-10 rounded object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-600">
            {result.title}
          </p>
          {result.subtitle && (
            <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
          )}
        </div>
        {result.badge && (
          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full flex-shrink-0">
            {result.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 sm:left-64 h-[56px] flex items-center px-4 sm:px-6 lg:px-8 shadow-md z-50 bg-[#343d46]">
      {/* Sidebar toggle - Mobile */}
      <button className="text-white text-2xl mr-3 sm:hidden">
        <FiMenu />
      </button>

      {/* Search Bar */}
      <div
        className="flex-1 max-w-[180px] sm:max-w-[300px] md:max-w-md relative mr-2"
        ref={searchRef}
      >
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search in RushBasket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full h-9 pl-10 pr-20 rounded bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 z-10"
            >
              <FiX />
            </button>
          )}
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs bg-[#2c323a] px-1 rounded hidden sm:block">
            CTRL + /
          </span>
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && (searchQuery || searchResults.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50 border border-gray-200">
            {isSearching ? (
              <div className="px-4 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="mt-2 text-sm text-gray-500">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b sticky top-0">
                  <p className="text-xs font-medium text-gray-500">
                    {searchResults.length} result
                    {searchResults.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                {searchResults.map((result, index) =>
                  renderSearchResult(result, index),
                )}
              </div>
            ) : searchQuery.length > 0 ? (
              <div className="px-4 py-8 text-center">
                <FiSearch className="mx-auto text-3xl text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try different keywords
                </p>
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <FiSearch className="mx-auto text-3xl text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">
                  Start typing to search...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Search for pages, products, orders & more
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Icons - Notification and Profile */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* Notification Button */}
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
          {unreadCount === 0 &&
            (userRole === "vendor" || userRole === "admin") && (
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
              className="w-8 h-8 rounded-full border-2 border-gray-600 cursor-pointer object-cover hover:border-orange-500 transition-all"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
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
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
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
                <button
                  onClick={() => {
                    if (userRole === "vendor") {
                      navigate("/vendor/settings/profile");
                    } else {
                      navigate("/profile");
                    }
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <FiUser className="text-orange-500" /> Profile
                </button>
              </div>

              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  navigate("/", { replace: true });
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 border-t text-red-600 transition-colors"
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
