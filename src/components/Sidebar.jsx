// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Package,
//   Truck,
//   Boxes,
//   ShoppingCart,
//   Tags,
//   TicketPercent,
//   BarChart3,
//   Store,
//   Headphones,
//   Users,
//   Settings,
//   ChevronDown,
//   ChevronUp,
//   Menu,
//   X,
//   User,
//   KeyRound,
//   UserCog,
//   LogOut,
//   Image,
//   CreditCard,
//   MessageSquare,
//   Briefcase,
//   Gift,
// } from "lucide-react";
// import AddVendorModal from "./AddVendorModal";
// import AddProductPopup from "../components/AddProduct"; // ✅ Import Product Modal
// import { BASE_URL } from "../api/api";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [showAddVendorModal, setShowAddVendorModal] = useState(false);
//   const [showAddProductModal, setShowAddProductModal] = useState(false); // ✅ Product modal state
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [activeItem, setActiveItem] = useState("/");

//   useEffect(() => {
//     setActiveItem(location.pathname + location.search);
//   }, [location.pathname, location.search]);

//   const toggleDropdown = (name) => {
//     setOpenDropdown((prev) => (prev === name ? null : name));
//   };

//   // ✅ Handler for Add Vendor click
//   const handleAddVendorClick = (e) => {
//     e.preventDefault();
//     setShowAddVendorModal(true);
//     if (window.innerWidth < 768) setIsOpen(false);
//   };

//   // ✅ Handler for Add Product click
//   const handleAddProductClick = (e) => {
//     e.preventDefault();
//     setShowAddProductModal(true);
//     if (window.innerWidth < 768) setIsOpen(false);
//   };

//   // ✅ Handler for Logout click
//   const handleLogoutClick = async (e) => {
//     e.preventDefault();

//     if (isLoggingOut) return; // Prevent multiple clicks

//     try {
//       setIsLoggingOut(true);

//       // Get token from localStorage
//       const token =
//         localStorage.getItem("token") || localStorage.getItem("authToken");

//       const headers = {};

//       if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//       }

//       // Call logout API
//       const response = await fetch(`${BASE_URL}/api/auth/admin/logout`, {
//         method: "POST",
//         credentials: "include",
//         headers: headers,
//       });

//       const data = await response.json();

//       // Clear local storage regardless of API response
//       localStorage.removeItem("token");
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("user");
//       localStorage.removeItem("adminData");

//       // Clear any other auth-related items
//       sessionStorage.clear();

//       // Navigate to login page
//       navigate("/", { replace: true });

//       // Close mobile sidebar if open
//       if (window.innerWidth < 768) setIsOpen(false);
//     } catch (error) {
//       console.error("Logout error:", error);

//       // Even if API fails, clear local storage and redirect
//       localStorage.removeItem("token");
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("user");
//       localStorage.removeItem("adminData");
//       sessionStorage.clear();

//       navigate("/", { replace: true });
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   // ✅ Menu Items
//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: <LayoutDashboard size={16} />,
//       path: "/dashboard",
//     },
//     {
//       name: "Product Management",
//       icon: <Package size={16} />,
//       subItems: [
//         // { name: "Product", path: "/products/all", hasDot: true },
//         { name: "All Product", path: "/products/all" },
//         // { name: "Trending Product", path: "/products/trending" },
//         { name: "Pending Product", path: "/products/pending" },
//       ],
//     },
//     // {
//     //   name: "Inventory",
//     //   icon: <Boxes size={16} />,
//     //   path: "/inventory",
//     // },
//     {
//       name: "Order Management",
//       icon: <ShoppingCart size={16} />,
//       subItems: [
//         { name: "All Order", path: "/orders/all?tab=all" },
//         // { name: "Pending Order", path: "/orders/pending" },
//         // { name: "Delivered", path: "/orders/all?tab=delivered" },
//         // { name: "Cancel", path: "/orders/all?tab=cancel" },
//       ],
//     },
//     {
//       name: "Category Management",
//       icon: <Tags size={16} />,
//       subItems: [
//         { name: "All Category", path: "/category/all" },
//         { name: "Create Category", path: "/category/create" },
//         { name: "Create Sub Category", path: "/category/create-sub" },
//       ],
//     },
//     {
//       name: "Banners Management",
//       icon: <Image size={16} />,
//       path: "/banners",
//     },
//     {
//       name: "Push Notification",
//       icon: <Image size={16} />,
//       path: "/push",
//     },

//     {
//       name: "Coupons & Offer",
//       icon: <TicketPercent size={16} />,
//       subItems: [
//         { name: "All Coupons", path: "/coupons/all" },
//         // { name: "Create Coupons", path: "/coupons/create" },
//         // { name: "Prepaid Offer (%)", path: "/coupons/prepaid" },
//       ],
//     },
//     {
//       name: "Analytics",
//       icon: <BarChart3 size={16} />,
//       subItems: [
//         { name: "All Report", path: "/analytics/all" },
//         // { name: "Vendor Report", path: "/analytics/vendor" },
//         // { name: "Analytics Dashboard", path: "/analytics/dashboard" },
//       ],
//     },

//     {
//       name: "Rider Management",
//       icon: <Truck size={16} />,
//       subItems: [
//         { name: "All Riders", path: "/Rider" },
//         {
//           name: "Commission Management",
//           path: "/rider/commission",
//         },
//         {
//           name: "Withdrawal Requests",
//           path: "/admin/rider/withdrawal-requests",
//         },
//       ],
//     },
//     {
//       name: "Rider Job Posting",
//       icon: <Briefcase size={16} />,
//       path: "/admin/rider-job-posting",
//     },
//     {
//       name: "Vendor Management",
//       icon: <Store size={16} />,
//       subItems: [
//         { name: "All Vendor", path: "/vendor/all" },
//         { name: "Add Vendor", path: "/vendor/add", isModal: true },
//         { name: "Commission Management", path: "/vendor/commission" },
//         {
//           name: "Withdrawal Requests",
//           path: "/admin/vendors/withdrawal-requests",
//         },
//         // { name: "Vendor Dashboard", path: "/vendor/details" },
//       ],
//     },
//     {
//       name: "Admin Management",
//       icon: <UserCog size={16} />,
//       subItems: [{ name: "All Admin", path: "/admin/all" }],
//     },

//     {
//       name: "Vendor Support",
//       icon: <Headphones size={16} />,
//       path: "/admin/vendor-support",
//     },

//     {
//       name: "User Support",
//       icon: <Users size={16} />,
//       path: "/admin/user-support",
//     },

//     {
//       name: "Rider Support",
//       icon: <Truck size={16} />,
//       path: "/admin/rider-support",
//     },
//     {
//       name: "Payment Gateways",
//       icon: <CreditCard size={16} />,
//       path: "/payment-gateways",
//     },
//     {
//       name: "Suggestions",
//       icon: <MessageSquare size={16} />,
//       path: "/suggestions",
//     },
//     {
//       name: "Referral & Cashback",
//       icon: <Gift size={16} />,
//       path: "/admin/referral-cashback-settings",
//     },
//     {
//       name: "Settings",
//       icon: <Settings size={16} />,
//       subItems: [
//         {
//           name: "Profile",
//           path: "/settings/profile",
//           icon: <User size={14} />,
//         },
//         // {
//         //   name: "Change Password",
//         //   path: "/settings/password",
//         //   icon: <KeyRound size={14} />,
//         // },
//         // {
//         //   name: "Manage Role",
//         //   path: "/settings/role",
//         //   icon: <UserCog size={14} />,
//         // },
//         {
//           name: "Logout",
//           path: "/logout",
//           icon: <LogOut size={14} />,
//           isLogout: true, // ✅ Special flag for logout
//         },
//       ],
//     },
//   ];

//   useEffect(() => {
//     const openItem = menuItems.find(
//       (item) =>
//         item.subItems &&
//         item.subItems.some((sub) =>
//           (location.pathname + location.search).startsWith(
//             sub.path.split("?")[0],
//           ),
//         ),
//     );
//     if (openItem) setOpenDropdown(openItem.name);
//   }, [location.pathname, location.search]);

//   return (
//     <>
//       {/* Mobile Toggle */}
//       <button
//         className="fixed top-4 left-4 z-50 md:hidden text-2xl text-white"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X strokeWidth={8} /> : <Menu strokeWidth={3} />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-screen w-64 bg-white text-black shadow-lg flex flex-col p-2 transition-transform duration-300 z-40
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//       >
//         <div className="flex-1 overflow-y-auto mt-3 pr-2 custom-scrollbar">
//           <ul className="text-[13px] flex flex-col space-y-[2px]">
//             {menuItems.map((item, index) => {
//               const isActive =
//                 activeItem === item.path ||
//                 (item.subItems &&
//                   item.subItems.some((sub) =>
//                     activeItem.startsWith(sub.path.split("?")[0]),
//                   ));
//               const isDropdownOpen = openDropdown === item.name;

//               return (
//                 <React.Fragment key={item.name}>
//                   {/* Dashboard */}
//                   {index === 0 && (
//                     <>
//                       <li className="flex flex-col mt-12 md:mt-3">
//                         <Link
//                           to={item.path}
//                           className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 bg-gray-200 text-black"
//                           onClick={() =>
//                             window.innerWidth < 768 && setIsOpen(false)
//                           }
//                         >
//                           {item.icon}
//                           <span>{item.name}</span>
//                         </Link>
//                       </li>

//                       <p className="mt-4 mb-2 text-[11px] font-semibold tracking-wide text-gray-500 px-2">
//                         MAIN MENU
//                       </p>
//                     </>
//                   )}

//                   {/* Other Items */}
//                   {index !== 0 && (
//                     <li className="flex flex-col">
//                       {!item.subItems ? (
//                         <Link
//                           to={item.path}
//                           className={`flex items-center gap-2 px-2 py-1.5 rounded-md font-semibold transition-all duration-200
//                             ${
//                               isActive
//                                 ? "bg-[#F26422] text-white shadow-sm"
//                                 : "hover:bg-gray-100 text-black"
//                             }`}
//                           onClick={() =>
//                             window.innerWidth < 768 && setIsOpen(false)
//                           }
//                         >
//                           {item.icon}
//                           <span>{item.name}</span>
//                         </Link>
//                       ) : (
//                         <>
//                           <div
//                             className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-200 font-semibold
//                               ${
//                                 isActive
//                                   ? "text-[#F26422]"
//                                   : "text-black hover:bg-gray-100"
//                               }`}
//                             onClick={() => toggleDropdown(item.name)}
//                           >
//                             <div className="flex items-center gap-2">
//                               {item.icon}
//                               <span>{item.name}</span>
//                             </div>
//                             {isDropdownOpen ? (
//                               <ChevronUp size={12} />
//                             ) : (
//                               <ChevronDown size={12} />
//                             )}
//                           </div>

//                           {/* Submenu */}
//                           <ul
//                             className={`ml-4 border-l pl-3 mt-1 overflow-hidden transition-all duration-300 ease-in-out
//                               ${
//                                 isDropdownOpen
//                                   ? "max-h-64 opacity-100"
//                                   : "max-h-0 opacity-0"
//                               }`}
//                           >
//                             {item.subItems.map((sub) => {
//                               const subActive =
//                                 activeItem === sub.path ||
//                                 activeItem.startsWith(sub.path.split("?")[0]);

//                               return (
//                                 <li key={sub.name} className="relative">
//                                   {sub.isModal || sub.isLogout ? (
//                                     <a
//                                       href="#"
//                                       onClick={(e) => {
//                                         if (sub.isLogout) {
//                                           handleLogoutClick(e);
//                                         } else if (sub.name === "Product") {
//                                           handleAddProductClick(e);
//                                         } else {
//                                           handleAddVendorClick(e);
//                                         }
//                                       }}
//                                       className={`block px-2 py-1 rounded-md transition-colors duration-200
//                                         ${
//                                           subActive
//                                             ? "text-[#F26422] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#F26422]"
//                                             : "text-black hover:text-[#F26422]"
//                                         }
//                                         ${sub.isLogout && isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
//                                     >
//                                       <div className="flex items-center gap-1">
//                                         {sub.icon && sub.icon}
//                                         <span>
//                                           {sub.isLogout && isLoggingOut
//                                             ? "Logging out..."
//                                             : sub.name}
//                                         </span>
//                                         {sub.hasDot && (
//                                           <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
//                                         )}
//                                       </div>
//                                     </a>
//                                   ) : (
//                                     <Link
//                                       to={sub.path}
//                                       className={`block px-2 py-1 rounded-md transition-colors duration-200
//                                         ${
//                                           subActive
//                                             ? "text-[#F26422] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#F26422]"
//                                             : "text-black hover:text-[#F26422]"
//                                         }`}
//                                       onClick={() =>
//                                         window.innerWidth < 768 &&
//                                         setIsOpen(false)
//                                       }
//                                     >
//                                       <div className="flex items-center gap-1">
//                                         {sub.icon && sub.icon}
//                                         <span>{sub.name}</span>
//                                         {sub.hasDot && (
//                                           <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
//                                         )}
//                                       </div>
//                                     </Link>
//                                   )}
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         </>
//                       )}
//                     </li>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </ul>
//         </div>
//       </aside>

//       {/* Overlay for Mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* ✅ Modals */}
//       <AddVendorModal
//         isOpen={showAddVendorModal}
//         onClose={() => setShowAddVendorModal(false)}
//       />
//       <AddProductPopup
//         isOpen={showAddProductModal}
//         onClose={() => setShowAddProductModal(false)}
//       />
//     </>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  Tags,
  TicketPercent,
  BarChart3,
  Store,
  Headphones,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  User,
  LogOut,
  Image,
  CreditCard,
  MessageSquare,
  Briefcase,
  Gift,
  UserCog,
  Bell,
  Wallet,
} from "lucide-react";
import AddVendorModal from "./AddVendorModal";
import AddProductPopup from "../components/AddProduct";
import { BASE_URL } from "../api/api";

/* ─── Section definitions ───────────────────────────────────────── */
const sections = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "#FF7B1D",
    direct: "/dashboard",
  },
  {
    id: "products",
    label: "Product & Order",
    icon: ShoppingCart,
    color: "#FF7B1D",
    items: [
      {
        name: "Product Management",
        icon: Package,
        subItems: [
          { name: "All Products", path: "/products/all" },
          { name: "Pending Products", path: "/products/pending" },
        ],
      },
      {
        name: "Order Management",
        icon: ShoppingCart,
        path: "/orders/all?tab=all",
      },
      {
        name: "Category Management",
        icon: Tags,
        subItems: [
          { name: "All Category", path: "/category/all" },
          { name: "Create Category", path: "/category/create" },
          { name: "Create Sub Category", path: "/category/create-sub" },
        ],
      },
      { name: "Banners Management", icon: Image, path: "/banners" },
      { name: "Push Notification", icon: Bell, path: "/push" },
      { name: "Coupons & Offers", icon: TicketPercent, path: "/coupons/all" },
      { name: "Analytics", icon: BarChart3, path: "/analytics/all" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: Wallet,
    color: "#38bdf8",
    items: [
      { name: "Payment Gateways", icon: CreditCard, path: "/payment-gateways" },
      {
        name: "Referral & Cashback",
        icon: Gift,
        path: "/admin/referral-cashback-settings",
      },
      { name: "Suggestions", icon: MessageSquare, path: "/suggestions" },
    ],
  },
  {
    id: "vendor",
    label: "Vendor",
    icon: Store,
    color: "#a78bfa",
    items: [
      {
        name: "Vendor Management",
        icon: Store,
        subItems: [
          { name: "All Vendors", path: "/vendor/all" },
          { name: "Add Vendor", path: "/vendor/add", isModal: true },
          { name: "Commission", path: "/vendor/commission" },
          {
            name: "Withdrawal Requests",
            path: "/admin/vendors/withdrawal-requests",
          },
        ],
      },
      {
        name: "Vendor Support",
        icon: Headphones,
        path: "/admin/vendor-support",
      },
      { name: "User Support", icon: Users, path: "/admin/user-support" },
    ],
  },
  {
    id: "rider",
    label: "Rider",
    icon: Truck,
    color: "#34d399",
    items: [
      {
        name: "Rider Management",
        icon: Truck,
        subItems: [
          { name: "All Riders", path: "/Rider" },
          { name: "Commission", path: "/rider/commission" },
          {
            name: "Withdrawal Requests",
            path: "/admin/rider/withdrawal-requests",
          },
        ],
      },
      {
        name: "Job Posting",
        icon: Briefcase,
        path: "/admin/rider-job-posting",
      },
      { name: "Rider Support", icon: Headphones, path: "/admin/rider-support" },
    ],
  },
  {
    id: "additional",
    label: "Additional",
    icon: Settings,
    color: "#fb923c",
    items: [
      { name: "Admin Management", icon: UserCog, path: "/admin/all" },
      {
        name: "Settings",
        icon: Settings,
        subItems: [
          { name: "Profile", path: "/settings/profile", icon: User },
          { name: "Logout", path: "/logout", icon: LogOut, isLogout: true },
        ],
      },
    ],
  },
];

/* helper — which section does a given path belong to? */
function getSectionForPath(pathname, search) {
  const activeItem = pathname + search;
  for (const sec of sections) {
    if (!sec.items) continue;
    for (const item of sec.items) {
      if (item.path && activeItem.startsWith(item.path.split("?")[0]))
        return sec.id;
      if (item.subItems) {
        for (const sub of item.subItems) {
          if (activeItem.startsWith(sub.path.split("?")[0])) return sec.id;
        }
      }
    }
  }
  if (pathname === "/dashboard") return "dashboard";
  return null;
}

/* ─── Sidebar ────────────────────────────────────────────────────── */
export default function Sidebar({ onPanelChange }) {
  // which rail icon is highlighted (follows route)
  const [activeSectionId, setActiveSectionId] = useState(null);
  // which section's panel is currently OPEN (null = closed)
  const [openSectionId, setOpenSectionId] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const activeItem = location.pathname + location.search;

  const panelOpen = !!openSectionId || isClosing;

  /* keep parent informed */
  useEffect(() => {
    onPanelChange?.(panelOpen);
  }, [panelOpen]);

  /* sync active rail icon with current route */
  useEffect(() => {
    const secId = getSectionForPath(location.pathname, location.search);
    if (secId) setActiveSectionId(secId);

    // also keep open dropdown in sync when panel is open
    for (const sec of sections) {
      if (!sec.items) continue;
      for (const item of sec.items) {
        if (item.subItems) {
          for (const sub of item.subItems) {
            if (activeItem.startsWith(sub.path.split("?")[0])) {
              setOpenDropdown(item.name);
              return;
            }
          }
        }
      }
    }
  }, [location.pathname, location.search]);

  /* clicking a rail icon */
  const handleRailClick = (sec) => {
    if (sec.direct) {
      navigate(sec.direct);
      setOpenSectionId(null);
      return;
    }
    // toggle panel open/close for this section
    setOpenSectionId((prev) => (prev === sec.id ? null : sec.id));
  };

  /* soft close — slide out first, then navigate after animation */
  const closePanel = (cb) => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenSectionId(null);
      setIsClosing(false);
      cb?.();
    }, 260);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const tok =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await fetch(`${BASE_URL}/api/auth/admin/logout`, {
        method: "POST",
        credentials: "include",
        headers: tok ? { Authorization: `Bearer ${tok}` } : {},
      });
    } catch (_) {
    } finally {
      ["token", "authToken", "user", "adminData"].forEach((k) =>
        localStorage.removeItem(k),
      );
      sessionStorage.clear();
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  const cur = sections.find((s) => s.id === openSectionId);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        :root {
          --rail-w: 64px;
          --accent: #FF7B1D;
          --accent-glow: rgba(255,123,29,0.4);
          --accent-soft: rgba(255,123,29,0.12);
          --border: rgba(255,255,255,0.06);
          --text-dim: #3d5070;
          --text-mid: #6b80a0;
          --text-bright: #c0d0e8;
        }

        .rb * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

        /* ══════════════ RAIL ══════════════ */
        .rb-rail {
          position: fixed; top: 0; left: 0;
          height: 100vh; width: var(--rail-w);
          display: flex; flex-direction: column; align-items: center;
          z-index: 55; user-select: none;
          border-right: 1px solid rgba(255,255,255,0.05);
          background:
            radial-gradient(ellipse 100% 35% at 50% 0%, rgba(255,123,29,0.1) 0%, transparent 65%),
            linear-gradient(180deg, #091022 0%, #060d1a 60%, #050b16 100%);
        }

        .rb-logo {
          width: var(--rail-w); height: 64px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          position: relative; cursor: pointer;
        }
        .rb-logo-inner {
          width: 40px; height: 40px; border-radius: 13px;
          background: linear-gradient(145deg, #FF8C35 0%, #FF5A00 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow:
            0 0 0 1px rgba(255,123,29,0.3),
            0 0 20px rgba(255,123,29,0.45),
            0 6px 16px rgba(0,0,0,0.5);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative; z-index: 1;
        }
        .rb-logo:hover .rb-logo-inner {
          transform: scale(1.07) rotate(-3deg);
          box-shadow:
            0 0 0 1px rgba(255,123,29,0.5),
            0 0 28px rgba(255,123,29,0.6),
            0 8px 20px rgba(0,0,0,0.6);
        }
        .rb-logo-pulse {
          position: absolute; width: 52px; height: 52px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,123,29,0.18) 0%, transparent 70%);
          animation: logoPulse 3s ease-in-out infinite;
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.2); opacity: 1; }
        }
        .rb-logo-divider {
          position: absolute; bottom: 0; left: 10px; right: 10px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,123,29,0.35), transparent);
        }

        .rb-icons {
          flex: 1; width: 100%; display: flex; flex-direction: column;
          align-items: center; gap: 2px; padding: 10px 0; overflow-y: auto;
        }
        .rb-icons::-webkit-scrollbar { display: none; }
        .rb-bottom-icons {
          width: 100%; display: flex; flex-direction: column;
          align-items: center; gap: 2px; padding: 0 0 16px;
        }
        .rb-sep {
          width: 28px; height: 1px; margin: 8px 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        .rb-icon-btn {
          position: relative; width: 46px; height: 46px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; background: transparent;
          outline: none; color: var(--text-dim);
          transition: color 0.18s, background 0.18s, transform 0.15s;
        }
        .rb-icon-btn:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-bright);
          transform: scale(1.08);
        }
        /* active = route matches this section */
        .rb-icon-btn.rb-active {
          color: var(--accent);
          background: var(--accent-soft);
          box-shadow: inset 0 0 0 1px rgba(255,123,29,0.15);
        }
        /* panel is open for this section (but route may differ) */
        .rb-icon-btn.rb-panel-open-icon {
          background: rgba(255,255,255,0.06);
        }

        .rb-pill {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 0; border-radius: 0 3px 3px 0;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
          opacity: 0;
          transition: height 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
        }
        .rb-icon-btn.rb-active .rb-pill { height: 22px; opacity: 1; }

        .rb-tip {
          position: absolute; left: calc(100% + 13px); top: 50%;
          transform: translateY(-50%) translateX(-6px);
          background: #0d1a30;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-bright);
          font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
          white-space: nowrap; padding: 5px 12px; border-radius: 8px;
          pointer-events: none; opacity: 0;
          transition: opacity 0.15s, transform 0.15s;
          z-index: 999;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,123,29,0.08);
        }
        .rb-tip::before {
          content: ''; position: absolute; right: 100%; top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent; border-right-color: #0d1a30;
        }
        .rb-icon-btn:hover .rb-tip { opacity: 1; transform: translateY(-50%) translateX(0); }

        /* ══════════════ PANEL ══════════════ */
        .rb-panel {
          position: fixed; top: 0; left: var(--rail-w);
          height: 100vh; width: 242px;
          z-index: 54; display: flex; flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.05);
          box-shadow: 16px 0 48px rgba(0,0,0,0.6);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.25s;
          will-change: transform;
          background:
            radial-gradient(ellipse 120% 25% at 60% 0%, rgba(255,123,29,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 20% 100%, rgba(56,189,248,0.04) 0%, transparent 60%),
            linear-gradient(180deg, #0c1528 0%, #081020 50%, #060c18 100%);
        }
        .rb-panel::after {
          content: ''; position: absolute; top: 0; right: -1px; width: 1px; height: 100%;
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(255,123,29,0.2) 25%,
            rgba(255,123,29,0.1) 75%,
            transparent 100%
          );
          pointer-events: none;
        }
        .rb-panel.rb-panel-closed { transform: translateX(-110%); opacity: 0; pointer-events: none; }
        .rb-panel.rb-panel-open   { transform: translateX(0); opacity: 1; }

        .rb-panel-head {
          height: 64px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 14px 0 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .rb-panel-title { display: flex; align-items: center; gap: 10px; }
        .rb-title-icon {
          width: 26px; height: 26px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .rb-panel-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text-mid);
        }
        .rb-close {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; color: var(--text-dim);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .rb-close:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.25);
          color: #ef4444;
        }

        .rb-panel-scroll { flex: 1; overflow-y: auto; padding: 10px 10px 24px; }
        .rb-panel-scroll::-webkit-scrollbar { width: 2px; }
        .rb-panel-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,123,29,0.2); border-radius: 4px;
        }

        .rb-nav {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between;
          gap: 8px; padding: 9px 12px; border-radius: 10px;
          font-size: 12.5px; font-weight: 600;
          color: var(--text-mid);
          cursor: pointer; text-decoration: none;
          border: 1px solid transparent; background: transparent;
          transition: all 0.15s;
        }
        .rb-nav:hover {
          color: var(--text-bright);
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.05);
        }
        .rb-nav.rb-nav-active {
          background: rgba(255,123,29,0.1);
          border-color: rgba(255,123,29,0.2);
          color: #FF7B1D;
          font-weight: 700;
          box-shadow: 0 2px 12px rgba(255,123,29,0.1);
        }
        .rb-nav-l { display: flex; align-items: center; gap: 9px; }

        .rb-sub {
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.22s;
          list-style: none; margin: 2px 0 4px 20px;
          padding: 0 0 0 12px;
          border-left: 1px solid rgba(255,123,29,0.12);
        }
        .rb-sub.rb-sub-open   { max-height: 400px; opacity: 1; }
        .rb-sub.rb-sub-closed { max-height: 0; opacity: 0; }

        .rb-sub-a {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 8px;
          font-size: 11.5px; font-weight: 500;
          color: var(--text-dim);
          text-decoration: none; cursor: pointer;
          width: 100%; border: none; background: transparent;
          transition: all 0.13s;
        }
        .rb-sub-a:hover {
          color: #FF9A50;
          background: rgba(255,123,29,0.07);
          padding-left: 14px;
        }
        .rb-sub-a.rb-sub-active {
          color: #FF7B1D;
          font-weight: 600;
        }
        .rb-sub-a.rb-sub-active::before {
          content: '';
          display: inline-block; width: 5px; height: 5px;
          border-radius: 50%; background: #FF7B1D;
          box-shadow: 0 0 7px rgba(255,123,29,0.7);
          flex-shrink: 0;
        }

        .rb-dim {
          position: fixed; inset: 0 0 0 var(--rail-w); z-index: 53;
          background: rgba(3,8,20,0.65); backdrop-filter: blur(4px);
          animation: rbFadeIn 0.2s ease;
        }
        @keyframes rbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @media (max-width: 767px) { .rb-dim { inset: 0; } }
      `}</style>

      {/* ── Icon Rail ── */}
      <aside className="rb rb-rail">
        <div className="rb-logo">
          <div className="rb-logo-pulse" />
          <div className="rb-logo-inner">
            <ShoppingCart size={20} color="#fff" strokeWidth={2.2} />
          </div>
          <div className="rb-logo-divider" />
        </div>

        <div className="rb-icons">
          {sections
            .filter((s) => s.id !== "additional")
            .map((sec) => {
              const Icon = sec.icon;
              // icon is "active" if current route belongs to this section
              const isRouteActive = activeSectionId === sec.id;
              // icon shows open-panel style if its panel is currently slid open
              const isPanelOpen = openSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  className={`rb-icon-btn ${isRouteActive ? "rb-active" : ""} ${isPanelOpen && !isRouteActive ? "rb-panel-open-icon" : ""}`}
                  onClick={() => handleRailClick(sec)}
                >
                  <div
                    className="rb-pill"
                    style={
                      isRouteActive
                        ? {
                            background: sec.color,
                            boxShadow: `0 0 10px ${sec.color}99`,
                          }
                        : {}
                    }
                  />
                  <Icon
                    size={18}
                    color={isRouteActive ? sec.color : undefined}
                  />
                  <span className="rb-tip">{sec.label}</span>
                </button>
              );
            })}
        </div>

        <div className="rb-bottom-icons">
          <div className="rb-sep" />
          {sections
            .filter((s) => s.id === "additional")
            .map((sec) => {
              const Icon = sec.icon;
              const isRouteActive = activeSectionId === sec.id;
              const isPanelOpen = openSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  className={`rb-icon-btn ${isRouteActive ? "rb-active" : ""} ${isPanelOpen && !isRouteActive ? "rb-panel-open-icon" : ""}`}
                  onClick={() => handleRailClick(sec)}
                >
                  <div
                    className="rb-pill"
                    style={
                      isRouteActive
                        ? {
                            background: sec.color,
                            boxShadow: `0 0 10px ${sec.color}99`,
                          }
                        : {}
                    }
                  />
                  <Icon
                    size={18}
                    color={isRouteActive ? sec.color : undefined}
                  />
                  <span className="rb-tip">{sec.label}</span>
                </button>
              );
            })}
        </div>
      </aside>

      {/* ── Slide Panel ── */}
      <div
        className={`rb rb-panel ${openSectionId && !isClosing ? "rb-panel-open" : "rb-panel-closed"}`}
      >
        {cur && (
          <>
            <div className="rb-panel-head">
              <div className="rb-panel-title">
                <div
                  className="rb-title-icon"
                  style={{
                    background: `${cur.color}1a`,
                    border: `1px solid ${cur.color}33`,
                    boxShadow: `0 0 12px ${cur.color}22`,
                  }}
                >
                  <cur.icon size={13} color={cur.color} />
                </div>
                <span className="rb-panel-label">{cur.label}</span>
              </div>
              <button className="rb-close" onClick={closePanel}>
                <X size={13} />
              </button>
            </div>

            <div className="rb-panel-scroll">
              {cur.items?.map((item) => {
                const Icon = item.icon;
                const groupActive = item.subItems?.some((s) =>
                  activeItem.startsWith(s.path?.split("?")[0]),
                );
                const directActive =
                  item.path && activeItem.startsWith(item.path.split("?")[0]);
                const isOpen = openDropdown === item.name;

                if (!item.subItems)
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`rb-nav ${directActive ? "rb-nav-active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        closePanel(() => navigate(item.path));
                      }}
                    >
                      <div className="rb-nav-l">
                        <Icon size={14} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );

                return (
                  <div key={item.name}>
                    <button
                      className={`rb-nav ${groupActive ? "rb-nav-active" : ""}`}
                      onClick={() =>
                        setOpenDropdown((p) =>
                          p === item.name ? null : item.name,
                        )
                      }
                    >
                      <div className="rb-nav-l">
                        <Icon size={14} />
                        <span>{item.name}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp size={11} />
                      ) : (
                        <ChevronDown size={11} />
                      )}
                    </button>
                    <ul
                      className={`rb-sub ${isOpen ? "rb-sub-open" : "rb-sub-closed"}`}
                    >
                      {item.subItems.map((sub) => {
                        const subActive = activeItem.startsWith(
                          sub.path?.split("?")[0],
                        );
                        const SubIcon = sub.icon;

                        if (sub.isLogout)
                          return (
                            <li key={sub.name}>
                              <button
                                className={`rb-sub-a ${isLoggingOut ? "opacity-50" : ""}`}
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                              >
                                <LogOut size={11} />
                                {isLoggingOut ? "Logging out…" : "Logout"}
                              </button>
                            </li>
                          );

                        if (sub.isModal)
                          return (
                            <li key={sub.name}>
                              <button
                                className="rb-sub-a"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowAddVendorModal(true);
                                  closePanel(); /* ← close panel on modal open too */
                                }}
                              >
                                {SubIcon && <SubIcon size={11} />}
                                {sub.name}
                              </button>
                            </li>
                          );

                        return (
                          <li key={sub.name}>
                            <Link
                              to={sub.path}
                              className={`rb-sub-a ${subActive ? "rb-sub-active" : ""}`}
                              onClick={(e) => {
                                e.preventDefault();
                                closePanel(() => navigate(sub.path));
                              }}
                            >
                              {SubIcon && <SubIcon size={11} />}
                              {sub.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {panelOpen && <div className="rb-dim" onClick={closePanel} />}

      <AddVendorModal
        isOpen={showAddVendorModal}
        onClose={() => setShowAddVendorModal(false)}
      />
      <AddProductPopup
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      />
    </>
  );
}
