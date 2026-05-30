import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProduct";

/* ─── Utility: safely read a Map or plain object ─── */
const readAttr = (attr) => {
  if (!attr) return {};
  if (attr instanceof Map) {
    const obj = {};
    attr.forEach((v, k) => { obj[k] = v; });
    return obj;
  }
  return typeof attr === "object" ? attr : {};
};

/* ─── All unique attribute keys across variants ─── */
const getAllAttrKeys = (variants) => {
  const keys = new Set();
  (variants || []).forEach((v) => {
    Object.keys(readAttr(v.attribute || v.attributes)).forEach((k) => keys.add(k));
  });
  return [...keys];
};

/* ─── All unique values for a given key ─── */
const getValuesForKey = (variants, key) => {
  const vals = new Set();
  (variants || []).forEach((v) => {
    const a = readAttr(v.attribute || v.attributes);
    if (a[key] !== undefined) vals.add(a[key]);
  });
  return [...vals];
};

/* ─── Values still available for `key` given other selections ─── */
const getAvailableValues = (variants, key, selectedAttrs) => {
  const others = Object.fromEntries(
    Object.entries(selectedAttrs).filter(([k]) => k !== key)
  );
  return (variants || [])
    .filter((v) => {
      const a = readAttr(v.attribute || v.attributes);
      return Object.entries(others).every(([k, val]) => a[k] === val);
    })
    .map((v) => readAttr(v.attribute || v.attributes)[key])
    .filter(Boolean);
};

/* ─── Find exactly matching variant ─── */
const findMatchingVariant = (variants, selectedAttrs) => {
  if (!Object.keys(selectedAttrs).length) return null;
  return (
    (variants || []).find((v) => {
      const a = readAttr(v.attribute || v.attributes);
      return Object.entries(selectedAttrs).every(([k, val]) => a[k] === val);
    }) || null
  );
};

/* ════════════════════════════════════════════
   VARIANT SELECTOR
════════════════════════════════════════════ */
function VariantSelector({ variants, selectedAttrs, onSelect }) {
  const allKeys = useMemo(() => getAllAttrKeys(variants), [variants]);
  if (!allKeys.length) return null;

  return (
    <div className="space-y-4">
      {allKeys.map((key) => {
        const allValues   = getValuesForKey(variants, key);
        const available   = new Set(getAvailableValues(variants, key, selectedAttrs));
        const selectedVal = selectedAttrs[key];

        return (
          <div key={key}>
            {/* label row */}
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                {key}
              </p>
              {selectedVal && (
                <span className="text-xs font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                  {selectedVal}
                </span>
              )}
            </div>

            {/* option buttons */}
            <div className="flex flex-wrap gap-2">
              {allValues.map((val) => {
                const isSelected  = selectedVal === val;
                const isAvailable = available.has(val);

                return (
                  <button
                    key={val}
                    onClick={() => isAvailable && onSelect(key, val)}
                    disabled={!isAvailable}
                    className={`
                      relative px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all
                      ${isSelected
                        ? "bg-stone-900 text-white border-stone-900"
                        : isAvailable
                          ? "bg-white text-stone-700 border-stone-200 hover:border-stone-900 hover:text-stone-900 cursor-pointer"
                          : "bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed"
                      }
                    `}
                  >
                    {val}
                    {/* strikethrough diagonal for unavailable */}
                    {!isAvailable && (
                      <span className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                        <span className="absolute top-1/2 left-0 w-full h-px bg-stone-200 rotate-[-18deg] block" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const ProductDetails = () => {
  const { productId } = useParams();
  const navigate      = useNavigate();

  const [product,      setProduct]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [activeImg,    setActiveImg]    = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({});

  const { handleGetProductById } = useProducts();

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const data = await handleGetProductById(productId);
        setProduct(data?.product);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  /* variants — supports both "varaints" (typo in schema) and "variants" */
  const variants = useMemo(
    () => product?.varaints || product?.variants || [],
    [product]
  );

  const allAttrKeys = useMemo(() => getAllAttrKeys(variants), [variants]);

  /* matched variant from current selections */
  const matchedVariant = useMemo(
    () => findMatchingVariant(variants, selectedAttrs),
    [variants, selectedAttrs]
  );

  /* is every attribute key selected */
  const selectionComplete =
    allAttrKeys.length > 0 &&
    allAttrKeys.every((k) => selectedAttrs[k] !== undefined);

  /* attribute select handler */
  const handleAttrSelect = (key, val) => {
    setSelectedAttrs((prev) => ({ ...prev, [key]: val }));
  };

  /* ── resolved display values: variant → product fallback ── */
  const baseAmount   = product?.price?.amount   ?? product?.priceAmount;
  const baseCurrency = product?.price?.currency ?? product?.priceCurrency ?? "INR";

  const displayAmount   = matchedVariant?.price?.amount   ?? baseAmount;
  const displayCurrency = matchedVariant?.price?.currency ?? baseCurrency;
  const displayStock    = matchedVariant?.stock ?? null;

  /* images: variant images if available, else product images */
  const displayImages = useMemo(() => {
    const vImgs = matchedVariant?.images?.filter((i) => i?.url);
    return vImgs?.length ? vImgs : product?.images || [];
  }, [matchedVariant, product]);

  /* reset activeImg when image set changes */
  useEffect(() => { setActiveImg(0); }, [displayImages]);

  /* stock badge */
  const StockBadge = () => {
    if (displayStock === null) return null;
    if (displayStock === 0)
      return (
        <span className="text-xs font-semibold bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
          Out of stock
        </span>
      );
    if (displayStock <= 10)
      return (
        <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">
          Only {displayStock} left
        </span>
      );
    return (
      <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
        {displayStock} in stock
      </span>
    );
  };

  return (
    <div className="h-screen bg-white font-sans flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="border-b border-stone-100 px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-stone-900 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-stone-900 tracking-tight">Snitch</span>
        </div>
        <span className="text-stone-200">/</span>
        <span className="text-sm text-stone-400 truncate max-w-xs">
          {product?.title || "Product Detail"}
        </span>
      </header>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-6 h-6 animate-spin text-stone-300" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* ── Not Found ── */}
      {!loading && !product && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-stone-500">Product not found</p>
          <button onClick={() => navigate(-1)} className="text-xs text-stone-400 underline underline-offset-2 mt-1">
            Go back
          </button>
        </div>
      )}

      {/* ── Main Content ── */}
      {!loading && product && (
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT: Images — switches to variant images on selection */}
          <div className="w-[52%] flex gap-3 p-5 overflow-hidden">

            {/* Thumbnail strip */}
            <div className="flex flex-col gap-2 overflow-y-auto">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImg === i
                      ? "border-stone-900 shadow-sm"
                      : "border-stone-200 opacity-60 hover:opacity-100 hover:border-stone-400"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center">
              {displayImages[activeImg]?.url ? (
                <img
                  src={displayImages[activeImg].url}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                  style={{ maxHeight: "100%" }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <svg className="w-16 h-16 text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* variant image indicator */}
              {matchedVariant?.images?.filter(i => i?.url).length > 0 && (
                <div className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                  Variant image
                </div>
              )}

              {/* Prev */}
              {displayImages.length > 1 && activeImg > 0 && (
                <button
                  onClick={() => setActiveImg((p) => p - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="w-4 h-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next */}
              {displayImages.length > 1 && activeImg < displayImages.length - 1 && (
                <button
                  onClick={() => setActiveImg((p) => p + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="w-4 h-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Counter */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                  {activeImg + 1} / {displayImages.length}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="w-1/2 flex flex-col justify-start gap-5 px-8 pr-16 py-8 overflow-y-auto">

            {/* Title */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
                Product Details
              </p>
              <h1 className="text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                {product.title}
              </h1>
            </div>

            {/* Price + stock */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold text-stone-900">
                ₹{Number(displayAmount).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-semibold bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">
                {displayCurrency}
              </span>
              {/* shows only when variant is matched */}
              <StockBadge />
              {/* price source hint */}
              {matchedVariant && matchedVariant.price?.amount == null && (
                <span className="text-xs text-stone-400 italic">base price</span>
              )}
            </div>

            <div className="h-px bg-stone-100" />

            {/* ── Variant Selector ── */}
            {variants.length > 0 && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                      Select Variant
                    </p>
                    {Object.keys(selectedAttrs).length > 0 && (
                      <button
                        onClick={() => setSelectedAttrs({})}
                        className="text-[11px] text-stone-400 hover:text-stone-700 underline underline-offset-2 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <VariantSelector
                    variants={variants}
                    selectedAttrs={selectedAttrs}
                    onSelect={handleAttrSelect}
                  />

                  {/* selection status */}
                  {selectionComplete && matchedVariant && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Variant selected
                    </div>
                  )}
                  {selectionComplete && !matchedVariant && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-red-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                      Combination unavailable
                    </div>
                  )}
                  {!selectionComplete && Object.keys(selectedAttrs).length > 0 && (
                    <p className="mt-2 text-[11px] text-stone-400 italic">
                      Also select:{" "}
                      {allAttrKeys.filter((k) => !selectedAttrs[k]).join(", ")}
                    </p>
                  )}
                </div>

                <div className="h-px bg-stone-100" />
              </>
            )}

            {/* Description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
                Description
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Dot indicators */}
            {displayImages.length > 1 && (
              <div className="flex items-center gap-1.5">
                {displayImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImg === i ? "w-5 bg-stone-900" : "w-1.5 bg-stone-300"
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="h-px bg-stone-100" />

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                disabled={selectionComplete && !matchedVariant}
                className="flex-1 border-2 border-stone-900 text-stone-900 text-sm font-semibold py-3 rounded-2xl hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                disabled={selectionComplete && !matchedVariant}
                className="flex-1 bg-stone-900 text-white text-sm font-semibold py-3 rounded-2xl hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
