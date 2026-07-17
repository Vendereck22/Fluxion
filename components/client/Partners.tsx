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
  const hasLogos = partnerLogos.length > 0;

  return (
    <section className="py-16 bg-fluxion-blue relative overflow-hidden" aria-labelledby="partners-title">
      <div className="absolute inset-0 opacity-5 bg-[url('/noise.png')] pointer-events-none" />

      <div className="fluxion-container relative z-10">
        <div className="flex flex-col items-center">
          <p id="partners-title" className="text-fluxion-rose font-bold text-[10px] uppercase tracking-[0.4em] mb-12 text-center opacity-80">
            {badge}
          </p>

          {hasLogos ? (
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-fluxion-blue to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-fluxion-blue to-transparent" />

            <div className="flex w-max items-center gap-14 motion-safe:animate-[partners-marquee_28s_linear_infinite] hover:[animation-play-state:paused] md:gap-20">
            {animatedLogos.map((partner, index) => {
              const content = partner.logoSrc ? (
                <span className="relative flex h-16 min-w-[170px] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] px-6 backdrop-blur-md transition-all duration-500 group-hover:-translate-y-1 group-hover:border-white/30 group-hover:bg-white/[0.14]">
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/16 via-transparent to-black/20" />
                  <Image
                    src={partner.logoSrc}
                    alt={`Logo ${partner.name}`}
                    width={260}
                    height={80}
                    className="relative z-10 h-9 w-auto max-w-[140px] object-contain opacity-90 drop-shadow-[0_1px_8px_rgba(255,255,255,0.28)] transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 md:h-10"
                  />
                </span>
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
                  className="group flex h-20 min-w-[180px] items-center justify-center px-2 transition-transform duration-500"
                  aria-label={`Visiter ${partner.name}`}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={`${partner.name}-${index}`}
                  className="group flex h-20 min-w-[180px] items-center justify-center px-2 transition-transform duration-500"
                >
                  {content}
                </div>
              );
            })}
            </div>
          </div>
          ) : (
            <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center backdrop-blur-sm">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/80">
                Logos partenaires en attente
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/55">
                Les partenaires sont déjà configurés dans l'administration. Ajoutez leurs logos pour activer le défilement animé sur le site.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
