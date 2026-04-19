import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/constants/site-content";

export default function FinalCTA() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="container mx-auto">
        <div className="relative rounded-[3rem] bg-fluxion-blue p-12 md:p-24 overflow-hidden text-center shadow-2xl">
          {/* Effet de flux (Gradient animé en fond) */}
          <div className="absolute inset-0 bg-fluxion-gradient opacity-20" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
              {siteContent.finalCta.title.split(".")[0]}. <br /> {siteContent.finalCta.title.split(".")[1]}
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-medium">
              {siteContent.finalCta.description}
            </p>
            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-fluxion-blue hover:bg-fluxion-rose hover:text-white px-10 h-16 text-lg font-bold transition-all shadow-xl shadow-black/20"
              >
                <Link href={siteContent.finalCta.buttonLink}>{siteContent.finalCta.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
