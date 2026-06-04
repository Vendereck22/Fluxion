"use client";

import { useSiteContent } from "@/components/client/SiteContentProvider";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductsFinalSection() {
  const siteContent = useSiteContent();
  return (
    <section className="w-full bg-slate-50 pb-16 md:pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <Card className="border border-slate-200/70 overflow-hidden bg-gradient-to-b from-white via-white to-[#ffd5db]">
          <CardContent className="min-h-[360px] md:min-h-[520px] flex items-center justify-center text-center px-6">
            <h2 className="text-6xl md:text-8xl font-heading font-black text-fluxion-rose leading-[0.9] tracking-tight">
              {siteContent.products.finalStatement?.split("<br />")[0] ??
                "Ici on cree"}
              <br />
              {siteContent.products.finalStatement?.split("<br />")[1] ??
                "le futur"}
            </h2>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}