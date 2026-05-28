import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import {
  MapPin,
  IndianRupee,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";

const JobFormInput = ({ label, required, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      required={required}
      {...props}
      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
    />
  </div>
);

const RiderJobPostManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const itemsPerPage = 7;

  const API_BASE_URL = `${BASE_URL}/api`;

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
  });

  const showNotification = useCallback((message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000,
    );
  }, []);

  const getHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const h = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/rider-job-post`, {
        method: "GET",
        headers: getHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setJobs(data.data || []);
      else showNotification(data.message || "Failed to fetch jobs", "error");
    } catch {
      showNotification("Failed to fetch jobs", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVendors = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/vendors?limit=1000`, {
        method: "GET",
        headers: getHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setVendors(data.data || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const createJobPost = async (jobData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/rider-job-post/admin/create`, {
        method: "POST",
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify(jobData),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Job post created successfully!", "success");
        setIsCreateModalOpen(false);
        fetchJobs();
        resetForm();
      } else
        showNotification(data.message || "Failed to create job post", "error");
    } catch {
      showNotification("Failed to create job post", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateJobPost = async (jobId, jobData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/rider-job-post/admin/${jobId}`, {
        method: "PUT",
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify(jobData),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Job post updated successfully!", "success");
        setIsEditModalOpen(false);
        fetchJobs();
        resetForm();
      } else
        showNotification(data.message || "Failed to update job post", "error");
    } catch {
      showNotification("Failed to update job post", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteJobPost = async (jobId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/rider-job-post/admin/${jobId}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Job post deleted successfully!", "success");
        setIsDeleteModalOpen(false);
        setSelectedJob(null);
        fetchJobs();
      } else
        showNotification(data.message || "Failed to delete job post", "error");
    } catch {
      showNotification("Failed to delete job post", "error");
    } finally {
      setLoading(false);
    }
  };

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
    });
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setFormData({
      jobTitle: job.jobTitle,
      joiningBonus: job.joiningBonus,
      onboardingFee: job.onboardingFee,
      vendorId: job.vendor?._id || job.postedBy?._id || "",
      line1: job.location?.line1 || "",
      line2: job.location?.line2 || "",
      pinCode: job.location?.pinCode || "",
      city: job.location?.city || "",
      state: job.location?.state || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    };
    if (isEditModalOpen && selectedJob) updateJobPost(selectedJob._id, jobData);
    else createJobPost(jobData);
  };

  useEffect(() => {
    fetchJobs();
    fetchVendors();
  }, [fetchJobs, fetchVendors]);

  const filteredJobs = useMemo(() => {
    let result = jobs;
    if (activeTab === "active") result = result.filter((j) => j.isActive);
    if (activeTab === "inactive") result = result.filter((j) => !j.isActive);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(q) ||
          job.location?.city?.toLowerCase().includes(q) ||
          job.vendor?.storeName?.toLowerCase().includes(q) ||
          job._id?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [jobs, searchQuery, activeTab]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // ── Skeleton ──
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 7 ? "w-16 ml-auto" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // ── Empty ──
  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="8" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No job posts found
            </p>
            <p className="text-gray-300 text-xs">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first job post!"}
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  const renderJobFormModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditModalOpen ? "Edit Job Post" : "Create Job Post"}
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              {isEditModalOpen
                ? "Update existing job details"
                : "Fill in details to post a new job"}
            </p>
          </div>
          <button
            onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
              resetForm();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-100">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-[#FF7B1D]" />
              </div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Job Details
              </h3>
            </div>
            <div className="space-y-4">
              <JobFormInput
                label="Job Title"
                required
                type="text"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jobTitle: e.target.value,
                  }))
                }
                placeholder="e.g., Delivery Executive"
              />
              <div className="grid grid-cols-2 gap-4">
                <JobFormInput
                  label="Joining Bonus (₹)"
                  required
                  type="number"
                  value={formData.joiningBonus}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      joiningBonus: e.target.value,
                    }))
                  }
                  placeholder="1000"
                />
                <JobFormInput
                  label="Onboarding Fee (₹)"
                  required
                  type="number"
                  value={formData.onboardingFee}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      onboardingFee: e.target.value,
                    }))
                  }
                  placeholder="300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Vendor <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.vendorId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vendorId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all bg-white"
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.storeName || v.vendorName || v._id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-100">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#FF7B1D]" />
              </div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Location Details
              </h3>
            </div>
            <div className="space-y-4">
              <JobFormInput
                label="Address Line 1"
                required
                type="text"
                value={formData.line1}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, line1: e.target.value }))
                }
                placeholder="MG Road, Sector 12"
              />
              <JobFormInput
                label="Address Line 2"
                type="text"
                value={formData.line2}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, line2: e.target.value }))
                }
                placeholder="Opposite City Mall"
              />
              <div className="grid grid-cols-3 gap-4">
                <JobFormInput
                  label="City"
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="Bhopal"
                />
                <JobFormInput
                  label="State"
                  required
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, state: e.target.value }))
                  }
                  placeholder="Madhya Pradesh"
                />
                <JobFormInput
                  label="PIN Code"
                  required
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pinCode: e.target.value,
                    }))
                  }
                  placeholder="462001"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="px-5 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : isEditModalOpen ? (
                <>
                  <Check className="w-4 h-4" /> Update Job Post
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Job Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium border ${notification.type === "success" ? "bg-emerald-500 border-emerald-400" : "bg-red-500 border-red-400"}`}
        >
          {notification.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {notification.message}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full px-1 mt-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Pills */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {["all", "active", "inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[320px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by title, city, vendor..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
              Search
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200 whitespace-nowrap h-[38px]"
          >
            <Plus className="w-4 h-4" />
            Create Job Post
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Rider Job Posts
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredJobs.length} of {jobs.length} jobs
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90 w-12">
                  S.N
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Job Title
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Vendor
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Joining Bonus
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Onboarding Fee
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  City
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Status
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-bold text-white tracking-wider uppercase opacity-90 pr-5">
                  Actions
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredJobs.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {currentJobs.map((job, idx) => (
                  <tr
                    key={job._id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {indexOfFirst + idx + 1}
                      </span>
                    </td>

                    {/* Job Title */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {job.jobTitle}
                      </span>
                    </td>

                    {/* Vendor */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {job.vendor?.storeName ||
                          job.vendor?.vendorName ||
                          job.postedBy?.vendorName ||
                          job.postedBy?.name ||
                          "—"}
                      </span>
                    </td>

                    {/* Joining Bonus */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100">
                        ₹{job.joiningBonus?.toLocaleString()}
                      </span>
                    </td>

                    {/* Onboarding Fee */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100">
                        ₹{job.onboardingFee?.toLocaleString()}
                      </span>
                    </td>

                    {/* City */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {job.location?.city}, {job.location?.state}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          job.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${job.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                        />
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(job)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsViewModalOpen(true);
                          }}
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsDeleteModalOpen(true);
                          }}
                          className="action-btn bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {!loading && filteredJobs.length > 0 && (
        <div className="flex items-center justify-between px-1 mt-5 mb-6">
          <p className="text-xs text-gray-400 font-medium">
            Page{" "}
            <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
            of <span className="text-gray-600 font-semibold">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const visiblePages = new Set([
                  1,
                  2,
                  totalPages - 1,
                  totalPages,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                ]);
                for (let i = 1; i <= totalPages; i++) {
                  if (visiblePages.has(i)) pages.push(i);
                  else if (pages[pages.length - 1] !== "...") pages.push("...");
                }
                return pages.map((page, idx) =>
                  page === "..." ? (
                    <span key={idx} className="px-1 text-gray-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === page
                          ? "bg-[#FF7B1D] text-white shadow-sm shadow-orange-200"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                );
              })()}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {(isCreateModalOpen || isEditModalOpen) && renderJobFormModal()}

      {/* ── View Modal ── */}
      {isViewModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Job Post Details
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  {selectedJob.jobTitle}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedJob(null);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Job Title", value: selectedJob.jobTitle },
                  {
                    label: "Status",
                    value: selectedJob.isActive ? "Active" : "Inactive",
                    color: selectedJob.isActive
                      ? "text-emerald-600"
                      : "text-gray-400",
                  },
                  {
                    label: "Joining Bonus",
                    value: `₹${selectedJob.joiningBonus?.toLocaleString()}`,
                    color: "text-emerald-700",
                  },
                  {
                    label: "Onboarding Fee",
                    value: `₹${selectedJob.onboardingFee?.toLocaleString()}`,
                    color: "text-blue-700",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                  >
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-semibold ${item.color || "text-gray-800"}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
                <div className="col-span-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Vendor
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedJob.vendor?.storeName ||
                      selectedJob.vendor?.vendorName ||
                      selectedJob.postedBy?.vendorName ||
                      "—"}
                  </p>
                </div>
                <div className="col-span-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedJob.location?.line1}
                  </p>
                  {selectedJob.location?.line2 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedJob.location.line2}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {selectedJob.location?.city}, {selectedJob.location?.state}{" "}
                    — {selectedJob.location?.pinCode}
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedJob(null);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100">
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-red-500 to-red-400 rounded-t-2xl">
              <h2 className="text-lg font-bold text-white">Confirm Delete</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedJob(null);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-gray-700 text-sm mb-6">
                Are you sure you want to delete this job post? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedJob(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteJobPost(selectedJob._id)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RiderJobPostManagement;
