"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ProjectDetailData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags?: string[];
};

export default function ProjectDetail({ project }: { project: ProjectDetailData }) {
  return (
    <div className="w-full bg-slate-50">
      <section className="pt-28 pb-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-6">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/nos-projets" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour aux projets
              </Link>
            </Button>
          </div>

          <Card className="overflow-hidden border border-slate-200/70 bg-white">
            <div className="relative h-[320px] md:h-[420px]">
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute left-8 bottom-8 flex flex-wrap items-center gap-3">
                <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                  {project.category}
                </Badge>
                {(project.tags ?? []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-black uppercase tracking-wider text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <CardContent className="p-10 md:p-14">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-6xl font-heading font-black text-fluxion-blue tracking-tight">
                    {project.title}
                  </h1>
                  <p className="mt-5 text-slate-700/90 leading-relaxed text-sm md:text-base">
                    {project.description}
                  </p>
                </div>

                <div className="hidden md:flex">
                  <div className="w-14 h-14 rounded-2xl bg-fluxion-rose text-white flex items-center justify-center shadow-xl shadow-fluxion-rose/20">
                    <ArrowUpRight className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-slate-200/70 bg-slate-50">
                  <CardContent className="p-7">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Objectif
                    </p>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                      Clarifier le message, renforcer la credibilite et obtenir un rendu haut de gamme.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200/70 bg-slate-50">
                  <CardContent className="p-7">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Approche
                    </p>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                      Design system + iteration rapide, puis integration technique propre et maintenable.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-slate-200/70 bg-slate-50">
                  <CardContent className="p-7">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Resultat
                    </p>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                      Une experience fluide, une identite forte, et une base evolutive pour la suite.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}