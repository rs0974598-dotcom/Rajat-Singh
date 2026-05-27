import { useState, useRef } from "react";
import { useEffect } from "react";
import { useProducts } from "../hooks/useProduct.js";
import { useNavigate } from "react-router-dom";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AED", "JPY", "CAD"];

export default function CreateProduct() {
  const { handleCreateProducts } = useProducts();
    const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addImages = (files) => {
    const incoming = Array.from(files).slice(0, 7 - images.length);
    const withPreviews = incoming.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2),
    }));
    setImages((prev) => [...prev, ...withPreviews].slice(0, 7));
  };

  const handleFileChange = (e) => addImages(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addImages(e.dataTransfer.files);
  };

  const removeImage = (id) =>
    setImages((prev) => prev.filter((img) => img.id !== id));

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.priceAmount || isNaN(form.priceAmount) || Number(form.priceAmount) <= 0)
      newErrors.priceAmount = "Enter a valid price.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("priceAmount", form.priceAmount);
    formData.append("priceCurrency", form.priceCurrency);
    images.forEach((img) => formData.append("images", img.file));
    navigate("/")

    try {
      setLoading(true);
      await handleCreateProducts(formData);
      setSubmitted(true);
    } catch (err) {
      setApiError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ title: "", description: "", priceAmount: "", priceCurrency: "USD" });
    setImages([]);
    setErrors({});
    setApiError("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-1">Product Created</h2>
          <p className="text-stone-500 text-sm mb-6">
            <span className="font-medium text-stone-700">"{form.title}"</span> has been added successfully.
          </p>
          <button
            onClick={handleReset}
            className="w-full bg-stone-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
          >
            Create Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-stone-50 font-sans flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-7 h-7 bg-stone-900 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-stone-800 tracking-tight">Products</span>
        <span className="text-stone-300 text-sm">/</span>
        <span className="text-sm text-stone-500">New Product</span>
      </header>

      <main className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 py-10" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Create Product</h1>
          <p className="text-sm text-stone-500 mt-1">Fill in the details below to add a new product.</p>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`w-full text-sm text-stone-800 placeholder-stone-300 bg-stone-50 border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition ${
                errors.title ? "border-red-300 bg-red-50" : "border-stone-200"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your product — features, materials, use cases..."
              className={`w-full text-sm text-stone-800 placeholder-stone-300 bg-stone-50 border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition resize-none ${
                errors.description ? "border-red-300 bg-red-50" : "border-stone-200"
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-500">{errors.description}</p>
              ) : <span />}
              <span className="text-xs text-stone-400">{form.description.length} chars</span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Price
            </label>
            <div className="flex gap-2">
              <select
                name="priceCurrency"
                value={form.priceCurrency}
                onChange={handleChange}
                className="text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                name="priceAmount"
                value={form.priceAmount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`flex-1 text-sm text-stone-800 placeholder-stone-300 bg-stone-50 border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition ${
                  errors.priceAmount ? "border-red-300 bg-red-50" : "border-stone-200"
                }`}
              />
            </div>
            {errors.priceAmount && (
              <p className="text-xs text-red-500 mt-1.5">{errors.priceAmount}</p>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Images
              </label>
              <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {images.length} / 7
              </span>
            </div>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {images.map((img, i) => (
                  <div key={img.id} className="relative group aspect-square">
                    <img
                      src={img.preview}
                      alt={`product-${i}`}
                      className="w-full h-full object-cover rounded-xl border border-stone-200"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-stone-900 text-white px-1.5 py-0.5 rounded-md">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-red-500 hover:border-red-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            {images.length < 7 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-stone-400 bg-stone-50"
                    : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm text-stone-600 font-medium">Drop images here</p>
                <p className="text-xs text-stone-400 mt-0.5">or <span className="text-stone-600 underline underline-offset-2">browse files</span></p>
                <p className="text-xs text-stone-400 mt-2">PNG, JPG, WEBP · up to {7 - images.length} more</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-6">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex-1 text-sm font-medium text-stone-600 bg-white border border-stone-200 py-2.5 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-sm font-medium text-white bg-stone-900 py-2.5 rounded-xl hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Product
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
