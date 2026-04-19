"use client";

import { siteContent } from "@/constants/site-content";

const steps = siteContent.process.steps;

export default function Process() {
  return (
    <section id="process" className="py-24 bg-fluxion-blue text-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">
            {siteContent.process.title}
          </h2>
          <p className="opacity-70 text-lg">
            {siteContent.process.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-fluxion-rose to-transparent opacity-20" />

          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="text-6xl font-black text-white/10 mb-4 group-hover:text-fluxion-rose/30 transition-colors">
                {step.number}
              </div>
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-white/60 text-sm leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
