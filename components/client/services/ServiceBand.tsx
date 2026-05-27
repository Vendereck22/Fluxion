import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type Tone = "violet" | "navy";

const tones: Record<Tone, string> = {
  violet: "bg-[linear-gradient(90deg,#17005A_0%,#1E006B_52%,#17005A_100%)]",
  navy: "bg-[#061049]",
};

export default function ServiceBand(props: {
  tone: Tone;
  title: string;
  accent: string;
  description: string;
  variant?: "band" | "card";
  right?: React.ReactNode;
  rightImage?: {
    src: string;
    alt: string;
    fit: "cover" | "contain";
    priority?: boolean;
  };
}) {
  const objectFit = props.rightImage?.fit === "cover" ? "object-cover" : "object-contain";
  const variant = props.variant ?? "card";

  return (
    <section className={cn("w-full", variant === "card" ? "px-6 md:px-10" : undefined)}>
      <Card
        className={cn(
          variant === "band"
            ? "rounded-none border-0 ring-0 bg-transparent py-0 text-white overflow-visible"
            : [

                "rounded-2xl border border-white/10 ring-0 text-white overflow-hidden",
                "py-0 gap-0",
              ].join(" "),
          tones[props.tone],
        )}
      >
        <CardContent className={cn(variant === "band" ? "px-0" : "px-0 py-0")}>
          <div className={cn("flex flex-col md:flex-row min-h-[320px]", variant === "card" ? "backdrop-blur-[1px]" : undefined)}>
            <div className={cn("flex items-center", variant === "card" ? "px-8 md:px-10 lg:px-14 py-10 md:py-0 md:w-[520px]" : "px-6 md:px-10 lg:px-14 py-10 md:py-0 md:w-[520px]")}>
              <div className={cn("space-y-4", variant === "card" ? "drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]" : undefined)}>
                <h2 className="text-5xl md:text-6xl font-heading font-normal tracking-tight">
                  {props.title}
                </h2>
                <p className="text-[#ff2b5d] text-sm font-semibold">• {props.accent}</p>
                <p className={cn("text-white/80 text-xs leading-relaxed max-w-[360px]", variant === "card" ? "text-white/85" : undefined)}>
                  {props.description}
                </p>
              </div>
            </div>

            {props.right ? (
              <div className="relative flex-1 min-h-[260px] md:min-h-[320px] overflow-hidden">
                {props.right}
              </div>
            ) : props.rightImage ? (
              <div className="relative flex-1 min-h-[260px] md:min-h-[320px] overflow-hidden">
                <Image
                  src={props.rightImage.src}
                  alt={props.rightImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className={cn(objectFit, "object-right")}
                  priority={props.rightImage.priority}
                />
              </div>
            ) : (
              <div className="hidden md:block flex-1" />
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}