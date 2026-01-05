import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateOfferPopup from "../../components/PushNotification";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 7;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setOffers([
        {
          id: "RUSH923",
          offerType: "Coupon",
          code: "TUSO30",
          min: 12,
          max: 20,
          amount: "20%",
          status: "Draft",
        },
        {
          id: "RUSH924",
          offerType: "Prepaid",
          code: "Null",
          min: 12,
          max: 20,
          amount: "20 INR",
          status: "Live",
        },
        {
          id: "RUSH925",
          offerType: "Coupon",
          code: "TUSO40",
          min: 15,
          max: 30,
          amount: "25%",
          status: "Live",
        },
        {
          id: "RUSH926",
          offerType: "Coupon",
          code: "TUSO50",
          min: 10,
          max: 25,
          amount: "15%",
          status: "Live",
        },
        {
          id: "RUSH927",
          offerType: "Prepaid",
          code: "Null",
          min: 20,
          max: 40,
          amount: "50 INR",
          status: "Draft",
        },
        {
          id: "RUSH928",
          offerType: "Coupon",
          code: "SAVE15",
          min: 5,
          max: 15,
          amount: "10%",
          status: "Live",
        },
      ]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Filter logic for tabs + search
  const filteredOffers = offers
    .filter((offer) => {
      if (activeTab === "Live") return offer.status.toLowerCase() === "live";
      if (activeTab === "Draft") return offer.status.toLowerCase() === "draft";
      return true;
    })
    .filter((offer) =>
      [offer.id, offer.offerType, offer.code, offer.amount]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers((prev) => prev.filter((offer) => offer.id !== id));
    }
  };

  const handleViewNotification = (id) => {
    navigate(`/notification/${id}`);
  };

  // Handler for submitting new offer from modal
  const handleCreateOffer = (newOffer) => {
    const id = "RUSH" + Math.floor(Math.random() * 1000);
    const offer = { id, status: "Draft", ...newOffer };
    setOffers((prev) => [offer, ...prev]);
  };

  // Skeleton loader row
  const SkeletonRow = () => (
    <tr className="animate-pulse border-b-4 border-gray-200 text-center">
      {Array(8)
        .fill(0)
        .map((_, idx) => (
          <td key={idx} className="p-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </td>
        ))}
    </tr>
  );

  return (
    <DashboardLayout>
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
          {/* Tabs */}
          <div className="flex gap-3 items-center overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {["all", "Live", "Draft"].map((tab) => (
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
                {tab === "all" ? "All" : tab === "Live" ? "Live" : "Draft"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px] mt-2 sm:mt-0 ml-0 sm:ml-16">
            <input
              type="text"
              placeholder="Search Offer by ID, Type or Code..."
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
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Push Notification
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3">S.N</th>
              <th className="p-3">Offer ID</th>
              <th className="p-3">Offer Type</th>
              <th className="p-3">Code</th>
              <th className="p-3">Mini | Max Amount</th>
              <th className="p-3">Amount or %</th>
              <th className="p-3">Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array(7)
                .fill(0)
                .map((_, i) => <SkeletonRow key={i} />)
            ) : currentOffers.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
                >
                  No offers found.
                </td>
              </tr>
            ) : (
              currentOffers.map((offer, idx) => (
                <tr
                  key={offer.id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200 text-center"
                >
                  <td className="p-3">{indexOfFirst + idx + 1}</td>
                  <td className="p-3">{offer.id}</td>
                  <td className="p-3">{offer.offerType}</td>
                  <td className="p-3">{offer.code}</td>
                  <td className="p-3">{`${offer.min} | ${offer.max}`}</td>
                  <td className="p-3">{offer.amount}</td>
                  <td
                    className={`p-3 font-semibold ${
                      offer.status.toLowerCase() === "live"
                        ? "text-green-600"
                        : offer.status.toLowerCase() === "draft"
                        ? "text-orange-500"
                        : "text-gray-600"
                    }`}
                  >
                    {offer.status}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-3 text-orange-600">
                      <button className="hover:text-blue-700" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="hover:text-blue-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-blue-700"
                        onClick={() => handleViewNotification(offer.id)}
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

      {/* Pagination */}
      {!loading && filteredOffers.length > 0 && (
        <div className="flex justify-end items-center gap-4 mt-8 mr-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600"
          >
            Back
          </button>

          <div className="flex items-center gap-2 text-sm text-black font-medium">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page ? "text-orange-600 font-semibold" : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800"
          >
            Next
          </button>
        </div>
      )}

      {/* CreateOfferPopup Modal */}
      <CreateOfferPopup
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOffer}
      />
    </DashboardLayout>
  );
};

export default Notification;
