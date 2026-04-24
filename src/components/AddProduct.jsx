import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  X,
  Check,
  ImageIcon,
  Tag,
  DollarSign,
  Layers,
  Package,
  Store,
  ChevronDown,
  Hash,
  BoxIcon,
  Percent,
  Zap,
  AlertCircle,
} from "lucide-react";
import api from "../api/api";

/* ── Section Card (mirrors AllProduct card style) ── */
const SectionCard = ({ icon: Icon, title, accent, children }) => (
  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
    <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${accent || "bg-[#FF7B1D]"}`}
      />
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
        {title}
      </span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/* ── Styled Input ── */
const Field = ({ label, required, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
      {required && <span className="text-[#FF7B1D] ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
  </div>
);

const inputCls =
  "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white placeholder:text-gray-400 transition-all";

const selectCls =
  "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all appearance-none";

export default function AddProductPopup({
  isOpen,
  onClose,
  onSuccess,
  isEditMode = false,
  editingProduct = null,
}) {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    skuHsn: "",
    inventory: "",
    category: "",
    subCategory: "",
    actualPrice: "",
    regularPrice: "",
    salePrice: "",
    cashback: "",
    tax: "",
    productType: "",
    productTypeValue: "",
    productTypeUnit: "",
    tags: [],
    images: [],
    existingImages: [],
    vendorId: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  /* ── Crop modal state ── */
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const cropContainerRef = useRef(null);
  const cropBoxRef = useRef(null);
  const imageRef = useRef(null);
  const imageQueueRef = useRef([]);
  const pendingImageIndex = useRef(null);
  const isInitializingRef = useRef(false);

  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "admin";

  const productTypeOptions = [
    { value: "", label: "Select Type" },
    { value: "weight", label: "Weight" },
    { value: "volume", label: "Volume" },
    { value: "count", label: "Count" },
    { value: "piece", label: "Piece" },
  ];

  const getUnitOptions = () => {
    switch (formData.productType) {
      case "weight":
        return [
          { value: "", label: "Select Unit" },
          { value: "kg", label: "Kilogram (kg)" },
          { value: "g", label: "Gram (g)" },
          { value: "mg", label: "Milligram (mg)" },
          { value: "lb", label: "Pound (lb)" },
          { value: "oz", label: "Ounce (oz)" },
        ];
      case "volume":
        return [
          { value: "", label: "Select Unit" },
          { value: "l", label: "Liter (l)" },
          { value: "ml", label: "Milliliter (ml)" },
          { value: "gallon", label: "Gallon" },
        ];
      case "count":
      case "piece":
        return [
          { value: "", label: "Select Unit" },
          { value: "piece", label: "Piece" },
          { value: "dozen", label: "Dozen" },
          { value: "pack", label: "Pack" },
          { value: "box", label: "Box" },
        ];
      default:
        return [{ value: "", label: "Select Type First" }];
    }
  };

  const extractId = (id) => {
    if (!id) return "";
    if (typeof id === "string") {
      if (/^[0-9a-fA-F]{24}$/.test(id)) return id;
    }
    if (typeof id === "object" && id !== null) {
      if (id.$oid && /^[0-9a-fA-F]{24}$/.test(id.$oid)) return id.$oid;
      if (typeof id.toHexString === "function") {
        try {
          const h = id.toHexString();
          if (/^[0-9a-fA-F]{24}$/.test(h)) return h;
        } catch (_) {}
      }
      for (const key of ["_id", "id", "str"]) {
        if (id[key] && /^[0-9a-fA-F]{24}$/.test(String(id[key])))
          return String(id[key]);
      }
      try {
        const m = JSON.stringify(id).match(/"([0-9a-fA-F]{24})"/);
        if (m) return m[1];
      } catch (_) {}
    }
    return "";
  };

  const fetchVendors = async () => {
    if (!isAdmin) return;
    setVendorsLoading(true);
    try {
      const r = await api.get("/api/vendor");
      if (r.data.success) setVendors(r.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setVendorsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchCategories();
    if (isAdmin && !isEditMode) fetchVendors();
    if (isEditMode && editingProduct) {
      isInitializingRef.current = true;
      const categoryId = extractId(editingProduct.category);
      const subCategoryId = extractId(editingProduct.subCategory);
      const newFormData = {
        productName: editingProduct.name || editingProduct.productName || "",
        description: editingProduct.description || "",
        skuHsn: editingProduct.sku || editingProduct.skuHsn || "N/A",
        inventory:
          editingProduct.inventory != null
            ? String(editingProduct.inventory)
            : "0",
        category: categoryId,
        subCategory: subCategoryId,
        actualPrice:
          editingProduct.actualPrice != null
            ? String(editingProduct.actualPrice)
            : "0",
        regularPrice:
          editingProduct.regularPrice != null
            ? String(editingProduct.regularPrice)
            : "0",
        salePrice:
          editingProduct.salePrice != null
            ? String(editingProduct.salePrice)
            : "0",
        cashback:
          editingProduct.cashback != null
            ? String(editingProduct.cashback)
            : "0",
        tax: editingProduct.tax != null ? String(editingProduct.tax) : "0",
        productType: editingProduct.productType?.type || "",
        productTypeValue:
          editingProduct.productType?.value != null
            ? String(editingProduct.productType.value)
            : "",
        productTypeUnit: editingProduct.productType?.unit || "",
        tags: Array.isArray(editingProduct.tags) ? editingProduct.tags : [],
        images: [],
        existingImages: Array.isArray(editingProduct.images)
          ? editingProduct.images
          : [],
        vendorId: "",
      };
      setFormData(newFormData);
      setTagInput("");
      if (categoryId && /^[0-9a-fA-F]{24}$/.test(categoryId)) {
        fetchSubCategories(categoryId)
          .then(() => {
            setFormData((prev) => ({ ...prev, subCategory: subCategoryId }));
          })
          .catch(() => {})
          .finally(() => {
            isInitializingRef.current = false;
          });
      } else {
        isInitializingRef.current = false;
      }
    } else {
      isInitializingRef.current = false;
      setFormData({
        productName: "",
        description: "",
        skuHsn: "",
        inventory: "",
        category: "",
        subCategory: "",
        actualPrice: "",
        regularPrice: "",
        salePrice: "",
        cashback: "",
        tax: "",
        productType: "",
        productTypeValue: "",
        productTypeUnit: "",
        tags: [],
        images: [],
        existingImages: [],
        vendorId: "",
      });
      setTagInput("");
    }
  }, [isOpen, isEditMode, editingProduct]);

  useEffect(() => {
    if (isInitializingRef.current) return;
    if (!formData.category) {
      setSubCategories([]);
      setFormData((p) => ({ ...p, subCategory: "" }));
      return;
    }
    const id = extractId(formData.category) || formData.category;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      setSubCategories([]);
      setFormData((p) => ({ ...p, subCategory: "" }));
      return;
    }
    setFormData((p) => ({ ...p, subCategory: "" }));
    fetchSubCategories(id);
  }, [formData.category]);

  useEffect(() => {
    if (isInitializingRef.current) return;
    if (formData.productType)
      setFormData((p) => ({ ...p, productTypeUnit: "" }));
  }, [formData.productType]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const r = await api.get("/api/category");
      if (r.data.success) setCategories(r.data.data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    setSubCategoriesLoading(true);
    try {
      const id =
        typeof categoryId === "string" ? categoryId : extractId(categoryId);
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        setSubCategories([]);
        return [];
      }
      const r = await api.get(`/api/subcategory/by-category/${id}`);
      if (r.data.success) {
        const norm = (r.data.data || [])
          .map((s) => {
            const sid = extractId(s._id || s.id);
            if (!sid) return null;
            return {
              ...s,
              _id: sid,
              name: s.name || s.subCategoryName || "Unnamed",
            };
          })
          .filter(Boolean);
        setSubCategories(norm);
        return norm;
      }
    } catch {
      setError("Failed to load subcategories");
      return [];
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if ((name === "category" || name === "subCategory") && value)
      v = /^[0-9a-fA-F]{24}$/.test(value) ? value : extractId(value) || "";
    setFormData((p) => ({ ...p, [name]: v }));
    if (error) setError("");
  };

  const openNextCrop = (currentImages, queue) => {
    if (queue.length === 0) return;
    const totalImages = currentImages.length;
    if (totalImages + formData.existingImages.length >= 6) return;
    const nextFile = queue[0];
    imageQueueRef.current = queue.slice(1);
    const reader = new FileReader();
    reader.onloadend = () => {
      pendingImageIndex.current = totalImages;
      setCropImage(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(nextFile);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!files.length) return;
    const available =
      6 - formData.existingImages.length - formData.images.length;
    const toProcess = files.slice(0, available);
    if (!toProcess.length) {
      alert("Maximum 6 images allowed.");
      e.target.value = "";
      return;
    }
    imageQueueRef.current = toProcess.slice(1);
    openNextCrop(formData.images, toProcess);
    e.target.value = "";
  };

  useEffect(() => {
    if (showCropModal && cropImage && cropContainerRef.current) {
      const c = cropContainerRef.current;
      const size = Math.min(c.clientWidth * 0.8, c.clientHeight * 0.8, 500);
      setCropArea({
        x: (c.clientWidth - size) / 2,
        y: (c.clientHeight - size) / 2,
        width: size,
        height: size,
      });
    }
  }, [showCropModal, cropImage]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains("resize-handle")) {
      setIsResizing(true);
      setResizeHandle(e.target.dataset.handle);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: cropArea.width,
        height: cropArea.height,
        cropX: cropArea.x,
        cropY: cropArea.y,
      });
      e.stopPropagation();
      return;
    }
    if (
      e.target === cropBoxRef.current ||
      cropBoxRef.current?.contains(e.target)
    ) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - cropArea.x, y: e.clientY - cropArea.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!cropContainerRef.current) return;
    const c = cropContainerRef.current;
    const rect = c.getBoundingClientRect();
    if (isResizing && resizeHandle) {
      const dx = e.clientX - resizeStart.x;
      const dy = e.clientY - resizeStart.y;
      let newSize = resizeStart.width;
      let newX = resizeStart.cropX;
      let newY = resizeStart.cropY;
      const scale = Math.max(
        Math.abs(resizeStart.width + dx) / resizeStart.width,
        Math.abs(resizeStart.height + dy) / resizeStart.height,
      );
      newSize = resizeStart.width * scale;
      if (resizeHandle === "sw" || resizeHandle === "nw")
        newX = resizeStart.cropX + resizeStart.width - newSize;
      if (resizeHandle === "ne" || resizeHandle === "nw")
        newY = resizeStart.cropY + resizeStart.height - newSize;
      const maxSize = Math.min(c.clientWidth, c.clientHeight);
      newSize = Math.max(100, Math.min(newSize, maxSize));
      if (newX + newSize > c.clientWidth) newX = c.clientWidth - newSize;
      if (newY + newSize > c.clientHeight) newY = c.clientHeight - newSize;
      setCropArea({
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: newSize,
        height: newSize,
      });
      return;
    }
    if (isDragging) {
      const nx = e.clientX - rect.left - dragStart.x;
      const ny = e.clientY - rect.top - dragStart.y;
      setCropArea((p) => ({
        ...p,
        x: Math.max(0, Math.min(nx, c.clientWidth - p.width)),
        y: Math.max(0, Math.min(ny, c.clientHeight - p.height)),
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const applyCrop = () => {
    if (!cropImage || !imageRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const c = cropContainerRef.current;
      const scaleX = img.width / c.clientWidth;
      const scaleY = img.height / c.clientHeight;
      const outputSize = 1000;
      canvas.width = outputSize;
      canvas.height = outputSize;
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.width * scaleX,
        0,
        0,
        outputSize,
        outputSize,
      );
      canvas.toBlob(
        (blob) => {
          const file = new File([blob], `product-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const slotIndex = pendingImageIndex.current;
          setFormData((prev) => {
            const newImages = [...prev.images];
            newImages[slotIndex] = file;
            setTimeout(() => {
              if (
                imageQueueRef.current.length > 0 &&
                newImages.length + prev.existingImages.length < 6
              )
                openNextCrop(newImages, imageQueueRef.current);
              else imageQueueRef.current = [];
            }, 0);
            return { ...prev, images: newImages };
          });
          setShowCropModal(false);
          setCropImage(null);
          pendingImageIndex.current = null;
        },
        "image/jpeg",
        0.9,
      );
    };
    img.src = cropImage;
  };

  const cancelCrop = () => {
    imageQueueRef.current = [];
    setShowCropModal(false);
    setCropImage(null);
    pendingImageIndex.current = null;
  };
  const removeNewImage = (i) =>
    setFormData((p) => ({
      ...p,
      images: p.images.filter((_, idx) => idx !== i),
    }));
  const removeExistingImage = (i) =>
    setFormData((p) => ({
      ...p,
      existingImages: p.existingImages.filter((_, idx) => idx !== i),
    }));

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim()))
        setFormData((p) => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const removeTag = (i) =>
    setFormData((p) => ({ ...p, tags: p.tags.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    if (
      !formData.productName ||
      !formData.description ||
      !formData.skuHsn ||
      !formData.inventory ||
      !formData.category ||
      !formData.subCategory ||
      !formData.actualPrice ||
      !formData.regularPrice ||
      !formData.salePrice ||
      !formData.productType ||
      !formData.productTypeValue ||
      !formData.productTypeUnit
    ) {
      setError(
        "Please fill in all required fields including product type, value, and unit",
      );
      setLoading(false);
      return;
    }
    if (isAdmin && !isEditMode && !formData.vendorId) {
      setError("Please select a vendor");
      setLoading(false);
      return;
    }
    if (
      isEditMode
        ? formData.images.length === 0 && formData.existingImages.length === 0
        : formData.images.length === 0
    ) {
      setError("Please upload at least one product image");
      setLoading(false);
      return;
    }
    try {
      const fd = new FormData();
      const categoryId = extractId(formData.category) || formData.category;
      const subCategoryId =
        extractId(formData.subCategory) || formData.subCategory;
      if (!categoryId || !/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        setError("Please select a valid category");
        setLoading(false);
        return;
      }
      if (!subCategoryId || !/^[0-9a-fA-F]{24}$/.test(subCategoryId)) {
        setError("Please select a valid sub-category");
        setLoading(false);
        return;
      }
      fd.append("productName", formData.productName);
      fd.append("description", formData.description || "");
      fd.append("skuHsn", formData.skuHsn || "");
      fd.append("inventory", formData.inventory || "0");
      fd.append("category", categoryId);
      fd.append("subCategory", subCategoryId);
      fd.append("actualPrice", formData.actualPrice);
      fd.append("regularPrice", formData.regularPrice);
      fd.append("salePrice", formData.salePrice);
      const cb = formData.cashback ? parseFloat(formData.cashback) : 0;
      if (cb < 0) {
        setError("Cashback must be >= 0");
        setLoading(false);
        return;
      }
      fd.append("cashback", cb.toString());
      const tx = formData.tax ? parseFloat(formData.tax) : 0;
      if (tx < 0 || tx > 100) {
        setError("Tax must be between 0 and 100");
        setLoading(false);
        return;
      }
      fd.append("tax", tx.toString());
      if (isAdmin && !isEditMode && formData.vendorId)
        fd.append("vendorId", formData.vendorId);
      if (formData.productType) fd.append("productType", formData.productType);
      if (formData.productTypeValue)
        fd.append("productTypeValue", formData.productTypeValue);
      if (formData.productTypeUnit)
        fd.append("productTypeUnit", formData.productTypeUnit);
      if (formData.tags.length > 0) fd.append("tags", formData.tags.join(","));
      formData.images.forEach((img) => {
        if (img instanceof File) fd.append("images", img);
      });
      if (isEditMode && formData.existingImages.length > 0)
        fd.append("existingImages", JSON.stringify(formData.existingImages));
      let productId =
        editingProduct?.id || editingProduct?._id || editingProduct?.productId;
      if (productId && typeof productId === "object")
        productId = extractId(productId) || productId.toString();
      productId = productId?.toString() || productId;
      const endpoint = isEditMode
        ? isAdmin
          ? `/api/admin/products/${productId}`
          : `/api/product/update/${productId}`
        : `/api/product/add`;
      const config = { headers: { "Content-Type": undefined } };
      const response = isEditMode
        ? await api.put(endpoint, fd, config)
        : await api.post(endpoint, fd, config);
      const result = response.data;
      if (!result.success)
        throw new Error(
          result.message ||
            `Failed to ${isEditMode ? "update" : "add"} product`,
        );
      alert(`Product ${isEditMode ? "updated" : "added"} successfully!`);
      if (onSuccess) onSuccess(result.data);
      setFormData({
        productName: "",
        description: "",
        skuHsn: "",
        inventory: "",
        category: "",
        subCategory: "",
        actualPrice: "",
        regularPrice: "",
        salePrice: "",
        cashback: "",
        tax: "",
        productType: "",
        productTypeValue: "",
        productTypeUnit: "",
        tags: [],
        images: [],
        existingImages: [],
        vendorId: "",
      });
      setTagInput("");
      setTimeout(() => onClose(), 300);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? "update" : "submit"} product. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalImages = formData.images.length + formData.existingImages.length;
  const remainingSlots = 6 - totalImages;
  const allImages = [
    ...formData.existingImages.map((img) => ({
      url: img.url || img,
      saved: true,
    })),
    ...formData.images.map((img, i) => ({
      url: URL.createObjectURL(img),
      saved: false,
      idx: i,
    })),
  ];

  return (
    <>
      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .modal-animate { animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards; }
        .section-animate { animation: fadeSlideIn 0.2s ease forwards; }
        .select-wrapper { position: relative; }
        .select-wrapper::after { content: ''; position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #9ca3af; pointer-events: none; }
      `}</style>

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-3">
        <div className="modal-animate bg-white w-full max-w-[1100px] rounded-2xl shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden">
          {/* ── Header (mirrors AllProduct orange gradient table header) ── */}
          <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base leading-tight">
                  {isEditMode ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-orange-100 text-xs mt-0.5">
                  {isEditMode
                    ? "Update product information below"
                    : "Fill in the details to list a new product"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Error Bar ── */}
          {error && (
            <div className="mx-5 mt-4 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex-shrink-0">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Scrollable Body ── */}
          <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
            {/* ── Row 1: Basic Info + Image Gallery ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-4">
              {/* Basic Info Card */}
              <div
                className="section-animate"
                style={{ animationDelay: "0ms" }}
              >
                <SectionCard icon={Package} title="Basic Information">
                  <div className="space-y-4">
                    <Field label="Product Name" required>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Description" required>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Write a clear product description…"
                        className={`${inputCls} resize-none min-h-[150px]`}
                      />
                    </Field>
                  </div>
                </SectionCard>
              </div>

              {/* Image Gallery Card */}
              <div
                className="section-animate"
                style={{ animationDelay: "40ms" }}
              >
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white h-full flex flex-col">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                      <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Images
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${totalImages >= 6 ? "bg-red-50 text-red-600 border border-red-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}
                    >
                      {totalImages} / 6
                    </span>
                  </div>

                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 font-medium">
                      ⚠️ Images are auto-cropped to 1:1 square ratio
                    </p>

                    {/* Grid */}
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      {allImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative rounded-xl overflow-hidden border border-gray-100 group"
                          style={{ aspectRatio: "1/1" }}
                        >
                          <img
                            src={img.url}
                            alt={`img-${i}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                          <button
                            type="button"
                            onClick={() =>
                              img.saved
                                ? removeExistingImage(
                                    formData.existingImages.indexOf(
                                      formData.existingImages[
                                        i < formData.existingImages.length
                                          ? i
                                          : 0
                                      ],
                                    ),
                                  )
                                : removeNewImage(img.idx)
                            }
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                          <span
                            className={`absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${img.saved ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"}`}
                          >
                            {img.saved ? "Saved" : "New"}
                          </span>
                        </div>
                      ))}

                      {/* Upload slot */}
                      {totalImages < 6 && (
                        <label
                          className="rounded-xl border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/50 hover:bg-orange-50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                          style={{ aspectRatio: "1/1" }}
                        >
                          <Upload className="w-5 h-5 text-orange-300 group-hover:text-orange-400 mb-1 transition-colors" />
                          <span className="text-[9px] text-orange-400 font-semibold text-center leading-tight">
                            Add
                            <br />
                            {remainingSlots} left
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}

                      {/* Empty placeholders */}
                      {Array.from({
                        length: Math.max(
                          0,
                          6 - totalImages - (totalImages < 6 ? 1 : 0),
                        ),
                      }).map((_, i) => (
                        <div
                          key={`ph-${i}`}
                          className="rounded-xl border border-dashed border-gray-100 bg-gray-50 flex items-center justify-center"
                          style={{ aspectRatio: "1/1" }}
                        >
                          <span className="text-[10px] text-gray-200 font-medium">
                            Empty
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1.5">
                        <span className="font-medium">Gallery progress</span>
                        <span>{totalImages} of 6 uploaded</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${(totalImages / 6) * 100}%`,
                            background:
                              totalImages >= 6
                                ? "#ef4444"
                                : "linear-gradient(to right, #FF7B1D, #fb923c)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Vendor (Admin only) ── */}
            {isAdmin && !isEditMode && (
              <div
                className="section-animate"
                style={{ animationDelay: "60ms" }}
              >
                <SectionCard icon={Store} title="Vendor" accent="bg-blue-500">
                  <div className="select-wrapper">
                    <select
                      name="vendorId"
                      value={formData.vendorId}
                      onChange={handleChange}
                      className={selectCls}
                    >
                      <option value="">
                        {vendorsLoading
                          ? "Loading vendors…"
                          : "Select a vendor"}
                      </option>
                      {vendors.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.vendorName || v.storeName || v.contactNumber} —{" "}
                          {v.storeName || "Store"}
                        </option>
                      ))}
                    </select>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── Classification ── */}
            <div className="section-animate" style={{ animationDelay: "80ms" }}>
              <SectionCard icon={Layers} title="Classification">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="HSN Code" required>
                    <input
                      type="text"
                      name="skuHsn"
                      value={formData.skuHsn}
                      onChange={handleChange}
                      placeholder="e.g. 0901"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Stock (units)" required>
                    <input
                      type="number"
                      name="inventory"
                      value={formData.inventory}
                      onChange={handleChange}
                      placeholder="0"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Category" required>
                    <div className="select-wrapper">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={categoriesLoading}
                        className={selectCls}
                      >
                        <option value="">
                          {categoriesLoading ? "Loading…" : "Select Category"}
                        </option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                            {c.totalProducts > 0 ? ` (${c.totalProducts})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                  <Field label="Sub-Category" required>
                    <div className="select-wrapper">
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        disabled={!formData.category || subCategoriesLoading}
                        className={`${selectCls} ${!formData.category ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        <option value="">
                          {subCategoriesLoading
                            ? "Loading…"
                            : "Select Sub-Category"}
                        </option>
                        {subCategories.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>
              </SectionCard>
            </div>

            {/* ── Pricing ── */}
            <div
              className="section-animate"
              style={{ animationDelay: "100ms" }}
            >
              <SectionCard
                icon={DollarSign}
                title="Pricing"
                accent="bg-emerald-500"
              >
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[
                    {
                      label: "Actual Price",
                      name: "actualPrice",
                      placeholder: "₹ 0",
                    },
                    {
                      label: "Regular Price (MRP)",
                      name: "regularPrice",
                      placeholder: "₹ 0",
                    },
                    {
                      label: "Sale Price",
                      name: "salePrice",
                      placeholder: "₹ 0",
                    },
                    { label: "Cashback", name: "cashback", placeholder: "₹ 0" },
                    { label: "Tax (%)", name: "tax", placeholder: "0" },
                  ].map(({ label, name, placeholder }) => (
                    <Field
                      key={name}
                      label={label}
                      required={[
                        "actualPrice",
                        "regularPrice",
                        "salePrice",
                      ].includes(name)}
                    >
                      <input
                        type="number"
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={inputCls}
                      />
                    </Field>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* ── Product Type ── */}
            <div
              className="section-animate"
              style={{ animationDelay: "120ms" }}
            >
              <SectionCard
                icon={BoxIcon}
                title="Product Type"
                accent="bg-purple-500"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Type" required>
                    <div className="select-wrapper">
                      <select
                        name="productType"
                        value={formData.productType}
                        onChange={handleChange}
                        className={selectCls}
                      >
                        {productTypeOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                  <Field label="Value" required hint="e.g. 500, 1, 2.5">
                    <input
                      type="number"
                      name="productTypeValue"
                      value={formData.productTypeValue}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Unit" required>
                    <div className="select-wrapper">
                      <select
                        name="productTypeUnit"
                        value={formData.productTypeUnit}
                        onChange={handleChange}
                        disabled={!formData.productType}
                        className={`${selectCls} ${!formData.productType ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        {getUnitOptions().map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>
              </SectionCard>
            </div>

            {/* ── Tags ── */}
            <div
              className="section-animate"
              style={{ animationDelay: "140ms" }}
            >
              <SectionCard icon={Tag} title="Tags" accent="bg-amber-500">
                <div className="rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-300 bg-white p-3 min-h-[60px] transition-all">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(i)}
                          className="w-3.5 h-3.5 rounded-full hover:bg-orange-200 flex items-center justify-center transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={
                      formData.tags.length === 0
                        ? "Type a tag and press Enter… (e.g. fresh, organic, fruits)"
                        : "Add more tags…"
                    }
                    className="w-full text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none bg-transparent"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">
                    Enter
                  </kbd>{" "}
                  to add each tag
                </p>
              </SectionCard>
            </div>

            {/* ── Submit ── */}
            <div className="flex justify-end gap-3 pb-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm shadow-orange-200 flex items-center gap-2 ${loading ? "bg-orange-300 cursor-not-allowed" : "bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500"}`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {isEditMode ? "Updating…" : "Submitting…"}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {isEditMode ? "Update Product" : "Add Product"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CROP MODAL ── */}
      {showCropModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Crop header */}
            <div className="bg-gradient-to-r from-[#FF7B1D] to-orange-400 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-base">Crop Image</h3>
                <p className="text-orange-100 text-xs mt-0.5">
                  {imageQueueRef.current.length > 0
                    ? `${imageQueueRef.current.length} more image${imageQueueRef.current.length > 1 ? "s" : ""} waiting…`
                    : "Drag & resize the crop area • 1:1 square ratio enforced"}
                </p>
              </div>
              <button
                onClick={cancelCrop}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Crop area */}
            <div
              ref={cropContainerRef}
              className="relative w-full bg-gray-900 overflow-hidden cursor-crosshair"
              style={{ height: "480px" }}
              onMouseDown={handleMouseDown}
            >
              <img
                ref={imageRef}
                src={cropImage}
                alt="Crop"
                className="w-full h-full object-contain"
              />
              {/* Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  { top: 0, left: 0, right: 0, height: `${cropArea.y}px` },
                  {
                    top: `${cropArea.y + cropArea.height}px`,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  },
                  {
                    top: `${cropArea.y}px`,
                    left: 0,
                    width: `${cropArea.x}px`,
                    height: `${cropArea.height}px`,
                  },
                  {
                    top: `${cropArea.y}px`,
                    right: 0,
                    width: `${cropContainerRef.current ? cropContainerRef.current.clientWidth - cropArea.x - cropArea.width : 0}px`,
                    height: `${cropArea.height}px`,
                  },
                ].map((s, i) => (
                  <div key={i} className="absolute bg-black/60" style={s} />
                ))}
              </div>
              {/* Crop box */}
              <div
                ref={cropBoxRef}
                className="absolute border-2 border-white cursor-move shadow-lg"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                }}
              >
                {/* Rule-of-thirds grid */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "33.33% 33.33%",
                  }}
                />
                {/* Handles */}
                {[
                  {
                    pos: "-top-2.5 -left-2.5",
                    h: "nw",
                    cur: "cursor-nwse-resize",
                  },
                  {
                    pos: "-top-2.5 -right-2.5",
                    h: "ne",
                    cur: "cursor-nesw-resize",
                  },
                  {
                    pos: "-bottom-2.5 -left-2.5",
                    h: "sw",
                    cur: "cursor-nesw-resize",
                  },
                  {
                    pos: "-bottom-2.5 -right-2.5",
                    h: "se",
                    cur: "cursor-nwse-resize",
                  },
                ].map(({ pos, h, cur }) => (
                  <div
                    key={h}
                    className={`resize-handle absolute ${pos} w-5 h-5 bg-white border-2 border-[#FF7B1D] rounded-full ${cur} hover:bg-orange-50 shadow transition-colors`}
                    data-handle={h}
                  />
                ))}
              </div>
            </div>

            {/* Crop footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <p className="text-xs text-gray-400">
                Drag to move the crop box • Drag corners to resize
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelCrop}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Cancel All
                </button>
                <button
                  onClick={applyCrop}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF7B1D] to-orange-400 hover:from-orange-500 hover:to-orange-500 text-white flex items-center gap-2 shadow-sm shadow-orange-200 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  {imageQueueRef.current.length > 0
                    ? `Crop & Next (${imageQueueRef.current.length} left)`
                    : "Apply Crop"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
