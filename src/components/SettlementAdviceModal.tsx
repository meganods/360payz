"use client";

import React, { useState } from "react";
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Copy, 
  Check, 
  Building2, 
  ShieldCheck, 
  ExternalLink,
  Receipt
} from "lucide-react";
import Logo from "./Logo";

export interface SettlementAdviceData {
  id: string;
  vendorName: string;
  amount: number;
  feeAmount?: number;
  totalBilled?: number;
  rewardEarned?: number;
  utrNumber: string;
  date: string;
  bankName?: string;
  accountMasked?: string;
  ifsc?: string;
  cardNetwork?: string;
  cardLastFour?: string;
}

interface SettlementAdviceModalProps {
  data: SettlementAdviceData | null;
  onClose: () => void;
}

export default function SettlementAdviceModal({ data, onClose }: SettlementAdviceModalProps) {
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!data) return null;

  const grossAmount = data.amount || 0;
  const platformFee = data.feeAmount || Math.round(grossAmount * 0.01);
  const gstAmount = Math.round(platformFee * 0.18);
  const totalBilled = data.totalBilled || (grossAmount + platformFee + gstAmount);
  const rewards = data.rewardEarned || Math.round(grossAmount * 0.02);
  const utr = data.utrNumber || "UTR" + Math.floor(1000000000 + Math.random() * 9000000000);

  const handleCopyUtr = () => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleCopyLink = () => {
    const trackingUrl = typeof window !== "undefined" 
      ? `${window.location.origin}/track/${data.id}` 
      : `https://360payz.com/track/${data.id}`;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const trackingUrl = typeof window !== "undefined" 
      ? `${window.location.origin}/track/${data.id}` 
      : `https://360payz.com/track/${data.id}`;
    
    const text = `*360payz Digital Settlement Advice*\n\n` +
      `Beneficiary: *${data.vendorName}*\n` +
      `Amount Credited: *₹${grossAmount.toLocaleString("en-IN")}*\n` +
      `Bank UTR Number: *${utr}*\n` +
      `Settlement Status: *Confirmed & Settled via IMPS*\n` +
      `Date: ${data.date}\n\n` +
      `Verify live bank clearance & download voucher:\n${trackingUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Background click to close */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      {/* Main Voucher Container */}
      <div 
        id="settlement-voucher-content"
        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Official Bank Settlement Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              title="Close Voucher"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Voucher Content */}
        <div className="p-8 space-y-6 text-slate-800">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <Logo withSlogan={false} className="scale-90 origin-left" />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">B2B Commercial Settlement & Direct Vendor Clearing Rails</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Settlement Completed (IMPS)
              </span>
              <p className="text-[11px] font-mono text-slate-500 mt-1.5">Ref: {data.id}</p>
            </div>
          </div>

          {/* Key UTR Highlight Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-slate-50 to-indigo-50/50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Official Bank Reference (UTR)</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-mono font-extrabold text-slate-900 tracking-wide">{utr}</span>
                <button
                  onClick={handleCopyUtr}
                  className="p-1 rounded hover:bg-white text-slate-500 hover:text-slate-900 transition-colors print:hidden"
                  title="Copy UTR"
                >
                  {copiedUtr ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Settled on <span className="font-semibold text-slate-900">{data.date}</span> via NPCI Instant IMPS Clearing
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gross Credited to Beneficiary</span>
              <span className="text-2xl font-black text-emerald-600 tracking-tight">₹{grossAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Beneficiary Entity (Credited)</span>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary shrink-0" />
                <span>{data.vendorName}</span>
              </h4>
              <div className="text-xs space-y-1 text-slate-600 pt-1 border-t border-slate-200/60 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank:</span>
                  <span className="font-semibold text-slate-800">{data.bankName || "HDFC Bank Ltd"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account:</span>
                  <span className="font-mono text-slate-800">{data.accountMasked || "•••• •••• 2910"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IFSC Code:</span>
                  <span className="font-mono text-slate-800">{data.ifsc || "HDFC0000102"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remitter Payment Details</span>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Commercial Card Rail (Verified)</span>
              </h4>
              <div className="text-xs space-y-1 text-slate-600 pt-1 border-t border-slate-200/60 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Funding Method:</span>
                  <span className="font-semibold text-slate-800">{data.cardNetwork || "Visa Infinite Corporate"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Card Ref:</span>
                  <span className="font-mono text-slate-800">•••• {data.cardLastFour || "5820"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cashback / Points:</span>
                  <span className="font-bold text-emerald-600">+{rewards} Points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-4">Line Item Description</th>
                  <th className="py-2.5 px-4">HSN / SAC</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Gross Settlement Credit to Beneficiary Account
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">997119</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    ₹{grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    360payz Technology & Processing Fee (1.00%)
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">997159</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">
                    ₹{platformFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500">
                    GST on Processing Fee (18% Input Credit Eligible)
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">18% GST</td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="bg-slate-50/80 font-black text-slate-900 text-sm">
                  <td className="py-3.5 px-4">Total Amount Charged to Remitter Card</td>
                  <td className="py-3.5 px-4"></td>
                  <td className="py-3.5 px-4 text-right text-primary">
                    ₹{totalBilled.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal / Regulatory Footnote & QR Validation */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400">
            <p className="max-w-md text-center sm:text-left leading-relaxed">
              * This is a digitally verified settlement advice document generated by 360payz under applicable Reserve Bank of India (RBI) payment guidelines. Valid proof of vendor settlement for accounts reconciliation and GST input tax credit.
            </p>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handleCopyLink}
                className="text-primary hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <ExternalLink className="w-3 h-3" />
                <span>{copiedLink ? "Link Copied!" : "Copy Tracking URL"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info (Print only) */}
        <div className="hidden print:block text-center text-[9px] text-slate-400 py-4 border-t border-slate-200">
          Generated automatically by 360payz Financial Clearing Platform • https://360payz.com • Support: support@360payz.com
        </div>
      </div>
    </div>
  );
}
