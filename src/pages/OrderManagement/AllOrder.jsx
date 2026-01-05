import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Download, Eye, Truck } from "lucide-react";

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
  const itemsPerPage = 8;

  const [orders, setOrders] = useState([]);

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setOrders([
        {
          id: "RUSH8038403",
          date: "23 Aug 2025",
          vendor: "Abnish Kumar",
          user: "NK Yadav",
          cartValue: 5222,
          payment: "COD",
          status: "New Order",
        },
        {
          id: "RUSH09401",
          date: "27 Sep 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 124,
          payment: "COD",
          status: "New Order",
        },
        {
          id: "RUSH09402",
          date: "28 Sep 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 230,
          payment: "COD",
          status: "Assigned",
        },
        {
          id: "RUSH09403",
          date: "29 Sep 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 450,
          payment: "COD",
          status: "Delivered",
        },
        {
          id: "RUSH09404",
          date: "30 Sep 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 350,
          payment: "COD",
          status: "Cancel",
        },
        {
          id: "RUSH09405",
          date: "01 Oct 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 400,
          payment: "COD",
          status: "New Order",
        },
        {
          id: "RUSH09406",
          date: "02 Oct 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 280,
          payment: "COD",
          status: "Assigned",
        },
        {
          id: "RUSH09407",
          date: "03 Oct 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 500,
          payment: "COD",
          status: "Delivered",
        },
        {
          id: "RUSH09408",
          date: "04 Oct 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 320,
          payment: "COD",
          status: "Cancel",
        },
        {
          id: "RUSH09409",
          date: "05 Oct 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 150,
          payment: "COD",
          status: "New Order",
        },
        {
          id: "RUSH09410",
          date: "06 Oct 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 270,
          payment: "COD",
          status: "Assigned",
        },
        {
          id: "RUSH09411",
          date: "07 Oct 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 480,
          payment: "COD",
          status: "Delivered",
        },
        {
          id: "RUSH09412",
          date: "08 Oct 2025",
          vendor: "Mathura",
          user: "Anish Kumar",
          cartValue: 360,
          payment: "COD",
          status: "Cancel",
        },
      ]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
    Assigned: "text-yellow-600 font-semibold",
    Delivered: "text-green-600 font-semibold",
    Cancel: "text-red-600 font-semibold",
  };

  // Filter orders based on active tab
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          if (activeTab === "new") return order.status === "New Order";
          if (activeTab === "assigned") return order.status === "Assigned";
          if (activeTab === "delivered") return order.status === "Delivered";
          if (activeTab === "cancel") return order.status === "Cancel";
          return true;
        });

  // Pagination
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
          {Array.from({ length: 9 }).map((__, j) => (
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
          colSpan="9"
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

  return (
    <DashboardLayout>
      {/* Tabs + Search + Today */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-2 w-full pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
          {[
            { key: "all", label: "All" },
            { key: "new", label: "New Order" },
            { key: "assigned", label: "Assigned" },
            { key: "delivered", label: "Delivered" },
            { key: "cancel", label: "Cancel" },
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
            Calender
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
                return (
                  <tr
                    key={idx}
                    ref={isHighlighted ? highlightRef : null}
                    className={`shadow-sm rounded-sm hover:bg-gray-50 transition border-b-4 border-gray-200 ${
                      isHighlighted ? "bg-yellow-100 animate-pulse" : "bg-white"
                    }`}
                  >
                    <td className="p-3">{indexOfFirst + idx + 1}</td>
                    <td className="p-3 font-semibold">{order.id}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3">{order.vendor}</td>
                    <td className="p-3">{order.user}</td>
                    <td className="p-3">₹{order.cartValue}</td>
                    <td className="p-3">{order.payment}</td>
                    <td className={`p-3 ${statusColors[order.status]}`}>
                      {order.status}
                    </td>
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
            className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-10 py-3 text-sm font-medium rounded-0"
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
            className="bg-[#247606] hover:bg-green-700 text-white px-10 py-3 text-sm font-medium rounded-0"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllOrder;
