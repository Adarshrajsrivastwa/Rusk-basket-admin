import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  User,
  Store,
  MapPin,
  CreditCard,
  Settings,
  Edit2,
  Save,
  X,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Shield,
  Truck,
} from "lucide-react";

const VendorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
          deliveryChargePerKm: result.data.deliveryChargePerKm !== undefined && result.data.deliveryChargePerKm !== null 
            ? result.data.deliveryChargePerKm 
            : "",
        });
        
        // Set image previews
        if (result.data.profileImage) {
          const profileImgUrl = Array.isArray(result.data.profileImage) 
            ? result.data.profileImage[0]?.url 
            : result.data.profileImage?.url || result.data.profileImage;
          setProfileImagePreview(profileImgUrl);
        }
        if (result.data.storeImage) {
          const storeImgUrl = Array.isArray(result.data.storeImage) 
            ? result.data.storeImage[0]?.url 
            : result.data.storeImage?.url || result.data.storeImage;
          setStoreImagePreview(storeImgUrl);
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

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle store image change
  const handleStoreImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setStoreImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove profile image
  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    const fileInput = document.getElementById("profile-image-upload");
    if (fileInput) fileInput.value = "";
  };

  // Handle remove store image
  const handleRemoveStoreImage = () => {
    setStoreImage(null);
    setStoreImagePreview(null);
    const fileInput = document.getElementById("store-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      // If images are selected, use FormData
      if (profileImage || storeImage) {
        const formDataToSend = new FormData();
        
        // Add all form fields
        formDataToSend.append("vendorName", formData.vendorName || "");
        formDataToSend.append("altContactNumber", formData.altContactNumber || "");
        formDataToSend.append("email", formData.email || "");
        formDataToSend.append("gender", formData.gender || "");
        formDataToSend.append("dateOfBirth", formData.dateOfBirth || "");
        formDataToSend.append("storeName", formData.storeName || "");
        formDataToSend.append("storeAddressLine1", formData.storeAddressLine1 || "");
        formDataToSend.append("storeAddressLine2", formData.storeAddressLine2 || "");
        formDataToSend.append("pinCode", formData.pinCode || "");
        if (formData.latitude) {
          formDataToSend.append("latitude", formData.latitude);
        }
        if (formData.longitude) {
          formDataToSend.append("longitude", formData.longitude);
        }
        formDataToSend.append("ifsc", formData.ifsc || "");
        formDataToSend.append("accountNumber", formData.accountNumber || "");
        formDataToSend.append("bankName", formData.bankName || "");
        if (formData.serviceRadius) {
          formDataToSend.append("serviceRadius", formData.serviceRadius);
        }
        if (formData.handlingChargePercentage) {
          formDataToSend.append("handlingChargePercentage", formData.handlingChargePercentage);
        }
        if (formData.fssaiNumber) {
          formDataToSend.append("fssaiNumber", formData.fssaiNumber);
        }
        // Always send deliveryChargePerKm, even if it's 0
        const deliveryChargeValue = formData.deliveryChargePerKm !== undefined && formData.deliveryChargePerKm !== null && formData.deliveryChargePerKm !== ""
          ? parseFloat(formData.deliveryChargePerKm) || 0
          : 0;
        formDataToSend.append("deliveryChargePerKm", deliveryChargeValue.toString());

        // Add images if selected
        if (profileImage) {
          formDataToSend.append("profileImage", profileImage);
        }
        if (storeImage) {
          formDataToSend.append("storeImage", storeImage);
        }

        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          "https://api.rushbaskets.com/api/vendor/profile",
          {
            method: "PUT",
            credentials: "include",
            headers: headers,
            body: formDataToSend,
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update profile");
        }

        if (result.success) {
          setProfileData(result.data);
          setProfileImage(null);
          setStoreImage(null);
          // Update previews from response
          if (result.data.profileImage) {
            const profileImgUrl = Array.isArray(result.data.profileImage) 
              ? result.data.profileImage[0]?.url 
              : result.data.profileImage?.url || result.data.profileImage;
            setProfileImagePreview(profileImgUrl);
          }
          if (result.data.storeImage) {
            const storeImgUrl = Array.isArray(result.data.storeImage) 
              ? result.data.storeImage[0]?.url 
              : result.data.storeImage?.url || result.data.storeImage;
            setStoreImagePreview(storeImgUrl);
          }
          setSuccess("Profile updated successfully!");
          setIsEditing(false);
          setTimeout(() => setSuccess(null), 3000);
        }
      } else {
        // No images, use JSON
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          "https://api.rushbaskets.com/api/vendor/profile",
          {
            method: "PUT",
            credentials: "include",
            headers: headers,
            body: JSON.stringify({
              ...formData,
              fssaiNumber: formData.fssaiNumber || "",
              deliveryChargePerKm: formData.deliveryChargePerKm !== undefined && formData.deliveryChargePerKm !== null && formData.deliveryChargePerKm !== ""
                ? parseFloat(formData.deliveryChargePerKm) || 0
                : 0,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update profile");
        }

        if (result.success) {
          setProfileData(result.data);
          setSuccess("Profile updated successfully!");
          setIsEditing(false);
          setTimeout(() => setSuccess(null), 3000);
        }
      }
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
        deliveryChargePerKm: profileData.deliveryChargePerKm !== undefined && profileData.deliveryChargePerKm !== null 
          ? profileData.deliveryChargePerKm 
          : "",
      });
      
      // Reset images
      setProfileImage(null);
      setStoreImage(null);
      if (profileData.profileImage) {
        const profileImgUrl = Array.isArray(profileData.profileImage) 
          ? profileData.profileImage[0]?.url 
          : profileData.profileImage?.url || profileData.profileImage;
        setProfileImagePreview(profileImgUrl);
      } else {
        setProfileImagePreview(null);
      }
      if (profileData.storeImage) {
        const storeImgUrl = Array.isArray(profileData.storeImage) 
          ? profileData.storeImage[0]?.url 
          : profileData.storeImage?.url || profileData.storeImage;
        setStoreImagePreview(storeImgUrl);
      } else {
        setStoreImagePreview(null);
      }
      
      // Reset file inputs
      const profileInput = document.getElementById("profile-image-upload");
      const storeInput = document.getElementById("store-image-upload");
      if (profileInput) profileInput.value = "";
      if (storeInput) storeInput.value = "";
    }
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
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
      <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-0 ml-6">
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

              {/* Action Buttons */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-[#FF7B1D] rounded-sm hover:bg-orange-50 transition-all shadow-lg font-semibold"
                >
                  <Edit2 size={20} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm font-semibold"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#FF7B1D] rounded-xl hover:bg-orange-50 transition-all shadow-lg disabled:opacity-50 font-semibold"
                  >
                    <Save size={20} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 shadow-md">
              <AlertCircle size={24} />
              <span className="font-medium">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 shadow-md">
              <AlertCircle size={24} />
              <span className="font-medium">{success}</span>
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
              <FormField
                icon={<User size={20} style={{ color: "#FF7B1D" }} />}
                label="Vendor Name"
                name="vendorName"
                value={formData.vendorName}
                displayValue={profileData?.vendorName}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<Phone size={20} style={{ color: "#FF7B1D" }} />}
                label="Contact Number"
                value={profileData?.contactNumber}
                displayValue={profileData?.contactNumber}
                isEditing={false}
              />
              <FormField
                icon={<Phone size={20} style={{ color: "#FF7B1D" }} />}
                label="Alt Contact Number"
                name="altContactNumber"
                value={formData.altContactNumber}
                displayValue={profileData?.altContactNumber}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<Mail size={20} style={{ color: "#FF7B1D" }} />}
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                displayValue={profileData?.email}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<User size={20} style={{ color: "#FF7B1D" }} />}
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
                icon={<Calendar size={20} style={{ color: "#FF7B1D" }} />}
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
                icon={<Calendar size={20} style={{ color: "#FF7B1D" }} />}
                label="Age"
                value={`${profileData?.age} years`}
                displayValue={`${profileData?.age} years`}
                isEditing={false}
              />
              {/* Profile Image Upload */}
              <div className="lg:col-span-3">
                <div
                  className="p-5 rounded-sm border hover:shadow-md transition-shadow"
                  style={{
                    background: "linear-gradient(to bottom right, #FFF0E6, white)",
                    borderColor: "#FFE5D1",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <User size={20} style={{ color: "#FF7B1D" }} />
                    </div>
                    <label className="text-sm font-semibold text-gray-600">
                      Profile Image
                    </label>
                  </div>
                  <div className="ml-10 flex items-center gap-4">
                    {profileImagePreview ? (
                      <div className="relative">
                        <img
                          src={profileImagePreview}
                          alt="Profile Preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-orange-300"
                        />
                        {isEditing && (
                          <button
                            onClick={handleRemoveProfileImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                    {isEditing && (
                      <label
                        htmlFor="profile-image-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-[#FF7B1D] text-white rounded-lg hover:bg-orange-600 cursor-pointer transition-colors"
                      >
                        <Edit2 size={18} />
                        <span className="text-sm font-medium">
                          {profileImage ? "Change Image" : "Upload Image"}
                        </span>
                        <input
                          type="file"
                          id="profile-image-upload"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
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
              <FormField
                icon={<Store size={20} style={{ color: "#FF7B1D" }} />}
                label="Store Name"
                name="storeName"
                value={formData.storeName}
                displayValue={profileData?.storeName}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="Service Radius"
                name="serviceRadius"
                type="number"
                step="0.1"
                value={formData.serviceRadius}
                displayValue={`${profileData?.serviceRadius} km`}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<CreditCard size={20} style={{ color: "#FF7B1D" }} />}
                label="Handling Charge"
                name="handlingChargePercentage"
                type="number"
                step="0.1"
                value={formData.handlingChargePercentage}
                displayValue={`${profileData?.handlingChargePercentage}%`}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<Truck size={20} style={{ color: "#FF7B1D" }} />}
                label="Delivery Charge Per Km"
                name="deliveryChargePerKm"
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryChargePerKm}
                displayValue={
                  profileData?.deliveryChargePerKm !== undefined && profileData?.deliveryChargePerKm !== null
                    ? `₹${Number(profileData.deliveryChargePerKm).toFixed(2)} / km`
                    : "₹0.00 / km"
                }
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter delivery charge per km"
              />
              <FormField
                icon={<Shield size={20} style={{ color: "#FF7B1D" }} />}
                label="FSSAI Number"
                name="fssaiNumber"
                value={formData.fssaiNumber}
                displayValue={profileData?.fssaiNumber || "N/A"}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter FSSAI Number"
              />
              <FormField
                icon={<Shield size={20} style={{ color: "#FF7B1D" }} />}
                label="Status"
                displayValue={
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${profileData?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {profileData?.isActive ? "Active" : "Inactive"}
                  </span>
                }
                isEditing={false}
              />
              {/* Store Image Upload */}
              <div className="lg:col-span-4">
                <div
                  className="p-5 rounded-sm border hover:shadow-md transition-shadow"
                  style={{
                    background: "linear-gradient(to bottom right, #FFF0E6, white)",
                    borderColor: "#FFE5D1",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Store size={20} style={{ color: "#FF7B1D" }} />
                    </div>
                    <label className="text-sm font-semibold text-gray-600">
                      Store Image
                    </label>
                  </div>
                  <div className="ml-10 flex items-center gap-4">
                    {storeImagePreview ? (
                      <div className="relative">
                        <img
                          src={storeImagePreview}
                          alt="Store Preview"
                          className="w-32 h-32 rounded-lg object-cover border-2 border-orange-300"
                        />
                        {isEditing && (
                          <button
                            onClick={handleRemoveStoreImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Store size={40} className="text-gray-400" />
                      </div>
                    )}
                    {isEditing && (
                      <label
                        htmlFor="store-image-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-[#FF7B1D] text-white rounded-lg hover:bg-orange-600 cursor-pointer transition-colors"
                      >
                        <Edit2 size={18} />
                        <span className="text-sm font-medium">
                          {storeImage ? "Change Image" : "Upload Image"}
                        </span>
                        <input
                          type="file"
                          id="store-image-upload"
                          accept="image/*"
                          onChange={handleStoreImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
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
                <FormField
                  icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                  label="Address Line 1"
                  name="storeAddressLine1"
                  value={formData.storeAddressLine1}
                  displayValue={profileData?.storeAddress.line1}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              </div>
              <div className="lg:col-span-2">
                <FormField
                  icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                  label="Address Line 2"
                  name="storeAddressLine2"
                  value={formData.storeAddressLine2}
                  displayValue={profileData?.storeAddress.line2}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              </div>
              <FormField
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="City"
                displayValue={profileData?.storeAddress.city}
                isEditing={false}
              />
              <FormField
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="State"
                displayValue={profileData?.storeAddress.state}
                isEditing={false}
              />
              <FormField
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="Pin Code"
                name="pinCode"
                value={formData.pinCode}
                displayValue={profileData?.storeAddress.pinCode}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="Latitude"
                name="latitude"
                type="number"
                step="0.0001"
                value={formData.latitude}
                displayValue={profileData?.storeAddress.latitude}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<MapPin size={20} style={{ color: "#FF7B1D" }} />}
                label="Longitude"
                name="longitude"
                type="number"
                step="0.0001"
                value={formData.longitude}
                displayValue={profileData?.storeAddress.longitude}
                isEditing={isEditing}
                onChange={handleInputChange}
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
              <FormField
                icon={<CreditCard size={20} style={{ color: "#FF7B1D" }} />}
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                displayValue={profileData?.bankDetails.bankName}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<CreditCard size={20} style={{ color: "#FF7B1D" }} />}
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                displayValue={profileData?.bankDetails.accountNumber}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <FormField
                icon={<CreditCard size={20} style={{ color: "#FF7B1D" }} />}
                label="IFSC Code"
                name="ifsc"
                value={formData.ifsc}
                displayValue={profileData?.bankDetails.ifsc}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

// Reusable FormField Component
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
  options,
  capitalize = false,
  placeholder = "",
}) => (
  <div
    className="p-5 rounded-sm border hover:shadow-md transition-shadow"
    style={{
      background: "linear-gradient(to bottom right, #FFF0E6, white)",
      borderColor: "#FFE5D1",
    }}
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
      <label className="text-sm font-semibold text-gray-600">{label}</label>
    </div>
    {isEditing && name ? (
      type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 ml-10 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all"
          style={{ borderColor: "#FFE5D1", focusRingColor: "#FF7B1D" }}
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
          placeholder={placeholder}
          className="w-full px-4 py-2.5 ml-10 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all"
          style={{ borderColor: "#FFE5D1" }}
        />
      )
    ) : (
      <p
        className={`text-gray-900 font-medium text-lg ml-10 ${capitalize ? "capitalize" : ""}`}
      >
        {displayValue || "N/A"}
      </p>
    )}
  </div>
);

export default VendorProfile;
