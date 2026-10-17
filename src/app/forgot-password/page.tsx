"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react";
import GridBg from "@/components/UI/GridBg";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    const res = await resetPassword(email);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Failed to send reset email.");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-16 px-6">
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

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-neutral-200 rounded-3xl p-8 md:p-10 shadow-xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white font-extrabold text-sm mb-4 shadow-md shadow-primary/20">
            360
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900">Reset Password</h2>
          <p className="text-xs text-neutral-500 mt-1">We&apos;ll send you instructions to reset your password</p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">Email Sent!</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Check your inbox at <strong>{email}</strong> for instructions on how to reset your password.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-xs font-bold text-primary hover:underline"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-neutral-500 block mb-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-neutral-50 text-xs text-neutral-900 border border-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-primary/95 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-6 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
