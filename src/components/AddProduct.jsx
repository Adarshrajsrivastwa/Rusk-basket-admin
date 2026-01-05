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
import React, { useState, useEffect } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function AddProductPopup({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    category: "",
    subCategory: "",
    description: "",
    sku: "",
    inventory: "",
    actualPrice: "",
    regularPrice: "",
    salePrice: "",
    cashback: "",
    tags: "",
    images: Array(5).fill(null),
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchSubCategories();
    }
  }, [isOpen]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (formData.category) {
      const filtered = subCategories.filter(
        (sub) =>
          sub.category === formData.category ||
          sub.categoryName === formData.category
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [formData.category, subCategories]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch(
        "https://rush-basket.onrender.com/api/v1/categories"
      );
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubCategories = async () => {
    setLoadingSubCategories(true);
    try {
      const response = await fetch(
        "https://rush-basket.onrender.com/api/v1/sub-categories"
      );
      if (!response.ok) throw new Error("Failed to fetch sub-categories");

      const data = await response.json();
      setSubCategories(data.data || []);
    } catch (err) {
      console.error("Error fetching sub-categories:", err);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitStatus(null);

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData((prev) => ({ ...prev, subCategory: "" }));
    }
  };

  const handleImageUpload = (index, e) => {
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

      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Product Name is required");
      return false;
    }
    if (!formData.category) {
      setErrorMessage("Category is required");
      return false;
    }
    if (!formData.regularPrice || formData.regularPrice <= 0) {
      setErrorMessage("Regular Price is required and must be greater than 0");
      return false;
    }
    if (!formData.salePrice || formData.salePrice <= 0) {
      setErrorMessage("Sale Price is required and must be greater than 0");
      return false;
    }
    if (!formData.tags.trim()) {
      setErrorMessage("Tags are required");
      return false;
    }

    // Check if at least one image is uploaded
    const hasImages = formData.images.some((img) => img !== null);
    if (!hasImages) {
      setErrorMessage("At least one product image is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrorMessage("");

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields according to API requirements
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("quantity", formData.quantity || "");
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subCategory", formData.subCategory || "");
      formDataToSend.append("description", formData.description.trim() || "");
      formDataToSend.append("sku", formData.sku.trim() || "");
      formDataToSend.append("inventory", formData.inventory || "0");
      formDataToSend.append(
        "actualPrice",
        formData.actualPrice || formData.regularPrice
      );
      formDataToSend.append("regularPrice", formData.regularPrice);
      formDataToSend.append("salePrice", formData.salePrice);
      formDataToSend.append("cashback", formData.cashback || "0");
      formDataToSend.append("tags", formData.tags.trim());

      // Append images (only non-null files)
      formData.images.forEach((file) => {
        if (file) {
          formDataToSend.append("images", file);
        }
      });

      console.log("Submitting product data...");

      const response = await fetch(
        "https://rush-basket.onrender.com/api/v1/products",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        console.log("✅ Product added successfully:", result);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result.data);
        }

        // Reset form and close modal after delay
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          result.message || "Failed to add product. Please try again."
        );
        console.error("Error response:", result);
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: "",
      unit: "kg",
      category: "",
      subCategory: "",
      description: "",
      sku: "",
      inventory: "",
      actualPrice: "",
      regularPrice: "",
      salePrice: "",
      cashback: "",
      tags: "",
      images: Array(5).fill(null),
    });
    setSubmitStatus(null);
    setErrorMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-2">
      <div className="bg-white w-full max-w-[1100px] rounded-md shadow-lg relative border border-gray-300 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-orange-500 hover:text-red-600 text-lg font-bold z-10"
          disabled={isSubmitting}
        >
          ✕
        </button>

        <h2 className="text-[14px] font-bold border-b border-gray-300 pb-2 pt-3 px-5">
          Add Product
        </h2>

        {submitStatus === "success" && (
          <div className="mx-5 mt-4 p-3 bg-green-50 border border-green-300 rounded-sm flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-green-700 text-[13px] font-medium">
              Product added successfully!
            </span>
          </div>
        )}

        {submitStatus === "error" && errorMessage && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-300 rounded-sm flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600" />
            <span className="text-red-700 text-[13px] font-medium">
              {errorMessage}
            </span>
          </div>
        )}

        <div className="overflow-y-auto px-5 py-4">
          <div className="space-y-4 text-[13px]">
            <div>
              <label className="block font-semibold mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                disabled={isSubmitting}
                maxLength={100}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[2fr,1fr] gap-4">
              <div>
                <label className="block font-semibold mb-1">
                  Product Quantity / Weight / Volume
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity, weight, or volume"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={isSubmitting}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="l">Liter (l)</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="box">Box</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={isSubmitting || loadingCategories}
                >
                  <option value="">
                    {loadingCategories ? "Loading..." : "Select Category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name || cat.categoryName}>
                      {cat.name || cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Select Sub-Category
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={
                    isSubmitting || !formData.category || loadingSubCategories
                  }
                >
                  <option value="">
                    {loadingSubCategories
                      ? "Loading..."
                      : !formData.category
                      ? "Select Category First"
                      : "Select Sub-Category"}
                  </option>
                  {filteredSubCategories.map((sub) => (
                    <option key={sub._id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Product Images <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {formData.images.map((img, i) => (
                  <div
                    key={i}
                    className="border border-orange-400 rounded-sm h-[120px] sm:h-[130px] md:h-[150px] flex items-center justify-center relative hover:border-orange-600 transition"
                  >
                    {img ? (
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Image ${i + 1}`}
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <Upload size={35} className="text-orange-500" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(i, e)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isSubmitting}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max file size: 5MB per image. At least one image is required.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Product Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Write product description"
                className="w-full border border-orange-400 rounded-sm p-2 resize-none focus:outline-none text-[13px]"
                disabled={isSubmitting}
                maxLength={1000}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">SKU/HSN</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter Product HSN/SKU Code"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Inventory</label>
                <input
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleChange}
                  placeholder="Enter Inventory"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={isSubmitting}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1">Actual Price</label>
                <input
                  type="number"
                  name="actualPrice"
                  value={formData.actualPrice}
                  onChange={handleChange}
                  placeholder="Enter Rupees in INR"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Regular Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="regularPrice"
                  value={formData.regularPrice}
                  onChange={handleChange}
                  placeholder="Enter Rupees in INR"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Sale Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="Enter Rupees in INR"
                  className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none text-[13px]"
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
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
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Tags <span className="text-red-500">*</span>
              </label>
              <textarea
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Use for product search - separate tags with commas (e.g., fresh, organic, healthy)"
                rows="3"
                className="w-full border border-orange-400 rounded-sm p-2 resize-none focus:outline-none text-[13px]"
                disabled={isSubmitting}
                maxLength={500}
              ></textarea>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-sm text-[13px] font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
