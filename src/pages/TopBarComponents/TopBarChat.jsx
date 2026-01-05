import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  MessageCircle,
  Minus,
  Maximize2,
  Minimize2,
  Search,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Contacts with their conversations
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "SJ",
      status: "online",
      lastMessage: "Thanks for your help!",
      time: "10:30 AM",
      unread: 2,
      messages: [
        {
          id: 1,
          sender: "them",
          text: "Hi! I need help with my order",
          time: "10:15 AM",
        },
        {
          id: 2,
          sender: "me",
          text: "Sure! I'd be happy to help. What's your order number?",
          time: "10:16 AM",
        },
        { id: 3, sender: "them", text: "It's #12345", time: "10:17 AM" },
        {
          id: 4,
          sender: "me",
          text: "Let me check that for you...",
          time: "10:18 AM",
        },
        {
          id: 5,
          sender: "them",
          text: "Thanks for your help!",
          time: "10:30 AM",
        },
      ],
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "MC",
      status: "online",
      lastMessage: "When will my package arrive?",
      time: "9:45 AM",
      unread: 1,
      messages: [
        { id: 1, sender: "them", text: "Hello there!", time: "9:30 AM" },
        {
          id: 2,
          sender: "me",
          text: "Hi Michael! How can I assist you?",
          time: "9:31 AM",
        },
        {
          id: 3,
          sender: "them",
          text: "When will my package arrive?",
          time: "9:45 AM",
        },
      ],
    },
    {
      id: 3,
      name: "Emily Davis",
      avatar: "ED",
      status: "offline",
      lastMessage: "Perfect, thank you!",
      time: "Yesterday",
      unread: 0,
      messages: [
        {
          id: 1,
          sender: "them",
          text: "I have a question about returns",
          time: "Yesterday",
        },
        {
          id: 2,
          sender: "me",
          text: "Of course! What would you like to know?",
          time: "Yesterday",
        },
        {
          id: 3,
          sender: "them",
          text: "What's the return policy?",
          time: "Yesterday",
        },
        {
          id: 4,
          sender: "me",
          text: "You have 30 days for a full refund",
          time: "Yesterday",
        },
        {
          id: 5,
          sender: "them",
          text: "Perfect, thank you!",
          time: "Yesterday",
        },
      ],
    },
    {
      id: 4,
      name: "James Wilson",
      avatar: "JW",
      status: "online",
      lastMessage: "Can I change my shipping address?",
      time: "8:20 AM",
      unread: 3,
      messages: [
        { id: 1, sender: "them", text: "Hey, quick question", time: "8:15 AM" },
        {
          id: 2,
          sender: "them",
          text: "Can I change my shipping address?",
          time: "8:20 AM",
        },
      ],
    },
    {
      id: 5,
      name: "Lisa Anderson",
      avatar: "LA",
      status: "offline",
      lastMessage: "Got it, thanks!",
      time: "Nov 9",
      unread: 0,
      messages: [
        {
          id: 1,
          sender: "them",
          text: "Do you have this in blue?",
          time: "Nov 9",
        },
        {
          id: 2,
          sender: "me",
          text: "Yes, we have it in stock!",
          time: "Nov 9",
        },
        { id: 3, sender: "them", text: "Got it, thanks!", time: "Nov 9" },
      ],
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact]);

  const sendMessage = () => {
    if (!input.trim() || !selectedContact) return;

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add message to current contact's conversation
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === selectedContact.id
          ? {
              ...contact,
              messages: [
                ...contact.messages,
                { id: Date.now(), sender: "me", text: input, time },
              ],
              lastMessage: input,
              time: time,
            }
          : contact
      )
    );

    setInput("");
    setIsTyping(true);

    // Mock reply
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Got it! Thanks for the update. 😊",
        "I understand. Let me help you with that.",
        "Perfect! I'll take care of that right away.",
        "Thanks for reaching out!",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      const replyTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact.id
            ? {
                ...contact,
                messages: [
                  ...contact.messages,
                  {
                    id: Date.now(),
                    sender: "them",
                    text: randomResponse,
                    time: replyTime,
                  },
                ],
                lastMessage: randomResponse,
                time: replyTime,
              }
            : contact
        )
      );
    }, 1500);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    // Mark messages as read
    setContacts((prevContacts) =>
      prevContacts.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c))
    );
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = selectedContact
    ? contacts.find((c) => c.id === selectedContact.id)?.messages || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setSelectedContact(null);
          }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#84cc16] to-[#a3e635] text-white p-4 rounded-full shadow-2xl hover:shadow-[#F26422]/50 transition-all duration-300 hover:scale-110 z-[9999] group"
          aria-label="Open chat"
        >
          <MessageCircle size={28} className="group-hover:animate-bounce" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {contacts.reduce((sum, c) => sum + c.unread, 0)}
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <>
          {isMaximized && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              onClick={() => setIsMaximized(false)}
            />
          )}

          <div
            className={`fixed z-[9999] transition-all duration-300 ${
              isMaximized
                ? "inset-10"
                : isMinimized
                ? "bottom-6 right-6 w-[900px]"
                : "bottom-6 right-6 w-[900px] h-[600px]"
            } ${isMinimized ? "h-16" : ""}`}
          >
            <div className="h-full flex bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-[#F26422]/30 overflow-hidden">
              {/* Left Sidebar - Contacts List */}
              <div
                className={`${
                  isMinimized ? "hidden" : "flex"
                } flex-col w-[320px] border-r border-gray-800 bg-black/40`}
              >
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-[#F26422] to-[#ff7a3d] px-4 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white text-lg">Messages</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-white hover:bg-white/20 p-2 rounded-full transition"
                      >
                        <Minus size={18} />
                      </button>
                      <button
                        onClick={toggleMaximize}
                        className="text-white hover:bg-white/20 p-2 rounded-full transition"
                      >
                        {isMaximized ? (
                          <Minimize2 size={18} />
                        ) : (
                          <Maximize2 size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setIsMaximized(false);
                          setIsMinimized(false);
                          setSelectedContact(null);
                        }}
                        className="text-white hover:bg-white/20 p-2 rounded-full transition"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  {/* Search Bar */}
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-2">
                    <Search size={16} className="text-white/70" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contacts..."
                      className="flex-1 bg-transparent outline-none text-sm placeholder-white/50 text-white"
                    />
                  </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => selectContact(contact)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-gray-800/50 ${
                        selectedContact?.id === contact.id
                          ? "bg-gray-800/70"
                          : ""
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#F26422] to-[#ff7a3d] rounded-full flex items-center justify-center text-white font-bold">
                          {contact.avatar}
                        </div>
                        {contact.status === "online" && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white text-sm truncate">
                            {contact.name}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {contact.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400 truncate">
                            {contact.lastMessage}
                          </p>
                          {contact.unread > 0 && (
                            <span className="bg-[#F26422] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                              {contact.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Chat Area */}
              <div
                className={`${isMinimized ? "hidden" : "flex"} flex-1 flex-col`}
              >
                {selectedContact ? (
                  <>
                    {/* Chat Header */}
                    <div
                      className="bg-gradient-to-r from-[#F26422] to-[#ff7a3d] px-6 py-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedContact(null)}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(null);
                          }}
                          className="text-white hover:bg-white/20 p-2 rounded-full transition"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div className="relative">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#F26422] font-bold">
                            {selectedContact.avatar}
                          </div>
                          {selectedContact.status === "online" && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            {selectedContact.name}
                          </h3>
                          <p className="text-xs text-white/80">
                            {selectedContact.status === "online"
                              ? "Online"
                              : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="text-white hover:bg-white/20 p-2 rounded-full transition">
                          <Video size={20} />
                        </button>
                        <button className="text-white hover:bg-white/20 p-2 rounded-full transition">
                          <Phone size={20} />
                        </button>
                        <button className="text-white hover:bg-white/20 p-2 rounded-full transition">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-black/40 backdrop-blur-sm">
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === "me"
                              ? "justify-end"
                              : "justify-start"
                          } animate-fadeIn`}
                        >
                          <div className={`max-w-[70%]`}>
                            <div
                              className={`px-4 py-3 rounded-2xl shadow-lg ${
                                msg.sender === "me"
                                  ? "bg-gradient-to-r from-[#F26422] to-[#ff7a3d] text-white rounded-br-none"
                                  : "bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-bl-none"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.text}
                              </p>
                            </div>
                            <p
                              className={`text-xs text-gray-500 mt-1 ${
                                msg.sender === "me" ? "text-right" : "text-left"
                              }`}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start animate-fadeIn">
                          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
                            <div className="flex gap-1">
                              <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="border-t border-gray-800 bg-gradient-to-r from-gray-900 to-black p-4">
                      <div className="flex items-center gap-3 bg-gray-800 rounded-full px-4 py-2 border border-gray-700 focus-within:border-[#F26422] transition-all">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500 text-white"
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!input.trim()}
                          className="bg-gradient-to-r from-[#F26422] to-[#ff7a3d] hover:from-[#ff7a3d] hover:to-[#F26422] p-2.5 rounded-full transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-black/40">
                    <div className="text-center">
                      <MessageCircle
                        size={64}
                        className="text-gray-600 mx-auto mb-4"
                      />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-400">
                        Choose a contact to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatPopup;
