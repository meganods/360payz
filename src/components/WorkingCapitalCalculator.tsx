"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle,
  Award,
  Clock,
  CheckCircle2
} from "lucide-react";

interface WorkingCapitalCalculatorProps {
  embedded?: boolean; // if true, fits inside dashboard
}

export default function WorkingCapitalCalculator({ embedded = false }: WorkingCapitalCalculatorProps) {
  // Volume slider in INR
  const [monthlyVolume, setMonthlyVolume] = useState<number>(1500000); // 15 Lakhs
  // Card tier: 1%, 2%, 3.3%
  const [rewardRate, setRewardRate] = useState<number>(2.0);
  // Bank Overdraft (OD) interest rate: 10% to 18% p.a.
  const [odRate, setOdRate] = useState<number>(14);

  // Calculations
  const platformFeeRate = 0.01; // 1%
  const floatDays = 45; // 45-day interest free credit card float

  const monthlyFee = monthlyVolume * platformFeeRate;
  const annualFee = monthlyFee * 12;

  // Overdraft interest saved per month by utilizing 45-day credit card float instead of bank OD
  const monthlyOdSaved = (monthlyVolume * (odRate / 100) * floatDays) / 365;
  const annualOdSaved = monthlyOdSaved * 12;

  // Credit card rewards accrued
  const monthlyRewards = monthlyVolume * (rewardRate / 100);
  const annualRewards = monthlyRewards * 12;

  // Net annual gain
  const netAnnualGain = (annualOdSaved + annualRewards) - annualFee;
  const netMonthlyGain = netAnnualGain / 12;

  return (
    <div className={`w-full ${embedded ? "" : "max-w-5xl mx-auto"}`}>
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Working Capital & Rewards ROI Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Calculate Your 45-Day Float & Rewards Gain
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              See how replacing expensive bank overdraft with 45-day interest-free card credit pays for itself.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-700">Estimated Net ROI</span>
              <span className="text-base font-black text-emerald-700">
                +{Math.round((netAnnualGain / annualFee) * 100)}% Profit
              </span>
            </div>
          </div>
        </div>

        {/* 2 Column Layout: Controls (Left) vs Output Metrics (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Monthly Vendor Volume */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Monthly Vendor Payout Volume
                </label>
                <span className="text-base font-black text-primary bg-primary/5 px-3 py-1 rounded-xl border border-primary/15">
                  ₹{monthlyVolume.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                <span>₹1 Lakh/mo</span>
                <span>₹25 Lakhs</span>
                <span>₹50 Lakhs</span>
                <span>₹1 Crore/mo</span>
              </div>
            </div>

            {/* Slider 2: Card Tier Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Credit Card Tier & Reward Rate
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Standard Business", rate: 1.0, desc: "1.0% Cashback" },
                  { label: "Premium Corporate", rate: 2.0, desc: "2.0% Rewards" },
                  { label: "Super-Premium", rate: 3.3, desc: "3.3% Infinia/Magnus" },
                ].map((tier) => (
                  <button
                    key={tier.rate}
                    type="button"
                    onClick={() => setRewardRate(tier.rate)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      rewardRate === tier.rate
                        ? "bg-primary/5 border-primary text-slate-900 shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xs font-extrabold block text-slate-900">{tier.label}</span>
                    <span className={`text-[11px] font-bold block mt-0.5 ${rewardRate === tier.rate ? "text-primary" : "text-slate-500"}`}>
                      {tier.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 3: Alternative Bank Overdraft (OD) Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Alternative Bank Overdraft (OD) Interest Rate</span>
                  <span className="text-[10px] text-slate-400 lowercase">(cost of bank working capital loan)</span>
                </label>
                <span className="text-sm font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl">
                  {odRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="18"
                step="0.5"
                value={odRate}
                onChange={(e) => setOdRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                <span>10% (Prime SME)</span>
                <span>14% (Standard Bank OD)</span>
                <span>18% (Unsecured WC Loan)</span>
              </div>
            </div>

            {/* Key Value Proposition Callout */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-900 block">45-Day Cash Liquidity Retention</span>
                <p className="mt-0.5 leading-relaxed text-slate-500">
                  By deferring your payout outflow by up to 50 days without paying loan interest, your operating capital remains available in your current account for bulk purchasing discounts and payroll.
                </p>
              </div>
            </div>
          </div>

          {/* Results Summary Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
                Net Annual Value Created
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ₹{Math.round(netAnnualGain).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                (≈ +₹{Math.round(netMonthlyGain).toLocaleString("en-IN")}/month surplus after all 360payz fees)
              </p>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Bank Overdraft Interest Saved:
                </span>
                <span className="font-bold text-white">+₹{Math.round(annualOdSaved).toLocaleString("en-IN")}/yr</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Credit Card Rewards Earned:
                </span>
                <span className="font-bold text-white">+₹{Math.round(annualRewards).toLocaleString("en-IN")}/yr</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 border-t border-white/5 pt-2">
                <span>360payz Platform Fee (1%):</span>
                <span className="font-mono text-rose-300">-₹{Math.round(annualFee).toLocaleString("en-IN")}/yr</span>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-2">
              <Link
                href="/dashboard-preview"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 group"
              >
                <span>Unlock Working Capital Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                No setup fees • Instant beneficiary activation • RBI compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
