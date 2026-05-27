"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ProductGalleryImage = {
  src: string;
  alt: string;
};

export default function ProductGallery(props: {
  images: ProductGalleryImage[];
  theme: "red" | "purple";
}) {
  const images = props.images ?? [];
  if (!images.length) return null;

  const accent =
    props.theme === "red"
      ? "from-fluxion-rose/25"
      : "from-[#1b1464]/25";

  return (
    <section className="mt-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Galerie
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-heading font-black text-fluxion-blue tracking-tight">
            Apercus du produit
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Quelques images pour mieux visualiser l'univers et les ecrans cles du
            produit.
          </p>
        </div>

        <div
          className={cn(
            "h-[2px] w-full md:w-52 rounded-full bg-gradient-to-r",
            accent,
            "to-transparent",
          )}
          aria-hidden="true"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((img, idx) => (
          <Card
            key={`${img.src}-${idx}`}
            className="border border-slate-200/70 bg-white p-0"
          >
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

