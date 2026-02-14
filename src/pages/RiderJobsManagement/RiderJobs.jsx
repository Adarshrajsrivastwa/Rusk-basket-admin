import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  DollarSign,
  Briefcase,
  X,
  Search,
  Eye,
} from "lucide-react";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api`;

const RiderJobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "Delivery Executive",
    joiningBonus: "",
    onboardingFee: "",
    locationLine1: "",
    locationLine2: "",
    locationPinCode: "",
    locationCity: "",
    locationState: "",
    locationLatitude: "",
    locationLongitude: "",
  });

  // Get token from localStorage
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch all jobs
  const fetchJobs = async (city = "") => {
    console.log("========================================");
    console.log("fetchJobs called");
    console.log("City filter:", city || "No filter");
    console.log("========================================");
    setLoading(true);
    try {
      // Use vendor-specific endpoint to get vendor's job posts
      const url = `${API_BASE_URL}/vendor/my-job-posts`;

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = getAuthHeaders();

      console.log("========================================");
      console.log("API REQUEST DETAILS:");
      console.log("URL:", url);
      console.log("Method: GET");
      console.log("Token available:", !!token);
      console.log("Token length:", token ? token.length : 0);
      console.log("Headers:", headers);
      console.log("========================================");

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      console.log("========================================");
      console.log("RESPONSE RECEIVED:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("OK:", response.ok);
      console.log("Content-Type:", response.headers.get("content-type"));
      console.log("========================================");

      const result = await response.json();
      console.log("========================================");
      console.log("PARSED JSON RESPONSE:");
      console.log("Full response:", result);
      console.log("Response type:", typeof result);
      console.log("Response keys:", Object.keys(result));
      console.log("========================================");
      console.log("Response success:", result.success);
      console.log("Response count:", result.count);
      console.log("Response pagination:", result.pagination);
      console.log("========================================");
      console.log("Response data:", result.data);
      console.log(
        "Data type:",
        Array.isArray(result.data) ? "Array" : typeof result.data,
      );
      console.log(
        "Data length:",
        Array.isArray(result.data) ? result.data.length : "Not an array",
      );
      console.log("========================================");

      if (Array.isArray(result.data)) {
        console.log("ITERATING THROUGH JOBS:");
        result.data.forEach((job, index) => {
          console.log(`\n--- Job ${index + 1} ---`);
          console.log("_id:", job._id);
          console.log("jobTitle:", job.jobTitle);
          console.log("joiningBonus:", job.joiningBonus);
          console.log("onboardingFee:", job.onboardingFee);
          console.log("isActive:", job.isActive);
          console.log("postedByType:", job.postedByType);
          console.log("location:", job.location);
          console.log("vendor:", job.vendor);
          console.log("postedBy:", job.postedBy);
          console.log("createdAt:", job.createdAt);
          console.log("updatedAt:", job.updatedAt);
          console.log("Full job object:", JSON.stringify(job, null, 2));
        });
      }

      if (result.success) {
        let jobsData = result.data || [];
        console.log("========================================");
        console.log("BEFORE FILTERING:");
        console.log("Jobs count:", jobsData.length);
        console.log("========================================");

        // If city filter is provided, filter by city
        if (city && city.trim()) {
          const cityLower = city.toLowerCase().trim();
          console.log("Applying city filter:", cityLower);
          const beforeFilter = jobsData.length;
          jobsData = jobsData.filter((job) => {
            const jobCity = job.location?.city?.toLowerCase() || "";
            const matches = jobCity.includes(cityLower);
            console.log(
              `Job ${job._id} - City: "${jobCity}" - Matches: ${matches}`,
            );
            return matches;
          });
          console.log("AFTER FILTERING:");
          console.log("Before filter count:", beforeFilter);
          console.log("After filter count:", jobsData.length);
          console.log("Filtered jobs:", jobsData);
        }

        console.log("========================================");
        console.log("SETTING JOBS TO STATE:");
        console.log("Final jobs array:", jobsData);
        console.log("Final count:", jobsData.length);
        console.log("First job:", jobsData[0]);
        console.log("========================================");
        setJobs(jobsData);
        console.log("Jobs state updated successfully");
      } else {
        console.error("========================================");
        console.error("API RETURNED SUCCESS: FALSE");
        console.error("Error message:", result.message);
        console.error("Error:", result.error);
        console.error("Full error response:", result);
        console.error("========================================");
        alert(result.message || "Failed to fetch jobs");
        setJobs([]);
      }
    } catch (error) {
      console.error("========================================");
      console.error("EXCEPTION CAUGHT:");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Full error:", error);
      console.error("========================================");
      alert("Failed to fetch jobs");
      setJobs([]);
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
      console.log("========================================");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      jobTitle: "Delivery Executive",
      joiningBonus: "",
      onboardingFee: "",
      locationLine1: "",
      locationLine2: "",
      locationPinCode: "",
      locationCity: "",
      locationState: "",
      locationLatitude: "",
      locationLongitude: "",
    });
  };

  // Open modal for create
  const handleCreate = () => {
    resetForm();
    setIsEdit(false);
    setCurrentJob(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (job) => {
    setFormData({
      jobTitle: job.jobTitle || "Delivery Executive",
      joiningBonus: job.joiningBonus || "",
      onboardingFee: job.onboardingFee || "",
      locationLine1: job.location?.line1 || "",
      locationLine2: job.location?.line2 || "",
      locationPinCode: job.location?.pinCode || "",
      locationCity: job.location?.city || "",
      locationState: job.location?.state || "",
      locationLatitude: job.location?.latitude || "",
      locationLongitude: job.location?.longitude || "",
    });
    setIsEdit(true);
    setCurrentJob(job);
    setIsModalOpen(true);
  };

  // Navigate to view applications
  const handleViewApplications = (jobId) => {
    navigate(`/rider-job-applications/${jobId}`);
  };

  // Submit form (Create or Update)
  const handleSubmit = async () => {
    // Validation
    if (
      !formData.jobTitle ||
      !formData.joiningBonus ||
      !formData.onboardingFee
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const url = isEdit
        ? `${API_BASE_URL}/rider-job-post/${currentJob._id}`
        : `${API_BASE_URL}/rider-job-post/create`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          result.message ||
            `Job ${isEdit ? "updated" : "created"} successfully`,
        );
        setIsModalOpen(false);
        fetchJobs(searchCity);
        resetForm();
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save job post");
    }
  };

  // Delete job
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/rider-job-post/${jobId}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        alert("Job post deleted successfully");
        fetchJobs(searchCity);
      } else {
        alert(result.message || "Failed to delete job post");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete job post");
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(searchCity);
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
                onClick={handleCreate}
                className="flex items-center gap-2 bg-black hover:bg-orange-600 text-white px-6 py-3 rounded-sm transition-colors"
              >
                <Plus size={20} />
                Create Job Post
              </button>
            </div>

            {/* Search */}
            <div className="mt-6 max-w-xl">
              <div className="flex items-center gap-3 bg-white rounded-xl shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-orange-400 transition">
                {/* Input */}
                <input
                  type="text"
                  placeholder=" Search by city (e.g., Bhopal)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 px-5 py-3 text-gray-700 placeholder-gray-400 rounded-xl focus:outline-none"
                />

                {/* Button */}
                <button
                  onClick={handleSearch}
                  className="mr-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white p-3 rounded-lg shadow transition duration-200 flex items-center justify-center"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">No job posts found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {currentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="bg-orange-100 p-3 rounded-lg">
                            <Briefcase className="text-orange-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.jobTitle}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Posted by:{" "}
                              {job.postedBy?.vendorName || job.postedBy?.name} (
                              {job.postedByType})
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                <DollarSign
                                  className="text-blue-600"
                                  size={18}
                                />
                                <span className="text-gray-700">
                                  <strong>Onboarding Fee:</strong> ₹
                                  {job.onboardingFee}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 mt-3">
                              <MapPin
                                className="text-orange-600 flex-shrink-0 mt-1"
                                size={18}
                              />
                              <div className="text-sm text-gray-700">
                                <p>{job.location?.line1}</p>
                                {job.location?.line2 && (
                                  <p>{job.location.line2}</p>
                                )}
                                <p>
                                  {job.location?.city}, {job.location?.state} -{" "}
                                  {job.location?.pinCode}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                              <span>Vendor: {job.vendor?.storeName}</span>
                              <span>•</span>
                              <span>
                                Status:{" "}
                                {job.isActive ? "✅ Active" : "❌ Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewApplications(job._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Applications"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEdit ? "Edit Job Post" : "Create Job Post"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Joining Bonus & Onboarding Fee */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Joining Bonus (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="joiningBonus"
                      value={formData.joiningBonus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Onboarding Fee (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="onboardingFee"
                      value={formData.onboardingFee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location Details */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Location Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="locationLine1"
                        value={formData.locationLine1}
                        onChange={handleInputChange}
                        placeholder="House No. 21, MG Road"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="locationLine2"
                        value={formData.locationLine2}
                        onChange={handleInputChange}
                        placeholder="Near City Mall"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="locationCity"
                          value={formData.locationCity}
                          onChange={handleInputChange}
                          placeholder="Bhopal"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="locationState"
                          value={formData.locationState}
                          onChange={handleInputChange}
                          placeholder="Madhya Pradesh"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pin Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="locationPinCode"
                        value={formData.locationPinCode}
                        onChange={handleInputChange}
                        placeholder="462001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="locationLatitude"
                          value={formData.locationLatitude}
                          onChange={handleInputChange}
                          placeholder="23.2599"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="locationLongitude"
                          value={formData.locationLongitude}
                          onChange={handleInputChange}
                          placeholder="77.4126"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    {isEdit ? "Update Job Post" : "Create Job Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RiderJobManagement;
