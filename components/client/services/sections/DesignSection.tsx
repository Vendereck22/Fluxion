import ServiceBand from "../ServiceBand";
import Image from "next/image";

const COPY =
  "Nous concevons des identites visuelles, flyers, affiches et supports digitaux qui donnent une direction claire a votre marque. Chaque creation respecte votre positionnement, votre audience et les usages reels de vos canaux de communication.";

export default function DesignSection() {
  return (
    <ServiceBand
      tone="violet"
      title="Design"
      accent="Flyer"
      description={COPY}
      right={
        <div className="grid grid-cols-3 grid-rows-2 h-full w-full gap-0.5 bg-white/10 p-0.5">
          {[
            "/images/services/new/design-1.jpg",
            "/images/services/new/design-2.jpg",
            "/images/services/new/design-3.jpg",
            "/images/services/new/design-4.jpg",
            "/images/services/new/design-5.jpg",
            "/images/services/new/design-6.jpg",
          ].map((src, idx) => (
            <div key={src} className="relative overflow-hidden">
              <Image
                src={src}
                alt={`Design ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 20vw"
                className="object-cover saturate-110 contrast-110"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      }
    />
  );
}
