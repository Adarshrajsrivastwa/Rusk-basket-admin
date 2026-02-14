import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Search,
  Tag,
  Calendar,
  Percent,
  ToggleLeft,
  ToggleRight,
  Edit,
  X,
  Check,
  AlertCircle,
  Clock,
} from "lucide-react";
import api from "../../api/api";

const VendorDailyOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOffers, setTotalOffers] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const itemsPerPage = 10;

  const [editForm, setEditForm] = useState({
    offerEnabled: false,
    offerDiscountPercentage: 0,
    offerStartDate: "",
    offerStartTime: "",
    offerEndDate: "",
    offerEndTime: "",
    isDailyOffer: false,
  });

  // Fetch offers
  const fetchOffers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await api.get(
        `/api/vendor/products/offers?${params.toString()}`,
      );
      if (response.data.success) {
        setOffers(response.data.data || []);
        setTotalOffers(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 1);
      } else {
        setError(response.data.message || "Failed to load offers");
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load offers. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentPage, statusFilter]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchOffers();
  };

  // Open edit modal
  const handleEditOffer = (product) => {
    setSelectedProduct(product);
    
    // Extract date and time from offerStartDate
    let startDate = "";
    let startTime = "";
    if (product.offerStartDate) {
      const startDateTime = new Date(product.offerStartDate);
      startDate = startDateTime.toISOString().split("T")[0];
      // Extract time in HH:MM format
      const hours = String(startDateTime.getHours()).padStart(2, "0");
      const minutes = String(startDateTime.getMinutes()).padStart(2, "0");
      startTime = `${hours}:${minutes}`;
    }
    
    // Extract date and time from offerEndDate
    let endDate = "";
    let endTime = "";
    if (product.offerEndDate) {
      const endDateTime = new Date(product.offerEndDate);
      endDate = endDateTime.toISOString().split("T")[0];
      // Extract time in HH:MM format
      const hours = String(endDateTime.getHours()).padStart(2, "0");
      const minutes = String(endDateTime.getMinutes()).padStart(2, "0");
      endTime = `${hours}:${minutes}`;
    }
    
    setEditForm({
      offerEnabled: product.offerEnabled || false,
      offerDiscountPercentage: product.offerDiscountPercentage || 0,
      offerStartDate: startDate,
      offerStartTime: startTime,
      offerEndDate: endDate,
      offerEndTime: endTime,
      isDailyOffer: product.isDailyOffer || false,
    });
    setShowEditModal(true);
  };

  // Update offer
  const handleUpdateOffer = async () => {
    if (!selectedProduct) return;

    // Validation
    if (editForm.offerEnabled && editForm.offerDiscountPercentage <= 0) {
      setError(
        "Discount percentage must be greater than 0 when offer is enabled",
      );
      return;
    }

    // Validate date and time combination - End must be after Start
    if (editForm.offerStartDate && editForm.offerEndDate) {
      let startDateTime = new Date(editForm.offerStartDate);
      let endDateTime = new Date(editForm.offerEndDate);
      
      // Add time if provided
      if (editForm.offerStartTime) {
        const timeParts = editForm.offerStartTime.split(":");
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = parseInt(timeParts[2]) || 0;
        startDateTime.setHours(hours, minutes, seconds, 0);
      } else {
        startDateTime.setHours(0, 0, 0, 0);
      }
      
      if (editForm.offerEndTime) {
        const timeParts = editForm.offerEndTime.split(":");
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = parseInt(timeParts[2]) || 0;
        endDateTime.setHours(hours, minutes, seconds, 0);
      } else {
        endDateTime.setHours(23, 59, 59, 999);
      }
      
      if (endDateTime <= startDateTime) {
        setError("End date and time must be after start date and time");
        return;
      }
    } else if (editForm.offerStartDate && !editForm.offerEndDate) {
      setError("Please provide end date if start date is provided");
      return;
    } else if (!editForm.offerStartDate && editForm.offerEndDate) {
      setError("Please provide start date if end date is provided");
      return;
    }

    setUpdating(true);
    setError("");
    try {
      // Build payload - all fields are optional as per API spec
      const payload = {};

      // Only include fields that have values
      if (editForm.offerEnabled !== undefined) {
        payload.offerEnabled = editForm.offerEnabled;
      }

      if (editForm.offerDiscountPercentage !== undefined && editForm.offerDiscountPercentage !== null) {
        payload.offerDiscountPercentage = parseFloat(editForm.offerDiscountPercentage) || 0;
      }

      if (editForm.isDailyOffer !== undefined) {
        payload.isDailyOffer = editForm.isDailyOffer;
      }

      // Handle start date and time
      if (editForm.offerStartDate) {
        payload.offerStartDate = editForm.offerStartDate;
        if (editForm.offerStartTime) {
          // Convert HH:MM to HH:MM:SS format if needed
          let startTime = editForm.offerStartTime;
          if (startTime.length === 5) {
            // If format is HH:MM, convert to HH:MM:SS
            startTime = `${startTime}:00`;
          }
          // Validate time format (HH:MM:SS)
          const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
          if (timePattern.test(startTime)) {
            payload.offerStartTime = startTime;
          }
        }
      }

      // Handle end date and time
      if (editForm.offerEndDate) {
        payload.offerEndDate = editForm.offerEndDate;
        if (editForm.offerEndTime) {
          // Convert HH:MM to HH:MM:SS format if needed
          let endTime = editForm.offerEndTime;
          if (endTime.length === 5) {
            // If format is HH:MM, convert to HH:MM:SS
            endTime = `${endTime}:00`;
          }
          // Validate time format (HH:MM:SS)
          const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
          if (timePattern.test(endTime)) {
            payload.offerEndTime = endTime;
          }
        }
      }

      console.log("Updating offer with payload:", payload);

      const response = await api.put(
        `/api/vendor/daily-offers/${selectedProduct._id}`,
        payload,
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        setError(""); // Clear errors
        setShowEditModal(false);
        setSelectedProduct(null);
        fetchOffers(); // Refresh list
      } else {
        setError(
          response.data.message ||
            response.data.error ||
            "Failed to update offer",
        );
      }
    } catch (err) {
      console.error("Error updating offer:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update offer. Please try again.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // Toggle offer quickly
  const handleQuickToggle = async (product) => {
    if (togglingId === product._id) return; // Prevent double clicks

    setTogglingId(product._id);
    setError("");

    try {
      // Toggle daily offer flag
      const newIsDailyOffer = !product.isDailyOffer;
      const payload = {
        isDailyOffer: newIsDailyOffer,
      };

      // If enabling daily offer, also enable the offer if it's disabled
      if (newIsDailyOffer && !product.offerEnabled) {
        payload.offerEnabled = true;

        // If no discount percentage exists, calculate from prices or set default
        if (
          !product.offerDiscountPercentage ||
          product.offerDiscountPercentage === 0
        ) {
          if (
            product.regularPrice &&
            product.salePrice &&
            product.regularPrice > product.salePrice
          ) {
            const calculatedDiscount =
              ((product.regularPrice - product.salePrice) /
                product.regularPrice) *
              100;
            payload.offerDiscountPercentage = Math.round(calculatedDiscount);
          } else {
            payload.offerDiscountPercentage = 10; // Default 10%
          }
        } else {
          payload.offerDiscountPercentage = product.offerDiscountPercentage;
        }
      } else if (newIsDailyOffer) {
        // Keep existing discount if offer is already enabled
        payload.offerDiscountPercentage = product.offerDiscountPercentage || 10;
      }

      console.log("Toggling daily offer with payload:", payload);

      const response = await api.put(
        `/api/vendor/daily-offers/${product._id}`,
        payload,
      );

      console.log("Toggle response:", response.data);

      if (response.data.success) {
        setError(""); // Clear any previous errors
        // Update local state immediately for better UX
        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer._id === product._id
              ? {
                  ...offer,
                  isDailyOffer: newIsDailyOffer,
                  offerEnabled: newIsDailyOffer ? true : offer.offerEnabled,
                }
              : offer,
          ),
        );
        // Also refresh from server to get latest data
        setTimeout(() => fetchOffers(), 500);
      } else {
        setError(
          response.data.message ||
            response.data.error ||
            "Failed to toggle offer",
        );
      }
    } catch (err) {
      console.error("Error toggling offer:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to toggle offer. Please try again.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Get offer status based on current date/time
  const getOfferStatus = (product) => {
    if (!product.offerEnabled) return "disabled";
    if (!product.isDailyOffer) return "regular";

    const now = new Date();
    
    // Parse start date and time
    let startDateTime = null;
    if (product.offerStartDate) {
      startDateTime = new Date(product.offerStartDate);
      // Add start time if available
      if (product.offerStartTime) {
        const timeParts = product.offerStartTime.split(":");
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = parseInt(timeParts[2]) || 0;
        startDateTime.setHours(hours, minutes, seconds, 0);
      } else {
        startDateTime.setHours(0, 0, 0, 0);
      }
    }
    
    // Parse end date and time
    let endDateTime = null;
    if (product.offerEndDate) {
      endDateTime = new Date(product.offerEndDate);
      // Add end time if available
      if (product.offerEndTime) {
        const timeParts = product.offerEndTime.split(":");
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = parseInt(timeParts[2]) || 0;
        endDateTime.setHours(hours, minutes, seconds, 0);
      } else {
        endDateTime.setHours(23, 59, 59, 999);
      }
    }

    // Check if current time is before start
    if (startDateTime && now < startDateTime) return "upcoming";
    
    // Check if current time is after end
    if (endDateTime && now > endDateTime) return "expired";
    
    // Check if current time is within the offer period
    if (startDateTime && endDateTime) {
      if (now >= startDateTime && now <= endDateTime) {
        return "active";
      }
    } else if (startDateTime && now >= startDateTime) {
      return "active";
    } else if (endDateTime && now <= endDateTime) {
      return "active";
    } else if (!startDateTime && !endDateTime) {
      // No date restrictions, check if enabled
      return product.offerEnabled ? "active" : "disabled";
    }
    
    return "active";
  };
  
  // Check if offer is currently active (for display in Actions column)
  const isOfferCurrentlyActive = (offer) => {
    if (!offer.offerEnabled || !offer.isDailyOffer) return false;
    
    const now = new Date();
    
    // Parse start date and time
    let startDateTime = null;
    if (offer.offerStartDate) {
      startDateTime = new Date(offer.offerStartDate);
      if (offer.offerStartTime) {
        const timeParts = offer.offerStartTime.split(":");
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = parseInt(timeParts[2]) || 0;
        startDateTime.setHours(hours, minutes, seconds, 0);
      } else {
        startDateTime.setHours(0, 0, 0, 0);
      }
    }
    
    // Parse end date and time
    let endDateTime = null;
    if (offer.offerEndDate) {
      endDateTime = new Date(offer.offerEndDate);
      if (offer.offerEndTime) {
        const timeParts = offer.offerEndTime.split(":");
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = parseInt(timeParts[2]) || 0;
        endDateTime.setHours(hours, minutes, seconds, 0);
      } else {
        endDateTime.setHours(23, 59, 59, 999);
      }
    }
    
    // Check if current time is within the offer period
    if (startDateTime && endDateTime) {
      return now >= startDateTime && now <= endDateTime;
    } else if (startDateTime) {
      return now >= startDateTime;
    } else if (endDateTime) {
      return now <= endDateTime;
    } else {
      // No date restrictions, check if enabled
      return offer.offerEnabled && offer.isDailyOffer;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter offers by search
  const filteredOffers = offers.filter((offer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      offer.productName?.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: totalOffers,
    active: offers.filter((o) => getOfferStatus(o) === "active").length,
    upcoming: offers.filter((o) => getOfferStatus(o) === "upcoming").length,
    expired: offers.filter((o) => getOfferStatus(o) === "expired").length,
    daily: offers.filter((o) => o.isDailyOffer).length,
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 ml-6">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Daily Offers Management
            </h1>
            <p className="text-gray-600">
              Manage daily offers and discounts for your products
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Offers</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.total}
                  </p>
                </div>
                <Tag className="text-orange-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <Check className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.upcoming}
                  </p>
                </div>
                <Clock className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.expired}
                  </p>
                </div>
                <AlertCircle className="text-red-500" size={24} />
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Daily Offers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.daily}
                  </p>
                </div>
                <Tag className="text-purple-500" size={24} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-sm shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      statusFilter === "all"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("active");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      statusFilter === "active"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("upcoming");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      statusFilter === "upcoming"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("expired");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      statusFilter === "expired"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Expired
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("enabled");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      statusFilter === "enabled"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    Enabled
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors font-medium"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Offers Table */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            {loading && offers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading offers...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-orange-500 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-bold uppercase">
                          S.N
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold uppercase">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold uppercase">
                          Discount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold uppercase">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOffers.map((offer, index) => {
                        return (
                          <tr
                            key={offer._id}
                            className="hover:bg-orange-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs">
                                <div className="font-medium text-gray-900">
                                  {offer.productName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ₹{offer.regularPrice} → ₹
                                  {offer.salePrice || offer.regularPrice}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                <Percent size={14} />
                                {offer.offerDiscountPercentage || 0}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div>
                                  <span className="text-gray-500">Start: </span>
                                  {formatDate(offer.offerStartDate)}
                                </div>
                                <div>
                                  <span className="text-gray-500">End: </span>
                                  {formatDate(offer.offerEndDate)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {/* Show Offer Status based on current date/time check */}
                                {isOfferCurrentlyActive(offer) ? (
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    Offer Enabled
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                    Disabled
                                  </span>
                                )}
                                <button
                                  onClick={() => handleEditOffer(offer)}
                                  className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors flex items-center gap-1"
                                >
                                  <Edit size={14} />
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredOffers.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No offers found</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium rounded hover:bg-orange-600 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Back
              </button>

              <div className="flex items-center gap-2 text-sm text-black font-medium">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-2 py-1 rounded transition-colors ${
                      currentPage === idx + 1
                        ? "text-orange-600 font-semibold"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="bg-[#247606] text-white px-10 py-3 text-sm font-medium rounded hover:bg-green-800 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Edit Offer Modal */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-orange-500 text-white rounded-t-lg">
                <h2 className="text-2xl font-bold">
                  Edit Offer - {selectedProduct.productName}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setError("");
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.offerEnabled}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          offerEnabled: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="font-medium">Enable Offer</span>
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isDailyOffer}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          isDailyOffer: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="font-medium">Mark as Daily Offer</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.offerDiscountPercentage}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        offerDiscountPercentage:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={editForm.offerStartDate}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          offerStartDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time (Optional) - HH:MM
                    </label>
                    <input
                      type="time"
                      value={editForm.offerStartTime}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          offerStartTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="HH:MM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={editForm.offerEndDate}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          offerEndDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time (Optional) - HH:MM
                    </label>
                    <input
                      type="time"
                      value={editForm.offerEndTime}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          offerEndTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="HH:MM"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setError("");
                  }}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateOffer}
                  disabled={updating}
                  className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Offer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VendorDailyOffers;
