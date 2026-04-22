import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  User,
  Store,
  MapPin,
  CreditCard,
  Edit2,
  Save,
  X,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Shield,
  Truck,
  Navigation,
  Loader,
  CheckCircle,
} from "lucide-react";

const VendorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    vendorName: "",
    altContactNumber: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    storeName: "",
    storeAddressLine1: "",
    storeAddressLine2: "",
    pinCode: "",
    latitude: "",
    longitude: "",
    ifsc: "",
    accountNumber: "",
    bankName: "",
    serviceRadius: "",
    handlingChargePercentage: "",
    fssaiNumber: "",
    deliveryChargePerKm: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [storeImage, setStoreImage] = useState(null);
  const [storeImagePreview, setStoreImagePreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        "https://api.rushbaskets.com/api/vendor/profile",
        {
          method: "GET",
          credentials: "include",
          headers,
        },
      );
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Failed to load profile");

      if (result.success) {
        setProfileData(result.data);
        setFormData({
          vendorName: result.data.vendorName || "",
          altContactNumber: result.data.altContactNumber || "",
          email: result.data.email || "",
          gender: result.data.gender || "",
          dateOfBirth: result.data.dateOfBirth
            ? result.data.dateOfBirth.split("T")[0]
            : "",
          storeName: result.data.storeName || "",
          storeAddressLine1: result.data.storeAddress.line1 || "",
          storeAddressLine2: result.data.storeAddress.line2 || "",
          pinCode: result.data.storeAddress.pinCode || "",
          latitude: result.data.storeAddress.latitude || "",
          longitude: result.data.storeAddress.longitude || "",
          ifsc: result.data.bankDetails.ifsc || "",
          accountNumber: result.data.bankDetails.accountNumber || "",
          bankName: result.data.bankDetails.bankName || "",
          serviceRadius: result.data.serviceRadius || "",
          handlingChargePercentage: result.data.handlingChargePercentage || "",
          fssaiNumber: result.data.fssaiNumber || "",
          deliveryChargePerKm:
            result.data.deliveryChargePerKm !== undefined &&
            result.data.deliveryChargePerKm !== null
              ? result.data.deliveryChargePerKm
              : "",
        });

        if (result.data.profileImage) {
          const url = Array.isArray(result.data.profileImage)
            ? result.data.profileImage[0]?.url
            : result.data.profileImage?.url || result.data.profileImage;
          setProfileImagePreview(url);
        }
        if (result.data.storeImage) {
          const url = Array.isArray(result.data.storeImage)
            ? result.data.storeImage[0]?.url
            : result.data.storeImage?.url || result.data.storeImage;
          setStoreImagePreview(url);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setFetchingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));
        setFetchingLocation(false);
      },
      (err) => {
        setFetchingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location permission denied.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError(
              "An unknown error occurred while fetching location.",
            );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleStoreImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setStoreImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setStoreImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    const fi = document.getElementById("profile-image-upload");
    if (fi) fi.value = "";
  };

  const handleRemoveStoreImage = () => {
    setStoreImage(null);
    setStoreImagePreview(null);
    const fi = document.getElementById("store-image-upload");
    if (fi) fi.value = "";
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (profileImage || storeImage) {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          if (v !== "") fd.append(k, v);
        });
        const sr = formData.serviceRadius
          ? parseFloat(formData.serviceRadius)
          : profileData?.serviceRadius || 5;
        if (isNaN(sr) || sr < 0.1)
          throw new Error("Service radius must be at least 0.1 km");
        fd.set("serviceRadius", sr.toString());
        fd.set(
          "deliveryChargePerKm",
          (parseFloat(formData.deliveryChargePerKm) || 0).toString(),
        );
        if (profileImage) fd.append("profileImage", profileImage);
        if (storeImage) fd.append("storeImage", storeImage);

        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const response = await fetch(
          "https://api.rushbaskets.com/api/vendor/profile",
          { method: "PUT", credentials: "include", headers, body: fd },
        );
        const result = await response.json();
        if (!response.ok || !result.success)
          throw new Error(
            result.message ||
              result.error ||
              `Failed to update profile (${response.status})`,
          );
        setProfileData(result.data);
        setProfileImage(null);
        setStoreImage(null);
        if (result.data.profileImage) {
          const url = Array.isArray(result.data.profileImage)
            ? result.data.profileImage[0]?.url
            : result.data.profileImage?.url || result.data.profileImage;
          setProfileImagePreview(url);
        }
        if (result.data.storeImage) {
          const url = Array.isArray(result.data.storeImage)
            ? result.data.storeImage[0]?.url
            : result.data.storeImage?.url || result.data.storeImage;
          setStoreImagePreview(url);
        }
      } else {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const sr = formData.serviceRadius
          ? parseFloat(formData.serviceRadius)
          : profileData?.serviceRadius || 5;
        if (isNaN(sr) || sr < 0.1)
          throw new Error("Service radius must be at least 0.1 km");
        const response = await fetch(
          "https://api.rushbaskets.com/api/vendor/profile",
          {
            method: "PUT",
            credentials: "include",
            headers,
            body: JSON.stringify({
              ...(formData.vendorName && {
                vendorName: formData.vendorName.trim(),
              }),
              ...(formData.altContactNumber && {
                altContactNumber: formData.altContactNumber.trim(),
              }),
              ...(formData.email && { email: formData.email.trim() }),
              ...(formData.gender && { gender: formData.gender }),
              ...(formData.dateOfBirth && {
                dateOfBirth: formData.dateOfBirth,
              }),
              ...(formData.storeName && {
                storeName: formData.storeName.trim(),
              }),
              ...(formData.storeAddressLine1 && {
                storeAddressLine1: formData.storeAddressLine1.trim(),
              }),
              ...(formData.storeAddressLine2 && {
                storeAddressLine2: formData.storeAddressLine2.trim(),
              }),
              ...(formData.pinCode && { pinCode: formData.pinCode.trim() }),
              ...(formData.latitude && {
                latitude: parseFloat(formData.latitude),
              }),
              ...(formData.longitude && {
                longitude: parseFloat(formData.longitude),
              }),
              ...(formData.ifsc && {
                ifsc: formData.ifsc.trim().toUpperCase(),
              }),
              ...(formData.accountNumber && {
                accountNumber: formData.accountNumber.trim(),
              }),
              ...(formData.bankName && { bankName: formData.bankName.trim() }),
              serviceRadius: sr,
              ...(formData.handlingChargePercentage && {
                handlingChargePercentage: parseFloat(
                  formData.handlingChargePercentage,
                ),
              }),
              ...(formData.fssaiNumber && {
                fssaiNumber: formData.fssaiNumber.trim(),
              }),
              deliveryChargePerKm:
                formData.deliveryChargePerKm !== ""
                  ? parseFloat(formData.deliveryChargePerKm) || 0
                  : 0,
            }),
          },
        );
        const result = await response.json();
        if (!response.ok || !result.success)
          throw new Error(
            result.message ||
              result.error ||
              `Failed to update profile (${response.status})`,
          );
        setProfileData(result.data);
      }
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        vendorName: profileData.vendorName || "",
        altContactNumber: profileData.altContactNumber || "",
        email: profileData.email || "",
        gender: profileData.gender || "",
        dateOfBirth: profileData.dateOfBirth
          ? profileData.dateOfBirth.split("T")[0]
          : "",
        storeName: profileData.storeName || "",
        storeAddressLine1: profileData.storeAddress.line1 || "",
        storeAddressLine2: profileData.storeAddress.line2 || "",
        pinCode: profileData.storeAddress.pinCode || "",
        latitude: profileData.storeAddress.latitude || "",
        longitude: profileData.storeAddress.longitude || "",
        ifsc: profileData.bankDetails.ifsc || "",
        accountNumber: profileData.bankDetails.accountNumber || "",
        bankName: profileData.bankDetails.bankName || "",
        serviceRadius: profileData.serviceRadius || "",
        handlingChargePercentage: profileData.handlingChargePercentage || "",
        fssaiNumber: profileData.fssaiNumber || "",
        deliveryChargePerKm:
          profileData.deliveryChargePerKm !== undefined &&
          profileData.deliveryChargePerKm !== null
            ? profileData.deliveryChargePerKm
            : "",
      });
      setProfileImage(null);
      setStoreImage(null);
      if (profileData.profileImage) {
        const url = Array.isArray(profileData.profileImage)
          ? profileData.profileImage[0]?.url
          : profileData.profileImage?.url || profileData.profileImage;
        setProfileImagePreview(url);
      } else setProfileImagePreview(null);
      if (profileData.storeImage) {
        const url = Array.isArray(profileData.storeImage)
          ? profileData.storeImage[0]?.url
          : profileData.storeImage?.url || profileData.storeImage;
        setStoreImagePreview(url);
      } else setStoreImagePreview(null);
      const pi = document.getElementById("profile-image-upload");
      if (pi) pi.value = "";
      const si = document.getElementById("store-image-upload");
      if (si) si.value = "";
    }
    setIsEditing(false);
    setError(null);
    setLocationError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-[#FF7B1D] mx-auto" />
          <p className="mt-4 font-medium text-lg text-[#FF7B1D]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen py-2 px-2 sm:px-4">
        <div className="w-full max-w-none">
          {/* ── Hero Header ── */}
          <div className="rounded-2xl shadow-lg p-8 mb-6 text-white bg-gradient-to-r from-[#FF7B1D] to-orange-400">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <User size={40} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${profileData?.isActive ? "bg-emerald-400" : "bg-gray-400"}`}
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    {profileData?.vendorName || "Vendor Profile"}
                  </h1>
                  <p className="text-orange-100 text-sm flex items-center gap-2">
                    <Store size={14} />
                    Store ID: {profileData?.storeId}
                  </p>
                  <p className="text-orange-100 text-sm flex items-center gap-2 mt-0.5">
                    <Phone size={14} />
                    {profileData?.contactNumber}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-[#FF7B1D] rounded-xl hover:bg-orange-50 transition-all shadow-lg font-semibold text-sm"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm font-semibold text-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-[#FF7B1D] rounded-xl hover:bg-orange-50 transition-all shadow-lg disabled:opacity-50 font-semibold text-sm"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Alerts ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-2xl mb-5 flex items-center gap-3 shadow-sm text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3.5 rounded-2xl mb-5 flex items-center gap-3 shadow-sm text-sm">
              <CheckCircle size={18} className="flex-shrink-0" />
              <span className="font-medium">{success}</span>
            </div>
          )}

          {/* ── Personal Information ── */}
          <Section
            icon={<User size={20} className="text-[#FF7B1D]" />}
            title="Personal Information"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <FormField
                icon={<User size={16} className="text-[#FF7B1D]" />}
                label="Vendor Name"
                name="vendorName"
                value={formData.vendorName}
                displayValue={profileData?.vendorName}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<Phone size={16} className="text-[#FF7B1D]" />}
                label="Contact Number"
                value={profileData?.contactNumber}
                displayValue={profileData?.contactNumber}
                isEditing={false}
              />
              <FormField
                icon={<Phone size={16} className="text-[#FF7B1D]" />}
                label="Alt Contact Number"
                name="altContactNumber"
                value={formData.altContactNumber}
                displayValue={profileData?.altContactNumber}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<Mail size={16} className="text-[#FF7B1D]" />}
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                displayValue={profileData?.email}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<User size={16} className="text-[#FF7B1D]" />}
                label="Gender"
                name="gender"
                value={formData.gender}
                displayValue={profileData?.gender}
                isEditing={isEditing}
                onChange={handleInputChange}
                type="select"
                options={[
                  { value: "", label: "Select Gender" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                capitalize
              />
              <FormField
                icon={<Calendar size={16} className="text-[#FF7B1D]" />}
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                displayValue={new Date(
                  profileData?.dateOfBirth,
                ).toLocaleDateString()}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<Calendar size={16} className="text-[#FF7B1D]" />}
                label="Age"
                value={`${profileData?.age} years`}
                displayValue={`${profileData?.age} years`}
                isEditing={false}
              />

              {/* Profile Image */}
              <div className="xl:col-span-4 lg:col-span-3 md:col-span-2">
                <ImageUploadField
                  label="Profile Image"
                  icon={<User size={16} className="text-[#FF7B1D]" />}
                  preview={profileImagePreview}
                  isEditing={isEditing}
                  onRemove={handleRemoveProfileImage}
                  onChange={handleProfileImageChange}
                  inputId="profile-image-upload"
                  hasFile={!!profileImage}
                  shape="circle"
                />
              </div>
            </div>
          </Section>

          {/* ── Store Information ── */}
          <Section
            icon={<Store size={20} className="text-[#FF7B1D]" />}
            title="Store Information"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <FormField
                icon={<Store size={16} className="text-[#FF7B1D]" />}
                label="Store Name"
                name="storeName"
                value={formData.storeName}
                displayValue={profileData?.storeName}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<MapPin size={16} className="text-[#FF7B1D]" />}
                label="Service Radius (km)"
                name="serviceRadius"
                type="number"
                step="0.1"
                value={formData.serviceRadius}
                displayValue={`${profileData?.serviceRadius} km`}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<CreditCard size={16} className="text-[#FF7B1D]" />}
                label="Handling Charge (%)"
                name="handlingChargePercentage"
                type="number"
                step="0.1"
                value={formData.handlingChargePercentage}
                displayValue={`${profileData?.handlingChargePercentage}%`}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<Truck size={16} className="text-[#FF7B1D]" />}
                label="Delivery Charge / Km"
                name="deliveryChargePerKm"
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryChargePerKm}
                displayValue={
                  profileData?.deliveryChargePerKm !== undefined &&
                  profileData?.deliveryChargePerKm !== null
                    ? `₹${Number(profileData.deliveryChargePerKm).toFixed(2)} / km`
                    : "₹0.00 / km"
                }
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter delivery charge per km"
              />
              <FormField
                icon={<Shield size={16} className="text-[#FF7B1D]" />}
                label="FSSAI Number"
                name="fssaiNumber"
                value={formData.fssaiNumber}
                displayValue={profileData?.fssaiNumber || "N/A"}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter FSSAI Number"
              />
              <div className="p-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm">
                    <Shield size={16} className="text-[#FF7B1D]" />
                  </div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${profileData?.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${profileData?.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                  {profileData?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Store Image */}
              <div className="xl:col-span-4 lg:col-span-3 md:col-span-2">
                <ImageUploadField
                  label="Store Image"
                  icon={<Store size={16} className="text-[#FF7B1D]" />}
                  preview={storeImagePreview}
                  isEditing={isEditing}
                  onRemove={handleRemoveStoreImage}
                  onChange={handleStoreImageChange}
                  inputId="store-image-upload"
                  hasFile={!!storeImage}
                  shape="rounded"
                />
              </div>
            </div>
          </Section>

          {/* ── Store Address ── */}
          <Section
            icon={<MapPin size={20} className="text-[#FF7B1D]" />}
            title="Store Address"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="xl:col-span-2 lg:col-span-2 md:col-span-2">
                <FormField
                  icon={<MapPin size={16} className="text-[#FF7B1D]" />}
                  label="Address Line 1"
                  name="storeAddressLine1"
                  value={formData.storeAddressLine1}
                  displayValue={profileData?.storeAddress.line1}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              </div>
              <div className="xl:col-span-2 lg:col-span-2 md:col-span-2">
                <FormField
                  icon={<MapPin size={16} className="text-[#FF7B1D]" />}
                  label="Address Line 2"
                  name="storeAddressLine2"
                  value={formData.storeAddressLine2}
                  displayValue={profileData?.storeAddress.line2}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              </div>
              <FormField
                icon={<MapPin size={16} className="text-[#FF7B1D]" />}
                label="City"
                displayValue={profileData?.storeAddress.city}
                isEditing={false}
              />
              <FormField
                icon={<MapPin size={16} className="text-[#FF7B1D]" />}
                label="State"
                displayValue={profileData?.storeAddress.state}
                isEditing={false}
              />
              <FormField
                icon={<MapPin size={16} className="text-[#FF7B1D]" />}
                label="Pin Code"
                name="pinCode"
                value={formData.pinCode}
                displayValue={profileData?.storeAddress.pinCode}
                isEditing={isEditing}
                onChange={handleInputChange}
              />

              {/* Coordinates */}
              <div className="xl:col-span-4 lg:col-span-3 md:col-span-2">
                <div className="p-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-1.5 rounded-lg shadow-sm">
                        <Navigation size={16} className="text-[#FF7B1D]" />
                      </div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Store Coordinates
                      </label>
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        disabled={fetchingLocation}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {fetchingLocation ? (
                          <>
                            <Loader size={13} className="animate-spin" />
                            Fetching...
                          </>
                        ) : (
                          <>
                            <Navigation size={13} />
                            Use Current Location
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {locationError && (
                    <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2">
                      <AlertCircle size={13} className="mt-0.5 shrink-0" />
                      <span>{locationError}</span>
                    </div>
                  )}
                  {formData.latitude &&
                    formData.longitude &&
                    isEditing &&
                    !locationError && (
                      <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl px-3 py-2">
                        <MapPin size={12} />
                        <span>
                          Coordinates set: {formData.latitude},{" "}
                          {formData.longitude}
                        </span>
                      </div>
                    )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                        Latitude
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          step="0.000001"
                          placeholder="e.g. 28.613939"
                          className="w-full px-4 py-2.5 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-sm bg-white"
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold text-base">
                          {profileData?.storeAddress.latitude || "N/A"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                        Longitude
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          step="0.000001"
                          placeholder="e.g. 77.209021"
                          className="w-full px-4 py-2.5 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-sm bg-white"
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold text-base">
                          {profileData?.storeAddress.longitude || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Bank Details ── */}
          <Section
            icon={<CreditCard size={20} className="text-[#FF7B1D]" />}
            title="Bank Details"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                icon={<CreditCard size={16} className="text-[#FF7B1D]" />}
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                displayValue={profileData?.bankDetails.bankName}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<CreditCard size={16} className="text-[#FF7B1D]" />}
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                displayValue={profileData?.bankDetails.accountNumber}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<CreditCard size={16} className="text-[#FF7B1D]" />}
                label="IFSC Code"
                name="ifsc"
                value={formData.ifsc}
                displayValue={profileData?.bankDetails.ifsc}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
            </div>
          </Section>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ── Section Wrapper ──────────────────────────────────────────────────────────
const Section = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-orange-100">
      <div className="p-2.5 rounded-xl bg-orange-50">{icon}</div>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

// ── FormField ────────────────────────────────────────────────────────────────
const FormField = ({
  icon,
  label,
  name,
  value,
  displayValue,
  isEditing,
  onChange,
  type = "text",
  step,
  min,
  options,
  capitalize = false,
  placeholder = "",
}) => (
  <div className="p-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white hover:shadow-sm transition-shadow">
    <div className="flex items-center gap-2 mb-2.5">
      <div className="bg-white p-1.5 rounded-lg shadow-sm">{icon}</div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
    </div>
    {isEditing && name ? (
      type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-sm bg-white"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all text-sm bg-white"
        />
      )
    ) : (
      <p
        className={`text-gray-900 font-semibold text-sm ${capitalize ? "capitalize" : ""}`}
      >
        {displayValue || "N/A"}
      </p>
    )}
  </div>
);

// ── ImageUploadField ─────────────────────────────────────────────────────────
const ImageUploadField = ({
  label,
  icon,
  preview,
  isEditing,
  onRemove,
  onChange,
  inputId,
  hasFile,
  shape,
}) => (
  <div className="p-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white">
    <div className="flex items-center gap-2 mb-3">
      <div className="bg-white p-1.5 rounded-lg shadow-sm">{icon}</div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
    </div>
    <div className="flex items-center gap-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className={`object-cover border-2 border-orange-300 shadow-sm ${shape === "circle" ? "w-20 h-20 rounded-full" : "w-28 h-20 rounded-xl"}`}
          />
          {isEditing && (
            <button
              onClick={onRemove}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 ${shape === "circle" ? "w-20 h-20 rounded-full" : "w-28 h-20 rounded-xl"}`}
        >
          {shape === "circle" ? (
            <User size={28} className="text-gray-400" />
          ) : (
            <Store size={28} className="text-gray-400" />
          )}
        </div>
      )}
      {isEditing && (
        <label
          htmlFor={inputId}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF7B1D] text-white rounded-xl hover:bg-orange-600 cursor-pointer transition-colors text-xs font-semibold shadow-sm"
        >
          <Edit2 size={14} />
          {hasFile ? "Change" : "Upload"}
          <input
            type="file"
            id={inputId}
            onChange={onChange}
            className="hidden"
            accept="image/*"
          />
        </label>
      )}
    </div>
  </div>
);

export default VendorProfile;
