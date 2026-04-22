import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Loader2, Save, Users, Gift } from "lucide-react";
import api from "../../api/api";

const ReferralCashbackSettings = () => {
  const [activeTab, setActiveTab] = useState("referral");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [referralSettings, setReferralSettings] = useState({
    userReferrerAmount: 0,
    userRefereeAmount: 0,
    riderReferrerAmount: 0,
    riderRefereeAmount: 0,
    isActive: true,
  });

  const [cashbackSettings, setCashbackSettings] = useState({
    cashbackPercentage: 0,
    minimumOrderAmount: 0,
    maximumCashbackPerOrder: 0,
    minimumCashbackToUse: 0,
    maxCashbackUsagePercentage: 0,
    maxCashbackUsageAmount: 0,
    isActive: true,
  });

  const fetchReferralSettings = async () => {
    try {
      const response = await api.get("/api/admin/referral-settings");
      if (response.data.success && response.data.data) {
        setReferralSettings({
          userReferrerAmount: response.data.data.userReferrerAmount || 0,
          userRefereeAmount: response.data.data.userRefereeAmount || 0,
          riderReferrerAmount: response.data.data.riderReferrerAmount || 0,
          riderRefereeAmount: response.data.data.riderRefereeAmount || 0,
          isActive:
            response.data.data.isActive !== undefined
              ? response.data.data.isActive
              : true,
        });
      }
    } catch (error) {
      setErrorMessage("Failed to load referral settings");
    }
  };

  const fetchCashbackSettings = async () => {
    try {
      const response = await api.get("/api/admin/cashback-settings");
      if (response.data.success && response.data.data) {
        setCashbackSettings({
          cashbackPercentage: response.data.data.cashbackPercentage || 0,
          minimumOrderAmount: response.data.data.minimumOrderAmount || 0,
          maximumCashbackPerOrder:
            response.data.data.maximumCashbackPerOrder || 0,
          minimumCashbackToUse: response.data.data.minimumCashbackToUse || 0,
          maxCashbackUsagePercentage:
            response.data.data.maxCashbackUsagePercentage || 0,
          maxCashbackUsageAmount:
            response.data.data.maxCashbackUsageAmount || 0,
          isActive:
            response.data.data.isActive !== undefined
              ? response.data.data.isActive
              : true,
        });
      }
    } catch (error) {
      setErrorMessage("Failed to load cashback settings");
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      await Promise.all([fetchReferralSettings(), fetchCashbackSettings()]);
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleUpdateReferralSettings = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      if (
        referralSettings.userReferrerAmount < 0 ||
        referralSettings.userRefereeAmount < 0 ||
        referralSettings.riderReferrerAmount < 0 ||
        referralSettings.riderRefereeAmount < 0
      ) {
        setErrorMessage("All amounts must be >= 0");
        return;
      }
      const response = await api.put(
        "/api/admin/referral-settings",
        referralSettings,
      );
      if (response.data.success) {
        setSuccessMessage("Referral settings updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(
          response.data.message || "Failed to update referral settings",
        );
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update referral settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCashbackSettings = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      if (
        cashbackSettings.cashbackPercentage < 0 ||
        cashbackSettings.cashbackPercentage > 100
      ) {
        setErrorMessage("Cashback percentage must be between 0 and 100");
        return;
      }
      if (
        cashbackSettings.maxCashbackUsagePercentage < 0 ||
        cashbackSettings.maxCashbackUsagePercentage > 100
      ) {
        setErrorMessage(
          "Max cashback usage percentage must be between 0 and 100",
        );
        return;
      }
      const response = await api.put(
        "/api/admin/cashback-settings",
        cashbackSettings,
      );
      if (response.data.success) {
        setSuccessMessage("Cashback settings updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(
          response.data.message || "Failed to update cashback settings",
        );
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update cashback settings",
      );
    } finally {
      setSaving(false);
    }
  };

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

  const StatusBadge = ({ isActive }) => (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100"
          : "bg-gray-50 text-gray-500 border-gray-200 ring-gray-100"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  const FieldInput = ({ label, hint, value, onChange, ...props }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700">
        {label} <span className="text-gray-400 font-normal">{hint}</span>
      </label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] h-9 transition-all"
        {...props}
      />
    </div>
  );

  const ToggleSwitch = ({ isActive, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2.5">
      <div
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
          isActive ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[3px] transition-all duration-200 shadow ${
            isActive ? "left-[23px]" : "left-[3px]"
          }`}
          style={{ width: 18, height: 18 }}
        />
      </div>
      <span
        className={`text-xs font-semibold ${isActive ? "text-emerald-600" : "text-gray-400"}`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </button>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2
              className="animate-spin text-[#FF7B1D] mx-auto mb-3"
              size={36}
            />
            <p className="text-sm text-gray-400 font-medium">
              Loading settings...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { key: "referral", label: "Referral settings", icon: <Users size={14} /> },
    { key: "cashback", label: "Cashback settings", icon: <Gift size={14} /> },
  ];

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeSlideIn 0.25s ease forwards; }
      `}</style>

      <div className="px-1 mt-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          {/* Tab Pills */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                {activeTab === "referral"
                  ? "Referral program settings"
                  : "Cashback program settings"}
              </span>
            </div>
            <StatusBadge
              isActive={
                activeTab === "referral"
                  ? referralSettings.isActive
                  : cashbackSettings.isActive
              }
            />
          </div>

          {/* Orange Column Headers */}
          {activeTab === "referral" && (
            <div className="grid grid-cols-4 gap-4 px-5 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400">
              {[
                "User referrer (₹)",
                "User referee (₹)",
                "Rider referrer (₹)",
                "Rider referee (₹)",
              ].map((h) => (
                <span
                  key={h}
                  className="text-xs font-bold text-white uppercase tracking-wider opacity-90"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
          {activeTab === "cashback" && (
            <div className="grid grid-cols-3 gap-4 px-5 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400">
              {["Earning rules", "Limits", "Usage rules"].map((h) => (
                <span
                  key={h}
                  className="text-xs font-bold text-white uppercase tracking-wider opacity-90"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Form Body */}
          <div className="p-5 fade-in">
            {activeTab === "referral" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldInput
                    label="User referrer amount"
                    hint="— amount given to user who refers"
                    value={referralSettings.userReferrerAmount}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleReferralChange("userReferrerAmount", e.target.value)
                    }
                  />
                  <FieldInput
                    label="User referee amount"
                    hint="— amount given to referred user"
                    value={referralSettings.userRefereeAmount}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleReferralChange("userRefereeAmount", e.target.value)
                    }
                  />
                  <FieldInput
                    label="Rider referrer amount"
                    hint="— amount given to rider who refers"
                    value={referralSettings.riderReferrerAmount}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleReferralChange(
                        "riderReferrerAmount",
                        e.target.value,
                      )
                    }
                  />
                  <FieldInput
                    label="Rider referee amount"
                    hint="— amount given to referred rider"
                    value={referralSettings.riderRefereeAmount}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleReferralChange("riderRefereeAmount", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">
                      Referral program status
                    </p>
                    <p className="text-xs text-gray-400">
                      Enable or disable the referral program
                    </p>
                  </div>
                  <ToggleSwitch
                    isActive={referralSettings.isActive}
                    onClick={() =>
                      handleReferralChange(
                        "isActive",
                        !referralSettings.isActive,
                      )
                    }
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    onClick={handleUpdateReferralSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#FF7B1D] text-white text-xs font-semibold rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save referral settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "cashback" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldInput
                    label="Cashback percentage"
                    hint="— % of order amount (0–100)"
                    value={cashbackSettings.cashbackPercentage}
                    min="0"
                    max="100"
                    step="0.01"
                    onChange={(e) =>
                      handleCashbackChange("cashbackPercentage", e.target.value)
                    }
                  />
                  <FieldInput
                    label="Minimum order amount"
                    hint="— minimum to earn cashback (₹)"
                    value={cashbackSettings.minimumOrderAmount}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleCashbackChange("minimumOrderAmount", e.target.value)
                    }
                  />
                  <FieldInput
                    label="Maximum cashback per order"
                    hint="— 0 = no limit (₹)"
                    value={cashbackSettings.maximumCashbackPerOrder}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleCashbackChange(
                        "maximumCashbackPerOrder",
                        e.target.value,
                      )
                    }
                  />
                  <FieldInput
                    label="Minimum cashback to use"
                    hint="— minimum balance to redeem (₹)"
                    value={cashbackSettings.minimumCashbackToUse}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleCashbackChange(
                        "minimumCashbackToUse",
                        e.target.value,
                      )
                    }
                  />
                  <FieldInput
                    label="Max cashback usage %"
                    hint="— max % of order via cashback"
                    value={cashbackSettings.maxCashbackUsagePercentage}
                    min="0"
                    max="100"
                    step="0.01"
                    onChange={(e) =>
                      handleCashbackChange(
                        "maxCashbackUsagePercentage",
                        e.target.value,
                      )
                    }
                  />
                  <FieldInput
                    label="Max cashback usage amount"
                    hint="— max per order, 0 = no limit (₹)"
                    value={cashbackSettings.maxCashbackUsageAmount}
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      handleCashbackChange(
                        "maxCashbackUsageAmount",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">
                      Cashback program status
                    </p>
                    <p className="text-xs text-gray-400">
                      Enable or disable the cashback program
                    </p>
                  </div>
                  <ToggleSwitch
                    isActive={cashbackSettings.isActive}
                    onClick={() =>
                      handleCashbackChange(
                        "isActive",
                        !cashbackSettings.isActive,
                      )
                    }
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    onClick={handleUpdateCashbackSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#FF7B1D] text-white text-xs font-semibold rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save cashback settings
                      </>
                    )}
                  </button>
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
