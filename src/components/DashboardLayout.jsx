import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
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
