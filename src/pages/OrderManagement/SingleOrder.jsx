import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import AssignDeliveryBoyModal from "../../components/AssignDeliveryBoyModal";
import { BASE_URL } from "../../api/api";
import {
  Truck,
  X,
  Clock,
  User,
  Phone,
  Package,
  MapPin,
  CreditCard,
  FileText,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  QrCode,
  Download,
  Image,
} from "lucide-react";

const API_BASE_URL = `${BASE_URL}/api`;

/* ─────────────────────────── helpers ─────────────────────────── */
const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = status.toLowerCase().replace(/_/g, " ");
  const map = {
    order_placed: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      dot: "bg-amber-500",
      label: "Order Placed",
    },
    pending: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      dot: "bg-amber-500",
      label: "Pending",
    },
    confirmed: {
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      dot: "bg-emerald-500",
      label: "Confirmed",
    },
    delivered: {
      cls: "bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100",
      dot: "bg-blue-500",
      label: "Delivered",
    },
    ready: {
      cls: "bg-orange-50 text-orange-700 border border-orange-200 ring-1 ring-orange-100",
      dot: "bg-orange-500",
      label: "Ready",
    },
  };
  const cfg = map[status.toLowerCase()] ||
    map[s] || {
      cls: "bg-gray-100 text-gray-600 border border-gray-200",
      dot: "bg-gray-400",
      label: status,
    };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const InfoRow = ({ label, value, accent = false }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 group">
    <span className="text-xs text-gray-400 font-medium">{label}</span>
    <span
      className={`text-xs font-semibold text-right max-w-[55%] truncate ${accent ? "text-[#FF7B1D]" : "text-gray-700"}`}
    >
      {value ?? "—"}
    </span>
  </div>
);

const PriceRow = ({
  label,
  value,
  accent = false,
  large = false,
  isDiscount = false,
  isCashback = false,
}) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span
      className={`font-medium text-gray-600 ${large ? "text-sm font-bold" : "text-xs"}`}
    >
      {label}
    </span>
    <span
      className={`font-bold ${large ? "text-lg" : "text-sm"} ${
        accent
          ? "text-[#FF7B1D]"
          : isDiscount
            ? "text-red-500"
            : isCashback
              ? "text-emerald-600"
              : "text-gray-800"
      }`}
    >
      {isDiscount && value > 0 ? "-" : ""}₹
      {Math.abs(
        typeof value === "number" ? value : parseFloat(value) || 0,
      ).toLocaleString()}
    </span>
  </div>
);

const SectionCard = ({
  title,
  icon: Icon,
  children,
  accentColor = "orange",
  className = "",
}) => {
  const colors = {
    orange: {
      header: "from-[#FF7B1D] to-orange-400",
      bar: "border-t-[#FF7B1D]",
    },
    red: { header: "from-red-500 to-red-400", bar: "border-t-red-500" },
    blue: { header: "from-blue-500 to-blue-400", bar: "border-t-blue-500" },
    green: {
      header: "from-emerald-500 to-emerald-400",
      bar: "border-t-emerald-500",
    },
  };
  const c = colors[accentColor] || colors.orange;
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 border-t-4 ${c.bar} ${className}`}
    >
      <div
        className={`bg-gradient-to-r ${c.header} px-5 py-3.5 flex items-center gap-2`}
      >
        {Icon && <Icon className="w-4 h-4 text-white opacity-90" />}
        <span className="text-sm font-bold text-white">{title}</span>
      </div>
      {children}
    </div>
  );
};

const ImageCard = ({ title, subtitle, icon: Icon, imageUrl }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 border-t-4 border-t-[#FF7B1D]">
      <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-5 py-3.5 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-white opacity-90" />}
        <span className="text-sm font-bold text-white">{title}</span>
      </div>
      <div className="h-48 bg-gray-50 relative flex items-center justify-center overflow-hidden">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center border-2 border-dashed border-orange-200">
              {Icon && <Icon className="w-6 h-6 text-orange-300" />}
            </div>
            <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────── skeleton ─────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse border-t-4 border-t-orange-200">
    <div className="h-[46px] bg-gradient-to-r from-orange-100 to-orange-50" />
    <div className="p-5 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-3 w-24 bg-gray-100 rounded-full" />
          <div className="h-3 w-28 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────── main component ─────────────────────────── */
const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [showAssignRiderModal, setShowAssignRiderModal] = useState(false);
  const [vendorsWithRiders, setVendorsWithRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [assigningRider, setAssigningRider] = useState(false);
  const pdfGeneratedRef = useRef(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const response = await fetch(
          `${API_BASE_URL}/checkout/vendor/order/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers,
          },
        );
        const result = await response.json();
        if (!response.ok || !result.success)
          throw new Error(result.message || "Failed to fetch order data");
        setOrderData(transformOrderData(result.data));
      } catch (err) {
        setError(err.message || "Failed to load order data");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderData();
  }, [id]);

  useEffect(() => {
    const generateInvoicePDF = async () => {
      if (
        orderData?.status?.toLowerCase() === "order_placed" &&
        !pdfGeneratedRef.current &&
        orderData.id
      ) {
        try {
          const token =
            localStorage.getItem("token") || localStorage.getItem("authToken");
          const headers = { "Content-Type": "application/json" };
          if (token) headers["Authorization"] = `Bearer ${token}`;
          const response = await fetch(
            `${API_BASE_URL}/invoice/order/${orderData.id}/generate-pdf`,
            { method: "POST", credentials: "include", headers },
          );
          const result = await response.json();
          if (response.ok && result.success) pdfGeneratedRef.current = true;
        } catch (_) {}
      }
    };
    generateInvoicePDF();
  }, [orderData]);

  useEffect(() => {
    pdfGeneratedRef.current = false;
  }, [id]);

  const transformOrderData = (apiData) => {
    const orderDate = new Date(apiData.createdAt);
    const formattedDate = orderDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = orderDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const firstItem = apiData.items[0];
    const vendorInfo = firstItem?.vendor || {};
    return {
      id: apiData.orderNumber || apiData._id,
      _id: apiData._id,
      date: formattedDate,
      time: formattedTime,
      vendor: {
        id: vendorInfo.storeId || "N/A",
        name: vendorInfo.storeName || "N/A",
        authorizedPerson: vendorInfo.storeName || "N/A",
        contact: apiData.user?.contactNumber || "N/A",
        altContact: "N/A",
        whatsapp: apiData.user?.contactNumber || "N/A",
        email: "N/A",
        registrationDate: "N/A",
        totalOrders: 0,
        leaderboardPosition: 0,
        turnover: 0,
      },
      buyer: {
        id: apiData.user?._id || "N/A",
        name: "Customer",
        userType: "Customer",
        mobile: apiData.user?.contactNumber || "N/A",
        altMobile: apiData.shippingAddress?.phone || "N/A",
        email: "N/A",
        registrationDate: "N/A",
        totalOrders: 0,
        leaderboardPosition: 0,
        turnover: 0,
      },
      deliveryAddress: {
        contactPerson: "Customer",
        mobile: apiData.shippingAddress?.phone || "N/A",
        altMobile: apiData.user?.contactNumber || "N/A",
        address1: apiData.shippingAddress?.line1 || "N/A",
        address2: apiData.shippingAddress?.line2 || "",
        city: apiData.shippingAddress?.city || "N/A",
        pinCode: apiData.shippingAddress?.pinCode || "N/A",
        distance: "N/A",
        expectedTime: "N/A",
      },
      products: apiData.items.map((item) => ({
        name:
          item.productName || item.product?.productName || "Unknown Product",
        quantity: item.quantity,
        amount: item.totalPrice,
        sku: item.sku || "N/A",
        stock: "N/A",
        rating: 0,
        thumbnail:
          item.thumbnail?.url ||
          item.product?.thumbnail?.url ||
          item.image?.url ||
          null,
      })),
      cartValue: apiData.pricing?.total || 0,
      payment: {
        mode: apiData.payment?.method?.toUpperCase() || "COD",
        productValue: apiData.pricing?.subtotal || 0,
        handlingCost: apiData.pricing?.handlingCharge || 0,
        tax: apiData.pricing?.tax || 0,
        deliveryCost: apiData.deliveryAmount || 0,
        additional: 0,
        total: apiData.pricing?.total || 0,
        discount: apiData.pricing?.discount || apiData.coupon?.discount || 0,
        cashback: apiData.pricing?.totalCashback || 0,
      },
      status: apiData.status || "pending",
      couponCode: apiData.coupon?.code || null,
      deliveryImage: apiData.deliveryImage?.url || null,
      deliveredImage: apiData.deliveredImage?.url || null,
      rider:
        apiData.riderDetails || apiData.rider
          ? {
              id: apiData.rider?._id || apiData.riderDetails?.riderId || "N/A",
              name:
                apiData.rider?.fullName ||
                apiData.riderDetails?.riderName ||
                apiData.riderInfo?.name ||
                "N/A",
              mobile:
                apiData.rider?.mobileNumber ||
                apiData.riderDetails?.mobileNumber ||
                apiData.riderInfo?.mobileNumber ||
                "N/A",
              whatsapp:
                apiData.rider?.whatsappNumber ||
                apiData.riderDetails?.whatsappNumber ||
                "N/A",
              deliveryAmount:
                apiData.riderAmount || apiData.deliveryAmount || 0,
            }
          : null,
      notes: apiData.notes || "",
      rawApiData: apiData,
    };
  };

  const fetchVendorsWithRiders = async () => {
    try {
      setLoadingRiders(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(
        `${API_BASE_URL}/analytics/vendor/riders/no-orders`,
        {
          method: "GET",
          credentials: "include",
          headers,
        },
      );
      const result = await response.json();
      setVendorsWithRiders(
        result.success && result.data ? result.data.vendors || [] : [],
      );
    } catch (_) {
      setVendorsWithRiders([]);
    } finally {
      setLoadingRiders(false);
    }
  };

  const handleAssignRider = async () => {
    if (!selectedRider) {
      alert("⚠️ Please select a rider!");
      return;
    }
    try {
      setAssigningRider(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(
        `${API_BASE_URL}/vendor/orders/${id}/assign-rider`,
        {
          method: "PUT",
          credentials: "include",
          headers,
          body: JSON.stringify({
            riderId: selectedRider.riderId,
            assignmentNotes: assignmentNotes || undefined,
          }),
        },
      );
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        alert("✅ Rider assigned successfully!");
        setShowAssignRiderModal(false);
        setSelectedRider(null);
        setAssignmentNotes("");
        window.location.reload();
      } else {
        alert(
          `❌ Failed to assign rider: ${result.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      alert(`❌ Failed to assign rider. ${error.message}`);
    } finally {
      setAssigningRider(false);
    }
  };

  useEffect(() => {
    if (showAssignRiderModal) fetchVendorsWithRiders();
  }, [showAssignRiderModal]);

  const shouldShowActionButtons = () => {
    const allowed = ["order_placed", "pending", "new order", "confirmed"];
    return allowed.includes(orderData?.status?.toLowerCase());
  };

  /* ── loading ── */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-5 space-y-5">
          <div className="h-24 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-5">
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <p className="font-bold text-gray-800 mb-1">Error Loading Order</p>
            <p className="text-sm text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!orderData) {
    return (
      <DashboardLayout>
        <div className="p-5">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-amber-300" />
            </div>
            <p className="font-bold text-gray-700">Order not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate { animation: fadeSlideIn 0.28s ease forwards; }
      `}</style>

      <div className="p-5 space-y-5 max-w-full">
        {/* ── Header Bar ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-[#FF7B1D] card-animate">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Order Details
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono bg-orange-50 text-[#FF7B1D] border border-orange-200 px-2.5 py-1 rounded-lg font-bold">
                  {orderData.id}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500 font-medium">
                  {orderData.date}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500 font-medium">
                  {orderData.time}
                </span>
                <span className="text-gray-300">·</span>
                <StatusBadge status={orderData.status} />
                {orderData.status?.toLowerCase() === "ready" &&
                  !orderData.rider && (
                    <button
                      onClick={() => setShowAssignRiderModal(true)}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    >
                      <Truck className="w-3 h-3" /> Assign Rider
                    </button>
                  )}
              </div>
            </div>
            {shouldShowActionButtons() && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    navigate(`/orders/${orderData.id}/bag-qr-scan`)
                  }
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
                >
                  <QrCode className="w-4 h-4" /> Bag & QR Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Top 4-col Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Buyer */}
          <div className="card-animate" style={{ animationDelay: "40ms" }}>
            <SectionCard title="Buyer Information" icon={User}>
              <div className="px-5 py-3 h-72 overflow-y-auto">
                <InfoRow label="User ID" value={orderData.buyer.id} />
                <InfoRow label="Name" value={orderData.buyer.name} accent />
                <InfoRow label="User Type" value={orderData.buyer.userType} />
                <InfoRow label="Mobile" value={orderData.buyer.mobile} />
                <InfoRow
                  label="Alt. Mobile"
                  value={orderData.buyer.altMobile}
                />
                <InfoRow label="Email" value={orderData.buyer.email} />
              </div>
            </SectionCard>
          </div>

          {/* Vendor */}
          <div className="card-animate" style={{ animationDelay: "80ms" }}>
            <SectionCard title="Vendor Information" icon={Package}>
              <div className="px-5 py-3 h-72 overflow-y-auto">
                <InfoRow label="Vendor ID" value={orderData.vendor.id} />
                <InfoRow label="Name" value={orderData.vendor.name} accent />
                <InfoRow
                  label="Auth. Person"
                  value={orderData.vendor.authorizedPerson}
                />
                <InfoRow label="Contact" value={orderData.vendor.contact} />
                <InfoRow
                  label="Alt. Contact"
                  value={orderData.vendor.altContact}
                />
                <InfoRow label="WhatsApp" value={orderData.vendor.whatsapp} />
                <InfoRow label="Email" value={orderData.vendor.email} />
              </div>
            </SectionCard>
          </div>

          {/* Products */}
          <div
            className="lg:col-span-2 card-animate"
            style={{ animationDelay: "120ms" }}
          >
            <SectionCard
              title={`Products Ordered (${orderData.products.length})`}
              icon={Package}
            >
              <div className="px-5 py-3 h-72 overflow-y-auto space-y-2.5">
                {orderData.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 border border-gray-100 rounded-xl p-2.5 bg-white hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-150 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-orange-50 border-2 border-orange-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-orange-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate mb-1.5">
                        {product.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Qty: {product.quantity}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-[#FF7B1D] border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ₹{product.amount}
                        </span>
                        {product.sku !== "N/A" && (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {product.sku}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Footer strip */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2 flex-wrap bg-gray-50/50">
                <span className="inline-flex items-center gap-1.5 bg-[#FF7B1D] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  Cart: ₹{orderData.cartValue.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  {orderData.products.length} Items
                </span>
                <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  {orderData.payment.mode}
                </span>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* ── Delivery + Rider Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Delivery Address */}
          <div className="card-animate" style={{ animationDelay: "160ms" }}>
            <SectionCard title="Delivery Address" icon={MapPin}>
              <div className="px-5 py-4 space-y-1">
                <InfoRow label="Order ID" value={orderData.id} accent />
                <InfoRow
                  label="Contact"
                  value={orderData.deliveryAddress.contactPerson}
                />
                <InfoRow
                  label="Mobile"
                  value={orderData.deliveryAddress.mobile}
                />
                <InfoRow
                  label="Alt. Mobile"
                  value={orderData.deliveryAddress.altMobile}
                />
                <InfoRow
                  label="Coupon"
                  value={orderData.couponCode || "Not Applied"}
                />
                {/* Address block */}
                <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
                    Shipping Address
                  </p>
                  <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                    {orderData.deliveryAddress.address1}
                    {orderData.deliveryAddress.address2 &&
                      `, ${orderData.deliveryAddress.address2}`}
                    <br />
                    {orderData.deliveryAddress.city} –{" "}
                    {orderData.deliveryAddress.pinCode}
                  </p>
                </div>
                {orderData.notes && (
                  <div className="mt-2 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                    <p className="text-[10px] text-blue-500 font-semibold mb-1 uppercase tracking-wider">
                      Order Notes
                    </p>
                    <p className="text-xs text-gray-700 font-semibold">
                      {orderData.notes}
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Rider */}
          <div className="card-animate" style={{ animationDelay: "200ms" }}>
            <SectionCard
              title="Delivery Partner"
              icon={Truck}
              accentColor="red"
            >
              <div className="px-5 py-4">
                {orderData.rider ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {orderData.rider.name}
                        </p>
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Assigned
                        </span>
                      </div>
                    </div>
                    <InfoRow label="Mobile" value={orderData.rider.mobile} />
                    <InfoRow
                      label="WhatsApp"
                      value={orderData.rider.whatsapp}
                    />
                    <InfoRow
                      label="Delivery Amount"
                      value={`₹${orderData.rider.deliveryAmount || 0}`}
                      accent
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3 border-2 border-dashed border-red-200">
                      <Truck className="w-6 h-6 text-red-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 mb-1">
                      No rider assigned yet
                    </p>
                    <p className="text-xs text-gray-400">
                      Rider will be assigned automatically or manually
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className="card-animate" style={{ animationDelay: "240ms" }}>
          <SectionCard title="Pricing & Invoice" icon={CreditCard}>
            <div className="px-5 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                <div>
                  <PriceRow
                    label="Product Value"
                    value={orderData.payment.productValue}
                  />
                  {orderData.payment.handlingCost > 0 && (
                    <PriceRow
                      label="Handling Cost"
                      value={orderData.payment.handlingCost}
                    />
                  )}
                  <PriceRow label="Tax (GST)" value={orderData.payment.tax} />
                  {orderData.payment.discount > 0 && (
                    <PriceRow
                      label="Discount"
                      value={orderData.payment.discount}
                      isDiscount
                    />
                  )}
                </div>
                <div>
                  <PriceRow
                    label="Delivery Cost"
                    value={orderData.payment.deliveryCost}
                  />
                  {orderData.payment.additional > 0 && (
                    <PriceRow
                      label="Additional"
                      value={orderData.payment.additional}
                    />
                  )}
                  {orderData.payment.cashback > 0 && (
                    <PriceRow
                      label="Cashback"
                      value={orderData.payment.cashback}
                      isCashback
                    />
                  )}
                  <div className="pt-2 mt-1 border-t-2 border-[#FF7B1D]">
                    <PriceRow
                      label="Total Amount"
                      value={orderData.payment.total}
                      accent
                      large
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Invoice Button ── */}
        <div
          className="flex justify-center card-animate"
          style={{ animationDelay: "270ms" }}
        >
          <button
            onClick={() => {
              const orderId = orderData?._id || id;
              if (orderId)
                navigate(`/invoice/view/${orderId}`, {
                  state: { orderId },
                  replace: false,
                });
              else alert("Order ID not available");
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-sm shadow-orange-200 hover:shadow-orange-300 transition-all"
          >
            <Download className="w-4 h-4" /> Download Invoice
          </button>
        </div>

        {/* ── Images ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 card-animate"
          style={{ animationDelay: "300ms" }}
        >
          <ImageCard
            title="Delivery Image"
            subtitle="No image uploaded"
            icon={Package}
            imageUrl={orderData.deliveryImage}
          />
          <ImageCard
            title="Delivered Image"
            subtitle="No image uploaded"
            icon={Truck}
            imageUrl={orderData.deliveredImage}
          />
          <ImageCard
            title="Additional Documents"
            subtitle="No attachments"
            icon={FileText}
            imageUrl={null}
          />
        </div>
      </div>

      {/* ── Assign Delivery Boy Modal ── */}
      <AssignDeliveryBoyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* ── Assign Rider Modal ── */}
      {showAssignRiderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 border-t-4 border-t-emerald-500 my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-500" /> Assign Rider
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select an available rider for this order
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAssignRiderModal(false);
                  setSelectedRider(null);
                  setAssignmentNotes("");
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingRiders ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
                <span className="ml-3 text-sm text-gray-500">
                  Loading riders...
                </span>
              </div>
            ) : vendorsWithRiders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-600 mb-1">
                  No riders available
                </p>
                <p className="text-xs text-gray-400">
                  Please wait — riders will be available soon.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 max-h-80 overflow-y-auto space-y-4 pr-1">
                  {vendorsWithRiders.map((vendor, vi) => (
                    <div
                      key={vendor.vendorId || vi}
                      className="border border-gray-100 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-[#FF7B1D]" />
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {vendor.vendorName || vendor.storeName}
                        </span>
                        <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full font-semibold ml-auto">
                          {vendor.totalRidersWithNoOrders ||
                            vendor.riders?.length ||
                            0}{" "}
                          riders
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {vendor.riders?.length > 0 ? (
                          vendor.riders.map((rider, ri) => (
                            <div
                              key={rider.riderId || ri}
                              onClick={() => setSelectedRider(rider)}
                              className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                                selectedRider?.riderId === rider.riderId
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/40"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <User className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-gray-800 truncate">
                                    {rider.fullName}
                                  </p>
                                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                    <Phone className="w-2.5 h-2.5" />{" "}
                                    {rider.mobileNumber}
                                  </p>
                                </div>
                                {selectedRider?.riderId === rider.riderId && (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 col-span-2">
                            No riders available
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedRider && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="text-xs font-semibold text-emerald-700">
                      Selected: {selectedRider.fullName} —{" "}
                      {selectedRider.mobileNumber}
                    </p>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Assignment Notes (Optional)
                  </label>
                  <textarea
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-700 focus:border-emerald-400 focus:outline-none resize-none transition-colors"
                    placeholder="Add any notes about this assignment..."
                    rows={2}
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      setShowAssignRiderModal(false);
                      setSelectedRider(null);
                      setAssignmentNotes("");
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignRider}
                    disabled={!selectedRider || assigningRider}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      !selectedRider || assigningRider
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm"
                    }`}
                  >
                    {assigningRider ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />{" "}
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4" /> Assign Rider
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SingleOrder;
