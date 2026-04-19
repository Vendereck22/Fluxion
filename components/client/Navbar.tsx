"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { siteContent } from "@/constants/site-content";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const VISIBLE_LINKS = siteContent.navigation.links.slice(0, 2);
  const DROPDOWN_LINKS = siteContent.navigation.links.slice(2);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl antialiased transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Logo size="sm" className="group transition-transform active:scale-95" />
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {VISIBLE_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="font-sans text-sm font-bold text-fluxion-blue/70 hover:text-fluxion-rose tracking-wide transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fluxion-rose transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
            <li>
              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 font-sans text-sm font-bold text-fluxion-blue/70 hover:text-fluxion-rose outline-none transition-colors">
                    Plus
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isDropdownOpen && "rotate-180",
                      )}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl p-2 bg-white/95 backdrop-blur-lg shadow-xl border-slate-100"
                >
                  {DROPDOWN_LINKS.map((link) => (
                    <DropdownMenuItem key={link.name} asChild>
                      <Link
                        href={link.href}
                        className="w-full cursor-pointer rounded-lg px-3 py-2 text-sm font-bold text-fluxion-blue hover:bg-fluxion-rose/10 hover:text-fluxion-rose transition-all"
                      >
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>

          <Button className="rounded-full bg-fluxion-blue hover:bg-fluxion-rose text-white px-6 font-bold transition-all shadow-lg shadow-fluxion-blue/10">
            {siteContent.navigation.cta}{" "}
          </Button>
        </div>
        <button
          className="md:hidden p-2 text-fluxion-blue hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-100 overflow-y-auto transition-all duration-500 md:hidden",
          isOpen ? "max-h-[90vh] opacity-100 py-8" : "max-h-0 opacity-0 py-0",
        )}
      >
        <ul className="flex flex-col items-center gap-2 px-6">
          {[...VISIBLE_LINKS, ...DROPDOWN_LINKS].map((link) => (
            <li
              key={link.name}
              className="w-full text-center border-b border-slate-50 last:border-0"
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-4 text-lg font-heading font-black text-fluxion-blue hover:text-fluxion-rose transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="pt-6 w-full">
            <Button className="w-full h-14 rounded-2xl bg-fluxion-blue text-white font-bold text-lg">
              Nous contacter
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
