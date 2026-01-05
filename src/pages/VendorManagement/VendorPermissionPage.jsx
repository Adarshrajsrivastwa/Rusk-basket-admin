// // src/pages/VendorPermissionPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, CheckSquare, XSquare } from "lucide-react";
// import DashboardLayout from "../../components/DashboardLayout";

// const VendorPermissionPage = () => {
//   const { id } = useParams(); // vendor ID from URL
//   const navigate = useNavigate();

//   // Mock vendor data (in a real app this can come from API or context)
//   const vendorList = [
//     {
//       id: "NO101",
//       name: "Manish Kumar",
//       city: "Noida",
//       pincode: "201301",
//       contact: "6203689042",
//       status: "Approved",
//     },
//     {
//       id: "NO102",
//       name: "Anita Verma",
//       city: "Gurgaon",
//       pincode: "122001",
//       contact: "9123456780",
//       status: "Suspended",
//     },
//     {
//       id: "NO103",
//       name: "Suresh Yadav",
//       city: "Noida",
//       pincode: "201301",
//       contact: "9988776655",
//       status: "Approved",
//     },
//   ];

//   // Find current vendor by ID
//   const [vendor, setVendor] = useState(null);

//   useEffect(() => {
//     const found = vendorList.find((v) => v.id === id);
//     setVendor(found || null);
//   }, [id]);

//   // Permission structure
//   const permissions = [
//     { name: "Edit Product Details", key: "edit" },
//     { name: "Change Pricing", key: "pricing" },
//     { name: "Manage Inventory", key: "inventory" },
//     { name: "Access Analytics", key: "analytics" },
//     { name: "Enable/Disable Product", key: "enable_disable" },
//   ];

//   const [granted, setGranted] = useState({
//     edit: true,
//     pricing: false,
//     inventory: true,
//     analytics: false,
//     enable_disable: true,
//   });

//   const togglePermission = (key) => {
//     setGranted((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleSave = () => {
//     alert(
//       `Permissions for ${vendor?.name || id} (${
//         vendor?.id
//       }) saved successfully!`
//     );
//   };

//   if (!vendor) {
//     return (
//       <DashboardLayout>
//         <div className="flex flex-col items-center justify-center h-[70vh]">
//           <p className="text-lg text-gray-600 mb-4">
//             Vendor not found for ID: <span className="font-semibold">{id}</span>
//           </p>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-6 py-2 rounded"
//           >
//             Go Back
//           </button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="w-full max-w-[98%] mx-auto bg-white shadow-sm rounded-sm p-6 mt-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Vendor Permission Management
//           </h1>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-orange-600 hover:text-blue-700"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back
//           </button>
//         </div>

//         {/* Vendor Info Card */}
//         <div className="bg-gray-50 p-4 rounded-sm mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
//             <p>
//               <span className="font-semibold text-gray-900">Vendor ID:</span>{" "}
//               {vendor.id}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-900">Name:</span>{" "}
//               {vendor.name}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-900">City:</span>{" "}
//               {vendor.city}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-900">Pincode:</span>{" "}
//               {vendor.pincode}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-900">Contact:</span>{" "}
//               {vendor.contact}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-900">Status:</span>{" "}
//               <span
//                 className={
//                   vendor.status === "Approved"
//                     ? "text-green-600 font-semibold"
//                     : "text-gray-600 font-semibold"
//                 }
//               >
//                 {vendor.status === "Approved" ? "Active" : "Suspended"}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Permission Table */}
//         <div className="overflow-x-auto w-full">
//           <table className="w-full border border-gray-200 rounded-sm">
//             <thead className="bg-[#FF7B1D] text-black">
//               <tr>
//                 <th className="p-3 text-left">Permission</th>
//                 <th className="p-3 text-center">Status</th>
//                 <th className="p-3 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {permissions.map((perm) => (
//                 <tr
//                   key={perm.key}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="p-3 text-gray-800">{perm.name}</td>
//                   <td className="p-3 text-center">
//                     {granted[perm.key] ? (
//                       <span className="text-green-600 font-semibold flex justify-center items-center gap-1">
//                         <CheckSquare className="w-4 h-4" /> Granted
//                       </span>
//                     ) : (
//                       <span className="text-red-600 font-semibold flex justify-center items-center gap-1">
//                         <XSquare className="w-4 h-4" /> Denied
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-3 text-center">
//                     <button
//                       onClick={() => togglePermission(perm.key)}
//                       className={`px-4 py-1 rounded text-white text-sm ${
//                         granted[perm.key]
//                           ? "bg-red-600 hover:bg-red-700"
//                           : "bg-green-600 hover:bg-green-700"
//                       }`}
//                     >
//                       {granted[perm.key] ? "Revoke" : "Grant"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Save Button */}
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={handleSave}
//             className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-6 py-2  text-sm font-semibold"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default VendorPermissionPage;
// src/pages/VendorPermissionPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckSquare, XSquare } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

const VendorPermissionPage = () => {
  const { id } = useParams(); // vendor ID from URL
  const navigate = useNavigate();

  // Mock vendor data (in a real app this can come from API or context)
  const vendorList = [
    {
      id: "NO101",
      name: "Manish Kumar",
      city: "Noida",
      pincode: "201301",
      contact: "6203689042",
      status: "Approved",
    },
    {
      id: "NO102",
      name: "Anita Verma",
      city: "Gurgaon",
      pincode: "122001",
      contact: "9123456780",
      status: "Suspended",
    },
    {
      id: "NO103",
      name: "Suresh Yadav",
      city: "Noida",
      pincode: "201301",
      contact: "9988776655",
      status: "Approved",
    },
  ];

  // Find current vendor by ID
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const found = vendorList.find((v) => v.id === id);
    setVendor(found || null);
  }, [id]);

  // Permission structure
  const permissions = [
    { name: "Edit Product Details", key: "edit" },
    { name: "Change Pricing", key: "pricing" },
    { name: "Manage Inventory", key: "inventory" },
    { name: "Access Analytics", key: "analytics" },
    { name: "Enable/Disable Product", key: "enable_disable" },
  ];

  const [granted, setGranted] = useState({
    edit: true,
    pricing: false,
    inventory: true,
    analytics: false,
    enable_disable: true,
  });

  // Commission settings
  const [commission, setCommission] = useState({
    type: "percentage", // percentage or fixed
    value: "10",
  });

  // Add product permission settings
  const [addProductPermission, setAddProductPermission] =
    useState("with_permission"); // with_permission or live_without_permission

  // Other permissions
  const [otherPermissions, setOtherPermissions] = useState({
    bulk_upload: false,
    export_data: true,
    customer_support: false,
  });

  const togglePermission = (key) => {
    setGranted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleOtherPermission = (key) => {
    setOtherPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alert(
      `Permissions for ${vendor?.name || id} (${
        vendor?.id
      }) saved successfully!\n\nCommission: ${
        commission.type === "percentage"
          ? commission.value + "%"
          : "₹" + commission.value
      }\nAdd Product: ${
        addProductPermission === "with_permission"
          ? "With Permission"
          : "Live Without Permission"
      }`
    );
  };

  if (!vendor) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <p className="text-lg text-gray-600 mb-4">
            Vendor not found for ID: <span className="font-semibold">{id}</span>
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-6 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-[98%] mx-auto bg-white shadow-sm rounded-sm p-6 mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Vendor Permission Management
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Vendor Info Card */}
        <div className="bg-gray-50 p-4 rounded-sm mb-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Vendor ID:</span>{" "}
              {vendor.id}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Name:</span>{" "}
              {vendor.name}
            </p>
            <p>
              <span className="font-semibold text-gray-900">City:</span>{" "}
              {vendor.city}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Pincode:</span>{" "}
              {vendor.pincode}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Contact:</span>{" "}
              {vendor.contact}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Status:</span>{" "}
              <span
                className={
                  vendor.status === "Approved"
                    ? "text-green-600 font-semibold"
                    : "text-gray-600 font-semibold"
                }
              >
                {vendor.status === "Approved" ? "Active" : "Suspended"}
              </span>
            </p>
          </div>
        </div>

        {/* Permission Table */}
        <div className="overflow-x-auto w-full mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Product Permissions
          </h2>
          <table className="w-full border border-gray-200 rounded-sm">
            <thead className="bg-[#FF7B1D] text-black">
              <tr>
                <th className="p-3 text-left">Permission</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr
                  key={perm.key}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-800">{perm.name}</td>
                  <td className="p-3 text-center">
                    {granted[perm.key] ? (
                      <span className="text-green-600 font-semibold flex justify-center items-center gap-1">
                        <CheckSquare className="w-4 h-4" /> Granted
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold flex justify-center items-center gap-1">
                        <XSquare className="w-4 h-4" /> Denied
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => togglePermission(perm.key)}
                      className={`px-4 py-1 rounded text-white text-sm ${
                        granted[perm.key]
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {granted[perm.key] ? "Revoke" : "Grant"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vendor Commission Settings */}
        <div className="bg-gray-50 p-5 rounded-sm mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Vendor Commission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Commission Type
              </label>
              <select
                value={commission.type}
                onChange={(e) =>
                  setCommission({ ...commission, type: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Commission Value
              </label>
              <input
                type="number"
                value={commission.value}
                onChange={(e) =>
                  setCommission({ ...commission, value: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={commission.type === "percentage" ? "10" : "100"}
                min="0"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Current commission:{" "}
            <span className="font-semibold text-gray-800">
              {commission.type === "percentage"
                ? `${commission.value}% per sale`
                : `₹${commission.value} per sale`}
            </span>
          </p>
        </div>

        {/* Add Product Permission */}
        <div className="bg-gray-50 p-5 rounded-sm mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add Product Permission
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="addProductPermission"
                value="with_permission"
                checked={addProductPermission === "with_permission"}
                onChange={(e) => setAddProductPermission(e.target.value)}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <span className="font-semibold text-gray-800">
                  With Permission (Default)
                </span>
                <p className="text-sm text-gray-600">
                  Vendor must request approval before adding new products
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="addProductPermission"
                value="live_without_permission"
                checked={addProductPermission === "live_without_permission"}
                onChange={(e) => setAddProductPermission(e.target.value)}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <span className="font-semibold text-gray-800">
                  Live Without Permission
                </span>
                <p className="text-sm text-gray-600">
                  Vendor can add products directly without admin approval
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Other Permissions */}
        <div className="bg-gray-50 p-5 rounded-sm mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Other Permissions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left text-gray-800">Permission</th>
                  <th className="p-3 text-center text-gray-800">Status</th>
                  <th className="p-3 text-center text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-800">Bulk Product Upload</td>
                  <td className="p-3 text-center">
                    {otherPermissions.bulk_upload ? (
                      <span className="text-green-600 font-semibold flex justify-center items-center gap-1">
                        <CheckSquare className="w-4 h-4" /> Granted
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold flex justify-center items-center gap-1">
                        <XSquare className="w-4 h-4" /> Denied
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleOtherPermission("bulk_upload")}
                      className={`px-4 py-1 rounded text-white text-sm ${
                        otherPermissions.bulk_upload
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {otherPermissions.bulk_upload ? "Revoke" : "Grant"}
                    </button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-800">Export Sales Data</td>
                  <td className="p-3 text-center">
                    {otherPermissions.export_data ? (
                      <span className="text-green-600 font-semibold flex justify-center items-center gap-1">
                        <CheckSquare className="w-4 h-4" /> Granted
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold flex justify-center items-center gap-1">
                        <XSquare className="w-4 h-4" /> Denied
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleOtherPermission("export_data")}
                      className={`px-4 py-1 rounded text-white text-sm ${
                        otherPermissions.export_data
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {otherPermissions.export_data ? "Revoke" : "Grant"}
                    </button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-800">Customer Support Access</td>
                  <td className="p-3 text-center">
                    {otherPermissions.customer_support ? (
                      <span className="text-green-600 font-semibold flex justify-center items-center gap-1">
                        <CheckSquare className="w-4 h-4" /> Granted
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold flex justify-center items-center gap-1">
                        <XSquare className="w-4 h-4" /> Denied
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleOtherPermission("customer_support")}
                      className={`px-4 py-1 rounded text-white text-sm ${
                        otherPermissions.customer_support
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {otherPermissions.customer_support ? "Revoke" : "Grant"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-6 py-2  text-sm font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorPermissionPage;
