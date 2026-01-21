import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
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

  // Realistic Order Products
  const [orderProducts] = useState([
    {
      id: 1,
      name: "Samsung Galaxy M34 5G (Midnight Blue, 128GB)",
      sku: "MOBGW7FZYHQZQVZZ",
      quantity: 1,
      scanned: 0,
      qrCode: "QR-MOBGW7FZYHQZQVZZ",
      category: "Electronics",
      price: 16999,
      seller: "RetailNet",
    },
    {
      id: 2,
      name: "boAt Airdopes 141 Bluetooth Truly Wireless",
      sku: "ACCGQZ8HHGFQYHZX",
      quantity: 2,
      scanned: 0,
      qrCode: "QR-ACCGQZ8HHGFQYHZX",
      category: "Electronics",
      price: 1299,
      seller: "SuperComNet",
    },
    {
      id: 3,
      name: "Noise ColorFit Pro 4 Alpha Smart Watch",
      sku: "SMWGXB8YNF9KGDZH",
      quantity: 1,
      scanned: 0,
      qrCode: "QR-SMWGXB8YNF9KGDZH",
      category: "Wearables",
      price: 2499,
      seller: "WatchHub India",
    },
    {
      id: 4,
      name: "Pigeon by Stovekraft Favourite Electric Kettle",
      sku: "KTLHZX7VNMKQPWRT",
      quantity: 1,
      scanned: 0,
      qrCode: "QR-KTLHZX7VNMKQPWRT",
      category: "Home & Kitchen",
      price: 549,
      seller: "HomeEssentials",
    },
  ]);

  // Available products for adding extra items
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
    {
      id: 106,
      name: "Battery Pack AAA (4 pcs)",
      sku: "BATTERY006",
      category: "Electronics",
      price: 99,
      seller: "PowerPlus",
      qrCode: "QR-BATTERY006",
    },
    {
      id: 107,
      name: "Sticky Notes Set (Multicolor)",
      sku: "STICKYNOTE007",
      category: "Stationery",
      price: 0,
      seller: "OfficeWorld",
      qrCode: "QR-STICKYNOTE007",
    },
    {
      id: 108,
      name: "Phone Stand Holder",
      sku: "PHONESTAND008",
      category: "Accessories",
      price: 0,
      seller: "TechStore",
      qrCode: "QR-PHONESTAND008",
    },
    {
      id: 109,
      name: "Screen Guard for Mobile",
      sku: "SCREENGUARD009",
      category: "Accessories",
      price: 149,
      seller: "MobileHub",
      qrCode: "QR-SCREENGUARD009",
    },
    {
      id: 110,
      name: "Keychain - Premium Metal",
      sku: "KEYCHAIN010",
      category: "Accessories",
      price: 0,
      seller: "GiftZone",
      qrCode: "QR-KEYCHAIN010",
    },
  ]);

  // Realistic Delivery Partners
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
    {
      id: 5,
      name: "Rahul Joshi",
      phone: "+91 98765 43214",
      vehicle: "Van",
      vehicleNo: "DL 7C BX 7890",
      rating: 4.5,
      deliveries: 1567,
      status: "available",
      currentLocation: "Dwarka Hub",
      avatar: "https://i.pravatar.cc/150?img=16",
    },
  ]);

  const [products, setProducts] = useState(orderProducts);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch order data on mount to get order number
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `http://46.202.164.93/api/checkout/vendor/order/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: headers,
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrderData(data.data);
            console.log("Order data fetched:", data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  // Calculate packing progress
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const scannedItems = products.reduce((sum, p) => sum + p.scanned, 0);
  const packingProgress = ((scannedItems / totalItems) * 100).toFixed(0);
  const isPackingComplete = scannedItems === totalItems;

  // Calculate order value
  const orderValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // API Function to Update Order Status
  const updateOrderStatus = async (status) => {
    setIsUpdatingStatus(true);
    try {
      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Use orderNumber if available, otherwise use id
      const orderId = orderData?.orderNumber || id;

      // Log the request details for debugging
      console.log("Updating order status:", {
        orderId: orderId,
        status: status,
        url: `http://46.202.164.93/api/checkout/vendor/order/${orderId}/status`,
      });

      const response = await fetch(
        `http://46.202.164.93/api/checkout/vendor/order/${orderId}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers: headers,
          body: JSON.stringify({
            status: status,
          }),
        },
      );

      // Log response for debugging
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Failed to update order status: ${response.status}`,
        );
      }

      console.log("Order status updated successfully:", data);
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(`Failed to update order status: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Add Extra Item
  const handleAddExtraItem = (product, quantity) => {
    const newExtraItem = {
      ...product,
      id: nextExtraId,
      quantity: quantity,
      scanned: 0,
      isExtra: true,
    };

    setProducts([...products, newExtraItem]);
    setNextExtraId(nextExtraId + 1);

    const newScan = {
      id: scanHistory.length + 1,
      productName: product.name,
      sku: product.sku,
      time: new Date().toLocaleString(),
      status: "extra_added",
      operator: "Packing Operator #47",
    };
    setScanHistory([newScan, ...scanHistory]);

    alert(
      `✅ Extra Item Added!\n\n${product.name}\nQuantity: ${quantity}\n\nRemember to scan these items before sealing the bag.`,
    );
    setIsAddExtraItemModalOpen(false);
  };

  // Handle Remove Extra Item
  const handleRemoveExtraItem = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (
      confirm(
        `🗑️ Remove extra item?\n\n${product.name}\n\nThis action cannot be undone.`,
      )
    ) {
      setProducts(products.filter((p) => p.id !== productId));
      alert(`✅ Extra item removed successfully!`);
    }
  };

  // Handle Item Scan
  const handleScanItem = () => {
    const scannedCode = scanInput.trim().toUpperCase();

    if (!scannedCode) {
      alert("⚠️ Please enter or scan a QR code!");
      return;
    }

    const productIndex = products.findIndex(
      (p) =>
        p.qrCode.toUpperCase() === scannedCode ||
        p.sku.toUpperCase() === scannedCode,
    );

    if (productIndex === -1) {
      alert("❌ Invalid QR Code! This item is not in this bag.");
      setScanInput("");
      return;
    }

    const product = products[productIndex];

    if (product.scanned >= product.quantity) {
      alert(
        `⚠️ ${product.name}\nAlready fully scanned! (${product.scanned}/${product.quantity})`,
      );
      setScanInput("");
      return;
    }

    const updatedProducts = [...products];
    updatedProducts[productIndex].scanned += 1;
    setProducts(updatedProducts);

    const newScan = {
      id: scanHistory.length + 1,
      productName: product.name,
      sku: product.sku,
      time: new Date().toLocaleString(),
      status: "scanned",
      operator: "Packing Operator #47",
    };
    setScanHistory([newScan, ...scanHistory]);

    if (scannedItems === 0) {
      setBagDetails({
        ...bagDetails,
        status: "Packing in Progress",
        startTime: new Date().toLocaleString(),
      });
    }

    alert(
      `✅ Item Scanned Successfully!\n${product.name}\nScanned: ${
        product.scanned + 1
      }/${product.quantity}${product.isExtra ? " (EXTRA ITEM)" : ""}`,
    );
    setScanInput("");
    setIsScanModalOpen(false);
  };

  // Handle Manual Increment/Decrement
  const handleManualUpdate = (productId, action) => {
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        if (action === "increment" && p.scanned < p.quantity) {
          const newScanned = p.scanned + 1;
          const newScan = {
            id: scanHistory.length + 1,
            productName: p.name,
            sku: p.sku,
            time: new Date().toLocaleString(),
            status: "manual",
            operator: "Packing Operator #47",
          };
          setScanHistory([newScan, ...scanHistory]);
          return { ...p, scanned: newScanned };
        } else if (action === "decrement" && p.scanned > 0) {
          return { ...p, scanned: p.scanned - 1 };
        }
      }
      return p;
    });
    setProducts(updatedProducts);
  };

  // Handle Complete Packing & Seal Bag with API Integration
  const handleCompletePacking = async () => {
    if (!isPackingComplete) {
      alert("⚠️ Please scan all items before sealing the bag!");
      return;
    }

    const bagNumber = `BAG${Date.now().toString().slice(-8)}`;
    const qrCode = `FKMP${Date.now().toString().slice(-10)}`;

    // Update order status to "ready" via API
    const result = await updateOrderStatus("ready");

    if (!result.success) {
      alert(
        `❌ Failed to update order status!\n\nError: ${result.error}\n\nPlease try again.`,
      );
      return;
    }

    setBagDetails({
      ...bagDetails,
      bagNo: bagNumber,
      bagQRCode: qrCode,
      status: "Ready for Pickup",
      sealed: true,
      completeTime: new Date().toLocaleString(),
    });

    const extraItemsCount = products.filter((p) => p.isExtra).length;
    const extraItemsText =
      extraItemsCount > 0
        ? `\n\n📦 Includes ${extraItemsCount} extra item(s)`
        : "";

    alert(
      `✅ Bag Packed & Sealed Successfully!\n\nBag Number: ${bagNumber}\nQR Code: ${qrCode}${extraItemsText}\n\n🔄 Order status updated to "ready" in the system.\n\nBag is now ready for delivery partner assignment.`,
    );
  };

  // Handle Reset Packing
  const handleResetPacking = () => {
    if (confirm("⚠️ Are you sure you want to reset all packing progress?")) {
      setProducts(orderProducts);
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
      alert("🔄 Packing reset successfully!");
    }
  };

  // Handle Assign Delivery Partner
  const handleAssignPartner = () => {
    if (!bagDetails.sealed) {
      alert("⚠️ Please complete and seal the bag first!");
      return;
    }
    setIsDeliveryModalOpen(true);
  };

  // Handle Confirm Assignment
  const handleConfirmAssignment = () => {
    if (!selectedPartner) {
      alert("⚠️ Please select a delivery partner!");
      return;
    }

    setAssignmentStatus("assigned");
    setIsDeliveryModalOpen(false);

    alert(
      `✅ Delivery Partner Assigned!\n\n` +
        `Partner: ${selectedPartner.name}\n` +
        `Phone: ${selectedPartner.phone}\n` +
        `Vehicle: ${selectedPartner.vehicle} (${selectedPartner.vehicleNo})\n` +
        `Bag: ${bagDetails.bagNo}\n\n` +
        `The delivery partner will arrive at the hub shortly.`,
    );
  };

  // Handle Mark as Picked Up
  const handleMarkPickedUp = () => {
    if (assignmentStatus !== "assigned") {
      alert("⚠️ Please assign a delivery partner first!");
      return;
    }

    if (
      confirm(`🚚 Confirm that ${selectedPartner.name} has picked up the bag?`)
    ) {
      setAssignmentStatus("picked_up");
      alert(
        `✅ Bag Picked Up!\n\n` +
          `Bag ${bagDetails.bagNo} has been picked up by ${selectedPartner.name}.\n` +
          `The package is now out for delivery.`,
      );
    }
  };

  // Filter available partners
  const availablePartners = deliveryPartners.filter(
    (p) =>
      p.status === "available" &&
      p.name.toLowerCase().includes(searchPartner.toLowerCase()),
  );

  const handleGoBack = () => {
    navigate(`/order/${id}`);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen p-6 animate-pulse bg-gray-50">
        <div className="bg-gradient-to-r from-orange-200 to-red-200 rounded-lg h-40 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const extraItemsCount = products.filter((p) => p.isExtra).length;

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen ml-4 p-2 bg-gray-0">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-orange-500">
          <button
            onClick={handleGoBack}
            className="mb-4 flex items-center gap-2 text-gray-700 hover:text-orange-500 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Order Details
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bag Packing & QR Scanning
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                Order ID:{" "}
                <span className="text-orange-500 font-bold">
                  {id || "OD8038403974"}
                </span>
                <span className="mx-2">•</span>
                <span className="text-gray-500">
                  ₹{orderValue.toLocaleString("en-IN")}
                </span>
                {extraItemsCount > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-purple-600 font-bold">
                      +{extraItemsCount} Extra Item
                      {extraItemsCount > 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Package className="text-orange-500" size={32} />}
            label="Total Items"
            value={totalItems}
            color="orange"
          />
          <StatCard
            icon={<CheckCircle className="text-green-500" size={32} />}
            label="Scanned"
            value={scannedItems}
            color="green"
          />
          <StatCard
            icon={<Settings className="text-blue-500" size={32} />}
            label="Progress"
            value={`${packingProgress}%`}
            color="blue"
          />
          <StatCard
            icon={
              bagDetails.sealed ? (
                <CheckCircle className="text-purple-500" size={32} />
              ) : (
                <Clock className="text-purple-500" size={32} />
              )
            }
            label="Status"
            value={bagDetails.status}
            color="purple"
            small
          />
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 text-lg">
              Packing Progress
            </h3>
            <span className="font-bold text-orange-500">
              {scannedItems}/{totalItems} Items
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-500 flex items-center justify-center"
              style={{ width: `${packingProgress}%` }}
            >
              {packingProgress > 10 && (
                <span className="text-white font-bold text-sm">
                  {packingProgress}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <TabButton
              active={activeTab === "packing"}
              onClick={() => setActiveTab("packing")}
              icon={<Package size={20} />}
              label="Item Packing"
            />
            <TabButton
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              icon={<History size={20} />}
              label="Scan History"
            />
            <TabButton
              active={activeTab === "bag"}
              onClick={() => setActiveTab("bag")}
              icon={<QrCode size={20} />}
              label="Bag Details"
            />
            <TabButton
              active={activeTab === "delivery"}
              onClick={() => setActiveTab("delivery")}
              icon={<Truck size={20} />}
              label="Delivery Partner"
            />
          </div>

          <div className="p-6">
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
                id={id}
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
                id={id}
                totalItems={totalItems}
                orderValue={orderValue}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button
            onClick={() => setIsAddExtraItemModalOpen(true)}
            disabled={bagDetails.sealed || isUpdatingStatus}
            className={`${
              bagDetails.sealed || isUpdatingStatus
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
          >
            <Plus size={24} />
            Add Extra
          </button>
          <button
            onClick={() => setIsScanModalOpen(true)}
            disabled={bagDetails.sealed || isUpdatingStatus}
            className={`${
              bagDetails.sealed || isUpdatingStatus
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
          >
            <QrCode size={24} />
            Scan Item
          </button>
          <button
            onClick={handleCompletePacking}
            disabled={
              !isPackingComplete || bagDetails.sealed || isUpdatingStatus
            }
            className={`${
              !isPackingComplete || bagDetails.sealed || isUpdatingStatus
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
          >
            {isUpdatingStatus ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle size={24} />
                {bagDetails.sealed ? "Bag Sealed" : "Seal Bag"}
              </>
            )}
          </button>
          <button
            onClick={handleAssignPartner}
            disabled={!bagDetails.sealed || assignmentStatus !== "pending"}
            className={`${
              !bagDetails.sealed || assignmentStatus !== "pending"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
          >
            <Truck size={24} />
            {assignmentStatus === "pending"
              ? "Assign Partner"
              : "Partner Assigned"}
          </button>
          <button
            onClick={handleResetPacking}
            disabled={isUpdatingStatus}
            className={`${
              isUpdatingStatus
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
          >
            <RefreshCw size={24} />
            Reset
          </button>
        </div>

        {/* Modals */}
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
          orderId={id || "OD8038403974"}
          totalItems={totalItems}
          orderValue={orderValue}
        />

        <AddExtraItemModal
          isOpen={isAddExtraItemModalOpen}
          onClose={() => setIsAddExtraItemModalOpen(false)}
          onAddItem={handleAddExtraItem}
          availableProducts={availableProducts}
        />
      </div>
    </DashboardLayout>
  );
};

export default BagQRScan;
