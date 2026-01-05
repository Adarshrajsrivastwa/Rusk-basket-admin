// src/components/DeliveryCostModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DeliveryCostModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("");
  const [selectedCost, setSelectedCost] = useState(null);

  const costOptions = [30, 20, 40, 50, 60, 70];

  const handleAssign = () => {
    console.log("Assigned Delivery Cost:", selectedCost || amount);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white w-full sm:w-[80%] md:w-[65%] lg:w-[50%] max-h-[90vh] rounded-sm shadow-sm overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-lg sm:text-xl underline decoration-orange-500 decoration-4 underline-offset-4">
                Delivery Cost
              </h2>

              <button onClick={onClose}>
                <X className="text-orange-500 w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
              {/* Input */}
              <div>
                <label className="block mb-2 font-semibold text-sm sm:text-base">
                  Delivery Cost
                </label>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-orange-400 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Quick Select Options */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {costOptions.map((cost) => (
                  <button
                    key={cost}
                    type="button"
                    onClick={() => setSelectedCost(cost)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 text-sm sm:text-base transition ${
                      selectedCost === cost
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-orange-400 text-orange-600 hover:bg-orange-100"
                    }`}
                  >
                    {cost} INR
                    {cost === 30 && (
                      <span className="ml-2 text-[10px] sm:text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Google Map Placeholder */}
              <div className="bg-gray-600 text-white flex items-center justify-center h-32 sm:h-40 md:h-48 rounded-md">
                <div className="text-center space-y-1 text-sm sm:text-base">
                  <p>Google Map</p>
                  <p>→ Route</p>
                  <p>→ Traffic</p>
                  <p>→ Distance</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={handleAssign}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2 rounded-0 text-sm sm:text-base transition"
              >
                Assign
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeliveryCostModal;
