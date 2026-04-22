"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
  { label: "Safety", href: "#safety" },
];

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-100 w-full border-b border-white/5 bg-[#080808]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]">
            <span className="text-sm font-black text-black">Oz</span>
          </div>
          <span
            className="font-black tracking-[-0.03em] text-white"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1.125rem" }}
          >
            OzHelper
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#A6A6A6] transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="rounded-full px-5 py-2 text-sm font-medium text-[#A6A6A6] ring-1 ring-white/15 transition-all duration-150 hover:text-white hover:ring-white/30"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold text-black transition-all duration-150 hover:bg-[#D4AF37]/90 active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-[#A6A6A6] transition-colors hover:text-white md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/5 bg-[#080808] md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#A6A6A6]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/sign-in"
                className="rounded-full py-2.5 text-center text-sm font-medium text-white ring-1 ring-white/20"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#D4AF37] py-2.5 text-center text-sm font-bold text-black"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
