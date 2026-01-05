import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

// ⚠️ IMPORTANT: Update these URLs to match your actual backend
const API_URL = "https://rush-basket.onrender.com/api/v1/banners";
const BASE_URL = "https://rush-basket.onrender.com";

// If running backend locally, uncomment and update:
// const API_URL = "http://localhost:5000/api/v1/banners";
// const BASE_URL = "http://localhost:5000";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    imagePreview: null,
  });

  // ================= FETCH BANNERS =================
  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const result = await res.json();

      console.log("API Response:", result);

      if (result.success) {
        setBanners(result.data || []);
        console.log("Banners loaded:", result.data);
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
    setFormData({
      name: "",
      image: null,
      imagePreview: null,
    });
    setIsModalOpen(true);
  };

  // ================= OPEN EDIT =================
  const handleEditClick = (banner) => {
    console.log("Editing banner:", banner);
    setEditingBanner(banner);
    setFormData({
      name: banner.name,
      image: null,
      imagePreview: `${BASE_URL}${banner.image}`,
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
    if (formData.image) {
      data.append("image", formData.image);
    }

    setSubmitting(true);
    try {
      let res;
      if (editingBanner) {
        res = await fetch(`${API_URL}/${editingBanner._id}`, {
          method: "PUT",
          body: data,
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          body: data,
        });
      }

      const result = await res.json();

      if (result.success) {
        setIsModalOpen(false);
        loadBanners();
        alert(result.message || "Banner saved successfully");
      } else {
        alert(result.message || "Failed to save banner");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Failed to save banner. Check if backend is running.");
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
      });

      const result = await res.json();

      if (result.success) {
        loadBanners();
        alert(result.message || "Banner deleted successfully");
      } else {
        alert(result.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Delete failed. Check if backend is running.");
    }
  };

  // ================= UI =================
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0 p-0 ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-orange-500 pb-2 inline-block">
              Banner Management
            </h1>
            <button
              onClick={handleAddClick}
              className="bg-orange-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-md"
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

          {/* Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="bg-white shadow-lg border rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={`${BASE_URL}${banner.image}`}
                      alt={banner.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("❌ Image failed to load");
                        console.error("Path from API:", banner.image);
                        console.error("Full URL attempted:", e.target.src);
                        console.error(
                          "Check if backend is serving static files!"
                        );
                        e.target.src =
                          "https://placehold.co/400x200/orange/white?text=Image+Not+Found";
                      }}
                      onLoad={(e) =>
                        console.log("✅ Image loaded:", e.target.src)
                      }
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                      {banner.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Created: {new Date(banner.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(banner)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Pencil size={16} /> Edit
                      </button>
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
          )}

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

                {formData.imagePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <img
                      src={formData.imagePreview}
                      className="h-48 w-full object-cover border border-gray-300 rounded-lg"
                      alt="Preview"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
