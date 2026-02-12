import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Download, Eye, Truck } from "lucide-react";
import { BASE_URL } from "../../api/api";

const AllOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightRef = useRef(null);

  // Read the orderId from query params
  const queryParams = new URLSearchParams(location.search);
  const highlightOrderId = queryParams.get("orderId");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 8;

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Fetch orders from API with Authorization
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get token from localStorage (same as AddCategoryModal)
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No authentication token found. Please login.");
        }

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const apiUrl = `${BASE_URL}/api/checkout/vendor/orders?page=${currentPage}&limit=${itemsPerPage}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          credentials: "include", // Same as AddCategoryModal
          headers: headers,
        });

        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Transform API data to match component format
          const transformedOrders = data.orders.map((order, index) => {
            const transformed = {
              id: order.orderNumber,
              date: new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              vendor: order.items[0]?.vendor?.storeName || "N/A",
              user: order.user?.contactNumber || "N/A",
              cartValue: order.pricing.total,
              payment: order.payment.method.toUpperCase(),
              status: order.status || "pending", // Use API status directly
              shippingAddress: order.shippingAddress,
              items: order.items,
              pricing: order.pricing,
              notes: order.notes,
              _id: order._id,
            };

            return transformed;
          });

          setOrders(transformedOrders);
          setPagination(data.pagination);
        } else {
          console.error("========================================");
          console.error("=== API ERROR ===");
          console.error("API returned success: false");
          console.error("Error Message:", data.message);
          console.error("Full Error Data:", data);
          console.error("========================================");
          throw new Error(data.message || "API returned success: false");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);

        // If unauthorized, redirect to login
        if (
          err.message.includes("Unauthorized") ||
          err.message.includes("authentication")
        ) {
          // Optionally redirect to login page
          // navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, itemsPerPage]);

  // Format status for display with proper labels
  const formatStatus = (status) => {
    if (!status) return "Order Pending Hai";

    const statusMap = {
      pending: "Pending ",
      order_placed: "Order Place ",
      confirmed: "Order Confirm ",
      processing: "Order Process ",
      ready: " Ready ",
      rider_assign: "Rider Assign ",
      out_for_delivery: "Delivery ",
      delivered: "Delivered",
      cancelled: "Cancelled",
      canceled: "Cancelled",
    };

    return (
      statusMap[status.toLowerCase()] ||
      status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
    );
  };

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

  // Status colors based on API status values
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "pending") return "text-blue-600 font-semibold";
    if (statusLower === "order_placed") return "text-purple-600 font-semibold";
    if (statusLower === "confirmed") return "text-yellow-600 font-semibold";
    if (statusLower === "processing") return "text-orange-600 font-semibold";
    if (statusLower === "ready") return "text-cyan-600 font-semibold";
    if (statusLower === "rider_assign") return "text-indigo-600 font-semibold";
    if (statusLower === "out_for_delivery")
      return "text-pink-600 font-semibold";
    if (statusLower === "delivered") return "text-green-600 font-semibold";
    if (statusLower === "cancelled" || statusLower === "canceled")
      return "text-red-600 font-semibold";
    return "text-gray-600 font-semibold";
  };

  // Use all orders (no filtering)
  const filteredOrders = orders;

  // Pagination (using all orders for display)
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
          {error ? (
            <div className="text-red-500">
              <p className="font-semibold">Error: {error}</p>
              {error.includes("authentication") && (
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-orange-500 underline"
                >
                  Refresh Page
                </button>
              )}
            </div>
          ) : (
            "No orders found."
          )}
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      {/* Search + Calendar */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-2 w-full pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="flex items-center border border-black rounded overflow-hidden h-[36px] w-full sm:w-[400px]">
            <input
              type="text"
              placeholder="Search Order by Order Id, Products, User name, Tag"
              className="flex-1 px-4 text-sm focus:outline-none h-full"
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-4 sm:px-6 h-full text-sm">
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
              <th className="p-3 text-left">User Name</th>
              <th className="p-3 text-left">Cart Value</th>
              <th className="p-3 text-left">Payment Status</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredOrders.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {currentOrders.map((order, idx) => {
                const isHighlighted = order.id === highlightOrderId;
                const formattedStatus = formatStatus(order.status);
                const statusColor = getStatusColor(order.status);

                return (
                  <tr
                    key={order.id}
                    ref={isHighlighted ? highlightRef : null}
                    className={`shadow-sm rounded-sm hover:bg-gray-50 transition border-b-4 border-gray-200 ${
                      isHighlighted ? "bg-yellow-100 animate-pulse" : "bg-white"
                    }`}
                  >
                    <td className="p-3">{indexOfFirst + idx + 1}</td>
                    <td className="p-3 font-semibold">{order.id}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3">{order.user}</td>
                    <td className="p-3">₹{order.cartValue}</td>
                    <td className="p-3">{order.payment}</td>
                    <td className={`p-3 ${statusColor}`}>{formattedStatus}</td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-end">
                        <button className="text-orange-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/order/${order.id}`)}
                          className="text-orange-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-orange-600 hover:text-blue-700">
                          <Truck className="w-4 h-4" />
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
      {!loading && filteredOrders.length > 0 && (
        <div className="flex justify-end items-center gap-4 mt-6 max-w-[98%] mx-auto">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-10 py-3 text-sm font-medium rounded-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex gap-2 text-sm text-black font-medium flex-wrap items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page ? "text-orange-600 font-semibold" : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-[#247606] hover:bg-green-700 text-white px-10 py-3 text-sm font-medium rounded-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllOrder;
