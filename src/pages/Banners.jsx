import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { BASE_URL } from "../api/api";

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
        alert("Failed to load banners");
      }
    } catch (error) {
      console.error("Error loading banners:", error);
      alert("Failed to load banners. Check if backend is running.");
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
      alert("Please upload a valid image");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // ================= SUBMIT =================
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
      alert(result.message || "Banner deleted successfully");
    } catch (error) {
      alert(error.message || "Delete failed.");
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

                {/* ✅ Modal preview also shows full image */}
                {formData.imagePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={formData.imagePreview}
                        className="w-full h-auto object-contain rounded-lg border border-gray-300"
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
