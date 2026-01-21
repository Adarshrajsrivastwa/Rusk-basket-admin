// // src/components/AddCategoryModal.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";

// const AddCategoryModal = ({ isOpen, onClose }) => {
//   const [mounted, setMounted] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const animationDuration = 300;
//   const closeTimerRef = useRef(null);

//   // Form states
//   const [categoryName, setCategoryName] = useState("");
//   const [categoryDesc, setCategoryDesc] = useState("");
//   const [categoryUpdate, setCategoryUpdate] = useState("");
//   const [categoryTag, setCategoryTag] = useState("");

//   // Handle open/close animation
//   useEffect(() => {
//     if (isOpen) {
//       if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
//       setMounted(true);
//       requestAnimationFrame(() => setVisible(true));
//     } else if (mounted) {
//       setVisible(false);
//       closeTimerRef.current = setTimeout(() => {
//         setMounted(false);
//         closeTimerRef.current = null;
//       }, animationDuration);
//     }

//     return () => {
//       if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
//     };
//   }, [isOpen, mounted]);

//   // Close handler
//   const handleClose = () => {
//     setVisible(false);
//     closeTimerRef.current = setTimeout(() => {
//       if (onClose) onClose();
//       closeTimerRef.current = null;
//     }, animationDuration);
//   };

//   // Submit handler
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newCategory = {
//       name: categoryName.trim(),
//       description: categoryDesc.trim(),
//       updateInfo: categoryUpdate.trim(),
//       tag: categoryTag.trim(),
//     };

//     if (!newCategory.name) {
//       alert("Please enter a category name.");
//       return;
//     }

//     console.log("🟧 New Category Added:", newCategory);

//     // Reset form
//     setCategoryName("");
//     setCategoryDesc("");
//     setCategoryUpdate("");
//     setCategoryTag("");

//     handleClose();
//   };

//   if (!mounted) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Overlay - white with 50% transparency */}
//       <div
//         onClick={handleClose}
//         className={`absolute inset-0 bg-white transition-opacity duration-300 ${
//           visible ? "opacity-50" : "opacity-0"
//         }`}
//       />

//       {/* Modal */}
//       <div
//         className={`relative bg-white rounded-sm shadow-xl w-[600px] h-auto p-4 transform transition-all duration-300
//         ${
//           visible
//             ? "opacity-100 scale-100 translate-y-0"
//             : "opacity-0 scale-95 translate-y-3"
//         }`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={handleClose}
//           className="absolute top-3 right-3 text-orange-500 hover:text-orange-600"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         {/* Title */}
//         <h2 className="text-lg font-semibold mb-3 text-black pb-1 inline-block border-b-4 border-orange-400">
//           Add Category
//         </h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-2">
//           {/* Category Name */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Category Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter Category Name"
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               required
//             />
//           </div>

//           {/* Category Description */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Category Description
//             </label>
//             <textarea
//               placeholder="Enter Category Description"
//               className="w-full border border-orange-400 rounded-sm px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 h-16 resize-none"
//               value={categoryDesc}
//               onChange={(e) => setCategoryDesc(e.target.value)}
//             ></textarea>
//           </div>

//           {/* Category Update */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Category Update
//             </label>
//             <input
//               type="text"
//               placeholder="Enter Category Update Info"
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
//               value={categoryUpdate}
//               onChange={(e) => setCategoryUpdate(e.target.value)}
//             />
//           </div>

//           {/* Category Tag */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Category Tag
//             </label>
//             <textarea
//               placeholder="Enter Category Tag"
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 h-16 resize-none"
//               value={categoryTag}
//               onChange={(e) => setCategoryTag(e.target.value)}
//             ></textarea>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end mt-1">
//             <button
//               type="submit"
//               className="bg-orange-500 text-white px-5 py-1.5 text-sm font-medium hover:bg-orange-600 transition"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCategoryModal;
// src/components/AddCategoryModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { BASE_URL } from "../api/api";

const API_URL = `${BASE_URL}/api/category`;

const AddCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  isEdit = false,
  categoryData = null,
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const animationDuration = 300;
  const closeTimerRef = useRef(null);

  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate edit data
  useEffect(() => {
    if (categoryData && isOpen) {
      setCategoryName(categoryData.category || categoryData.name || "");
      setCategoryDesc(categoryData.rawData?.description || "");
      setImagePreview(categoryData.image || null);
    } else if (!isOpen) {
      resetForm();
    }
  }, [categoryData, isOpen]);

  const resetForm = () => {
    setCategoryName("");
    setCategoryDesc("");
    setCategoryImage(null);
    setImagePreview(null);
  };

  // Open / close animation
  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else if (mounted) {
      setVisible(false);
      closeTimerRef.current = setTimeout(() => {
        setMounted(false);
        closeTimerRef.current = null;
      }, animationDuration);
    }

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [isOpen, mounted]);

  const handleClose = () => {
    setVisible(false);
    closeTimerRef.current = setTimeout(() => {
      onClose && onClose();
      closeTimerRef.current = null;
    }, animationDuration);
  };

  // Image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }

    setCategoryImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    if (!categoryImage && !isEdit) {
      alert("Category image is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", categoryName.trim());
      formData.append("description", categoryDesc.trim());

      if (categoryImage) {
        formData.append("image", categoryImage);
      }

      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const method = isEdit ? "PUT" : "POST";

      // FIXED: Removed /update from the path for PUT request
      const url = isEdit
        ? `${API_URL}/${categoryData.id}`
        : `${API_URL}/create`;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: headers,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save category");
      }

      alert(`Category ${isEdit ? "updated" : "created"} successfully`);

      // Call onSuccess with the response data
      if (onSuccess) {
        onSuccess(data.data);
      }

      resetForm();
      handleClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          visible ? "opacity-40" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded shadow-xl w-[600px] max-w-[95%] p-4 transform transition-all duration-300 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-y-3"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-orange-500 hover:text-orange-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-3 border-b-4 border-orange-400 inline-block">
          {isEdit ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:border-orange-400"
          />

          <textarea
            placeholder="Description"
            value={categoryDesc}
            onChange={(e) => setCategoryDesc(e.target.value)}
            className="w-full border px-3 py-2 h-20 rounded focus:outline-none focus:border-orange-400"
          />

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Category Image{" "}
              {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="preview"
                className="w-[100px] h-[100px] object-cover border rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setCategoryImage(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="border px-6 py-2 rounded hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50 hover:bg-orange-600"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
