"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative z-10 bg-neutral-950 text-white border-t border-white/5 pt-20 pb-10">
      <div className="w-full px-6 md:px-12 lg:px-16 grid grid-cols-2 md:grid-cols-6 gap-8 pb-12">
        {/* Brand Col */}
        <div className="col-span-2 space-y-4">
          <Logo isDark={true} className="inline-block scale-75 origin-left" />
          <p className="text-xs text-white/55 leading-relaxed max-w-xs">
            Empowering Indian businesses and professionals to pay vendors instantly using their existing credit card. Highly secure and designed to operate in alignment with applicable RBI guidelines.
          </p>
          <div className="flex gap-4 pt-2">
            {[
              { name: "Instagram", url: "https://www.instagram.com/360payz?igsh=MWNndzJ2azFlenh0eA%3D%3D&utm_source=qr", icon: InstagramIcon, color: "#E1306C" },
              { name: "LinkedIn", url: "https://www.linkedin.com/in/aman-tomar-6b843b411", icon: LinkedinIcon, color: "#0A66C2" },
              { name: "Facebook", url: "https://www.facebook.com/share/17Zn3nAuWZ/?mibextid=wwXIfr", icon: FacebookIcon, color: "#1877F2" },
              { name: "YouTube", url: "https://youtube.com/@360payz?si=_uoNC0upw4abbphg", icon: YoutubeIcon, color: "#FF0000" }
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.name} href={s.url} target="_blank" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all" style={{ color: s.color }}>
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sitemaps */}
        <div>
          <h5 className="text-[10px] font-bold text-white uppercase tracking-wider mb-4">Product</h5>
          <ul className="space-y-2 text-xs text-white/50">
            <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="/track" className="hover:text-primary transition-colors text-white/80 font-medium">Track Settlement</Link></li>
            <li><Link href="/#calculator" className="hover:text-primary transition-colors">Float ROI Calculator</Link></li>
            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
            <li><Link href="/why-choose-us" className="hover:text-primary transition-colors">Why Choose Us</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-bold text-white uppercase tracking-wider mb-4">Portals</h5>
          <ul className="space-y-2 text-xs text-white/60">
            <li>
              <Link href="/login" className="hover:text-primary transition-colors font-medium text-white/80 flex items-center gap-1.5">
                <span>User Login</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-primary transition-colors font-medium text-white/80 flex items-center gap-1.5">
                <span>Admin Portal</span>
              </Link>
            </li>
            <li>
              <Link href="/get-started/account" className="hover:text-primary transition-colors">
                <span>Create Account</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-bold text-white uppercase tracking-wider mb-4">Company</h5>
          <ul className="space-y-2 text-xs text-white/50">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-bold text-white uppercase tracking-wider mb-4">Legal</h5>
          <ul className="space-y-2 text-xs text-white/50">
            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
            <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            <li><Link href="/aml" className="hover:text-primary transition-colors">AML Policy</Link></li>
            <li><Link href="/kyc" className="hover:text-primary transition-colors">KYC Policy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="w-full px-6 md:px-12 lg:px-16 pt-8 border-t border-white/5 text-center md:text-left md:flex justify-between items-start md:items-center text-[10px] text-white/30 space-y-4 md:space-y-0">
        <div className="flex flex-col space-y-1">
          <span>&copy; {new Date().getFullYear()} 360payZ Payment Solutions Private Limited. All rights reserved.</span>
          <span>Registration Number: 09AADCZ0234D1ZM | Corporate Identity Number: U62099UW2026PTC253286</span>
        </div>
        <span className="block max-w-sm md:max-w-xl md:text-right md:pr-16 mx-auto md:mx-0 leading-relaxed">Made for businesses and startups in India. Designed to operate in alignment with applicable RBI guidelines through licensed banking and payment partners.</span>
      </div>
    </footer>
  );
}
