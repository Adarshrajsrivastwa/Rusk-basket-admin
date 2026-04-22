import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Calendar,
} from "lucide-react";
import { BASE_URL } from "../api/api";

const API_URL = `${BASE_URL}/api/banner`;

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    imagePreview: null,
  });
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const cropContainerRef = useRef(null);
  const cropBoxRef = useRef(null);
  const imageRef = useRef(null);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (result.success) setBanners(result.data || []);
      else alert("Failed to load banners");
    } catch (error) {
      alert("Failed to load banners. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleAddClick = () => {
    setEditingBanner(null);
    setFormData({ name: "", image: null, imagePreview: null });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImage(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (showCropModal && cropImage && cropContainerRef.current) {
      const container = cropContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const aspectRatio = 16 / 9;
      let cropWidth = Math.min(containerWidth * 0.8, 600);
      let cropHeight = cropWidth / aspectRatio;
      if (cropHeight > containerHeight * 0.8) {
        cropHeight = containerHeight * 0.8;
        cropWidth = cropHeight * aspectRatio;
      }
      const x = (containerWidth - cropWidth) / 2;
      const y = (containerHeight - cropHeight) / 2;
      setCropArea({ x, y, width: cropWidth, height: cropHeight });
    }
  }, [showCropModal, cropImage]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains("resize-handle")) {
      const handle = e.target.dataset.handle;
      setIsResizing(true);
      setResizeHandle(handle);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: cropArea.width,
        height: cropArea.height,
        cropX: cropArea.x,
        cropY: cropArea.y,
      });
      e.stopPropagation();
      return;
    }
    if (
      e.target === cropBoxRef.current ||
      cropBoxRef.current?.contains(e.target)
    ) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - cropArea.x, y: e.clientY - cropArea.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!cropContainerRef.current) return;
    const container = cropContainerRef.current;
    const rect = container.getBoundingClientRect();
    const aspectRatio = 16 / 9;

    if (isResizing && resizeHandle) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      let newWidth = resizeStart.width,
        newHeight = resizeStart.height;
      let newX = resizeStart.cropX,
        newY = resizeStart.cropY;

      if (resizeHandle === "se") {
        const scale = Math.max(
          (resizeStart.width + deltaX) / resizeStart.width,
          (resizeStart.height + deltaY) / resizeStart.height,
        );
        newWidth = resizeStart.width * scale;
        newHeight = newWidth / aspectRatio;
      } else if (resizeHandle === "sw") {
        const scale = Math.max(
          (resizeStart.width - deltaX) / resizeStart.width,
          (resizeStart.height + deltaY) / resizeStart.height,
        );
        newWidth = resizeStart.width * scale;
        newHeight = newWidth / aspectRatio;
        newX = resizeStart.cropX + resizeStart.width - newWidth;
      } else if (resizeHandle === "ne") {
        const scale = Math.max(
          (resizeStart.width + deltaX) / resizeStart.width,
          (resizeStart.height - deltaY) / resizeStart.height,
        );
        newWidth = resizeStart.width * scale;
        newHeight = newWidth / aspectRatio;
        newY = resizeStart.cropY + resizeStart.height - newHeight;
      } else if (resizeHandle === "nw") {
        const scale = Math.max(
          (resizeStart.width - deltaX) / resizeStart.width,
          (resizeStart.height - deltaY) / resizeStart.height,
        );
        newWidth = resizeStart.width * scale;
        newHeight = newWidth / aspectRatio;
        newX = resizeStart.cropX + resizeStart.width - newWidth;
        newY = resizeStart.cropY + resizeStart.height - newHeight;
      }

      const minSize = 100;
      newWidth = Math.max(minSize, Math.min(newWidth, container.clientWidth));
      newHeight = newWidth / aspectRatio;
      if (newX + newWidth > container.clientWidth)
        newX = container.clientWidth - newWidth;
      if (newY + newHeight > container.clientHeight)
        newY = container.clientHeight - newHeight;

      setCropArea({
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: newWidth,
        height: newHeight,
      });
      return;
    }

    if (isDragging) {
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;
      setCropArea({
        ...cropArea,
        x: Math.max(0, Math.min(newX, container.clientWidth - cropArea.width)),
        y: Math.max(
          0,
          Math.min(newY, container.clientHeight - cropArea.height),
        ),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const applyCrop = () => {
    if (!cropImage || !imageRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const container = cropContainerRef.current;
      const scaleX = img.width / container.clientWidth;
      const scaleY = img.height / container.clientHeight;
      canvas.width = 1920;
      canvas.height = 1080;
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        1920,
        1080,
      );
      canvas.toBlob(
        (blob) => {
          const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData((prev) => ({
              ...prev,
              image: file,
              imagePreview: reader.result,
            }));
            setShowCropModal(false);
            setCropImage(null);
          };
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.9,
      );
    };
    img.src = cropImage;
  };

  const cancelCrop = () => {
    setShowCropModal(false);
    setCropImage(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Banner name is required");
      return;
    }
    if (!editingBanner && !formData.image) {
      alert("Please select an image");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.image) data.append("image", formData.image);

    setSubmitting(true);
    try {
      const headers = getAuthHeaders();
      const res = editingBanner
        ? await fetch(`${API_URL}/${editingBanner._id}`, {
            method: "PUT",
            credentials: "include",
            headers,
            body: data,
          })
        : await fetch(`${API_URL}/create`, {
            method: "POST",
            credentials: "include",
            headers,
            body: data,
          });

      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.message || "Failed to save banner");
      setIsModalOpen(false);
      loadBanners();
      alert(result.message || "Banner saved successfully");
    } catch (error) {
      alert(error.message || "Failed to save banner.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.message || "Failed to delete banner");
      loadBanners();
      alert(result.message || "Banner deleted successfully");
    } catch (error) {
      alert(error.message || "Delete failed.");
    }
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBanners = banners.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(banners.length / itemsPerPage);

  // ── Skeleton ──
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm animate-pulse"
        >
          <div
            className="w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
            style={{ aspectRatio: "16/9" }}
          />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            <div className="h-8 bg-gray-100 rounded-xl mt-3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate { animation: fadeSlideIn 0.3s ease forwards; }
      `}</style>

      <div className="px-1 mt-3">
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between mb-4">
          {/* Card Header style */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              Banner Management
            </span>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium ml-2">
                {banners.length} banner{banners.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <button
            onClick={handleAddClick}
            className="bg-black hover:bg-[#FF7B1D] text-white text-xs font-semibold px-5 h-[38px] rounded-xl shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={14} /> Add Banner
          </button>
        </div>

        {/* ── Grid Card wrapper ── */}
        <div className="mx-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card top bar */}
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <span className="text-xs text-gray-400 font-medium">
              {loading
                ? "Loading..."
                : `Showing ${indexOfFirst + 1}–${Math.min(indexOfLast, banners.length)} of ${banners.length}`}
            </span>
          </div>

          <div className="p-5">
            {/* Skeleton */}
            {loading && <GridSkeleton />}

            {/* Empty */}
            {!loading && banners.length === 0 && (
              <div className="py-20 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-orange-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No banners found
                </p>
                <p className="text-gray-300 text-xs">
                  Click "Add Banner" to create your first banner
                </p>
                <button
                  onClick={handleAddClick}
                  className="mt-2 bg-[#FF7B1D] text-white text-xs font-semibold px-5 py-2 rounded-xl hover:bg-orange-500 transition-colors"
                >
                  + Add Banner
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && banners.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentBanners.map((banner, idx) => (
                  <div
                    key={banner._id}
                    className="card-animate rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-200 group"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden bg-gray-50"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <img
                        src={banner.image?.url || banner.image}
                        alt={banner.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/800x450/f97316/white?text=Banner";
                        }}
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-800 truncate mb-1">
                        {banner.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                        <Calendar className="w-3 h-3" />
                        {new Date(banner.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Pagination ── */}
        {!loading && banners.length > 0 && (
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

      {/* ── CROP MODAL ── */}
      {showCropModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative bg-white w-full max-w-4xl p-6 rounded-2xl shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  Crop Banner Image
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  16:9 aspect ratio — drag to reposition, corners to resize
                </p>
              </div>
              <button
                onClick={cancelCrop}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div
              ref={cropContainerRef}
              className="relative w-full bg-gray-900 rounded-xl overflow-hidden"
              style={{ height: "460px" }}
              onMouseDown={handleMouseDown}
            >
              <img
                ref={imageRef}
                src={cropImage}
                alt="Crop"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute bg-black/50"
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${cropArea.y}px`,
                  }}
                />
                <div
                  className="absolute bg-black/50"
                  style={{
                    top: `${cropArea.y + cropArea.height}px`,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                <div
                  className="absolute bg-black/50"
                  style={{
                    top: `${cropArea.y}px`,
                    left: 0,
                    width: `${cropArea.x}px`,
                    height: `${cropArea.height}px`,
                  }}
                />
                <div
                  className="absolute bg-black/50"
                  style={{
                    top: `${cropArea.y}px`,
                    right: 0,
                    width: `${cropContainerRef.current ? cropContainerRef.current.clientWidth - cropArea.x - cropArea.width : 0}px`,
                    height: `${cropArea.height}px`,
                  }}
                />
              </div>

              <div
                ref={cropBoxRef}
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                }}
              >
                {["nw", "ne", "sw", "se"].map((handle) => (
                  <div
                    key={handle}
                    className={`resize-handle absolute w-5 h-5 bg-white border-2 border-[#FF7B1D] rounded-full hover:bg-orange-50 transition-colors ${
                      handle === "nw"
                        ? "-top-2.5 -left-2.5 cursor-nwse-resize"
                        : handle === "ne"
                          ? "-top-2.5 -right-2.5 cursor-nesw-resize"
                          : handle === "sw"
                            ? "-bottom-2.5 -left-2.5 cursor-nesw-resize"
                            : "-bottom-2.5 -right-2.5 cursor-nwse-resize"
                    }`}
                    data-handle={handle}
                  />
                ))}
                <div className="absolute -bottom-7 left-0 right-0 text-center text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-md pointer-events-none">
                  16:9
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelCrop}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="px-5 py-2 bg-[#FF7B1D] text-white rounded-xl text-xs font-semibold hover:bg-orange-500 transition-colors flex items-center gap-1.5"
              >
                <Check size={14} /> Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD/EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg p-6 rounded-2xl z-50 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-gray-800">
                  {editingBanner ? "Edit Banner" : "Add New Banner"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingBanner
                    ? "Update banner details below"
                    : "Fill in the details to create a new banner"}
                </p>
              </div>
              <button
                onClick={() => !submitting && setIsModalOpen(false)}
                disabled={submitting}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Banner Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter banner name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all placeholder:text-gray-400"
                  disabled={submitting}
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Banner Image <span className="text-red-400">*</span>
                  {editingBanner && (
                    <span className="text-gray-400 font-normal ml-1">
                      (leave empty to keep current)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                  disabled={submitting}
                />
              </div>

              {/* Preview */}
              {formData.imagePreview && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Preview (16:9)
                  </label>
                  <div
                    className="w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <img
                      src={formData.imagePreview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2 bg-[#FF7B1D] text-white rounded-xl text-xs font-semibold hover:bg-orange-500 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin w-3.5 h-3.5" />{" "}
                      {editingBanner ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingBanner ? "Update Banner" : "Create Banner"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BannerManagement;
