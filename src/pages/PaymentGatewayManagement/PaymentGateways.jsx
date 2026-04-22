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
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { BASE_URL } from "../../api/api";
import api from "../../api/api";

const API_URL = `${BASE_URL}/api/payment-gateway`;

const GATEWAY_COLORS = {
  razorpay: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  phonepay: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  cashfree: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
};

const FieldInput = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  type = "text",
  required,
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] text-gray-700 placeholder:text-gray-400 transition-colors disabled:opacity-60 disabled:bg-gray-50"
    />
  </div>
);

const SecretFieldInput = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  showKey,
  onToggleShow,
  required,
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={showKey ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 pr-10 text-sm border border-orange-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] text-gray-700 placeholder:text-gray-400 transition-colors disabled:opacity-60 disabled:bg-gray-50"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  </div>
);

const TestResultBanner = ({ result }) => {
  if (!result) return null;
  return (
    <div
      className={`mt-3 px-3 py-2.5 rounded-xl text-xs font-medium border ${
        result.success
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-red-50 border-red-200 text-red-600"
      }`}
    >
      {result.success ? "✓ " : "✕ "}
      {result.message}
      {result.data?.shopName && (
        <div className="mt-0.5 opacity-75">Shop: {result.data.shopName}</div>
      )}
      {result.data?.note && (
        <div className="mt-0.5 italic opacity-75">{result.data.note}</div>
      )}
    </div>
  );
};

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

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

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

  const getDefaultCredentials = (name) => {
    if (name === "razorpay")
      return {
        live: { razorpayKeyId: "", razorpayKeySecret: "" },
        test: { razorpayKeyId: "", razorpayKeySecret: "" },
      };
    if (name === "phonepay")
      return {
        live: {
          phonepayMerchantId: "",
          phonepaySaltKey: "",
          phonepaySaltIndex: "1",
          phonepayAppId: "",
        },
        test: {
          phonepayMerchantId: "",
          phonepaySaltKey: "",
          phonepaySaltIndex: "1",
          phonepayAppId: "",
        },
      };
    if (name === "cashfree")
      return {
        live: {
          cashfreeAppId: "",
          cashfreeSecretKey: "",
          cashfreeApiVersion: "2023-08-01",
        },
        test: {
          cashfreeAppId: "",
          cashfreeSecretKey: "",
          cashfreeApiVersion: "2023-08-01",
        },
      };
    return { live: {}, test: {} };
  };

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
    setTestResult({ live: null, test: null });
    setIsModalOpen(true);
  };

  const handleEditClick = (gateway) => {
    setEditingGateway(gateway);
    const defaults = getDefaultCredentials(gateway.name);
    setFormData({
      name: gateway.name || "",
      displayName: gateway.displayName || "",
      isEnabled: gateway.isEnabled || false,
      testMode: gateway.testMode || false,
      priority: gateway.priority || 0,
      description: gateway.description || "",
      credentials: { ...defaults.live, ...(gateway.credentials || {}) },
      testCredentials: { ...defaults.test, ...(gateway.testCredentials || {}) },
    });
    setTestResult({ live: null, test: null });
    setIsModalOpen(true);
  };

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

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.displayName.trim()) {
      alert("Name and Display Name are required");
      return;
    }
    if (
      !["cashfree", "razorpay", "phonepay"].includes(
        formData.name.toLowerCase(),
      )
    ) {
      alert("Gateway name must be one of: cashfree, razorpay, phonepay");
      return;
    }
    setSubmitting(true);
    try {
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
      const response = editingGateway
        ? await api.put(`/api/payment-gateway/${editingGateway._id}`, payload)
        : await api.post("/api/payment-gateway", payload);

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

  const updateCredentials = (type, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: value },
    }));
    setTestResult({ live: null, test: null });
  };

  const handleTestCredentials = async (isTest = false) => {
    if (!formData.name) {
      alert("Please select a gateway first");
      return;
    }
    const credentialsToTest = isTest
      ? formData.testCredentials
      : formData.credentials;
    if (
      formData.name === "razorpay" &&
      (!credentialsToTest?.razorpayKeyId ||
        !credentialsToTest?.razorpayKeySecret)
    ) {
      alert("Please enter both Key ID and Key Secret");
      return;
    }
    if (
      formData.name === "phonepay" &&
      (!credentialsToTest?.phonepayMerchantId ||
        !credentialsToTest?.phonepaySaltKey)
    ) {
      alert("Please enter Merchant ID and Salt Key");
      return;
    }
    if (
      formData.name === "cashfree" &&
      (!credentialsToTest?.cashfreeAppId ||
        !credentialsToTest?.cashfreeSecretKey)
    ) {
      alert("Please enter App ID and Secret Key");
      return;
    }
    setTestingCredentials(true);
    try {
      const response = await api.post("/api/payment-gateway/test-credentials", {
        gatewayName: formData.name,
        credentials: credentialsToTest,
        isTestMode: isTest,
      });
      setTestResult((prev) => ({
        ...prev,
        [isTest ? "test" : "live"]: {
          success: response.data.success,
          message: response.data.success
            ? response.data.message
            : response.data.error || "Test failed",
          data: response.data.data,
        },
      }));
    } catch (error) {
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

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 5 }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 6 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div className="h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse w-[70%]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="6" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No payment gateways found
            </p>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7B1D] hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Your First Gateway
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  );

  // ── Credentials Fields ──
  const renderCredentialFields = (type) => {
    const isLive = type === "credentials";
    const prefix = isLive ? "live" : "test";
    const data = formData[type];

    return (
      <div className="space-y-3">
        {formData.name === "razorpay" && (
          <>
            <FieldInput
              label="Key ID"
              placeholder={isLive ? "rzp_live_..." : "rzp_test_..."}
              value={data?.razorpayKeyId || ""}
              onChange={(e) =>
                updateCredentials(type, "razorpayKeyId", e.target.value)
              }
              disabled={submitting}
              required
            />
            <SecretFieldInput
              label="Key Secret"
              placeholder={`Enter Razorpay ${isLive ? "Live" : "Test"} Key Secret`}
              value={data?.razorpayKeySecret || ""}
              onChange={(e) =>
                updateCredentials(type, "razorpayKeySecret", e.target.value)
              }
              disabled={submitting}
              showKey={showCredentials[`${prefix}_secret`]}
              onToggleShow={() =>
                setShowCredentials((p) => ({
                  ...p,
                  [`${prefix}_secret`]: !p[`${prefix}_secret`],
                }))
              }
              required
            />
          </>
        )}
        {formData.name === "phonepay" && (
          <>
            <FieldInput
              label="Merchant ID"
              placeholder={`Enter ${isLive ? "" : "Test "}Merchant ID`}
              value={data?.phonepayMerchantId || ""}
              onChange={(e) =>
                updateCredentials(type, "phonepayMerchantId", e.target.value)
              }
              disabled={submitting}
              required
            />
            <SecretFieldInput
              label="Salt Key"
              placeholder={`Enter ${isLive ? "" : "Test "}Salt Key`}
              value={data?.phonepaySaltKey || ""}
              onChange={(e) =>
                updateCredentials(type, "phonepaySaltKey", e.target.value)
              }
              disabled={submitting}
              showKey={showCredentials[`${prefix}_salt`]}
              onToggleShow={() =>
                setShowCredentials((p) => ({
                  ...p,
                  [`${prefix}_salt`]: !p[`${prefix}_salt`],
                }))
              }
              required
            />
            <FieldInput
              label="Salt Index"
              placeholder="1"
              value={data?.phonepaySaltIndex || ""}
              onChange={(e) =>
                updateCredentials(type, "phonepaySaltIndex", e.target.value)
              }
              disabled={submitting}
            />
            <FieldInput
              label="App ID"
              placeholder={`Enter ${isLive ? "" : "Test "}App ID`}
              value={data?.phonepayAppId || ""}
              onChange={(e) =>
                updateCredentials(type, "phonepayAppId", e.target.value)
              }
              disabled={submitting}
            />
          </>
        )}
        {formData.name === "cashfree" && (
          <>
            <FieldInput
              label="App ID"
              placeholder={
                isLive ? "YOUR_PRODUCTION_APP_ID" : "YOUR_TEST_APP_ID"
              }
              value={data?.cashfreeAppId || ""}
              onChange={(e) =>
                updateCredentials(type, "cashfreeAppId", e.target.value)
              }
              disabled={submitting}
              required
            />
            <SecretFieldInput
              label="Secret Key"
              placeholder={
                isLive ? "YOUR_PRODUCTION_SECRET_KEY" : "YOUR_TEST_SECRET_KEY"
              }
              value={data?.cashfreeSecretKey || ""}
              onChange={(e) =>
                updateCredentials(type, "cashfreeSecretKey", e.target.value)
              }
              disabled={submitting}
              showKey={showCredentials[`${prefix}_secret_key`]}
              onToggleShow={() =>
                setShowCredentials((p) => ({
                  ...p,
                  [`${prefix}_secret_key`]: !p[`${prefix}_secret_key`],
                }))
              }
              required
            />
            <FieldInput
              label="API Version"
              placeholder="2023-08-01"
              value={data?.cashfreeApiVersion || "2023-08-01"}
              onChange={(e) =>
                updateCredentials(type, "cashfreeApiVersion", e.target.value)
              }
              disabled={submitting}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: #f9fafb; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      `}</style>

      <div className="px-1 mt-3 max-w-full pb-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#FF7B1D]" />
            <h1 className="text-sm font-bold text-gray-800">
              Payment Gateway Management
            </h1>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 h-[38px] px-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl whitespace-nowrap transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Gateway
          </button>
        </div>

        {/* ── Table Card ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Payment Gateways
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                {gateways.length} gateway{gateways.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                  {[
                    "Gateway",
                    "Display Name",
                    "Status",
                    "Mode",
                    "Priority",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${
                        i === 5 ? "text-right pr-5" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {loading ? (
                <TableSkeleton />
              ) : gateways.length === 0 ? (
                <EmptyState />
              ) : (
                <tbody>
                  {gateways.map((gateway, idx) => {
                    const gc =
                      GATEWAY_COLORS[gateway.name] || GATEWAY_COLORS.cashfree;
                    return (
                      <tr
                        key={gateway._id}
                        className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        {/* Gateway Name */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${gc.bg} ${gc.text} ${gc.border} ring-white capitalize`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${gc.dot}`}
                            />
                            {gateway.name}
                          </span>
                        </td>

                        {/* Display Name */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-700">
                            {gateway.displayName}
                          </span>
                        </td>

                        {/* Status Toggle */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleToggleStatus(gateway._id)}
                            className="flex items-center gap-1.5 group/toggle"
                          >
                            {gateway.isEnabled ? (
                              <ToggleRight
                                className="text-emerald-500 group-hover/toggle:text-emerald-600 transition-colors"
                                size={22}
                              />
                            ) : (
                              <ToggleLeft
                                className="text-gray-300 group-hover/toggle:text-gray-400 transition-colors"
                                size={22}
                              />
                            )}
                            <span
                              className={`text-xs font-semibold ${gateway.isEnabled ? "text-emerald-600" : "text-gray-400"}`}
                            >
                              {gateway.isEnabled ? "Enabled" : "Disabled"}
                            </span>
                          </button>
                        </td>

                        {/* Mode Badge */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${
                              gateway.testMode
                                ? "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${gateway.testMode ? "bg-amber-500" : "bg-emerald-500"}`}
                            />
                            {gateway.testMode ? "Test" : "Live"}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            {gateway.priority || 0}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditClick(gateway)}
                              className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                              title="Edit Gateway"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(gateway._id)}
                              className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                              title="Delete Gateway"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl z-50 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FF7B1D] to-orange-400 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-[#1a0a00]" />
                <span className="text-sm font-bold text-[#1a0a00] tracking-wide uppercase">
                  {editingGateway
                    ? "Edit Payment Gateway"
                    : "Add New Payment Gateway"}
                </span>
              </div>
              <button
                onClick={() => !submitting && setIsModalOpen(false)}
                disabled={submitting}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-[#1a0a00] transition-colors disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto modal-scroll flex-1 p-5">
              <div className="space-y-4">
                {/* Gateway Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Gateway Name <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">
                      (cashfree, razorpay, phonepay)
                    </span>
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const defaults = getDefaultCredentials(name);
                      const cur = formData.credentials || {};
                      const curTest = formData.testCredentials || {};
                      const merged = { ...defaults.live };
                      const mergedTest = { ...defaults.test };
                      Object.keys(defaults.live).forEach((k) => {
                        if (cur[k] !== undefined) merged[k] = cur[k];
                      });
                      Object.keys(defaults.test).forEach((k) => {
                        if (curTest[k] !== undefined)
                          mergedTest[k] = curTest[k];
                      });
                      setFormData({
                        ...formData,
                        name,
                        credentials: merged,
                        testCredentials: mergedTest,
                      });
                    }}
                    disabled={submitting || !!editingGateway}
                    className="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] text-gray-700 transition-colors disabled:opacity-60 disabled:bg-gray-50"
                  >
                    <option value="">Select Gateway</option>
                    <option value="cashfree">Cashfree</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="phonepay">PhonePe</option>
                  </select>
                </div>

                {/* Display Name */}
                <FieldInput
                  label="Display Name"
                  placeholder="Enter display name"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  disabled={submitting}
                  required
                />

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "isEnabled", label: "Enabled", key: "isEnabled" },
                    { id: "testMode", label: "Test Mode", key: "testMode" },
                  ].map(({ id, label, key }) => (
                    <label
                      key={id}
                      htmlFor={id}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={id}
                        checked={formData[key]}
                        onChange={(e) =>
                          setFormData({ ...formData, [key]: e.target.checked })
                        }
                        disabled={submitting}
                        className="w-3.5 h-3.5 accent-[#FF7B1D]"
                      />
                      <span className="text-xs font-semibold text-gray-600">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Priority */}
                <FieldInput
                  label="Priority"
                  placeholder="0"
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={submitting}
                />

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    disabled={submitting}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] text-gray-700 placeholder:text-gray-400 resize-none transition-colors disabled:opacity-60 disabled:bg-gray-50"
                  />
                </div>

                {/* Credentials Sections */}
                {formData.name && (
                  <>
                    {/* Live Credentials */}
                    <div className="rounded-2xl overflow-hidden border border-gray-100">
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                          Live Credentials
                        </span>
                      </div>
                      <div className="p-4 space-y-3">
                        {renderCredentialFields("credentials")}
                        <div className="pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => handleTestCredentials(false)}
                            disabled={
                              testingCredentials || submitting || !formData.name
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {testingCredentials ? (
                              <>
                                <Loader2 className="animate-spin w-3.5 h-3.5" />{" "}
                                Testing...
                              </>
                            ) : (
                              "Test Live Credentials"
                            )}
                          </button>
                          <TestResultBanner result={testResult.live} />
                        </div>
                      </div>
                    </div>

                    {/* Test Credentials */}
                    <div className="rounded-2xl overflow-hidden border border-gray-100">
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                          Test Credentials
                        </span>
                      </div>
                      <div className="p-4 space-y-3">
                        {renderCredentialFields("testCredentials")}
                        <div className="pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => handleTestCredentials(true)}
                            disabled={
                              testingCredentials || submitting || !formData.name
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {testingCredentials ? (
                              <>
                                <Loader2 className="animate-spin w-3.5 h-3.5" />{" "}
                                Testing...
                              </>
                            ) : (
                              "Test Test Credentials"
                            )}
                          </button>
                          <TestResultBanner result={testResult.test} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 bg-[#FF7B1D] hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin w-3.5 h-3.5" />{" "}
                    {editingGateway ? "Updating..." : "Creating..."}
                  </>
                ) : editingGateway ? (
                  "Update Gateway"
                ) : (
                  "Create Gateway"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PaymentGatewayManagement;
