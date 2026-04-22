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
  ChevronLeft,
  ChevronRight,
  Layers,
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

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

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
        setError(
          response.status === 401
            ? "Unauthorized. Please login again."
            : result.message || "Failed to fetch categories",
        );
        return;
      }

      if (result.success) {
        const transformed = result.data.map((cat) => ({
          id: cat._id,
          _id: cat._id,
          category: cat.name || "Unknown",
          name: cat.name || "Unknown",
          image: cat.image?.url || null,
          products: cat.productCount || 0,
          subCategoryCount: cat.subCategoryCount || 0,
          status: cat.isActive ? "Active" : "Inactive",
          isActive: cat.isActive,
          rawData: cat,
        }));
        setCategories(transformed);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError("Error connecting to server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleSubCategoryChange = () => {
      fetchCategories();
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

  const fetchSubCategories = async (categoryId, forceRefresh = false) => {
    if (subCategories[categoryId] && !forceRefresh) return;

    try {
      setLoadingSubCategories((prev) => ({ ...prev, [categoryId]: true }));
      const response = await fetch(
        `${API_BASE_URL}/subcategory/by-category/${categoryId}`,
        { method: "GET", credentials: "include", headers: getAuthHeaders() },
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

  const toggleCategory = async (categoryId) => {
    const isExpanding = !expandedCategories.has(categoryId);
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.has(categoryId)
        ? newSet.delete(categoryId)
        : newSet.add(categoryId);
      return newSet;
    });
    if (isExpanding) await fetchSubCategories(categoryId);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setIsEditCategoryModalOpen(true);
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

        if (!response.ok || !result.success) {
          alert(result.message || "Failed to delete category");
          return;
        }
        alert("Category deleted successfully!");
        fetchCategories();
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

  const handleEditSubCategory = (sub) => {
    setEditingSubCategory(sub);
    setIsEditSubCategoryModalOpen(true);
  };

  const handleDeleteSubCategory = async (subId, subName) => {
    if (
      window.confirm(
        `Are you sure you want to delete subcategory "${subName}"?`,
      )
    ) {
      try {
        const response = await fetch(`${API_BASE_URL}/subcategory/${subId}`, {
          method: "DELETE",
          credentials: "include",
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          alert(result.message || "Failed to delete subcategory");
          return;
        }
        alert("Subcategory deleted successfully!");
        fetchCategories();
        setSubCategories((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((catId) => {
            updated[catId] = updated[catId].filter((sub) => sub._id !== subId);
          });
          return updated;
        });
        window.dispatchEvent(new CustomEvent("subcategoryDeleted"));
      } catch (err) {
        alert("Error deleting subcategory: " + err.message);
      }
    }
  };

  const handleSubCategorySuccess = () => {
    fetchCategories();
    expandedCategories.forEach((categoryId) =>
      fetchSubCategories(categoryId, true),
    );
    setIsEditSubCategoryModalOpen(false);
    setEditingSubCategory(null);
    window.dispatchEvent(new CustomEvent("subcategoryCreated"));
  };

  // Filter + Search
  const filteredCategories = categories
    .filter((cat) => {
      if (activeTab === "active") return cat.status === "Active";
      if (activeTab === "inactive") return cat.status === "Inactive";
      return true;
    })
    .filter((cat) =>
      [cat.category, cat.id, cat.rawData?.description]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // ── Sub-components ──

  const StatusBadge = ({ status }) => {
    const isActive = status === "Active";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isActive
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100"
            : "bg-gray-50 text-gray-500 border border-gray-200 ring-1 ring-gray-100"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? "bg-emerald-500" : "bg-gray-400"
          }`}
        />
        {status}
      </span>
    );
  };

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className={`h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse ${
                  j === 2
                    ? "w-8 h-8 rounded-full mx-auto"
                    : j === 6
                      ? "w-16 ml-auto"
                      : "w-[70%]"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="7" className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Layers className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No categories found
            </p>
            <p className="text-gray-300 text-xs">
              Try adjusting your filters or search query
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="px-6 py-3 bg-[#FF7B1D] text-white rounded-xl hover:bg-orange-500 transition font-semibold"
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
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          transition: all 0.18s ease;
        }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full max-w-full mx-auto px-1 mt-3 mb-3">
        {/* LEFT: Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-white text-[#FF7B1D] shadow-sm shadow-orange-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Search */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[380px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search category by name, ID..."
            className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-sm font-medium px-5 h-full transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="mx-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Card Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-700">
              All Category 
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredCategories.length} of {categories.length} categories
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "5%" }} /> {/* expand */}
              <col style={{ width: "8%" }} /> {/* S.N */}
              <col style={{ width: "10%" }} /> {/* Image */}
              <col style={{ width: "27%" }} /> {/* Category */}
              <col style={{ width: "20%" }} /> {/* Total Subcategories */}
              <col style={{ width: "15%" }} /> {/* Status */}
              <col style={{ width: "15%" }} /> {/* Actions */}
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  {/* expand */}
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  S.N
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Image
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Category
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Total Subcategories
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Status
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Actions
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredCategories.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {currentCategories.map((cat, idx) => (
                  <React.Fragment key={cat.id}>
                    {/* ── Main Category Row ── */}
                    <tr
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* Expand Toggle */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          className="action-btn bg-orange-50 text-orange-400 hover:bg-orange-100 hover:text-orange-600"
                          title="Expand/Collapse Subcategories"
                        >
                          {loadingSubCategories[cat.id] ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : expandedCategories.has(cat.id) ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>

                      {/* S.N */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {indexOfFirst + idx + 1}
                        </span>
                      </td>

                      {/* Image */}
                      <td className="px-4 py-3.5 text-center">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.category}
                            className="h-9 w-9 rounded-full object-cover border-2 border-orange-100 shadow-sm mx-auto"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-xs font-bold text-orange-600 shadow-sm mx-auto">
                            {cat.category.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>

                      {/* Category Name */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-semibold text-gray-800">
                          {cat.category}
                        </span>
                      </td>

                      {/* Subcategory Count */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                          {cat.subCategoryCount} subcategories
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <StatusBadge status={cat.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditCategory(cat)}
                            className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                            title="Edit Category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/category/view/${cat.id}`)}
                            className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                            title="View Category Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* ── Subcategory Rows ── */}
                    {expandedCategories.has(cat.id) &&
                      subCategories[cat.id] &&
                      subCategories[cat.id].map((sub, subIdx) => (
                        <tr
                          key={sub._id}
                          className="row-animate border-b border-blue-50 bg-blue-50/40 hover:bg-blue-50/70 transition-colors duration-150 group"
                          style={{ animationDelay: `${subIdx * 20}ms` }}
                        >
                          <td className="px-4 py-3" />

                          {/* Sub S.N */}
                          <td className="px-4 py-3 text-center">
                            <span className="text-xs text-gray-400 font-medium">
                              {indexOfFirst + idx + 1}.{subIdx + 1}
                            </span>
                          </td>

                          {/* Sub Image */}
                          <td className="px-4 py-3 text-center">
                            {sub.image?.url ? (
                              <img
                                src={sub.image.url}
                                alt={sub.name}
                                className="h-7 w-7 rounded-full object-cover border-2 border-blue-100 shadow-sm mx-auto"
                              />
                            ) : (
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm mx-auto">
                                SC
                              </div>
                            )}
                          </td>

                          {/* Sub Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-blue-300 text-xs">↳</span>
                              <span className="text-sm text-gray-600 font-medium">
                                {sub.name}
                              </span>
                            </div>
                          </td>

                          {/* Placeholder */}
                          <td className="px-4 py-3 text-center">
                            <span className="text-xs text-gray-300">—</span>
                          </td>

                          {/* Sub Status */}
                          <td className="px-4 py-3 text-center">
                            <StatusBadge
                              status={sub.isActive ? "Active" : "Inactive"}
                            />
                          </td>

                          {/* Sub Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleEditSubCategory(sub)}
                                className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                                title="Edit Subcategory"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSubCategory(sub._id, sub.name)
                                }
                                className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                                title="Delete Subcategory"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/category/subview/${sub._id}`)
                                }
                                className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                                title="View Subcategory"
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
      </div>

      {/* ── Pagination ── */}
      {!loading && filteredCategories.length > 0 && (
        <div className="flex items-center justify-between px-1 mt-5 mb-6">
          <p className="text-xs text-gray-400 font-medium">
            Page{" "}
            <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
            of <span className="text-gray-600 font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <div className="flex items-center gap-1">
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
                    <span key={idx} className="px-1 text-gray-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === page
                          ? "bg-[#FF7B1D] text-white shadow-sm shadow-orange-200"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200"
                      }`}
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <AddCategoryModal
        key={editingCategory?.id || "cat-edit"}
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
        key={editingSubCategory?._id || "subcat-edit"}
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
