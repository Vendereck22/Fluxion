"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/slug";

type Project = {
  slug?: string;
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags?: string[];
  href?: string;
};

export default function ProjectsGrid({
  initialProjects,
  initialFilters,
}: {
  initialProjects?: Project[];
  initialFilters?: string[];
}) {
  const projects: Project[] = initialProjects ?? [];
  const filters: string[] =
    initialFilters ?? [
      "Tous",
      "Identite visuelle",
      "UI/UX",
      "Developpement",
      "Video",
    ];

  const [active, setActive] = useState(filters[0] ?? "Tous");

  const filtered =
    active === "Tous" ? projects : projects.filter((p) => p.category === active);
  const list = filtered.length ? filtered : projects;

  return (
    <section className="w-full bg-slate-50 pb-16 md:pb-20">
      <div className="fluxion-container">

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pb-10">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={cn(
                "h-10 px-5 rounded-full border text-xs font-black uppercase tracking-wider transition-all",
                active === f
                  ? "bg-fluxion-blue text-white border-fluxion-blue shadow-lg shadow-fluxion-blue/10"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              {f}
            </button>
          ))}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {list.map((p) => (
            <ProjectCard
              key={p.title}
              title={p.title}
              description={p.description}
              category={p.category}
              imageSrc={p.imageSrc}
              tags={p.tags ?? []}
              href={p.href ?? `/nos-projets/${p.slug ?? slugify(p.title)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}