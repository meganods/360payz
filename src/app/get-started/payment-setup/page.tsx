"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, Smartphone, ShieldCheck, Lock, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import OnboardingLayout from "../_components/OnboardingLayout";
import { useOnboarding, PaymentMethodType } from "@/context/OnboardingContext";

const methods = [
  { id: "credit_card", title: "Credit Card", desc: "Earn rewards and utilize interest-free limits.", icon: CreditCard, badges: ["Instant", "Rewards"] },
  { id: "debit_card", title: "Debit Card", desc: "Directly debit from your linked bank account.", icon: CreditCard, badges: ["Instant"] },
  { id: "bank_account", title: "Bank Account", desc: "Bank transfers for large volumes.", icon: Landmark, badges: ["No Limit"] },
  { id: "upi", title: "UPI", desc: "Quick transfers using your UPI ID.", icon: Smartphone, badges: ["Instant", "Zero Fee"] },
];

function PaymentSetupRightPanel() {
  return (
    <div className="flex flex-col">
      <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 text-primary flex items-center justify-center mb-8 shadow-sm">
        <Lock className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-extrabold text-neutral-900 mb-4">Secure Payment Methods</h3>
      <p className="text-neutral-500 mb-10 leading-relaxed text-base">
        We never store your full card details. All payment information is tokenized and stored with our licensed banking partners.
      </p>
      
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-neutral-900/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" />
        <h4 className="font-bold text-xl mb-3">Enterprise-Grade Security</h4>
        <ul className="space-y-4 text-sm text-neutral-300">
          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Card payments processed through PCI-DSS certified partners</li>
          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> AES-256 Encryption</li>
          <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Real-time Fraud Prevention</li>
        </ul>
      </div>
    </div>
  );
}

export default function PaymentSetupPage() {
  const router = useRouter();
  const { state, updateState } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/get-started/success");
    }, 1000);
  };

  return (
    <OnboardingLayout currentStep={5} rightPanel={<PaymentSetupRightPanel />}>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Add Payment Method</h1>
        <p className="text-neutral-500 text-sm">Securely configure your preferred payment method.</p>
      </div>

      <div className="space-y-4">
        {methods.map((method) => {
          const isSelected = state.selectedPaymentMethod === method.id;
          return (
            <motion.div
              key={method.id}
              whileHover={{ scale: isSelected ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateState({ selectedPaymentMethod: method.id as PaymentMethodType })}
              className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 ${
                isSelected 
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                  : "border-neutral-200 bg-white hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600"
                }`}>
                  <method.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-lg ${isSelected ? "text-primary" : "text-neutral-900"}`}>
                      {method.title}
                    </h3>
                    <div className="flex gap-2">
                      {method.badges.map((badge, idx) => (
                        <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-500 px-2 py-1 rounded">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">{method.desc}</p>
                </div>
              </div>

              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full text-white flex items-center justify-center shadow-lg border-2 border-white"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </motion.div>
          );
        })}

        <button 
          onClick={handleContinue}
          disabled={!state.selectedPaymentMethod || isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-8 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </OnboardingLayout>
  );
}
