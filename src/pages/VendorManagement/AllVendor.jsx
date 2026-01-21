// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import { Eye, Edit, Trash2, Settings } from "lucide-react";
// import AddVendorModal from "../../components/AddVendorModal";
// import { useNavigate } from "react-router-dom";

// const AllVendor = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedVendor, setSelectedVendor] = useState(null); // ✅ store vendor for edit/view
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const itemsPerPage = 8;

//   const [vendors, setVendors] = useState([]);

//   // Simulate loading (replace with API later)
//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => {
//       setVendors([
//         {
//           id: "NO101",
//           name: "Manish Kumar",
//           city: "Noida",
//           pincode: "201301",
//           contact: "6203689042",
//           status: "Approved",
//         },
//         {
//           id: "NO102",
//           name: "Anita Verma",
//           city: "Gurgaon",
//           pincode: "122001",
//           contact: "9123456780",
//           status: "Suspended",
//         },
//         {
//           id: "NO103",
//           name: "Suresh Yadav",
//           city: "Noida",
//           pincode: "201301",
//           contact: "9988776655",
//           status: "Approved",
//         },
//         {
//           id: "NO104",
//           name: "Amit Kumar",
//           city: "Ghaziabad",
//           pincode: "201002",
//           contact: "9234567890",
//           status: "Approved",
//         },
//         {
//           id: "NO105",
//           name: "Neha Sharma",
//           city: "Noida",
//           pincode: "201301",
//           contact: "9876123450",
//           status: "Suspended",
//         },
//         {
//           id: "NO106",
//           name: "Rakesh Gupta",
//           city: "Delhi",
//           pincode: "110003",
//           contact: "9123456701",
//           status: "Approved",
//         },
//         {
//           id: "NO107",
//           name: "Vikram Singh",
//           city: "Noida",
//           pincode: "201304",
//           contact: "9876543211",
//           status: "Approved",
//         },
//         {
//           id: "NO108",
//           name: "Ankita Verma",
//           city: "Delhi",
//           pincode: "110004",
//           contact: "9123456702",
//           status: "Suspended",
//         },
//       ]);
//       setLoading(false);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, []);

//   const statusColors = {
//     Approved: "text-green-600 font-semibold",
//     Suspended: "text-gray-600 font-semibold",
//   };

//   // ✅ Delete Functionality
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this vendor?")) {
//       setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
//     }
//   };

//   // ✅ Edit Functionality
//   const handleEdit = (vendor) => {
//     setSelectedVendor(vendor);
//     setIsEditModalOpen(true);
//   };

//   // ✅ View Functionality
//   const handleView = (vendor) => {
//     navigate(`/vendor/${vendor.id}`, { state: { vendor } });
//   };

//   // ✅ Filter and Pagination Logic
//   const filteredVendors = vendors
//     .filter((vendor) => {
//       if (activeTab === "active") return vendor.status === "Approved";
//       if (activeTab === "suspended") return vendor.status === "Suspended";
//       return true;
//     })
//     .filter((vendor) =>
//       [vendor.name, vendor.id, vendor.city, vendor.pincode, vendor.contact]
//         .join(" ")
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//     );

//   const indexOfLastVendor = currentPage * itemsPerPage;
//   const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
//   const currentVendors = filteredVendors.slice(
//     indexOfFirstVendor,
//     indexOfLastVendor
//   );
//   const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

//   // ✅ Skeleton Loader
//   const TableSkeleton = () => (
//     <tbody>
//       {Array.from({ length: itemsPerPage }).map((_, i) => (
//         <tr
//           key={i}
//           className="border-b border-gray-200 animate-pulse bg-white rounded-sm"
//         >
//           {Array.from({ length: 8 }).map((__, j) => (
//             <td key={j} className="p-3">
//               <div className="h-4 bg-gray-200 rounded w-[80%]" />
//             </td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   );

//   // ✅ Empty State
//   const EmptyState = () => (
//     <tbody>
//       <tr>
//         <td
//           colSpan="8"
//           className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
//         >
//           No vendors found.
//         </td>
//       </tr>
//     </tbody>
//   );

//   return (
//     <DashboardLayout>
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-0 mb-2">
//         <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
//           {/* Tabs */}
//           <div className="flex gap-4 items-center overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
//             {["all", "active", "suspended"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap ${
//                   activeTab === tab
//                     ? "bg-[#FF7B1D] text-white border-orange-500"
//                     : "border-gray-400 text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {tab === "all"
//                   ? "All Vendor"
//                   : tab === "active"
//                   ? "Active"
//                   : "Suspended"}
//               </button>
//             ))}
//           </div>

//           {/* Search */}
//           <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px] mt-2 sm:mt-0">
//             <input
//               type="text"
//               placeholder="Search Vendor by Name, ID..."
//               className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full">
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Add Vendor Button */}
//         <div className="w-full md:w-auto flex justify-start md:justify-end mt-2 md:mt-0">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-black text-white w-52 sm:w-60 px-4 sm:px-5 py-2 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
//           >
//             + Add Vendor
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-[#FF7B1D] text-black">
//               <th className="p-3 text-left">S.N</th>
//               <th className="p-3 text-left">Vendor ID</th>
//               <th className="p-3 text-left">Authorized Name</th>
//               <th className="p-3 text-left">City</th>
//               <th className="p-3 text-left">Pin Code</th>
//               <th className="p-3 text-left">Contact Number</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 pr-6 text-right">Action</th>
//             </tr>
//           </thead>

//           {loading ? (
//             <TableSkeleton />
//           ) : filteredVendors.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <tbody>
//               {currentVendors.map((vendor, idx) => (
//                 <tr
//                   key={vendor.id}
//                   className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
//                 >
//                   <td className="p-3">{indexOfFirstVendor + idx + 1}</td>
//                   <td className="p-3">{vendor.id}</td>
//                   <td className="p-3">{vendor.name}</td>
//                   <td className="p-3">{vendor.city}</td>
//                   <td className="p-3">{vendor.pincode}</td>
//                   <td className="p-3">{vendor.contact}</td>
//                   <td className={`p-3 ${statusColors[vendor.status]}`}>
//                     {vendor.status === "Approved" ? "Active" : "Suspended"}
//                   </td>
//                   <td className="p-3 text-right">
//                     <div className="flex justify-end gap-3 text-orange-600">
//                       <button
//                         onClick={() => handleEdit(vendor)}
//                         className="hover:text-blue-700"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(vendor.id)}
//                         className="hover:text-red-700"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleView(vendor)}
//                         className="hover:text-green-700"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() =>
//                           navigate(`/vendors/${vendor.id}/settings`)
//                         }
//                         className="hover:text-blue-700"
//                         title="Settings"
//                       >
//                         <Settings className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           )}
//         </table>
//       </div>

//       {/* Pagination */}
//       {!loading && filteredVendors.length > 0 && (
//         <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600"
//           >
//             Back
//           </button>
//           <div className="flex items-center gap-2 text-sm text-black font-medium">
//             {(() => {
//               const pages = [];
//               const visiblePages = new Set([
//                 1,
//                 2,
//                 totalPages - 1,
//                 totalPages,
//                 currentPage - 1,
//                 currentPage,
//                 currentPage + 1,
//               ]);
//               for (let i = 1; i <= totalPages; i++) {
//                 if (visiblePages.has(i)) pages.push(i);
//                 else if (pages[pages.length - 1] !== "...") pages.push("...");
//               }
//               return pages.map((page, idx) =>
//                 page === "..." ? (
//                   <span key={idx} className="px-1 text-black select-none">
//                     ...
//                   </span>
//                 ) : (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-1 ${
//                       currentPage === page
//                         ? "text-orange-600 font-semibold"
//                         : ""
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               );
//             })()}
//           </div>
//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* ✅ Add Vendor Modal */}
//       <AddVendorModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />

//       {/* ✅ Edit Vendor Modal (with data pre-filled) */}
//       <AddVendorModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         isEdit={true}
//         vendorData={selectedVendor}
//       />
//     </DashboardLayout>
//   );
// };

// export default AllVendor;
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2, Settings } from "lucide-react";
import AddVendorModal from "../../components/AddVendorModal";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";

const AllVendor = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });
  const navigate = useNavigate();

  // Fetch vendors from API
  const fetchVendors = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const authToken =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      console.log("Fetching vendors...");
      console.log("Page:", page, "Limit:", limit);
      console.log("Auth token available:", authToken ? "Yes" : "No");

      const response = await fetch(
        `${BASE_URL}/api/vendor?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
          credentials: "include",
        }
      );

      console.log("Fetch vendors response status:", response.status);

      const result = await response.json();
      console.log("Fetch vendors response:", result);

      if (response.ok && result.success) {
        setVendors(result.data || []);
        setPagination(
          result.pagination || {
            total: result.count || 0,
            pages: 1,
            page: page,
            limit: limit,
          }
        );
      } else {
        console.error("Failed to fetch vendors:", result.message);
        setVendors([]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vendors on mount and when page changes
  useEffect(() => {
    fetchVendors(currentPage, 10);
  }, [currentPage]);

  // Refresh vendors list (call this after adding/editing/deleting)
  const refreshVendors = () => {
    fetchVendors(currentPage, 10);
  };

  const statusColors = {
    true: "text-green-600 font-semibold", // isActive: true
    false: "text-gray-600 font-semibold", // isActive: false
  };

  // Delete Functionality
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        const authToken =
          localStorage.getItem("authToken") || localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/api/vendor/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert("Vendor deleted successfully");
          refreshVendors();
        } else {
          alert(result.message || "Failed to delete vendor");
        }
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Error deleting vendor");
      }
    }
  };

  // Edit Functionality
  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditModalOpen(true);
  };

  // View Functionality
  const handleView = (vendor) => {
    navigate(`/vendor/${vendor._id}`, { state: { vendor } });
  };

  // Filter vendors by status and search
  const filteredVendors = vendors.filter((vendor) => {
    // Filter by active tab
    if (activeTab === "active" && !vendor.isActive) return false;
    if (activeTab === "suspended" && vendor.isActive) return false;

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        vendor.vendorName?.toLowerCase().includes(searchLower) ||
        vendor.storeId?.toLowerCase().includes(searchLower) ||
        vendor.storeName?.toLowerCase().includes(searchLower) ||
        vendor.contactNumber?.toLowerCase().includes(searchLower) ||
        vendor.storeAddress?.city?.toLowerCase().includes(searchLower) ||
        vendor.storeAddress?.pinCode?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr
          key={i}
          className="border-b border-gray-200 animate-pulse bg-white rounded-sm"
        >
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="p-3">
              <div className="h-4 bg-gray-200 rounded w-[80%]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Empty State
  const EmptyState = () => (
    <tbody>
      <tr>
        <td
          colSpan="8"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No vendors found.
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 max-w-[99%] mx-auto mt-0 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full">
          {/* Tabs */}
          <div className="flex gap-4 items-center overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {["all", "active", "suspended"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                }}
                className={`px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#FF7B1D] text-white border-orange-500"
                    : "border-gray-400 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab === "all"
                  ? "All Vendor"
                  : tab === "active"
                  ? "Active"
                  : "Suspended"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px] mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search Vendor by Name, ID..."
              className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full">
              Search
            </button>
          </div>
        </div>

        {/* Add Vendor Button */}
        <div className="w-full md:w-auto flex justify-start md:justify-end mt-2 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white w-52 sm:w-60 px-4 sm:px-5 py-2 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
          >
            + Add Vendor
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Vendor ID</th>
              <th className="p-3 text-left">Authorized Name</th>
              <th className="p-3 text-left">Store Name</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Pin Code</th>
              <th className="p-3 text-left">Contact Number</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredVendors.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {filteredVendors.map((vendor, idx) => (
                <tr
                  key={vendor._id}
                  className="bg-white shadow-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{vendor.storeId || "N/A"}</td>
                  <td className="p-3">{vendor.vendorName || "N/A"}</td>
                  <td className="p-3">{vendor.storeName || "N/A"}</td>
                  <td className="p-3">{vendor.storeAddress?.city || "N/A"}</td>
                  <td className="p-3">
                    {vendor.storeAddress?.pinCode || "N/A"}
                  </td>
                  <td className="p-3">{vendor.contactNumber || "N/A"}</td>
                  <td className={`p-3 ${statusColors[vendor.isActive]}`}>
                    {vendor.isActive ? "Active" : "Suspended"}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-3 text-orange-600">
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="hover:text-blue-700"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor._id)}
                        className="hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleView(vendor)}
                        className="hover:text-green-700"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/vendors/${vendor._id}/settings`)
                        }
                        className="hover:text-blue-700"
                        title="Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredVendors.length > 0 && pagination.pages > 1 && (
        <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-black font-medium">
            {(() => {
              const pages = [];
              const totalPages = pagination.pages;
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
                    className={`px-1 ${
                      currentPage === page
                        ? "text-orange-600 font-semibold"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })()}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))
            }
            disabled={currentPage === pagination.pages}
            className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {!loading && filteredVendors.length > 0 && (
        <div className="text-center text-sm text-gray-600 mt-4">
          Showing {filteredVendors.length} of {pagination.total} vendors
        </div>
      )}

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refreshVendors(); // Refresh list after adding
        }}
      />

      {/* Edit Vendor Modal (with data pre-filled) */}
      <AddVendorModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVendor(null);
          refreshVendors(); // Refresh list after editing
        }}
        isEdit={true}
        vendorData={selectedVendor}
      />
    </DashboardLayout>
  );
};

export default AllVendor;
