"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Clock, 
  Receipt,
  Zap,
  Lock
} from "lucide-react";
import GridBg from "@/components/UI/GridBg";

const SAMPLE_TRACKS = [
  { id: "TXN1024", vendor: "Apex Distributors Pvt Ltd", amount: "₹45,000", status: "Settled via IMPS" },
  { id: "TXN1023", vendor: "Global Logistics Express", amount: "₹1,20,000", status: "Settled via IMPS" },
  { id: "TXN1020", vendor: "Surya Enterprise Packaging", amount: "₹65,000", status: "Settled via IMPS" },
];

export default function TrackLandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setError("Please enter a valid Transaction Reference or Bank UTR Number.");
      return;
    }
    setError("");
    router.push(`/track/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative selection:bg-primary/20 selection:text-primary pt-28 pb-20">
      <GridBg />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb / Top Tag */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Live Banking Clearance Tracker
          </span>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Track Vendor Payout & Bank UTR in Real Time
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            Real-time verification of credit card funding, RBI compliance checks, NPCI IMPS dispatch, and beneficiary bank clearance.
          </p>
        </div>

        {/* Tracker Search Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50 max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Enter Transaction Reference or Bank UTR
              </label>
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. TXN1024 or UTR9832749102"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                />
              </div>
              {error && <p className="text-xs text-rose-500 font-bold mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-primary hover:bg-primary/95 text-white font-extrabold text-sm transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
            >
              <span>Track Settlement Status</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Samples */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Or Try A Sample Recent Settlement:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_TRACKS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => router.push(`/track/${sample.id}`)}
                  className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-primary group-hover:underline">{sample.id}</span>
                    <span className="text-[10px] font-bold text-slate-700">{sample.amount}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{sample.vendor}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Pillar Guarantee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Instant IMPS Rails</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Direct connection to NPCI fast rails ensures vendor bank credits reflect in under 2 minutes 24x7.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Official Bank Advice</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Every payout produces a tax-compliant digital settlement voucher complete with verifiable UTR and GST breakdown.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Bank-Grade Privacy</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Beneficiary account numbers are masked per RBI cyber-security standards to guarantee complete confidentiality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
