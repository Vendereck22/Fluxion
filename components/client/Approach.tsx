"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { siteContent } from "@/constants/site-content";

const steps = [
  {
    ...siteContent.approach.steps[0],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    isReverse: false,
  },
  {
    ...siteContent.approach.steps[1],
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=2070&auto=format&fit=crop",
    isReverse: true,
  },
  {
    ...siteContent.approach.steps[2],
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    isReverse: false,
  },
];

export default function Approach() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header de section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-fluxion-rose/10 text-fluxion-rose border-none mb-4 uppercase tracking-widest px-4 py-1">
            {siteContent.approach.badge}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-fluxion-blue leading-tight">
            L&apos;approche qui {siteContent.approach.title.split("qui")[1].split("standards")[0]} <br />
            <span className="text-fluxion-rose italic">standards.</span>
          </h2>
        </div>

        {/* Liste des blocs (Alternance Image/Texte) */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                step.isReverse ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-12 md:gap-24`}
            >
              {/* Côté Image avec effet de profondeur (Shadow + Glow) */}
              <div className="flex-1 relative group w-full">
                <div className="absolute -inset-4 bg-fluxion-gradient opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-500 rounded-[3rem]" />
                <div className="relative aspect-video md:aspect-[4/3] lg:aspect-video rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay subtil pour le contraste */}
                  <div className="absolute inset-0 bg-fluxion-blue/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>

              {/* Côté Texte */}
              <div className="flex-1 space-y-6">
                <div className="relative">
                  <span className="text-8xl font-black text-slate-50 font-heading absolute -top-12 -left-4 -z-10 select-none">
                    0{index + 1}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-heading font-bold text-fluxion-blue relative">
                    {step.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-sans max-w-md">
                  {step.description}
                </p>
                <div className="flex items-center gap-4 group/link cursor-pointer">
                  <div className="w-12 h-1.5 bg-fluxion-rose rounded-full transition-all group-hover/link:w-20" />
                  <span className="text-xs font-black uppercase tracking-widest text-fluxion-blue opacity-0 group-hover/link:opacity-100 transition-all">
                    {step.more}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
