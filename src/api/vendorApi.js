// src/api/vendorApi.js
import api from "./api";

/**
 * Vendor API Service
 * Centralized functions for vendor-related API operations
 */

/**
 * Get all vendors with pagination and search
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search query (optional)
 *   Searches by: vendorName, storeName, contactNumber, email, storeId
 * @returns {Promise<Object>} Response with vendors array and pagination info
 */
export const getAllVendors = async (params = {}) => {
  try {
    // Validate search parameter
    if (params.search && typeof params.search !== "string") {
      throw new Error("Search parameter must be a string");
    }

    // Validate pagination parameters
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(params.limit) || 10));

    const response = await api.get("/api/vendor", {
      params: {
        page,
        limit,
        ...(params.search && params.search.trim() && { search: params.search.trim() }),
      },
    });

    const result = response.data;
    if (result.success) {
      return {
        success: true,
        data: result.data || [],
        pagination: result.pagination || {
          page,
          limit,
          total: result.count || 0,
          pages: Math.ceil((result.count || 0) / limit),
        },
        count: result.count || 0,
      };
    }
    return {
      success: false,
      data: [],
      message: result.message || "Failed to fetch vendors",
    };
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch vendors",
      error: error.response?.data || error,
    };
  }
};

/**
 * Get a single vendor by ID
 * Includes serviceRadius in response (storeInfo.serviceRadius and vendor.serviceRadius)
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} Response with vendor data including serviceRadius
 */
export const getVendorById = async (vendorId) => {
  if (!vendorId) {
    throw new Error("Vendor ID is required");
  }

  try {
    // Try multiple endpoints in order of preference
    let response;
    let endpointUsed = "";

    // Try /api/vendor/:id first
    try {
      endpointUsed = `/api/vendor/${vendorId}`;
      response = await api.get(endpointUsed);
    } catch (e) {
      // Try /api/admin/vendors/:id if first fails
      if (e.response?.status === 404) {
        try {
          endpointUsed = `/api/admin/vendors/${vendorId}`;
          response = await api.get(endpointUsed);
        } catch (e2) {
          // Fallback to /vendor/:id if both fail
          if (e2.response?.status === 404) {
            endpointUsed = `/vendor/${vendorId}`;
            response = await api.get(endpointUsed);
          } else {
            throw e2;
          }
        }
      } else {
        throw e;
      }
    }

    const result = response.data;
    if (result.success) {
      const vendorData = result.data || result;
      
      // Ensure serviceRadius is included in response
      // It should be in storeInfo.serviceRadius or vendor.serviceRadius
      return {
        success: true,
        data: vendorData,
        serviceRadius: vendorData?.storeInfo?.serviceRadius || vendorData?.serviceRadius || null,
      };
    }
    return {
      success: false,
      data: null,
      message: result.message || "Failed to fetch vendor",
    };
  } catch (error) {
    console.error("Error fetching vendor:", error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch vendor",
      error: error.response?.data || error,
    };
  }
};

/**
 * Create a new vendor
 * Handles serviceRadius: validates min 0.1 km, defaults to 5 km if not provided
 * @param {Object|FormData} vendorData - Vendor data (can be FormData for file uploads or plain object)
 *   Should include serviceRadius (number in km, min: 0.1, default: 5)
 * @param {Object} options - Request options
 * @param {number} options.timeout - Request timeout in ms (default: 120000)
 * @returns {Promise<Object>} Response with created vendor data
 */
export const createVendor = async (vendorData, options = {}) => {
  try {
    // Validate and set default serviceRadius if not provided
    if (vendorData instanceof FormData) {
      // For FormData, check if serviceRadius exists, if not append default
      if (!vendorData.has("serviceRadius")) {
        vendorData.append("serviceRadius", "5");
      } else {
        // Validate existing serviceRadius
        const serviceRadius = parseFloat(vendorData.get("serviceRadius"));
        if (isNaN(serviceRadius) || serviceRadius < 0.1) {
          throw new Error("serviceRadius must be at least 0.1 km");
        }
      }
    } else {
      // For plain objects, validate and set default
      if (vendorData.serviceRadius !== undefined && vendorData.serviceRadius !== null) {
        const serviceRadius = parseFloat(vendorData.serviceRadius);
        if (isNaN(serviceRadius) || serviceRadius < 0.1) {
          throw new Error("serviceRadius must be at least 0.1 km");
        }
        vendorData.serviceRadius = serviceRadius;
      } else {
        // Default to 5 km if not provided
        vendorData.serviceRadius = 5;
      }
    }

    const config = {
      timeout: options.timeout || 120000,
      ...(options.signal && { signal: options.signal }),
    };

    const response = await api.post("/api/vendor/create", vendorData, config);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Vendor created successfully",
      };
    }
    return {
      success: false,
      message:
        response.data.error ||
        response.data.message ||
        "Failed to create vendor",
    };
  } catch (error) {
    console.error("Error creating vendor:", error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to create vendor",
      error: error.response?.data || error,
    };
  }
};

/**
 * Update an existing vendor
 * Handles serviceRadius: validates min 0.1 km
 * Works with both /api/vendor/:id (admin only) and /api/vendor/profile (vendor can update their own)
 * @param {string} vendorId - Vendor ID (use "profile" for vendor self-update)
 * @param {Object|FormData} vendorData - Updated vendor data (can be FormData for file uploads or plain object)
 *   Should include serviceRadius (number in km, min: 0.1) if updating
 * @param {Object} options - Request options
 * @param {number} options.timeout - Request timeout in ms (default: 120000)
 * @param {boolean} options.useProfileEndpoint - Use /api/vendor/profile endpoint (default: false)
 * @returns {Promise<Object>} Response with updated vendor data
 */
export const updateVendor = async (vendorId, vendorData, options = {}) => {
  if (!vendorId && !options.useProfileEndpoint) {
    throw new Error("Vendor ID is required");
  }

  try {
    // Validate serviceRadius if provided
    if (vendorData instanceof FormData) {
      if (vendorData.has("serviceRadius")) {
        const serviceRadius = parseFloat(vendorData.get("serviceRadius"));
        if (isNaN(serviceRadius) || serviceRadius < 0.1) {
          throw new Error("serviceRadius must be at least 0.1 km");
        }
      }
    } else {
      if (vendorData.serviceRadius !== undefined && vendorData.serviceRadius !== null) {
        const serviceRadius = parseFloat(vendorData.serviceRadius);
        if (isNaN(serviceRadius) || serviceRadius < 0.1) {
          throw new Error("serviceRadius must be at least 0.1 km");
        }
        vendorData.serviceRadius = serviceRadius;
      }
    }

    const config = {
      timeout: options.timeout || 120000,
    };

    // If vendorData is FormData, let axios handle Content-Type automatically
    // Otherwise, explicitly set Content-Type to application/json
    if (!(vendorData instanceof FormData)) {
      config.headers = {
        "Content-Type": "application/json",
      };
    }

    // Determine endpoint based on options
    let endpoint;
    if (options.useProfileEndpoint) {
      endpoint = "/api/vendor/profile";
    } else {
      endpoint = `/api/vendor/${vendorId}`;
    }

    const response = await api.put(endpoint, vendorData, config);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Vendor updated successfully",
      };
    }
    return {
      success: false,
      message:
        response.data.message ||
        response.data.error ||
        "Failed to update vendor",
    };
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update vendor",
      error: error.response?.data || error,
    };
  }
};

/**
 * Get vendor's own profile
 * Endpoint: GET /api/vendor/profile
 * @returns {Promise<Object>} Response with vendor profile data including serviceRadius
 */
export const getVendorProfile = async () => {
  try {
    const response = await api.get("/api/vendor/profile");

    const result = response.data;
    if (result.success) {
      const profileData = result.data || result;
      return {
        success: true,
        data: profileData,
        serviceRadius: profileData?.storeInfo?.serviceRadius || profileData?.serviceRadius || null,
      };
    }
    return {
      success: false,
      data: null,
      message: result.message || "Failed to fetch vendor profile",
    };
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch vendor profile",
      error: error.response?.data || error,
    };
  }
};

/**
 * Update vendor's own profile
 * Endpoint: PUT /api/vendor/profile
 * Handles serviceRadius: validates min 0.1 km
 * @param {Object|FormData} profileData - Profile data to update (can be FormData for file uploads or plain object)
 *   Should include serviceRadius (number in km, min: 0.1) if updating
 * @param {Object} options - Request options
 * @param {number} options.timeout - Request timeout in ms (default: 120000)
 * @returns {Promise<Object>} Response with updated vendor profile data
 */
export const updateVendorProfile = async (profileData, options = {}) => {
  try {
    // Validate serviceRadius if provided, ensure it's always a valid number
    if (profileData instanceof FormData) {
      if (profileData.has("serviceRadius")) {
        const serviceRadius = parseFloat(profileData.get("serviceRadius"));
        if (isNaN(serviceRadius) || serviceRadius < 0.1) {
          throw new Error("serviceRadius must be at least 0.1 km");
        }
        // Update with validated number (ensure it's a proper number string)
        profileData.set("serviceRadius", serviceRadius.toString());
      }
      // If not provided in FormData, it will be omitted (backend can use existing value)
    } else {
      if (profileData.serviceRadius !== undefined && profileData.serviceRadius !== null) {
        const serviceRadius = parseFloat(profileData.serviceRadius);
        if (isNaN(serviceRadius) || serviceRadius < 0.1) {
          throw new Error("serviceRadius must be at least 0.1 km");
        }
        profileData.serviceRadius = serviceRadius;
      }
      // If not provided in JSON, it will be omitted (backend can use existing value)
    }

    const config = {
      timeout: options.timeout || 120000,
    };

    // If profileData is FormData, let axios handle Content-Type automatically
    // Otherwise, explicitly set Content-Type to application/json
    if (!(profileData instanceof FormData)) {
      config.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await api.put("/api/vendor/profile", profileData, config);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Profile updated successfully",
      };
    }
    return {
      success: false,
      message:
        response.data.message ||
        response.data.error ||
        "Failed to update profile",
    };
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update vendor profile",
      error: error.response?.data || error,
    };
  }
};

/**
 * Delete a vendor
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} Response indicating success or failure
 */
export const deleteVendor = async (vendorId) => {
  if (!vendorId) {
    throw new Error("Vendor ID is required");
  }

  try {
    const response = await api.delete(`/api/vendor/${vendorId}`);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || "Vendor deleted successfully",
      };
    }
    return {
      success: false,
      message: response.data.message || "Failed to delete vendor",
    };
  } catch (error) {
    console.error("Error deleting vendor:", error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete vendor",
      error: error.response?.data || error,
    };
  }
};

/**
 * Helper function to build FormData payload for vendor creation/update
 * @param {Object} formData - Form data object
 * @returns {FormData} FormData object ready for API call
 */
export const buildVendorFormData = (formData) => {
  const fd = new FormData();
  const sanitize = (v) => String(v || "").trim();

  // Basic vendor information
  fd.append("vendorName", sanitize(formData.vendorName));
  fd.append("contactNumber", sanitize(formData.contactNumber).replace(/\s+/g, ""));
  if (formData.altContactNumber) {
    fd.append("altContactNumber", sanitize(formData.altContactNumber).replace(/\s+/g, ""));
  }
  fd.append("email", sanitize(formData.email).toLowerCase());
  fd.append("gender", sanitize(formData.gender));
  fd.append("dateOfBirth", sanitize(formData.dob || formData.dateOfBirth));
  if (formData.age) {
    fd.append("age", sanitize(formData.age));
  }

  // Store information
  fd.append("storeName", sanitize(formData.storeName));
  fd.append("handlingChargePercentage", sanitize(formData.handlingChargePercentage));
  fd.append("storeAddressLine1", sanitize(formData.storeAddress1 || formData.storeAddressLine1));
  if (formData.storeAddress2 || formData.storeAddressLine2) {
    fd.append("storeAddressLine2", sanitize(formData.storeAddress2 || formData.storeAddressLine2));
  }
  fd.append("pinCode", sanitize(formData.pinCode));
  if (formData.city) {
    fd.append("city", sanitize(formData.city));
  }
  if (formData.state) {
    fd.append("state", sanitize(formData.state));
  }
  if (formData.storeLat || formData.latitude) {
    fd.append("latitude", sanitize(formData.storeLat || formData.latitude));
  }
  if (formData.storeLong || formData.longitude) {
    fd.append("longitude", sanitize(formData.storeLong || formData.longitude));
  }

  // Bank information
  fd.append("ifsc", sanitize(formData.ifscCode || formData.ifsc).toUpperCase());
  fd.append("accountNumber", sanitize(formData.accountNumber));
  fd.append("bankName", sanitize(formData.bankName));

  // Service radius (validated: min 0.1 km, default 5 km)
  if (formData.serviceRadius !== undefined && formData.serviceRadius !== null) {
    const serviceRadius = parseFloat(formData.serviceRadius);
    if (isNaN(serviceRadius) || serviceRadius < 0.1) {
      throw new Error("serviceRadius must be at least 0.1 km");
    }
    fd.append("serviceRadius", serviceRadius.toString());
  } else {
    // Default to 5 km if not provided
    fd.append("serviceRadius", "5");
  }

  // File uploads with validation
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

  const validateAndAppendFile = (file, fieldName, displayName) => {
    if (!file) return;
    if (file.size > maxSize) {
      throw new Error(`${displayName} exceeds 10MB limit.`);
    }
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`${displayName} must be JPEG, PNG, or PDF.`);
    }
    fd.append(fieldName, file);
  };

  validateAndAppendFile(formData.storeImage, "storeImage", "Store Image");
  validateAndAppendFile(formData.panCardFront, "panCardFront", "PAN Card Front");
  validateAndAppendFile(formData.panCardBack, "panCardBack", "PAN Card Back");
  validateAndAppendFile(formData.aadharFront, "aadharCardFront", "Aadhar Front");
  validateAndAppendFile(formData.aadharBack, "aadharCardBack", "Aadhar Back");
  validateAndAppendFile(formData.drivingLicense, "drivingLicense", "Driving License");
  validateAndAppendFile(formData.cancelCheque, "cancelCheque", "Cancel Cheque");

  return fd;
};

/**
 * Helper function to build JSON payload for vendor update (when no files are present)
 * @param {Object} formData - Form data object
 * @returns {Object} JSON object ready for API call
 */
export const buildVendorJsonPayload = (formData) => {
  return {
    vendorName: formData.vendorName?.trim(),
    contactNumber: formData.contactNumber?.trim().replace(/\s+/g, ""),
    ...(formData.altContactNumber && {
      altContactNumber: formData.altContactNumber.trim(),
    }),
    email: formData.email?.trim().toLowerCase(),
    gender: formData.gender,
    dateOfBirth: formData.dob || formData.dateOfBirth,
    ...(formData.age && { age: Number(formData.age) }),
    storeName: formData.storeName?.trim(),
    handlingChargePercentage: parseFloat(formData.handlingChargePercentage),
    storeAddressLine1: formData.storeAddress1?.trim() || formData.storeAddressLine1?.trim(),
    ...(formData.storeAddress2 || formData.storeAddressLine2) && {
      storeAddressLine2: (formData.storeAddress2 || formData.storeAddressLine2).trim(),
    },
    pinCode: formData.pinCode?.trim(),
    ...(formData.city && { city: formData.city.trim() }),
    ...(formData.state && { state: formData.state.trim() }),
    ...(formData.storeLat || formData.latitude) && {
      latitude: parseFloat(formData.storeLat || formData.latitude),
    },
    ...(formData.storeLong || formData.longitude) && {
      longitude: parseFloat(formData.storeLong || formData.longitude),
    },
    ifsc: formData.ifscCode?.trim().toUpperCase() || formData.ifsc?.trim().toUpperCase(),
    accountNumber: formData.accountNumber?.trim(),
    bankName: formData.bankName?.trim(),
    // Service radius (validated: min 0.1 km)
    ...(formData.serviceRadius !== undefined && formData.serviceRadius !== null) && {
      serviceRadius: (() => {
        const serviceRadius = parseFloat(formData.serviceRadius);
        if (isNaN(serviceRadius) || serviceRadius < 0.1) {
          throw new Error("serviceRadius must be at least 0.1 km");
        }
        return serviceRadius;
      })(),
    },
  };
};

export default {
  getAllVendors,
  getVendorById,
  getVendorProfile,
  createVendor,
  updateVendor,
  updateVendorProfile,
  deleteVendor,
  buildVendorFormData,
  buildVendorJsonPayload,
};
