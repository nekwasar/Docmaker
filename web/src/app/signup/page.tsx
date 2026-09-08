"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Sign up
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Signup failed");
          setLoading(false);
          return;
        }

        // Auto-login after signup
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          setError("Account created but login failed. Please try logging in.");
          setLoading(false);
          return;
        }
      } else {
        // Login
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          setError(loginData.error || "Invalid email or password");
          setLoading(false);
          return;
        }
      }

      // Redirect to the page they were on
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#121660" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
              <path d="M12 5V3.5A1.5 1.5 0 0 1 13.5 2h3A1.5 1.5 0 0 1 18 3.5v3a1.5 1.5 0 0 1-1.5 1.5H15" />
              <line x1="10" y1="10" x2="14" y2="10" />
              <line x1="10" y1="13" x2="13" y2="13" />
              <line x1="10" y1="16" x2="14" y2="16" />
            </svg>
            <span className="text-2xl font-bold text-slate-900">Docmaker</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-slate-500 mt-2">
            {mode === "signup"
              ? "Start using Docmaker for free"
              : "Log in to your account"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
                  placeholder="johndoe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660] pr-12"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white bg-[#121660] hover:bg-[#0f1250] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === "signup" ? "Create Account" : "Log In"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button onClick={() => { setMode("login"); setError(""); }} className="text-[#121660] font-medium hover:underline">
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button onClick={() => { setMode("signup"); setError(""); }} className="text-[#121660] font-medium hover:underline">
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
