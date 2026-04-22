import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Eye,
  Edit,
  Trash2,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddCategoryModal from "../../components/AddCategoryModal";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";

const API_GET_ALL = `${BASE_URL}/api/category`;
const API_DELETE = `${BASE_URL}/api/category`;

const CreateCategory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 7;

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(API_GET_ALL, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Failed to fetch categories");

      const transformedCategories = data.data.map((cat) => ({
        id: cat._id,
        image: cat.image?.url || null,
        category: cat.name || "Unknown",
        products: cat.productCount || "0",
        subCategory: cat.subCategoryCount || "0",
        status: cat.isActive ? "Active" : "Inactive",
        rawData: cat,
      }));

      setCategories(transformedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const refreshInterval = setInterval(() => fetchCategories(), 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchCategories();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleSubCategoryCreated = () => fetchCategories();
    const handleSubCategoryDeleted = () => fetchCategories();
    window.addEventListener("subcategoryCreated", handleSubCategoryCreated);
    window.addEventListener("subcategoryDeleted", handleSubCategoryDeleted);
    return () => {
      window.removeEventListener(
        "subcategoryCreated",
        handleSubCategoryCreated,
      );
      window.removeEventListener(
        "subcategoryDeleted",
        handleSubCategoryDeleted,
      );
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_DELETE}/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers,
        });

        const data = await response.json();
        if (!response.ok || !data.success)
          throw new Error(data.message || "Failed to delete category");

        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        alert("Category deleted successfully!");
      } catch (err) {
        alert(err.message || "Failed to delete category. Please try again.");
      }
    }
  };

  const handleViewCategory = (categoryId) =>
    navigate(`/category/view/${categoryId}`);

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCategorySuccess = () => {
    fetchCategories();
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditingCategory(null);
  };

  // Filter + Search
  const filteredCategories = categories
    .filter((cat) => {
      if (activeTab === "active") return cat.status === "Active";
      if (activeTab === "inactive") return cat.status === "Inactive";
      return true;
    })
    .filter((cat) =>
      [cat.category, cat.id, cat.products, cat.subCategory]
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
          className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}
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
                  j === 1
                    ? "w-8 h-8 rounded-full mx-auto"
                    : j === 6
                      ? "w-16 ml-auto"
                      : "w-[70%] mx-auto"
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
          {error ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <Layers className="w-8 h-8 text-red-300" />
              </div>
              <p className="text-red-500 text-sm font-medium">Error: {error}</p>
              <button
                onClick={fetchCategories}
                className="px-5 py-2 bg-[#FF7B1D] text-white rounded-xl text-xs font-semibold hover:bg-orange-500 transition"
              >
                Retry
              </button>
            </div>
          ) : (
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
          )}
        </td>
      </tr>
    </tbody>
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

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

        {/* RIGHT: Search + Add Button */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] flex-1 lg:w-[320px] shadow-sm bg-white">
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black hover:bg-[#FF7B1D] text-white text-xs font-semibold px-5 h-[38px] rounded-xl shadow-sm transition-colors whitespace-nowrap"
          >
            + Add Category
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
              Category List
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
              <col style={{ width: "8%" }} /> {/* S.N */}
              <col style={{ width: "12%" }} /> {/* Image */}
              <col style={{ width: "25%" }} /> {/* Category */}
              <col style={{ width: "15%" }} /> {/* Products */}
              <col style={{ width: "18%" }} /> {/* Sub Categories */}
              <col style={{ width: "12%" }} /> {/* Status */}
              <col style={{ width: "10%" }} /> {/* Actions */}
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
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
                  Products
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Sub Categories
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
                  <tr
                    key={cat.id}
                    className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors duration-150 group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
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

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {cat.category}
                      </span>
                    </td>

                    {/* Products */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-block bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-100">
                        {cat.products}
                      </span>
                    </td>

                    {/* Sub Categories */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                        {cat.subCategory} subcategories
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
                          onClick={() => handleDelete(cat.id)}
                          className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleViewCategory(cat.id)}
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View Category Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCategorySuccess}
      />
      <AddCategoryModal
        key={editingCategory?.id || "cat-edit"}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={handleCategorySuccess}
        isEdit={true}
        categoryData={editingCategory}
      />
    </DashboardLayout>
  );
};

export default CreateCategory;
