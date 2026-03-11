// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import DashboardLayout from "../../components/DashboardLayout";
// import { BASE_URL } from "../../api/api";
// import {
//   Package,
//   QrCode,
//   History,
//   Truck,
//   CheckCircle,
//   Settings,
//   Clock,
//   RefreshCw,
//   ArrowLeft,
//   Plus,
// } from "lucide-react";
// import {
//   StatCard,
//   TabButton,
//   PackingTab,
//   HistoryTab,
//   BagDetailsTab,
//   DeliveryTab,
//   ScanModal,
//   DeliveryPartnerModal,
//   AddExtraItemModal,
// } from "../../pages/OrderManagement/BagQRScan";

// const BagQRScan = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("packing");
//   const [loading, setLoading] = useState(true);
//   const [orderData, setOrderData] = useState(null);
//   const [isScanModalOpen, setIsScanModalOpen] = useState(false);
//   const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
//   const [isAddExtraItemModalOpen, setIsAddExtraItemModalOpen] = useState(false);
//   const [scanInput, setScanInput] = useState("");
//   const [searchPartner, setSearchPartner] = useState("");
//   const [selectedPartner, setSelectedPartner] = useState(null);
//   const [assignmentStatus, setAssignmentStatus] = useState("pending");
//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

//   // Realistic Order Products
//   const [orderProducts] = useState([
//     {
//       id: 1,
//       name: "Samsung Galaxy M34 5G (Midnight Blue, 128GB)",
//       sku: "MOBGW7FZYHQZQVZZ",
//       quantity: 1,
//       scanned: 0,
//       qrCode: "QR-MOBGW7FZYHQZQVZZ",
//       category: "Electronics",
//       price: 16999,
//       seller: "RetailNet",
//     },
//     {
//       id: 2,
//       name: "boAt Airdopes 141 Bluetooth Truly Wireless",
//       sku: "ACCGQZ8HHGFQYHZX",
//       quantity: 2,
//       scanned: 0,
//       qrCode: "QR-ACCGQZ8HHGFQYHZX",
//       category: "Electronics",
//       price: 1299,
//       seller: "SuperComNet",
//     },
//     {
//       id: 3,
//       name: "Noise ColorFit Pro 4 Alpha Smart Watch",
//       sku: "SMWGXB8YNF9KGDZH",
//       quantity: 1,
//       scanned: 0,
//       qrCode: "QR-SMWGXB8YNF9KGDZH",
//       category: "Wearables",
//       price: 2499,
//       seller: "WatchHub India",
//     },
//     {
//       id: 4,
//       name: "Pigeon by Stovekraft Favourite Electric Kettle",
//       sku: "KTLHZX7VNMKQPWRT",
//       quantity: 1,
//       scanned: 0,
//       qrCode: "QR-KTLHZX7VNMKQPWRT",
//       category: "Home & Kitchen",
//       price: 549,
//       seller: "HomeEssentials",
//     },
//   ]);

//   // Available products for adding extra items
//   const [availableProducts] = useState([
//     {
//       id: 101,
//       name: "Complimentary USB Cable (Type-C)",
//       sku: "FREECABLE001",
//       category: "Accessories",
//       price: 0,
//       seller: "RetailNet",
//       qrCode: "QR-FREECABLE001",
//     },
//     {
//       id: 102,
//       name: "Free Sample - Face Cream 50ml",
//       sku: "FREESAMPLE002",
//       category: "Beauty & Personal Care",
//       price: 0,
//       seller: "BeautyHub",
//       qrCode: "QR-FREESAMPLE002",
//     },
//     {
//       id: 103,
//       name: "Promotional Pen Set (Pack of 3)",
//       sku: "PROMOPEN003",
//       category: "Stationery",
//       price: 0,
//       seller: "OfficeWorld",
//       qrCode: "QR-PROMOPEN003",
//     },
//     {
//       id: 104,
//       name: "Gift Card - ₹100",
//       sku: "GIFTCARD100",
//       category: "Gift Cards",
//       price: 100,
//       seller: "RetailNet",
//       qrCode: "QR-GIFTCARD100",
//     },
//     {
//       id: 105,
//       name: "Microfiber Cleaning Cloth",
//       sku: "FREECLOTH005",
//       category: "Accessories",
//       price: 0,
//       seller: "TechStore",
//       qrCode: "QR-FREECLOTH005",
//     },
//     {
//       id: 106,
//       name: "Battery Pack AAA (4 pcs)",
//       sku: "BATTERY006",
//       category: "Electronics",
//       price: 99,
//       seller: "PowerPlus",
//       qrCode: "QR-BATTERY006",
//     },
//     {
//       id: 107,
//       name: "Sticky Notes Set (Multicolor)",
//       sku: "STICKYNOTE007",
//       category: "Stationery",
//       price: 0,
//       seller: "OfficeWorld",
//       qrCode: "QR-STICKYNOTE007",
//     },
//     {
//       id: 108,
//       name: "Phone Stand Holder",
//       sku: "PHONESTAND008",
//       category: "Accessories",
//       price: 0,
//       seller: "TechStore",
//       qrCode: "QR-PHONESTAND008",
//     },
//     {
//       id: 109,
//       name: "Screen Guard for Mobile",
//       sku: "SCREENGUARD009",
//       category: "Accessories",
//       price: 149,
//       seller: "MobileHub",
//       qrCode: "QR-SCREENGUARD009",
//     },
//     {
//       id: 110,
//       name: "Keychain - Premium Metal",
//       sku: "KEYCHAIN010",
//       category: "Accessories",
//       price: 0,
//       seller: "GiftZone",
//       qrCode: "QR-KEYCHAIN010",
//     },
//   ]);

//   // Realistic Delivery Partners
//   const [deliveryPartners] = useState([
//     {
//       id: 1,
//       name: "Rajesh Kumar",
//       phone: "+91 98765 43210",
//       vehicle: "Bike",
//       vehicleNo: "DL 8C AX 1234",
//       rating: 4.8,
//       deliveries: 2847,
//       status: "available",
//       currentLocation: "Nehru Place Hub",
//       avatar: "https://i.pravatar.cc/150?img=12",
//     },
//     {
//       id: 2,
//       name: "Amit Sharma",
//       phone: "+91 98765 43211",
//       vehicle: "Bike",
//       vehicleNo: "DL 3C AB 5678",
//       rating: 4.6,
//       deliveries: 1923,
//       status: "available",
//       currentLocation: "Connaught Place Hub",
//       avatar: "https://i.pravatar.cc/150?img=13",
//     },
//     {
//       id: 3,
//       name: "Suresh Verma",
//       phone: "+91 98765 43212",
//       vehicle: "Auto",
//       vehicleNo: "DL 1L AC 9012",
//       rating: 4.9,
//       deliveries: 3456,
//       status: "on_delivery",
//       currentLocation: "Out for delivery",
//       avatar: "https://i.pravatar.cc/150?img=14",
//     },
//     {
//       id: 4,
//       name: "Vikram Singh",
//       phone: "+91 98765 43213",
//       vehicle: "Bike",
//       vehicleNo: "DL 5S AZ 3456",
//       rating: 4.7,
//       deliveries: 2134,
//       status: "available",
//       currentLocation: "Saket Hub",
//       avatar: "https://i.pravatar.cc/150?img=15",
//     },
//     {
//       id: 5,
//       name: "Rahul Joshi",
//       phone: "+91 98765 43214",
//       vehicle: "Van",
//       vehicleNo: "DL 7C BX 7890",
//       rating: 4.5,
//       deliveries: 1567,
//       status: "available",
//       currentLocation: "Dwarka Hub",
//       avatar: "https://i.pravatar.cc/150?img=16",
//     },
//   ]);

//   const [products, setProducts] = useState(orderProducts);
//   const [bagDetails, setBagDetails] = useState({
//     bagNo: "",
//     status: "Not Started",
//     sealed: false,
//     bagQRCode: "",
//     startTime: null,
//     completeTime: null,
//     weight: "0.5 kg",
//     dimensions: "30x25x15 cm",
//   });

//   const [scanHistory, setScanHistory] = useState([]);
//   const [nextExtraId, setNextExtraId] = useState(1000);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // Fetch order data on mount to get order number
//   useEffect(() => {
//     const fetchOrderData = async () => {
//       try {
//         const token =
//           localStorage.getItem("token") || localStorage.getItem("authToken");

//         const headers = {};
//         if (token) {
//           headers["Authorization"] = `Bearer ${token}`;
//         }

//         const response = await fetch(
//           `${BASE_URL}/api/checkout/vendor/order/${id}`,
//           {
//             method: "GET",
//             credentials: "include",
//             headers: headers,
//           },
//         );

//         if (response.ok) {
//           const data = await response.json();
//           if (data.success) {
//             setOrderData(data.data);
//             console.log("Order data fetched:", data.data);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching order data:", error);
//       }
//     };

//     if (id) {
//       fetchOrderData();
//     }
//   }, [id]);

//   // Calculate packing progress
//   const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
//   const scannedItems = products.reduce((sum, p) => sum + p.scanned, 0);
//   const packingProgress = ((scannedItems / totalItems) * 100).toFixed(0);
//   const isPackingComplete = scannedItems === totalItems;

//   // Calculate order value
//   const orderValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

//   // API Function to Update Order Status
//   const updateOrderStatus = async (status) => {
//     setIsUpdatingStatus(true);
//     try {
//       // Get token from localStorage
//       const token =
//         localStorage.getItem("token") || localStorage.getItem("authToken");

//       const headers = {
//         "Content-Type": "application/json",
//       };

//       if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//       }

//       // Use orderNumber if available, otherwise use id
//       const orderId = orderData?.orderNumber || id;

//       // Log the request details for debugging
//       console.log("Updating order status:", {
//         orderId: orderId,
//         status: status,
//         url: `${BASE_URL}/api/checkout/vendor/order/${orderId}/status`,
//       });

//       const response = await fetch(
//         `${BASE_URL}/api/checkout/vendor/order/${orderId}/status`,
//         {
//           method: "PUT",
//           credentials: "include",
//           headers: headers,
//           body: JSON.stringify({
//             status: status,
//           }),
//         },
//       );

//       // Log response for debugging
//       console.log("Response status:", response.status);

//       const data = await response.json();
//       console.log("Response data:", data);

//       if (!response.ok || !data.success) {
//         throw new Error(
//           data.message || `Failed to update order status: ${response.status}`,
//         );
//       }

//       console.log("Order status updated successfully:", data);
//       return { success: true, data: data.data };
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       alert(`Failed to update order status: ${error.message}`);
//       return { success: false, error: error.message };
//     } finally {
//       setIsUpdatingStatus(false);
//     }
//   };

//   // Handle Add Extra Item
//   const handleAddExtraItem = (product, quantity) => {
//     const newExtraItem = {
//       ...product,
//       id: nextExtraId,
//       quantity: quantity,
//       scanned: 0,
//       isExtra: true,
//     };

//     setProducts([...products, newExtraItem]);
//     setNextExtraId(nextExtraId + 1);

//     const newScan = {
//       id: scanHistory.length + 1,
//       productName: product.name,
//       sku: product.sku,
//       time: new Date().toLocaleString(),
//       status: "extra_added",
//       operator: "Packing Operator #47",
//     };
//     setScanHistory([newScan, ...scanHistory]);

//     alert(
//       `✅ Extra Item Added!\n\n${product.name}\nQuantity: ${quantity}\n\nRemember to scan these items before sealing the bag.`,
//     );
//     setIsAddExtraItemModalOpen(false);
//   };

//   // Handle Remove Extra Item
//   const handleRemoveExtraItem = (productId) => {
//     const product = products.find((p) => p.id === productId);
//     if (
//       confirm(
//         `🗑️ Remove extra item?\n\n${product.name}\n\nThis action cannot be undone.`,
//       )
//     ) {
//       setProducts(products.filter((p) => p.id !== productId));
//       alert(`✅ Extra item removed successfully!`);
//     }
//   };

//   // Handle Item Scan
//   const handleScanItem = () => {
//     const scannedCode = scanInput.trim().toUpperCase();

//     if (!scannedCode) {
//       alert("⚠️ Please enter or scan a QR code!");
//       return;
//     }

//     const productIndex = products.findIndex(
//       (p) =>
//         p.qrCode.toUpperCase() === scannedCode ||
//         p.sku.toUpperCase() === scannedCode,
//     );

//     if (productIndex === -1) {
//       alert("❌ Invalid QR Code! This item is not in this bag.");
//       setScanInput("");
//       return;
//     }

//     const product = products[productIndex];

//     if (product.scanned >= product.quantity) {
//       alert(
//         `⚠️ ${product.name}\nAlready fully scanned! (${product.scanned}/${product.quantity})`,
//       );
//       setScanInput("");
//       return;
//     }

//     const updatedProducts = [...products];
//     updatedProducts[productIndex].scanned += 1;
//     setProducts(updatedProducts);

//     const newScan = {
//       id: scanHistory.length + 1,
//       productName: product.name,
//       sku: product.sku,
//       time: new Date().toLocaleString(),
//       status: "scanned",
//       operator: "Packing Operator #47",
//     };
//     setScanHistory([newScan, ...scanHistory]);

//     if (scannedItems === 0) {
//       setBagDetails({
//         ...bagDetails,
//         status: "Packing in Progress",
//         startTime: new Date().toLocaleString(),
//       });
//     }

//     alert(
//       `✅ Item Scanned Successfully!\n${product.name}\nScanned: ${
//         product.scanned + 1
//       }/${product.quantity}${product.isExtra ? " (EXTRA ITEM)" : ""}`,
//     );
//     setScanInput("");
//     setIsScanModalOpen(false);
//   };

//   // Handle Manual Increment/Decrement
//   const handleManualUpdate = (productId, action) => {
//     const updatedProducts = products.map((p) => {
//       if (p.id === productId) {
//         if (action === "increment" && p.scanned < p.quantity) {
//           const newScanned = p.scanned + 1;
//           const newScan = {
//             id: scanHistory.length + 1,
//             productName: p.name,
//             sku: p.sku,
//             time: new Date().toLocaleString(),
//             status: "manual",
//             operator: "Packing Operator #47",
//           };
//           setScanHistory([newScan, ...scanHistory]);
//           return { ...p, scanned: newScanned };
//         } else if (action === "decrement" && p.scanned > 0) {
//           return { ...p, scanned: p.scanned - 1 };
//         }
//       }
//       return p;
//     });
//     setProducts(updatedProducts);
//   };

//   // Handle Complete Packing & Seal Bag with API Integration
//   const handleCompletePacking = async () => {
//     if (!isPackingComplete) {
//       alert("⚠️ Please scan all items before sealing the bag!");
//       return;
//     }

//     const bagNumber = `BAG${Date.now().toString().slice(-8)}`;
//     const qrCode = `FKMP${Date.now().toString().slice(-10)}`;

//     // Update order status to "ready" via API
//     const result = await updateOrderStatus("ready");

//     if (!result.success) {
//       alert(
//         `❌ Failed to update order status!\n\nError: ${result.error}\n\nPlease try again.`,
//       );
//       return;
//     }

//     setBagDetails({
//       ...bagDetails,
//       bagNo: bagNumber,
//       bagQRCode: qrCode,
//       status: "Ready for Pickup",
//       sealed: true,
//       completeTime: new Date().toLocaleString(),
//     });

//     const extraItemsCount = products.filter((p) => p.isExtra).length;
//     const extraItemsText =
//       extraItemsCount > 0
//         ? `\n\n📦 Includes ${extraItemsCount} extra item(s)`
//         : "";

//     alert(
//       `✅ Bag Packed & Sealed Successfully!\n\nBag Number: ${bagNumber}\nQR Code: ${qrCode}${extraItemsText}\n\n🔄 Order status updated to "ready" in the system.\n\nBag is now ready for delivery partner assignment.`,
//     );
//   };

//   // Handle Reset Packing
//   const handleResetPacking = () => {
//     if (confirm("⚠️ Are you sure you want to reset all packing progress?")) {
//       setProducts(orderProducts);
//       setBagDetails({
//         bagNo: "",
//         status: "Not Started",
//         sealed: false,
//         bagQRCode: "",
//         startTime: null,
//         completeTime: null,
//         weight: "0.5 kg",
//         dimensions: "30x25x15 cm",
//       });
//       setScanHistory([]);
//       setSelectedPartner(null);
//       setAssignmentStatus("pending");
//       setNextExtraId(1000);
//       alert("🔄 Packing reset successfully!");
//     }
//   };

//   // Handle Assign Delivery Partner
//   const handleAssignPartner = () => {
//     if (!bagDetails.sealed) {
//       alert("⚠️ Please complete and seal the bag first!");
//       return;
//     }
//     setIsDeliveryModalOpen(true);
//   };

//   // Handle Confirm Assignment
//   const handleConfirmAssignment = () => {
//     if (!selectedPartner) {
//       alert("⚠️ Please select a delivery partner!");
//       return;
//     }

//     setAssignmentStatus("assigned");
//     setIsDeliveryModalOpen(false);

//     alert(
//       `✅ Delivery Partner Assigned!\n\n` +
//         `Partner: ${selectedPartner.name}\n` +
//         `Phone: ${selectedPartner.phone}\n` +
//         `Vehicle: ${selectedPartner.vehicle} (${selectedPartner.vehicleNo})\n` +
//         `Bag: ${bagDetails.bagNo}\n\n` +
//         `The delivery partner will arrive at the hub shortly.`,
//     );
//   };

//   // Handle Mark as Picked Up
//   const handleMarkPickedUp = () => {
//     if (assignmentStatus !== "assigned") {
//       alert("⚠️ Please assign a delivery partner first!");
//       return;
//     }

//     if (
//       confirm(`🚚 Confirm that ${selectedPartner.name} has picked up the bag?`)
//     ) {
//       setAssignmentStatus("picked_up");
//       alert(
//         `✅ Bag Picked Up!\n\n` +
//           `Bag ${bagDetails.bagNo} has been picked up by ${selectedPartner.name}.\n` +
//           `The package is now out for delivery.`,
//       );
//     }
//   };

//   // Filter available partners
//   const availablePartners = deliveryPartners.filter(
//     (p) =>
//       p.status === "available" &&
//       p.name.toLowerCase().includes(searchPartner.toLowerCase()),
//   );

//   const handleGoBack = () => {
//     navigate(`/order/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="w-full min-h-screen p-6 animate-pulse bg-gray-50">
//         <div className="bg-gradient-to-r from-orange-200 to-red-200 rounded-lg h-40 mb-6"></div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const extraItemsCount = products.filter((p) => p.isExtra).length;

//   return (
//     <DashboardLayout>
//       <div className="w-full min-h-screen ml-4 p-2 bg-gray-0">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-orange-500">
//           <button
//             onClick={handleGoBack}
//             className="mb-4 flex items-center gap-2 text-gray-700 hover:text-orange-500 font-semibold transition-colors"
//           >
//             <ArrowLeft size={20} />
//             Back to Order Details
//           </button>
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
//               <Package className="text-white" size={32} />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Bag Packing & QR Scanning
//               </h1>
//               <p className="text-gray-600 mt-1 font-medium">
//                 Order ID:{" "}
//                 <span className="text-orange-500 font-bold">
//                   {id || "OD8038403974"}
//                 </span>
//                 <span className="mx-2">•</span>
//                 <span className="text-gray-500">
//                   ₹{orderValue.toLocaleString("en-IN")}
//                 </span>
//                 {extraItemsCount > 0 && (
//                   <>
//                     <span className="mx-2">•</span>
//                     <span className="text-purple-600 font-bold">
//                       +{extraItemsCount} Extra Item
//                       {extraItemsCount > 1 ? "s" : ""}
//                     </span>
//                   </>
//                 )}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Progress Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <StatCard
//             icon={<Package className="text-orange-500" size={32} />}
//             label="Total Items"
//             value={totalItems}
//             color="orange"
//           />
//           <StatCard
//             icon={<CheckCircle className="text-green-500" size={32} />}
//             label="Scanned"
//             value={scannedItems}
//             color="green"
//           />
//           <StatCard
//             icon={<Settings className="text-blue-500" size={32} />}
//             label="Progress"
//             value={`${packingProgress}%`}
//             color="blue"
//           />
//           <StatCard
//             icon={
//               bagDetails.sealed ? (
//                 <CheckCircle className="text-purple-500" size={32} />
//               ) : (
//                 <Clock className="text-purple-500" size={32} />
//               )
//             }
//             label="Status"
//             value={bagDetails.status}
//             color="purple"
//             small
//           />
//         </div>

//         {/* Progress Bar */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <div className="flex justify-between items-center mb-3">
//             <h3 className="font-bold text-gray-900 text-lg">
//               Packing Progress
//             </h3>
//             <span className="font-bold text-orange-500">
//               {scannedItems}/{totalItems} Items
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
//             <div
//               className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-500 flex items-center justify-center"
//               style={{ width: `${packingProgress}%` }}
//             >
//               {packingProgress > 10 && (
//                 <span className="text-white font-bold text-sm">
//                   {packingProgress}%
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-md mb-6">
//           <div className="flex border-b overflow-x-auto">
//             <TabButton
//               active={activeTab === "packing"}
//               onClick={() => setActiveTab("packing")}
//               icon={<Package size={20} />}
//               label="Item Packing"
//             />
//             <TabButton
//               active={activeTab === "history"}
//               onClick={() => setActiveTab("history")}
//               icon={<History size={20} />}
//               label="Scan History"
//             />
//             <TabButton
//               active={activeTab === "bag"}
//               onClick={() => setActiveTab("bag")}
//               icon={<QrCode size={20} />}
//               label="Bag Details"
//             />
//             <TabButton
//               active={activeTab === "delivery"}
//               onClick={() => setActiveTab("delivery")}
//               icon={<Truck size={20} />}
//               label="Delivery Partner"
//             />
//           </div>

//           <div className="p-6">
//             {activeTab === "packing" && (
//               <PackingTab
//                 products={products}
//                 bagDetails={bagDetails}
//                 setIsScanModalOpen={setIsScanModalOpen}
//                 handleManualUpdate={handleManualUpdate}
//                 handleRemoveExtraItem={handleRemoveExtraItem}
//                 setIsAddExtraItemModalOpen={setIsAddExtraItemModalOpen}
//               />
//             )}

//             {activeTab === "history" && (
//               <HistoryTab scanHistory={scanHistory} />
//             )}

//             {activeTab === "bag" && (
//               <BagDetailsTab
//                 bagDetails={bagDetails}
//                 id={id}
//                 orderValue={orderValue}
//                 totalItems={totalItems}
//               />
//             )}

//             {activeTab === "delivery" && (
//               <DeliveryTab
//                 assignmentStatus={assignmentStatus}
//                 selectedPartner={selectedPartner}
//                 bagDetails={bagDetails}
//                 handleAssignPartner={handleAssignPartner}
//                 handleMarkPickedUp={handleMarkPickedUp}
//                 id={id}
//                 totalItems={totalItems}
//                 orderValue={orderValue}
//               />
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <button
//             onClick={() => navigate(`/orders/${id}/add-extra-items`)}
//             disabled={bagDetails.sealed || isUpdatingStatus}
//             className={`${
//               bagDetails.sealed || isUpdatingStatus
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-purple-500 hover:bg-purple-600"
//             } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
//           >
//             <Plus size={24} />
//             Add Extra
//           </button>
//           <button
//             onClick={() => setIsScanModalOpen(true)}
//             disabled={bagDetails.sealed || isUpdatingStatus}
//             className={`${
//               bagDetails.sealed || isUpdatingStatus
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-orange-500 hover:bg-orange-600"
//             } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
//           >
//             <QrCode size={24} />
//             Scan Item
//           </button>
//           <button
//             onClick={handleCompletePacking}
//             disabled={
//               !isPackingComplete || bagDetails.sealed || isUpdatingStatus
//             }
//             className={`${
//               !isPackingComplete || bagDetails.sealed || isUpdatingStatus
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
//           >
//             {isUpdatingStatus ? (
//               <>
//                 <RefreshCw size={24} className="animate-spin" />
//                 Updating...
//               </>
//             ) : (
//               <>
//                 <CheckCircle size={24} />
//                 {bagDetails.sealed ? "Bag Sealed" : "Seal Bag"}
//               </>
//             )}
//           </button>
//           <button
//             onClick={handleAssignPartner}
//             disabled={!bagDetails.sealed || assignmentStatus !== "pending"}
//             className={`${
//               !bagDetails.sealed || assignmentStatus !== "pending"
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
//           >
//             <Truck size={24} />
//             {assignmentStatus === "pending"
//               ? "Assign Partner"
//               : "Partner Assigned"}
//           </button>
//           <button
//             onClick={handleResetPacking}
//             disabled={isUpdatingStatus}
//             className={`${
//               isUpdatingStatus
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-red-600 hover:bg-red-700"
//             } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
//           >
//             <RefreshCw size={24} />
//             Reset
//           </button>
//         </div>

//         {/* Modals */}
//         <ScanModal
//           isOpen={isScanModalOpen}
//           onClose={() => {
//             setIsScanModalOpen(false);
//             setScanInput("");
//           }}
//           scanInput={scanInput}
//           setScanInput={setScanInput}
//           onSubmit={handleScanItem}
//           products={products}
//         />

//         <DeliveryPartnerModal
//           isOpen={isDeliveryModalOpen}
//           onClose={() => {
//             setIsDeliveryModalOpen(false);
//             setSelectedPartner(null);
//             setSearchPartner("");
//           }}
//           searchPartner={searchPartner}
//           setSearchPartner={setSearchPartner}
//           availablePartners={availablePartners}
//           selectedPartner={selectedPartner}
//           setSelectedPartner={setSelectedPartner}
//           onConfirm={handleConfirmAssignment}
//           bagDetails={bagDetails}
//           orderId={id || "OD8038403974"}
//           totalItems={totalItems}
//           orderValue={orderValue}
//         />

//         <AddExtraItemModal
//           isOpen={isAddExtraItemModalOpen}
//           onClose={() => setIsAddExtraItemModalOpen(false)}
//           onAddItem={handleAddExtraItem}
//           availableProducts={availableProducts}
//         />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default BagQRScan;
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
  const [isScanningItem, setIsScanningItem] = useState(false);
  const [isDeliveryAmountModalOpen, setIsDeliveryAmountModalOpen] = useState(false);
  const [distance, setDistance] = useState(null);
  const [expectedTime, setExpectedTime] = useState(null);
  const [showWaitingAnimation, setShowWaitingAnimation] = useState(false);
  const [countdown, setCountdown] = useState(5); // 5 seconds
  const countdownIntervalRef = useRef(null);
  const redirectTimeoutRef = useRef(null);

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

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch order data and items on mount
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();

        // Fetch order details using the ID from URL params
        const orderResponse = await fetch(
          `${BASE_URL}/api/checkout/vendor/order/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: headers,
          },
        );

        if (!orderResponse.ok) {
          throw new Error(`Failed to fetch order: ${orderResponse.status}`);
        }

        const orderData = await orderResponse.json();
        if (!orderData.success || !orderData.data) {
          throw new Error("Invalid order data received");
        }

        setOrderData(orderData.data);

        // Transform items from order data
        if (orderData.data.items && Array.isArray(orderData.data.items)) {
          const transformedProducts = orderData.data.items.map(
            (item, index) => ({
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
            }),
          );
          setProducts(transformedProducts);
        }
      } catch (error) {
        alert(`Failed to load order data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  // Calculate packing progress
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const scannedItems = products.reduce((sum, p) => sum + p.scanned, 0);
  const packingProgress =
    totalItems > 0 ? ((scannedItems / totalItems) * 100).toFixed(0) : 0;
  const isPackingComplete = totalItems > 0 && scannedItems === totalItems;

  // Calculate order value
  const orderValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // API Function to scan QR code (check if product exists)
  const scanQRCode = async (productId) => {
    try {
      const headers = getAuthHeaders();

      const response = await fetch(`${BASE_URL}/api/product/scan-qr`, {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify({
          productId: productId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to scan QR code");
      }

      return { success: true, exists: data.exists };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // API Function to Add Items to Order
  const addItemsToOrder = async (itemsToAdd) => {
    try {
      const headers = getAuthHeaders();

      // Use MongoDB _id for the API call
      const mongoId = orderData?._id || id;

      const response = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${mongoId}/items`,
        {
          method: "POST",
          credentials: "include",
          headers: headers,
          body: JSON.stringify({
            items: itemsToAdd,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add items to order");
      }

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // API Function to Update Order Status
  const updateOrderStatus = async (status) => {
    try {
      const headers = getAuthHeaders();

      // IMPORTANT: Use MongoDB _id for the API call, not orderNumber
      const mongoId = orderData?._id || id;

      const requestBody = {
        status: status,
      };

      const response = await fetch(
        `${BASE_URL}/api/checkout/vendor/order/${mongoId}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers: headers,
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Failed to update order status: ${response.status}`,
        );
      }

      // Update local orderData state with the new data from response
      if (data.data) {
        setOrderData(data.data);
      }

      // Auto-generate PDF if status is updated to "order_placed"
      if (status && status.toLowerCase() === "order_placed" && data.data?.orderNumber) {
        try {
          console.log("========================================");
          console.log("📄 AUTO-GENERATING INVOICE PDF (from status update):");
          console.log("Order Number:", data.data.orderNumber);
          console.log("Status:", status);
          console.log("API Endpoint:", `${BASE_URL}/api/invoice/order/${data.data.orderNumber}/generate-pdf`);
          console.log("========================================");

          const pdfResponse = await fetch(
            `${BASE_URL}/api/invoice/order/${data.data.orderNumber}/generate-pdf`,
            {
              method: "POST",
              credentials: "include",
              headers: headers,
            },
          );

          const pdfResult = await pdfResponse.json();

          if (pdfResponse.ok && pdfResult.success) {
            console.log("✅ Invoice PDF generated successfully:", pdfResult);
          } else {
            console.warn("⚠️ Failed to generate invoice PDF:", pdfResult.message || "Unknown error");
          }
        } catch (pdfError) {
          console.error("❌ Error generating invoice PDF:", pdfError);
          // Don't throw error, just log it - status update was successful
        }
      }

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Add Extra Item with API
  const handleAddExtraItem = async (product, quantity) => {
    try {
      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        alert("⚠️ Authentication required. Please login again.");
        return;
      }

      // Get orderId from orderData (MongoDB _id) or params
      // API requires MongoDB _id, not orderNumber
      const orderId = orderData?._id || id;
      
      if (!orderId) {
        alert("⚠️ Order ID not found. Please wait for order data to load or refresh the page.");
        return;
      }

      // Get productId from product object (MongoDB _id required for API)
      const productId = product.productId || product._id;
      
      if (!productId) {
        alert("⚠️ Product ID not found. This product may not be available in the system.\n\nPlease select a product with a valid Product ID.");
        console.error("Product object missing productId:", product);
        return;
      }
      
      // Validate productId format (should be MongoDB ObjectId)
      if (typeof productId !== 'string' || productId.length < 10) {
        alert("⚠️ Invalid Product ID format. Please select a valid product.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const apiUrl = `${BASE_URL}/api/checkout/vendor/order/${orderId}/items`;

      const requestBody = {
        items: [
          {
            productId: productId,
            quantity: quantity,
          },
        ],
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to add extra item: ${response.status}`);
      }

      // API call successful - update local state
      const newExtraItem = {
        ...product,
        id: nextExtraId,
        quantity: quantity,
        scanned: 0,
        isExtra: true,
        productId: productId,
      };

      // Add to local state
      setProducts([...products, newExtraItem]);
      setNextExtraId(nextExtraId + 1);

      const newScan = {
        id: scanHistory.length + 1,
        productName: product.name,
        sku: product.sku,
        time: new Date().toLocaleString(),
        status: "extra_added",
        operator: "Packing Operator",
      };
      setScanHistory([newScan, ...scanHistory]);

      alert(
        `✅ Extra Item Added Successfully!\n\n${product.name}\nQuantity: ${quantity}\n\nRemember to scan these items before sealing the bag.`,
      );
      setIsAddExtraItemModalOpen(false);

      // Optionally refresh order data to get updated items
    } catch (error) {
      alert(`❌ Failed to add extra item: ${error.message}\n\nPlease try again.`);
    }
  };

  // Handle Remove Extra Item
  const handleRemoveExtraItem = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (
      window.confirm(
        `🗑️ Remove extra item?\n\n${product.name}\n\nThis action cannot be undone.`,
      )
    ) {
      setProducts(products.filter((p) => p.id !== productId));
      alert(`✅ Extra item removed successfully!`);
    }
  };

  // Handle Item Scan with API Integration
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
        alert("❌ Invalid QR Code! This item is not in this order.");
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

      // Call API to verify QR code (if not extra item)
      if (!product.isExtra && product.productId) {
        const scanResult = await scanQRCode(product.productId);
        if (!scanResult.success || !scanResult.exists) {
          alert(
            `❌ QR Scan verification failed: ${scanResult.error || "Product not found"}\n\nTrying manual update...`,
          );
        }
      }

      // Update local state
      const updatedProducts = [...products];
      updatedProducts[productIndex].scanned += 1;
      setProducts(updatedProducts);

      const newScan = {
        id: scanHistory.length + 1,
        productName: product.name,
        sku: product.sku,
        time: new Date().toLocaleString(),
        status: "scanned",
        operator: "Packing Operator",
      };
      setScanHistory([newScan, ...scanHistory]);

      // Update bag status on first scan
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
    } catch (error) {
      console.error("Error during scan:", error);
      alert(`❌ Error during scan: ${error.message}`);
    } finally {
      setIsScanningItem(false);
    }
  };

  // Handle Manual Increment/Decrement
  const handleManualUpdate = async (productId, action) => {
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) return;

    const product = products[productIndex];

    if (action === "increment" && product.scanned < product.quantity) {
      // Call API if not extra item
      if (!product.isExtra && product.productId) {
        const scanResult = await scanQRCode(product.productId);
        if (!scanResult.success) {
          console.warn("API scan failed, updating locally anyway");
        }
      }

      const updatedProducts = [...products];
      updatedProducts[productIndex].scanned += 1;
      setProducts(updatedProducts);

      const newScan = {
        id: scanHistory.length + 1,
        productName: product.name,
        sku: product.sku,
        time: new Date().toLocaleString(),
        status: "manual",
        operator: "Packing Operator",
      };
      setScanHistory([newScan, ...scanHistory]);
    } else if (action === "decrement" && product.scanned > 0) {
      const updatedProducts = [...products];
      updatedProducts[productIndex].scanned -= 1;
      setProducts(updatedProducts);
    }
  };

  // Calculate distance using Haversine formula (open-source, no API key needed)
  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Format distance for display
  const formatDistance = (distanceInKm) => {
    if (distanceInKm < 1) {
      return `${Math.round(distanceInKm * 1000)} m`;
    }
    return `${distanceInKm.toFixed(2)} km`;
  };

  // Calculate estimated time based on distance (assuming average speed of 30 km/h in city)
  const calculateEstimatedTime = (distanceInKm) => {
    const averageSpeed = 30; // km/h (city driving speed)
    const timeInHours = distanceInKm / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    }
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
  };

  // Calculate distance and time using lat/long
  useEffect(() => {
    if (isDeliveryAmountModalOpen && orderData) {
      console.log("========================================");
      console.log("📍 CALCULATING DISTANCE AND TIME");
      console.log("========================================");
      console.log("Order Data:", orderData);
      
      // Set initial loading state
      setDistance("Calculating...");
      setExpectedTime("Calculating...");
      
      try {
        // Get vendor/store latitude and longitude
        let vendorLat = null;
        let vendorLng = null;
        
        if (orderData.items && orderData.items[0]?.vendor?.storeAddress) {
          const storeAddr = orderData.items[0].vendor.storeAddress;
          vendorLat = parseFloat(storeAddr.latitude || storeAddr.lat);
          vendorLng = parseFloat(storeAddr.longitude || storeAddr.lng || storeAddr.lon);
          console.log("Vendor coordinates:", { vendorLat, vendorLng });
        } else if (orderData.vendor?.storeAddress) {
          const storeAddr = orderData.vendor.storeAddress;
          vendorLat = parseFloat(storeAddr.latitude || storeAddr.lat);
          vendorLng = parseFloat(storeAddr.longitude || storeAddr.lng || storeAddr.lon);
          console.log("Vendor coordinates (alt path):", { vendorLat, vendorLng });
        }
        
        // Get shipping address latitude and longitude
        let shippingLat = null;
        let shippingLng = null;
        
        if (orderData.shippingAddress) {
          shippingLat = parseFloat(orderData.shippingAddress.latitude || orderData.shippingAddress.lat);
          shippingLng = parseFloat(orderData.shippingAddress.longitude || orderData.shippingAddress.lng || orderData.shippingAddress.lon);
          console.log("Shipping coordinates:", { shippingLat, shippingLng });
        } else if (orderData.deliveryAddress) {
          shippingLat = parseFloat(orderData.deliveryAddress.latitude || orderData.deliveryAddress.lat);
          shippingLng = parseFloat(orderData.deliveryAddress.longitude || orderData.deliveryAddress.lng || orderData.deliveryAddress.lon);
          console.log("Delivery coordinates (alt path):", { shippingLat, shippingLng });
        }

        // Check if we have valid coordinates
        const hasValidVendorCoords = vendorLat && vendorLng && !isNaN(vendorLat) && !isNaN(vendorLng);
        const hasValidShippingCoords = shippingLat && shippingLng && !isNaN(shippingLat) && !isNaN(shippingLng);
        
        if (!hasValidVendorCoords || !hasValidShippingCoords) {
          const missingParts = [];
          if (!hasValidVendorCoords) missingParts.push("vendor coordinates");
          if (!hasValidShippingCoords) missingParts.push("shipping coordinates");
          
          console.error(`❌ Latitude/Longitude not available or invalid: Missing ${missingParts.join(" and ")}`);
          console.error("Vendor:", { vendorLat, vendorLng });
          console.error("Shipping:", { shippingLat, shippingLng });
          setDistance("N/A");
          setExpectedTime("N/A");
          return;
        }

        // Calculate distance using Haversine formula
        const distanceInKm = calculateHaversineDistance(
          vendorLat,
          vendorLng,
          shippingLat,
          shippingLng
        );
        console.log("Calculated distance (km):", distanceInKm);

        // Format and set distance
        const formattedDistance = formatDistance(distanceInKm);
        setDistance(formattedDistance);
        console.log("Formatted distance:", formattedDistance);

        // Calculate and set estimated time
        const estimatedTime = calculateEstimatedTime(distanceInKm);
        setExpectedTime(estimatedTime);
        console.log("Estimated time:", estimatedTime);
        console.log("✅ Distance and time calculated successfully");
        console.log("========================================");
      } catch (error) {
        console.error("❌ Error calculating distance and time:", error);
        setDistance("N/A");
        setExpectedTime("N/A");
      }
    } else {
      // Reset when modal closes
      setDistance(null);
      setExpectedTime(null);
    }
  }, [isDeliveryAmountModalOpen, orderData]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);


  // Handle Complete Packing & Seal Bag - Show delivery amount input first
  const handleCompletePacking = () => {
    if (!isPackingComplete) {
      alert("⚠️ Please scan all items before sealing the bag!");
      return;
    }
    // Open delivery amount modal
    setIsDeliveryAmountModalOpen(true);
  };

  // Handle Seal Bag - Save distance and expected time, update status after 15 seconds
  const handleSealBag = async () => {
    setIsDeliveryAmountModalOpen(false);
    setIsUpdatingStatus(true);

    try {
      const bagNumber = `BAG${Date.now().toString().slice(-8)}`;
      const qrCode = `FKMP${Date.now().toString().slice(-10)}`;

      // Check if there are extra items to add to the order
      const extraItems = products.filter((p) => p.isExtra);
      if (extraItems.length > 0) {
        const itemsToAdd = extraItems.map((item) => ({
          productId: item.productId || item.id.toString(),
          quantity: item.quantity,
        }));

        const addResult = await addItemsToOrder(itemsToAdd);
        if (!addResult.success) {
          const proceed = window.confirm(
            `⚠️ Failed to add extra items to order!\n\nError: ${addResult.error}\n\nDo you want to seal the bag anyway?\n(Extra items won't be recorded in the backend)`,
          );
          if (!proceed) {
            setIsUpdatingStatus(false);
            return;
          }
        }
      }

      // Extract numeric distance value (remove "km" or "m" suffix)
      let distanceValue = null;
      if (distance && distance !== "N/A" && distance !== "Calculating...") {
        const distanceStr = distance.toString().replace(/[^\d.]/g, '');
        distanceValue = parseFloat(distanceStr);
      }

      // Extract numeric expected time value (convert to minutes)
      let expectedTimeValue = null;
      if (expectedTime && expectedTime !== "N/A" && expectedTime !== "Calculating...") {
        // Parse time string like "15 min" or "1 hr 30 min"
        const timeStr = expectedTime.toString().toLowerCase();
        let totalMinutes = 0;
        
        // Extract hours
        const hourMatch = timeStr.match(/(\d+)\s*hr/);
        if (hourMatch) {
          totalMinutes += parseInt(hourMatch[1]) * 60;
        }
        
        // Extract minutes
        const minMatch = timeStr.match(/(\d+)\s*min/);
        if (minMatch) {
          totalMinutes += parseInt(minMatch[1]);
        }
        
        expectedTimeValue = totalMinutes > 0 ? totalMinutes : null;
      }

      // Update bag details immediately
      setBagDetails({
        ...bagDetails,
        bagNo: bagNumber,
        bagQRCode: qrCode,
        status: "Ready for Pickup",
        sealed: true,
        completeTime: new Date().toLocaleString(),
        distance: distanceValue,
        expectedTime: expectedTimeValue,
      });

      const extraItemsCount = products.filter((p) => p.isExtra).length;
      const extraItemsText =
        extraItemsCount > 0
          ? `\n\n📦 Includes ${extraItemsCount} extra item(s)`
          : "";

      // Update order status after 15 seconds delay
      setTimeout(async () => {
        try {
          // Update order status to "ready" via API (without deliveryAmount)
          const result = await updateOrderStatus("ready");

          if (!result.success) {
            console.error("Failed to update order status:", result.error);
            // Don't show alert, just log the error
          }
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      }, 15000); // 15 seconds delay

      // Show waiting animation
      setShowWaitingAnimation(true);
      setCountdown(5); // Reset countdown to 5 seconds
      
      // Clear any existing intervals/timeouts
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      
      // Countdown timer
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            setShowWaitingAnimation(false);
            navigate("/vendor/orders");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Set timeout to redirect after 5 seconds (5000 ms) as backup
      redirectTimeoutRef.current = setTimeout(() => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        setShowWaitingAnimation(false);
        navigate("/vendor/orders");
      }, 5000); // 5 seconds
      
      setIsUpdatingStatus(false);
    } catch (error) {
      alert(`❌ Failed to seal bag: ${error.message}`);
      setIsUpdatingStatus(false);
    }
  };

  // Handle Reset Packing
  const handleResetPacking = () => {
    if (
      window.confirm("⚠️ Are you sure you want to reset all packing progress?")
    ) {
      // Reset to original fetched products
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
      window.confirm(
        `🚚 Confirm that ${selectedPartner.name} has picked up the bag?`,
      )
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
      <DashboardLayout>
        <div className="w-full min-h-screen p-6 animate-pulse bg-gray-50">
          <div className="bg-gradient-to-r from-orange-200 to-red-200 rounded-lg h-40 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const extraItemsCount = products.filter((p) => p.isExtra).length;

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen ml-4 p-2 bg-gray-50">
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
                  {orderData?.orderNumber || id}
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
            disabled={bagDetails.sealed || isUpdatingStatus || isScanningItem}
            className={`${
              bagDetails.sealed || isUpdatingStatus || isScanningItem
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white px-6 py-5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2`}
          >
            {isScanningItem ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <QrCode size={24} />
                Scan Item
              </>
            )}
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

        {/* Delivery Amount Modal with Map */}
        {isDeliveryAmountModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 border-t-4 border-green-500 my-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={28} className="text-green-500" />
                  Delivery Route Information
                </h3>
                <button
                  onClick={() => {
                    setIsDeliveryAmountModalOpen(false);
                    setDistance(null);
                    setExpectedTime(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Distance and Time Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="text-blue-600" size={20} />
                    <span className="text-sm font-semibold text-blue-700">Distance</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{distance || "Calculating..."}</p>
                </div>
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-green-600" size={20} />
                    <span className="text-sm font-semibold text-green-700">Expected Time</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{expectedTime || "Calculating..."}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeliveryAmountModalOpen(false);
                    setDistance(null);
                    setExpectedTime(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSealBag}
                  disabled={isUpdatingStatus}
                  className={`flex-1 ${
                    isUpdatingStatus
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2`}
                >
                  {isUpdatingStatus ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Sealing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Seal Bag
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Waiting Animation Modal */}
        {showWaitingAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border-t-4 border-orange-500 animate-pulse">
              <div className="text-center">
                {/* Animated Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center animate-bounce">
                      <Clock className="text-orange-500" size={48} />
                    </div>
                    <div className="absolute inset-0 border-4 border-orange-300 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ⏳ Waiting for Assignment
                </h3>

                {/* Message */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Please wait for <span className="font-bold text-orange-600">5 seconds</span>. Someone will accept the order, or else it will be assigned automatically.
                </p>

                {/* Countdown Timer */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-lg">
                    <Clock className="mr-2" size={20} />
                    <span className="text-xl font-bold">
                      {countdown < 60 
                        ? `${countdown}s` 
                        : `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
                      }
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  ></div>
                </div>

                {/* Info Text */}
                <p className="text-sm text-gray-500">
                  You will be redirected automatically...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BagQRScan;
