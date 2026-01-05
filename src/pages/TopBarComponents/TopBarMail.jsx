import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FiMail,
  FiStar,
  FiSend,
  FiTrash2,
  FiSearch,
  FiX,
} from "react-icons/fi";

const sampleMails = [
  {
    id: 1,
    sender: "RushBasket Support",
    subject: "Your order #12345 has been shipped!",
    time: "2h ago",
    content:
      "Hi there! Your order #12345 has been shipped and is on its way. Expected delivery by November 9th, 2025.",
    starred: false,
  },
  {
    id: 2,
    sender: "Promotions",
    subject: "🎉 20% OFF on your next purchase!",
    time: "1d ago",
    content:
      "Use code SAVE20 to enjoy an instant 20% discount. Offer valid till November 15th, 2025!",
    starred: true,
  },
  {
    id: 3,
    sender: "System",
    subject: "Scheduled Maintenance",
    time: "3d ago",
    content:
      "We’ll be performing scheduled maintenance on November 10th from 2:00 AM to 4:00 AM UTC.",
    starred: false,
  },
  {
    id: 4,
    sender: "System",
    subject: "Scheduled Maintenance",
    time: "3d ago",
    content:
      "We’ll be performing scheduled maintenance on November 10th from 2:00 AM to 4:00 AM UTC.",
    starred: false,
  },
  {
    id: 5,
    sender: "System",
    subject: "Scheduled Maintenance",
    time: "3d ago",
    content:
      "We’ll be performing scheduled maintenance on November 10th from 2:00 AM to 4:00 AM UTC.",
    starred: false,
  },
];

const MailPage = () => {
  const [selectedMail, setSelectedMail] = useState(null);
  const [search, setSearch] = useState("");

  const filteredMails = sampleMails.filter(
    (mail) =>
      mail.sender.toLowerCase().includes(search.toLowerCase()) ||
      mail.subject.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStar = (id) => {
    const mail = sampleMails.find((m) => m.id === id);
    mail.starred = !mail.starred;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-black text-white pt-[72px] px-4 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <FiMail className="text-orange-400" />
            Mailbox
          </h1>
          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-sm text-sm font-medium transition">
            Compose
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#111] border border-gray-800 rounded-sm px-3 py-2 mb-5">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search mails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500"
          />
        </div>

        {/* Mail List */}
        <div className="bg-[#111] border border-gray-800 rounded-sm overflow-hidden divide-y divide-gray-800">
          {filteredMails.length > 0 ? (
            filteredMails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => setSelectedMail(mail)}
                className="p-4 flex justify-between items-start hover:bg-[#1a1a1a] cursor-pointer transition"
              >
                <div>
                  <h3 className="font-semibold text-white">{mail.sender}</h3>
                  <p className="text-sm text-gray-300 mt-1">{mail.subject}</p>
                  <span className="text-xs text-gray-500">{mail.time}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(mail.id);
                  }}
                  className="text-gray-400 hover:text-yellow-400"
                >
                  <FiStar
                    className={mail.starred ? "text-yellow-400" : ""}
                    size={18}
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-10 text-sm">
              No mails found.
            </div>
          )}
        </div>

        {/* Mail Detail Modal */}
        {selectedMail && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedMail(null)}
          >
            <div
              className="bg-[#1a1a1a] w-[90%] sm:w-[600px] rounded-2xl shadow-lg relative p-6 border border-gray-800 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMail(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-semibold mb-2 text-white">
                {selectedMail.subject}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                From: <span className="text-white">{selectedMail.sender}</span>{" "}
                • <span className="text-gray-500">{selectedMail.time}</span>
              </p>
              <div className="border-t border-gray-700 pt-4 text-gray-300 text-sm leading-relaxed">
                {selectedMail.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MailPage;
