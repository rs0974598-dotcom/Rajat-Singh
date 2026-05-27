import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";          // ← apna path check karo
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

export default function Login() {
  const { handleLogin } = useAuth();
  const  navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted]       = useState(false);


  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(link);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = await handleLogin({
    email: form.email,
    password: form.password,
  });

  console.log(data);

  if (data?.user?.role === "buyer") {
    navigate("/");
  } 
  else if (data?.user?.role === "seller") {
    navigate("/seller/dashboard");
  }

  setSubmitted(true);

  setTimeout(() => setSubmitted(false), 3500);
};

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ────────────── LEFT — MODEL IMAGE ────────────── */}
      <div className="relative hidden w-[44%] flex-shrink-0 overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85&auto=format&fit=crop"
          alt="Snitch model"
          className="h-full w-full object-cover object-top"
        />

        {/* overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        {/* brand — top */}
        <div className="absolute left-0 top-0 p-10">
          <p
            className="text-[58px] leading-none text-white"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.06em" }}
          >
            SNITCH
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Streetwear", "AW 25", "New Drop"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-widest text-white/40"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* tagline — bottom */}
        <div className="absolute bottom-0 left-0 p-10">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/35">
            Welcome back
          </p>
          <p className="text-xl font-light leading-relaxed text-white">
            Good to see you again. <br /> Your style awaits.
          </p>
        </div>
      </div>

      {/* ────────────── RIGHT — FORM ────────────── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10">
        <div className="w-full max-w-[380px]">

          {/* mobile logo */}
          <p
            className="mb-8 text-[40px] leading-none text-black lg:hidden"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.06em" }}
          >
            SNITCH
          </p>

          {/* heading */}
          <div className="mb-8">
            <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-gray-400">
              Sign in to continue your journey with Snitch.
            </p>
          </div>

          {/* success toast */}
          {submitted && !error && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm text-white">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Signed in successfully!
            </div>
          )}

          {/* error toast */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-2xl border-[1.5px] border-transparent bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-300 hover:border-gray-200 focus:border-black focus:bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-gray-400 transition-colors hover:text-black"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border-[1.5px] border-transparent bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-300 hover:border-gray-200 focus:border-black focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label="Toggle password"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors hover:text-gray-500"
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[11px] text-gray-300">or continue with</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>  
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-black py-4 text-sm font-semibold tracking-wide text-white transition-all hover:bg-gray-900 active:scale-[0.983] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
            <ContinueWithGoogle/>
            {/* register link */}
            <p className="text-center text-[13px] text-gray-400">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-black transition-opacity hover:opacity-60"
              >
                Create one
              </a>
            </p>

          </form>

          {/* terms */}
          <p className="mt-6 text-center text-[11px] leading-relaxed text-gray-300">
            By continuing you agree to Snitch&apos;s{" "}
            <a href="#" className="underline transition-colors hover:text-gray-400">Terms of Service</a>{" "}
            &amp;{" "}
            <a href="#" className="underline transition-colors hover:text-gray-400">Privacy Policy</a>
          </p>

        </div>
      </div>

    </div>
  );
}
