"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  CheckCircle, 
  FileDown, 
  Loader2, 
  Plus, 
  Search, 
  TrendingUp, 
  Wallet, 
  Users, 
  Check, 
  Info,
  ShieldCheck,
  Zap,
  TrendingDown
} from "lucide-react";
import confetti from "canvas-confetti";

interface Vendor {
  id: string;
  name: string;
  bank: string;
  account: string;
  logo: string;
}

interface Transaction {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  status: "Success" | "Pending" | "Failed";
}

const INITIAL_VENDORS: Vendor[] = [
  { id: "v1", name: "Apex Distributors", bank: "HDFC Bank", account: "•••• 4829", logo: "AD" },
  { id: "v2", name: "Global Logistics Pvt Ltd", bank: "ICICI Bank", account: "•••• 9102", logo: "GL" },
  { id: "v3", name: "Surya Enterprise", bank: "State Bank of India", account: "•••• 7381", logo: "SE" },
  { id: "v4", name: "Metro Tech Solutions", bank: "Axis Bank", account: "•••• 2840", logo: "MT" },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "TXN1024", vendor: "Apex Distributors", amount: 45000, date: "Today, 10:14 AM", status: "Success" },
  { id: "TXN1023", vendor: "Global Logistics Pvt Ltd", amount: 120000, date: "Yesterday, 04:30 PM", status: "Success" },
  { id: "TXN1022", vendor: "Horizon Office Supplies", amount: 15400, date: "28 May 2026", status: "Success" },
  { id: "TXN1021", vendor: "Surya Enterprise", amount: 85000, date: "24 May 2026", status: "Success" },
];

export default function DashboardDemo() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [balance, setBalance] = useState(485200);
  const [todayTransfers, setTodayTransfers] = useState(45000);
  const [successCount, setSuccessCount] = useState(42);
  const [pendingCount, setPendingCount] = useState(0);

  // Form State
  const [selectedVendor, setSelectedVendor] = useState<Vendor>(INITIAL_VENDORS[0]);
  const [transferAmount, setTransferAmount] = useState("25000");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0); // 0: Idle, 1: Card Check, 2: Fraud Check, 3: KYC Match, 4: Settlement, 5: Done

  // New Vendor Form
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorBank, setNewVendorBank] = useState("");
  const [newVendorAcc, setNewVendorAcc] = useState("");

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName || !newVendorBank || !newVendorAcc) return;
    const newV: Vendor = {
      id: "v" + (vendors.length + 1),
      name: newVendorName,
      bank: newVendorBank,
      account: "•••• " + newVendorAcc.slice(-4),
      logo: newVendorName.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2)
    };
    setVendors([newV, ...vendors]);
    setSelectedVendor(newV);
    setNewVendorName("");
    setNewVendorBank("");
    setNewVendorAcc("");
    setShowAddVendor(false);
  };

  const startTransfer = async () => {
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) return;

    setIsProcessing(true);
    setPendingCount(prev => prev + 1);
    
    // Step animations
    const steps = [1, 2, 3, 4, 5];
    for (let i = 0; i < steps.length; i++) {
      setStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    // Log to backend
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: selectedVendor.id,
          vendorName: selectedVendor.name,
          amount: amt,
        }),
      });
    } catch (e) {
      console.warn("Transaction demo offline fallback:", e);
    }

    // Done
    setTransactions(prev => [
      {
        id: "TXN" + Math.floor(1000 + Math.random() * 9000),
        vendor: selectedVendor.name,
        amount: amt,
        date: "Just now",
        status: "Success",
      },
      ...prev
    ]);

    setBalance(prev => prev - amt);
    setTodayTransfers(prev => prev + amt);
    setSuccessCount(prev => prev + 1);
    setPendingCount(prev => prev - 1);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#A3FF12", "#8B5CF6", "#ffffff"]
    });

    setTimeout(() => {
      setIsProcessing(false);
      setStep(0);
      setTransferAmount("25000");
    }, 2000);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Transaction ID,Vendor,Amount,Date,Status"].join(",") + "\n"
      + transactions.map(t => `${t.id},"${t.vendor}",${t.amount},"${t.date}",${t.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `360payz_statement_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-neutral-200 shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-primary tracking-widest">Simulator</span>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">Interactive Payout Portal</h3>
          <p className="text-xs text-neutral-500">Experience live credit-to-vendor settlement</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100/80 text-amber-800 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
            <Info className="w-3.5 h-3.5" />
            Demo Dashboard Preview
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCSV} 
            className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs py-2.5 px-4 rounded-xl border border-neutral-200 transition-colors shadow-sm"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowAddVendor(!showAddVendor)}
            className="flex items-center gap-1.5 bg-primary text-white font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-primary/95 transition-colors shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Left column: Quick Stats & Vendor Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          <div className="relative pt-3">
            <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 shadow-sm">
              <span className="text-[10px] text-neutral-500 block font-bold uppercase">Sample Volume</span>
              <span className="text-sm font-semibold text-neutral-900">₹{todayTransfers >= 100000 ? `${(todayTransfers/100000).toFixed(2)}L` : todayTransfers.toLocaleString("en-IN")}</span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 shadow-sm">
              <span className="text-[10px] text-neutral-500 block font-bold uppercase">Sample Success</span>
              <span className="text-sm font-semibold text-emerald-600">{successCount}</span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 shadow-sm">
              <span className="text-[10px] text-neutral-500 block font-bold uppercase">Sample Pending</span>
              <span className="text-sm font-semibold text-amber-600">{pendingCount}</span>
            </div>
          </div>
          </div>

          {/* Payout Form or Add Vendor Form */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 flex-grow relative min-h-[300px] shadow-sm">
            <AnimatePresence mode="wait">
              {!showAddVendor ? (
                <motion.div
                  key="transfer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h5 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                    New Vendor Transfer
                  </h5>
                  
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1 uppercase font-bold">Select Vendor</label>
                    <select
                      value={selectedVendor.id}
                      onChange={(e) => {
                        const v = vendors.find(x => x.id === e.target.value);
                        if (v) setSelectedVendor(v);
                      }}
                      className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary shadow-sm"
                      disabled={isProcessing}
                    >
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id} className="bg-white text-neutral-900">
                          {v.name} ({v.bank})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1 uppercase font-bold">Transfer Amount (₹)</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary text-xl font-bold shadow-sm"
                      placeholder="Enter amount"
                      disabled={isProcessing}
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["5000", "25000", "50000", "100000"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setTransferAmount(preset)}
                          disabled={isProcessing}
                          className="text-[10px] px-2 py-1 rounded bg-white hover:bg-neutral-100 text-neutral-700 transition-colors border border-neutral-200 shadow-sm"
                        >
                          +₹{parseInt(preset).toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={startTransfer}
                    disabled={isProcessing || !transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > balance}
                    className="w-full mt-4 bg-primary text-white font-extrabold text-xs py-3.5 rounded-xl hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay Now
                        <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="add-vendor"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleAddVendor}
                  className="space-y-4"
                >
                  <h5 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Register New Vendor
                  </h5>

                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1 uppercase font-bold">Vendor / Company Name</label>
                    <input
                      type="text"
                      required
                      value={newVendorName}
                      onChange={(e) => setNewVendorName(e.target.value)}
                      placeholder="e.g. Acme Logistics Ltd"
                      className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1 uppercase font-bold">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={newVendorBank}
                      onChange={(e) => setNewVendorBank(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1 uppercase font-bold">Account Number</label>
                    <input
                      type="text"
                      required
                      value={newVendorAcc}
                      onChange={(e) => setNewVendorAcc(e.target.value)}
                      placeholder="e.g. 501000847321"
                      className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddVendor(false)}
                      className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold py-2.5 rounded-xl border border-neutral-200 shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-primary/95 shadow-md shadow-primary/20"
                    >
                      Save Vendor
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right columns: Central Engine & Transactions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top segment: Transaction engine or Analytics graph preview */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 min-h-[190px] flex flex-col justify-between shadow-sm">
            {!isProcessing ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Volume Performance
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100 font-semibold shadow-sm">
                    <Check className="h-3 w-3" /> Live
                  </span>
                </div>
                {/* Simulated Sparkline / Chart */}
                <div className="h-24 w-full flex items-end gap-1.5 pt-4">
                  {[30, 45, 25, 60, 50, 75, 40, 85, 95, 65, 80, 100].map((val, idx) => (
                    <div key={idx} className="flex-1 bg-neutral-200 rounded-t-sm h-full relative group">
                      <div 
                        style={{ height: `${val}%` }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/50 to-primary rounded-t-sm transition-all duration-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-2 border-t border-neutral-200 font-medium">
                  <span>May 27</span>
                  <span>May 30</span>
                  <span>Today</span>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center py-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary animate-pulse" />
                    360payZ Verification Engine
                  </span>
                  <span className="text-[10px] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse font-bold">
                    <Loader2 className="h-3 w-3 animate-spin" /> Processing
                  </span>
                </div>
                
                {/* Stepper Visualizer */}
                <div className="grid grid-cols-5 gap-2 relative mt-2">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 -z-10" />
                  
                  {[
                    { title: "Card Auth", val: 1 },
                    { title: "Fraud Check", val: 2 },
                    { title: "KYC Match", val: 3 },
                    { title: "Settlement", val: 4 },
                    { title: "Done", val: 5 },
                  ].map((s) => (
                    <div key={s.val} className="flex flex-col items-center">
                      <div 
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          step >= s.val
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                        }`}
                      >
                        {step > s.val ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.val}
                      </div>
                      <span className={`text-[9px] mt-1 text-center font-bold ${step >= s.val ? "text-neutral-800" : "text-neutral-400"}`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom segment: Transaction History */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 flex-grow shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Recent Transfers</h5>
              <span className="text-[10px] text-neutral-500 font-medium">Showing last 4 records</span>
            </div>
            
            <div className="space-y-3">
              {transactions.slice(0, 4).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-primary/20 transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xs text-primary border border-primary/20">
                      {txn.vendor.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2)}
                    </div>
                    <div>
                      <h6 className="text-xs font-semibold text-neutral-900">{txn.vendor}</h6>
                      <span className="text-[10px] text-neutral-500 font-medium">{txn.date} • {txn.id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-900 block">
                      ₹{txn.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
