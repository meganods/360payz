"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Download, 
  Plus, 
  LogOut, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Receipt,
  Building2,
  Copy,
  Loader2,
  Award,
  FileSpreadsheet,
  Calculator,
  ExternalLink,
  Printer,
  ShieldCheck
} from "lucide-react";
import GridBg from "@/components/UI/GridBg";
import { useAuth } from "@/context/AuthContext";
import SettlementAdviceModal from "@/components/SettlementAdviceModal";
import BulkPayoutModal, { BulkItem } from "@/components/BulkPayoutModal";
import WorkingCapitalCalculator from "@/components/WorkingCapitalCalculator";

interface Card {
  id: string;
  name: string;
  number: string;
  expiry: string;
  bank: string;
  active: boolean;
  network?: string;
  limit?: string;
}

interface Vendor {
  id?: string;
  name: string;
  account: string;
  ifsc: string;
  bank: string;
  category?: string;
  verified?: boolean;
}

interface PayoutReceipt {
  id: string;
  vendorName: string;
  amount: number;
  feeAmount: number;
  totalBilled: number;
  rewardEarned: number;
  utrNumber: string;
  date: string;
  status: string;
  bankName?: string;
  accountMasked?: string;
  ifsc?: string;
}

export default function DashboardPreviewPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "payout" | "bulk" | "calculator" | "vendors" | "cards" | "receipts">("overview");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedReceiptForAdvice, setSelectedReceiptForAdvice] = useState<PayoutReceipt | null>(null);

  // Sample Cards
  const [cards, setCards] = useState<Card[]>([
    { id: "c1", name: "Corporate Operating Card", number: "•••• •••• •••• 5820", expiry: "12/29", bank: "HDFC Bank", active: true, network: "Visa Infinite", limit: "₹25,00,000" },
    { id: "c2", name: "Executive Payouts Card", number: "•••• •••• •••• 9144", expiry: "06/28", bank: "ICICI Bank", active: true, network: "Mastercard World", limit: "₹15,00,000" },
    { id: "c3", name: "Raw Material Spend Card", number: "•••• •••• •••• 3051", expiry: "08/30", bank: "Axis Bank", active: false, network: "RuPay Select", limit: "₹10,00,000" }
  ]);

  // Sample Vendors
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: "v1", name: "Apex Distributors Pvt Ltd", account: "50100239482910", ifsc: "HDFC0000102", bank: "HDFC Bank", category: "Raw Materials", verified: true },
    { id: "v2", name: "Global Logistics Express", account: "000293849102", ifsc: "ICIC0000004", bank: "ICICI Bank", category: "Freight & Shipping", verified: true },
    { id: "v3", name: "Surya Enterprise Packaging", account: "310492837381", ifsc: "SBIN0000781", bank: "State Bank of India", category: "Packaging", verified: true },
    { id: "v4", name: "Metro Tech Solutions Hub", account: "918029382840", ifsc: "UTIB0000140", bank: "Axis Bank", category: "Cloud & IT", verified: true }
  ]);

  // Receipts / Settlement History
  const [receipts, setReceipts] = useState<PayoutReceipt[]>([
    { id: "TXN1024", vendorName: "Apex Distributors Pvt Ltd", amount: 45000, feeAmount: 450, totalBilled: 45450, rewardEarned: 900, utrNumber: "UTR9832749102", date: "Today, 10:14 AM", status: "Settled in 2m 14s" },
    { id: "TXN1023", vendorName: "Global Logistics Express", amount: 120000, feeAmount: 1200, totalBilled: 121200, rewardEarned: 2400, utrNumber: "UTR8291038472", date: "Yesterday, 04:30 PM", status: "Settled in 3m 05s" },
    { id: "TXN1020", vendorName: "Surya Enterprise Packaging", amount: 65000, feeAmount: 650, totalBilled: 65650, rewardEarned: 1300, utrNumber: "UTR4920194820", date: "16 Oct, 11:20 AM", status: "Settled in 2m 45s" }
  ]);

  // Transfer Form State
  const [selectedVendorId, setSelectedVendorId] = useState<string>("v1");
  const [transferAmount, setTransferAmount] = useState<string>("50000");
  const [selectedCardId, setSelectedCardId] = useState<string>("c1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<PayoutReceipt | null>(null);

  // New Vendor Form
  const [newVendor, setNewVendor] = useState({ name: "", account: "", ifsc: "", bank: "" });
  const [showAddVendor, setShowAddVendor] = useState(false);

  // New Card Form
  const [newCard, setNewCard] = useState({ name: "", number: "", expiry: "", bank: "" });
  const [showAddCard, setShowAddCard] = useState(false);

  // Copy helper
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Dynamic 360payz-only metrics: 100% mathematically synchronized
  const totalLimit = 5000000; // ₹50,00,000 across linked corporate cards
  const totalDisbursed = receipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalRewards = receipts.reduce((sum, r) => sum + (Number(r.rewardEarned) || 0), 0);
  const availableLimit = Math.max(0, totalLimit - totalDisbursed);
  const utilizedPercent = Number(((totalDisbursed / totalLimit) * 100).toFixed(1));
  const availablePercent = Number((100 - utilizedPercent).toFixed(1));

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_auth");
      localStorage.removeItem("admin_logged_in");
      localStorage.setItem("user_logged_in", "true");
      localStorage.setItem("user_role", "user");
    }
    async function loadData() {
      try {
        const targetUserId = user ? user.uid : "demo-user";
        const [vRes, cRes] = await Promise.all([
          fetch(`/api/vendors?userId=${encodeURIComponent(targetUserId)}`),
          fetch(`/api/cards?userId=${encodeURIComponent(targetUserId)}`),
        ]);
        if (vRes.ok) {
          const vData = await vRes.json();
          if (Array.isArray(vData.data) && vData.data.length > 0) {
            setVendors(vData.data.map((item: { name: string; accountNumber: string; ifsc: string; bankName: string; id?: string }) => ({
              id: item.id || `v_${Math.random()}`,
              name: item.name,
              account: item.accountNumber,
              ifsc: item.ifsc,
              bank: item.bankName,
              verified: true,
            })));
          }
        }
        if (cRes.ok) {
          const cData = await cRes.json();
          if (Array.isArray(cData.data) && cData.data.length > 0) {
            setCards(cData.data.map((item: { id: string; cardLabel?: string; cardHolderName?: string; lastFour: string; expiry: string; bankName: string; isActive: boolean }) => ({
              id: item.id,
              name: item.cardLabel || item.cardHolderName || "Linked Card",
              number: "•••• •••• •••• " + item.lastFour,
              expiry: item.expiry,
              bank: item.bankName,
              active: item.isActive,
              network: "Commercial Card",
              limit: "₹20,00,000",
            })));
          }
        }
      } catch (e) {
        console.warn("Using local preview state:", e);
      }
    }
    loadData();
  }, [user]);

  const toggleCard = (id: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const handleExecutePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(transferAmount);
    if (!numericAmount || numericAmount <= 0) return;

    setIsProcessing(true);
    const vendor = vendors.find(v => v.id === selectedVendorId) || vendors[0];
    const feeAmount = Math.round(numericAmount * 0.01);
    const totalBilled = numericAmount + feeAmount;
    const rewardEarned = Math.round(numericAmount * 0.02);
    const generatedUtr = `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: vendor.id || "v1",
          vendorName: vendor.name,
          cardId: selectedCardId,
          amount: numericAmount,
          userId: user ? user.uid : "demo-user",
        }),
      });
    } catch (err) {
      console.warn("Local transfer fallback:", err);
    }

    const newTxn: PayoutReceipt = {
      id: `TXN${Math.floor(2000 + Math.random() * 8000)}`,
      vendorName: vendor.name,
      amount: numericAmount,
      feeAmount,
      totalBilled,
      rewardEarned,
      utrNumber: generatedUtr,
      date: "Just now",
      status: "Settled in 2m 10s"
    };

    setTimeout(() => {
      setIsProcessing(false);
      setReceipts(prev => [newTxn, ...prev]);
      setSuccessReceipt(newTxn);
    }, 1200);
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.account || !newVendor.ifsc || !newVendor.bank) return;
    
    const targetUserId = user ? user.uid : "demo-user";
    try {
      await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newVendor.name,
          accountNumber: newVendor.account,
          ifsc: newVendor.ifsc,
          bankName: newVendor.bank,
          userId: targetUserId,
        }),
      });
    } catch (err) {
      console.warn("Local vendor fallback:", err);
    }

    const created: Vendor = {
      id: `v_${Date.now()}`,
      name: newVendor.name,
      account: newVendor.account,
      ifsc: newVendor.ifsc,
      bank: newVendor.bank,
      verified: true
    };
    setVendors(prev => [...prev, created]);
    setNewVendor({ name: "", account: "", ifsc: "", bank: "" });
    setShowAddVendor(false);
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.name || !newCard.number || !newCard.expiry || !newCard.bank) return;

    const targetUserId = user ? user.uid : "demo-user";
    try {
      await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCard.name,
          number: newCard.number,
          expiry: newCard.expiry,
          bank: newCard.bank,
          userId: targetUserId,
        }),
      });
    } catch (err) {
      console.warn("Local card fallback:", err);
    }

    setCards(prev => [...prev, {
      id: "c" + (prev.length + 1),
      name: newCard.name,
      number: "•••• •••• •••• " + newCard.number.slice(-4),
      expiry: newCard.expiry,
      bank: newCard.bank,
      active: true,
      network: "Visa Commercial",
      limit: "₹15,00,000"
    }]);
    setNewCard({ name: "", number: "", expiry: "", bank: "" });
    setShowAddCard(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(text);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_logged_in");
      localStorage.removeItem("user_auth");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_email");
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  const parsedAmount = Number(transferAmount) || 0;
  const currentFee = Math.round(parsedAmount * 0.01);
  const currentTotal = parsedAmount + currentFee;
  const currentRewards = Math.round(parsedAmount * 0.02);

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col md:flex-row text-slate-900 font-sans">
      <GridBg />

      {/* ===================================================================== */}
      {/* EXECUTIVE USER PORTAL SIDEBAR */}
      {/* ===================================================================== */}
      <aside className="w-full md:w-64 border-r border-slate-200 bg-white/95 backdrop-blur-md p-6 flex flex-col justify-between shrink-0 z-20 shadow-sm">
        <div className="space-y-6">
          {/* Business Entity Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              <Building2 className="w-3 h-3" />
              <span>Merchant Portal</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">Apex Enterprises Ltd</h2>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">GST: 27AABCA1234F1Z1</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
              { id: "payout", label: "Instant Payout (Transfer)", icon: Zap, highlight: true },
              { id: "bulk", label: "Bulk Vendor Dispatch", icon: FileSpreadsheet, badge: "CSV" },
              { id: "calculator", label: "Float ROI Optimizer", icon: Calculator },
              { id: "vendors", label: "Saved Beneficiaries", icon: Users, count: vendors.length },
              { id: "cards", label: "Linked Credit Cards", icon: CreditCard, count: cards.length },
              { id: "receipts", label: "Settlement Receipts", icon: Receipt },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : tab.highlight
                    ? "bg-blue-50/80 text-primary hover:bg-blue-100 font-extrabold border border-blue-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-white" : tab.highlight ? "text-primary" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge ? (
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-white/25 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {tab.badge}
                  </span>
                ) : Boolean(tab.count) ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}

            <Link
              href="/track"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-primary hover:bg-slate-100 transition-all border border-dashed border-slate-200 mt-2"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="h-4 w-4 text-primary" />
                <span>Public UTR Tracker</span>
              </div>
              <span className="text-[10px] text-primary font-bold">Live ↗</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-6 border-t border-slate-200 space-y-3 mt-6">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Available Limit</span>
              <span className="text-[10px] font-bold text-emerald-600">{availablePercent}% Free</span>
            </div>
            <p className="text-sm font-black text-slate-900">{formatINR(availableLimit)}</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(5, availablePercent))}%` }}
              />
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 p-2 rounded-xl transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Return to Website</span>
          </Link>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* EXECUTIVE MAIN WORKSPACE */}
      {/* ===================================================================== */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto z-20">
        
        {/* Top Header Row with Business Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Payout Hub</h1>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                RBI Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Settle supplier invoices in 2-5 minutes using your existing credit card limit.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("payout")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary hover:bg-primary/95 text-white text-xs font-extrabold shadow-md shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Instant Transfer</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Disbursed (Month)</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{formatINR(totalDisbursed)}</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              100% direct vendor settlements
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Reward Points Earned</span>
            <span className="text-2xl font-black text-primary block mt-2">{totalRewards.toLocaleString("en-IN")} pts</span>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              ≈ {formatINR(totalRewards)} card cash value
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Linked Cards</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{cards.length} Cards</span>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              Visa, Mastercard, RuPay
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Saved Beneficiaries</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{vendors.length} Verified</span>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
              100% Penny-Drop Verified
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Credit Card Line Dial + Fast Transfer */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Credit Line Utilization</h3>
                    <p className="text-xs text-slate-500">Aggregated lines across your {cards.length} linked corporate cards</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    Statement: 22 Days Left
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600 font-semibold">Total Credit Limit: {formatINR(totalLimit)}</span>
                    <span className="text-xs text-primary font-bold">Available: {formatINR(availableLimit)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, Math.max(3, utilizedPercent))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {utilizedPercent}% utilized for 360payz vendor payouts. {formatINR(availableLimit)} available with up to 45 interest-free days.
                  </p>
                </div>

                {/* Frequent Beneficiaries Quick-Send */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Quick Disburse to Recent Vendor</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vendors.slice(0, 2).map((v) => (
                      <div
                        key={v.account}
                        onClick={() => {
                          setSelectedVendorId(v.id || "v1");
                          setActiveTab("payout");
                        }}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-primary hover:bg-blue-50/40 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{v.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{v.bank} • {v.account.slice(-4)}</p>
                        </div>
                        <span className="text-xs font-extrabold text-primary shrink-0 ml-2">Pay →</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Instant Settlement Rewards Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">REWARD MULTIPLIER</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Earn 2% on Supplier Payments</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    By routing raw material and logistics invoices through 360payZ, you turn operational costs into eligible card reward points.
                  </p>

                  <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Estimated Monthly Spend:</span>
                      <strong className="text-white">₹5,00,000</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Rewards Generated:</span>
                      <strong className="text-amber-400 font-bold">10,000 pts (₹10,000)</strong>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="text-slate-300">Net Fee (1%):</span>
                      <span className="text-slate-300">₹5,000</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("payout")}
                  className="w-full bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs py-3.5 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Initiate Vendor Payment Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Recent Payouts Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Recent Vendor Settlements</h3>
                  <p className="text-xs text-slate-500">Live UTR confirmations issued by partner banks</p>
                </div>
                <button
                  onClick={() => setActiveTab("receipts")}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View all receipts →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                    <tr>
                      <th className="py-3 px-4">TXN Ref</th>
                      <th className="py-3 px-4">Beneficiary</th>
                      <th className="py-3 px-4">Invoice Amount</th>
                      <th className="py-3 px-4">Bank UTR</th>
                      <th className="py-3 px-4">Speed</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {receipts.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800">{r.id}</td>
                        <td className="py-3.5 px-4 text-slate-900 font-bold">{r.vendorName}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">₹{r.amount.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 flex items-center gap-2">
                          <span>{r.utrNumber}</span>
                          <button
                            onClick={() => copyToClipboard(r.utrNumber)}
                            className="text-slate-400 hover:text-primary"
                            title="Copy UTR"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{r.status}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Settled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: INSTANT PAYOUT CALCULATOR & SETTLEMENT ENGINE */}
        {/* ================================================================= */}
        {activeTab === "payout" && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Single Vendor Settlement</span>
                </div>
                <h2 className="text-xl font-black text-slate-900">Instant Vendor Payout</h2>
                <p className="text-xs text-slate-500 mt-0.5">Settle supplier invoice directly from your credit card line to their bank account.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                <span>Bulk Payout (CSV)</span>
              </button>
            </div>

            {/* Success Modal / State */}
            {successReceipt && (
              <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Payment Disbursed Successfully!</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded text-emerald-800 border border-emerald-200">
                    {successReceipt.id}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mb-3">
                  ₹{successReceipt.amount.toLocaleString("en-IN")} transferred to {successReceipt.vendorName}.
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-200/80 text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank UTR Number:</span>
                    <strong className="text-slate-900">{successReceipt.utrNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cashback Reward Earned:</span>
                    <strong className="text-emerald-600">+{successReceipt.rewardEarned} Points</strong>
                  </div>
                </div>

                {/* Instant Actions for Advice Voucher and Public Tracker */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-200/80">
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptForAdvice(successReceipt)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Official Advice Slip</span>
                  </button>
                  <Link
                    href={`/track/${encodeURIComponent(successReceipt.id)}`}
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100/50 transition-all shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Track Live Rail ↗</span>
                  </Link>
                </div>

                <button
                  onClick={() => setSuccessReceipt(null)}
                  className="mt-3 text-xs font-bold text-emerald-800 hover:underline block text-center w-full"
                >
                  Process Another Transfer
                </button>
              </div>
            )}

            <form onSubmit={handleExecutePayout} className="space-y-5">
              {/* Step 1: Select Vendor */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider mb-2">
                  1. Select Beneficiary Vendor
                </label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full bg-white text-xs text-slate-900 border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-primary shadow-xs"
                >
                  {vendors.map((v) => (
                    <option key={v.id || v.account} value={v.id || v.account}>
                      {v.name} ({v.bank} - {v.account})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Amount & Quick Presets */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider mb-2">
                  2. Transfer Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-white text-sm font-bold text-slate-900 border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-primary shadow-xs"
                  />
                </div>
                {/* Presets */}
                <div className="flex items-center gap-2 mt-2">
                  {["25000", "50000", "100000", "200000"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTransferAmount(preset)}
                      className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      ₹{Number(preset).toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Select Card */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider mb-2">
                  3. Select Corporate Credit Card
                </label>
                <select
                  value={selectedCardId}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  className="w-full bg-white text-xs text-slate-900 border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-primary shadow-xs"
                >
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.bank} - {c.number}) • Limit: {c.limit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Fee Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Vendor Payout Amount:</span>
                  <span className="font-bold text-slate-900">₹{parsedAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Transparent Fee (1% + GST):</span>
                  <span className="font-bold text-slate-900">₹{currentFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Eligible Card Rewards (2%):</span>
                  <span className="font-bold text-emerald-600">+{currentRewards} Points</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Total Billed to Card:</span>
                  <span className="text-primary">₹{currentTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing || !parsedAmount}
                className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-4 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing & Settle via IMPS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Authorize & Settle ₹{currentTotal.toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: VENDORS DIRECTORY */}
        {/* ================================================================= */}
        {activeTab === "vendors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Saved Beneficiaries & Vendors</h2>
                <p className="text-xs text-slate-500 mt-0.5">Direct bank accounts verified for instantaneous credit card payouts.</p>
              </div>
              <button
                onClick={() => setShowAddVendor(!showAddVendor)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Beneficiary</span>
              </button>
            </div>

            {/* Add Vendor Drawer */}
            {showAddVendor && (
              <form onSubmit={handleAddVendor} className="p-6 bg-white border border-slate-200 rounded-3xl max-w-xl shadow-md space-y-4">
                <h3 className="text-sm font-bold text-slate-900">New Beneficiary Bank Account</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">VENDOR ENTITY NAME</label>
                    <input
                      type="text"
                      required
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      placeholder="e.g. Paramount Plastics"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">BANK NAME</label>
                    <input
                      type="text"
                      required
                      value={newVendor.bank}
                      onChange={(e) => setNewVendor({ ...newVendor, bank: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">ACCOUNT NUMBER</label>
                    <input
                      type="text"
                      required
                      value={newVendor.account}
                      onChange={(e) => setNewVendor({ ...newVendor, account: e.target.value })}
                      placeholder="50100239482910"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">IFSC CODE</label>
                    <input
                      type="text"
                      required
                      value={newVendor.ifsc}
                      onChange={(e) => setNewVendor({ ...newVendor, ifsc: e.target.value.toUpperCase() })}
                      placeholder="HDFC0000102"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs uppercase"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddVendor(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95"
                  >
                    Save & Penny-Drop Verify
                  </button>
                </div>
              </form>
            )}

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((v) => (
                <div key={v.account} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{v.name}</h4>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-1">{v.bank} • Acc: {v.account}</p>
                    <p className="text-[10px] text-slate-400 font-mono">IFSC: {v.ifsc}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVendorId(v.id || "v1");
                      setActiveTab("payout");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-primary hover:text-white text-primary text-xs font-bold transition-all"
                  >
                    Pay Vendor
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: LINKED CARDS */}
        {/* ================================================================= */}
        {activeTab === "cards" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Linked Commercial Credit Cards</h2>
                <p className="text-xs text-slate-500 mt-0.5">Tokenized cards stored securely in compliance with RBI card-on-file guidelines.</p>
              </div>
              <button
                onClick={() => setShowAddCard(!showAddCard)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Link New Card</span>
              </button>
            </div>

            {/* Add Card Drawer */}
            {showAddCard && (
              <form onSubmit={handleAddCard} className="p-6 bg-white border border-slate-200 rounded-3xl max-w-xl shadow-md space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Link Business Card</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">CARDHOLDER NAME</label>
                    <input
                      type="text"
                      required
                      value={newCard.name}
                      onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                      placeholder="Kabir Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">ISSUING BANK</label>
                    <input
                      type="text"
                      required
                      value={newCard.bank}
                      onChange={(e) => setNewCard({ ...newCard, bank: e.target.value })}
                      placeholder="HDFC Bank"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">CARD NUMBER</label>
                    <input
                      type="text"
                      required
                      value={newCard.number}
                      onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                      placeholder="4532 0192 8492 1029"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">EXPIRY (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                      placeholder="12/29"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95"
                  >
                    Tokenize & Save Card
                  </button>
                </div>
              </form>
            )}

            {/* Realistic Card Visualizers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card, idx) => (
                <div
                  key={card.id}
                  className={`relative p-6 rounded-3xl text-white shadow-xl overflow-hidden flex flex-col justify-between h-52 transition-all ${
                    idx === 0
                      ? "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-800"
                      : idx === 1
                      ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-800/40"
                      : "bg-gradient-to-br from-neutral-900 to-zinc-950 border border-neutral-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{card.bank}</p>
                      <h4 className="text-sm font-bold text-white mt-0.5">{card.name}</h4>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200 font-bold">
                      {card.network || "Commercial"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-mono tracking-widest text-slate-100 font-bold">{card.number}</p>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>EXP: {card.expiry}</span>
                      <span>LIMIT: {card.limit || "₹25,00,000"}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/10 pt-3">
                    <button
                      onClick={() => toggleCard(card.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                        card.active ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {card.active ? "Active for Payouts" : "Paused"}
                    </button>
                    <span className="text-[10px] text-slate-400">Tokenized</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: BULK VENDOR DISPATCH (CSV) */}
        {/* ================================================================= */}
        {activeTab === "bulk" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Automated Batch Settlement</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Bulk Vendor Payout & Smart Dispatch</h2>
                  <p className="text-xs text-slate-500 mt-1">Disburse 10 to 50 vendor invoices in a single transaction charged to your corporate credit card.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkModal(true)}
                  className="px-5 py-3 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-black transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Launch Bulk Upload Wizard</span>
                </button>
              </div>

              {/* 3 Steps Explainer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-primary">STEP 01</span>
                  <h4 className="text-xs font-bold text-slate-900">Upload Invoices CSV</h4>
                  <p className="text-[11px] text-slate-500">Import an Excel or CSV file with beneficiary account details, IFSC, and payable amounts.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-primary">STEP 02</span>
                  <h4 className="text-xs font-bold text-slate-900">Multi-Card Allocation</h4>
                  <p className="text-[11px] text-slate-500">Fund the entire batch from your available credit limit while earning 2% card rewards.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-primary">STEP 03</span>
                  <h4 className="text-xs font-bold text-slate-900">Instant IMPS Clearance</h4>
                  <p className="text-[11px] text-slate-500">Every vendor receives funds directly with individual UTR generation and official advice slips.</p>
                </div>
              </div>

              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">Ready to settle multiple vendors at once?</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto mb-4">
                  Test with our preloaded enterprise sample batch or upload your own ERP payout schedule.
                </p>
                <button
                  type="button"
                  onClick={() => setShowBulkModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold hover:bg-primary/95 transition-all shadow-sm"
                >
                  Open Bulk Dispatch Wizard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: WORKING CAPITAL ROI OPTIMIZER */}
        {/* ================================================================= */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            <WorkingCapitalCalculator embedded={true} />
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: SETTLEMENT RECEIPTS */}
        {/* ================================================================= */}
        {activeTab === "receipts" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Settlement Receipts & Tax Invoices</h2>
                <p className="text-xs text-slate-500 mt-0.5">Official bank UTR proofs for all vendor transfers and GST breakdown.</p>
              </div>
              <button
                onClick={() => alert("Downloading all monthly receipts PDF...")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Tax Invoices</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Beneficiary</th>
                    <th className="py-3 px-4">Gross Transferred</th>
                    <th className="py-3 px-4">Fee (1%)</th>
                    <th className="py-3 px-4">Bank UTR Number</th>
                    <th className="py-3 px-4">Cashback Points</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {receipts.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-primary">{r.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{r.vendorName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{r.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 text-slate-600">₹{r.feeAmount.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">{r.utrNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">+{r.rewardEarned} pts</td>
                      <td className="py-3.5 px-4 text-slate-500">{r.date}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptForAdvice(r)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition-colors"
                            title="View Official Bank Settlement Voucher"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Voucher</span>
                          </button>
                          <Link
                            href={`/track/${encodeURIComponent(r.id)}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                            title="Track Live Banking Clearance"
                          >
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                            <span>Track</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Official Settlement Advice Modal */}
      {selectedReceiptForAdvice && (
        <SettlementAdviceModal
          data={{
            id: selectedReceiptForAdvice.id,
            vendorName: selectedReceiptForAdvice.vendorName,
            amount: selectedReceiptForAdvice.amount,
            feeAmount: selectedReceiptForAdvice.feeAmount,
            totalBilled: selectedReceiptForAdvice.totalBilled,
            rewardEarned: selectedReceiptForAdvice.rewardEarned,
            utrNumber: selectedReceiptForAdvice.utrNumber,
            date: selectedReceiptForAdvice.date,
            bankName: selectedReceiptForAdvice.bankName,
            accountMasked: selectedReceiptForAdvice.accountMasked,
            ifsc: selectedReceiptForAdvice.ifsc,
          }}
          onClose={() => setSelectedReceiptForAdvice(null)}
        />
      )}

      {/* Bulk Payout Modal */}
      {showBulkModal && (
        <BulkPayoutModal
          cards={cards}
          onClose={() => setShowBulkModal(false)}
          onBatchCompleted={(batchItems) => {
            const newReceipts: PayoutReceipt[] = batchItems.map((b) => ({
              id: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
              vendorName: b.vendorName,
              amount: b.amount,
              feeAmount: Math.round(b.amount * 0.01),
              totalBilled: Math.round(b.amount * 1.01),
              rewardEarned: Math.round(b.amount * 0.02),
              utrNumber: b.utrNumber || `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              date: `Today, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
              status: "Settled via IMPS in 2m 14s",
              bankName: b.bankName,
              accountMasked: `•••• ${b.accountNumber.slice(-4)}`,
              ifsc: b.ifsc,
            }));
            setReceipts((prev) => [...newReceipts, ...prev]);
          }}
        />
      )}

      {/* Copy notification toast */}
      {copiedUtr && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Copied UTR {copiedUtr} to clipboard</span>
        </div>
      )}
    </div>
  );
}
