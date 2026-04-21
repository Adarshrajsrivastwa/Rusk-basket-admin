// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import AddProductPopup from "../components/AddProduct"; // ✅ Import Product Modal
// import { BASE_URL } from "../api/api";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingCart,
//   Bell,
//   BarChart3,
//   Settings,
//   ChevronDown,
//   ChevronUp,
//   Menu,
//   X,
//   User,
//   KeyRound,
//   LogOut,
//   Boxes,
//   MessageSquare,
//   Tag,
//   Bike,
//   Wallet,
// } from "lucide-react";

// const VendorSidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [activeItem, setActiveItem] = useState("/");
//   const [showAddProductModal, setShowAddProductModal] = useState(false); // ✅ Product modal state

//   useEffect(() => {
//     setActiveItem(location.pathname + location.search);
//   }, [location.pathname, location.search]);

//   const toggleDropdown = (name) => {
//     setOpenDropdown((prev) => (prev === name ? null : name));
//   };

//   // ✅ Handler for Add Product click
//   const handleAddProductClick = (e) => {
//     e.preventDefault();
//     setShowAddProductModal(true);
//     if (window.innerWidth < 768) setIsOpen(false);
//   };

//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: <LayoutDashboard size={16} />,
//       path: "/vendor/dashboard",
//     },
//     {
//       name: "Update Profile",
//       icon: <User size={16} />,
//       path: "/vendor/update-profile",
//     },
//     {
//       name: "Product Management",
//       icon: <Package size={16} />,
//       subItems: [{ name: "All Products", path: "/vendor/products" }],
//     },
//     {
//       name: "Inventory",
//       icon: <Boxes size={16} />,
//       path: "/vendor/inventory",
//     },
//     {
//       name: "Order Management",
//       icon: <ShoppingCart size={16} />,
//       subItems: [{ name: "All Orders", path: "/vendor/orders" }],
//     },
//     {
//       name: "Analytics",
//       icon: <BarChart3 size={16} />,
//       path: "/vendor/analytics",
//     },
//     {
//       name: "Rider Jobs",
//       icon: <Boxes size={16} />,
//       path: "/vendor/jobs",
//     },
//     {
//       name: "Rider Due Amounts",
//       icon: <Bike size={16} />,
//       path: "/vendor/rider-due-amounts",
//     },
//     {
//       name: "Withdrawal Requests",
//       icon: <Wallet size={16} />,
//       path: "/vendor/withdrawal-requests",
//     },
//     {
//       name: "Support",
//       icon: <MessageSquare size={16} />,
//       path: "/vendor-support",
//     },
//     {
//       name: "Daily Offers",
//       icon: <Tag size={16} />,
//       path: "/vendor/daily-offers",
//     },
//     {
//       name: "Settings",
//       icon: <Settings size={16} />,
//       subItems: [
//         {
//           name: "Profile",
//           path: "/vendor/settings/profile",
//           icon: <User size={14} />,
//         },

//         {
//           name: "Logout",
//           path: "/logout",
//           icon: <LogOut size={14} />,
//           isLogout: true,
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

//   const handleLogout = async () => {
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
//       try {
//         const response = await fetch(`${BASE_URL}/api/vendor/logout`, {
//           method: "POST",
//           credentials: "include",
//           headers: headers,
//         });

//         const data = await response.json();
//       } catch (apiError) {
//         // Continue with logout even if API fails
//       }

//       // Clear all local storage
//       localStorage.clear();
//       sessionStorage.clear();

//       // Navigate to login page
//       navigate("/", { replace: true });

//       // Close mobile sidebar if open
//       if (window.innerWidth < 768) setIsOpen(false);
//     } catch (error) {
//       // Even if API fails, clear local storage and redirect
//       localStorage.clear();
//       sessionStorage.clear();
//       sessionStorage.clear();

//       navigate("/", { replace: true });
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   return (
//     <>
//       <button
//         className="fixed top-4 left-4 z-50 md:hidden text-2xl text-white"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X strokeWidth={8} /> : <Menu strokeWidth={3} />}
//       </button>

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
//                                   {sub.name === "Add Product" ? (
//                                     <a
//                                       href="#"
//                                       onClick={handleAddProductClick}
//                                       className={`block px-2 py-1 rounded-md transition-colors duration-200
//                                         ${
//                                           subActive
//                                             ? "text-[#F26422] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#F26422]"
//                                             : "text-black hover:text-[#F26422]"
//                                         }`}
//                                     >
//                                       <div className="flex items-center gap-1">
//                                         <span>{sub.name}</span>
//                                       </div>
//                                     </a>
//                                   ) : sub.isLogout ? (
//                                     <a
//                                       href="#"
//                                       onClick={(e) => {
//                                         e.preventDefault();
//                                         handleLogout();
//                                       }}
//                                       className={`block px-2 py-1 rounded-md transition-colors duration-200
//                                         ${
//                                           subActive
//                                             ? "text-[#F26422] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#F26422]"
//                                             : "text-black hover:text-[#F26422]"
//                                         }
//                                         ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
//                                     >
//                                       <div className="flex items-center gap-1">
//                                         {sub.icon && sub.icon}
//                                         <span>
//                                           {isLoggingOut
//                                             ? "Logging out..."
//                                             : sub.name}
//                                         </span>
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

//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* ✅ Add Product Popup */}
//       <AddProductPopup
//         isOpen={showAddProductModal}
//         onClose={() => setShowAddProductModal(false)}
//       />
//     </>
//   );
// };

// export default VendorSidebar;
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddProductPopup from "../components/AddProduct";
import { BASE_URL } from "../api/api";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  User,
  LogOut,
  Boxes,
  MessageSquare,
  Tag,
  Bike,
  Wallet,
} from "lucide-react";

const sections = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "#FF7B1D",
    direct: "/vendor/dashboard",
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    color: "#FF7B1D",
    items: [
      { name: "All Products", icon: Package, path: "/vendor/products" },
      { name: "Inventory", icon: Boxes, path: "/vendor/inventory" },
      { name: "Daily Offers", icon: Tag, path: "/vendor/daily-offers" },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    color: "#38bdf8",
    items: [{ name: "All Orders", icon: ShoppingCart, path: "/vendor/orders" }],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "#34d399",
    items: [{ name: "Analytics", icon: BarChart3, path: "/vendor/analytics" }],
  },
  {
    id: "finance",
    label: "Finance",
    icon: Wallet,
    color: "#a78bfa",
    items: [
      {
        name: "Withdrawal Requests",
        icon: Wallet,
        path: "/vendor/withdrawal-requests",
      },
      {
        name: "Rider Due Amounts",
        icon: Bike,
        path: "/vendor/rider-due-amounts",
      },
    ],
  },
  {
    id: "rider",
    label: "Rider",
    icon: Bike,
    color: "#fb923c",
    items: [{ name: "Rider Jobs", icon: Boxes, path: "/vendor/jobs" }],
  },
  {
    id: "support",
    label: "Support",
    icon: MessageSquare,
    color: "#38bdf8",
    items: [{ name: "Support", icon: MessageSquare, path: "/vendor-support" }],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    color: "#fb923c",
    items: [
      {
        name: "Settings",
        icon: Settings,
        subItems: [
          {
            name: "Update Profile",
            path: "/vendor/update-profile",
            icon: User,
          },
          { name: "Profile", path: "/vendor/settings/profile", icon: User },
          { name: "Logout", path: "/logout", icon: LogOut, isLogout: true },
        ],
      },
    ],
  },
];

export default function VendorSidebar() {
  const [activeSection, setActiveSection] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const activeItem = location.pathname + location.search;

  const panelOpen =
    !!activeSection && !sections.find((s) => s.id === activeSection)?.direct;

  useEffect(() => {
    for (const sec of sections) {
      if (!sec.items) continue;
      for (const item of sec.items) {
        if (item.path && activeItem.startsWith(item.path.split("?")[0])) {
          setActiveSection(sec.id);
          return;
        }
        if (item.subItems) {
          for (const sub of item.subItems) {
            if (activeItem.startsWith(sub.path.split("?")[0])) {
              setActiveSection(sec.id);
              setOpenDropdown(item.name);
              return;
            }
          }
        }
      }
    }
  }, [location.pathname, location.search]);

  const handleSection = (sec) => {
    if (sec.direct) {
      navigate(sec.direct);
      setActiveSection(null);
      return;
    }
    setActiveSection((p) => (p === sec.id ? null : sec.id));
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      await fetch(`${BASE_URL}/api/vendor/logout`, {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (_) {
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  const cur = sections.find((s) => s.id === activeSection);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        :root {
          --vb-rail-w: 64px;
          --vb-accent: #FF7B1D;
          --vb-accent-glow: rgba(255,123,29,0.4);
          --vb-accent-soft: rgba(255,123,29,0.12);
          --vb-border: rgba(255,255,255,0.06);
          --vb-text-dim: #3d5070;
          --vb-text-mid: #6b80a0;
          --vb-text-bright: #c0d0e8;
        }

        .vb * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

        /* ══════════════ RAIL ══════════════ */
        .vb-rail {
          position: fixed; top: 0; left: 0;
          height: 100vh; width: var(--vb-rail-w);
          display: flex; flex-direction: column; align-items: center;
          z-index: 55; user-select: none;
          border-right: 1px solid rgba(255,255,255,0.05);
          background:
            radial-gradient(ellipse 100% 35% at 50% 0%, rgba(255,123,29,0.1) 0%, transparent 65%),
            linear-gradient(180deg, #091022 0%, #060d1a 60%, #050b16 100%);
        }

        /* Logo */
        .vb-logo {
          width: var(--vb-rail-w); height: 64px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          position: relative; cursor: pointer;
        }
        .vb-logo-inner {
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
        .vb-logo:hover .vb-logo-inner {
          transform: scale(1.07) rotate(-3deg);
          box-shadow:
            0 0 0 1px rgba(255,123,29,0.5),
            0 0 28px rgba(255,123,29,0.6),
            0 8px 20px rgba(0,0,0,0.6);
        }
        .vb-logo-pulse {
          position: absolute; width: 52px; height: 52px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,123,29,0.18) 0%, transparent 70%);
          animation: vbLogoPulse 3s ease-in-out infinite;
        }
        @keyframes vbLogoPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.2); opacity: 1; }
        }
        .vb-logo-divider {
          position: absolute; bottom: 0; left: 10px; right: 10px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,123,29,0.35), transparent);
        }

        /* Icons list */
        .vb-icons {
          flex: 1; width: 100%; display: flex; flex-direction: column;
          align-items: center; gap: 2px; padding: 10px 0; overflow-y: auto;
        }
        .vb-icons::-webkit-scrollbar { display: none; }
        .vb-bottom-icons {
          width: 100%; display: flex; flex-direction: column;
          align-items: center; gap: 2px; padding: 0 0 16px;
        }
        .vb-sep {
          width: 28px; height: 1px; margin: 8px 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        /* Icon button */
        .vb-icon-btn {
          position: relative; width: 46px; height: 46px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; background: transparent;
          outline: none; color: var(--vb-text-dim);
          transition: color 0.18s, background 0.18s, transform 0.15s;
        }
        .vb-icon-btn:hover {
          background: rgba(255,255,255,0.04);
          color: var(--vb-text-bright);
          transform: scale(1.08);
        }
        .vb-icon-btn.vb-active {
          color: var(--vb-accent);
          background: var(--vb-accent-soft);
          box-shadow: inset 0 0 0 1px rgba(255,123,29,0.15);
        }

        /* Active pill */
        .vb-pill {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 0; border-radius: 0 3px 3px 0;
          background: var(--vb-accent);
          box-shadow: 0 0 10px var(--vb-accent-glow);
          opacity: 0;
          transition: height 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
        }
        .vb-icon-btn.vb-active .vb-pill { height: 22px; opacity: 1; }

        /* Tooltip */
        .vb-tip {
          position: absolute; left: calc(100% + 13px); top: 50%;
          transform: translateY(-50%) translateX(-6px);
          background: #0d1a30;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--vb-text-bright);
          font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
          white-space: nowrap; padding: 5px 12px; border-radius: 8px;
          pointer-events: none; opacity: 0;
          transition: opacity 0.15s, transform 0.15s;
          z-index: 999;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,123,29,0.08);
        }
        .vb-tip::before {
          content: ''; position: absolute; right: 100%; top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent; border-right-color: #0d1a30;
        }
        .vb-icon-btn:hover .vb-tip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        /* ══════════════ PANEL ══════════════ */
        .vb-panel {
          position: fixed; top: 0; left: var(--vb-rail-w);
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
        .vb-panel::after {
          content: ''; position: absolute; top: 0; right: -1px; width: 1px; height: 100%;
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(255,123,29,0.2) 25%,
            rgba(255,123,29,0.1) 75%,
            transparent 100%
          );
          pointer-events: none;
        }

        .vb-panel.vb-panel-closed { transform: translateX(-110%); opacity: 0; pointer-events: none; }
        .vb-panel.vb-panel-open   { transform: translateX(0); opacity: 1; }

        /* Panel header */
        .vb-panel-head {
          height: 64px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 14px 0 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .vb-panel-title { display: flex; align-items: center; gap: 10px; }
        .vb-title-icon {
          width: 26px; height: 26px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
        }
        .vb-panel-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--vb-text-mid);
        }
        .vb-close {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; color: var(--vb-text-dim);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .vb-close:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.25);
          color: #ef4444;
        }

        /* Panel scroll */
        .vb-panel-scroll { flex: 1; overflow-y: auto; padding: 10px 10px 24px; }
        .vb-panel-scroll::-webkit-scrollbar { width: 2px; }
        .vb-panel-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,123,29,0.2); border-radius: 4px;
        }

        /* Nav row */
        .vb-nav {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between;
          gap: 8px; padding: 9px 12px; border-radius: 10px;
          font-size: 12.5px; font-weight: 600;
          color: var(--vb-text-mid);
          cursor: pointer; text-decoration: none;
          border: 1px solid transparent; background: transparent;
          transition: all 0.15s;
        }
        .vb-nav:hover {
          color: var(--vb-text-bright);
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.05);
        }
        .vb-nav.vb-nav-active {
          background: rgba(255,123,29,0.1);
          border-color: rgba(255,123,29,0.2);
          color: #FF7B1D;
          font-weight: 700;
          box-shadow: 0 2px 12px rgba(255,123,29,0.1);
        }
        .vb-nav-l { display: flex; align-items: center; gap: 9px; }

        /* Sub list */
        .vb-sub {
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.22s;
          list-style: none; margin: 2px 0 4px 20px;
          padding: 0 0 0 12px;
          border-left: 1px solid rgba(255,123,29,0.12);
        }
        .vb-sub.vb-sub-open   { max-height: 400px; opacity: 1; }
        .vb-sub.vb-sub-closed { max-height: 0; opacity: 0; }

        .vb-sub-a {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 8px;
          font-size: 11.5px; font-weight: 500;
          color: var(--vb-text-dim);
          text-decoration: none; cursor: pointer;
          width: 100%; border: none; background: transparent;
          transition: all 0.13s;
        }
        .vb-sub-a:hover {
          color: #FF9A50;
          background: rgba(255,123,29,0.07);
          padding-left: 14px;
        }
        .vb-sub-a.vb-sub-active {
          color: #FF7B1D;
          font-weight: 600;
        }
        .vb-sub-a.vb-sub-active::before {
          content: '';
          display: inline-block; width: 5px; height: 5px;
          border-radius: 50%; background: #FF7B1D;
          box-shadow: 0 0 7px rgba(255,123,29,0.7);
          flex-shrink: 0;
        }

        /* Dim overlay */
        .vb-dim {
          position: fixed; inset: 0 0 0 var(--vb-rail-w); z-index: 53;
          background: rgba(3,8,20,0.65); backdrop-filter: blur(4px);
          animation: vbFadeIn 0.2s ease;
        }
        @keyframes vbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @media (max-width: 767px) { .vb-dim { inset: 0; } }
      `}</style>

      {/* ── Icon Rail ── */}
      <aside className="vb vb-rail">
        <div className="vb-logo">
          <div className="vb-logo-pulse" />
          <div className="vb-logo-inner">
            <ShoppingCart size={20} color="#fff" strokeWidth={2.2} />
          </div>
          <div className="vb-logo-divider" />
        </div>

        <div className="vb-icons">
          {sections
            .filter((s) => s.id !== "settings")
            .map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  className={`vb-icon-btn ${isActive ? "vb-active" : ""}`}
                  onClick={() => handleSection(sec)}
                >
                  <div
                    className="vb-pill"
                    style={
                      isActive
                        ? {
                            background: sec.color,
                            boxShadow: `0 0 10px ${sec.color}99`,
                          }
                        : {}
                    }
                  />
                  <Icon size={18} color={isActive ? sec.color : undefined} />
                  <span className="vb-tip">{sec.label}</span>
                </button>
              );
            })}
        </div>

        <div className="vb-bottom-icons">
          <div className="vb-sep" />
          {sections
            .filter((s) => s.id === "settings")
            .map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  className={`vb-icon-btn ${isActive ? "vb-active" : ""}`}
                  onClick={() => handleSection(sec)}
                >
                  <div
                    className="vb-pill"
                    style={
                      isActive
                        ? {
                            background: sec.color,
                            boxShadow: `0 0 10px ${sec.color}99`,
                          }
                        : {}
                    }
                  />
                  <Icon size={18} color={isActive ? sec.color : undefined} />
                  <span className="vb-tip">{sec.label}</span>
                </button>
              );
            })}
        </div>
      </aside>

      {/* ── Slide Panel ── */}
      <div
        className={`vb vb-panel ${panelOpen ? "vb-panel-open" : "vb-panel-closed"}`}
      >
        {cur && (
          <>
            <div className="vb-panel-head">
              <div className="vb-panel-title">
                <div
                  className="vb-title-icon"
                  style={{
                    background: `${cur.color}1a`,
                    border: `1px solid ${cur.color}33`,
                    boxShadow: `0 0 12px ${cur.color}22`,
                  }}
                >
                  <cur.icon size={13} color={cur.color} />
                </div>
                <span className="vb-panel-label">{cur.label}</span>
              </div>
              <button
                className="vb-close"
                onClick={() => setActiveSection(null)}
              >
                <X size={13} />
              </button>
            </div>

            <div className="vb-panel-scroll">
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
                      className={`vb-nav ${directActive ? "vb-nav-active" : ""}`}
                    >
                      <div className="vb-nav-l">
                        <Icon size={14} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );

                return (
                  <div key={item.name}>
                    <button
                      className={`vb-nav ${groupActive ? "vb-nav-active" : ""}`}
                      onClick={() =>
                        setOpenDropdown((p) =>
                          p === item.name ? null : item.name,
                        )
                      }
                    >
                      <div className="vb-nav-l">
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
                      className={`vb-sub ${isOpen ? "vb-sub-open" : "vb-sub-closed"}`}
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
                                className={`vb-sub-a ${isLoggingOut ? "opacity-50" : ""}`}
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                              >
                                <LogOut size={11} />
                                {isLoggingOut ? "Logging out…" : "Logout"}
                              </button>
                            </li>
                          );

                        return (
                          <li key={sub.name}>
                            <Link
                              to={sub.path}
                              className={`vb-sub-a ${subActive ? "vb-sub-active" : ""}`}
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

      {panelOpen && (
        <div className="vb-dim" onClick={() => setActiveSection(null)} />
      )}

      <AddProductPopup
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      />
    </>
  );
}
