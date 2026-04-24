import React, { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  MapPin,
  FileText,
  Banknote,
  Search,
  Loader2,
  AlertCircle,
  ChevronRight,
  Store,
  Phone,
  Mail,
  CreditCard,
  Upload,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import api from "../api/api";

/* ─── Reusable field wrapper ─────────────────────────────────────────────── */
const Field = ({ label, error, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
      {label}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

/* ─── Section header ─────────────────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF7B1D] to-orange-400 flex items-center justify-center shadow-sm shadow-orange-200">
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  </div>
);

/* ─── Input styles ───────────────────────────────────────────────────────── */
const inputCls = (error) =>
  `w-full px-3 py-2.5 text-sm border rounded-xl transition-all outline-none focus:ring-2 focus:ring-orange-200 ${
    error
      ? "border-red-300 bg-red-50/30 focus:border-red-400"
      : "border-gray-200 bg-white focus:border-orange-400 hover:border-orange-300"
  }`;

const readonlyCls =
  "w-full px-3 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 text-gray-500 outline-none cursor-not-allowed";

const fileCls =
  "w-full text-sm border border-gray-200 rounded-xl file:mr-3 file:py-2 file:px-3 file:border-0 file:rounded-lg file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 text-gray-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-200";

/* ─── Step indicator ─────────────────────────────────────────────────────── */
const StepIndicator = ({ current }) => (
  <div className="flex items-center gap-2">
    {[1, 2].map((s) => (
      <React.Fragment key={s}>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            current >= s
              ? "bg-[#FF7B1D] text-white shadow-sm shadow-orange-200"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] font-bold border-current">
            {current > s ? "✓" : s}
          </span>
          {s === 1 ? "Details" : "Verify"}
        </div>
        {s < 2 && (
          <ChevronRight
            className={`w-3.5 h-3.5 ${current >= 2 ? "text-[#FF7B1D]" : "text-gray-300"}`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
const AddVendorModal = ({
  isOpen,
  onClose,
  isEdit = false,
  vendorData = null,
}) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emptyForm = {
    vendorName: "",
    contactNumber: "",
    altContactNumber: "",
    email: "",
    gender: "",
    dob: "",
    age: "",
    storeId: "",
    storeName: "",
    storeImage: null,
    storeAddress1: "",
    storeAddress2: "",
    pinCode: "",
    city: "",
    state: "",
    storeLat: "",
    storeLong: "",
    panCardFront: null,
    panCardBack: null,
    aadharFront: null,
    aadharBack: null,
    drivingLicense: null,
    ifscCode: "",
    accountNumber: "",
    bankName: "",
    cancelCheque: null,
    handlingChargePercentage: "20",
    serviceRadius: "5",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState("");
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setSuccess("");
    setOtp(["", "", "", ""]);
    setStep(1);
    setErrors({});
    setShowMap(false);
    mapInstanceRef.current = null;
    markerInstanceRef.current = null;
    if (isEdit && vendorData) {
      const dob = vendorData.dateOfBirth
        ? new Date(vendorData.dateOfBirth).toISOString().split("T")[0]
        : "";
      setFormData({
        vendorName: vendorData.vendorName || "",
        contactNumber: vendorData.contactNumber || "",
        altContactNumber: vendorData.altContactNumber || "",
        email: vendorData.email || "",
        gender: vendorData.gender || "",
        dob,
        age: vendorData.age ? String(vendorData.age) : "",
        storeId: vendorData.storeId || "",
        storeName: vendorData.storeName || "",
        storeImage: null,
        storeAddress1: vendorData.storeAddress?.line1 || "",
        storeAddress2: vendorData.storeAddress?.line2 || "",
        pinCode: vendorData.storeAddress?.pinCode || "",
        city: vendorData.storeAddress?.city || "",
        state: vendorData.storeAddress?.state || "",
        storeLat: vendorData.storeAddress?.latitude
          ? String(vendorData.storeAddress.latitude)
          : "",
        storeLong: vendorData.storeAddress?.longitude
          ? String(vendorData.storeAddress.longitude)
          : "",
        panCardFront: null,
        panCardBack: null,
        aadharFront: null,
        aadharBack: null,
        drivingLicense: null,
        ifscCode: vendorData.bankDetails?.ifsc || "",
        accountNumber: vendorData.bankDetails?.accountNumber || "",
        bankName: vendorData.bankDetails?.bankName || "",
        cancelCheque: null,
        handlingChargePercentage: vendorData.handlingChargePercentage
          ? String(vendorData.handlingChargePercentage)
          : "20",
        serviceRadius:
          vendorData.storeInfo?.serviceRadius || vendorData.serviceRadius
            ? String(
                vendorData.storeInfo?.serviceRadius || vendorData.serviceRadius,
              )
            : "5",
      });
    } else {
      setFormData({ ...emptyForm });
      generateStoreId();
    }
  }, [isOpen, isEdit, vendorData]);

  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => setMapLoaded(true);
      script.onerror = () => setMapError("Failed to load map library.");
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen && showMap && mapLoaded && window.L) {
      const timer = setTimeout(initializeOpenStreetMap, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showMap, mapLoaded]);

  const initializeOpenStreetMap = () => {
    const mapContainer = document.getElementById("vendor-map-container");
    if (!mapContainer || !window.L || mapInstanceRef.current) return;
    const center =
      formData.storeLat && formData.storeLong
        ? [parseFloat(formData.storeLat), parseFloat(formData.storeLong)]
        : [23.2599, 77.4126];
    const map = window.L.map(mapContainer).setView(center, 15);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapInstanceRef.current = map;
    let marker = null;
    if (formData.storeLat && formData.storeLong) {
      marker = window.L.marker(center, { draggable: true }).addTo(map);
      marker.on("dragend", (e) =>
        updateLocationFromCoords(
          e.target.getLatLng().lat,
          e.target.getLatLng().lng,
        ),
      );
      markerInstanceRef.current = marker;
    }
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      updateLocationFromCoords(lat, lng);
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = window.L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on("dragend", (ev) =>
          updateLocationFromCoords(
            ev.target.getLatLng().lat,
            ev.target.getLatLng().lng,
          ),
        );
        markerInstanceRef.current = marker;
      }
    });
  };

  const updateLocationFromCoords = async (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      storeLat: lat.toFixed(6),
      storeLong: lng.toFixed(6),
    }));
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await res.json();
      if (data?.address) {
        const addr = data.address;
        setFormData((prev) => ({
          ...prev,
          city: addr.city || addr.town || addr.village || prev.city,
          state: addr.state || prev.state,
          pinCode: addr.postcode || prev.pinCode,
          storeAddress1:
            addr.road ||
            addr.house_number ||
            data.display_name?.split(",")[0] ||
            prev.storeAddress1,
        }));
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (!formData.dob) return;
    const birth = new Date(formData.dob),
      today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    setFormData((prev) => ({ ...prev, age: String(age) }));
  }, [formData.dob]);

  useEffect(() => {
    if (formData.pinCode.length !== 6) return;
    (async () => {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${formData.pinCode}`,
        );
        const data = await res.json();
        if (data[0].Status === "Success") {
          const po = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: po.District,
            state: po.State,
          }));
          setErrors((prev) => ({ ...prev, pinCode: "" }));
        } else {
          setErrors((prev) => ({ ...prev, pinCode: "Invalid PIN code" }));
        }
      } catch {
        setErrors((prev) => ({ ...prev, pinCode: "Error fetching location" }));
      }
    })();
  }, [formData.pinCode]);

  const generateStoreId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({ ...prev, storeId: `RB${randomNum}` }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocationFromCoords(pos.coords.latitude, pos.coords.longitude);
        if (mapInstanceRef.current && markerInstanceRef.current) {
          const p = [pos.coords.latitude, pos.coords.longitude];
          markerInstanceRef.current.setLatLng(p);
          mapInstanceRef.current.setView(p, 15);
        }
      },
      () => alert("Unable to fetch location. Please use map to select."),
    );
  };

  const validateForm = () => {
    const e = {};
    if (!formData.vendorName.trim()) e.vendorName = "Vendor name is required";
    if (!formData.contactNumber.trim())
      e.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber))
      e.contactNumber = "Must be 10 digits";
    if (
      formData.altContactNumber &&
      !/^\d{10}$/.test(formData.altContactNumber)
    )
      e.altContactNumber = "Must be 10 digits";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email";
    if (!formData.gender) e.gender = "Select gender";
    if (!formData.dob) {
      e.dob = "Date of birth required";
    } else {
      const birthDate = new Date(formData.dob),
        today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      )
        age--;
      if (age < 18) e.dob = "Age must be at least 18 years";
    }
    if (!formData.storeName.trim()) e.storeName = "Store name required";
    if (!formData.storeAddress1.trim()) e.storeAddress1 = "Address required";
    if (!formData.pinCode.trim()) e.pinCode = "PIN code required";
    else if (!/^\d{6}$/.test(formData.pinCode))
      e.pinCode = "PIN must be 6 digits";
    if (!formData.ifscCode.trim()) e.ifscCode = "IFSC required";
    if (!formData.accountNumber.trim())
      e.accountNumber = "Account number required";
    if (!formData.bankName.trim()) e.bankName = "Bank name required";
    if (!formData.handlingChargePercentage.trim())
      e.handlingChargePercentage = "Required";
    else {
      const p = parseFloat(formData.handlingChargePercentage);
      if (isNaN(p) || p < 0 || p > 100)
        e.handlingChargePercentage = "Must be 0–100";
    }
    if (!formData.serviceRadius.trim()) e.serviceRadius = "Required";
    else {
      const sr = parseFloat(formData.serviceRadius);
      if (isNaN(sr) || sr < 0.1) e.serviceRadius = "Min 0.1 km";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    if (files[0]) setFormData((prev) => ({ ...prev, [id]: files[0] }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const buildFormDataPayload = () => {
    const fd = new FormData();
    const s = (v) => String(v || "").trim();
    fd.append("vendorName", s(formData.vendorName));
    fd.append("contactNumber", s(formData.contactNumber).replace(/\s+/g, ""));
    if (formData.altContactNumber)
      fd.append(
        "altContactNumber",
        s(formData.altContactNumber).replace(/\s+/g, ""),
      );
    fd.append("email", s(formData.email).toLowerCase());
    fd.append("gender", s(formData.gender));
    fd.append("dateOfBirth", s(formData.dob));
    if (formData.age) fd.append("age", s(formData.age));
    fd.append("storeName", s(formData.storeName));
    fd.append("handlingChargePercentage", s(formData.handlingChargePercentage));
    const serviceRadiusValue = formData.serviceRadius
      ? parseFloat(formData.serviceRadius)
      : 5;
    if (isNaN(serviceRadiusValue) || serviceRadiusValue < 0.1)
      throw new Error("Service radius must be at least 0.1 km");
    fd.append("serviceRadius", serviceRadiusValue.toString());
    fd.append("storeAddressLine1", s(formData.storeAddress1));
    if (formData.storeAddress2)
      fd.append("storeAddressLine2", s(formData.storeAddress2));
    fd.append("pinCode", s(formData.pinCode));
    if (formData.city) fd.append("city", s(formData.city));
    if (formData.state) fd.append("state", s(formData.state));
    if (formData.storeLat) fd.append("latitude", s(formData.storeLat));
    if (formData.storeLong) fd.append("longitude", s(formData.storeLong));
    fd.append("ifsc", s(formData.ifscCode).toUpperCase());
    fd.append("accountNumber", s(formData.accountNumber));
    fd.append("bankName", s(formData.bankName));
    const maxSize = 10 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    const check = (file, name) => {
      if (!file) return;
      if (file.size > maxSize) throw new Error(`${name} exceeds 10MB limit.`);
      if (!allowed.includes(file.type))
        throw new Error(`${name} must be JPEG, PNG, or PDF.`);
    };
    check(formData.storeImage, "Store Image");
    if (formData.storeImage) fd.append("storeImage", formData.storeImage);
    check(formData.panCardFront, "PAN Card Front");
    if (formData.panCardFront) fd.append("panCardFront", formData.panCardFront);
    check(formData.panCardBack, "PAN Card Back");
    if (formData.panCardBack) fd.append("panCardBack", formData.panCardBack);
    check(formData.aadharFront, "Aadhar Front");
    if (formData.aadharFront)
      fd.append("aadharCardFront", formData.aadharFront);
    check(formData.aadharBack, "Aadhar Back");
    if (formData.aadharBack) fd.append("aadharCardBack", formData.aadharBack);
    check(formData.drivingLicense, "Driving License");
    if (formData.drivingLicense)
      fd.append("drivingLicense", formData.drivingLicense);
    check(formData.cancelCheque, "Cancel Cheque");
    if (formData.cancelCheque) fd.append("cancelCheque", formData.cancelCheque);
    return fd;
  };

  const updateVendor = async () => {
    try {
      setIsLoading(true);
      setError("");
      const hasFiles =
        formData.storeImage ||
        formData.panCardFront ||
        formData.panCardBack ||
        formData.aadharFront ||
        formData.aadharBack ||
        formData.drivingLicense ||
        formData.cancelCheque;
      let response;
      if (hasFiles) {
        let fd;
        try {
          fd = buildFormDataPayload();
        } catch (fe) {
          setError(fe.message);
          setIsLoading(false);
          return;
        }
        response = await api.put(`/api/vendor/${vendorData._id}`, fd, {
          timeout: 120000,
        });
      } else {
        const payload = {
          vendorName: formData.vendorName.trim(),
          contactNumber: formData.contactNumber.trim().replace(/\s+/g, ""),
          ...(formData.altContactNumber && {
            altContactNumber: formData.altContactNumber.trim(),
          }),
          email: formData.email.trim().toLowerCase(),
          gender: formData.gender,
          dateOfBirth: formData.dob,
          ...(formData.age && { age: Number(formData.age) }),
          storeName: formData.storeName.trim(),
          handlingChargePercentage: parseFloat(
            formData.handlingChargePercentage,
          ),
          serviceRadius: (() => {
            const sr = formData.serviceRadius
              ? parseFloat(formData.serviceRadius)
              : 5;
            if (isNaN(sr) || sr < 0.1)
              throw new Error("Service radius must be at least 0.1 km");
            return sr;
          })(),
          storeAddressLine1: formData.storeAddress1.trim(),
          ...(formData.storeAddress2 && {
            storeAddressLine2: formData.storeAddress2.trim(),
          }),
          pinCode: formData.pinCode.trim(),
          ...(formData.city && { city: formData.city.trim() }),
          ...(formData.state && { state: formData.state.trim() }),
          ...(formData.storeLat && { latitude: parseFloat(formData.storeLat) }),
          ...(formData.storeLong && {
            longitude: parseFloat(formData.storeLong),
          }),
          ifsc: formData.ifscCode.trim().toUpperCase(),
          accountNumber: formData.accountNumber.trim(),
          bankName: formData.bankName.trim(),
        };
        response = await api.put(`/api/vendor/${vendorData._id}`, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: 120000,
        });
      }
      if (response.data.success) {
        setSuccess("Vendor updated successfully!");
        setTimeout(() => {
          onClose();
          setError("");
          setSuccess("");
        }, 1500);
      } else {
        setError(
          response.data.message ||
            response.data.error ||
            "Failed to update vendor",
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || `Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createVendor = async () => {
    try {
      setIsLoading(true);
      setError("");
      let fd;
      try {
        fd = buildFormDataPayload();
      } catch (fe) {
        setError(fe.message);
        setIsLoading(false);
        return;
      }
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 120000);
      let response;
      try {
        response = await api.post("/api/vendor/create", fd, {
          signal: controller.signal,
          timeout: 120000,
        });
        clearTimeout(tid);
      } catch (fe) {
        clearTimeout(tid);
        setError(fe.response?.data?.message || fe.message || "Network error.");
        setIsLoading(false);
        return;
      }
      if (response.data.success) {
        setSuccess("Vendor registered successfully!");
        setTimeout(() => {
          onClose();
          setStep(1);
          setOtp(["", "", "", ""]);
          setError("");
          setSuccess("");
        }, 1500);
      } else {
        setError(
          response.data.error ||
            response.data.message ||
            "Failed to register vendor",
        );
      }
    } catch (err) {
      setError(`Error creating vendor: ${err.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {
        setError("Valid 10-digit Indian mobile number required (starts 6-9)");
        setIsLoading(false);
        return;
      }
      const res = await api.post("/api/vendor/send-otp", {
        contactNumber: formData.contactNumber.trim().replace(/\s+/g, ""),
      });
      if (res.data.success) {
        setSuccess(`OTP sent to ${formData.contactNumber}`);
        setStep(2);
      } else {
        setError(res.data.message || res.data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || `Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextClick = () => {
    if (!validateForm()) return;
    if (isEdit) updateVendor();
    else sendOtp();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3)
      document.getElementById(`vendor-otp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`vendor-otp-${index - 1}`)?.focus();
  };

  const handleVerifyOtp = async () => {
    const entered = otp.join("");
    if (entered.length !== 4) {
      setError("Please enter complete 4-digit OTP");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const res = await api.post("/api/vendor/verify-otp", {
        contactNumber: formData.contactNumber.trim().replace(/\s+/g, ""),
        otp: entered,
      });
      if (res.data.success) {
        setSuccess("OTP verified!");
        await new Promise((r) => setTimeout(r, 500));
        await createVendor();
      } else {
        const msg = res.data.message || res.data.error || "Invalid OTP";
        setError(
          msg.includes("expired")
            ? "OTP expired. Please request a new one."
            : "Invalid OTP. Please try again.",
        );
        setOtp(["", "", "", ""]);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative overflow-hidden border border-gray-100"
        style={{ maxHeight: "95vh", display: "flex", flexDirection: "column" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#FF7B1D] to-orange-400">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEdit
                  ? "Edit Vendor"
                  : step === 1
                    ? "Add New Vendor"
                    : "Verify Contact"}
              </h2>
              <p className="text-xs text-white/70">
                {isEdit
                  ? "Update vendor information"
                  : "Register a new vendor partner"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isEdit && <StepIndicator current={step} />}
            <button
              onClick={() => {
                setError("");
                setSuccess("");
                onClose();
              }}
              disabled={isLoading}
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Alerts ── */}
        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* ══════════════ FORM (step 1 / edit) ══════════════ */}
        {(step === 1 || isEdit) && (
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-8">
            {/* ── Personal Info ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionHeader
                icon={User}
                title="Personal Information"
                subtitle="Basic vendor identity details"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Vendor Name" error={errors.vendorName}>
                  <input
                    id="vendorName"
                    type="text"
                    value={formData.vendorName}
                    onChange={handleInputChange}
                    placeholder="Enter vendor name"
                    className={inputCls(errors.vendorName)}
                  />
                </Field>
                <Field
                  label={`Contact Number${!isEdit ? " (Login)" : ""}`}
                  error={errors.contactNumber}
                >
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="contactNumber"
                      type="text"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      maxLength="10"
                      className={`${inputCls(errors.contactNumber)} pl-9`}
                    />
                  </div>
                </Field>
                <Field
                  label="Alt. Contact Number"
                  error={errors.altContactNumber}
                >
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="altContactNumber"
                      type="text"
                      value={formData.altContactNumber}
                      onChange={handleInputChange}
                      placeholder="Alternate number"
                      maxLength="10"
                      className={`${inputCls(errors.altContactNumber)} pl-9`}
                    />
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Field label="Email ID" error={errors.email}>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="vendor@email.com"
                      className={`${inputCls(errors.email)} pl-9`}
                    />
                  </div>
                </Field>
                <Field label="Gender" error={errors.gender}>
                  <div className="flex items-center gap-4 py-2.5">
                    {["male", "female"].map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.gender === g
                              ? "border-[#FF7B1D] bg-[#FF7B1D]"
                              : "border-gray-300 group-hover:border-orange-300"
                          }`}
                        >
                          {formData.gender === g && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={handleRadioChange}
                          className="sr-only"
                        />
                        <span className="text-sm capitalize text-gray-700">
                          {g}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="Date of Birth" error={errors.dob}>
                  <input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={inputCls(errors.dob)}
                  />
                </Field>
                <Field label="Age">
                  <input
                    id="age"
                    type="text"
                    value={formData.age}
                    readOnly
                    placeholder="Auto calculated"
                    className={readonlyCls}
                  />
                </Field>
              </div>
            </div>

            {/* ── Store Info ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionHeader
                icon={Store}
                title="Store Information"
                subtitle="Location and operational details"
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Field label="Store ID">
                  <input
                    id="storeId"
                    type="text"
                    value={formData.storeId}
                    readOnly
                    className={readonlyCls}
                  />
                </Field>
                <Field label="Store Name" error={errors.storeName}>
                  <input
                    id="storeName"
                    type="text"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="Enter store name"
                    className={inputCls(errors.storeName)}
                  />
                </Field>
                <Field
                  label="Store Image"
                  hint={isEdit ? "Leave blank to keep existing" : ""}
                >
                  <input
                    id="storeImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={fileCls}
                  />
                </Field>
                <Field
                  label="Handling Charge (%)"
                  error={errors.handlingChargePercentage}
                >
                  <input
                    id="handlingChargePercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.handlingChargePercentage}
                    onChange={handleInputChange}
                    placeholder="0–100"
                    className={inputCls(errors.handlingChargePercentage)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Field
                  label="Service Radius (km)"
                  error={errors.serviceRadius}
                  hint="Min: 0.1 km · Default: 5 km"
                >
                  <input
                    id="serviceRadius"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.serviceRadius}
                    onChange={handleInputChange}
                    placeholder="5"
                    className={inputCls(errors.serviceRadius)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <Field
                  label="Store Address Line 1"
                  error={errors.storeAddress1}
                >
                  <input
                    id="storeAddress1"
                    type="text"
                    value={formData.storeAddress1}
                    onChange={handleInputChange}
                    placeholder="Building, street, area"
                    className={inputCls(errors.storeAddress1)}
                  />
                </Field>
                <Field label="Store Address Line 2">
                  <input
                    id="storeAddress2"
                    type="text"
                    value={formData.storeAddress2}
                    onChange={handleInputChange}
                    placeholder="Landmark, additional details"
                    className={inputCls(false)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="PIN Code" error={errors.pinCode}>
                  <input
                    id="pinCode"
                    type="text"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN"
                    maxLength="6"
                    className={inputCls(errors.pinCode)}
                  />
                </Field>
                <Field label="City">
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    readOnly
                    placeholder="Auto-fetched"
                    className={readonlyCls}
                  />
                </Field>
                <Field label="State">
                  <input
                    id="state"
                    type="text"
                    value={formData.state}
                    readOnly
                    placeholder="Auto-fetched"
                    className={readonlyCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <Field label="Store Latitude">
                  <input
                    id="storeLat"
                    type="text"
                    value={formData.storeLat}
                    onChange={handleInputChange}
                    placeholder="e.g. 23.259900"
                    className={inputCls(false)}
                  />
                </Field>
                <Field label="Store Longitude">
                  <input
                    id="storeLong"
                    type="text"
                    value={formData.storeLong}
                    onChange={handleInputChange}
                    placeholder="e.g. 77.412600"
                    className={inputCls(false)}
                  />
                </Field>
              </div>

              {/* Map controls */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF7B1D] hover:bg-orange-500 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-orange-200"
                >
                  <MapPin className="w-4 h-4" />
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-semibold transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Get Current Location
                </button>
              </div>

              {showMap && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  {/* Map header */}
                  <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-white" />
                        <p className="text-white text-sm font-semibold">
                          Click map to set store location
                        </p>
                      </div>
                      {formData.storeLat && formData.storeLong && (
                        <div className="flex items-center gap-3 text-xs text-white/90 bg-white/20 px-3 py-1 rounded-full">
                          <span>Lat: {formData.storeLat}</span>
                          <span className="w-px h-3 bg-white/40" />
                          <span>Lng: {formData.storeLong}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Search bar */}
                  <div className="bg-white px-4 py-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        id="vendor-map-search-input"
                        placeholder="Search address or landmark…"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                        onKeyPress={async (e) => {
                          if (e.key === "Enter" && window.L) {
                            const q = e.target.value;
                            if (!q) return;
                            try {
                              const r = await fetch(
                                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
                              );
                              const d = await r.json();
                              if (d?.length) {
                                const lat = parseFloat(d[0].lat),
                                  lng = parseFloat(d[0].lon);
                                updateLocationFromCoords(lat, lng);
                                if (mapInstanceRef.current) {
                                  mapInstanceRef.current.setView(
                                    [lat, lng],
                                    15,
                                  );
                                  if (markerInstanceRef.current)
                                    markerInstanceRef.current.setLatLng([
                                      lat,
                                      lng,
                                    ]);
                                  else {
                                    const m = window.L.marker([lat, lng], {
                                      draggable: true,
                                    }).addTo(mapInstanceRef.current);
                                    m.on("dragend", (ev) =>
                                      updateLocationFromCoords(
                                        ev.target.getLatLng().lat,
                                        ev.target.getLatLng().lng,
                                      ),
                                    );
                                    markerInstanceRef.current = m;
                                  }
                                }
                              }
                            } catch (_) {}
                          }
                        }}
                      />
                    </div>
                  </div>
                  {/* Map container */}
                  <div className="relative" style={{ height: "360px" }}>
                    {mapError ? (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <div className="text-center p-4">
                          <AlertCircle className="text-red-400 mx-auto mb-2 w-10 h-10" />
                          <p className="text-red-500 text-sm font-medium">
                            {mapError}
                          </p>
                        </div>
                      </div>
                    ) : !mapLoaded ? (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <div className="text-center">
                          <Loader2 className="animate-spin text-[#FF7B1D] mx-auto mb-2 w-7 h-7" />
                          <p className="text-gray-500 text-sm">Loading map…</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        id="vendor-map-container"
                        style={{ width: "100%", height: "100%" }}
                      />
                    )}
                    <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-2 rounded-xl shadow-sm border border-gray-200 text-xs text-gray-500">
                      <p className="font-semibold text-gray-700 mb-1">
                        📍 How to use
                      </p>
                      <p>• Click map to place marker</p>
                      <p>• Drag marker to adjust</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Documents ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionHeader
                icon={FileText}
                title="Document Upload"
                subtitle={
                  isEdit
                    ? "Optional — leave blank to keep existing files"
                    : "Upload identity verification documents"
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "panCardFront", label: "PAN Card (Front)" },
                  { id: "panCardBack", label: "PAN Card (Back)" },
                  { id: "aadharFront", label: "Aadhar Card (Front)" },
                  { id: "aadharBack", label: "Aadhar Card (Back)" },
                  { id: "drivingLicense", label: "Driving License" },
                ].map(({ id, label }) => (
                  <Field key={id} label={label}>
                    <div className="relative">
                      <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        id={id}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`${fileCls} pl-8`}
                      />
                    </div>
                  </Field>
                ))}
              </div>
            </div>

            {/* ── Bank Details ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionHeader
                icon={Banknote}
                title="Bank Details"
                subtitle="Payout and settlement information"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="IFSC Code" error={errors.ifscCode}>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="ifscCode"
                      type="text"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="e.g. HDFC0001234"
                      className={`${inputCls(errors.ifscCode)} pl-9 font-mono tracking-wide`}
                    />
                  </div>
                </Field>
                <Field label="Account Number" error={errors.accountNumber}>
                  <input
                    id="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className={`${inputCls(errors.accountNumber)} font-mono tracking-wide`}
                  />
                </Field>
                <Field label="Bank Name" error={errors.bankName}>
                  <input
                    id="bankName"
                    type="text"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                    className={inputCls(errors.bankName)}
                  />
                </Field>
              </div>
              <Field label="Upload Cancelled Cheque">
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="cancelCheque"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`${fileCls} pl-8`}
                  />
                </div>
              </Field>
            </div>

            {/* ── Footer Buttons ── */}
            <div className="flex items-center justify-end gap-3 pt-1 pb-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleNextClick}
                disabled={isLoading}
                className="px-8 py-2.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-orange-500 transition-all text-sm shadow-sm shadow-orange-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isEdit ? "Updating…" : "Sending OTP…"}
                  </>
                ) : isEdit ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Update Vendor
                  </>
                ) : (
                  <>
                    Next — Verify Contact
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ OTP STEP ══════════════ */}
        {step === 2 && !isEdit && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-sm w-full">
              {/* Icon */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF7B1D] to-orange-400 flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
                  <Phone className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Verify Contact Number
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  OTP sent to{" "}
                  <span className="font-bold text-gray-800 font-mono">
                    +91 {formData.contactNumber}
                  </span>
                </p>
              </div>

              {/* OTP inputs */}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                Enter 4-Digit OTP
              </label>
              <div className="flex gap-3 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`vendor-otp-${index}`}
                    type="tel"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength="1"
                    disabled={isLoading}
                    className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all ${
                      digit
                        ? "border-[#FF7B1D] bg-orange-50 text-[#FF7B1D]"
                        : "border-gray-200 text-gray-800 focus:border-[#FF7B1D] focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white py-3 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-500 transition-all mb-3 shadow-sm shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Verify & Add Vendor
                  </>
                )}
              </button>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setSuccess("");
                    setOtp(["", "", "", ""]);
                  }}
                  disabled={isLoading}
                  className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
                >
                  ← Back to Form
                </button>
                <button
                  onClick={() => {
                    setOtp(["", "", "", ""]);
                    setError("");
                    setSuccess("");
                    sendOtp();
                  }}
                  disabled={isLoading}
                  className="text-sm text-[#FF7B1D] hover:text-orange-600 font-semibold underline underline-offset-2 transition-colors disabled:opacity-40"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVendorModal;
