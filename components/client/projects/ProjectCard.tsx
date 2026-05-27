"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProjectCardProps = {
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags?: string[];
  href?: string;
};

export default function ProjectCard({
  title,
  description,
  category,
  imageSrc,
  tags = [],
  href = "/nos-projets",
}: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden border border-slate-200/70 bg-white transition-all hover:-translate-y-1">
      <div className="relative h-56 md:h-64">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-6 bottom-6 flex items-center gap-3">
          <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider">
            {category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-heading font-black text-fluxion-blue leading-tight tracking-tight">
            {title}
          </h3>
          <div
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center",
              "bg-fluxion-rose/10 text-fluxion-rose border border-fluxion-rose/15",
              "transition-all group-hover:bg-fluxion-rose group-hover:text-white",
            )}
            aria-hidden="true"
          >
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Button
            asChild
            variant="outline"
            className="w-full rounded-2xl h-12 border-slate-200 bg-white hover:bg-slate-50 font-bold text-sm text-fluxion-blue"
          >
            <Link href={href}>Voir le projet</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
