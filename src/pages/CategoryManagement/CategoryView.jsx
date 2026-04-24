import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Layers,
  X,
  ChevronRight,
  Calendar,
  Hash,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";

const API_URL = `${BASE_URL}/api/category`;

/* ─────────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────────── */
const EditCategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && isOpen) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
      setImagePreview(category.image?.url || "");
      setSelectedFile(null);
    }
  }, [category, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    const fi = document.getElementById("image-upload");
    if (fi) fi.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("isActive", formData.isActive);
      if (selectedFile) submitData.append("image", selectedFile);

      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/${category._id}`, {
        method: "PUT",
        credentials: "include",
        headers,
        body: submitData,
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to update category");
      alert("Category updated successfully!");
      onSave(data.data);
    } catch (err) {
      alert(err.message || "Failed to update category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Category</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Update category details
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF7B1D] transition-all"
              placeholder="Enter category name"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF7B1D] transition-all resize-none"
              placeholder="Enter category description"
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Category Image
            </label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-[#FF7B1D]"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl transition-all ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[#FF7B1D] hover:bg-orange-50"}`}
              >
                <div className="text-center">
                  <Package className="w-7 h-7 text-[#FF7B1D] mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-gray-700">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to upload new image"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-orange-500 focus:ring-orange-300 border-gray-300 rounded"
              disabled={loading}
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Active Status
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DELETE MODAL
───────────────────────────────────────────── */
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-red-50 rounded-2xl border border-red-100">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 text-center mb-1">
            Delete Category
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#FF7B1D]">
              "{categoryName}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent = false }) => (
  <div
    className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border transition-all
    ${accent ? "bg-orange-50 border-orange-100" : "bg-gray-50 border-gray-100"}`}
  >
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-0.5
      ${accent ? "bg-orange-100" : "bg-white border border-gray-200"}`}
    >
      <Icon
        className={`w-4.5 h-4.5 ${accent ? "text-[#FF7B1D]" : "text-gray-500"}`}
        style={{ width: 18, height: 18 }}
      />
    </div>
    <p className="text-xl font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-500 font-medium text-center leading-tight">
      {label}
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const CategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategoryDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        credentials: "include",
        headers,
      });
      if (!response.ok)
        throw new Error(
          response.status === 404
            ? "Category not found"
            : `Failed to fetch category: ${response.status}`,
        );

      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Failed to fetch category");

      const categoryData = data.data;
      const categoryObj = categoryData.category || categoryData;
      const summary = categoryData.summary || {};

      setCategory({
        ...categoryObj,
        name: categoryObj.name || "",
        description: categoryObj.description || "",
        code: categoryObj.code || categoryObj._id || "",
        isActive:
          categoryObj.isActive !== undefined ? categoryObj.isActive : false,
        image: categoryObj.image || null,
        createdAt: categoryObj.createdAt || null,
        updatedAt: categoryObj.updatedAt || null,
        productCount: summary.productCount || categoryObj.productCount || 0,
        subCategoryCount:
          summary.subCategoryCount || categoryObj.subCategoryCount || 0,
        topSellingProducts: categoryData.topSellingProducts || [],
        subCategories: categoryData.subCategories || [],
        summary,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCategoryDetails();
  }, [id]);

  const handleSaveEdit = (updatedCategory) => {
    setCategory(updatedCategory);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers,
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to delete category");

      alert(`Category "${category.name}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      navigate("/category/create");
    } catch (err) {
      alert(err.message || "Failed to delete category. Please try again.");
      setDeleteLoading(false);
    }
  };

  const NO_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='13' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-full mx-auto px-1 py-3 space-y-4 animate-pulse">
          <div className="h-8 bg-gray-100 rounded-xl w-40" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex gap-5">
              <div className="w-28 h-28 bg-gray-100 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <div className="h-7 bg-gray-100 rounded-xl w-1/2" />
                <div className="h-4 bg-gray-100 rounded-xl w-1/4" />
                <div className="h-4 bg-gray-100 rounded-xl w-3/4" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── Error ── */
  if (error || !category) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-full mx-auto px-1 py-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
              <Package className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-800 text-base font-bold mb-1">
              {error || "Category not found"}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/category/create")}
                className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200"
              >
                Back to Categories
              </button>
              <button
                onClick={fetchCategoryDetails}
                className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── Main ── */
  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeSlideIn 0.3s ease forwards; }
      `}</style>

      <div className="w-full max-w-full mx-auto px-1 py-3 space-y-4 fade-in">
        {/* ── Breadcrumb / Back ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={() => navigate("/category/create")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#FF7B1D] text-sm font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Categories
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-800 truncate max-w-[180px]">
              {category.name}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* ── Main Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Card Header Bar (matches AllProduct table header) */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Category Details
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border
              ${
                category.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${category.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
              />
              {category.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
              {/* Image */}
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 p-1">
                  <img
                    src={category?.image?.url || category?.image || NO_IMAGE}
                    alt={category.name}
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      e.target.src = NO_IMAGE;
                    }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {category.name || "Unnamed Category"}
                </h1>

                {/* Code tag */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-mono px-2.5 py-1 rounded-lg">
                    <Hash className="w-3 h-3 text-[#FF7B1D]" />
                    {category.code || category._id || "N/A"}
                  </span>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {category.description || "No description available"}
                </p>
              </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-gray-100">
              <StatCard
                icon={Package}
                label="Total Products"
                value={category.productCount || 0}
                accent
              />
              <StatCard
                icon={Layers}
                label="Sub Categories"
                value={category.subCategoryCount || 0}
                accent
              />
              <StatCard
                icon={Calendar}
                label="Created"
                value={formatDate(category.createdAt)}
              />
              <StatCard
                icon={Calendar}
                label="Last Updated"
                value={formatDate(category.updatedAt)}
              />
            </div>
          </div>

          {/* ── Created By ── */}
          {category.createdBy && (
            <div className="px-6 pb-6 pt-0">
              <div className="pt-5 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Created By
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF7B1D] font-bold text-base">
                    {category.createdBy.name?.charAt(0).toUpperCase() || (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {category.createdBy.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {category.createdBy.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Sub Categories Table (if any) ── */}
        {category.subCategories?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Sub Categories
              </span>
              <span className="ml-auto text-xs text-gray-400 font-medium">
                {category.subCategories.length} items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90 w-12">
                      S.N
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {category.subCategories.map((sub, idx) => (
                    <tr
                      key={sub._id || idx}
                      className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    >
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-700">
                        {sub.name || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-gray-500 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                          {sub.code || sub._id || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
                          ${
                            sub.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sub.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                          />
                          {sub.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Top Selling Products Table (if any) ── */}
        {category.topSellingProducts?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                Top Selling Products
              </span>
              <span className="ml-auto text-xs text-gray-400 font-medium">
                {category.topSellingProducts.length} items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90 w-12">
                      S.N
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90">
                      Sale Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {category.topSellingProducts.map((prod, idx) => (
                    <tr
                      key={prod._id || idx}
                      className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    >
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-700">
                        {prod.productName || prod.name || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                        ₹{(prod.salePrice || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
                          ${
                            (prod.status || "").toLowerCase() === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100"
                              : (prod.status || "").toLowerCase() === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100"
                                : "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full
                            ${
                              (prod.status || "").toLowerCase() === "approved"
                                ? "bg-emerald-500"
                                : (prod.status || "").toLowerCase() ===
                                    "pending"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          {prod.status
                            ? prod.status.charAt(0).toUpperCase() +
                              prod.status.slice(1)
                            : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={category}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        categoryName={category?.name}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
};

export default CategoryView;
