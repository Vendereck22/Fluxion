"use client";

import Image from "next/image";

type PartnerLogo = {
  name: string;
  logoSrc: string;
  website?: string;
};

export default function Partners({
  badge,
  logos,
}: {
  badge: string;
  logos: PartnerLogo[];
}) {
  const partnerLogos = logos;
  const animatedLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section className="py-16 bg-fluxion-blue relative overflow-hidden" aria-labelledby="partners-title">
      <div className="absolute inset-0 opacity-5 bg-[url('/noise.png')] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center">
          <p id="partners-title" className="text-fluxion-rose font-bold text-[10px] uppercase tracking-[0.4em] mb-12 text-center opacity-80">
            {badge}
          </p>

          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-fluxion-blue to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-fluxion-blue to-transparent" />

            <div className="flex w-max items-center gap-14 motion-safe:animate-[partners-marquee_28s_linear_infinite] hover:[animation-play-state:paused] md:gap-20">
            {animatedLogos.map((partner, index) => {
              const content = partner.logoSrc ? (
                <Image
                  src={partner.logoSrc}
                  alt={`Logo ${partner.name}`}
                  width={260}
                  height={80}
                  className="h-10 w-auto max-w-[160px] object-contain opacity-60 brightness-0 invert transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-105 group-hover:opacity-100 md:h-12"
                />
              ) : (
                <span className={`text-white font-black text-2xl tracking-tighter ${index % 2 === 0 ? "italic" : ""}`}>
                  {partner.name}
                </span>
              );

              return partner.website ? (
                <a
                  key={`${partner.name}-${index}`}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-16 min-w-[160px] items-center justify-center px-2 transition-transform duration-500"
                  aria-label={`Visiter ${partner.name}`}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={`${partner.name}-${index}`}
                  className="group flex h-16 min-w-[160px] items-center justify-center px-2 transition-transform duration-500"
                >
                  {content}
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
