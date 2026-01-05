import React, { useState } from "react";
import { Bell, X, Search, Send, Filter, Eye, Trash2 } from "lucide-react";

const NotificationsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState("");
  const [filterAudience, setFilterAudience] = useState("All");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    couponCode: "",
    image: null,
  });

  const [bulkAudience, setBulkAudience] = useState({
    all: true,
    allUser: false,
    allVendor: false,
    itemInCart: false,
    normal: false,
    buyer: false,
  });

  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorAudience, setVendorAudience] = useState({
    allUser: false,
    itemInCart: false,
    normal: false,
    buyer: false,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Order Received",
      content: "You have received a new order #ORD-1234",
      audience: "All Vendor",
      date: "2025-10-23",
      time: "10:30 AM",
      status: "sent",
      recipients: 156,
    },
    {
      id: 2,
      title: "Special Discount Offer",
      content: "Get 20% off on your next purchase. Use code: SAVE20",
      audience: "All User",
      date: "2025-10-22",
      time: "09:15 AM",
      status: "sent",
      recipients: 5420,
      couponCode: "SAVE20",
    },
    {
      id: 3,
      title: "Delivery Update",
      content: "Your order is out for delivery",
      audience: "Buyer",
      date: "2025-10-22",
      time: "02:45 PM",
      status: "sent",
      recipients: 234,
    },
    {
      id: 4,
      title: "Cart Reminder",
      content:
        "You have items waiting in your cart. Complete your purchase now!",
      audience: "Item in Cart",
      date: "2025-10-21",
      time: "05:20 PM",
      status: "sent",
      recipients: 89,
    },
    {
      id: 5,
      title: "System Maintenance",
      content: "Scheduled maintenance on Oct 25, 2025 from 2 AM to 4 AM",
      audience: "All",
      date: "2025-10-20",
      time: "11:00 AM",
      status: "sent",
      recipients: 5576,
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleBulkAudienceChange = (field) => {
    if (field === "all") {
      setBulkAudience({
        all: true,
        allUser: false,
        allVendor: false,
        itemInCart: false,
        normal: false,
        buyer: false,
      });
    } else {
      setBulkAudience((prev) => ({
        ...prev,
        all: false,
        [field]: !prev[field],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedAudience || !formData.title || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    const getRecipients = (audience) => {
      const audienceLower = audience.toLowerCase();
      if (audienceLower.includes("all user")) return 5420;
      if (audienceLower.includes("all vendor")) return 156;
      if (audienceLower.includes("buyer")) return 234;
      if (audienceLower.includes("item in cart")) return 89;
      if (audienceLower.includes("normal")) return 320;
      if (audienceLower === "all") return 5576;
      return 100;
    };

    const now = new Date();
    const newNotification = {
      id: notifications.length + 1,
      title: formData.title,
      content: formData.content,
      audience: selectedAudience,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      recipients: getRecipients(selectedAudience),
      couponCode: formData.couponCode || undefined,
      image: formData.image ? URL.createObjectURL(formData.image) : undefined,
    };

    setNotifications([newNotification, ...notifications]);
    setShowCreateModal(false);

    setFormData({ title: "", content: "", couponCode: "", image: null });
    setSelectedAudience("");
    setBulkAudience({
      all: true,
      allUser: false,
      allVendor: false,
      itemInCart: false,
      normal: false,
      buyer: false,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
  };

  const openAudienceSelector = () => {
    setShowCreateModal(false);
    setShowAudienceModal(true);
  };

  const selectAudience = () => {
    let audienceText = "";
    if (bulkAudience.all) audienceText = "All";
    else {
      const selected = Object.keys(bulkAudience)
        .filter((key) => bulkAudience[key] && key !== "all")
        .map((key) => key.replace(/([A-Z])/g, " $1").trim())
        .join(", ");
      audienceText = selected;
    }
    setSelectedAudience(audienceText);
    setShowAudienceModal(false);
    setShowCreateModal(true);
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesAudience =
      filterAudience === "All" || n.audience === filterAudience;
    const matchesSearch =
      searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.audience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAudience && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black border border-[#F26422] rounded-lg shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F26422] p-3 rounded-lg">
                <Bell className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  All Notifications
                </h1>
                <p className="text-sm text-gray-400">
                  {notifications.length} total notifications
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#F26422] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#d95a1f] transition-all shadow-lg flex items-center gap-2"
            >
              <Send size={20} />
              Create Notification
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, content, or audience..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26422]"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="bg-gray-800 text-white px-4 py-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={20} className="text-[#F26422]" />
            <h3 className="font-semibold text-white">Filter by Audience</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "All User",
              "All Vendor",
              "Item in Cart",
              "Normal",
              "Buyer",
            ].map((audience) => (
              <button
                key={audience}
                onClick={() => setFilterAudience(audience)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterAudience === audience
                    ? "bg-[#F26422] text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {audience}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg shadow-lg p-12 text-center">
              <Bell className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-400">
                {searchQuery || filterAudience !== "All"
                  ? "Try adjusting your search or filters"
                  : "Create your first notification to get started"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg shadow-lg p-5 hover:shadow-2xl hover:border-[#F26422] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-[#F26422] p-2 rounded-lg mt-1">
                        <Bell className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-400 mb-3">
                          {notification.content.length > 100
                            ? `${notification.content.substring(0, 100)}...`
                            : notification.content}
                        </p>
                        {notification.couponCode && (
                          <div className="inline-block bg-[#F26422] text-white px-3 py-1 rounded-md text-sm font-semibold mb-3">
                            Coupon: {notification.couponCode}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1 text-gray-400">
                            <span className="font-semibold text-white">
                              Audience:
                            </span>
                            <span className="bg-[#F26422] text-white px-2 py-1 rounded-full font-medium">
                              {notification.audience}
                            </span>
                          </span>
                          <span className="text-gray-400">
                            <span className="font-semibold text-white">
                              Recipients:
                            </span>{" "}
                            {notification.recipients}
                          </span>
                          <span className="text-gray-400">
                            <span className="font-semibold text-white">
                              Date:
                            </span>{" "}
                            {notification.date} at {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(notification)}
                      className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm font-semibold"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="bg-[#F26422] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#d95a1f] transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Notification Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#F26422] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Send Notification
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Select Audience <span className="text-[#F26422]">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedAudience}
                      placeholder="Select..."
                      readOnly
                      onClick={openAudienceSelector}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26422] cursor-pointer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter title"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Content
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Enter content"
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Coupon code (Optional)
                    </label>
                    <input
                      type="text"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={handleInputChange}
                      placeholder="Enter coupon code"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26422] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F26422] file:text-white hover:file:bg-[#d95a1f]"
                    />
                    {formData.image && (
                      <p className="mt-2 text-sm text-gray-400">
                        Selected: {formData.image.name}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#F26422] text-white py-3 rounded-md font-semibold hover:bg-[#d95a1f] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Audience Modal */}
        {showAudienceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#F26422] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Select Bulk Audience
                  </h2>
                  <button
                    onClick={() => {
                      setShowAudienceModal(false);
                      setShowCreateModal(true);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  {[
                    { key: "all", label: "All" },
                    { key: "allUser", label: "All User" },
                    { key: "allVendor", label: "All Vendor" },
                    { key: "itemInCart", label: "Item in Cart" },
                    { key: "normal", label: "Normal" },
                    { key: "buyer", label: "Buyer" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={bulkAudience[key]}
                        onChange={() => handleBulkAudienceChange(key)}
                        className="w-5 h-5 text-[#F26422] rounded focus:ring-[#F26422] bg-gray-800 border-gray-700"
                      />
                      <span className="font-medium text-white">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Vendor's Audience
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-white mb-2">
                      Select Vendor
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={vendorSearch}
                        onChange={(e) => setVendorSearch(e.target.value)}
                        placeholder="Search Order by Order Id, Products, User name, Tag"
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      />
                      <button className="bg-[#F26422] text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#d95a1f] transition-colors font-semibold">
                        <Search size={20} />
                        Search
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-white mb-3">
                      Vendor Audience
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { key: "allUser", label: "All User" },
                        { key: "itemInCart", label: "Item in Cart" },
                        { key: "normal", label: "Normal" },
                        { key: "buyer", label: "Buyer" },
                      ].map(({ key, label }) => (
                        <label
                          key={key}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={vendorAudience[key]}
                            onChange={() =>
                              setVendorAudience((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                            className="w-5 h-5 text-[#F26422] rounded focus:ring-[#F26422] bg-gray-800 border-gray-700"
                          />
                          <span className="font-medium text-white">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#F26422] bg-opacity-20 border border-[#F26422] rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#F26422] p-2 rounded-full">
                        <Bell className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white">Audience</p>
                        <p className="text-sm text-gray-400">
                          479375094350394S
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={selectAudience}
                  className="w-full bg-white text-black py-3 rounded-md font-bold text-lg hover:bg-gray-200 transition-all shadow-lg mt-6"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Notification Modal */}
        {showViewModal && selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#F26422] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Notification Details
                  </h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Title
                    </label>
                    <p className="text-xl font-bold text-white">
                      {selectedNotification.title}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Content
                    </label>
                    <p className="text-white bg-gray-800 p-4 rounded-md">
                      {selectedNotification.content}
                    </p>
                  </div>

                  {selectedNotification.couponCode && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Coupon Code
                      </label>
                      <div className="inline-block bg-[#F26422] text-white px-4 py-2 rounded-md text-lg font-bold">
                        {selectedNotification.couponCode}
                      </div>
                    </div>
                  )}

                  {selectedNotification.image && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Image
                      </label>
                      <img
                        src={selectedNotification.image}
                        alt="Notification"
                        className="rounded-md border border-gray-700 max-w-full h-auto"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-md">
                      <label className="block text-sm font-semibold text-gray-400 mb-1">
                        Audience
                      </label>
                      <p className="text-white font-medium">
                        {selectedNotification.audience}
                      </p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-md">
                      <label className="block text-sm font-semibold text-gray-400 mb-1">
                        Recipients
                      </label>
                      <p className="text-white font-medium">
                        {selectedNotification.recipients}
                      </p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-md">
                      <label className="block text-sm font-semibold text-gray-400 mb-1">
                        Date
                      </label>
                      <p className="text-white font-medium">
                        {selectedNotification.date}
                      </p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-md">
                      <label className="block text-sm font-semibold text-gray-400 mb-1">
                        Time
                      </label>
                      <p className="text-white font-medium">
                        {selectedNotification.time}
                      </p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-md">
                      <label className="block text-sm font-semibold text-gray-400 mb-1">
                        Status
                      </label>
                      <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedNotification.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-md">
                      <label className="block text-sm font-semibold text-gray-400 mb-1">
                        ID
                      </label>
                      <p className="text-white font-medium">
                        #{selectedNotification.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => {
                        handleDelete(selectedNotification.id);
                        setShowViewModal(false);
                      }}
                      className="flex-1 bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      Delete Notification
                    </button>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="flex-1 bg-gray-700 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
