import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  DollarSign,
  TrendingUp,
  FileText,
  Users,
  BarChart3,
  Gift,
  Target,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SingleNotification = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const mockNotifications = {
        RUSH923: {
          id: "RUSH923",
          offerType: "Coupon",
          code: "TUSO30",
          min: 12,
          max: 20,
          amount: "20%",
          status: "Draft",
          title: "Flash Sale - 20% Off",
          description:
            "Get 20% discount on orders between ₹12 and ₹20. Limited time offer!",
          startDate: "2025-11-20",
          endDate: "2025-12-20",
          createdDate: "2025-11-15",
          usageLimit: 500,
          usedCount: 0,
          targetAudience: "All Users",
          category: "General",
        },
        RUSH924: {
          id: "RUSH924",
          offerType: "Prepaid",
          code: "Null",
          min: 12,
          max: 20,
          amount: "20 INR",
          status: "Live",
          title: "Prepaid Discount - ₹20 Off",
          description:
            "Save ₹20 on prepaid orders between ₹12 and ₹20. Valid for all users.",
          startDate: "2025-11-10",
          endDate: "2025-12-10",
          createdDate: "2025-11-08",
          usageLimit: 1000,
          usedCount: 456,
          targetAudience: "All Users",
          category: "Prepaid",
        },
        RUSH925: {
          id: "RUSH925",
          offerType: "Coupon",
          code: "TUSO40",
          min: 15,
          max: 30,
          amount: "25%",
          status: "Live",
          title: "Mega Savings - 25% Discount",
          description:
            "Enjoy 25% off on orders between ₹15 and ₹30. Don't miss out!",
          startDate: "2025-11-12",
          endDate: "2025-12-25",
          createdDate: "2025-11-10",
          usageLimit: 750,
          usedCount: 320,
          targetAudience: "Premium Users",
          category: "Premium",
        },
      };

      setNotification(mockNotifications[id] || null);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-gray-300 rounded-sm w-2/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-32 bg-gray-300 rounded-sm"></div>
          ))}
      </div>
      <div className="h-48 bg-gray-300 rounded-sm"></div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pl-0 sm:pl-6 min-h-screen bg-gray-50">
          <div className="max-w-[99%] mx-auto mt-4 px-4">
            <SkeletonLoader />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!notification) {
    return (
      <DashboardLayout>
        <div className="pl-0 sm:pl-6 min-h-screen bg-gray-50">
          <div className="max-w-[99%] mx-auto mt-4 px-4">
            <div className="bg-white rounded-sm shadow-sm p-8 text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-[#FF7B1D]" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-black mb-3">
                Notification Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The notification you're looking for doesn't exist or has been
                removed.
              </p>
              <button
                onClick={() => navigate("/notification")}
                className="bg-[#FF7B1D] text-white px-8 py-3 rounded-sm hover:bg-orange-600 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Back to Notifications
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status) => {
    return status.toLowerCase() === "live"
      ? "bg-green-500 text-white"
      : "bg-orange-500 text-white";
  };

  const progressPercentage = notification.usageLimit
    ? (notification.usedCount / notification.usageLimit) * 100
    : 0;

  return (
    <DashboardLayout>
      <div className="pl-0 sm:pl-0 ml-6 min-h-screen bg-gray-0">
        <div className="max-w-[99%] mx-auto mt-4 px-4 pb-8">
          {/* Header Section */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/notification")}
              className="flex items-center gap-2 text-black hover:text-[#FF7B1D] transition-colors mb-6 font-medium group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Notifications</span>
            </button>

            {/* Title Card */}
            <div className="bg-white rounded-sm shadow-sm p-6 border-l-4 border-[#FF7B1D]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="text-[#FF7B1D]" size={28} />
                    <h1 className="text-2xl sm:text-3xl font-bold text-black">
                      {notification.title}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="text-sm text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-sm">
                      ID: {notification.id}
                    </span>
                    <span
                      className={`px-4 py-1 rounded-sm text-sm font-bold shadow-sm ${getStatusColor(
                        notification.status
                      )}`}
                    >
                      {notification.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Usage Card */}
            <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-[#FF7B1D] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-100 p-3 rounded-sm">
                  <BarChart3 className="text-[#FF7B1D]" size={24} />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">
                  Usage Count
                </h3>
              </div>
              <p className="text-3xl font-bold text-black mb-1">
                {notification.usedCount}
              </p>
              <p className="text-xs text-gray-500">
                of {notification.usageLimit} limit
              </p>
            </div>

            {/* Discount Card */}
            <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-3 rounded-sm">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">
                  Discount
                </h3>
              </div>
              <p className="text-3xl font-bold text-black mb-1">
                {notification.amount}
              </p>
              <p className="text-xs text-gray-500">
                {notification.amount.includes("%")
                  ? "Percentage"
                  : "Flat Amount"}
              </p>
            </div>

            {/* Order Range Card */}
            <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-3 rounded-sm">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">
                  Order Range
                </h3>
              </div>
              <p className="text-3xl font-bold text-black mb-1">
                ₹{notification.min}-{notification.max}
              </p>
              <p className="text-xs text-gray-500">Min to Max Amount</p>
            </div>

            {/* Category Card */}
            <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-3 rounded-sm">
                  <Tag className="text-purple-600" size={24} />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">
                  Category
                </h3>
              </div>
              <p className="text-3xl font-bold text-black mb-1">
                {notification.category}
              </p>
              <p className="text-xs text-gray-500">
                {notification.offerType} Type
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description Card */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-100">
                  <div className="bg-orange-100 p-2 rounded-sm">
                    <FileText className="text-[#FF7B1D]" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-black">Description</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {notification.description}
                </p>
              </div>

              {/* Offer Details */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-100">
                  <div className="bg-orange-100 p-2 rounded-sm">
                    <Gift className="text-[#FF7B1D]" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-black">
                    Offer Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-sm p-4 border-l-4 border-[#FF7B1D]">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                      Offer Type
                    </p>
                    <p className="text-2xl font-bold text-black">
                      {notification.offerType}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-sm p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                      Coupon Code
                    </p>
                    <p className="text-2xl font-bold text-black">
                      {notification.code === "Null" ? "N/A" : notification.code}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-sm p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                      Min Amount
                    </p>
                    <p className="text-2xl font-bold text-black">
                      ₹{notification.min}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-sm p-4 border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                      Max Amount
                    </p>
                    <p className="text-2xl font-bold text-black">
                      ₹{notification.max}
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-100">
                  <div className="bg-orange-100 p-2 rounded-sm">
                    <BarChart3 className="text-[#FF7B1D]" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-black">
                    Usage Statistics
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-sm">
                    <span className="text-gray-700 font-semibold">
                      Total Used
                    </span>
                    <span className="text-2xl font-bold text-black">
                      {notification.usedCount}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-sm">
                    <span className="text-gray-700 font-semibold">
                      Usage Limit
                    </span>
                    <span className="text-2xl font-bold text-black">
                      {notification.usageLimit}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700 font-semibold">
                        Progress
                      </span>
                      <span className="text-lg font-bold text-[#FF7B1D]">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-sm h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#FF7B1D] to-orange-500 h-full rounded-sm transition-all duration-500 flex items-center justify-end px-2"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        {progressPercentage > 20 && (
                          <span className="text-white text-xs font-bold">
                            {progressPercentage.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Used: {notification.usedCount}</span>
                      <span>
                        Remaining:{" "}
                        {notification.usageLimit - notification.usedCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-100">
                  <div className="bg-orange-100 p-2 rounded-sm">
                    <Calendar className="text-[#FF7B1D]" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-black">Timeline</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-sm p-4 border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-blue-600" size={16} />
                      <p className="text-xs text-gray-600 font-semibold">
                        Created Date
                      </p>
                    </div>
                    <p className="font-bold text-black text-lg">
                      {new Date(notification.createdDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-sm p-4 border-l-4 border-green-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-green-600" size={16} />
                      <p className="text-xs text-gray-600 font-semibold">
                        Start Date
                      </p>
                    </div>
                    <p className="font-bold text-black text-lg">
                      {new Date(notification.startDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-sm p-4 border-l-4 border-red-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-red-600" size={16} />
                      <p className="text-xs text-gray-600 font-semibold">
                        End Date
                      </p>
                    </div>
                    <p className="font-bold text-black text-lg">
                      {new Date(notification.endDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-100">
                  <div className="bg-orange-100 p-2 rounded-sm">
                    <Users className="text-[#FF7B1D]" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-black">
                    Target Audience
                  </h2>
                </div>

                <div className="bg-orange-50 rounded-sm p-5 border-l-4 border-[#FF7B1D]">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="text-[#FF7B1D]" size={20} />
                    <p className="font-bold text-black text-lg">
                      {notification.targetAudience}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">
                    This offer is available to all users in the target segment
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-xl font-bold text-black mb-5 pb-3 border-b-2 border-gray-100">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button className="w-full bg-[#FF7B1D] text-white py-3 rounded-sm hover:bg-orange-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Edit Notification
                  </button>
                  <button className="w-full border-2 border-[#FF7B1D] text-[#FF7B1D] py-3 rounded-sm hover:bg-orange-50 transition-all font-bold">
                    Duplicate Offer
                  </button>
                  <button className="w-full border-2 border-red-500 text-red-600 py-3 rounded-sm hover:bg-red-50 transition-all font-bold">
                    Delete Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SingleNotification;
