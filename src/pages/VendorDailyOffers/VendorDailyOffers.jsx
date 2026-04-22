import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Tag,
  Calendar,
  Percent,
  Edit,
  X,
  Check,
  AlertCircle,
  Clock,
  Package,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import api from "../../api/api";

const VendorDailyOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOffers, setTotalOffers] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const itemsPerPage = 10;

  const [editForm, setEditForm] = useState({
    offerEnabled: false,
    offerDiscountPercentage: 0,
    offerStartDate: "",
    offerStartTime: "",
    offerEndDate: "",
    offerEndTime: "",
    isDailyOffer: false,
  });

  const fetchOffers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await api.get(
        `/api/vendor/products/offers?${params.toString()}`,
      );
      if (response.data.success) {
        setOffers(response.data.data || []);
        setTotalOffers(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 1);
      } else {
        setError(response.data.message || "Failed to load offers");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load offers. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentPage, statusFilter]);

  const handleEditOffer = (product) => {
    setSelectedProduct(product);
    let startDate = "",
      startTime = "",
      endDate = "",
      endTime = "";

    if (product.offerStartDate) {
      const dt = new Date(product.offerStartDate);
      startDate = dt.toISOString().split("T")[0];
      startTime = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
    }
    if (product.offerEndDate) {
      const dt = new Date(product.offerEndDate);
      endDate = dt.toISOString().split("T")[0];
      endTime = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
    }

    setEditForm({
      offerEnabled: product.offerEnabled || false,
      offerDiscountPercentage: product.offerDiscountPercentage || 0,
      offerStartDate: startDate,
      offerStartTime: startTime,
      offerEndDate: endDate,
      offerEndTime: endTime,
      isDailyOffer: product.isDailyOffer || false,
    });
    setShowEditModal(true);
  };

  const handleUpdateOffer = async () => {
    if (!selectedProduct) return;
    if (editForm.offerEnabled && editForm.offerDiscountPercentage <= 0) {
      setError(
        "Discount percentage must be greater than 0 when offer is enabled",
      );
      return;
    }
    if (editForm.offerStartDate && editForm.offerEndDate) {
      let s = new Date(editForm.offerStartDate);
      let e = new Date(editForm.offerEndDate);
      if (editForm.offerStartTime) {
        const [h, m] = editForm.offerStartTime.split(":");
        s.setHours(+h, +m, 0, 0);
      }
      if (editForm.offerEndTime) {
        const [h, m] = editForm.offerEndTime.split(":");
        e.setHours(+h, +m, 0, 0);
      }
      if (e <= s) {
        setError("End date and time must be after start date and time");
        return;
      }
    } else if (editForm.offerStartDate && !editForm.offerEndDate) {
      setError("Please provide end date if start date is provided");
      return;
    } else if (!editForm.offerStartDate && editForm.offerEndDate) {
      setError("Please provide start date if end date is provided");
      return;
    }

    setUpdating(true);
    setError("");
    try {
      const payload = {
        offerEnabled: editForm.offerEnabled,
        offerDiscountPercentage:
          parseFloat(editForm.offerDiscountPercentage) || 0,
        isDailyOffer: editForm.isDailyOffer,
      };
      if (editForm.offerStartDate) {
        payload.offerStartDate = editForm.offerStartDate;
        if (editForm.offerStartTime) {
          let t = editForm.offerStartTime;
          if (t.length === 5) t += ":00";
          if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(t))
            payload.offerStartTime = t;
        }
      }
      if (editForm.offerEndDate) {
        payload.offerEndDate = editForm.offerEndDate;
        if (editForm.offerEndTime) {
          let t = editForm.offerEndTime;
          if (t.length === 5) t += ":00";
          if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(t))
            payload.offerEndTime = t;
        }
      }
      const response = await api.put(
        `/api/vendor/daily-offers/${selectedProduct._id}`,
        payload,
      );
      if (response.data.success) {
        setShowEditModal(false);
        setSelectedProduct(null);
        fetchOffers();
      } else {
        setError(
          response.data.message ||
            response.data.error ||
            "Failed to update offer",
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update offer. Please try again.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickToggle = async (product) => {
    if (togglingId === product._id) return;
    setTogglingId(product._id);
    setError("");
    try {
      const newIsDailyOffer = !product.isDailyOffer;
      const payload = { isDailyOffer: newIsDailyOffer };
      if (newIsDailyOffer && !product.offerEnabled) {
        payload.offerEnabled = true;
        payload.offerDiscountPercentage =
          product.regularPrice &&
          product.salePrice &&
          product.regularPrice > product.salePrice
            ? Math.round(
                ((product.regularPrice - product.salePrice) /
                  product.regularPrice) *
                  100,
              )
            : product.offerDiscountPercentage || 10;
      } else if (newIsDailyOffer) {
        payload.offerDiscountPercentage = product.offerDiscountPercentage || 10;
      }
      const response = await api.put(
        `/api/vendor/daily-offers/${product._id}`,
        payload,
      );
      if (response.data.success) {
        setOffers((prev) =>
          prev.map((o) =>
            o._id === product._id
              ? {
                  ...o,
                  isDailyOffer: newIsDailyOffer,
                  offerEnabled: newIsDailyOffer ? true : o.offerEnabled,
                }
              : o,
          ),
        );
        setTimeout(() => fetchOffers(), 500);
      } else {
        setError(
          response.data.message ||
            response.data.error ||
            "Failed to toggle offer",
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to toggle offer. Please try again.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const getOfferStatus = (product) => {
    if (!product.offerEnabled) return "disabled";
    if (!product.isDailyOffer) return "regular";
    const now = new Date();
    let start = null,
      end = null;
    if (product.offerStartDate) {
      start = new Date(product.offerStartDate);
      if (product.offerStartTime) {
        const [h, m, s] = product.offerStartTime.split(":");
        start.setHours(+h, +m, +(s || 0), 0);
      } else start.setHours(0, 0, 0, 0);
    }
    if (product.offerEndDate) {
      end = new Date(product.offerEndDate);
      if (product.offerEndTime) {
        const [h, m, s] = product.offerEndTime.split(":");
        end.setHours(+h, +m, +(s || 0), 0);
      } else end.setHours(23, 59, 59, 999);
    }
    if (start && now < start) return "upcoming";
    if (end && now > end) return "expired";
    if (start && end) return now >= start && now <= end ? "active" : "active";
    if (start && now >= start) return "active";
    if (end && now <= end) return "active";
    if (!start && !end) return product.offerEnabled ? "active" : "disabled";
    return "active";
  };

  const isOfferCurrentlyActive = (offer) => {
    if (!offer.offerEnabled || !offer.isDailyOffer) return false;
    const now = new Date();
    let start = null,
      end = null;
    if (offer.offerStartDate) {
      start = new Date(offer.offerStartDate);
      if (offer.offerStartTime) {
        const [h, m, s] = offer.offerStartTime.split(":");
        start.setHours(+h, +m, +(s || 0), 0);
      } else start.setHours(0, 0, 0, 0);
    }
    if (offer.offerEndDate) {
      end = new Date(offer.offerEndDate);
      if (offer.offerEndTime) {
        const [h, m, s] = offer.offerEndTime.split(":");
        end.setHours(+h, +m, +(s || 0), 0);
      } else end.setHours(23, 59, 59, 999);
    }
    if (start && end) return now >= start && now <= end;
    if (start) return now >= start;
    if (end) return now <= end;
    return offer.offerEnabled && offer.isDailyOffer;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredOffers = offers.filter((offer) => {
    if (!searchQuery) return true;
    return offer.productName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const stats = {
    total: totalOffers,
    active: offers.filter((o) => getOfferStatus(o) === "active").length,
    upcoming: offers.filter((o) => getOfferStatus(o) === "upcoming").length,
    expired: offers.filter((o) => getOfferStatus(o) === "expired").length,
    daily: offers.filter((o) => o.isDailyOffer).length,
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "upcoming", label: "Upcoming" },
    { key: "expired", label: "Expired" },
    { key: "enabled", label: "Enabled" },
  ];

  const StatusBadge = ({ offer }) => {
    const active = isOfferCurrentlyActive(offer);
    if (active) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }
    const status = getOfferStatus(offer);
    const map = {
      upcoming: {
        cls: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
        dot: "bg-blue-500",
        label: "Upcoming",
      },
      expired: {
        cls: "bg-red-50 text-red-700 border-red-200 ring-red-100",
        dot: "bg-red-500",
        label: "Expired",
      },
      disabled: {
        cls: "bg-gray-50 text-gray-500 border-gray-200 ring-gray-100",
        dot: "bg-gray-400",
        label: "Disabled",
      },
      regular: {
        cls: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
        dot: "bg-amber-500",
        label: "Regular",
      },
    };
    const s = map[status] || map.disabled;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${s.cls}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {s.label}
      </span>
    );
  };

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 6 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 1 ? "w-32" : "w-[70%]"}`}
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
        <td colSpan="6" className="py-20 text-center">
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

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 mt-3 px-1">
        {[
          {
            label: "Total Offers",
            value: stats.total,
            icon: Tag,
            color: "orange",
          },
          {
            label: "Active",
            value: stats.active,
            icon: Check,
            color: "emerald",
          },
          {
            label: "Upcoming",
            value: stats.upcoming,
            icon: Clock,
            color: "blue",
          },
          {
            label: "Expired",
            value: stats.expired,
            icon: AlertCircle,
            color: "red",
          },
          {
            label: "Daily Offers",
            value: stats.daily,
            icon: Tag,
            color: "purple",
          },
        ].map(({ label, value, icon: Icon, color }) => {
          const palette = {
            orange: {
              border: "border-[#FF7B1D]",
              text: "text-[#FF7B1D]",
              bg: "bg-orange-50",
              icon: "text-[#FF7B1D]",
            },
            emerald: {
              border: "border-emerald-500",
              text: "text-emerald-600",
              bg: "bg-emerald-50",
              icon: "text-emerald-500",
            },
            blue: {
              border: "border-blue-500",
              text: "text-blue-600",
              bg: "bg-blue-50",
              icon: "text-blue-500",
            },
            red: {
              border: "border-red-500",
              text: "text-red-600",
              bg: "bg-red-50",
              icon: "text-red-500",
            },
            purple: {
              border: "border-purple-500",
              text: "text-purple-600",
              bg: "bg-purple-50",
              icon: "text-purple-500",
            },
          }[color];
          return (
            <div
              key={label}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between border-l-4 ${palette.border}`}
            >
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${palette.text}`}>
                  {value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${palette.bg} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${palette.icon}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full px-1 mb-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                statusFilter === tab.key
                  ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setCurrentPage(1)}
          />
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mx-1 mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Daily Offers
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredOffers.length} of {totalOffers} offers
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  "S.N",
                  "Product",
                  "Discount",
                  "Offer Dates",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 5 ? "text-right pr-5" : "text-left"}`}
                  >
                    {h}
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

                    {/* Product */}
                    <td className="px-4 py-3.5">
                      <div className="max-w-[220px]">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {offer.productName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ₹{offer.regularPrice}
                          {offer.salePrice &&
                            offer.salePrice !== offer.regularPrice && (
                              <>
                                {" "}
                                →{" "}
                                <span className="text-emerald-600 font-medium">
                                  ₹{offer.salePrice}
                                </span>
                              </>
                            )}
                        </p>
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 bg-orange-50 text-[#FF7B1D] border border-orange-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        <Percent className="w-3 h-3" />
                        {offer.offerDiscountPercentage || 0}%
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 w-8">Start</span>
                          <span className="font-medium">
                            {formatDate(offer.offerStartDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 w-8">End</span>
                          <span className="font-medium">
                            {formatDate(offer.offerEndDate)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge offer={offer} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditOffer(offer)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit offer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleQuickToggle(offer)}
                          disabled={togglingId === offer._id}
                          className={`action-btn ${offer.isDailyOffer ? "bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700" : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}
                          title={
                            offer.isDailyOffer
                              ? "Disable daily offer"
                              : "Enable daily offer"
                          }
                        >
                          {offer.isDailyOffer ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
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
      {!loading && filteredOffers.length > 0 && totalPages > 1 && (
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
                const visible = new Set([
                  1,
                  2,
                  totalPages - 1,
                  totalPages,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                ]);
                for (let i = 1; i <= totalPages; i++) {
                  if (visible.has(i)) pages.push(i);
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

      {/* ── Edit Modal ── */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">Edit Offer</h2>
                <p className="text-xs text-orange-100 mt-0.5 truncate max-w-[360px]">
                  {selectedProduct.productName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                  setError("");
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Enable Offer", key: "offerEnabled" },
                  { label: "Mark as Daily Offer", key: "isDailyOffer" },
                ].map(({ label, key }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50/40 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={editForm[key]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [key]: e.target.checked })
                      }
                      className="w-4 h-4 text-[#FF7B1D] rounded focus:ring-[#FF7B1D] accent-[#FF7B1D]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Discount */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Discount Percentage *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.offerDiscountPercentage}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        offerDiscountPercentage:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-[#FF7B1D] outline-none text-sm transition-all"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Dates & Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editForm.offerStartDate}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        offerStartDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-[#FF7B1D] outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editForm.offerStartTime}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        offerStartTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-[#FF7B1D] outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editForm.offerEndDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, offerEndDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-[#FF7B1D] outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editForm.offerEndTime}
                    onChange={(e) =>
                      setEditForm({ ...editForm, offerEndTime: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-[#FF7B1D] outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                  setError("");
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOffer}
                disabled={updating}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-orange-200 flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Update Offer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default VendorDailyOffers;
