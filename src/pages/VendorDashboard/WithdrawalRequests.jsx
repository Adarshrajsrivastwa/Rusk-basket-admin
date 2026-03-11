import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/api";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  AlertCircle,
  Loader2,
  Plus,
  Wallet,
  X,
} from "lucide-react";

const VendorWithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [showWalletPopup, setShowWalletPopup] = useState(false);

  // Fetch withdrawal requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        "/api/vendor/wallet/earning/withdrawal-requests",
      );

      const result = response.data;

      :", JSON.stringify(result, null, 2));
      );
      ,
      );
      ,
      );
      ? "Array" : typeof result.data,
      );
      ? result.data.length : "Not an array",
      );
      if (Array.isArray(result.data)) {
        :",
          JSON.stringify(result.data, null, 2),
        );
      }
      if (Array.isArray(result.data)) {
        result.data.forEach((request, index) => {
          :",
            JSON.stringify(request, null, 2),
          );
          );
          // Log all properties
          Object.keys(request).forEach((key) => {
            });
        });
        } else {
        }

      if (result.success) {
        setRequests(result.data || []);
        // Set available balance from earningWallet.currentBalance
        if (result.earningWallet?.currentBalance !== undefined) {
          const balance = parseFloat(result.earningWallet.currentBalance) || 0;
          setAvailableBalance(balance);
          // Show wallet amount popup
          setShowWalletPopup(true);
        }

        // Summary log
        } else {
        setError(result.message || "Failed to fetch withdrawal requests");
        setRequests([]);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error fetching withdrawal requests",
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle create withdrawal request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawalAmount) > availableBalance) {
      setError("Withdrawal amount cannot exceed available balance");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);

      const response = await api.post("/api/vendor/wallet/earning/send", {
        amount: parseFloat(withdrawalAmount),
      });

      const result = response.data;

      if (result.success) {
        setSuccess("Withdrawal request created successfully!");
        setIsCreateModalOpen(false);
        setWithdrawalAmount("");
        fetchRequests();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to create withdrawal request");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error creating withdrawal request",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString("en-IN")}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr
          key={i}
          className="border-b border-gray-200 animate-pulse bg-white rounded-sm"
        >
          {Array.from({ length: 5 }).map((__, j) => (
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
          colSpan="5"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No withdrawal requests found.
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 mx-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
          <CheckCircle size={24} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 mx-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
          <AlertCircle size={24} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Withdrawal Requests
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View and create withdrawal requests
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pl-4 max-w-[99%] mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {requests.length}
              </p>
            </div>
            <Wallet className="text-orange-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <AlertCircle className="text-yellow-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {requests.filter((r) => r.status === "approved").length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {requests.filter((r) => r.status === "rejected").length}
              </p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Request ID</th>
              <th className="p-3 text-left">Request Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Request Date</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {requests.map((request, idx) => (
                <tr
                  key={request._id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-mono text-xs">
                    {request._id?.slice(-8) || "N/A"}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    {formatCurrency(request.amount)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        request.status,
                      )}`}
                    >
                      {request.status
                        ? request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)
                        : "Pending"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {formatDate(request.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Create Withdrawal Request Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Create Withdrawal Request
              </h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setWithdrawalAmount("");
                  setError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Balance
                </label>
                <input
                  type="text"
                  value={formatCurrency(availableBalance)}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Withdrawal Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={availableBalance}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter withdrawal amount"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {formatCurrency(availableBalance)}
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setWithdrawalAmount("");
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-[#FF7B1D] text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Amount Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Wallet className="text-orange-500" size={24} />
                Wallet Balance
              </h2>
              <button
                onClick={() => setShowWalletPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Available Balance
                  </p>
                  <p className="text-4xl font-bold text-green-600">
                    {formatCurrency(availableBalance)}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  This is your current wallet balance available for withdrawal.
                </p>
                <button
                  onClick={() => {
                    setShowWalletPopup(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full px-4 py-2 bg-[#FF7B1D] text-white rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Create Withdrawal Request
                </button>
                <button
                  onClick={() => setShowWalletPopup(false)}
                  className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default VendorWithdrawalRequests;
