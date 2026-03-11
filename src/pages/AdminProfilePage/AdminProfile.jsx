import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/api";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// ─── Get Current Location Button ─────────────────────────────────────────────
const GetLocationButton = ({ onLocation, onError }) => {
  const [fetching, setFetching] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) {
      onError("Geolocation is not supported by your browser.");
      return;
    }
    setFetching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocation(
          pos.coords.latitude.toFixed(6),
          pos.coords.longitude.toFixed(6),
        );
        setFetching(false);
      },
      (err) => {
        setFetching(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            onError(
              "Location permission denied. Please allow access in browser settings.",
            );
            break;
          case err.POSITION_UNAVAILABLE:
            onError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            onError("Location request timed out. Please try again.");
            break;
          default:
            onError("An unknown error occurred while fetching location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={fetching}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
      style={{
        background: fetching
          ? "#9ca3af"
          : "linear-gradient(to right, #FF7B1D, #FF9547)",
      }}
    >
      {fetching ? (
        <>
          <svg
            className="animate-spin w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Fetching…
        </>
      ) : (
        <>
          <MapPinIcon className="w-3.5 h-3.5" />
          Use Current Location
        </>
      )}
    </button>
  );
};

// ─── Google Map Embed ─────────────────────────────────────────────────────────
const GoogleMapEmbed = ({ lat, lng }) => {
  const hasCoords =
    lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));

  if (!hasCoords) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-56 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
        <MapPinIcon className="w-10 h-10 text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-400">No coordinates set</p>
        <p className="text-xs text-gray-300 mt-0.5">
          Enter or fetch lat/lng to see map
        </p>
      </div>
    );
  }

  const src = `https://maps.google.com/maps?q=${parseFloat(lat)},${parseFloat(lng)}&z=15&output=embed`;

  return (
    <div className="rounded-xl overflow-hidden border-2 border-orange-200 shadow-md">
      <iframe
        title="Office Location"
        src={src}
        width="100%"
        height="224"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // ── build flat form data helper ──────────────────────────────────────────
  const buildFlatFormData = (data) => ({
    name: data.name || "",
    email: data.email || "",
    mobile: data.mobile || "",
    companyName: data.companyName || "",
    legalName: data.legalName || "",
    website: data.website || "",
    alternatePhone: data.alternatePhone || "",
    contactPerson: data.contactPerson || "",
    designation: data.designation || "",
    foundedYear: data.foundedYear || "",
    bankName: data.bankName || "",
    branchName: data.branchName || "",
    accountNumber: data.accountNumber || "",
    ifscCode: data.ifscCode || "",
    registrationNumber: data.registrationNumber || "",
    gstNumber: data.gstNumber || "",
    panNumber: data.panNumber || "",
    streetAddress: data.officeAddress?.streetAddress || "",
    city: data.officeAddress?.city || "",
    state: data.officeAddress?.state || "",
    pincode: data.officeAddress?.pincode || "",
    country: data.officeAddress?.country || "India",
    latitude: data.officeAddress?.latitude || "",
    longitude: data.officeAddress?.longitude || "",
  });

  // Fetch admin profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/admin/profile");
        const result = response.data;
        if (result.success) {
          setProfileData(result.data);
          const imageUrl =
            result.data.profileImage ||
            result.data.profilePhoto?.url ||
            result.data.profilePhoto ||
            null;
          if (imageUrl) setProfileImagePreview(imageUrl);
          const logoUrl =
            result.data.companyLogo || result.data.companyLogo?.url || null;
          if (logoUrl) setCompanyLogoPreview(logoUrl);
          setEditFormData(buildFlatFormData(result.data));
        } else {
          setError(result.message || "Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(
          error.response?.data?.message ||
          error.message ||
          "Error fetching profile data",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Location handler ──────────────────────────────────────────────────────
  const handleLocationFetched = (lat, lng) => {
    setLocationError(null);
    setEditFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setProfileImage(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setProfileImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else setProfileImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    const fileInput = document.getElementById("profile-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setCompanyLogo(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setCompanyLogoPreview(reader.result);
        reader.readAsDataURL(file);
      } else setCompanyLogoPreview(null);
    }
  };

  const handleRemoveCompanyLogo = () => {
    setCompanyLogo(null);
    setCompanyLogoPreview(null);
    const fileInput = document.getElementById("company-logo-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (profileImage || companyLogo) {
        const formData = new FormData();
        formData.append("name", editFormData.name || "");
        formData.append("companyName", editFormData.companyName || "");
        formData.append("legalName", editFormData.legalName || "");
        formData.append("website", editFormData.website || "");
        formData.append("alternatePhone", editFormData.alternatePhone || "");
        formData.append("contactPerson", editFormData.contactPerson || "");
        formData.append("designation", editFormData.designation || "");
        formData.append("bankName", editFormData.bankName || "");
        formData.append("branchName", editFormData.branchName || "");
        formData.append("accountNumber", editFormData.accountNumber || "");
        formData.append("ifscCode", editFormData.ifscCode || "");
        if (editFormData.foundedYear)
          formData.append("foundedYear", Number(editFormData.foundedYear));
        formData.append(
          "registrationNumber",
          editFormData.registrationNumber || "",
        );
        formData.append("gstNumber", editFormData.gstNumber || "");
        formData.append("panNumber", editFormData.panNumber || "");
        formData.append("streetAddress", editFormData.streetAddress || "");
        formData.append("city", editFormData.city || "");
        formData.append("state", editFormData.state || "");
        formData.append("pincode", editFormData.pincode || "");
        formData.append("country", editFormData.country || "India");
        if (editFormData.latitude)
          formData.append("latitude", Number(editFormData.latitude));
        if (editFormData.longitude)
          formData.append("longitude", Number(editFormData.longitude));
        if (profileImage) formData.append("profileImage", profileImage);
        if (companyLogo) formData.append("companyLogo", companyLogo);

        const response = await api.put("/api/admin/profile", formData);
        const result = response.data;
        if (result.success) {
          setProfileData(result.data);
          const updatedImageUrl =
            result.data.profileImage ||
            result.data.profilePhoto?.url ||
            result.data.profilePhoto ||
            null;
          if (updatedImageUrl) setProfileImagePreview(updatedImageUrl);
          setProfileImage(null);
          const updatedLogoUrl =
            result.data.companyLogo || result.data.companyLogo?.url || null;
          if (updatedLogoUrl) setCompanyLogoPreview(updatedLogoUrl);
          setCompanyLogo(null);
          setEditFormData(buildFlatFormData(result.data));
          setIsEditing(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          setError(result.message || "Failed to update profile");
        }
      } else {
        const requestBody = {
          name: editFormData.name,
          companyName: editFormData.companyName,
          legalName: editFormData.legalName,
          website: editFormData.website,
          alternatePhone: editFormData.alternatePhone,
          contactPerson: editFormData.contactPerson,
          designation: editFormData.designation,
          bankName: editFormData.bankName,
          branchName: editFormData.branchName,
          accountNumber: editFormData.accountNumber,
          ifscCode: editFormData.ifscCode,
          foundedYear: editFormData.foundedYear
            ? Number(editFormData.foundedYear)
            : undefined,
          registrationNumber: editFormData.registrationNumber,
          gstNumber: editFormData.gstNumber,
          panNumber: editFormData.panNumber,
          streetAddress: editFormData.streetAddress,
          city: editFormData.city,
          state: editFormData.state,
          pincode: editFormData.pincode,
          country: editFormData.country,
          latitude: editFormData.latitude
            ? Number(editFormData.latitude)
            : undefined,
          longitude: editFormData.longitude
            ? Number(editFormData.longitude)
            : undefined,
        };
        Object.keys(requestBody).forEach((key) => {
          if (requestBody[key] === undefined || requestBody[key] === "")
            delete requestBody[key];
        });
        const response = await api.put("/api/admin/profile", requestBody);
        const result = response.data;
        if (result.success) {
          setProfileData(result.data);
          setEditFormData(buildFlatFormData(result.data));
          setIsEditing(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          setError(result.message || "Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error updating profile data. Please check console for details.";
      setError(errorMessage);
      if (error.response?.status === 413)
        alert("File too large! Please upload an image smaller than 5MB.");
      else if (error.response?.status === 400)
        alert(
          "Invalid request or file. Please check your data and try again.",
        );
      else if (error.response?.status === 500)
        alert("Server error. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profileData) {
      setEditFormData(buildFlatFormData(profileData));
      setProfileImage(null);
      setCompanyLogo(null);
      const originalImageUrl =
        profileData.profileImage ||
        profileData.profilePhoto?.url ||
        profileData.profilePhoto ||
        null;
      setProfileImagePreview(originalImageUrl);
      const originalLogoUrl =
        profileData.companyLogo || profileData.companyLogo?.url || null;
      setCompanyLogoPreview(originalLogoUrl);
      const fileInput = document.getElementById("profile-image-upload");
      const logoInput = document.getElementById("company-logo-upload");
      if (fileInput) fileInput.value = "";
      if (logoInput) logoInput.value = "";
    }
    setIsEditing(false);
    setError(null);
    setLocationError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg text-gray-600 mb-4">
              {error || "Profile not found"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { officeAddress, verificationStatus } = profileData;

  // Live map coords — update in real time while editing
  const mapLat = isEditing
    ? editFormData.latitude
    : officeAddress?.latitude || "";
  const mapLng = isEditing
    ? editFormData.longitude
    : officeAddress?.longitude || "";

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 ml-4 py-4">
        {/* Success */}
        {saveSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-sm p-4 flex items-center gap-3 shadow-md">
            <CheckIcon className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-medium">
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-md">
            <XMarkIcon className="w-6 h-6 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="relative">
                <label
                  htmlFor="profile-image-upload"
                  className={`relative block ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div
                    className={`w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-orange-300 overflow-hidden transition-all ${isEditing ? "hover:ring-orange-400 hover:scale-105" : ""}`}
                  >
                    {profileImagePreview ||
                      profileData.profileImage ||
                      profileData.profilePhoto?.url ? (
                      <img
                        src={
                          profileImagePreview ||
                          profileData.profileImage ||
                          profileData.profilePhoto?.url
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-orange-600" />
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
                        <PencilIcon className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white rounded-full p-1.5 shadow-lg z-10">
                      <PencilIcon className="w-3 h-3" />
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="profile-image-upload"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="profile-image-upload"
                    className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-md cursor-pointer border-2 border-orange-300 hover:border-orange-400"
                  >
                    <PencilIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Upload Profile Image
                    </span>
                  </label>
                  {profileImage && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">
                        {profileImage.name}
                      </span>
                      <button
                        onClick={handleRemoveImage}
                        className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition-colors shadow-sm border border-red-200 text-xs"
                      >
                        <XMarkIcon className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="text-white">
                <h1 className="text-3xl font-bold mb-1">{profileData.name}</h1>
                <p className="text-orange-100 text-lg">
                  {profileData.designation}
                </p>
                <p className="text-sm text-orange-100 mb-2">
                  {profileData.companyName}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${profileData.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {profileData.isActive ? "● Active" : "● Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-md"
                >
                  <PencilIcon className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-md disabled:opacity-50"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6">
            <InfoSection title="Personal Information" icon={UserIcon}>
              <InfoGrid>
                <InfoItem
                  label="Full Name"
                  value={editFormData.name}
                  icon={UserIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("name", v)}
                />
                <InfoItem
                  label="Email"
                  value={editFormData.email}
                  icon={EnvelopeIcon}
                  verified={verificationStatus.emailVerified}
                  isEditing={false}
                  inputType="email"
                />
                <InfoItem
                  label="Mobile"
                  value={editFormData.mobile}
                  icon={PhoneIcon}
                  verified={verificationStatus.phoneVerified}
                  isEditing={false}
                />
                <InfoItem
                  label="Alternate Phone"
                  value={editFormData.alternatePhone}
                  icon={PhoneIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("alternatePhone", v)}
                />
                <InfoItem
                  label="Designation"
                  value={editFormData.designation}
                  icon={BriefcaseIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("designation", v)}
                />
                <InfoItem
                  label="Contact Person"
                  value={editFormData.contactPerson}
                  icon={UserIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("contactPerson", v)}
                />
              </InfoGrid>
            </InfoSection>

            <InfoSection title="Company Information" icon={BuildingOfficeIcon}>
              <InfoGrid>
                <InfoItem
                  label="Company Name"
                  value={editFormData.companyName}
                  icon={BuildingOfficeIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("companyName", v)}
                />
                <InfoItem
                  label="Legal Name"
                  value={editFormData.legalName}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("legalName", v)}
                />
                <InfoItem
                  label="Founded Year"
                  value={editFormData.foundedYear}
                  icon={CalendarIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("foundedYear", v)}
                  inputType="number"
                />
                <InfoItem
                  label="Website"
                  value={editFormData.website}
                  icon={GlobeAltIcon}
                  isLink={!isEditing}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("website", v)}
                  inputType="url"
                />
                <InfoItem
                  label="GST Number"
                  value={editFormData.gstNumber}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("gstNumber", v)}
                />
                <InfoItem
                  label="PAN Number"
                  value={editFormData.panNumber}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("panNumber", v)}
                />
                <InfoItem
                  label="Registration Number"
                  value={editFormData.registrationNumber}
                  icon={ShieldCheckIcon}
                  fullWidth
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("registrationNumber", v)}
                />
                <div className="sm:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Company Logo
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {companyLogoPreview ? (
                        <div className="relative">
                          <img
                            src={companyLogoPreview}
                            alt="Company Logo Preview"
                            className="w-32 h-32 rounded-lg object-cover border-2 border-orange-300"
                          />
                          {isEditing && (
                            <button
                              onClick={handleRemoveCompanyLogo}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {isEditing && (
                        <label
                          htmlFor="company-logo-upload"
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer transition-colors shadow-md"
                        >
                          <PencilIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {companyLogo ? "Change Logo" : "Upload Logo"}
                          </span>
                          <input
                            type="file"
                            id="company-logo-upload"
                            onChange={handleCompanyLogoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </InfoGrid>
            </InfoSection>

            <InfoSection title="Bank Details" icon={BanknotesIcon}>
              <InfoGrid>
                <InfoItem
                  label="Bank Name"
                  value={editFormData.bankName}
                  icon={BanknotesIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("bankName", v)}
                />
                <InfoItem
                  label="Branch Name"
                  value={editFormData.branchName}
                  icon={BuildingOfficeIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("branchName", v)}
                />
                <InfoItem
                  label="Account Number"
                  value={editFormData.accountNumber}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("accountNumber", v)}
                />
                <InfoItem
                  label="IFSC Code"
                  value={editFormData.ifscCode}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(v) => handleInputChange("ifscCode", v)}
                />
              </InfoGrid>
            </InfoSection>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            {/* Office Address */}
            <InfoSection title="Office Address" icon={MapPinIcon}>
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 shadow-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPinIcon className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Street Address
                      </p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.streetAddress || ""}
                          onChange={(e) =>
                            handleInputChange("streetAddress", e.target.value)
                          }
                          className="w-full text-sm text-gray-800 font-semibold bg-white border border-orange-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-800 font-semibold">
                          {officeAddress?.streetAddress || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InfoItem
                    label="City"
                    value={editFormData.city}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("city", v)}
                  />
                  <InfoItem
                    label="State"
                    value={editFormData.state}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("state", v)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem
                    label="Pincode"
                    value={editFormData.pincode}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("pincode", v)}
                  />
                  <InfoItem
                    label="Country"
                    value={editFormData.country}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("country", v)}
                  />
                </div>

                {/* ── Coordinates + Get Location ── */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                      <MapPinIcon className="w-3.5 h-3.5 text-orange-500" />
                      Coordinates
                    </p>
                    {isEditing && (
                      <GetLocationButton
                        onLocation={handleLocationFetched}
                        onError={(msg) => setLocationError(msg)}
                      />
                    )}
                  </div>

                  {/* Location error banner */}
                  {locationError && isEditing && (
                    <div className="mb-2 flex items-start gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-2.5 py-2">
                      <XMarkIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{locationError}</span>
                    </div>
                  )}

                  {/* Success banner */}
                  {isEditing &&
                    editFormData.latitude &&
                    editFormData.longitude &&
                    !locationError && (
                      <div className="mb-2 flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-2.5 py-1.5">
                        <CheckIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          Location set: {editFormData.latitude},{" "}
                          {editFormData.longitude}
                        </span>
                      </div>
                    )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400 mb-1">Latitude</p>
                      {isEditing ? (
                        <input
                          type="number"
                          step="any"
                          value={editFormData.latitude || ""}
                          onChange={(e) =>
                            handleInputChange("latitude", e.target.value)
                          }
                          placeholder="e.g. 28.6139"
                          className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">
                          {officeAddress?.latitude || "N/A"}
                        </p>
                      )}
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400 mb-1">Longitude</p>
                      {isEditing ? (
                        <input
                          type="number"
                          step="any"
                          value={editFormData.longitude || ""}
                          onChange={(e) =>
                            handleInputChange("longitude", e.target.value)
                          }
                          placeholder="e.g. 77.2090"
                          className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">
                          {officeAddress?.longitude || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* ── Google Map (replaces old placeholder) ── */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-orange-600" />
                  Location Map
                </span>
                {mapLat && mapLng && (
                  <span className="text-xs text-gray-400 font-normal">
                    {parseFloat(mapLat).toFixed(4)},{" "}
                    {parseFloat(mapLng).toFixed(4)}
                  </span>
                )}
              </h3>

              <GoogleMapEmbed lat={mapLat} lng={mapLng} />

              {mapLat && mapLng && (
                <a
                  href={`https://www.google.com/maps?q=${mapLat},${mapLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                >
                  <GlobeAltIcon className="w-3.5 h-3.5" />
                  Open in Google Maps
                </a>
              )}
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-orange-600" />
                Verification Status
              </h3>
              <div className="space-y-3">
                <VerificationBadge
                  label="Email Verified"
                  verified={verificationStatus.emailVerified}
                />
                <VerificationBadge
                  label="Phone Verified"
                  verified={verificationStatus.phoneVerified}
                />
              </div>
            </div>

            {/* Account Activity */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-orange-600" />
                Account Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-xs font-semibold text-gray-800">
                    {formatDate(profileData.lastLogin)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Account Created</span>
                  <span className="text-xs font-semibold text-gray-800">
                    {formatDate(profileData.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Account ID</span>
                  <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {profileData._id.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────
const InfoSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
      <Icon className="w-6 h-6 text-orange-600" />
      {title}
    </h2>
    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

const InfoItem = ({
  label,
  value,
  icon: Icon,
  verified,
  isLink,
  fullWidth,
  isEditing,
  onChange,
  inputType = "text",
}) => (
  <div className={fullWidth ? "sm:col-span-2" : ""}>
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            type={inputType}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ) : isLink && value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline truncate"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-semibold text-gray-800 truncate">
            {value || "N/A"}
          </p>
        )}
        {verified !== undefined && !isEditing && (
          <span
            className={`ml-2 flex-shrink-0 ${verified ? "text-green-600" : "text-red-600"}`}
          >
            {verified ? (
              <ShieldCheckIcon className="w-5 h-5" />
            ) : (
              <span className="text-lg">✗</span>
            )}
          </span>
        )}
      </div>
    </div>
  </div>
);

const VerificationBadge = ({ label, verified }) => (
  <div
    className={`flex items-center justify-between p-3 rounded-lg border shadow-sm transition-colors ${verified ? "bg-green-50 border-green-200 hover:bg-green-100" : "bg-red-50 border-red-200 hover:bg-red-100"}`}
  >
    <div className="flex items-center gap-2">
      <ShieldCheckIcon
        className={`w-5 h-5 ${verified ? "text-green-600" : "text-red-600"}`}
      />
      <span
        className={`text-sm font-medium ${verified ? "text-green-700" : "text-red-700"}`}
      >
        {label}
      </span>
    </div>
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${verified ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
    >
      {verified ? "✓ Verified" : "✗ Not Verified"}
    </span>
  </div>
);

export default AdminProfile;
