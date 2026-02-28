import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  DollarSign,
  Briefcase,
  X,
  Search,
  Eye,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

  // Form state
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

  // Get token from localStorage
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Load Leaflet CSS
  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  // Load Leaflet JS
  useEffect(() => {
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Leaflet JS");
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize map when modal opens and map is loaded
  useEffect(() => {
    if (isModalOpen && showMap && mapLoaded && window.L) {
      const timer = setTimeout(() => {
        initializeMap();
      }, 200);
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
    if (!mapContainer || !window.L) {
      return;
    }

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
        : [23.2599, 77.4126]; // Default: Bhopal

    const map = window.L.map(mapContainer, {
      center: center,
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
        {
          draggable: true,
        },
      ).addTo(map);

      marker.on("dragend", (e) => {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        updateLocationFromCoords(lat, lng);
      });

      markerInstanceRef.current = marker;
    }

    map.on("click", (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      updateLocationFromCoords(lat, lng);

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = window.L.marker([lat, lng], {
          draggable: true,
        }).addTo(map);

        marker.on("dragend", (e) => {
          const newLat = e.target.getLatLng().lat;
          const newLng = e.target.getLatLng().lng;
          updateLocationFromCoords(newLat, newLng);
        });

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
                  marker.on("dragend", (ev) => {
                    const newLat = ev.target.getLatLng().lat;
                    const newLng = ev.target.getLatLng().lng;
                    updateLocationFromCoords(newLat, newLng);
                  });
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

  // Fetch all jobs
  const fetchJobs = async (city = "") => {
    console.log("========================================");
    console.log("fetchJobs called");
    console.log("City filter:", city || "No filter");
    console.log("========================================");
    setLoading(true);
    try {
      // Use vendor-specific endpoint to get vendor's job posts
      const url = `${API_BASE_URL}/vendor/my-job-posts`;

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = getAuthHeaders();

      console.log("========================================");
      console.log("API REQUEST DETAILS:");
      console.log("URL:", url);
      console.log("Method: GET");
      console.log("Token available:", !!token);
      console.log("Token length:", token ? token.length : 0);
      console.log("Headers:", headers);
      console.log("========================================");

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      console.log("========================================");
      console.log("RESPONSE RECEIVED:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("OK:", response.ok);
      console.log("Content-Type:", response.headers.get("content-type"));
      console.log("========================================");

      const result = await response.json();
      console.log("========================================");
      console.log("PARSED JSON RESPONSE:");
      console.log("Full response:", result);
      console.log("Response type:", typeof result);
      console.log("Response keys:", Object.keys(result));
      console.log("========================================");
      console.log("Response success:", result.success);
      console.log("Response count:", result.count);
      console.log("Response pagination:", result.pagination);
      console.log("========================================");
      console.log("Response data:", result.data);
      console.log(
        "Data type:",
        Array.isArray(result.data) ? "Array" : typeof result.data,
      );
      console.log(
        "Data length:",
        Array.isArray(result.data) ? result.data.length : "Not an array",
      );
      console.log("========================================");

      if (Array.isArray(result.data)) {
        console.log("ITERATING THROUGH JOBS:");
        result.data.forEach((job, index) => {
          console.log(`\n--- Job ${index + 1} ---`);
          console.log("_id:", job._id);
          console.log("jobTitle:", job.jobTitle);
          console.log("joiningBonus:", job.joiningBonus);
          console.log("onboardingFee:", job.onboardingFee);
          console.log("isActive:", job.isActive);
          console.log("postedByType:", job.postedByType);
          console.log("location:", job.location);
          console.log("vendor:", job.vendor);
          console.log("postedBy:", job.postedBy);
          console.log("createdAt:", job.createdAt);
          console.log("updatedAt:", job.updatedAt);
          console.log("Full job object:", JSON.stringify(job, null, 2));
        });
      }

      if (result.success) {
        let jobsData = result.data || [];
        console.log("========================================");
        console.log("BEFORE FILTERING:");
        console.log("Jobs count:", jobsData.length);
        console.log("========================================");

        // If city filter is provided, filter by city
        if (city && city.trim()) {
          const cityLower = city.toLowerCase().trim();
          console.log("Applying city filter:", cityLower);
          const beforeFilter = jobsData.length;
          jobsData = jobsData.filter((job) => {
            const jobCity = job.location?.city?.toLowerCase() || "";
            const matches = jobCity.includes(cityLower);
            console.log(
              `Job ${job._id} - City: "${jobCity}" - Matches: ${matches}`,
            );
            return matches;
          });
          console.log("AFTER FILTERING:");
          console.log("Before filter count:", beforeFilter);
          console.log("After filter count:", jobsData.length);
          console.log("Filtered jobs:", jobsData);
        }

        console.log("========================================");
        console.log("SETTING JOBS TO STATE:");
        console.log("Final jobs array:", jobsData);
        console.log("Final count:", jobsData.length);
        console.log("First job:", jobsData[0]);
        console.log("========================================");
        setJobs(jobsData);
        console.log("Jobs state updated successfully");
      } else {
        console.error("========================================");
        console.error("API RETURNED SUCCESS: FALSE");
        console.error("Error message:", result.message);
        console.error("Error:", result.error);
        console.error("Full error response:", result);
        console.error("========================================");
        alert(result.message || "Failed to fetch jobs");
        setJobs([]);
      }
    } catch (error) {
      console.error("========================================");
      console.error("EXCEPTION CAUGHT:");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Full error:", error);
      console.error("========================================");
      alert("Failed to fetch jobs");
      setJobs([]);
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
      console.log("========================================");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
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

  // Open modal for create
  const handleCreate = () => {
    resetForm();
    setIsEdit(false);
    setCurrentJob(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
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

  // Navigate to view applications
  const handleViewApplications = (jobId) => {
    navigate(`/rider-job-applications/${jobId}`);
  };

  // Submit form (Create or Update)
  const handleSubmit = async () => {
    // Validation
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
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
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

  // Delete job
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) {
      return;
    }

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

  // Handle search - now supports multiple fields
  const handleSearch = () => {
    setCurrentPage(1);
    // If search is empty, fetch all jobs
    if (!searchCity.trim()) {
      fetchJobs("");
    } else {
      // For now, still use city filter, but we'll add client-side filtering below
      fetchJobs(searchCity);
    }
  };

  // Client-side filtering for better search experience
  const getFilteredJobs = () => {
    if (!searchCity.trim()) {
      return jobs;
    }

    const searchLower = searchCity.toLowerCase().trim();
    return jobs.filter((job) => {
      // Search in job title
      const jobTitle = job.jobTitle?.toLowerCase() || "";
      // Search in city
      const city = job.location?.city?.toLowerCase() || "";
      // Search in state
      const state = job.location?.state?.toLowerCase() || "";
      // Search in vendor name
      const vendorName = job.vendor?.storeName?.toLowerCase() || "";
      // Search in posted by name
      const postedByName =
        job.postedBy?.vendorName?.toLowerCase() ||
        job.postedBy?.name?.toLowerCase() ||
        "";
      // Search in address
      const addressLine1 = job.location?.line1?.toLowerCase() || "";
      const addressLine2 = job.location?.line2?.toLowerCase() || "";
      // Search in pin code
      const pinCode = job.location?.pinCode?.toString() || "";

      return (
        jobTitle.includes(searchLower) ||
        city.includes(searchLower) ||
        state.includes(searchLower) ||
        vendorName.includes(searchLower) ||
        postedByName.includes(searchLower) ||
        addressLine1.includes(searchLower) ||
        addressLine2.includes(searchLower) ||
        pinCode.includes(searchLower)
      );
    });
  };

  // Get filtered jobs
  const filteredJobs = getFilteredJobs();

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 ml-6">
        <div className="max-w-7xl mx-auto px-0 py-6">
          {/* Header Section */}
          <div className="bg-white rounded-sm shadow-md border-2 border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Rider Job Management
                </h1>
                <p className="text-gray-600">
                  Manage and monitor delivery executive job postings
                </p>
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl font-bold"
              >
                <Plus size={20} />
                Create Job Post
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-6 max-w-2xl">
              <div className="flex items-center gap-0 bg-white rounded-xl shadow-md border-2 border-gray-200 focus-within:ring-2 focus-within:ring-[#FF7B1D] focus-within:border-[#FF7B1D] transition-all">
                <div className="pl-5">
                  <Search className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search by Job Title, City, Vendor, Address..."
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
                  className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 rounded-xl focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="mr-2 bg-[#FF7B1D] hover:bg-orange-600 active:scale-95 text-white p-3 rounded-lg shadow transition duration-200 flex items-center justify-center"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-sm h-12 w-12 border-b-2 border-[#FF7B1D] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading job posts...</p>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-sm shadow-md border-2 border-gray-100 p-16 text-center">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchCity
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first job post"}
              </p>
              {!searchCity && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl font-bold"
                >
                  <Plus size={20} />
                  Create Job Post
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {currentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-sm shadow-md border-2 border-gray-100 p-6 hover:shadow-xl hover:border-[#FF7B1D] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start gap-5">
                          <div className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 p-4 rounded-xl shadow-lg flex-shrink-0">
                            <Briefcase className="text-white" size={28} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-bold text-gray-900">
                                {job.jobTitle}
                              </h3>
                              <span
                                className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                  job.isActive
                                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                                    : "bg-gray-100 text-gray-600 border-2 border-gray-300"
                                }`}
                              >
                                {job.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg w-fit">
                              <span className="text-sm font-semibold text-gray-700">
                                {job.vendor?.storeName}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                              Posted by:{" "}
                              <span className="font-semibold text-gray-800">
                                {job.postedBy?.vendorName || job.postedBy?.name}
                              </span>{" "}
                              ({job.postedByType})
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                                <div className="bg-green-500 p-2 rounded-lg">
                                  <DollarSign
                                    className="text-white"
                                    size={18}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Joining Bonus
                                  </p>
                                  <p className="text-lg font-bold text-gray-900">
                                    ₹
                                    {job.joiningBonus?.toLocaleString() ||
                                      job.joiningBonus}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                                <div className="bg-blue-500 p-2 rounded-lg">
                                  <DollarSign
                                    className="text-white"
                                    size={18}
                                  />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Onboarding Fee
                                  </p>
                                  <p className="text-lg font-bold text-gray-900">
                                    ₹
                                    {job.onboardingFee?.toLocaleString() ||
                                      job.onboardingFee}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                              <MapPin
                                className="text-[#FF7B1D] flex-shrink-0 mt-1"
                                size={20}
                              />
                              <div className="text-sm text-gray-700">
                                <p className="font-semibold mb-1">
                                  {job.location?.line1}
                                </p>
                                {job.location?.line2 && (
                                  <p className="mb-1">{job.location.line2}</p>
                                )}
                                <p className="font-medium">
                                  {job.location?.city}, {job.location?.state} -{" "}
                                  {job.location?.pinCode}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleViewApplications(job._id)}
                          className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all border-2 border-green-200 hover:border-green-400 hover:shadow-md"
                          title="View Applications"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border-2 border-blue-200 hover:border-blue-400 hover:shadow-md"
                          title="Edit"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all border-2 border-red-200 hover:border-red-400 hover:shadow-md"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 bg-white rounded-xl shadow-md border-2 border-gray-100 p-5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-2.5 bg-[#FF7B1D] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-bold disabled:hover:shadow-lg"
                  >
                    Previous
                  </button>
                  <span className="px-6 py-2.5 text-gray-700 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-6 py-2.5 bg-[#FF7B1D] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-bold disabled:hover:shadow-lg"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-gray-200">
              <div className="sticky top-0 bg-gradient-to-r from-[#FF7B1D] to-orange-600 px-6 py-5 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-white">
                  {isEdit ? "Edit Job Post" : "Create Job Post"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowMap(false);
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="p-6 space-y-6"
              >
                {/* Job Details Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-200">
                    <div className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 p-2 rounded-lg">
                      <Briefcase size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Job Details
                    </h3>
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                    />
                  </div>

                  {/* Joining Bonus & Onboarding Fee */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Joining Bonus (₹){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="joiningBonus"
                        value={formData.joiningBonus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Onboarding Fee (₹){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="onboardingFee"
                        value={formData.onboardingFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Details Section */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 p-2 rounded-lg">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Location Details
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF7B1D] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg text-sm font-semibold"
                    >
                      <MapPin size={16} />
                      {showMap ? "Hide Map" : "Show Map"}
                    </button>
                  </div>

                  {showMap && (
                    <div className="mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b border-gray-300">
                        <input
                          type="text"
                          id="rider-map-search-input"
                          placeholder="Search for a location..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div
                        id="rider-map-container"
                        style={{ height: "400px", width: "100%" }}
                        className="bg-gray-100"
                      ></div>
                      <div className="p-3 bg-gray-50 text-xs text-gray-600">
                        💡 Click on the map to select location or drag the
                        marker to adjust
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="locationLine1"
                        value={formData.locationLine1}
                        onChange={handleInputChange}
                        placeholder="House No. 21, MG Road"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="locationLine2"
                        value={formData.locationLine2}
                        onChange={handleInputChange}
                        placeholder="Near City Mall"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="locationCity"
                          value={formData.locationCity}
                          onChange={handleInputChange}
                          placeholder="Bhopal"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="locationState"
                          value={formData.locationState}
                          onChange={handleInputChange}
                          placeholder="Madhya Pradesh"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pin Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="locationPinCode"
                        value={formData.locationPinCode}
                        onChange={handleInputChange}
                        placeholder="462001"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="locationLatitude"
                          value={formData.locationLatitude}
                          onChange={handleInputChange}
                          placeholder="23.2599"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="locationLongitude"
                          value={formData.locationLongitude}
                          onChange={handleInputChange}
                          placeholder="77.4126"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setShowMap(false);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF7B1D] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-bold"
                  >
                    {isEdit ? "Update Job Post" : "Create Job Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RiderJobManagement;
