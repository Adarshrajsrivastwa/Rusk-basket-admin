import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  UserPlus,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  ShieldOff,
  Search,
} from "lucide-react";
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

  const [formData, setFormData] = useState({ name: "", mobile: "", email: "" });

  const fetchAdmins = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/admin/list`, {
        params: { page, limit },
      });
      const result = response.data;
      if (result.success) {
        setAdmins(result.data || []);
        setPagination(
          result.pagination || {
            total: result.count || 0,
            pages: 1,
            page,
            limit,
          },
        );
        setError(null);
      } else {
        setError(result.message || "Failed to fetch admins");
        setAdmins([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setEndpointNotFound(true);
        setAdmins([]);
        setError(null);
      } else {
        setEndpointNotFound(false);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Error fetching admins.",
        );
        setAdmins([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage, 10);
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
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
        setFormData({ name: "", mobile: "", email: "" });
        fetchAdmins(currentPage, 10);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "Failed to add admin");
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Error adding admin",
      );
    }
  };

  const handleOpenModal = () => {
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", mobile: "", email: "" });
    setError(null);
  };

  const filteredAdmins = admins.filter((admin) => {
    if (activeTab === "active" && !admin.isActive) return false;
    if (activeTab === "inactive" && admin.isActive) return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      return (
        admin.name?.toLowerCase().includes(s) ||
        admin.mobile?.toLowerCase().includes(s) ||
        admin.email?.toLowerCase().includes(s) ||
        admin._id?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const totalActive = admins.filter((a) => a.isActive).length;
  const totalInactive = admins.filter((a) => !a.isActive).length;

  const statCards = [
    {
      label: "Total Admins",
      value: pagination.total,
      icon: Users,
      border: "border-[#FF7B1D]",
      text: "text-[#FF7B1D]",
      iconColor: "text-[#FF7B1D]",
      bg: "bg-orange-50",
    },
    {
      label: "Active",
      value: totalActive,
      icon: ShieldCheck,
      border: "border-emerald-500",
      text: "text-emerald-600",
      iconColor: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Inactive",
      value: totalInactive,
      icon: ShieldOff,
      border: "border-gray-400",
      text: "text-gray-500",
      iconColor: "text-gray-400",
      bg: "bg-gray-50",
    },
  ];

  const tabs = [
    { key: "all", label: "All Admin" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 5 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 4 ? "w-16 ml-auto" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="5" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No admins found</p>
            <p className="text-gray-300 text-xs">
              Try adjusting your filters or search query
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-animate { animation: modalIn 0.22s ease forwards; }
      `}</style>

      <div className="min-h-screen px-1 pt-4">
        {/* ── Success Banner ── */}
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check size={12} className="text-emerald-600" />
            </div>
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* ── Endpoint Warning ── */}
        {endpointNotFound && !isModalOpen && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-start gap-2.5 shadow-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
            <div className="text-sm">
              <p className="font-semibold mb-0.5">
                Admin List Endpoint Not Found
              </p>
              <p className="text-amber-700">
                Backend needs:{" "}
                <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  GET /api/admin/list
                </code>
              </p>
              <p className="text-amber-600 mt-1 text-xs">
                You can still add new admins using the "Add Admin" button.
              </p>
            </div>
          </div>
        )}

        {/* ── Error Banner (outside modal) ── */}
        {error && !isModalOpen && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-sm">
            <AlertCircle size={15} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 max-w-full">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 ${card.border} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold mt-0.5 ${card.text}`}>
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}
                >
                  <card.icon className={card.iconColor} size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
          {/* LEFT: Tabs + Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Search + Add Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[340px] shadow-sm bg-white">
              <input
                type="text"
                placeholder="Search by name, mobile, email..."
                className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-4 h-full transition-colors flex items-center gap-1.5">
                <Search size={14} />
              </button>
            </div>

            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-4 h-[38px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
            >
              <UserPlus size={15} /> Add Admin
            </button>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Admin Directory
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                {filteredAdmins.length} of {pagination.total} admins
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                  {["S.N", "Name", "Mobile", "Email", "Status"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 4 ? "text-right pr-5" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
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
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* S.N */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {(currentPage - 1) * pagination.limit + idx + 1}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shrink-0">
                            <span className="text-[#FF7B1D] text-xs font-bold">
                              {(admin.name || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-800 text-sm font-semibold">
                            {admin.name || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          {admin.mobile || "N/A"}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 text-gray-500 text-sm">
                        {admin.email || (
                          <span className="text-gray-300 italic text-xs">
                            Not provided
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 pr-5 text-right">
                        {admin.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 ring-1 ring-gray-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>

        {/* ── Pagination ── */}
        {!loading && filteredAdmins.length > 0 && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-5 mb-6">
            <p className="text-xs text-gray-400 font-medium">
              Page{" "}
              <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
              of{" "}
              <span className="text-gray-600 font-semibold">
                {pagination.pages}
              </span>
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
                    else if (pages[pages.length - 1] !== "...")
                      pages.push("...");
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, pagination.pages))
                }
                disabled={currentPage === pagination.pages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Admin Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="modal-animate bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">
                  Add New Admin
                </h2>
                <p className="text-xs text-white/75 mt-0.5">
                  Fill in the details below
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error inside modal */}
            {error && (
              <div className="mx-5 mt-4 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-gray-700 placeholder:text-gray-300 transition-all"
                  placeholder="Enter admin name"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Mobile <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-gray-700 placeholder:text-gray-300 transition-all"
                  placeholder="Enter 10 digit mobile number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email{" "}
                  <span className="text-gray-300 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-gray-700 placeholder:text-gray-300 transition-all"
                  placeholder="Enter email address"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-orange-200 flex items-center justify-center gap-2"
                >
                  <UserPlus size={15} /> Add Admin
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
