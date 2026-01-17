import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Truck,
  Boxes,
  ShoppingCart,
  Tags,
  TicketPercent,
  Bell,
  BarChart3,
  Store,
  Headphones,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  User,
  KeyRound,
  UserCog,
  LogOut,
  Image,
} from "lucide-react";
import AddVendorModal from "./AddVendorModal";
import AddProductPopup from "../components/AddProduct"; // ✅ Import Product Modal

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false); // ✅ Product modal state
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("/");

  useEffect(() => {
    setActiveItem(location.pathname + location.search);
  }, [location.pathname, location.search]);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // ✅ Handler for Add Vendor click
  const handleAddVendorClick = (e) => {
    e.preventDefault();
    setShowAddVendorModal(true);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  // ✅ Handler for Add Product click
  const handleAddProductClick = (e) => {
    e.preventDefault();
    setShowAddProductModal(true);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  // ✅ Menu Items
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={16} />,
      path: "/dashboard",
    },
    {
      name: "Product Management",
      icon: <Package size={16} />,
      subItems: [
        // { name: "Product", path: "/products/all", hasDot: true },
        // { name: "All Product", path: "/products/all" },
        // { name: "Trending Product", path: "/products/trending" },
        { name: "Pending Product", path: "/products/pending" },
      ],
    },
    // {
    //   name: "Inventory",
    //   icon: <Boxes size={16} />,
    //   path: "/inventory",
    // },
    {
      name: "Order Management",
      icon: <ShoppingCart size={16} />,
      subItems: [
        { name: "All Order", path: "/orders/all?tab=all" },
        { name: "Pending Order", path: "/orders/pending" },
        { name: "Delivered", path: "/orders/all?tab=delivered" },
        { name: "Cancel", path: "/orders/all?tab=cancel" },
        { name: "Invoice", path: "/invoice" },
      ],
    },
    {
      name: "Category Management",
      icon: <Tags size={16} />,
      subItems: [
        { name: "All Category", path: "/category/all" },
        { name: "Create Category", path: "/category/create" },
        { name: "Create Sub Category", path: "/category/create-sub" },
      ],
    },
    {
      name: "Banners Management",
      icon: <Image size={16} />,
      path: "/banners",
    },

    {
      name: "Coupons & Offer",
      icon: <TicketPercent size={16} />,
      subItems: [
        { name: "All Coupons", path: "/coupons/all" },
        // { name: "Create Coupons", path: "/coupons/create" },
        // { name: "Prepaid Offer (%)", path: "/coupons/prepaid" },
      ],
    },
    {
      name: "Notification",
      icon: <Bell size={16} />,
      subItems: [
        { name: "Notification", path: "/notification" },
        { name: "Shoot Notification", path: "/notification/shoot" },
        { name: "Manage Event Notification", path: "/notification/manage" },
      ],
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={16} />,
      subItems: [
        { name: "All Report", path: "/analytics/all" },
        // { name: "Vendor Report", path: "/analytics/vendor" },
        // { name: "Analytics Dashboard", path: "/analytics/dashboard" },
      ],
    },
    {
      name: "Vendor Management",
      icon: <Store size={16} />,
      subItems: [
        { name: "All Vendor", path: "/vendor/all" },
        { name: "Add Vendor", path: "/vendor/add", isModal: true },
        // { name: "Vendor Dashboard", path: "/vendor/details" },
      ],
    },
    {
      name: "Rider Management",
      icon: <Truck size={16} />,
      path: "/Rider",
    },

    {
      name: "Vendor Support",
      icon: <Headphones size={16} />,
      path: "/vendor-support",
    },
    {
      name: "User Support",
      icon: <Users size={16} />,
      subItems: [
        { name: "New Ticket", path: "/user-support/new" },
        { name: "Open Ticket", path: "/user-support/open" },
        { name: "Closed Ticket", path: "/user-support/closed" },
      ],
    },
    {
      name: "Settings",
      icon: <Settings size={16} />,
      subItems: [
        {
          name: "Profile",
          path: "/settings/profile",
          icon: <User size={14} />,
        },
        {
          name: "Change Password",
          path: "/settings/password",
          icon: <KeyRound size={14} />,
        },
        {
          name: "Manage Role",
          path: "/settings/role",
          icon: <UserCog size={14} />,
        },
        { name: "Logout", path: "/logout", icon: <LogOut size={14} /> },
      ],
    },
  ];

  useEffect(() => {
    const openItem = menuItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((sub) =>
          (location.pathname + location.search).startsWith(
            sub.path.split("?")[0]
          )
        )
    );
    if (openItem) setOpenDropdown(openItem.name);
  }, [location.pathname, location.search]);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-2xl text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X strokeWidth={8} /> : <Menu strokeWidth={3} />}
      </button>

      {/* Sidebar */}
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
                    activeItem.startsWith(sub.path.split("?")[0])
                  ));
              const isDropdownOpen = openDropdown === item.name;

              return (
                <React.Fragment key={item.name}>
                  {/* Dashboard */}
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

                  {/* Other Items */}
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

                          {/* Submenu */}
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
                                  {sub.isModal ? (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        if (sub.name === "Product")
                                          handleAddProductClick(e);
                                        else handleAddVendorClick(e);
                                      }}
                                      className={`block px-2 py-1 rounded-md transition-colors duration-200
                                        ${
                                          subActive
                                            ? "text-[#F26422] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#F26422]"
                                            : "text-black hover:text-[#F26422]"
                                        }`}
                                    >
                                      <div className="flex items-center gap-1">
                                        {sub.icon && sub.icon}
                                        <span>{sub.name}</span>
                                        {sub.hasDot && (
                                          <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        )}
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
                                        {sub.hasDot && (
                                          <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        )}
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

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ✅ Modals */}
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
};

export default Sidebar;
