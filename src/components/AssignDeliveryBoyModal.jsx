// src/components/AssignDeliveryBoyModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DeliveryCostModal from "./DeliveryCostModal";

const AssignDeliveryBoyModal = ({ isOpen, onClose }) => {
  const [selected, setSelected] = useState([]);
  const [openCostModal, setOpenCostModal] = useState(false);

  const deliveryPartners = [
    {
      id: 1,
      name: "Ramesh Kumar",
      ratings: "3.5 Star",
      delivered: 19,
      status: "Online",
    },
    {
      id: 2,
      name: "Suresh Yadav",
      ratings: "4.0 Star",
      delivered: 25,
      status: "Offline",
    },
    {
      id: 3,
      name: "Mahesh Singh",
      ratings: "4.5 Star",
      delivered: 32,
      status: "On The Way",
    },
    {
      id: 4,
      name: "Ajay Verma",
      ratings: "3.8 Star",
      delivered: 21,
      status: "Offline",
    },
    {
      id: 5,
      name: "Vikas Sharma",
      ratings: "4.2 Star",
      delivered: 28,
      status: "Online",
    },
  ];

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ Handle Next button click
  const handleNext = () => {
    onClose(); // Close current modal
    setTimeout(() => {
      setOpenCostModal(true); // Then open the next modal slightly after
    }, 200); // small delay for smooth transition
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-2 sm:px-4">
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
              className="relative bg-white w-full sm:w-[80%] md:w-[70%] lg:w-[65%] max-h-[90vh] rounded-sm shadow-sm overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold text-base sm:text-lg md:text-xl">
                  Assign Delivery Partner
                </h2>
                <button onClick={onClose}>
                  <X className="text-orange-500 w-6 h-6" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-y-auto flex-1">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm md:text-base">
                    <thead className="bg-orange-500 text-white">
                      <tr>
                        <th className="p-2">Select</th>
                        <th className="p-2">Delivery Partner</th>
                        <th className="p-2">Ratings</th>
                        <th className="p-2">Today's Delivered</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryPartners.map((partner) => (
                        <tr
                          key={partner.id}
                          className={`cursor-pointer hover:bg-orange-50 transition ${
                            selected.includes(partner.id) ? "bg-blue-100" : ""
                          }`}
                          onClick={() => toggleSelect(partner.id)}
                        >
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={selected.includes(partner.id)}
                              onChange={() => toggleSelect(partner.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="p-2">{partner.name}</td>
                          <td className="p-2">{partner.ratings}</td>
                          <td className="p-2 text-center">
                            {partner.delivered}
                          </td>
                          <td className="p-2">{partner.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 flex justify-end border-t">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 text-md sm:text-base transition"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✅ Delivery Cost Modal (opens after Assign modal closes) */}
      <DeliveryCostModal
        isOpen={openCostModal}
        onClose={() => setOpenCostModal(false)}
      />
    </>
  );
};

export default AssignDeliveryBoyModal;
