import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  CheckCircle,
  XCircle,
  Eye,
  User,
  FileText,
  Car,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Clock,
  Shield,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api/rider`;

/* ─── Status badge ────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    approved: {
      style:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      dot: "bg-emerald-500",
      label: "Approved",
    },
    rejected: {
      style: "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
      dot: "bg-red-500",
      label: "Rejected",
    },
    suspended: {
      style: "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
      dot: "bg-red-500",
      label: "Rejected",
    },
    pending: {
      style:
        "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      dot: "bg-amber-500",
      label: "Pending Review",
    },
  };
  const cfg = map[status] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/* ─── Info field ──────────────────────────────────────────────────── */
const InfoField = ({ label, value, icon: Icon, colSpan }) => (
  <div
    className={`bg-gray-50 rounded-xl p-3.5 border border-gray-100 ${colSpan ? "md:col-span-2" : ""}`}
  >
    <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
      {Icon && <Icon size={12} />} {label}
    </p>
    <p className="text-sm font-semibold text-gray-800">{value || "N/A"}</p>
  </div>
);

/* ─── Section header ──────────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-orange-100">
    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
      <Icon className="text-[#FF7B1D] w-4 h-4" />
    </div>
    <h3 className="text-base font-bold text-gray-800">{title}</h3>
  </div>
);

const formatDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-IN");
};

/* ═══════════════════════════════════════════════════════════════════ */
const RiderManagement = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [filter, setFilter] = useState("all");
  const [imageModal, setImageModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_BASE_URL, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(
          res.status === 401
            ? "Unauthorized. Please login again."
            : result.message || "Failed to fetch riders",
        );
        return;
      }
      if (result.success) setRiders(result.data);
      else setError("Failed to fetch riders");
    } catch (err) {
      setError("Error connecting to server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiderDetails = async (riderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${riderId}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.message || "Failed to fetch rider details");
        return;
      }
      if (result.success) setSelectedRider(result.data);
    } catch (err) {
      alert("Error fetching rider details: " + err.message);
    }
  };

  const handleAction = async (riderId, action) => {
    try {
      setActionLoading(true);
      const endpoint = action === "approved" ? "approve" : "reject";
      const res = await fetch(`${API_BASE_URL}/${riderId}/${endpoint}`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.message || "Action failed");
        return;
      }
      if (result.success) {
        alert(
          `Rider ${action === "approved" ? "Approved" : "Rejected"} Successfully!`,
        );
        setSelectedRider(null);
        fetchRiders();
      }
    } catch (err) {
      alert("Error performing action: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRiders = riders.filter((r) => {
    if (filter === "all") return true;
    if (filter === "pending") return r.approvalStatus === "pending";
    if (filter === "approved") return r.approvalStatus === "approved";
    if (filter === "rejected")
      return (
        r.approvalStatus === "rejected" || r.approvalStatus === "suspended"
      );
    return true;
  });

  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
  const pagedRiders = filteredRiders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const buildPages = () => {
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
    return pages;
  };

  const stats = {
    total: riders.length,
    pending: riders.filter((r) => r.approvalStatus === "pending").length,
    approved: riders.filter((r) => r.approvalStatus === "approved").length,
    rejected: riders.filter(
      (r) =>
        r.approvalStatus === "rejected" || r.approvalStatus === "suspended",
    ).length,
  };

  const tabs = [
    { key: "all", label: "All", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "approved", label: "Approved", count: stats.approved },
    { key: "rejected", label: "Rejected", count: stats.rejected },
  ];

  /* ── Loading ── */
  if (loading)
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="animate-spin text-[#FF7B1D] w-8 h-8" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Loading riders…</p>
          </div>
        </div>
      </DashboardLayout>
    );

  /* ── Error ── */
  if (error)
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-sm w-full">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-700 font-semibold mb-1">
              Something went wrong
            </p>
            <p className="text-gray-400 text-xs mb-5">{error}</p>
            <button
              onClick={fetchRiders}
              className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */
  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate { animation: fadeSlideIn 0.25s ease forwards; }
      `}</style>

      <div className="min-h-screen p-4">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Total Applications",
              value: stats.total,
              border: "border-[#FF7B1D]",
              text: "text-[#FF7B1D]",
              iconBg: "bg-orange-50",
              icon: <User className="w-5 h-5 text-[#FF7B1D]" />,
            },
            {
              label: "Pending Review",
              value: stats.pending,
              border: "border-amber-500",
              text: "text-amber-600",
              iconBg: "bg-amber-50",
              icon: <Clock className="w-5 h-5 text-amber-500" />,
            },
            {
              label: "Approved",
              value: stats.approved,
              border: "border-emerald-500",
              text: "text-emerald-600",
              iconBg: "bg-emerald-50",
              icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
            },
            {
              label: "Rejected",
              value: stats.rejected,
              border: "border-red-500",
              text: "text-red-600",
              iconBg: "bg-red-50",
              icon: <XCircle className="w-5 h-5 text-red-500" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${s.border} px-4 py-3 flex items-center justify-between`}
            >
              <div>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${s.text}`}>
                  {s.value}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}
              >
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab Pills ── */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                filter === tab.key
                  ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  filter === tab.key
                    ? "bg-orange-50 text-[#FF7B1D]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Riders Table Card ── */}
        <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Rider Applications
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {filteredRiders.length} riders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                  {[
                    "S.N",
                    "Rider",
                    "Contact",
                    "City",
                    "Vehicle",
                    "Blood Group",
                    "Applied On",
                    "Status",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${
                        i === 0
                          ? "text-left w-12"
                          : i === 8
                            ? "text-right pr-5"
                            : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {pagedRiders.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="9" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                          <User className="w-8 h-8 text-orange-300" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">
                          No riders found
                        </p>
                        <p className="text-gray-300 text-xs">
                          Try a different filter
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {pagedRiders.map((rider, idx) => (
                    <tr
                      key={rider._id}
                      className="card-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* S.N */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </span>
                      </td>

                      {/* Rider */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                            <User size={13} className="text-orange-400" />
                          </div>
                          <span className="text-sm text-gray-800 font-semibold">
                            {rider.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone size={11} className="text-gray-400" />
                          {rider.mobileNumber}
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin size={11} className="text-gray-400" />
                          {rider.city || "N/A"}
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                          {rider.workDetails?.vehicleType || "N/A"}
                        </span>
                      </td>

                      {/* Blood Group */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                          {rider.bloodGroup || "N/A"}
                        </span>
                      </td>

                      {/* Applied On */}
                      <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(rider.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={rider.approvalStatus} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => fetchRiderDetails(rider._id)}
                            style={{
                              width: 30,
                              height: 30,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 8,
                              transition: "all 0.18s ease",
                            }}
                            className="bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                            title="View details"
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
        {filteredRiders.length > itemsPerPage && (
          <div className="flex items-center justify-between px-1 mt-5 mb-6">
            <p className="text-xs text-gray-400 font-medium">
              Page{" "}
              <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
              of{" "}
              <span className="text-gray-600 font-semibold">{totalPages}</span>
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
                {buildPages().map((page, idx) =>
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
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          Rider Detail Modal
      ══════════════════════════════════════════════════════════════ */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-gray-100">
            {/* Modal header */}
            <div className="sticky top-0 z-10 p-5 flex items-center justify-between bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Rider Application Details
                </h2>
                <p className="text-xs text-orange-100 mt-0.5">
                  Complete verification and review
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedRider.approvalStatus} />
                <button
                  onClick={() => setSelectedRider(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors text-lg"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-7">
              {/* ── Personal Information ── */}
              <div>
                <SectionHeader icon={User} title="Personal Information" />
                <div className="grid md:grid-cols-2 gap-3">
                  <InfoField label="Full Name" value={selectedRider.fullName} />
                  <InfoField
                    label="Date of Birth (Age)"
                    value={`${formatDate(selectedRider.dateOfBirth)} (${selectedRider.age} yrs)`}
                  />
                  <InfoField
                    label="Blood Group"
                    value={selectedRider.bloodGroup}
                  />
                  <InfoField
                    label="Mobile Number"
                    value={
                      <span>
                        {selectedRider.mobileNumber}
                        {selectedRider.mobileNumberVerified && (
                          <span className="ml-2 text-emerald-600 text-[10px] font-bold">
                            ✓ Verified
                          </span>
                        )}
                      </span>
                    }
                    icon={Phone}
                  />
                  <InfoField
                    label="WhatsApp Number"
                    value={selectedRider.whatsappNumber}
                    icon={Phone}
                  />
                  <InfoField
                    label="Father's Name"
                    value={selectedRider.fathersName}
                  />
                  <InfoField
                    label="Mother's Name"
                    value={selectedRider.mothersName}
                  />
                  <InfoField
                    label="Emergency Contact"
                    value={`${selectedRider.emergencyContactPerson?.name || "N/A"} (${selectedRider.emergencyContactPerson?.relation || "N/A"}) — ${selectedRider.emergencyContactPerson?.contactNumber || "N/A"}`}
                  />
                  <InfoField
                    label="Languages"
                    value={selectedRider.language?.join(", ")}
                  />
                  <InfoField
                    icon={MapPin}
                    label="Current Address"
                    colSpan
                    value={`${selectedRider.currentAddress?.line1 || ""}, ${selectedRider.currentAddress?.line2 || ""}, ${selectedRider.currentAddress?.city || ""}, ${selectedRider.currentAddress?.state || ""} - ${selectedRider.currentAddress?.pinCode || ""}`}
                  />
                </div>
              </div>

              {/* ── Identity Documents ── */}
              <div>
                <SectionHeader icon={FileText} title="Identity Documents" />
                <div className="mb-3">
                  <InfoField
                    label="Aadhaar Number"
                    value={selectedRider.documents?.aadharCard?.aadharId}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Profile Photo",
                      icon: User,
                      url: selectedRider.documents?.profile?.url,
                    },
                    {
                      label: "Aadhaar Card",
                      icon: Shield,
                      url: selectedRider.documents?.aadharCard?.photo?.url,
                    },
                    {
                      label: "PAN Card (Front)",
                      icon: CreditCard,
                      url: selectedRider.documents?.panCard?.front?.url,
                    },
                    {
                      label: "PAN Card (Back)",
                      icon: CreditCard,
                      url: selectedRider.documents?.panCard?.back?.url,
                    },
                    {
                      label: "Driving License (Front)",
                      icon: FileText,
                      url: selectedRider.documents?.drivingLicense?.front?.url,
                    },
                    {
                      label: "Driving License (Back)",
                      icon: FileText,
                      url: selectedRider.documents?.drivingLicense?.back?.url,
                    },
                  ]
                    .filter((d) => d.url)
                    .map(({ label, icon: Icon, url }) => (
                      <div
                        key={label}
                        className="bg-gray-50 border border-gray-100 rounded-xl p-3 hover:border-orange-200 hover:bg-orange-50/30 transition-colors"
                      >
                        <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1.5">
                          <Icon size={12} className="text-orange-400" /> {label}
                        </p>
                        <img
                          src={url}
                          alt={label}
                          className="w-full h-44 object-cover rounded-xl cursor-pointer hover:opacity-80 transition shadow-sm"
                          onClick={() => setImageModal(url)}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* ── Bank Details ── */}
              <div>
                <SectionHeader icon={CreditCard} title="Bank Account Details" />
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <InfoField
                    label="Account Holder Name"
                    value={
                      selectedRider.documents?.bankDetails?.accountHolderName
                    }
                  />
                  <InfoField
                    label="Account Number"
                    value={selectedRider.documents?.bankDetails?.accountNumber}
                  />
                  <InfoField
                    label="IFSC Code"
                    value={selectedRider.documents?.bankDetails?.ifsc}
                  />
                  <InfoField
                    label="Bank Name"
                    value={selectedRider.documents?.bankDetails?.bankName}
                  />
                  <InfoField
                    label="Branch Name"
                    value={selectedRider.documents?.bankDetails?.branchName}
                    colSpan
                  />
                </div>
                {selectedRider.documents?.bankDetails?.cancelCheque?.url && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 hover:border-orange-200 transition-colors">
                    <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1.5">
                      <FileText size={12} className="text-orange-400" />{" "}
                      Cancelled Cheque
                    </p>
                    <img
                      src={selectedRider.documents.bankDetails.cancelCheque.url}
                      alt="Cancelled Cheque"
                      className="w-full h-44 object-cover rounded-xl cursor-pointer hover:opacity-80 transition shadow-sm"
                      onClick={() =>
                        setImageModal(
                          selectedRider.documents.bankDetails.cancelCheque.url,
                        )
                      }
                    />
                  </div>
                )}
              </div>

              {/* ── Work Details ── */}
              <div>
                <SectionHeader icon={Car} title="Work Details" />
                <div className="grid md:grid-cols-3 gap-3">
                  <InfoField
                    label="Vehicle Type"
                    value={selectedRider.workDetails?.vehicleType}
                    icon={Car}
                  />
                  <InfoField
                    label="Experience"
                    value={selectedRider.workDetails?.experience}
                  />
                  <InfoField
                    label="Preferred Shift"
                    value={selectedRider.workDetails?.shift}
                    icon={Clock}
                  />
                </div>
              </div>

              {/* ── Action / Status ── */}
              {selectedRider.approvalStatus === "pending" ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-5 border-t border-gray-100">
                  <button
                    onClick={() => handleAction(selectedRider._id, "rejected")}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleAction(selectedRider._id, "approved")}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#FF7B1D] hover:bg-orange-500 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve Application
                  </button>
                </div>
              ) : (
                <div className="pt-5 border-t border-gray-100">
                  <div
                    className={`rounded-xl p-4 text-center text-sm font-semibold ${
                      selectedRider.approvalStatus === "approved"
                        ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                        : "bg-red-50 border border-red-100 text-red-700"
                    }`}
                  >
                    Application{" "}
                    {selectedRider.approvalStatus === "approved"
                      ? "Approved"
                      : "Rejected"}
                    {selectedRider.approvedAt && (
                      <span className="ml-1">
                        on {formatDate(selectedRider.approvedAt)}
                      </span>
                    )}
                    {selectedRider.approvedBy && (
                      <div className="text-xs mt-1 opacity-75">
                        By: {selectedRider.approvedBy.name}
                      </div>
                    )}
                  </div>
                  {selectedRider.rejectionReason && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-4">
                      <p className="text-xs text-red-600 font-semibold mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-800">
                        {selectedRider.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedRider(null)}
                className="px-5 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image Modal ── */}
      {imageModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={imageModal}
              alt="Document"
              className="max-w-full max-h-[85vh] object-contain mx-auto rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setImageModal(null)}
              className="absolute -top-3 -right-3 bg-white text-gray-700 rounded-full w-9 h-9 flex items-center justify-center text-xl hover:bg-[#FF7B1D] hover:text-white transition shadow-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RiderManagement;
