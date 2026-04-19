"use client";

import { siteContent } from "@/constants/site-content";

export default function Partners() {
  return (
    <section className="py-16 bg-fluxion-blue relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('/noise.png')] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center">
          <p className="text-fluxion-rose font-bold text-[10px] uppercase tracking-[0.4em] mb-12 text-center opacity-80">
            {siteContent.partners.badge}
          </p>

          <div className="w-full flex flex-wrap justify-center items-center gap-12 md:gap-24">
            {siteContent.partners.names.map((name, index) => (
              <div key={index} className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <span className={`text-white font-black text-2xl tracking-tighter ${index % 2 === 0 ? "italic" : ""}`}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
