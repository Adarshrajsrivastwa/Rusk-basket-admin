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
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  PencilIcon,
  KeyIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

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

          // Set profile image preview (check multiple possible field names)
          const imageUrl = result.data.profileImage || 
                          result.data.profilePhoto?.url || 
                          result.data.profilePhoto ||
                          null;
          if (imageUrl) {
            setProfileImagePreview(imageUrl);
          }

          // Map nested response data to flat structure for editing
          const flatFormData = {
            // Basic fields
            name: result.data.name || "",
            email: result.data.email || "",
            mobile: result.data.mobile || "",
            companyName: result.data.companyName || "",
            legalName: result.data.legalName || "",
            website: result.data.website || "",
            alternatePhone: result.data.alternatePhone || "",
            contactPerson: result.data.contactPerson || "",
            designation: result.data.designation || "",
            foundedYear: result.data.foundedYear || "",

            // Bank details
            bankName: result.data.bankName || "",
            branchName: result.data.branchName || "",
            accountNumber: result.data.accountNumber || "",
            ifscCode: result.data.ifscCode || "",

            // Legal info
            registrationNumber: result.data.registrationNumber || "",
            gstNumber: result.data.gstNumber || "",
            panNumber: result.data.panNumber || "",

            // Office address (flattened from nested object)
            streetAddress: result.data.officeAddress?.streetAddress || "",
            city: result.data.officeAddress?.city || "",
            state: result.data.officeAddress?.state || "",
            pincode: result.data.officeAddress?.pincode || "",
            country: result.data.officeAddress?.country || "India",
            latitude: result.data.officeAddress?.latitude || "",
            longitude: result.data.officeAddress?.longitude || "",

            // Key metrics (flattened from nested object)
            yearsInBusiness: result.data.keyMetrics?.yearsInBusiness || "",
            totalEmployees: result.data.keyMetrics?.totalEmployees || "",
            activeClients: result.data.keyMetrics?.activeClients || "",
            totalLeads: result.data.keyMetrics?.totalLeads || "",
          };

          setEditFormData(flatFormData);
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

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById("profile-image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // If profile image is selected, use FormData
      if (profileImage) {
        const formData = new FormData();
        
        // Add all form fields
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
        if (editFormData.foundedYear) {
          formData.append("foundedYear", Number(editFormData.foundedYear));
        }
        formData.append("registrationNumber", editFormData.registrationNumber || "");
        formData.append("gstNumber", editFormData.gstNumber || "");
        formData.append("panNumber", editFormData.panNumber || "");
        formData.append("streetAddress", editFormData.streetAddress || "");
        formData.append("city", editFormData.city || "");
        formData.append("state", editFormData.state || "");
        formData.append("pincode", editFormData.pincode || "");
        formData.append("country", editFormData.country || "India");
        if (editFormData.latitude) {
          formData.append("latitude", Number(editFormData.latitude));
        }
        if (editFormData.longitude) {
          formData.append("longitude", Number(editFormData.longitude));
        }
        if (editFormData.yearsInBusiness) {
          formData.append("yearsInBusiness", Number(editFormData.yearsInBusiness));
        }
        if (editFormData.totalEmployees) {
          formData.append("totalEmployees", Number(editFormData.totalEmployees));
        }
        if (editFormData.activeClients) {
          formData.append("activeClients", Number(editFormData.activeClients));
        }
        if (editFormData.totalLeads) {
          formData.append("totalLeads", Number(editFormData.totalLeads));
        }
        
        // Add profile image - API only accepts "profileImage" field name
        formData.append("profileImage", profileImage);
        
        console.log("Uploading profile image:", {
          fileName: profileImage.name,
          fileSize: profileImage.size,
          fileType: profileImage.type
        });

        const response = await api.put("/api/admin/profile", formData);
        const result = response.data;
        
        console.log("Profile update response:", result);
        
        if (result.success) {
          setProfileData(result.data);
          
          // Update profile image preview (check multiple possible field names)
          const updatedImageUrl = result.data.profileImage || 
                                 result.data.profilePhoto?.url || 
                                 result.data.profilePhoto ||
                                 null;
          if (updatedImageUrl) {
            setProfileImagePreview(updatedImageUrl);
          }
          setProfileImage(null); // Clear selected file

          // Map the updated response back to flat form data
          const flatFormData = {
            name: result.data.name || "",
            email: result.data.email || "",
            mobile: result.data.mobile || "",
            companyName: result.data.companyName || "",
            legalName: result.data.legalName || "",
            website: result.data.website || "",
            alternatePhone: result.data.alternatePhone || "",
            contactPerson: result.data.contactPerson || "",
            designation: result.data.designation || "",
            foundedYear: result.data.foundedYear || "",
            bankName: result.data.bankName || "",
            branchName: result.data.branchName || "",
            accountNumber: result.data.accountNumber || "",
            ifscCode: result.data.ifscCode || "",
            registrationNumber: result.data.registrationNumber || "",
            gstNumber: result.data.gstNumber || "",
            panNumber: result.data.panNumber || "",
            streetAddress: result.data.officeAddress?.streetAddress || "",
            city: result.data.officeAddress?.city || "",
            state: result.data.officeAddress?.state || "",
            pincode: result.data.officeAddress?.pincode || "",
            country: result.data.officeAddress?.country || "India",
            latitude: result.data.officeAddress?.latitude || "",
            longitude: result.data.officeAddress?.longitude || "",
            yearsInBusiness: result.data.keyMetrics?.yearsInBusiness || "",
            totalEmployees: result.data.keyMetrics?.totalEmployees || "",
            activeClients: result.data.keyMetrics?.activeClients || "",
            totalLeads: result.data.keyMetrics?.totalLeads || "",
          };

          setEditFormData(flatFormData);
          setIsEditing(false);
          setSaveSuccess(true);

          // Hide success message after 3 seconds
          setTimeout(() => {
            setSaveSuccess(false);
          }, 3000);
        } else {
          setError(result.message || "Failed to update profile");
        }
      } else {
        // No image, use regular JSON request
        // Prepare flat request body according to API structure
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
        yearsInBusiness: editFormData.yearsInBusiness
          ? Number(editFormData.yearsInBusiness)
          : undefined,
        totalEmployees: editFormData.totalEmployees
          ? Number(editFormData.totalEmployees)
          : undefined,
        activeClients: editFormData.activeClients
          ? Number(editFormData.activeClients)
          : undefined,
        totalLeads: editFormData.totalLeads
          ? Number(editFormData.totalLeads)
          : undefined,
      };

      // Remove undefined values
      Object.keys(requestBody).forEach((key) => {
        if (requestBody[key] === undefined || requestBody[key] === "") {
          delete requestBody[key];
        }
      });

      const response = await api.put("/api/admin/profile", requestBody);
      const result = response.data;

      if (result.success) {
        setProfileData(result.data);

        // Map the updated response back to flat form data
        const flatFormData = {
          name: result.data.name || "",
          email: result.data.email || "",
          mobile: result.data.mobile || "",
          companyName: result.data.companyName || "",
          legalName: result.data.legalName || "",
          website: result.data.website || "",
          alternatePhone: result.data.alternatePhone || "",
          contactPerson: result.data.contactPerson || "",
          designation: result.data.designation || "",
          foundedYear: result.data.foundedYear || "",
          bankName: result.data.bankName || "",
          branchName: result.data.branchName || "",
          accountNumber: result.data.accountNumber || "",
          ifscCode: result.data.ifscCode || "",
          registrationNumber: result.data.registrationNumber || "",
          gstNumber: result.data.gstNumber || "",
          panNumber: result.data.panNumber || "",
          streetAddress: result.data.officeAddress?.streetAddress || "",
          city: result.data.officeAddress?.city || "",
          state: result.data.officeAddress?.state || "",
          pincode: result.data.officeAddress?.pincode || "",
          country: result.data.officeAddress?.country || "India",
          latitude: result.data.officeAddress?.latitude || "",
          longitude: result.data.officeAddress?.longitude || "",
          yearsInBusiness: result.data.keyMetrics?.yearsInBusiness || "",
          totalEmployees: result.data.keyMetrics?.totalEmployees || "",
          activeClients: result.data.keyMetrics?.activeClients || "",
          totalLeads: result.data.keyMetrics?.totalLeads || "",
        };

        setEditFormData(flatFormData);
        setIsEditing(false);
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError(result.message || "Failed to update profile");
      }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          "Error updating profile data. Please check console for details.";
      
      setError(errorMessage);
      
      // Show alert for better visibility
      if (error.response?.status === 413) {
        alert("File too large! Please upload an image smaller than 5MB.");
      } else if (error.response?.status === 400) {
        alert("Invalid file format. Please upload a valid image file (JPG, PNG, etc.).");
      } else if (error.response?.status === 500) {
        alert("Server error. Please try again later.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset to original profile data
    const flatFormData = {
      name: profileData.name || "",
      email: profileData.email || "",
      mobile: profileData.mobile || "",
      companyName: profileData.companyName || "",
      legalName: profileData.legalName || "",
      website: profileData.website || "",
      alternatePhone: profileData.alternatePhone || "",
      contactPerson: profileData.contactPerson || "",
      designation: profileData.designation || "",
      foundedYear: profileData.foundedYear || "",
      bankName: profileData.bankName || "",
      branchName: profileData.branchName || "",
      accountNumber: profileData.accountNumber || "",
      ifscCode: profileData.ifscCode || "",
      registrationNumber: profileData.registrationNumber || "",
      gstNumber: profileData.gstNumber || "",
      panNumber: profileData.panNumber || "",
      streetAddress: profileData.officeAddress?.streetAddress || "",
      city: profileData.officeAddress?.city || "",
      state: profileData.officeAddress?.state || "",
      pincode: profileData.officeAddress?.pincode || "",
      country: profileData.officeAddress?.country || "India",
      latitude: profileData.officeAddress?.latitude || "",
      longitude: profileData.officeAddress?.longitude || "",
      yearsInBusiness: profileData.keyMetrics?.yearsInBusiness || "",
      totalEmployees: profileData.keyMetrics?.totalEmployees || "",
      activeClients: profileData.keyMetrics?.activeClients || "",
      totalLeads: profileData.keyMetrics?.totalLeads || "",
    };

    setEditFormData(flatFormData);
    // Reset image state
    setProfileImage(null);
    const originalImageUrl = profileData.profileImage || 
                             profileData.profilePhoto?.url || 
                             profileData.profilePhoto ||
                             null;
    setProfileImagePreview(originalImageUrl);
    // Reset file input
    const fileInput = document.getElementById("profile-image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
    setIsEditing(false);
    setError(null);
  };

  // Format date helper
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

  // Loading state
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

  // Error state
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

  const { officeAddress, verificationStatus = {}, keyMetrics = {} } = profileData;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-md">
            <CheckIcon className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-medium">
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-md">
            <XMarkIcon className="w-6 h-6 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {/* Profile Picture */}
              <div className="relative">
                <label
                  htmlFor="profile-image-upload"
                  className={`relative block ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-orange-300 overflow-hidden transition-all ${isEditing ? 'hover:ring-orange-400 hover:scale-105' : ''}`}>
                    {profileImagePreview || profileData.profileImage || profileData.profilePhoto?.url ? (
                      <img
                        src={profileImagePreview || profileData.profileImage || profileData.profilePhoto?.url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {!(profileImagePreview || profileData.profileImage || profileData.profilePhoto?.url) && (
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
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={!isEditing}
                />
              </div>
              {/* Upload Button - More Visible */}
              {isEditing && (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="profile-image-upload"
                    className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-md cursor-pointer border-2 border-orange-300 hover:border-orange-400"
                  >
                    <PencilIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload Image</span>
                  </label>
                  {profileImage && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white">{profileImage.name}</span>
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                      profileData.isActive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {profileData.isActive ? "● Active" : "● Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-md"
                  >
                    <PencilIcon className="w-5 h-5" />
                    Edit Profile
                  </button>
                  <button className="flex items-center gap-2 bg-orange-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-800 transition-colors shadow-md">
                    <KeyIcon className="w-5 h-5" />
                    Change Password
                  </button>
                </>
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
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={UsersIcon}
            title="Active Clients"
            value={keyMetrics.activeClients}
            color="bg-blue-500"
            trend="+12%"
            isEditing={isEditing}
            fieldValue={editFormData.activeClients}
            onChange={(value) => handleInputChange("activeClients", value)}
          />
          <MetricCard
            icon={BriefcaseIcon}
            title="Total Employees"
            value={keyMetrics.totalEmployees}
            color="bg-green-500"
            trend="+5%"
            isEditing={isEditing}
            fieldValue={editFormData.totalEmployees}
            onChange={(value) => handleInputChange("totalEmployees", value)}
          />
          <MetricCard
            icon={ChartBarIcon}
            title="Total Leads"
            value={keyMetrics.totalLeads}
            color="bg-purple-500"
            trend="+18%"
            isEditing={isEditing}
            fieldValue={editFormData.totalLeads}
            onChange={(value) => handleInputChange("totalLeads", value)}
          />
          <MetricCard
            icon={CalendarIcon}
            title="Years in Business"
            value={keyMetrics.yearsInBusiness}
            color="bg-orange-500"
            isEditing={isEditing}
            fieldValue={editFormData.yearsInBusiness}
            onChange={(value) => handleInputChange("yearsInBusiness", value)}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <InfoSection title="Personal Information" icon={UserIcon}>
              <InfoGrid>
                <InfoItem
                  label="Full Name"
                  value={editFormData.name}
                  icon={UserIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("name", value)}
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
                  onChange={(value) =>
                    handleInputChange("alternatePhone", value)
                  }
                />
                <InfoItem
                  label="Designation"
                  value={editFormData.designation}
                  icon={BriefcaseIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("designation", value)}
                />
                <InfoItem
                  label="Contact Person"
                  value={editFormData.contactPerson}
                  icon={UserIcon}
                  isEditing={isEditing}
                  onChange={(value) =>
                    handleInputChange("contactPerson", value)
                  }
                />
              </InfoGrid>
            </InfoSection>

            {/* Company Information */}
            <InfoSection title="Company Information" icon={BuildingOfficeIcon}>
              <InfoGrid>
                <InfoItem
                  label="Company Name"
                  value={editFormData.companyName}
                  icon={BuildingOfficeIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("companyName", value)}
                />
                <InfoItem
                  label="Legal Name"
                  value={editFormData.legalName}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("legalName", value)}
                />
                <InfoItem
                  label="Founded Year"
                  value={editFormData.foundedYear}
                  icon={CalendarIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("foundedYear", value)}
                  inputType="number"
                />
                <InfoItem
                  label="Website"
                  value={editFormData.website}
                  icon={GlobeAltIcon}
                  isLink={!isEditing}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("website", value)}
                  inputType="url"
                />
                <InfoItem
                  label="GST Number"
                  value={editFormData.gstNumber}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("gstNumber", value)}
                />
                <InfoItem
                  label="PAN Number"
                  value={editFormData.panNumber}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("panNumber", value)}
                />
                <InfoItem
                  label="Registration Number"
                  value={editFormData.registrationNumber}
                  icon={ShieldCheckIcon}
                  fullWidth
                  isEditing={isEditing}
                  onChange={(value) =>
                    handleInputChange("registrationNumber", value)
                  }
                />
              </InfoGrid>
            </InfoSection>

            {/* Bank Details */}
            <InfoSection title="Bank Details" icon={BanknotesIcon}>
              <InfoGrid>
                <InfoItem
                  label="Bank Name"
                  value={editFormData.bankName}
                  icon={BanknotesIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("bankName", value)}
                />
                <InfoItem
                  label="Branch Name"
                  value={editFormData.branchName}
                  icon={BuildingOfficeIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("branchName", value)}
                />
                <InfoItem
                  label="Account Number"
                  value={editFormData.accountNumber}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(value) =>
                    handleInputChange("accountNumber", value)
                  }
                />
                <InfoItem
                  label="IFSC Code"
                  value={editFormData.ifscCode}
                  icon={DocumentTextIcon}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange("ifscCode", value)}
                />
              </InfoGrid>
            </InfoSection>
          </div>

          {/* Right Column - Office Address & Activity */}
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
                          {officeAddress.streetAddress}
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
                    onChange={(value) => handleInputChange("city", value)}
                  />
                  <InfoItem
                    label="State"
                    value={editFormData.state}
                    isEditing={isEditing}
                    onChange={(value) => handleInputChange("state", value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem
                    label="Pincode"
                    value={editFormData.pincode}
                    isEditing={isEditing}
                    onChange={(value) => handleInputChange("pincode", value)}
                  />
                  <InfoItem
                    label="Country"
                    value={editFormData.country}
                    isEditing={isEditing}
                    onChange={(value) => handleInputChange("country", value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Latitude</p>
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editFormData.latitude || ""}
                        onChange={(e) =>
                          handleInputChange("latitude", e.target.value)
                        }
                        className="w-full text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {officeAddress.latitude}
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Longitude</p>
                    {isEditing ? (
                      <input
                        type="number"
                        step="any"
                        value={editFormData.longitude || ""}
                        onChange={(e) =>
                          handleInputChange("longitude", e.target.value)
                        }
                        className="w-full text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {officeAddress.longitude}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* Map Preview */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-orange-600" />
                Location Map
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-48 flex items-center justify-center border border-gray-200">
                <div className="text-center text-gray-400">
                  <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">Map View</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {officeAddress.latitude}, {officeAddress.longitude}
                  </p>
                </div>
              </div>
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
                  verified={verificationStatus?.emailVerified === true}
                />
                <VerificationBadge
                  label="Phone Verified"
                  verified={verificationStatus?.phoneVerified === true}
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

// Component: Metric Card
const MetricCard = ({
  icon: Icon,
  title,
  value,
  color,
  trend,
  isEditing,
  fieldValue,
  onChange,
}) => (
  <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-200 border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <div className={`${color} p-3 rounded-lg shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && !isEditing && (
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-600 mb-1">{title}</p>
    {isEditing ? (
      <input
        type="number"
        value={fieldValue || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-2xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    ) : (
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    )}
  </div>
);

// Component: Info Section
const InfoSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
      <Icon className="w-6 h-6 text-orange-600" />
      {title}
    </h2>
    {children}
  </div>
);

// Component: Info Grid
const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

// Component: Info Item
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
  <div className={`${fullWidth ? "sm:col-span-2" : ""}`}>
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
            className={`ml-2 flex-shrink-0 ${
              verified ? "text-green-600" : "text-red-600"
            }`}
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

// Component: Verification Badge
const VerificationBadge = ({ label, verified }) => (
  <div
    className={`flex items-center justify-between p-3 rounded-lg border shadow-sm transition-colors ${
      verified
        ? "bg-green-50 border-green-200 hover:bg-green-100"
        : "bg-red-50 border-red-200 hover:bg-red-100"
    }`}
  >
    <div className="flex items-center gap-2">
      <ShieldCheckIcon
        className={`w-5 h-5 ${verified ? "text-green-600" : "text-red-600"}`}
      />
      <span
        className={`text-sm font-medium ${
          verified ? "text-green-700" : "text-red-700"
        }`}
      >
        {label}
      </span>
    </div>
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        verified ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
      }`}
    >
      {verified ? "✓ Verified" : "✗ Not Verified"}
    </span>
  </div>
);

export default AdminProfile;
