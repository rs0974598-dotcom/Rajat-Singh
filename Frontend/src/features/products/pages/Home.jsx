import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProduct';
import { useNavigate } from "react-router-dom";


const Home = () => {
  const products = useSelector(state => state.product.showproduct) || [];
  const user = useSelector(state => state.auth.user);
  const { handleGetAllPProducts } = useProducts();
  
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetAllPProducts().finally(() => setLoading(false));
  }, [handleGetAllPProducts]);

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-stone-50 font-sans flex flex-col overflow-hidden">

      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-900 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-base font-bold text-stone-900 tracking-tight">Snitch</span>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <svg className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition placeholder-stone-300"
          />
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-stone-600">
              {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <span className="text-sm font-medium text-stone-700">{user?.fullname || "Guest"}</span>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto px-6 py-8" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

        {/* Hero text */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">New Arrivals</h1>
          <p className="text-sm text-stone-400 mt-1">{filtered.length} product{filtered.length !== 1 ? "s" : ""} available</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-stone-500">No products found</p>
            <p className="text-xs text-stone-400 mt-1">{search ? "Try a different search" : "Check back later"}</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 pb-8">
            {filtered.map((product) => {
              const img = product.images?.[0]?.url;
              const amount = product.price?.amount ?? product.priceAmount;
              const currency = product.price?.currency ?? product.priceCurrency ?? "INR";

              return (
              <div
  key={product._id}
  onClick={() => navigate(`/product/${product._id}`)}
  className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
>
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Multi-image badge */}
             
                    {product.images?.length > 1 &&
                     (
                      <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                        +{product.images.length - 1}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-stone-800 truncate">{product.title}</h3>
                    <p className="text-xs text-stone-400 truncate mt-0.5">{product.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-stone-900">
                        ₹{Number(amount).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                        {currency}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

export default Home;
