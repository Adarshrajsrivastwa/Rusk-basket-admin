// import React, { useState, useEffect } from "react";
// import DashboardLayout from "../../components/DashboardLayout";
// import {
//   Eye,
//   Edit,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";


// const AllCategory = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedCategories, setExpandedCategories] = useState(new Set());
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState({});
//   const [loadingSubCategories, setLoadingSubCategories] = useState({});
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const itemsPerPage = 7;

//   // Get authorization headers
//   const getAuthHeaders = () => {
//     const token =
//       localStorage.getItem("token") || localStorage.getItem("authToken");
//     const headers = {
//       "Content-Type": "application/json",
//     };
//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }
//     return headers;
//   };

//   // Fetch all categories
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(`${API_BASE_URL}/category`, {
//         method: "GET",
//         credentials: "include",
//         headers: getAuthHeaders(),
//       });
//       const result = await response.json();

//       if (!response.ok) {
//         if (response.status === 401) {
//           setError("Unauthorized. Please login again.");
//         } else {
//           setError(result.message || "Failed to fetch categories");
//         }
//         return;
//       }

//       if (result.success) {
//         setCategories(result.data);
//       } else {
//         setError("Failed to fetch categories");
//       }
//     } catch (err) {
//       setError("Error connecting to server: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch subcategories for a specific category
//   const fetchSubCategories = async (categoryId) => {
//     if (subCategories[categoryId]) {
//       // Already fetched, just toggle
//       return;
//     }

//     try {
//       setLoadingSubCategories((prev) => ({ ...prev, [categoryId]: true }));
//       const response = await fetch(
//         `${API_BASE_URL}/subcategory/by-category/${categoryId}`,
//         {
//           method: "GET",
//           credentials: "include",
//           headers: getAuthHeaders(),
//         }
//       );
//       const result = await response.json();

//       if (!response.ok) {
//         console.error("Failed to fetch subcategories:", result.message);
//         return;
//       }

//       if (result.success) {
//         setSubCategories((prev) => ({
//           ...prev,
//           [categoryId]: result.data || [],
//         }));
//       }
//     } catch (err) {
//       console.error("Error fetching subcategories:", err.message);
//     } finally {
//       setLoadingSubCategories((prev) => ({ ...prev, [categoryId]: false }));
//     }
//   };

//   const statusColors = {
//     true: "text-green-600 font-semibold",
//     false: "text-gray-600 font-semibold",
//   };

//   const toggleCategory = async (categoryId) => {
//     const isExpanding = !expandedCategories.has(categoryId);

//     setExpandedCategories((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(categoryId)) {
//         newSet.delete(categoryId);
//       } else {
//         newSet.add(categoryId);
//       }
//       return newSet;
//     });

//     // Fetch subcategories if expanding and not already loaded
//     if (isExpanding) {
//       await fetchSubCategories(categoryId);
//     }
//   };

//   const handleDeleteCategory = async (id) => {
//     if (window.confirm("Are you sure you want to delete this category?")) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/category/${id}`, {
//           method: "DELETE",
//           credentials: "include",
//           headers: getAuthHeaders(),
//         });
//         const result = await response.json();

//         if (!response.ok) {
//           alert(result.message || "Failed to delete category");
//           return;
//         }

//         if (result.success) {
//           alert("Category deleted successfully!");
//           fetchCategories(); // Refresh the list
//         } else {
//           alert(result.message || "Failed to delete category");
//         }
//       } catch (err) {
//         alert("Error deleting category: " + err.message);
//       }
//     }
//   };

//   // Filter + Search
//   const filteredCategories = categories
//     .filter((cat) => {
//       if (activeTab === "active") return cat.isActive === true;
//       if (activeTab === "inactive") return cat.isActive === false;
//       return true;
//     })
//     .filter((cat) =>
//       [cat.name, cat._id, cat.description]
//         .join(" ")
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//     );

//   // Pagination
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

//   // Skeleton Loader
//   const TableSkeleton = () => (
//     <tbody>
//       {Array.from({ length: itemsPerPage }).map((_, idx) => (
//         <tr
//           key={idx}
//           className="animate-pulse border-b-4 border-gray-200 bg-white shadow-sm"
//         >
//           {Array.from({ length: 7 }).map((__, j) => (
//             <td key={j} className="p-3 text-center">
//               <div
//                 className={`bg-gray-300 rounded ${
//                   j === 2
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
//           className="text-center py-10 text-gray-500 text-sm bg-white"
//         >
//           No categories found.
//         </td>
//       </tr>
//     </tbody>
//   );

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center bg-white rounded-lg shadow-lg p-8">
//             <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
//             <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
//             <button
//               onClick={fetchCategories}
//               className="px-6 py-3 bg-[#FF7B1D] text-white rounded-lg hover:bg-[#FF9B4D] transition"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

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
//                 className={`w-24 sm:w-28 px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap transition-colors ${
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
//               placeholder="Search Category by Name, ID..."
//               className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full">
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-[#FF7B1D] text-black">
//               <th className="p-3 text-center w-12"></th>
//               <th className="p-3 text-center">S.N</th>
//               <th className="p-3 text-center">Image</th>
//               <th className="p-3 text-center">Category</th>
//               <th className="p-3 text-center">Total Subcategories</th>
//               <th className="p-3 text-center">Status</th>
//               <th className="p-3 pr-6 text-right">Action</th>
//             </tr>
//           </thead>

//           {loading ? (
//             <TableSkeleton />
//           ) : filteredCategories.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <tbody>
//               {currentCategories.map((cat, idx) => (
//                 <React.Fragment key={cat._id}>
//                   {/* Main Category Row */}
//                   <tr className="bg-white shadow-sm hover:bg-gray-50 transition border-b-2 border-gray-200">
//                     <td className="p-3 text-center">
//                       <button
//                         onClick={() => toggleCategory(cat._id)}
//                         className="text-orange-600 hover:text-orange-800"
//                         title="Expand/Collapse Subcategories"
//                       >
//                         {loadingSubCategories[cat._id] ? (
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                         ) : expandedCategories.has(cat._id) ? (
//                           <ChevronUp className="w-4 h-4" />
//                         ) : (
//                           <ChevronDown className="w-4 h-4" />
//                         )}
//                       </button>
//                     </td>
//                     <td className="p-3 text-center">
//                       {indexOfFirst + idx + 1}
//                     </td>
//                     <td className="p-3 text-center">
//                       {cat.image?.url ? (
//                         <img
//                           src={cat.image.url}
//                           alt={cat.name}
//                           className="h-8 w-8 rounded-full object-cover mx-auto"
//                         />
//                       ) : (
//                         <div className="h-8 w-8 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-xs font-semibold text-gray-500">
//                           {cat.name.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-3 text-center font-semibold">
//                       {cat.name}
//                     </td>
//                     <td className="p-3 text-center">
//                       {cat.subCategoryCount || 0}
//                     </td>
//                     <td
//                       className={`p-3 text-center ${
//                         statusColors[cat.isActive]
//                       }`}
//                     >
//                       {cat.isActive ? "Active" : "Inactive"}
//                     </td>
//                     <td className="p-3 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           onClick={() => navigate(`/category/edit/${cat._id}`)}
//                           className="text-orange-600 hover:text-blue-700"
//                           title="Edit Category"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteCategory(cat._id)}
//                           className="text-orange-600 hover:text-red-600"
//                           title="Delete Category"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() =>
//                             navigate(`/category/view-all/${cat._id}`)
//                           }
//                           className="text-orange-600 hover:text-green-700"
//                           title="View Category Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>

//                   {/* Subcategories Rows (Expandable) */}
//                   {expandedCategories.has(cat._id) &&
//                     subCategories[cat._id] &&
//                     subCategories[cat._id].map((sub, subIdx) => (
//                       <tr
//                         key={sub._id}
//                         className="bg-blue-50 hover:bg-blue-100 transition border-b border-gray-100"
//                       >
//                         <td className="p-3"></td>
//                         <td className="p-3 text-center text-xs text-gray-500">
//                           {indexOfFirst + idx + 1}.{subIdx + 1}
//                         </td>
//                         <td className="p-3 text-center">
//                           {sub.image?.url ? (
//                             <img
//                               src={sub.image.url}
//                               alt={sub.name}
//                               className="h-6 w-6 rounded-full object-cover mx-auto"
//                             />
//                           ) : (
//                             <div className="h-6 w-6 rounded-full bg-blue-200 mx-auto flex items-center justify-center text-xs font-semibold text-blue-700">
//                               SC
//                             </div>
//                           )}
//                         </td>
//                         <td className="p-3 text-center text-sm pl-8 text-left">
//                           <span className="text-gray-600">↳</span> {sub.name}
//                         </td>
//                         <td className="p-3 text-center text-sm">-</td>
//                         <td
//                           className={`p-3 text-center text-sm ${
//                             statusColors[sub.isActive]
//                           }`}
//                         >
//                           {sub.isActive ? "Active" : "Inactive"}
//                         </td>
//                         <td className="p-3 text-right">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() =>
//                                 navigate(`/subcategory/edit/${sub._id}`)
//                               }
//                               className="text-blue-600 hover:text-blue-800"
//                               title="Edit Subcategory"
//                             >
//                               <Edit className="w-3 h-3" />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 navigate(`/subcategory/view/${sub._id}`)
//                               }
//                               className="text-blue-600 hover:text-green-700"
//                               title="View Subcategory Details"
//                             >
//                               <Eye className="w-3 h-3" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           )}
//         </table>
//       </div>

//       {/* Pagination */}
//       {!loading && filteredCategories.length > 0 && (
//         <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
//             disabled={currentPage === totalPages}
//             className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// };

// export default AllCategory;
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddCategoryModal from "../../components/AddCategoryModal";
import AddSubCategoryModal from "../../components/AddSubCategoryModal ";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api`;

const AllCategory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [loadingSubCategories, setLoadingSubCategories] = useState({});
  const [error, setError] = useState(null);

  // Modal states
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isEditSubCategoryModalOpen, setIsEditSubCategoryModalOpen] =
    useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 7;

  // Get authorization headers
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Listen for subcategory creation/deletion events
  useEffect(() => {
    const handleSubCategoryChange = () => {
      console.log("SubCategory changed - refreshing categories...");
      fetchCategories();
      // Refresh expanded subcategories
      expandedCategories.forEach((categoryId) => {
        fetchSubCategories(categoryId, true);
      });
    };

    window.addEventListener("subcategoryCreated", handleSubCategoryChange);
    window.addEventListener("subcategoryDeleted", handleSubCategoryChange);

    return () => {
      window.removeEventListener("subcategoryCreated", handleSubCategoryChange);
      window.removeEventListener("subcategoryDeleted", handleSubCategoryChange);
    };
  }, [expandedCategories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/category`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError(result.message || "Failed to fetch categories");
        }
        return;
      }

      if (result.success) {
        setCategories(result.data);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError("Error connecting to server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubCategories = async (categoryId, forceRefresh = false) => {
    if (subCategories[categoryId] && !forceRefresh) {
      // Already fetched, just toggle
      return;
    }

    try {
      setLoadingSubCategories((prev) => ({ ...prev, [categoryId]: true }));
      const response = await fetch(
        `${API_BASE_URL}/subcategory/by-category/${categoryId}`,
        {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch subcategories:", result.message);
        return;
      }

      if (result.success) {
        setSubCategories((prev) => ({
          ...prev,
          [categoryId]: result.data || [],
        }));
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err.message);
    } finally {
      setLoadingSubCategories((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const statusColors = {
    true: "text-green-600 font-semibold",
    false: "text-gray-600 font-semibold",
  };

  const toggleCategory = async (categoryId) => {
    const isExpanding = !expandedCategories.has(categoryId);

    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });

    // Fetch subcategories if expanding and not already loaded
    if (isExpanding) {
      await fetchSubCategories(categoryId);
    }
  };

  // Category handlers
  const handleEditCategory = async (cat) => {
    try {
      const response = await fetch(`${API_BASE_URL}/category/${cat._id}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch category details");
      }

      if (result.success) {
        // Transform to match AddCategoryModal expected format
        const categoryData = {
          id: result.data._id,
          category: result.data.name,
          image: result.data.image?.url || null,
          status: result.data.isActive ? "Active" : "Inactive",
          rawData: result.data,
        };
        setEditingCategory(categoryData);
        setIsEditCategoryModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching category details:", err);
      alert("Failed to load category details. Please try again.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/category/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (!response.ok) {
          alert(result.message || "Failed to delete category");
          return;
        }

        if (result.success) {
          alert("Category deleted successfully!");
          fetchCategories();
        } else {
          alert(result.message || "Failed to delete category");
        }
      } catch (err) {
        alert("Error deleting category: " + err.message);
      }
    }
  };

  const handleCategorySuccess = () => {
    fetchCategories();
    setIsEditCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // SubCategory handlers
  const handleEditSubCategory = async (sub) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategory/${sub._id}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch sub-category details");
      }

      if (result.success) {
        setEditingSubCategory(result.data);
        setIsEditSubCategoryModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching sub-category details:", err);
      alert("Failed to load sub-category details. Please try again.");
    }
  };

  const handleDeleteSubCategory = async (subId, subName) => {
    if (
      window.confirm(
        `Are you sure you want to delete subcategory "${subName}"?`
      )
    ) {
      try {
        const response = await fetch(`${API_BASE_URL}/subcategory/${subId}`, {
          method: "DELETE",
          credentials: "include",
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (!response.ok) {
          alert(result.message || "Failed to delete subcategory");
          return;
        }

        if (result.success) {
          alert("Subcategory deleted successfully!");

          // Refresh categories to update counts
          fetchCategories();

          // Clear the subcategories cache for affected category
          setSubCategories((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((catId) => {
              updated[catId] = updated[catId].filter(
                (sub) => sub._id !== subId
              );
            });
            return updated;
          });

          // Trigger event to refresh other pages
          window.dispatchEvent(new CustomEvent("subcategoryDeleted"));
        } else {
          alert(result.message || "Failed to delete subcategory");
        }
      } catch (err) {
        alert("Error deleting subcategory: " + err.message);
      }
    }
  };

  const handleSubCategorySuccess = () => {
    fetchCategories();

    // Refresh expanded subcategories
    expandedCategories.forEach((categoryId) => {
      fetchSubCategories(categoryId, true);
    });

    setIsEditSubCategoryModalOpen(false);
    setEditingSubCategory(null);

    // Trigger event to refresh other pages
    window.dispatchEvent(new CustomEvent("subcategoryCreated"));
  };

  // Filter + Search
  const filteredCategories = categories
    .filter((cat) => {
      if (activeTab === "active") return cat.isActive === true;
      if (activeTab === "inactive") return cat.isActive === false;
      return true;
    })
    .filter((cat) =>
      [cat.name, cat._id, cat.description]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr
          key={idx}
          className="animate-pulse border-b-4 border-gray-200 bg-white shadow-sm"
        >
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="p-3 text-center">
              <div
                className={`bg-gray-300 rounded ${
                  j === 2
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
          className="text-center py-10 text-gray-500 text-sm bg-white"
        >
          No categories found.
        </td>
      </tr>
    </tbody>
  );

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-white rounded-lg shadow-lg p-8">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="px-6 py-3 bg-[#FF7B1D] text-white rounded-lg hover:bg-[#FF9B4D] transition"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                className={`w-24 sm:w-28 px-4 py-1 border rounded text-xs sm:text-sm whitespace-nowrap transition-colors ${
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
              placeholder="Search Category by Name, ID..."
              className="flex-1 px-3 sm:px-4 text-sm text-gray-800 focus:outline-none h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white text-sm px-3 sm:px-6 h-full">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-x-auto pl-4 max-w-[99%] mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-black">
              <th className="p-3 text-center w-12"></th>
              <th className="p-3 text-center">S.N</th>
              <th className="p-3 text-center">Image</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Total Subcategories</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton />
          ) : filteredCategories.length === 0 ? (
            <EmptyState />
          ) : (
            <tbody>
              {currentCategories.map((cat, idx) => (
                <React.Fragment key={cat._id}>
                  {/* Main Category Row */}
                  <tr className="bg-white shadow-sm hover:bg-gray-50 transition border-b-2 border-gray-200">
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleCategory(cat._id)}
                        className="text-orange-600 hover:text-orange-800"
                        title="Expand/Collapse Subcategories"
                      >
                        {loadingSubCategories[cat._id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : expandedCategories.has(cat._id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      {indexOfFirst + idx + 1}
                    </td>
                    <td className="p-3 text-center">
                      {cat.image?.url ? (
                        <img
                          src={cat.image.url}
                          alt={cat.name}
                          className="h-8 w-8 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-xs font-semibold text-gray-500">
                          {cat.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center font-semibold">
                      {cat.name}
                    </td>
                    <td className="p-3 text-center">
                      {cat.subCategoryCount || 0}
                    </td>
                    <td
                      className={`p-3 text-center ${
                        statusColors[cat.isActive]
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="text-orange-600 hover:text-blue-700"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="text-orange-600 hover:text-red-600"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/category/view/${cat._id}`)}
                          className="text-orange-600 hover:text-green-700"
                          title="View Category Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Subcategories Rows (Expandable) */}
                  {expandedCategories.has(cat._id) &&
                    subCategories[cat._id] &&
                    subCategories[cat._id].map((sub, subIdx) => (
                      <tr
                        key={sub._id}
                        className="bg-blue-50 hover:bg-blue-100 transition border-b border-gray-100"
                      >
                        <td className="p-3"></td>
                        <td className="p-3 text-center text-xs text-gray-500">
                          {indexOfFirst + idx + 1}.{subIdx + 1}
                        </td>
                        <td className="p-3 text-center">
                          {sub.image?.url ? (
                            <img
                              src={sub.image.url}
                              alt={sub.name}
                              className="h-6 w-6 rounded-full object-cover mx-auto"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-blue-200 mx-auto flex items-center justify-center text-xs font-semibold text-blue-700">
                              SC
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center text-sm pl-8 text-left">
                          <span className="text-gray-600">↳</span> {sub.name}
                        </td>
                        <td className="p-3 text-center text-sm">-</td>
                        <td
                          className={`p-3 text-center text-sm ${
                            statusColors[sub.isActive]
                          }`}
                        >
                          {sub.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditSubCategory(sub)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Subcategory"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSubCategory(sub._id, sub.name)
                              }
                              className="text-blue-600 hover:text-red-600"
                              title="Delete Subcategory"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/category/subview/${sub._id}`)
                              }
                              className="text-blue-600 hover:text-green-700"
                              title="View Subcategory Details"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredCategories.length > 0 && (
        <div className="flex justify-end items-center gap-6 mt-8 max-w-[95%] mx-auto">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={currentPage === totalPages}
            className="bg-[#247606] text-white px-10 py-3 text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <AddCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => {
          setIsEditCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={handleCategorySuccess}
        isEdit={true}
        categoryData={editingCategory}
      />
      <AddSubCategoryModal
        isOpen={isEditSubCategoryModalOpen}
        onClose={() => {
          setIsEditSubCategoryModalOpen(false);
          setEditingSubCategory(null);
        }}
        isEdit={true}
        subCategoryData={editingSubCategory}
        onSuccess={handleSubCategorySuccess}
      />
    </DashboardLayout>
  );
};

export default AllCategory;
