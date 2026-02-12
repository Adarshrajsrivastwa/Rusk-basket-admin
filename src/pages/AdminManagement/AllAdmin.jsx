import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { UserPlus, X, Check, AlertCircle } from "lucide-react";
import api from "../../api/api";

const AllAdmin = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [endpointNotFound, setEndpointNotFound] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  // Fetch admins from API
  const fetchAdmins = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      // Use /api/admin/list endpoint
      const response = await api.get(`/api/admin/list`, {
        params: {
          page: page,
          limit: limit,
        },
      });

      const result = response.data;

      if (result.success) {
        setAdmins(result.data || []);
        setPagination(
          result.pagination || {
            total: result.count || 0,
            pages: 1,
            page: page,
            limit: limit,
          },
        );
        setError(null); // Clear any previous errors
      } else {
        setError(result.message || "Failed to fetch admins");
        setAdmins([]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      
      // Check if it's a 404 error
      if (error.response?.status === 404) {
        // Show info message instead of error - user can still add admins
        console.warn("GET endpoint for listing admins not found. Backend needs to implement: GET /api/admin/list");
        setEndpointNotFound(true);
        setAdmins([]);
        setError(null); // Clear error so it doesn't show red banner
      } else {
        setEndpointNotFound(false);
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            "Error fetching admins. Please check your connection and try again.";
        setError(errorMessage);
        setAdmins([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch admins on mount and when page changes
  useEffect(() => {
    fetchAdmins(currentPage, 10);
  }, [currentPage]);

  // Refresh admins list
  const refreshAdmins = () => {
    fetchAdmins(currentPage, 10);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      setError("Mobile must be exactly 10 digits");
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await api.post("/api/admin/add", {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
      });

      const result = response.data;

      if (result.success) {
        setSuccess("Admin added successfully!");
        setIsModalOpen(false);
        resetForm();
        refreshAdmins();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to add admin");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error adding admin";
      setError(errorMessage);
    }
  };


  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
    });
    setError(null);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };


  const statusColors = {
    true: "text-green-600 font-semibold", // isActive: true
    false: "text-gray-600 font-semibold", // isActive: false
  };

  // Filter admins by status and search
  const filteredAdmins = admins.filter((admin) => {
    // Filter by active tab
    if (activeTab === "active" && !admin.isActive) return false;
    if (activeTab === "inactive" && admin.isActive) return false;

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        admin.name?.toLowerCase().includes(searchLower) ||
        admin.mobile?.toLowerCase().includes(searchLower) ||
        admin.email?.toLowerCase().includes(searchLower) ||
        admin._id?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr
          key={i}
          className="border-b border-gray-200 animate-pulse bg-white rounded-sm"
        >
          {Array.from({ length: 4 }).map((__, j) => (
            <td key={j} className="p-3">
              <div className="h-4 bg-gray-200 rounded w-[80%]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Empty State
  const EmptyState = () => (
    <tbody>
      <tr>
        <td
          colSpan="4"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No admins found.
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 mx-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
          <Check size={24} />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {endpointNotFound && (
        <div className="mb-4 mx-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 px-6 py-4 rounded-xl flex items-start gap-3 shadow-md">
          <AlertCircle size={24} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-1">⚠️ Admin List Endpoint Not Found</p>
            <p className="text-sm">
              The GET endpoint for listing admins is not available on the backend. 
              Please create: <code className="bg-yellow-100 px-1 rounded">GET /api/admin/list</code>
            </p>
            <p className="text-sm mt-1 font-medium">
              ✅ You can still add new admins using the "Add Admin" button above.
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="mb-4 mx-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
          <X size={24} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
          {/* Tabs */}
          <div className="flex gap-4 items-center overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {["all", "active", "inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                }}
                className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-[#FF7B1D] text-white border-orange-500"
                    : "border-gray-400 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab === "all"
                  ? "All Admin"
                  : tab === "active"
                    ? "Active"
                    : "Inactive"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px] mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search Admin by Name, Mobile, Email..."
              className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Add Admin Button */}
        <div className="w-full md:w-auto flex justify-start md:justify-end mt-2 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white w-52 sm:w-60 px-4 sm:px-5 py-2 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap transition-colors gap-2"
          >
            <UserPlus size={18} />
            + Add Admin
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredAdmins.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {filteredAdmins.map((admin, idx) => (
                <tr
                  key={admin._id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">
                    {(currentPage - 1) * pagination.limit + idx + 1}
                  </td>
                  <td className="p-3 font-medium">{admin.name || "N/A"}</td>
                  <td className="p-3">{admin.mobile || "N/A"}</td>
                  <td className="p-3">{admin.email || "N/A"}</td>
                  <td className={`p-3 ${statusColors[admin.isActive]}`}>
                    {admin.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredAdmins.length > 0 && pagination.pages > 1 && (
        <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto pl-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-black font-medium">
            {(() => {
              const pages = [];
              const totalPages = pagination.pages;
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
                  <span key={idx} className="px-1 text-black select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-1 hover:text-orange-500 transition-colors ${
                      currentPage === page
                        ? "text-orange-600 font-semibold"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                ),
              );
            })()}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))
            }
            disabled={currentPage === pagination.pages}
            className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {!loading && filteredAdmins.length > 0 && (
        <div className="text-center text-sm text-gray-600 mt-4 mb-6">
          Showing {filteredAdmins.length} of {pagination.total} admins
        </div>
      )}

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Add Admin</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter admin name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter 10 digit mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter email address"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#FF7B1D] text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AllAdmin;
