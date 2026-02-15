import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

const RiderJobPostManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState("");
  const [useOpenStreetMap, setUseOpenStreetMap] = useState(true); // Use OpenStreetMap by default (no API key needed)
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

  const API_BASE_URL = `${BASE_URL}/api`;

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    joiningBonus: "",
    onboardingFee: "",
    vendorId: "",
    line1: "",
    line2: "",
    pinCode: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  // Fetch all job posts - memoized with useCallback
  const fetchJobs = useCallback(async () => {
    console.log("fetchJobs called");
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("Fetching jobs from:", `${API_BASE_URL}/rider-job-post`);
      console.log("Token available:", !!token);

      // Use the correct endpoint
      const response = await fetch(`${API_BASE_URL}/rider-job-post`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const data = await response.json();
      console.log("API Response:", data);
      console.log("Response success:", data.success);
      console.log("Response data:", data.data);
      console.log("Response count:", data.count);
      console.log("Response pagination:", data.pagination);

      if (data.success) {
        // Handle the response structure: {success, count, pagination, data}
        const jobsData = data.data || [];
        console.log("Setting jobs:", jobsData);
        console.log("Jobs count:", jobsData.length);
        setJobs(jobsData);
      } else {
        console.error("API returned success: false");
        console.error("Error message:", data.message || data.error);
        showNotification(
          data.message || data.error || "Failed to fetch jobs",
          "error",
        );
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      showNotification("Failed to fetch jobs", "error");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }, []);

  // Fetch individual job details
  const fetchJobDetails = async (jobId) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/rider-job-post/${jobId}`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setSelectedJob(data.data);
      }
    } catch (error) {
      showNotification("Failed to fetch job details", "error");
    }
  };

  // Create job post (admin)
  const createJobPost = async (jobData) => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/rider-job-post/admin/create`,
        {
          method: "POST",
          headers: headers,
          credentials: "include",
          body: JSON.stringify(jobData),
        },
      );
      const data = await response.json();
      if (data.success) {
        showNotification("Job post created successfully!", "success");
        setIsCreateModalOpen(false);
        fetchJobs();
        resetForm();
      } else {
        showNotification(data.message || "Failed to create job post", "error");
      }
    } catch (error) {
      showNotification("Failed to create job post", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update job post
  const updateJobPost = async (jobId, jobData) => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/rider-job-post/admin/${jobId}`,
        {
          method: "PUT",
          headers: headers,
          credentials: "include",
          body: JSON.stringify(jobData),
        },
      );
      const data = await response.json();
      if (data.success) {
        showNotification("Job post updated successfully!", "success");
        setIsEditModalOpen(false);
        fetchJobs();
        resetForm();
      } else {
        showNotification(
          data.message || data.error || "Failed to update job post",
          "error",
        );
      }
    } catch (error) {
      showNotification("Failed to update job post", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete job post
  const deleteJobPost = async (jobId) => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/rider-job-post/admin/${jobId}`,
        {
          method: "DELETE",
          headers: headers,
          credentials: "include",
        },
      );
      const data = await response.json();
      if (data.success) {
        showNotification("Job post deleted successfully!", "success");
        setIsDeleteModalOpen(false);
        setSelectedJob(null);
        fetchJobs();
      } else {
        showNotification(
          data.message || data.error || "Failed to delete job post",
          "error",
        );
      }
    } catch (error) {
      showNotification("Failed to delete job post", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = useCallback((message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  }, []);

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      joiningBonus: "",
      onboardingFee: "",
      vendorId: "",
      line1: "",
      line2: "",
      pinCode: "",
      city: "",
      state: "",
      latitude: "",
      longitude: "",
    });
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setFormData({
      jobTitle: job.jobTitle,
      joiningBonus: job.joiningBonus,
      onboardingFee: job.onboardingFee,
      vendorId: job.vendor._id,
      line1: job.location.line1,
      line2: job.location.line2,
      pinCode: job.location.pinCode,
      city: job.location.city,
      state: job.location.state,
      latitude: job.location.latitude,
      longitude: job.location.longitude,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditModalOpen && selectedJob) {
      // For update, use the format expected by the admin update endpoint
      const jobData = {
        jobTitle: formData.jobTitle,
        joiningBonus: Number(formData.joiningBonus),
        onboardingFee: Number(formData.onboardingFee),
        vendor: formData.vendorId, // Admin can change vendor
        locationLine1: formData.line1,
        locationLine2: formData.line2 || "",
        locationPinCode: formData.pinCode,
        locationCity: formData.city,
        locationState: formData.state,
        locationLatitude: formData.latitude
          ? Number(formData.latitude)
          : undefined,
        locationLongitude: formData.longitude
          ? Number(formData.longitude)
          : undefined,
      };
      updateJobPost(selectedJob._id, jobData);
    } else {
      // For create, use the format expected by the admin/create endpoint
      const jobData = {
        jobTitle: formData.jobTitle,
        joiningBonus: Number(formData.joiningBonus),
        onboardingFee: Number(formData.onboardingFee),
        vendor: formData.vendorId,
        locationLine1: formData.line1,
        locationLine2: formData.line2 || "",
        locationPinCode: formData.pinCode,
        locationCity: formData.city,
        locationState: formData.state,
        locationLatitude: formData.latitude
          ? Number(formData.latitude)
          : undefined,
        locationLongitude: formData.longitude
          ? Number(formData.longitude)
          : undefined,
      };
      createJobPost(jobData);
    }
  };

  // Fetch all vendors for dropdown
  const fetchVendors = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Fetch all vendors (with high limit to get all) - using admin endpoint
      const response = await fetch(`${API_BASE_URL}/admin/vendors?limit=1000`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setVendors(data.data || []);
      } else {
        console.error("Failed to fetch vendors:", data.message || data.error);
      }
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchVendors();
  }, [fetchJobs, fetchVendors]);

  // Load map (OpenStreetMap - no API key needed)
  useEffect(() => {
    if (useOpenStreetMap) {
      // Load Leaflet CSS and JS for OpenStreetMap
      const loadLeaflet = () => {
        // Check if already loaded
        if (window.L && document.querySelector('link[href*="leaflet"]')) {
          setMapLoaded(true);
          return;
        }

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          link.crossOrigin = "";
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
          script.crossOrigin = "";
          script.onload = () => {
            setMapLoaded(true);
            setMapError("");
          };
          script.onerror = () => {
            setMapError("Failed to load map library. Please check your internet connection.");
          };
          document.head.appendChild(script);
        } else {
          setMapLoaded(true);
        }
      };

      loadLeaflet();
    }
  }, [useOpenStreetMap]);

  // Initialize map when modal opens and map is loaded
  useEffect(() => {
    if ((isCreateModalOpen || isEditModalOpen) && showMap && mapLoaded) {
      const timer = setTimeout(() => {
        if (useOpenStreetMap && window.L) {
          initializeOpenStreetMap();
        }
      }, 200);
      return () => {
        clearTimeout(timer);
        // Clean up map instance when modal closes
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        if (markerInstanceRef.current) {
          markerInstanceRef.current = null;
        }
      };
    }
  }, [isCreateModalOpen, isEditModalOpen, showMap, mapLoaded, useOpenStreetMap]);

  const initializeOpenStreetMap = () => {
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer || !window.L) {
      console.error("Map container or Leaflet not found");
      return;
    }

    // Don't reinitialize if map already exists
    if (mapInstanceRef.current) {
      if (formData.latitude && formData.longitude && markerInstanceRef.current) {
        const newPos = [parseFloat(formData.latitude), parseFloat(formData.longitude)];
        markerInstanceRef.current.setLatLng(newPos);
        mapInstanceRef.current.setView(newPos, mapInstanceRef.current.getZoom());
      }
      return;
    }

    const center = formData.latitude && formData.longitude
      ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
      : [23.2599, 77.4126]; // Default: Bhopal

    // Initialize map
    const map = window.L.map(mapContainer).setView(center, 15);

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    let marker = null;

    // Add marker if coordinates exist
    if (formData.latitude && formData.longitude) {
      marker = window.L.marker([parseFloat(formData.latitude), parseFloat(formData.longitude)], {
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (e) => {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        updateLocationFromCoords(lat, lng);
      });

      markerInstanceRef.current = marker;
    }

    // Add click listener to map
    map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      updateLocationFromCoords(lat, lng);

      // Update or create marker
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = window.L.marker([lat, lng], {
          draggable: true,
        }).addTo(map);

        marker.on('dragend', (e) => {
          const newLat = e.target.getLatLng().lat;
          const newLng = e.target.getLatLng().lng;
          updateLocationFromCoords(newLat, newLng);
        });

        markerInstanceRef.current = marker;
      }
    });
  };

  const initializeMap = () => {
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer || !window.google) return;

    // Don't reinitialize if map already exists
    if (mapInstanceRef.current) {
      // Just update marker position if coordinates changed
      if (formData.latitude && formData.longitude && markerInstanceRef.current) {
        const newPos = { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) };
        markerInstanceRef.current.setPosition(newPos);
        mapInstanceRef.current.setCenter(newPos);
      }
      return;
    }

    const center = formData.latitude && formData.longitude
      ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }
      : mapCenter;

    const map = new window.google.maps.Map(mapContainer, {
      center: center,
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;
    let marker = null;

    // Add marker if coordinates exist
    if (formData.latitude && formData.longitude) {
      marker = new window.google.maps.Marker({
        position: { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) },
        map: map,
        draggable: true,
        title: "Selected Location",
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener("dragend", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
      });

      markerInstanceRef.current = marker;
    }

    // Add click listener to map
    map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      setFormData((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));

      // Update or create marker
      if (marker) {
        marker.setPosition({ lat, lng });
      } else {
        marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          draggable: true,
          title: "Selected Location",
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener("dragend", (e) => {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          setFormData((prev) => ({
            ...prev,
            latitude: newLat.toFixed(6),
            longitude: newLng.toFixed(6),
          }));
        });

        markerInstanceRef.current = marker;
      }

      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const address = results[0].address_components;
          const addressParts = {};
          
          address.forEach((component) => {
            const type = component.types[0];
            if (type === "locality") addressParts.city = component.long_name;
            if (type === "administrative_area_level_1") addressParts.state = component.long_name;
            if (type === "postal_code") addressParts.pinCode = component.long_name;
            if (type === "street_number" || type === "route") {
              if (!addressParts.line1) addressParts.line1 = component.long_name;
              else addressParts.line1 += " " + component.long_name;
            }
          });

          setFormData((prev) => ({
            ...prev,
            city: addressParts.city || prev.city,
            state: addressParts.state || prev.state,
            pinCode: addressParts.pinCode || prev.pinCode,
            line1: addressParts.line1 || results[0].formatted_address || prev.line1,
          }));
        }
      });
    });

    // Add search box
    const searchInput = document.getElementById("map-search-input");
    if (searchInput) {
      const searchBox = new window.google.maps.places.SearchBox(searchInput);
      
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));

        // Update marker
        if (marker) {
          marker.setPosition({ lat, lng });
        } else {
          marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            draggable: true,
            title: place.name,
            animation: window.google.maps.Animation.DROP,
          });

          marker.addListener("dragend", (e) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            setFormData((prev) => ({
              ...prev,
              latitude: newLat.toFixed(6),
              longitude: newLng.toFixed(6),
            }));
          });

          markerInstanceRef.current = marker;
        }

        map.setCenter({ lat, lng });
        map.setZoom(15);

        // Update address fields
        const address = place.address_components || [];
        const addressParts = {};
        
        address.forEach((component) => {
          const type = component.types[0];
          if (type === "locality") addressParts.city = component.long_name;
          if (type === "administrative_area_level_1") addressParts.state = component.long_name;
          if (type === "postal_code") addressParts.pinCode = component.long_name;
          if (type === "street_number" || type === "route") {
            if (!addressParts.line1) addressParts.line1 = component.long_name;
            else addressParts.line1 += " " + component.long_name;
          }
        });

        setFormData((prev) => ({
          ...prev,
          city: addressParts.city || prev.city,
          state: addressParts.state || prev.state,
          pinCode: addressParts.pinCode || prev.pinCode,
          line1: addressParts.line1 || place.formatted_address?.split(',')[0] || prev.line1,
        }));
      });
    }
  };

  const updateLocationFromCoords = async (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));

    // Reverse geocode to get address using Nominatim (OpenStreetMap's geocoding service - free, no API key)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        setFormData((prev) => ({
          ...prev,
          city: addr.city || addr.town || addr.village || prev.city,
          state: addr.state || prev.state,
          pinCode: addr.postcode || prev.pinCode,
          line1: addr.road || addr.house_number || data.display_name?.split(',')[0] || prev.line1,
        }));
      }
    } catch (error) {
      console.log("Geocoding failed, coordinates saved:", error);
      // Coordinates are still saved even if geocoding fails
    }
  };

  // Memoized filtered jobs for better performance
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;

    const query = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.jobTitle?.toLowerCase().includes(query) ||
        job.location?.city?.toLowerCase().includes(query) ||
        job.vendor?.storeName?.toLowerCase().includes(query),
    );
  }, [jobs, searchQuery]);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 ml-6">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-500 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white animate-slideIn`}
          >
            {notification.type === "success" ? (
              <Check size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Rider Job Management
                </h1>
                <p className="text-gray-600">
                  Manage and monitor delivery executive job postings across all vendors
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsCreateModalOpen(true);
                }}
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
                  placeholder="Search by job title, city, or vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="animate-spin text-[#FF7B1D] mx-auto mb-4" size={48} />
                <p className="text-gray-600">Loading job posts...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-xl hover:border-[#FF7B1D] transition-all duration-300"
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
                            <Users className="text-blue-600" size={16} />
                            <span className="text-sm font-semibold text-gray-700">
                              {job.vendor.storeName}
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
                                <IndianRupee className="text-white" size={18} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-medium">Joining Bonus</p>
                                <p className="text-lg font-bold text-gray-900">
                                  ₹{job.joiningBonus.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                              <div className="bg-blue-500 p-2 rounded-lg">
                                <IndianRupee className="text-white" size={18} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-medium">Onboarding Fee</p>
                                <p className="text-lg font-bold text-gray-900">
                                  ₹{job.onboardingFee.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                            <MapPin className="text-[#FF7B1D] flex-shrink-0 mt-1" size={20} />
                            <div className="text-sm text-gray-700">
                              <p className="font-semibold mb-1">{job.location.line1}</p>
                              {job.location.line2 && (
                                <p className="mb-1">{job.location.line2}</p>
                              )}
                              <p className="font-medium">
                                {job.location.city}, {job.location.state} -{" "}
                                {job.location.pinCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(job)}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border-2 border-blue-200 hover:border-blue-400 hover:shadow-md"
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDeleteModalOpen(true);
                        }}
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
          )}

          {filteredJobs.length === 0 && !loading && (
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-16 text-center">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first job post"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => {
                    resetForm();
                    setIsCreateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl font-bold"
                >
                  <Plus size={20} />
                  Create Job Post
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-gray-200">
              <div className="sticky top-0 bg-gradient-to-r from-[#FF7B1D] to-orange-600 px-6 py-5 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-white">
                  {isEditModalOpen ? "Edit Job Post" : "Create Job Post"}
                </h2>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, jobTitle: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      placeholder="e.g., Delivery Executive"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Joining Bonus (₹){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <IndianRupee className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="number"
                          required
                          value={formData.joiningBonus}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              joiningBonus: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                          placeholder="1000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Onboarding Fee (₹){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <IndianRupee className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="number"
                          required
                          value={formData.onboardingFee}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              onboardingFee: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                          placeholder="300"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vendor <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.vendorId}
                      onChange={(e) =>
                        setFormData({ ...formData, vendorId: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] bg-white transition-all"
                    >
                      <option value="">Select a vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.storeName || vendor.vendorName || vendor._id}
                        </option>
                      ))}
                    </select>
                    {vendors.length === 0 && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        <Loader2 className="animate-spin" size={14} />
                        Loading vendors...
                      </p>
                    )}
                  </div>
                </div>

                {/* Location Section */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6 space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-200">
                    <div className="bg-gradient-to-br from-[#FF7B1D] to-orange-600 p-2 rounded-lg">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Location Details
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.line1}
                      onChange={(e) =>
                        setFormData({ ...formData, line1: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      placeholder="MG Road, Sector 12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.line2}
                      onChange={(e) =>
                        setFormData({ ...formData, line2: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                      placeholder="Opposite City Mall"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                        placeholder="Bhopal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                        placeholder="Madhya Pradesh"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pinCode}
                        onChange={(e) =>
                          setFormData({ ...formData, pinCode: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                        placeholder="462001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Latitude
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="any"
                          value={formData.latitude}
                          onChange={(e) =>
                            setFormData({ ...formData, latitude: e.target.value })
                          }
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                          placeholder="23.2599"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  const lat = position.coords.latitude.toFixed(6);
                                  const lng = position.coords.longitude.toFixed(6);
                                  setFormData((prev) => ({
                                    ...prev,
                                    latitude: lat,
                                    longitude: lng,
                                  }));
                                  setMapCenter({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                  });
                                  // Update map if it's already initialized
                                  if (mapInstanceRef.current && markerInstanceRef.current) {
                                    const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
                                    markerInstanceRef.current.setPosition(newPos);
                                    mapInstanceRef.current.setCenter(newPos);
                                  }
                                  showNotification("Location fetched successfully!", "success");
                                },
                                () => {
                                  showNotification("Unable to fetch location. Please use map to select.", "error");
                                }
                              );
                            } else {
                              showNotification("Geolocation not supported. Please use map.", "error");
                            }
                          }}
                          className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold whitespace-nowrap"
                          title="Get Current Location"
                        >
                          📍
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longitude: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                        placeholder="77.4126"
                      />
                    </div>
                  </div>

                  {/* Map Section */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Select Location on Map
                        </label>
                        <p className="text-xs text-gray-500">
                          Click on map to select location or search for an address
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className="px-4 py-2 bg-[#FF7B1D] hover:bg-orange-600 text-white rounded-lg transition-all font-semibold text-sm flex items-center gap-2"
                      >
                        <MapPin size={16} />
                        {showMap ? "Hide Map" : "Show Map"}
                      </button>
                    </div>
                    
                    {showMap && (
                      <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg">
                        <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-600 p-4 border-b border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <MapPin className="text-white" size={20} />
                            <p className="text-white font-semibold">
                              Interactive Map - Click to Select Location
                            </p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-3 text-xs text-white">
                              <div>
                                <span className="font-semibold">Latitude:</span>{" "}
                                <span className="font-bold">{formData.latitude || "Not set"}</span>
                              </div>
                              <div>
                                <span className="font-semibold">Longitude:</span>{" "}
                                <span className="font-bold">{formData.longitude || "Not set"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Search Box */}
                        <div className="bg-gray-50 p-4 border-b border-gray-200">
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="text"
                                id="map-search-input"
                                placeholder="Search for address, place, or landmark..."
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all"
                                onKeyPress={async (e) => {
                                  if (e.key === 'Enter' && useOpenStreetMap && window.L) {
                                    const query = e.target.value;
                                    if (query) {
                                      try {
                                        const response = await fetch(
                                          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
                                        );
                                        const data = await response.json();
                                        if (data && data.length > 0) {
                                          const lat = parseFloat(data[0].lat);
                                          const lng = parseFloat(data[0].lon);
                                          updateLocationFromCoords(lat, lng);
                                          if (mapInstanceRef.current) {
                                            mapInstanceRef.current.setView([lat, lng], 15);
                                            if (markerInstanceRef.current) {
                                              markerInstanceRef.current.setLatLng([lat, lng]);
                                            } else {
                                              const marker = window.L.marker([lat, lng], { draggable: true }).addTo(mapInstanceRef.current);
                                              marker.on('dragend', (e) => {
                                                const newLat = e.target.getLatLng().lat;
                                                const newLng = e.target.getLatLng().lng;
                                                updateLocationFromCoords(newLat, newLng);
                                              });
                                              markerInstanceRef.current = marker;
                                            }
                                          }
                                        }
                                      } catch (error) {
                                        console.error("Search failed:", error);
                                      }
                                    }
                                  }
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (navigator.geolocation) {
                                  navigator.geolocation.getCurrentPosition(
                                    (position) => {
                                      const lat = position.coords.latitude;
                                      const lng = position.coords.longitude;
                                      updateLocationFromCoords(lat, lng);
                                      
                                      // Update map if initialized
                                      if (mapInstanceRef.current && markerInstanceRef.current) {
                                        const newPos = [lat, lng];
                                        markerInstanceRef.current.setLatLng(newPos);
                                        mapInstanceRef.current.setView(newPos, mapInstanceRef.current.getZoom());
                                      } else if (mapInstanceRef.current) {
                                        mapInstanceRef.current.setView([lat, lng], 15);
                                        const marker = window.L.marker([lat, lng], { draggable: true }).addTo(mapInstanceRef.current);
                                        marker.on('dragend', (e) => {
                                          const newLat = e.target.getLatLng().lat;
                                          const newLng = e.target.getLatLng().lng;
                                          updateLocationFromCoords(newLat, newLng);
                                        });
                                        markerInstanceRef.current = marker;
                                      }
                                      
                                      showNotification("Location fetched successfully!", "success");
                                    },
                                    () => {
                                      showNotification("Unable to fetch location. Please use map to select.", "error");
                                    }
                                  );
                                } else {
                                  showNotification("Geolocation not supported. Please use map.", "error");
                                }
                              }}
                              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold text-sm whitespace-nowrap"
                              title="Get Current Location"
                            >
                              📍 Current
                            </button>
                          </div>
                          {useOpenStreetMap && (
                            <p className="text-xs text-gray-500 mt-2">
                              💡 Using OpenStreetMap (Free, No API Key Required)
                            </p>
                          )}
                        </div>

                        {/* Map Container */}
                        <div className="relative" style={{ height: "500px" }}>
                          {mapError ? (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <div className="text-center p-6 max-w-md">
                                <AlertCircle className="text-red-500 mx-auto mb-3" size={48} />
                                <p className="text-red-600 font-semibold mb-2">Map Loading Error</p>
                                <p className="text-gray-600 text-sm mb-4">{mapError}</p>
                              </div>
                            </div>
                          ) : !mapLoaded ? (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <div className="text-center">
                                <Loader2 className="animate-spin text-[#FF7B1D] mx-auto mb-3" size={32} />
                                <p className="text-gray-600 font-medium">Loading map...</p>
                                <p className="text-gray-500 text-xs mt-2">Please wait while we load OpenStreetMap</p>
                              </div>
                            </div>
                          ) : (
                            <div id="map-container" style={{ width: "100%", height: "100%" }}></div>
                          )}
                          
                          {/* Instructions Overlay */}
                          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border-2 border-[#FF7B1D] max-w-xs">
                            <p className="text-xs font-semibold text-gray-800 mb-1">
                              📍 How to use:
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Click on map to select location</li>
                              <li>• Drag marker to adjust position</li>
                              <li>• Search for address above</li>
                              <li>• Coordinates update automatically</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-[#FF7B1D] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Saving...
                      </>
                    ) : isEditModalOpen ? (
                      <>
                        <Check size={18} />
                        Update Job Post
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Create Job Post
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-gray-200">
              <div className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-lg">
                  <AlertCircle size={40} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                  Delete Job Post?
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Are you sure you want to delete this job posting? This action
                  cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setSelectedJob(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteJobPost(selectedJob._id)}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          .animate-slideIn {
            animation: slideIn 0.4s ease-out;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default RiderJobPostManagement;
