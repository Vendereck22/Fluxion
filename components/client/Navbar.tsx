"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Expertise", href: "#expertise" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl antialiased transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-3 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 bg-fluxion-gradient rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-fluxion-cobalt/20 rotate-3 group-hover:rotate-0 transition-all">
            F
          </div>
          <span className="font-heading text-2xl font-black tracking-tighter text-fluxion-blue">
            FLUXION
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-sans text-sm font-bold text-fluxion-blue/70 hover:text-fluxion-rose tracking-wide transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fluxion-rose transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="md:hidden p-2 text-fluxion-blue hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        className={`
        absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-100 overflow-hidden transition-all duration-500 md:hidden
        ${isOpen ? "max-h-screen opacity-100 py-8" : "max-h-0 opacity-0 py-0"}
      `}
      >
        <ul className="flex flex-col items-center gap-6 px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="w-full text-center">
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-4 text-xl font-heading font-black text-fluxion-blue hover:text-fluxion-rose transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          
        </ul>
      </div>
    </nav>
  );
}
