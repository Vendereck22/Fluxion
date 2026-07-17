"use client";

import { Quote } from "lucide-react";
import { useSiteContent } from "@/components/client/SiteContentProvider";

export default function Testimonials() {
  const siteContent = useSiteContent();
  const reviews = siteContent.testimonials.reviews;

  return (
    <section className="py-24 bg-slate-50 dark:bg-fluxion-blue/5">
      <div className="fluxion-container">
        <div className="mb-16 grid gap-6 text-center md:grid-cols-[0.9fr_1.1fr] md:text-left md:items-end">
          <div className="space-y-4">
            <div className="inline-flex p-3 rounded-full bg-fluxion-rose/10 text-fluxion-rose">
              <Quote size={24} />
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-black">
              {siteContent.testimonials.title}
            </h2>
          </div>
          <p className="opacity-70 text-base md:text-lg leading-relaxed">
            Des retours concrets sur la qualité, la rigueur et l'impact des expériences conçues avec Fluxion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10 relative"
            >
              <p className="text-slate-600 dark:text-slate-400 italic mb-8 leading-relaxed">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-fluxion-gradient p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <span className="text-fluxion-blue font-bold">
                      {review.name[0]}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-fluxion-blue dark:text-white text-sm">
                    {review.name}
                  </h4>
                  <p className="text-xs text-fluxion-rose font-medium">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
