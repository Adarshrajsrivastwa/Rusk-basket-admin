import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Settings,
  IndianRupee,
  Percent,
  Calendar,
  Wallet,
  DollarSign,
  Loader2,
} from "lucide-react";
import api from "../../api/api";
import { X } from "lucide-react";

const RiderCommissionManagement = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [commissionData, setCommissionData] = useState({
    type: "percentage",
    percentage: 10,
    fixedAmount: 0,
    subscriptionAmount: 0,
    subscriptionPeriod: "monthly",
  });
  const [saving, setSaving] = useState(false);

  // Fetch riders with wallet data from API
  const fetchRiders = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/riders/wallets`, {
        params: {
          page: page,
          limit: limit,
        },
      });

      const result = response.data;

      if (result.success) {
        setRiders(result.data.wallets || []);
        setPagination(
          result.data.pagination || {
            total: result.data.pagination?.total || 0,
            pages: result.data.pagination?.pages || 1,
            page: result.data.pagination?.page || page,
            limit: result.data.pagination?.limit || limit,
          },
        );
      } else {
        console.error("Failed to fetch riders:", result.message);
        setRiders([]);
      }
    } catch (error) {
      console.error("Error fetching riders:", error);
      setRiders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders(currentPage, 10);
  }, [currentPage]);

  // Open modal to set commission
  const handleSetCommission = (rider) => {
    setSelectedRider(rider);
    // Initialize with existing commission if available
    if (rider.commission || rider.commissionType) {
      setCommissionData({
        type: rider.commissionType || rider.commission?.type || "percentage",
        percentage:
          rider.commissionPercentage || rider.commission?.percentage || 10,
        fixedAmount: rider.commission?.fixedAmount || 0,
        subscriptionAmount: rider.commission?.subscriptionAmount || 0,
        subscriptionPeriod: rider.commission?.subscriptionPeriod || "monthly",
      });
    } else {
      setCommissionData({
        type: "percentage",
        percentage: 10,
        fixedAmount: 0,
        subscriptionAmount: 0,
        subscriptionPeriod: "monthly",
      });
    }
    setIsModalOpen(true);
  };

  // Save commission
  const handleSaveCommission = async () => {
    if (!selectedRider) return;

    try {
      setSaving(true);

      // Prepare payload based on commission type
      let payload = { type: commissionData.type };

      if (commissionData.type === "percentage") {
        payload.percentage = parseFloat(commissionData.percentage);
      } else if (commissionData.type === "fixed") {
        payload.fixedAmount = parseFloat(commissionData.fixedAmount);
      } else if (commissionData.type === "hybrid") {
        payload.percentage = parseFloat(commissionData.percentage);
        payload.fixedAmount = parseFloat(commissionData.fixedAmount);
      } else if (commissionData.type === "subscription") {
        payload.subscriptionAmount = parseFloat(
          commissionData.subscriptionAmount,
        );
        payload.subscriptionPeriod = commissionData.subscriptionPeriod;
      }

      const response = await api.put(
        `/api/admin/riders/${selectedRider.riderId || selectedRider._id}/commission`,
        payload,
      );

      const result = response.data;

      if (result.success) {
        alert("Commission updated successfully!");
        setIsModalOpen(false);
        setSelectedRider(null);
        fetchRiders(currentPage, 10); // Refresh riders list
      } else {
        alert(result.message || "Failed to update commission");
      }
    } catch (error) {
      console.error("Error updating commission:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Error updating commission. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Format commission display
  const formatCommission = (rider) => {
    if (!rider.commissionType && !rider.commission) return "Not Set";

    const commType = rider.commissionType || rider.commission?.type;
    const comm = rider.commission || {};

    if (commType === "percentage") {
      return `${rider.commissionPercentage || comm.percentage || 0}%`;
    } else if (commType === "fixed") {
      return `₹${comm.fixedAmount || 0}`;
    } else if (commType === "hybrid") {
      return `${comm.percentage || 0}% + ₹${comm.fixedAmount || 0}`;
    } else if (commType === "subscription") {
      return `₹${comm.subscriptionAmount || 0}/${comm.subscriptionPeriod || "monthly"}`;
    }
    return "Not Set";
  };

  // Filter riders by search
  const filteredRiders = riders.filter((rider) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        rider.fullName?.toLowerCase().includes(searchLower) ||
        rider.mobileNumber?.toLowerCase().includes(searchLower) ||
        rider.riderId?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr
          key={i}
          className="border-b border-gray-200 animate-pulse bg-white rounded-sm"
        >
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="p-3">
              <div className="h-4 bg-gray-200 rounded w-[80%]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Empty State
  const EmptyState = () => (
    <tbody>
      <tr>
        <td
          colSpan="7"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No riders found.
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-2 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
          {/* Search */}
          <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px] mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search Rider by Name, Mobile..."
              className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Rider Name</th>
              <th className="p-3 text-left">Mobile Number</th>
              <th className="p-3 text-left">Wallet Balance</th>
              <th className="p-3 text-left">Due Balance</th>
              <th className="p-3 text-left">Current Commission</th>
              <th className="p-3 pr-32 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredRiders.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {filteredRiders.map((rider, idx) => (
                <tr
                  key={rider.riderId || rider._id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">
                    {(currentPage - 1) * pagination.limit + idx + 1}
                  </td>
                  <td className="p-3 font-semibold">
                    {rider.fullName || "N/A"}
                  </td>
                  <td className="p-3">{rider.mobileNumber || "N/A"}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-700">
                        ₹{rider.walletBalance?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-orange-700">
                        ₹{rider.dueBalance?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-gray-700">
                    {formatCommission(rider)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleSetCommission(rider)}
                      className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-4 py-2 rounded text-xs sm:text-sm flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Set Commission
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredRiders.length > 0 && pagination.pages > 1 && (
        <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto pl-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-black font-medium">
            {(() => {
              const pages = [];
              const totalPages = pagination.pages;
              const visiblePages = new Set([
                1,
                2,
                totalPages - 1,
                totalPages,
                currentPage - 1,
                currentPage,
                currentPage + 1,
              ]);
              for (let i = 1; i <= totalPages; i++) {
                if (visiblePages.has(i)) pages.push(i);
                else if (pages[pages.length - 1] !== "...") pages.push("...");
              }
              return pages.map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-1 text-black select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-1 hover:text-orange-500 transition-colors ${
                      currentPage === page
                        ? "text-orange-600 font-semibold"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                ),
              );
            })()}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))
            }
            disabled={currentPage === pagination.pages}
            className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Commission Modal */}
      {isModalOpen && selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Set Commission - {selectedRider.fullName || "Rider"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Mobile: {selectedRider.mobileNumber || "N/A"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedRider(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Wallet Balance Info */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-b">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                Wallet Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Wallet Balance</p>
                  <p className="text-lg font-bold text-green-700">
                    ₹{selectedRider.walletBalance?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Due Balance</p>
                  <p className="text-lg font-bold text-orange-700">
                    ₹{selectedRider.dueBalance?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Commission Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Commission Type
                </label>
                <select
                  value={commissionData.type}
                  onChange={(e) =>
                    setCommissionData({
                      ...commissionData,
                      type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="hybrid">Hybrid (Percentage + Fixed)</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              {/* Percentage Commission */}
              {commissionData.type === "percentage" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={commissionData.percentage}
                    onChange={(e) =>
                      setCommissionData({
                        ...commissionData,
                        percentage: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    placeholder="10"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Example: 10% means 10% of order value
                  </p>
                </div>
              )}

              {/* Fixed Commission */}
              {commissionData.type === "fixed" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Fixed Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={commissionData.fixedAmount}
                    onChange={(e) =>
                      setCommissionData({
                        ...commissionData,
                        fixedAmount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    placeholder="20"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Example: ₹20 per order
                  </p>
                </div>
              )}

              {/* Hybrid Commission */}
              {commissionData.type === "hybrid" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={commissionData.percentage}
                      onChange={(e) =>
                        setCommissionData({
                          ...commissionData,
                          percentage: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Fixed Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={commissionData.fixedAmount}
                      onChange={(e) =>
                        setCommissionData({
                          ...commissionData,
                          fixedAmount: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                      placeholder="20"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Example: 5% + ₹20 means 5% of order value plus ₹20 per order
                  </p>
                </div>
              )}

              {/* Subscription Commission */}
              {commissionData.type === "subscription" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Subscription Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={commissionData.subscriptionAmount}
                      onChange={(e) =>
                        setCommissionData({
                          ...commissionData,
                          subscriptionAmount: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                      placeholder="500"
                    />
                    <p className="mt-1 text-xs text-red-600">
                      ⚠️ Subscription amount will be automatically deducted from
                      rider wallet
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Subscription Period
                    </label>
                    <select
                      value={commissionData.subscriptionPeriod}
                      onChange={(e) =>
                        setCommissionData({
                          ...commissionData,
                          subscriptionPeriod: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500">
                    Example: ₹500/month means rider pays ₹500 per month
                    (deducted from wallet)
                  </p>
                </div>
              )}

              {/* Preview */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Commission Preview:
                </p>
                <p className="text-lg font-bold text-[#FF7B1D]">
                  {commissionData.type === "percentage" &&
                    `${commissionData.percentage || 0}%`}
                  {commissionData.type === "fixed" &&
                    `₹${commissionData.fixedAmount || 0} per order`}
                  {commissionData.type === "hybrid" &&
                    `${commissionData.percentage || 0}% + ₹${commissionData.fixedAmount || 0} per order`}
                  {commissionData.type === "subscription" &&
                    `₹${commissionData.subscriptionAmount || 0}/${commissionData.subscriptionPeriod || "monthly"}`}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedRider(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCommission}
                disabled={saving}
                className="px-6 py-2 bg-[#FF7B1D] text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Commission"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RiderCommissionManagement;
