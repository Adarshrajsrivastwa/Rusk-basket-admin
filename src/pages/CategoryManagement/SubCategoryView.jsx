import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Layers,
  X,
  Tag,
  Loader2,
  ChevronRight,
  Calendar,
  Hash,
  User,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api`;

/* ─────────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────────── */
const EditSubCategoryModal = ({
  isOpen,
  onClose,
  subCategory,
  onSave,
  categories,
  loadingCategories,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subCategory) {
      const categoryId =
        subCategory.category?._id?.toString() ||
        subCategory.category?._id ||
        subCategory.category ||
        "";
      setFormData({
        name: subCategory.name || "",
        category: categoryId,
        description: subCategory.description || "",
        isActive:
          subCategory.isActive !== undefined ? subCategory.isActive : true,
      });
      setImagePreview(subCategory.image?.url || "");
    }
  }, [subCategory]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("isActive", formData.isActive);
    if (selectedFile) formDataToSend.append("image", selectedFile);
    await onSave(formDataToSend);
    setSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Edit Sub Category
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Update subcategory details
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Sub Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF7B1D] transition-all"
              placeholder="Enter sub category name"
              required
              disabled={saving}
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Parent Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF7B1D] transition-all"
              required
              disabled={saving}
            >
              <option value="">Select Category</option>
              {loadingCategories ? (
                <option value="" disabled>
                  Loading categories...
                </option>
              ) : categories.length === 0 ? (
                <option value="" disabled>
                  No categories available
                </option>
              ) : (
                categories.map((cat, index) => {
                  let catId = cat._id || String(index);
                  if (typeof catId === "object" && catId !== null) {
                    catId =
                      catId.$oid ||
                      catId.toString?.() ||
                      catId._id ||
                      catId.id ||
                      String(index);
                  }
                  if (String(catId) === "[object Object]" || !catId)
                    catId = String(index);
                  const finalId = String(catId);
                  const catName =
                    cat.name || cat.categoryName || `Category ${index + 1}`;
                  return (
                    <option key={finalId} value={finalId}>
                      {catName}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF7B1D] transition-all resize-none"
              placeholder="Enter description"
              required
              disabled={saving}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Sub Category Image
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
                    onClick={() => {
                      setImagePreview("");
                      setSelectedFile(null);
                    }}
                    disabled={saving}
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
                id="sub-image-upload"
                disabled={saving}
              />
              <label
                htmlFor="sub-image-upload"
                className={`flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl transition-all ${saving ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[#FF7B1D] hover:bg-orange-50"}`}
              >
                <div className="text-center">
                  <Package className="w-7 h-7 text-[#FF7B1D] mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-gray-700">
                    {selectedFile ? selectedFile.name : "Click to upload image"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.isActive ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "true",
                })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF7B1D] transition-all"
              required
              disabled={saving}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-orange-200"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
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
  subCategoryName,
  deleting,
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
            Delete Sub Category
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#FF7B1D]">
              "{subCategoryName}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 px-6 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
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
        style={{ width: 18, height: 18 }}
        className={accent ? "text-[#FF7B1D]" : "text-gray-500"}
      />
    </div>
    <p className="text-sm font-bold text-gray-800 text-center leading-tight">
      {value}
    </p>
    <p className="text-xs text-gray-500 font-medium text-center leading-tight">
      {label}
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   DETAIL ROW (right panel)
───────────────────────────────────────────── */
const DetailRow = ({ label, value, mono = false }) => (
  <div className="flex flex-col gap-0.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
    <p className="text-xs text-gray-400 font-medium">{label}</p>
    <p
      className={`text-sm font-semibold text-gray-800 break-all ${mono ? "font-mono" : ""}`}
    >
      {value || "N/A"}
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const SubCategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subCategory, setSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    fetchSubCategory();
    fetchCategories();
  }, [id]);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/subcategory/${id}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401)
          setError("Unauthorized. Please login again.");
        else if (response.status === 404) setError("Sub Category not found");
        else setError(result.message || "Failed to fetch subcategory");
        return;
      }
      if (result.success) setSubCategory(result.data);
      else setError("Failed to fetch subcategory");
    } catch (err) {
      setError("Error connecting to server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch(`${API_BASE_URL}/category`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      let categoriesList = [];
      if (result.success) {
        if (Array.isArray(result.data)) categoriesList = result.data;
        else if (Array.isArray(result.categories))
          categoriesList = result.categories;
        else if (Array.isArray(result)) categoriesList = result;
      } else if (Array.isArray(result)) {
        categoriesList = result;
      }
      const normalizedCategories = categoriesList.map((cat, index) => {
        let catId = "";
        if (cat._id) {
          if (typeof cat._id === "string") catId = cat._id;
          else if (typeof cat._id === "object" && cat._id !== null) {
            if (cat._id.$oid) catId = cat._id.$oid;
            else {
              try {
                catId = cat._id.toString();
                if (catId === "[object Object]") {
                  catId =
                    cat._id._id ||
                    cat._id.id ||
                    cat._id.str ||
                    cat._id.value ||
                    "";
                  if (!catId && cat._id.toHexString)
                    catId = cat._id.toHexString();
                  if (!catId || catId === "[object Object]") {
                    const m = JSON.stringify(cat._id).match(
                      /"([0-9a-fA-F]{24})"/,
                    );
                    catId = m ? m[1] : String(index);
                  }
                }
              } catch {
                catId = String(index);
              }
            }
          } else catId = String(cat._id);
        } else if (cat.id) {
          catId = typeof cat.id === "string" ? cat.id : String(cat.id);
        } else catId = String(index);
        if (
          catId === "[object Object]" ||
          !catId ||
          catId === "undefined" ||
          catId === "null"
        )
          catId = String(index);
        return {
          ...cat,
          _id: catId,
          name: cat.name || cat.categoryName || `Category ${index + 1}`,
        };
      });
      setCategories(normalizedCategories);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSaveEdit = async (formDataToSend) => {
    try {
      const categoryValue = formDataToSend.get("category");
      if (categoryValue && !/^[0-9a-fA-F]{24}$/.test(categoryValue)) {
        alert("Please select a valid category.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/subcategory/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { ...getAuthHeaders() },
        body: formDataToSend,
      });
      const result = await response.json();
      if (!response.ok) {
        if (
          result.errors &&
          Array.isArray(result.errors) &&
          result.errors.length > 0
        ) {
          alert(
            result.errors.map((e) => e.msg || e.message).join("\n") ||
              "Validation failed.",
          );
        } else
          alert(
            result.message || result.error || "Failed to update subcategory",
          );
        return;
      }
      if (result.success) {
        alert("Sub Category updated successfully!");
        fetchSubCategory();
      } else alert(result.message || "Failed to update subcategory");
    } catch (err) {
      alert("Error updating subcategory: " + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`${API_BASE_URL}/subcategory/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.message || "Failed to delete subcategory");
        setDeleting(false);
        return;
      }
      if (result.success) {
        alert(`Sub Category "${subCategory.name}" deleted successfully!`);
        setIsDeleteModalOpen(false);
        navigate("/category/create-sub");
      } else {
        alert(result.message || "Failed to delete subcategory");
        setDeleting(false);
      }
    } catch (err) {
      alert("Error deleting subcategory: " + err.message);
      setDeleting(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };
  const formatDateTime = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const NO_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='13' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  /* ── Loading ── */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-full mx-auto px-1 py-3">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded-xl w-48" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <div className="flex gap-5">
                    <div className="w-28 h-28 bg-gray-100 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-7 bg-gray-100 rounded-xl w-1/2" />
                      <div className="h-4 bg-gray-100 rounded-xl w-1/4" />
                      <div className="h-4 bg-gray-100 rounded-xl w-3/4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="h-6 bg-gray-100 rounded-xl w-32 mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-gray-100 rounded-xl" />
                    <div className="h-16 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                <div className="h-6 bg-gray-100 rounded-xl w-24 mb-2" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── Error / Not Found ── */
  if (error || !subCategory) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-full mx-auto px-1 py-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
              <Package className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-800 text-base font-bold mb-1">
              {error || "Sub Category not found"}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              The sub category you're looking for doesn't exist or has been
              removed.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/category/create-sub")}
                className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200"
              >
                Back to Sub Categories
              </button>
              <button
                onClick={fetchSubCategory}
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
        {/* ── Breadcrumb / Actions ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={() => navigate("/category/create-sub")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#FF7B1D] text-sm font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Sub Categories
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-800 truncate max-w-[200px]">
              {subCategory.name}
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

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT — Main info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Basic Information Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Card header bar */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <span className="text-sm font-semibold text-gray-700">
                    Sub Category Details
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border
                  ${
                    subCategory.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${subCategory.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                  />
                  {subCategory.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="p-6">
                {/* Image + Info row */}
                <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                  {/* Image */}
                  <div className="shrink-0 mx-auto md:mx-0">
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 p-1">
                      <img
                        src={subCategory.image?.url || NO_IMAGE}
                        alt={subCategory.name}
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
                      {subCategory.name}
                    </h1>

                    {/* Code tag */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-mono px-2.5 py-1 rounded-lg">
                        <Hash className="w-3 h-3 text-[#FF7B1D]" />
                        {subCategory.code || subCategory._id || "N/A"}
                      </span>
                      {subCategory.category?.name && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
                          <Tag className="w-3 h-3" />
                          {subCategory.category.name}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed">
                      {subCategory.description || "No description available"}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                  <StatCard
                    icon={Layers}
                    label="Parent Category"
                    value={subCategory.category?.name || "N/A"}
                    accent
                  />
                  <StatCard
                    icon={Calendar}
                    label="Created"
                    value={formatDate(subCategory.createdAt)}
                  />
                  <StatCard
                    icon={Calendar}
                    label="Last Updated"
                    value={formatDate(subCategory.updatedAt)}
                  />
                </div>
              </div>
            </div>

            {/* Created By Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  Created By
                </span>
              </div>
              <div className="p-6">
                {subCategory.createdBy ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF7B1D] font-bold text-lg shrink-0">
                      {subCategory.createdBy.name?.charAt(0).toUpperCase() || (
                        <User style={{ width: 18, height: 18 }} />
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-0.5">Name</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {subCategory.createdBy.name || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-0.5">Email</p>
                        <p className="text-sm font-semibold text-gray-800 break-all">
                          {subCategory.createdBy.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No creator info available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Details panel (1 col) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
              {/* Card header bar */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                <span className="text-sm font-bold text-white tracking-wide">
                  Details
                </span>
              </div>

              <div className="p-4 space-y-3">
                <DetailRow
                  label="Sub Category Code"
                  value={subCategory.code || subCategory._id}
                  mono
                />
                <DetailRow
                  label="Parent Category Code"
                  value={
                    subCategory.category?.code ||
                    subCategory.category?._id ||
                    "N/A"
                  }
                  mono
                />
                <div className="flex flex-col gap-0.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">Status</p>
                  <span
                    className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-semibold border mt-0.5
                    ${
                      subCategory.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${subCategory.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                    />
                    {subCategory.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <DetailRow
                  label="Created At"
                  value={formatDateTime(subCategory.createdAt)}
                />
                <DetailRow
                  label="Updated At"
                  value={formatDateTime(subCategory.updatedAt)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <EditSubCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subCategory={subCategory}
        onSave={handleSaveEdit}
        categories={categories}
        loadingCategories={loadingCategories}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        subCategoryName={subCategory?.name}
        deleting={deleting}
      />
    </DashboardLayout>
  );
};

export default SubCategoryView;
