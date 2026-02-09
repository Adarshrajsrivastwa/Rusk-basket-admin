// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
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
// } from "lucide-react";

// const VendorSidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const location = useLocation();
//   const [activeItem, setActiveItem] = useState("/");

//   useEffect(() => {
//     setActiveItem(location.pathname + location.search);
//   }, [location.pathname, location.search]);

//   const toggleDropdown = (name) => {
//     setOpenDropdown((prev) => (prev === name ? null : name));
//   };

//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: <LayoutDashboard size={16} />,
//       path: "/vendor/dashboard",
//     },
//     {
//       name: "Product Management",
//       icon: <Package size={16} />,
//       subItems: [
//         { name: "All Products", path: "/vendor/products" },
//         { name: "Add Product", path: "/vendor/products/add" },
//         { name: "Low Stock", path: "/vendor/products/low-stock" },
//       ],
//     },
//     {
//       name: "Inventory",
//       icon: <Boxes size={16} />,
//       path: "/vendor/inventory",
//     },
//     {
//       name: "Order Management",
//       icon: <ShoppingCart size={16} />,
//       subItems: [
//         { name: "All Orders", path: "/vendor/orders" },
//         { name: "Pending Orders", path: "/vendor/orders/pending" },
//         { name: "Delivered Orders", path: "/vendor/orders/delivered" },
//         { name: "Cancelled Orders", path: "/vendor/orders/cancelled" },
//       ],
//     },
//     {
//       name: "Analytics",
//       icon: <BarChart3 size={16} />,
//       path: "/vendor/analytics",
//     },
//     {
//       name: "Notifications",
//       icon: <Bell size={16} />,
//       path: "/vendor/notifications",
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
//           name: "Change Password",
//           path: "/vendor/settings/password",
//           icon: <KeyRound size={14} />,
//         },
//         { name: "Logout", path: "/logout", icon: <LogOut size={14} /> },
//       ],
//     },
//   ];

//   useEffect(() => {
//     const openItem = menuItems.find(
//       (item) =>
//         item.subItems &&
//         item.subItems.some((sub) =>
//           (location.pathname + location.search).startsWith(
//             sub.path.split("?")[0]
//           )
//         )
//     );
//     if (openItem) setOpenDropdown(openItem.name);
//   }, [location.pathname, location.search]);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("token");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userMobile");
//     window.location.href = "/";
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
//                     activeItem.startsWith(sub.path.split("?")[0])
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
//                                   {sub.name === "Logout" ? (
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
//                                         }`}
//                                     >
//                                       <div className="flex items-center gap-1">
//                                         {sub.icon && sub.icon}
//                                         <span>{sub.name}</span>
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
//     </>
//   );
// };

// export default VendorSidebar;

// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import AddProductPopup from "../components/AddProduct"; // ✅ Import Product Modal
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
// } from "lucide-react";

// const VendorSidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const location = useLocation();
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
//       name: "Notifications",
//       icon: <Bell size={16} />,
//       path: "/vendor/notifications",
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
//           name: "Change Password",
//           path: "/vendor/settings/password",
//           icon: <KeyRound size={14} />,
//         },
//         { name: "Logout", path: "/logout", icon: <LogOut size={14} /> },
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

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("token");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userMobile");
//     window.location.href = "/";
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
//                                   ) : sub.name === "Logout" ? (
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
//                                         }`}
//                                     >
//                                       <div className="flex items-center gap-1">
//                                         {sub.icon && sub.icon}
//                                         <span>{sub.name}</span>
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
import AddProductPopup from "../components/AddProduct"; // ✅ Import Product Modal
import { BASE_URL } from "../api/api";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Bell,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  User,
  KeyRound,
  LogOut,
  Boxes,
  MessageSquare,
  Tag,
} from "lucide-react";

const VendorSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("/");
  const [showAddProductModal, setShowAddProductModal] = useState(false); // ✅ Product modal state

  useEffect(() => {
    setActiveItem(location.pathname + location.search);
  }, [location.pathname, location.search]);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // ✅ Handler for Add Product click
  const handleAddProductClick = (e) => {
    e.preventDefault();
    setShowAddProductModal(true);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={16} />,
      path: "/vendor/dashboard",
    },
    {
      name: "Update Profile",
      icon: <User size={16} />,
      path: "/vendor/update-profile",
    },
    {
      name: "Product Management",
      icon: <Package size={16} />,
      subItems: [{ name: "All Products", path: "/vendor/products" }],
    },
    {
      name: "Inventory",
      icon: <Boxes size={16} />,
      path: "/vendor/inventory",
    },
    {
      name: "Order Management",
      icon: <ShoppingCart size={16} />,
      subItems: [{ name: "All Orders", path: "/vendor/orders" }],
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={16} />,
      path: "/vendor/analytics",
    },
    {
      name: "Rider Jobs",
      icon: <Boxes size={16} />,
      path: "/vendor/jobs",
    },
    {
      name: "Notifications",
      icon: <Bell size={16} />,
      path: "/vendor/notifications",
    },
    {
      name: "Support",
      icon: <MessageSquare size={16} />,
      path: "/vendor-support",
    },
    {
      name: "Daily Offers",
      icon: <Tag size={16} />,
      path: "/vendor/daily-offers",
    },
    {
      name: "Settings",
      icon: <Settings size={16} />,
      subItems: [
        {
          name: "Profile",
          path: "/vendor/settings/profile",
          icon: <User size={14} />,
        },
        {
          name: "Notifications",
          path: "/vendor/notifications",
          icon: <Bell size={14} />,
        },
        {
          name: "Logout",
          path: "/logout",
          icon: <LogOut size={14} />,
          isLogout: true,
        },
      ],
    },
  ];

  useEffect(() => {
    const openItem = menuItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((sub) =>
          (location.pathname + location.search).startsWith(
            sub.path.split("?")[0],
          ),
        ),
    );
    if (openItem) setOpenDropdown(openItem.name);
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    try {
      setIsLoggingOut(true);

      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Call logout API
      try {
        const response = await fetch(`${BASE_URL}/api/vendor/logout`, {
          method: "POST",
          credentials: "include",
          headers: headers,
        });

        const data = await response.json();
        console.log("Logout response:", data);
      } catch (apiError) {
        console.error("Logout API error:", apiError);
        // Continue with logout even if API fails
      }

      // Clear all local storage
      localStorage.clear();
      sessionStorage.clear();

      // Navigate to login page
      navigate("/", { replace: true });

      // Close mobile sidebar if open
      if (window.innerWidth < 768) setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);

      // Even if API fails, clear local storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.clear();

      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-2xl text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X strokeWidth={8} /> : <Menu strokeWidth={3} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white text-black shadow-lg flex flex-col p-2 transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex-1 overflow-y-auto mt-3 pr-2 custom-scrollbar">
          <ul className="text-[13px] flex flex-col space-y-[2px]">
            {menuItems.map((item, index) => {
              const isActive =
                activeItem === item.path ||
                (item.subItems &&
                  item.subItems.some((sub) =>
                    activeItem.startsWith(sub.path.split("?")[0]),
                  ));
              const isDropdownOpen = openDropdown === item.name;

              return (
                <React.Fragment key={item.name}>
                  {index === 0 && (
                    <>
                      <li className="flex flex-col mt-12 md:mt-3">
                        <Link
                          to={item.path}
                          className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 bg-gray-200 text-black"
                          onClick={() =>
                            window.innerWidth < 768 && setIsOpen(false)
                          }
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </li>

                      <p className="mt-4 mb-2 text-[11px] font-semibold tracking-wide text-gray-500 px-2">
                        MAIN MENU
                      </p>
                    </>
                  )}

                  {index !== 0 && (
                    <li className="flex flex-col">
                      {!item.subItems ? (
                        <Link
                          to={item.path}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-md font-semibold transition-all duration-200 
                            ${
                              isActive
                                ? "bg-[#F26422] text-white shadow-sm"
                                : "hover:bg-gray-100 text-black"
                            }`}
                          onClick={() =>
                            window.innerWidth < 768 && setIsOpen(false)
                          }
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <>
                          <div
                            className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-200 font-semibold
                              ${
                                isActive
                                  ? "text-[#F26422]"
                                  : "text-black hover:bg-gray-100"
                              }`}
                            onClick={() => toggleDropdown(item.name)}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon}
                              <span>{item.name}</span>
                            </div>
                            {isDropdownOpen ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            )}
                          </div>

                          <ul
                            className={`ml-4 border-l pl-3 mt-1 overflow-hidden transition-all duration-300 ease-in-out
                              ${
                                isDropdownOpen
                                  ? "max-h-64 opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                          >
                            {item.subItems.map((sub) => {
                              const subActive =
                                activeItem === sub.path ||
                                activeItem.startsWith(sub.path.split("?")[0]);

                              return (
                                <li key={sub.name} className="relative">
                                  {sub.name === "Add Product" ? (
                                    <a
                                      href="#"
                                      onClick={handleAddProductClick}
                                      className={`block px-2 py-1 rounded-md transition-colors duration-200
                                        ${
                                          subActive
                                            ? "text-[#F26422] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#F26422]"
                                            : "text-black hover:text-[#F26422]"
                                        }`}
                                    >
                                      <div className="flex items-center gap-1">
                                        <span>{sub.name}</span>
                                      </div>
                                    </a>
                                  ) : sub.isLogout ? (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleLogout();
                                      }}
                                      className={`block px-2 py-1 rounded-md transition-colors duration-200
                                        ${
                                          subActive
                                            ? "text-[#F26422] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#F26422]"
                                            : "text-black hover:text-[#F26422]"
                                        }
                                        ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                      <div className="flex items-center gap-1">
                                        {sub.icon && sub.icon}
                                        <span>
                                          {isLoggingOut
                                            ? "Logging out..."
                                            : sub.name}
                                        </span>
                                      </div>
                                    </a>
                                  ) : (
                                    <Link
                                      to={sub.path}
                                      className={`block px-2 py-1 rounded-md transition-colors duration-200
                                        ${
                                          subActive
                                            ? "text-[#F26422] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#F26422]"
                                            : "text-black hover:text-[#F26422]"
                                        }`}
                                      onClick={() =>
                                        window.innerWidth < 768 &&
                                        setIsOpen(false)
                                      }
                                    >
                                      <div className="flex items-center gap-1">
                                        {sub.icon && sub.icon}
                                        <span>{sub.name}</span>
                                      </div>
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </>
                      )}
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ✅ Add Product Popup */}
      <AddProductPopup
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
      />
    </>
  );
};

export default VendorSidebar;
