"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ShieldCheck, CreditCard, Headset, LayoutDashboard, Send } from "lucide-react";
import { motion } from "framer-motion";
import OnboardingLayout from "../_components/OnboardingLayout";
import { useOnboarding } from "@/context/OnboardingContext";

function SuccessRightPanel({ firstName }: { firstName?: string }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden w-full max-w-lg aspect-square flex flex-col relative">
      {/* Mock Dashboard Header */}
      <div className="bg-neutral-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded" />
          <span className="text-white font-bold text-sm">360payZ</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-white font-bold">
          {firstName ? firstName[0] : "U"}
        </div>
      </div>
      
      {/* Mock Dashboard Content */}
      <div className="flex-1 bg-neutral-50 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-neutral-500 font-bold uppercase">Total Balance</div>
            <div className="text-3xl font-extrabold text-neutral-900 mt-1">₹0.00</div>
          </div>
          <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            <Check className="w-3 h-3" /> Active
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
            <Send className="w-5 h-5 text-primary mb-2" />
            <div className="text-sm font-bold text-neutral-900">Send Payment</div>
            <div className="text-xs text-neutral-500 mt-1">To Vendor / Supplier Bank Account</div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
            <CreditCard className="w-5 h-5 text-secondary mb-2" />
            <div className="text-sm font-bold text-neutral-900">Manage Cards</div>
            <div className="text-xs text-neutral-500 mt-1">1 active method</div>
          </div>
        </div>

        <div className="mt-auto bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-primary">KYC Verified</div>
            <div className="text-xs text-primary/70">Limits unlocked</div>
          </div>
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export default function SuccessPage() {
  const router = useRouter();
  const { state } = useOnboarding();

  return (
    <OnboardingLayout currentStep={6} rightPanel={<SuccessRightPanel firstName={state.firstName} />} hideBack>
      <div className="flex flex-col items-center text-center mb-8 pt-8">
        {/* Animated Checkmark */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative w-24 h-24 mb-8"
        >
          {/* Confetti particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                x: Math.cos((i * 45) * Math.PI / 180) * 80,
                y: Math.sin((i * 45) * Math.PI / 180) * 80,
              }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className={`absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-emerald-400'}`}
            />
          ))}
          
          <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            >
              <Check className="w-12 h-12 text-white stroke-[3]" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-extrabold text-neutral-900 mb-3"
        >
          Welcome to 360payZ
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-neutral-500 text-base max-w-sm"
        >
          Your account is ready. You can now start sending secure vendor payments.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4 mb-10"
      >
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex flex-col items-center text-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><Check className="w-4 h-4" /></div>
          <span className="text-xs font-bold text-neutral-700">Account Verified</span>
        </div>
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex flex-col items-center text-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><ShieldCheck className="w-4 h-4" /></div>
          <span className="text-xs font-bold text-neutral-700">Security Enabled</span>
        </div>
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex flex-col items-center text-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><CreditCard className="w-4 h-4" /></div>
          <span className="text-xs font-bold text-neutral-700">Payment Connected</span>
        </div>
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex flex-col items-center text-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Headset className="w-4 h-4" /></div>
          <span className="text-xs font-bold text-neutral-700">Support Available</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <button 
          onClick={() => router.push("/dashboard-preview")}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-5 h-5" /> Go To Dashboard
        </button>
        <button 
          onClick={() => router.push("/dashboard-preview")}
          className="w-full bg-neutral-100 text-neutral-800 font-bold py-4 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" /> Start First Transfer
        </button>
      </motion.div>
    </OnboardingLayout>
  );
}
