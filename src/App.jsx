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

import Dashboard from "./pages/SuperAdminDashboard/Dashboard";
import ViewAllNotification from "./pages/SuperAdminDashboard/ViewAllNotification";
import VendorDashboard from "./pages/VendorDashboard/Dashboard";
import RiderDueAmounts from "./pages/VendorDashboard/RiderDueAmounts";
import ProtectedRoute from "./components/ProtectedRoute";
import AllProduct from "./pages/ProductManagement/AllProduct";
import PendingProduct from "./pages/ProductManagement/PendingProduct";
import SingleProduct from "./pages/ProductManagement/SingleProduct";
import AddProduct from "./components/AddProduct";
import TrendingProduct from "./pages/ProductManagement/TrendingProduct";
import Inventory from "./pages/InventoryManagement/Inventory";
import AllVendor from "./pages/VendorManagement/AllVendor";
import VendorDetails from "./pages/VendorManagement/VendorDetails";
import VendorPermissionPage from "./pages/VendorManagement/VendorPermissionPage";
import VendorCommissionManagement from "./pages/VendorManagement/VendorCommissionManagement";
import VendorSupport from "./pages/VendorSupportManagement/VendorSupport";
import VendorDailyOffers from "./pages/VendorDailyOffers/VendorDailyOffers";
import AllCategory from "./pages/CategoryManagement/AllCategory";
import AllCategoryView from "./pages/CategoryManagement/AllCategoryView";
import CreateCategory from "./pages/CategoryManagement/CreateCategory";
import CategoryView from "./pages/CategoryManagement/CategoryView";
import CreateSubCategory from "./pages/CategoryManagement/CreateSubCategory";
import SubCategoryView from "./pages/CategoryManagement/SubCategoryView";
import Banners from "./pages/Banners";
import AllOrder from "./pages/OrderManagement/AllOrder";
import SingleOrder from "./pages/OrderManagement/SingleOrder";
import Invoice from "./pages/OrderManagement/Invoice";
import InvoiceView from "./pages/OrderManagement/InvoiceView";
import BagQRScan from "./pages/OrderManagement/BagQr";
import AddExtraItemPage from "./pages/OrderManagement/AddExtraItemPage";
import AllRider from "./pages/RiderManagement/AllRider";
import RiderCommissionManagement from "./pages/RiderManagement/RiderCommissionManagement";
import AllCoupon from "./pages/CoupanOffer/AllCoupon";
import SingleOffer from "./pages/CoupanOffer/SingleOffer.jsx";
import CreateCoupon from "./components/CreateCoupon";
import Notification from "./pages/NotificationManagement/Notification";
import SingleNotification from "./pages/NotificationManagement/SingleNotification.jsx";
import PushNotification from "./components/PushNotification";
import BulkAudiance from "./components/BulkAudiencePopup";
import SalesReport from "./pages/Analytics/SalesReport/VendorWiseSalesReport";
import VendorReport from "./pages/Analytics/VendorReport.jsx";
import AnalyticsDashboard from "./pages/Analytics/AnalyticsDashboard.jsx";
import Login from "./pages/Login";
import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";
import TopBarChat from "./pages/TopBarComponents/TopBarChat";
import Products from "./pages/VendorProductManagement/Products";
import SingleProducts from "./pages/VendorProductManagement/SingleProducts";
import VendorInventory from "./pages/VendorInventoryManagement/VendorInventory";
import VendorOrder from "./pages/VendorOrderManagement/VendorOrder";
import VendorAnalytics from "./pages/VendorAnalytics/VendorAnalytics";
import RiderJobs from "./pages/RiderJobsManagement/RiderJobs";
import RiderJobApplications from "./pages/RiderJobManagement/RiderJobApplications.jsx";
import UpdateProfile from "./pages/VendorUpdateProfile/UpdateProfile";
import MyProfile from "./pages/HeaderMyProfile/MyProfile";
import AdminProfile from "./pages/AdminProfilePage/AdminProfile.jsx";
import PaymentGateways from "./pages/PaymentGatewayManagement/PaymentGateways";
import Suggestions from "./pages/SuggestionManagement/Suggestions";
import AdminVendorSupport from "./pages/AdminSupportManagement/AdminVendorSupport";
import AdminUserSupport from "./pages/AdminSupportManagement/AdminUserSupport";
import AdminRiderSupport from "./pages/AdminSupportManagement/AdminRiderSupport";
import RiderJobPostManagement from "./pages/AdminRiderJobsManagement/Jobs";
import AllAdmin from "./pages/AdminManagement/AllAdmin";
import WithdrawalRequests from "./pages/RiderManagement/WithdrawalRequests";
import VendorWithdrawalRequests from "./pages/VendorDashboard/WithdrawalRequests";
import AdminVendorWithdrawalRequests from "./pages/VendorManagement/VendorWithdrawalRequests";
import ReferralCashbackSettings from "./pages/SettingsManagement/ReferralCashbackSettings";
function AppContent() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications/view-all"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ViewAllNotification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/all"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/pending"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SingleProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rider-job-applications/:jobId"
          element={<RiderJobApplications />}
        />

        <Route
          path="/products/trending"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TrendingProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/all"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllVendor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/commission"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <VendorCommissionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/all"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/products"
          element={
            <ProtectedRoute allowedRoles={["admin", "vendor"]}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/products/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "vendor"]}>
              <SingleProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/inventory"
          element={
            <ProtectedRoute allowedRoles={["admin", "vendor"]}>
              <VendorInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/orders"
          element={
            <ProtectedRoute allowedRoles={["admin", "vendor"]}>
              <VendorOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin", "vendor"]}>
              <VendorAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/jobs"
          element={
            <ProtectedRoute allowedRoles={["admin", "vendor"]}>
              <RiderJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["admin", "vendor"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/rider-due-amounts"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <RiderDueAmounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/withdrawal-requests"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorWithdrawalRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/daily-offers"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDailyOffers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/update-profile"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/notifications"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <TopBarNotification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/settings/profile"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        {/* Parameterized route must come AFTER all specific routes */}
        <Route
          path="/vendor/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <VendorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors/:id/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <VendorPermissionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-support"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorSupport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-gateways"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PaymentGateways />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggestions"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Suggestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/referral-cashback-settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ReferralCashbackSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vendor-support"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminVendorSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user-support"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUserSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rider-support"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRiderSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rider-job-posting"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RiderJobPostManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rider/withdrawal-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <WithdrawalRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vendors/withdrawal-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminVendorWithdrawalRequests />
            </ProtectedRoute>
          }
        />

        <Route path="/category/all" element={<AllCategory />} />
        <Route path="/category/view-all/:id" element={<AllCategoryView />} />
        <Route path="/category/create" element={<CreateCategory />} />
        <Route path="/category/view/:id" element={<CategoryView />} />
        <Route path="/category/create-sub" element={<CreateSubCategory />} />
        <Route path="/category/subview/:id" element={<SubCategoryView />} />

        <Route path="/banners" element={<Banners />} />

        <Route path="/orders/all" element={<AllOrder />} />
        <Route path="/order/:id" element={<SingleOrder />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice/view/:orderId" element={<InvoiceView />} />
        <Route path="/invoice/view" element={<InvoiceView />} />
        <Route path="/orders/:id/bag-qr-scan" element={<BagQRScan />} />
        <Route path="/orders/:id/add-extra-items" element={<AddExtraItemPage />} />

        <Route path="/Rider" element={<AllRider />} />
        <Route
          path="/rider/commission"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RiderCommissionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rider/withdrawal-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <WithdrawalRequests />
            </ProtectedRoute>
          }
        />

        <Route path="/coupons/all" element={<AllCoupon />} />
        <Route path="/coupons/:id" element={<SingleOffer />} />
        <Route path="/coupons/create" element={<CreateCoupon />} />

        <Route path="/notification" element={<Notification />} />
        <Route path="/notification/:id" element={<SingleNotification />} />
        <Route path="/notification/push" element={<PushNotification />} />
        <Route path="/notification/bulk" element={<BulkAudiance />} />

        <Route path="/analytics/sales" element={<SalesReport />} />
        <Route path="/analytics/all" element={<VendorReport />} />
        <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />

        <Route path="/topbar-notifications" element={<TopBarNotification />} />
        <Route path="/mail" element={<TopBarMail />} />
        <Route path="/chat" element={<TopBarChat />} />
      </Routes>

    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
