// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import { BASE_URL } from "../../api/api";
// import { Bike, Edit, RefreshCw, X, Check } from "lucide-react";

// export default function RiderDueAmountsPage() {
//   const [riderDueAmounts, setRiderDueAmounts] = useState([]);
//   const [riderDueLoading, setRiderDueLoading] = useState(false);
//   const [riderDueSummary, setRiderDueSummary] = useState(null);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [selectedRider, setSelectedRider] = useState(null);
//   const [updateFormData, setUpdateFormData] = useState({
//     dueAmount: "",
//     description: "",
//   });
//   const [updating, setUpdating] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchRiderDueAmounts();
//   }, []);

//   const fetchRiderDueAmounts = async () => {
//     setRiderDueLoading(true);
//     setError(null);
//     try {
//       const token =
//         localStorage.getItem("token") || localStorage.getItem("authToken");
//       const headers = { "Content-Type": "application/json" };
//       if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//       }

//       const response = await fetch(
//         `${BASE_URL}/api/vendor/riders/due-amounts`,
//         {
//           method: "GET",
//           headers: headers,
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch rider due amounts: ${response.status}`,
//         );
//       }
//       const result = await response.json();
//       if (result.success) {
//         setRiderDueAmounts(result.data || []);
//         setRiderDueSummary(result.summary || null);
//       } else {
//         throw new Error(result.message || "Failed to fetch rider due amounts");
//       }
//     } catch (err) {
//       //       setError(err.message);
//     } finally {
//       setRiderDueLoading(false);
//     }
//   };

//   const openUpdateModal = (rider) => {
//     setSelectedRider(rider);
//     setUpdateFormData({
//       dueAmount: parseFloat(rider.dueBalance || 0).toFixed(2),
//       description: "",
//     });
//     setIsUpdateModalOpen(true);
//     setError(null);
//   };

//   const closeUpdateModal = () => {
//     setIsUpdateModalOpen(false);
//     setSelectedRider(null);
//     setUpdateFormData({ dueAmount: "", description: "" });
//     setError(null);
//   };

//   const handleUpdateDueAmount = async (e) => {
//     e.preventDefault();
//     if (!selectedRider || !updateFormData.dueAmount) {
//       setError("Due amount is required.");
//       return;
//     }
//     setUpdating(true);
//     setError(null);

//     try {
//       const token =
//         localStorage.getItem("token") || localStorage.getItem("authToken");
//       const headers = { "Content-Type": "application/json" };
//       if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//       }

//       const response = await fetch(
//         `${BASE_URL}/api/vendor/riders/${selectedRider.riderId}/due-amount`,
//         {
//           method: "PUT",
//           headers: headers,
//           credentials: "include",
//           body: JSON.stringify({
//             dueAmount: parseFloat(updateFormData.dueAmount),
//             description: updateFormData.description,
//           }),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message ||
//             `Failed to update due amount: ${response.status}`,
//         );
//       }

//       const result = await response.json();
//       if (result.success) {
//         showToast.success("Due amount updated successfully!");
//         closeUpdateModal();
//         fetchRiderDueAmounts(); // Refresh data
//       } else {
//         throw new Error(result.message || "Failed to update due amount");
//       }
//     } catch (err) {
//       //       setError(err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="p-0 ml-6 mt-2">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <Bike className="w-7 h-7 text-orange-600" />
//             Rider Due Amounts
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Manage and update rider due amounts
//           </p>
//         </div>

//         {/* Summary Card */}
//         {riderDueSummary && (
//           <div className="mb-6 p-6 bg-orange-50 rounded-sm border border-orange-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Riders</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">
//                   {riderDueSummary.totalRiders || 0}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-gray-600">Total Due Amount</p>
//                 <p className="text-2xl font-bold text-orange-600 mt-1">
//                   ₹
//                   {parseFloat(
//                     riderDueSummary.totalDueAmount || 0,
//                   ).toLocaleString("en-IN", {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="bg-white rounded-sm shadow-sm p-2">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Rider Details
//             </h2>
//             <button
//               onClick={fetchRiderDueAmounts}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//               title="Refresh"
//             >
//               <RefreshCw className="w-4 h-4 text-gray-600" />
//               Refresh
//             </button>
//           </div>

//           {error && !riderDueLoading && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}

//           {riderDueLoading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
//               <p className="text-gray-500 text-sm mt-4">
//                 Loading rider due amounts...
//               </p>
//             </div>
//           ) : riderDueAmounts.length === 0 ? (
//             <div className="text-center py-12">
//               <Bike className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500 font-medium">
//                 No rider due amounts found
//               </p>
//               <p className="text-gray-400 text-sm mt-2">
//                 Riders with due amounts will appear here
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b bg-gray-50">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                       Rider Name
//                     </th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                       Mobile
//                     </th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                       Due Balance
//                     </th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {riderDueAmounts.map((rider, index) => (
//                     <tr key={index} className="border-b hover:bg-gray-50">
//                       <td className="py-3 px-4 text-sm font-medium text-gray-900">
//                         {rider.fullName || "N/A"}
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-600">
//                         {rider.mobileNumber || "N/A"}
//                       </td>
//                       <td className="py-3 px-4 text-sm font-semibold text-orange-600">
//                         ₹
//                         {parseFloat(rider.dueBalance || 0).toLocaleString(
//                           "en-IN",
//                           {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           },
//                         )}
//                       </td>
//                       <td className="py-3 px-4">
//                         <button
//                           onClick={() => openUpdateModal(rider)}
//                           className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
//                         >
//                           <Edit className="w-4 h-4" />
//                           Update
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Update Due Amount Modal */}
//         {isUpdateModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
//               <form onSubmit={handleUpdateDueAmount}>
//                 <div className="flex items-center justify-between p-6 border-b">
//                   <h3 className="text-lg font-bold text-gray-900">
//                     Update Due Amount
//                   </h3>
//                   <button
//                     type="button"
//                     onClick={closeUpdateModal}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   {selectedRider && (
//                     <div className="bg-gray-50 p-3 rounded-lg text-sm">
//                       <p className="font-semibold text-gray-800">
//                         Rider: {selectedRider.fullName}
//                       </p>
//                       <p className="text-gray-600">
//                         Mobile: {selectedRider.mobileNumber}
//                       </p>
//                       <p className="text-gray-600">
//                         Current Due: ₹
//                         {parseFloat(
//                           selectedRider.dueBalance || 0,
//                         ).toLocaleString("en-IN", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   <div>
//                     <label
//                       htmlFor="dueAmount"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Amount Paid *
//                     </label>
//                     <input
//                       type="number"
//                       id="dueAmount"
//                       name="dueAmount"
//                       value={updateFormData.dueAmount}
//                       onChange={(e) =>
//                         setUpdateFormData((prev) => ({
//                           ...prev,
//                           dueAmount: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter amount paid"
//                       className="w-full border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500"
//                       required
//                       step="0.01"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="description"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Description (Optional)
//                     </label>
//                     <textarea
//                       id="description"
//                       name="description"
//                       value={updateFormData.description}
//                       onChange={(e) =>
//                         setUpdateFormData((prev) => ({
//                           ...prev,
//                           description: e.target.value,
//                         }))
//                       }
//                       placeholder="Add a description for the update"
//                       rows="3"
//                       className="w-full border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500 resize-y"
//                     ></textarea>
//                   </div>
//                   {error && <p className="text-red-600 text-sm">{error}</p>}
//                 </div>
//                 <div className="flex justify-end gap-3 p-6 border-t">
//                   <button
//                     type="button"
//                     onClick={closeUpdateModal}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//                     disabled={updating}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
//                     disabled={updating}
//                   >
//                     {updating ? (
//                       <>
//                         <RefreshCw className="w-4 h-4 animate-spin" />{" "}
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <Check className="w-4 h-4" /> Submit
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { BASE_URL } from "../../api/api";
import { Bike, Edit, RefreshCw, X, Check } from "lucide-react";
import { showToast } from "../../utils/toast";

export default function RiderDueAmountsPage() {
  const [riderDueAmounts, setRiderDueAmounts] = useState([]);
  const [riderDueLoading, setRiderDueLoading] = useState(false);
  const [riderDueSummary, setRiderDueSummary] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    dueAmount: "",
    description: "",
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRiderDueAmounts();
  }, []);

  const fetchRiderDueAmounts = async () => {
    setRiderDueLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${BASE_URL}/api/vendor/riders/due-amounts`,
        {
          method: "GET",
          headers,
          credentials: "include",
        },
      );

      if (!response.ok)
        throw new Error(
          `Failed to fetch rider due amounts: ${response.status}`,
        );
      const result = await response.json();
      if (result.success) {
        setRiderDueAmounts(result.data || []);
        setRiderDueSummary(result.summary || null);
      } else {
        throw new Error(result.message || "Failed to fetch rider due amounts");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRiderDueLoading(false);
    }
  };

  const openUpdateModal = (rider) => {
    setSelectedRider(rider);
    setUpdateFormData({
      dueAmount: parseFloat(rider.dueBalance || 0).toFixed(2),
      description: "",
    });
    setIsUpdateModalOpen(true);
    setError(null);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedRider(null);
    setUpdateFormData({ dueAmount: "", description: "" });
    setError(null);
  };

  const handleUpdateDueAmount = async (e) => {
    e.preventDefault();
    if (!selectedRider || !updateFormData.dueAmount) {
      setError("Due amount is required.");
      return;
    }
    setUpdating(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `${BASE_URL}/api/vendor/riders/${selectedRider.riderId}/due-amount`,
        {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify({
            dueAmount: parseFloat(updateFormData.dueAmount),
            description: updateFormData.description,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to update due amount: ${response.status}`,
        );
      }
      const result = await response.json();
      if (result.success) {
        showToast.success("Due amount updated successfully!");
        closeUpdateModal();
        fetchRiderDueAmounts();
      } else {
        throw new Error(result.message || "Failed to update due amount");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Search filter
  const filteredRiders = riderDueAmounts.filter((rider) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (rider.fullName || "").toLowerCase().includes(q) ||
      (rider.mobileNumber || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const currentRiders = filteredRiders.slice(
    indexOfFirst,
    indexOfFirst + itemsPerPage,
  );

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr
          key={idx}
          className="border-b border-gray-200 animate-pulse bg-white"
        >
          {Array.from({ length: 4 }).map((__, j) => (
            <td key={j} className="p-3">
              <div className="h-4 bg-gray-200 rounded w-[80%]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td
          colSpan="4"
          className="text-center py-10 text-gray-500 text-sm bg-white"
        >
          {searchQuery
            ? "No riders match your search."
            : "No rider due amounts found."}
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      <div className="p-0 ml-8 mt-2">
        {/* ── Summary Cards ── */}
        {riderDueSummary && (
          <div className="grid grid-cols-2 gap-4 mb-4 max-w-[99%]">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Total Riders
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {riderDueSummary.totalRiders || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Total Due Amount
              </p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                ₹
                {parseFloat(riderDueSummary.totalDueAmount || 0).toLocaleString(
                  "en-IN",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                )}
              </p>
            </div>
          </div>
        )}

        {/* ── Header: Search + Refresh ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 max-w-[99%] mx-auto mb-2">
          <div className="flex items-center border border-black rounded overflow-hidden h-[36px] w-full max-w-[100%] lg:max-w-[380px]">
            <input
              type="text"
              placeholder="Search by Name or Mobile..."
              className="flex-1 px-4 text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-4 sm:px-6 h-full transition-colors">
              Search
            </button>
          </div>

          <button
            onClick={fetchRiderDueAmounts}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-sm text-sm font-medium text-gray-700 transition-colors border border-gray-300"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* ── Error ── */}
        {error && !riderDueLoading && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-sm max-w-[99%]">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white rounded-sm ml-0 shadow-sm overflow-x-auto max-w-[99%] mx-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FF7B1D] text-black">
                <th className="p-3 text-left">S.N</th>
                <th className="p-3 text-left">Rider Name</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Due Balance</th>
                <th className="p-3 pr-6 text-right">Action</th>
              </tr>
            </thead>

            {riderDueLoading ? (
              <TableSkeleton />
            ) : currentRiders.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {currentRiders.map((rider, idx) => (
                  <tr
                    key={idx}
                    className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                  >
                    <td className="p-3">{indexOfFirst + idx + 1}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {rider.fullName || "N/A"}
                    </td>
                    <td className="p-3 text-gray-700">
                      {rider.mobileNumber || "N/A"}
                    </td>
                    <td className="p-3 font-semibold text-orange-600">
                      ₹
                      {parseFloat(rider.dueBalance || 0).toLocaleString(
                        "en-IN",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-3 text-orange-600">
                        <button
                          onClick={() => openUpdateModal(rider)}
                          className="hover:text-blue-700"
                          title="Update Due Amount"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* ── Pagination ── */}
        {!riderDueLoading && filteredRiders.length > 0 && (
          <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto mb-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            <div className="flex items-center gap-2 text-sm text-black font-medium">
              {(() => {
                const pages = [];
                const visiblePages = new Set([
                  1,
                  2,
                  totalPages - 1,
                  totalPages,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                ]);
                for (let i = 1; i <= totalPages; i++) {
                  if (visiblePages.has(i)) pages.push(i);
                  else if (pages[pages.length - 1] !== "...") pages.push("...");
                }
                return pages.map((page, idx) =>
                  page === "..." ? (
                    <span key={idx} className="px-1 text-black select-none">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-1 hover:text-orange-500 transition-colors ${currentPage === page ? "text-orange-600 font-semibold" : ""}`}
                    >
                      {page}
                    </button>
                  ),
                );
              })()}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── Update Modal ── */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-md w-full border border-gray-300">
            <form onSubmit={handleUpdateDueAmount}>
              {/* Modal Header */}
              <div className="bg-[#FF7B1D] px-6 py-4 flex items-center justify-between rounded-t-sm">
                <h3 className="text-base font-bold text-white">
                  Update Due Amount
                </h3>
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-sm">
                {/* Rider Info */}
                {selectedRider && (
                  <div className="bg-orange-50 border border-orange-200 rounded-sm p-3 text-sm">
                    <p className="font-semibold text-gray-800">
                      {selectedRider.fullName}
                    </p>
                    <p className="text-gray-600">
                      Mobile: {selectedRider.mobileNumber}
                    </p>
                    <p className="text-orange-600 font-semibold">
                      Current Due: ₹
                      {parseFloat(selectedRider.dueBalance || 0).toLocaleString(
                        "en-IN",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Amount Paid <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={updateFormData.dueAmount}
                    onChange={(e) =>
                      setUpdateFormData((prev) => ({
                        ...prev,
                        dueAmount: e.target.value,
                      }))
                    }
                    placeholder="Enter amount paid"
                    className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-[#FF7B1D]"
                    required
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Description{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    value={updateFormData.description}
                    onChange={(e) =>
                      setUpdateFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Add a description for the update"
                    rows="3"
                    className="w-full border border-orange-400 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] resize-y"
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  disabled={updating}
                  className="px-6 py-2 border border-gray-400 rounded-sm hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-sm font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
