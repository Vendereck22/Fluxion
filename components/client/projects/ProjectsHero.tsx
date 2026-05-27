"use client";

import { Card, CardContent } from "@/components/ui/card";
import { siteContent } from "@/constants/site-content";

export default function ProjectsHero() {
  const title = siteContent.projectsPage?.title ?? siteContent.pages.projects.title;
  const desc =
    siteContent.projectsPage?.description ?? siteContent.pages.projects.description;

  return (
    <section className="w-full bg-slate-50 pt-28 pb-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <Card className="border border-slate-200/70 bg-white">
          <CardContent className="p-10 md:p-14 text-center">
            <h1 className="text-5xl md:text-7xl font-heading font-black text-fluxion-rose tracking-tight">
              {title}
            </h1>
            <p className="mt-6 text-sm md:text-base text-slate-700/90 leading-relaxed max-w-4xl mx-auto">
              {desc}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
