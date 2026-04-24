"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { siteContent } from "@/constants/site-content";
import Logo from "./Logo";
import HeroBackground from "./HeroBackground";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center py-20 px-6 overflow-hidden bg-[#050505] antialiased">
      {/* L'Animation Three.js en arrière-plan */}
      <HeroBackground />

      {/* Overlay de gradient pour la profondeur */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505] z-1" />

      <div className="container mx-auto max-w-5xl flex flex-col items-center text-center space-y-10 relative z-10">
        <header className="flex flex-col items-center space-y-4">
          <Badge
            variant="secondary"
            className="mb-4 bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 backdrop-blur-sm"
          >
            {siteContent.hero.badge}
          </Badge>
          <Logo size="md" light />
        </header>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-normal tracking-tighter text-white leading-[0.9]">
            {siteContent.hero.title.split(" ").map((word, i) => (
              <span
                key={i}
                className={
                  word.toLowerCase() === "fluxion" ? "text-fluxion-rose" : ""
                }
              >
                {word}{" "}
              </span>
            ))}
          </h1>

          <p className="max-w-xl mx-auto font-sans text-lg md:text-xl text-white/70 leading-relaxed font-medium">
            {siteContent.hero.description}
          </p>
        </div>

        <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link href="/client">
            <Button className="h-16 px-12 rounded-full bg-fluxion-rose/75 backdrop-blur-md hover:bg-fluxion-rose/90 text-white font-bold text-lg shadow-2xl shadow-fluxion-rose/30 hover:scale-105 transition-all active:scale-95 group">
              {siteContent.hero.cta}
              <span className="ml-2 group-hover:translate-x-2 transition-transform italic">
                →
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Décoration de côté (Glow) */}
      <div className="absolute -left-24 top-1/4 w-96 h-96 bg-fluxion-rose/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
