import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Trash2,
  X,
  Loader2,
  MessageSquare,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../api/api";

const SuggestionManagement = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSuggestions, setTotalSuggestions] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ text: "" });

  const loadSuggestions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/suggestion?page=${page}&limit=10`);
      if (response.data.success) {
        setSuggestions(response.data.data || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1);
          setTotalSuggestions(response.data.pagination.total || 0);
        }
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions(currentPage);
  }, [currentPage]);

  const handleViewClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setEditingSuggestion(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (suggestion) => {
    setEditingSuggestion(suggestion);
    setSelectedSuggestion(null);
    setFormData({ text: suggestion.text || "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.text.trim()) return;
    setSubmitting(true);
    try {
      const response = await api.put(
        `/api/suggestion/${editingSuggestion._id}`,
        { text: formData.text },
      );
      if (response.data.success) {
        setIsModalOpen(false);
        setEditingSuggestion(null);
        loadSuggestions(currentPage);
      }
    } catch (error) {
      console.error("Error updating suggestion:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this suggestion?"))
      return;
    try {
      const response = await api.delete(`/api/suggestion/${id}`);
      if (response.data.success) loadSuggestions(currentPage);
    } catch (error) {
      console.error("Error deleting suggestion:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSuggestion(null);
    setEditingSuggestion(null);
  };

  const filteredSuggestions = suggestions.filter((s) =>
    s.text?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, idx) => (
        <tr key={idx} className="border-b border-gray-50">
          {[...Array(4)].map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse"
                style={{ width: j === 1 ? "70%" : "50%" }}
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
        <td colSpan="4" className="py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-orange-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No suggestions found
            </p>
            <p className="text-gray-300 text-xs">
              Try adjusting your search query
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .row-animate { animation: fadeSlideIn 0.25s ease forwards; }
        .action-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.18s ease; border: none; cursor: pointer; }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div className="px-1 mt-3 mb-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF7B1D]" />
            <span className="text-sm font-semibold text-gray-800">
              Suggestion management
            </span>
          </div>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-[38px] w-full lg:w-[340px] shadow-sm bg-white">
            <input
              type="text"
              placeholder="Search suggestions..."
              className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-500 text-white text-xs font-semibold px-5 h-full transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
              <span className="text-sm font-semibold text-gray-700">
                All suggestions
              </span>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                {filteredSuggestions.length} of {totalSuggestions} suggestions
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90 w-12">
                    S.N
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90">
                    Suggestion
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider opacity-90 w-44">
                    Created at
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold text-white uppercase tracking-wider opacity-90 pr-5 w-28">
                    Actions
                  </th>
                </tr>
              </thead>

              {loading ? (
                <TableSkeleton />
              ) : filteredSuggestions.length === 0 ? (
                <EmptyState />
              ) : (
                <tbody>
                  {filteredSuggestions.map((suggestion, idx) => (
                    <tr
                      key={suggestion._id}
                      className="row-animate border-b border-gray-50 hover:bg-orange-50/40 transition-colors group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {(currentPage - 1) * 10 + idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                          {suggestion.text}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">
                        {new Date(suggestion.createdAt).toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewClick(suggestion)}
                            className="action-btn bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-700"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(suggestion)}
                            className="action-btn bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(suggestion._id)}
                            className="action-btn bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination */}
        {!loading && filteredSuggestions.length > 0 && (
          <div className="flex items-center justify-between px-1 mt-5">
            <p className="text-xs text-gray-400 font-medium">
              Page{" "}
              <span className="text-gray-600 font-semibold">{currentPage}</span>{" "}
              of{" "}
              <span className="text-gray-600 font-semibold">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !submitting && closeModal()}
          />
          <div className="relative bg-white w-full max-w-lg rounded-2xl z-50 shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                <span className="text-sm font-semibold text-gray-700">
                  {editingSuggestion ? "Edit suggestion" : "Suggestion details"}
                </span>
              </div>
              <button
                onClick={closeModal}
                disabled={submitting}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {editingSuggestion ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Suggestion text *
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                      }
                      disabled={submitting}
                      rows={6}
                      placeholder="Enter suggestion text"
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] resize-none transition-all"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={closeModal}
                      disabled={submitting}
                      className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2 bg-[#FF7B1D] text-white text-xs font-semibold rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin w-3.5 h-3.5" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-3.5 h-3.5" />
                          Update suggestion
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Created at
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedSuggestion?.createdAt).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Suggestion text
                    </p>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedSuggestion?.text}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setEditingSuggestion(selectedSuggestion);
                        setFormData({ text: selectedSuggestion?.text || "" });
                        setSelectedSuggestion(null);
                      }}
                      className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white text-xs font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SuggestionManagement;
