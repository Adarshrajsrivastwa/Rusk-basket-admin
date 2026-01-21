import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { BASE_URL } from "../../api/api";

export default function OfferViewModal({
  isOpen,
  onClose,
  offer: offerProp,
  offerId: offerIdProp,
}) {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If offer object is passed directly, use it
    if (isOpen && offerProp) {
      setOffer(offerProp);
      setLoading(false);
      setError(null);
    }
    // Otherwise fetch by offerId
    else if (isOpen && offerIdProp) {
      fetchOfferData();
    }
  }, [isOpen, offerProp, offerIdProp]);

  const fetchOfferData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/api/coupon/${offerIdProp}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch offer data");
      }

      const result = await response.json();

      if (result.success && result.data) {
        setOffer(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching offer:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {loading ? "Loading..." : offer?.couponName || "Offer Details"}
              </h2>
              <p className="text-orange-100 text-sm mt-1">Offer Details</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading offer details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold">Error loading offer</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={fetchOfferData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && offer && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    offer.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {offer.status === "active" ? "● Active" : "● Inactive"}
                </span>
                {offer.isActive && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Currently Available
                  </span>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-xs text-gray-500 font-semibold uppercase">
                    Offer ID
                  </label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {offer.offerId}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-xs text-gray-500 font-semibold uppercase">
                    Coupon Code
                  </label>
                  <p className="text-lg font-bold text-orange-600 mt-1">
                    {offer.code}
                  </p>
                </div>
              </div>

              {/* Discount Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Discount Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <label className="text-xs text-orange-600 font-semibold uppercase">
                      Offer Type
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1 capitalize">
                      {offer.offerType}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <label className="text-xs text-orange-600 font-semibold uppercase">
                      Discount Value
                    </label>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      {offer.offerType === "percentage"
                        ? `${offer.discountPercentage}%`
                        : `₹${offer.discountPercentage}`}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <label className="text-xs text-orange-600 font-semibold uppercase">
                      Applied On
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1 capitalize">
                      {offer.appliedOn === "all"
                        ? "All Products"
                        : offer.appliedOn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Limits */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Amount Limits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="text-xs text-blue-600 font-semibold uppercase">
                      Minimum Amount
                    </label>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      ₹{offer.minAmount}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="text-xs text-blue-600 font-semibold uppercase">
                      Maximum Amount
                    </label>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      ₹{offer.maxAmount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Validity Period
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <label className="text-xs text-green-600 font-semibold uppercase">
                      Valid From
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {formatDate(offer.validFrom)}
                    </p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <label className="text-xs text-red-600 font-semibold uppercase">
                      Valid Until
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {formatDate(offer.validUntil)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Usage Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold uppercase">
                      Usage Limit
                    </label>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {offer.usageLimit}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold uppercase">
                      Times Used
                    </label>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {offer.usedCount || 0}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold uppercase">
                      Remaining
                    </label>
                    <p className="text-xl font-bold text-purple-600 mt-1">
                      {offer.usageLimit - (offer.usedCount || 0)}
                    </p>
                  </div>
                </div>

                {/* Usage Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Usage Progress</span>
                    <span>
                      {(
                        ((offer.usedCount || 0) / offer.usageLimit) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((offer.usedCount || 0) / offer.usageLimit) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notification Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        offer.sendNotification ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Send Notification
                      </p>
                      <p className="text-xs text-gray-500">
                        {offer.sendNotification ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        offer.notificationSent ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Notification Sent
                      </p>
                      <p className="text-xs text-gray-500">
                        {offer.notificationSent ? "Yes" : "Not yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories & Products */}
              {(offer.categories?.length > 0 || offer.products?.length > 0) && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Applied To
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offer.categories?.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-xs text-gray-600 font-semibold uppercase mb-2 block">
                          Categories ({offer.categories.length})
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {offer.categories.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {offer.products?.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-xs text-gray-600 font-semibold uppercase mb-2 block">
                          Products ({offer.products.length})
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {offer.products.map((prod, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                              {prod}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Created By & Timestamps */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {offer.createdBy && (
                    <div className="bg-gray-50 p-3 rounded">
                      <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">
                        Created By
                      </label>
                      <p className="font-semibold text-gray-900">
                        {offer.createdBy.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {offer.createdBy.email || ""}
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-3 rounded">
                    <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">
                      Created At
                    </label>
                    <p className="text-gray-900">
                      {formatDateTime(offer.createdAt)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {formatDateTime(offer.updatedAt)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">
                      Offer ID (Database)
                    </label>
                    <p className="text-xs text-gray-600 font-mono break-all">
                      {offer._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-lg border-t">
          <button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
