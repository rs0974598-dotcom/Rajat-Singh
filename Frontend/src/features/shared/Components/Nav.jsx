
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Nav = () => {
    const user = useSelector(state =>state.auth?.user)

    return(
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
        {/* <div className="relative w-64">
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
        </div> */}

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
    )
}


export default Nav