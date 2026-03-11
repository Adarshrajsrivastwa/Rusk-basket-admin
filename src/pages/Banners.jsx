import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Plus, Pencil, Trash2, X, Loader2, Crop, Check, RotateCw } from "lucide-react";
import { BASE_URL } from "../api/api";
import { showToast } from "../utils/toast";

const API_URL = `${BASE_URL}/api/banner`;

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    imagePreview: null,
  });
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null); // 'nw', 'ne', 'sw', 'se'
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
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

  // ================= FETCH BANNERS =================
  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (result.success) {
        setBanners(result.data || []);
      } else {
        showToast.error("Failed to load banners");
      }
    } catch (error) {
      showToast.error("Failed to load banners. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // ================= OPEN ADD =================
  const handleAddClick = () => {
    setEditingBanner(null);
    setFormData({ name: "", image: null, imagePreview: null });
    setIsModalOpen(true);
  };

  // ================= OPEN EDIT =================
  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setFormData({
      name: banner.name,
      image: null,
      imagePreview: banner.image?.url || banner.image,
    });
    setIsModalOpen(true);
  };

  // ================= IMAGE CHANGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      showToast.error("Please upload a valid image");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImage(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  // ================= INITIALIZE CROP AREA (16:9) =================
  useEffect(() => {
    if (showCropModal && cropImage && cropContainerRef.current) {
      const container = cropContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // 16:9 aspect ratio
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
      
      // Load image to get actual dimensions
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = cropImage;
    }
  }, [showCropModal, cropImage]);

  // ================= HANDLE CROP BOX DRAG =================
  const handleMouseDown = (e) => {
    // Check if clicking on resize handle
    if (e.target.classList.contains('resize-handle')) {
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
    
    // Otherwise, drag the crop box
    if (e.target === cropBoxRef.current || cropBoxRef.current?.contains(e.target)) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - cropArea.x,
        y: e.clientY - cropArea.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!cropContainerRef.current) return;
    
    const container = cropContainerRef.current;
    const rect = container.getBoundingClientRect();
    const aspectRatio = 16 / 9;
    
    // Handle resize
    if (isResizing && resizeHandle) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.cropX;
      let newY = resizeStart.cropY;
      
      // Calculate resize based on handle position
      if (resizeHandle === 'se') {
        // Bottom-right: increase/decrease both width and height
        const scale = Math.max(
          (resizeStart.width + deltaX) / resizeStart.width,
          (resizeStart.height + deltaY) / resizeStart.height
        );
        newWidth = resizeStart.width * scale;
        newHeight = newWidth / aspectRatio;
      } else if (resizeHandle === 'sw') {
        // Bottom-left: resize from left
        const scale = Math.max(
          (resizeStart.width - deltaX) / resizeStart.width,
          (resizeStart.height + deltaY) / resizeStart.height
        );
        newWidth = resizeStart.width * scale;
        newHeight = newWidth / aspectRatio;
        newX = resizeStart.cropX + resizeStart.width - newWidth;
      } else if (resizeHandle === 'ne') {
        // Top-right: resize from top
        const scale = Math.max(
          (resizeStart.width + deltaX) / resizeStart.width,
          (resizeStart.height - deltaY) / resizeStart.height
        );
        newWidth = resizeStart.width * scale;
        newHeight = newWidth / aspectRatio;
        newY = resizeStart.cropY + resizeStart.height - newHeight;
      } else if (resizeHandle === 'nw') {
        // Top-left: resize from top-left
        const scale = Math.max(
          (resizeStart.width - deltaX) / resizeStart.width,
          (resizeStart.height - deltaY) / resizeStart.height
        );
        newWidth = resizeStart.width * scale;
        newHeight = newWidth / aspectRatio;
        newX = resizeStart.cropX + resizeStart.width - newWidth;
        newY = resizeStart.cropY + resizeStart.height - newHeight;
      }
      
      // Constrain to container bounds
      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight;
      const minSize = 100; // Minimum crop size
      
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }
      if (newWidth < minSize) {
        newWidth = minSize;
        newHeight = newWidth / aspectRatio;
      }
      if (newHeight < minSize) {
        newHeight = minSize;
        newWidth = newHeight * aspectRatio;
      }
      
      // Adjust position if resizing from left or top
      if (resizeHandle === 'sw' || resizeHandle === 'nw') {
        newX = Math.max(0, Math.min(newX, container.clientWidth - newWidth));
      }
      if (resizeHandle === 'ne' || resizeHandle === 'nw') {
        newY = Math.max(0, Math.min(newY, container.clientHeight - newHeight));
      }
      
      // Ensure crop box stays within bounds
      if (newX + newWidth > container.clientWidth) {
        newX = container.clientWidth - newWidth;
      }
      if (newY + newHeight > container.clientHeight) {
        newY = container.clientHeight - newHeight;
      }
      
      setCropArea({
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: newWidth,
        height: newHeight,
      });
      return;
    }
    
    // Handle drag
    if (isDragging) {
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;
      
      // Keep crop area within container bounds
      const maxX = container.clientWidth - cropArea.width;
      const maxY = container.clientHeight - cropArea.height;
      
      setCropArea({
        ...cropArea,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  // ================= APPLY CROP =================
  const applyCrop = () => {
    if (!cropImage || !imageRef.current) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Calculate scale factor
      const container = cropContainerRef.current;
      const scaleX = img.width / container.clientWidth;
      const scaleY = img.height / container.clientHeight;
      
      // Calculate actual crop coordinates
      const cropX = (cropArea.x * scaleX);
      const cropY = (cropArea.y * scaleY);
      const cropWidth = (cropArea.width * scaleX);
      const cropHeight = (cropArea.height * scaleY);
      
      // Set canvas size to 16:9 ratio (e.g., 1920x1080)
      const outputWidth = 1920;
      const outputHeight = 1080;
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      
      // Draw cropped and scaled image
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, outputWidth, outputHeight
      );
      
      // Convert to blob and update form data
      canvas.toBlob((blob) => {
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
      }, "image/jpeg", 0.9);
    };
    img.src = cropImage;
  };

  // ================= CANCEL CROP =================
  const cancelCrop = () => {
    setShowCropModal(false);
    setCropImage(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast.error("Banner name is required");
      return;
    }
    if (!editingBanner && !formData.image) {
      showToast.error("Please select an image");
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
      showToast.success(result.message || "Banner saved successfully");
    } catch (error) {
      showToast.error(error.message || "Failed to save banner.");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================
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
      showToast.success(result.message || "Banner deleted successfully");
    } catch (error) {
      showToast.error(error.message || "Delete failed.");
    }
  };

  // ================= UI =================
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0 p-0 mt-2 ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 pb-2 inline-block">
              Banner Management
            </h1>
            <button
              onClick={handleAddClick}
              className="bg-black text-white px-5 py-2.5 rounded-sm flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-md"
            >
              <Plus size={18} /> Add Banner
            </button>
          </div>

          {/* Loader */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
          )}

          {/* ✅ Banner Grid — paginated, 10 per page */}
          {!loading &&
            (() => {
              const indexOfLast = currentPage * itemsPerPage;
              const indexOfFirst = indexOfLast - itemsPerPage;
              const currentBanners = banners.slice(indexOfFirst, indexOfLast);
              const totalPages = Math.ceil(banners.length / itemsPerPage);

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentBanners.map((banner) => (
                      <div
                        key={banner._id}
                        className="bg-white shadow-lg border rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="relative h-48 bg-white flex items-center justify-center">
                          <img
                            src={banner.image?.url || banner.image}
                            alt={banner.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/400x200/orange/white?text=Image+Not+Found";
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1 text-gray-800">
                            {banner.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3">
                            Created:{" "}
                            {new Date(banner.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(banner._id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination — always visible like CreateCategory */}
                  {banners.length > 0 && (
                    <div className="flex justify-end items-center gap-6 mt-8">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
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
                            else if (pages[pages.length - 1] !== "...")
                              pages.push("...");
                          }
                          return pages.map((page, idx) =>
                            page === "..." ? (
                              <span
                                key={idx}
                                className="px-1 text-black select-none"
                              >
                                ...
                              </span>
                            ) : (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-1 ${currentPage === page ? "text-orange-600 font-semibold" : ""}`}
                              >
                                {page}
                              </button>
                            ),
                          );
                        })()}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              );
            })()}

          {!loading && banners.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No banners found</p>
              <button
                onClick={handleAddClick}
                className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Your First Banner
              </button>
            </div>
          )}
        </div>

        {/* CROP MODAL */}
        {showCropModal && (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-75"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="relative bg-white w-full max-w-4xl p-6 rounded-lg shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Crop Banner Image (16:9 Aspect Ratio)
                </h3>
                <button
                  onClick={cancelCrop}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div 
                ref={cropContainerRef}
                className="relative w-full bg-gray-900 rounded-lg overflow-hidden"
                style={{ height: "500px", position: "relative" }}
                onMouseDown={handleMouseDown}
              >
                <img
                  ref={imageRef}
                  src={cropImage}
                  alt="Crop"
                  className="w-full h-full object-contain"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0">
                  <div 
                    className="absolute bg-black bg-opacity-50"
                    style={{
                      top: 0,
                      left: 0,
                      right: 0,
                      height: `${cropArea.y}px`,
                    }}
                  />
                  <div 
                    className="absolute bg-black bg-opacity-50"
                    style={{
                      top: `${cropArea.y + cropArea.height}px`,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  <div 
                    className="absolute bg-black bg-opacity-50"
                    style={{
                      top: `${cropArea.y}px`,
                      left: 0,
                      width: `${cropArea.x}px`,
                      height: `${cropArea.height}px`,
                    }}
                  />
                  <div 
                    className="absolute bg-black bg-opacity-50"
                    style={{
                      top: `${cropArea.y}px`,
                      right: 0,
                      width: `${cropContainerRef.current ? cropContainerRef.current.clientWidth - cropArea.x - cropArea.width : 0}px`,
                      height: `${cropArea.height}px`,
                    }}
                  />
                </div>
                
                {/* Crop Box */}
                <div
                  ref={cropBoxRef}
                  className="absolute border-2 border-white cursor-move"
                  style={{
                    left: `${cropArea.x}px`,
                    top: `${cropArea.y}px`,
                    width: `${cropArea.width}px`,
                    height: `${cropArea.height}px`,
                    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {/* Resize handles - Top Left */}
                  <div 
                    className="resize-handle absolute -top-2 -left-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize hover:bg-blue-100 transition-colors"
                    data-handle="nw"
                    title="Resize (16:9)"
                  />
                  
                  {/* Resize handles - Top Right */}
                  <div 
                    className="resize-handle absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize hover:bg-blue-100 transition-colors"
                    data-handle="ne"
                    title="Resize (16:9)"
                  />
                  
                  {/* Resize handles - Bottom Left */}
                  <div 
                    className="resize-handle absolute -bottom-2 -left-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize hover:bg-blue-100 transition-colors"
                    data-handle="sw"
                    title="Resize (16:9)"
                  />
                  
                  {/* Resize handles - Bottom Right */}
                  <div 
                    className="resize-handle absolute -bottom-2 -right-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize hover:bg-blue-100 transition-colors"
                    data-handle="se"
                    title="Resize (16:9)"
                  />
                  
                  {/* Aspect ratio indicator */}
                  <div className="absolute -bottom-8 left-0 right-0 text-center text-white text-sm font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                    16:9 (Drag corners to resize)
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={cancelCrop}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="px-5 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Check size={16} />
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => !submitting && setIsModalOpen(false)}
            />
            <div className="relative bg-white w-full max-w-lg p-6 rounded-lg z-50 shadow-2xl">
              <button
                onClick={() => !submitting && setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                disabled={submitting}
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-4 border-orange-500 pb-2 inline-block">
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter banner name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image *{" "}
                    {editingBanner && "(Leave empty to keep current image)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={submitting}
                  />
                </div>

                {/* ✅ Modal preview also shows full image with 16:9 aspect ratio */}
                {formData.imagePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview (16:9 Aspect Ratio)
                    </label>
                    <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      <img
                        src={formData.imagePreview}
                        className="w-full h-full object-cover rounded-lg border border-gray-300"
                        alt="Preview"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
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
      </div>
    </DashboardLayout>
  );
};

export default BannerManagement;
