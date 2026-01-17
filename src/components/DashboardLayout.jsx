import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import VendorSidebar from "./VendorSidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "admin";
    setUserRole(role);
  }, []);

  return (
    <div>
      <Header />

      {userRole === "vendor" ? (
        <VendorSidebar />
      ) : (
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      )}

      <main
        className={`mt-12 p-4 bg-white min-h-screen transition-all duration-300
        ${sidebarOpen ? "ml-56" : "ml-0"} 
        md:ml-56`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
