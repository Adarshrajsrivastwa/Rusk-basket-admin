import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllCategory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const navigate = useNavigate();
  const itemsPerPage = 8;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCategories([
        {
          id: "CT101",
          image: "https://i.pravatar.cc/50",
          category: "Electronics",
          products: "120",
          subCategories: [
            {
              id: "SC101",
              name: "Smartphones",
              products: "25",
              status: "Active",
            },
            { id: "SC102", name: "Laptops", products: "18", status: "Active" },
            {
              id: "SC107",
              name: "Headphones",
              products: "22",
              status: "Active",
            },
          ],
          status: "Active",
        },
        {
          id: "CT102",
          image: "https://i.pravatar.cc/50",
          category: "Fashion",
          products: "80",
          subCategories: [
            { id: "SC105", name: "Shirts", products: "10", status: "Active" },
            { id: "SC109", name: "Jackets", products: "9", status: "Active" },
          ],
          status: "Inactive",
        },
        {
          id: "CT103",
          image: "https://i.pravatar.cc/50",
          category: "Kitchen",
          products: "95",
          subCategories: [
            { id: "SC201", name: "Cookware", products: "30", status: "Active" },
            { id: "SC202", name: "Utensils", products: "25", status: "Active" },
          ],
          status: "Active",
        },
        {
          id: "CT104",
          image: "https://i.pravatar.cc/50",
          category: "Beauty",
          products: "60",
          subCategories: [
            { id: "SC301", name: "Makeup", products: "20", status: "Active" },
            { id: "SC302", name: "Skincare", products: "15", status: "Active" },
          ],
          status: "Active",
        },
        {
          id: "CT105",
          image: "https://i.pravatar.cc/50",
          category: "Sports",
          products: "50",
          subCategories: [
            { id: "SC401", name: "Fitness", products: "18", status: "Active" },
            {
              id: "SC402",
              name: "Outdoor",
              products: "12",
              status: "Inactive",
            },
          ],
          status: "Inactive",
        },
        {
          id: "CT106",
          image: "https://i.pravatar.cc/50",
          category: "Toys",
          products: "35",
          subCategories: [
            {
              id: "SC501",
              name: "Action Figures",
              products: "10",
              status: "Active",
            },
            {
              id: "SC502",
              name: "Educational",
              products: "8",
              status: "Active",
            },
          ],
          status: "Active",
        },
        {
          id: "CT107",
          image: "https://i.pravatar.cc/50",
          category: "Books",
          products: "42",
          subCategories: [
            { id: "SC601", name: "Fiction", products: "15", status: "Active" },
            {
              id: "SC602",
              name: "Non-Fiction",
              products: "12",
              status: "Active",
            },
          ],
          status: "Active",
        },
        {
          id: "CT108",
          image: "https://i.pravatar.cc/50",
          category: "Automotive",
          products: "28",
          subCategories: [
            { id: "SC701", name: "Parts", products: "10", status: "Active" },
            {
              id: "SC702",
              name: "Accessories",
              products: "8",
              status: "Inactive",
            },
          ],
          status: "Inactive",
        },
        {
          id: "CT109",
          image: "https://i.pravatar.cc/50",
          category: "Health",
          products: "70",
          subCategories: [
            {
              id: "SC801",
              name: "Supplements",
              products: "25",
              status: "Active",
            },
            {
              id: "SC802",
              name: "Medical Devices",
              products: "15",
              status: "Active",
            },
          ],
          status: "Active",
        },
      ]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const statusColors = {
    Active: "text-green-600 font-semibold",
    Inactive: "text-gray-600 font-semibold",
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  // Filter + Search
  const filteredCategories = categories
    .filter((cat) => {
      if (activeTab === "active") return cat.status === "Active";
      if (activeTab === "inactive") return cat.status === "Inactive";
      return true;
    })
    .filter((cat) =>
      [cat.category, cat.id, cat.products]
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
              <th className="p-3 text-center">Total Products</th>
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
                <React.Fragment key={cat.id}>
                  {/* Main Category Row */}
                  <tr className="bg-white shadow-sm hover:bg-gray-50 transition border-b-2 border-gray-200">
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="text-orange-600 hover:text-orange-800"
                        title="Expand/Collapse Subcategories"
                      >
                        {expandedCategories.has(cat.id) ? (
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
                      <img
                        src={cat.image}
                        alt={cat.category}
                        className="h-8 w-8 rounded-full object-cover mx-auto"
                      />
                    </td>
                    <td className="p-3 text-center font-semibold">
                      {cat.category}
                    </td>
                    <td className="p-3 text-center">{cat.products}</td>
                    <td
                      className={`p-3 text-center ${statusColors[cat.status]}`}
                    >
                      {cat.status}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/category/edit/${cat.id}`)}
                          className="text-orange-600 hover:text-blue-700"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-orange-600 hover:text-red-600"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/category/view-all/${cat.id}`)
                          }
                          className="text-orange-600 hover:text-green-700"
                          title="View Category Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Subcategories Rows (Expandable) */}
                  {expandedCategories.has(cat.id) &&
                    cat.subCategories.map((sub, subIdx) => (
                      <tr
                        key={sub.id}
                        className="bg-blue-50 hover:bg-blue-100 transition border-b border-gray-100"
                      >
                        <td className="p-3"></td>
                        <td className="p-3 text-center text-xs text-gray-500">
                          {indexOfFirst + idx + 1}.{subIdx + 1}
                        </td>
                        <td className="p-3 text-center">
                          <div className="h-6 w-6 rounded-full bg-blue-200 mx-auto flex items-center justify-center text-xs font-semibold text-blue-700">
                            SC
                          </div>
                        </td>
                        <td className="p-3 text-center text-sm pl-8 text-left">
                          <span className="text-gray-600">↳</span> {sub.name}
                        </td>
                        <td className="p-3 text-center text-sm">
                          {sub.products}
                        </td>
                        <td
                          className={`p-3 text-center text-sm ${
                            statusColors[sub.status]
                          }`}
                        >
                          {sub.status}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/subcategory/edit/${sub.id}`)
                              }
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Subcategory"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/subcategory/view/${sub.id}`)
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
            className="bg-[#FF7B1D] text-white px-10 py-3 text-sm font-medium hover:bg-orange-600"
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
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllCategory;
