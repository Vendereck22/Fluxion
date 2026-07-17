"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { slugify } from "@/lib/slug";

type Theme = "red" | "purple";
type Layout = "split" | "single";

export type ProductShowcaseProps = {
  name: string;
  description: string;
  imageSrc: string;
  rightImageSrc?: string;
  theme: Theme;
  layout?: Layout;
  rightVariant?: "image" | "panel";
  ctas?: { label: string; href: string; external?: boolean }[];
  icon?: React.ReactNode;
};

const themeStyles: Record<
  Theme,
  {
    panelFrom: string;
    panelTo: string;
    iconBg: string;
    title: string;
    overlay: string;
  }
> = {
  red: {
    panelFrom: "from-black/65",
    panelTo: "to-black/35",
    iconBg: "bg-fluxion-rose",
    title: "text-white",
    overlay: "bg-black/25",
  },
  purple: {
    panelFrom: "from-black/60",
    panelTo: "to-black/30",
    iconBg: "bg-[#1b1464]",
    title: "text-white",
    overlay: "bg-black/20",
  },
};

export default function ProductShowcase({
  name,
  description,
  imageSrc,
  rightImageSrc,
  theme,
  layout = "split",
  rightVariant = "image",
  ctas,
  icon,
}: ProductShowcaseProps) {
  const t = themeStyles[theme];

  const rightSrc = rightImageSrc ?? imageSrc;
  const fallbackHref = `/nos-produits/${slugify(name ?? "")}`;
  const resolvedCtas =
    ctas && ctas.length
      ? ctas
      : [
          { label: "Découvrir", href: fallbackHref },
          { label: "Découvrir", href: fallbackHref },
        ];

  return (
    <section className="w-full bg-slate-50 py-6 md:py-8">
      <div className="fluxion-container">
        <Card className="w-full border border-slate-200/70 overflow-hidden bg-white">
          <CardContent className="p-0">
          {layout === "single" ? (
            <div className="relative min-h-[380px] md:min-h-[440px] overflow-hidden">
              <Image
                src={imageSrc}
                alt={name}
                fill
                priority={false}
                className="object-cover object-center"
                sizes="100vw"
              />

              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

              <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 h-full">
                <div
                  className={cn("relative p-8 md:p-10 flex flex-col justify-center")}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                        t.iconBg,
                      )}
                      aria-hidden="true"
                    >
                      {icon ?? (
                        <span className="font-black text-lg">{name[0]}</span>
                      )}
                    </div>
                    <h2
                      className={cn(
                        "text-4xl md:text-5xl font-heading font-black tracking-tight",
                        t.title,
                      )}
                    >
                      {name}
                    </h2>
                  </div>

                  <p className="mt-5 max-w-md text-white/80 text-xs md:text-sm leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 px-6 py-10 h-full">
                  {resolvedCtas.slice(0, 2).map((cta, idx) => (
	                    <Button
	                      key={`${cta.label}-${idx}`}
	                      asChild
	                      className="w-full sm:w-auto max-w-[220px] rounded-full bg-white text-slate-900 hover:bg-white/90 px-10 h-12 font-semibold shadow-md"
	                    >
                      <Link
                        href={cta.href}
                        target={cta.external ? "_blank" : undefined}
                        rel={cta.external ? "noopener noreferrer" : undefined}
                      >
                        {cta.label}
                      </Link>
	                    </Button>
	                  ))}
	                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[360px] md:min-h-[440px] items-stretch">
              <div className="relative overflow-hidden h-full min-h-[360px] md:min-h-0">
                <Image
                  src={imageSrc}
                  alt={name}
                  fill
                  priority={false}
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className={cn("absolute inset-0", t.overlay)} />

                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-b",
                    t.panelFrom,
                    t.panelTo,
                  )}
                />

                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-5">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                        t.iconBg,
                      )}
                      aria-hidden="true"
                    >
                      {icon ?? (
                        <span className="font-black text-lg">{name[0]}</span>
                      )}
                    </div>

                    <div>
                      <h2
                        className={cn(
                          "text-4xl md:text-5xl font-heading font-black tracking-tight",
                          t.title,
                        )}
                      >
                        {name}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-5 max-w-md text-white/80 text-xs md:text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {rightVariant === "panel" ? (
                <div className="relative h-full min-h-[260px] md:min-h-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/35 to-black/15" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
                  <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-center gap-4 px-6 py-10 h-full">
                    {resolvedCtas.slice(0, 2).map((cta, idx) => (
	                      <Button
	                        key={`${cta.label}-${idx}`}
	                        asChild
	                        className="w-full sm:w-auto max-w-[220px] rounded-full bg-white text-slate-900 hover:bg-white/90 px-10 h-12 font-semibold shadow-md"
	                      >
                        <Link
                          href={cta.href}
                          target={cta.external ? "_blank" : undefined}
                          rel={cta.external ? "noopener noreferrer" : undefined}
                        >
                          {cta.label}
                        </Link>
	                      </Button>
	                    ))}
	                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden h-full min-h-[260px] md:min-h-0">
                  <Image
                    src={rightSrc}
                    alt={`${name} preview`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/35" />

                  <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-center gap-4 px-6 py-10 h-full">
                    {resolvedCtas.slice(0, 2).map((cta, idx) => (
	                      <Button
	                        key={`${cta.label}-${idx}`}
	                        asChild
	                        className="w-full sm:w-auto max-w-[220px] rounded-full bg-white text-slate-900 hover:bg-white/90 px-10 h-12 font-semibold shadow-md"
	                      >
                        <Link
                          href={cta.href}
                          target={cta.external ? "_blank" : undefined}
                          rel={cta.external ? "noopener noreferrer" : undefined}
                        >
                          {cta.label}
                        </Link>
	                      </Button>
	                    ))}
	                  </div>
                </div>
              )}
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}