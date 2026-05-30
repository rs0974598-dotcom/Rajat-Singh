import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProduct";

const ProductDetails = () => {
  const { productId } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  

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

  const amount = product?.price?.amount ?? product?.priceAmount;
  const currency = product?.price?.currency ?? product?.priceCurrency ?? "INR";

  return (
    <div className="h-screen bg-white font-sans flex flex-col overflow-hidden">

      {/* Header */}
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
        <span className="text-sm text-stone-400 truncate max-w-xs">{product?.title || "Product Detail"}</span>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-6 h-6 animate-spin text-stone-300" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* Not Found */}
      {!loading && !product && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-stone-500">Product not found</p>
          <button onClick={() => navigate(-1)} className="text-xs text-stone-400 underline underline-offset-2 mt-1">Go back</button>
        </div>
      )}

      {/* Main Content */}
      {!loading && product && (
        <div className="flex-1 flex overflow-hidden">

          {/* ── Left: Images ── */}
          <div className="w-[52%] flex gap-3 p-5 overflow-hidden">

            {/* Thumbnail strip */}
            <div className="flex flex-col gap-2 overflow-hidden">
              {product.images?.map((img, i) => (
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

            {/* Main image with prev/next buttons */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center">
              {product.images?.[activeImg]?.url ? (
                <img
                  src={product.images[activeImg].url}
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

              {/* Prev button */}
              {product.images?.length > 1 && activeImg > 0 && (
                <button
                  onClick={() => setActiveImg((prev) => prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="w-4 h-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next button */}
              {product.images?.length > 1 && activeImg < product.images.length - 1 && (
                <button
                  onClick={() => setActiveImg((prev) => prev + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="w-4 h-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image counter */}
              {product.images?.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                  {activeImg + 1} / {product.images.length}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="w-1/2 flex flex-col justify-center gap-7 px-8 pr-16">

            {/* Title */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Product Details</p>
              <h1 className="text-3xl font-bold text-stone-900 tracking-tight leading-snug">{product.title}</h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-stone-900">
                ₹{Number(amount).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-semibold bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">
                {currency}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-stone-100" />

            {/* Description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Description</p>
              <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Dot indicators */}
            {product.images?.length > 1 && (
              <div className="flex items-center gap-1.5">
                {product.images.map((_, i) => (
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

            {/* Divider */}
            <div className="h-px bg-stone-100" />

            {/* Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 border-2 border-stone-900 text-stone-900 text-sm font-semibold py-3 rounded-2xl hover:bg-stone-50 transition-colors">
                Add to Cart
              </button>
              <button className="flex-1 bg-stone-900 text-white text-sm font-semibold py-3 rounded-2xl hover:bg-stone-700 transition-colors">
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
