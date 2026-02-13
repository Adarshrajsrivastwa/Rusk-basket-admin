import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Settings, IndianRupee, Percent, Calendar } from "lucide-react";
import api from "../../api/api";
import { X } from "lucide-react";

const VendorCommissionManagement = () => {
  const [vendors, setVendors] = useState([]);
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
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [commissionData, setCommissionData] = useState({
    type: "percentage",
    percentage: 10,
    fixedAmount: 20,
    subscriptionAmount: 999,
    subscriptionPeriod: "monthly",
  });
  const [saving, setSaving] = useState(false);

  // Fetch vendors from API
  const fetchVendors = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/vendor`, {
        params: {
          page: page,
          limit: limit,
        },
      });

      const result = response.data;

      if (result.success) {
        setVendors(result.data || []);
        setPagination(
          result.pagination || {
            total: result.count || 0,
            pages: 1,
            page: page,
            limit: limit,
          }
        );
      } else {
        console.error("Failed to fetch vendors:", result.message);
        setVendors([]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(currentPage, 10);
  }, [currentPage]);

  // Open modal to set commission
  const handleSetCommission = (vendor) => {
    setSelectedVendor(vendor);
    // Initialize with existing commission if available
    if (vendor.commission) {
      setCommissionData({
        type: vendor.commission.type || "percentage",
        percentage: vendor.commission.percentage || 10,
        fixedAmount: vendor.commission.fixedAmount || 20,
        subscriptionAmount: vendor.commission.subscriptionAmount || 999,
        subscriptionPeriod: vendor.commission.subscriptionPeriod || "monthly",
      });
    } else {
      setCommissionData({
        type: "percentage",
        percentage: 10,
        fixedAmount: 20,
        subscriptionAmount: 999,
        subscriptionPeriod: "monthly",
      });
    }
    setIsModalOpen(true);
  };

  // Save commission
  const handleSaveCommission = async () => {
    if (!selectedVendor) return;

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
        payload.subscriptionAmount = parseFloat(commissionData.subscriptionAmount);
        payload.subscriptionPeriod = commissionData.subscriptionPeriod;
      }

      // Try multiple endpoint paths
      let response;
      let endpointUsed = '';
      let error = null;

      // Try endpoint 1: /api/vendor/{id}/commission
      try {
        endpointUsed = `/api/vendor/${selectedVendor._id}/commission`;
        console.log("📍 Trying endpoint:", endpointUsed);
        response = await api.put(endpointUsed, payload);
        console.log("✅ Endpoint SUCCESS!");
      } catch (firstError) {
        console.log("❌ Endpoint 1 FAILED");
        error = firstError;
        
        // Try endpoint 2: /vendor/{id}/commission (without /api)
        if (firstError.response?.status === 404) {
          try {
            endpointUsed = `/vendor/${selectedVendor._id}/commission`;
            console.log("📍 Trying endpoint 2:", endpointUsed);
            response = await api.put(endpointUsed, payload);
            console.log("✅ Endpoint 2 SUCCESS!");
            error = null;
          } catch (secondError) {
            console.log("❌ Endpoint 2 FAILED");
            error = secondError;
          }
        }
      }

      if (error) {
        throw error;
      }

      const result = response.data;

      if (result.success) {
        alert("Commission updated successfully!");
        setIsModalOpen(false);
        setSelectedVendor(null);
        fetchVendors(currentPage, 10); // Refresh vendors list
      } else {
        alert(result.message || "Failed to update commission");
      }
    } catch (error) {
      console.error("Error updating commission:", error);
      
      // More informative error message
      if (error.response?.status === 404) {
        alert(
          "Commission endpoint not found. Please ensure the backend API endpoint is implemented:\n" +
          `PUT /api/vendor/${selectedVendor._id}/commission\n\n` +
          "Error: " + (error.response?.data?.message || "Endpoint not found")
        );
      } else {
        alert(
          error.response?.data?.message ||
          error.message ||
          "Error updating commission. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Format commission display
  const formatCommission = (vendor) => {
    if (!vendor.commission) return "Not Set";
    const comm = vendor.commission;

    if (comm.type === "percentage") {
      return `${comm.percentage || 0}%`;
    } else if (comm.type === "fixed") {
      return `₹${comm.fixedAmount || 0}`;
    } else if (comm.type === "hybrid") {
      return `${comm.percentage || 0}% + ₹${comm.fixedAmount || 0}`;
    } else if (comm.type === "subscription") {
      return `₹${comm.subscriptionAmount || 0}/${comm.subscriptionPeriod || "monthly"}`;
    }
    return "Not Set";
  };

  // Filter vendors by search
  const filteredVendors = vendors.filter((vendor) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        vendor.vendorName?.toLowerCase().includes(searchLower) ||
        vendor.storeId?.toLowerCase().includes(searchLower) ||
        vendor.storeName?.toLowerCase().includes(searchLower) ||
        vendor.contactNumber?.toLowerCase().includes(searchLower)
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
          {Array.from({ length: 6 }).map((__, j) => (
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
          colSpan="6"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No vendors found.
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
          <h1 className="text-2xl font-bold text-gray-800">
            Vendor Commission Management
          </h1>

          {/* Search */}
          <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px] mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search Vendor by Name, ID..."
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
              <th className="p-3 text-left">Vendor ID</th>
              <th className="p-3 text-left">Vendor Name</th>
              <th className="p-3 text-left">Store Name</th>
              <th className="p-3 text-left">Current Commission</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredVendors.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {filteredVendors.map((vendor, idx) => (
                <tr
                  key={vendor._id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">
                    {(currentPage - 1) * pagination.limit + idx + 1}
                  </td>
                  <td className="p-3 font-mono text-xs">
                    {vendor.storeId || "N/A"}
                  </td>
                  <td className="p-3">{vendor.vendorName || "N/A"}</td>
                  <td className="p-3">{vendor.storeName || "N/A"}</td>
                  <td className="p-3 font-semibold text-gray-700">
                    {formatCommission(vendor)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleSetCommission(vendor)}
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
      {!loading && filteredVendors.length > 0 && pagination.pages > 1 && (
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
                )
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
      {isModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Set Commission - {selectedVendor.vendorName || selectedVendor.storeName}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedVendor(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
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
                    setCommissionData({ ...commissionData, type: e.target.value })
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
                      placeholder="999"
                    />
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
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500">
                    Example: ₹999/month means vendor pays ₹999 per month
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
                  setSelectedVendor(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCommission}
                disabled={saving}
                className="px-6 py-2 bg-[#FF7B1D] text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Commission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default VendorCommissionManagement;
