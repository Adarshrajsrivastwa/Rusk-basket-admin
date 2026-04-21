// import React, { useState, useEffect } from "react";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import VendorSidebar from "./VendorSidebar";

// const DashboardLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userRole, setUserRole] = useState("admin");

//   useEffect(() => {
//     const role = localStorage.getItem("userRole") || "admin";
//     setUserRole(role);
//   }, []);

//   return (
//     <div>
//       <Header />

//       {userRole === "vendor" ? (
//         <VendorSidebar />
//       ) : (
//         <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
//       )}

//       <main
//         className={`mt-12 p-4 bg-white min-h-screen transition-all duration-300
//         ${sidebarOpen ? "ml-56" : "ml-0"}
//         md:ml-56`}
//       >
//         {children}
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import VendorSidebar from "./VendorSidebar";

const DashboardLayout = ({ children }) => {
  const [userRole, setUserRole] = useState("admin");
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "admin";
    setUserRole(role);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Full-width header — no left offset */}
      <Header />

      {/* Sidebar (icon rail always visible at left:0) */}
      {userRole === "vendor" ? (
        <VendorSidebar />
      ) : (
        <Sidebar onPanelChange={setPanelOpen} />
      )}

      {/*
        Main content:
        - Always offset 60px for the icon rail
        - When panel slides open, add extra 230px (smooth transition)
        - Top 64px for header
      */}
      <main
        style={{
          marginTop: "64px",
          marginLeft: panelOpen ? "290px" : "60px",
          transition: "margin-left .3s cubic-bezier(.4,0,.2,1)",
          padding: "24px",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
