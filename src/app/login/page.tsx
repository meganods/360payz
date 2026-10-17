"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import GridBg from "@/components/UI/GridBg";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await signIn(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to sign in. Please verify your credentials.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        if (email.toLowerCase().includes("admin")) {
          router.push("/admin-preview");
        } else {
          router.push("/dashboard-preview");
        }
      }, 600);
    }
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center py-16 px-6">
      <GridBg />

      {/* Back Button */}
      <div className="absolute top-8 left-6 md:left-12 lg:left-16 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-bold text-neutral-700 hover:text-primary bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="w-full max-w-md bg-white/85 backdrop-blur-xl border border-neutral-200/80 rounded-3xl p-8 md:p-10 shadow-2xl relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary text-white font-extrabold text-base mb-4 shadow-lg shadow-primary/25">
            360
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-neutral-500 mt-2">
            Sign in to manage your vendor settlements and linked cards
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-start gap-3 text-red-700 text-xs leading-relaxed animate-in fade-in duration-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in duration-300">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <p>Signed in successfully! Redirecting to your dashboard...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-neutral-700 block mb-1.5 uppercase tracking-wider">
              Work Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white text-xs text-neutral-900 border border-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-neutral-700 block uppercase tracking-wider">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white text-xs text-neutral-900 border border-neutral-200 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-700 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-primary text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-primary/95 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/get-started/account" className="font-bold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
