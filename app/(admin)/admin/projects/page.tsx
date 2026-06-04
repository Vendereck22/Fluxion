import ProjectsManager from "./ProjectsManager";
import { LuLayers } from "react-icons/lu";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function ProjectsCMSPage() {
  const projects = (
    await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { position: "asc" },
    })
  ).map((project) => ({
    slug: project.slug,
    title: project.title,
    description: project.description,
    category: project.category,
    imageSrc: project.imageSrc,
    tags: project.tags,
    href: project.href ?? `/nos-projets/${project.slug}`,
  }));

  const filters = Array.from(new Set(projects.map((project) => project.category))).filter(Boolean);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <LuLayers className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              GESTION DES PROJETS
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            CMS Dynamique : Ajoutez ou mettez à jour les projets, leurs catégories, les mots-clés et l'image de couverture.
          </p>
        </div>
      </div>

      <ProjectsManager initialProjects={projects} filters={filters} />
    </div>
  );
}
