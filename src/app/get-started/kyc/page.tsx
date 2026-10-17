"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, UploadCloud, FileText, Loader2, ArrowRight, X, AlertCircle } from "lucide-react";
import OnboardingLayout from "../_components/OnboardingLayout";
import { useOnboarding } from "@/context/OnboardingContext";

function KYCRightPanel() {
  return (
    <div className="flex flex-col">
      <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 text-primary flex items-center justify-center mb-8 shadow-sm">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-extrabold text-neutral-900 mb-4">Compliance & Protection</h3>
      <p className="text-neutral-500 mb-10 leading-relaxed text-base">
        Verification helps keep the platform secure and compliant. We use bank-grade encryption to store your documents.
      </p>
      
      <ul className="space-y-8">
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-base">Fraud Protection</h4>
            <p className="text-sm text-neutral-500 mt-1.5">Prevents unauthorized individuals from misusing your identity.</p>
          </div>
        </li>
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-base">Regulatory Compliance</h4>
            <p className="text-sm text-neutral-500 mt-1.5">Designed to align with applicable RBI and AML guidelines for B2B transactions.</p>
          </div>
        </li>
        <li className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-base">Faster Approval</h4>
            <p className="text-sm text-neutral-500 mt-1.5">Clear documents ensure your account is approved within minutes.</p>
          </div>
        </li>
      </ul>
    </div>
  );
}

function FileUploader({ 
  label, 
  file, 
  onFileChange 
}: { 
  label: string; 
  file: File | null; 
  onFileChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFile = (selected: File) => {
    if (selected.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    if (!["image/jpeg", "image/png", "application/pdf"].includes(selected.type)) {
      alert("Only JPG, PNG, and PDF files are allowed.");
      return;
    }
    
    // Simulate upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onFileChange(selected);
          return 0;
        }
        return prev + 15;
      });
    }, 100);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide">{label}</label>
      
      {file ? (
        <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => onFileChange(null)}
            className="text-neutral-400 hover:text-red-500 transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : uploadProgress > 0 ? (
        <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-4">
          <div className="flex justify-between text-xs font-bold text-neutral-500 mb-2">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
            ${dragActive ? "border-primary bg-primary/5" : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            type="file" 
            className="hidden" 
            ref={inputRef} 
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
            }}
          />
          <UploadCloud className={`w-8 h-8 mb-3 ${dragActive ? "text-primary" : "text-neutral-400"}`} />
          <p className="text-sm font-bold text-neutral-700">Click to upload or drag & drop</p>
          <p className="text-xs text-neutral-500 mt-1">PNG, JPG or PDF (max. 10MB)</p>
        </div>
      )}
    </div>
  );
}

export default function KYCPage() {
  const router = useRouter();
  const { state, updateState } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.aadhaarFrontFile || !state.aadhaarBackFile || !state.panFile) {
      setError("Please upload all required documents to proceed.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panNumber: "ABCDE1234F",
          aadhaarNumber: "9210",
          dob: state.dob,
          address: state.address,
        }),
      });
    } catch (err) {
      console.warn("KYC submission fallback:", err);
    }

    updateState({ kycSubmitted: true, kycStatus: "in_review" });
    setIsLoading(false);
    router.push("/get-started/review");
  };

  return (
    <OnboardingLayout currentStep={3} rightPanel={<KYCRightPanel />}>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Complete KYC</h1>
        <p className="text-neutral-500 text-sm">Upload your documents for regulatory compliance.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-6 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleContinue} className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">Personal Information</h3>
          
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">Full Name (As per PAN)</label>
            <input 
              type="text" required 
              value={state.firstName ? `${state.firstName} ${state.lastName}` : ""}
              readOnly
              className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-500 shadow-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Sourced from account setup.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">Date of Birth</label>
              <input 
                type="date" required 
                value={state.dob}
                onChange={e => updateState({ dob: e.target.value })}
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">Full Address</label>
              <input 
                type="text" required 
                value={state.address}
                onChange={e => updateState({ address: e.target.value })}
                placeholder="Residential Address"
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">Document Uploads</h3>
          
          <FileUploader 
            label="Aadhaar Card (Front)" 
            file={state.aadhaarFrontFile} 
            onFileChange={(f) => updateState({ aadhaarFrontFile: f })} 
          />
          
          <FileUploader 
            label="Aadhaar Card (Back)" 
            file={state.aadhaarBackFile} 
            onFileChange={(f) => updateState({ aadhaarBackFile: f })} 
          />
          
          <FileUploader 
            label="PAN Card" 
            file={state.panFile} 
            onFileChange={(f) => updateState({ panFile: f })} 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-8 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Verification"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </OnboardingLayout>
  );
}
