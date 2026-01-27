import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  User,
  Store,
  MapPin,
  CreditCard,
  Settings,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Shield,
} from "lucide-react";

const VendorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        "https://api.rushbaskets.com/api/vendor/profile",
        {
          method: "GET",
          credentials: "include",
          headers: headers,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load profile");
      }

      if (result.success) {
        setProfileData(result.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-[#FF7B1D] mx-auto"></div>
          <p className="mt-4 font-medium text-lg" style={{ color: "#FF7B1D" }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen   py-8 px-4 sm:px-6 lg:px-4 ml-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with Gradient */}
          <div
            className="rounded-sm shadow-xl p-8 mb-8 text-white"
            style={{
              background: "linear-gradient(to right, #FF7B1D, #FF9547)",
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <User size={48} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {profileData?.vendorName || "Vendor Profile"}
                  </h1>
                  <p className="text-orange-100 text-lg flex items-center gap-2">
                    <Store size={18} />
                    Store ID: {profileData?.storeId}
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <span
                  className={`inline-flex items-center gap-2 text-lg font-semibold ${profileData?.isActive ? "text-green-100" : "text-red-100"}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${profileData?.isActive ? "bg-green-300 animate-pulse" : "bg-red-300"}`}
                  ></div>
                  {profileData?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3 shadow-md">
              <AlertCircle size={24} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Personal Information */}
          <div
            className="bg-white rounded-sm shadow-lg p-8 mb-8 border-t-4"
            style={{ borderTopColor: "#FF7B1D" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                <User style={{ color: "#FF7B1D" }} size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Personal Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard
                icon={<User size={20} style={{ color: "#FF7B1D" }} />}
                label="Vendor Name"
                value={profileData?.vendorName}
              />
              <InfoCard
                icon={<Phone size={20} style={{ color: "#FF7B1D" }} />}
                label="Contact Number"
                value={profileData?.contactNumber}
              />
              <InfoCard
                icon={<Phone size={20} style={{ color: "#FF7B1D" }} />}
                label="Alt Contact Number"
                value={profileData?.altContactNumber}
              />
              <InfoCard
                icon={<Mail size={20} style={{ color: "#FF7B1D" }} />}
                label="Email"
                value={profileData?.email}
              />
              <InfoCard
                icon={<User size={20} style={{ color: "#FF7B1D" }} />}
                label="Gender"
                value={profileData?.gender}
                capitalize
              />
              <InfoCard
                icon={<Calendar size={20} style={{ color: "#FF7B1D" }} />}
                label="Date of Birth"
                value={new Date(profileData?.dateOfBirth).toLocaleDateString()}
              />
              <InfoCard
                icon={<Calendar size={20} style={{ color: "#FF7B1D" }} />}
                label="Age"
                value={`${profileData?.age} years`}
              />
            </div>
          </div>

          {/* Store Information */}
          <div
            className="bg-white rounded-sm shadow-lg p-8 mb-8 border-t-4"
            style={{ borderTopColor: "#FF7B1D" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                <Store style={{ color: "#FF7B1D" }} size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Store Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard
                icon={<Store size={20} style={{ color: "#FF7B1D" }} />}
                label="Store Name"
                value={profileData?.storeName}
              />
              <InfoCard
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="Service Radius"
                value={`${profileData?.serviceRadius} km`}
              />
              <InfoCard
                icon={<CreditCard size={20} style={{ color: "#FF7B1D" }} />}
                label="Handling Charge"
                value={`${profileData?.handlingChargePercentage}%`}
              />
              <InfoCard
                icon={<Shield size={20} style={{ color: "#FF7B1D" }} />}
                label="Status"
                value={
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${profileData?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {profileData?.isActive ? "Active" : "Inactive"}
                  </span>
                }
              />
            </div>
          </div>

          {/* Address Information */}
          <div
            className="bg-white rounded-sm shadow-lg p-8 mb-8 border-t-4"
            style={{ borderTopColor: "#FF7B1D" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                <MapPin style={{ color: "#FF7B1D" }} size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Store Address
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <InfoCard
                  icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                  label="Address Line 1"
                  value={profileData?.storeAddress.line1}
                />
              </div>
              <div className="lg:col-span-2">
                <InfoCard
                  icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                  label="Address Line 2"
                  value={profileData?.storeAddress.line2}
                />
              </div>
              <InfoCard
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="City"
                value={profileData?.storeAddress.city}
              />
              <InfoCard
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="State"
                value={profileData?.storeAddress.state}
              />
              <InfoCard
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="Pin Code"
                value={profileData?.storeAddress.pinCode}
              />
              <InfoCard
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="Latitude"
                value={profileData?.storeAddress.latitude}
              />
              <InfoCard
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="Longitude"
                value={profileData?.storeAddress.longitude}
              />
            </div>
          </div>

          {/* Bank Details */}
          <div
            className="bg-white rounded-sm shadow-lg p-8 mb-8 border-t-4"
            style={{ borderTopColor: "#FF7B1D" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                <CreditCard style={{ color: "#FF7B1D" }} size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                icon={<CreditCard size={20} style={{ color: "#FF7B1D" }} />}
                label="Bank Name"
                value={profileData?.bankDetails.bankName}
              />
              <InfoCard
                icon={<CreditCard size={20} style={{ color: "#FF7B1D" }} />}
                label="Account Number"
                value={profileData?.bankDetails.accountNumber}
              />
              <InfoCard
                icon={<CreditCard size={20} style={{ color: "#FF7B1D" }} />}
                label="IFSC Code"
                value={profileData?.bankDetails.ifsc}
              />
            </div>
          </div>

          {/* Permissions */}
          <div
            className="bg-white rounded-sm shadow-lg p-8 border-t-4"
            style={{ borderTopColor: "#FF7B1D" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                <Settings style={{ color: "#FF7B1D" }} size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Permissions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {profileData &&
                Object.entries(profileData.permissions).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      value
                        ? "bg-green-50 border-2 border-green-200"
                        : "bg-gray-50 border-2 border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex-shrink-0 ${value ? "bg-green-500 shadow-lg shadow-green-200" : "bg-gray-300"}`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${value ? "text-green-700" : "text-gray-600"}`}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Reusable InfoCard Component
const InfoCard = ({ icon, label, value, capitalize = false }) => (
  <div
    className="p-5 rounded-sm border hover:shadow-md transition-shadow"
    style={{
      background: "linear-gradient(to bottom right, #FFF0E6, white)",
      borderColor: "#FFE5D1",
    }}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
      <label className="text-sm font-semibold text-gray-600">{label}</label>
    </div>
    <p
      className={`text-gray-900 font-medium text-lg ml-10 ${capitalize ? "capitalize" : ""}`}
    >
      {value || "N/A"}
    </p>
  </div>
);

export default VendorProfile;
