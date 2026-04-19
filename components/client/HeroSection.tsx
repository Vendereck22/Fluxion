"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { siteContent } from "@/constants/site-content";
import Logo from "./Logo";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center py-20 px-6 overflow-hidden bg-fluxion-rose antialiased">
      <div className="container mx-auto max-w-5xl flex flex-col items-center text-center space-y-10">
        <header className="flex flex-col items-center space-y-4 ">
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white hover:bg-white/20 border-none">
            {siteContent.hero.badge}
          </Badge>
          <Logo size="md" light />
        </header>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter text-white leading-[0.9]">
            {siteContent.hero.title}
          </h1>

          <p className="max-w-xl mx-auto font-sans text-lg md:text-xl text-white/90 leading-relaxed font-medium">
            {siteContent.hero.description}
          </p>
        </div>
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link href="/client">
            <Button className="h-14 px-10 rounded-full bg-fluxion-gradient text-white font-bold text-lg shadow-2xl shadow-fluxion-rose/20 hover:scale-105 transition-all active:scale-95 group">
              {siteContent.hero.cta}
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
