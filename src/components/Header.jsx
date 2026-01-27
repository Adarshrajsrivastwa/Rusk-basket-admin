import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiGrid,
  FiMaximize,
  FiBell,
  FiMail,
  FiMessageCircle,
  FiUser,
  FiSettings,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // ✅ Create navigate instance

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      {/* Right Icons */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <button className="hidden sm:block text-white text-lg p-2 hover:bg-[#414b57] rounded">
          <FiMaximize />
        </button>

        <button className="hidden sm:block text-white text-lg p-2 hover:bg-[#414b57] rounded">
          <FiGrid />
        </button>

        {/* ✅ Chat Icon (Navigate to Chat Page) */}
        {/* <button
          onClick={() => navigate("/chat")}
          className="relative text-white text-lg p-2 hover:bg-[#414b57] rounded"
        >
          <FiMessageCircle />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            5
          </span>
        </button> */}

        {/* ✅ Mail Button with Navigation */}
        <button
          onClick={() => navigate("/mail")} // 👈 Navigate to Mail Page
          className="relative text-white text-lg p-2 hover:bg-[#414b57] rounded"
        >
          <FiMail />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        {/* ✅ Notification Button with Navigation */}
        <button
          onClick={() => navigate("/topbar-notifications")} // 👈 Navigate to Notification Page
          className="relative text-white text-lg p-2 hover:bg-[#414b57] rounded"
        >
          <FiBell />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-3 h-3 rounded-full" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="focus:outline-none"
          >
            <img
              src="https://i.pravatar.cc/32"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-gray-600 cursor-pointer"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-[#343d46] rounded-full" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold">Kevin Larry</p>
                <p className="text-xs text-gray-500">warren@example.com</p>
              </div>

              <div className="py-2">
                {/* ✅ My Profile Button with Navigation */}
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100"
                >
                  <FiUser /> My Profile
                </button>

                {/* ✅ Settings Button with Navigation */}
                <button
                  onClick={() => navigate("/settings")}
                  className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100"
                >
                  <FiSettings /> Settings
                </button>

                {/* ✅ Billing Button with Navigation */}
                <button
                  onClick={() => navigate("/billing")}
                  className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100"
                >
                  <FiCreditCard /> Billing
                </button>
              </div>

              {/* ✅ Logout Button */}
              <button
                onClick={() => {
                  // Add your logout logic here
                  console.log("Logging out...");
                  // navigate("/login");
                }}
                className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 border-t"
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
