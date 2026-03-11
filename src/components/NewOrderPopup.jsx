import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import orderSound from "../assets/OrderRing.mp3";

export default function NewOrderPopup({ visible, onClose, orderData }) {
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Default order data if not provided
  const defaultOrderData = {
    id: "RUSH8038403",
    date: "23 Aug 2025",
    time: "11:00AM",
    buyerName: "NK Yadav",
    buyerType: "First Time Buyer",
    items: 5,
    amount: 5222,
    paymentMode: "Cash On Delivery",
    vendor: "Abnish Kumar",
    storeId: "RUSST8954895",
    distance: "15KM",
    estimatedTime: "24Min",
    todayOrders: 20,
    orderNumber: 21,
    todayTransactionBefore: 20095,
    todayTransactionAfter: 200577,
  };

  const order = orderData || defaultOrderData;

  useEffect(() => {
    if (visible) {
      const audio = new Audio(orderSound);
      audio.loop = true;
      audioRef.current = audio;

      audio.play().catch((err) => {
        console.warn("Audio playback was blocked by browser:", err);
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [visible]);

  const handleViewOrder = () => {
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Navigate to All Orders page with "new" tab and scroll to the order
    navigate(`/orders/all?tab=new&orderId=${order.id}`);

    // Close popup
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-orange-200 w-full max-w-[490px] overflow-hidden transform transition-all hover:scale-[1.01] animate-slideUp">
        {/* Header with Gradient and Animated Background */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-4 py-3 relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex-1 text-center">
              <h3 className="text-white font-bold text-[14px] flex items-center justify-center gap-2">
                <span className="animate-bounce">🎉</span>
                Congratulations! You Got a New Order
                <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-[10px] font-semibold animate-pulse">
                  New
                </span>
              </h3>
            </div>

            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  audioRef.current = null;
                }
                onClose();
              }}
              className="absolute right-3 bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded-lg transition-all backdrop-blur-sm"
              aria-label="Close"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Orange Order Info Bar */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 border-b-2 border-orange-200 text-[11px] sm:text-[12px] font-bold flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-4 py-2 animate-pulse-slow">
          <span className="text-orange-800">
            Order ID : <strong className="text-orange-900">#{order.id}</strong>
          </span>
          <span className="text-orange-800">
            Order Date & Time : {order.date} | {order.time}
          </span>
        </div>

        {/* Order Details Section */}
        <div className="p-3 text-[11px] sm:text-[12px] text-black leading-snug bg-gradient-to-br from-orange-50 to-white max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl p-2 border border-orange-100 shadow-sm">
              <p className="text-[10px] text-gray-500 font-medium mb-0.5">
                Buyer Name
              </p>
              <p className="font-bold text-gray-800 text-xs">
                {order.buyerName}
              </p>
            </div>

            <div className="bg-white rounded-xl p-2 border border-orange-100 shadow-sm">
              <p className="text-[10px] text-gray-500 font-medium mb-0.5">
                Buyer Type
              </p>
              <p className="font-bold text-gray-800 text-xs">
                {order.buyerType}
              </p>
            </div>

            <div className="bg-white rounded-xl p-2 border-2 border-orange-100 shadow-sm">
              <p className="text-[10px] text-gray-500 font-medium mb-0.5">
                Amount
              </p>
              <p className="font-bold text-gray-800 text-xs">
                {order.items} items | INR. {order.amount}
              </p>
            </div>

            <div className="bg-white rounded-xl p-2 border border-orange-100 shadow-sm">
              <p className="text-[10px] text-gray-500 font-medium mb-0.5">
                Payment Mode
              </p>
              <p className="font-bold text-gray-800 text-xs">
                {order.paymentMode}
              </p>
            </div>

            <div className="bg-white rounded-xl p-2 border border-orange-100 shadow-sm">
              <p className="text-[10px] text-gray-500 font-medium mb-0.5">
                Vendor
              </p>
              <p className="font-bold text-gray-800 text-xs">{order.vendor}</p>
            </div>

            <div className="bg-white rounded-xl p-2 border border-orange-100 shadow-sm">
              <p className="text-[10px] text-gray-500 font-medium mb-0.5">
                Store ID
              </p>
              <p className="font-bold text-gray-800 text-xs">{order.storeId}</p>
            </div>

            <div className="col-span-2 bg-white rounded-xl p-2 border border-orange-100 shadow-sm flex gap-6">
              <div>
                <p className="text-[10px] text-gray-500 font-medium mb-0.5">
                  Distance
                </p>
                <p className="font-bold text-gray-800 text-xs">
                  {order.distance}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-medium mb-0.5">
                  Time
                </p>
                <p className="font-bold text-gray-800 text-xs">
                  {order.estimatedTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Performance Section */}
        <div className="bg-gradient-to-r from-blue-900 via-emerald-500 to-blue-700 p-3 text-[11px] sm:text-[12px] leading-relaxed text-white relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 translate-y-20"></div>
          </div>

          <div className="relative">
            <h3 className="text-center text-base sm:text-lg font-bold mb-2 drop-shadow-md">
              Today's Performance
            </h3>

            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:justify-between font-semibold bg-white/10 backdrop-blur-sm rounded-xl px-2.5 py-1.5 border border-white/20">
                <span>Total Orders Today : {order.todayOrders}</span>
                <span>This Order Number : #{order.orderNumber}th</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-2.5 py-1.5 border border-white/20">
                <p className="text-[10px] text-green-100 mb-0.5 font-medium">
                  Total Transaction Today (Before This Order)
                </p>
                <p className="font-bold text-sm">
                  INR. {order.todayTransactionBefore}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-2.5 py-1.5 border-2 border-white/40 animate-pulse-slow">
                <p className="text-[10px] text-green-100 mb-0.5 font-medium">
                  Total Transaction After This Order
                </p>
                <p className="font-bold text-base">
                  INR. {order.todayTransactionAfter}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div className="flex justify-center py-3 bg-gradient-to-b from-white to-gray-50">
          <button
            onClick={handleViewOrder}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 py-2 rounded-xl text-xs sm:text-[13px] font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            View Order
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
