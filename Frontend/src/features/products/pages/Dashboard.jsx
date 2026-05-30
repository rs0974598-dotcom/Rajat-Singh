import React, { useEffect, useState } from "react";

import { useProducts } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const Dashboard = () => {
  const { handleGetAllProducts } = useProducts();
  const sellerProducts = useSelector((state) => state.product.product) || [];

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid"); 
  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllProducts().finally(() => setLoading(false));
  }, []);

  const filtered = sellerProducts.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalImages = sellerProducts.reduce((s, p) => s + (p.images?.length || 0), 0);

  return (
    <div className="h-screen bg-stone-50 font-sans flex flex-col overflow-hidden">

      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-7 h-7 bg-stone-900 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-stone-800">Products</span>
        <span className="text-stone-300">/</span>
        <span className="text-sm text-stone-500">Dashboard</span>
        <Link
          to="/seller/create-Product"
          className="ml-auto flex items-center gap-1.5 bg-stone-900 text-white text-xs font-medium px-3.5 py-2 rounded-xl hover:bg-stone-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8" style={{ scrollbarWidth: "none" }}>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: "Total Products", value: sellerProducts.length, sub: "listed in store", color: "text-stone-900" },
            { label: "Total Images", value: totalImages, sub: "across all products", color: "text-blue-600" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{label}</p>
              <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <svg className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full text-sm bg-white border border-stone-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition placeholder-stone-300"
            />
          </div>

          <div className="flex bg-white border border-stone-200 rounded-xl overflow-hidden">
            <button onClick={() => setView("grid")} className={`px-3 py-2 transition-colors ${view === "grid" ? "bg-stone-900 text-white" : "text-stone-400 hover:text-stone-600"}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button onClick={() => setView("list")} className={`px-3 py-2 transition-colors ${view === "list" ? "bg-stone-900 text-white" : "text-stone-400 hover:text-stone-600"}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <span className="text-xs text-stone-400 ml-auto">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <svg className="w-6 h-6 animate-spin text-stone-300" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-stone-500">No products found</p>
            <p className="text-xs text-stone-400 mt-1">
              {search ? "Try a different search" : "Add your first product to get started"}
            </p>
          </div>
        )}

        {/* Grid View */}
        {!loading && view === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
            {filtered.map((product) => {
              const img = product.images?.[0]?.url;
              return (
                <div
  onClick={() =>
    navigate(`/seller/product/${product._id}`)
  }

                key={product._id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-stone-100">
                    {img ? (
                      <img src={img} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {product.images?.length > 1 && (
                      <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                        +{product.images.length - 1}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-stone-800 truncate">{product.title}</h3>
                    <p className="text-xs text-stone-400 truncate mt-0.5 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-stone-900">
                        ₹{Number(product.price?.amount).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-full">
                        {product.price?.currency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <span className="text-[10px] text-stone-400">{formatDate(product.createdAt)}</span>
                      <span className="text-[10px] text-stone-400">{timeAgo(product.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {!loading && view === "list" && filtered.length > 0 && (
          <div className="flex flex-col gap-3 pb-8">
            <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
              <span className="col-span-1"></span>
              <span className="col-span-4">Product</span>
              <span className="col-span-3">Description</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-right">Added</span>
            </div>

            {filtered.map((product) => {
              const img = product.images?.[0]?.url;
              return (
                <div key={product._id} className="bg-white border border-stone-200 rounded-2xl grid grid-cols-12 items-center gap-3 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="col-span-1 w-10 h-10 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                    {img ? (
                      <img src={img} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="col-span-4 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 truncate">{product.title}</p>
                    <p className="text-[10px] text-stone-400">{product.images?.length || 0} image{product.images?.length !== 1 ? "s" : ""}</p>
                  </div>

                  <p className="col-span-3 text-xs text-stone-400 truncate">{product.description}</p>

                  <div className="col-span-2 text-right">
                    <p className="text-sm font-bold text-stone-900">₹{Number(product.price?.amount).toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-stone-400">{product.price?.currency}</p>
                  </div>

                  <div className="col-span-2 text-right">
                    <p className="text-xs text-stone-500">{formatDate(product.createdAt)}</p>
                    <p className="text-[10px] text-stone-400">{timeAgo(product.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
