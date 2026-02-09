import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Plus, Pencil, Trash2, X, Loader2, ToggleLeft, ToggleRight, Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "../../api/api";
import api from "../../api/api";

const API_URL = `${BASE_URL}/api/payment-gateway`;

const PaymentGatewayManagement = () => {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCredentials, setShowCredentials] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    isEnabled: false,
    testMode: false,
    priority: 0,
    description: "",
    credentials: {},
    testCredentials: {},
  });

  // Helper function to get authorization headers
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // ================= FETCH GATEWAYS =================
  const loadGateways = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/payment-gateway");
      if (response.data.success) {
        setGateways(response.data.data || []);
      } else {
        alert("Failed to load payment gateways");
      }
    } catch (error) {
      console.error("Error loading gateways:", error);
      alert("Failed to load payment gateways. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGateways();
  }, []);

  // ================= OPEN ADD =================
  const handleAddClick = () => {
    setEditingGateway(null);
    setFormData({
      name: "",
      displayName: "",
      isEnabled: false,
      testMode: false,
      priority: 0,
      description: "",
      credentials: {},
      testCredentials: {},
    });
    setIsModalOpen(true);
  };

  // ================= OPEN EDIT =================
  const handleEditClick = (gateway) => {
    setEditingGateway(gateway);
    setFormData({
      name: gateway.name || "",
      displayName: gateway.displayName || "",
      isEnabled: gateway.isEnabled || false,
      testMode: gateway.testMode || false,
      priority: gateway.priority || 0,
      description: gateway.description || "",
      credentials: gateway.credentials || {},
      testCredentials: gateway.testCredentials || {},
    });
    setIsModalOpen(true);
  };

  // ================= TOGGLE GATEWAY STATUS =================
  const handleToggleStatus = async (gatewayId) => {
    try {
      const response = await api.patch(`/api/payment-gateway/${gatewayId}/toggle`);
      if (response.data.success) {
        loadGateways();
        alert("Gateway status updated successfully");
      } else {
        alert("Failed to update gateway status");
      }
    } catch (error) {
      console.error("Error toggling gateway:", error);
      alert("Failed to update gateway status");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.displayName.trim()) {
      alert("Name and Display Name are required");
      return;
    }

    if (!["shopify", "razorpay", "phonepay"].includes(formData.name.toLowerCase())) {
      alert("Gateway name must be one of: shopify, razorpay, phonepay");
      return;
    }

    setSubmitting(true);
    try {
      let response;
      const payload = {
        name: formData.name.toLowerCase(),
        displayName: formData.displayName,
        isEnabled: formData.isEnabled,
        testMode: formData.testMode,
        priority: parseInt(formData.priority) || 0,
        description: formData.description,
        credentials: formData.credentials,
        testCredentials: formData.testCredentials,
      };

      if (editingGateway) {
        response = await api.put(`/api/payment-gateway/${editingGateway._id}`, payload);
      } else {
        response = await api.post("/api/payment-gateway", payload);
      }

      if (response.data.success) {
        setIsModalOpen(false);
        loadGateways();
        alert(response.data.message || "Gateway saved successfully");
      } else {
        throw new Error(response.data.message || "Failed to save gateway");
      }
    } catch (error) {
      console.error("Error saving gateway:", error);
      alert(error.response?.data?.message || error.message || "Failed to save gateway");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment gateway?")) return;

    try {
      const response = await api.delete(`/api/payment-gateway/${id}`);
      if (response.data.success) {
        loadGateways();
        alert(response.data.message || "Gateway deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete gateway");
      }
    } catch (error) {
      console.error("Error deleting gateway:", error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // ================= UPDATE CREDENTIALS =================
  const updateCredentials = (type, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }));
  };

  // ================= UI =================
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0 p-0 ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-custom-orange pb-2 inline-block">
              Payment Gateway Management
            </h1>
            <button
              onClick={handleAddClick}
              className="bg-custom-orange text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-custom-hover-blue transition-colors shadow-md"
            >
              <Plus size={18} /> Add Gateway
            </button>
          </div>

          {/* Loader */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-custom-orange" size={40} />
            </div>
          )}

          {/* Table */}
          {!loading && (
            <div className="bg-white shadow-lg border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-custom-dark-blue text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Gateway</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Display Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Test Mode</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Priority</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gateways.map((gateway) => (
                    <tr key={gateway._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800 capitalize">
                          {gateway.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{gateway.displayName}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(gateway._id)}
                          className="flex items-center gap-2"
                        >
                          {gateway.isEnabled ? (
                            <ToggleRight className="text-green-500" size={24} />
                          ) : (
                            <ToggleLeft className="text-gray-400" size={24} />
                          )}
                          <span className={gateway.isEnabled ? "text-green-600" : "text-gray-500"}>
                            {gateway.isEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            gateway.testMode
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {gateway.testMode ? "Test" : "Live"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{gateway.priority || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(gateway)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(gateway._id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && gateways.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No payment gateways found</p>
              <button
                onClick={handleAddClick}
                className="mt-4 bg-custom-orange text-white px-5 py-2 rounded-lg hover:bg-custom-hover-blue transition-colors"
              >
                Add Your First Gateway
              </button>
            </div>
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => !submitting && setIsModalOpen(false)}
            />
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-lg z-50 shadow-2xl custom-scrollbar">
              <button
                onClick={() => !submitting && setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                disabled={submitting}
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-4 border-custom-orange pb-2 inline-block">
                {editingGateway ? "Edit Payment Gateway" : "Add New Payment Gateway"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gateway Name * (shopify, razorpay, or phonepay)
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                    disabled={submitting || editingGateway}
                  >
                    <option value="">Select Gateway</option>
                    <option value="shopify">Shopify</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="phonepay">PhonePe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter display name"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isEnabled"
                      checked={formData.isEnabled}
                      onChange={(e) =>
                        setFormData({ ...formData, isEnabled: e.target.checked })
                      }
                      className="w-4 h-4"
                      disabled={submitting}
                    />
                    <label htmlFor="isEnabled" className="text-sm font-medium text-gray-700">
                      Enabled
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="testMode"
                      checked={formData.testMode}
                      onChange={(e) =>
                        setFormData({ ...formData, testMode: e.target.checked })
                      }
                      className="w-4 h-4"
                      disabled={submitting}
                    />
                    <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
                      Test Mode
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                    rows="3"
                    disabled={submitting}
                  />
                </div>

                {/* Credentials Section */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Live Credentials</h3>
                  <div className="space-y-2">
                    {Object.keys(formData.credentials || {}).map((key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key}
                        </label>
                        <input
                          type="password"
                          value={formData.credentials[key] || ""}
                          onChange={(e) => updateCredentials("credentials", key, e.target.value)}
                          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                          disabled={submitting}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const key = prompt("Enter credential key:");
                        if (key) updateCredentials("credentials", key, "");
                      }}
                      className="text-sm text-custom-orange hover:underline"
                    >
                      + Add Credential
                    </button>
                  </div>
                </div>

                {/* Test Credentials Section */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Test Credentials</h3>
                  <div className="space-y-2">
                    {Object.keys(formData.testCredentials || {}).map((key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key}
                        </label>
                        <input
                          type="password"
                          value={formData.testCredentials[key] || ""}
                          onChange={(e) => updateCredentials("testCredentials", key, e.target.value)}
                          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                          disabled={submitting}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const key = prompt("Enter credential key:");
                        if (key) updateCredentials("testCredentials", key, "");
                      }}
                      className="text-sm text-custom-orange hover:underline"
                    >
                      + Add Test Credential
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-custom-orange text-white rounded-lg hover:bg-custom-hover-blue transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        {editingGateway ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>{editingGateway ? "Update Gateway" : "Create Gateway"}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentGatewayManagement;
