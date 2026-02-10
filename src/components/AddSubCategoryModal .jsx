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

const AddSubCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const animationDuration = 300;
  const closeTimerRef = useRef(null);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDesc, setSubCategoryDesc] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/category`, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      console.log("=== CATEGORIES API RESPONSE ===");
      console.log("Full response:", JSON.stringify(data, null, 2));
      
      // Try multiple possible response structures
      let categoriesList = [];
      if (Array.isArray(data)) {
        categoriesList = data;
      } else if (data.data && Array.isArray(data.data)) {
        categoriesList = data.data;
      } else if (data.categories && Array.isArray(data.categories)) {
        categoriesList = data.categories;
      }
      
      console.log("Extracted categories list:", categoriesList);
      console.log("Number of categories:", categoriesList.length);
      
      if (categoriesList.length === 0) {
        console.error("No categories found in response!");
        alert("No categories found. Please create a category first.");
        setCategories([]);
        return;
      }
      
      // Normalize categories - convert _id to string and ensure name exists
      const normalizedCategories = categoriesList.map((cat, index) => {
        // Handle MongoDB ObjectId object - it might be an object with $oid or just an object
        let catId = '';
        
        if (cat._id) {
          // If _id is already a string
          if (typeof cat._id === 'string') {
            catId = cat._id;
          }
          // If _id is an object
          else if (typeof cat._id === 'object' && cat._id !== null) {
            // Try BSON format first ($oid)
            if (cat._id.$oid) {
              catId = cat._id.$oid;
            }
            // Try toString method
            else if (typeof cat._id.toString === 'function') {
              try {
                catId = cat._id.toString();
                // If toString returns "[object Object]", it's not a proper ObjectId
                if (catId === '[object Object]') {
                  // Try accessing common ObjectId properties
                  catId = cat._id._id || cat._id.id || cat._id.str || cat._id.value;
                  // If still not found, try to get the hex string from ObjectId
                  if (!catId && cat._id.toHexString) {
                    catId = cat._id.toHexString();
                  }
                  // Last resort - try JSON and extract
                  if (!catId || catId === '[object Object]') {
                    const jsonStr = JSON.stringify(cat._id);
                    // Try to extract hex string from JSON
                    const hexMatch = jsonStr.match(/"([0-9a-fA-F]{24})"/);
                    if (hexMatch) {
                      catId = hexMatch[1];
                    } else {
                      // Use index as fallback
                      catId = String(index);
                    }
                  }
                }
              } catch (e) {
                console.error('Error converting _id:', e);
                catId = String(index);
              }
            }
            // Try accessing properties directly
            else {
              catId = cat._id._id || cat._id.id || cat._id.str || cat._id.value || String(index);
            }
          }
          // Fallback
          else {
            catId = String(cat._id);
          }
        } else if (cat.id) {
          if (typeof cat.id === 'string') {
            catId = cat.id;
          } else if (typeof cat.id === 'object' && cat.id !== null) {
            catId = cat.id.$oid || cat.id.toString?.() || cat.id._id || cat.id.id || String(index);
          } else {
            catId = String(cat.id);
          }
        } else {
          catId = String(index);
        }
        
        // Ensure catId is a valid string (not "[object Object]")
        if (catId === '[object Object]' || !catId || catId === 'undefined' || catId === 'null') {
          console.warn(`Invalid category ID for ${cat.name}, using index:`, catId);
          catId = String(index);
        }
        
        const catName = cat.name || cat.categoryName || cat.category || `Category ${index + 1}`;
        
        console.log(`Category ${index + 1}:`, {
          name: catName,
          id: catId,
          idType: typeof catId,
          _idRaw: cat._id,
          _idType: typeof cat._id,
          _idIsObject: typeof cat._id === 'object',
          _idKeys: typeof cat._id === 'object' && cat._id !== null ? Object.keys(cat._id) : 'N/A',
          _idStringified: typeof cat._id === 'object' ? JSON.stringify(cat._id) : 'N/A',
          _idValueOf: typeof cat._id === 'object' && cat._id !== null && typeof cat._id.valueOf === 'function' ? cat._id.valueOf() : 'N/A'
        });
        
        return {
          ...cat,
          _id: catId,
          name: catName
        };
      });
      
      console.log("Normalized categories:", normalizedCategories);
      console.log("Setting categories state with", normalizedCategories.length, "items");
      
      setCategories(normalizedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      alert("Failed to load categories. Please try again.");
    } finally {
      setLoadingCategories(false);
    }
  };

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
      // Reset form on close
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
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSubCategoryImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    if (!subCategoryName.trim()) {
      alert("Please enter sub-category name");
      return;
    }

    if (!subCategoryImage) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);

    try {
      // Validate categoryId is a valid MongoDB ObjectId format (24 hex characters)
      console.log("Submitting with categoryId:", categoryId, "Type:", typeof categoryId);
      
      // Convert to string if it's not already
      const categoryIdStr = String(categoryId).trim();
      
      if (!/^[0-9a-fA-F]{24}$/.test(categoryIdStr)) {
        console.error("Invalid categoryId format:", categoryIdStr);
        alert("Please select a valid category. The selected category ID is not in the correct format.");
        setLoading(false);
        return;
      }

      // Prepare FormData according to API requirements
      const formData = new FormData();
      formData.append("name", subCategoryName.trim());
      formData.append("description", subCategoryDesc.trim() || "");
      formData.append("category", categoryIdStr); // Send category ID as string
      formData.append("image", subCategoryImage); // Send file directly

      console.log("Sending form data with:", {
        name: subCategoryName.trim(),
        description: subCategoryDesc.trim(),
        category: categoryIdStr,
        categoryIdLength: categoryIdStr?.length,
        image: subCategoryImage?.name,
        imageSize: subCategoryImage?.size,
      });

      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Send POST request with FormData
      const response = await fetch(
        `${BASE_URL}/api/subcategory/create`,
        {
          method: "POST",
          credentials: "include",
          headers: headers,
          body: formData, // Don't set Content-Type header - browser will set it with boundary
        }
      );

      const result = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", result);

      if (!response.ok || !result.success) {
        // Handle validation errors from express-validator
        if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
          const errorMessages = result.errors.map(err => err.msg || err.message).join('\n');
          console.error("Validation errors:", result.errors);
          throw new Error(errorMessages || "Validation failed. Please check your input.");
        }
        // Handle other error formats
        const errorMsg = result.message || result.error || "Failed to create sub-category";
        console.error("API Error:", errorMsg, result);
        throw new Error(errorMsg);
      }

      console.log("✅ Sub Category Created:", result);
      alert("Sub-category created successfully!");

      // Call success callback with the created data
      if (onSuccess) {
        onSuccess(result.data);
      }

      // Reset form and close
      resetForm();
      handleClose();
    } catch (err) {
      console.error("Error creating sub-category:", err);
      // Display error message in alert
      const errorMessage = err.message || "Failed to create sub-category. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay (white 50% transparent) */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-300 ${
          visible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-sm shadow-2xl w-[580px] h-auto p-4 transform transition-all duration-300 ease-out
        ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-5"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-orange-500 hover:text-orange-600"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-md font-semibold mb-2 text-black pb-1 inline-block border-b-4 border-orange-400">
          Add Sub Category
        </h2>

        {/* Form */}
        <div className="space-y-1.5">
          {/* Select Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-0.5">
              Select Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-orange-400 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white disabled:bg-gray-100"
              value={categoryId}
              onChange={(e) => {
                const selectedValue = e.target.value;
                const selectedCategory = categories.find(cat => cat._id === selectedValue);
                console.log("Category selected - Value:", selectedValue, "Category:", selectedCategory);
                console.log("Is valid ObjectId:", /^[0-9a-fA-F]{24}$/.test(selectedValue));
                setCategoryId(selectedValue);
              }}
              required
              disabled={loadingCategories || loading}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "-- Choose Category --"}
              </option>
              {loadingCategories ? (
                <option value="" disabled>Loading categories...</option>
              ) : categories.length === 0 ? (
                <option value="" disabled>No categories available</option>
              ) : (
                categories.map((cat, index) => {
                  // Get the already normalized _id (should be string now)
                  let catId = cat._id || String(index);
                  const catName = cat.name || cat.categoryName || `Category ${index + 1}`;
                  
                  // Final safety check - ensure it's a string and not "[object Object]"
                  if (typeof catId === 'object' && catId !== null) {
                    catId = catId.$oid || catId.toString?.() || catId._id || catId.id || String(index);
                  }
                  
                  // If it's still "[object Object]", use index
                  if (String(catId) === '[object Object]' || !catId) {
                    console.warn(`Invalid ID for category ${catName}, using index`);
                    catId = String(index);
                  }
                  
                  // Ensure it's a string
                  const finalId = String(catId);
                  
                  console.log(`Rendering option ${index + 1}:`, { 
                    name: catName, 
                    id: finalId,
                    idType: typeof finalId,
                    isValid: /^[0-9a-fA-F]{24}$/.test(finalId) || finalId === String(index)
                  });
                  
                  return (
                    <option key={finalId || index} value={finalId}>
                      {catName}
                    </option>
                  );
                })
              )}
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

          {/* Sub Category Description */}
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
            ></textarea>
          </div>

          {/* Sub Category Image */}
          <div>
            <label className="block text-sm font-medium mb-0.5">
              Sub Category Image (100px × 100px){" "}
              <span className="text-red-500">*</span>
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
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setSubCategoryImage(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    disabled={loading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 5MB. Accepted formats: JPG, PNG, GIF
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-1 pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-500 text-white px-5 py-1.5 text-sm font-medium hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[100px]"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;
