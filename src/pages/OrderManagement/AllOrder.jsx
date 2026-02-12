import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Download, Eye } from "lucide-react";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api`;

const AllOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightRef = useRef(null);

  // Read the active tab and orderId from query params
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab") || "all";
  const highlightOrderId = queryParams.get("orderId");

  const [activeTab, setActiveTab] = useState(tabFromQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Utility function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();

      if (!token) {
        console.error("No auth token found");
        alert("Please login to view orders");
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);

      // Add status filter based on active tab
      if (activeTab !== "all") {
        params.append("status", activeTab);
      }

      // Add search query if exists
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      console.log("========================================");
      console.log("📦 FETCHING ORDERS:");
      console.log("API Endpoint:", `${API_BASE_URL}/admin/orders`);
      console.log("Query Params:", params.toString());
      console.log("Full URL:", `${API_BASE_URL}/admin/orders?${params.toString()}`);
      console.log("Active Tab:", activeTab);
      console.log("Current Page:", currentPage);
      console.log("Items Per Page:", itemsPerPage);
      console.log("Search Query:", searchQuery);
      console.log("========================================");

      const response = await fetch(
        `${API_BASE_URL}/admin/orders?${params.toString()}`,
        {
          method: "GET",
          headers: headers,
          credentials: "include",
        },
      );

      console.log("========================================");
      console.log("📡 API RESPONSE:");
      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);
      console.log("Response Headers:", response.headers);
      console.log("========================================");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch error response:", errorText);
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const result = await response.json();

      console.log("========================================");
      console.log("📡 API RESPONSE:");
      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);
      console.log("========================================");
      console.log("📦 PARSED RESPONSE DATA:");
      console.log("Full Response (JSON):", JSON.stringify(result, null, 2));
      console.log("----------------------------------------");
      console.log("Result.success:", result.success);
      console.log("Result.count:", result.count);
      console.log("Result.orders:", result.orders);
      console.log("Result.orders length:", result.orders?.length || 0);
      console.log("Result.pagination:", result.pagination);
      console.log("========================================");

      if (result.success && result.orders && Array.isArray(result.orders)) {
        console.log("========================================");
        console.log("✅ API SUCCESS - Processing Orders:");
        console.log("Number of orders fetched:", result.orders.length);
        console.log("========================================");

        // Transform API data to match component structure
        const transformedOrders = result.orders.map((order, index) => {
          console.log(`\n--- 📌 Order ${index + 1} ---`);
          console.log("Raw Order Data (JSON):", JSON.stringify(order, null, 2));
          console.log("Order._id:", order._id);
          console.log("Order.orderId:", order.orderId);
          console.log("Order.orderNumber:", order.orderNumber);
          console.log("Order.date:", order.date);
          console.log("Order.vendor:", order.vendor);
          console.log("Order.userName:", order.userName);
          console.log("Order.username:", order.username);
          console.log("Order.user:", order.user);
          console.log("Order.cartValue:", order.cartValue);
          console.log("Order.paymentStatus:", order.paymentStatus);
          console.log("Order.status:", order.status);

          const transformed = {
            id: order._id || order.orderId,
            _id: order._id || order.orderId, // Keep MongoDB _id for invoice navigation
            orderId: order.orderNumber || order.orderId || order._id,
            date: order.date || "N/A",
            vendor: order.vendor || "Unknown Vendor",
            user: order.userName || order.username || order.user?.userName || order.user?.contactNumber || "",
            cartValue: order.cartValue || 0,
            payment: order.paymentStatus || "pending",
            status: formatStatus(order.status),
            rawStatus: order.status, // Keep original status for filtering
          };

          console.log("Transformed Order:", JSON.stringify(transformed, null, 2));
          return transformed;
        });

        console.log("========================================");
        console.log("🔄 TRANSFORMED ORDERS SUMMARY:");
        console.log("Total Transformed Orders:", transformedOrders.length);
        console.log("Transformed Orders (Full JSON):", JSON.stringify(transformedOrders, null, 2));
        console.log("========================================");
        
        setOrders(transformedOrders);
        setTotalOrders(result.pagination?.total || result.count || 0);
        setTotalPages(result.pagination?.pages || 1);
      } else {
        console.error("Invalid API response format:", result);
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error details:", error.message);
      alert("Failed to load orders. Please check console for details.");
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return "Pending";

    const statusMap = {
      pending: "New Order",
      ready: "Ready",
      assigned: "Assigned",
      delivered: "Delivered",
      cancelled: "Cancel",
      cancel: "Cancel",
    };

    return statusMap[status.toLowerCase()] || status;
  };

  // Fetch orders when component mounts or dependencies change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeTab]);

  // Scroll to highlighted order after loading
  useEffect(() => {
    if (!loading && highlightOrderId && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [loading, highlightOrderId]);

  // Update active tab if query param changes
  useEffect(() => {
    setActiveTab(tabFromQuery);
    setCurrentPage(1);
  }, [tabFromQuery]);

  const statusColors = {
    "New Order": "text-blue-600 font-semibold",
    Ready: "text-purple-600 font-semibold",
    Assigned: "text-yellow-600 font-semibold",
    Delivered: "text-green-600 font-semibold",
    Cancel: "text-red-600 font-semibold",
    Pending: "text-gray-600 font-semibold",
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr
          key={idx}
          className="animate-pulse border-b border-gray-200 bg-white"
        >
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="p-3">
              <div className="h-4 bg-gray-200 rounded w-[80%]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Empty State
  const EmptyState = () => (
    <tbody>
      <tr>
        <td
          colSpan="8"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No orders found.
        </td>
      </tr>
    </tbody>
  );

  // Handle tab click manually
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    navigate(`/orders/all?tab=${tabKey}`);
  };

  // Handle download invoice - navigate to invoice page
  const handleDownloadInvoice = (orderId) => {
    console.log("Opening invoice for order:", orderId);
    // Navigate to invoice view page with orderId
    navigate(`/invoice/view/${orderId}`, {
      state: { orderId: orderId },
      replace: false,
    });
  };

  return (
    <DashboardLayout>
      {/* Tabs + Search + Calendar */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-2 w-full pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "New Order" },
            { key: "ready", label: "Ready" },
            { key: "assigned", label: "Assigned" },
            { key: "delivered", label: "Delivered" },
            { key: "cancelled", label: "Cancel" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-[#FF7B1D] text-white border-orange-500"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="flex items-center border border-black rounded overflow-hidden h-[36px] w-full sm:w-[400px]">
            <input
              type="text"
              placeholder="Search Order by Order Id, Products, Tag"
              className="flex-1 px-4 text-sm focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-4 sm:px-6 h-full text-sm"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mt-3 sm:mt-0">
          <button className="bg-black hover:bg-gray-800 text-white w-44 sm:w-44 px-6 py-2 rounded-sm text-sm whitespace-nowrap">
            Calendar
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Cart Value</th>
              <th className="p-3 text-left">Payment Status</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : orders.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {orders.map((order, idx) => {
                const isHighlighted = order.id === highlightOrderId;
                return (
                  <tr
                    key={order.id}
                    ref={isHighlighted ? highlightRef : null}
                    className={`shadow-sm rounded-sm hover:bg-gray-50 transition border-b-4 border-gray-200 ${
                      isHighlighted ? "bg-yellow-100 animate-pulse" : "bg-white"
                    }`}
                  >
                    <td className="p-3">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="p-3 font-semibold">{order.orderId}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3">{order.vendor}</td>
                    <td className="p-3">₹{order.cartValue}</td>
                    <td className="p-3 capitalize">{order.payment}</td>
                    <td className={`p-3 ${statusColors[order.status]}`}>
                      {order.status}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleDownloadInvoice(order._id || order.id)}
                          className="text-orange-600 hover:text-blue-700"
                          title="View Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/order/${order.id}`)}
                          className="text-orange-600 hover:text-blue-700"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {!loading && orders.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-4 sm:gap-6 mt-6 max-w-[98%] mx-auto mb-6 px-4 sm:px-0">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-6 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            disabled={currentPage === 1}
          >
            Back
          </button>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-black font-medium overflow-x-auto">
            {(() => {
              const pages = [];
              const visiblePages = new Set([
                1,
                2,
                totalPages - 1,
                totalPages,
                currentPage - 1,
                currentPage,
                currentPage + 1,
              ]);
              for (let i = 1; i <= totalPages; i++) {
                if (visiblePages.has(i)) pages.push(i);
                else if (pages[pages.length - 1] !== "...") pages.push("...");
              }
              return pages.map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-1 text-black select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 sm:px-3 py-1 ${
                      currentPage === page
                        ? "text-orange-600 font-semibold"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                ),
              );
            })()}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="bg-[#247606] hover:bg-green-700 text-white px-6 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Summary Info */}
      {!loading && orders.length > 0 && (
        <div className="text-center text-sm text-gray-600 mt-2 mb-4">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalOrders)} of {totalOrders}{" "}
          orders
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllOrder;
