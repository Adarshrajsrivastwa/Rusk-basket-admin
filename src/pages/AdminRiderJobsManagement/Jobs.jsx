import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

const RiderJobPostManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const API_BASE_URL = `${BASE_URL}/api`;

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    joiningBonus: "",
    onboardingFee: "",
    vendorId: "",
    line1: "",
    line2: "",
    pinCode: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  // Fetch all job posts - memoized with useCallback
  const fetchJobs = useCallback(async () => {
    console.log("fetchJobs called");
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      console.log("Fetching jobs from:", `${API_BASE_URL}/rider-job-post`);
      console.log("Token available:", !!token);
      
      // Use the correct endpoint
      const response = await fetch(`${API_BASE_URL}/rider-job-post`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });
      
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      const data = await response.json();
      console.log("API Response:", data);
      console.log("Response success:", data.success);
      console.log("Response data:", data.data);
      console.log("Response count:", data.count);
      console.log("Response pagination:", data.pagination);
      
      if (data.success) {
        // Handle the response structure: {success, count, pagination, data}
        const jobsData = data.data || [];
        console.log("Setting jobs:", jobsData);
        console.log("Jobs count:", jobsData.length);
        setJobs(jobsData);
      } else {
        console.error("API returned success: false");
        console.error("Error message:", data.message || data.error);
        showNotification(data.message || data.error || "Failed to fetch jobs", "error");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      showNotification("Failed to fetch jobs", "error");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }, []);

  // Fetch individual job details
  const fetchJobDetails = async (jobId) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/rider-job-post/${jobId}`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setSelectedJob(data.data);
      }
    } catch (error) {
      showNotification("Failed to fetch job details", "error");
    }
  };

  // Create job post (admin)
  const createJobPost = async (jobData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/rider-job-post/admin/create`,
        {
          method: "POST",
          headers: headers,
          credentials: "include",
          body: JSON.stringify(jobData),
        },
      );
      const data = await response.json();
      if (data.success) {
        showNotification("Job post created successfully!", "success");
        setIsCreateModalOpen(false);
        fetchJobs();
        resetForm();
      } else {
        showNotification(data.message || "Failed to create job post", "error");
      }
    } catch (error) {
      showNotification("Failed to create job post", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update job post
  const updateJobPost = async (jobId, jobData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/rider-job-post/admin/${jobId}`, {
        method: "PUT",
        headers: headers,
        credentials: "include",
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (data.success) {
        showNotification("Job post updated successfully!", "success");
        setIsEditModalOpen(false);
        fetchJobs();
        resetForm();
      } else {
        showNotification(data.message || data.error || "Failed to update job post", "error");
      }
    } catch (error) {
      showNotification("Failed to update job post", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete job post
  const deleteJobPost = async (jobId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/rider-job-post/admin/${jobId}`, {
        method: "DELETE",
        headers: headers,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        showNotification("Job post deleted successfully!", "success");
        setIsDeleteModalOpen(false);
        setSelectedJob(null);
        fetchJobs();
      } else {
        showNotification(data.message || data.error || "Failed to delete job post", "error");
      }
    } catch (error) {
      showNotification("Failed to delete job post", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = useCallback((message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  }, []);

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      joiningBonus: "",
      onboardingFee: "",
      vendorId: "",
      line1: "",
      line2: "",
      pinCode: "",
      city: "",
      state: "",
      latitude: "",
      longitude: "",
    });
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setFormData({
      jobTitle: job.jobTitle,
      joiningBonus: job.joiningBonus,
      onboardingFee: job.onboardingFee,
      vendorId: job.vendor._id,
      line1: job.location.line1,
      line2: job.location.line2,
      pinCode: job.location.pinCode,
      city: job.location.city,
      state: job.location.state,
      latitude: job.location.latitude,
      longitude: job.location.longitude,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedJob) {
      // For update, use the format expected by the admin update endpoint
      const jobData = {
        jobTitle: formData.jobTitle,
        joiningBonus: Number(formData.joiningBonus),
        onboardingFee: Number(formData.onboardingFee),
        vendor: formData.vendorId, // Admin can change vendor
        locationLine1: formData.line1,
        locationLine2: formData.line2 || "",
        locationPinCode: formData.pinCode,
        locationCity: formData.city,
        locationState: formData.state,
        locationLatitude: formData.latitude ? Number(formData.latitude) : undefined,
        locationLongitude: formData.longitude ? Number(formData.longitude) : undefined,
      };
      updateJobPost(selectedJob._id, jobData);
    } else {
      // For create, use the format expected by the admin/create endpoint
      const jobData = {
        jobTitle: formData.jobTitle,
        joiningBonus: Number(formData.joiningBonus),
        onboardingFee: Number(formData.onboardingFee),
        vendor: formData.vendorId,
        locationLine1: formData.line1,
        locationLine2: formData.line2 || "",
        locationPinCode: formData.pinCode,
        locationCity: formData.city,
        locationState: formData.state,
        locationLatitude: formData.latitude ? Number(formData.latitude) : undefined,
        locationLongitude: formData.longitude ? Number(formData.longitude) : undefined,
      };
      createJobPost(jobData);
    }
  };

  // Fetch all vendors for dropdown
  const fetchVendors = useCallback(async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Fetch all vendors (with high limit to get all) - using admin endpoint
      const response = await fetch(`${API_BASE_URL}/admin/vendors?limit=1000`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setVendors(data.data || []);
      } else {
        console.error("Failed to fetch vendors:", data.message || data.error);
      }
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchVendors();
  }, [fetchJobs, fetchVendors]);

  // Memoized filtered jobs for better performance
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    
    const query = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.jobTitle?.toLowerCase().includes(query) ||
        job.location?.city?.toLowerCase().includes(query) ||
        job.vendor?.storeName?.toLowerCase().includes(query),
    );
  }, [jobs, searchQuery]);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 ml-6">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-500 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white animate-slideIn`}
          >
            {notification.type === "success" ? (
              <Check size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-2 py-4">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Rider Job Management
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage delivery executive job postings
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-sm transition-colors font-medium"
              >
                <Plus size={20} />
                Create Job Post
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-6 max-w-xl">
              <div className="flex items-center gap-3 bg-white rounded-lg shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-orange-400 transition">
                <input
                  type="text"
                  placeholder="Search by job title, city, or vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-5 py-3 text-gray-700 placeholder-gray-400 rounded-lg focus:outline-none"
                />
                <button className="mr-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white p-3 rounded-lg shadow transition duration-200 flex items-center justify-center">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                          <Briefcase className="text-orange-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.jobTitle}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                job.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {job.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                            <Users size={14} />
                            {job.vendor.storeName}
                          </p>

                          <p className="text-sm text-gray-600 mb-3">
                            Posted by:{" "}
                            {job.postedBy?.vendorName || job.postedBy?.name} (
                            {job.postedByType})
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign
                                className="text-green-600"
                                size={18}
                              />
                              <span className="text-gray-700">
                                <strong>Joining Bonus:</strong> ₹
                                {job.joiningBonus}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="text-blue-600" size={18} />
                              <span className="text-gray-700">
                                <strong>Onboarding Fee:</strong> ₹
                                {job.onboardingFee}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin
                              className="text-orange-600 flex-shrink-0 mt-1"
                              size={18}
                            />
                            <div className="text-sm text-gray-700">
                              <p>{job.location.line1}</p>
                              {job.location.line2 && (
                                <p>{job.location.line2}</p>
                              )}
                              <p>
                                {job.location.city}, {job.location.state} -{" "}
                                {job.location.pinCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredJobs.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or create a new job post
              </p>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditModalOpen ? "Edit Job Post" : "Create Job Post"}
                </h2>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Job Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Briefcase size={20} className="text-orange-600" />
                    Job Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, jobTitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Delivery Executive"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Joining Bonus (₹){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.joiningBonus}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            joiningBonus: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Onboarding Fee (₹){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.onboardingFee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            onboardingFee: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.vendorId}
                      onChange={(e) =>
                        setFormData({ ...formData, vendorId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select a vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.storeName || vendor.vendorName || vendor._id}
                        </option>
                      ))}
                    </select>
                    {vendors.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">Loading vendors...</p>
                    )}
                  </div>
                </div>

                {/* Location Section */}
                <div className="border-t pt-4 mt-4 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MapPin size={20} className="text-orange-600" />
                    Location Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.line1}
                      onChange={(e) =>
                        setFormData({ ...formData, line1: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="MG Road, Sector 12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.line2}
                      onChange={(e) =>
                        setFormData({ ...formData, line2: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Opposite City Mall"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Bhopal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Madhya Pradesh"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pinCode}
                        onChange={(e) =>
                          setFormData({ ...formData, pinCode: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="462001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) =>
                          setFormData({ ...formData, latitude: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="23.2599"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longitude: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="77.4126"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Saving..."
                      : isEditModalOpen
                        ? "Update Job Post"
                        : "Create Job Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Delete Job Post?
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Are you sure you want to delete this job posting? This action
                  cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setSelectedJob(null);
                    }}
                    className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteJobPost(selectedJob._id)}
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          .animate-slideIn {
            animation: slideIn 0.4s ease-out;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default RiderJobPostManagement;
