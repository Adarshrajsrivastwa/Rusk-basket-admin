import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import AssignDeliveryBoyModal from "../../components/AssignDeliveryBoyModal";

const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrderData({
        id: id || "RUSH8038403",
        date: "23 Aug 2025",
        time: "10:30 AM",
        vendor: {
          id: "VD78468817",
          name: "Abnish Kumar",
          authorizedPerson: "Abnish Kumar",
          contact: "6208089024",
          altContact: "7845984080",
          whatsapp: "6208089024",
          email: "abnish@vendor.com",
          registrationDate: "15/01/2024",
          totalOrders: 156,
          leaderboardPosition: 245,
          turnover: 584919,
        },
        buyer: {
          id: "US78468817",
          name: "NK Yadav",
          userType: "Regular Customer",
          mobile: "9876543210",
          altMobile: "8765432109",
          email: "nkyadav@gmail.com",
          registrationDate: "10/03/2024",
          totalOrders: 23,
          leaderboardPosition: 8894,
          turnover: 84919,
        },
        deliveryAddress: {
          contactPerson: "NK Yadav",
          mobile: "9876543210",
          altMobile: "8765432109",
          address1: "Road Number 3, Patna Nehru Nagar",
          address2: "Near Medical College",
          city: "Patna",
          pinCode: "800013",
          distance: "8 KM",
          expectedTime: "25 min",
        },
        products: [
          {
            name: "Face Wash Himalaya Purifying Neem 150ml with Natural Ingredients",
            quantity: 2,
            amount: 358,
            sku: "FW150NM",
            stock: 156,
            rating: 4.5,
          },
          {
            name: "Body Lotion Nivea Soft Light Moisturizer 200ml",
            quantity: 3,
            amount: 1485,
            sku: "BL200NV",
            stock: 89,
            rating: 4.3,
          },
          {
            name: "Shampoo Pantene Pro-V Silky Smooth Care 340ml",
            quantity: 1,
            amount: 425,
            sku: "SH340PT",
            stock: 234,
            rating: 4.6,
          },
          {
            name: "Toothpaste Colgate Total Advanced Health 200g Pack",
            quantity: 4,
            amount: 680,
            sku: "TP200CG",
            stock: 456,
            rating: 4.4,
          },
        ],
        cartValue: 5222,
        payment: {
          mode: "COD",
          productValue: 4948,
          handlingCost: 50,
          tax: 124,
          deliveryCost: 100,
          additional: 0,
          total: 5222,
        },
        status: "New Order",
        couponCode: null,
        rider: null,
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

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
  if (!orderData) return <div className="p-4">Order not found</div>;

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
            </div>
            {orderData.status === "New Order" && (
              <div className="flex gap-3 flex-wrap">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-bold rounded-sm shadow-sm hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Cancel Order
                </button>
                <button
                  className="bg-[#FF7B1D] hover:bg-[#E66A0D] text-white px-6 py-3 font-bold rounded-sm shadow-sm hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  onClick={() => setIsModalOpen(true)}
                >
                  Assign Delivery Partner
                </button>
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
                <AssignDeliveryBoyModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
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
                <InfoRow
                  label="Registration"
                  value={orderData.buyer.registrationDate}
                />
                <InfoRow
                  label="Total Orders"
                  value={orderData.buyer.totalOrders}
                  badge
                />
                <InfoRow
                  label="Leaderboard"
                  value={`#${orderData.buyer.leaderboardPosition}`}
                />
                <InfoRow
                  label="Turnover"
                  value={`₹${orderData.buyer.turnover.toLocaleString()}`}
                  highlight
                />
              </div>
              <button className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-sm text-xs font-bold mt-4 transition-all duration-200 shadow-md hover:shadow-lg">
                View Full Profile →
              </button>
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
                <InfoRow
                  label="Registration"
                  value={orderData.vendor.registrationDate}
                />
                <InfoRow
                  label="Total Orders"
                  value={orderData.vendor.totalOrders}
                  badge
                />
                <InfoRow
                  label="Leaderboard"
                  value={`#${orderData.vendor.leaderboardPosition}`}
                />
                <InfoRow
                  label="Turnover"
                  value={`₹${orderData.vendor.turnover.toLocaleString()}`}
                  highlight
                />
              </div>
              <button className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-sm text-xs font-bold mt-4 transition-all duration-200 shadow-md hover:shadow-lg">
                View Full Profile →
              </button>
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
                    <div className="w-[90px] h-[80px] bg-gradient-to-br from-orange-50 to-orange-100 rounded-sm flex items-center justify-center flex-shrink-0 border-2 border-[#FF7B1D]">
                      <span className="text-4xl">📦</span>
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
                        <span>
                          Stock:{" "}
                          <strong className="text-[#FF7B1D]">
                            {product.stock}
                          </strong>
                        </span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <button className="bg-[#FF7B1D] hover:bg-[#E66A0D] text-white px-3 py-1 text-xs font-bold rounded transition">
                          View
                        </button>
                        <span className="bg-green-600 text-white px-3 py-1 text-xs font-bold rounded">
                          {product.stock} Stock
                        </span>
                        <span className="bg-gray-900 text-white px-3 py-1 text-xs font-bold rounded">
                          ⭐ {product.rating}
                        </span>
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
                    {orderData.deliveryAddress.address1},{" "}
                    {orderData.deliveryAddress.address2}
                    <br />
                    {orderData.deliveryAddress.city} -{" "}
                    {orderData.deliveryAddress.pinCode}
                  </p>
                </div>
                <div className="bg-orange-50 border-2 border-[#FF7B1D] rounded-sm p-3 text-center">
                  <p className="text-xs text-[#FF7B1D] font-bold">Distance</p>
                  <p className="font-bold text-black text-lg">
                    {orderData.deliveryAddress.distance}
                  </p>
                </div>
                <div className="bg-green-50 border-2 border-green-500 rounded-sm p-3 text-center">
                  <p className="text-xs text-green-600 font-bold">ETA</p>
                  <p className="font-bold text-black text-lg">
                    {orderData.deliveryAddress.expectedTime}
                  </p>
                </div>
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
                  <InfoRow label="Rider ID" value={orderData.rider.id} />
                  <InfoRow
                    label="Name"
                    value={orderData.rider.name}
                    highlight
                  />
                  <InfoRow
                    label="Verified"
                    value={orderData.rider.verified ? "YES" : "NO"}
                    badge
                  />
                  <InfoRow label="Mobile" value={orderData.rider.mobile} />
                  <InfoRow label="WhatsApp" value={orderData.rider.whatsapp} />
                  <InfoRow label="Email" value={orderData.rider.email} />
                  <InfoRow
                    label="Rating"
                    value={`${orderData.rider.rating} ⭐`}
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
                    Click "Assign Delivery Partner" button to assign a rider
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
                <PriceRow
                  label="Handling Cost"
                  value={orderData.payment.handlingCost}
                />
                <PriceRow label="Tax (GST)" value={orderData.payment.tax} />
              </div>
              <div className="space-y-3 text-sm">
                <PriceRow
                  label="Delivery Cost"
                  value={orderData.payment.deliveryCost}
                />
                <PriceRow
                  label="Additional"
                  value={orderData.payment.additional || 0}
                />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <button className="bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-sm font-bold shadow-sm hover:shadow-2xl transition-all duration-200 transform hover:scale-105 text-base">
            📄 Download Order Details
          </button>
          <button className="bg-[#FF7B1D] hover:bg-[#E66A0D] text-white px-6 py-4 rounded-sm font-bold shadow-sm hover:shadow-2xl transition-all duration-200 transform hover:scale-105 text-base">
            🧾 Download Invoice
          </button>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
          <ImageCard
            title="Pickup Confirmation"
            subtitle="Image by Delivery Partner"
            color="orange"
            icon="📦"
          />
          <ImageCard
            title="Delivery Confirmation"
            subtitle="Image by Delivery Partner"
            color="orange"
            icon="🚚"
          />
          <ImageCard
            title="Additional Documents"
            subtitle="Extra attachments"
            color="gray"
            icon="📄"
          />
        </div>
      </div>
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

const PriceRow = ({ label, value, highlight = false, large = false }) => (
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
        highlight ? "font-bold text-[#FF7B1D]" : "font-bold text-black"
      } ${large ? "text-2xl" : "text-base"}`}
    >
      ₹{typeof value === "number" ? value.toLocaleString() : value}
    </span>
  </div>
);

const ImageCard = ({ title, subtitle, color, icon }) => {
  const colors = {
    orange: "bg-gradient-to-br from-orange-100 to-orange-200 border-[#FF7B1D]",
    gray: "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400",
  };
  return (
    <div
      className={`${colors[color]} border-4 h-64 rounded-sm flex flex-col items-center justify-center text-center p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
    >
      <div className="text-6xl mb-3">{icon}</div>
      <p className="font-bold text-gray-900 text-base">{title}</p>
      <p className="text-sm text-gray-700 mt-2 font-semibold">{subtitle}</p>
    </div>
  );
};

export default SingleOrder;
