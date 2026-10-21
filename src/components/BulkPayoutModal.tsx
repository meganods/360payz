"use client";

import React, { useState } from "react";
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Loader2, 
  Building2, 
  CreditCard, 
  Download,
  ArrowRight,
  Sparkles
} from "lucide-react";

export interface BulkItem {
  id: string;
  vendorName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  amount: number;
  invoiceRef: string;
  status: "pending" | "processing" | "settled" | "error";
  utrNumber?: string;
}

interface BulkPayoutModalProps {
  cards: Array<{ id: string; name: string; number: string; bank: string; limit?: string }>;
  onClose: () => void;
  onBatchCompleted: (items: BulkItem[]) => void;
}

const SAMPLE_BATCH: BulkItem[] = [
  { id: "b1", vendorName: "Apex Distributors Pvt Ltd", accountNumber: "50100239482910", ifsc: "HDFC0000102", bankName: "HDFC Bank", amount: 75000, invoiceRef: "INV-2026-891", status: "pending" },
  { id: "b2", vendorName: "Global Logistics Express", accountNumber: "000293849102", ifsc: "ICIC0000004", bankName: "ICICI Bank", amount: 140000, invoiceRef: "INV-2026-904", status: "pending" },
  { id: "b3", vendorName: "Surya Enterprise Packaging", accountNumber: "310492837381", ifsc: "SBIN0000781", bankName: "State Bank of India", amount: 55000, invoiceRef: "INV-2026-912", status: "pending" },
  { id: "b4", vendorName: "Metro Tech Solutions Hub", accountNumber: "918029382840", ifsc: "UTIB0000140", bankName: "Axis Bank", amount: 80000, invoiceRef: "INV-2026-928", status: "pending" },
];

export default function BulkPayoutModal({ cards, onClose, onBatchCompleted }: BulkPayoutModalProps) {
  const [items, setItems] = useState<BulkItem[]>(SAMPLE_BATCH);
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || "c1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [settledItems, setSettledItems] = useState<BulkItem[]>([]);

  const totalGross = items.reduce((sum, item) => sum + item.amount, 0);
  const platformFee = Math.round(totalGross * 0.01);
  const totalCharged = totalGross + platformFee;
  const rewardsEarned = Math.round(totalGross * 0.02);

  // File upload simulation (CSV parse)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      const parsed: BulkItem[] = [];

      // Skip header if contains "Vendor" or "Name"
      const startIndex = lines[0]?.toLowerCase().includes("name") ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim());
        if (parts.length >= 4) {
          const amountNum = parseFloat(parts[3].replace(/[^0-9.]/g, "")) || 25000;
          parsed.push({
            id: `b_up_${i}`,
            vendorName: parts[0] || "Vendor Beneficiary",
            accountNumber: parts[1] || "501009999999",
            ifsc: parts[2] || "HDFC0000102",
            bankName: parts[2]?.startsWith("HDFC") ? "HDFC Bank" : parts[2]?.startsWith("ICIC") ? "ICICI Bank" : "Commercial Bank",
            amount: amountNum,
            invoiceRef: parts[4] || `INV-2026-${100 + i}`,
            status: "pending",
          });
        }
      }

      if (parsed.length > 0) {
        setItems(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteBatch = async () => {
    setIsProcessing(true);
    // Simulate batch execution step-by-step
    const processed: BulkItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      // Generate realistic UTR for each
      const utr = `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      processed.push({
        ...it,
        status: "settled",
        utrNumber: utr,
      });

      // Post to transactions backend
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId: it.id,
            vendorName: it.vendorName,
            cardId: selectedCardId,
            amount: it.amount,
            userId: "demo-user",
          }),
        });
      } catch (err) {
        console.error("Batch item sync error:", err);
      }
    }

    // Delay slightly to feel like instant bank clearance
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsProcessing(false);
    setIsCompleted(true);
    setSettledItems(processed);
    onBatchCompleted(processed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Bulk Vendor Payout & Smart Dispatch</h2>
              <p className="text-xs text-slate-500">
                Upload CSV or disburse to multiple vendors in a single credit card transaction.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Upload Banner */}
          {!isCompleted && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-white transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-800">Drop your vendor CSV file here</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Columns: Vendor Name, Account, IFSC, Amount, Invoice Ref</span>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sample Batch</span>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Preloaded with 4 verified enterprise vendors for testing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setItems(SAMPLE_BATCH)}
                  className="text-xs font-bold text-primary hover:underline text-left"
                >
                  Reset to Sample 4 Invoices →
                </button>
              </div>
            </div>
          )}

          {/* Funding Card Selection */}
          {!isCompleted && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Fund Entire Batch with Corporate Card:</span>
                  <span className="text-[11px] text-slate-500">All vendors cleared via separate instantaneous IMPS rails</span>
                </div>
              </div>
              <select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:border-primary"
              >
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.bank} - {c.number})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Batch Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                Invoices to Disburse ({items.length})
              </span>
              <span className="font-mono font-bold text-slate-600">
                Total Gross: ₹{totalGross.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-[10px] text-slate-400 uppercase font-bold sticky top-0 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">Beneficiary</th>
                    <th className="py-2.5 px-4">Bank / Account</th>
                    <th className="py-2.5 px-4">Invoice #</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Clearance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {(isCompleted ? settledItems : items).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.vendorName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {item.bankName} •••• {item.accountNumber.slice(-4)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{item.invoiceRef}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        {item.status === "settled" ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Settled: {item.utrNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-semibold">Ready for Rail</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settlement Financial Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/30 to-emerald-50/40 border border-slate-200 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-6 text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Gross Payout</span>
                <span className="text-sm font-black text-slate-900">₹{totalGross.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">1% Convenience Fee</span>
                <span className="text-sm font-semibold text-slate-800">₹{platformFee.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">Card Rewards (2%)</span>
                <span className="text-sm font-bold text-emerald-600">+{rewardsEarned} Pts</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Billed to Card</span>
              <span className="text-lg font-black text-primary">₹{totalCharged.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
          >
            {isCompleted ? "Close & View Dashboard" : "Cancel"}
          </button>

          {!isCompleted ? (
            <button
              type="button"
              disabled={isProcessing || items.length === 0}
              onClick={handleExecuteBatch}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-extrabold transition-all shadow-md shadow-primary/25 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Clearing {items.length} Invoices via IMPS...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Disburse Batch of {items.length} (₹{totalCharged.toLocaleString("en-IN")})</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                All {settledItems.length} Payouts Dispatched Successfully
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
