import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Trash2, X, Loader2, MessageSquare, Eye, Edit2 } from "lucide-react";
import { BASE_URL } from "../../api/api";
import api from "../../api/api";

const API_URL = `${BASE_URL}/api/suggestion`;

const SuggestionManagement = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    text: "",
  });

  // Helper function to get authorization headers
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // ================= FETCH SUGGESTIONS =================
  const loadSuggestions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/suggestion?page=${page}&limit=10`);
      if (response.data.success) {
        setSuggestions(response.data.data || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1);
        }
      } else {
        alert("Failed to load suggestions");
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
      alert("Failed to load suggestions. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions(currentPage);
  }, [currentPage]);

  // ================= OPEN VIEW =================
  const handleViewClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  // ================= OPEN EDIT =================
  const handleEditClick = (suggestion) => {
    setEditingSuggestion(suggestion);
    setFormData({
      text: suggestion.text || "",
    });
    setIsModalOpen(true);
  };

  // ================= SUBMIT EDIT =================
  const handleSubmit = async () => {
    if (!formData.text.trim()) {
      alert("Suggestion text is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.put(
        `/api/suggestion/${editingSuggestion._id}`,
        { text: formData.text }
      );

      if (response.data.success) {
        setIsModalOpen(false);
        setEditingSuggestion(null);
        loadSuggestions(currentPage);
        alert("Suggestion updated successfully");
      } else {
        throw new Error(response.data.message || "Failed to update suggestion");
      }
    } catch (error) {
      console.error("Error updating suggestion:", error);
      alert(error.response?.data?.message || "Failed to update suggestion");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this suggestion?")) return;

    try {
      const response = await api.delete(`/api/suggestion/${id}`);
      if (response.data.success) {
        loadSuggestions(currentPage);
        alert("Suggestion deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete suggestion");
      }
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // ================= FILTER SUGGESTIONS =================
  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================= UI =================
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0 p-0 ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-custom-orange pb-2 inline-block">
              Suggestion Management
            </h1>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search suggestions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
            />
          </div>

          {/* Loader */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-custom-orange" size={40} />
            </div>
          )}

          {/* List */}
          {!loading && (
            <div className="space-y-4">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="bg-white shadow-lg border rounded-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="text-custom-orange" size={20} />
                        <span className="text-xs text-gray-500">
                          {new Date(suggestion.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {suggestion.text}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleViewClick(suggestion)}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleEditClick(suggestion)}
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(suggestion._id)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredSuggestions.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare className="mx-auto text-gray-400" size={64} />
              <p className="text-gray-500 text-lg mt-4">
                {searchQuery ? "No suggestions found matching your search" : "No suggestions found"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* MODAL - View or Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => !submitting && setIsModalOpen(false)}
            />
            <div className="relative bg-white w-full max-w-2xl p-6 rounded-lg z-50 shadow-2xl">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedSuggestion(null);
                  setEditingSuggestion(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                disabled={submitting}
              >
                <X size={24} />
              </button>

              {editingSuggestion ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-4 border-custom-orange pb-2 inline-block">
                    Edit Suggestion
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suggestion Text *
                      </label>
                      <textarea
                        placeholder="Enter suggestion text"
                        value={formData.text}
                        onChange={(e) =>
                          setFormData({ ...formData, text: e.target.value })
                        }
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-orange"
                        rows="8"
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setEditingSuggestion(null);
                        }}
                        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-custom-orange text-white rounded-lg hover:bg-custom-hover-blue transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            Updating...
                          </>
                        ) : (
                          "Update Suggestion"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-4 border-custom-orange pb-2 inline-block">
                    Suggestion Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Created At
                      </label>
                      <p className="text-gray-800">
                        {new Date(selectedSuggestion?.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suggestion Text
                      </label>
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {selectedSuggestion?.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setSelectedSuggestion(null);
                        }}
                        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setEditingSuggestion(selectedSuggestion);
                          setFormData({ text: selectedSuggestion?.text || "" });
                        }}
                        className="px-5 py-2 bg-custom-orange text-white rounded-lg hover:bg-custom-hover-blue transition-colors flex items-center gap-2"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SuggestionManagement;
