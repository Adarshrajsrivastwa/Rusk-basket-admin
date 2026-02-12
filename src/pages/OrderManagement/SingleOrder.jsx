import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import AssignDeliveryBoyModal from "../../components/AssignDeliveryBoyModal";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api`;

const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch order data from API
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("========================================");
        console.log("📦 FETCHING ORDER DATA:");
        console.log("Order ID from params:", id);
        console.log("API Endpoint:", `${API_BASE_URL}/checkout/vendor/order/${id}`);
        console.log("========================================");

        // Get token from localStorage
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${API_BASE_URL}/checkout/vendor/order/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: headers,
          },
        );

        console.log("========================================");
        console.log("📡 API RESPONSE:");
        console.log("Response Status:", response.status);
        console.log("Response OK:", response.ok);
        console.log("========================================");

        const result = await response.json();

        console.log("========================================");
        console.log("📦 PARSED RESPONSE DATA:");
        console.log("Full Response (JSON):", JSON.stringify(result, null, 2));
        console.log("----------------------------------------");
        console.log("Result type:", typeof result);
        console.log("Result keys:", Object.keys(result));
        console.log("Result.success:", result.success);
        console.log("Result.message:", result.message);
        console.log("----------------------------------------");
        console.log("Result.data:", result.data);
        console.log("Result.data type:", typeof result.data);
        if (result.data) {
          console.log("Result.data keys:", Object.keys(result.data));
        console.log("Result.data._id:", result.data._id);
        console.log("Result.data.orderNumber:", result.data.orderNumber);
        console.log("Result.data.status:", result.data.status);
        console.log("Result.data.createdAt:", result.data.createdAt);
        console.log("Result.data.deliveryImage:", result.data.deliveryImage);
        console.log("Result.data.deliveryImage?.url:", result.data.deliveryImage?.url);
        console.log("Result.data.deliveredImage:", result.data.deliveredImage);
        console.log("Result.data.deliveredImage?.url:", result.data.deliveredImage?.url);
        console.log("Result.data.riderInfo:", result.data.riderInfo);
        console.log("Result.data (Full JSON):", JSON.stringify(result.data, null, 2));
        }
        console.log("========================================");

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch order data");
        }

        // Transform API response to match component structure
        const transformedData = transformOrderData(result.data);
        
        console.log("========================================");
        console.log("🔄 TRANSFORMED ORDER DATA:");
        console.log("Transformed Data (JSON):", JSON.stringify(transformedData, null, 2));
        console.log("----------------------------------------");
        console.log("Transformed Data Keys:", Object.keys(transformedData));
        console.log("Transformed Data._id:", transformedData._id);
        console.log("Transformed Data.id:", transformedData.id);
        console.log("Transformed Data.date:", transformedData.date);
        console.log("Transformed Data.status:", transformedData.status);
        console.log("Transformed Data.vendor:", transformedData.vendor);
        console.log("Transformed Data.buyer:", transformedData.buyer);
        console.log("Transformed Data.products:", transformedData.products);
        console.log("Transformed Data.deliveryImage:", transformedData.deliveryImage);
        console.log("Transformed Data.deliveredImage:", transformedData.deliveredImage);
        console.log("========================================");
        
        setOrderData(transformedData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  // Transform API response to component structure
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

    // Extract vendor info from first item (assuming all items from same vendor)
    const firstItem = apiData.items[0];
    const vendorInfo = firstItem?.vendor || {};

    return {
      id: apiData.orderNumber || apiData._id,
      _id: apiData._id, // Keep MongoDB _id for invoice navigation
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
        name: "Customer", // Not provided in API
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
        contactPerson: "Customer", // Not provided in API
        mobile: apiData.shippingAddress?.phone || "N/A",
        altMobile: apiData.user?.contactNumber || "N/A",
        address1: apiData.shippingAddress?.line1 || "N/A",
        address2: apiData.shippingAddress?.line2 || "",
        city: apiData.shippingAddress?.city || "N/A",
        pinCode: apiData.shippingAddress?.pinCode || "N/A",
        distance: "N/A", // Calculate if needed
        expectedTime: "N/A", // Not provided in API
      },
      products: apiData.items.map((item) => ({
        name:
          item.productName || item.product?.productName || "Unknown Product",
        quantity: item.quantity,
        amount: item.totalPrice,
        sku: item.sku || "N/A",
        stock: "N/A", // Not provided in API
        rating: 0, // Not provided in API
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
      rider: apiData.riderDetails || apiData.rider ? {
        id: apiData.rider?._id || apiData.riderDetails?.riderId || "N/A",
        name: apiData.rider?.fullName || apiData.riderDetails?.riderName || apiData.riderInfo?.name || "N/A",
        mobile: apiData.rider?.mobileNumber || apiData.riderDetails?.mobileNumber || apiData.riderInfo?.mobileNumber || "N/A",
        whatsapp: apiData.rider?.whatsappNumber || apiData.riderDetails?.whatsappNumber || "N/A",
        email: "N/A",
        verified: false,
        rating: 0,
        deliveryAmount: apiData.riderAmount || apiData.deliveryAmount || 0,
      } : null,
      notes: apiData.notes || "",
      rawApiData: apiData, // Keep raw data for reference
    };
  };

  // Function to navigate to Bag & QR Scan page
  const handleBagQRScan = () => {
    navigate(`/orders/${orderData.id}/bag-qr-scan`);
  };

  const SkeletonLoader = () => (
    <div className="w-full space-y-4 p-4 animate-pulse">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#FF7B1D]">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-4 h-[380px] space-y-3 border-t-4 border-[#FF7B1D]"
          >
            <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j} className="h-3 w-full bg-gray-100 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <SkeletonLoader />;

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Order
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!orderData) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-800 font-semibold">Order not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check if buttons should be shown based on order status
  const shouldShowActionButtons = () => {
    const allowedStatuses = [
      "order_placed",
      "pending",
      "new order",
      "confirmed",
    ];
    return allowedStatuses.includes(orderData.status.toLowerCase());
  };

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen ml-4 p-4">
        {/* Header Section */}
        <div className="bg-white rounded-sm shadow-sm p-6 mb-6 border-l-4 border-[#FF7B1D]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Details
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="font-bold text-[#FF7B1D]">
                  Order ID: {orderData.id}
                </span>
                <span className="w-1.5 h-1.5 bg-[#FF7B1D] rounded-full"></span>
                <span className="font-semibold">{orderData.date}</span>
                <span className="w-1.5 h-1.5 bg-[#FF7B1D] rounded-full"></span>
                <span className="font-semibold">{orderData.time}</span>
              </div>
              {orderData.status && (
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      orderData.status.toLowerCase() === "pending" ||
                      orderData.status.toLowerCase() === "order_placed"
                        ? "bg-yellow-100 text-yellow-800"
                        : orderData.status.toLowerCase() === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : orderData.status.toLowerCase() === "delivered"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    Status: {orderData.status.toUpperCase().replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>
            {shouldShowActionButtons() && (
              <div className="flex gap-3 flex-wrap">
                {/* <button
                  className="bg-[#FF7B1D] hover:bg-[#E66A0D] text-white px-6 py-3 font-bold rounded-sm shadow-sm hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  onClick={() => setIsModalOpen(true)}
                >
                  Assign Delivery Partner
                </button> */}
                <button
                  onClick={handleBagQRScan}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 font-bold rounded-sm shadow-sm hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Bag & QR Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Buyer Information */}
          <div className="bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-[#FF7B1D]">
            <div className="bg-[#FF7B1D] p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <h2 className="font-bold text-white text-base relative z-10">
                👤 Buyer Information
              </h2>
            </div>
            <div className="p-4 h-[320px] overflow-y-auto">
              <div className="space-y-2.5 text-xs">
                <InfoRow label="User ID" value={orderData.buyer.id} />
                <InfoRow label="Name" value={orderData.buyer.name} highlight />
                <InfoRow
                  label="User Type"
                  value={orderData.buyer.userType}
                  badge
                />
                <InfoRow label="Mobile" value={orderData.buyer.mobile} />
                <InfoRow
                  label="Alt. Mobile"
                  value={orderData.buyer.altMobile}
                />
                <InfoRow label="Email" value={orderData.buyer.email} />
                {orderData.buyer.registrationDate !== "N/A" && (
                  <InfoRow
                    label="Registration"
                    value={orderData.buyer.registrationDate}
                  />
                )}
                {orderData.buyer.totalOrders > 0 && (
                  <InfoRow
                    label="Total Orders"
                    value={orderData.buyer.totalOrders}
                    badge
                  />
                )}
                {orderData.buyer.leaderboardPosition > 0 && (
                  <InfoRow
                    label="Leaderboard"
                    value={`#${orderData.buyer.leaderboardPosition}`}
                  />
                )}
                {orderData.buyer.turnover > 0 && (
                  <InfoRow
                    label="Turnover"
                    value={`₹${orderData.buyer.turnover.toLocaleString()}`}
                    highlight
                  />
                )}
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-[#FF7B1D]">
            <div className="bg-[#FF7B1D] p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <h2 className="font-bold text-white text-base relative z-10">
                🏪 Vendor Information
              </h2>
            </div>
            <div className="p-4 h-[320px] overflow-y-auto">
              <div className="space-y-2.5 text-xs">
                <InfoRow label="Vendor ID" value={orderData.vendor.id} />
                <InfoRow label="Name" value={orderData.vendor.name} highlight />
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
                {orderData.vendor.registrationDate !== "N/A" && (
                  <InfoRow
                    label="Registration"
                    value={orderData.vendor.registrationDate}
                  />
                )}
                {orderData.vendor.totalOrders > 0 && (
                  <InfoRow
                    label="Total Orders"
                    value={orderData.vendor.totalOrders}
                    badge
                  />
                )}
                {orderData.vendor.leaderboardPosition > 0 && (
                  <InfoRow
                    label="Leaderboard"
                    value={`#${orderData.vendor.leaderboardPosition}`}
                  />
                )}
                {orderData.vendor.turnover > 0 && (
                  <InfoRow
                    label="Turnover"
                    value={`₹${orderData.vendor.turnover.toLocaleString()}`}
                    highlight
                  />
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2 bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-[#FF7B1D]">
            <div className="bg-[#FF7B1D] p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <h2 className="font-bold text-white text-base relative z-10">
                📦 Products Ordered
              </h2>
            </div>
            <div className="p-4 h-[320px] overflow-y-auto">
              <div className="space-y-3">
                {orderData.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 border-2 border-gray-200 rounded-sm p-3 bg-white hover:border-[#FF7B1D] hover:shadow-md transition-all"
                  >
                    <div className="w-[90px] h-[80px] bg-gradient-to-br from-orange-50 to-orange-100 rounded-sm flex items-center justify-center flex-shrink-0 border-2 border-[#FF7B1D] overflow-hidden">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-700 mb-2">
                        <span>
                          Qty:{" "}
                          <strong className="text-black">
                            {product.quantity}
                          </strong>
                        </span>
                        <span>
                          Amount:{" "}
                          <strong className="text-[#FF7B1D]">
                            ₹{product.amount}
                          </strong>
                        </span>
                        <span>
                          SKU:{" "}
                          <strong className="text-black">{product.sku}</strong>
                        </span>
                        {product.stock !== "N/A" && (
                          <span>
                            Stock:{" "}
                            <strong className="text-[#FF7B1D]">
                              {product.stock}
                            </strong>
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <button className="bg-[#FF7B1D] hover:bg-[#E66A0D] text-white px-3 py-1 text-xs font-bold rounded transition">
                          View
                        </button>
                        {product.stock !== "N/A" && (
                          <span className="bg-green-600 text-white px-3 py-1 text-xs font-bold rounded">
                            {product.stock} Stock
                          </span>
                        )}
                        {product.rating > 0 && (
                          <span className="bg-gray-900 text-white px-3 py-1 text-xs font-bold rounded">
                            ⭐ {product.rating}
                          </span>
                        )}
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs font-bold rounded transition">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t-2 border-[#FF7B1D] flex-wrap gap-2">
                <div className="bg-[#FF7B1D] text-white px-4 py-2 rounded-sm text-xs font-bold shadow-md">
                  Cart: ₹{orderData.cartValue.toLocaleString()}
                </div>
                <div className="bg-gray-900 text-white px-4 py-2 rounded-sm text-xs font-bold shadow-md">
                  Items: {orderData.products.length}
                </div>
                <div className="bg-red-600 text-white px-4 py-2 rounded-sm text-xs font-bold shadow-md">
                  {orderData.payment.mode}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order & Rider */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <div className="bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-[#FF7B1D]">
            <div className="bg-[#FF7B1D] p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <h2 className="font-bold text-white text-base relative z-10">
                📍 Delivery Address
              </h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="col-span-2 bg-orange-50 border-2 border-[#FF7B1D] rounded-sm p-3">
                  <p className="text-xs text-[#FF7B1D] font-bold mb-1">
                    Order ID
                  </p>
                  <p className="font-bold text-gray-900">{orderData.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    Contact Person
                  </p>
                  <p className="font-bold text-black">
                    {orderData.deliveryAddress.contactPerson}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    Mobile
                  </p>
                  <p className="font-bold text-black">
                    {orderData.deliveryAddress.mobile}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    Alt. Mobile
                  </p>
                  <p className="font-bold text-black">
                    {orderData.deliveryAddress.altMobile}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">
                    Coupon Code
                  </p>
                  <p className="font-bold text-black">
                    {orderData.couponCode || "Not Applied"}
                  </p>
                </div>
                <div className="col-span-2 bg-gray-50 rounded-sm p-3 border-2 border-gray-200">
                  <p className="text-xs text-gray-600 mb-2 font-bold">
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-900 leading-relaxed font-semibold">
                    {orderData.deliveryAddress.address1}
                    {orderData.deliveryAddress.address2 && (
                      <>, {orderData.deliveryAddress.address2}</>
                    )}
                    <br />
                    {orderData.deliveryAddress.city} -{" "}
                    {orderData.deliveryAddress.pinCode}
                  </p>
                </div>
                {orderData.deliveryAddress.distance !== "N/A" && (
                  <div className="bg-orange-50 border-2 border-[#FF7B1D] rounded-sm p-3 text-center">
                    <p className="text-xs text-[#FF7B1D] font-bold">Distance</p>
                    <p className="font-bold text-black text-lg">
                      {orderData.deliveryAddress.distance}
                    </p>
                  </div>
                )}
                {orderData.deliveryAddress.expectedTime !== "N/A" && (
                  <div className="bg-green-50 border-2 border-green-500 rounded-sm p-3 text-center">
                    <p className="text-xs text-green-600 font-bold">ETA</p>
                    <p className="font-bold text-black text-lg">
                      {orderData.deliveryAddress.expectedTime}
                    </p>
                  </div>
                )}
                {orderData.notes && (
                  <div className="col-span-2 bg-blue-50 border-2 border-blue-300 rounded-sm p-3">
                    <p className="text-xs text-blue-600 mb-1 font-bold">
                      Order Notes
                    </p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {orderData.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-red-500">
            <div className="bg-red-600 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <h2 className="font-bold text-white text-base relative z-10">
                🚚 Delivery Partner
              </h2>
            </div>
            <div className="p-5">
              {orderData.rider ? (
                <div className="space-y-3 text-sm">
                  <InfoRow
                    label="Rider Name"
                    value={orderData.rider.name}
                    highlight
                  />
                  <InfoRow label="Mobile" value={orderData.rider.mobile} />
                  <InfoRow 
                    label="Delivery Amount" 
                    value={`₹${orderData.rider.deliveryAmount || 0}`}
                    highlight
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 border-4 border-red-200">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  <p className="text-gray-900 font-bold text-base">
                    No rider assigned yet
                  </p>
                  <p className="text-xs text-gray-600 mt-2 font-semibold">
                    Rider will be assigned automatically or manually
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden mt-5 border-t-4 border-[#FF7B1D]">
          <div className="bg-[#FF7B1D] p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <h2 className="font-bold text-white text-base relative z-10">
              💳 Pricing & Invoice
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-3 text-sm">
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
                    value={-orderData.payment.discount}
                    isDiscount
                  />
                )}
              </div>
              <div className="space-y-3 text-sm">
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
                <div className="pt-3 mt-2 border-t-4 border-[#FF7B1D]">
                  <PriceRow
                    label="Total Amount"
                    value={orderData.payment.total}
                    highlight
                    large
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-5">
          <button
            onClick={() => {
              // Use MongoDB _id from orderData or fallback to id from params
              const orderId = orderData?._id || id;
              if (orderId) {
                navigate(`/invoice/view/${orderId}`, {
                  state: { orderId: orderId },
                  replace: false,
                });
              } else {
                alert("Order ID not available");
              }
            }}
            className="bg-[#FF7B1D] hover:bg-[#E66A0D] text-white px-6 py-4 rounded-sm font-bold shadow-sm hover:shadow-2xl transition-all duration-200 transform hover:scale-105 text-base"
          >
            🧾 Download Invoice
          </button>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
          <ImageCard
            title="Delivery Image"
            subtitle="Image by Delivery Partner"
            color="orange"
            icon="📦"
            imageUrl={orderData.deliveryImage}
          />
          <ImageCard
            title="Delivered Image"
            subtitle="Image by Delivery Partner"
            color="orange"
            icon="🚚"
            imageUrl={orderData.deliveredImage}
          />
          <ImageCard
            title="Additional Documents"
            subtitle="Extra attachments"
            color="gray"
            icon="📄"
          />
        </div>
      </div>

      <AssignDeliveryBoyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

const InfoRow = ({ label, value, highlight = false, badge = false }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-700 font-semibold">{label}:</span>
    <span
      className={`${
        highlight
          ? "font-bold text-[#FF7B1D]"
          : badge
            ? "font-bold text-black bg-orange-50 px-2 py-1 rounded"
            : "font-semibold text-gray-900"
      } text-right`}
    >
      {value}
    </span>
  </div>
);

const PriceRow = ({
  label,
  value,
  highlight = false,
  large = false,
  isDiscount = false,
  isCashback = false,
}) => (
  <div className="flex justify-between items-center">
    <span
      className={`${highlight ? "font-bold" : "font-semibold"} ${
        large ? "text-lg" : "text-sm"
      } text-gray-800`}
    >
      {label}:
    </span>
    <span
      className={`${
        highlight
          ? "font-bold text-[#FF7B1D]"
          : isDiscount
            ? "font-bold text-red-600"
            : isCashback
              ? "font-bold text-green-600"
              : "font-bold text-black"
      } ${large ? "text-2xl" : "text-base"}`}
    >
      {isDiscount && value > 0 ? "-" : ""}₹
      {Math.abs(
        typeof value === "number" ? value : parseFloat(value) || 0,
      ).toLocaleString()}
    </span>
  </div>
);

const ImageCard = ({ title, subtitle, color, icon, imageUrl }) => {
  const [imageError, setImageError] = useState(false);
  const colors = {
    orange: "bg-gradient-to-br from-orange-100 to-orange-200 border-[#FF7B1D]",
    gray: "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400",
  };
  
  return (
    <div
      className={`${colors[color]} border-4 h-64 rounded-sm flex flex-col items-center justify-center text-center p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden relative`}
    >
      {imageUrl && !imageError ? (
        <>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover absolute inset-0"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white z-10">
            <div className="text-4xl mb-2">{icon}</div>
            <p className="font-bold text-white text-base">{title}</p>
            <p className="text-xs text-white mt-1 font-semibold">{subtitle}</p>
          </div>
        </>
      ) : (
        <>
          <div className="text-6xl mb-3">{icon}</div>
          <p className="font-bold text-gray-900 text-base">{title}</p>
          <p className="text-sm text-gray-700 mt-2 font-semibold">{subtitle}</p>
        </>
      )}
    </div>
  );
};

export default SingleOrder;
