import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Loader2, Save, ToggleLeft, ToggleRight, Users, Gift } from "lucide-react";
import api from "../../api/api";

const ReferralCashbackSettings = () => {
  const [activeTab, setActiveTab] = useState("referral");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Referral Settings State
  const [referralSettings, setReferralSettings] = useState({
    userReferrerAmount: 0,
    userRefereeAmount: 0,
    riderReferrerAmount: 0,
    riderRefereeAmount: 0,
    isActive: true,
  });

  // Cashback Settings State
  const [cashbackSettings, setCashbackSettings] = useState({
    cashbackPercentage: 0,
    minimumOrderAmount: 0,
    maximumCashbackPerOrder: 0,
    minimumCashbackToUse: 0,
    maxCashbackUsagePercentage: 0,
    maxCashbackUsageAmount: 0,
    isActive: true,
  });

  // Fetch Referral Settings
  const fetchReferralSettings = async () => {
    try {
      const response = await api.get("/api/admin/referral-settings");
      if (response.data.success && response.data.data) {
        setReferralSettings({
          userReferrerAmount: response.data.data.userReferrerAmount || 0,
          userRefereeAmount: response.data.data.userRefereeAmount || 0,
          riderReferrerAmount: response.data.data.riderReferrerAmount || 0,
          riderRefereeAmount: response.data.data.riderRefereeAmount || 0,
          isActive: response.data.data.isActive !== undefined ? response.data.data.isActive : true,
        });
      }
    } catch (error) {
      console.error("Error fetching referral settings:", error);
      setErrorMessage("Failed to load referral settings");
    }
  };

  // Fetch Cashback Settings
  const fetchCashbackSettings = async () => {
    try {
      const response = await api.get("/api/admin/cashback-settings");
      if (response.data.success && response.data.data) {
        setCashbackSettings({
          cashbackPercentage: response.data.data.cashbackPercentage || 0,
          minimumOrderAmount: response.data.data.minimumOrderAmount || 0,
          maximumCashbackPerOrder: response.data.data.maximumCashbackPerOrder || 0,
          minimumCashbackToUse: response.data.data.minimumCashbackToUse || 0,
          maxCashbackUsagePercentage: response.data.data.maxCashbackUsagePercentage || 0,
          maxCashbackUsageAmount: response.data.data.maxCashbackUsageAmount || 0,
          isActive: response.data.data.isActive !== undefined ? response.data.data.isActive : true,
        });
      }
    } catch (error) {
      console.error("Error fetching cashback settings:", error);
      setErrorMessage("Failed to load cashback settings");
    }
  };

  // Load all settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setErrorMessage("");
      await Promise.all([fetchReferralSettings(), fetchCashbackSettings()]);
      setLoading(false);
    };
    loadSettings();
  }, []);

  // Update Referral Settings
  const handleUpdateReferralSettings = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Validate inputs
      if (
        referralSettings.userReferrerAmount < 0 ||
        referralSettings.userRefereeAmount < 0 ||
        referralSettings.riderReferrerAmount < 0 ||
        referralSettings.riderRefereeAmount < 0
      ) {
        setErrorMessage("All amounts must be greater than or equal to 0");
        setSaving(false);
        return;
      }

      const response = await api.put("/api/admin/referral-settings", referralSettings);
      if (response.data.success) {
        setSuccessMessage("Referral settings updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(response.data.message || "Failed to update referral settings");
      }
    } catch (error) {
      console.error("Error updating referral settings:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update referral settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // Update Cashback Settings
  const handleUpdateCashbackSettings = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Validate inputs
      if (
        cashbackSettings.cashbackPercentage < 0 ||
        cashbackSettings.cashbackPercentage > 100
      ) {
        setErrorMessage("Cashback percentage must be between 0 and 100");
        setSaving(false);
        return;
      }

      if (
        cashbackSettings.maxCashbackUsagePercentage < 0 ||
        cashbackSettings.maxCashbackUsagePercentage > 100
      ) {
        setErrorMessage("Max cashback usage percentage must be between 0 and 100");
        setSaving(false);
        return;
      }

      if (
        cashbackSettings.minimumOrderAmount < 0 ||
        cashbackSettings.maximumCashbackPerOrder < 0 ||
        cashbackSettings.minimumCashbackToUse < 0 ||
        cashbackSettings.maxCashbackUsageAmount < 0
      ) {
        setErrorMessage("All amounts must be greater than or equal to 0");
        setSaving(false);
        return;
      }

      const response = await api.put("/api/admin/cashback-settings", cashbackSettings);
      if (response.data.success) {
        setSuccessMessage("Cashback settings updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(response.data.message || "Failed to update cashback settings");
      }
    } catch (error) {
      console.error("Error updating cashback settings:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update cashback settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // Input change handlers
  const handleReferralChange = (field, value) => {
    setReferralSettings((prev) => ({
      ...prev,
      [field]: field === "isActive" ? value : parseFloat(value) || 0,
    }));
  };

  const handleCashbackChange = (field, value) => {
    setCashbackSettings((prev) => ({
      ...prev,
      [field]: field === "isActive" ? value : parseFloat(value) || 0,
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-[#F26422] mx-auto mb-4" size={40} />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Settings Management
            </h1>
            <p className="text-gray-600">
              Manage referral and cashback program settings
            </p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab("referral");
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "referral"
                    ? "text-[#F26422] border-b-2 border-[#F26422] bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users size={20} />
                  <span>Referral Settings</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cashback");
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "cashback"
                    ? "text-[#F26422] border-b-2 border-[#F26422] bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Gift size={20} />
                  <span>Cashback Settings</span>
                </div>
              </button>
            </div>

            {/* Referral Settings Tab */}
            {activeTab === "referral" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Referral Program Settings
                </h2>

                <div className="space-y-6">
                  {/* User Referrer Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Referrer Amount (₹)
                      <span className="text-gray-500 ml-1">
                        - Amount given to user who refers
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={referralSettings.userReferrerAmount}
                      onChange={(e) =>
                        handleReferralChange("userReferrerAmount", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* User Referee Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Referee Amount (₹)
                      <span className="text-gray-500 ml-1">
                        - Amount given to user who is referred
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={referralSettings.userRefereeAmount}
                      onChange={(e) =>
                        handleReferralChange("userRefereeAmount", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Rider Referrer Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rider Referrer Amount (₹)
                      <span className="text-gray-500 ml-1">
                        - Amount given to rider who refers
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={referralSettings.riderReferrerAmount}
                      onChange={(e) =>
                        handleReferralChange("riderReferrerAmount", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Rider Referee Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rider Referee Amount (₹)
                      <span className="text-gray-500 ml-1">
                        - Amount given to rider who is referred
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={referralSettings.riderRefereeAmount}
                      onChange={(e) =>
                        handleReferralChange("riderRefereeAmount", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referral Program Status
                      </label>
                      <p className="text-xs text-gray-500">
                        Enable or disable the referral program
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleReferralChange("isActive", !referralSettings.isActive)
                      }
                      className="flex items-center gap-2"
                    >
                      {referralSettings.isActive ? (
                        <ToggleRight className="text-[#247606]" size={32} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={32} />
                      )}
                      <span
                        className={`font-semibold ${
                          referralSettings.isActive
                            ? "text-[#247606]"
                            : "text-gray-500"
                        }`}
                      >
                        {referralSettings.isActive ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      onClick={handleUpdateReferralSettings}
                      disabled={saving}
                      className="bg-[#F26422] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Referral Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cashback Settings Tab */}
            {activeTab === "cashback" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Cashback Program Settings
                </h2>

                <div className="space-y-6">
                  {/* Cashback Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cashback Percentage (%)
                      <span className="text-gray-500 ml-1">
                        - Percentage of order amount given as cashback (0-100)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={cashbackSettings.cashbackPercentage}
                      onChange={(e) =>
                        handleCashbackChange("cashbackPercentage", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter percentage (0-100)"
                    />
                  </div>

                  {/* Minimum Order Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order Amount (₹)
                      <span className="text-gray-500 ml-1">
                        - Minimum order amount to earn cashback
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashbackSettings.minimumOrderAmount}
                      onChange={(e) =>
                        handleCashbackChange("minimumOrderAmount", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter minimum order amount"
                    />
                  </div>

                  {/* Maximum Cashback Per Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Cashback Per Order (₹)
                      <span className="text-gray-500 ml-1">
                        - Maximum cashback that can be earned per order (0 = no limit)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashbackSettings.maximumCashbackPerOrder}
                      onChange={(e) =>
                        handleCashbackChange("maximumCashbackPerOrder", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter maximum cashback (0 for no limit)"
                    />
                  </div>

                  {/* Minimum Cashback To Use */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Cashback To Use (₹)
                      <span className="text-gray-500 ml-1">
                        - Minimum cashback balance required to use cashback
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashbackSettings.minimumCashbackToUse}
                      onChange={(e) =>
                        handleCashbackChange("minimumCashbackToUse", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter minimum cashback to use"
                    />
                  </div>

                  {/* Max Cashback Usage Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Cashback Usage Percentage (%)
                      <span className="text-gray-500 ml-1">
                        - Maximum percentage of order amount that can be paid using cashback (0-100)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={cashbackSettings.maxCashbackUsagePercentage}
                      onChange={(e) =>
                        handleCashbackChange("maxCashbackUsagePercentage", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter percentage (0-100)"
                    />
                  </div>

                  {/* Max Cashback Usage Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Cashback Usage Amount (₹)
                      <span className="text-gray-500 ml-1">
                        - Maximum cashback amount that can be used per order (0 = no limit)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashbackSettings.maxCashbackUsageAmount}
                      onChange={(e) =>
                        handleCashbackChange("maxCashbackUsageAmount", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26422]"
                      placeholder="Enter maximum usage amount (0 for no limit)"
                    />
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cashback Program Status
                      </label>
                      <p className="text-xs text-gray-500">
                        Enable or disable the cashback program
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleCashbackChange("isActive", !cashbackSettings.isActive)
                      }
                      className="flex items-center gap-2"
                    >
                      {cashbackSettings.isActive ? (
                        <ToggleRight className="text-[#247606]" size={32} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={32} />
                      )}
                      <span
                        className={`font-semibold ${
                          cashbackSettings.isActive
                            ? "text-[#247606]"
                            : "text-gray-500"
                        }`}
                      >
                        {cashbackSettings.isActive ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      onClick={handleUpdateCashbackSettings}
                      disabled={saving}
                      className="bg-[#F26422] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Cashback Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReferralCashbackSettings;
