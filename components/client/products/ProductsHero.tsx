"use client";

import { siteContent } from "@/constants/site-content";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductsHero() {
  return (
    <section className="w-full bg-slate-50 pt-28 pb-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <Card className="border border-slate-200/70">
          <CardContent className="p-10 md:p-14 text-center">
            <h1 className="text-5xl md:text-7xl font-heading font-black text-fluxion-rose tracking-tight">
              {siteContent.products.title}
            </h1>
            <p className="mt-6 text-sm md:text-base text-slate-900/80 leading-relaxed">
              {siteContent.products.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}