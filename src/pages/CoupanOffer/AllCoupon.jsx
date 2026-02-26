import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2 } from "lucide-react";
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

  const SkeletonRow = () => (
    <tr className="animate-pulse border-b-4 border-gray-200 text-center">
      {Array(9)
        .fill(0)
        .map((_, idx) => (
          <td key={idx} className="p-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </td>
        ))}
    </tr>
  );

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

  return (
    <DashboardLayout>
      <div className="p-0 mt-2 ml-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
            {/* Tabs */}
            <div className="flex gap-3 items-center overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
              {["all", "active", "inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`w-24 sm:w-28 px-4 py-2 border rounded text-xs sm:text-sm font-medium text-center transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-[#FF7B1D] text-white border-orange-500"
                      : "border-gray-400 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab === "all"
                    ? "All"
                    : tab === "active"
                      ? "Active"
                      : "Inactive"}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px]">
              <input
                type="text"
                placeholder="Search Offer by ID, Name or Code..."
                className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full">
                Search
              </button>
            </div>
          </div>

          <button
            className="bg-black text-white w-46 sm:w-52 px-4 sm:px-5 py-2 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
            onClick={() => {
              setEditingOffer(null);
              setIsCreateModalOpen(true);
            }}
          >
            + Create Offer
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="bg-[#FF7B1D] text-black">
                <th className="p-3">S.N</th>
                <th className="p-3">Coupon Name</th>
                <th className="p-3">Offer ID</th>
                <th className="p-3">Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">Min | Max</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Valid Until</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(7)
                  .fill(0)
                  .map((_, i) => <SkeletonRow key={i} />)
              ) : filteredOffers.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
                  >
                    No offers found.
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer, idx) => (
                  <tr
                    key={offer._id}
                    className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200 text-center"
                  >
                    <td className="p-3">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="p-3">{offer.couponName}</td>
                    <td className="p-3">{offer.offerId}</td>
                    <td className="p-3">{offer.code || "N/A"}</td>
                    <td className="p-3 capitalize">{offer.offerType}</td>
                    <td className="p-3">{`₹${offer.minAmount} | ₹${offer.maxAmount}`}</td>
                    <td className="p-3">
                      {offer.offerType === "percentage"
                        ? `${offer.discountPercentage}%`
                        : `₹${offer.discountPercentage}`}
                    </td>
                    <td className="p-3">{formatDate(offer.validUntil)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleStatus(offer)}
                        className={`px-3 py-1 rounded text-xs font-semibold ${offer.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {offer.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-3 text-orange-600">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleView(offer)}
                          className="hover:text-blue-700"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination — always visible when offers exist, same style as CreateCategory */}
        {!loading && filteredOffers.length > 0 && (
          <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <div className="flex items-center gap-2 text-sm text-black font-medium">
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
                    <span key={idx} className="px-1 text-black select-none">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-1 hover:text-orange-500 transition-colors ${currentPage === page ? "text-orange-600 font-semibold" : ""}`}
                    >
                      {page}
                    </button>
                  ),
                );
              })()}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
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
      </div>
    </DashboardLayout>
  );
};

export default AllOffer;
