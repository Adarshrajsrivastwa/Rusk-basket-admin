import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/image 1.png";
import api from "../api/api";
import axios from "axios";
import { BASE_URL } from "../api/api";
import {
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Package,
  BarChart2,
  Bell,
  ShieldCheck,
  Store,
  Pencil,
} from "lucide-react";

// ── Grocery SVG Illustration ──────────────────────────────────────────────────
const GroceryIllustration = () => (
  <svg
    viewBox="0 0 420 340"
    className="w-full h-auto max-h-64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="210" cy="170" r="155" fill="white" fillOpacity="0.07" />
    <circle cx="210" cy="170" r="110" fill="white" fillOpacity="0.07" />
    <path
      d="M120 210 L140 270 L280 270 L300 210 Z"
      fill="white"
      fillOpacity="0.9"
    />
    <path
      d="M115 210 H305"
      stroke="white"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M155 210 L140 170"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M265 210 L280 170"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <line
      x1="155"
      y1="230"
      x2="165"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="175"
      y1="215"
      x2="178"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="195"
      y1="212"
      x2="195"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="215"
      y1="212"
      x2="213"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="235"
      y1="213"
      x2="230"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="255"
      y1="218"
      x2="247"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <path
      d="M165 170 Q210 120 255 170"
      stroke="white"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
    <ellipse
      cx="110"
      cy="175"
      rx="10"
      ry="30"
      fill="#fb923c"
      transform="rotate(-20 110 175)"
    />
    <path
      d="M110 148 Q100 130 90 128"
      stroke="#4ade80"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M110 148 Q112 128 108 122"
      stroke="#4ade80"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M110 148 Q122 132 124 126"
      stroke="#4ade80"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <ellipse cx="175" cy="188" rx="22" ry="24" fill="#ef4444" />
    <ellipse
      cx="167"
      cy="186"
      rx="10"
      ry="13"
      fill="#f87171"
      fillOpacity="0.5"
    />
    <path
      d="M175 167 Q178 158 185 155"
      stroke="#4ade80"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M175 167 Q173 158 176 152"
      stroke="#4ade80"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <rect
      x="196"
      y="168"
      width="28"
      height="38"
      rx="3"
      fill="white"
      fillOpacity="0.9"
    />
    <polygon points="196,168 210,152 224,168" fill="white" fillOpacity="0.7" />
    <rect
      x="200"
      y="178"
      width="20"
      height="14"
      rx="2"
      fill="#3b82f6"
      fillOpacity="0.8"
    />
    <text
      x="210"
      y="188"
      textAnchor="middle"
      fontSize="6"
      fill="white"
      fontWeight="bold"
    >
      MILK
    </text>
    <rect x="234" y="195" width="8" height="18" rx="4" fill="#4ade80" />
    <circle cx="238" cy="188" r="12" fill="#22c55e" />
    <circle cx="228" cy="192" r="9" fill="#16a34a" />
    <circle cx="248" cy="192" r="9" fill="#16a34a" />
    <circle cx="232" cy="183" r="7" fill="#22c55e" />
    <circle cx="244" cy="183" r="7" fill="#22c55e" />
    <path
      d="M290 160 Q320 140 330 165 Q325 185 300 190 Q280 188 290 160Z"
      fill="#fbbf24"
    />
    <path
      d="M290 160 Q315 148 326 167"
      stroke="#f59e0b"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="310" cy="215" r="20" fill="#ef4444" />
    <ellipse cx="303" cy="213" rx="7" ry="9" fill="#f87171" fillOpacity="0.4" />
    <path
      d="M310 197 Q308 188 304 185"
      stroke="#4ade80"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M310 197 Q313 187 318 185"
      stroke="#4ade80"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="80" cy="230" r="4" fill="white" fillOpacity="0.6" />
    <circle cx="345" cy="175" r="3" fill="white" fillOpacity="0.5" />
    <circle cx="95" cy="135" r="5" fill="white" fillOpacity="0.4" />
    <circle cx="360" cy="240" r="4" fill="white" fillOpacity="0.5" />
    <circle cx="70" cy="280" r="3" fill="white" fillOpacity="0.3" />
    <ellipse
      cx="210"
      cy="295"
      rx="130"
      ry="10"
      fill="white"
      fillOpacity="0.15"
    />
  </svg>
);

// ── OTP Input Boxes with blinking cursor ─────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([]);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const digits = (value + "    ").slice(0, 4).split("");

  const handleInput = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const newDigits = [...digits];
    newDigits[idx] = val[val.length - 1];
    const newOtp = newDigits.join("").trim();
    onChange(newOtp);
    if (idx < 3) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const newDigits = [...digits];
      if (newDigits[idx].trim()) {
        newDigits[idx] = " ";
      } else if (idx > 0) {
        newDigits[idx - 1] = " ";
        inputsRef.current[idx - 1]?.focus();
      }
      onChange(newDigits.join("").trim());
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 3);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <>
      <style>{`
        @keyframes blink-bar {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blink-bar {
          animation: blink-bar 1s step-start infinite;
        }
      `}</style>
      <div className="flex gap-3 justify-start">
        {[0, 1, 2, 3].map((idx) => {
          const isFocused = focusedIdx === idx;
          const isEmpty = !digits[idx].trim();
          return (
            <div key={idx} className="relative">
              <input
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[idx].trim()}
                onChange={(e) => handleInput(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                onFocus={(e) => {
                  e.target.select();
                  setFocusedIdx(idx);
                }}
                onBlur={() => setFocusedIdx(null)}
                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl text-gray-800 focus:outline-none transition-all bg-white caret-transparent
                  ${
                    isFocused
                      ? "border-orange-500 ring-2 ring-orange-200 shadow-md"
                      : digits[idx].trim()
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-200"
                  }`}
              />
              {/* Blinking cursor bar — shown only when focused & empty */}
              {isFocused && isEmpty && (
                <span className="blink-bar pointer-events-none absolute left-1/2 bottom-2.5 -translate-x-1/2 w-[2px] h-5 bg-orange-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

// ── Role Toggle Switch ────────────────────────────────────────────────────────
const RoleToggle = ({ value, onChange, disabled }) => {
  const isVendor = value === "vendor";
  return (
    <div
      className={`flex items-center w-full bg-gray-100 rounded-full p-1 relative ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {/* Sliding pill */}
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-orange-500 rounded-full shadow transition-all duration-300 ease-in-out ${isVendor ? "left-[calc(50%+2px)]" : "left-1"}`}
      />
      {/* Admin */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange("admin")}
        className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${!isVendor ? "text-white" : "text-gray-500"}`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Admin
      </button>
      {/* Vendor */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange("vendor")}
        className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${isVendor ? "text-white" : "text-gray-500"}`}
      >
        <Store className="w-3.5 h-3.5" />
        Vendor
      </button>
    </div>
  );
};

// ── Feature Pill ─────────────────────────────────────────────────────────────
const featurePills = [
  { icon: ShoppingCart, label: "Orders" },
  { icon: Package, label: "Inventory" },
  { icon: BarChart2, label: "Analytics" },
  { icon: Bell, label: "Alerts" },
];

// ── Main Login Component ──────────────────────────────────────────────────────
export default function Login() {
  const [formData, setFormData] = useState({
    mobile: "",
    role: "admin",
    otp: "",
  });
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((p) => p - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setError("");
  };

  const validateMobile = (m) => /^[6-9]\d{9}$/.test(m);

  const handleSendOTP = async (e) => {
    e?.preventDefault?.();
    if (!validateMobile(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setSending(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { mobile: formData.mobile, role: formData.role },
        {
          withCredentials: false,
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        },
      );
      if (response.data.success) {
        setOtpSent(true);
        setSuccess("OTP sent successfully to your mobile number");
        setTimer(60);
      } else {
        setError(
          response.data.message || "Failed to send OTP. Please try again.",
        );
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;
      if (serverMsg) setError(serverMsg);
      else if (status === 401)
        setError("You are not authorized. Please check your credentials.");
      else if (status === 403)
        setError("Access denied. You do not have permission to log in.");
      else if (status === 404)
        setError("Account not found. Please check your mobile number.");
      else if (status === 429)
        setError("Too many attempts. Please wait a moment and try again.");
      else if (status >= 500)
        setError("Server is currently unavailable. Please try again later.");
      else if (err.request)
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      else setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault?.();
    if (!formData.otp || formData.otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/verify-otp`,
        { mobile: formData.mobile, otp: formData.otp, role: formData.role },
        {
          withCredentials: false,
          headers: { "Content-Type": "application/json" },
        },
      );
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token);
        if (res.data?.data) {
          localStorage.setItem("user", JSON.stringify(res.data.data));
          localStorage.setItem("userData", JSON.stringify(res.data.data));
        }
        const role = res.data?.data?.role || formData.role;
        localStorage.setItem("userRole", role);
        setSuccess("Login successful! Redirecting...");
        setTimeout(
          () =>
            navigate(role === "vendor" ? "/vendor/dashboard" : "/dashboard"),
          1000,
        );
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;
      if (serverMsg) setError(serverMsg);
      else if (status === 401)
        setError("Incorrect OTP. Please check and try again.");
      else if (status === 403)
        setError("Access denied. You are not authorized to access this panel.");
      else if (status === 404)
        setError("Account not found. Please check your mobile number.");
      else if (status === 410)
        setError("OTP has expired. Please request a new one.");
      else if (status === 429)
        setError("Too many failed attempts. Please wait before trying again.");
      else if (status >= 500)
        setError("Server is currently unavailable. Please try again later.");
      else if (err.request)
        setError("Network error. Please check your internet connection.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") otpSent ? handleVerifyOTP(e) : handleSendOTP(e);
  };

  const handleResendOTP = () => {
    if (timer === 0) handleSendOTP({ preventDefault: () => {} });
  };

  const roleLabel = formData.role === "admin" ? "Admin" : "Vendor";

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="w-full max-w-5xl h-full max-h-[92vh] bg-white rounded-md shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* ── Left: Form ── */}
        <div className="w-full lg:w-[48%] h-full flex flex-col justify-center px-8 py-6 bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="RushBaskets Logo"
              className="h-18 object-contain mix-blend-multiply"
            />
          </div>

          {/* Title */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {roleLabel} Login
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              This panel is strictly for authorized{" "}
              {formData.role === "admin" ? "administrators" : "vendors"}.
              Unauthorized access is prohibited.
            </p>
          </div>

          {/* Error/Success */}
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-red-700">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-green-700">{success}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* ── Role Toggle Switch ── */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Login As
              </label>
              <RoleToggle
                value={formData.role}
                onChange={handleRoleChange}
                disabled={otpSent}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={otpSent}
                  maxLength="10"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {/* Change number button — right side of mobile field, shown when OTP sent */}
                {otpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setFormData((prev) => ({ ...prev, otp: "" }));
                      setError("");
                      setSuccess("");
                      setTimer(0);
                    }}
                    title="Change mobile number"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg px-2 py-1 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                    Change
                  </button>
                )}
              </div>
            </div>

            {/* OTP Boxes */}
            {otpSent && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3">
                  Enter OTP
                </label>
                <OtpInput
                  value={formData.otp}
                  onChange={(otp) => {
                    setFormData((prev) => ({ ...prev, otp }));
                    setError("");
                  }}
                />
                {/* Resend */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Didn't receive OTP?</span>
                  {timer > 0 ? (
                    <span className="text-gray-400">Resend in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-orange-600 font-semibold hover:text-orange-700 transition"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={otpSent ? handleVerifyOTP : handleSendOTP}
              disabled={sending || verifying}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {sending || verifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {sending ? "Sending OTP..." : "Verifying..."}
                </>
              ) : otpSent ? (
                <>Verify & Login →</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send OTP
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Right: Illustration ── */}
        <div className="hidden lg:flex w-[52%] h-full flex-col items-center justify-center px-10 py-8 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-center relative overflow-hidden">
          <div className="absolute top-8 left-8 w-40 h-40 bg-white rounded-full opacity-5 blur-3xl" />
          <div className="absolute bottom-16 right-12 w-52 h-52 bg-yellow-200 rounded-full opacity-10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full opacity-5 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center gap-4 w-full">
            <span className="text-orange-100 text-xs font-semibold uppercase tracking-widest">
              E-Commerce Management
            </span>
            <h2 className="text-white text-4xl font-bold leading-tight">
              Welcome Back
              <br />
              <span className="text-orange-100 text-2xl font-medium">
                {roleLabel}
              </span>
            </h2>

            <div className="w-full max-w-sm">
              <GroceryIllustration />
            </div>

            <p className="text-orange-50 text-sm max-w-xs leading-relaxed">
              Manage your grocery operations with{" "}
              <span className="font-bold text-white">RushBaskets</span> — fast,
              fresh, and reliable.
            </p>

            {/* Feature pills with lucide icons */}
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {featurePills.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
