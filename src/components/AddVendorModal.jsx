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
import {
  X,
  User,
  MapPin,
  FileText,
  Banknote,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../api/api";

const AddVendorModal = ({
  isOpen,
  onClose,
  isEdit = false,
  vendorData = null,
}) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emptyForm = {
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
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Map states
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState("");
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

  // ─── Pre-fill or reset form whenever modal opens ──────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setSuccess("");
    setOtp(["", "", "", ""]);
    setStep(1);
    setErrors({});
    setShowMap(false);
    // Reset map refs so map reinitialises cleanly
    mapInstanceRef.current = null;
    markerInstanceRef.current = null;

    if (isEdit && vendorData) {
      const dob = vendorData.dateOfBirth
        ? new Date(vendorData.dateOfBirth).toISOString().split("T")[0]
        : "";

      setFormData({
        vendorName: vendorData.vendorName || "",
        contactNumber: vendorData.contactNumber || "",
        altContactNumber: vendorData.altContactNumber || "",
        email: vendorData.email || "",
        gender: vendorData.gender || "",
        dob,
        age: vendorData.age ? String(vendorData.age) : "",
        storeId: vendorData.storeId || "",
        storeName: vendorData.storeName || "",
        storeImage: null,
        storeAddress1: vendorData.storeAddress?.line1 || "",
        storeAddress2: vendorData.storeAddress?.line2 || "",
        pinCode: vendorData.storeAddress?.pinCode || "",
        city: vendorData.storeAddress?.city || "",
        state: vendorData.storeAddress?.state || "",
        storeLat: vendorData.storeAddress?.latitude
          ? String(vendorData.storeAddress.latitude)
          : "",
        storeLong: vendorData.storeAddress?.longitude
          ? String(vendorData.storeAddress.longitude)
          : "",
        panCardFront: null,
        panCardBack: null,
        aadharFront: null,
        aadharBack: null,
        drivingLicense: null,
        ifscCode: vendorData.bankDetails?.ifsc || "",
        accountNumber: vendorData.bankDetails?.accountNumber || "",
        bankName: vendorData.bankDetails?.bankName || "",
        cancelCheque: null,
        handlingChargePercentage: vendorData.handlingChargePercentage
          ? String(vendorData.handlingChargePercentage)
          : "20",
      });
    } else {
      setFormData({ ...emptyForm });
      generateStoreId();
    }
  }, [isOpen, isEdit, vendorData]);

  // ─── Load Leaflet once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => setMapLoaded(true);
      script.onerror = () => setMapError("Failed to load map library.");
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen && showMap && mapLoaded && window.L) {
      const timer = setTimeout(initializeOpenStreetMap, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showMap, mapLoaded]);

  const initializeOpenStreetMap = () => {
    const mapContainer = document.getElementById("vendor-map-container");
    if (!mapContainer || !window.L) return;
    if (mapInstanceRef.current) return;

    const center =
      formData.storeLat && formData.storeLong
        ? [parseFloat(formData.storeLat), parseFloat(formData.storeLong)]
        : [23.2599, 77.4126];

    const map = window.L.map(mapContainer).setView(center, 15);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapInstanceRef.current = map;

    let marker = null;
    if (formData.storeLat && formData.storeLong) {
      marker = window.L.marker(center, { draggable: true }).addTo(map);
      marker.on("dragend", (e) =>
        updateLocationFromCoords(
          e.target.getLatLng().lat,
          e.target.getLatLng().lng,
        ),
      );
      markerInstanceRef.current = marker;
    }

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      updateLocationFromCoords(lat, lng);
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = window.L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on("dragend", (ev) =>
          updateLocationFromCoords(
            ev.target.getLatLng().lat,
            ev.target.getLatLng().lng,
          ),
        );
        markerInstanceRef.current = marker;
      }
    });
  };

  const updateLocationFromCoords = async (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      storeLat: lat.toFixed(6),
      storeLong: lng.toFixed(6),
    }));
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await res.json();
      if (data?.address) {
        const addr = data.address;
        setFormData((prev) => ({
          ...prev,
          city: addr.city || addr.town || addr.village || prev.city,
          state: addr.state || prev.state,
          pinCode: addr.postcode || prev.pinCode,
          storeAddress1:
            addr.road ||
            addr.house_number ||
            data.display_name?.split(",")[0] ||
            prev.storeAddress1,
        }));
      }
    } catch (_) {}
  };

  // Auto-calculate age
  useEffect(() => {
    if (!formData.dob) return;
    const birth = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    setFormData((prev) => ({ ...prev, age: String(age) }));
  }, [formData.dob]);

  // Auto-fetch city/state from PIN
  useEffect(() => {
    if (formData.pinCode.length !== 6) return;
    (async () => {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${formData.pinCode}`,
        );
        const data = await res.json();
        if (data[0].Status === "Success") {
          const po = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: po.District,
            state: po.State,
          }));
          setErrors((prev) => ({ ...prev, pinCode: "" }));
        } else {
          setErrors((prev) => ({ ...prev, pinCode: "Invalid PIN code" }));
        }
      } catch {
        setErrors((prev) => ({ ...prev, pinCode: "Error fetching location" }));
      }
    })();
  }, [formData.pinCode]);

  const generateStoreId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({ ...prev, storeId: `RB${randomNum}` }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocationFromCoords(pos.coords.latitude, pos.coords.longitude);
        if (mapInstanceRef.current && markerInstanceRef.current) {
          const p = [pos.coords.latitude, pos.coords.longitude];
          markerInstanceRef.current.setLatLng(p);
          mapInstanceRef.current.setView(p, 15);
        }
        alert("Location fetched successfully!");
      },
      () => alert("Unable to fetch location. Please use map to select."),
    );
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validateForm = () => {
    const e = {};
    if (!formData.vendorName.trim()) e.vendorName = "Vendor name is required";
    if (!formData.contactNumber.trim())
      e.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber))
      e.contactNumber = "Must be 10 digits";
    if (
      formData.altContactNumber &&
      !/^\d{10}$/.test(formData.altContactNumber)
    )
      e.altContactNumber = "Alt. contact must be 10 digits";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email";
    if (!formData.gender) e.gender = "Select gender";
    if (!formData.dob) e.dob = "Date of birth required";
    if (!formData.storeName.trim()) e.storeName = "Store name required";
    if (!formData.storeAddress1.trim()) e.storeAddress1 = "Address required";
    if (!formData.pinCode.trim()) e.pinCode = "PIN code required";
    else if (!/^\d{6}$/.test(formData.pinCode))
      e.pinCode = "PIN must be 6 digits";
    if (!formData.ifscCode.trim()) e.ifscCode = "IFSC required";
    if (!formData.accountNumber.trim())
      e.accountNumber = "Account number required";
    if (!formData.bankName.trim()) e.bankName = "Bank name required";
    if (!formData.handlingChargePercentage.trim())
      e.handlingChargePercentage = "Handling charge is required";
    else {
      const p = parseFloat(formData.handlingChargePercentage);
      if (isNaN(p) || p < 0 || p > 100)
        e.handlingChargePercentage = "Must be 0–100";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
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

  // ─── Build multipart payload ──────────────────────────────────────────────
  const buildFormDataPayload = () => {
    const fd = new FormData();
    const s = (v) => String(v || "").trim();
    fd.append("vendorName", s(formData.vendorName));
    fd.append("contactNumber", s(formData.contactNumber).replace(/\s+/g, ""));
    if (formData.altContactNumber)
      fd.append(
        "altContactNumber",
        s(formData.altContactNumber).replace(/\s+/g, ""),
      );
    fd.append("email", s(formData.email).toLowerCase());
    fd.append("gender", s(formData.gender));
    fd.append("dateOfBirth", s(formData.dob));
    if (formData.age) fd.append("age", s(formData.age));
    fd.append("storeName", s(formData.storeName));
    fd.append("handlingChargePercentage", s(formData.handlingChargePercentage));
    fd.append("storeAddressLine1", s(formData.storeAddress1));
    if (formData.storeAddress2)
      fd.append("storeAddressLine2", s(formData.storeAddress2));
    fd.append("pinCode", s(formData.pinCode));
    if (formData.city) fd.append("city", s(formData.city));
    if (formData.state) fd.append("state", s(formData.state));
    if (formData.storeLat) fd.append("latitude", s(formData.storeLat));
    if (formData.storeLong) fd.append("longitude", s(formData.storeLong));
    fd.append("ifsc", s(formData.ifscCode).toUpperCase());
    fd.append("accountNumber", s(formData.accountNumber));
    fd.append("bankName", s(formData.bankName));

    const maxSize = 10 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    const check = (file, name) => {
      if (!file) return;
      if (file.size > maxSize) throw new Error(`${name} exceeds 10MB limit.`);
      if (!allowed.includes(file.type))
        throw new Error(`${name} must be JPEG, PNG, or PDF.`);
    };
    check(formData.storeImage, "Store Image");
    if (formData.storeImage) fd.append("storeImage", formData.storeImage);
    check(formData.panCardFront, "PAN Card Front");
    if (formData.panCardFront) fd.append("panCardFront", formData.panCardFront);
    check(formData.panCardBack, "PAN Card Back");
    if (formData.panCardBack) fd.append("panCardBack", formData.panCardBack);
    check(formData.aadharFront, "Aadhar Front");
    if (formData.aadharFront)
      fd.append("aadharCardFront", formData.aadharFront);
    check(formData.aadharBack, "Aadhar Back");
    if (formData.aadharBack) fd.append("aadharCardBack", formData.aadharBack);
    check(formData.drivingLicense, "Driving License");
    if (formData.drivingLicense)
      fd.append("drivingLicense", formData.drivingLicense);
    check(formData.cancelCheque, "Cancel Cheque");
    if (formData.cancelCheque) fd.append("cancelCheque", formData.cancelCheque);

    return fd;
  };

  // ─── UPDATE — confirmed working: PUT /api/vendor/:id ─────────────────────
  const updateVendor = async () => {
    try {
      setIsLoading(true);
      setError("");

      const hasFiles =
        formData.storeImage ||
        formData.panCardFront ||
        formData.panCardBack ||
        formData.aadharFront ||
        formData.aadharBack ||
        formData.drivingLicense ||
        formData.cancelCheque;

      let response;
      if (hasFiles) {
        let fd;
        try {
          fd = buildFormDataPayload();
        } catch (fe) {
          setError(fe.message);
          setIsLoading(false);
          return;
        }
        response = await api.put(`/api/vendor/${vendorData._id}`, fd, {
          timeout: 120000,
        });
      } else {
        const payload = {
          vendorName: formData.vendorName.trim(),
          contactNumber: formData.contactNumber.trim().replace(/\s+/g, ""),
          ...(formData.altContactNumber && {
            altContactNumber: formData.altContactNumber.trim(),
          }),
          email: formData.email.trim().toLowerCase(),
          gender: formData.gender,
          dateOfBirth: formData.dob,
          ...(formData.age && { age: Number(formData.age) }),
          storeName: formData.storeName.trim(),
          handlingChargePercentage: parseFloat(
            formData.handlingChargePercentage,
          ),
          storeAddressLine1: formData.storeAddress1.trim(),
          ...(formData.storeAddress2 && {
            storeAddressLine2: formData.storeAddress2.trim(),
          }),
          pinCode: formData.pinCode.trim(),
          ...(formData.city && { city: formData.city.trim() }),
          ...(formData.state && { state: formData.state.trim() }),
          ...(formData.storeLat && { latitude: parseFloat(formData.storeLat) }),
          ...(formData.storeLong && {
            longitude: parseFloat(formData.storeLong),
          }),
          ifsc: formData.ifscCode.trim().toUpperCase(),
          accountNumber: formData.accountNumber.trim(),
          bankName: formData.bankName.trim(),
        };
        response = await api.put(`/api/vendor/${vendorData._id}`, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: 120000,
        });
      }

      if (response.data.success) {
        setSuccess("Vendor updated successfully!");
        setTimeout(() => {
          onClose();
          setError("");
          setSuccess("");
        }, 1500);
      } else {
        setError(
          response.data.message ||
            response.data.error ||
            "Failed to update vendor",
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || `Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── CREATE vendor ────────────────────────────────────────────────────────
  const createVendor = async () => {
    try {
      setIsLoading(true);
      setError("");
      let fd;
      try {
        fd = buildFormDataPayload();
      } catch (fe) {
        setError(fe.message);
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 120000);
      let response;
      try {
        response = await api.post("/api/vendor/create", fd, {
          signal: controller.signal,
          timeout: 120000,
        });
        clearTimeout(tid);
      } catch (fe) {
        clearTimeout(tid);
        setError(fe.response?.data?.message || fe.message || "Network error.");
        setIsLoading(false);
        return;
      }

      if (response.data.success) {
        setSuccess("Vendor registered successfully!");
        setTimeout(() => {
          onClose();
          setStep(1);
          setOtp(["", "", "", ""]);
          setError("");
          setSuccess("");
        }, 1500);
      } else {
        setError(
          response.data.error ||
            response.data.message ||
            "Failed to register vendor",
        );
      }
    } catch (err) {
      setError(`Error creating vendor: ${err.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── OTP ──────────────────────────────────────────────────────────────────
  const sendOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {
        setError(
          "Must be a valid 10-digit Indian mobile number starting with 6-9",
        );
        setIsLoading(false);
        return;
      }
      const res = await api.post("/api/vendor/send-otp", {
        contactNumber: formData.contactNumber.trim().replace(/\s+/g, ""),
      });
      if (res.data.success) {
        setSuccess(`OTP sent to ${formData.contactNumber}`);
        setStep(2);
      } else {
        setError(res.data.message || res.data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || `Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextClick = () => {
    if (!validateForm()) return;
    if (isEdit) updateVendor();
    else sendOtp();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3)
      document.getElementById(`vendor-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`vendor-otp-${index - 1}`)?.focus();
  };

  const handleVerifyOtp = async () => {
    const entered = otp.join("");
    if (entered.length !== 4) {
      setError("Please enter complete 4-digit OTP");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const res = await api.post("/api/vendor/verify-otp", {
        contactNumber: formData.contactNumber.trim().replace(/\s+/g, ""),
        otp: entered,
      });
      if (res.data.success) {
        setSuccess("OTP verified!");
        await new Promise((r) => setTimeout(r, 500));
        await createVendor();
      } else {
        const msg = res.data.message || res.data.error || "Invalid OTP";
        setError(
          msg.includes("expired")
            ? "OTP expired. Please request a new one."
            : "Invalid OTP. Please try again.",
        );
        setOtp(["", "", "", ""]);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = (field) =>
    `w-full px-3 py-2 text-sm border ${errors[field] ? "border-red-500" : "border-orange-400"} rounded focus:ring-1 focus:ring-orange-400 outline-none`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div
        className="bg-white shadow-lg w-full max-w-6xl relative"
        style={{ maxHeight: "95vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 underline decoration-[#FF7B1D] decoration-4 underline-offset-4">
            {isEdit
              ? "Edit Vendor"
              : step === 1
                ? "Add Vendor"
                : "Verify Contact Number"}
          </h2>
          <button
            onClick={() => {
              setError("");
              setSuccess("");
              onClose();
            }}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-800"
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

        {/* ── FORM (step 1 for Add, always for Edit) ──────────────────────── */}
        {(step === 1 || isEdit) && (
          <div className="overflow-y-auto flex-1 px-6 py-4">
            {/* Personal Info */}
            <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#FF7B1D]" /> Personal Information
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
                  className={inputCls("vendorName")}
                />
                {errors.vendorName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.vendorName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-bold mb-1">
                  Contact Number {!isEdit && "(For Login)"}
                </label>
                <input
                  id="contactNumber"
                  type="text"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit number"
                  maxLength="10"
                  className={inputCls("contactNumber")}
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
                  className={inputCls("altContactNumber")}
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
                  className={inputCls("email")}
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
                  {["male", "female"].map((g) => (
                    <label key={g} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-[#FF7B1D]"
                      />
                      <span className="text-sm capitalize">{g}</span>
                    </label>
                  ))}
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
                  className={inputCls("dob")}
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

            {/* Store Info */}
            <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF7B1D]" /> Store Information
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
                  className={inputCls("storeName")}
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
                  className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
                />
                {isEdit && (
                  <p className="text-xs text-gray-400 mt-1">
                    Leave blank to keep existing
                  </p>
                )}
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
                  placeholder="0-100"
                  className={inputCls("handlingChargePercentage")}
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
                className={inputCls("storeAddress1")}
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
                  className={inputCls("pinCode")}
                />
                {errors.pinCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
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
                  Store Latitude
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
                  Store Longitude
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

            {/* Map */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm text-gray-700 font-bold">
                  Select Location on Map
                </label>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="px-4 py-2 bg-[#FF7B1D] hover:bg-orange-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <MapPin size={16} /> {showMap ? "Hide Map" : "Show Map"}
                </button>
              </div>
              <button
                onClick={getCurrentLocation}
                className="px-6 py-2 bg-[#FF7B1D] text-white font-semibold rounded hover:bg-orange-600 transition flex items-center gap-2"
              >
                <MapPin size={18} /> Get Current Location
              </button>
            </div>

            {showMap && (
              <div className="mb-6 border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-600 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="text-white" size={20} />
                    <p className="text-white font-semibold">
                      Interactive Map — Click to Select Store Location
                    </p>
                  </div>
                  {formData.storeLat && formData.storeLong && (
                    <div className="bg-white/20 rounded-lg px-3 py-2 text-xs text-white grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold">Lat:</span>{" "}
                        {formData.storeLat}
                      </div>
                      <div>
                        <span className="font-semibold">Lng:</span>{" "}
                        {formData.storeLong}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      id="vendor-map-search-input"
                      placeholder="Search address or landmark..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7B1D] text-sm"
                      onKeyPress={async (e) => {
                        if (e.key === "Enter" && window.L) {
                          const q = e.target.value;
                          if (!q) return;
                          try {
                            const r = await fetch(
                              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
                            );
                            const d = await r.json();
                            if (d?.length) {
                              const lat = parseFloat(d[0].lat),
                                lng = parseFloat(d[0].lon);
                              updateLocationFromCoords(lat, lng);
                              if (mapInstanceRef.current) {
                                mapInstanceRef.current.setView([lat, lng], 15);
                                if (markerInstanceRef.current)
                                  markerInstanceRef.current.setLatLng([
                                    lat,
                                    lng,
                                  ]);
                                else {
                                  const m = window.L.marker([lat, lng], {
                                    draggable: true,
                                  }).addTo(mapInstanceRef.current);
                                  m.on("dragend", (ev) =>
                                    updateLocationFromCoords(
                                      ev.target.getLatLng().lat,
                                      ev.target.getLatLng().lng,
                                    ),
                                  );
                                  markerInstanceRef.current = m;
                                }
                              }
                            }
                          } catch (_) {}
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    💡 OpenStreetMap — free, no API key required
                  </p>
                </div>
                <div className="relative" style={{ height: "380px" }}>
                  {mapError ? (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center p-4">
                        <AlertCircle
                          className="text-red-500 mx-auto mb-2"
                          size={40}
                        />
                        <p className="text-red-600 font-semibold text-sm">
                          {mapError}
                        </p>
                      </div>
                    </div>
                  ) : !mapLoaded ? (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center">
                        <Loader2
                          className="animate-spin text-[#FF7B1D] mx-auto mb-2"
                          size={28}
                        />
                        <p className="text-gray-500 text-sm">Loading map…</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      id="vendor-map-container"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                  <div className="absolute bottom-3 left-3 bg-white/95 p-2 rounded-lg shadow border-2 border-[#FF7B1D] text-xs text-gray-600 max-w-[200px]">
                    <p className="font-semibold mb-1">📍 How to use:</p>
                    <p>• Click map to place marker</p>
                    <p>• Drag marker to adjust</p>
                    <p>• Search address above</p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF7B1D]" />
              Document Upload
              {isEdit && (
                <span className="text-xs font-normal text-gray-400 ml-1">
                  (optional — leave blank to keep existing)
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { id: "panCardFront", label: "PAN Card (Front)" },
                { id: "panCardBack", label: "PAN Card (Back)" },
                { id: "aadharFront", label: "Aadhar Card (Front)" },
                { id: "aadharBack", label: "Aadhar Card (Back)" },
                { id: "drivingLicense", label: "Driving License" },
              ].map(({ id, label }) => (
                <div key={id}>
                  <label className="block text-sm text-gray-700 font-bold mb-1">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-sm border border-orange-400 rounded outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Bank Details */}
            <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-[#FF7B1D]" /> Bank Details
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
                  className={inputCls("ifscCode")}
                />
                {errors.ifscCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
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
                  className={inputCls("accountNumber")}
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
                  className={inputCls("bankName")}
                />
                {errors.bankName && (
                  <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
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

            {/* Buttons */}
            <div className="flex justify-end gap-3 pb-2">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-8 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNextClick}
                disabled={isLoading}
                className="px-8 py-2 bg-[#FF7B1D] text-white font-semibold rounded hover:bg-orange-600 transition disabled:bg-orange-300"
              >
                {isLoading
                  ? isEdit
                    ? "Updating..."
                    : "Sending OTP..."
                  : isEdit
                    ? "Update Vendor"
                    : "Next — Verify Contact"}
              </button>
            </div>
          </div>
        )}

        {/* ── OTP step (Add mode only) ─────────────────────────────────────── */}
        {step === 2 && !isEdit && (
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
                    disabled={isLoading}
                    className="w-16 h-16 text-center text-2xl font-bold bg-white border-2 border-orange-400 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full bg-[#FF7B1D] text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition disabled:bg-orange-300 mb-3"
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
                  disabled={isLoading}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
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
                  className="text-sm text-[#FF7B1D] hover:text-orange-600 font-semibold underline disabled:text-gray-400"
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
