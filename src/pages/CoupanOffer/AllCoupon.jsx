import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Eye,
  Edit,
  Trash2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import CreateOfferPopup from "../../components/CreateCoupon";
import OfferViewModal from "../../pages/CoupanOffer/SingleOffer";
import { BASE_URL } from "../../api/api";

const API_URL = `${BASE_URL}/api/coupon`;

const AllOffer = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingOffer, setViewingOffer] = useState(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let url = `${API_URL}?page=${currentPage}&limit=${itemsPerPage}`;
      if (activeTab === "active") url += "&status=active";
      else if (activeTab === "inactive") url += "&status=inactive";

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
      });
      const data = await response.json();

      if (data.success) {
        setOffers(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalCount(data.count || 0);
      } else {
        setOffers([]);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentPage, activeTab]);

  const filteredOffers = offers.filter((offer) =>
    [offer.offerId, offer.couponName, offer.code, offer.offerType]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers,
      });
      const data = await response.json();
      if (data.success) {
        alert("Offer deleted successfully");
        fetchOffers();
      } else alert(data.message || "Failed to delete offer");
    } catch (error) {
      alert("Something went wrong while deleting");
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsCreateModalOpen(true);
  };

  const handleView = (offer) => {
    setViewingOffer(offer);
    setIsViewModalOpen(true);
  };

  const handleToggleStatus = async (offer) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const newStatus = offer.status === "active" ? "inactive" : "active";
      const response = await fetch(`${API_URL}/${offer._id}`, {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify({
          couponName: offer.couponName,
          offerId: offer.offerId,
          offerType: offer.offerType,
          code: offer.code,
          minAmount: offer.minAmount,
          maxAmount: offer.maxAmount,
          discountPercentage: offer.discountPercentage,
          status: newStatus,
          validFrom: offer.validFrom,
          validUntil: offer.validUntil,
          usageLimit: offer.usageLimit,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Offer status updated to ${newStatus}`);
        fetchOffers();
      } else alert(data.message || "Failed to update offer");
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const handleAddOffer = () => {
    fetchOffers();
    setIsCreateModalOpen(false);
    setEditingOffer(null);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingOffer(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 10 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${
                  j === 9 ? "w-16 ml-auto" : "w-[70%]"
                }`}
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
        <td colSpan="10" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Tag className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No offers found</p>
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
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
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

        {/* RIGHT: Search + Create */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[340px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by ID, Name or Code..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
              Search
            </button>
          </div>

          <button
            onClick={() => {
              setEditingOffer(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 h-[38px] px-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl whitespace-nowrap transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Offer
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
              Offer Management
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredOffers.length} of {totalCount} offers
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  { label: "S.N", cls: "w-12" },
                  { label: "Coupon Name" },
                  { label: "Offer ID" },
                  { label: "Code" },
                  { label: "Type" },
                  { label: "Min | Max" },
                  { label: "Discount" },
                  { label: "Valid Until" },
                  { label: "Status" },
                  { label: "Actions", right: true },
                ].map(({ label, cls, right }) => (
                  <th
                    key={label}
                    className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${cls || ""} ${right ? "text-right pr-5" : "text-left"}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredOffers.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {filteredOffers.map((offer, idx) => (
                  <tr
                    key={offer._id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* S.N */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </span>
                    </td>

                    {/* Coupon Name */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-gray-700">
                        {offer.couponName}
                      </span>
                    </td>

                    {/* Offer ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {offer.offerId}
                      </span>
                    </td>

                    {/* Code */}
                    <td className="px-4 py-3.5">
                      {offer.code ? (
                        <span className="font-mono text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded-md font-semibold">
                          {offer.code}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs italic">
                          N/A
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100 capitalize">
                        {offer.offerType}
                      </span>
                    </td>

                    {/* Min | Max */}
                    <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">
                      ₹{offer.minAmount}{" "}
                      <span className="text-gray-300 mx-0.5">|</span> ₹
                      {offer.maxAmount}
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-gray-800">
                        {offer.offerType === "percentage"
                          ? `${offer.discountPercentage}%`
                          : `₹${offer.discountPercentage}`}
                      </span>
                    </td>

                    {/* Valid Until */}
                    <td className="px-4 py-3.5 text-gray-500 text-xs">
                      {formatDate(offer.validUntil)}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(offer)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 transition-all ${
                          offer.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100 hover:bg-emerald-100"
                            : "bg-gray-50 text-gray-500 border-gray-200 ring-gray-100 hover:bg-gray-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            offer.status === "active"
                              ? "bg-emerald-500"
                              : "bg-gray-400"
                          }`}
                        />
                        {offer.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleView(offer)}
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View Details"
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
      {!loading && filteredOffers.length > 0 && (
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

      <CreateOfferPopup
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddOffer}
        editData={editingOffer}
      />
      <OfferViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        offer={viewingOffer}
      />
    </DashboardLayout>
  );
};

export default AllOffer;
