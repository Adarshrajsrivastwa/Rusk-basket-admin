import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Download,
  Eye,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { BASE_URL } from "../../api/api";

const EARTH_RADIUS_KM = 6371;

function parseGeoCoord(value) {
  if (value === null || value === undefined || value === "") return null;
  const n =
    typeof value === "number" ? value : parseFloat(String(value).trim());
  return Number.isFinite(n) ? n : null;
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function formatDistanceKm(km) {
  if (!Number.isFinite(km) || km < 0) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}

function computeOrderListDistance(order) {
  const storeAddr = order.items?.[0]?.vendor?.storeAddress;
  const ship = order.shippingAddress;
  const vLat = parseGeoCoord(storeAddr?.latitude ?? storeAddr?.lat);
  const vLng = parseGeoCoord(
    storeAddr?.longitude ?? storeAddr?.lng ?? storeAddr?.lon,
  );
  const sLat = parseGeoCoord(ship?.latitude ?? ship?.lat);
  const sLng = parseGeoCoord(ship?.longitude ?? ship?.lng ?? ship?.lon);
  if (vLat != null && vLng != null && sLat != null && sLng != null) {
    return formatDistanceKm(haversineDistanceKm(vLat, vLng, sLat, sLng));
  }
  const raw =
    order.distance ?? order.deliveryDistance ?? order.shippingAddress?.distance;
  if (raw === null || raw === undefined || raw === "") return "—";
  if (typeof raw === "number" && Number.isFinite(raw))
    return formatDistanceKm(raw);
  const str = String(raw).trim();
  if (/km/i.test(str) || /m\b/i.test(str)) return str;
  const num = parseFloat(str.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num)) return "—";
  return formatDistanceKm(num);
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    cls: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
    dot: "bg-blue-500",
  },
  order_placed: {
    label: "Order Placed",
    cls: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100",
    dot: "bg-purple-500",
  },
  confirmed: {
    label: "Confirmed",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-100",
    dot: "bg-yellow-500",
  },
  processing: {
    label: "Processing",
    cls: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-100",
    dot: "bg-orange-500",
  },
  ready: {
    label: "Ready",
    cls: "bg-cyan-50 text-cyan-700 border-cyan-200 ring-cyan-100",
    dot: "bg-cyan-500",
  },
  rider_assign: {
    label: "Rider Assigned",
    cls: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-100",
    dot: "bg-indigo-500",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    cls: "bg-pink-50 text-pink-700 border-pink-200 ring-pink-100",
    dot: "bg-pink-500",
  },
  delivered: {
    label: "Delivered",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border-red-200 ring-red-100",
    dot: "bg-red-500",
  },
  canceled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border-red-200 ring-red-100",
    dot: "bg-red-500",
  },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || "pending";
  const cfg = STATUS_CONFIG[key] || {
    label:
      status?.charAt(0).toUpperCase() + status?.slice(1).replace(/_/g, " ") ||
      "Unknown",
    cls: "bg-gray-50 text-gray-600 border-gray-200 ring-gray-100",
    dot: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const AllOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const highlightOrderId = queryParams.get("orderId");

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    pages: 1,
  });
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        if (!token)
          throw new Error("No authentication token found. Please login.");

        const response = await fetch(
          `${BASE_URL}/api/checkout/vendor/orders?page=${currentPage}&limit=${itemsPerPage}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401)
          throw new Error("Unauthorized. Please login again.");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.success) {
          setOrders(
            data.orders.map((order) => ({
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
              status: order.status || "pending",
              shippingAddress: order.shippingAddress,
              items: order.items,
              pricing: order.pricing,
              notes: order.notes,
              _id: order._id,
              distanceDisplay: computeOrderListDistance(order),
            })),
          );
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "API returned success: false");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);

  useEffect(() => {
    if (!loading && highlightOrderId && highlightRef.current) {
      setTimeout(
        () =>
          highlightRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        100,
      );
    }
  }, [loading, highlightOrderId]);

  const handleDownloadInvoice = (orderId) => {
    navigate(`/invoice/view/${orderId}`, {
      state: { orderId },
      replace: false,
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const productNames =
      order.items?.map((i) => i.product?.name?.toLowerCase() || "").join(" ") ||
      "";
    return (
      order.id?.toLowerCase().includes(q) ||
      order.user?.toLowerCase().includes(q) ||
      order.vendor?.toLowerCase().includes(q) ||
      order.payment?.toLowerCase().includes(q) ||
      order.status?.toLowerCase().includes(q) ||
      productNames.includes(q) ||
      order.cartValue?.toString().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-28" : j === 8 ? "w-16 ml-auto" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="9" className="py-20 text-center">
          {error ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-300" />
              </div>
              <p className="text-red-500 text-sm font-medium">{error}</p>
              {error.includes("authentication") && (
                <button
                  onClick={() => window.location.reload()}
                  className="text-[#FF7B1D] underline text-xs"
                >
                  Refresh Page
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-orange-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">
                No orders found
              </p>
              <p className="text-gray-300 text-xs">
                Try adjusting your search query
              </p>
            </div>
          )}
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full px-1 mt-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              All Orders
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-lg">
              {pagination.total} total
            </span>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[420px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search by Order ID, products, user, status…"
            className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onKeyDown={(e) => e.key === "Enter" && setCurrentPage(1)}
          />
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Order List
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredOrders.length} of {pagination.total} orders
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  "S.N",
                  "Order ID",
                  "Date",
                  "User",
                  "Cart Value",
                  "Distance",
                  "Payment",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${
                      i === 8 ? "text-right pr-5" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
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
                      key={order.id}
                      ref={isHighlighted ? highlightRef : null}
                      className={`row-animate border-b border-gray-50 transition-colors duration-150 group ${
                        isHighlighted
                          ? "bg-yellow-50 ring-2 ring-inset ring-yellow-300"
                          : "hover:bg-orange-50/40"
                      }`}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* S.N */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </span>
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          {order.id}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {order.date}
                      </td>

                      {/* User */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-gray-700">
                          {order.user}
                        </span>
                      </td>

                      {/* Cart Value */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-gray-800">
                          ₹{order.cartValue}
                        </span>
                      </td>

                      {/* Distance */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100 whitespace-nowrap">
                          {order.distanceDisplay}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                          {order.payment}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="action-btn bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-700"
                            title="View Invoice"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/order/${order.id || order._id}`)
                            }
                            className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                            title="View Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
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
      </div>

      {/* ── Pagination ── */}
      {!loading && filteredOrders.length > 0 && (
        <div className="flex items-center justify-between px-1 mt-5 mb-6">
          <p className="text-xs text-gray-400 font-medium">
            Page{" "}
            <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
            of <span className="text-gray-600 font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const visible = new Set([
                  1,
                  2,
                  totalPages - 1,
                  totalPages,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                ]);
                for (let i = 1; i <= totalPages; i++) {
                  if (visible.has(i)) pages.push(i);
                  else if (pages[pages.length - 1] !== "...") pages.push("...");
                }
                return pages.map((page, idx) =>
                  page === "..." ? (
                    <span key={idx} className="px-1 text-gray-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === page
                          ? "bg-[#FF7B1D] text-white shadow-sm shadow-orange-200"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200"
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
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllOrder;
