"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Phone, MapPin, Clock, ShieldCheck, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import GridBg from "@/components/UI/GridBg";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.message) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while sending your message.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-12 pb-20">
      <GridBg />

      {/* Header Banner */}
      <div className="w-full px-6 md:px-12 lg:px-16 text-center mb-16 space-y-4 relative">
        
        {/* Back Button */}
        <div className="absolute top-0 left-6 md:left-12 lg:left-16 -mt-6 md:-mt-8 z-20">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-neutral-700 hover:text-primary bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-x-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <span className="text-xs uppercase font-extrabold text-primary tracking-widest block pt-4 md:pt-0">WE&apos;RE HERE TO HELP</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900">Contact Us</h1>
        <p className="text-sm text-neutral-500 max-w-lg mx-auto">
          Have questions about payments, settlements, onboarding, or account verification? Our team is ready to assist you.
        </p>
      </div>

      <div className="w-full px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Contact Info & Support Channels */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Need Assistance?</h2>
            <p className="text-xs text-neutral-500">Our team aims to respond to all enquiries as quickly as possible. Please include your registered mobile number and transaction reference (if applicable) when contacting support.</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Mail, title: "Customer Support", details: "support@360payz.com", desc: "For transaction queries, account assistance & onboarding", color: "text-primary" },
              { icon: Mail, title: "Business Enquiries", details: "contact@360payz.com", desc: "For partnerships, media & corporate communication", color: "text-primary" },
              { icon: Phone, title: "Support", details: "9711191129", desc: "24/7 WhatsApp Support Available", color: "text-emerald-800" }
            ].map((c, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all shadow-sm">
                <div className={`p-3 bg-white ${c.color} rounded-xl h-fit border border-neutral-200 shadow-sm`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">{c.title}</h4>
                  <span className="text-sm font-semibold text-neutral-900 block mt-1">{c.details}</span>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">{c.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-lg relative">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Message Sent!</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Thank you for reaching out, <strong>{form.name}</strong>. One of our support executives will contact you via email at <strong>{form.email}</strong> shortly.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", mobile: "", subject: "", message: "" }); }}
                  className="bg-neutral-100 border border-neutral-200 hover:border-primary px-6 py-2 rounded-xl text-xs text-neutral-800 transition-colors shadow-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900">Send us a Message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Kabir Roy"
                      className="w-full bg-white text-xs text-neutral-900 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="kabir@company.com"
                      className="w-full bg-white text-xs text-neutral-900 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1 uppercase">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="+91"
                      className="w-full bg-white text-xs text-neutral-900 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1 uppercase">Subject *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Payout query"
                      className="w-full bg-white text-xs text-neutral-900 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-500 block mb-1 uppercase">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Enter the details of your inquiry here..."
                    className="w-full bg-white text-xs text-neutral-900 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none shadow-sm"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-extrabold text-xs py-3.5 rounded-xl hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Why Contact Section */}
      <div className="w-full px-6 md:px-12 lg:px-16 mt-20 pt-12 border-t border-neutral-200 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold text-primary tracking-widest">Our Expertise</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900">Why Contact 360payZ?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            "Vendor & Supplier Payment Assistance",
            "Settlement & Transaction Support",
            "Account Verification Guidance",
            "Business Partnership Enquiries",
            "Technical Support",
            "General Product Information"
          ].map((reason, idx) => (
            <div key={idx} className="bg-white border border-neutral-200 p-4 rounded-xl flex items-center gap-3 shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <span className="text-sm font-bold text-neutral-800">{reason}</span>
            </div>
          ))}
        </div>

        <div className="text-center pt-8 max-w-3xl mx-auto space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">360payZ Payment Solution Private Limited</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Helping businesses make vendor and supplier payments using their existing credit cards through a secure and seamless payment experience.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
