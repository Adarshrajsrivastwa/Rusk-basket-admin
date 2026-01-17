// import React, { useState } from "react";
// import { Upload } from "lucide-react";

// export default function AddProductPopup({ isOpen, onClose }) {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     sku: "",
//     inventory: "",
//     category: "",
//     subCategory: "",
//     actualPrice: "",
//     mrp: "",
//     sellPrice: "",
//     tags: "",
//     mainImage: null,
//     galleryImages: Array(5).fill(null),
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleMainImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setFormData((prev) => ({ ...prev, mainImage: file }));
//   };

//   const handleGalleryUpload = (index, e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const newGallery = [...formData.galleryImages];
//       newGallery[index] = file;
//       setFormData((prev) => ({ ...prev, galleryImages: newGallery }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data:", formData);
//     alert("Product submitted! Check console for details.");
//     onClose(); // Close modal after submission
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-2">
//       <div className="bg-white w-full max-w-[1100px] rounded-md shadow-lg relative border border-gray-300 max-h-[90vh] flex flex-col">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-orange-500 hover:text-red-600 text-lg font-bold"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <h2 className="text-[14px] font-bold border-b border-gray-300 pb-2 pt-3 px-5">
//           Add Product
//         </h2>

//         {/* Scrollable Form */}
//         <div className="overflow-y-auto px-5 py-4">
//           <form className="space-y-4 text-[13px]" onSubmit={handleSubmit}>
//             {/* Product Title + Main Image */}
//             <div className="grid grid-cols-1 lg:grid-cols-[2.2fr,1fr] gap-4">
//               <div className="flex flex-col space-y-3">
//                 <div>
//                   <label className="block font-semibold mb-1">
//                     Product Title
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     placeholder="Enter product title recommended upto 100 words"
//                     className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   />
//                 </div>
//                 <div className="flex flex-col flex-1">
//                   <label className="block font-semibold mb-1">
//                     Product Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows="10"
//                     placeholder="Write Product Description"
//                     className="flex-1 w-full border border-orange-400 rounded-sm p-2 resize-none focus:outline-none text-[13px] min-h-[200px] lg:h-[260px]"
//                   ></textarea>
//                 </div>
//               </div>

//               {/* Upload Main Image */}
//               <div className="flex flex-col justify-end">
//                 <label className="block font-semibold mb-1">
//                   Upload Main Image
//                 </label>
//                 <div className="flex items-center justify-center border border-orange-400 rounded-sm h-[250px] sm:h-[280px] lg:h-[330px] relative">
//                   {formData.mainImage ? (
//                     <img
//                       src={URL.createObjectURL(formData.mainImage)}
//                       alt="Main"
//                       className="object-contain h-full w-full"
//                     />
//                   ) : (
//                     <Upload size={60} className="text-orange-500" />
//                   )}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleMainImageUpload}
//                     className="absolute inset-0 opacity-0 cursor-pointer"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* SKU / Inventory / Category / Subcategory */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">SKU/HSN</label>
//                 <input
//                   type="text"
//                   name="sku"
//                   value={formData.sku}
//                   onChange={handleChange}
//                   placeholder="Enter Product HSN/SKU Code"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">Inventory</label>
//                 <input
//                   type="number"
//                   name="inventory"
//                   value={formData.inventory}
//                   onChange={handleChange}
//                   placeholder="Enter Inventory"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Select Category
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 >
//                   <option value="">Select Category</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Select Sub-Category
//                 </label>
//                 <select
//                   name="subCategory"
//                   value={formData.subCategory}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 >
//                   <option value="">Select Sub-Category</option>
//                 </select>
//               </div>
//             </div>

//             {/* Price Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">Actual Price</label>
//                 <input
//                   type="number"
//                   name="actualPrice"
//                   value={formData.actualPrice}
//                   onChange={handleChange}
//                   placeholder="Enter Rupees in INR"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">MRP*</label>
//                 <input
//                   type="number"
//                   name="mrp"
//                   value={formData.mrp}
//                   onChange={handleChange}
//                   placeholder="Enter Rupees in INR"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">Sell Price*</label>
//                 <input
//                   type="number"
//                   name="sellPrice"
//                   value={formData.sellPrice}
//                   onChange={handleChange}
//                   placeholder="Enter Rupees in INR"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//             </div>

//             {/* Product Gallery + Tags */}
//             <div className="grid grid-cols-1 lg:grid-cols-[4fr,1fr] gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Product Gallery
//                 </label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//                   {formData.galleryImages.map((img, i) => (
//                     <div
//                       key={i}
//                       className="border border-orange-400 rounded-sm h-[120px] sm:h-[130px] md:h-[150px] flex items-center justify-center relative hover:border-orange-600 transition"
//                     >
//                       {img ? (
//                         <img
//                           src={URL.createObjectURL(img)}
//                           alt={`Gallery ${i}`}
//                           className="object-contain h-full w-full"
//                         />
//                       ) : (
//                         <Upload size={35} className="text-orange-500" />
//                       )}
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleGalleryUpload(i, e)}
//                         className="absolute inset-0 opacity-0 cursor-pointer"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block font-semibold mb-1">Tag</label>
//                 <textarea
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleChange}
//                   placeholder="Write Multiple Tags for Searching"
//                   rows="5"
//                   className="w-full border border-orange-400 rounded-sm p-2 resize-none focus:outline-none text-[13px] min-h-[120px] sm:min-h-[130px] md:min-h-[150px]"
//                 ></textarea>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end mt-3">
//               <button
//                 type="submit"
//                 className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-sm text-[13px] font-semibold"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from "react";
// import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

// // Get base URL from environment variable or use default
// const getBaseURL = () => {
//   return import.meta.env.VITE_API_BASE_URL || "http://46.202.164.93";
// };

// export default function AddProductPopup({ isOpen, onClose, onSuccess }) {
//   const [formData, setFormData] = useState({
//     productName: "",
//     productType: "quantity",
//     productTypeValue: "",
//     productTypeUnit: "kg",
//     category: "",
//     subCategory: "",
//     description: "",
//     skuHsn: "",
//     inventory: "",
//     actualPrice: "",
//     regularPrice: "",
//     salePrice: "",
//     cashback: "",
//     tags: "",
//     images: Array(5).fill(null),
//   });

//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [filteredSubCategories, setFilteredSubCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [loadingSubCategories, setLoadingSubCategories] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   // Fetch categories on component mount
//   useEffect(() => {
//     if (isOpen) {
//       fetchCategories();
//       fetchSubCategories();
//     }
//   }, [isOpen]);

//   // Filter subcategories based on selected category
//   useEffect(() => {
//     if (formData.category) {
//       const selectedCategory = categories.find(
//         (cat) => cat._id === formData.category
//       );
//       if (selectedCategory) {
//         const filtered = subCategories.filter(
//           (sub) =>
//             sub.category === formData.category ||
//             sub.category === selectedCategory._id ||
//             sub.categoryName === selectedCategory.name ||
//             sub.categoryName === selectedCategory.categoryName
//         );
//         setFilteredSubCategories(filtered);
//       } else {
//         setFilteredSubCategories([]);
//       }
//     } else {
//       setFilteredSubCategories([]);
//     }
//   }, [formData.category, subCategories, categories]);

//   const fetchCategories = async () => {
//     setLoadingCategories(true);
//     try {
//       const baseURL = getBaseURL();
//       const authToken =
//         localStorage.getItem("authToken") || localStorage.getItem("token");

//       const response = await fetch(`${baseURL}/api/category`, {
//         headers: {
//           ...(authToken && { Authorization: `Bearer ${authToken}` }),
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch categories");

//       const data = await response.json();
//       setCategories(data.data || []);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const fetchSubCategories = async () => {
//     setLoadingSubCategories(true);
//     try {
//       const baseURL = getBaseURL();
//       const authToken =
//         localStorage.getItem("authToken") || localStorage.getItem("token");

//       const response = await fetch(`${baseURL}api/subcategory`, {
//         headers: {
//           ...(authToken && { Authorization: `Bearer ${authToken}` }),
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch sub-categories");

//       const data = await response.json();
//       setSubCategories(data.data || []);
//     } catch (err) {
//       console.error("Error fetching sub-categories:", err);
//     } finally {
//       setLoadingSubCategories(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setSubmitStatus(null);

//     // Reset subcategory when category changes
//     if (name === "category") {
//       setFormData((prev) => ({ ...prev, subCategory: "" }));
//     }
//   };

//   const handleImageUpload = (index, e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         alert("Please upload an image file.");
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert("Image size should be less than 5MB");
//         return;
//       }

//       const newImages = [...formData.images];
//       newImages[index] = file;
//       setFormData((prev) => ({ ...prev, images: newImages }));
//     }
//   };

//   const validateForm = () => {
//     if (!formData.productName.trim()) {
//       setErrorMessage("Product Name is required");
//       return false;
//     }
//     if (formData.productName.length > 200) {
//       setErrorMessage("Product name cannot be more than 200 characters");
//       return false;
//     }
//     if (
//       !formData.productTypeValue ||
//       parseFloat(formData.productTypeValue) < 0
//     ) {
//       setErrorMessage(
//         "Product type value is required and must be greater than or equal to 0"
//       );
//       return false;
//     }
//     if (!formData.productTypeUnit.trim()) {
//       setErrorMessage("Product type unit is required");
//       return false;
//     }
//     if (!formData.category) {
//       setErrorMessage("Category is required");
//       return false;
//     }
//     if (!formData.subCategory) {
//       setErrorMessage("Sub category is required");
//       return false;
//     }
//     if (formData.description && formData.description.length > 5000) {
//       setErrorMessage("Description cannot be more than 5000 characters");
//       return false;
//     }
//     if (!formData.actualPrice || parseFloat(formData.actualPrice) < 0) {
//       setErrorMessage(
//         "Actual Price is required and must be greater than or equal to 0"
//       );
//       return false;
//     }
//     if (!formData.regularPrice || parseFloat(formData.regularPrice) < 0) {
//       setErrorMessage(
//         "Regular Price is required and must be greater than or equal to 0"
//       );
//       return false;
//     }
//     if (!formData.salePrice || parseFloat(formData.salePrice) < 0) {
//       setErrorMessage(
//         "Sale Price is required and must be greater than or equal to 0"
//       );
//       return false;
//     }
//     if (formData.cashback && parseFloat(formData.cashback) < 0) {
//       setErrorMessage("Cashback must be greater than or equal to 0");
//       return false;
//     }
//     if (formData.skuHsn && formData.skuHsn.length > 50) {
//       setErrorMessage("SKU/HSN code cannot be more than 50 characters");
//       return false;
//     }
//     if (!formData.tags.trim()) {
//       setErrorMessage("Tags are required");
//       return false;
//     }
//     // Validate tags format
//     const tagsArray = formData.tags
//       .split(",")
//       .map((tag) => tag.trim())
//       .filter((tag) => tag.length > 0);
//     if (tagsArray.length === 0) {
//       setErrorMessage("At least one tag is required");
//       return false;
//     }
//     if (tagsArray.length > 20) {
//       setErrorMessage("Maximum 20 tags allowed");
//       return false;
//     }

//     // Check if at least one image is uploaded
//     const hasImages = formData.images.some((img) => img !== null);
//     if (!hasImages) {
//       setErrorMessage("At least one product image is required");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitStatus(null);
//     setErrorMessage("");

//     if (!validateForm()) {
//       setSubmitStatus("error");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const baseURL = getBaseURL();
//       const authToken =
//         localStorage.getItem("authToken") || localStorage.getItem("token");

//       const formDataToSend = new FormData();

//       // Append all form fields according to API requirements
//       formDataToSend.append("productName", formData.productName.trim());
//       formDataToSend.append("productType", formData.productType);
//       formDataToSend.append(
//         "productTypeValue",
//         parseFloat(formData.productTypeValue)
//       );
//       formDataToSend.append("productTypeUnit", formData.productTypeUnit.trim());
//       formDataToSend.append("category", formData.category); // Should be MongoId
//       formDataToSend.append("subCategory", formData.subCategory); // Should be MongoId

//       if (formData.description && formData.description.trim()) {
//         formDataToSend.append("description", formData.description.trim());
//       }

//       if (formData.skuHsn && formData.skuHsn.trim()) {
//         formDataToSend.append("skuHsn", formData.skuHsn.trim());
//       }

//       if (formData.inventory) {
//         formDataToSend.append("inventory", parseFloat(formData.inventory));
//       }

//       formDataToSend.append("actualPrice", parseFloat(formData.actualPrice));
//       formDataToSend.append("regularPrice", parseFloat(formData.regularPrice));
//       formDataToSend.append("salePrice", parseFloat(formData.salePrice));

//       if (formData.cashback) {
//         formDataToSend.append("cashback", parseFloat(formData.cashback));
//       }

//       formDataToSend.append("tags", formData.tags.trim());

//       // Append images (only non-null files)
//       // uploadMultiple middleware expects all images with the same field name
//       const imageFiles = formData.images.filter((img) => img !== null);
//       imageFiles.forEach((file) => {
//         formDataToSend.append("images", file);
//       });

//       console.log("Submitting product data...");

//       const headers = {};
//       if (authToken) {
//         headers.Authorization = `Bearer ${authToken}`;
//       }

//       const response = await fetch(`${baseURL}/api/product/add`, {
//         method: "POST",
//         headers: headers,
//         body: formDataToSend,
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         setSubmitStatus("success");
//         console.log("✅ Product added successfully:", result);

//         // Call success callback if provided
//         if (onSuccess) {
//           onSuccess(result.data);
//         }

//         // Reset form and close modal after delay
//         setTimeout(() => {
//           resetForm();
//           onClose();
//         }, 2000);
//       } else {
//         setSubmitStatus("error");
//         // Handle validation errors from API
//         if (result.errors && Array.isArray(result.errors)) {
//           const errorMessages = result.errors
//             .map((err) => err.msg || err.message)
//             .join(", ");
//           setErrorMessage(
//             errorMessages ||
//               result.error ||
//               "Failed to add product. Please try again."
//           );
//         } else {
//           setErrorMessage(
//             result.error ||
//               result.message ||
//               "Failed to add product. Please try again."
//           );
//         }
//         console.error("Error response:", result);
//       }
//     } catch (error) {
//       setSubmitStatus("error");
//       setErrorMessage(
//         "Network error. Please check your connection and try again."
//       );
//       console.error("Submit error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       productName: "",
//       productType: "quantity",
//       productTypeValue: "",
//       productTypeUnit: "kg",
//       category: "",
//       subCategory: "",
//       description: "",
//       skuHsn: "",
//       inventory: "",
//       actualPrice: "",
//       regularPrice: "",
//       salePrice: "",
//       cashback: "",
//       tags: "",
//       images: Array(5).fill(null),
//     });
//     setSubmitStatus(null);
//     setErrorMessage("");
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-2">
//       <div className="bg-white w-full max-w-[1100px] rounded-md shadow-lg relative border border-gray-300 max-h-[90vh] flex flex-col">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-orange-500 hover:text-red-600 text-lg font-bold z-10"
//           disabled={isSubmitting}
//         >
//           ✕
//         </button>

//         <h2 className="text-[14px] font-bold border-b border-gray-300 pb-2 pt-3 px-5">
//           Add Product
//         </h2>

//         {submitStatus === "success" && (
//           <div className="mx-5 mt-4 p-3 bg-green-50 border border-green-300 rounded-sm flex items-center gap-2">
//             <CheckCircle size={18} className="text-green-600" />
//             <span className="text-green-700 text-[13px] font-medium">
//               Product added successfully!
//             </span>
//           </div>
//         )}

//         {submitStatus === "error" && errorMessage && (
//           <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-300 rounded-sm flex items-center gap-2">
//             <AlertCircle size={18} className="text-red-600" />
//             <span className="text-red-700 text-[13px] font-medium">
//               {errorMessage}
//             </span>
//           </div>
//         )}

//         <div className="overflow-y-auto px-5 py-4">
//           <div className="space-y-4 text-[13px]">
//             <div>
//               <label className="block font-semibold mb-1">
//                 Product Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="productName"
//                 value={formData.productName}
//                 onChange={handleChange}
//                 placeholder="Enter product name"
//                 className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 disabled={isSubmitting}
//                 maxLength={200}
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Product Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="productType"
//                   value={formData.productType}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                 >
//                   <option value="quantity">Quantity</option>
//                   <option value="weight">Weight</option>
//                   <option value="volume">Volume</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Product Type Value <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="productTypeValue"
//                   value={formData.productTypeValue}
//                   onChange={handleChange}
//                   placeholder="Enter value"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Product Type Unit <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="productTypeUnit"
//                   value={formData.productTypeUnit}
//                   onChange={handleChange}
//                   placeholder="Enter unit (e.g., kg, g, l, ml, pcs)"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Select Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting || loadingCategories}
//                 >
//                   <option value="">
//                     {loadingCategories ? "Loading..." : "Select Category"}
//                   </option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name || cat.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Select Sub-Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="subCategory"
//                   value={formData.subCategory}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={
//                     isSubmitting || !formData.category || loadingSubCategories
//                   }
//                 >
//                   <option value="">
//                     {loadingSubCategories
//                       ? "Loading..."
//                       : !formData.category
//                       ? "Select Category First"
//                       : "Select Sub-Category"}
//                   </option>
//                   {filteredSubCategories.map((sub) => (
//                     <option key={sub._id} value={sub._id}>
//                       {sub.name || sub.subCategoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block font-semibold mb-1">
//                 Product Images <span className="text-red-500">*</span>
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//                 {formData.images.map((img, i) => (
//                   <div
//                     key={i}
//                     className="border border-orange-400 rounded-sm h-[120px] sm:h-[130px] md:h-[150px] flex items-center justify-center relative hover:border-orange-600 transition"
//                   >
//                     {img ? (
//                       <img
//                         src={URL.createObjectURL(img)}
//                         alt={`Image ${i + 1}`}
//                         className="object-contain h-full w-full"
//                       />
//                     ) : (
//                       <Upload size={35} className="text-orange-500" />
//                     )}
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleImageUpload(i, e)}
//                       className="absolute inset-0 opacity-0 cursor-pointer"
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                 ))}
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Max file size: 5MB per image. At least one image is required.
//               </p>
//             </div>

//             <div>
//               <label className="block font-semibold mb-1">
//                 Product Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="6"
//                 placeholder="Write product description"
//                 className="w-full border border-orange-400 rounded-sm p-2 resize-none focus:outline-none text-[13px]"
//                 disabled={isSubmitting}
//                 maxLength={5000}
//               ></textarea>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">SKU/HSN</label>
//                 <input
//                   type="text"
//                   name="skuHsn"
//                   value={formData.skuHsn}
//                   onChange={handleChange}
//                   placeholder="Enter Product HSN/SKU Code"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                   maxLength={50}
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">Inventory</label>
//                 <input
//                   type="number"
//                   name="inventory"
//                   value={formData.inventory}
//                   onChange={handleChange}
//                   placeholder="Enter Inventory"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                   min="0"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">Actual Price</label>
//                 <input
//                   type="number"
//                   name="actualPrice"
//                   value={formData.actualPrice}
//                   onChange={handleChange}
//                   placeholder="Enter Rupees in INR"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Regular Price <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="regularPrice"
//                   value={formData.regularPrice}
//                   onChange={handleChange}
//                   placeholder="Enter Rupees in INR"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Sale Price <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="salePrice"
//                   value={formData.salePrice}
//                   onChange={handleChange}
//                   placeholder="Enter Rupees in INR"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">Cashback</label>
//                 <input
//                   type="number"
//                   name="cashback"
//                   value={formData.cashback}
//                   onChange={handleChange}
//                   placeholder="Enter Cashback Amount"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={isSubmitting}
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block font-semibold mb-1">
//                 Tags <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="Use for product search - separate tags with commas (e.g., fresh, organic, healthy)"
//                 rows="3"
//                 className="w-full border border-orange-400 rounded-sm p-2 resize-none focus:outline-none text-[13px]"
//                 disabled={isSubmitting}
//                 maxLength={500}
//               ></textarea>
//             </div>

//             <div className="flex justify-end mt-3">
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-sm text-[13px] font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 size={16} className="animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";

export default function AddProductPopup({
  isOpen,
  onClose,
  onSuccess,
  isEditMode = false,
  editingProduct = null,
}) {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    skuHsn: "",
    inventory: "",
    category: "",
    subCategory: "",
    actualPrice: "",
    regularPrice: "",
    salePrice: "",
    cashback: "",
    productType: "",
    productTypeValue: "",
    productTypeUnit: "",
    tags: "",
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Utility function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  useEffect(() => {
    if (isOpen) {
      console.log(
        "Modal opened. isEditMode:",
        isEditMode,
        "editingProduct:",
        editingProduct
      );
      fetchCategories();

      // If editing, populate form with existing data
      if (isEditMode && editingProduct) {
        console.log("Loading product for edit:", editingProduct);

        // Extract category and subcategory IDs
        let categoryId = "";
        let subCategoryId = "";

        // Handle category
        if (editingProduct.category) {
          if (typeof editingProduct.category === "object") {
            categoryId =
              editingProduct.category._id || editingProduct.category.id || "";
          } else {
            categoryId = editingProduct.category;
          }
        }

        // Handle subcategory
        if (editingProduct.subCategory) {
          if (typeof editingProduct.subCategory === "object") {
            subCategoryId =
              editingProduct.subCategory._id ||
              editingProduct.subCategory.id ||
              "";
          } else {
            subCategoryId = editingProduct.subCategory;
          }
        }

        console.log("Extracted categoryId:", categoryId);
        console.log("Extracted subCategoryId:", subCategoryId);

        const newFormData = {
          productName: editingProduct.name || editingProduct.productName || "",
          description: editingProduct.description || "",
          skuHsn: editingProduct.sku || editingProduct.skuHsn || "",
          inventory: editingProduct.inventory?.toString() || "",
          category: categoryId,
          subCategory: subCategoryId,
          actualPrice: editingProduct.actualPrice?.toString() || "",
          regularPrice: editingProduct.regularPrice?.toString() || "",
          salePrice: editingProduct.salePrice?.toString() || "",
          cashback: editingProduct.cashback?.toString() || "",
          productType: editingProduct.productType?.type || "",
          productTypeValue: editingProduct.productType?.value?.toString() || "",
          productTypeUnit: editingProduct.productType?.unit || "",
          tags: Array.isArray(editingProduct.tags)
            ? editingProduct.tags.join(", ")
            : editingProduct.tags || "",
          images: [], // Images will be handled separately for edit
        };

        console.log("Setting form data:", newFormData);
        setFormData(newFormData);

        // Fetch subcategories for the selected category
        if (categoryId) {
          fetchSubCategories(categoryId);
        }
      } else {
        // Reset form for add mode
        console.log("Resetting form for add mode");
        setFormData({
          productName: "",
          description: "",
          skuHsn: "",
          inventory: "",
          category: "",
          subCategory: "",
          actualPrice: "",
          regularPrice: "",
          salePrice: "",
          cashback: "",
          productType: "",
          productTypeValue: "",
          productTypeUnit: "",
          tags: "",
          images: [],
        });
      }
    }
  }, [isOpen, isEditMode, editingProduct]);

  useEffect(() => {
    if (formData.category) {
      fetchSubCategories(formData.category);
    } else {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, subCategory: "" }));
    }
  }, [formData.category]);

  const fetchCategories = async () => {
    try {
      const token = getAuthToken();

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://46.202.164.93/api/category", {
        credentials: "include",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      } else {
        throw new Error(result.message || "Failed to load categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const token = getAuthToken();

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://46.202.164.93/api/subcategory/by-category/${categoryId}`,
        {
          credentials: "include",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setSubCategories(result.data);
      } else {
        throw new Error(result.message || "Failed to load subcategories");
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError("Failed to load subcategories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, 6),
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    console.log("Submit clicked. isEditMode:", isEditMode);
    console.log("Current form data:", formData);

    // Validation
    if (
      !formData.productName ||
      !formData.description ||
      !formData.skuHsn ||
      !formData.inventory ||
      !formData.category ||
      !formData.subCategory ||
      !formData.actualPrice ||
      !formData.regularPrice ||
      !formData.salePrice
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // For add mode, check if images are uploaded
    if (!isEditMode && formData.images.length === 0) {
      setError("Please upload at least one product image");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("skuHsn", formData.skuHsn);
      formDataToSend.append("inventory", formData.inventory);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subCategory", formData.subCategory);
      formDataToSend.append("actualPrice", formData.actualPrice);
      formDataToSend.append("regularPrice", formData.regularPrice);
      formDataToSend.append("salePrice", formData.salePrice);
      formDataToSend.append("cashback", formData.cashback || "0");

      // ProductType structure: {type, value, unit}
      if (formData.productType) {
        formDataToSend.append("productType", formData.productType);
      }
      if (formData.productTypeValue) {
        formDataToSend.append("productTypeValue", formData.productTypeValue);
      }
      if (formData.productTypeUnit) {
        formDataToSend.append("productTypeUnit", formData.productTypeUnit);
      }

      // Tags should be an array - convert comma-separated string to array
      if (formData.tags) {
        const tagsArray = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
        tagsArray.forEach((tag) => {
          formDataToSend.append("tags", tag);
        });
      }

      // Append images (only if new images uploaded)
      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });
      }

      // Get token
      const token = getAuthToken();

      console.log("Token exists:", !!token);

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Determine API endpoint and method based on mode
      const productId =
        editingProduct?.id || editingProduct?._id || editingProduct?.productId;
      const apiUrl = isEditMode
        ? `http://46.202.164.93/api/product/update/${productId}`
        : "http://46.202.164.93/api/product/add";

      const method = isEditMode ? "PUT" : "POST";

      console.log(`${isEditMode ? "Updating" : "Adding"} product...`);
      console.log("API URL:", apiUrl);
      console.log("Method:", method);
      console.log("Product ID:", productId);

      // Make the API request
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      // Parse response
      const result = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", result);

      // Handle different error status codes
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        } else if (response.status === 403) {
          throw new Error(
            "Access denied. You may not have permission to perform this action."
          );
        } else if (response.status === 400) {
          throw new Error(
            result.message || "Invalid product data. Please check all fields."
          );
        } else {
          throw new Error(
            result.message ||
              `Failed to ${isEditMode ? "update" : "add"} product (Status: ${
                response.status
              })`
          );
        }
      }

      if (!result.success) {
        throw new Error(
          result.message || `Failed to ${isEditMode ? "update" : "add"} product`
        );
      }

      // Success
      console.log(
        `Product ${isEditMode ? "updated" : "added"} successfully, response:`,
        result
      );
      alert(`Product ${isEditMode ? "updated" : "added"} successfully!`);

      // Call onSuccess callback to refresh product list BEFORE closing
      if (onSuccess) {
        console.log("Calling onSuccess callback");
        onSuccess(result.data);
      }

      // Reset form
      setFormData({
        productName: "",
        description: "",
        skuHsn: "",
        inventory: "",
        category: "",
        subCategory: "",
        actualPrice: "",
        regularPrice: "",
        salePrice: "",
        cashback: "",
        productType: "",
        productTypeValue: "",
        productTypeUnit: "",
        tags: "",
        images: [],
      });

      // Close popup after a brief delay to ensure state updates
      setTimeout(() => {
        console.log("Closing modal");
        onClose();
      }, 300);
    } catch (err) {
      console.error(
        `Error ${isEditMode ? "updating" : "submitting"} product:`,
        err
      );
      setError(
        err.message ||
          `Failed to ${
            isEditMode ? "update" : "submit"
          } product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-2">
      <div className="bg-white w-full max-w-[1100px] rounded-md shadow-lg relative border border-gray-300 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-orange-500 hover:text-red-600 text-lg font-bold z-10"
        >
          ✕
        </button>

        <h2 className="text-[14px] font-bold border-b border-gray-300 pb-2 pt-3 px-5">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h2>

        {error && (
          <div className="mx-5 mt-3 p-3 bg-red-50 border border-red-300 text-red-700 rounded-sm text-[13px]">
            {error}
          </div>
        )}

        <div className="overflow-y-auto px-5 py-4">
          <div className="space-y-4 text-[13px]">
            {/* Product Name and Description with Image Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-[2.2fr,1fr] gap-4">
              <div className="flex flex-col space-y-3">
                <div>
                  <label className="block font-semibold mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="block font-semibold mb-1">
                    Product Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="10"
                    placeholder="Write Product Description"
                    className="flex-1 w-full border border-orange-400 rounded-sm p-2 resize-none focus:outline-none text-[13px] min-h-[200px] lg:h-[260px]"
                  ></textarea>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="flex flex-col justify-end">
                <label className="block font-semibold mb-1">
                  Upload Images ({formData.images.length}/6)
                </label>
                <div className="border border-orange-400 rounded-sm h-[250px] sm:h-[280px] lg:h-[330px] overflow-y-auto p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-300 rounded-sm h-[100px]"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Image ${index + 1}`}
                          className="object-cover h-full w-full rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {formData.images.length < 6 && (
                      <label className="border border-dashed border-orange-400 rounded-sm h-[100px] flex items-center justify-center cursor-pointer hover:border-orange-600">
                        <Upload size={30} className="text-orange-500" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SKU, Inventory, Category, Sub-Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1">SKU/HSN *</label>
                <input
                  type="text"
                  name="skuHsn"
                  value={formData.skuHsn}
                  onChange={handleChange}
                  placeholder="Enter Product HSN/SKU Code"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Inventory *</label>
                <input
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleChange}
                  placeholder="Enter Inventory"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Select Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
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
                <label className="block font-semibold mb-1">
                  Select Sub-Category *
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={!formData.category}
                >
                  <option value="">Select Sub-Category</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1">
                  Actual Price *
                </label>
                <input
                  type="number"
                  name="actualPrice"
                  value={formData.actualPrice}
                  onChange={handleChange}
                  placeholder="Enter Rupees in INR"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Regular Price (MRP) *
                </label>
                <input
                  type="number"
                  name="regularPrice"
                  value={formData.regularPrice}
                  onChange={handleChange}
                  placeholder="Enter Rupees in INR"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Sale Price *</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="Enter Rupees in INR"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Cashback</label>
                <input
                  type="number"
                  name="cashback"
                  value={formData.cashback}
                  onChange={handleChange}
                  placeholder="Enter Cashback Amount"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
            </div>

            {/* Product Type Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Product Type</label>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  placeholder="e.g., weight, volume, count"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Product Type Value
                </label>
                <input
                  type="number"
                  name="productTypeValue"
                  value={formData.productTypeValue}
                  onChange={handleChange}
                  placeholder="e.g., 1, 500, 2"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Product Type Unit
                </label>
                <input
                  type="text"
                  name="productTypeUnit"
                  value={formData.productTypeUnit}
                  onChange={handleChange}
                  placeholder="e.g., kg, liter, piece"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
            </div>

            {/* Tags Field */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-semibold mb-1">Tags</label>
                <textarea
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas (e.g., fruits,apple,fresh,organic)"
                  rows="3"
                  className="w-full border border-orange-400 rounded-sm p-2 resize-none focus:outline-none text-[13px]"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                } text-white px-6 py-2 rounded-sm text-[13px] font-semibold`}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Submitting..."
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
