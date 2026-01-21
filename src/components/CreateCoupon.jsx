import React, { useState, useEffect } from "react";
import { BASE_URL } from "../api/api";

export default function CreateOfferPopup({
  isOpen,
  onClose,
  onSubmit,
  editData = null,
}) {
  const [formData, setFormData] = useState({
    couponName: "",
    offerId: "",
    offerType: "",
    code: "",
    minAmount: "",
    maxAmount: "",
    discountPercentage: "",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
    status: "active",
    appliedOn: "all",
    searchTerm: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        couponName: editData.couponName || "",
        offerId: editData.offerId || "",
        offerType: editData.offerType || "",
        code: editData.code || "",
        minAmount: editData.minAmount || "",
        maxAmount: editData.maxAmount || "",
        discountPercentage: editData.discountPercentage || "",
        validFrom: editData.validFrom ? editData.validFrom.split("T")[0] : "",
        validUntil: editData.validUntil
          ? editData.validUntil.split("T")[0]
          : "",
        usageLimit: editData.usageLimit || "",
        status: editData.status || "active",
        appliedOn: editData.appliedOn || "all",
        searchTerm: "",
      });
    } else if (!isOpen) {
      // Reset form when closing
      setFormData({
        couponName: "",
        offerId: "",
        offerType: "",
        code: "",
        minAmount: "",
        maxAmount: "",
        discountPercentage: "",
        validFrom: "",
        validUntil: "",
        usageLimit: "",
        status: "active",
        appliedOn: "all",
        searchTerm: "",
      });
      setError("");
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAppliedOnChange = (value) => {
    setFormData({ ...formData, appliedOn: value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.couponName || !formData.offerId || !formData.code) {
      setError("Please fill in Coupon Name, Offer ID, and Code");
      return;
    }

    if (!formData.offerType || !formData.discountPercentage) {
      setError("Please select offer type and enter discount value");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare API payload matching the backend structure
      const payload = {
        couponName: formData.couponName,
        offerId: formData.offerId,
        offerType: formData.offerType.toLowerCase(),
        code: formData.code,
        minAmount: parseFloat(formData.minAmount) || 0,
        maxAmount: parseFloat(formData.maxAmount) || 0,
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        status: formData.status,
        validFrom: formData.validFrom || new Date().toISOString().split("T")[0],
        validUntil:
          formData.validUntil ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        usageLimit: parseInt(formData.usageLimit) || 100,
      };

      // Get token from localStorage
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Determine if creating or updating
      const isEdit = editData && editData._id;
      const url = isEdit
        ? `${BASE_URL}/api/coupon/${editData._id}`
        : `${BASE_URL}/api/coupon/create`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Failed to ${isEdit ? "update" : "create"} coupon`
        );
      }

      alert(
        data.message || `Coupon ${isEdit ? "updated" : "created"} successfully`
      );

      // Call parent's onSubmit with the response data
      if (onSubmit) {
        onSubmit(data.data);
      }

      // Reset form
      setFormData({
        couponName: "",
        offerId: "",
        offerType: "",
        code: "",
        minAmount: "",
        maxAmount: "",
        discountPercentage: "",
        validFrom: "",
        validUntil: "",
        usageLimit: "",
        status: "active",
        appliedOn: "all",
        searchTerm: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isEdit = editData && editData._id;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-sm shadow-2xl w-full max-w-lg p-4 sm:p-5 flex flex-col justify-between max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800 inline-block border-b-4 border-[#FF7B1D] pb-1">
            {isEdit ? "Edit Offer" : "Create Offers"}
          </h2>

          <button
            onClick={onClose}
            className="text-orange-500 text-4xl font-light hover:text-orange-700"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
            {error}
          </div>
        )}

        {/* Body Form */}
        <div className="space-y-2 text-sm">
          {/* Coupon Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Coupon Name*
            </label>
            <input
              type="text"
              name="couponName"
              value={formData.couponName}
              onChange={handleChange}
              placeholder="Enter Coupon Name"
              className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            />
          </div>

          {/* Offer ID */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Offer ID*
            </label>
            <input
              type="text"
              name="offerId"
              value={formData.offerId}
              onChange={handleChange}
              placeholder="e.g., FEST2028"
              className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            />
          </div>

          {/* Offer Type */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Select Offer Type*
            </label>
            <select
              name="offerType"
              value={formData.offerType}
              onChange={handleChange}
              className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            >
              <option value="">---Select Offer Type---</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          {/* Code */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Code*
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter Coupon Code (e.g., FEST22)"
              className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            />
          </div>

          {/* Min & Max Amount */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-semibold text-gray-700 mb-1">
                Min Amount
              </label>
              <input
                type="number"
                name="minAmount"
                value={formData.minAmount}
                onChange={handleChange}
                placeholder="Min cart amount"
                className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-gray-700 mb-1">
                Max Amount
              </label>
              <input
                type="number"
                name="maxAmount"
                value={formData.maxAmount}
                onChange={handleChange}
                placeholder="Max cart amount"
                className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
              />
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Discount Value* (Percentage or Amount)
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              placeholder="e.g., 20 for 20% or 100 for ₹100"
              className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            />
          </div>

          {/* Valid From & Until */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-semibold text-gray-700 mb-1">
                Valid From
              </label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-gray-700 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
              />
            </div>
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Usage Limit
            </label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="Max number of uses (default: 100)"
              className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Applied On */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Applied On
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleAppliedOnChange("all")}
                className={`py-1 px-3 rounded-sm text-sm ${
                  formData.appliedOn === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-orange-500 border border-orange-300"
                }`}
              >
                All Product
              </button>
              <input
                type="text"
                name="searchTerm"
                value={formData.searchTerm}
                onChange={handleChange}
                placeholder="Search category/subcategory/products"
                className="flex-1 border border-orange-300 rounded-sm px-2 py-1"
              />
              <button
                type="button"
                className="bg-orange-500 text-white px-3 py-1 rounded-sm text-sm"
                onClick={() => console.log("Searching:", formData.searchTerm)}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-sm text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-sm text-sm disabled:bg-orange-300"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update"
              : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
