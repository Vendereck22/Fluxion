"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSiteContent } from "@/components/client/SiteContentProvider";

export default function AboutPillars() {
  const siteContent = useSiteContent();
  const who = siteContent.aboutPage?.whoWeAre;
  const mission = siteContent.aboutPage?.mission;
  const vision = siteContent.aboutPage?.vision;

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 via-white to-[#ffd5db] pt-10 md:pt-14 pb-10 md:pb-14">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-black text-fluxion-blue">
            {who?.title ?? "Qui sommes-nous ?"}
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-700/90 leading-relaxed">
            {who?.text ??
              "Fluxion est un studio d'innovation qui conçoit des experiences digitales et des produits utiles. Nous combinons design, developpement et strategie pour transformer des idees en solutions solides."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <Card className="border border-slate-200/70 bg-white/80 backdrop-blur">
            <CardContent className="p-10">
              <div className="w-14 h-14 rounded-2xl bg-black/85" aria-hidden="true" />
              <h3 className="mt-6 text-xl md:text-2xl font-heading font-black text-fluxion-blue">
                {mission?.title ?? "Notre mission"}
              </h3>
              <p className="mt-3 text-sm text-slate-700/90 leading-relaxed">
                {mission?.text ??
                  "Aider les entreprises a se developper grace a des experiences numeriques claires, rapides et coherentes, du concept jusqu'au produit final."}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/70 bg-white/80 backdrop-blur">
            <CardContent className="p-10">
              <div className="w-14 h-14 rounded-2xl bg-black/85" aria-hidden="true" />
              <h3 className="mt-6 text-xl md:text-2xl font-heading font-black text-fluxion-blue">
                {vision?.title ?? "Notre vision"}
              </h3>
              <p className="mt-3 text-sm text-slate-700/90 leading-relaxed">
                {vision?.text ??
                  "Construire des produits qui elevent les standards: beaux, accessibles, maintenables, et capables de grandir avec votre activite."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}