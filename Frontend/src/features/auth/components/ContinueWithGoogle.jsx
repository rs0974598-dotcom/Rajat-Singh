
import React from 'react'

const ContinueWithGoogle = () => {
  return (
   <a
  href="/api/auth/google"
  className="w-full"
>
  <button
    type="button"
    className="w-full h-[44px] bg-white border border-[#dadce0] rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
  >
    {/* Google Logo */}
    <img
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google"
      className="w-5 h-5"
    />

    {/* Text */}
    <span className="text-[14px] font-medium text-[#3c4043]">
      Continue with Google
    </span>
  </button>
</a>
  )
}

export default ContinueWithGoogle