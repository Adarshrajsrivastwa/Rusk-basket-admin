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
import React, { useState, useEffect } from "react";
import { X, User, MapPin, FileText, Banknote } from "lucide-react";

const AddVendorModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
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
    ifscCode: "",
    accountNumber: "",
    bankName: "",
    cancelCheque: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      generateStoreId();
    }
  }, [isOpen]);

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
          setFormData((prev) => ({
            ...prev,
            storeLat: position.coords.latitude.toFixed(6),
            storeLong: position.coords.longitude.toFixed(6),
          }));
          alert("Location fetched successfully!");
        },
        () => {
          alert("Unable to fetch location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchCityState = async (pinCode) => {
    if (pinCode.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pinCode}`
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

  const handleNextClick = () => {
    if (validateForm()) setStep(2);
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

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      alert("Vendor added successfully!");
      onClose();
    } else {
      alert("Please enter complete OTP");
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
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                <button
                  onClick={getCurrentLocation}
                  className="w-full md:w-auto px-6 py-2 bg-[#FF7B1D] text-white font-semibold rounded hover:bg-orange-600 transition"
                >
                  📍 Get Current Location
                </button>
              </div>

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
                >
                  Cancel
                </button>
                <button
                  onClick={handleNextClick}
                  className="px-8 py-2 bg-[#FF7B1D] text-white font-semibold rounded hover:bg-orange-600 transition"
                >
                  Next - Verify Contact
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
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-[#FF7B1D] text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg"
              >
                Verify & Add Vendor
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  ← Back to Form
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
