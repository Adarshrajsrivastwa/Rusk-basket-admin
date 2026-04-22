import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
} from "lucide-react";
import AddVendorModal from "../../components/AddVendorModal";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const AllVendor = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchVendors = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/vendor`, {
        params: { page, limit: itemsPerPage },
      });
      const result = response.data;
      if (result.success) {
        setVendors(result.data || []);
        if (result.pagination) {
          setTotalVendors(result.pagination.total || result.count || 0);
          setTotalPages(result.pagination.pages || 1);
        } else {
          setTotalVendors(result.count || 0);
          setTotalPages(1);
        }
      } else {
        setVendors([]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(currentPage);
  }, [currentPage]);

  const refreshVendors = () => fetchVendors(currentPage);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        const response = await api.delete(`/api/vendor/${id}`);
        if (response.data.success) refreshVendors();
      } catch (error) {
        console.error("Error deleting vendor:", error);
      }
    }
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditModalOpen(true);
  };

  const handleView = (vendor) =>
    navigate(`/vendor/${vendor._id}`, { state: { vendor } });

  const filteredVendors = vendors.filter((vendor) => {
    if (activeTab === "active" && !vendor.isActive) return false;
    if (activeTab === "suspended" && vendor.isActive) return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      return (
        vendor.vendorName?.toLowerCase().includes(s) ||
        vendor.storeId?.toLowerCase().includes(s) ||
        vendor.storeName?.toLowerCase().includes(s) ||
        vendor.contactNumber?.toLowerCase().includes(s) ||
        vendor.storeAddress?.city?.toLowerCase().includes(s) ||
        vendor.storeAddress?.pinCode?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // ── Skeleton ──
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${
                  j === 1 ? "w-24" : j === 8 ? "w-16 ml-auto" : "w-[70%]"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // ── Empty State ──
  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="9" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No vendors found
            </p>
            <p className="text-gray-300 text-xs">
              Try adjusting your filters or search query
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "suspended", label: "Suspended" },
  ];

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full max-w-full mx-auto px-1 mt-3 mb-3">
        {/* LEFT: Tab Pills */}
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

        {/* RIGHT: Search + Add */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[340px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by name, ID, city..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
              Search
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 h-[38px] bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-[#FF7B1D] transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Vendor
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
              Vendor Management
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredVendors.length} of {totalVendors} vendors
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  { label: "S.N", cls: "w-12" },
                  { label: "Vendor ID", cls: "" },
                  { label: "Auth. Name", cls: "" },
                  { label: "Store Name", cls: "" },
                  { label: "City", cls: "" },
                  { label: "Pin Code", cls: "" },
                  { label: "Contact", cls: "" },
                  { label: "Status", cls: "" },
                ].map(({ label, cls }) => (
                  <th
                    key={label}
                    className={`px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90 ${cls}`}
                  >
                    {label}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right text-xs font-bold text-white tracking-wider uppercase opacity-90 pr-5">
                  Actions
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredVendors.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {filteredVendors.map((vendor, idx) => (
                  <tr
                    key={vendor._id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </span>
                    </td>

                    {/* Vendor ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {vendor.storeId || "N/A"}
                      </span>
                    </td>

                    {/* Auth. Name */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-gray-800">
                        {vendor.vendorName || "N/A"}
                      </span>
                    </td>

                    {/* Store Name */}
                    <td className="px-4 py-3.5 text-gray-600 text-sm">
                      {vendor.storeName || "N/A"}
                    </td>

                    {/* City */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                        {vendor.storeAddress?.city || "N/A"}
                      </span>
                    </td>

                    {/* Pin Code */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                        {vendor.storeAddress?.pinCode || "N/A"}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5 text-gray-600 text-sm">
                      {vendor.contactNumber || "N/A"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${
                          vendor.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100"
                            : "bg-gray-50 text-gray-500 border-gray-200 ring-gray-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            vendor.isActive ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                        {vendor.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(vendor)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit vendor"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor._id)}
                          className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                          title="Delete vendor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleView(vendor)}
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View vendor"
                        >
                          <Eye className="w-3.5 h-3.5" />
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
      {!loading && filteredVendors.length > 0 && (
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

      {/* ── Add Vendor Modal ── */}
      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refreshVendors();
        }}
      />

      {/* ── Edit Vendor Modal ── */}
      <AddVendorModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVendor(null);
          refreshVendors();
        }}
        isEdit={true}
        vendorData={selectedVendor}
      />
    </DashboardLayout>
  );
};

export default AllVendor;
