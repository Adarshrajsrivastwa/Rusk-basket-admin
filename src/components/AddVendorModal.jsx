// import React, { useState } from "react";
// import { UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import VendorLoginModal from "./VendorLoginModal";

// const AddVendorModal = ({ isOpen, onClose }) => {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [formData, setFormData] = useState({
//     authorizedPersonName: "",
//     contactNumber: "",
//     altContactNumber: "",
//     email: "",
//     gender: "",
//     dob: "",
//     storeId: "",
//     storeName: "",
//     storeImage: "",
//     storeAddress1: "",
//     storeAddress2: "",
//     city: "",
//     pinCode: "",
//     state: "",
//     storeLat: "",
//     storeLong: "",
//   });
//   const [errors, setErrors] = useState({});

//   if (!isOpen) return null;

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.authorizedPersonName.trim()) {
//       newErrors.authorizedPersonName = "Authorized person name is required";
//     }

//     if (!formData.contactNumber.trim()) {
//       newErrors.contactNumber = "Contact number is required";
//     } else if (!/^\d{10}$/.test(formData.contactNumber)) {
//       newErrors.contactNumber = "Contact number must be 10 digits";
//     }

//     if (
//       formData.altContactNumber &&
//       !/^\d{10}$/.test(formData.altContactNumber)
//     ) {
//       newErrors.altContactNumber = "Alt. contact number must be 10 digits";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Enter a valid email address";
//     }

//     if (!formData.gender) {
//       newErrors.gender = "Please select gender";
//     }

//     if (!formData.dob) {
//       newErrors.dob = "Date of birth is required";
//     }

//     if (!formData.storeId.trim()) {
//       newErrors.storeId = "Store ID is required";
//     }

//     if (!formData.storeName.trim()) {
//       newErrors.storeName = "Store name is required";
//     }

//     if (!formData.storeAddress1.trim()) {
//       newErrors.storeAddress1 = "Store address line 1 is required";
//     }

//     if (!formData.city.trim()) {
//       newErrors.city = "City is required";
//     }

//     if (!formData.pinCode.trim()) {
//       newErrors.pinCode = "Pin code is required";
//     } else if (!/^\d{6}$/.test(formData.pinCode)) {
//       newErrors.pinCode = "Pin code must be 6 digits";
//     }

//     if (!formData.state.trim()) {
//       newErrors.state = "State is required";
//     }

//     if (
//       formData.storeLat &&
//       (isNaN(formData.storeLat) ||
//         formData.storeLat < -90 ||
//         formData.storeLat > 90)
//     ) {
//       newErrors.storeLat = "Invalid latitude (-90 to 90)";
//     }

//     if (
//       formData.storeLong &&
//       (isNaN(formData.storeLong) ||
//         formData.storeLong < -180 ||
//         formData.storeLong > 180)
//     ) {
//       newErrors.storeLong = "Invalid longitude (-180 to 180)";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//     if (errors[id]) {
//       setErrors((prev) => ({ ...prev, [id]: "" }));
//     }
//   };

//   const handleRadioChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleNextClick = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setShowLoginModal(true);
//     }
//   };

//   const handleCloseLoginModal = () => {
//     setShowLoginModal(false);
//     onClose();
//   };

//   return (
//     <>
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
//         <div
//           className="bg-white shadow-lg w-full max-w-4xl relative"
//           style={{
//             maxHeight: "95vh",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-6 py-4 border-b">
//             <h2 className="text-lg font-bold text-gray-800 underline decoration-[#FF7B1D] decoration-4 underline-offset-4">
//               Add Vendor
//             </h2>

//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800"
//             >
//               <XMarkIcon className="h-6 w-6" />
//             </button>
//           </div>

//           {/* Form - Scrollable Content */}
//           <div className="overflow-y-auto flex-1 px-6 py-4">
//             <form onSubmit={handleNextClick}>
//               {/* Row 1: Authorized Person Name, Contact Number, Alt Contact Number */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label
//                     htmlFor="authorizedPersonName"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Authorized Person Name
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="authorizedPersonName"
//                       type="text"
//                       value={formData.authorizedPersonName}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                         errors.authorizedPersonName
//                           ? "border-red-500"
//                           : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.authorizedPersonName && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.authorizedPersonName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="contactNumber"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Contact Number
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="contactNumber"
//                       type="text"
//                       value={formData.contactNumber}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       maxLength="10"
//                       className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                         errors.contactNumber
//                           ? "border-red-500"
//                           : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.contactNumber && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.contactNumber}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="altContactNumber"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Alt. Contact Number
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="altContactNumber"
//                       type="text"
//                       value={formData.altContactNumber}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       maxLength="10"
//                       className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                         errors.altContactNumber
//                           ? "border-red-500"
//                           : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.altContactNumber && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.altContactNumber}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Row 2: Email ID, Gender, Date of Birth */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Email ID
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       className={`w-full px-3 py-2 text-sm border ${
//                         errors.email ? "border-red-500" : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Gender
//                   </label>
//                   <div className="flex items-center gap-6 py-2">
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="male"
//                         checked={formData.gender === "male"}
//                         onChange={handleRadioChange}
//                         className="accent-orange-500"
//                       />
//                       <span className="text-sm text-gray-700">Male</span>
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="female"
//                         checked={formData.gender === "female"}
//                         onChange={handleRadioChange}
//                         className="accent-orange-500"
//                       />
//                       <span className="text-sm text-gray-700">Female</span>
//                     </label>
//                   </div>
//                   {errors.gender && (
//                     <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="dob"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Date of Birth
//                   </label>
//                   <input
//                     id="dob"
//                     type="date"
//                     value={formData.dob}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.dob ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                   />
//                   {errors.dob && (
//                     <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Row 3: Store ID, Store Name, Store Image */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label
//                     htmlFor="storeId"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Store ID
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="storeId"
//                       type="text"
//                       value={formData.storeId}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                         errors.storeId ? "border-red-500" : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.storeId && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.storeId}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="storeName"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Store Name
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="storeName"
//                       type="text"
//                       value={formData.storeName}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                         errors.storeName
//                           ? "border-red-500"
//                           : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.storeName && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.storeName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="storeImage"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Store Image
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="storeImage"
//                       type="text"
//                       value={formData.storeImage}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       className="w-full pl-9 pr-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Row 4: Store Address Line 1 */}
//               <div className="mb-4">
//                 <label
//                   htmlFor="storeAddress1"
//                   className="block text-sm text-gray-700 font-bold mb-1"
//                 >
//                   Store Address Line 1
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                     <UserIcon className="h-4 w-4 text-gray-700" />
//                   </span>
//                   <input
//                     id="storeAddress1"
//                     type="text"
//                     value={formData.storeAddress1}
//                     onChange={handleInputChange}
//                     placeholder="Enter Authorized Person Name of Store"
//                     className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                       errors.storeAddress1
//                         ? "border-red-500"
//                         : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                   />
//                 </div>
//                 {errors.storeAddress1 && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.storeAddress1}
//                   </p>
//                 )}
//               </div>

//               {/* Row 5: Store Address Line 2 */}
//               <div className="mb-4">
//                 <label
//                   htmlFor="storeAddress2"
//                   className="block text-sm text-gray-700 font-bold mb-1"
//                 >
//                   Store Address Line 2
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                     <UserIcon className="h-4 w-4 text-gray-700" />
//                   </span>
//                   <input
//                     id="storeAddress2"
//                     type="text"
//                     value={formData.storeAddress2}
//                     onChange={handleInputChange}
//                     placeholder="Enter Authorized Person Name of Store"
//                     className="w-full pl-9 pr-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Row 6: City, Pin Code, State */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label
//                     htmlFor="city"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     City
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="city"
//                       type="text"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                         errors.city ? "border-red-500" : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.city && (
//                     <p className="text-red-500 text-xs mt-1">{errors.city}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="pinCode"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Pin Code
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="pinCode"
//                       type="text"
//                       value={formData.pinCode}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       maxLength="6"
//                       className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                         errors.pinCode ? "border-red-500" : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.pinCode && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.pinCode}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="state"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     State
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                       <UserIcon className="h-4 w-4 text-gray-700" />
//                     </span>
//                     <input
//                       id="state"
//                       type="text"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       placeholder="Enter Authorized Person Name of Store"
//                       className={`w-full pl-9 pr-3 py-2 text-sm border ${
//                         errors.state ? "border-red-500" : "border-orange-400"
//                       } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                     />
//                   </div>
//                   {errors.state && (
//                     <p className="text-red-500 text-xs mt-1">{errors.state}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Row 7: Store Location (Lat & Long) + Next Button */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//                 <div>
//                   <label
//                     htmlFor="storeLat"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Store Current Location ( Lat. )
//                   </label>
//                   <input
//                     id="storeLat"
//                     type="text"
//                     value={formData.storeLat}
//                     onChange={handleInputChange}
//                     placeholder="Enter Current Location Link or lat or Long"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.storeLat ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                   />
//                   {errors.storeLat && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.storeLat}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="storeLong"
//                     className="block text-sm text-gray-700 font-bold mb-1"
//                   >
//                     Store Current Location ( Long. )
//                   </label>
//                   <input
//                     id="storeLong"
//                     type="text"
//                     value={formData.storeLong}
//                     onChange={handleInputChange}
//                     placeholder="Enter Current Location Link or lat or Long"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.storeLong ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 focus:border-transparent outline-none`}
//                   />
//                   {errors.storeLong && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.storeLong}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <button
//                     type="submit"
//                     className="w-full px-6 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition duration-200"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {showLoginModal && <VendorLoginModal onClose={handleCloseLoginModal} />}
//     </>
//   );
// };

// export default AddVendorModal;
// import React, { useState, useEffect } from "react";
// import { X, User, MapPin, FileText, Banknote } from "lucide-react";

// const AddVendorModal = ({ isOpen, onClose }) => {
//   const [step, setStep] = useState(1);
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [formData, setFormData] = useState({
//     vendorName: "",
//     contactNumber: "",
//     altContactNumber: "",
//     email: "",
//     gender: "",
//     dob: "",
//     age: "",
//     storeId: "",
//     storeName: "",
//     storeImage: null,
//     storeAddress1: "",
//     storeAddress2: "",
//     pinCode: "",
//     city: "",
//     state: "",
//     storeLat: "",
//     storeLong: "",
//     panCardFront: null,
//     panCardBack: null,
//     aadharFront: null,
//     aadharBack: null,
//     ifscCode: "",
//     accountNumber: "",
//     bankName: "",
//     cancelCheque: null,
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (isOpen) {
//       generateStoreId();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (formData.dob) {
//       const birthDate = new Date(formData.dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       if (
//         monthDiff < 0 ||
//         (monthDiff === 0 && today.getDate() < birthDate.getDate())
//       ) {
//         age--;
//       }
//       setFormData((prev) => ({ ...prev, age: age.toString() }));
//     }
//   }, [formData.dob]);

//   const generateStoreId = () => {
//     const randomNum = Math.floor(100000 + Math.random() * 900000);
//     setFormData((prev) => ({ ...prev, storeId: `RB${randomNum}` }));
//   };

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setFormData((prev) => ({
//             ...prev,
//             storeLat: position.coords.latitude.toFixed(6),
//             storeLong: position.coords.longitude.toFixed(6),
//           }));
//           alert("Location fetched successfully!");
//         },
//         () => {
//           alert("Unable to fetch location. Please enter manually.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const fetchCityState = async (pinCode) => {
//     if (pinCode.length === 6) {
//       try {
//         const response = await fetch(
//           `https://api.postalpincode.in/pincode/${pinCode}`
//         );
//         const data = await response.json();
//         if (data[0].Status === "Success") {
//           const postOffice = data[0].PostOffice[0];
//           setFormData((prev) => ({
//             ...prev,
//             city: postOffice.District,
//             state: postOffice.State,
//           }));
//           setErrors((prev) => ({ ...prev, pinCode: "" }));
//         } else {
//           setErrors((prev) => ({ ...prev, pinCode: "Invalid PIN code" }));
//         }
//       } catch {
//         setErrors((prev) => ({ ...prev, pinCode: "Error fetching location" }));
//       }
//     }
//   };

//   useEffect(() => {
//     if (formData.pinCode.length === 6) {
//       fetchCityState(formData.pinCode);
//     }
//   }, [formData.pinCode]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.vendorName.trim())
//       newErrors.vendorName = "Vendor name is required";
//     if (!formData.contactNumber.trim()) {
//       newErrors.contactNumber = "Contact number is required";
//     } else if (!/^\d{10}$/.test(formData.contactNumber)) {
//       newErrors.contactNumber = "Contact number must be 10 digits";
//     }
//     if (
//       formData.altContactNumber &&
//       !/^\d{10}$/.test(formData.altContactNumber)
//     ) {
//       newErrors.altContactNumber = "Alt. contact must be 10 digits";
//     }
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email";
//     }
//     if (!formData.gender) newErrors.gender = "Select gender";
//     if (!formData.dob) newErrors.dob = "Date of birth required";
//     if (!formData.storeName.trim()) newErrors.storeName = "Store name required";
//     if (!formData.storeAddress1.trim())
//       newErrors.storeAddress1 = "Address required";
//     if (!formData.pinCode.trim()) {
//       newErrors.pinCode = "PIN code required";
//     } else if (!/^\d{6}$/.test(formData.pinCode)) {
//       newErrors.pinCode = "PIN must be 6 digits";
//     }
//     if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC required";
//     if (!formData.accountNumber.trim())
//       newErrors.accountNumber = "Account number required";
//     if (!formData.bankName.trim()) newErrors.bankName = "Bank name required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//     if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
//   };

//   const handleFileChange = (e) => {
//     const { id, files } = e.target;
//     if (files[0]) setFormData((prev) => ({ ...prev, [id]: files[0] }));
//   };

//   const handleRadioChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleNextClick = () => {
//     if (validateForm()) setStep(2);
//   };

//   const handleOtpChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value.slice(-1);
//     setOtp(newOtp);
//     if (value && index < 3) {
//       document.getElementById(`vendor-otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`vendor-otp-${index - 1}`)?.focus();
//     }
//   };

//   const handleVerifyOtp = () => {
//     const enteredOtp = otp.join("");
//     if (enteredOtp.length === 4) {
//       alert("Vendor added successfully!");
//       onClose();
//     } else {
//       alert("Please enter complete OTP");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
//       <div
//         className="bg-white shadow-lg w-full max-w-6xl relative"
//         style={{ maxHeight: "95vh", display: "flex", flexDirection: "column" }}
//       >
//         <div className="flex items-center justify-between px-6 py-4 border-b">
//           <h2 className="text-lg font-bold text-gray-800 underline decoration-[#FF7B1D] decoration-4 underline-offset-4">
//             {step === 1 ? "Add Vendor" : "Verify Contact Number"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-800"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {step === 1 && (
//           <div className="overflow-y-auto flex-1 px-6 py-4">
//             <div>
//               <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
//                 <User className="w-5 h-5 text-[#FF7B1D]" />
//                 Personal Information
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Vendor Name
//                   </label>
//                   <input
//                     id="vendorName"
//                     type="text"
//                     value={formData.vendorName}
//                     onChange={handleInputChange}
//                     placeholder="Enter Vendor Name"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.vendorName ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.vendorName && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.vendorName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Contact Number (For Login)
//                   </label>
//                   <input
//                     id="contactNumber"
//                     type="text"
//                     value={formData.contactNumber}
//                     onChange={handleInputChange}
//                     placeholder="Enter 10-digit number"
//                     maxLength="10"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.contactNumber
//                         ? "border-red-500"
//                         : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.contactNumber && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.contactNumber}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Alt. Contact Number
//                   </label>
//                   <input
//                     id="altContactNumber"
//                     type="text"
//                     value={formData.altContactNumber}
//                     onChange={handleInputChange}
//                     placeholder="Enter alternate number"
//                     maxLength="10"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.altContactNumber
//                         ? "border-red-500"
//                         : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.altContactNumber && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.altContactNumber}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Email ID
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     placeholder="Enter email"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.email ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.email && (
//                     <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Gender
//                   </label>
//                   <div className="flex items-center gap-6 py-2">
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="male"
//                         checked={formData.gender === "male"}
//                         onChange={handleRadioChange}
//                         className="w-4 h-4 text-[#FF7B1D] focus:ring-[#FF7B1D]"
//                       />
//                       <span className="text-sm">Male</span>
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="female"
//                         checked={formData.gender === "female"}
//                         onChange={handleRadioChange}
//                         className="w-4 h-4 text-[#FF7B1D] focus:ring-[#FF7B1D]"
//                       />
//                       <span className="text-sm">Female</span>
//                     </label>
//                   </div>
//                   {errors.gender && (
//                     <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Date of Birth
//                   </label>
//                   <input
//                     id="dob"
//                     type="date"
//                     value={formData.dob}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.dob ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.dob && (
//                     <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Age
//                   </label>
//                   <input
//                     id="age"
//                     type="text"
//                     value={formData.age}
//                     readOnly
//                     placeholder="Auto calculated"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 outline-none"
//                   />
//                 </div>
//               </div>

//               <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
//                 <MapPin className="w-5 h-5 text-[#FF7B1D]" />
//                 Store Information
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Store ID
//                   </label>
//                   <input
//                     id="storeId"
//                     type="text"
//                     value={formData.storeId}
//                     readOnly
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Store Name
//                   </label>
//                   <input
//                     id="storeName"
//                     type="text"
//                     value={formData.storeName}
//                     onChange={handleInputChange}
//                     placeholder="Enter store name"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.storeName ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.storeName && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.storeName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Store Image
//                   </label>
//                   <input
//                     id="storeImage"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full px-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm text-gray-700 font-bold mb-1">
//                   Store Address Line 1
//                 </label>
//                 <input
//                   id="storeAddress1"
//                   type="text"
//                   value={formData.storeAddress1}
//                   onChange={handleInputChange}
//                   placeholder="Enter store address"
//                   className={`w-full px-3 py-2 text-sm border ${
//                     errors.storeAddress1
//                       ? "border-red-500"
//                       : "border-orange-400"
//                   } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                 />
//                 {errors.storeAddress1 && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors.storeAddress1}
//                   </p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm text-gray-700 font-bold mb-1">
//                   Store Address Line 2
//                 </label>
//                 <input
//                   id="storeAddress2"
//                   type="text"
//                   value={formData.storeAddress2}
//                   onChange={handleInputChange}
//                   placeholder="Enter additional address"
//                   className="w-full px-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 outline-none"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     PIN Code
//                   </label>
//                   <input
//                     id="pinCode"
//                     type="text"
//                     value={formData.pinCode}
//                     onChange={handleInputChange}
//                     placeholder="Enter 6-digit PIN"
//                     maxLength="6"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.pinCode ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.pinCode && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.pinCode}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     City
//                   </label>
//                   <input
//                     id="city"
//                     type="text"
//                     value={formData.city}
//                     readOnly
//                     placeholder="Auto-fetched"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     State
//                   </label>
//                   <input
//                     id="state"
//                     type="text"
//                     value={formData.state}
//                     readOnly
//                     placeholder="Auto-fetched"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Store Current Location (Lat.)
//                   </label>
//                   <input
//                     id="storeLat"
//                     type="text"
//                     value={formData.storeLat}
//                     onChange={handleInputChange}
//                     placeholder="Enter Latitude"
//                     className="w-full px-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Store Current Location (Long.)
//                   </label>
//                   <input
//                     id="storeLong"
//                     type="text"
//                     value={formData.storeLong}
//                     onChange={handleInputChange}
//                     placeholder="Enter Longitude"
//                     className="w-full px-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <button
//                   onClick={getCurrentLocation}
//                   className="w-full md:w-auto px-6 py-2 bg-[#FF7B1D] text-white font-semibold rounded hover:bg-orange-600 transition"
//                 >
//                   📍 Get Current Location
//                 </button>
//               </div>

//               <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-[#FF7B1D]" />
//                 Document Upload
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     PAN Card (Front)
//                   </label>
//                   <input
//                     id="panCardFront"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     PAN Card (Back)
//                   </label>
//                   <input
//                     id="panCardBack"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Aadhar Card (Front)
//                   </label>
//                   <input
//                     id="aadharFront"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Aadhar Card (Back)
//                   </label>
//                   <input
//                     id="aadharBack"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
//                   />
//                 </div>
//               </div>

//               <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
//                 <Banknote className="w-5 h-5 text-[#FF7B1D]" />
//                 Bank Details
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     IFSC Code
//                   </label>
//                   <input
//                     id="ifscCode"
//                     type="text"
//                     value={formData.ifscCode}
//                     onChange={handleInputChange}
//                     placeholder="Enter IFSC"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.ifscCode ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.ifscCode && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.ifscCode}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Account Number
//                   </label>
//                   <input
//                     id="accountNumber"
//                     type="text"
//                     value={formData.accountNumber}
//                     onChange={handleInputChange}
//                     placeholder="Enter account number"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.accountNumber
//                         ? "border-red-500"
//                         : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.accountNumber && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.accountNumber}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 font-bold mb-1">
//                     Bank Name
//                   </label>
//                   <input
//                     id="bankName"
//                     type="text"
//                     value={formData.bankName}
//                     onChange={handleInputChange}
//                     placeholder="Enter bank name"
//                     className={`w-full px-3 py-2 text-sm border ${
//                       errors.bankName ? "border-red-500" : "border-orange-400"
//                     } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
//                   />
//                   {errors.bankName && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.bankName}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm text-gray-700 font-bold mb-1">
//                   Upload Cancelled Cheque
//                 </label>
//                 <input
//                   id="cancelCheque"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
//                 />
//               </div>

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={onClose}
//                   className="px-8 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleNextClick}
//                   className="px-8 py-2 bg-[#FF7B1D] text-white font-semibold rounded hover:bg-orange-600 transition"
//                 >
//                   Next - Verify Contact
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="flex-1 flex items-center justify-center p-8">
//             <div className="max-w-md w-full">
//               <div className="text-center mb-8">
//                 <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <User className="w-10 h-10 text-[#FF7B1D]" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">
//                   Verify Contact Number
//                 </h3>
//                 <p className="text-gray-600 text-sm">
//                   OTP sent to{" "}
//                   <span className="font-semibold">
//                     +91 {formData.contactNumber}
//                   </span>
//                 </p>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-bold text-gray-800 mb-3 text-center">
//                   Enter 4-Digit OTP
//                 </label>
//                 <div className="flex gap-3 justify-center mb-6">
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       id={`vendor-otp-${index}`}
//                       type="tel"
//                       value={digit}
//                       onChange={(e) => handleOtpChange(index, e.target.value)}
//                       onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                       maxLength="1"
//                       className="w-16 h-16 text-center text-2xl font-bold bg-white border-2 border-orange-400 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
//                     />
//                   ))}
//                 </div>
//               </div>

//               <button
//                 onClick={handleVerifyOtp}
//                 className="w-full bg-[#FF7B1D] text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg"
//               >
//                 Verify & Add Vendor
//               </button>

//               <div className="text-center mt-4">
//                 <button
//                   onClick={() => setStep(1)}
//                   className="text-gray-600 hover:text-gray-900 text-sm font-medium"
//                 >
//                   ← Back to Form
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddVendorModal;

import React, { useState, useEffect, useRef } from "react";
import { X, User, MapPin, FileText, Banknote, Search, Loader2, AlertCircle } from "lucide-react";
import api from "../api/api";

const AddVendorModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    vendorName: "",
    contactNumber: "",
    altContactNumber: "",
    email: "",
    gender: "",
    dob: "",
    age: "",
    storeId: "",
    storeName: "",
    storeImage: null,
    storeAddress1: "",
    storeAddress2: "",
    pinCode: "",
    city: "",
    state: "",
    storeLat: "",
    storeLong: "",
    panCardFront: null,
    panCardBack: null,
    aadharFront: null,
    aadharBack: null,
    drivingLicense: null,
    ifscCode: "",
    accountNumber: "",
    bankName: "",
    cancelCheque: null,
    handlingChargePercentage: "20",
  });
  const [errors, setErrors] = useState({});
  
  // Map states
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState("");
  const [useOpenStreetMap, setUseOpenStreetMap] = useState(true); // Use OpenStreetMap by default (no API key needed)
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      generateStoreId();
    }
  }, [isOpen]);

  // Load map (OpenStreetMap - no API key needed)
  useEffect(() => {
    if (useOpenStreetMap) {
      // Load Leaflet CSS and JS for OpenStreetMap
      const loadLeaflet = () => {
        // Check if already loaded
        if (window.L && document.querySelector('link[href*="leaflet"]')) {
          setMapLoaded(true);
          return;
        }

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          link.crossOrigin = "";
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
          script.crossOrigin = "";
          script.onload = () => {
            setMapLoaded(true);
            setMapError("");
          };
          script.onerror = () => {
            setMapError("Failed to load map library. Please check your internet connection.");
          };
          document.head.appendChild(script);
        } else {
          setMapLoaded(true);
        }
      };

      loadLeaflet();
    } else {
      // Google Maps loading (if user wants to use it)
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript && window.google && window.google.maps) {
        setMapLoaded(true);
        setMapError("");
        return;
      }

      if (window.google && window.google.maps) {
        setMapLoaded(true);
        setMapError("");
        return;
      }

      const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
      
      if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.length < 20) {
        setMapError("Google Maps API key is missing. Switching to OpenStreetMap (free, no API key needed).");
        setUseOpenStreetMap(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setTimeout(() => {
          if (window.google && window.google.maps) {
            setMapLoaded(true);
            setMapError("");
          } else {
            setMapError("Google Maps failed to initialize. Switching to OpenStreetMap.");
            setUseOpenStreetMap(true);
          }
        }, 500);
      };

      script.onerror = () => {
        setMapError("Failed to load Google Maps. Switching to OpenStreetMap (free alternative).");
        setUseOpenStreetMap(true);
      };

      document.head.appendChild(script);
    }
  }, [useOpenStreetMap]);

  // Initialize map when shown
  useEffect(() => {
    if (isOpen && showMap && mapLoaded) {
      const timer = setTimeout(() => {
        if (useOpenStreetMap && window.L) {
          initializeOpenStreetMap();
        } else if (!useOpenStreetMap && window.google && window.google.maps) {
          initializeMap();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showMap, mapLoaded, formData.storeLat, formData.storeLong, useOpenStreetMap]);

  const initializeOpenStreetMap = () => {
    const mapContainer = document.getElementById("vendor-map-container");
    if (!mapContainer || !window.L) {
      console.error("Map container or Leaflet not found");
      return;
    }

    // Don't reinitialize if map already exists
    if (mapInstanceRef.current) {
      if (formData.storeLat && formData.storeLong && markerInstanceRef.current) {
        const newPos = [parseFloat(formData.storeLat), parseFloat(formData.storeLong)];
        markerInstanceRef.current.setLatLng(newPos);
        mapInstanceRef.current.setView(newPos, mapInstanceRef.current.getZoom());
      }
      return;
    }

    const center = formData.storeLat && formData.storeLong
      ? [parseFloat(formData.storeLat), parseFloat(formData.storeLong)]
      : [23.2599, 77.4126]; // Default: Bhopal

    // Initialize map
    const map = window.L.map(mapContainer).setView(center, 15);

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    let marker = null;

    // Add marker if coordinates exist
    if (formData.storeLat && formData.storeLong) {
      marker = window.L.marker([parseFloat(formData.storeLat), parseFloat(formData.storeLong)], {
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (e) => {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        updateLocationFromCoords(lat, lng);
      });

      markerInstanceRef.current = marker;
    }

    // Add click listener to map
    map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      updateLocationFromCoords(lat, lng);

      // Update or create marker
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = window.L.marker([lat, lng], {
          draggable: true,
        }).addTo(map);

        marker.on('dragend', (e) => {
          const newLat = e.target.getLatLng().lat;
          const newLng = e.target.getLatLng().lng;
          updateLocationFromCoords(newLat, newLng);
        });

        markerInstanceRef.current = marker;
      }
    });
  };

  const initializeMap = () => {
    const mapContainer = document.getElementById("vendor-map-container");
    if (!mapContainer) {
      console.error("Map container not found");
      return;
    }
    
    if (!window.google || !window.google.maps) {
      setMapError("Google Maps API is not loaded. Please check your API key.");
      console.error("Google Maps API not available");
      return;
    }

    // Don't reinitialize if map already exists
    if (mapInstanceRef.current) {
      if (formData.storeLat && formData.storeLong && markerInstanceRef.current) {
        const newPos = { 
          lat: parseFloat(formData.storeLat), 
          lng: parseFloat(formData.storeLong) 
        };
        markerInstanceRef.current.setPosition(newPos);
        mapInstanceRef.current.setCenter(newPos);
      }
      return;
    }

    const center = formData.storeLat && formData.storeLong
      ? { lat: parseFloat(formData.storeLat), lng: parseFloat(formData.storeLong) }
      : { lat: 23.2599, lng: 77.4126 }; // Default: Bhopal

    const map = new window.google.maps.Map(mapContainer, {
      center: center,
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;
    let marker = null;

    // Add marker if coordinates exist
    if (formData.storeLat && formData.storeLong) {
      marker = new window.google.maps.Marker({
        position: { lat: parseFloat(formData.storeLat), lng: parseFloat(formData.storeLong) },
        map: map,
        draggable: true,
        title: "Store Location",
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener("dragend", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        updateLocationFromCoords(lat, lng);
      });

      markerInstanceRef.current = marker;
    }

    // Add click listener to map
    map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      updateLocationFromCoords(lat, lng);

      // Update or create marker
      if (marker) {
        marker.setPosition({ lat, lng });
      } else {
        marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          draggable: true,
          title: "Store Location",
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener("dragend", (e) => {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          updateLocationFromCoords(newLat, newLng);
        });

        markerInstanceRef.current = marker;
      }
    });

    // Add search box
    const searchInput = document.getElementById("vendor-map-search-input");
    if (searchInput) {
      const searchBox = new window.google.maps.places.SearchBox(searchInput);
      
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        updateLocationFromCoords(lat, lng);

        // Update marker
        if (marker) {
          marker.setPosition({ lat, lng });
        } else {
          marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            draggable: true,
            title: place.name,
            animation: window.google.maps.Animation.DROP,
          });

          marker.addListener("dragend", (e) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            updateLocationFromCoords(newLat, newLng);
          });

          markerInstanceRef.current = marker;
        }

        map.setCenter({ lat, lng });
        map.setZoom(15);

        // Update address fields
        const address = place.address_components || [];
        const addressParts = {};
        
        address.forEach((component) => {
          const type = component.types[0];
          if (type === "locality") addressParts.city = component.long_name;
          if (type === "administrative_area_level_1") addressParts.state = component.long_name;
          if (type === "postal_code") addressParts.pinCode = component.long_name;
          if (type === "street_number" || type === "route") {
            if (!addressParts.line1) addressParts.line1 = component.long_name;
            else addressParts.line1 += " " + component.long_name;
          }
        });

        setFormData((prev) => ({
          ...prev,
          city: addressParts.city || prev.city,
          state: addressParts.state || prev.state,
          pinCode: addressParts.pinCode || prev.pinCode,
          storeAddress1: addressParts.line1 || place.formatted_address?.split(',')[0] || prev.storeAddress1,
        }));
      });
    }
  };

  const updateLocationFromCoords = async (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      storeLat: lat.toFixed(6),
      storeLong: lng.toFixed(6),
    }));

    // Reverse geocode to get address using Nominatim (OpenStreetMap's geocoding service - free, no API key)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        setFormData((prev) => ({
          ...prev,
          city: addr.city || addr.town || addr.village || prev.city,
          state: addr.state || prev.state,
          pinCode: addr.postcode || prev.pinCode,
          storeAddress1: addr.road || addr.house_number || data.display_name?.split(',')[0] || prev.storeAddress1,
        }));
      }
    } catch (error) {
      console.log("Geocoding failed, coordinates saved:", error);
      // Coordinates are still saved even if geocoding fails
    }
  };

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  const generateStoreId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({ ...prev, storeId: `RB${randomNum}` }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocationFromCoords(lat, lng);
          
          // Update map if initialized
          if (mapInstanceRef.current && markerInstanceRef.current) {
            const newPos = { lat, lng };
            markerInstanceRef.current.setPosition(newPos);
            mapInstanceRef.current.setCenter(newPos);
          } else if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
              draggable: true,
              title: "Current Location",
              animation: window.google.maps.Animation.DROP,
            });
            marker.addListener("dragend", (e) => {
              const newLat = e.latLng.lat();
              const newLng = e.latLng.lng();
              updateLocationFromCoords(newLat, newLng);
            });
            markerInstanceRef.current = marker;
          }
          
          alert("Location fetched successfully!");
        },
        () => {
          alert("Unable to fetch location. Please use map to select.");
        },
      );
    } else {
      alert("Geolocation is not supported by this browser. Please use map.");
    }
  };

  const fetchCityState = async (pinCode) => {
    if (pinCode.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pinCode}`,
        );
        const data = await response.json();
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
          }));
          setErrors((prev) => ({ ...prev, pinCode: "" }));
        } else {
          setErrors((prev) => ({ ...prev, pinCode: "Invalid PIN code" }));
        }
      } catch {
        setErrors((prev) => ({ ...prev, pinCode: "Error fetching location" }));
      }
    }
  };

  useEffect(() => {
    if (formData.pinCode.length === 6) {
      fetchCityState(formData.pinCode);
    }
  }, [formData.pinCode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vendorName.trim())
      newErrors.vendorName = "Vendor name is required";
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }
    if (
      formData.altContactNumber &&
      !/^\d{10}$/.test(formData.altContactNumber)
    ) {
      newErrors.altContactNumber = "Alt. contact must be 10 digits";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.gender) newErrors.gender = "Select gender";
    if (!formData.dob) newErrors.dob = "Date of birth required";
    if (!formData.storeName.trim()) newErrors.storeName = "Store name required";
    if (!formData.storeAddress1.trim())
      newErrors.storeAddress1 = "Address required";
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN code required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN must be 6 digits";
    }
    if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC required";
    if (!formData.accountNumber.trim())
      newErrors.accountNumber = "Account number required";
    if (!formData.bankName.trim()) newErrors.bankName = "Bank name required";

    if (!formData.handlingChargePercentage.trim()) {
      newErrors.handlingChargePercentage =
        "Handling charge percentage is required";
    } else {
      const percentage = parseFloat(formData.handlingChargePercentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        newErrors.handlingChargePercentage = "Must be between 0 and 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    if (files[0]) setFormData((prev) => ({ ...prev, [id]: files[0] }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const sendOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.contactNumber)) {
        setError(
          "Contact number must be a valid 10-digit Indian mobile number starting with 6-9",
        );
        setIsLoading(false);
        return;
      }

      const normalizedContactNumber = String(formData.contactNumber)
        .trim()
        .replace(/\s+/g, "");

      const requestBody = {
        contactNumber: normalizedContactNumber,
      };

      const response = await api.post("/api/vendor/send-otp", requestBody);
      const data = response.data;

      if (data.success) {
        setSuccess(
          `OTP sent to ${data.contactNumber || formData.contactNumber}`,
        );
        setStep(2);
      } else {
        const errorMsg =
          data.message || data.error || `Server error (${response.status})`;
        setError(errorMsg);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("API endpoint not found. Please contact administrator.");
      } else {
        setError(
          error.response?.data?.message || `Network error: ${error.message}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextClick = () => {
    if (validateForm()) {
      sendOtp();
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`vendor-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`vendor-otp-${index - 1}`)?.focus();
    }
  };

  const createVendor = async () => {
    try {
      setIsLoading(true);
      setError("");

      const formDataToSend = new FormData();

      const normalizedContactNumber = String(formData.contactNumber)
        .trim()
        .replace(/\s+/g, "");

      formDataToSend.append(
        "vendorName",
        String(formData.vendorName || "").trim(),
      );
      formDataToSend.append("contactNumber", normalizedContactNumber);
      if (formData.altContactNumber) {
        formDataToSend.append(
          "altContactNumber",
          String(formData.altContactNumber).trim().replace(/\s+/g, ""),
        );
      }
      formDataToSend.append(
        "email",
        String(formData.email || "")
          .trim()
          .toLowerCase(),
      );
      formDataToSend.append("gender", String(formData.gender || "").trim());
      formDataToSend.append("dateOfBirth", String(formData.dob || "").trim());
      if (formData.age) {
        formDataToSend.append("age", String(formData.age).trim());
      }
      formDataToSend.append(
        "storeName",
        String(formData.storeName || "").trim(),
      );

      if (formData.handlingChargePercentage) {
        formDataToSend.append(
          "handlingChargePercentage",
          String(formData.handlingChargePercentage).trim(),
        );
      }

      formDataToSend.append(
        "storeAddressLine1",
        String(formData.storeAddress1 || "").trim(),
      );
      if (formData.storeAddress2) {
        formDataToSend.append(
          "storeAddressLine2",
          String(formData.storeAddress2).trim(),
        );
      }
      formDataToSend.append("pinCode", String(formData.pinCode || "").trim());
      if (formData.city) {
        formDataToSend.append("city", String(formData.city).trim());
      }
      if (formData.state) {
        formDataToSend.append("state", String(formData.state).trim());
      }
      if (formData.storeLat) {
        formDataToSend.append("latitude", String(formData.storeLat).trim());
      }
      if (formData.storeLong) {
        formDataToSend.append("longitude", String(formData.storeLong).trim());
      }

      formDataToSend.append(
        "ifsc",
        String(formData.ifscCode || "")
          .trim()
          .toUpperCase(),
      );
      formDataToSend.append(
        "accountNumber",
        String(formData.accountNumber || "").trim(),
      );
      formDataToSend.append("bankName", String(formData.bankName || "").trim());

      const maxFileSize = 10 * 1024 * 1024;
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      const allowedPdfType = "application/pdf";
      const allowedTypes = [...allowedImageTypes, allowedPdfType];

      const validateFile = (file, fieldName) => {
        if (!file) return null;
        if (file.size > maxFileSize) {
          throw new Error(
            `${fieldName} file size exceeds 10MB limit. Please upload a smaller file.`,
          );
        }
        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            `${fieldName} must be a JPEG, JPG, PNG image or PDF file.`,
          );
        }
        return true;
      };

      try {
        if (formData.storeImage) {
          validateFile(formData.storeImage, "Store Image");
          formDataToSend.append("storeImage", formData.storeImage);
        }
        if (formData.panCardFront) {
          validateFile(formData.panCardFront, "PAN Card Front");
          formDataToSend.append("panCardFront", formData.panCardFront);
        }
        if (formData.panCardBack) {
          validateFile(formData.panCardBack, "PAN Card Back");
          formDataToSend.append("panCardBack", formData.panCardBack);
        }
        if (formData.aadharFront) {
          validateFile(formData.aadharFront, "Aadhar Card Front");
          formDataToSend.append("aadharCardFront", formData.aadharFront);
        }
        if (formData.aadharBack) {
          validateFile(formData.aadharBack, "Aadhar Card Back");
          formDataToSend.append("aadharCardBack", formData.aadharBack);
        }
        if (formData.drivingLicense) {
          validateFile(formData.drivingLicense, "Driving License");
          formDataToSend.append("drivingLicense", formData.drivingLicense);
        }
        if (formData.cancelCheque) {
          validateFile(formData.cancelCheque, "Cancel Cheque");
          formDataToSend.append("cancelCheque", formData.cancelCheque);
        }
      } catch (fileError) {
        setError(fileError.message);
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      let response;
      try {
        response = await api.post("/api/vendor/create", formDataToSend, {
          signal: controller.signal,
          timeout: 120000,
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (
          fetchError.name === "AbortError" ||
          fetchError.code === "ECONNABORTED"
        ) {
          setError(
            "Request timeout. The files may be too large. Please try again or reduce file sizes.",
          );
          setIsLoading(false);
          return;
        } else if (
          fetchError.message.includes("Failed to fetch") ||
          fetchError.message.includes("NetworkError") ||
          fetchError.code === "ERR_NETWORK"
        ) {
          setError(
            "Network error. Please check your internet connection and try again. If the problem persists, the files may be too large.",
          );
          setIsLoading(false);
          return;
        } else {
          const errorData = fetchError.response?.data;
          const errorMessage =
            errorData?.message || fetchError.message || "An error occurred";

          if (
            errorMessage.includes("post office") ||
            errorMessage.includes("Failed to fetch post office")
          ) {
            setError(
              "Invalid PIN code or unable to verify address. Please check your PIN code and try again.",
            );
          } else if (
            errorMessage.includes("PIN code") ||
            errorMessage.includes("pinCode")
          ) {
            setError(
              "Invalid PIN code. Please enter a valid 6-digit PIN code.",
            );
          } else {
            setError(
              `Server error: ${errorMessage}. Please try again or contact support.`,
            );
          }

          setIsLoading(false);
          return;
        }
      }

      const data = response.data;

      if (data.success) {
        setSuccess("Vendor registered successfully!");
        setTimeout(() => {
          onClose();
          setFormData({
            vendorName: "",
            contactNumber: "",
            altContactNumber: "",
            email: "",
            gender: "",
            dob: "",
            age: "",
            storeId: "",
            storeName: "",
            storeImage: null,
            storeAddress1: "",
            storeAddress2: "",
            pinCode: "",
            city: "",
            state: "",
            storeLat: "",
            storeLong: "",
            panCardFront: null,
            panCardBack: null,
            aadharFront: null,
            aadharBack: null,
            drivingLicense: null,
            ifscCode: "",
            accountNumber: "",
            bankName: "",
            cancelCheque: null,
            handlingChargePercentage: "20",
          });
          setOtp(["", "", "", ""]);
          setStep(1);
          setError("");
          setSuccess("");
        }, 2000);
      } else {
        const errorMsg =
          data.error || data.message || "Failed to register vendor";

        if (
          errorMsg.includes("verify your contact number") ||
          errorMsg.includes("Vendor not found") ||
          errorMsg.includes("contactNumberVerified")
        ) {
          setError("Contact number not verified. Please verify OTP again.");
          setStep(2);
          setOtp(["", "", "", ""]);
        } else if (
          errorMsg.includes("File size too large") ||
          errorMsg.includes("file size") ||
          errorMsg.includes("LIMIT_FILE_SIZE")
        ) {
          setError(
            "One or more files exceed the 10MB size limit. Please reduce file sizes and try again.",
          );
        } else if (
          errorMsg.includes("Unexpected field") ||
          errorMsg.includes("file upload error") ||
          errorMsg.includes("MulterError")
        ) {
          setError(
            `File upload error: ${errorMsg}. Please check file names and try again.`,
          );
        } else if (
          errorMsg.includes("Only image files") ||
          errorMsg.includes("PDF files are allowed")
        ) {
          setError(
            "Invalid file type. Please upload only JPEG, JPG, PNG images or PDF files.",
          );
        } else if (
          errorMsg.includes("already registered") ||
          errorMsg.includes("already exists")
        ) {
          setError(errorMsg);
        } else {
          setError(errorMsg);
        }
      }
    } catch (error) {
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        setError(
          "Request timeout. The upload is taking too long. Please try again with smaller files.",
        );
      } else if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        setError(
          "Network error. Please check your connection. If uploading large files, try reducing their size.",
        );
      } else if (error.message.includes("CORS")) {
        setError("CORS error. Please contact the administrator.");
      } else {
        setError(
          `Error creating vendor: ${error.message || "Please try again."}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      setError("Please enter complete 4-digit OTP");
      return;
    }

    if (!/^\d{4}$/.test(enteredOtp)) {
      setError("OTP must be 4 digits");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const normalizedContactNumber = String(formData.contactNumber)
        .trim()
        .replace(/\s+/g, "");

      const requestBody = {
        contactNumber: normalizedContactNumber,
        otp: String(enteredOtp).trim(),
      };

      const response = await api.post("/api/vendor/verify-otp", requestBody);
      const data = response.data;

      if (data.success) {
        setSuccess("OTP verified successfully! Contact number verified.");
        await new Promise((resolve) => setTimeout(resolve, 500));
        await createVendor();
      } else {
        const errorMsg =
          data.message || data.error || `Invalid OTP (${response.status})`;

        if (errorMsg.includes("expired") || errorMsg.includes("Expired")) {
          setError(
            "OTP has expired (valid for 10 minutes). Please request a new OTP.",
          );
          setOtp(["", "", "", ""]);
        } else if (
          errorMsg.includes("Invalid") ||
          errorMsg.includes("invalid")
        ) {
          setError(
            "Invalid OTP. Please check the code and try again, or request a new OTP.",
          );
          setOtp(["", "", "", ""]);
        } else {
          setError(errorMsg);
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Verification endpoint not found. Please contact administrator.");
      } else {
        setError(
          error.response?.data?.message || `Network error: ${error.message}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div
        className="bg-white shadow-lg w-full max-w-6xl relative"
        style={{ maxHeight: "95vh", display: "flex", flexDirection: "column" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 underline decoration-[#FF7B1D] decoration-4 underline-offset-4">
            {step === 1 ? "Add Vendor" : "Verify Contact Number"}
          </h2>
          <button
            onClick={() => {
              setError("");
              setSuccess("");
              onClose();
            }}
            className="text-gray-500 hover:text-gray-800"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        {step === 1 && (
          <div className="overflow-y-auto flex-1 px-6 py-4">
            <div>
              <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF7B1D]" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Vendor Name
                  </label>
                  <input
                    id="vendorName"
                    type="text"
                    value={formData.vendorName}
                    onChange={handleInputChange}
                    placeholder="Enter Vendor Name"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.vendorName ? "border-red-500" : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.vendorName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.vendorName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Contact Number (For Login)
                  </label>
                  <input
                    id="contactNumber"
                    type="text"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit number"
                    maxLength="10"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.contactNumber
                        ? "border-red-500"
                        : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Alt. Contact Number
                  </label>
                  <input
                    id="altContactNumber"
                    type="text"
                    value={formData.altContactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter alternate number"
                    maxLength="10"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.altContactNumber
                        ? "border-red-500"
                        : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.altContactNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.altContactNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Email ID
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.email ? "border-red-500" : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Gender
                  </label>
                  <div className="flex items-center gap-6 py-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-[#FF7B1D] focus:ring-[#FF7B1D]"
                      />
                      <span className="text-sm">Male</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-[#FF7B1D] focus:ring-[#FF7B1D]"
                      />
                      <span className="text-sm">Female</span>
                    </label>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.dob ? "border-red-500" : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    type="text"
                    value={formData.age}
                    readOnly
                    placeholder="Auto calculated"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 outline-none"
                  />
                </div>
              </div>

              <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF7B1D]" />
                Store Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Store ID
                  </label>
                  <input
                    id="storeId"
                    type="text"
                    value={formData.storeId}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Store Name
                  </label>
                  <input
                    id="storeName"
                    type="text"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="Enter store name"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.storeName ? "border-red-500" : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.storeName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.storeName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Store Image
                  </label>
                  <input
                    id="storeImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Handling Charge (%)
                  </label>
                  <input
                    id="handlingChargePercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.handlingChargePercentage}
                    onChange={handleInputChange}
                    placeholder="Enter percentage (0-100)"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.handlingChargePercentage
                        ? "border-red-500"
                        : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.handlingChargePercentage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.handlingChargePercentage}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 font-bold mb-1">
                  Store Address Line 1
                </label>
                <input
                  id="storeAddress1"
                  type="text"
                  value={formData.storeAddress1}
                  onChange={handleInputChange}
                  placeholder="Enter store address"
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.storeAddress1
                      ? "border-red-500"
                      : "border-orange-400"
                  } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                />
                {errors.storeAddress1 && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.storeAddress1}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 font-bold mb-1">
                  Store Address Line 2
                </label>
                <input
                  id="storeAddress2"
                  type="text"
                  value={formData.storeAddress2}
                  onChange={handleInputChange}
                  placeholder="Enter additional address"
                  className="w-full px-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    PIN Code
                  </label>
                  <input
                    id="pinCode"
                    type="text"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit PIN"
                    maxLength="6"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.pinCode ? "border-red-500" : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.pinCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pinCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    readOnly
                    placeholder="Auto-fetched"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={formData.state}
                    readOnly
                    placeholder="Auto-fetched"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Store Current Location (Lat.)
                  </label>
                  <input
                    id="storeLat"
                    type="text"
                    value={formData.storeLat}
                    onChange={handleInputChange}
                    placeholder="Enter Latitude"
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Store Current Location (Long.)
                  </label>
                  <input
                    id="storeLong"
                    type="text"
                    value={formData.storeLong}
                    onChange={handleInputChange}
                    placeholder="Enter Longitude"
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded focus:ring-1 focus:ring-orange-400 outline-none"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-gray-700 font-bold">
                    Select Location on Map
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="px-4 py-2 bg-[#FF7B1D] hover:bg-orange-600 text-white rounded-lg transition-all font-semibold text-sm flex items-center gap-2"
                  >
                    <MapPin size={16} />
                    {showMap ? "Hide Map" : "Show Map"}
                  </button>
                </div>
                
                <button
                  onClick={getCurrentLocation}
                  className="w-full md:w-auto px-6 py-2 bg-[#FF7B1D] text-white font-semibold rounded hover:bg-orange-600 transition flex items-center gap-2"
                >
                  <MapPin size={18} />
                  Get Current Location
                </button>
              </div>

              {/* Map Section */}
              {showMap && (
                <div className="mb-6 border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-600 p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="text-white" size={20} />
                      <p className="text-white font-semibold">
                        Interactive Map - Click to Select Store Location
                      </p>
                    </div>
                    {formData.storeLat && formData.storeLong && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-3 text-xs text-white mb-2">
                          <div>
                            <span className="font-semibold">Latitude:</span>{" "}
                            <span className="font-bold">{formData.storeLat}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Longitude:</span>{" "}
                            <span className="font-bold">{formData.storeLong}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Box */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          id="vendor-map-search-input"
                          placeholder="Search for address, place, or landmark..."
                          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] transition-all text-sm"
                          onKeyPress={async (e) => {
                            if (e.key === 'Enter' && useOpenStreetMap && window.L) {
                              const query = e.target.value;
                              if (query) {
                                try {
                                  const response = await fetch(
                                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
                                  );
                                  const data = await response.json();
                                  if (data && data.length > 0) {
                                    const lat = parseFloat(data[0].lat);
                                    const lng = parseFloat(data[0].lon);
                                    updateLocationFromCoords(lat, lng);
                                    if (mapInstanceRef.current) {
                                      mapInstanceRef.current.setView([lat, lng], 15);
                                      if (markerInstanceRef.current) {
                                        markerInstanceRef.current.setLatLng([lat, lng]);
                                      } else {
                                        const marker = window.L.marker([lat, lng], { draggable: true }).addTo(mapInstanceRef.current);
                                        marker.on('dragend', (e) => {
                                          const newLat = e.target.getLatLng().lat;
                                          const newLng = e.target.getLatLng().lng;
                                          updateLocationFromCoords(newLat, newLng);
                                        });
                                        markerInstanceRef.current = marker;
                                      }
                                    }
                                  }
                                } catch (error) {
                                  console.error("Search failed:", error);
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    {useOpenStreetMap && (
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Using OpenStreetMap (Free, No API Key Required)
                      </p>
                    )}
                  </div>

                  {/* Map Container */}
                  <div className="relative" style={{ height: "400px" }}>
                    {mapError ? (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <div className="text-center p-6 max-w-md">
                          <AlertCircle className="text-red-500 mx-auto mb-3" size={48} />
                          <p className="text-red-600 font-semibold mb-2">Map Loading Error</p>
                          <p className="text-gray-600 text-sm mb-4">{mapError}</p>
                          <button
                            onClick={() => {
                              setMapError("");
                              setMapLoaded(false);
                              // Reload the script
                              const script = document.querySelector('script[src*="maps.googleapis.com"]');
                              if (script) script.remove();
                              window.google = null;
                              window.initGoogleMap = null;
                              // Trigger reload
                              window.location.reload();
                            }}
                            className="px-4 py-2 bg-[#FF7B1D] text-white rounded-lg hover:bg-orange-600 transition"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    ) : !mapLoaded ? (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <div className="text-center">
                          <Loader2 className="animate-spin text-[#FF7B1D] mx-auto mb-3" size={32} />
                          <p className="text-gray-600 font-medium">Loading map...</p>
                          <p className="text-gray-500 text-xs mt-2">Please wait while we load Google Maps</p>
                        </div>
                      </div>
                    ) : (
                      <div id="vendor-map-container" style={{ width: "100%", height: "100%" }}></div>
                    )}

                    {/* Instructions Overlay */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border-2 border-[#FF7B1D] max-w-xs">
                      <p className="text-xs font-semibold text-gray-800 mb-1">
                        📍 How to use:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Click on map to select location</li>
                        <li>• Drag marker to adjust position</li>
                        <li>• Search for address above</li>
                        <li>• Coordinates update automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF7B1D]" />
                Document Upload
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    PAN Card (Front)
                  </label>
                  <input
                    id="panCardFront"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    PAN Card (Back)
                  </label>
                  <input
                    id="panCardBack"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Aadhar Card (Front)
                  </label>
                  <input
                    id="aadharFront"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Aadhar Card (Back)
                  </label>
                  <input
                    id="aadharBack"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Driving License
                  </label>
                  <input
                    id="drivingLicense"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
                  />
                </div>
              </div>

              <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[#FF7B1D]" />
                Bank Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    IFSC Code
                  </label>
                  <input
                    id="ifscCode"
                    type="text"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="Enter IFSC"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.ifscCode ? "border-red-500" : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.ifscCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.ifscCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Account Number
                  </label>
                  <input
                    id="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.accountNumber
                        ? "border-red-500"
                        : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    Bank Name
                  </label>
                  <input
                    id="bankName"
                    type="text"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.bankName ? "border-red-500" : "border-orange-400"
                    } rounded focus:ring-1 focus:ring-orange-400 outline-none`}
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.bankName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 font-bold mb-1">
                  Upload Cancelled Cheque
                </label>
                <input
                  id="cancelCheque"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-8 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleNextClick}
                  className="px-8 py-2 bg-[#FF7B1D] text-white font-semibold rounded hover:bg-orange-600 transition disabled:bg-orange-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Next - Verify Contact"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-[#FF7B1D]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Verify Contact Number
                </h3>
                <p className="text-gray-600 text-sm">
                  OTP sent to{" "}
                  <span className="font-semibold">
                    +91 {formData.contactNumber}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-3 text-center">
                  Enter 4-Digit OTP
                </label>
                <div className="flex gap-3 justify-center mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`vendor-otp-${index}`}
                      type="tel"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      maxLength="1"
                      className="w-16 h-16 text-center text-2xl font-bold bg-white border-2 border-orange-400 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full bg-[#FF7B1D] text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg disabled:bg-orange-300 disabled:cursor-not-allowed mb-3"
              >
                {isLoading ? "Verifying..." : "Verify & Add Vendor"}
              </button>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setSuccess("");
                    setOtp(["", "", "", ""]);
                  }}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  disabled={isLoading}
                >
                  ← Back to Form
                </button>
                <button
                  onClick={() => {
                    setOtp(["", "", "", ""]);
                    setError("");
                    setSuccess("");
                    sendOtp();
                  }}
                  disabled={isLoading}
                  className="text-sm text-[#FF7B1D] hover:text-orange-600 font-semibold underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVendorModal;
