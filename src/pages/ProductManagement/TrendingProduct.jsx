import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Flame, Star, Eye, Trash2, TrendingUp } from "lucide-react";
import AddProductModal from "../../components/AddProduct";
import { useNavigate } from "react-router-dom";

const TrendingProduct = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All Vendors");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  // Simulated data
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts([
        {
          id: "TP101",
          name: "Wireless Headphones",
          vendor: "Manish Electronics",
          category: "Electronics",
          price: "₹3,499",
          trendScore: 92,
          status: "Hot Seller",
        },
        {
          id: "TP102",
          name: "Smart Watch Pro",
          vendor: "Techify",
          category: "Wearables",
          price: "₹6,999",
          trendScore: 89,
          status: "Top Rated",
        },
        {
          id: "TP103",
          name: "Gaming Mouse",
          vendor: "Anish Gadgets",
          category: "Accessories",
          price: "₹1,299",
          trendScore: 85,
          status: "Rising Star",
        },
        {
          id: "TP104",
          name: "Leather Shoes",
          vendor: "StyleHub",
          category: "Footwear",
          price: "₹2,299",
          trendScore: 78,
          status: "New Arrival",
        },
        {
          id: "TP105",
          name: "Smart TV 43”",
          vendor: "Manish Electronics",
          category: "Electronics",
          price: "₹18,999",
          trendScore: 95,
          status: "Hot Seller",
        },
      ]);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const statusColors = {
    "Hot Seller": "bg-red-100 text-red-700",
    "Top Rated": "bg-yellow-100 text-yellow-700",
    "Rising Star": "bg-blue-100 text-blue-700",
    "New Arrival": "bg-green-100 text-green-700",
  };

  const filteredProducts = products.filter((p) => {
    if (activeTab === "high_rated") return p.trendScore >= 90;
    if (activeTab === "best_seller") return p.status === "Hot Seller";
    if (activeTab === "new_arrival") return p.status === "New Arrival";
    return true;
  });

  const searchedProducts = filteredProducts.filter((product) =>
    [product.id, product.vendor, product.category, product.name]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = searchedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(searchedProducts.length / itemsPerPage);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-6 ml-6 mt-2  bg-gradient-to-r from-orange-100 to-yellow-50 rounded-sm shadow">
        <div className="flex items-center gap-3">
          <Flame className="text-[#FF7B1D]" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">
            Trending Products
          </h2>
          <span className="ml-2 bg-[#FF7B1D] text-white text-xs px-3 py-1 rounded-sm flex items-center gap-1">
            <TrendingUp size={14} /> Top Picks
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black hover:bg-[#FF7B1D] text-white px-5 py-2.5 rounded-sm text-sm font-medium transition"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 ml-6 mt-6 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "high_rated", label: "High Rated" },
          { key: "best_seller", label: "Best Seller" },
          { key: "new_arrival", label: "New Arrival" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 text-sm rounded-sm shadow transition ${
              activeTab === tab.key
                ? "bg-[#FF7B1D] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-orange-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white mt-6 ml-6  rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FF7B1D] text-white">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Product ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Trend Score</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  Loading trending products...
                </td>
              </tr>
            ) : currentProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-10 text-gray-500 text-sm"
                >
                  No trending products found.
                </td>
              </tr>
            ) : (
              currentProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  className="hover:bg-orange-50 border-b border-gray-100 transition"
                >
                  <td className="p-3">{indexOfFirst + idx + 1}</td>
                  <td className="p-3 font-semibold text-gray-700">
                    {product.id}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <Star className="text-yellow-500" size={14} />{" "}
                    {product.name}
                  </td>
                  <td className="p-3">{product.vendor}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3 font-semibold text-[#FF7B1D]">
                    {product.trendScore}%
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-sm font-medium ${
                        statusColors[product.status]
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3 text-right flex justify-end gap-3 pr-6">
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="text-orange-500 hover:text-orange-700"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => alert("Deleted")}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && searchedProducts.length > 0 && (
        <div className="flex justify-end items-center gap-6 mt-8 mr-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-[#FF7B1D] text-white px-8 py-2 text-sm font-medium rounded-sm hover:bg-orange-600"
          >
            Back
          </button>

          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="bg-[#247606] text-white px-8 py-2 text-sm font-medium rounded-sm hover:bg-green-800"
          >
            Next
          </button>
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default TrendingProduct;
