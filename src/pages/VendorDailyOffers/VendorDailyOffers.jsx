import React, { useState, useEffect } from "react";
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
    
    // Parse date and time from API response
    // API returns: offerStartDateOnly (YYYY-MM-DD) and offerStartTime (HH:MM:SS)
    const startDate = product.offerStartDateOnly || 
      (product.offerStartDate ? new Date(product.offerStartDate).toISOString().split("T")[0] : "");
    const startTime = product.offerStartTime || 
      (product.offerStartDate ? new Date(product.offerStartDate).toTimeString().slice(0, 5) : "");
    const endDate = product.offerEndDateOnly || 
      (product.offerEndDate ? new Date(product.offerEndDate).toISOString().split("T")[0] : "");
    const endTime = product.offerEndTime || 
      (product.offerEndDate ? new Date(product.offerEndDate).toTimeString().slice(0, 5) : "");
    
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

    // Validate date and time
    if (editForm.offerStartDate && editForm.offerEndDate) {
      const startDateTime = new Date(`${editForm.offerStartDate}T${editForm.offerStartTime || "00:00"}`);
      const endDateTime = new Date(`${editForm.offerEndDate}T${editForm.offerEndTime || "23:59"}`);
      if (endDateTime <= startDateTime) {
        setError("End date/time must be after start date/time");
        return;
      }
    }

    setUpdating(true);
    setError("");
    try {
      const payload = {
        offerEnabled: editForm.offerEnabled,
        offerDiscountPercentage:
          parseFloat(editForm.offerDiscountPercentage) || 0,
        isDailyOffer: editForm.isDailyOffer,
      };

      // Send date and time separately as per new API structure
      if (editForm.offerStartDate) {
        payload.offerStartDate = editForm.offerStartDate; // YYYY-MM-DD format
        payload.offerStartTime = editForm.offerStartTime || "09:00"; // HH:MM format
      }

      if (editForm.offerEndDate) {
        payload.offerEndDate = editForm.offerEndDate; // YYYY-MM-DD format
        payload.offerEndTime = editForm.offerEndTime || "23:59"; // HH:MM format
      }

      console.log("Updating offer with payload:", payload);

      const response = await api.put(
        `/api/vendor/products/${selectedProduct._id}/offer`,
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
        `/api/vendor/products/${product._id}/offer`,
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

  // Get offer status
  const getOfferStatus = (product) => {
    if (!product.offerEnabled) return "disabled";
    if (!product.isDailyOffer) return "regular";

    const now = new Date();
    
    // Use separate date and time fields from API
    let startDateTime = null;
    let endDateTime = null;
    
    if (product.offerStartDateOnly && product.offerStartTime) {
      startDateTime = new Date(`${product.offerStartDateOnly}T${product.offerStartTime}`);
    } else if (product.offerStartDate) {
      startDateTime = new Date(product.offerStartDate);
    }
    
    if (product.offerEndDateOnly && product.offerEndTime) {
      endDateTime = new Date(`${product.offerEndDateOnly}T${product.offerEndTime}`);
    } else if (product.offerEndDate) {
      endDateTime = new Date(product.offerEndDate);
    }

    if (startDateTime && now < startDateTime) return "upcoming";
    if (endDateTime && now > endDateTime) return "expired";
    return "active";
  };

  // Format date and time
  const formatDate = (dateOnly, timeOnly) => {
    if (!dateOnly) return "N/A";
    
    // Format date
    const date = new Date(dateOnly);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    
    // Add time if available
    if (timeOnly) {
      // Format time (HH:MM:SS or HH:MM)
      const timeStr = timeOnly.length > 5 ? timeOnly.slice(0, 5) : timeOnly;
      return `${formattedDate} ${timeStr}`;
    }
    
    return formattedDate;
  };

  // Filter offers by search
  const filteredOffers = offers.filter((offer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      offer.productName?.toLowerCase().includes(query) ||
      offer.category?.categoryName?.toLowerCase().includes(query) ||
      offer.subCategory?.subCategoryName?.toLowerCase().includes(query)
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
          <div className="mb-8 bg-gradient-to-r from-orange-50 to-white p-6 rounded-lg border border-orange-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#FF7B1D] p-2 rounded-lg">
                <Tag className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Daily Offers Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage daily offers and discounts for your products
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-[#FF7B1D]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Total Offers</p>
                  <p className="text-3xl font-bold text-[#FF7B1D]">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Tag className="text-[#FF7B1D]" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.upcoming}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Expired</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.expired}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Daily Offers</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.daily}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Tag className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-orange-50 to-white border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      statusFilter === "all"
                        ? "bg-[#FF7B1D] text-white shadow-md transform scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#FF7B1D] hover:bg-orange-50"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("active");
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      statusFilter === "active"
                        ? "bg-[#FF7B1D] text-white shadow-md transform scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#FF7B1D] hover:bg-orange-50"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("upcoming");
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      statusFilter === "upcoming"
                        ? "bg-[#FF7B1D] text-white shadow-md transform scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#FF7B1D] hover:bg-orange-50"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("expired");
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      statusFilter === "expired"
                        ? "bg-[#FF7B1D] text-white shadow-md transform scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#FF7B1D] hover:bg-orange-50"
                    }`}
                  >
                    Expired
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("enabled");
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      statusFilter === "enabled"
                        ? "bg-[#FF7B1D] text-white shadow-md transform scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#FF7B1D] hover:bg-orange-50"
                    }`}
                  >
                    Enabled
                  </button>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-[#FF7B1D] text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg mb-4 shadow-md flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Offers Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading && offers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading offers...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                          S.N
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                          Discount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                          Daily Offer
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOffers.map((offer, index) => {
                        const status = getOfferStatus(offer);
                        return (
                          <tr
                            key={offer._id}
                            className="hover:bg-orange-50 transition-all duration-200 border-b border-gray-100"
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
                              <span className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
                                <Percent size={16} />
                                {offer.offerDiscountPercentage || 0}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`text-sm font-bold ${
                                  offer.isDailyOffer
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {offer.isDailyOffer ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div>
                                  <span className="text-gray-500">Start: </span>
                                  {formatDate(offer.offerStartDateOnly || offer.offerStartDate, offer.offerStartTime)}
                                </div>
                                <div>
                                  <span className="text-gray-500">End: </span>
                                  {formatDate(offer.offerEndDateOnly || offer.offerEndDate, offer.offerEndTime)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleEditOffer(offer)}
                                className="bg-[#FF7B1D] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <Tag className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">
                    Edit Offer - {selectedProduct.productName}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setError("");
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6 bg-gray-50">
                {/* DAILY OFFER Section */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="bg-[#FF7B1D] text-white px-4 py-2 rounded-t-lg -mt-4 -mx-4 mb-4">
                    <h3 className="font-bold text-sm uppercase">DAILY OFFER</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={editForm.isDailyOffer}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              isDailyOffer: e.target.checked,
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 rounded-full transition-all duration-300 ${
                            editForm.isDailyOffer
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                              editForm.isDailyOffer
                                ? "translate-x-7"
                                : "translate-x-1"
                            }`}
                            style={{ marginTop: "2px" }}
                          />
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          editForm.isDailyOffer
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {editForm.isDailyOffer ? "Yes" : "No"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Discount Percentage *
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      placeholder="Enter discount percentage"
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-[#FF7B1D]" />
                    Start Date & Time
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
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
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Start Time (Optional)
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
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-[#FF7B1D]" />
                    End Date & Time
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
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
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        End Time (Optional)
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
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-white flex gap-4 justify-end rounded-b-xl">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setError("");
                  }}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateOffer}
                  disabled={updating}
                  className="px-8 py-2.5 bg-[#FF7B1D] text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
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
