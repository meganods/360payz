"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  UserCheck, 
  ShieldAlert, 
  Coins, 
  Check, 
  X, 
  ArrowLeft,
  LayoutDashboard,
  Search,
  ArrowRight,
  LogOut,
  TrendingUp,
  Receipt,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
  ExternalLink,
  RefreshCw,
  Loader2
} from "lucide-react";
import GridBg from "@/components/UI/GridBg";
import { useAuth } from "@/context/AuthContext";

interface KYCRecordItem {
  id: string;
  name?: string;
  businessName?: string;
  businessType?: string;
  pan?: string;
  panNumber?: string;
  aadhaar?: string;
  aadhaarNumberMasked?: string;
  status: string;
  submittedAt?: string;
}

interface TransactionItem {
  id: string;
  userId?: string;
  vendorName?: string;
  amount: number;
  feeAmount?: number;
  utrNumber?: string;
  status: string;
  date?: string;
  createdAt?: string;
}

interface ContactItem {
  id: string;
  name: string;
  email: string;
  mobile: string;
  subject?: string;
  message: string;
  createdAt?: string;
}

export default function AdminPreviewPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "kyc" | "ledger" | "enquiries" | "fraud">("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Live state from Firestore
  const [kycList, setKycList] = useState<KYCRecordItem[]>([
    { id: "kyc_sample_1", name: "Ramesh Kumar", businessName: "Kumar Trading Co", pan: "ABCDE1234F", aadhaar: "•••• •••• 9210", status: "in_review", submittedAt: "Today, 11:30 AM" },
    { id: "kyc_sample_2", name: "Sunita Deshmukh", businessName: "Deshmukh Logistics", pan: "XYZWP9876Q", aadhaar: "•••• •••• 1045", status: "in_review", submittedAt: "Yesterday, 04:15 PM" },
    { id: "kyc_sample_3", name: "Vikram Malhotra", businessName: "Malhotra Enterprises", pan: "LMNOP5566R", aadhaar: "•••• •••• 3840", status: "Approved", submittedAt: "15 Oct 2026" },
  ]);

  const [transactions, setTransactions] = useState<TransactionItem[]>([
    { id: "TXN5675", userId: "demo-user", vendorName: "Apex Distributors", amount: 10000, feeAmount: 100, utrNumber: "UTR1287153992", status: "settled", date: "Today, 03:36 PM" },
    { id: "TXN1024", userId: "demo-user", vendorName: "Apex Distributors", amount: 45000, feeAmount: 450, utrNumber: "UTR9832749102", status: "settled", date: "Today, 10:14 AM" },
    { id: "TXN1023", userId: "demo-user", vendorName: "Global Logistics Pvt Ltd", amount: 120000, feeAmount: 1200, utrNumber: "UTR8291038472", status: "settled", date: "Yesterday, 04:30 PM" },
  ]);

  const [enquiries, setEnquiries] = useState<ContactItem[]>([
    { id: "cnt_1", name: "Aarav Sharma", email: "aarav@example.com", mobile: "9876543210", subject: "Enterprise Settlement Pricing", message: "Interested in moving 50L/month CC settlements.", createdAt: "Today" },
  ]);

  const [metrics, setMetrics] = useState({
    totalVolume: 4285000,
    totalRevenue: 42850,
    pendingKyc: 2,
    activeUsers: 148,
  });

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          if (Array.isArray(json.data.kycRecords) && json.data.kycRecords.length > 0) {
            setKycList(json.data.kycRecords);
          }
          if (Array.isArray(json.data.transactions) && json.data.transactions.length > 0) {
            setTransactions(json.data.transactions);
          }
          if (Array.isArray(json.data.enquiries) && json.data.enquiries.length > 0) {
            setEnquiries(json.data.enquiries);
          }
          if (json.data.metrics) {
            setMetrics(json.data.metrics);
          }
        }
      }
    } catch (e) {
      console.warn("Refresh error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/overview");
        if (res.ok) {
          const json = await res.json();
          if (!ignore && json.data) {
            if (Array.isArray(json.data.kycRecords) && json.data.kycRecords.length > 0) {
              setKycList(json.data.kycRecords);
            }
            if (Array.isArray(json.data.transactions) && json.data.transactions.length > 0) {
              setTransactions(json.data.transactions);
            }
            if (Array.isArray(json.data.enquiries) && json.data.enquiries.length > 0) {
              setEnquiries(json.data.enquiries);
            }
            if (json.data.metrics) {
              setMetrics(json.data.metrics);
            }
          }
        }
      } catch (e) {
        console.warn("Using default admin records:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleKYCAction = async (id: string, newStatus: "Approved" | "Rejected") => {
    setActionLoading(id);
    try {
      await fetch("/api/admin/kyc/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setKycList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (err) {
      console.warn("KYC action fallback:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col md:flex-row">
      <GridBg />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-neutral-200 bg-white/85 backdrop-blur-md p-6 flex flex-col justify-between shrink-0 z-20 pt-12 md:pt-6 shadow-sm">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Executive Hub</span>
            </div>
            <h2 className="text-xl font-extrabold text-neutral-900">Operations Center</h2>
            <p className="text-[10px] text-neutral-400 mt-0.5">360payZ B2B Fintech Suite</p>
          </div>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
              { id: "kyc", label: "KYC Approvals", icon: UserCheck, count: kycList.filter(k => k.status === "in_review" || k.status === "Pending").length },
              { id: "ledger", label: "All Transactions", icon: Receipt },
              { id: "enquiries", label: "Leads & Enquiries", icon: Mail, count: enquiries.length },
              { id: "fraud", label: "Risk & Fraud Radar", icon: ShieldAlert },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </div>
                {Boolean(tab.count) && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-white text-primary" : "bg-primary/10 text-primary"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-6 border-t border-neutral-200 space-y-3">
          <div className="px-3.5 py-2.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
            <p className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider">Super Admin</p>
            <p className="text-xs font-bold text-neutral-900 truncate mt-0.5">{user?.displayName || "360payZ Admin"}</p>
            <p className="text-[10px] text-neutral-500 truncate">{user?.email || "admin@360payz.com"}</p>
          </div>

          <Link
            href="/dashboard-preview"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100/70 hover:bg-neutral-200/70 transition-colors w-full"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-primary" />
              <span>Customer Sandbox</span>
            </div>
            <span className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-neutral-200 font-bold">Demo</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors w-full"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home Website
          </Link>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto z-20 pt-12 md:pt-10">
        
        {/* Top Header Row with Live Indicators */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">Admin Command Center</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                Live Console
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Real-time audit log, merchant risk oversight, and KYC compliance</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="flex items-center gap-2 text-xs font-bold text-neutral-700 bg-white border border-neutral-200 px-3.5 py-2 rounded-xl shadow-sm hover:bg-neutral-50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/dashboard-preview"
              className="flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 px-4 py-2 rounded-xl shadow-md shadow-primary/20 transition-all"
            >
              <span>View As Client</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Executive Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase tracking-wider">
              <span>Gross Settlements</span>
              <Coins className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-black text-neutral-900 mt-2">
              ₹{(metrics.totalVolume).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Total funds disbursed via cards</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase tracking-wider">
              <span>Platform Revenue (1%)</span>
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              ₹{(metrics.totalRevenue).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-neutral-500 font-medium mt-1">
              Net convenience fee earned
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase tracking-wider">
              <span>KYC Verification Queue</span>
              <UserCheck className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              {metrics.pendingKyc} Pending
            </div>
            <div className="text-[11px] text-neutral-500 font-medium mt-1">
              {kycList.filter(k => k.status === "Approved").length} approved merchants
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase tracking-wider">
              <span>System Risk Score</span>
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-black text-neutral-900 mt-2">
              99.8% Secure
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              0 anomalous chargebacks
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Daily Volume Bar Chart */}
              <div className="lg:col-span-8 bg-white/85 backdrop-blur-md border border-neutral-200/80 p-6 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900">Weekly Settlement Volume (INR)</h3>
                    <p className="text-xs text-neutral-500">Processed card-to-vendor payouts over the last 7 days</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    +18.4% WoW
                  </span>
                </div>

                <div className="h-44 w-full flex items-end gap-3 pt-4 px-2">
                  {[
                    { day: "Mon", val: 35, amt: "₹4.2L" },
                    { day: "Tue", val: 55, amt: "₹6.8L" },
                    { day: "Wed", val: 40, amt: "₹4.9L" },
                    { day: "Thu", val: 75, amt: "₹9.2L" },
                    { day: "Fri", val: 90, amt: "₹11.4L" },
                    { day: "Sat", val: 65, amt: "₹7.8L" },
                    { day: "Sun", val: 80, amt: "₹9.8L" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {item.amt}
                      </span>
                      <div className="w-full bg-neutral-100 rounded-xl h-full flex items-end p-1">
                        <div 
                          style={{ height: `${item.val}%` }} 
                          className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-lg transition-all duration-500 group-hover:brightness-110" 
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-500 mt-2">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Platform Controls */}
              <div className="lg:col-span-4 bg-white/85 backdrop-blur-md border border-neutral-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900 mb-1">Operations Control</h3>
                  <p className="text-xs text-neutral-500 mb-6">Master platform switches & RBI compliance monitors</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Instant IMPS Payouts</p>
                        <p className="text-[10px] text-neutral-500">2-5 minute settlement SLA</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                        ACTIVE
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                      <div>
                        <p className="text-xs font-bold text-neutral-900">UIDAI Aadhaar Masking</p>
                        <p className="text-[10px] text-neutral-500">Enforced on all uploads</p>
                      </div>
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100/70 px-2.5 py-1 rounded-full">
                        COMPLIANT
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Database Synchronization</p>
                        <p className="text-[10px] text-neutral-500">Cloud Firestore asia-south1</p>
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        HEALTHY
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 mt-6">
                  <button 
                    onClick={() => setActiveTab("kyc")}
                    className="w-full bg-neutral-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Process Pending KYC ({metrics.pendingKyc})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Live Feed from Firestore */}
            <div className="bg-white/85 backdrop-blur-md border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">Recent Platform Transactions</h3>
                  <p className="text-xs text-neutral-500">Live disbursements across all registered business clients</p>
                </div>
                <button
                  onClick={() => setActiveTab("ledger")}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View Complete Ledger &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200/80 text-neutral-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">TXN ID</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Vendor Beneficiary</th>
                      <th className="py-3 px-4">Disbursed Amount</th>
                      <th className="py-3 px-4">Fee (1%)</th>
                      <th className="py-3 px-4">UTR Reference</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {transactions.slice(0, 4).map((tx) => (
                      <tr key={tx.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">{tx.id}</td>
                        <td className="py-3.5 px-4 text-neutral-600">{tx.userId || "demo-user"}</td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-900">{tx.vendorName || "Apex Distributors"}</td>
                        <td className="py-3.5 px-4 font-bold text-neutral-900">₹{(Number(tx.amount) || 0).toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4 text-emerald-700 font-semibold">+₹{(Number(tx.feeAmount) || (Number(tx.amount) * 0.01)).toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4 font-mono text-neutral-500">{tx.utrNumber || "UTR9832749102"}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {tx.status || "settled"}
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
        {/* TAB 2: LIVE KYC APPROVALS */}
        {/* ================================================================= */}
        {activeTab === "kyc" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900">Merchant KYC Approvals</h2>
                <p className="text-xs text-neutral-500 mt-1">Review applicant PAN, UIDAI-masked Aadhaar, and approve onboarding</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, PAN or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary shadow-sm"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-neutral-200/80 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-neutral-500 font-bold uppercase text-[10px]">
                    <th className="p-4">Record ID</th>
                    <th className="p-4">Business / Applicant</th>
                    <th className="p-4">Business PAN</th>
                    <th className="p-4">Masked Aadhaar (UIDAI)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {kycList
                    .filter(item => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        item.id?.toLowerCase().includes(q) ||
                        item.name?.toLowerCase().includes(q) ||
                        item.businessName?.toLowerCase().includes(q) ||
                        item.pan?.toLowerCase().includes(q) ||
                        item.panNumber?.toLowerCase().includes(q)
                      );
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-neutral-900">{item.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-neutral-900">{item.businessName || item.name || "Enterprise Merchant"}</p>
                          <p className="text-[10px] text-neutral-500">{item.businessType || "Private Limited"}</p>
                        </td>
                        <td className="p-4 font-mono font-bold text-neutral-800">{item.pan || item.panNumber || "ABCDE1234F"}</td>
                        <td className="p-4 font-mono text-neutral-600">{item.aadhaar || item.aadhaarNumberMasked || "•••• •••• 9210"}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            item.status === "Approved" || item.status === "verified"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.status === "Rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {item.status === "in_review" ? "Pending Review" : item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {item.status === "in_review" || item.status === "Pending" ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleKYCAction(item.id, "Rejected")}
                                disabled={actionLoading === item.id}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 transition-all flex items-center gap-1 disabled:opacity-50"
                              >
                                <X className="h-3 w-3" />
                                Reject
                              </button>
                              <button 
                                onClick={() => handleKYCAction(item.id, "Approved")}
                                disabled={actionLoading === item.id}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition-all flex items-center gap-1 disabled:opacity-50"
                              >
                                {actionLoading === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="h-3 w-3 stroke-[3]" />}
                                Approve
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-neutral-400">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: MASTER TRANSACTION LEDGER */}
        {/* ================================================================= */}
        {activeTab === "ledger" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900">Master Settlement Ledger</h2>
                <p className="text-xs text-neutral-500 mt-1">Live audit log of all card-to-bank settlements on 360payZ</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-700 bg-white border border-neutral-200 px-3 py-1.5 rounded-xl shadow-sm">
                  {transactions.length} Transactions Logged
                </span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-neutral-200/80 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-neutral-500 font-bold uppercase text-[10px]">
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Merchant UID</th>
                    <th className="p-4">Vendor Beneficiary</th>
                    <th className="p-4">Invoice Amount</th>
                    <th className="p-4">Fee (1%)</th>
                    <th className="p-4">Banking UTR</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-neutral-900">{tx.id}</td>
                      <td className="p-4 font-mono text-[11px] text-neutral-500">{tx.userId || "demo-user"}</td>
                      <td className="p-4 font-semibold text-neutral-900">{tx.vendorName || "Apex Distributors"}</td>
                      <td className="p-4 font-bold text-neutral-900">₹{(Number(tx.amount) || 0).toLocaleString("en-IN")}</td>
                      <td className="p-4 font-semibold text-emerald-700">+₹{(Number(tx.feeAmount) || (Number(tx.amount) * 0.01)).toLocaleString("en-IN")}</td>
                      <td className="p-4 font-mono text-neutral-600">{tx.utrNumber || "UTR9832749102"}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {tx.status || "settled"}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400 text-[11px]">{tx.date || "Today"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: LEADS & CONTACT ENQUIRIES */}
        {/* ================================================================= */}
        {activeTab === "enquiries" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900">Customer & Sales Inquiries</h2>
              <p className="text-xs text-neutral-500 mt-1">Direct inquiries submitted from the website contact page</p>
            </div>

            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {enq.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">{enq.name}</h4>
                        <p className="text-xs text-neutral-500">{enq.subject || "General Invoicing Inquiry"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        {enq.mobile}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-neutral-400" />
                        {enq.email}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 leading-relaxed">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: FRAUD & RISK WATCH */}
        {/* ================================================================= */}
        {activeTab === "fraud" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900">Algorithmic Risk & Fraud Radar</h2>
              <p className="text-xs text-neutral-500 mt-1">Automated anomaly detection protecting credit card lines & settlements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[
                  { id: "FRD201", severity: "HIGH", detail: "Rapid authorization attempts: 4 transactions submitted within 12 seconds.", time: "10 mins ago" },
                  { id: "FRD202", severity: "MEDIUM", detail: "Geo-IP mismatch: Request initiated from Frankfurt proxy while user SIM located in Bengaluru.", time: "1 hour ago" },
                  { id: "FRD203", severity: "LOW", detail: "New beneficiary added and immediate transfer over ₹1,00,000 initiated. Cooldown applied.", time: "3 hours ago" }
                ].map((alert) => (
                  <div key={alert.id} className="p-5 rounded-2xl bg-white border border-neutral-200/80 flex items-start justify-between gap-4 shadow-sm">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                          alert.severity === "HIGH" ? "bg-red-50 text-red-700 border-red-200" :
                          alert.severity === "MEDIUM" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {alert.severity} RISK
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-900">{alert.id}</span>
                        <span className="text-[10px] text-neutral-400">&bull; {alert.time}</span>
                      </div>
                      <p className="text-xs text-neutral-700">{alert.detail}</p>
                    </div>

                    <button className="text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl transition-colors shrink-0">
                      Investigate
                    </button>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1 bg-white border border-neutral-200/80 p-6 rounded-3xl shadow-sm space-y-5 text-center">
                <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">Overall Platform Security</h3>
                
                <div className="h-32 w-32 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center mx-auto">
                  <div>
                    <span className="text-3xl font-black text-neutral-900">99.8</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">Secure</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed">
                  Real-time monitoring active. All credit lines and IMPS bank disbursements are operating within safe velocity thresholds.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
