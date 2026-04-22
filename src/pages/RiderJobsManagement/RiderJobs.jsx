import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  X,
  Eye,
  Briefcase,
  ChevronLeft,
  ChevronRight,
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
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

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

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => console.error("Failed to load Leaflet JS");
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen && showMap && mapLoaded && window.L) {
      const timer = setTimeout(() => initializeMap(), 200);
      return () => {
        clearTimeout(timer);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        markerInstanceRef.current = null;
      };
    }
  }, [
    isModalOpen,
    showMap,
    mapLoaded,
    formData.locationLatitude,
    formData.locationLongitude,
  ]);

  const initializeMap = () => {
    const mapContainer = document.getElementById("rider-map-container");
    if (!mapContainer || !window.L) return;

    if (mapInstanceRef.current) {
      if (
        formData.locationLatitude &&
        formData.locationLongitude &&
        markerInstanceRef.current
      ) {
        const newPos = [
          parseFloat(formData.locationLatitude),
          parseFloat(formData.locationLongitude),
        ];
        markerInstanceRef.current.setLatLng(newPos);
        mapInstanceRef.current.setView(
          newPos,
          mapInstanceRef.current.getZoom(),
        );
      }
      return;
    }

    const center =
      formData.locationLatitude && formData.locationLongitude
        ? [
            parseFloat(formData.locationLatitude),
            parseFloat(formData.locationLongitude),
          ]
        : [23.2599, 77.4126];

    const map = window.L.map(mapContainer, {
      center,
      zoom: 15,
      zoomControl: true,
    });
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    mapInstanceRef.current = map;
    let marker = null;

    if (formData.locationLatitude && formData.locationLongitude) {
      marker = window.L.marker(
        [
          parseFloat(formData.locationLatitude),
          parseFloat(formData.locationLongitude),
        ],
        { draggable: true },
      ).addTo(map);
      marker.on("dragend", (e) =>
        updateLocationFromCoords(
          e.target.getLatLng().lat,
          e.target.getLatLng().lng,
        ),
      );
      markerInstanceRef.current = marker;
    }

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      updateLocationFromCoords(lat, lng);
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = window.L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on("dragend", (ev) =>
          updateLocationFromCoords(
            ev.target.getLatLng().lat,
            ev.target.getLatLng().lng,
          ),
        );
        markerInstanceRef.current = marker;
      }
    });

    const searchInput = document.getElementById("rider-map-search-input");
    if (searchInput) {
      searchInput.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const query = searchInput.value;
          if (query) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
              );
              const data = await response.json();
              if (data && data.length > 0) {
                const place = data[0];
                const lat = parseFloat(place.lat);
                const lng = parseFloat(place.lon);
                updateLocationFromCoords(lat, lng);
                map.setView([lat, lng], 15);
                if (marker) {
                  marker.setLatLng([lat, lng]);
                } else {
                  marker = window.L.marker([lat, lng], {
                    draggable: true,
                  }).addTo(map);
                  marker.on("dragend", (ev) =>
                    updateLocationFromCoords(
                      ev.target.getLatLng().lat,
                      ev.target.getLatLng().lng,
                    ),
                  );
                  markerInstanceRef.current = marker;
                }
              } else {
                alert("No results found for your search.");
              }
            } catch (error) {
              console.error("Error searching location:", error);
              alert("Error searching location. Please try again.");
            }
          }
        }
      });
    }
  };

  const updateLocationFromCoords = async (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      locationLatitude: lat.toFixed(6),
      locationLongitude: lng.toFixed(6),
    }));
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      if (data && data.address) {
        const address = data.address;
        setFormData((prev) => ({
          ...prev,
          locationLine1:
            address.road ||
            address.building ||
            address.house_number ||
            prev.locationLine1,
          locationCity:
            address.city ||
            address.town ||
            address.village ||
            prev.locationCity,
          locationState: address.state || prev.locationState,
          locationPinCode: address.postcode || prev.locationPinCode,
        }));
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const fetchJobs = async (city = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/vendor/my-job-posts`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (result.success) {
        let jobsData = result.data || [];
        if (city && city.trim()) {
          const cityLower = city.toLowerCase().trim();
          jobsData = jobsData.filter((job) =>
            job.location?.city?.toLowerCase().includes(cityLower),
          );
        }
        setJobs(jobsData);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setShowMap(false);
  };

  const handleCreate = () => {
    resetForm();
    setIsEdit(false);
    setCurrentJob(null);
    setIsModalOpen(true);
  };

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

  const handleViewApplications = (jobId) =>
    navigate(`/rider-job-applications/${jobId}`);

  const handleSubmit = async () => {
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
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert(
          result.message ||
            `Job ${isEdit ? "updated" : "created"} successfully`,
        );
        setIsModalOpen(false);
        setShowMap(false);
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

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?"))
      return;
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(searchCity);
  };

  const getFilteredJobs = () => {
    let filtered = jobs;
    if (activeTab === "active") filtered = filtered.filter((j) => j.isActive);
    else if (activeTab === "inactive")
      filtered = filtered.filter((j) => !j.isActive);

    if (!searchCity.trim()) return filtered;
    const searchLower = searchCity.toLowerCase().trim();
    return filtered.filter((job) =>
      [
        job.jobTitle,
        job.location?.city,
        job.location?.state,
        job.vendor?.storeName,
        job.postedBy?.vendorName,
        job.postedBy?.name,
        job.location?.line1,
        job.location?.line2,
        job.location?.pinCode?.toString(),
      ]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(searchLower)),
    );
  };

  const filteredJobs = getFilteredJobs();
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // ── Status Badge (matching AllProduct style)
  const StatusBadge = ({ isActive }) => {
    const styles = isActive
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100"
      : "bg-gray-50 text-gray-500 border border-gray-200 ring-1 ring-gray-100";
    const dotColor = isActive ? "bg-emerald-500" : "bg-gray-400";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  // ── Table Skeleton (matching AllProduct)
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${j === 8 ? "w-16 ml-auto" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // ── Empty State (matching AllProduct)
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
              {searchCity
                ? "Try adjusting your search query"
                : "Create your first job post!"}
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
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
        {/* LEFT: Tab pills + Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Pills */}
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

        {/* RIGHT: Search + Create */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search by Title, City, Vendor, Address..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchCity}
              onChange={(e) => {
                setSearchCity(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors"
            >
              Search
            </button>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap h-[38px]"
          >
            <Plus size={15} />
            Create
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
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
              found
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                {[
                  "S.N",
                  "Job Title",
                  "Vendor",
                  "City",
                  "Joining Bonus",
                  "Onboarding Fee",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3.5 text-xs font-bold text-white tracking-wider uppercase opacity-90 ${i === 7 ? "text-right pr-5" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : currentJobs.length === 0 ? (
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
                      <span
                        className={`text-sm font-medium ${!job.vendor?.storeName ? "text-gray-300 italic text-xs" : "text-gray-700"}`}
                      >
                        {job.vendor?.storeName || "—"}
                      </span>
                    </td>

                    {/* City */}
                    <td className="px-4 py-3.5">
                      {job.location?.city ? (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                          <MapPin className="w-3 h-3" />
                          {job.location.city}
                          {job.location.state ? `, ${job.location.state}` : ""}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs italic">—</span>
                      )}
                    </td>

                    {/* Joining Bonus */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-gray-800">
                        ₹{job.joiningBonus?.toLocaleString() || "0"}
                      </span>
                    </td>

                    {/* Onboarding Fee */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-gray-800">
                        ₹{job.onboardingFee?.toLocaleString() || "0"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge isActive={job.isActive} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewApplications(job._id)}
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View Applications"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
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

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isEdit ? "Edit Job Post" : "Create Job Post"}
                </h2>
                <p className="text-xs text-orange-100 mt-0.5">
                  {isEdit
                    ? "Update the job post details below"
                    : "Fill in the details to create a new job post"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setShowMap(false);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="p-6 space-y-5 text-sm"
            >
              {/* Job Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-1.5 h-5 rounded-full bg-[#FF7B1D]" />
                  <h3 className="font-bold text-gray-800 text-sm">
                    Job Details
                  </h3>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                      Joining Bonus (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="joiningBonus"
                      value={formData.joiningBonus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                      Onboarding Fee (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="onboardingFee"
                      value={formData.onboardingFee}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Location Details Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 rounded-full bg-blue-500" />
                    <h3 className="font-bold text-gray-800 text-sm">
                      Location Details
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF7B1D] border border-orange-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <MapPin size={12} />
                    {showMap ? "Hide Map" : "Pick on Map"}
                  </button>
                </div>

                {showMap && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-gray-50 border-b border-gray-200">
                      <input
                        type="text"
                        id="rider-map-search-input"
                        placeholder="Search for a location and press Enter..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm"
                      />
                    </div>
                    <div
                      id="rider-map-container"
                      style={{ height: "360px", width: "100%" }}
                      className="bg-gray-100"
                    />
                    <div className="p-2.5 bg-gray-50 text-xs text-gray-400 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#FF7B1D]" />
                      Click on the map or drag the marker to select a location
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="locationLine1"
                    value={formData.locationLine1}
                    onChange={handleInputChange}
                    placeholder="House No. 21, MG Road"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="locationLine2"
                    value={formData.locationLine2}
                    onChange={handleInputChange}
                    placeholder="Near City Mall"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="locationCity"
                      value={formData.locationCity}
                      onChange={handleInputChange}
                      placeholder="Bhopal"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="locationState"
                      value={formData.locationState}
                      onChange={handleInputChange}
                      placeholder="Madhya Pradesh"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="locationPinCode"
                    value={formData.locationPinCode}
                    onChange={handleInputChange}
                    placeholder="462001"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="locationLatitude"
                      value={formData.locationLatitude}
                      onChange={handleInputChange}
                      placeholder="23.2599"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="locationLongitude"
                      value={formData.locationLongitude}
                      onChange={handleInputChange}
                      placeholder="77.4126"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowMap(false);
                  }}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-green-200"
                >
                  {isEdit ? "Update Job Post" : "Create Job Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RiderJobManagement;
