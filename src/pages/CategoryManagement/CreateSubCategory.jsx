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
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const itemsPerPage = 7;

  const [subCategories, setSubCategories] = useState([]);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}/api/subcategory`, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch sub-categories");

      const data = await response.json();

      const transformedData = (data.data || []).map((item) => ({
        id: item._id,
        image: item.image?.url || null,
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

  useEffect(() => {
    fetchSubCategories();
    const refreshInterval = setInterval(() => fetchSubCategories(), 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchSubCategories();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleSubCategoryCreated = () => fetchSubCategories();
    window.addEventListener("subcategoryCreated", handleSubCategoryCreated);
    return () =>
      window.removeEventListener(
        "subcategoryCreated",
        handleSubCategoryCreated,
      );
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Sub Category?")) {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${BASE_URL}/api/subcategory/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers,
        });

        const result = await response.json();
        if (!response.ok || !result.success)
          throw new Error(result.message || "Failed to delete sub-category");

        setSubCategories((prev) => prev.filter((item) => item.id !== id));
        alert("Sub-category deleted successfully!");
        window.dispatchEvent(new CustomEvent("subcategoryDeleted"));
      } catch (err) {
        alert("Failed to delete sub-category. Please try again.");
      }
    }
  };

  const handleView = (id) => navigate(`/category/subview/${id}`);

  const handleEdit = async (item) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}/api/subcategory/${item.id}`, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch sub-category details");

      const result = await response.json();
      setSelectedSubCategory(result.data);
      setIsEditModalOpen(true);
    } catch (err) {
      alert("Failed to load sub-category details. Please try again.");
    }
  };

  const handleAddSuccess = () => {
    fetchSubCategories();
    window.dispatchEvent(new CustomEvent("subcategoryCreated"));
  };

  // Filter + Search
  const uniqueCategories = [
    ...new Set(
      subCategories.map((s) => s.category).filter((c) => c && c !== "N/A"),
    ),
  ];

  const filteredSubCategories = subCategories
    .filter((cat) => {
      if (activeTab === "active") return cat.status === "Active";
      if (activeTab === "inactive") return cat.status === "Inactive";
      return true;
    })
    .filter((cat) =>
      selectedCategory === "All Categories"
        ? true
        : cat.category === selectedCategory,
    )
    .filter((cat) =>
      [cat.subCategory, cat.category, cat.id, cat.products]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSubCategories = filteredSubCategories.slice(
    indexOfFirst,
    indexOfLast,
  );
  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

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
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Layers className="w-8 h-8 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No sub categories found
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
        {/* LEFT: Tabs + Category Filter */}
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

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-xl text-xs font-semibold px-3 h-[38px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white shadow-sm cursor-pointer"
          >
            <option value="All Categories">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* RIGHT: Search + Add Button */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] flex-1 lg:w-[320px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search sub category by name, ID..."
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
            + Add Sub Category
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
              Sub Category Inventory
            </span>
          </div>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {filteredSubCategories.length} of {subCategories.length} sub
              categories
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "8%" }} /> {/* S.N */}
              <col style={{ width: "10%" }} /> {/* Image */}
              <col style={{ width: "22%" }} /> {/* Sub Category */}
              <col style={{ width: "13%" }} /> {/* Products */}
              <col style={{ width: "22%" }} /> {/* Category */}
              <col style={{ width: "13%" }} /> {/* Status */}
              <col style={{ width: "12%" }} /> {/* Actions */}
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
                  Sub Category
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Products
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-white tracking-wider uppercase opacity-90">
                  Category
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
            ) : filteredSubCategories.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {currentSubCategories.map((item, idx) => (
                  <tr
                    key={item.id}
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
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.subCategory}
                          className="h-9 w-9 rounded-full object-cover border-2 border-orange-100 shadow-sm mx-auto"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling &&
                              (e.target.nextSibling.style.display = "flex");
                          }}
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm mx-auto">
                          {item.subCategory.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Sub Category */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.subCategory}
                      </span>
                    </td>

                    {/* Products */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-block bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-100">
                        {item.products}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-100">
                        {item.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit Sub Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                          title="Delete Sub Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleView(item.id)}
                          className="action-btn bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700"
                          title="View Sub Category Details"
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
      {!loading && filteredSubCategories.length > 0 && (
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
      <AddSubCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
      <AddSubCategoryModal
        key={selectedSubCategory?._id || "subcat-edit"}
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
