"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check, ShieldCheck, Zap, LineChart, Headset, Loader2, AlertCircle } from "lucide-react";
import OnboardingLayout from "../_components/OnboardingLayout";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";

function AccountRightPanel() {
  return (
    <div className="flex flex-col">
      <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 text-primary flex items-center justify-center mb-8 shadow-sm">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-extrabold text-neutral-900 mb-4">Why Join 360payZ?</h3>
      <p className="text-neutral-500 mb-10 leading-relaxed text-base">
        Experience the future of B2B payments. Settle vendor invoices instantly using your credit limit and earn eligible rewards.
      </p>
      
      <ul className="space-y-8">
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-base">Fast Onboarding</h4>
            <p className="text-sm text-neutral-500 mt-1.5">Get verified and start transferring in under 5 minutes.</p>
          </div>
        </li>
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-base">Secure Platform</h4>
            <p className="text-sm text-neutral-500 mt-1.5">Bank-grade encryption and automated fraud monitoring.</p>
          </div>
        </li>
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
            <LineChart className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-base">Real-Time Tracking</h4>
            <p className="text-sm text-neutral-500 mt-1.5">Monitor all your transactions and rewards on one dashboard.</p>
          </div>
        </li>
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
            <Headset className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-base">Dedicated Support</h4>
            <p className="text-sm text-neutral-500 mt-1.5">24/7 priority support for all our business partners.</p>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { state, updateState } = useOnboarding();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = 
    state.firstName.trim() !== "" &&
    state.lastName.trim() !== "" &&
    state.email.trim() !== "" &&
    state.phone.trim() !== "" &&
    password !== "" &&
    confirmPassword !== "" &&
    password === confirmPassword &&
    termsAccepted &&
    privacyAccepted;

  const calculateStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 7) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const strength = calculateStrength(password);
  const strengthColor = 
    strength === 0 ? "bg-neutral-200" :
    strength <= 25 ? "bg-red-500" :
    strength <= 50 ? "bg-orange-500" :
    strength <= 75 ? "bg-yellow-500" : "bg-emerald-500";

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const displayName = `${state.firstName.trim()} ${state.lastName.trim()}`.trim();
    const res = await signUp(state.email, password, displayName);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create account.");
    } else {
      router.push("/get-started/verification");
    }
  };

  return (
    <OnboardingLayout currentStep={1} rightPanel={<AccountRightPanel />} hideBack>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Create Your Account</h1>
        <p className="text-neutral-500 text-sm">Get started with 360payZ in less than 2 minutes.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-start gap-3 text-red-700 text-xs leading-relaxed animate-in fade-in duration-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleContinue} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">First Name</label>
            <input 
              type="text" required 
              value={state.firstName}
              onChange={e => updateState({ firstName: e.target.value })}
              className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              placeholder="e.g. Kabir"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">Last Name</label>
            <input 
              type="text" required 
              value={state.lastName}
              onChange={e => updateState({ lastName: e.target.value })}
              className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              placeholder="e.g. Roy"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">WhatsApp Number</label>
          <div className="flex">
            <select 
              className="bg-neutral-50 border border-r-0 border-neutral-200 rounded-l-xl px-3 py-3 text-sm text-neutral-700 focus:outline-none font-medium"
              value={state.phoneCountryCode}
              onChange={e => updateState({ phoneCountryCode: e.target.value })}
            >
              <option value="+91">IN (+91)</option>
              <option value="+1">US (+1)</option>
              <option value="+44">UK (+44)</option>
              <option value="+61">AU (+61)</option>
            </select>
            <input 
              type="tel" required 
              value={state.phone}
              onChange={e => updateState({ phone: e.target.value })}
              className="w-full bg-white border border-neutral-200 rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              placeholder="9711191129"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {password && (
              <div className="flex gap-1 mt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-1 w-full rounded-full ${i < (strength / 25) ? strengthColor : "bg-neutral-200"}`} />
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} required 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                required 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="peer sr-only" 
              />
              <div className="w-5 h-5 border-2 border-neutral-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center peer-checked:[&>svg]:opacity-100">
                <Check className="w-3.5 h-3.5 text-white opacity-0 transition-opacity" strokeWidth={3} />
              </div>
            </div>
            <span className="text-xs text-neutral-600 mt-0.5">I agree to the <Link href="/terms" target="_blank" className="text-primary font-bold hover:underline">Terms & Conditions</Link></span>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                required 
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="peer sr-only" 
              />
              <div className="w-5 h-5 border-2 border-neutral-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center peer-checked:[&>svg]:opacity-100">
                <Check className="w-3.5 h-3.5 text-white opacity-0 transition-opacity" strokeWidth={3} />
              </div>
            </div>
            <span className="text-xs text-neutral-600 mt-0.5">I have read the <Link href="/privacy-policy" target="_blank" className="text-primary font-bold hover:underline">Privacy Policy</Link></span>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="w-5 h-5 border-2 border-neutral-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center peer-checked:[&>svg]:opacity-100">
                <Check className="w-3.5 h-3.5 text-white opacity-0 transition-opacity" strokeWidth={3} />
              </div>
            </div>
            <span className="text-xs text-neutral-600 mt-0.5">Receive marketing updates and reward offers.</span>
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !isFormValid}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-6 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
        </button>

        <div className="pt-4 text-center">
          <p className="text-xs text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </OnboardingLayout>
  );
}
