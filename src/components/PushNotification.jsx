// import React, { useState, useRef } from "react";
// import DashboardLayout from "../components/DashboardLayout";
// import {
//   Bell,
//   Send,
//   Users,
//   Store,
//   Bike,
//   Image,
//   X,
//   CheckCircle,
//   AlertCircle,
//   ChevronRight,
//   Loader2,
//   Smartphone,
//   Hash,
//   Plus,
//   Trash2,
// } from "lucide-react";
// import { BASE_URL } from "../api/api";

// const TARGET_GROUPS = [
//   {
//     key: "User",
//     label: "Users",
//     icon: Users,
//     color: "bg-blue-50 border-blue-300 text-blue-700",
//     activeColor: "bg-blue-500 border-blue-500 text-white",
//     dot: "bg-blue-500",
//   },
//   {
//     key: "Vendor",
//     label: "Vendors",
//     icon: Store,
//     color: "bg-purple-50 border-purple-300 text-purple-700",
//     activeColor: "bg-purple-500 border-purple-500 text-white",
//     dot: "bg-purple-500",
//   },
//   {
//     key: "Rider",
//     label: "Riders",
//     icon: Bike,
//     color: "bg-green-50 border-green-300 text-green-700",
//     activeColor: "bg-green-500 border-green-500 text-white",
//     dot: "bg-green-500",
//   },
// ];

// const PushNotification = () => {
//   const [form, setForm] = useState({
//     title: "",
//     message: "",
//     targetGroup: [],
//     specificIds: [],
//     image: null,
//   });
//   const [imagePreview, setImagePreview] = useState(null);
//   const [specificIdInput, setSpecificIdInput] = useState("");
//   const [loading, setSending] = useState(false);
//   const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
//   const fileRef = useRef(null);

//   // ── Toast helpers ─────────────────────────────────────────────────────────
//   const showToast = (type, msg) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 4000);
//   };

//   // ── Target group toggle ───────────────────────────────────────────────────
//   const toggleGroup = (key) => {
//     setForm((prev) => ({
//       ...prev,
//       targetGroup: prev.targetGroup.includes(key)
//         ? prev.targetGroup.filter((g) => g !== key)
//         : [...prev.targetGroup, key],
//     }));
//   };

//   // ── Image handling ────────────────────────────────────────────────────────
//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       showToast("error", "Please select a valid image file.");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       showToast("error", "Image must be under 5 MB.");
//       return;
//     }
//     setForm((prev) => ({ ...prev, image: file }));
//     const reader = new FileReader();
//     reader.onloadend = () => setImagePreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setForm((prev) => ({ ...prev, image: null }));
//     setImagePreview(null);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   // ── Specific IDs ──────────────────────────────────────────────────────────
//   const addSpecificId = () => {
//     const id = specificIdInput.trim();
//     if (!id) return;
//     if (form.specificIds.includes(id)) {
//       showToast("error", "ID already added.");
//       return;
//     }
//     setForm((prev) => ({ ...prev, specificIds: [...prev.specificIds, id] }));
//     setSpecificIdInput("");
//   };

//   const removeSpecificId = (id) => {
//     setForm((prev) => ({
//       ...prev,
//       specificIds: prev.specificIds.filter((s) => s !== id),
//     }));
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.title.trim()) return showToast("error", "Title is required.");
//     if (!form.message.trim()) return showToast("error", "Message is required.");
//     if (form.targetGroup.length === 0 && form.specificIds.length === 0)
//       return showToast(
//         "error",
//         "Select at least one target group or add specific IDs.",
//       );

//     try {
//       setSending(true);
//       const token =
//         localStorage.getItem("token") || localStorage.getItem("authToken");

//       let body;
//       let headers = {};
//       if (token) headers["Authorization"] = `Bearer ${token}`;

//       if (form.image) {
//         const fd = new FormData();
//         fd.append("title", form.title);
//         fd.append("message", form.message);
//         form.targetGroup.forEach((g) => fd.append("targetGroup[]", g));
//         form.specificIds.forEach((id) => fd.append("specificIds[]", id));
//         fd.append("image", form.image);
//         body = fd;
//       } else {
//         headers["Content-Type"] = "application/json";
//         body = JSON.stringify({
//           title: form.title,
//           message: form.message,
//           targetGroup: form.targetGroup,
//           specificIds: form.specificIds,
//           image: null,
//         });
//       }

//       const res = await fetch(
//         `${BASE_URL}/api/admin/send-custom-push-notification`,
//         { method: "POST", headers, credentials: "include", body },
//       );

//       const data = await res.json();

//       if (!res.ok || !data.success)
//         throw new Error(data.message || "Failed to send notification.");

//       showToast("success", "Notification sent successfully!");
//       setForm({
//         title: "",
//         message: "",
//         targetGroup: [],
//         specificIds: [],
//         image: null,
//       });
//       setImagePreview(null);
//       setSpecificIdInput("");
//       if (fileRef.current) fileRef.current.value = "";
//     } catch (err) {
//       showToast("error", err.message || "Something went wrong.");
//     } finally {
//       setSending(false);
//     }
//   };

//   // ── Live preview data ─────────────────────────────────────────────────────
//   const previewTitle = form.title || "Notification Title";
//   const previewMessage =
//     form.message || "Your notification message will appear here...";

//   return (
//     <DashboardLayout>
//       {/* ── Toast ── */}
//       {toast && (
//         <div
//           className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3.5 rounded-sm shadow-2xl text-sm font-medium transition-all duration-300 ${
//             toast.type === "success"
//               ? "bg-green-500 text-white"
//               : "bg-red-500 text-white"
//           }`}
//         >
//           {toast.type === "success" ? (
//             <CheckCircle size={18} />
//           ) : (
//             <AlertCircle size={18} />
//           )}
//           {toast.msg}
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-0 sm:px-6 py-4">
//         {/* ── Page Header ── */}
//         <div
//           className="rounded-sm shadow-xl p-0 ml-2 sm:p-8 mb-8 text-white"
//           style={{
//             background:
//               "linear-gradient(135deg, #FF7B1D 0%, #FF9547 60%, #FFB347 100%)",
//           }}
//         >
//           <div className="flex items-center gap-4">
//             <div className="bg-white/20 backdrop-blur-sm p-3.5 rounded-xl">
//               <Bell size={32} className="text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold">
//                 Push Notification
//               </h1>
//               <p className="text-orange-100 text-sm mt-1">
//                 Send targeted push notifications to Users, Vendors, and Riders
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//           {/* ── Left: Form ── */}
//           <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
//             {/* Title & Message */}
//             <div
//               className="bg-white rounded-sm shadow-sm border-t-4 p-6"
//               style={{ borderTopColor: "#FF7B1D" }}
//             >
//               <div className="flex items-center gap-2 mb-5 pb-3 border-b border-orange-100">
//                 <div className="bg-orange-50 p-2 rounded-lg">
//                   <Bell size={20} style={{ color: "#FF7B1D" }} />
//                 </div>
//                 <h2 className="font-bold text-gray-800 text-lg">
//                   Notification Content
//                 </h2>
//               </div>

//               <div className="space-y-4">
//                 {/* Title */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-600 mb-1.5">
//                     Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={form.title}
//                     onChange={(e) =>
//                       setForm((p) => ({ ...p, title: e.target.value }))
//                     }
//                     placeholder="e.g. New Update Available"
//                     maxLength={100}
//                     className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
//                   />
//                   <p className="text-right text-xs text-gray-400 mt-1">
//                     {form.title.length}/100
//                   </p>
//                 </div>

//                 {/* Message */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-600 mb-1.5">
//                     Message <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={form.message}
//                     onChange={(e) =>
//                       setForm((p) => ({ ...p, message: e.target.value }))
//                     }
//                     placeholder="e.g. We have updated our terms of service. Please review."
//                     rows={4}
//                     maxLength={500}
//                     className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
//                   />
//                   <p className="text-right text-xs text-gray-400 mt-1">
//                     {form.message.length}/500
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Target Groups */}
//             <div
//               className="bg-white rounded-sm shadow-sm border-t-4 p-6"
//               style={{ borderTopColor: "#FF7B1D" }}
//             >
//               <div className="flex items-center gap-2 mb-5 pb-3 border-b border-orange-100">
//                 <div className="bg-orange-50 p-2 rounded-lg">
//                   <Users size={20} style={{ color: "#FF7B1D" }} />
//                 </div>
//                 <h2 className="font-bold text-gray-800 text-lg">
//                   Target Audience
//                 </h2>
//               </div>

//               <p className="text-xs text-gray-500 mb-4">
//                 Select one or more groups to receive this notification. Leave
//                 empty if using specific IDs only.
//               </p>

//               <div className="grid grid-cols-3 gap-3">
//                 {TARGET_GROUPS.map(
//                   ({ key, label, icon: Icon, color, activeColor, dot }) => {
//                     const active = form.targetGroup.includes(key);
//                     return (
//                       <button
//                         key={key}
//                         type="button"
//                         onClick={() => toggleGroup(key)}
//                         className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
//                           active ? activeColor : color
//                         } hover:scale-105 active:scale-100`}
//                       >
//                         {active && (
//                           <CheckCircle
//                             size={16}
//                             className="absolute top-2 right-2 opacity-80"
//                           />
//                         )}
//                         <Icon size={24} />
//                         {label}
//                       </button>
//                     );
//                   },
//                 )}
//               </div>

//               {form.targetGroup.length > 0 && (
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {form.targetGroup.map((g) => {
//                     const grp = TARGET_GROUPS.find((t) => t.key === g);
//                     return (
//                       <span
//                         key={g}
//                         className="flex items-center gap-1.5 text-xs bg-orange-100 text-orange-700 font-semibold px-3 py-1 rounded-full"
//                       >
//                         <span className={`w-2 h-2 rounded-full ${grp?.dot}`} />
//                         {g}
//                       </span>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Specific IDs */}
//             {/* <div
//               className="bg-white rounded-xl shadow-sm border-t-4 p-6"
//               style={{ borderTopColor: "#FF7B1D" }}
//             >
//               <div className="flex items-center gap-2 mb-5 pb-3 border-b border-orange-100">
//                 <div className="bg-orange-50 p-2 rounded-lg">
//                   <Hash size={20} style={{ color: "#FF7B1D" }} />
//                 </div>
//                 <h2 className="font-bold text-gray-800 text-lg">
//                   Specific IDs
//                 </h2>
//                 <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                   Optional
//                 </span>
//               </div>

//               <p className="text-xs text-gray-500 mb-4">
//                 Send to specific user, vendor, or rider IDs in addition to (or
//                 instead of) target groups.
//               </p>

//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={specificIdInput}
//                   onChange={(e) => setSpecificIdInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       addSpecificId();
//                     }
//                   }}
//                   placeholder="Paste ID and press Enter or click Add"
//                   className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
//                 />
//                 <button
//                   type="button"
//                   onClick={addSpecificId}
//                   className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
//                 >
//                   <Plus size={16} />
//                   Add
//                 </button>
//               </div>

//               {form.specificIds.length > 0 && (
//                 <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
//                   {form.specificIds.map((id) => (
//                     <div
//                       key={id}
//                       className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
//                     >
//                       <span className="text-xs font-mono text-gray-700 truncate flex-1 mr-2">
//                         {id}
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() => removeSpecificId(id)}
//                         className="text-red-400 hover:text-red-600 transition-colors shrink-0"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {form.specificIds.length > 0 && (
//                 <p className="text-xs text-gray-400 mt-2">
//                   {form.specificIds.length} ID
//                   {form.specificIds.length > 1 ? "s" : ""} added
//                 </p>
//               )}
//             </div> */}

//             {/* Image Upload */}
//             <div
//               className="bg-white rounded-sm shadow-sm border-t-4 p-6"
//               style={{ borderTopColor: "#FF7B1D" }}
//             >
//               <div className="flex items-center gap-2 mb-5 pb-3 border-b border-orange-100">
//                 <div className="bg-orange-50 p-2 rounded-lg">
//                   <Image size={20} style={{ color: "#FF7B1D" }} />
//                 </div>
//                 <h2 className="font-bold text-gray-800 text-lg">
//                   Notification Image
//                 </h2>
//                 <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                   Optional
//                 </span>
//               </div>

//               {imagePreview ? (
//                 <div className="relative w-full rounded-xl overflow-hidden border-2 border-orange-200">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-full h-40 object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={removeImage}
//                     className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transition-colors"
//                   >
//                     <X size={14} />
//                   </button>
//                   <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-3 py-1.5">
//                     {form.image?.name}
//                   </div>
//                 </div>
//               ) : (
//                 <label
//                   htmlFor="notif-image"
//                   className="flex flex-col items-center justify-center gap-3 w-full h-36 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
//                 >
//                   <Image size={28} className="text-orange-400" />
//                   <div className="text-center">
//                     <p className="text-sm font-semibold text-orange-600">
//                       Click to upload image
//                     </p>
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       PNG, JPG, WEBP up to 5MB
//                     </p>
//                   </div>
//                 </label>
//               )}
//               <input
//                 ref={fileRef}
//                 id="notif-image"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImage}
//                 className="hidden"
//               />
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-bold text-base shadow-lg transition-all hover:scale-[1.01] active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
//               style={{
//                 background: loading
//                   ? "#ccc"
//                   : "linear-gradient(to right, #FF7B1D, #FF9547)",
//               }}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={20} className="animate-spin" />
//                   Sending Notification...
//                 </>
//               ) : (
//                 <>
//                   <Send size={20} />
//                   Send Push Notification
//                 </>
//               )}
//             </button>
//           </form>

//           {/* ── Right: Live Preview ── */}
//           <div className="lg:col-span-2">
//             <div className="sticky top-24">
//               <div
//                 className="bg-white rounded-xl shadow-sm border-t-4 p-6"
//                 style={{ borderTopColor: "#FF7B1D" }}
//               >
//                 <div className="flex items-center gap-2 mb-5 pb-3 border-b border-orange-100">
//                   <div className="bg-orange-50 p-2 rounded-lg">
//                     <Smartphone size={20} style={{ color: "#FF7B1D" }} />
//                   </div>
//                   <h2 className="font-bold text-gray-800 text-lg">
//                     Live Preview
//                   </h2>
//                 </div>

//                 {/* Phone mockup */}
//                 <div className="flex justify-center">
//                   <div className="w-64 bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
//                     {/* Camera notch */}
//                     <div className="w-20 h-5 bg-black rounded-full mx-auto mb-2" />

//                     {/* Screen */}
//                     <div className="bg-gray-100 rounded-[1.8rem] overflow-hidden min-h-[380px] px-3 pt-4 pb-6">
//                       {/* Status bar */}
//                       <div className="flex justify-between items-center px-2 mb-4">
//                         <span className="text-[10px] font-bold text-gray-700">
//                           9:41
//                         </span>
//                         <div className="flex gap-1 items-center">
//                           <div className="w-3 h-1.5 bg-gray-700 rounded-sm" />
//                           <div className="w-1 h-1 bg-gray-700 rounded-full" />
//                         </div>
//                       </div>

//                       {/* Notification card */}
//                       <div className="bg-white rounded-2xl shadow-md p-3.5 mx-1">
//                         <div className="flex items-start gap-2.5">
//                           {/* App icon */}
//                           <div
//                             className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow"
//                             style={{
//                               background:
//                                 "linear-gradient(135deg, #FF7B1D, #FF9547)",
//                             }}
//                           >
//                             <Bell size={18} className="text-white" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between">
//                               <p className="text-[11px] font-bold text-gray-800 truncate">
//                                 RushBaskets
//                               </p>
//                               <p className="text-[9px] text-gray-400 ml-1 shrink-0">
//                                 now
//                               </p>
//                             </div>
//                             <p className="text-[11px] font-semibold text-gray-900 mt-0.5 leading-tight">
//                               {previewTitle}
//                             </p>
//                             <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed line-clamp-3">
//                               {previewMessage}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Image preview inside notification */}
//                         {imagePreview && (
//                           <div className="mt-2.5 rounded-xl overflow-hidden">
//                             <img
//                               src={imagePreview}
//                               alt="Notification"
//                               className="w-full h-24 object-cover"
//                             />
//                           </div>
//                         )}
//                       </div>

//                       {/* Target chips */}
//                       {form.targetGroup.length > 0 && (
//                         <div className="mt-4 px-1">
//                           <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
//                             Sending to
//                           </p>
//                           <div className="flex flex-wrap gap-1">
//                             {form.targetGroup.map((g) => {
//                               const grp = TARGET_GROUPS.find(
//                                 (t) => t.key === g,
//                               );
//                               return (
//                                 <span
//                                   key={g}
//                                   className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
//                                     g === "User"
//                                       ? "bg-blue-100 text-blue-700"
//                                       : g === "Vendor"
//                                         ? "bg-purple-100 text-purple-700"
//                                         : "bg-green-100 text-green-700"
//                                   }`}
//                                 >
//                                   <span
//                                     className={`w-1.5 h-1.5 rounded-full ${grp?.dot}`}
//                                   />
//                                   {g}s
//                                 </span>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       )}

//                       {form.specificIds.length > 0 && (
//                         <div className="mt-2 px-1">
//                           <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
//                             + {form.specificIds.length} specific recipient
//                             {form.specificIds.length > 1 ? "s" : ""}
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Home bar */}
//                     <div className="w-24 h-1 bg-gray-600 rounded-full mx-auto mt-2" />
//                   </div>
//                 </div>

//                 {/* Summary */}
//                 <div className="mt-6 space-y-2.5">
//                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
//                     Summary
//                   </p>
//                   <SummaryRow
//                     label="Title"
//                     value={
//                       form.title || (
//                         <span className="text-gray-300 italic">Not set</span>
//                       )
//                     }
//                   />
//                   <SummaryRow
//                     label="Message"
//                     value={
//                       form.message ? (
//                         form.message.length > 40 ? (
//                           form.message.slice(0, 40) + "…"
//                         ) : (
//                           form.message
//                         )
//                       ) : (
//                         <span className="text-gray-300 italic">Not set</span>
//                       )
//                     }
//                   />
//                   <SummaryRow
//                     label="Groups"
//                     value={
//                       form.targetGroup.length > 0 ? (
//                         form.targetGroup.join(", ")
//                       ) : (
//                         <span className="text-gray-300 italic">None</span>
//                       )
//                     }
//                   />
//                   <SummaryRow
//                     label="Specific IDs"
//                     value={
//                       form.specificIds.length > 0 ? (
//                         `${form.specificIds.length} added`
//                       ) : (
//                         <span className="text-gray-300 italic">None</span>
//                       )
//                     }
//                   />
//                   <SummaryRow
//                     label="Image"
//                     value={
//                       form.image ? (
//                         <span className="text-green-600 font-semibold">
//                           Attached
//                         </span>
//                       ) : (
//                         <span className="text-gray-300 italic">None</span>
//                       )
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// // ── Small helper ─────────────────────────────────────────────────────────────
// const SummaryRow = ({ label, value }) => (
//   <div className="flex items-start justify-between gap-2 text-xs">
//     <span className="text-gray-400 font-medium shrink-0">{label}</span>
//     <span className="text-gray-700 font-semibold text-right">{value}</span>
//   </div>
// );

// export default PushNotification;
import React, { useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Bell,
  Send,
  Users,
  Store,
  Bike,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Smartphone,
} from "lucide-react";
import { BASE_URL } from "../api/api";

const TARGET_GROUPS = [
  { key: "User", label: "Users", icon: Users, dot: "bg-blue-500" },
  { key: "Vendor", label: "Vendors", icon: Store, dot: "bg-purple-500" },
  { key: "Rider", label: "Riders", icon: Bike, dot: "bg-green-500" },
];

const PushNotification = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    targetGroup: [],
    specificIds: [],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleGroup = (key) =>
    setForm((prev) => ({
      ...prev,
      targetGroup: prev.targetGroup.includes(key)
        ? prev.targetGroup.filter((g) => g !== key)
        : [...prev.targetGroup, key],
    }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image must be under 5 MB.");
      return;
    }
    setForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return showToast("error", "Title is required.");
    if (!form.message.trim()) return showToast("error", "Message is required.");
    if (form.targetGroup.length === 0 && form.specificIds.length === 0)
      return showToast("error", "Select at least one target group.");

    try {
      setSending(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      let body;
      let headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      if (form.image) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("message", form.message);
        form.targetGroup.forEach((g) => fd.append("targetGroup[]", g));
        form.specificIds.forEach((id) => fd.append("specificIds[]", id));
        fd.append("image", form.image);
        body = fd;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({
          title: form.title,
          message: form.message,
          targetGroup: form.targetGroup,
          specificIds: form.specificIds,
          image: null,
        });
      }

      const res = await fetch(
        `${BASE_URL}/api/admin/send-custom-push-notification`,
        { method: "POST", headers, credentials: "include", body },
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to send notification.");

      showToast("success", "Notification sent successfully!");
      setForm({
        title: "",
        message: "",
        targetGroup: [],
        specificIds: [],
        image: null,
      });
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      showToast("error", err.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  const previewTitle = form.title || "Notification Title";
  const previewMessage =
    form.message || "Your notification message will appear here...";

  return (
    <DashboardLayout>
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-sm shadow-xl text-sm font-medium ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.msg}
        </div>
      )}

      <div className="ml-8 max-w-[99%] mt-2">
        {/* ── Page Title row (matches AllProduct header style) ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF7B1D]" />
            <h1 className="text-lg font-bold text-gray-800">
              Push Notification
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Send targeted push notifications to Users, Vendors &amp; Riders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            {/* Notification Content */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#FF7B1D] px-4 py-3">
                <h2 className="text-sm font-bold text-black flex items-center gap-2">
                  <Bell size={15} /> Notification Content
                </h2>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. New Update Available"
                    maxLength={100}
                    className="w-full px-3 py-2 border border-orange-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] text-sm"
                  />
                  <p className="text-right text-xs text-gray-400 mt-0.5">
                    {form.title.length}/100
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="e.g. We have updated our terms of service. Please review."
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-orange-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] text-sm resize-none"
                  />
                  <p className="text-right text-xs text-gray-400 mt-0.5">
                    {form.message.length}/500
                  </p>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#FF7B1D] px-4 py-3">
                <h2 className="text-sm font-bold text-black flex items-center gap-2">
                  <Users size={15} /> Target Audience
                </h2>
              </div>
              <div className="p-5 text-sm">
                <p className="text-xs text-gray-500 mb-3">
                  Select one or more groups to receive this notification.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {TARGET_GROUPS.map(({ key, label, icon: Icon, dot }) => {
                    const active = form.targetGroup.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleGroup(key)}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-sm border-2 font-semibold text-sm transition-all ${
                          active
                            ? "bg-[#FF7B1D] border-[#FF7B1D] text-white"
                            : "bg-white border-gray-300 text-gray-600 hover:border-orange-400"
                        }`}
                      >
                        {active && (
                          <CheckCircle
                            size={14}
                            className="absolute top-2 right-2 opacity-90"
                          />
                        )}
                        <Icon size={22} />
                        {label}
                      </button>
                    );
                  })}
                </div>

                {form.targetGroup.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.targetGroup.map((g) => {
                      const grp = TARGET_GROUPS.find((t) => t.key === g);
                      return (
                        <span
                          key={g}
                          className="flex items-center gap-1.5 text-xs bg-orange-100 text-orange-700 font-semibold px-3 py-1 rounded-full"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${grp?.dot}`}
                          />
                          {g}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#FF7B1D] px-4 py-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-black flex items-center gap-2">
                  <Image size={15} /> Notification Image
                </h2>
                <span className="text-xs bg-white/30 text-black px-2 py-0.5 rounded-full font-medium">
                  Optional
                </span>
              </div>
              <div className="p-5">
                {imagePreview ? (
                  <div className="relative w-full rounded-sm overflow-hidden border-2 border-orange-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow"
                    >
                      <X size={13} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-3 py-1">
                      {form.image?.name}
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="notif-image"
                    className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-orange-400 rounded-sm bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
                  >
                    <Image size={26} className="text-orange-400" />
                    <p className="text-sm font-semibold text-orange-600">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </label>
                )}
                <input
                  ref={fileRef}
                  id="notif-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit button — matches AllProduct green submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-sm transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Push Notification
                </>
              )}
            </button>
          </form>

          {/* ── Right: Live Preview ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#FF7B1D] px-4 py-3">
                  <h2 className="text-sm font-bold text-black flex items-center gap-2">
                    <Smartphone size={15} /> Live Preview
                  </h2>
                </div>

                <div className="p-5">
                  {/* Phone mockup */}
                  <div className="flex justify-center mb-5">
                    <div className="w-60 bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
                      <div className="w-16 h-4 bg-black rounded-full mx-auto mb-2" />
                      <div className="bg-gray-100 rounded-[1.8rem] overflow-hidden min-h-[360px] px-3 pt-4 pb-6">
                        <div className="flex justify-between items-center px-2 mb-4">
                          <span className="text-[10px] font-bold text-gray-700">
                            9:41
                          </span>
                          <div className="flex gap-1 items-center">
                            <div className="w-3 h-1.5 bg-gray-700 rounded-sm" />
                            <div className="w-1 h-1 bg-gray-700 rounded-full" />
                          </div>
                        </div>

                        {/* Notification card */}
                        <div className="bg-white rounded-2xl shadow-md p-3 mx-1">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#FF7B1D]">
                              <Bell size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-[11px] font-bold text-gray-800 truncate">
                                  RushBaskets
                                </p>
                                <p className="text-[9px] text-gray-400 ml-1 shrink-0">
                                  now
                                </p>
                              </div>
                              <p className="text-[11px] font-semibold text-gray-900 mt-0.5 leading-tight">
                                {previewTitle}
                              </p>
                              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed line-clamp-3">
                                {previewMessage}
                              </p>
                            </div>
                          </div>
                          {imagePreview && (
                            <div className="mt-2 rounded-xl overflow-hidden">
                              <img
                                src={imagePreview}
                                alt="Notification"
                                className="w-full h-20 object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {form.targetGroup.length > 0 && (
                          <div className="mt-3 px-1">
                            <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                              Sending to
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {form.targetGroup.map((g) => {
                                const grp = TARGET_GROUPS.find(
                                  (t) => t.key === g,
                                );
                                return (
                                  <span
                                    key={g}
                                    className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${g === "User" ? "bg-blue-100 text-blue-700" : g === "Vendor" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${grp?.dot}`}
                                    />
                                    {g}s
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="w-20 h-1 bg-gray-600 rounded-full mx-auto mt-2" />
                    </div>
                  </div>

                  {/* Summary table — matches AllProduct table feel */}
                  <div className="overflow-hidden rounded-sm border border-gray-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#FF7B1D] text-black">
                          <th className="p-2 text-left font-bold">Field</th>
                          <th className="p-2 text-right font-bold">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            label: "Title",
                            value: form.title || (
                              <span className="text-gray-300 italic">
                                Not set
                              </span>
                            ),
                          },
                          {
                            label: "Message",
                            value: form.message ? (
                              form.message.length > 30 ? (
                                form.message.slice(0, 30) + "…"
                              ) : (
                                form.message
                              )
                            ) : (
                              <span className="text-gray-300 italic">
                                Not set
                              </span>
                            ),
                          },
                          {
                            label: "Groups",
                            value:
                              form.targetGroup.length > 0 ? (
                                form.targetGroup.join(", ")
                              ) : (
                                <span className="text-gray-300 italic">
                                  None
                                </span>
                              ),
                          },
                          {
                            label: "Image",
                            value: form.image ? (
                              <span className="text-green-600 font-semibold">
                                Attached
                              </span>
                            ) : (
                              <span className="text-gray-300 italic">None</span>
                            ),
                          },
                        ].map(({ label, value }, idx) => (
                          <tr
                            key={label}
                            className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-orange-50" : "bg-white"}`}
                          >
                            <td className="p-2 font-semibold text-gray-600">
                              {label}
                            </td>
                            <td className="p-2 text-right text-gray-800 font-medium">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PushNotification;
