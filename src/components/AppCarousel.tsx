"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Wallet, 
  Send, 
  History, 
  UserCheck, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight, 
  Battery, 
  Wifi, 
  Signal, 
  ArrowUpRight,
  type LucideIcon 
} from "lucide-react";

interface Screen {
  id: number;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
}

const SCREENS: Screen[] = [
  { id: 0, title: "Dashboard", desc: "View limits, transaction history, recent settlements, and card settings.", icon: LayoutGrid, color: "from-purple-600 to-indigo-600" },
  { id: 1, title: "Transfer", desc: "Select a registered vendor, enter amount, choose credit card, and send instantly.", icon: Send, color: "from-blue-600 to-cyan-600" },
  { id: 2, title: "History", desc: "Track complete past transactions, view transaction receipts, and export statements.", icon: History, color: "from-emerald-600 to-teal-600" },
  { id: 3, title: "Rewards", desc: "Track accumulated eligible card rewards and promotional offers.", icon: Wallet, color: "from-amber-600 to-orange-600" },
  { id: 4, title: "KYC", desc: "Complete 60-second automated Aadhaar and PAN verification.", icon: UserCheck, color: "from-red-600 to-pink-600" },
];

export default function AppCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SCREENS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % SCREENS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + SCREENS.length) % SCREENS.length);
  };

  const activeScreen = SCREENS[activeIdx];

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 py-6">
      
      {/* Left side: Navigation / Info */}
      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
        <div>
          <span className="text-xs uppercase font-extrabold text-primary tracking-widest">Mobile Native App</span>
          <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">360payZ Mobile Suite</h3>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            Carry the entire power of 360payZ in your pocket. Seamlessly transition between features with our fluid, modern interface.
          </p>
        </div>

        <div className="space-y-3">
          {SCREENS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveIdx(s.id)}
              className={`w-full flex items-center gap-4 text-left p-3.5 rounded-2xl border transition-all ${
                activeIdx === s.id
                  ? "bg-neutral-50 border-neutral-300 text-neutral-900 shadow-md"
                  : "bg-transparent border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/50"
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-all border ${
                activeIdx === s.id 
                  ? "bg-primary text-white border-primary shadow-sm" 
                  : "bg-neutral-100 text-neutral-500 border-neutral-200"
              }`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">{s.title}</h4>
                {activeIdx === s.id && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-neutral-600 mt-1 leading-relaxed"
                  >
                    {s.desc}
                  </motion.p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="flex gap-3 pt-2">
          <button 
            onClick={handlePrev} 
            className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-full border border-neutral-200 text-neutral-700 transition-colors shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={handleNext} 
            className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-full border border-neutral-200 text-neutral-700 transition-colors shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right side: iPhone Mockup */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="relative w-[280px] h-[570px] bg-neutral-950 border-[6px] border-neutral-800 rounded-[48px] shadow-2xl overflow-hidden ring-8 ring-white/5 flex flex-col">
          {/* Speaker & camera bar */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-2xl z-30 flex items-center justify-center">
            <div className="w-12 h-1 bg-neutral-800 rounded-full mb-1" />
            <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full absolute right-4 mb-1" />
          </div>

          {/* Status Bar */}
          <div className="h-10 px-6 pt-3 flex justify-between items-center text-[10px] text-white font-semibold z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <Battery className="h-3 w-3" />
            </div>
          </div>

          {/* Mock Screen Content */}
          <div className="flex-1 p-4 relative overflow-hidden flex flex-col z-10 bg-[#090909]">
            {/* Soft Background Orbs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full filter blur-2xl -z-10" />

            <AnimatePresence mode="wait">
              {activeIdx === 0 && (
                <motion.div
                  key="screen-dash"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-white/50">Good morning,</span>
                        <h5 className="text-sm font-bold text-white leading-none">Aman</h5>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 text-white text-[11px] font-bold">A</div>
                    </div>

                    <div className="bg-gradient-to-tr from-secondary/40 to-black p-4 rounded-2xl border border-white/10 shadow-lg">
                      <span className="text-[9px] text-white/55 block">CREDIT LINE LIMIT</span>
                      <span className="text-xl font-extrabold text-white mt-1 block">₹5,00,000</span>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-[9px] text-white/50">
                        <span>Used: ₹45,000</span>
                        <span>Available: 91%</span>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[8px] text-white/40 block font-bold uppercase">Rewards Earned</span>
                        <span className="text-xs font-bold text-primary">₹8,450</span>
                      </div>
                      <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                        <Wallet className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-white/40 font-bold block">RECENT PAYMENTS</span>
                    {[
                      { v: "Apex Dist.", a: "₹45,000", c: "+₹450" },
                      { v: "Global Log.", a: "₹1,20,000", c: "+₹1,200" },
                    ].map((tx, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-white/[0.01] border border-white/5 text-[10px]">
                        <div>
                          <span className="text-white font-semibold block">{tx.v}</span>
                          <span className="text-white/40 text-[8px]">Success</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white block font-bold">{tx.a}</span>
                          <span className="text-primary text-[8px]">{tx.c}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeIdx === 1 && (
                <motion.div
                  key="screen-transfer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-white">Send Payout</h5>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] text-white/40 block">SELECT VENDOR</label>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs text-white">
                        <span>Apex Distributors</span>
                        <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">HDFC</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] text-white/40 block">AMOUNT</label>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-baseline justify-between">
                        <span className="text-white/40 text-xs">₹</span>
                        <span className="text-lg font-bold text-white">25,000</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-primary text-black font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-md shadow-primary/20 mt-auto">
                    Initiate Transfer
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}

              {activeIdx === 2 && (
                <motion.div
                  key="screen-history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 flex-1"
                >
                  <h5 className="text-xs font-bold text-white">Payout History</h5>
                  <div className="space-y-2.5 overflow-y-auto max-h-[400px] pr-0.5">
                    {[
                      { name: "Apex Distributors", amt: "₹45,000", time: "Today, 10:14 AM" },
                      { name: "Global Logistics", amt: "₹1,20,000", time: "Yesterday, 4:30 PM" },
                      { name: "Horizon Supplies", amt: "₹15,400", time: "28 May 2026" },
                      { name: "Surya Enterprise", amt: "₹85,000", time: "24 May 2026" },
                    ].map((tx, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between text-[10px]">
                        <div>
                          <span className="text-white font-semibold block">{tx.name}</span>
                          <span className="text-white/40 text-[8px]">{tx.time}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold block">{tx.amt}</span>
                          <span className="text-green-400 text-[8px] font-semibold">Settled</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeIdx === 3 && (
                <motion.div
                  key="screen-wallet"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-white">Rewards Dashboard</h5>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-black to-secondary/10 border border-white/10 text-center">
                      <span className="text-[9px] text-white/50 block uppercase">Balance Available</span>
                      <span className="text-2xl font-extrabold text-primary mt-1 block">₹8,450</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] text-white/40">
                      <span>AUTO-CREDIT ON PAYOUTS</span>
                      <span className="text-primary font-bold">ACTIVE</span>
                    </div>
                    <button className="w-full bg-white/5 text-white hover:bg-white/10 border border-white/10 text-[11px] font-bold py-2.5 rounded-xl transition-all">
                      Cashback account
                    </button>
                  </div>
                </motion.div>
              )}

              {activeIdx === 4 && (
                <motion.div
                  key="screen-kyc"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-white">Instant KYC Verification</h5>
                    <p className="text-[10px] text-white/50">Complete verification to increase your limit to ₹10L/day</p>
                    
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-[10px] p-2 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-white">Aadhaar Verification</span>
                        <span className="text-green-400 font-semibold text-[8px] bg-green-500/10 px-1.5 py-0.5 rounded">PASSED</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] p-2 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-white">PAN Verification</span>
                        <span className="text-green-400 font-semibold text-[8px] bg-green-500/10 px-1.5 py-0.5 rounded">PASSED</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] p-2 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-white">Selfie & Liveness</span>
                        <span className="text-green-400 font-semibold text-[8px] bg-green-500/10 px-1.5 py-0.5 rounded">PASSED</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center mt-auto">
                    <span className="text-[10px] text-green-400 font-bold block">Verification Complete</span>
                    <span className="text-[8px] text-white/50 block">Your account is fully verified</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  );
}
