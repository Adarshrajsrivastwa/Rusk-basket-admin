import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
} from "lucide-react";
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
  const [testingCredentials, setTestingCredentials] = useState(false);
  const [testResult, setTestResult] = useState({ live: null, test: null });

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

    // Initialize credentials structure based on gateway type
    let defaultCredentials = {};
    let defaultTestCredentials = {};

    if (gateway.name === "razorpay") {
      defaultCredentials = { razorpayKeyId: "", razorpayKeySecret: "" };
      defaultTestCredentials = { razorpayKeyId: "", razorpayKeySecret: "" };
    } else if (gateway.name === "phonepay") {
      defaultCredentials = {
        phonepayMerchantId: "",
        phonepaySaltKey: "",
        phonepaySaltIndex: "1",
        phonepayAppId: "",
      };
      defaultTestCredentials = {
        phonepayMerchantId: "",
        phonepaySaltKey: "",
        phonepaySaltIndex: "1",
        phonepayAppId: "",
      };
    } else if (gateway.name === "shopify") {
      defaultCredentials = {
        shopifyStoreUrl: "",
        shopifyApiKey: "",
        shopifyApiSecret: "",
        shopifyAccessToken: "",
      };
      defaultTestCredentials = {
        shopifyStoreUrl: "",
        shopifyApiKey: "",
        shopifyApiSecret: "",
        shopifyAccessToken: "",
      };
    }

    // Merge existing credentials with defaults (backend may hide secrets, so we merge to show structure)
    const existingCredentials = gateway.credentials || {};
    const existingTestCredentials = gateway.testCredentials || {};

    const mergedCredentials = { ...defaultCredentials, ...existingCredentials };
    const mergedTestCredentials = {
      ...defaultTestCredentials,
      ...existingTestCredentials,
    };

    setFormData({
      name: gateway.name || "",
      displayName: gateway.displayName || "",
      isEnabled: gateway.isEnabled || false,
      testMode: gateway.testMode || false,
      priority: gateway.priority || 0,
      description: gateway.description || "",
      credentials: mergedCredentials,
      testCredentials: mergedTestCredentials,
    });
    setIsModalOpen(true);
  };

  // ================= TOGGLE GATEWAY STATUS =================
  const handleToggleStatus = async (gatewayId) => {
    try {
      const response = await api.patch(
        `/api/payment-gateway/${gatewayId}/toggle`,
      );
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

    if (
      !["shopify", "razorpay", "phonepay"].includes(formData.name.toLowerCase())
    ) {
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
        response = await api.put(
          `/api/payment-gateway/${editingGateway._id}`,
          payload,
        );
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
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save gateway",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this payment gateway?")
    )
      return;

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
    // Clear test result when credentials change
    setTestResult({ live: null, test: null });
  };

  // ================= TEST CREDENTIALS =================
  const handleTestCredentials = async (isTest = false) => {
    if (!formData.name) {
      alert("Please select a gateway first");
      return;
    }

    const credentialsToTest = isTest
      ? formData.testCredentials
      : formData.credentials;

    // Validate required fields based on gateway type
    if (formData.name === "razorpay") {
      if (
        !credentialsToTest?.razorpayKeyId ||
        !credentialsToTest?.razorpayKeySecret
      ) {
        alert("Please enter both Key ID and Key Secret");
        return;
      }
    } else if (formData.name === "phonepay") {
      if (
        !credentialsToTest?.phonepayMerchantId ||
        !credentialsToTest?.phonepaySaltKey
      ) {
        alert("Please enter Merchant ID and Salt Key");
        return;
      }
    } else if (formData.name === "shopify") {
      if (
        !credentialsToTest?.shopifyStoreUrl ||
        !credentialsToTest?.shopifyApiKey ||
        !credentialsToTest?.shopifyAccessToken
      ) {
        alert("Please enter Store URL, API Key, and Access Token");
        return;
      }
    }

    setTestingCredentials(true);

    try {
      const response = await api.post("/api/payment-gateway/test-credentials", {
        gatewayName: formData.name,
        credentials: credentialsToTest,
        isTestMode: isTest,
      });

      if (response.data.success) {
        setTestResult((prev) => ({
          ...prev,
          [isTest ? "test" : "live"]: {
            success: true,
            message: response.data.message,
            data: response.data.data,
          },
        }));
      } else {
        setTestResult((prev) => ({
          ...prev,
          [isTest ? "test" : "live"]: {
            success: false,
            message: response.data.error || "Test failed",
          },
        }));
      }
    } catch (error) {
      console.error("Error testing credentials:", error);
      setTestResult((prev) => ({
        ...prev,
        [isTest ? "test" : "live"]: {
          success: false,
          message:
            error.response?.data?.error ||
            error.message ||
            "Failed to test credentials",
        },
      }));
    } finally {
      setTestingCredentials(false);
    }
  };

  // ================= UI =================
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0 p-0 ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Payment Gateway Management
            </h1>
            <button
              onClick={handleAddClick}
              className="bg-black text-white px-5 py-2.5 rounded-sm flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-md"
            >
              <Plus size={18} /> Add Gateway
            </button>
          </div>

          {/* Loader */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#FF7B1D]" size={40} />
            </div>
          )}

          {/* Table */}
          {!loading && (
            <div className="bg-white shadow-sm border rounded-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#FF7B1D] text-black">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Gateway
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Display name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Test mode
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gateways.map((gateway) => (
                    <tr
                      key={gateway._id}
                      className="hover:bg-orange-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800 capitalize">
                          {gateway.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {gateway.displayName}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(gateway._id)}
                          className="flex items-center gap-2"
                        >
                          {gateway.isEnabled ? (
                            <ToggleRight className="text-[#247606]" size={24} />
                          ) : (
                            <ToggleLeft className="text-gray-400" size={24} />
                          )}
                          <span
                            className={
                              gateway.isEnabled
                                ? "text-[#247606] font-semibold"
                                : "text-gray-500"
                            }
                          >
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
                      <td className="px-6 py-4 text-gray-700">
                        {gateway.priority || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(gateway)}
                            className="bg-[#FF7B1D] text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1"
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
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">No payment gateways found</p>
              <button
                onClick={handleAddClick}
                className="mt-4 bg-[#FF7B1D] text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors"
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
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-lg z-50 shadow-2xl">
              <button
                onClick={() => !submitting && setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                disabled={submitting}
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingGateway
                  ? "Edit Payment Gateway"
                  : "Add New Payment Gateway"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gateway Name * (shopify, razorpay, or phonepay)
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) => {
                      const gatewayName = e.target.value;
                      let defaultCredentials = {};
                      let defaultTestCredentials = {};

                      // Initialize default structure based on gateway type
                      if (gatewayName === "razorpay") {
                        defaultCredentials = {
                          razorpayKeyId: "",
                          razorpayKeySecret: "",
                        };
                        defaultTestCredentials = {
                          razorpayKeyId: "",
                          razorpayKeySecret: "",
                        };
                      } else if (gatewayName === "phonepay") {
                        defaultCredentials = {
                          phonepayMerchantId: "",
                          phonepaySaltKey: "",
                          phonepaySaltIndex: "1",
                          phonepayAppId: "",
                        };
                        defaultTestCredentials = {
                          phonepayMerchantId: "",
                          phonepaySaltKey: "",
                          phonepaySaltIndex: "1",
                          phonepayAppId: "",
                        };
                      } else if (gatewayName === "shopify") {
                        defaultCredentials = {
                          shopifyStoreUrl: "",
                          shopifyApiKey: "",
                          shopifyApiSecret: "",
                          shopifyAccessToken: "",
                        };
                        defaultTestCredentials = {
                          shopifyStoreUrl: "",
                          shopifyApiKey: "",
                          shopifyApiSecret: "",
                          shopifyAccessToken: "",
                        };
                      }

                      // If editing and gateway name matches, preserve existing credentials
                      // Otherwise, use defaults (for new gateway or switching types)
                      const currentCredentials = formData.credentials || {};
                      const currentTestCredentials =
                        formData.testCredentials || {};

                      // Merge existing values with defaults (preserve existing values if they exist)
                      const mergedCredentials = { ...defaultCredentials };
                      const mergedTestCredentials = {
                        ...defaultTestCredentials,
                      };

                      // Only preserve values that match the new gateway type
                      Object.keys(defaultCredentials).forEach((key) => {
                        if (currentCredentials[key] !== undefined) {
                          mergedCredentials[key] = currentCredentials[key];
                        }
                      });

                      Object.keys(defaultTestCredentials).forEach((key) => {
                        if (currentTestCredentials[key] !== undefined) {
                          mergedTestCredentials[key] =
                            currentTestCredentials[key];
                        }
                      });

                      setFormData({
                        ...formData,
                        name: gatewayName,
                        credentials: mergedCredentials,
                        testCredentials: mergedTestCredentials,
                      });
                    }}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
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
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
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
                        setFormData({
                          ...formData,
                          isEnabled: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                      disabled={submitting}
                    />
                    <label
                      htmlFor="isEnabled"
                      className="text-sm font-medium text-gray-700"
                    >
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
                    <label
                      htmlFor="testMode"
                      className="text-sm font-medium text-gray-700"
                    >
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
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
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
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                    rows="3"
                    disabled={submitting}
                  />
                </div>

                {/* Credentials Section */}
                {formData.name && (
                  <>
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        Live Credentials
                      </h3>
                      <div className="space-y-3">
                        {formData.name === "razorpay" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key ID *
                              </label>
                              <input
                                type="text"
                                placeholder="rzp_live_..."
                                value={
                                  formData.credentials?.razorpayKeyId || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "credentials",
                                    "razorpayKeyId",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key Secret *
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCredentials["live_secret"]
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Enter Razorpay Key Secret"
                                  value={
                                    formData.credentials?.razorpayKeySecret ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateCredentials(
                                      "credentials",
                                      "razorpayKeySecret",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] pr-10"
                                  disabled={submitting}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      live_secret:
                                        !showCredentials["live_secret"],
                                    })
                                  }
                                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                  {showCredentials["live_secret"] ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        {formData.name === "phonepay" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Merchant ID *
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Merchant ID"
                                value={
                                  formData.credentials?.phonepayMerchantId || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "credentials",
                                    "phonepayMerchantId",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salt Key *
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCredentials["live_salt"]
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Enter Salt Key"
                                  value={
                                    formData.credentials?.phonepaySaltKey || ""
                                  }
                                  onChange={(e) =>
                                    updateCredentials(
                                      "credentials",
                                      "phonepaySaltKey",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] pr-10"
                                  disabled={submitting}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      live_salt: !showCredentials["live_salt"],
                                    })
                                  }
                                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                  {showCredentials["live_salt"] ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salt Index
                              </label>
                              <input
                                type="text"
                                placeholder="1"
                                value={
                                  formData.credentials?.phonepaySaltIndex || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "credentials",
                                    "phonepaySaltIndex",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                App ID
                              </label>
                              <input
                                type="text"
                                placeholder="Enter App ID"
                                value={
                                  formData.credentials?.phonepayAppId || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "credentials",
                                    "phonepayAppId",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                          </>
                        )}
                        {formData.name === "shopify" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Store URL *
                              </label>
                              <input
                                type="text"
                                placeholder="https://your-store.myshopify.com"
                                value={
                                  formData.credentials?.shopifyStoreUrl || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "credentials",
                                    "shopifyStoreUrl",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Key *
                              </label>
                              <input
                                type="text"
                                placeholder="Enter API Key"
                                value={
                                  formData.credentials?.shopifyApiKey || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "credentials",
                                    "shopifyApiKey",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Secret *
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCredentials["live_api_secret"]
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Enter API Secret"
                                  value={
                                    formData.credentials?.shopifyApiSecret || ""
                                  }
                                  onChange={(e) =>
                                    updateCredentials(
                                      "credentials",
                                      "shopifyApiSecret",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] pr-10"
                                  disabled={submitting}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      live_api_secret:
                                        !showCredentials["live_api_secret"],
                                    })
                                  }
                                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                  {showCredentials["live_api_secret"] ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Access Token *
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCredentials["live_access_token"]
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Enter Access Token"
                                  value={
                                    formData.credentials?.shopifyAccessToken ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateCredentials(
                                      "credentials",
                                      "shopifyAccessToken",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] pr-10"
                                  disabled={submitting}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      live_access_token:
                                        !showCredentials["live_access_token"],
                                    })
                                  }
                                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                  {showCredentials["live_access_token"] ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <button
                          type="button"
                          onClick={() => handleTestCredentials(false)}
                          disabled={
                            testingCredentials || submitting || !formData.name
                          }
                          className="px-4 py-2 bg-[#FF7B1D] text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {testingCredentials ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              Testing...
                            </>
                          ) : (
                            <>Test Live Credentials</>
                          )}
                        </button>
                        {testResult.live && !testResult.live.success && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {testResult.live.message}
                          </div>
                        )}
                        {testResult.live && testResult.live.success && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                            ✓ {testResult.live.message}
                            {testResult.live.data?.shopName && (
                              <div className="mt-1 text-xs">
                                Shop: {testResult.live.data.shopName}
                              </div>
                            )}
                            {testResult.live.data?.note && (
                              <div className="mt-1 text-xs italic">
                                {testResult.live.data.note}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Test Credentials Section */}
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        Test Credentials
                      </h3>
                      <div className="space-y-3">
                        {formData.name === "razorpay" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key ID *
                              </label>
                              <input
                                type="text"
                                placeholder="rzp_test_..."
                                value={
                                  formData.testCredentials?.razorpayKeyId || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "testCredentials",
                                    "razorpayKeyId",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key Secret *
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCredentials["test_secret"]
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Enter Razorpay Test Key Secret"
                                  value={
                                    formData.testCredentials
                                      ?.razorpayKeySecret || ""
                                  }
                                  onChange={(e) =>
                                    updateCredentials(
                                      "testCredentials",
                                      "razorpayKeySecret",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] pr-10"
                                  disabled={submitting}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      test_secret:
                                        !showCredentials["test_secret"],
                                    })
                                  }
                                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                  {showCredentials["test_secret"] ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        {formData.name === "phonepay" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Merchant ID *
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Test Merchant ID"
                                value={
                                  formData.testCredentials
                                    ?.phonepayMerchantId || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "testCredentials",
                                    "phonepayMerchantId",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salt Key *
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCredentials["test_salt"]
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Enter Test Salt Key"
                                  value={
                                    formData.testCredentials?.phonepaySaltKey ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateCredentials(
                                      "testCredentials",
                                      "phonepaySaltKey",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] pr-10"
                                  disabled={submitting}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      test_salt: !showCredentials["test_salt"],
                                    })
                                  }
                                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                  {showCredentials["test_salt"] ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salt Index
                              </label>
                              <input
                                type="text"
                                placeholder="1"
                                value={
                                  formData.testCredentials?.phonepaySaltIndex ||
                                  ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "testCredentials",
                                    "phonepaySaltIndex",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                App ID
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Test App ID"
                                value={
                                  formData.testCredentials?.phonepayAppId || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "testCredentials",
                                    "phonepayAppId",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                          </>
                        )}
                        {formData.name === "shopify" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Store URL *
                              </label>
                              <input
                                type="text"
                                placeholder="https://your-store.myshopify.com"
                                value={
                                  formData.testCredentials?.shopifyStoreUrl ||
                                  ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "testCredentials",
                                    "shopifyStoreUrl",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Key *
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Test API Key"
                                value={
                                  formData.testCredentials?.shopifyApiKey || ""
                                }
                                onChange={(e) =>
                                  updateCredentials(
                                    "testCredentials",
                                    "shopifyApiKey",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]"
                                disabled={submitting}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                API Secret *
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCredentials["test_api_secret"]
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Enter Test API Secret"
                                  value={
                                    formData.testCredentials
                                      ?.shopifyApiSecret || ""
                                  }
                                  onChange={(e) =>
                                    updateCredentials(
                                      "testCredentials",
                                      "shopifyApiSecret",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] pr-10"
                                  disabled={submitting}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      test_api_secret:
                                        !showCredentials["test_api_secret"],
                                    })
                                  }
                                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                  {showCredentials["test_api_secret"] ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Access Token *
                              </label>
                              <div className="relative">
                                <input
                                  type={
                                    showCredentials["test_access_token"]
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Enter Test Access Token"
                                  value={
                                    formData.testCredentials
                                      ?.shopifyAccessToken || ""
                                  }
                                  onChange={(e) =>
                                    updateCredentials(
                                      "testCredentials",
                                      "shopifyAccessToken",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] pr-10"
                                  disabled={submitting}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      test_access_token:
                                        !showCredentials["test_access_token"],
                                    })
                                  }
                                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                  {showCredentials["test_access_token"] ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <button
                          type="button"
                          onClick={() => handleTestCredentials(true)}
                          disabled={
                            testingCredentials || submitting || !formData.name
                          }
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {testingCredentials ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              Testing...
                            </>
                          ) : (
                            <>Test Test Credentials</>
                          )}
                        </button>
                        {testResult.test && !testResult.test.success && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {testResult.test.message}
                          </div>
                        )}
                        {testResult.test && testResult.test.success && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                            ✓ {testResult.test.message}
                            {testResult.test.data?.shopName && (
                              <div className="mt-1 text-xs">
                                Shop: {testResult.test.data.shopName}
                              </div>
                            )}
                            {testResult.test.data?.note && (
                              <div className="mt-1 text-xs italic">
                                {testResult.test.data.note}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

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
                    className="px-5 py-2 bg-[#FF7B1D] text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        {editingGateway ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {editingGateway ? "Update Gateway" : "Create Gateway"}
                      </>
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
