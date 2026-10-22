"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, signOut, isAdmin, isUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll(); // Check on mount (handles page reload at scrolled position)
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Track Payout", href: "/track" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false; // Anchor link
    return pathname.startsWith(href);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b border-neutral-200 py-4 shadow-sm"
          : "bg-white py-6"
      }`}
    >
      <div className="w-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Logo */}
        <Logo withSlogan={true} className="shrink-0" />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-neutral-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center space-x-3">
          {user || isAdmin || isUser ? (
            <button
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
              className="text-neutral-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/get-started/account"
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 px-5 py-2.5 rounded-full shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-neutral-800 hover:text-primary focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-neutral-200 py-6 px-8 flex flex-col space-y-4 lg:hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-semibold py-2 transition-colors border-b border-neutral-100 ${
                  isActive(link.href) ? "text-primary" : "text-neutral-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-neutral-100">
              {user || isAdmin || isUser ? (
                <button
                  onClick={async () => {
                    await signOut();
                    setIsOpen(false);
                    window.location.href = "/";
                  }}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-red-600 bg-red-50 py-2.5 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/get-started/account"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-sm font-bold text-white bg-primary py-3 rounded-xl shadow-md shadow-primary/20"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
