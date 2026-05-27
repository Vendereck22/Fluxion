"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type Theme = "red" | "purple";

export type ProductValueCardsProps = {
  theme: Theme;
  cards: { title: string; description: string }[];
};

const themeClasses: Record<
  Theme,
  { bg: string; text: string; divider: string }
> = {
  red: {
    bg: "bg-gradient-to-br from-[#ff2a2a] to-[#e31d1d]",
    text: "text-white",
    divider: "bg-white/20",
  },
  purple: {
    bg: "bg-gradient-to-br from-[#120050] to-[#0a0033]",
    text: "text-white",
    divider: "bg-white/15",
  },
};

export default function ProductValueCards({
  theme,
  cards,
}: ProductValueCardsProps) {
  const t = themeClasses[theme];

  return (
    <section className="w-full bg-slate-50 pb-6 md:pb-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {cards.slice(0, 2).map((c) => (
          <Card
            key={c.title}
            className={cn(
              "border border-slate-200/60 overflow-hidden",
              t.bg,
            )}
          >
            <CardContent className="p-8 md:p-10">
              <h3
                className={cn(
                  "text-3xl md:text-4xl font-heading font-black tracking-tight",
                  t.text,
                )}
              >
                {c.title}
              </h3>
              <div className={cn("mt-4 h-[1px] w-16", t.divider)} />
              <p
                className={cn(
                  "mt-4 text-xs leading-relaxed",
                  t.text,
                  "opacity-90",
                )}
              >
                {c.description}
              </p>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </section>
  );
}