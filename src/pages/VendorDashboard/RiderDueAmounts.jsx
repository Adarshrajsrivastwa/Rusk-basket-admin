import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import { Bike, Edit, RefreshCw, X, Check } from "lucide-react";

export default function RiderDueAmountsPage() {
  const [riderDueAmounts, setRiderDueAmounts] = useState([]);
  const [riderDueLoading, setRiderDueLoading] = useState(false);
  const [riderDueSummary, setRiderDueSummary] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    dueAmount: "",
    description: "",
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRiderDueAmounts();
  }, []);

  const fetchRiderDueAmounts = async () => {
    setRiderDueLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/vendor/riders/due-amounts`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch rider due amounts: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setRiderDueAmounts(result.data || []);
        setRiderDueSummary(result.summary || null);
      } else {
        throw new Error(result.message || "Failed to fetch rider due amounts");
      }
    } catch (err) {
      console.error("Error fetching rider due amounts:", err);
      setError(err.message);
    } finally {
      setRiderDueLoading(false);
    }
  };

  const openUpdateModal = (rider) => {
    setSelectedRider(rider);
    setUpdateFormData({
      dueAmount: parseFloat(rider.dueBalance || 0).toFixed(2),
      description: "",
    });
    setIsUpdateModalOpen(true);
    setError(null);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedRider(null);
    setUpdateFormData({ dueAmount: "", description: "" });
    setError(null);
  };

  const handleUpdateDueAmount = async (e) => {
    e.preventDefault();
    if (!selectedRider || !updateFormData.dueAmount) {
      setError("Due amount is required.");
      return;
    }
    setUpdating(true);
    setError(null);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/vendor/riders/${selectedRider.riderId}/due-amount`,
        {
          method: "PUT",
          headers: headers,
          credentials: "include",
          body: JSON.stringify({
            dueAmount: parseFloat(updateFormData.dueAmount),
            description: updateFormData.description,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update due amount: ${response.status}`,
        );
      }

      const result = await response.json();
      if (result.success) {
        alert("Due amount updated successfully!");
        closeUpdateModal();
        fetchRiderDueAmounts(); // Refresh data
      } else {
        throw new Error(result.message || "Failed to update due amount");
      }
    } catch (err) {
      console.error("Error updating due amount:", err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bike className="w-7 h-7 text-orange-600" />
            Rider Due Amounts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and update rider due amounts
          </p>
        </div>

        {/* Summary Card */}
        {riderDueSummary && (
          <div className="mb-6 p-6 bg-orange-50 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Riders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {riderDueSummary.totalRiders || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Due Amount</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  ₹
                  {parseFloat(riderDueSummary.totalDueAmount || 0).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Rider Details
            </h2>
            <button
              onClick={fetchRiderDueAmounts}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
              Refresh
            </button>
          </div>

          {error && !riderDueLoading && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {riderDueLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-500 text-sm mt-4">Loading rider due amounts...</p>
            </div>
          ) : riderDueAmounts.length === 0 ? (
            <div className="text-center py-12">
              <Bike className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No rider due amounts found</p>
              <p className="text-gray-400 text-sm mt-2">
                Riders with due amounts will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Rider Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Mobile
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Due Balance
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                <tbody>
                  {riderDueAmounts.map((rider, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {rider.fullName || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {rider.mobileNumber || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-orange-600">
                        ₹
                        {parseFloat(rider.dueBalance || 0).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => openUpdateModal(rider)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Due Amount Modal */}
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <form onSubmit={handleUpdateDueAmount}>
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900">
                    Update Due Amount
                  </h3>
                  <button
                    type="button"
                    onClick={closeUpdateModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {selectedRider && (
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <p className="font-semibold text-gray-800">
                        Rider: {selectedRider.fullName}
                      </p>
                      <p className="text-gray-600">
                        Mobile: {selectedRider.mobileNumber}
                      </p>
                      <p className="text-gray-600">
                        Current Due: ₹
                        {parseFloat(selectedRider.dueBalance || 0).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="dueAmount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Amount Paid *
                    </label>
                    <input
                      type="number"
                      id="dueAmount"
                      name="dueAmount"
                      value={updateFormData.dueAmount}
                      onChange={(e) =>
                        setUpdateFormData((prev) => ({
                          ...prev,
                          dueAmount: e.target.value,
                        }))
                      }
                      placeholder="Enter amount paid"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={updateFormData.description}
                      onChange={(e) =>
                        setUpdateFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Add a description for the update"
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500 resize-y"
                    ></textarea>
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>
                <div className="flex justify-end gap-3 p-6 border-t">
                  <button
                    type="button"
                    onClick={closeUpdateModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Submit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
