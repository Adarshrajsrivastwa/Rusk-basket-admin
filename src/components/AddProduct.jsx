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
//     //     showToast.info("Product submitted! Check console for details.");
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
//       //     } finally {
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
//       //     } finally {
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
//         showToast.warning("Please upload an image file.");
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         showToast.info("Image size should be less than 5MB");
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

//       //       const headers = {};
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
//         //         // Call success callback if provided
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
//         //       }
//     } catch (error) {
//       setSubmitStatus("error");
//       setErrorMessage(
//         "Network error. Please check your connection and try again."
//       );
//       //     } finally {
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
// import React, { useState, useEffect, useRef } from "react";
// import { Upload, X, Check } from "lucide-react";
// import api from "../api/api";

// export default function AddProductPopup({
//   isOpen,
//   onClose,
//   onSuccess,
//   isEditMode = false,
//   editingProduct = null,
// }) {
//   const [formData, setFormData] = useState({
//     productName: "",
//     description: "",
//     skuHsn: "",
//     inventory: "",
//     category: "",
//     subCategory: "",
//     actualPrice: "",
//     regularPrice: "",
//     salePrice: "",
//     cashback: "",
//     tax: "",
//     productType: "",
//     productTypeValue: "",
//     productTypeUnit: "",
//     tags: [],
//     images: [],
//     existingImages: [],
//     vendorId: "",
//   });

//   const [tagInput, setTagInput] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [vendorsLoading, setVendorsLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [categoriesLoading, setCategoriesLoading] = useState(false);
//   const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

//   // Crop modal state
//   const [showCropModal, setShowCropModal] = useState(false);
//   const [cropImage, setCropImage] = useState(null);
//   const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [isResizing, setIsResizing] = useState(false);
//   const [resizeHandle, setResizeHandle] = useState(null);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
//   const cropContainerRef = useRef(null);
//   const cropBoxRef = useRef(null);
//   const imageRef = useRef(null);
//   const pendingImageIndex = useRef(null); // Track which image slot we're cropping

//   // FIX: This ref prevents the category→subCategory and productType→unit
//   // side-effect useEffects from firing during edit initialization, which
//   // was causing those fields to get wiped right after being set.
//   const isInitializingRef = useRef(false);

//   const userRole = localStorage.getItem("userRole") || "";
//   const isAdmin = userRole === "admin";

//   const productTypeOptions = [
//     { value: "", label: "Select Type" },
//     { value: "weight", label: "Weight" },
//     { value: "volume", label: "Volume" },
//     { value: "count", label: "Count" },
//     { value: "piece", label: "Piece" },
//   ];

//   const getUnitOptions = () => {
//     switch (formData.productType) {
//       case "weight":
//         return [
//           { value: "", label: "Select Unit" },
//           { value: "kg", label: "Kilogram (kg)" },
//           { value: "g", label: "Gram (g)" },
//           { value: "mg", label: "Milligram (mg)" },
//           { value: "lb", label: "Pound (lb)" },
//           { value: "oz", label: "Ounce (oz)" },
//         ];
//       case "volume":
//         return [
//           { value: "", label: "Select Unit" },
//           { value: "l", label: "Liter (l)" },
//           { value: "ml", label: "Milliliter (ml)" },
//           { value: "gallon", label: "Gallon" },
//         ];
//       case "count":
//       case "piece":
//         return [
//           { value: "", label: "Select Unit" },
//           { value: "piece", label: "Piece" },
//           { value: "dozen", label: "Dozen" },
//           { value: "pack", label: "Pack" },
//           { value: "box", label: "Box" },
//         ];
//       default:
//         return [{ value: "", label: "Select Type First" }];
//     }
//   };

//   // ─── Helper: extract a valid 24-char hex ObjectId from any format ──────────
//   const extractId = (id) => {
//     if (!id) return "";
//     if (typeof id === "string") {
//       if (/^[0-9a-fA-F]{24}$/.test(id)) return id;
//     }
//     if (typeof id === "object" && id !== null) {
//       if (id.$oid && /^[0-9a-fA-F]{24}$/.test(id.$oid)) return id.$oid;
//       if (typeof id.toHexString === "function") {
//         try {
//           const h = id.toHexString();
//           if (/^[0-9a-fA-F]{24}$/.test(h)) return h;
//         } catch (_) {}
//       }
//       for (const key of ["_id", "id", "str"]) {
//         if (id[key] && /^[0-9a-fA-F]{24}$/.test(String(id[key])))
//           return String(id[key]);
//       }
//       try {
//         const m = JSON.stringify(id).match(/"([0-9a-fA-F]{24})"/);
//         if (m) return m[1];
//       } catch (_) {}
//     }
//     return "";
//   };

//   const fetchVendors = async () => {
//     if (!isAdmin) return;
//     setVendorsLoading(true);
//     try {
//       const response = await api.get("/api/vendor");
//       if (response.data.success) setVendors(response.data.data || []);
//     } catch (err) {
//       //     } finally {
//       setVendorsLoading(false);
//     }
//   };

//   // ─── Main initialization effect ────────────────────────────────────────────
//   useEffect(() => {
//     if (!isOpen) return;

//     fetchCategories();
//     if (isAdmin && !isEditMode) fetchVendors();

//     if (isEditMode && editingProduct) {
//       // Block side-effect useEffects while we initialize
//       isInitializingRef.current = true;

//       const categoryId = extractId(editingProduct.category);
//       const subCategoryId = extractId(editingProduct.subCategory);

//       const newFormData = {
//         productName: editingProduct.name || editingProduct.productName || "",
//         description: editingProduct.description || "",
//         skuHsn: editingProduct.sku || editingProduct.skuHsn || "N/A",
//         inventory:
//           editingProduct.inventory != null
//             ? String(editingProduct.inventory)
//             : "0",
//         category: categoryId,
//         subCategory: subCategoryId,
//         actualPrice:
//           editingProduct.actualPrice != null
//             ? String(editingProduct.actualPrice)
//             : "0",
//         regularPrice:
//           editingProduct.regularPrice != null
//             ? String(editingProduct.regularPrice)
//             : "0",
//         salePrice:
//           editingProduct.salePrice != null
//             ? String(editingProduct.salePrice)
//             : "0",
//         cashback:
//           editingProduct.cashback != null
//             ? String(editingProduct.cashback)
//             : "0",
//         tax: editingProduct.tax != null ? String(editingProduct.tax) : "0",
//         // Set all three productType fields together so the unit is never wiped
//         productType: editingProduct.productType?.type || "",
//         productTypeValue:
//           editingProduct.productType?.value != null
//             ? String(editingProduct.productType.value)
//             : "",
//         productTypeUnit: editingProduct.productType?.unit || "",
//         tags: Array.isArray(editingProduct.tags) ? editingProduct.tags : [],
//         images: [],
//         existingImages: Array.isArray(editingProduct.images)
//           ? editingProduct.images
//           : [],
//         vendorId: "",
//       };

//       setFormData(newFormData);
//       setTagInput("");

//       // Load subcategories for the category, then restore the selected subCategory
//       // and lift the init flag — done inside the promise so timing is correct.
//       if (categoryId && /^[0-9a-fA-F]{24}$/.test(categoryId)) {
//         fetchSubCategories(categoryId)
//           .then(() => {
//             // Restore subCategory in case the category useEffect already cleared it
//             setFormData((prev) => ({ ...prev, subCategory: subCategoryId }));
//           })
//           .catch(() => {})
//           .finally(() => {
//             isInitializingRef.current = false;
//           });
//       } else {
//         isInitializingRef.current = false;
//       }
//     } else {
//       isInitializingRef.current = false;
//       setFormData({
//         productName: "",
//         description: "",
//         skuHsn: "",
//         inventory: "",
//         category: "",
//         subCategory: "",
//         actualPrice: "",
//         regularPrice: "",
//         salePrice: "",
//         cashback: "",
//         tax: "",
//         productType: "",
//         productTypeValue: "",
//         productTypeUnit: "",
//         tags: [],
//         images: [],
//         existingImages: [],
//         vendorId: "",
//       });
//       setTagInput("");
//     }
//   }, [isOpen, isEditMode, editingProduct]);

//   // ─── Category → SubCategory side effect ────────────────────────────────────
//   // Guarded: skipped during edit initialization so it can't wipe subCategory.
//   useEffect(() => {
//     if (isInitializingRef.current) return;

//     if (!formData.category) {
//       setSubCategories([]);
//       setFormData((prev) => ({ ...prev, subCategory: "" }));
//       return;
//     }

//     const categoryIdStr = extractId(formData.category) || formData.category;
//     if (!/^[0-9a-fA-F]{24}$/.test(categoryIdStr)) {
//       setSubCategories([]);
//       setFormData((prev) => ({ ...prev, subCategory: "" }));
//       return;
//     }

//     // Real user selection: clear subCategory and reload subcategories
//     setFormData((prev) => ({ ...prev, subCategory: "" }));
//     fetchSubCategories(categoryIdStr);
//   }, [formData.category]);

//   // ─── ProductType → Unit side effect ────────────────────────────────────────
//   // Guarded: during edit init productType is set together with productTypeUnit,
//   // so we must NOT clear the unit here.
//   useEffect(() => {
//     if (isInitializingRef.current) return;
//     if (formData.productType) {
//       setFormData((prev) => ({ ...prev, productTypeUnit: "" }));
//     }
//   }, [formData.productType]);

//   // ─── Data fetchers ──────────────────────────────────────────────────────────
//   const fetchCategories = async () => {
//     setCategoriesLoading(true);
//     try {
//       const response = await api.get("/api/category");
//       if (response.data.success) {
//         setCategories(response.data.data);
//       } else {
//         throw new Error(response.data.message || "Failed to load categories");
//       }
//     } catch (err) {
//       //       setError("Failed to load categories");
//     } finally {
//       setCategoriesLoading(false);
//     }
//   };

//   const fetchSubCategories = async (categoryId) => {
//     setSubCategoriesLoading(true);
//     try {
//       const categoryIdStr =
//         typeof categoryId === "string" ? categoryId : extractId(categoryId);

//       if (!categoryIdStr || !/^[0-9a-fA-F]{24}$/.test(categoryIdStr)) {
//         setSubCategories([]);
//         return [];
//       }

//       const response = await api.get(
//         `/api/subcategory/by-category/${categoryIdStr}`,
//       );

//       if (response.data.success) {
//         const normalized = (response.data.data || [])
//           .map((subCat) => {
//             const id = extractId(subCat._id || subCat.id);
//             if (!id) return null;
//             return {
//               ...subCat,
//               _id: id,
//               name: subCat.name || subCat.subCategoryName || "Unnamed",
//             };
//           })
//           .filter(Boolean);

//         setSubCategories(normalized);
//         return normalized;
//       } else {
//         throw new Error(
//           response.data.message || "Failed to load subcategories",
//         );
//       }
//     } catch (err) {
//       //       setError("Failed to load subcategories");
//       return [];
//     } finally {
//       setSubCategoriesLoading(false);
//     }
//   };

//   // ─── Form handlers ──────────────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let processedValue = value;

//     if ((name === "category" || name === "subCategory") && value) {
//       processedValue = /^[0-9a-fA-F]{24}$/.test(value)
//         ? value
//         : extractId(value) || "";
//     }

//     setFormData((prev) => ({ ...prev, [name]: processedValue }));
//     if (error) setError("");
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const totalImages = formData.images.length + formData.existingImages.length;
//     const remainingSlots = 6 - totalImages;

//     if (files.length > 0) {
//       const file = files[0]; // Process one at a time for cropping
//       if (!file.type.startsWith("image/")) {
//         showToast.warning("Please upload a valid image file.");
//         return;
//       }

//       // Open crop modal for first file
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setCropImage(reader.result);
//         pendingImageIndex.current = formData.images.length; // Track which slot
//         setShowCropModal(true);
//       };
//       reader.readAsDataURL(file);

//       // Reset file input
//       e.target.value = "";
//     }
//   };

//   // ================= INITIALIZE CROP AREA (1:1) =================
//   useEffect(() => {
//     if (showCropModal && cropImage && cropContainerRef.current) {
//       const container = cropContainerRef.current;
//       const containerWidth = container.clientWidth;
//       const containerHeight = container.clientHeight;

//       // 1:1 aspect ratio (square)
//       const aspectRatio = 1;
//       let cropSize = Math.min(containerWidth * 0.8, containerHeight * 0.8, 500);

//       const x = (containerWidth - cropSize) / 2;
//       const y = (containerHeight - cropSize) / 2;

//       setCropArea({ x, y, width: cropSize, height: cropSize });

//       // Load image to get actual dimensions
//       const img = new Image();
//       img.onload = () => {
//         // Image loaded
//       };
//       img.src = cropImage;
//     }
//   }, [showCropModal, cropImage]);

//   // ================= HANDLE CROP BOX DRAG & RESIZE =================
//   const handleMouseDown = (e) => {
//     if (e.target.classList.contains('resize-handle')) {
//       const handle = e.target.dataset.handle;
//       setIsResizing(true);
//       setResizeHandle(handle);
//       setResizeStart({
//         x: e.clientX,
//         y: e.clientY,
//         width: cropArea.width,
//         height: cropArea.height,
//         cropX: cropArea.x,
//         cropY: cropArea.y,
//       });
//       e.stopPropagation();
//       return;
//     }

//     if (e.target === cropBoxRef.current || cropBoxRef.current?.contains(e.target)) {
//       setIsDragging(true);
//       setDragStart({
//         x: e.clientX - cropArea.x,
//         y: e.clientY - cropArea.y,
//       });
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (!cropContainerRef.current) return;

//     const container = cropContainerRef.current;
//     const rect = container.getBoundingClientRect();
//     const aspectRatio = 1; // 1:1

//     // Handle resize
//     if (isResizing && resizeHandle) {
//       const deltaX = e.clientX - resizeStart.x;
//       const deltaY = e.clientY - resizeStart.y;

//       let newSize = resizeStart.width;
//       let newX = resizeStart.cropX;
//       let newY = resizeStart.cropY;

//       // Calculate resize based on handle position (for square, all corners work similarly)
//       if (resizeHandle === 'se' || resizeHandle === 'sw' || resizeHandle === 'ne' || resizeHandle === 'nw') {
//         const scale = Math.max(
//           Math.abs(resizeStart.width + deltaX) / resizeStart.width,
//           Math.abs(resizeStart.height + deltaY) / resizeStart.height
//         );
//         newSize = resizeStart.width * scale;

//         // Adjust position based on corner
//         if (resizeHandle === 'sw' || resizeHandle === 'nw') {
//           newX = resizeStart.cropX + resizeStart.width - newSize;
//         }
//         if (resizeHandle === 'ne' || resizeHandle === 'nw') {
//           newY = resizeStart.cropY + resizeStart.height - newSize;
//         }
//       }

//       // Constrain to container bounds
//       const maxSize = Math.min(container.clientWidth, container.clientHeight);
//       const minSize = 100;

//       if (newSize > maxSize) newSize = maxSize;
//       if (newSize < minSize) newSize = minSize;

//       // Adjust position if resizing from left or top
//       if (resizeHandle === 'sw' || resizeHandle === 'nw') {
//         newX = Math.max(0, Math.min(newX, container.clientWidth - newSize));
//       }
//       if (resizeHandle === 'ne' || resizeHandle === 'nw') {
//         newY = Math.max(0, Math.min(newY, container.clientHeight - newSize));
//       }

//       // Ensure crop box stays within bounds
//       if (newX + newSize > container.clientWidth) {
//         newX = container.clientWidth - newSize;
//       }
//       if (newY + newSize > container.clientHeight) {
//         newY = container.clientHeight - newSize;
//       }

//       setCropArea({
//         x: Math.max(0, newX),
//         y: Math.max(0, newY),
//         width: newSize,
//         height: newSize,
//       });
//       return;
//     }

//     // Handle drag
//     if (isDragging) {
//       const newX = e.clientX - rect.left - dragStart.x;
//       const newY = e.clientY - rect.top - dragStart.y;

//       const maxX = container.clientWidth - cropArea.width;
//       const maxY = container.clientHeight - cropArea.height;

//       setCropArea({
//         ...cropArea,
//         x: Math.max(0, Math.min(newX, maxX)),
//         y: Math.max(0, Math.min(newY, maxY)),
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     setIsResizing(false);
//     setResizeHandle(null);
//   };

//   // ================= APPLY CROP =================
//   const applyCrop = () => {
//     if (!cropImage || !imageRef.current) return;

//     const img = new Image();
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       // Calculate scale factor
//       const container = cropContainerRef.current;
//       const scaleX = img.width / container.clientWidth;
//       const scaleY = img.height / container.clientHeight;

//       // Calculate actual crop coordinates
//       const cropX = (cropArea.x * scaleX);
//       const cropY = (cropArea.y * scaleY);
//       const cropSize = (cropArea.width * scaleX);

//       // Set canvas size to 1:1 ratio (e.g., 1000x1000)
//       const outputSize = 1000;
//       canvas.width = outputSize;
//       canvas.height = outputSize;

//       // Draw cropped and scaled image
//       ctx.drawImage(
//         img,
//         cropX, cropY, cropSize, cropSize,
//         0, 0, outputSize, outputSize
//       );

//       // Convert to blob and add to form data
//       canvas.toBlob((blob) => {
//         const file = new File([blob], "product.jpg", { type: "image/jpeg" });

//         // Add to images array at the tracked index
//         setFormData((prev) => {
//           const newImages = [...prev.images];
//           newImages[pendingImageIndex.current] = file;
//           return { ...prev, images: newImages };
//         });

//         setShowCropModal(false);
//         setCropImage(null);
//         pendingImageIndex.current = null;
//       }, "image/jpeg", 0.9);
//     };
//     img.src = cropImage;
//   };

//   // ================= CANCEL CROP =================
//   const cancelCrop = () => {
//     setShowCropModal(false);
//     setCropImage(null);
//     pendingImageIndex.current = null;
//   };

//   const removeNewImage = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const removeExistingImage = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       existingImages: prev.existingImages.filter((_, i) => i !== index),
//     }));
//   };

//   const handleTagInputChange = (e) => setTagInput(e.target.value);

//   const handleTagInputKeyDown = (e) => {
//     if (e.key === "Enter" && tagInput.trim()) {
//       e.preventDefault();
//       addTag(tagInput.trim());
//     }
//   };

//   const addTag = (tag) => {
//     if (tag && !formData.tags.includes(tag)) {
//       setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
//       setTagInput("");
//     }
//   };

//   const removeTag = (indexToRemove) => {
//     setFormData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((_, index) => index !== indexToRemove),
//     }));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");

//     if (
//       !formData.productName ||
//       !formData.description ||
//       !formData.skuHsn ||
//       !formData.inventory ||
//       !formData.category ||
//       !formData.subCategory ||
//       !formData.actualPrice ||
//       !formData.regularPrice ||
//       !formData.salePrice ||
//       !formData.productType ||
//       !formData.productTypeValue ||
//       !formData.productTypeUnit
//     ) {
//       setError(
//         "Please fill in all required fields including product type, value, and unit",
//       );
//       setLoading(false);
//       return;
//     }

//     if (isAdmin && !isEditMode && !formData.vendorId) {
//       setError("Please select a vendor");
//       setLoading(false);
//       return;
//     }

//     if (isEditMode) {
//       if (
//         formData.images.length === 0 &&
//         formData.existingImages.length === 0
//       ) {
//         setError(
//           "Please upload at least one product image or keep existing images",
//         );
//         setLoading(false);
//         return;
//       }
//     } else {
//       if (formData.images.length === 0) {
//         setError("Please upload at least one product image");
//         setLoading(false);
//         return;
//       }
//     }

//     try {
//       const formDataToSend = new FormData();

//       const categoryId = extractId(formData.category) || formData.category;
//       const subCategoryId =
//         extractId(formData.subCategory) || formData.subCategory;

//       if (!categoryId || !/^[0-9a-fA-F]{24}$/.test(categoryId)) {
//         setError("Please select a valid category");
//         setLoading(false);
//         return;
//       }

//       if (!subCategoryId || !/^[0-9a-fA-F]{24}$/.test(subCategoryId)) {
//         setError("Please select a valid sub-category");
//         setLoading(false);
//         return;
//       }

//       formDataToSend.append("productName", formData.productName);
//       formDataToSend.append("description", formData.description || "");
//       formDataToSend.append("skuHsn", formData.skuHsn || "");
//       formDataToSend.append("inventory", formData.inventory || "0");
//       formDataToSend.append("category", categoryId);
//       formDataToSend.append("subCategory", subCategoryId);
//       formDataToSend.append("actualPrice", formData.actualPrice);
//       formDataToSend.append("regularPrice", formData.regularPrice);
//       formDataToSend.append("salePrice", formData.salePrice);

//       const cashbackValue = formData.cashback
//         ? parseFloat(formData.cashback)
//         : 0;
//       if (cashbackValue < 0) {
//         setError("Cashback must be >= 0");
//         setLoading(false);
//         return;
//       }
//       formDataToSend.append("cashback", cashbackValue.toString());

//       const taxValue = formData.tax ? parseFloat(formData.tax) : 0;
//       if (taxValue < 0 || taxValue > 100) {
//         setError("Tax must be between 0 and 100");
//         setLoading(false);
//         return;
//       }
//       formDataToSend.append("tax", taxValue.toString());

//       if (isAdmin && !isEditMode && formData.vendorId) {
//         formDataToSend.append("vendorId", formData.vendorId);
//       }

//       if (formData.productType)
//         formDataToSend.append("productType", formData.productType);
//       if (formData.productTypeValue)
//         formDataToSend.append("productTypeValue", formData.productTypeValue);
//       if (formData.productTypeUnit)
//         formDataToSend.append("productTypeUnit", formData.productTypeUnit);

//       if (formData.tags.length > 0) {
//         formDataToSend.append("tags", formData.tags.join(","));
//       }

//       formData.images.forEach((image) => {
//         if (image instanceof File) formDataToSend.append("images", image);
//       });

//       if (isEditMode && formData.existingImages.length > 0) {
//         formDataToSend.append(
//           "existingImages",
//           JSON.stringify(formData.existingImages),
//         );
//       }

//       let productId =
//         editingProduct?.id || editingProduct?._id || editingProduct?.productId;
//       if (productId && typeof productId === "object") {
//         productId = extractId(productId) || productId.toString();
//       }
//       productId = productId?.toString() || productId;

//       const apiEndpoint = isEditMode
//         ? isAdmin
//           ? `/api/admin/products/${productId}`
//           : `/api/product/update/${productId}`
//         : `/api/product/add`;

//       const config = { headers: { "Content-Type": undefined } };

//       const response = isEditMode
//         ? await api.put(apiEndpoint, formDataToSend, config)
//         : await api.post(apiEndpoint, formDataToSend, config);

//       const result = response.data;

//       if (response.status === 401)
//         throw new Error("Session expired. Please log in again.");
//       if (response.status === 403)
//         throw new Error("Access denied. You may not have permission.");
//       if (response.status === 400)
//         throw new Error(
//           result.message || "Invalid product data. Please check all fields.",
//         );
//       if (!result.success)
//         throw new Error(
//           result.message ||
//             `Failed to ${isEditMode ? "update" : "add"} product`,
//         );

//       showToast.success(`Product ${isEditMode ? "updated" : "added"} successfully!`);

//       if (onSuccess) onSuccess(result.data);

//       setFormData({
//         productName: "",
//         description: "",
//         skuHsn: "",
//         inventory: "",
//         category: "",
//         subCategory: "",
//         actualPrice: "",
//         regularPrice: "",
//         salePrice: "",
//         cashback: "",
//         tax: "",
//         productType: "",
//         productTypeValue: "",
//         productTypeUnit: "",
//         tags: [],
//         images: [],
//         existingImages: [],
//         vendorId: "",
//       });
//       setTagInput("");

//       setTimeout(() => onClose(), 300);
//     } catch (err) {
//       //       setError(
//         err.response?.data?.message ||
//           err.message ||
//           `Failed to ${
//             isEditMode ? "update" : "submit"
//           } product. Please try again.`,
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   const totalImages = formData.images.length + formData.existingImages.length;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-2">
//       <div className="bg-white w-full max-w-[1100px] rounded-md shadow-lg relative border border-gray-300 max-h-[90vh] flex flex-col">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-orange-500 hover:text-red-600 text-lg font-bold z-10"
//         >
//           ✕
//         </button>

//         <h2 className="text-[14px] font-bold border-b border-gray-300 pb-2 pt-3 px-5">
//           {isEditMode ? "Edit Product" : "Add Product"}
//         </h2>

//         {error && (
//           <div className="mx-5 mt-3 p-3 bg-red-50 border border-red-300 text-red-700 rounded-sm text-[13px]">
//             {error}
//           </div>
//         )}

//         <div className="overflow-y-auto px-5 py-4">
//           <div className="space-y-4 text-[13px]">
//             {/* Product Name, Description, Image Upload */}
//             <div className="grid grid-cols-1 lg:grid-cols-[2.2fr,1fr] gap-4">
//               <div className="flex flex-col space-y-3">
//                 <div>
//                   <label className="block font-semibold mb-1">
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="productName"
//                     value={formData.productName}
//                     onChange={handleChange}
//                     placeholder="Enter product name"
//                     className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   />
//                 </div>
//                 <div className="flex flex-col flex-1">
//                   <label className="block font-semibold mb-1">
//                     Product Description *
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

//               {/* Image Upload Section */}
//               <div className="flex flex-col justify-end">
//                 <label className="block font-semibold mb-1">
//                   Upload Images ({totalImages}/6)
//                 </label>
//                 <p className="text-xs text-orange-600 font-medium mb-2 bg-orange-50 border border-orange-200 rounded-sm px-2 py-1">
//                   ⚠️ Only 1:1 (Square) ratio allowed - Images will be automatically cropped
//                 </p>
//                 <div className="border border-orange-400 rounded-sm h-[250px] sm:h-[280px] lg:h-[330px] overflow-y-auto p-2">
//                   <div className="grid grid-cols-2 gap-2">
//                     {formData.existingImages.map((img, index) => (
//                       <div
//                         key={`existing-${index}`}
//                         className="relative border border-gray-300 rounded-sm h-[100px]"
//                       >
//                         <img
//                           src={img.url || img}
//                           alt={`Existing ${index + 1}`}
//                           className="object-cover h-full w-full rounded-sm"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeExistingImage(index)}
//                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                         >
//                           ✕
//                         </button>
//                         <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1 rounded">
//                           Existing
//                         </span>
//                       </div>
//                     ))}
//                     {formData.images.map((img, index) => (
//                       <div
//                         key={`new-${index}`}
//                         className="relative border border-gray-300 rounded-sm h-[100px]"
//                       >
//                         <img
//                           src={URL.createObjectURL(img)}
//                           alt={`New ${index + 1}`}
//                           className="object-cover h-full w-full rounded-sm"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeNewImage(index)}
//                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                         >
//                           ✕
//                         </button>
//                         <span className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">
//                           New
//                         </span>
//                       </div>
//                     ))}
//                     {totalImages < 6 && (
//                       <label className="border border-dashed border-orange-400 rounded-sm h-[100px] flex items-center justify-center cursor-pointer hover:border-orange-600">
//                         <Upload size={30} className="text-orange-500" />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           multiple
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                       </label>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Vendor Selection (Admin only) */}
//             {isAdmin && !isEditMode && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block font-semibold mb-1">
//                     Select Vendor *
//                   </label>
//                   <select
//                     name="vendorId"
//                     value={formData.vendorId}
//                     onChange={handleChange}
//                     className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                     required
//                   >
//                     <option value="">Select a vendor</option>
//                     {vendorsLoading ? (
//                       <option>Loading vendors...</option>
//                     ) : (
//                       vendors.map((vendor) => (
//                         <option key={vendor._id} value={vendor._id}>
//                           {vendor.vendorName ||
//                             vendor.storeName ||
//                             vendor.contactNumber}{" "}
//                           - {vendor.storeName || "Store"}
//                         </option>
//                       ))
//                     )}
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* HSN, Stock, Category, Sub-Category */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">HSN *</label>
//                 <input
//                   type="text"
//                   name="skuHsn"
//                   value={formData.skuHsn}
//                   onChange={handleChange}
//                   placeholder="Enter Product HSN Code"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">Stock *</label>
//                 <input
//                   type="number"
//                   name="inventory"
//                   value={formData.inventory}
//                   onChange={handleChange}
//                   placeholder="Enter Stock"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Select Category *
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={categoriesLoading}
//                 >
//                   <option value="">
//                     {categoriesLoading ? "Loading..." : "Select Category"}
//                   </option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                       {cat.totalProducts > 0
//                         ? ` (${cat.totalProducts} products)`
//                         : ""}
//                     </option>
//                   ))}
//                 </select>
//                 {categoriesLoading && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     Loading categories...
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Select Sub-Category *
//                 </label>
//                 <select
//                   name="subCategory"
//                   value={formData.subCategory}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={!formData.category || subCategoriesLoading}
//                 >
//                   <option value="">
//                     {subCategoriesLoading
//                       ? "Loading..."
//                       : "Select Sub-Category"}
//                   </option>
//                   {subCategories.map((sub) => (
//                     <option key={sub._id} value={sub._id}>
//                       {sub.name}
//                     </option>
//                   ))}
//                 </select>
//                 {subCategoriesLoading && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     Loading subcategories...
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Pricing Fields */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Actual Price *
//                 </label>
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
//                 <label className="block font-semibold mb-1">
//                   Regular Price (MRP) *
//                 </label>
//                 <input
//                   type="number"
//                   name="regularPrice"
//                   value={formData.regularPrice}
//                   onChange={handleChange}
//                   placeholder="Enter Rupees in INR"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">Sale Price *</label>
//                 <input
//                   type="number"
//                   name="salePrice"
//                   value={formData.salePrice}
//                   onChange={handleChange}
//                   placeholder="Enter Rupees in INR"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
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
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">Tax (%)</label>
//                 <input
//                   type="number"
//                   name="tax"
//                   value={formData.tax}
//                   onChange={handleChange}
//                   placeholder="Enter Tax Percentage"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//             </div>

//             {/* Product Type Fields */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1">Product Type</label>
//                 <select
//                   name="productType"
//                   value={formData.productType}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 >
//                   {productTypeOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Product Type Value
//                 </label>
//                 <input
//                   type="number"
//                   name="productTypeValue"
//                   value={formData.productTypeValue}
//                   onChange={handleChange}
//                   placeholder="e.g., 1, 500, 2"
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Product Type Unit
//                 </label>
//                 <select
//                   name="productTypeUnit"
//                   value={formData.productTypeUnit}
//                   onChange={handleChange}
//                   className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
//                   disabled={!formData.productType}
//                 >
//                   {getUnitOptions().map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Tags */}
//             <div className="grid grid-cols-1 gap-4">
//               <div>
//                 <label className="block font-semibold mb-1 flex items-center gap-2">
//                   <span className="text-orange-500">🏷️</span> Tags
//                   <span className="text-gray-400 text-xs font-normal">
//                     (Press Enter to add)
//                   </span>
//                 </label>
//                 <div className="border border-orange-400 rounded-sm p-2 min-h-[80px] focus-within:ring-2 focus-within:ring-orange-300">
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {formData.tags.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="inline-flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-[12px] font-medium"
//                       >
//                         {tag}
//                         <button
//                           type="button"
//                           onClick={() => removeTag(index)}
//                           className="hover:bg-orange-600 rounded-full p-0.5 transition-colors"
//                         >
//                           <X size={14} />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                   <input
//                     type="text"
//                     value={tagInput}
//                     onChange={handleTagInputChange}
//                     onKeyDown={handleTagInputKeyDown}
//                     placeholder={
//                       formData.tags.length === 0
//                         ? "Add tags (e.g., fruits, apple, fresh, organic)"
//                         : "Add more..."
//                     }
//                     className="w-full focus:outline-none text-[13px] bg-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end mt-3">
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className={`${
//                   loading
//                     ? "bg-green-400 cursor-not-allowed"
//                     : "bg-green-700 hover:bg-green-800"
//                 } text-white px-6 py-2 rounded-sm text-[13px] font-semibold transition-colors`}
//               >
//                 {loading
//                   ? isEditMode
//                     ? "Updating..."
//                     : "Submitting..."
//                   : isEditMode
//                     ? "Update Product"
//                     : "Add Product"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CROP MODAL - 1:1 Aspect Ratio */}
//       {showCropModal && (
//         <div
//           className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-75"
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//         >
//           <div className="relative bg-white w-full max-w-4xl p-6 rounded-lg shadow-2xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-800">
//                 Crop Product Image (1:1 Aspect Ratio - Square)
//               </h3>
//               <button
//                 onClick={cancelCrop}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div
//               ref={cropContainerRef}
//               className="relative w-full bg-gray-900 rounded-lg overflow-hidden"
//               style={{ height: "500px", position: "relative" }}
//               onMouseDown={handleMouseDown}
//             >
//               <img
//                 ref={imageRef}
//                 src={cropImage}
//                 alt="Crop"
//                 className="w-full h-full object-contain"
//               />

//               {/* Overlay */}
//               <div className="absolute inset-0">
//                 <div
//                   className="absolute bg-black bg-opacity-50"
//                   style={{
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     height: `${cropArea.y}px`,
//                   }}
//                 />
//                 <div
//                   className="absolute bg-black bg-opacity-50"
//                   style={{
//                     top: `${cropArea.y + cropArea.height}px`,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                   }}
//                 />
//                 <div
//                   className="absolute bg-black bg-opacity-50"
//                   style={{
//                     top: `${cropArea.y}px`,
//                     left: 0,
//                     width: `${cropArea.x}px`,
//                     height: `${cropArea.height}px`,
//                   }}
//                 />
//                 <div
//                   className="absolute bg-black bg-opacity-50"
//                   style={{
//                     top: `${cropArea.y}px`,
//                     right: 0,
//                     width: `${cropContainerRef.current ? cropContainerRef.current.clientWidth - cropArea.x - cropArea.width : 0}px`,
//                     height: `${cropArea.height}px`,
//                   }}
//                 />
//               </div>

//               {/* Crop Box */}
//               <div
//                 ref={cropBoxRef}
//                 className="absolute border-2 border-white cursor-move"
//                 style={{
//                   left: `${cropArea.x}px`,
//                   top: `${cropArea.y}px`,
//                   width: `${cropArea.width}px`,
//                   height: `${cropArea.height}px`,
//                   boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
//                 }}
//               >
//                 {/* Resize handles - Top Left */}
//                 <div
//                   className="resize-handle absolute -top-2 -left-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize hover:bg-blue-100 transition-colors"
//                   data-handle="nw"
//                   title="Resize (1:1)"
//                 />

//                 {/* Resize handles - Top Right */}
//                 <div
//                   className="resize-handle absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize hover:bg-blue-100 transition-colors"
//                   data-handle="ne"
//                   title="Resize (1:1)"
//                 />

//                 {/* Resize handles - Bottom Left */}
//                 <div
//                   className="resize-handle absolute -bottom-2 -left-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize hover:bg-blue-100 transition-colors"
//                   data-handle="sw"
//                   title="Resize (1:1)"
//                 />

//                 {/* Resize handles - Bottom Right */}
//                 <div
//                   className="resize-handle absolute -bottom-2 -right-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize hover:bg-blue-100 transition-colors"
//                   data-handle="se"
//                   title="Resize (1:1)"
//                 />

//                 {/* Aspect ratio indicator */}
//                 <div className="absolute -bottom-8 left-0 right-0 text-center text-white text-sm font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
//                   1:1 Square (Drag corners to resize)
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 onClick={cancelCrop}
//                 className="px-5 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={applyCrop}
//                 className="px-5 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
//               >
//                 <Check size={16} />
//                 Apply Crop
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import { Upload, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/api";
import { showToast } from "../utils/toast";

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
    images: [],
    existingImages: [],
    vendorId: "",
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

  // ── Crop modal state ──────────────────────────────────────────────────────
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const cropContainerRef = useRef(null);
  const cropBoxRef = useRef(null);
  const imageRef = useRef(null);

  // ── FIX: Queue-based multi-image cropping ─────────────────────────────────
  const imageQueueRef = useRef([]); // pending File objects to crop
  const pendingImageIndex = useRef(null); // slot index in formData.images

  const isInitializingRef = useRef(false);

  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "admin";

  const productTypeOptions = [
    { value: "", label: "Select Type" },
    { value: "weight", label: "Weight" },
    { value: "volume", label: "Volume" },
    { value: "count", label: "Count" },
    { value: "piece", label: "Piece" },
  ];

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
      for (const key of ["_id", "id", "str"]) {
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

  const fetchVendors = async () => {
    if (!isAdmin) return;
    setVendorsLoading(true);
    try {
      const response = await api.get("/api/vendor");
      if (response.data.success) setVendors(response.data.data || []);
    } catch (err) {
      } finally {
      setVendorsLoading(false);
    }
  };

  // ── Main init effect ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    fetchCategories();
    if (isAdmin && !isEditMode) fetchVendors();

    if (isEditMode && editingProduct) {
      isInitializingRef.current = true;

      const categoryId = extractId(editingProduct.category);
      const subCategoryId = extractId(editingProduct.subCategory);

      const newFormData = {
        productName: editingProduct.name || editingProduct.productName || "",
        description: editingProduct.description || "",
        skuHsn: editingProduct.sku || editingProduct.skuHsn || "N/A",
        inventory:
          editingProduct.inventory != null
            ? String(editingProduct.inventory)
            : "0",
        category: categoryId,
        subCategory: subCategoryId,
        actualPrice:
          editingProduct.actualPrice != null
            ? String(editingProduct.actualPrice)
            : "0",
        regularPrice:
          editingProduct.regularPrice != null
            ? String(editingProduct.regularPrice)
            : "0",
        salePrice:
          editingProduct.salePrice != null
            ? String(editingProduct.salePrice)
            : "0",
        cashback:
          editingProduct.cashback != null
            ? String(editingProduct.cashback)
            : "0",
        tax: editingProduct.tax != null ? String(editingProduct.tax) : "0",
        productType: editingProduct.productType?.type || "",
        productTypeValue:
          editingProduct.productType?.value != null
            ? String(editingProduct.productType.value)
            : "",
        productTypeUnit: editingProduct.productType?.unit || "",
        tags: Array.isArray(editingProduct.tags) ? editingProduct.tags : [],
        images: [],
        existingImages: Array.isArray(editingProduct.images)
          ? editingProduct.images
          : [],
        vendorId: "",
      };

      setFormData(newFormData);
      setTagInput("");

      if (categoryId && /^[0-9a-fA-F]{24}$/.test(categoryId)) {
        fetchSubCategories(categoryId)
          .then(() => {
            setFormData((prev) => ({ ...prev, subCategory: subCategoryId }));
          })
          .catch(() => {})
          .finally(() => {
            isInitializingRef.current = false;
          });
      } else {
        isInitializingRef.current = false;
      }
    } else {
      isInitializingRef.current = false;
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
  }, [isOpen, isEditMode, editingProduct]);

  useEffect(() => {
    if (isInitializingRef.current) return;
    if (!formData.category) {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, subCategory: "" }));
      return;
    }
    const categoryIdStr = extractId(formData.category) || formData.category;
    if (!/^[0-9a-fA-F]{24}$/.test(categoryIdStr)) {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, subCategory: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, subCategory: "" }));
    fetchSubCategories(categoryIdStr);
  }, [formData.category]);

  useEffect(() => {
    if (isInitializingRef.current) return;
    if (formData.productType) {
      setFormData((prev) => ({ ...prev, productTypeUnit: "" }));
    }
  }, [formData.productType]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await api.get("/api/category");
      if (response.data.success) setCategories(response.data.data);
      else
        throw new Error(response.data.message || "Failed to load categories");
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    setSubCategoriesLoading(true);
    try {
      const categoryIdStr =
        typeof categoryId === "string" ? categoryId : extractId(categoryId);
      if (!categoryIdStr || !/^[0-9a-fA-F]{24}$/.test(categoryIdStr)) {
        setSubCategories([]);
        return [];
      }
      const response = await api.get(
        `/api/subcategory/by-category/${categoryIdStr}`,
      );
      if (response.data.success) {
        const normalized = (response.data.data || [])
          .map((subCat) => {
            const id = extractId(subCat._id || subCat.id);
            if (!id) return null;
            return {
              ...subCat,
              _id: id,
              name: subCat.name || subCat.subCategoryName || "Unnamed",
            };
          })
          .filter(Boolean);
        setSubCategories(normalized);
        return normalized;
      } else {
        throw new Error(
          response.data.message || "Failed to load subcategories",
        );
      }
    } catch (err) {
      setError("Failed to load subcategories");
      return [];
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if ((name === "category" || name === "subCategory") && value) {
      processedValue = /^[0-9a-fA-F]{24}$/.test(value)
        ? value
        : extractId(value) || "";
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (error) setError("");
  };

  // ── FIX: Queue all selected files, open crop one-by-one ──────────────────
  const openNextCrop = (currentImages, queue) => {
    if (queue.length === 0) return;

    const totalImages = currentImages.length;
    const totalExisting = formData.existingImages.length;
    if (totalImages + totalExisting >= 6) return; // max reached

    const nextFile = queue[0];
    const remaining = queue.slice(1);
    imageQueueRef.current = remaining;

    const reader = new FileReader();
    reader.onloadend = () => {
      pendingImageIndex.current = totalImages; // append at end
      setCropImage(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(nextFile);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length === 0) return;

    const totalExisting = formData.existingImages.length;
    const totalCurrent = formData.images.length;
    const available = 6 - totalExisting - totalCurrent;
    const toProcess = files.slice(0, available);

    if (toProcess.length === 0) {
      showToast.warning("Maximum 6 images allowed.");
      e.target.value = "";
      return;
    }

    // Save queue and open first
    imageQueueRef.current = toProcess.slice(1);
    openNextCrop(formData.images, toProcess);
    e.target.value = "";
  };

  // ── Crop area init (1:1) ──────────────────────────────────────────────────
  useEffect(() => {
    if (showCropModal && cropImage && cropContainerRef.current) {
      const container = cropContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const cropSize = Math.min(
        containerWidth * 0.8,
        containerHeight * 0.8,
        500,
      );
      const x = (containerWidth - cropSize) / 2;
      const y = (containerHeight - cropSize) / 2;
      setCropArea({ x, y, width: cropSize, height: cropSize });
    }
  }, [showCropModal, cropImage]);

  // ── Drag & Resize handlers ────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    if (e.target.classList.contains("resize-handle")) {
      setIsResizing(true);
      setResizeHandle(e.target.dataset.handle);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: cropArea.width,
        height: cropArea.height,
        cropX: cropArea.x,
        cropY: cropArea.y,
      });
      e.stopPropagation();
      return;
    }
    if (
      e.target === cropBoxRef.current ||
      cropBoxRef.current?.contains(e.target)
    ) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - cropArea.x, y: e.clientY - cropArea.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!cropContainerRef.current) return;
    const container = cropContainerRef.current;
    const rect = container.getBoundingClientRect();

    if (isResizing && resizeHandle) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      let newSize = resizeStart.width;
      let newX = resizeStart.cropX;
      let newY = resizeStart.cropY;

      const scale = Math.max(
        Math.abs(resizeStart.width + deltaX) / resizeStart.width,
        Math.abs(resizeStart.height + deltaY) / resizeStart.height,
      );
      newSize = resizeStart.width * scale;

      if (resizeHandle === "sw" || resizeHandle === "nw")
        newX = resizeStart.cropX + resizeStart.width - newSize;
      if (resizeHandle === "ne" || resizeHandle === "nw")
        newY = resizeStart.cropY + resizeStart.height - newSize;

      const maxSize = Math.min(container.clientWidth, container.clientHeight);
      newSize = Math.max(100, Math.min(newSize, maxSize));

      if (newX + newSize > container.clientWidth)
        newX = container.clientWidth - newSize;
      if (newY + newSize > container.clientHeight)
        newY = container.clientHeight - newSize;

      setCropArea({
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: newSize,
        height: newSize,
      });
      return;
    }

    if (isDragging) {
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;
      const maxX = container.clientWidth - cropArea.width;
      const maxY = container.clientHeight - cropArea.height;
      setCropArea((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  // ── Apply crop → save blob → open next in queue ───────────────────────────
  const applyCrop = () => {
    if (!cropImage || !imageRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const container = cropContainerRef.current;
      const scaleX = img.width / container.clientWidth;
      const scaleY = img.height / container.clientHeight;

      const cropX = cropArea.x * scaleX;
      const cropY = cropArea.y * scaleY;
      const cropSize = cropArea.width * scaleX;
      const outputSize = 1000;
      canvas.width = outputSize;
      canvas.height = outputSize;

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropSize,
        cropSize,
        0,
        0,
        outputSize,
        outputSize,
      );

      canvas.toBlob(
        (blob) => {
          const file = new File([blob], `product-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const slotIndex = pendingImageIndex.current;

          setFormData((prev) => {
            const newImages = [...prev.images];
            newImages[slotIndex] = file;

            // After state update, process next in queue
            setTimeout(() => {
              if (imageQueueRef.current.length > 0) {
                const totalExisting = prev.existingImages.length;
                if (newImages.length + totalExisting < 6) {
                  openNextCrop(newImages, imageQueueRef.current);
                } else {
                  imageQueueRef.current = [];
                }
              }
            }, 0);

            return { ...prev, images: newImages };
          });

          setShowCropModal(false);
          setCropImage(null);
          pendingImageIndex.current = null;
        },
        "image/jpeg",
        0.9,
      );
    };
    img.src = cropImage;
  };

  const cancelCrop = () => {
    imageQueueRef.current = []; // clear queue on cancel
    setShowCropModal(false);
    setCropImage(null);
    pendingImageIndex.current = null;
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

  const handleTagInputChange = (e) => setTagInput(e.target.value);

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
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
      setError(
        "Please fill in all required fields including product type, value, and unit",
      );
      setLoading(false);
      return;
    }

    if (isAdmin && !isEditMode && !formData.vendorId) {
      setError("Please select a vendor");
      setLoading(false);
      return;
    }

    if (isEditMode) {
      if (
        formData.images.length === 0 &&
        formData.existingImages.length === 0
      ) {
        setError(
          "Please upload at least one product image or keep existing images",
        );
        setLoading(false);
        return;
      }
    } else {
      if (formData.images.length === 0) {
        setError("Please upload at least one product image");
        setLoading(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      const categoryId = extractId(formData.category) || formData.category;
      const subCategoryId =
        extractId(formData.subCategory) || formData.subCategory;

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

      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("skuHsn", formData.skuHsn || "");
      formDataToSend.append("inventory", formData.inventory || "0");
      formDataToSend.append("category", categoryId);
      formDataToSend.append("subCategory", subCategoryId);
      formDataToSend.append("actualPrice", formData.actualPrice);
      formDataToSend.append("regularPrice", formData.regularPrice);
      formDataToSend.append("salePrice", formData.salePrice);

      const cashbackValue = formData.cashback
        ? parseFloat(formData.cashback)
        : 0;
      if (cashbackValue < 0) {
        setError("Cashback must be >= 0");
        setLoading(false);
        return;
      }
      formDataToSend.append("cashback", cashbackValue.toString());

      const taxValue = formData.tax ? parseFloat(formData.tax) : 0;
      if (taxValue < 0 || taxValue > 100) {
        setError("Tax must be between 0 and 100");
        setLoading(false);
        return;
      }
      formDataToSend.append("tax", taxValue.toString());

      if (isAdmin && !isEditMode && formData.vendorId)
        formDataToSend.append("vendorId", formData.vendorId);

      if (formData.productType)
        formDataToSend.append("productType", formData.productType);
      if (formData.productTypeValue)
        formDataToSend.append("productTypeValue", formData.productTypeValue);
      if (formData.productTypeUnit)
        formDataToSend.append("productTypeUnit", formData.productTypeUnit);

      if (formData.tags.length > 0)
        formDataToSend.append("tags", formData.tags.join(","));

      formData.images.forEach((image) => {
        if (image instanceof File) formDataToSend.append("images", image);
      });

      if (isEditMode && formData.existingImages.length > 0)
        formDataToSend.append(
          "existingImages",
          JSON.stringify(formData.existingImages),
        );

      let productId =
        editingProduct?.id || editingProduct?._id || editingProduct?.productId;
      if (productId && typeof productId === "object")
        productId = extractId(productId) || productId.toString();
      productId = productId?.toString() || productId;

      const apiEndpoint = isEditMode
        ? isAdmin
          ? `/api/admin/products/${productId}`
          : `/api/product/update/${productId}`
        : `/api/product/add`;

      const config = { headers: { "Content-Type": undefined } };
      const response = isEditMode
        ? await api.put(apiEndpoint, formDataToSend, config)
        : await api.post(apiEndpoint, formDataToSend, config);

      const result = response.data;
      if (response.status === 401)
        throw new Error("Session expired. Please log in again.");
      if (response.status === 403)
        throw new Error("Access denied. You may not have permission.");
      if (response.status === 400)
        throw new Error(result.message || "Invalid product data.");
      if (!result.success)
        throw new Error(
          result.message ||
            `Failed to ${isEditMode ? "update" : "add"} product`,
        );

      showToast.success(`Product ${isEditMode ? "updated" : "added"} successfully!`);
      if (onSuccess) onSuccess(result.data);

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
      setTimeout(() => onClose(), 300);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? "update" : "submit"} product. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalImages = formData.images.length + formData.existingImages.length;
  const remainingSlots = 6 - totalImages;

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
            {/* Product Name, Description, Image Upload */}
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
                  />
                </div>
              </div>

              {/* ── FIX: Improved Gallery Section ── */}
              <div className="flex flex-col">
                <label className="block font-semibold mb-1">
                  Upload Images
                  <span
                    className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${totalImages >= 6 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}
                  >
                    {totalImages}/6
                  </span>
                </label>

                <p className="text-xs text-orange-600 font-medium mb-2 bg-orange-50 border border-orange-200 rounded-sm px-2 py-1">
                  ⚠️ Only 1:1 (Square) ratio — images will be cropped
                  automatically
                </p>

                {/* Gallery Grid */}
                <div
                  className="border border-orange-400 rounded-sm flex-1 overflow-y-auto p-2"
                  style={{ minHeight: "280px", maxHeight: "330px" }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {/* Existing images */}
                    {formData.existingImages.map((img, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative border border-gray-200 rounded-sm overflow-hidden bg-gray-50"
                        style={{ aspectRatio: "1/1" }}
                      >
                        <img
                          src={img.url || img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow transition-colors"
                        >
                          <X size={10} />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                          Saved
                        </span>
                      </div>
                    ))}

                    {/* New images */}
                    {formData.images.map((img, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative border border-orange-200 rounded-sm overflow-hidden bg-gray-50"
                        style={{ aspectRatio: "1/1" }}
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`New ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow transition-colors"
                        >
                          <X size={10} />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                          New
                        </span>
                      </div>
                    ))}

                    {/* Upload button — only show if slots remain */}
                    {totalImages < 6 && (
                      <label
                        className="border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 transition-all"
                        style={{ aspectRatio: "1/1" }}
                      >
                        <Upload size={22} className="text-orange-400 mb-1" />
                        <span className="text-[10px] text-orange-400 font-medium text-center leading-tight px-1">
                          Add Photo
                          <br />
                          <span className="text-gray-400">
                            {remainingSlots} left
                          </span>
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Placeholder slots (empty visual) */}
                    {Array.from({
                      length: Math.max(0, Math.min(2, 6 - totalImages - 1)),
                    }).map((_, i) => (
                      <div
                        key={`placeholder-${i}`}
                        className="border border-dashed border-gray-200 rounded-sm bg-gray-50 flex items-center justify-center"
                        style={{ aspectRatio: "1/1" }}
                      >
                        <span className="text-gray-300 text-xs">Empty</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Gallery</span>
                    <span>{totalImages} of 6 uploaded</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${(totalImages / 6) * 100}%`,
                        backgroundColor:
                          totalImages >= 6 ? "#ef4444" : "#f97316",
                      }}
                    />
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
                          {vendor.vendorName ||
                            vendor.storeName ||
                            vendor.contactNumber}{" "}
                          - {vendor.storeName || "Store"}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* HSN, Stock, Category, Sub-Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1">HSN *</label>
                <input
                  type="text"
                  name="skuHsn"
                  value={formData.skuHsn}
                  onChange={handleChange}
                  placeholder="Enter Product HSN Code"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Stock *</label>
                <input
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleChange}
                  placeholder="Enter Stock"
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
                      {cat.totalProducts > 0 ? ` (${cat.totalProducts})` : ""}
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
                  disabled={!formData.category || subCategoriesLoading}
                >
                  <option value="">
                    {subCategoriesLoading
                      ? "Loading..."
                      : "Select Sub-Category"}
                  </option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  label: "Actual Price *",
                  name: "actualPrice",
                  placeholder: "Enter INR",
                },
                {
                  label: "Regular Price (MRP) *",
                  name: "regularPrice",
                  placeholder: "Enter INR",
                },
                {
                  label: "Sale Price *",
                  name: "salePrice",
                  placeholder: "Enter INR",
                },
                {
                  label: "Cashback",
                  name: "cashback",
                  placeholder: "Cashback Amount",
                },
                { label: "Tax (%)", name: "tax", placeholder: "Tax %" },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="block font-semibold mb-1">{label}</label>
                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  />
                </div>
              ))}
            </div>

            {/* Product Type Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                >
                  {productTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
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
                  {getUnitOptions().map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-2">
                <span className="text-orange-500">🏷️</span> Tags
                <span className="text-gray-400 text-xs font-normal">
                  (Press Enter to add)
                </span>
              </label>
              <div className="border border-orange-400 rounded-sm p-2 min-h-[80px] focus-within:ring-2 focus-within:ring-orange-300">
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
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder={
                    formData.tags.length === 0
                      ? "Add tags (e.g., fruits, apple, fresh)"
                      : "Add more..."
                  }
                  className="w-full focus:outline-none text-[13px] bg-transparent"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"} text-white px-6 py-2 rounded-sm text-[13px] font-semibold transition-colors`}
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

      {/* ── CROP MODAL ── */}
      {showCropModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-75"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative bg-white w-full max-w-4xl p-6 rounded-lg shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Crop Image (1:1 Square)
                </h3>
                {imageQueueRef.current.length > 0 && (
                  <p className="text-xs text-orange-500 mt-0.5">
                    +{imageQueueRef.current.length} more image
                    {imageQueueRef.current.length > 1 ? "s" : ""} waiting...
                  </p>
                )}
              </div>
              <button
                onClick={cancelCrop}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div
              ref={cropContainerRef}
              className="relative w-full bg-gray-900 rounded-lg overflow-hidden"
              style={{ height: "500px" }}
              onMouseDown={handleMouseDown}
            >
              <img
                ref={imageRef}
                src={cropImage}
                alt="Crop preview"
                className="w-full h-full object-contain"
              />

              {/* Dark overlay (4 sides) */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute bg-black bg-opacity-50"
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${cropArea.y}px`,
                  }}
                />
                <div
                  className="absolute bg-black bg-opacity-50"
                  style={{
                    top: `${cropArea.y + cropArea.height}px`,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                <div
                  className="absolute bg-black bg-opacity-50"
                  style={{
                    top: `${cropArea.y}px`,
                    left: 0,
                    width: `${cropArea.x}px`,
                    height: `${cropArea.height}px`,
                  }}
                />
                <div
                  className="absolute bg-black bg-opacity-50"
                  style={{
                    top: `${cropArea.y}px`,
                    right: 0,
                    width: `${cropContainerRef.current ? cropContainerRef.current.clientWidth - cropArea.x - cropArea.width : 0}px`,
                    height: `${cropArea.height}px`,
                  }}
                />
              </div>

              {/* Crop box */}
              <div
                ref={cropBoxRef}
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: `${cropArea.x}px`,
                  top: `${cropArea.y}px`,
                  width: `${cropArea.width}px`,
                  height: `${cropArea.height}px`,
                }}
              >
                {/* Grid lines */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                    backgroundSize: "33.33% 33.33%",
                  }}
                />

                {[
                  {
                    pos: "-top-2.5 -left-2.5",
                    handle: "nw",
                    cursor: "cursor-nwse-resize",
                  },
                  {
                    pos: "-top-2.5 -right-2.5",
                    handle: "ne",
                    cursor: "cursor-nesw-resize",
                  },
                  {
                    pos: "-bottom-2.5 -left-2.5",
                    handle: "sw",
                    cursor: "cursor-nesw-resize",
                  },
                  {
                    pos: "-bottom-2.5 -right-2.5",
                    handle: "se",
                    cursor: "cursor-nwse-resize",
                  },
                ].map(({ pos, handle, cursor }) => (
                  <div
                    key={handle}
                    className={`resize-handle absolute ${pos} w-5 h-5 bg-white border-2 border-orange-500 rounded-full ${cursor} hover:bg-orange-50 transition-colors shadow`}
                    data-handle={handle}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-gray-500">
                Drag to move • Drag corners to resize
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelCrop}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors text-sm"
                >
                  Cancel All
                </button>
                <button
                  onClick={applyCrop}
                  className="px-5 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Check size={16} />
                  {imageQueueRef.current.length > 0
                    ? `Crop & Next (${imageQueueRef.current.length} left)`
                    : "Apply Crop"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
