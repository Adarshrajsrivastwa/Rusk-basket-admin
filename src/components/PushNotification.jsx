import React, { useState } from "react";
import BulkAudiencePopup from "./BulkAudiencePopup"; // Import the popup

export default function CreateOfferPopup({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    offerType: "",
    code: "",
    minAmount: "",
    maxAmount: "",
    appliedOn: "Select....",
    searchTerm: "",
    discountValue: "",
    discountType: "",
    image: null,
  });

  const [isBulkPopupOpen, setIsBulkPopupOpen] = useState(false); // State to open BulkAudiencePopup

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
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
    <>
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
              Push Notification
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
            {/* Audience */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Select Audience*
              </label>
              <button
                onClick={() => setIsBulkPopupOpen(true)}
                className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-400 text-left flex justify-between items-center"
              >
                <span>{formData.appliedOn || "Select Audience"}</span>
                <span className="text-gray-500">▼</span> {/* Dropdown arrow */}
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter title"
                className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
              />
            </div>

            {/* Min & Max Amount */}
            <div className="flex flex-col gap-1">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Content
                </label>
                <input
                  type="number"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleChange}
                  placeholder="Enter content"
                  className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Coupon code (Optional)
                </label>
                <input
                  type="number"
                  name="maxAmount"
                  value={formData.maxAmount}
                  onChange={handleChange}
                  placeholder="Enter coupon code"
                  className="w-full border border-orange-300 rounded-md px-2 py-1 text-gray-800"
                />
              </div>
            </div>

            {/* Upload Image */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Upload Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1 border border-orange-300 rounded-md px-2 py-2 text-gray-800 bg-white"
                />
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-16 h-16 rounded-md object-cover border border-orange-200"
                  />
                )}
              </div>
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

      {/* Bulk Audience Popup */}
      {isBulkPopupOpen && (
        <BulkAudiencePopup
          isOpen={isBulkPopupOpen}
          onClose={() => setIsBulkPopupOpen(false)}
        />
      )}
    </>
  );
}
