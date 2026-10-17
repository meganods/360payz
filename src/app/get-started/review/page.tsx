"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, User, FileText, ArrowRight, Loader2, ShieldCheck, CreditCard, ChevronRight, Edit2 } from "lucide-react";
import OnboardingLayout from "../_components/OnboardingLayout";
import { useOnboarding } from "@/context/OnboardingContext";

function ReviewRightPanel() {
  return (
    <div className="flex flex-col">
      <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 text-primary flex items-center justify-center mb-8 shadow-sm">
        <Clock className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-extrabold text-neutral-900 mb-4">Review Progress</h3>
      <p className="text-neutral-500 mb-10 leading-relaxed text-base">
        Track the status of your account verification. Most accounts are approved within 15 minutes during business hours.
      </p>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-200 before:via-neutral-200 before:to-neutral-100">
        
        <div className="relative flex items-center gap-6">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-neutral-50 z-10 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm flex-1">
            <h4 className="text-sm font-bold text-neutral-900">Account Created</h4>
            <p className="text-xs text-neutral-500 mt-1">Basic details captured.</p>
          </div>
        </div>

        <div className="relative flex items-center gap-6">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-neutral-50 z-10 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm flex-1">
            <h4 className="text-sm font-bold text-neutral-900">Contact Verified</h4>
            <p className="text-xs text-neutral-500 mt-1">Email & Mobile verified.</p>
          </div>
        </div>

        <div className="relative flex items-center gap-6">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-neutral-50 z-10 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm flex-1">
            <h4 className="text-sm font-bold text-neutral-900">KYC Submitted</h4>
            <p className="text-xs text-neutral-500 mt-1">Documents uploaded.</p>
          </div>
        </div>

        <div className="relative flex items-center gap-6">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md ring-4 ring-neutral-50 z-10 shrink-0 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 flex-1 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <h4 className="text-sm font-bold text-primary">Review In Progress</h4>
            <p className="text-xs text-primary/70 mt-1">Estimated: 5-15 mins.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const { state } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/get-started/payment-setup");
    }, 1000);
  };

  return (
    <OnboardingLayout currentStep={4} rightPanel={<ReviewRightPanel />}>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Verification Under Review</h1>
        <p className="text-neutral-500 text-sm">Our compliance team is reviewing your documents.</p>
      </div>

      <div className="space-y-6">
        
        {/* Editable Summary Sections */}
        <div className="space-y-4">
          
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm group">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-neutral-100 p-1.5 rounded-lg text-neutral-600"><User className="w-4 h-4" /></div>
                <h3 className="font-bold text-neutral-900 text-sm">Account Details</h3>
              </div>
              <button onClick={() => router.push("/get-started/account")} className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Edit <Edit2 className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-neutral-500">Name:</div>
              <div className="font-medium text-neutral-900 text-right truncate">{state.firstName} {state.lastName}</div>
              <div className="text-neutral-500">Email:</div>
              <div className="font-medium text-neutral-900 text-right truncate">{state.email}</div>
              <div className="text-neutral-500">Mobile:</div>
              <div className="font-medium text-neutral-900 text-right truncate">{state.phoneCountryCode} {state.phone}</div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm group">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-neutral-100 p-1.5 rounded-lg text-neutral-600"><ShieldCheck className="w-4 h-4" /></div>
                <h3 className="font-bold text-neutral-900 text-sm">Verification Status</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-neutral-500">Mobile:</div>
              <div className="text-right">
                {state.mobileVerified ? <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">Verified</span> : "Pending"}
              </div>
              <div className="text-neutral-500">Email:</div>
              <div className="text-right">
                {state.emailVerified ? <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">Verified</span> : "Pending"}
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm group">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-neutral-100 p-1.5 rounded-lg text-neutral-600"><FileText className="w-4 h-4" /></div>
                <h3 className="font-bold text-neutral-900 text-sm">KYC Status</h3>
              </div>
              <button onClick={() => router.push("/get-started/kyc")} className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Edit <Edit2 className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-neutral-500">Aadhaar & PAN:</div>
              <div className="text-right">
                {state.kycSubmitted ? <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded">In Review</span> : "Missing"}
              </div>
            </div>
          </div>

        </div>

        <div className="bg-[#F5F3FF] border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-primary text-sm">Next Step</h4>
            <p className="text-xs text-primary/70">Set up your payment methods</p>
          </div>
          <CreditCard className="w-6 h-6 text-primary opacity-50" />
        </div>

        <button 
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Payment Setup"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </OnboardingLayout>
  );
}
