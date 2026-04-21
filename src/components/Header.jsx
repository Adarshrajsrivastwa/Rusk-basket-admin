// import React, { useState, useRef, useEffect, useCallback } from "react";
// import {
//   FiMenu,
//   FiBell,
//   FiUser,
//   FiLogOut,
//   FiPackage,
//   FiShoppingCart,
//   FiTruck,
//   FiDollarSign,
//   FiGrid,
//   FiUsers,
//   FiTag,
//   FiFileText,
//   FiSettings,
//   FiPieChart,
//   FiBarChart2,
// } from "react-icons/fi";
// import { useNavigate, useLocation } from "react-router-dom";
// import api, { BASE_URL } from "../api/api";

// // ─── Digital Clock Component ───────────────────────────────────────────────────
// const DigitalClock = () => {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const pad = (n) => String(n).padStart(2, "0");

//   const hours24 = time.getHours();
//   const hours12 = hours24 % 12 || 12;
//   const minutes = pad(time.getMinutes());
//   const seconds = pad(time.getSeconds());
//   const ampm = hours24 >= 12 ? "PM" : "AM";

//   const dateStr = time.toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//   });

//   return (
//     <div className="flex flex-col items-center justify-center  border border-gray-700 rounded-lg px-4 py-1.5 shadow-inner select-none">
//       {/* Time row */}
//       <div className="flex items-end gap-1 leading-none">
//         <span
//           className="text-white font-mono font-bold"
//           style={{ fontSize: "1.1rem", letterSpacing: "0.1em" }}
//         >
//           {pad(hours12)}
//         </span>
//         <span
//           className="text-white font-mono font-bold pb-px"
//           style={{
//             fontSize: "1.05rem",
//             animation: "blink 1s step-start infinite",
//           }}
//         >
//           :
//         </span>
//         <span
//           className="text-white font-mono font-bold"
//           style={{ fontSize: "1.1rem", letterSpacing: "0.1em" }}
//         >
//           {minutes}
//         </span>
//         <span
//           className="text-white font-mono font-bold pb-px"
//           style={{
//             fontSize: "1.05rem",
//             animation: "blink 1s step-start infinite",
//           }}
//         >
//           :
//         </span>
//         <span
//           className="text-gray-300 font-mono font-semibold"
//           style={{ fontSize: "1.1rem", letterSpacing: "0.1em" }}
//         >
//           {seconds}
//         </span>
//         <span className="text-white font-mono font-bold text-xs ml-1 pb-0.5">
//           {ampm}
//         </span>
//       </div>
//       {/* Date row */}
//       <p className="text-gray-300 text-xs font-medium tracking-wide mt-0.5">
//         {dateStr}
//       </p>

//       <style>{`
//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.15; }
//         }
//       `}</style>
//     </div>
//   );
// };

// // ─── Header Component ──────────────────────────────────────────────────────────
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

//       const token =
//         localStorage.getItem("token") || localStorage.getItem("authToken");
//       if (!token) {
//         setLoadingProfile(false);
//         return;
//       }

//       const response = await api.get("/api/vendor/profile");
//       if (response.data && response.data.success) {
//         setVendorProfile(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching vendor profile:", error);
//     } finally {
//       setLoadingProfile(false);
//     }
//   }, [userRole]);

//   // Fetch admin profile data
//   const fetchAdminProfile = useCallback(async () => {
//     if (userRole !== "admin") return;

//     try {
//       setLoadingProfile(true);

//       const token =
//         localStorage.getItem("token") || localStorage.getItem("authToken");
//       if (!token) {
//         setLoadingProfile(false);
//         return;
//       }

//       const response = await api.get("/api/admin/profile");
//       if (response.data && response.data.success) {
//         setAdminProfile(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching admin profile:", error);
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

//   // Refresh profile when navigating back to pages
//   useEffect(() => {
//     if (userRole === "vendor" && location.pathname.includes("/vendor")) {
//       const timer = setTimeout(() => {
//         fetchVendorProfile();
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (
//       userRole === "admin" &&
//       location.pathname.includes("/dashboard")
//     ) {
//       const timer = setTimeout(() => {
//         fetchAdminProfile();
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [location.pathname, userRole, fetchVendorProfile, fetchAdminProfile]);

//   // Static search data based on routes and user role
//   const getSearchablePages = useCallback(() => {
//     const adminPages = [
//       {
//         title: "Dashboard",
//         path: "/dashboard",
//         icon: <FiPieChart />,
//         category: "Main",
//       },
//       {
//         title: "All Products",
//         path: "/products/all",
//         icon: <FiPackage />,
//         category: "Products",
//       },
//       {
//         title: "Pending Products",
//         path: "/products/pending",
//         icon: <FiPackage />,
//         category: "Products",
//       },
//       {
//         title: "Add Product",
//         path: "/products/add",
//         icon: <FiPackage />,
//         category: "Products",
//       },
//       {
//         title: "Trending Products",
//         path: "/products/trending",
//         icon: <FiPackage />,
//         category: "Products",
//       },
//       {
//         title: "Inventory",
//         path: "/inventory",
//         icon: <FiGrid />,
//         category: "Products",
//       },
//       {
//         title: "All Vendors",
//         path: "/vendor/all",
//         icon: <FiUsers />,
//         category: "Vendors",
//       },
//       {
//         title: "All Admins",
//         path: "/admin/all",
//         icon: <FiUsers />,
//         category: "Admins",
//       },
//       {
//         title: "All Categories",
//         path: "/category/all",
//         icon: <FiGrid />,
//         category: "Categories",
//       },
//       {
//         title: "Create Category",
//         path: "/category/create",
//         icon: <FiGrid />,
//         category: "Categories",
//       },
//       {
//         title: "Create Sub Category",
//         path: "/category/create-sub",
//         icon: <FiGrid />,
//         category: "Categories",
//       },
//       {
//         title: "Banners",
//         path: "/banners",
//         icon: <FiFileText />,
//         category: "Marketing",
//       },
//       {
//         title: "All Orders",
//         path: "/orders/all",
//         icon: <FiShoppingCart />,
//         category: "Orders",
//       },
//       {
//         title: "All Riders",
//         path: "/Rider",
//         icon: <FiTruck />,
//         category: "Riders",
//       },
//       {
//         title: "Rider Withdrawal Requests",
//         path: "/admin/rider/withdrawal-requests",
//         icon: <FiDollarSign />,
//         category: "Riders",
//       },
//       {
//         title: "Vendor Withdrawal Requests",
//         path: "/admin/vendors/withdrawal-requests",
//         icon: <FiDollarSign />,
//         category: "Vendors",
//       },
//       {
//         title: "All Coupons",
//         path: "/coupons/all",
//         icon: <FiTag />,
//         category: "Marketing",
//       },
//       {
//         title: "Create Coupon",
//         path: "/coupons/create",
//         icon: <FiTag />,
//         category: "Marketing",
//       },
//       {
//         title: "Notifications",
//         path: "/notification",
//         icon: <FiBell />,
//         category: "Communication",
//       },
//       {
//         title: "Push Notification",
//         path: "/notification/push",
//         icon: <FiBell />,
//         category: "Communication",
//       },
//       {
//         title: "Sales Analytics",
//         path: "/analytics/sales",
//         icon: <FiPieChart />,
//         category: "Analytics",
//       },
//       {
//         title: "Analytics Dashboard",
//         path: "/analytics/dashboard",
//         icon: <FiPieChart />,
//         category: "Analytics",
//       },
//       {
//         title: "Vendor Report",
//         path: "/analytics/all",
//         icon: <FiPieChart />,
//         category: "Analytics",
//       },
//       {
//         title: "Payment Gateways",
//         path: "/payment-gateways",
//         icon: <FiDollarSign />,
//         category: "Settings",
//       },
//       {
//         title: "Suggestions",
//         path: "/suggestions",
//         icon: <FiFileText />,
//         category: "Support",
//       },
//       {
//         title: "Vendor Support",
//         path: "/admin/vendor-support",
//         icon: <FiUsers />,
//         category: "Support",
//       },
//       {
//         title: "User Support",
//         path: "/admin/user-support",
//         icon: <FiUsers />,
//         category: "Support",
//       },
//       {
//         title: "Rider Support",
//         path: "/admin/rider-support",
//         icon: <FiTruck />,
//         category: "Support",
//       },
//       {
//         title: "Rider Job Posting",
//         path: "/admin/rider-job-posting",
//         icon: <FiTruck />,
//         category: "Jobs",
//       },
//       {
//         title: "My Profile",
//         path: "/settings/profile",
//         icon: <FiUser />,
//         category: "Profile",
//       },
//       {
//         title: "All Notifications",
//         path: "/notifications/view-all",
//         icon: <FiBell />,
//         category: "Communication",
//       },
//     ];

//     const vendorPages = [
//       {
//         title: "Dashboard",
//         path: "/vendor/dashboard",
//         icon: <FiPieChart />,
//         category: "Main",
//       },
//       {
//         title: "Products",
//         path: "/vendor/products",
//         icon: <FiPackage />,
//         category: "Products",
//       },
//       {
//         title: "Inventory",
//         path: "/vendor/inventory",
//         icon: <FiGrid />,
//         category: "Products",
//       },
//       {
//         title: "Orders",
//         path: "/vendor/orders",
//         icon: <FiShoppingCart />,
//         category: "Orders",
//       },
//       {
//         title: "Analytics",
//         path: "/vendor/analytics",
//         icon: <FiPieChart />,
//         category: "Analytics",
//       },
//       {
//         title: "Rider Jobs",
//         path: "/vendor/jobs",
//         icon: <FiTruck />,
//         category: "Jobs",
//       },
//       {
//         title: "Rider Due Amounts",
//         path: "/vendor/rider-due-amounts",
//         icon: <FiDollarSign />,
//         category: "Finance",
//       },
//       {
//         title: "Withdrawal Requests",
//         path: "/vendor/withdrawal-requests",
//         icon: <FiDollarSign />,
//         category: "Finance",
//       },
//       {
//         title: "Daily Offers",
//         path: "/vendor/daily-offers",
//         icon: <FiTag />,
//         category: "Marketing",
//       },
//       {
//         title: "Notifications",
//         path: "/vendor/notifications",
//         icon: <FiBell />,
//         category: "Communication",
//       },
//       {
//         title: "Support",
//         path: "/vendor-support",
//         icon: <FiFileText />,
//         category: "Support",
//       },
//       {
//         title: "Profile Settings",
//         path: "/vendor/settings/profile",
//         icon: <FiSettings />,
//         category: "Profile",
//       },
//       {
//         title: "Update Profile",
//         path: "/vendor/update-profile",
//         icon: <FiUser />,
//         category: "Profile",
//       },
//       {
//         title: "Sales Report",
//         path: "/vendor/reports",
//         icon: <FiBarChart2 />,
//         category: "Analytics",
//       },
//     ];

//     if (userRole === "admin") return adminPages;
//     else if (userRole === "vendor") return vendorPages;
//     return [];
//   }, [userRole]);

//   // Fetch unread notification count
//   const fetchUnreadCount = async () => {
//     if (userRole !== "vendor" && userRole !== "admin") return;

//     try {
//       const token =
//         localStorage.getItem("token") || localStorage.getItem("authToken");
//       if (!token) {
//         setUnreadCount(0);
//         return;
//       }

//       let response;
//       if (userRole === "vendor") {
//         response = await api.get("/api/vendor/notifications/unread-count");
//       } else if (userRole === "admin") {
//         response = await api.get("/api/admin/notifications/unread-count");
//       }

//       if (response && response.data && response.data.success) {
//         setUnreadCount(response.data.unreadCount || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching unread count:", error);
//       setUnreadCount(0);
//     }
//   };

//   // Initialize notification fetching
//   useEffect(() => {
//     const role = localStorage.getItem("userRole");

//     if (role === "vendor" || role === "admin") {
//       fetchUnreadCount();
//       const interval = setInterval(() => {
//         fetchUnreadCount();
//       }, 30000);

//       return () => {
//         clearInterval(interval);
//       };
//     }
//   }, [userRole]);

//   // Close dropdown when clicking outside
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
//     if (userRole === "vendor") return "/vendor/notifications";
//     if (userRole === "admin") return "/topbar-notifications";
//     return "/topbar-notifications";
//   };

//   // Get user name
//   const getUserName = () => {
//     if (userRole === "vendor" && vendorProfile) {
//       return vendorProfile.vendorName || vendorProfile.storeName || "Vendor";
//     }
//     if (userRole === "admin" && adminProfile) {
//       return adminProfile.name || "Admin";
//     }
//     return "User";
//   };

//   // Get user email
//   const getUserEmail = () => {
//     if (userRole === "vendor" && vendorProfile) {
//       return vendorProfile.email || vendorProfile.contactNumber || "";
//     }
//     if (userRole === "admin" && adminProfile) {
//       return adminProfile.email || adminProfile.mobile || "";
//     }
//     return "";
//   };

//   // Get user photo
//   const getUserPhoto = () => {
//     if (userRole === "vendor" && vendorProfile) {
//       if (vendorProfile.profileImage) {
//         if (
//           Array.isArray(vendorProfile.profileImage) &&
//           vendorProfile.profileImage.length > 0
//         ) {
//           return (
//             vendorProfile.profileImage[0].url || vendorProfile.profileImage[0]
//           );
//         }
//         if (typeof vendorProfile.profileImage === "string")
//           return vendorProfile.profileImage;
//         if (vendorProfile.profileImage.url)
//           return vendorProfile.profileImage.url;
//       }
//       if (vendorProfile.profilePhoto && vendorProfile.profilePhoto.url)
//         return vendorProfile.profilePhoto.url;
//       if (vendorProfile.storeImage && vendorProfile.storeImage.length > 0)
//         return vendorProfile.storeImage[0].url;
//     }
//     if (userRole === "admin" && adminProfile) {
//       if (adminProfile.profileImage) {
//         if (
//           Array.isArray(adminProfile.profileImage) &&
//           adminProfile.profileImage.length > 0
//         ) {
//           return (
//             adminProfile.profileImage[0].url || adminProfile.profileImage[0]
//           );
//         }
//         if (typeof adminProfile.profileImage === "string")
//           return adminProfile.profileImage;
//         if (adminProfile.profileImage.url) return adminProfile.profileImage.url;
//       }
//     }
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 sm:left-64 h-[64px] flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-lg z-50 bg-gradient-to-r from-[#343d46] to-[#2a3239] border-b border-gray-700">
//       {/* Left Section - Mobile toggle + Digital Clock */}
//       <div className="flex items-center gap-4">
//         {/* Sidebar toggle - Mobile only */}
//         <button className="text-white text-2xl hover:text-orange-400 transition-colors sm:hidden">
//           {/* <FiMenu /> */}
//         </button>

//         {/* Digital Clock */}
//         <DigitalClock />
//       </div>

//       {/* Right Section - Notification and Profile */}
//       <div className="flex items-center gap-3 sm:gap-4">
//         {/* Notification Button */}
//         <button
//           onClick={() => navigate(getNotificationRoute())}
//           className="relative text-white text-xl p-2.5 hover:bg-[#414b57] rounded-lg transition-all hover:scale-105"
//           title="Notifications"
//         >
//           <FiBell />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1.5 font-bold animate-pulse shadow-lg">
//               {unreadCount > 99 ? "99+" : unreadCount}
//             </span>
//           )}
//           {unreadCount === 0 &&
//             (userRole === "vendor" || userRole === "admin") && (
//               <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs w-3 h-3 rounded-full" />
//             )}
//         </button>

//         {/* User Profile Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="focus:outline-none flex items-center gap-3 hover:bg-[#414b57] rounded-lg px-2 py-1.5 transition-all"
//             title="Profile Menu"
//           >
//             <div className="relative">
//               <img
//                 src={getUserPhoto()}
//                 alt={getUserName()}
//                 className="w-10 h-10 rounded-full border-2 border-gray-500 cursor-pointer object-cover hover:border-orange-400 transition-all shadow-md"
//                 onError={(e) => {
//                   e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
//                 }}
//               />
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#343d46] rounded-full shadow-sm" />
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-semibold text-white leading-tight">
//                 {loadingProfile ? "Loading..." : getUserName()}
//               </p>
//               <p className="text-xs text-gray-400 leading-tight">
//                 {userRole === "admin" ? "Administrator" : "Vendor"}
//               </p>
//             </div>
//           </button>

//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200">
//               {/* User Info Section */}
//               <div className="px-5 py-4 border-b bg-gradient-to-r from-orange-50 to-white">
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={getUserPhoto()}
//                     alt={getUserName()}
//                     className="w-14 h-14 rounded-full border-3 border-orange-200 object-cover shadow-md"
//                     onError={(e) => {
//                       e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=FF7B1D&color=fff&size=128`;
//                     }}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-bold text-gray-800 truncate">
//                       {loadingProfile ? "Loading..." : getUserName()}
//                     </p>
//                     <p className="text-xs text-gray-500 truncate mt-0.5">
//                       {getUserEmail()}
//                     </p>
//                     <p className="text-xs text-orange-600 font-medium mt-1">
//                       {userRole === "admin" ? "Administrator" : "Vendor"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Menu Items */}
//               <div className="py-2">
//                 {/* Profile Settings */}
//                 <button
//                   onClick={() => {
//                     if (userRole === "vendor") {
//                       navigate("/vendor/settings/profile");
//                     } else {
//                       navigate("/settings/profile");
//                     }
//                     setIsDropdownOpen(false);
//                   }}
//                   className="w-full px-5 py-3 text-sm flex items-center gap-3 hover:bg-orange-50 text-gray-700 transition-colors font-medium"
//                 >
//                   <FiUser className="text-orange-500 text-lg" />
//                   <span>Profile Settings</span>
//                 </button>

//                 {/* Sales Report — visible only for vendors */}
//                 {userRole === "vendor" && (
//                   <button
//                     onClick={() => {
//                       navigate("/vendor/reports");
//                       setIsDropdownOpen(false);
//                     }}
//                     className="w-full px-5 py-3 text-sm flex items-center gap-3 hover:bg-orange-50 text-gray-700 transition-colors font-medium"
//                   >
//                     <FiBarChart2 className="text-orange-500 text-lg" />
//                     <span>Sales Report</span>
//                   </button>
//                 )}
//               </div>

//               {/* Logout Button */}
//               <div className="border-t border-gray-200">
//                 <button
//                   onClick={async () => {
//                     try {
//                       const token =
//                         localStorage.getItem("token") ||
//                         localStorage.getItem("authToken");
//                       if (token) {
//                         const headers = { "Content-Type": "application/json" };
//                         if (token) headers["Authorization"] = `Bearer ${token}`;

//                         try {
//                           if (userRole === "admin") {
//                             await fetch(`${BASE_URL}/api/auth/admin/logout`, {
//                               method: "POST",
//                               credentials: "include",
//                               headers: headers,
//                             });
//                           } else if (userRole === "vendor") {
//                             await fetch(`${BASE_URL}/api/vendor/logout`, {
//                               method: "POST",
//                               credentials: "include",
//                               headers: headers,
//                             });
//                           }
//                         } catch (apiError) {
//                           console.error("Logout API error:", apiError);
//                           // Continue with logout even if API fails
//                         }
//                       }
//                     } catch (error) {
//                       console.error("Logout error:", error);
//                     } finally {
//                       // Clear storage and navigate
//                       localStorage.clear();
//                       sessionStorage.clear();
//                       navigate("/", { replace: true });
//                       setIsDropdownOpen(false);
//                     }
//                   }}
//                   className="w-full px-5 py-3 text-sm flex items-center gap-3 hover:bg-red-50 text-red-600 transition-colors font-semibold"
//                 >
//                   <FiLogOut className="text-lg" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiBell, FiUser, FiLogOut, FiBarChart2 } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import api, { BASE_URL } from "../api/api";

/* ─── Digital Clock ─────────────────────────────────────────────── */
const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  const h24 = time.getHours();
  const h12 = h24 % 12 || 12;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <style>{`
        @keyframes hblink { 0%,100%{opacity:1} 50%{opacity:0.15} }
        .hb-clock-wrap {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border: 1px solid rgba(255,123,29,0.2);
          border-radius: 10px; padding: 6px 14px;
          background: rgba(255,123,29,0.06);
          box-shadow: 0 0 12px rgba(255,123,29,0.08), inset 0 1px 0 rgba(255,255,255,0.04);
          select: none;
        }
        .hb-clock-digits { display:flex; align-items:flex-end; gap:2px; line-height:1; }
        .hb-d { font-family:'Sora',monospace; font-weight:700; font-size:1.05rem; letter-spacing:0.1em; color:#e2e8f0; }
        .hb-colon { font-family:'Sora',monospace; font-weight:700; font-size:1rem; color:#FF7B1D; padding-bottom:1px; animation: hblink 1s step-start infinite; }
        .hb-sec { font-family:'Sora',monospace; font-weight:600; font-size:1.05rem; letter-spacing:0.1em; color:#6b80a0; }
        .hb-ampm { font-family:'Sora',monospace; font-weight:700; font-size:0.65rem; color:#FF7B1D; margin-left:4px; padding-bottom:2px; letter-spacing:0.05em; }
        .hb-date { font-family:'Sora',sans-serif; font-size:0.68rem; font-weight:500; color:#6b80a0; letter-spacing:0.06em; margin-top:2px; }
      `}</style>
      <div className="hb-clock-wrap">
        <div className="hb-clock-digits">
          <span className="hb-d">{pad(h12)}</span>
          <span className="hb-colon">:</span>
          <span className="hb-d">{pad(time.getMinutes())}</span>
          <span className="hb-colon">:</span>
          <span className="hb-sec">{pad(time.getSeconds())}</span>
          <span className="hb-ampm">{ampm}</span>
        </div>
        <p className="hb-date">{dateStr}</p>
      </div>
    </>
  );
};

/* ─── Header ─────────────────────────────────────────────────────── */
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

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const fetchVendorProfile = useCallback(async () => {
    if (userRole !== "vendor") return;
    try {
      setLoadingProfile(true);
      const res = await api.get("/api/vendor/profile");
      if (res.data?.success) setVendorProfile(res.data.data);
    } catch (_) {
    } finally {
      setLoadingProfile(false);
    }
  }, [userRole]);

  const fetchAdminProfile = useCallback(async () => {
    if (userRole !== "admin") return;
    try {
      setLoadingProfile(true);
      const res = await api.get("/api/admin/profile");
      if (res.data?.success) setAdminProfile(res.data.data);
    } catch (_) {
    } finally {
      setLoadingProfile(false);
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === "vendor") fetchVendorProfile();
    else if (userRole === "admin") fetchAdminProfile();
  }, [userRole, fetchVendorProfile, fetchAdminProfile]);

  useEffect(() => {
    if (userRole === "vendor" && location.pathname.includes("/vendor")) {
      const t = setTimeout(fetchVendorProfile, 1000);
      return () => clearTimeout(t);
    }
    if (userRole === "admin" && location.pathname.includes("/dashboard")) {
      const t = setTimeout(fetchAdminProfile, 1000);
      return () => clearTimeout(t);
    }
  }, [location.pathname, userRole, fetchVendorProfile, fetchAdminProfile]);

  const fetchUnread = async () => {
    if (userRole !== "vendor" && userRole !== "admin") return;
    try {
      const res =
        userRole === "vendor"
          ? await api.get("/api/vendor/notifications/unread-count")
          : await api.get("/api/admin/notifications/unread-count");
      if (res?.data?.success) setUnreadCount(res.data.unreadCount || 0);
    } catch (_) {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "vendor" || role === "admin") {
      fetchUnread();
      const iv = setInterval(fetchUnread, 30000);
      return () => clearInterval(iv);
    }
  }, [userRole]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getNotifRoute = () =>
    userRole === "vendor" ? "/vendor/notifications" : "/topbar-notifications";

  const getName = () => {
    if (userRole === "vendor" && vendorProfile)
      return vendorProfile.vendorName || vendorProfile.storeName || "Vendor";
    if (userRole === "admin" && adminProfile)
      return adminProfile.name || "Admin";
    return "User";
  };
  const getEmail = () => {
    if (userRole === "vendor" && vendorProfile)
      return vendorProfile.email || vendorProfile.contactNumber || "";
    if (userRole === "admin" && adminProfile)
      return adminProfile.email || adminProfile.mobile || "";
    return "";
  };
  const getPhoto = () => {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(getName())}&background=FF7B1D&color=fff&size=128`;
    const src = userRole === "vendor" ? vendorProfile : adminProfile;
    if (!src) return fallback;
    const img = src.profileImage;
    if (Array.isArray(img) && img.length) return img[0].url || img[0];
    if (typeof img === "string") return img;
    if (img?.url) return img.url;
    if (src.profilePhoto?.url) return src.profilePhoto.url;
    return fallback;
  };

  const handleLogout = async () => {
    try {
      const tok =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
      };
      const url =
        userRole === "admin"
          ? `${BASE_URL}/api/auth/admin/logout`
          : `${BASE_URL}/api/vendor/logout`;
      await fetch(url, { method: "POST", credentials: "include", headers });
    } catch (_) {
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true });
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        .hb-header {
          position: fixed; top: 0; left: 0; right: 0; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding-left: 80px; padding-right: 20px;
          z-index: 50;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background:
            radial-gradient(ellipse 60% 80% at 0% 50%, rgba(255,123,29,0.06) 0%, transparent 60%),
            linear-gradient(180deg, #0c1528 0%, #081020 100%);
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
          font-family: 'Sora', sans-serif;
        }
        /* subtle bottom accent line */
        .hb-header::after {
          content: '';
          position: absolute; bottom: 0; left: 64px; right: 0; height: 1px;
          background: linear-gradient(90deg, rgba(255,123,29,0.3), rgba(255,123,29,0.08) 40%, transparent);
          pointer-events: none;
        }

        /* Bell button */
        .hb-bell {
          position: relative; color: #6b80a0; font-size: 1.2rem;
          padding: 9px; border-radius: 10px; border: none; cursor: pointer;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.18s;
          display: flex; align-items: center; justify-content: center;
        }
        .hb-bell:hover {
          color: #FF7B1D;
          background: rgba(255,123,29,0.1);
          border-color: rgba(255,123,29,0.25);
          box-shadow: 0 0 14px rgba(255,123,29,0.15);
          transform: scale(1.06);
        }
        .hb-badge {
          position: absolute; top: -4px; right: -4px;
          background: #ef4444; color: #fff;
          font-size: 0.6rem; font-weight: 700; font-family: 'Sora', sans-serif;
          min-width: 18px; height: 18px; border-radius: 99px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px; border: 2px solid #081020;
          animation: hbPulse 2s ease-in-out infinite;
        }
        .hb-badge-dot {
          position: absolute; top: -3px; right: -3px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #4b5563; border: 2px solid #081020;
        }
        @keyframes hbPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50%      { box-shadow: 0 0 0 4px rgba(239,68,68,0); }
        }

        /* Profile trigger */
        .hb-profile-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 10px 5px 5px; border-radius: 12px; cursor: pointer;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.18s;
        }
        .hb-profile-btn:hover {
          background: rgba(255,123,29,0.08);
          border-color: rgba(255,123,29,0.2);
        }
        .hb-avatar-wrap { position: relative; }
        .hb-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          border: 2px solid rgba(255,123,29,0.3);
          object-fit: cover;
          transition: border-color 0.18s;
        }
        .hb-profile-btn:hover .hb-avatar { border-color: #FF7B1D; }
        .hb-online {
          position: absolute; bottom: -1px; right: -1px;
          width: 9px; height: 9px; border-radius: 50%;
          background: #22c55e; border: 2px solid #081020;
        }
        .hb-name {
          font-size: 0.78rem; font-weight: 700; color: #c0d0e8; line-height: 1.2;
        }
        .hb-role {
          font-size: 0.65rem; font-weight: 500; color: #FF7B1D; letter-spacing: 0.04em;
        }

        /* Dropdown */
        .hb-dropdown {
          position: absolute; right: 0; top: calc(100% + 10px);
          width: 260px; border-radius: 14px; overflow: hidden;
          z-index: 999;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,123,29,0.08);
          background: linear-gradient(180deg, #0f1e35 0%, #0a1628 100%);
          animation: hbDropIn 0.18s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes hbDropIn {
          from { opacity:0; transform: translateY(-8px) scale(0.97); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }

        /* Dropdown user card */
        .hb-drop-card {
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: linear-gradient(135deg, rgba(255,123,29,0.07) 0%, transparent 60%);
          display: flex; align-items: center; gap: 12px;
        }
        .hb-drop-avatar {
          width: 48px; height: 48px; border-radius: 12px; object-fit: cover;
          border: 2px solid rgba(255,123,29,0.35);
          box-shadow: 0 0 14px rgba(255,123,29,0.2);
          flex-shrink: 0;
        }
        .hb-drop-name {
          font-size: 0.82rem; font-weight: 700; color: #e2e8f0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hb-drop-email {
          font-size: 0.67rem; font-weight: 400; color: #6b80a0; margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hb-drop-badge {
          display: inline-block; margin-top: 5px;
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: #FF7B1D;
          background: rgba(255,123,29,0.12); border: 1px solid rgba(255,123,29,0.25);
          border-radius: 6px; padding: 2px 8px;
        }

        /* Dropdown menu items */
        .hb-drop-menu { padding: 8px; }
        .hb-drop-item {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 9px;
          font-size: 0.8rem; font-weight: 600; color: #6b80a0;
          background: transparent; border: none; cursor: pointer;
          transition: all 0.14s; text-align: left;
        }
        .hb-drop-item:hover {
          color: #c0d0e8;
          background: rgba(255,255,255,0.05);
        }
        .hb-drop-item svg { color: #FF7B1D; font-size: 1rem; flex-shrink: 0; }

        /* Logout */
        .hb-drop-footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 8px; }
        .hb-drop-logout {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 9px;
          font-size: 0.8rem; font-weight: 700; color: #f87171;
          background: transparent; border: none; cursor: pointer;
          transition: all 0.14s;
        }
        .hb-drop-logout:hover {
          color: #ef4444;
          background: rgba(239,68,68,0.1);
        }
        .hb-drop-logout svg { font-size: 1rem; flex-shrink: 0; }

        .hb-right { display: flex; align-items: center; gap: 10px; }
      `}</style>

      <header className="hb-header">
        {/* Left — Clock */}
        <div>
          <DigitalClock />
        </div>

        {/* Right — Notifications + Profile */}
        <div className="hb-right">
          {/* Bell */}
          <button
            className="hb-bell"
            onClick={() => navigate(getNotifRoute())}
            title="Notifications"
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="hb-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            {unreadCount === 0 &&
              (userRole === "vendor" || userRole === "admin") && (
                <span className="hb-badge-dot" />
              )}
          </button>

          {/* Profile dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              className="hb-profile-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="hb-avatar-wrap">
                <img
                  src={getPhoto()}
                  alt={getName()}
                  className="hb-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getName())}&background=FF7B1D&color=fff&size=128`;
                  }}
                />
                <span className="hb-online" />
              </div>
              <div style={{ display: "none" }} className="md-show">
                <p className="hb-name">
                  {loadingProfile ? "Loading…" : getName()}
                </p>
                <p className="hb-role">
                  {userRole === "admin" ? "Administrator" : "Vendor"}
                </p>
              </div>
              {/* Show name on md+ */}
              <div className="hidden md:block">
                <p className="hb-name">
                  {loadingProfile ? "Loading…" : getName()}
                </p>
                <p className="hb-role">
                  {userRole === "admin" ? "Administrator" : "Vendor"}
                </p>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="hb-dropdown">
                {/* User card */}
                <div className="hb-drop-card">
                  <img
                    src={getPhoto()}
                    alt={getName()}
                    className="hb-drop-avatar"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getName())}&background=FF7B1D&color=fff&size=128`;
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p className="hb-drop-name">
                      {loadingProfile ? "Loading…" : getName()}
                    </p>
                    <p className="hb-drop-email">{getEmail()}</p>
                    <span className="hb-drop-badge">
                      {userRole === "admin" ? "Administrator" : "Vendor"}
                    </span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="hb-drop-menu">
                  <button
                    className="hb-drop-item"
                    onClick={() => {
                      navigate(
                        userRole === "vendor"
                          ? "/vendor/settings/profile"
                          : "/settings/profile",
                      );
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FiUser />
                    <span>Profile Settings</span>
                  </button>

                  {userRole === "vendor" && (
                    <button
                      className="hb-drop-item"
                      onClick={() => {
                        navigate("/vendor/reports");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FiBarChart2 />
                      <span>Sales Report</span>
                    </button>
                  )}
                </div>

                {/* Logout */}
                <div className="hb-drop-footer">
                  <button className="hb-drop-logout" onClick={handleLogout}>
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
