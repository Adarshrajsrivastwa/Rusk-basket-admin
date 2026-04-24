import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import AddProduct from "../../components/AddProduct";
import { BASE_URL } from "../../api/api";
import {
  Edit,
  ArrowLeft,
  Package,
  Tag,
  Layers,
  ShoppingBag,
  Store,
  Zap,
  CheckCircle,
  Clock,
  XCircle,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Hash,
  Percent,
  DollarSign,
  BoxIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Status badge — mirrors AllProduct's StatusBadge
───────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  const map = {
    approved: {
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      dot: "bg-emerald-500",
      label: "Approved",
    },
    pending: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      dot: "bg-amber-500",
      label: "Pending",
    },
    rejected: {
      cls: "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
      dot: "bg-red-500",
      label: "Rejected",
    },
  };
  const { cls, dot, label } = map[s] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Info Card — a section card matching AllProduct's table card
───────────────────────────────────────────── */
const InfoCard = ({ icon: Icon, title, children, accent }) => (
  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
      <div className={`w-2 h-2 rounded-full ${accent || "bg-[#FF7B1D]"}`} />
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      <span className="text-sm font-semibold text-gray-700">{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/* ─────────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────────── */
const SkeletonLoader = () => (
  <div className="max-w-[96%] mx-auto mt-4 mb-10 space-y-4 animate-pulse">
    <div className="h-9 w-36 bg-gray-200 rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        {[200, 160, 140].map((h, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="h-10 bg-gray-100" />
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className={`h-4 bg-gray-200 rounded-full w-${j % 2 === 0 ? "3/4" : "1/2"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-10 bg-gray-100" />
          <div className="p-5">
            <div className="aspect-square bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  /* ── Fetch ── */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        if (!token) {
          setError("Please login to view product details");
          setLoading(false);
          return;
        }
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        let found = null;

        try {
          const res = await fetch(`${BASE_URL}/api/product/${id}`, {
            method: "GET",
            headers,
            credentials: "include",
          });
          if (res.ok) {
            const d = await res.json();
            if (d.success && d.data) found = d.data;
          }
        } catch (_) {}

        if (!found) {
          try {
            const res = await fetch(`${BASE_URL}/api/admin/products/${id}`, {
              method: "GET",
              headers,
              credentials: "include",
            });
            if (res.ok) {
              const d = await res.json();
              if (d.success && d.data) found = d.data;
            }
          } catch (_) {}
        }

        if (found) {
          const norm = {
            ...found,
            productNumber: found.productNumber || found._id,
            productName: found.productName || "Unnamed Product",
            description: found.description || "",
            inventory: found.inventory || 0,
            initialInventory: found.initialInventory || 0,
            actualPrice: found.actualPrice || 0,
            regularPrice: found.regularPrice || 0,
            salePrice: found.salePrice || 0,
            cashback: found.cashback || 0,
            tax: found.tax || 0,
            discountPercentage: found.discountPercentage || 0,
            skuHsn: found.skuHsn || "N/A",
            approvalStatus: found.approvalStatus || "pending",
            isActive: found.isActive !== undefined ? found.isActive : true,
            hasOffer: found.hasOffer !== undefined ? found.hasOffer : false,
            thumbnail: found.thumbnail?.url || found.thumbnail || null,
            images: (found.images || []).map((img) => ({
              url: img.url || img,
              publicId: img.publicId,
              mediaType: img.mediaType || "image",
            })),
            category: found.category || null,
            subCategory: found.subCategory || null,
            vendor: found.vendor || null,
            productType: found.productType || null,
            skus: found.skus || [],
            tags: found.tags || [],
            offer: found.offer || null,
          };
          setProduct(norm);
          const allImgs = [
            ...norm.images.map((i) => i.url),
            ...(norm.thumbnail ? [norm.thumbnail] : []),
          ];
          if (allImgs.length > 0) setSelectedImage(allImgs[0]);
        } else {
          setError(`Product not found with ID: ${id}.`);
        }
      } catch (err) {
        setError(err.message || "Error fetching product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
    else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  const formatPrice = (p) => `₹${(p || 0).toLocaleString("en-IN")}`;

  const allImages = product
    ? [
        ...(product.images || []).map((i) => i.url),
        ...(product.thumbnail ? [product.thumbnail] : []),
      ]
    : [];

  const prevImg = () => {
    const ni = (imgIdx - 1 + allImages.length) % allImages.length;
    setImgIdx(ni);
    setSelectedImage(allImages[ni]);
  };
  const nextImg = () => {
    const ni = (imgIdx + 1) % allImages.length;
    setImgIdx(ni);
    setSelectedImage(allImages[ni]);
  };

  /* ── Loading ── */
  if (loading)
    return (
      <DashboardLayout>
        <SkeletonLoader />
      </DashboardLayout>
    );

  /* ── Error ── */
  if (error || !product)
    return (
      <DashboardLayout>
        <style>{pageStyles}</style>
        <div className="max-w-[96%] mx-auto mt-4 mb-10">
          <BackBtn navigate={navigate} />
          <div
            className={`mt-4 rounded-2xl border p-5 ${error ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}
          >
            <p className="font-semibold mb-1">
              {error ? "Error Loading Product" : "Product Not Found"}
            </p>
            <p className="text-sm">
              {error || "This product may have been deleted."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <style>{pageStyles}</style>

      <div className="max-w-[96%] mx-auto mt-3 mb-10">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-4 row-animate">
          <BackBtn navigate={navigate} />
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-[#FF7B1D] hover:border-orange-200 transition-all shadow-sm"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Product
          </button>
        </div>

        {/* ── Page header card (like AllProduct's table card header) ── */}
        <div
          className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white mb-4 row-animate"
          style={{ animationDelay: "40ms" }}
        >
          <div className="px-5 py-4 bg-gradient-to-r from-[#FF7B1D] to-orange-400 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base leading-tight">
                  {product.productName}
                </h1>
                <p className="text-orange-100 text-xs mt-0.5 font-mono">
                  {product.productNumber || product._id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={product.approvalStatus} />
              {product.isActive && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" /> Active
                </span>
              )}
              {product.hasOffer && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                  🔥 Offer Active
                </span>
              )}
            </div>
          </div>

          {/* Description sub-bar */}
          {product.description && (
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
            {[
              {
                label: "Sale Price",
                value: formatPrice(product.salePrice),
                icon: ShoppingBag,
                color: "text-[#FF7B1D]",
              },
              {
                label: "Inventory",
                value: `${product.inventory} units`,
                icon: BoxIcon,
                color: "text-blue-500",
              },
              {
                label: "Discount",
                value: `${product.discountPercentage}%`,
                icon: Percent,
                color: "text-purple-500",
              },
              {
                label: "Cashback",
                value: formatPrice(product.cashback),
                icon: Zap,
                color: "text-emerald-500",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="px-5 py-3.5 flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT col ─ 2/3 width */}
          <div className="lg:col-span-2 space-y-4">
            {/* Pricing Card */}
            <div className="row-animate" style={{ animationDelay: "80ms" }}>
              <InfoCard icon={DollarSign} title="Pricing Details">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Actual Price",
                      value: formatPrice(product.actualPrice),
                    },
                    {
                      label: "Regular Price",
                      value: formatPrice(product.regularPrice),
                    },
                    {
                      label: "Sale Price",
                      value: formatPrice(product.salePrice),
                      highlight: true,
                    },
                    { label: "Cashback", value: formatPrice(product.cashback) },
                    { label: "Tax", value: `${product.tax}%` },
                    {
                      label: "Discount",
                      value: `${product.discountPercentage}%`,
                    },
                    ...(product.originalSalePrice
                      ? [
                          {
                            label: "Original Sale Price",
                            value: formatPrice(product.originalSalePrice),
                          },
                        ]
                      : []),
                  ].map(({ label, value, highlight }) => (
                    <div
                      key={label}
                      className={`rounded-xl px-4 py-3 border ${highlight ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-100"}`}
                    >
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">
                        {label}
                      </p>
                      <p
                        className={`text-sm font-bold ${highlight ? "text-[#FF7B1D]" : "text-gray-800"}`}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </InfoCard>
            </div>

            {/* Product Info Card */}
            <div className="row-animate" style={{ animationDelay: "120ms" }}>
              <InfoCard icon={Tag} title="Product Information">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Category",
                      value:
                        product.category?.name ||
                        product.category?.categoryName ||
                        "N/A",
                      pill: "blue",
                    },
                    {
                      label: "Sub Category",
                      value:
                        product.subCategory?.name ||
                        product.subCategory?.subCategoryName ||
                        "N/A",
                      pill: "purple",
                    },
                    {
                      label: "SKU / HSN",
                      value: product.skuHsn || "N/A",
                      pill: "gray",
                    },
                    {
                      label: "Initial Inventory",
                      value: `${product.initialInventory} units`,
                      pill: "gray",
                    },
                    {
                      label: "Product Type",
                      value: product.productType
                        ? `${product.productType.value || ""} ${product.productType.unit || ""} (${product.productType.type || ""})`
                        : "N/A",
                      pill: "gray",
                    },
                  ].map(({ label, value, pill }) => {
                    const pillCls = {
                      blue: "bg-blue-50 text-blue-700 border border-blue-100",
                      purple:
                        "bg-purple-50 text-purple-700 border border-purple-100",
                      gray: "bg-gray-50 text-gray-600 border border-gray-100",
                    }[pill];
                    return (
                      <div key={label} className="flex flex-col gap-1.5">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                          {label}
                        </p>
                        <span
                          className={`inline-flex self-start px-2.5 py-1 rounded-full text-xs font-semibold ${pillCls}`}
                        >
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* SKUs */}
                {product.skus && product.skus.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">
                      SKUs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.skus.map((sku, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold"
                        >
                          <Hash className="w-3 h-3" /> {sku.sku}:{" "}
                          {sku.inventory} units
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold"
                        >
                          <Tag className="w-3 h-3" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </InfoCard>
            </div>

            {/* Vendor Card */}
            {product.vendor && (
              <div className="row-animate" style={{ animationDelay: "160ms" }}>
                <InfoCard icon={Store} title="Vendor Information">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Store Name", value: product.vendor.storeName },
                      {
                        label: "Vendor Name",
                        value: product.vendor.vendorName,
                      },
                      { label: "Email", value: product.vendor.email },
                      { label: "Contact", value: product.vendor.contactNumber },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl px-4 py-3 bg-gray-50 border border-gray-100"
                      >
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-gray-700 truncate">
                          {value || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              </div>
            )}

            {/* Offer Card */}
            {product.hasOffer && product.offer && (
              <div className="row-animate" style={{ animationDelay: "200ms" }}>
                <InfoCard
                  icon={Zap}
                  title="Active Offer"
                  accent="bg-purple-500"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      {
                        label: "Discount",
                        value: `${product.offer.discountPercentage}%`,
                      },
                      {
                        label: "Start Date",
                        value: formatDate(product.offer.startDate),
                      },
                      {
                        label: "End Date",
                        value: formatDate(product.offer.endDate),
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl px-4 py-3 bg-purple-50 border border-purple-100"
                      >
                        <p className="text-[10px] text-purple-400 uppercase tracking-wider font-medium mb-1">
                          {label}
                        </p>
                        <p className="text-sm font-bold text-purple-700">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {product.offer.isDailyOffer && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold">
                      ⭐ Daily Offer
                    </div>
                  )}
                </InfoCard>
              </div>
            )}

            {/* Approval + Timestamps */}
            <div className="row-animate" style={{ animationDelay: "240ms" }}>
              <InfoCard icon={Calendar} title="Timeline">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Created", value: formatDate(product.createdAt) },
                    {
                      label: "Last Updated",
                      value: formatDate(product.updatedAt),
                    },
                    ...(product.approvedBy
                      ? [
                          {
                            label: "Approved By",
                            value: product.approvedBy.name,
                          },
                          {
                            label: "Approved At",
                            value: formatDate(product.approvedAt),
                          },
                        ]
                      : []),
                    ...(product.latitude
                      ? [
                          { label: "Latitude", value: product.latitude },
                          { label: "Longitude", value: product.longitude },
                        ]
                      : []),
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl px-4 py-3 bg-gray-50 border border-gray-100"
                    >
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">
                        {label}
                      </p>
                      <p className="text-xs font-semibold text-gray-700">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </InfoCard>
            </div>
          </div>

          {/* RIGHT col ─ 1/3 width */}
          <div className="space-y-4">
            {/* Main image viewer */}
            <div className="row-animate" style={{ animationDelay: "60ms" }}>
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
                  <div className="w-2 h-2 rounded-full bg-[#FF7B1D]" />
                  <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    Product Images
                  </span>
                  {allImages.length > 0 && (
                    <span className="ml-auto text-xs text-gray-400 font-medium">
                      {imgIdx + 1} / {allImages.length}
                    </span>
                  )}
                </div>

                {/* Big image */}
                <div className="relative bg-gray-50 aspect-square flex items-center justify-center overflow-hidden">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.productName}
                      className="object-contain w-full h-full transition-opacity duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <ImageIcon className="w-10 h-10" />
                      <p className="text-xs">No image</p>
                    </div>
                  )}

                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImg}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-gray-100 flex items-center justify-center hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={nextImg}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-gray-100 flex items-center justify-center hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                  <div className="p-3 border-t border-gray-100 grid grid-cols-4 gap-2">
                    {allImages.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedImage(url);
                          setImgIdx(i);
                        }}
                        className={`rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                          selectedImage === url
                            ? "border-[#FF7B1D] shadow-sm shadow-orange-100"
                            : "border-gray-100 hover:border-orange-200"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`img-${i}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Internal ID card */}
            <div className="row-animate" style={{ animationDelay: "100ms" }}>
              <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <Hash className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    Identifiers
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    {
                      label: "Product Number",
                      value:
                        product.productNumber || product.productno || "N/A",
                    },
                    { label: "Internal ID", value: product._id || product.id },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">
                        {label}
                      </p>
                      <span className="inline-block font-mono text-xs bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-gray-600 break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {product && (
        <AddProduct
          key={`edit-${product._id || product.id}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isEditMode={true}
          editingProduct={product}
          onProductAdded={() => {
            setIsEditModalOpen(false);
            window.location.reload();
          }}
          onProductUpdated={() => {
            setIsEditModalOpen(false);
            window.location.reload();
          }}
        />
      )}
    </DashboardLayout>
  );
};

/* ── Shared back button ── */
const BackBtn = ({ navigate }) => (
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF7B1D] to-orange-400 text-white hover:from-orange-500 hover:to-orange-500 transition-all shadow-sm shadow-orange-200"
  >
    <ArrowLeft className="w-3.5 h-3.5" /> Back
  </button>
);

/* ── Shared page styles ── */
const pageStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .row-animate {
    animation: fadeSlideIn 0.25s ease forwards;
  }
`;

export default SingleProduct;
