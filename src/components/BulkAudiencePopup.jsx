import { useState } from "react";

export default function BulkAudiencePopup({ isOpen, onClose }) {
  const [selectedBulk, setSelectedBulk] = useState({
    all: true,
    allUser: false,
    allVendor: false,
    itemInCart: false,
    normal: false,
    buyer: false,
  });

  const [vendorSearch, setVendorSearch] = useState("");
  const [selectedVendorAudience, setSelectedVendorAudience] = useState({
    allUser: false,
    itemInCart: false,
    normal: false,
    buyer: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-sm w-[510px] p-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-orange-500 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Select Bulk Audience</h2>

        {/* Bulk Audience */}
        <div className="flex justify-between items-center font-bold flex-wrap gap-2 mb-4 text-lg">
          {[
            { key: "all", label: "All" },
            { key: "allUser", label: "All User" },
            { key: "allVendor", label: "All Vendor" },
            { key: "itemInCart", label: "Item in Cart" },
            { key: "normal", label: "Normal" },
            { key: "buyer", label: "Buyer" },
          ].map((option) => (
            <label
              key={option.key}
              className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
            >
              <input
                type="checkbox"
                checked={selectedBulk[option.key]}
                onChange={() =>
                  setSelectedBulk({
                    ...selectedBulk,
                    [option.key]: !selectedBulk[option.key],
                  })
                }
                className="w-3 h-3 accent-orange-500"
              />
              <span className="text-xs text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
        <label className="block font-semibold mb-1">Vendor's Audiance</label>

        {/* Vendor Audience */}
        <div className="mb-4">
          <label className="block ml-4 mb-1">Select Vendor</label>
          {/* Search Bar */}
          <div className="flex items-center border border-black rounded ml-4 overflow-hidden h-[36px] w-full sm:w-[460px]">
            <input
              type="text"
              placeholder="Search Order by Order Id, Products, User name, Tag"
              className="flex-1 px-4 text-sm focus:outline-none h-full"
            />
            <button className="bg-[#FF7B1D] hover:bg-orange-600 text-white px-4 sm:px-6 h-full text-sm">
              Search
            </button>
          </div>
          <h2 className="text-md mt-2 ml-8 font-semibold mb-4">
            Vendor Audiance
          </h2>

          {/* Vendor Audience Checkboxes */}
          <div className="flex ml-8 flex-wrap font-semibold gap-6">
            {[
              { key: "allUser", label: "All User" },
              { key: "itemInCart", label: "Item in Cart" },
              { key: "normal", label: "Normal" },
              { key: "buyer", label: "Buyer" },
            ].map((option) => (
              <label key={option.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedVendorAudience[option.key]}
                  onChange={() =>
                    setSelectedVendorAudience({
                      ...selectedVendorAudience,
                      [option.key]: !selectedVendorAudience[option.key],
                    })
                  }
                  className="w-4 h-4 accent-orange-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <button className="flex items-center ml-16 gap-3 bg-[#FFB19F] px-4 py-2 rounded-xl text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h7v-1.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5V19h7v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.07 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Audience</span>
              <span className="text-xs text-gray-700">4793750943503945</span>
            </div>
          </button>

          <button className="bg-[#247606] text-white mr-4 px-6 py-2 rounded-sm h-16 w-48">
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
