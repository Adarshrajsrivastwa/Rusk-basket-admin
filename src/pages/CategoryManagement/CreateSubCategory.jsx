// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import { Eye, Edit, Trash2 } from "lucide-react";
// import AddSubCategoryModal from "../../components/AddSubCategoryModal ";
// import { useNavigate } from "react-router-dom";

// const CreateSubCategory = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const itemsPerPage = 7;

//   const [subCategories, setSubCategories] = useState([]);

//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => {
//       setSubCategories([
//         {
//           id: "SC101",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Smartphones",
//           products: "25",
//           category: "Electronics",
//           status: "Active",
//         },
//         {
//           id: "SC102",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Laptops",
//           products: "18",
//           category: "Electronics",
//           status: "Active",
//         },
//         {
//           id: "SC103",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Running Shoes",
//           products: "12",
//           category: "Footwear",
//           status: "Inactive",
//         },
//         {
//           id: "SC104",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Watches",
//           products: "16",
//           category: "Accessories",
//           status: "Active",
//         },
//         {
//           id: "SC105",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Shirts",
//           products: "10",
//           category: "Clothing",
//           status: "Active",
//         },
//         {
//           id: "SC106",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Sunglasses",
//           products: "8",
//           category: "Accessories",
//           status: "Inactive",
//         },
//         {
//           id: "SC107",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Headphones",
//           products: "22",
//           category: "Electronics",
//           status: "Active",
//         },
//         {
//           id: "SC108",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Sandals",
//           products: "13",
//           category: "Footwear",
//           status: "Active",
//         },
//         {
//           id: "SC109",
//           image: "https://i.pravatar.cc/50",
//           subCategory: "Jackets",
//           products: "9",
//           category: "Clothing",
//           status: "Active",
//         },
//       ]);
//       setLoading(false);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, []);

//   const statusColors = {
//     Active: "text-green-600 font-semibold",
//     Inactive: "text-gray-600 font-semibold",
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this Sub Category?")) {
//       setSubCategories((prev) => prev.filter((item) => item.id !== id));
//     }
//   };

//   const handleView = (id) => {
//     // Navigate to subcategory view page
//     navigate(`/category/subview/${id}`);
//   };

//   const handleEdit = (item) => {
//     // You can pass the selected item data to edit modal if needed
//     setIsEditModalOpen(true);
//     // In real app, you would set the selected item to edit
//   };

//   // Filter + Search
//   const filteredSubCategories = subCategories
//     .filter((cat) => {
//       if (activeTab === "active") return cat.status === "Active";
//       if (activeTab === "inactive") return cat.status === "Inactive";
//       return true;
//     })
//     .filter((cat) =>
//       [cat.subCategory, cat.category, cat.id, cat.products]
//         .join(" ")
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//     );

//   // Pagination
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentSubCategories = filteredSubCategories.slice(
//     indexOfFirst,
//     indexOfLast
//   );
//   const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

//   // Skeleton Loader
//   const TableSkeleton = () => (
//     <tbody>
//       {Array.from({ length: itemsPerPage }).map((_, idx) => (
//         <tr
//           key={idx}
//           className="animate-pulse border-b-4 border-gray-200 bg-white shadow-sm rounded-sm"
//         >
//           {Array.from({ length: 7 }).map((__, j) => (
//             <td key={j} className="p-3 text-center">
//               <div
//                 className={`bg-gray-300 rounded ${
//                   j === 1
//                     ? "h-8 w-8 rounded-full mx-auto"
//                     : "h-4 w-[80%] mx-auto"
//                 }`}
//               />
//             </td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   );

//   // Empty State
//   const EmptyState = () => (
//     <tbody>
//       <tr>
//         <td
//           colSpan="7"
//           className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
//         >
//           No sub categories found.
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
//             {["all", "active", "inactive"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab);
//                   setCurrentPage(1);
//                 }}
//                 className={`w-24 sm:w-28 px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap ${
//                   activeTab === tab
//                     ? "bg-[#FF7B1D] text-white border-orange-500"
//                     : "border-gray-400 text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Search */}
//           <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px] mt-2 sm:mt-0">
//             <input
//               type="text"
//               placeholder="Search Sub Category by Name, ID..."
//               className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full">
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Add Button */}
//         <div className="w-full md:w-auto flex justify-start md:justify-end mt-2 md:mt-0">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-black text-white w-52 sm:w-60 px-4 sm:px-5 py-2 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
//           >
//             + Add Sub Category
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-[#FF7B1D] text-black">
//               <th className="p-3 text-center">S.N</th>
//               <th className="p-3 text-center">Image</th>
//               <th className="p-3 text-center">Sub Category</th>
//               <th className="p-3 text-center">Products</th>
//               <th className="p-3 text-center">Category</th>
//               <th className="p-3 text-center">Status</th>
//               <th className="p-3 pr-6 text-right">Action</th>
//             </tr>
//           </thead>

//           {loading ? (
//             <TableSkeleton />
//           ) : filteredSubCategories.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <tbody>
//               {currentSubCategories.map((item, idx) => (
//                 <tr
//                   key={item.id}
//                   className="bg-white shadow-sm rounded-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
//                 >
//                   <td className="p-3 text-center">{indexOfFirst + idx + 1}</td>
//                   <td className="p-3 text-center">
//                     <img
//                       src={item.image}
//                       alt={item.subCategory}
//                       className="h-8 w-8 rounded-full object-cover mx-auto"
//                     />
//                   </td>
//                   <td className="p-3 text-center">{item.subCategory}</td>
//                   <td className="p-3 text-center">{item.products}</td>
//                   <td className="p-3 text-center">{item.category}</td>
//                   <td
//                     className={`p-3 text-center ${statusColors[item.status]}`}
//                   >
//                     {item.status}
//                   </td>
//                   <td className="p-3 text-right">
//                     <div className="flex justify-end items-center gap-2">
//                       <button
//                         onClick={() => handleEdit(item)}
//                         className="text-orange-600 hover:text-blue-700 transition"
//                         title="Edit Sub Category"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item.id)}
//                         className="text-orange-600 hover:text-red-600 transition"
//                         title="Delete Sub Category"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleView(item.id)}
//                         className="text-orange-600 hover:text-green-700 transition"
//                         title="View Sub Category Details"
//                       >
//                         <Eye className="w-4 h-4" />
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
//       {!loading && filteredSubCategories.length > 0 && (
//         <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className={`px-10 py-3 text-sm font-medium transition ${
//               currentPage === 1
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-[#FF7B1D] text-white hover:bg-orange-600"
//             }`}
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
//                     className={`px-1 transition ${
//                       currentPage === page
//                         ? "text-orange-600 font-semibold"
//                         : "hover:text-orange-600"
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
//             disabled={currentPage === totalPages}
//             className={`px-10 py-3 text-sm font-medium transition ${
//               currentPage === totalPages
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-[#247606] text-white hover:bg-green-800"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Modals */}
//       <AddSubCategoryModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//       <AddSubCategoryModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         isEdit={true}
//       />
//     </DashboardLayout>
//   );
// };

// export default CreateSubCategory;
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2 } from "lucide-react";
import AddSubCategoryModal from "../../components/AddSubCategoryModal ";
import { BASE_URL } from "../../api/api";
import { useNavigate } from "react-router-dom";

const CreateSubCategory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const itemsPerPage = 7;

  const [subCategories, setSubCategories] = useState([]);

  // Fetch subcategories from API
  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/subcategory`, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sub-categories");
      }

      const data = await response.json();
      console.log("Fetched sub-categories:", data);

      // Transform API data to match our table structure
      const transformedData = (data.data || []).map((item) => ({
        id: item._id,
        image: item.image?.url || "https://i.pravatar.cc/50",
        subCategory: item.name || "N/A",
        products: item.products?.length?.toString() || "0",
        category: item.category
          ? typeof item.category === "object"
            ? item.category.name
            : item.category
          : "N/A",
        status: item.isActive ? "Active" : "Inactive",
      }));

      setSubCategories(transformedData);
    } catch (err) {
      console.error("Error fetching sub-categories:", err);
      alert("Failed to load sub-categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSubCategories();

    // Set up interval to refresh data every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchSubCategories();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Add visibility change listener to refetch when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchSubCategories();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Listen for subcategory creation events from modal
  useEffect(() => {
    const handleSubCategoryCreated = () => {
      console.log("SubCategory created - refreshing list...");
      fetchSubCategories();
    };

    window.addEventListener("subcategoryCreated", handleSubCategoryCreated);

    return () => {
      window.removeEventListener(
        "subcategoryCreated",
        handleSubCategoryCreated
      );
    };
  }, []);

  const statusColors = {
    Active: "text-green-600 font-semibold",
    Inactive: "text-gray-600 font-semibold",
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Sub Category?")) {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${BASE_URL}/api/subcategory/${id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: headers,
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to delete sub-category");
        }

        // Remove from local state
        setSubCategories((prev) => prev.filter((item) => item.id !== id));
        alert("Sub-category deleted successfully!");

        // Trigger event to refresh category page counts
        window.dispatchEvent(new CustomEvent("subcategoryDeleted"));
      } catch (err) {
        console.error("Error deleting sub-category:", err);
        alert("Failed to delete sub-category. Please try again.");
      }
    }
  };

  const handleView = (id) => {
    navigate(`/category/subview/${id}`);
  };

  const handleEdit = async (item) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Fetch the full subcategory details
      const response = await fetch(
        `${BASE_URL}/api/subcategory/${item.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sub-category details");
      }

      const result = await response.json();

      // Store the selected subcategory data
      setSelectedSubCategory(result.data);
      // Open edit modal
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Error fetching sub-category details:", err);
      alert("Failed to load sub-category details. Please try again.");
    }
  };

  // Handle success callback from modal
  const handleAddSuccess = (newSubCategory) => {
    // Refresh the list after successful addition/edit
    fetchSubCategories();

    // Trigger event to refresh category page counts
    window.dispatchEvent(new CustomEvent("subcategoryCreated"));
  };

  // Filter + Search
  const filteredSubCategories = subCategories
    .filter((cat) => {
      if (activeTab === "active") return cat.status === "Active";
      if (activeTab === "inactive") return cat.status === "Inactive";
      return true;
    })
    .filter((cat) =>
      [cat.subCategory, cat.category, cat.id, cat.products]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSubCategories = filteredSubCategories.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr
          key={idx}
          className="animate-pulse border-b-4 border-gray-200 bg-white shadow-sm rounded-sm"
        >
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="p-3 text-center">
              <div
                className={`bg-gray-300 rounded ${
                  j === 1
                    ? "h-8 w-8 rounded-full mx-auto"
                    : "h-4 w-[80%] mx-auto"
                }`}
              />
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
          colSpan="7"
          className="text-center py-10 text-gray-500 text-sm bg-white rounded-sm"
        >
          No sub categories found.
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
            {["all", "active", "inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`w-24 sm:w-28 px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#FF7B1D] text-white border-orange-500"
                    : "border-gray-400 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center border border-black rounded overflow-hidden h-9 w-full max-w-full sm:max-w-[450px] mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search Sub Category by Name, ID..."
              className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full">
              Search
            </button>
          </div>
        </div>

        {/* Add Button & Refresh */}
        <div className="w-full md:w-auto flex justify-start md:justify-end gap-2 mt-2 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white w-52 sm:w-60 px-4 sm:px-5 py-2 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
          >
            + Add Sub Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-center">S.N</th>
              <th className="p-3 text-center">Image</th>
              <th className="p-3 text-center">Sub Category</th>
              <th className="p-3 text-center">Products</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredSubCategories.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {currentSubCategories.map((item, idx) => (
                <tr
                  key={item.id}
                  className="bg-white shadow-sm rounded-sm hover:bg-gray-50 transition border-b-4 border-gray-200"
                >
                  <td className="p-3 text-center">{indexOfFirst + idx + 1}</td>
                  <td className="p-3 text-center">
                    <img
                      src={item.image}
                      alt={item.subCategory}
                      className="h-8 w-8 rounded-full object-cover mx-auto"
                      onError={(e) => {
                        e.target.src = "https://i.pravatar.cc/50";
                      }}
                    />
                  </td>
                  <td className="p-3 text-center">{item.subCategory}</td>
                  <td className="p-3 text-center">{item.products}</td>
                  <td className="p-3 text-center">{item.category}</td>
                  <td
                    className={`p-3 text-center ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-orange-600 hover:text-blue-700 transition"
                        title="Edit Sub Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-orange-600 hover:text-red-600 transition"
                        title="Delete Sub Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleView(item.id)}
                        className="text-orange-600 hover:text-green-700 transition"
                        title="View Sub Category Details"
                      >
                        <Eye className="w-4 h-4" />
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
      {!loading && filteredSubCategories.length > 0 && (
        <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600"
            disabled={currentPage === 1}
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
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <AddSubCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
      <AddSubCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSubCategory(null);
        }}
        isEdit={true}
        subCategoryData={selectedSubCategory}
        onSuccess={handleAddSuccess}
      />
    </DashboardLayout>
  );
};

export default CreateSubCategory;
