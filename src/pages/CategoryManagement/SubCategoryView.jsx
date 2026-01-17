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
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

const API_BASE_URL = "http://46.202.164.93/api";

// Edit SubCategory Modal Component
const EditSubCategoryModal = ({
  isOpen,
  onClose,
  subCategory,
  onSave,
  categories,
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
      setFormData({
        name: subCategory.name,
        category: subCategory.category?._id || "",
        description: subCategory.description,
        isActive: subCategory.isActive,
      });
      setImagePreview(subCategory.image?.url || "");
    }
  }, [subCategory]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("isActive", formData.isActive);

    if (selectedFile) {
      formDataToSend.append("image", selectedFile);
    }

    await onSave(formDataToSend);
    setSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-black">Edit Sub Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Sub Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Parent Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Sub Category Image
            </label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="flex items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-[#FF7B1D]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setSelectedFile(null);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-[#FF7B1D] transition"
                >
                  <div className="text-center">
                    <Package className="w-8 h-8 text-[#FF7B1D] mx-auto mb-2" />
                    <p className="text-sm text-black font-medium">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to upload image"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-black rounded hover:bg-gray-100 transition font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-[#FF7B1D] text-white rounded hover:bg-orange-600 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
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

// Delete Confirmation Modal
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  subCategoryName,
  deleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-sm">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-black text-center mb-2">
            Delete Sub Category
          </h2>
          <p className="text-black text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#FF7B1D]">
              "{subCategoryName}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-black rounded hover:bg-gray-100 transition font-medium"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
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

const SubCategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subCategory, setSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Get authorization headers
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch subcategory details
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
        if (response.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (response.status === 404) {
          setError("Sub Category not found");
        } else {
          setError(result.message || "Failed to fetch subcategory");
        }
        return;
      }

      if (result.success) {
        setSubCategory(result.data);
      } else {
        setError("Failed to fetch subcategory");
      }
    } catch (err) {
      setError("Error connecting to server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/category`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategory/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to update subcategory");
        return;
      }

      if (result.success) {
        alert("Sub Category updated successfully!");
        fetchSubCategory(); // Refresh data
      } else {
        alert(result.message || "Failed to update subcategory");
      }
    } catch (err) {
      alert("Error updating subcategory: " + err.message);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
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

  const statusColors = {
    true: "bg-green-100 text-green-800 border-green-300",
    false: "bg-gray-100 text-gray-800 border-gray-300",
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#FF7B1D] mx-auto mb-4" />
              <p className="text-gray-600">Loading subcategory details...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-sm shadow-md p-10 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-black text-lg mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/category/create-sub")}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                Back to Sub Categories
              </button>
              <button
                onClick={fetchSubCategory}
                className="bg-[#FF7B1D] text-white px-6 py-2 rounded hover:bg-orange-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!subCategory) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-sm shadow-md p-10 text-center">
            <p className="text-black text-lg mb-4">Sub Category not found</p>
            <button
              onClick={() => navigate("/category/create-sub")}
              className="bg-[#FF7B1D] text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Back to Sub Categories
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl ml-4 mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <button
            onClick={() => navigate("/category/create-sub")}
            className="flex items-center gap-2 text-black hover:text-[#FF7B1D] transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Sub Categories</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-[#FF7B1D] text-white px-5 py-2 rounded hover:bg-orange-600 transition"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-sm shadow-md p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                {subCategory.image?.url ? (
                  <img
                    src={subCategory.image.url}
                    alt={subCategory.name}
                    className="w-32 h-32 rounded-sm object-cover border-2 border-[#FF7B1D] mx-auto md:mx-0"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-sm bg-gray-200 border-2 border-[#FF7B1D] mx-auto md:mx-0 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
                        {subCategory.name}
                      </h1>
                      <p className="text-black text-sm font-medium mb-1">
                        ID:{" "}
                        <span className="text-[#FF7B1D]">
                          {subCategory._id}
                        </span>
                      </p>
                      <p className="text-black text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#FF7B1D]" />
                        Parent:{" "}
                        <span className="font-semibold">
                          {subCategory.category?.name || "N/A"}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-sm text-sm font-semibold border ${
                        statusColors[subCategory.isActive]
                      }`}
                    >
                      {subCategory.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-black leading-relaxed">
                    {subCategory.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-gray-300">
                <div className="text-center bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Layers className="w-5 h-5 text-[#FF7B1D]" />
                    <p className="text-xl md:text-2xl font-bold text-black">
                      {subCategory.category?.name || "N/A"}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-black">
                    Parent Category
                  </p>
                </div>
                <div className="text-center bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs md:text-sm text-black font-medium mb-1">
                    Created
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black">
                    {new Date(subCategory.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs md:text-sm text-black font-medium mb-1">
                    Last Updated
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black">
                    {new Date(subCategory.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Created By Information */}
            <div className="bg-white rounded-sm shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4">Created By</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="text-black font-semibold">
                    {subCategory.createdBy?.name || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-black font-semibold">
                    {subCategory.createdBy?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-md p-6 sticky top-6 border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4 pb-3 border-b-2 border-[#FF7B1D]">
                Details
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Sub Category ID</p>
                  <p className="text-black font-semibold text-sm break-all">
                    {subCategory._id}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">
                    Parent Category ID
                  </p>
                  <p className="text-black font-semibold text-sm break-all">
                    {subCategory.category?._id || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p
                    className={`font-semibold text-sm ${
                      subCategory.isActive ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {subCategory.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Created At</p>
                  <p className="text-black font-semibold text-sm">
                    {new Date(subCategory.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Updated At</p>
                  <p className="text-black font-semibold text-sm">
                    {new Date(subCategory.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditSubCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subCategory={subCategory}
        onSave={handleSaveEdit}
        categories={categories}
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
