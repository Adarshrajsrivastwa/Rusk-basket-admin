// // src/components/AddSubCategoryModal.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";

// const AddSubCategoryModal = ({ isOpen, onClose }) => {
//   const [mounted, setMounted] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const animationDuration = 300;
//   const closeTimerRef = useRef(null);

//   const [category, setCategory] = useState("");
//   const [subCategoryName, setSubCategoryName] = useState("");
//   const [subCategoryDesc, setSubCategoryDesc] = useState("");
//   const [subCategoryImage, setSubCategoryImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const categoryOptions = [
//     "Electronics",
//     "Clothing",
//     "Footwear",
//     "Accessories",
//     "Home & Kitchen",
//     "Beauty",
//   ];

//   useEffect(() => {
//     if (isOpen) {
//       if (closeTimerRef.current) {
//         clearTimeout(closeTimerRef.current);
//         closeTimerRef.current = null;
//       }
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

//   const handleClose = () => {
//     setVisible(false);
//     closeTimerRef.current = setTimeout(() => {
//       if (onClose) onClose();
//       closeTimerRef.current = null;
//     }, animationDuration);
//   };

//   // Handle image upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         alert("Please upload an image file.");
//         return;
//       }

//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//       setSubCategoryImage(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = {
//       category,
//       subCategoryName,
//       subCategoryDesc,
//       subCategoryImage,
//       imagePreview,
//     };
//     console.log("🟧 Sub Category Added:", formData);

//     // Reset form
//     setCategory("");
//     setSubCategoryName("");
//     setSubCategoryDesc("");
//     setSubCategoryImage(null);
//     setImagePreview(null);

//     handleClose();
//   };

//   if (!mounted) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Overlay (white 50% transparent) */}
//       <div
//         className={`absolute inset-0 bg-white transition-opacity duration-300 ${
//           visible ? "opacity-50" : "opacity-0"
//         }`}
//         onClick={handleClose}
//       />

//       {/* Modal */}
//       <div
//         className={`relative bg-white rounded-sm shadow-2xl w-[580px] h-auto p-4 transform transition-all duration-300 ease-out
//         ${
//           visible
//             ? "opacity-100 scale-100 translate-y-0"
//             : "opacity-0 scale-95 translate-y-5"
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
//         <h2 className="text-md font-semibold mb-2 text-black pb-1 inline-block border-b-4 border-orange-400">
//           Add Sub Category
//         </h2>

//         {/* Form */}
//         <div className="space-y-1.5">
//           {/* Select Category Dropdown */}
//           <div>
//             <label className="block text-sm font-medium mb-0.5">
//               Select Category
//             </label>
//             <select
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               required
//             >
//               <option value="">-- Choose Category --</option>
//               {categoryOptions.map((cat, idx) => (
//                 <option key={idx} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Sub Category Name */}
//           <div>
//             <label className="block text-sm font-medium mb-0.5">
//               Sub Category Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter Sub Category Name"
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
//               value={subCategoryName}
//               onChange={(e) => setSubCategoryName(e.target.value)}
//               required
//             />
//           </div>

//           {/* Sub Category Description */}
//           <div>
//             <label className="block text-sm font-medium mb-0.5">
//               Sub Category Description
//             </label>
//             <textarea
//               placeholder="Enter Sub Category Description"
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 h-16 resize-none"
//               value={subCategoryDesc}
//               onChange={(e) => setSubCategoryDesc(e.target.value)}
//             ></textarea>
//           </div>

//           {/* Sub Category Image */}
//           <div>
//             <label className="block text-sm font-medium mb-0.5">
//               Sub Category Image (100px × 100px)
//             </label>
//             <div className="flex items-start gap-3">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="text-sm file:mr-3 file:py-1.5 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer"
//               />
//               {imagePreview && (
//                 <div className="border-2 border-orange-400 rounded-sm p-1">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-[100px] h-[100px] object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end mt-1">
//             <button
//               onClick={handleSubmit}
//               className="bg-orange-500 text-white px-5 py-1.5 text-sm font-medium hover:bg-orange-600 transition"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSubCategoryModal;
// import React, { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";

// const AddSubCategoryModal = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   editData = null,
// }) => {
//   const [mounted, setMounted] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const animationDuration = 300;
//   const closeTimerRef = useRef(null);

//   // Initialize with dummy data directly
//   const [categories, setCategories] = useState([
//     { _id: "cat1", name: "Electronics" },
//     { _id: "cat2", name: "Fashion" },
//     { _id: "cat3", name: "Home & Kitchen" },
//     { _id: "cat4", name: "Books" },
//     { _id: "cat5", name: "Sports" },
//   ]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [category, setCategory] = useState("");
//   const [subCategoryName, setSubCategoryName] = useState("");
//   const [subCategoryDesc, setSubCategoryDesc] = useState("");
//   const [subCategoryImage, setSubCategoryImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   // ================= FETCH CATEGORIES =================
//   const loadCategories = async () => {
//     setLoadingCategories(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/home/sub-categories`, {
//         headers: {
//           Authorization: `Bearer ${AUTH_TOKEN}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch categories");
//       const data = await res.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error loading categories:", error);
//       // Keep dummy data if API fails
//       console.log("Using dummy category data");
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   // ================= LOAD EDIT DATA =================
//   useEffect(() => {
//     if (editData) {
//       setCategory(editData.categoryId || editData.category?._id || "");
//       setSubCategoryName(editData.name || "");
//       setSubCategoryDesc(editData.description || "");
//       setImagePreview(editData.image || null);
//       setSubCategoryImage(null);
//     } else {
//       // Reset form for add mode
//       setCategory("");
//       setSubCategoryName("");
//       setSubCategoryDesc("");
//       setImagePreview(null);
//       setSubCategoryImage(null);
//     }
//   }, [editData]);

//   useEffect(() => {
//     if (isOpen) {
//       // Only load categories from API if needed, dummy data already exists
//       if (categories.length === 5) {
//         // We have dummy data, try to load real data in background
//         loadCategories();
//       }
//       if (closeTimerRef.current) {
//         clearTimeout(closeTimerRef.current);
//         closeTimerRef.current = null;
//       }
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

//   const handleClose = () => {
//     setVisible(false);
//     closeTimerRef.current = setTimeout(() => {
//       if (onClose) onClose();
//       closeTimerRef.current = null;
//     }, animationDuration);
//   };

//   // ================= HANDLE IMAGE CHANGE =================
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       alert("Please upload an image file.");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//     setSubCategoryImage(file);
//   };

//   // ================= CONVERT IMAGE TO BASE64 =================
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();

//     // Trim and validate category
//     const categoryValue = category?.trim();
//     if (!categoryValue || categoryValue === "") {
//       alert("Please select a category");
//       return;
//     }

//     if (!subCategoryName.trim()) {
//       alert("Please enter sub category name");
//       return;
//     }

//     if (!editData && !subCategoryImage) {
//       alert("Please upload an image");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const payload = {
//         categoryId: categoryValue,
//         name: subCategoryName.trim(),
//         description: subCategoryDesc.trim(),
//       };

//       // Add image only if new image is selected
//       if (subCategoryImage) {
//         const imageBase64 = await fileToBase64(subCategoryImage);
//         payload.image = imageBase64;
//       }

//       let res;
//       if (editData) {
//         // UPDATE existing subcategory
//         res = await fetch(
//           `${API_BASE_URL}/api/v1/home/sub-categories/${editData._id}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${AUTH_TOKEN}`,
//             },
//             body: JSON.stringify(payload),
//           }
//         );
//       } else {
//         // CREATE new subcategory
//         res = await fetch(`${API_BASE_URL}/api/v1/home/sub-categories`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AUTH_TOKEN}`,
//           },
//           body: JSON.stringify(payload),
//         });
//       }

//       if (!res.ok) {
//         let errorMessage = "Failed to save sub category";
//         try {
//           const errorData = await res.json();
//           errorMessage =
//             errorData.message || errorData.error || JSON.stringify(errorData);
//           console.error("API Error Response:", errorData);
//         } catch (parseError) {
//           errorMessage = `HTTP ${res.status}: ${res.statusText}`;
//           console.error("API Error:", errorMessage);
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await res.json();
//       console.log(
//         editData ? "✅ Sub Category Updated:" : "✅ Sub Category Added:",
//         data
//       );

//       // Reset form
//       setCategory("");
//       setSubCategoryName("");
//       setSubCategoryDesc("");
//       setSubCategoryImage(null);
//       setImagePreview(null);

//       if (onSuccess) onSuccess();
//       handleClose();
//     } catch (error) {
//       console.error("Error saving sub category:", error);
//       alert(error.message || "Failed to save sub category");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Overlay */}
//       <div
//         className={`absolute inset-0 bg-white transition-opacity duration-300 ${
//           visible ? "opacity-50" : "opacity-0"
//         }`}
//         onClick={handleClose}
//       />

//       {/* Modal */}
//       <div
//         className={`relative bg-white rounded-sm shadow-2xl w-[580px] h-auto p-4 transform transition-all duration-300 ease-out
//         ${
//           visible
//             ? "opacity-100 scale-100 translate-y-0"
//             : "opacity-0 scale-95 translate-y-5"
//         }`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={handleClose}
//           className="absolute top-3 right-3 text-orange-500 hover:text-orange-600"
//           disabled={submitting}
//         >
//           <X className="w-5 h-5" />
//         </button>

//         {/* Title */}
//         <h2 className="text-md font-semibold mb-2 text-black pb-1 inline-block border-b-4 border-orange-400">
//           {editData ? "Edit Sub Category" : "Add Sub Category"}
//         </h2>

//         {/* Form */}
//         <div className="space-y-1.5">
//           {/* Select Category Dropdown */}
//           <div>
//             <label className="block text-sm font-medium mb-0.5">
//               Select Category ({categories.length} available)
//             </label>
//             <select
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
//               value={category}
//               onChange={(e) => {
//                 console.log("Selected category:", e.target.value);
//                 setCategory(e.target.value);
//               }}
//               disabled={loadingCategories || submitting}
//             >
//               <option value="">-- Choose Category --</option>
//               <option value="cat1">Electronics</option>
//               <option value="cat2">Fashion</option>
//               <option value="cat3">Home & Kitchen</option>
//               <option value="cat4">Books</option>
//               <option value="cat5">Sports</option>
//             </select>
//           </div>

//           {/* Sub Category Name */}
//           <div>
//             <label className="block text-sm font-medium mb-0.5">
//               Sub Category Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter Sub Category Name"
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
//               value={subCategoryName}
//               onChange={(e) => setSubCategoryName(e.target.value)}
//               disabled={submitting}
//             />
//           </div>

//           {/* Sub Category Description */}
//           <div>
//             <label className="block text-sm font-medium mb-0.5">
//               Sub Category Description
//             </label>
//             <textarea
//               placeholder="Enter Sub Category Description"
//               className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 h-16 resize-none"
//               value={subCategoryDesc}
//               onChange={(e) => setSubCategoryDesc(e.target.value)}
//               disabled={submitting}
//             ></textarea>
//           </div>

//           {/* Sub Category Image */}
//           <div>
//             <label className="block text-sm font-medium mb-0.5">
//               Sub Category Image (100px × 100px)
//               {editData && (
//                 <span className="text-xs text-gray-500 ml-2">
//                   (Upload new to replace)
//                 </span>
//               )}
//             </label>
//             <div className="flex items-start gap-3">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="text-sm file:mr-3 file:py-1.5 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer"
//                 disabled={submitting}
//               />
//               {imagePreview && (
//                 <div className="border-2 border-orange-400 rounded-sm p-1">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-[100px] h-[100px] object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end mt-1">
//             <button
//               onClick={handleSubmit}
//               className="bg-orange-500 text-white px-5 py-1.5 text-sm font-medium hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//               disabled={submitting}
//             >
//               {submitting
//                 ? editData
//                   ? "Updating..."
//                   : "Submitting..."
//                 : editData
//                 ? "Update"
//                 : "Submit"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSubCategoryModal;
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { BASE_URL } from "../api/api";

// ─── Helper: extract a valid 24-char hex ObjectId from any format ──────────
const extractId = (id) => {
  if (!id) return "";
  if (typeof id === "string") {
    if (/^[0-9a-fA-F]{24}$/.test(id)) return id;
  }
  if (typeof id === "object" && id !== null) {
    if (id.$oid && /^[0-9a-fA-F]{24}$/.test(id.$oid)) return id.$oid;
    if (typeof id.toHexString === "function") {
      try {
        const h = id.toHexString();
        if (/^[0-9a-fA-F]{24}$/.test(h)) return h;
      } catch (_) {}
    }
    for (const key of ["_id", "id"]) {
      if (id[key] && /^[0-9a-fA-F]{24}$/.test(String(id[key])))
        return String(id[key]);
    }
    try {
      const m = JSON.stringify(id).match(/"([0-9a-fA-F]{24})"/);
      if (m) return m[1];
    } catch (_) {}
  }
  return "";
};

const AddSubCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  // ── Edit mode props ──────────────────────────────────────────────────────
  isEdit = false,
  subCategoryData = null,
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const animationDuration = 300;
  const closeTimerRef = useRef(null);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDesc, setSubCategoryDesc] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState(null); // new File
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(""); // URL from backend
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // ─── Fetch categories ────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}/api/category`, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();

      let categoriesList = [];
      if (Array.isArray(data)) categoriesList = data;
      else if (data.data && Array.isArray(data.data))
        categoriesList = data.data;
      else if (data.categories && Array.isArray(data.categories))
        categoriesList = data.categories;

      const normalized = categoriesList.map((cat, index) => {
        const id = extractId(cat._id || cat.id) || String(index);
        const name =
          cat.name ||
          cat.categoryName ||
          cat.category ||
          `Category ${index + 1}`;
        return { ...cat, _id: id, name };
      });

      setCategories(normalized);
      return normalized; // return so we can use it in populateForm
    } catch (err) {
      console.error("Error fetching categories:", err);
      alert("Failed to load categories. Please try again.");
      return [];
    } finally {
      setLoadingCategories(false);
    }
  };

  // ─── Populate form when editing ─────────────────────────────────────────
  // Runs whenever the modal opens OR the subCategoryData changes.
  useEffect(() => {
    if (isOpen && isEdit && subCategoryData) {
      populateForm(subCategoryData);
    }
    if (isOpen && !isEdit) {
      resetForm();
    }
  }, [isOpen, isEdit, subCategoryData]);

  const populateForm = async (data) => {
    // Name
    setSubCategoryName(data.name || data.subCategoryName || "");

    // Description
    setSubCategoryDesc(data.description || data.subCategoryDesc || "");

    // Existing image — keep the URL so we can display it
    const imgUrl = data.image?.url || data.image || "";
    setExistingImageUrl(imgUrl);
    setImagePreview(imgUrl || null);
    setSubCategoryImage(null); // no new file yet

    // Category ID — the API may return a populated category object or just an ID
    let catId = "";
    if (data.category) {
      if (typeof data.category === "object") {
        catId = extractId(data.category._id || data.category) || "";
      } else {
        catId = extractId(data.category) || data.category;
      }
    }

    // If categories haven't loaded yet, wait for them first
    if (categories.length === 0) {
      const loaded = await fetchCategories();
      // After load, verify catId exists in the list
      const found = loaded.find((c) => c._id === catId);
      setCategoryId(found ? catId : "");
    } else {
      const found = categories.find((c) => c._id === catId);
      setCategoryId(found ? catId : "");
    }
  };

  // ─── Animation mount/unmount ─────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
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
      if (onClose) onClose();
      resetForm();
      closeTimerRef.current = null;
    }, animationDuration);
  };

  const resetForm = () => {
    setCategoryId("");
    setSubCategoryName("");
    setSubCategoryDesc("");
    setSubCategoryImage(null);
    setImagePreview(null);
    setExistingImageUrl("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setSubCategoryImage(file);
    setExistingImageUrl(""); // new file replaces the existing one
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Please select a category");
      return;
    }
    if (!subCategoryName.trim()) {
      alert("Please enter sub-category name");
      return;
    }

    // Image required only when adding; on edit the existing image can be kept
    if (!isEdit && !subCategoryImage) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);

    try {
      const categoryIdStr = String(categoryId).trim();
      if (!/^[0-9a-fA-F]{24}$/.test(categoryIdStr)) {
        alert("Please select a valid category.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", subCategoryName.trim());
      formData.append("description", subCategoryDesc.trim() || "");
      formData.append("category", categoryIdStr);

      if (subCategoryImage) {
        // User picked a new image
        formData.append("image", subCategoryImage);
      } else if (isEdit && existingImageUrl) {
        // Keep existing image — send the URL so backend knows to keep it
        formData.append("existingImage", existingImageUrl);
      }

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // ── Decide endpoint + method ─────────────────────────────────────────
      let url, method;
      if (isEdit && subCategoryData) {
        const subCatId =
          extractId(subCategoryData._id || subCategoryData.id) ||
          subCategoryData._id ||
          subCategoryData.id;
        url = `${BASE_URL}/api/subcategory/${subCatId}`;
        method = "PUT";
      } else {
        url = `${BASE_URL}/api/subcategory/create`;
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers, // NO Content-Type — browser sets multipart boundary
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors?.length) {
          throw new Error(
            result.errors.map((e) => e.msg || e.message).join("\n"),
          );
        }
        throw new Error(
          result.message ||
            result.error ||
            `Failed to ${isEdit ? "update" : "create"} sub-category`,
        );
      }

      alert(`Sub-category ${isEdit ? "updated" : "created"} successfully!`);
      if (onSuccess) onSuccess(result.data);
      resetForm();
      handleClose();
    } catch (err) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} sub-category:`,
        err,
      );
      alert(
        err.message ||
          `Failed to ${isEdit ? "update" : "create"} sub-category. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-300 ${
          visible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-sm shadow-2xl w-[580px] h-auto p-4 transform transition-all duration-300 ease-out ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-5"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-orange-500 hover:text-orange-600"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-md font-semibold mb-2 text-black pb-1 inline-block border-b-4 border-orange-400">
          {isEdit ? "Edit Sub Category" : "Add Sub Category"}
        </h2>

        <div className="space-y-1.5">
          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-0.5">
              Select Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white disabled:bg-gray-100"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={loadingCategories || loading}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "-- Choose Category --"}
              </option>
              {!loadingCategories && categories.length === 0 && (
                <option value="" disabled>
                  No categories available
                </option>
              )}
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category Name */}
          <div>
            <label className="block text-sm font-medium mb-0.5">
              Sub Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Sub Category Name"
              className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              required
              disabled={loading}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-0.5">
              Sub Category Description
            </label>
            <textarea
              placeholder="Enter Sub Category Description"
              className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 h-16 resize-none disabled:bg-gray-100"
              value={subCategoryDesc}
              onChange={(e) => setSubCategoryDesc(e.target.value)}
              disabled={loading}
              maxLength={500}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-0.5">
              Sub Category Image (100px × 100px){" "}
              {!isEdit && <span className="text-red-500">*</span>}
              {isEdit && (
                <span className="text-gray-400 font-normal text-xs ml-1">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <div className="flex items-start gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="text-sm file:mr-3 file:py-1.5 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer disabled:opacity-50"
              />
              {imagePreview && (
                <div className="border-2 border-orange-400 rounded-sm p-1 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-[100px] h-[100px] object-cover"
                  />
                  {/* Only allow removing if there's a new file or it's add mode */}
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setSubCategoryImage(null);
                      // In edit mode, revert to existing URL
                      if (isEdit && existingImageUrl) {
                        setImagePreview(existingImageUrl);
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    disabled={loading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {/* Badge to indicate new vs existing */}
                  {subCategoryImage ? (
                    <span className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">
                      New
                    </span>
                  ) : (
                    <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1 rounded">
                      Current
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 5MB. Accepted formats: JPG, PNG, GIF
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-1 pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-500 text-white px-5 py-1.5 text-sm font-medium hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[100px]"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Submitting..."
                : isEdit
                  ? "Update"
                  : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;
