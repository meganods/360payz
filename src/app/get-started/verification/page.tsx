"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Mail, Smartphone, Loader2, ArrowRight, Lock } from "lucide-react";
import OnboardingLayout from "../_components/OnboardingLayout";
import { useOnboarding } from "@/context/OnboardingContext";

function VerificationRightPanel({ mobileVerified }: { mobileVerified: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 text-primary flex items-center justify-center mb-8 shadow-sm">
        <Lock className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-extrabold text-neutral-900 mb-4">Security & Verification</h3>
      <p className="text-neutral-500 mb-10 leading-relaxed text-base">
        We require two-factor authentication to ensure your business account is protected from unauthorized access.
      </p>
      
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-900">WhatsApp Verification</span>
          </div>
          {mobileVerified ? (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </span>
          ) : (
            <span className="bg-neutral-100 text-neutral-500 text-[10px] font-bold px-2 py-1 rounded-full">
              PENDING
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  const router = useRouter();
  const { state, updateState } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileTimer, setMobileTimer] = useState(60);
  const [emailTimer, setEmailTimer] = useState(60);

  // Timers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mobileTimer > 0 && !state.mobileVerified) {
      interval = setInterval(() => setMobileTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileTimer, state.mobileVerified]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emailTimer > 0 && !state.emailVerified) {
      interval = setInterval(() => setEmailTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer, state.emailVerified]);

  const verifyMobile = () => {
    if (mobileOtp.length === 6) {
      updateState({ mobileVerified: true });
    }
  };

  const verifyEmail = () => {
    if (emailOtp.length === 6) {
      updateState({ emailVerified: true });
    }
  };

  const handleContinue = () => {
    if (state.mobileVerified) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.push("/get-started/kyc");
      }, 1000);
    }
  };

  return (
    <OnboardingLayout currentStep={2} rightPanel={<VerificationRightPanel mobileVerified={state.mobileVerified} />}>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Verify Your Identity</h1>
        <p className="text-neutral-500 text-sm">Secure your account with quick verification.</p>
      </div>

      <div className="space-y-8">
        {/* Mobile Verification */}
        <div className={`p-6 rounded-2xl border transition-all ${state.mobileVerified ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-neutral-200 shadow-sm"}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                WhatsApp OTP Verification 
                {state.mobileVerified && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Sent to {state.phoneCountryCode} {state.phone || "9711191129"}
              </p>
            </div>
            {!state.mobileVerified && (
              <button onClick={() => router.back()} className="text-[10px] font-bold text-primary hover:underline uppercase">Change Number</button>
            )}
          </div>

          {!state.mobileVerified ? (
            <div className="flex gap-3">
              <input 
                type="text" 
                maxLength={6}
                value={mobileOtp}
                onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6 Digit OTP"
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center tracking-widest font-bold"
              />
              <button 
                onClick={verifyMobile}
                disabled={mobileOtp.length !== 6}
                className="bg-neutral-900 text-white font-bold px-6 rounded-xl hover:bg-black transition-colors disabled:opacity-50 text-sm"
              >
                Verify
              </button>
            </div>
          ) : (
            <div className="bg-emerald-100 text-emerald-700 text-sm font-bold p-3 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Mobile Successfully Verified
            </div>
          )}

          {!state.mobileVerified && (
            <div className="mt-3 text-xs text-neutral-500 flex justify-between">
              <span>Didn&apos;t receive code?</span>
              {mobileTimer > 0 ? (
                <span className="font-semibold">Resend in 00:{mobileTimer.toString().padStart(2, "0")}</span>
              ) : (
                <button onClick={() => setMobileTimer(60)} className="font-bold text-primary hover:underline">Resend OTP</button>
              )}
            </div>
          )}
        </div>


        <button 
          onClick={handleContinue}
          disabled={!state.mobileVerified || isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-6 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to KYC"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </OnboardingLayout>
  );
}
