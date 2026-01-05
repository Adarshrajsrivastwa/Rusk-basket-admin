import React, { useState } from "react";

export default function CreateOfferPopup({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    offerType: "",
    code: "",
    minAmount: "",
    maxAmount: "",
    appliedOn: "All Product",
    searchTerm: "",
    discountValue: "",
    discountType: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAppliedOnChange = (value) => {
    setFormData({ ...formData, appliedOn: value });
  };

  const handleSubmit = () => {
    if (
      !formData.offerType ||
      !formData.discountValue ||
      !formData.discountType
    ) {
      console.error("Please fill required fields.");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-sm shadow-2xl w-full max-w-lg p-4 sm:p-5 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800 inline-block border-b-4 border-[#FF7B1D] pb-1">
            Create Offers
          </h2>

          <button
            onClick={onClose}
            className="text-orange-500 text-4xl font-light hover:text-orange-700"
          >
            ×
          </button>
        </div>

        {/* Body Form */}
        <div className="space-y-2 text-sm">
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
              <option value="Coupon">Coupon</option>
              <option value="Prepaid">Prepaid</option>
            </select>
          </div>

          {/* Code */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter Coupon Code"
              className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            />
          </div>

          {/* Min & Max Amount */}
          <div className="flex flex-col gap-1">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Minimum Amount
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
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Maximum Amount
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

          {/* Applied On */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Applied On
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => handleAppliedOnChange("All Product")}
                className={`py-1 px-3 rounded-sm text-sm ${
                  formData.appliedOn === "All Product"
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
                className="bg-orange-500 text-white px-3 py-1 rounded-sm text-sm"
                onClick={() => console.log("Searching:", formData.searchTerm)}
              >
                Search
              </button>
            </div>
          </div>

          {/* Discount Type & Amount */}
          <div className="flex gap-1 items-center">
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder="Discount Amount or %"
              className="flex-1 border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            />
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-[120px] border border-orange-300 rounded-md px-2 py-1 text-gray-800"
            >
              <option value="">-- Select --</option>
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-sm text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
