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
import { Upload, X } from "lucide-react";
import api from "../api/api";

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
    tax: "",
    productType: "",
    productTypeValue: "",
    productTypeUnit: "",
    tags: [],
    images: [], // New images to upload
    existingImages: [], // Existing images from backend (for edit mode)
    vendorId: "", // For admin to select vendor
  });

  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  
  // Get user role
  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "admin";

  // Product type options
  const productTypeOptions = [
    { value: "", label: "Select Type" },
    { value: "weight", label: "Weight" },
    { value: "volume", label: "Volume" },
    { value: "count", label: "Count" },
    { value: "piece", label: "Piece" },
  ];

  // Product type unit options based on selected type
  const getUnitOptions = () => {
    switch (formData.productType) {
      case "weight":
        return [
          { value: "", label: "Select Unit" },
          { value: "kg", label: "Kilogram (kg)" },
          { value: "g", label: "Gram (g)" },
          { value: "mg", label: "Milligram (mg)" },
          { value: "lb", label: "Pound (lb)" },
          { value: "oz", label: "Ounce (oz)" },
        ];
      case "volume":
        return [
          { value: "", label: "Select Unit" },
          { value: "l", label: "Liter (l)" },
          { value: "ml", label: "Milliliter (ml)" },
          { value: "gallon", label: "Gallon" },
        ];
      case "count":
      case "piece":
        return [
          { value: "", label: "Select Unit" },
          { value: "piece", label: "Piece" },
          { value: "dozen", label: "Dozen" },
          { value: "pack", label: "Pack" },
          { value: "box", label: "Box" },
        ];
      default:
        return [{ value: "", label: "Select Type First" }];
    }
  };

  // Fetch vendors for admin
  const fetchVendors = async () => {
    if (!isAdmin) return;
    setVendorsLoading(true);
    try {
      const response = await api.get("/api/vendor");
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setVendorsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log(
        "Modal opened. isEditMode:",
        isEditMode,
        "editingProduct:",
        editingProduct,
      );
      fetchCategories();
      if (isAdmin && !isEditMode) {
        fetchVendors();
      }

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

        // Handle subcategory - with proper normalization
        if (editingProduct.subCategory) {
          if (typeof editingProduct.subCategory === "object" && editingProduct.subCategory !== null) {
            // Try multiple ways to extract the ID
            subCategoryId = editingProduct.subCategory.$oid || 
                           editingProduct.subCategory._id || 
                           editingProduct.subCategory.id ||
                           (editingProduct.subCategory.toString && typeof editingProduct.subCategory.toString === 'function' 
                             ? editingProduct.subCategory.toString() 
                             : '');
            
            // If toString returns "[object Object]", try other methods
            if (subCategoryId === '[object Object]' || !subCategoryId) {
              if (editingProduct.subCategory.toHexString && typeof editingProduct.subCategory.toHexString === 'function') {
                subCategoryId = editingProduct.subCategory.toHexString();
              } else {
                // Try JSON extraction
                try {
                  const jsonStr = JSON.stringify(editingProduct.subCategory);
                  const hexMatch = jsonStr.match(/"([0-9a-fA-F]{24})"/);
                  if (hexMatch) {
                    subCategoryId = hexMatch[1];
                  }
                } catch (e) {
                  console.error('Error extracting subCategory ID from object:', e);
                }
              }
            }
          } else {
            subCategoryId = String(editingProduct.subCategory);
            // If it's "[object Object]" string, try to find it from the product data
            if (subCategoryId === '[object Object]') {
              subCategoryId = '';
            }
          }
        }

        // Ensure both IDs are strings and valid
        categoryId = typeof categoryId === 'string' ? categoryId : String(categoryId || '');
        subCategoryId = typeof subCategoryId === 'string' ? subCategoryId : String(subCategoryId || '');

        console.log("=== EDIT MODE - EXTRACTED IDs ===");
        console.log("Category:", {
          original: editingProduct.category,
          extracted: categoryId,
          type: typeof categoryId,
          isValid: /^[0-9a-fA-F]{24}$/.test(categoryId)
        });
        console.log("SubCategory:", {
          original: editingProduct.subCategory,
          extracted: subCategoryId,
          type: typeof subCategoryId,
          isValid: /^[0-9a-fA-F]{24}$/.test(subCategoryId)
        });

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
          tax: editingProduct.tax?.toString() || "",
          productType: editingProduct.productType?.type || "",
          productTypeValue: editingProduct.productType?.value?.toString() || "",
          productTypeUnit: editingProduct.productType?.unit || "",
          tags: Array.isArray(editingProduct.tags) ? editingProduct.tags : [],
          images: [], // New images to upload
          existingImages: Array.isArray(editingProduct.images)
            ? editingProduct.images
            : [], // Existing images from backend
        };

        console.log("Setting form data:", newFormData);
        
        // Store the subCategoryId to preserve it
        const preservedSubCategoryId = subCategoryId;
        console.log("Preserved subCategoryId for edit mode:", preservedSubCategoryId);

        // Fetch subcategories FIRST, then set form data after they're loaded
        if (categoryId && /^[0-9a-fA-F]{24}$/.test(categoryId)) {
          console.log("Edit mode: Fetching subcategories before setting form data");
          fetchSubCategories(categoryId).then((loadedSubCategories) => {
            console.log("Edit mode: Subcategories loaded, count:", loadedSubCategories?.length || 0);
            console.log("Edit mode: Available subcategory IDs:", loadedSubCategories?.map(sc => sc._id) || []);
            console.log("Edit mode: Looking for preserved subCategoryId:", preservedSubCategoryId);
            
            // Check if the preserved subCategoryId exists in the loaded subcategories
            const subCategoryExists = loadedSubCategories?.some(sc => {
              const scId = typeof sc._id === 'string' ? sc._id : (sc._id?.toString?.() || String(sc._id || ''));
              return scId === preservedSubCategoryId;
            });
            
            console.log("Edit mode: SubCategory exists in loaded list:", subCategoryExists);
            
            // Set form data AFTER subcategories are loaded
            setFormData({
              ...newFormData,
              subCategory: preservedSubCategoryId // Set the subCategory value
            });
            
            console.log("Edit mode: Form data set with subCategory:", preservedSubCategoryId);
          }).catch((err) => {
            console.error("Error fetching subcategories in edit mode:", err);
            // Set form data anyway, even if subcategories fetch failed
            setFormData(newFormData);
          });
        } else {
          // No category, just set form data
          setFormData(newFormData);
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
          tax: "",
          productType: "",
          productTypeValue: "",
          productTypeUnit: "",
          tags: [],
          images: [],
          existingImages: [],
          vendorId: "",
        });
        setTagInput("");
      }
    }
  }, [isOpen, isEditMode, editingProduct]);

  useEffect(() => {
    // Don't clear subCategory if we're in edit mode and subCategory is already set
    const isEditModeWithSubCategory = isEditMode && formData.subCategory;
    
    if (formData.category) {
      // Convert category to string if needed
      const categoryIdStr = typeof formData.category === 'string' 
        ? formData.category 
        : (formData.category?.$oid || formData.category?.toString?.() || formData.category?._id || String(formData.category || ''));
      
      // Only fetch if it's a valid MongoDB ObjectId
      if (categoryIdStr && /^[0-9a-fA-F]{24}$/.test(categoryIdStr)) {
        console.log("Category changed, fetching subcategories for:", categoryIdStr);
        const currentSubCategory = formData.subCategory; // Preserve current subCategory
        fetchSubCategories(categoryIdStr).then(() => {
          // If in edit mode and we had a subCategory, restore it
          if (isEditModeWithSubCategory && currentSubCategory && /^[0-9a-fA-F]{24}$/.test(currentSubCategory)) {
            console.log("Restoring subCategory after fetch:", currentSubCategory);
            setFormData((prev) => ({ ...prev, subCategory: currentSubCategory }));
          }
        });
      } else {
        console.warn("Invalid category ID, not fetching subcategories:", categoryIdStr);
        setSubCategories([]);
        if (!isEditModeWithSubCategory) {
          setFormData((prev) => ({ ...prev, subCategory: "" }));
        }
      }
    } else {
      setSubCategories([]);
      if (!isEditModeWithSubCategory) {
        setFormData((prev) => ({ ...prev, subCategory: "" }));
      }
    }
  }, [formData.category]);

  // Reset product type unit when product type changes
  useEffect(() => {
    if (formData.productType) {
      setFormData((prev) => ({ ...prev, productTypeUnit: "" }));
    }
  }, [formData.productType]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await api.get("/api/category");

      if (response.data.success) {
        setCategories(response.data.data);
        console.log(
          "Categories fetched successfully:",
          response.data.data.length,
        );
      } else {
        throw new Error(response.data.message || "Failed to load categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    setSubCategoriesLoading(true);
    try {
      // Convert categoryId to string if it's an object
      let categoryIdStr = '';
      if (typeof categoryId === 'string') {
        categoryIdStr = categoryId;
      } else if (typeof categoryId === 'object' && categoryId !== null) {
        categoryIdStr = categoryId.$oid || categoryId.toString?.() || categoryId._id || categoryId.id || String(categoryId);
      } else {
        categoryIdStr = String(categoryId);
      }
      
      // Validate categoryId is a valid MongoDB ObjectId
      if (!categoryIdStr || !/^[0-9a-fA-F]{24}$/.test(categoryIdStr)) {
        console.error("Invalid categoryId for fetching subcategories:", categoryIdStr);
        setSubCategories([]);
        setSubCategoriesLoading(false);
        return Promise.resolve([]);
      }
      
      console.log("Fetching subcategories for categoryId:", categoryIdStr);
      
      const response = await api.get(
        `/api/subcategory/by-category/${categoryIdStr}`,
      );

      if (response.data.success) {
        const subCategoriesList = response.data.data || [];
        
        // Normalize subcategory IDs to strings - STRICT conversion
        const normalizedSubCategories = subCategoriesList
          .map((subCat, idx) => {
            let subCatId = '';
            
            if (subCat._id) {
              if (typeof subCat._id === 'string') {
                // If it's already "[object Object]", skip this category
                if (subCat._id === '[object Object]') {
                  console.warn(`SubCategory ${idx} has "[object Object]" as _id string, skipping`);
                  return null;
                }
                subCatId = subCat._id;
              } else if (typeof subCat._id === 'object' && subCat._id !== null) {
                // Log the object structure for debugging
                console.log(`SubCategory ${idx} _id object structure:`, {
                  keys: Object.keys(subCat._id),
                  hasToString: typeof subCat._id.toString === 'function',
                  hasToHexString: typeof subCat._id.toHexString === 'function',
                  hasValueOf: typeof subCat._id.valueOf === 'function',
                  stringified: JSON.stringify(subCat._id),
                  fullObject: subCat._id
                });
                
                // Try multiple methods to extract the ID
                // Method 1: BSON format ($oid)
                if (subCat._id.$oid) {
                  subCatId = subCat._id.$oid;
                  console.log(`  → Extracted via $oid: ${subCatId}`);
                }
                // Method 2: toHexString (MongoDB ObjectId method)
                else if (subCat._id.toHexString && typeof subCat._id.toHexString === 'function') {
                  try {
                    subCatId = subCat._id.toHexString();
                    console.log(`  → Extracted via toHexString: ${subCatId}`);
                  } catch (e) {
                    console.warn(`  → toHexString failed:`, e);
                  }
                }
                // Method 3: toString
                else if (subCat._id.toString && typeof subCat._id.toString === 'function') {
                  try {
                    const idStr = subCat._id.toString();
                    if (idStr !== '[object Object]' && /^[0-9a-fA-F]{24}$/.test(idStr)) {
                      subCatId = idStr;
                      console.log(`  → Extracted via toString: ${subCatId}`);
                    } else {
                      console.warn(`  → toString returned invalid: ${idStr}`);
                    }
                  } catch (e) {
                    console.warn(`  → toString failed:`, e);
                  }
                }
                // Method 4: valueOf
                else if (subCat._id.valueOf && typeof subCat._id.valueOf === 'function') {
                  try {
                    const value = subCat._id.valueOf();
                    if (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
                      subCatId = value;
                      console.log(`  → Extracted via valueOf: ${subCatId}`);
                    }
                  } catch (e) {
                    console.warn(`  → valueOf failed:`, e);
                  }
                }
                // Method 5: Direct properties
                if (!subCatId) {
                  subCatId = subCat._id._id || subCat._id.id || subCat._id.str || '';
                  if (subCatId) {
                    console.log(`  → Extracted via direct property: ${subCatId}`);
                  }
                }
                // Method 6: JSON extraction (last resort)
                if (!subCatId || !/^[0-9a-fA-F]{24}$/.test(subCatId)) {
                  try {
                    const jsonStr = JSON.stringify(subCat._id);
                    console.log(`  → Trying JSON extraction from: ${jsonStr}`);
                    // Try multiple patterns
                    const patterns = [
                      /"([0-9a-fA-F]{24})"/,  // Standard hex string
                      /"oid"\s*:\s*"([0-9a-fA-F]{24})"/,  // BSON format
                      /"id"\s*:\s*"([0-9a-fA-F]{24})"/,   // id field
                    ];
                    for (const pattern of patterns) {
                      const match = jsonStr.match(pattern);
                      if (match && match[1]) {
                        subCatId = match[1];
                        console.log(`  → Extracted via JSON pattern: ${subCatId}`);
                        break;
                      }
                    }
                  } catch (e) {
                    console.error('  → JSON extraction failed:', e);
                  }
                }
              } else {
                subCatId = String(subCat._id);
              }
            } else if (subCat.id) {
              subCatId = typeof subCat.id === 'string' ? subCat.id : String(subCat.id);
            }
            
            // Validate the ID is a proper MongoDB ObjectId
            if (!subCatId || subCatId === '[object Object]' || !/^[0-9a-fA-F]{24}$/.test(subCatId)) {
              console.warn(`SubCategory ${idx} has invalid ID, skipping:`, {
                name: subCat.name,
                _id: subCat._id,
                extractedId: subCatId,
                _idType: typeof subCat._id
              });
              return null;
            }
            
            return {
              ...subCat,
              _id: subCatId, // Ensure it's always a string
              name: subCat.name || subCat.subCategoryName || 'Unnamed'
            };
          })
          .filter(Boolean); // Remove null entries
        
        console.log("Normalized subcategories:", normalizedSubCategories);
        setSubCategories(normalizedSubCategories);
        console.log(
          "Subcategories fetched successfully:",
          normalizedSubCategories.length,
        );
        return normalizedSubCategories; // Return for promise chain
      } else {
        throw new Error(
          response.data.message || "Failed to load subcategories",
        );
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError("Failed to load subcategories");
      return []; // Return empty array on error
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert category and subCategory IDs to strings if they're objects
    let processedValue = value;
    if ((name === 'category' || name === 'subCategory') && value) {
      // If value is already "[object Object]" string, we need to find the actual ID
      if (value === '[object Object]' || String(value) === '[object Object]') {
        console.warn(`${name} value is "[object Object]" string, trying to find actual ID from subCategories/categories`);
        
        // Try to find the actual ID from the subCategories/categories array
        if (name === 'subCategory' && subCategories.length > 0) {
          // If we have subCategories, try to get the selected one
          // This shouldn't happen if dropdown is working correctly, but handle it anyway
          const selectedSubCat = subCategories.find(sub => {
            const subId = typeof sub._id === 'string' ? sub._id : (sub._id?.toString?.() || sub._id?.$oid || '');
            return subId && subId !== '[object Object]';
          });
          if (selectedSubCat) {
            processedValue = typeof selectedSubCat._id === 'string' ? selectedSubCat._id : (selectedSubCat._id?.toString?.() || selectedSubCat._id?.$oid || '');
            console.log(`Found subCategory ID from array:`, processedValue);
          } else {
            processedValue = '';
            console.error('Could not find valid subCategory ID');
          }
        } else if (name === 'category' && categories.length > 0) {
          // Similar for category
          const selectedCat = categories.find(cat => {
            const catId = typeof cat._id === 'string' ? cat._id : (cat._id?.toString?.() || cat._id?.$oid || '');
            return catId && catId !== '[object Object]';
          });
          if (selectedCat) {
            processedValue = typeof selectedCat._id === 'string' ? selectedCat._id : (selectedCat._id?.toString?.() || selectedCat._id?.$oid || '');
            console.log(`Found category ID from array:`, processedValue);
          } else {
            processedValue = '';
            console.error('Could not find valid category ID');
          }
        } else {
          processedValue = '';
        }
      }
      // Ensure value is a string, not an object
      else if (typeof value === 'object' && value !== null) {
        processedValue = value.$oid || value.toString?.() || value._id || value.id || String(value);
      } else {
        processedValue = String(value);
        // Double check it's not "[object Object]"
        if (processedValue === '[object Object]') {
          processedValue = '';
        }
      }
      console.log(`Converting ${name} ID:`, { original: value, converted: processedValue, type: typeof value, isValid: /^[0-9a-fA-F]{24}$/.test(processedValue) });
    }
    
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (error) setError("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = formData.images.length + formData.existingImages.length;
    const remainingSlots = 6 - totalImages;

    console.log("=== IMAGE UPLOAD ===");
    console.log("Files selected:", files.length);
    console.log("Current images count:", formData.images.length);
    console.log("Existing images count:", formData.existingImages.length);
    console.log("Remaining slots:", remainingSlots);

    if (files.length > 0) {
      const filesToAdd = files.slice(0, remainingSlots);
      console.log("Files to add:", filesToAdd.length);
      filesToAdd.forEach((file, idx) => {
        console.log(`  File ${idx}:`, {
          name: file.name,
          type: file.type,
          size: file.size,
          isFile: file instanceof File,
          constructor: file.constructor.name
        });
      });
      
      setFormData((prev) => {
        const newImages = [...prev.images, ...filesToAdd];
        console.log("Updated images array length:", newImages.length);
        return {
          ...prev,
          images: newImages,
        };
      });

      if (files.length > remainingSlots) {
        alert(
          `Only ${remainingSlots} more image(s) can be added. Maximum is 6 images.`,
        );
      }
    }
  };

  const removeNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  // Tag handling functions
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove),
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
      !formData.salePrice ||
      !formData.productType ||
      !formData.productTypeValue ||
      !formData.productTypeUnit
    ) {
      setError("Please fill in all required fields including product type, value, and unit");
      setLoading(false);
      return;
    }

    // Admin must select a vendor when adding product
    if (isAdmin && !isEditMode && !formData.vendorId) {
      setError("Please select a vendor");
      setLoading(false);
      return;
    }

    // Image validation - check total images (existing + new)
    const totalImages = formData.images.length + formData.existingImages.length;
    console.log("=== IMAGE VALIDATION ===");
    console.log("formData.images:", formData.images);
    console.log("formData.images.length:", formData.images.length);
    console.log("formData.existingImages:", formData.existingImages);
    console.log("formData.existingImages.length:", formData.existingImages.length);
    console.log("isEditMode:", isEditMode);
    console.log("totalImages:", totalImages);
    
    // For add mode, we need at least one new image
    // For edit mode, we can have existing images OR new images
    if (isEditMode) {
      // In edit mode, we need either new images OR existing images
      if (formData.images.length === 0 && formData.existingImages.length === 0) {
        setError("Please upload at least one product image or keep existing images");
        setLoading(false);
        return;
      }
    } else {
      // In add mode, we need at least one new image
      if (formData.images.length === 0) {
        setError("Please upload at least one product image");
        setLoading(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();

      // Helper function to convert ID to string (handles ObjectId objects)
      const convertIdToString = (id) => {
        if (!id) return '';
        
        // If it's already "[object Object]" string, try to find the actual ID from subCategories
        if (typeof id === 'string' && id === '[object Object]') {
          console.warn('ID is "[object Object]" string, trying to find actual ID from subCategories array');
          // Try to get the currently selected subCategory from the dropdown
          // This is a fallback - the real fix should be in the dropdown value
          if (subCategories.length > 0 && formData.subCategory === '[object Object]') {
            // Find the first valid subCategory ID
            for (const sub of subCategories) {
              let subId = '';
              if (sub._id) {
                if (typeof sub._id === 'string' && sub._id !== '[object Object]') {
                  subId = sub._id;
                } else if (typeof sub._id === 'object' && sub._id !== null) {
                  subId = sub._id.$oid || sub._id.toString?.() || sub._id.toHexString?.() || sub._id._id || sub._id.id || '';
                }
              }
              if (subId && subId !== '[object Object]' && /^[0-9a-fA-F]{24}$/.test(subId)) {
                console.log('Found valid subCategory ID from array:', subId);
                return subId;
              }
            }
          }
          return '';
        }
        
        if (typeof id === 'string') {
          return id;
        }
        
        if (typeof id === 'object' && id !== null) {
          // Handle MongoDB ObjectId object
          if (id.$oid) return id.$oid;
          if (id.toString && typeof id.toString === 'function') {
            const idStr = id.toString();
            if (idStr !== '[object Object]') return idStr;
          }
          if (id.toHexString && typeof id.toHexString === 'function') {
            return id.toHexString();
          }
          // Try to extract from object
          const extracted = id._id || id.id;
          if (extracted) {
            return typeof extracted === 'string' ? extracted : String(extracted);
          }
          // Last resort - try JSON to extract hex
          try {
            const jsonStr = JSON.stringify(id);
            const hexMatch = jsonStr.match(/"([0-9a-fA-F]{24})"/);
            if (hexMatch) return hexMatch[1];
          } catch (e) {
            console.error('Error extracting ID from object:', e);
          }
          return '';
        }
        return String(id);
      };

      // Convert category and subCategory IDs to strings BEFORE validation
      const categoryId = convertIdToString(formData.category);
      const subCategoryId = convertIdToString(formData.subCategory);
      
      console.log("=== CONVERTING IDs ===");
      console.log("Category:", {
        original: formData.category,
        originalType: typeof formData.category,
        converted: categoryId,
        convertedType: typeof categoryId,
        isValid: /^[0-9a-fA-F]{24}$/.test(categoryId)
      });
      console.log("SubCategory:", {
        original: formData.subCategory,
        originalType: typeof formData.subCategory,
        converted: subCategoryId,
        convertedType: typeof subCategoryId,
        isValid: /^[0-9a-fA-F]{24}$/.test(subCategoryId)
      });
      
      // Validate IDs are valid MongoDB ObjectIds
      if (!categoryId || !/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        setError("Please select a valid category");
        setLoading(false);
        return;
      }
      
      if (!subCategoryId || !/^[0-9a-fA-F]{24}$/.test(subCategoryId)) {
        setError("Please select a valid sub-category");
        setLoading(false);
        return;
      }

      // Append all form fields
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("skuHsn", formData.skuHsn || "");
      formDataToSend.append("inventory", formData.inventory || "0");
      
      // Append category and subCategory as strings
      formDataToSend.append("category", categoryId);
      formDataToSend.append("subCategory", subCategoryId);
      
      formDataToSend.append("actualPrice", formData.actualPrice);
      formDataToSend.append("regularPrice", formData.regularPrice);
      formDataToSend.append("salePrice", formData.salePrice);
      
      // Cashback must be >= 0, if empty or negative, use 0
      const cashbackValue = formData.cashback ? parseFloat(formData.cashback) : 0;
      if (cashbackValue < 0) {
        setError("Cashback must be >= 0");
        setLoading(false);
        return;
      }
      formDataToSend.append("cashback", cashbackValue >= 0 ? cashbackValue.toString() : "0");
      
      // Tax must be >= 0 and <= 100
      const taxValue = formData.tax ? parseFloat(formData.tax) : 0;
      if (taxValue < 0 || taxValue > 100) {
        setError("Tax must be between 0 and 100");
        setLoading(false);
        return;
      }
      formDataToSend.append("tax", taxValue.toString());
      
      // Add vendorId if admin is adding product
      if (isAdmin && !isEditMode && formData.vendorId) {
        formDataToSend.append("vendorId", formData.vendorId);
      }

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

      // Tags - send as comma-separated string (backend expects string, not array)
      if (formData.tags.length > 0) {
        const tagsString = formData.tags.join(",");
        formDataToSend.append("tags", tagsString);
      }

      // Append NEW images - CRITICAL: Backend expects req.files.images array
      console.log("=== IMAGES DEBUG ===");
      console.log("formData.images:", formData.images);
      console.log("formData.images.length:", formData.images.length);
      console.log("formData.existingImages:", formData.existingImages);
      console.log("formData.existingImages.length:", formData.existingImages.length);
      console.log("isEditMode:", isEditMode);
      
      if (formData.images.length > 0) {
        console.log("Appending new images to FormData:");
        formData.images.forEach((image, idx) => {
          console.log(`  Image ${idx}:`, {
            name: image?.name,
            type: image?.type,
            size: image?.size,
            isFile: image instanceof File,
            constructor: image?.constructor?.name
          });
          // Ensure it's a File object
          if (image instanceof File) {
            formDataToSend.append("images", image);
          } else {
            console.warn(`  Image ${idx} is not a File object, skipping`);
          }
        });
        console.log(`Total new images appended: ${formData.images.length}`);
      } else {
        console.warn("No new images to append!");
      }

      // In edit mode, send existing images to keep (only for update, not for create)
      if (isEditMode && formData.existingImages.length > 0) {
        console.log("Appending existing images (edit mode):", formData.existingImages.length);
        formDataToSend.append(
          "existingImages",
          JSON.stringify(formData.existingImages),
        );
      }
      
      // Final check: Log what will be sent
      console.log("FormData images count check:", {
        newImages: formData.images.length,
        existingImages: isEditMode ? formData.existingImages.length : 0,
        totalForValidation: formData.images.length + (isEditMode ? formData.existingImages.length : 0)
      });

      // Determine API endpoint and method based on mode
      const productId =
        editingProduct?.id || editingProduct?._id || editingProduct?.productId;
      const apiEndpoint = isEditMode
        ? `/api/product/update/${productId}`
        : `/api/product/add`;

      console.log(`${isEditMode ? "Updating" : "Adding"} product...`);
      console.log("API Endpoint:", apiEndpoint);
      console.log("Method:", isEditMode ? "PUT" : "POST");
      console.log("Product ID:", productId);

      // Make the API request
      // IMPORTANT: For FormData, we must NOT set Content-Type header
      // Browser will automatically set it with boundary for multipart/form-data
      const config = {
        headers: {
          'Content-Type': undefined, // Let browser set it automatically for FormData
        },
      };
      
      console.log("=== SENDING REQUEST ===");
      console.log("Endpoint:", apiEndpoint);
      console.log("Method:", isEditMode ? "PUT" : "POST");
      console.log("FormData entries:");
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      }
      
      let response;
      if (isEditMode) {
        response = await api.put(apiEndpoint, formDataToSend, config);
      } else {
        response = await api.post(apiEndpoint, formDataToSend, config);
      }

      // Parse response
      const result = response.data;

      console.log("Response status:", response.status);
      console.log("Response data:", result);

      // Handle different error status codes
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error(
          "Access denied. You may not have permission to perform this action.",
        );
      } else if (response.status === 400) {
        throw new Error(
          result.message || "Invalid product data. Please check all fields.",
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            `Failed to ${isEditMode ? "update" : "add"} product`,
        );
      }

      // Success
      console.log(
        `Product ${isEditMode ? "updated" : "added"} successfully, response:`,
        result,
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
        tax: "",
        productType: "",
        productTypeValue: "",
        productTypeUnit: "",
        tags: [],
        images: [],
        existingImages: [],
        vendorId: "",
      });
      setTagInput("");

      // Close popup after a brief delay to ensure state updates
      setTimeout(() => {
        console.log("Closing modal");
        onClose();
      }, 300);
    } catch (err) {
      console.error(
        `Error ${isEditMode ? "updating" : "submitting"} product:`,
        err,
      );
      setError(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${
            isEditMode ? "update" : "submit"
          } product. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalImages = formData.images.length + formData.existingImages.length;

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
                  Upload Images ({totalImages}/6)
                </label>
                <div className="border border-orange-400 rounded-sm h-[250px] sm:h-[280px] lg:h-[330px] overflow-y-auto p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Display existing images (from backend) */}
                    {formData.existingImages.map((img, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative border border-gray-300 rounded-sm h-[100px]"
                      >
                        <img
                          src={img.url || img}
                          alt={`Existing ${index + 1}`}
                          className="object-cover h-full w-full rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1 rounded">
                          Existing
                        </span>
                      </div>
                    ))}

                    {/* Display new images (to be uploaded) */}
                    {formData.images.map((img, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative border border-gray-300 rounded-sm h-[100px]"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`New ${index + 1}`}
                          className="object-cover h-full w-full rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                        <span className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">
                          New
                        </span>
                      </div>
                    ))}

                    {/* Upload button */}
                    {totalImages < 6 && (
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

            {/* Vendor Selection (Admin only) */}
            {isAdmin && !isEditMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">
                    Select Vendor *
                  </label>
                  <select
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleChange}
                    className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                    required
                  >
                    <option value="">Select a vendor</option>
                    {vendorsLoading ? (
                      <option>Loading vendors...</option>
                    ) : (
                      vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.vendorName || vendor.storeName || vendor.contactNumber} - {vendor.storeName || "Store"}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            )}

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
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? "Loading..." : "Select Category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                      {cat.totalProducts > 0
                        ? ` (${cat.totalProducts} products)`
                        : ""}
                    </option>
                  ))}
                </select>
                {categoriesLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading categories...
                  </p>
                )}
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
                  disabled={!formData.category || subCategoriesLoading}
                >
                  <option value="">
                    {subCategoriesLoading
                      ? "Loading..."
                      : "Select Sub-Category"}
                  </option>
                  {subCategories.map((sub, idx) => {
                    // Ensure _id is a string - multiple fallbacks
                    let subId = '';
                    if (sub._id) {
                      if (typeof sub._id === 'string') {
                        subId = sub._id;
                      } else if (typeof sub._id === 'object' && sub._id !== null) {
                        subId = sub._id.$oid || sub._id.toString?.() || sub._id.toHexString?.() || sub._id._id || sub._id.id || '';
                      } else {
                        subId = String(sub._id);
                      }
                    } else if (sub.id) {
                      subId = typeof sub.id === 'string' ? sub.id : String(sub.id);
                    }
                    
                    // Final check - if it's still "[object Object]" or invalid, skip this option
                    if (!subId || subId === '[object Object]' || !/^[0-9a-fA-F]{24}$/.test(subId)) {
                      console.warn(`Skipping invalid subCategory option ${idx}:`, { sub, subId, _idType: typeof sub._id });
                      return null;
                    }
                    
                    return (
                      <option key={subId} value={subId}>
                        {sub.name || sub.subCategoryName || `SubCategory ${idx + 1}`}
                      </option>
                    );
                  }).filter(Boolean)}
                </select>
                {subCategoriesLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading subcategories...
                  </p>
                )}
              </div>
            </div>

            {/* Pricing Fields with Tax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <div>
                <label className="block font-semibold mb-1">Tax (%)</label>
                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  placeholder="Enter Tax Percentage"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
            </div>

            {/* Product Type Fields - Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                >
                  {productTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                <select
                  name="productTypeUnit"
                  value={formData.productTypeUnit}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={!formData.productType}
                >
                  {getUnitOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags Field - Pill Style */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-2">
                  <span className="text-orange-500">🏷️</span> Tags
                  <span className="text-gray-400 text-xs font-normal">
                    (Press Enter to add)
                  </span>
                </label>
                <div className="border border-orange-400 rounded-sm p-2 min-h-[80px] focus-within:ring-2 focus-within:ring-orange-300">
                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-[12px] font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="hover:bg-orange-600 rounded-full p-0.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {/* Tag Input */}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={
                      formData.tags.length === 0
                        ? "Add tags (e.g., fruits, apple, fresh, organic)"
                        : "Add more..."
                    }
                    className="w-full focus:outline-none text-[13px] bg-transparent"
                  />
                </div>
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
                } text-white px-6 py-2 rounded-sm text-[13px] font-semibold transition-colors`}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Submitting..."
                  : isEditMode
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
