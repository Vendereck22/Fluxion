"use client";

import { useSiteContent } from "@/components/client/SiteContentProvider";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductsFinalSection() {
  const siteContent = useSiteContent();
  return (
    <section className="w-full bg-slate-50 pb-16 md:pb-24">
      <div className="fluxion-container">
        <Card className="border border-slate-200/70 overflow-hidden bg-gradient-to-b from-white via-white to-[#ffd5db]">
          <CardContent className="min-h-[360px] md:min-h-[520px] flex items-center justify-center text-center px-6">
            <h2 className="text-5xl md:text-7xl font-heading font-black text-fluxion-rose leading-[0.92] tracking-tight">
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
