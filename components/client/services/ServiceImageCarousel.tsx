"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceImage = {
  src: string;
  alt: string;
};

export default function ServiceImageCarousel({
  images,
  priority = false,
}: {
  images: ServiceImage[];
  priority?: boolean;
}) {
  const visibleItems = 4;
  const [startIndex, setStartIndex] = useState(0);
  const maxStartIndex = Math.max(0, images.length - visibleItems);
  const canScroll = images.length > visibleItems;

  const visibleImages = useMemo(
    () => images.slice(startIndex, startIndex + visibleItems),
    [images, startIndex],
  );

  const scrollPrev = () => {
    setStartIndex((current) => (current <= 0 ? maxStartIndex : current - 1));
  };

  const scrollNext = () => {
    setStartIndex((current) => (current >= maxStartIndex ? 0 : current + 1));
  };

  if (!images.length) return null;

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden bg-white/5 p-3 md:min-h-[520px]">
      <div className="grid h-full min-h-[396px] grid-cols-2 grid-rows-2 gap-3 md:min-h-[496px]">
        {visibleImages.map((image, index) => (
          <button
            key={`${image.src}-${startIndex}`}
            type="button"
            onClick={scrollNext}
            className="group relative overflow-hidden rounded-[1rem] text-left animate-in fade-in slide-in-from-bottom-3 duration-500"
            aria-label="Faire defiler les images design en grille"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-center transition duration-700 group-hover:scale-105"
              priority={priority && startIndex === 0 && index === 0}
            />
            <span className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent opacity-80" />
          </button>
        ))}
      </div>

      {canScroll ? (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-1/2 top-4 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-white/90 text-fluxion-blue transition hover:bg-fluxion-rose hover:text-white"
            aria-label="Images precedentes"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute bottom-4 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-white/90 text-fluxion-blue transition hover:bg-fluxion-rose hover:text-white"
            aria-label="Images suivantes"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
          <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-2 rounded-full bg-black/20 px-2 py-3 backdrop-blur">
            {Array.from({ length: maxStartIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setStartIndex(index)}
                className={cn(
                  "w-2 rounded-full transition-all",
                  startIndex === index ? "h-8 bg-white" : "h-2 bg-white/50",
                )}
                aria-label={`Afficher le groupe d'images ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
