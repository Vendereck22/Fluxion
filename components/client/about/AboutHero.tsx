"use client";

import { Card, CardContent } from "@/components/ui/card";
import { siteContent } from "@/constants/site-content";

export default function AboutHero() {
  return (
    <section className="w-full bg-slate-50 pt-28 pb-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <Card className="border border-slate-200/70 bg-white">
          <CardContent className="p-10 md:p-14 text-center">
            <h1 className="text-6xl md:text-8xl font-heading font-black text-fluxion-rose tracking-tight">
              {siteContent.aboutPage?.title ?? siteContent.pages.about.title}
            </h1>
            <p className="mt-7 text-sm md:text-base text-slate-700/90 leading-relaxed max-w-4xl mx-auto">
              {siteContent.aboutPage?.intro ?? siteContent.pages.about.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
