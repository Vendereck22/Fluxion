import ProjectsHero from "@/components/client/projects/ProjectsHero";
import ProjectsGrid from "@/components/client/projects/ProjectsGrid";
import { getPublicProjects } from "@/lib/server/public-content";

export const revalidate = 1;

export default async function NosProjets() {
  const projects = await getPublicProjects();
  const filters = ["Tous", ...Array.from(new Set(projects.map((project) => project.category))).filter(Boolean)];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <ProjectsHero />
      <ProjectsGrid initialProjects={projects} initialFilters={filters} />
    </div>
  );
}
