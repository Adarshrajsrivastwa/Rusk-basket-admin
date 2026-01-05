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

const API_URL = "https://rush-basket.onrender.com/api/v1/categories";

const AddCategoryModal = ({ isOpen, onClose, onSuccess, editData = null }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const animationDuration = 300;
  const closeTimerRef = useRef(null);

  // Form states
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form on edit
  useEffect(() => {
    if (editData && isOpen) {
      setCategoryName(editData.name || "");
      setCategoryDesc(editData.description || "");
      setImagePreview(editData.image || null);
    } else if (!isOpen) {
      resetForm();
    }
  }, [editData, isOpen]);

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

  // Image preview (local file)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    setCategoryImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    // Prepare JSON payload
    const payload = {
      name: categoryName.trim(),
      description: categoryDesc.trim(),
      image: imagePreview || "", // URL string
    };

    try {
      setLoading(true);
      const method = editData ? "PUT" : "POST";
      const url = editData
        ? `${API_URL}/${editData.id || editData._id}`
        : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Server error:", data);
        throw new Error(data.message || "Something went wrong");
      }

      // Pass new or updated category to parent
      const categoryObj = { ...data.data, id: data.data._id };
      onSuccess && onSuccess(categoryObj);

      resetForm();
      handleClose();
      alert(`Category ${editData ? "updated" : "added"} successfully`);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Something went wrong");
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
        className={`relative bg-white rounded-sm shadow-xl w-[600px] p-4 transform transition-all duration-300
        ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-3"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-orange-500"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-3 border-b-4 border-orange-400 inline-block">
          {editData ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-3">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Category Name *</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border border-orange-400 px-2 py-1 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              className="w-full border border-orange-400 px-2 py-1 text-sm h-16 resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-medium">
              Category Image (100×100)
            </label>
            <div className="flex gap-3 items-start">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm file:bg-orange-500 file:text-white file:px-4 file:py-1.5"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-[100px] h-[100px] border object-cover"
                />
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-500 text-white px-6 py-1.5 text-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : editData ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
