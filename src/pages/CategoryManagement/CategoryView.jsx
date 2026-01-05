import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Package, Layers, X } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

// Edit Category Modal Component
const EditCategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    status: "Active",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        description: category.description,
        status: category.status,
        image: category.image,
      });
      setImagePreview(category.image);
    }
  }, [category]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-black">Edit Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
              required
            />
          </div>

          {/* Description */}
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Category Image
            </label>
            <div className="space-y-3">
              {/* Image Preview */}
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
                      setFormData({ ...formData, image: "" });
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              {/* File Input */}
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

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF7B1D] text-black"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-black rounded hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-[#FF7B1D] text-white rounded hover:bg-orange-600 transition font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, categoryName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-black text-center mb-2">
            Delete Category
          </h2>
          <p className="text-black text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#FF7B1D]">
              "{categoryName}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-black rounded hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Simulated data - replace with actual API call
      const mockCategories = {
        CT101: {
          id: "CT101",
          image: "https://i.pravatar.cc/150",
          category: "Electronics",
          products: "120",
          subCategory: "15",
          status: "Active",
          description:
            "Electronic devices and accessories including smartphones, laptops, tablets, and more.",
          createdDate: "2024-01-15",
          lastUpdated: "2024-10-20",
          subCategories: [
            "Smartphones",
            "Laptops",
            "Tablets",
            "Cameras",
            "Audio Devices",
            "Smart Home",
            "Wearables",
            "Gaming Consoles",
            "Accessories",
            "Storage Devices",
            "Monitors",
            "Keyboards",
            "Mice",
            "Headphones",
            "Speakers",
          ],
          topProducts: [
            { name: "iPhone 15 Pro", sales: 450, stock: 85 },
            { name: "MacBook Air M2", sales: 320, stock: 42 },
            { name: "Samsung Galaxy S24", sales: 280, stock: 60 },
            { name: "Sony WH-1000XM5", sales: 195, stock: 120 },
            { name: "iPad Pro 12.9", sales: 165, stock: 38 },
          ],
        },
        CT102: {
          id: "CT102",
          image: "https://i.pravatar.cc/150",
          category: "Fashion",
          products: "80",
          subCategory: "12",
          status: "Inactive",
          description:
            "Trendy clothing, footwear, and fashion accessories for men, women, and children.",
          createdDate: "2024-02-10",
          lastUpdated: "2024-09-15",
          subCategories: [
            "Men's Clothing",
            "Women's Clothing",
            "Kids' Clothing",
            "Footwear",
            "Bags",
            "Jewelry",
            "Watches",
            "Sunglasses",
            "Belts",
            "Scarves",
            "Hats",
            "Activewear",
          ],
          topProducts: [
            { name: "Nike Air Max", sales: 210, stock: 95 },
            { name: "Levi's Jeans", sales: 180, stock: 150 },
            { name: "Adidas Hoodie", sales: 145, stock: 200 },
            { name: "Ray-Ban Sunglasses", sales: 130, stock: 75 },
            { name: "Leather Handbag", sales: 98, stock: 45 },
          ],
        },
      };

      setCategory(mockCategories[id] || mockCategories.CT101);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedData) => {
    // Update category with new data
    setCategory({
      ...category,
      ...updatedData,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
    alert("Category updated successfully!");
    // In real app, make API call here to save to backend
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Delete category logic
    alert(`Category "${category.category}" deleted successfully!`);
    setIsDeleteModalOpen(false);
    // Navigate back to categories list
    navigate("/category/create");
    // In real app, make API call here to delete from backend
  };

  const statusColors = {
    Active: "bg-green-100 text-green-800 border-green-300",
    Inactive: "bg-gray-100 text-gray-800 border-gray-300",
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="h-32 bg-gray-300 rounded mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!category) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-sm shadow-md p-10 text-center">
            <p className="text-black text-lg mb-4">Category not found</p>
            <button
              onClick={() => navigate("/category")}
              className="bg-[#FF7B1D] text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Back to Categories
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
            onClick={() => navigate("/category/create")}
            className="flex items-center gap-2 text-black hover:text-[#FF7B1D] transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Categories</span>
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
                <img
                  src={category.image}
                  alt={category.category}
                  className="w-32 h-32 rounded-sm object-cover border-2 border-[#FF7B1D] mx-auto md:mx-0"
                />
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
                        {category.category}
                      </h1>
                      <p className="text-black text-sm font-medium">
                        ID:{" "}
                        <span className="text-[#FF7B1D]">{category.id}</span>
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-sm text-sm font-semibold border ${
                        statusColors[category.status]
                      }`}
                    >
                      {category.status}
                    </span>
                  </div>
                  <p className="text-black leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-300">
                <div className="text-center bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Package className="w-5 h-5 text-[#FF7B1D]" />
                    <p className="text-xl md:text-2xl font-bold text-black">
                      {category.products}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-black">
                    Total Products
                  </p>
                </div>
                <div className="text-center bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Layers className="w-5 h-5 text-[#FF7B1D]" />
                    <p className="text-xl md:text-2xl font-bold text-black">
                      {category.subCategory}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-black">
                    Sub Categories
                  </p>
                </div>
                <div className="text-center bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs md:text-sm text-black font-medium mb-1">
                    Created
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black">
                    {new Date(category.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs md:text-sm text-black font-medium mb-1">
                    Last Updated
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black">
                    {new Date(category.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-sm shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4">
                Top Selling Products
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#FF7B1D]">
                      <th className="text-left py-3 px-2 font-semibold text-white">
                        Rank
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-white">
                        Product Name
                      </th>
                      <th className="text-center py-3 px-2 font-semibold text-white">
                        Sales
                      </th>
                      <th className="text-center py-3 px-2 font-semibold text-white">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.topProducts.map((product, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-[#FF7B1D] text-white text-xs font-bold">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium text-black">
                          {product.name}
                        </td>
                        <td className="py-3 px-2 text-center text-black font-medium">
                          {product.sales}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              product.stock < 50
                                ? "bg-red-100 text-red-700"
                                : product.stock < 100
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Sub Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-md p-6 sticky top-6 border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4 pb-3 border-b-2 border-[#FF7B1D]">
                Sub Categories
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {category.subCategories.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white rounded hover:bg-gray-50 transition cursor-pointer border border-gray-300"
                  >
                    <span className="text-sm font-medium text-black">
                      {sub}
                    </span>
                    <span className="text-xs text-white bg-[#FF7B1D] px-2 py-1 rounded font-medium">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
        categoryName={category?.category}
      />
    </DashboardLayout>
  );
};

export default CategoryView;
