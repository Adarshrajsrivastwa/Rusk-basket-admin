import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import {
  Package,
  QrCode,
  History,
  Truck,
  CheckCircle,
  Settings,
  Clock,
  RefreshCw,
  ArrowLeft,
  Plus,
  X,
  MapPin,
  Navigation,
  ChevronRight,
  AlertCircle,
  ScanLine,
  Box,
  User,
  Phone,
  Star,
  Bike,
} from "lucide-react";
import {
  StatCard,
  TabButton,
  PackingTab,
  HistoryTab,
  BagDetailsTab,
  DeliveryTab,
  ScanModal,
  DeliveryPartnerModal,
  AddExtraItemModal,
} from "../../pages/OrderManagement/BagQRScan";

/* ─────────────── design tokens ─────────────── */
const PRIMARY = "#FF7B1D";

/* ─────────────── small shared components ─────────────── */
const SectionCard = ({
  title,
  icon: Icon,
  accentColor = "orange",
  children,
  className = "",
}) => {
  const bars = {
    orange: { top: "border-t-[#FF7B1D]", hdr: "from-[#FF7B1D] to-orange-400" },
    green: {
      top: "border-t-emerald-500",
      hdr: "from-emerald-500 to-emerald-400",
    },
    blue: { top: "border-t-blue-500", hdr: "from-blue-500 to-blue-400" },
    purple: {
      top: "border-t-violet-500",
      hdr: "from-violet-500 to-violet-400",
    },
  };
  const c = bars[accentColor] || bars.orange;
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 border-t-4 ${c.top} ${className}`}
    >
      <div
        className={`bg-gradient-to-r ${c.hdr} px-5 py-3.5 flex items-center gap-2`}
      >
        {Icon && <Icon className="w-4 h-4 text-white opacity-90" />}
        <span className="text-sm font-bold text-white">{title}</span>
      </div>
      {children}
    </div>
  );
};

const StatPill = ({ icon: Icon, label, value, color }) => {
  const colors = {
    orange: {
      bg: "bg-orange-50",
      icon: "text-[#FF7B1D]",
      val: "text-[#FF7B1D]",
      border: "border-orange-100",
    },
    green: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      val: "text-emerald-700",
      border: "border-emerald-100",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      val: "text-blue-700",
      border: "border-blue-100",
    },
    purple: {
      bg: "bg-violet-50",
      icon: "text-violet-600",
      val: "text-violet-700",
      border: "border-violet-100",
    },
  };
  const c = colors[color] || colors.orange;
  return (
    <div
      className={`${c.bg} border ${c.border} rounded-2xl p-4 flex items-center gap-3`}
    >
      <div
        className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 border ${c.border}`}
      >
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className={`text-lg font-bold ${c.val} leading-tight truncate`}>
          {value}
        </p>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon: Icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
      active
        ? "border-[#FF7B1D] text-[#FF7B1D] bg-orange-50/60"
        : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    {badge != null && (
      <span
        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${active ? "bg-[#FF7B1D] text-white" : "bg-gray-200 text-gray-500"}`}
      >
        {badge}
      </span>
    )}
  </button>
);

/* ─────────────── skeleton ─────────────── */
const PageSkeleton = () => (
  <DashboardLayout>
    <div className="p-5 space-y-5 animate-pulse">
      <div className="h-24 bg-white rounded-2xl border border-gray-100 shadow-sm" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-orange-50 rounded-2xl border border-orange-100"
          />
        ))}
      </div>
      <div className="h-16 bg-white rounded-2xl border border-gray-100 shadow-sm" />
      <div className="h-64 bg-white rounded-2xl border border-gray-100 shadow-sm" />
    </div>
  </DashboardLayout>
);

/* ─────────────── main ─────────────── */
const BagQRScan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("packing");
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isAddExtraItemModalOpen, setIsAddExtraItemModalOpen] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const [searchPartner, setSearchPartner] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [assignmentStatus, setAssignmentStatus] = useState("pending");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isScanningItem, setIsScanningItem] = useState(false);
  const [isDeliveryAmountModalOpen, setIsDeliveryAmountModalOpen] =
    useState(false);
  const [distance, setDistance] = useState(null);
  const [expectedTime, setExpectedTime] = useState(null);
  const [showWaitingAnimation, setShowWaitingAnimation] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownIntervalRef = useRef(null);
  const redirectTimeoutRef = useRef(null);

  const [availableProducts] = useState([
    {
      id: 101,
      name: "Complimentary USB Cable (Type-C)",
      sku: "FREECABLE001",
      category: "Accessories",
      price: 0,
      seller: "RetailNet",
      qrCode: "QR-FREECABLE001",
    },
    {
      id: 102,
      name: "Free Sample - Face Cream 50ml",
      sku: "FREESAMPLE002",
      category: "Beauty & Personal Care",
      price: 0,
      seller: "BeautyHub",
      qrCode: "QR-FREESAMPLE002",
    },
    {
      id: 103,
      name: "Promotional Pen Set (Pack of 3)",
      sku: "PROMOPEN003",
      category: "Stationery",
      price: 0,
      seller: "OfficeWorld",
      qrCode: "QR-PROMOPEN003",
    },
    {
      id: 104,
      name: "Gift Card - ₹100",
      sku: "GIFTCARD100",
      category: "Gift Cards",
      price: 100,
      seller: "RetailNet",
      qrCode: "QR-GIFTCARD100",
    },
    {
      id: 105,
      name: "Microfiber Cleaning Cloth",
      sku: "FREECLOTH005",
      category: "Accessories",
      price: 0,
      seller: "TechStore",
      qrCode: "QR-FREECLOTH005",
    },
  ]);

  const [deliveryPartners] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      vehicle: "Bike",
      vehicleNo: "DL 8C AX 1234",
      rating: 4.8,
      deliveries: 2847,
      status: "available",
      currentLocation: "Nehru Place Hub",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      name: "Amit Sharma",
      phone: "+91 98765 43211",
      vehicle: "Bike",
      vehicleNo: "DL 3C AB 5678",
      rating: 4.6,
      deliveries: 1923,
      status: "available",
      currentLocation: "Connaught Place Hub",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 3,
      name: "Suresh Verma",
      phone: "+91 98765 43212",
      vehicle: "Auto",
      vehicleNo: "DL 1L AC 9012",
      rating: 4.9,
      deliveries: 3456,
      status: "on_delivery",
      currentLocation: "Out for delivery",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    {
      id: 4,
      name: "Vikram Singh",
      phone: "+91 98765 43213",
      vehicle: "Bike",
      vehicleNo: "DL 5S AZ 3456",
      rating: 4.7,
      deliveries: 2134,
      status: "available",
      currentLocation: "Saket Hub",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
  ]);

  const [products, setProducts] = useState([]);
  const [bagDetails, setBagDetails] = useState({
    bagNo: "",
    status: "Not Started",
    sealed: false,
    bagQRCode: "",
    startTime: null,
    completeTime: null,
    weight: "0.5 kg",
    dimensions: "30x25x15 cm",
  });
  const [scanHistory, setScanHistory] = useState([]);
  const [nextExtraId, setNextExtraId] = useState(1000);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        const orderResponse = await fetch(
          `${BASE_URL}/api/checkout/vendor/order/${id}`,
          { method: "GET", credentials: "include", headers },
        );
        if (!orderResponse.ok)
          throw new Error(`Failed to fetch order: ${orderResponse.status}`);
        const orderData = await orderResponse.json();
        if (!orderData.success || !orderData.data)
          throw new Error("Invalid order data received");
        setOrderData(orderData.data);
        if (orderData.data.items && Array.isArray(orderData.data.items)) {
          setProducts(
            orderData.data.items.map((item, index) => ({
              id: index + 1,
              productId: item.product?._id || item._id,
              name: item.productName || "Unknown Product",
              sku: item.sku || `SKU-${index + 1}`,
              quantity: item.quantity || 1,
              scanned: 0,
              qrCode: `QR-${item.product?._id || item._id}`,
              category: "General",
              price: item.salePrice || item.unitPrice || 0,
              seller: item.vendor?.storeName || "Unknown Seller",
              thumbnail: item.thumbnail?.url || item.image?.url || null,
            })),
          );
        }
      } catch (error) {
        alert(`Failed to load order data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderData();
  }, [id]);

  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const scannedItems = products.reduce((sum, p) => sum + p.scanned, 0);
  const packingProgress =
    totalItems > 0 ? ((scannedItems / totalItems) * 100).toFixed(0) : 0;
  const isPackingComplete = totalItems > 0 && scannedItems === totalItems;
  const orderValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const extraItemsCount = products.filter((p) => p.isExtra).length;

  const scanQRCode = async (productId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/api/product/scan-qr`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to scan QR code");
      return { success: true, exists: data.exists };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addItemsToOrder = async (itemsToAdd) => {
    try {
      const headers = getAuthHeaders();
      const mongoId = orderData?._id || id;
      const response = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${mongoId}/items`,
        {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({ items: itemsToAdd }),
        },
      );
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to add items");
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      const headers = getAuthHeaders();
      const mongoId = orderData?._id || id;
      const response = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${mongoId}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers,
          body: JSON.stringify({ status }),
        },
      );
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || `Failed to update status`);
      if (data.data) setOrderData(data.data);
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddExtraItem = async (product, quantity) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        alert("⚠️ Authentication required.");
        return;
      }
      const orderId = orderData?._id || id;
      const productId = product.productId || product._id;
      if (!productId) {
        alert("⚠️ Product ID not found.");
        return;
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${orderId}/items`,
        {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({ items: [{ productId, quantity }] }),
        },
      );
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Failed to add extra item");
      setProducts([
        ...products,
        {
          ...product,
          id: nextExtraId,
          quantity,
          scanned: 0,
          isExtra: true,
          productId,
        },
      ]);
      setNextExtraId(nextExtraId + 1);
      setScanHistory([
        {
          id: scanHistory.length + 1,
          productName: product.name,
          sku: product.sku,
          time: new Date().toLocaleString(),
          status: "extra_added",
          operator: "Packing Operator",
        },
        ...scanHistory,
      ]);
      alert(`✅ Extra Item Added!\n\n${product.name}\nQty: ${quantity}`);
      setIsAddExtraItemModalOpen(false);
    } catch (error) {
      alert(`❌ Failed to add extra item: ${error.message}`);
    }
  };

  const handleRemoveExtraItem = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (window.confirm(`Remove: ${product.name}?`)) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const handleScanItem = async () => {
    const scannedCode = scanInput.trim().toUpperCase();
    if (!scannedCode) {
      alert("⚠️ Please enter or scan a QR code!");
      return;
    }
    setIsScanningItem(true);
    try {
      const productIndex = products.findIndex(
        (p) =>
          p.qrCode.toUpperCase() === scannedCode ||
          p.sku.toUpperCase() === scannedCode ||
          p.productId === scannedCode ||
          `QR-${p.productId}`.toUpperCase() === scannedCode,
      );
      if (productIndex === -1) {
        alert("❌ Invalid QR Code! Item not in this order.");
        setScanInput("");
        return;
      }
      const product = products[productIndex];
      if (product.scanned >= product.quantity) {
        alert(`⚠️ Already fully scanned!`);
        setScanInput("");
        return;
      }
      const updatedProducts = [...products];
      updatedProducts[productIndex].scanned += 1;
      setProducts(updatedProducts);
      setScanHistory([
        {
          id: scanHistory.length + 1,
          productName: product.name,
          sku: product.sku,
          time: new Date().toLocaleString(),
          status: "scanned",
          operator: "Packing Operator",
        },
        ...scanHistory,
      ]);
      if (scannedItems === 0)
        setBagDetails({
          ...bagDetails,
          status: "Packing in Progress",
          startTime: new Date().toLocaleString(),
        });
      setScanInput("");
      setIsScanModalOpen(false);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsScanningItem(false);
    }
  };

  const handleManualUpdate = async (productId, action) => {
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) return;
    const product = products[productIndex];
    if (action === "increment" && product.scanned < product.quantity) {
      const updatedProducts = [...products];
      updatedProducts[productIndex].scanned += 1;
      setProducts(updatedProducts);
      setScanHistory([
        {
          id: scanHistory.length + 1,
          productName: product.name,
          sku: product.sku,
          time: new Date().toLocaleString(),
          status: "manual",
          operator: "Packing Operator",
        },
        ...scanHistory,
      ]);
    } else if (action === "decrement" && product.scanned > 0) {
      const updatedProducts = [...products];
      updatedProducts[productIndex].scanned -= 1;
      setProducts(updatedProducts);
    }
  };

  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const formatDistance = (d) =>
    d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(2)} km`;
  const calculateEstimatedTime = (d) => {
    const mins = Math.round((d / 30) * 60);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)} hr${mins % 60 > 0 ? ` ${mins % 60} min` : ""}`;
  };

  useEffect(() => {
    if (isDeliveryAmountModalOpen && orderData) {
      setDistance("Calculating...");
      setExpectedTime("Calculating...");
      try {
        let vLat = null,
          vLng = null,
          sLat = null,
          sLng = null;
        const storeAddr =
          orderData.items?.[0]?.vendor?.storeAddress ||
          orderData.vendor?.storeAddress;
        if (storeAddr) {
          vLat = parseFloat(storeAddr.latitude || storeAddr.lat);
          vLng = parseFloat(
            storeAddr.longitude || storeAddr.lng || storeAddr.lon,
          );
        }
        const shipAddr = orderData.shippingAddress || orderData.deliveryAddress;
        if (shipAddr) {
          sLat = parseFloat(shipAddr.latitude || shipAddr.lat);
          sLng = parseFloat(shipAddr.longitude || shipAddr.lng || shipAddr.lon);
        }
        const validV = vLat && vLng && !isNaN(vLat) && !isNaN(vLng);
        const validS = sLat && sLng && !isNaN(sLat) && !isNaN(sLng);
        if (!validV || !validS) {
          setDistance("N/A");
          setExpectedTime("N/A");
          return;
        }
        const dist = calculateHaversineDistance(vLat, vLng, sLat, sLng);
        setDistance(formatDistance(dist));
        setExpectedTime(calculateEstimatedTime(dist));
      } catch (_) {
        setDistance("N/A");
        setExpectedTime("N/A");
      }
    } else {
      setDistance(null);
      setExpectedTime(null);
    }
  }, [isDeliveryAmountModalOpen, orderData]);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  const handleCompletePacking = () => {
    if (!isPackingComplete) {
      alert("⚠️ Please scan all items first!");
      return;
    }
    setIsDeliveryAmountModalOpen(true);
  };

  const handleSealBag = async () => {
    setIsDeliveryAmountModalOpen(false);
    setIsUpdatingStatus(true);
    try {
      const bagNumber = `BAG${Date.now().toString().slice(-8)}`;
      const qrCode = `FKMP${Date.now().toString().slice(-10)}`;
      const extraItems = products.filter((p) => p.isExtra);
      if (extraItems.length > 0) {
        await addItemsToOrder(
          extraItems.map((item) => ({
            productId: item.productId || item.id.toString(),
            quantity: item.quantity,
          })),
        );
      }
      setBagDetails({
        ...bagDetails,
        bagNo: bagNumber,
        bagQRCode: qrCode,
        status: "Ready for Pickup",
        sealed: true,
        completeTime: new Date().toLocaleString(),
      });
      setTimeout(async () => {
        await updateOrderStatus("ready");
      }, 15000);
      setShowWaitingAnimation(true);
      setCountdown(5);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            setShowWaitingAnimation(false);
            navigate("/vendor/orders");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      redirectTimeoutRef.current = setTimeout(() => {
        clearInterval(countdownIntervalRef.current);
        setShowWaitingAnimation(false);
        navigate("/vendor/orders");
      }, 5000);
      setIsUpdatingStatus(false);
    } catch (error) {
      alert(`❌ Failed to seal bag: ${error.message}`);
      setIsUpdatingStatus(false);
    }
  };

  const handleResetPacking = () => {
    if (window.confirm("⚠️ Reset all packing progress?")) {
      setProducts(
        products.map((p) => ({ ...p, scanned: 0 })).filter((p) => !p.isExtra),
      );
      setBagDetails({
        bagNo: "",
        status: "Not Started",
        sealed: false,
        bagQRCode: "",
        startTime: null,
        completeTime: null,
        weight: "0.5 kg",
        dimensions: "30x25x15 cm",
      });
      setScanHistory([]);
      setSelectedPartner(null);
      setAssignmentStatus("pending");
      setNextExtraId(1000);
    }
  };

  const handleAssignPartner = () => {
    if (!bagDetails.sealed) {
      alert("⚠️ Please seal the bag first!");
      return;
    }
    setIsDeliveryModalOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedPartner) {
      alert("⚠️ Please select a delivery partner!");
      return;
    }
    setAssignmentStatus("assigned");
    setIsDeliveryModalOpen(false);
    alert(
      `✅ ${selectedPartner.name} assigned!\nVehicle: ${selectedPartner.vehicle} (${selectedPartner.vehicleNo})`,
    );
  };

  const handleMarkPickedUp = () => {
    if (assignmentStatus !== "assigned") {
      alert("⚠️ Assign a delivery partner first!");
      return;
    }
    if (window.confirm(`Confirm ${selectedPartner.name} picked up the bag?`)) {
      setAssignmentStatus("picked_up");
    }
  };

  const availablePartners = deliveryPartners.filter(
    (p) =>
      p.status === "available" &&
      p.name.toLowerCase().includes(searchPartner.toLowerCase()),
  );

  if (loading) return <PageSkeleton />;

  const progressPercent = Number(packingProgress);

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate { animation: fadeSlideIn 0.28s ease forwards; }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 2s linear infinite; }
      `}</style>

      <div className="p-5 space-y-5 max-w-full">
        {/* ── Header ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-[#FF7B1D] card-animate">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/order/${id}`)}
                className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF7B1D] hover:bg-orange-100 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Bag Packing & QR Scanning
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="font-mono bg-orange-50 text-[#FF7B1D] border border-orange-200 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                    {orderData?.orderNumber || id}
                  </span>
                  <span className="text-gray-300 text-xs">·</span>
                  <span className="text-xs text-gray-500 font-medium">
                    ₹{orderValue.toLocaleString("en-IN")}
                  </span>
                  {extraItemsCount > 0 && (
                    <>
                      <span className="text-gray-300 text-xs">·</span>
                      <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        +{extraItemsCount} Extra
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Seal status chip */}
            {bagDetails.sealed ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bag
                Sealed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />{" "}
                {bagDetails.status}
              </span>
            )}
          </div>
        </div>

        {/* ── Stat Pills ── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 card-animate"
          style={{ animationDelay: "40ms" }}
        >
          <StatPill
            icon={Package}
            label="Total Items"
            value={totalItems}
            color="orange"
          />
          <StatPill
            icon={CheckCircle}
            label="Scanned"
            value={scannedItems}
            color="green"
          />
          <StatPill
            icon={Settings}
            label="Progress"
            value={`${packingProgress}%`}
            color="blue"
          />
          <StatPill
            icon={bagDetails.sealed ? CheckCircle : Clock}
            label="Status"
            value={bagDetails.status}
            color="purple"
          />
        </div>

        {/* ── Progress Bar ── */}
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 card-animate"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Packing Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-bold">
                {scannedItems} / {totalItems}
              </span>
              {isPackingComplete && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-2.5 h-2.5" /> Complete
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF7B1D] to-orange-400 transition-all duration-700 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent > 12 && (
                <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold">
                  {packingProgress}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Tab Card ── */}
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-animate"
          style={{ animationDelay: "120ms" }}
        >
          {/* Tab Bar */}
          <div className="flex border-b border-gray-100 overflow-x-auto px-1 bg-gray-50/40">
            <TabBtn
              active={activeTab === "packing"}
              onClick={() => setActiveTab("packing")}
              icon={Package}
              label="Item Packing"
              badge={products.length}
            />
            <TabBtn
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              icon={History}
              label="Scan History"
              badge={scanHistory.length || null}
            />
            <TabBtn
              active={activeTab === "bag"}
              onClick={() => setActiveTab("bag")}
              icon={QrCode}
              label="Bag Details"
            />
            <TabBtn
              active={activeTab === "delivery"}
              onClick={() => setActiveTab("delivery")}
              icon={Truck}
              label="Delivery Partner"
            />
          </div>

          {/* Tab Content */}
          <div className="p-5">
            {activeTab === "packing" && (
              <PackingTab
                products={products}
                bagDetails={bagDetails}
                setIsScanModalOpen={setIsScanModalOpen}
                handleManualUpdate={handleManualUpdate}
                handleRemoveExtraItem={handleRemoveExtraItem}
                setIsAddExtraItemModalOpen={setIsAddExtraItemModalOpen}
              />
            )}
            {activeTab === "history" && (
              <HistoryTab scanHistory={scanHistory} />
            )}
            {activeTab === "bag" && (
              <BagDetailsTab
                bagDetails={bagDetails}
                id={orderData?.orderNumber || id}
                orderValue={orderValue}
                totalItems={totalItems}
              />
            )}
            {activeTab === "delivery" && (
              <DeliveryTab
                assignmentStatus={assignmentStatus}
                selectedPartner={selectedPartner}
                bagDetails={bagDetails}
                handleAssignPartner={handleAssignPartner}
                handleMarkPickedUp={handleMarkPickedUp}
                id={orderData?.orderNumber || id}
                totalItems={totalItems}
                orderValue={orderValue}
              />
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 card-animate"
          style={{ animationDelay: "160ms" }}
        >
          {/* Add Extra */}
          <button
            onClick={() => setIsAddExtraItemModalOpen(true)}
            disabled={bagDetails.sealed || isUpdatingStatus}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              bagDetails.sealed || isUpdatingStatus
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white shadow-sm hover:shadow-md"
            }`}
          >
            <Plus className="w-4 h-4" /> Add Extra Item
          </button>

          {/* Scan */}
          <button
            onClick={() => setIsScanModalOpen(true)}
            disabled={bagDetails.sealed || isUpdatingStatus || isScanningItem}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              bagDetails.sealed || isUpdatingStatus || isScanningItem
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white shadow-sm shadow-orange-200 hover:shadow-orange-300 hover:shadow-md"
            }`}
          >
            {isScanningItem ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Scanning...
              </>
            ) : (
              <>
                <ScanLine className="w-4 h-4" /> Scan QR Item
              </>
            )}
          </button>

          {/* Seal */}
          <button
            onClick={handleCompletePacking}
            disabled={
              !isPackingComplete || bagDetails.sealed || isUpdatingStatus
            }
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              !isPackingComplete || bagDetails.sealed || isUpdatingStatus
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {isUpdatingStatus ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : bagDetails.sealed ? (
              <>
                <CheckCircle className="w-4 h-4" /> Bag Sealed
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Seal Bag
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Existing Modals (unchanged logic) ── */}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => {
          setIsScanModalOpen(false);
          setScanInput("");
        }}
        scanInput={scanInput}
        setScanInput={setScanInput}
        onSubmit={handleScanItem}
        products={products}
        isScanning={isScanningItem}
      />

      <DeliveryPartnerModal
        isOpen={isDeliveryModalOpen}
        onClose={() => {
          setIsDeliveryModalOpen(false);
          setSelectedPartner(null);
          setSearchPartner("");
        }}
        searchPartner={searchPartner}
        setSearchPartner={setSearchPartner}
        availablePartners={availablePartners}
        selectedPartner={selectedPartner}
        setSelectedPartner={setSelectedPartner}
        onConfirm={handleConfirmAssignment}
        bagDetails={bagDetails}
        orderId={orderData?.orderNumber || id}
        totalItems={totalItems}
        orderValue={orderValue}
      />

      <AddExtraItemModal
        isOpen={isAddExtraItemModalOpen}
        onClose={() => setIsAddExtraItemModalOpen(false)}
        onAddItem={handleAddExtraItem}
        orderId={id}
      />

      {/* ── Delivery Route Modal ── */}
      {isDeliveryAmountModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border-t-4 border-t-emerald-500 my-8">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-500" /> Delivery Route
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Distance & estimated time to destination
                </p>
              </div>
              <button
                onClick={() => {
                  setIsDeliveryAmountModalOpen(false);
                  setDistance(null);
                  setExpectedTime(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Navigation className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                    Distance
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-800">
                  {distance || "Calculating..."}
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    ETA
                  </span>
                </div>
                <p className="text-2xl font-bold text-emerald-800">
                  {expectedTime || "Calculating..."}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setIsDeliveryAmountModalOpen(false);
                  setDistance(null);
                  setExpectedTime(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSealBag}
                disabled={isUpdatingStatus}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isUpdatingStatus
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm"
                }`}
              >
                {isUpdatingStatus ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Sealing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Seal Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Waiting / Countdown Modal ── */}
      {showWaitingAnimation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border-t-4 border-t-[#FF7B1D] text-center card-animate">
            {/* Animated icon */}
            <div className="flex justify-center mb-5">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-orange-50 flex items-center justify-center">
                  <Clock className="w-9 h-9 text-[#FF7B1D]" />
                </div>
                <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-ping opacity-60" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Waiting for Assignment
            </h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Someone will accept the order, or it will be assigned
              automatically.
            </p>

            {/* Countdown pill */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white px-5 py-2.5 rounded-full shadow-sm shadow-orange-200 mb-5">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-bold">{countdown}s</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
              <div
                className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              Redirecting automatically...
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BagQRScan;
