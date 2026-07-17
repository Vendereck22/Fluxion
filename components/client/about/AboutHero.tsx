"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSiteContent } from "@/components/client/SiteContentProvider";

export default function AboutHero() {
  const siteContent = useSiteContent();
  return (
    <section className="w-full bg-slate-50 pt-28 pb-10">
      <div className="fluxion-container ">
        <h1 className="text-5xl md:text-7xl font-heading font-black text-fluxion-rose tracking-tight text-center">
          {siteContent.aboutPage?.title ?? siteContent.pages.about.title}
        </h1>
        <p className="mt-7 text-sm md:text-base text-slate-700/90 leading-relaxed max-w-4xl mx-auto text-center">
          {siteContent.aboutPage?.intro ?? siteContent.pages.about.description}
        </p>
      </div>
    </section>
  );
}
