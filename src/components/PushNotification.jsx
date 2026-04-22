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
  { key: "User", label: "Users", icon: Users, dot: "bg-blue-500", tag: "user" },
  {
    key: "Vendor",
    label: "Vendors",
    icon: Store,
    dot: "bg-purple-500",
    tag: "vendor",
  },
  {
    key: "Rider",
    label: "Riders",
    icon: Bike,
    dot: "bg-green-500",
    tag: "rider",
  },
];

const TAG_STYLES = {
  User: {
    wrap: "bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100",
    dot: "bg-blue-500",
  },
  Vendor: {
    wrap: "bg-purple-50 text-purple-700 border border-purple-200 ring-1 ring-purple-100",
    dot: "bg-purple-500",
  },
  Rider: {
    wrap: "bg-green-50 text-green-700 border border-green-200 ring-1 ring-green-100",
    dot: "bg-green-500",
  },
};

const PHONE_TAG_STYLES = {
  User: "bg-blue-100 text-blue-700",
  Vendor: "bg-purple-100 text-purple-700",
  Rider: "bg-green-100 text-green-700",
};

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
          className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={15} />
          ) : (
            <AlertCircle size={15} />
          )}
          {toast.msg}
        </div>
      )}

      <div className="px-1 mt-3 max-w-full">
        {/* ── Page Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF7B1D]" />
            <h1 className="text-sm font-bold text-gray-800">
              Push Notification
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Send targeted push notifications to Users, Vendors &amp; Riders
          </p>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* ── LEFT: Form ── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            {/* Notification Content Card */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
              <div className="px-4 py-3 bg-gradient-to-r from-[#FF7B1D] to-orange-400 flex items-center gap-2">
                <Bell size={13} className="text-[#1a0a00]" />
                <span className="text-xs font-bold text-[#1a0a00] tracking-wide uppercase">
                  Notification Content
                </span>
              </div>
              <div className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
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
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] text-sm text-gray-700 placeholder:text-gray-400 transition-colors"
                  />
                  <p className="text-right text-[10px] text-gray-400 mt-1">
                    {form.title.length}/100
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
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
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] text-sm text-gray-700 placeholder:text-gray-400 resize-none transition-colors"
                  />
                  <p className="text-right text-[10px] text-gray-400 mt-1">
                    {form.message.length}/500
                  </p>
                </div>
              </div>
            </div>

            {/* Target Audience Card */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
              <div className="px-4 py-3 bg-gradient-to-r from-[#FF7B1D] to-orange-400 flex items-center gap-2">
                <Users size={13} className="text-[#1a0a00]" />
                <span className="text-xs font-bold text-[#1a0a00] tracking-wide uppercase">
                  Target Audience
                </span>
              </div>
              <div className="p-5">
                <p className="text-[10px] text-gray-400 font-medium mb-3">
                  Select one or more groups to receive this notification.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {TARGET_GROUPS.map(({ key, label, icon: Icon }) => {
                    const active = form.targetGroup.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleGroup(key)}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-semibold text-xs transition-all duration-150 ${
                          active
                            ? "bg-[#FF7B1D] border-[#FF7B1D] text-white shadow-sm shadow-orange-200"
                            : "bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"
                        }`}
                      >
                        {active && (
                          <CheckCircle
                            size={12}
                            className="absolute top-2 right-2 opacity-90"
                          />
                        )}
                        <Icon size={20} />
                        {label}
                      </button>
                    );
                  })}
                </div>

                {form.targetGroup.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.targetGroup.map((g) => {
                      const style = TAG_STYLES[g];
                      return (
                        <span
                          key={g}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1 rounded-full ${style.wrap}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                          />
                          {g}s
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload Card */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
              <div className="px-4 py-3 bg-gradient-to-r from-[#FF7B1D] to-orange-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image size={13} className="text-[#1a0a00]" />
                  <span className="text-xs font-bold text-[#1a0a00] tracking-wide uppercase">
                    Notification Image
                  </span>
                </div>
                <span className="text-[10px] bg-white/30 text-[#1a0a00] font-semibold px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <div className="p-5">
                {imagePreview ? (
                  <div className="relative w-full rounded-xl overflow-hidden border-2 border-orange-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-36 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow transition-colors"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-3 py-1 font-medium">
                      {form.image?.name}
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="notif-image"
                    className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
                  >
                    <Image size={22} className="text-orange-400" />
                    <p className="text-xs font-semibold text-orange-600">
                      Click to upload image
                    </p>
                    <p className="text-[10px] text-gray-400">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={15} /> Send Push Notification
                </>
              )}
            </button>
          </form>

          {/* ── RIGHT: Live Preview ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                {/* Card Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-[#FF7B1D] to-orange-400 flex items-center gap-2">
                  <Smartphone size={13} className="text-[#1a0a00]" />
                  <span className="text-xs font-bold text-[#1a0a00] tracking-wide uppercase">
                    Live Preview
                  </span>
                </div>

                <div className="p-5">
                  {/* Phone Mockup */}
                  <div className="flex justify-center mb-5">
                    <div className="w-52 bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
                      <div className="w-14 h-3.5 bg-black rounded-full mx-auto mb-2" />
                      <div className="bg-gray-100 rounded-[1.8rem] overflow-hidden min-h-[320px] px-3 pt-4 pb-5">
                        {/* Status Bar */}
                        <div className="flex justify-between items-center px-2 mb-4">
                          <span className="text-[9px] font-bold text-gray-700">
                            9:41
                          </span>
                          <div className="flex gap-1 items-center">
                            <div className="w-3 h-1.5 bg-gray-700 rounded-sm" />
                            <div className="w-1 h-1 bg-gray-700 rounded-full" />
                          </div>
                        </div>

                        {/* Notification Card */}
                        <div className="bg-white rounded-2xl shadow-md p-3 mx-1">
                          <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-xl bg-[#FF7B1D] flex items-center justify-center shrink-0">
                              <Bell size={13} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-gray-800 truncate">
                                  RushBaskets
                                </p>
                                <p className="text-[8px] text-gray-400 ml-1 shrink-0">
                                  now
                                </p>
                              </div>
                              <p className="text-[10px] font-semibold text-gray-900 mt-0.5 leading-tight">
                                {previewTitle}
                              </p>
                              <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed line-clamp-3">
                                {previewMessage}
                              </p>
                            </div>
                          </div>
                          {imagePreview && (
                            <div className="mt-2 rounded-xl overflow-hidden">
                              <img
                                src={imagePreview}
                                alt="Notification"
                                className="w-full h-16 object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {/* Sending to tags */}
                        {form.targetGroup.length > 0 && (
                          <div className="mt-3 px-1">
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                              Sending to
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {form.targetGroup.map((g) => (
                                <span
                                  key={g}
                                  className={`inline-flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-full ${PHONE_TAG_STYLES[g]}`}
                                >
                                  <span
                                    className={`w-1 h-1 rounded-full ${TAG_STYLES[g]?.dot}`}
                                  />
                                  {g}s
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="w-16 h-1 bg-gray-600 rounded-full mx-auto mt-2" />
                    </div>
                  </div>

                  {/* Summary Table */}
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#FF7B1D] to-orange-400">
                          <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#1a0a00] tracking-wider uppercase">
                            Field
                          </th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-bold text-[#1a0a00] tracking-wider uppercase">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            label: "Title",
                            value: form.title || (
                              <span className="text-gray-300 italic font-normal">
                                Not set
                              </span>
                            ),
                          },
                          {
                            label: "Message",
                            value: form.message ? (
                              form.message.length > 28 ? (
                                form.message.slice(0, 28) + "…"
                              ) : (
                                form.message
                              )
                            ) : (
                              <span className="text-gray-300 italic font-normal">
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
                                <span className="text-gray-300 italic font-normal">
                                  None
                                </span>
                              ),
                          },
                          {
                            label: "Image",
                            value: form.image ? (
                              <span className="text-emerald-600 font-bold">
                                Attached
                              </span>
                            ) : (
                              <span className="text-gray-300 italic font-normal">
                                None
                              </span>
                            ),
                          },
                        ].map(({ label, value }, idx) => (
                          <tr
                            key={label}
                            className={`border-b border-gray-50 ${
                              idx % 2 === 0 ? "bg-orange-50/60" : "bg-white"
                            }`}
                          >
                            <td className="px-3 py-2 font-semibold text-gray-500">
                              {label}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700 font-medium">
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
