// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Dashboard part
// import Dashboard from "./pages/SuperAdminDashboard/Dashboard";
// import ViewAllNotification from "./pages/SuperAdminDashboard/ViewAllNotification";

// // Product management part
// import AllProduct from "./pages/ProductManagement/AllProduct";
// import SingleProduct from "./pages/ProductManagement/SingleProduct";
// import AddProduct from "./components/AddProduct";
// import TrendingProduct from "./pages/ProductManagement/TrendingProduct";

// // Inventory management part
// import Inventory from "./pages/InventoryManagement/Inventory";

// // Vendor management part
// import AllVendor from "./pages/VendorManagement/AllVendor";
// import VendorDetails from "./pages/VendorManagement/VendorDetails";
// import VendorPermissionPage from "./pages/VendorManagement/VendorPermissionPage";

// // Vendor support part
// import VendorSupport from "./pages/VendorSupportManagement/VendorSupport";

// // Category management part
// import AllCategory from "./pages/CategoryManagement/AllCategory";
// import AllCategoryView from "./pages/CategoryManagement/AllCategoryView";
// import CreateCategory from "./pages/CategoryManagement/CreateCategory";
// import CategoryView from "./pages/CategoryManagement/CategoryView";
// import CreateSubCategory from "./pages/CategoryManagement/CreateSubCategory";
// import SubCategoryView from "./pages/CategoryManagement/SubCategoryView";

// // Order management part
// import AllOrder from "./pages/OrderManagement/AllOrder";
// import SingleOrder from "./pages/OrderManagement/SingleOrder";
// import Invoice from "./pages/OrderManagement/Invoice";
// import InvoiceView from "./pages/OrderManagement/InvoiceView";
// import BagQRScan from "./pages/OrderManagement/BagQr";

// // Rider Management
// import AllRider from "./pages/RiderManagement/AllRider";

// // Coupon management part
// import AllCoupon from "./pages/CoupanOffer/AllCoupon";
// import CreateCoupon from "./components/CreateCoupon";

// // Notification part
// import Notification from "./pages/NotificationManagement/Notification";
// import SingleNotification from "./pages/NotificationManagement/SingleNotification.jsx";
// import PushNotification from "./components/PushNotification";
// import BulkAudiance from "./components/BulkAudiencePopup";

// // Analytics part
// import SalesReport from "./pages/Analytics/SalesReport/VendorWiseSalesReport.jsx";
// import VendorReport from "./pages/Analytics/VendorReport.jsx";
// import AnalyticsDashboard from "./pages/Analytics/AnalyticsDashboard.jsx";

// // Authentication part
// import Login from "./pages/Login";

// // Top bar Notifications
// import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
// import TopBarMail from "./pages/TopBarComponents/TopBarMail";
// import TopBarChat from "./pages/TopBarComponents/TopBarChat.jsx";

// // New Order Popup
// import NewOrderPopup from "./components/NewOrderPopup";

// function App() {
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowPopup(true), 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route
//           path="/notifications/view-all"
//           element={<ViewAllNotification />}
//         />

//         {/* Product Management */}
//         <Route path="/products/all" element={<AllProduct />} />
//         <Route path="/products/:id" element={<SingleProduct />} />
//         <Route path="/products/add" element={<AddProduct />} />
//         <Route path="/products/trending" element={<TrendingProduct />} />

//         {/* Inventory Management */}
//         <Route path="/inventory" element={<Inventory />} />

//         {/* Vendor Management */}
//         <Route path="/vendor/all" element={<AllVendor />} />
//         <Route path="/vendor/:id" element={<VendorDetails />} />
//         <Route
//           path="/vendors/:id/settings"
//           element={<VendorPermissionPage />}
//         />

//         {/* Vendor Support */}
//         <Route path="/vendor-support" element={<VendorSupport />} />

//         {/* Category Management */}
//         <Route path="/category/all" element={<AllCategory />} />
//         <Route path="/category/view-all/:id" element={<AllCategoryView />} />
//         <Route path="/category/create" element={<CreateCategory />} />
//         <Route path="/category/view/:id" element={<CategoryView />} />
//         <Route path="/category/create-sub" element={<CreateSubCategory />} />
//         <Route path="/category/subview/:id" element={<SubCategoryView />} />

//         {/* Order Management */}
//         <Route path="/orders/all" element={<AllOrder />} />
//         <Route path="/order/:id" element={<SingleOrder />} />
//         <Route path="/invoice" element={<Invoice />} />
//         <Route path="/invoice/view/" element={<InvoiceView />} />
//         <Route path="/orders/:id/bag-qr-scan" element={<BagQRScan />} />

//         {/* Rider Management */}
//         <Route path="/Rider" element={<AllRider />} />

//         {/* Coupon Management */}
//         <Route path="/coupons/all" element={<AllCoupon />} />
//         <Route path="/coupons/create" element={<CreateCoupon />} />

//         {/* Notifications */}
//         <Route path="/notification" element={<Notification />} />
//         <Route path="/notification/:id" element={<SingleNotification />} />
//         <Route path="/notification/push" element={<PushNotification />} />
//         <Route path="/notification/bulk" element={<BulkAudiance />} />

//         {/* Analytics */}
//         <Route path="/analytics/sales" element={<SalesReport />} />
//         <Route path="/analytics/vendor" element={<VendorReport />} />
//         <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
//         {/* Top Bar Notifications */}
//         <Route path="/topbar-notifications" element={<TopBarNotification />} />
//         <Route path="/mail" element={<TopBarMail />} />
//         <Route path="/chat" element={<TopBarChat />} />
//       </Routes>

//       {/* Popup */}
//       <NewOrderPopup visible={showPopup} onClose={() => setShowPopup(false)} />
//     </Router>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Dashboard part
import Dashboard from "./pages/SuperAdminDashboard/Dashboard";
import ViewAllNotification from "./pages/SuperAdminDashboard/ViewAllNotification";

// Product management part
import AllProduct from "./pages/ProductManagement/AllProduct";
import SingleProduct from "./pages/ProductManagement/SingleProduct";
import AddProduct from "./components/AddProduct";
import TrendingProduct from "./pages/ProductManagement/TrendingProduct";

// Inventory management part
import Inventory from "./pages/InventoryManagement/Inventory";

// Vendor management part
import AllVendor from "./pages/VendorManagement/AllVendor";
import VendorDetails from "./pages/VendorManagement/VendorDetails";
import VendorPermissionPage from "./pages/VendorManagement/VendorPermissionPage";

// Vendor support part
import VendorSupport from "./pages/VendorSupportManagement/VendorSupport";

// Category management part
import AllCategory from "./pages/CategoryManagement/AllCategory";
import AllCategoryView from "./pages/CategoryManagement/AllCategoryView";
import CreateCategory from "./pages/CategoryManagement/CreateCategory";
import CategoryView from "./pages/CategoryManagement/CategoryView";
import CreateSubCategory from "./pages/CategoryManagement/CreateSubCategory";
import SubCategoryView from "./pages/CategoryManagement/SubCategoryView";

// Banners Part
import Banners from "./pages/Banners";
// Order management part
import AllOrder from "./pages/OrderManagement/AllOrder";
import SingleOrder from "./pages/OrderManagement/SingleOrder";
import Invoice from "./pages/OrderManagement/Invoice";
import InvoiceView from "./pages/OrderManagement/InvoiceView";
import BagQRScan from "./pages/OrderManagement/BagQr";

// Rider Management
import AllRider from "./pages/RiderManagement/AllRider";

// Coupon management part
import AllCoupon from "./pages/CoupanOffer/AllCoupon";
import CreateCoupon from "./components/CreateCoupon";

// Notification part
import Notification from "./pages/NotificationManagement/Notification";
import SingleNotification from "./pages/NotificationManagement/SingleNotification.jsx";
import PushNotification from "./components/PushNotification";
import BulkAudiance from "./components/BulkAudiencePopup";

// Analytics part
import SalesReport from "./pages/Analytics/SalesReport/VendorWiseSalesReport.jsx";
import VendorReport from "./pages/Analytics/VendorReport.jsx";
import AnalyticsDashboard from "./pages/Analytics/AnalyticsDashboard.jsx";

// Authentication part
import Login from "./pages/Login";

// Top bar Notifications
import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";
import TopBarChat from "./pages/TopBarComponents/TopBarChat.jsx";

// New Order Popup
import NewOrderPopup from "./components/NewOrderPopup";

/* ---------------- App Content ---------------- */

function AppContent() {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Do NOT show popup on login page
    if (location.pathname !== "/") {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/notifications/view-all"
          element={<ViewAllNotification />}
        />

        {/* Product Management */}
        <Route path="/products/all" element={<AllProduct />} />
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/trending" element={<TrendingProduct />} />

        {/* Inventory Management */}
        <Route path="/inventory" element={<Inventory />} />

        {/* Vendor Management */}
        <Route path="/vendor/all" element={<AllVendor />} />
        <Route path="/vendor/:id" element={<VendorDetails />} />
        <Route
          path="/vendors/:id/settings"
          element={<VendorPermissionPage />}
        />

        {/* Vendor Support */}
        <Route path="/vendor-support" element={<VendorSupport />} />

        {/* Category Management */}
        <Route path="/category/all" element={<AllCategory />} />
        <Route path="/category/view-all/:id" element={<AllCategoryView />} />
        <Route path="/category/create" element={<CreateCategory />} />
        <Route path="/category/view/:id" element={<CategoryView />} />
        <Route path="/category/create-sub" element={<CreateSubCategory />} />
        <Route path="/category/subview/:id" element={<SubCategoryView />} />

        {/* Banners */}
        <Route path="/banners" element={<Banners />} />

        {/* Order Management */}
        <Route path="/orders/all" element={<AllOrder />} />
        <Route path="/order/:id" element={<SingleOrder />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice/view" element={<InvoiceView />} />
        <Route path="/orders/:id/bag-qr-scan" element={<BagQRScan />} />

        {/* Rider Management */}
        <Route path="/Rider" element={<AllRider />} />

        {/* Coupon Management */}
        <Route path="/coupons/all" element={<AllCoupon />} />
        <Route path="/coupons/create" element={<CreateCoupon />} />

        {/* Notifications */}
        <Route path="/notification" element={<Notification />} />
        <Route path="/notification/:id" element={<SingleNotification />} />
        <Route path="/notification/push" element={<PushNotification />} />
        <Route path="/notification/bulk" element={<BulkAudiance />} />

        {/* Analytics */}
        <Route path="/analytics/sales" element={<SalesReport />} />
        <Route path="/analytics/vendor" element={<VendorReport />} />
        <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />

        {/* Top Bar */}
        <Route path="/topbar-notifications" element={<TopBarNotification />} />
        <Route path="/mail" element={<TopBarMail />} />
        <Route path="/chat" element={<TopBarChat />} />
      </Routes>

      {/* ✅ Popup (NOT on Login page) */}
      {location.pathname !== "/" && (
        <NewOrderPopup
          visible={showPopup}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

/* ---------------- Main App ---------------- */

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
