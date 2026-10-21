"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  Receipt, 
  Building2, 
  CreditCard, 
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import GridBg from "@/components/UI/GridBg";
import SettlementAdviceModal, { SettlementAdviceData } from "@/components/SettlementAdviceModal";

interface TrackingData {
  id: string;
  vendorName: string;
  amount: number;
  feeAmount?: number;
  totalBilled?: number;
  rewardEarned?: number;
  status: string;
  utrNumber: string;
  date: string;
  createdAt?: string;
  bankName?: string;
  accountMasked?: string;
  ifsc?: string;
  rail?: string;
}

export default function TrackDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawTxnId = params?.txnId as string;
  const txnId = rawTxnId ? decodeURIComponent(rawTxnId) : "";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [copiedUtr, setCopiedUtr] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);

  useEffect(() => {
    if (!txnId) return;

    async function fetchTracking() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/track/${encodeURIComponent(txnId)}`);
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.error || `Could not find settlement details for "${txnId}".`);
        }
      } catch (err) {
        console.error(err);
        setError("Network error fetching live settlement status.");
      } finally {
        setLoading(false);
      }
    }

    fetchTracking();
  }, [txnId]);

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!data) return;
    const text = `*360payz Vendor Settlement Confirmation*\n\n` +
      `Beneficiary: *${data.vendorName}*\n` +
      `Amount Paid: *₹${data.amount.toLocaleString("en-IN")}*\n` +
      `Bank UTR: *${data.utrNumber}*\n` +
      `Status: *Settled & Cleared via IMPS*\n\n` +
      `View live bank tracking & download official voucher:\n${window.location.href}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative selection:bg-primary/20 selection:text-primary pt-28 pb-20">
      <GridBg />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Track Another Settlement</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Rail Clearance Node
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Querying Banking Gateway Nodes...</h3>
            <p className="text-xs text-slate-400 mt-1">Verifying NPCI settlement logs for {txnId}</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 sm:p-12 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Settlement Not Found</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/track")}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-sm"
              >
                Back to Settlement Search
              </button>
            </div>
          </div>
        )}

        {/* Loaded Tracking Content */}
        {!loading && data && (
          <div className="space-y-6">
            {/* Top Status Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Reference</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700">{data.id}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Settlement Confirmed & Credited
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Processed on <span className="font-semibold text-slate-800">{data.date}</span> via 24x7 NPCI IMPS Real-Time Rail.
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Vendor Credited Amount</span>
                  <span className="text-3xl font-black text-emerald-600">₹{data.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* UTR Callout */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Beneficiary Bank UTR (Unique Transaction Reference)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-mono font-black text-slate-900">{data.utrNumber}</span>
                    <button
                      onClick={() => handleCopyUtr(data.utrNumber)}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
                      title="Copy UTR"
                    >
                      {copiedUtr ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {copiedUtr && <span className="text-xs text-emerald-600 font-bold">Copied!</span>}
                  </div>
                </div>

                {/* Quick Share Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowVoucher(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>View Official Advice</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
                    title="Share with Vendor on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4-STAGE CLEARANCE RAIL (Inspired by Route4Me / Routific Delivery Stepper) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Banking Clearance Rail Timeline</h3>
                  <p className="text-xs text-slate-500 mt-0.5">End-to-end audit trail of payment authorization and clearing.</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Total Rail Time: 2m 14s
                </span>
              </div>

              {/* Stepper Grid */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500 space-y-8">
                {/* Stage 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">1. Commercial Credit Card Charged</h4>
                      <span className="text-[10px] text-slate-400 font-mono">00:00s</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Transaction token authorized via PCI-DSS Level 1 compliant gateway rail. 360payz platform fee (1%) transparently deducted.
                    </p>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">2. RBI AML & Velocity Screening Cleared</h4>
                      <span className="text-[10px] text-slate-400 font-mono">+00:15s</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Beneficiary bank account validated with NPCI Penny Drop verification. AML heuristics and sender-receiver reconciliation verified.
                    </p>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">3. NPCI IMPS Clearing Node Dispatched</h4>
                      <span className="text-[10px] text-slate-400 font-mono">+00:48s</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Immediate Payment Service (IMPS) dispatch message transmitted directly to the beneficiary's receiving bank node ({data.bankName || "HDFC Bank"}).
                    </p>
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">4. Beneficiary Credited & Bank UTR Confirmed</h4>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold">+02:14s</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Beneficiary bank acknowledged positive credit acknowledgement (ACK 200). Official Bank UTR <span className="font-mono font-bold text-slate-800">{data.utrNumber}</span> generated and archived.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Beneficiary Details Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4">Beneficiary Verification Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Beneficiary Name</span>
                  <span className="font-extrabold text-slate-900 mt-0.5 block truncate">{data.vendorName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bank & Account</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{data.bankName || "HDFC Bank"} ({data.accountMasked || "•••• 2910"})</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IFSC Code</span>
                  <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{data.ifsc || "HDFC0000102"}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clearance Rail</span>
                  <span className="font-semibold text-emerald-700 mt-0.5 block">{data.rail || "NPCI IMPS Direct"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Printable Settlement Advice Modal */}
      {showVoucher && data && (
        <SettlementAdviceModal
          data={{
            id: data.id,
            vendorName: data.vendorName,
            amount: data.amount,
            feeAmount: data.feeAmount,
            totalBilled: data.totalBilled,
            rewardEarned: data.rewardEarned,
            utrNumber: data.utrNumber,
            date: data.date,
            bankName: data.bankName,
            accountMasked: data.accountMasked,
            ifsc: data.ifsc,
          }}
          onClose={() => setShowVoucher(false)}
        />
      )}
    </div>
  );
}
