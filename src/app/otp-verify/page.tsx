"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import GridBg from "@/components/UI/GridBg";

export default function OTPVerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next box
    if (element.value !== "" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard-preview");
    }, 1500);
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

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-neutral-200 rounded-3xl p-8 md:p-10 shadow-xl relative text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900">Enter Security Code</h2>
          <p className="text-xs text-neutral-500 mt-2">
            A 6-digit verification code has been sent to your registered WhatsApp number.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-bold bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.some(v => v === "")}
            className="w-full bg-primary text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying Authenticator...
              </>
            ) : (
              "Confirm Code"
            )}
          </button>
        </form>

        <p className="text-xs text-neutral-500 mt-6">
          Didn&apos;t receive code?{" "}
          <button className="text-primary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}
