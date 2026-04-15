"use client";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative w-full py-20 px-6 overflow-hidden bg-fluxion-rose antialiased">
      <div className="container mx-auto max-w-5xl flex flex-col items-center text-center space-y-10">
        <header className="flex flex-col items-center space-y-4 ">
          <div className="w-14 h-14 bg-fluxion-gradient rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-fluxion-cobalt/20 rotate-3 hover:rotate-0 transition-transform cursor-default">
            F
          </div>
        </header>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter text-white leading-[0.9]">
            Suivez le flux.
          </h1>

          <p className="max-w-xl mx-auto font-sans text-lg md:text-xl text-white/90 leading-relaxed font-medium">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
          </p>
        </div>
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Button className="h-14 px-10 rounded-full bg-fluxion-gradient text-white font-bold text-lg shadow-2xl shadow-fluxion-rose/20 hover:scale-105 transition-all active:scale-95 group">
            Rejoignez le flux
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
