import ProjectsHero from "@/components/client/projects/ProjectsHero";
import ProjectsGrid from "@/components/client/projects/ProjectsGrid";
import path from "path";
import { readJsonPreferFallback, tmpDataPath } from "@/lib/server/json-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Project {
  slug?: string;
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags?: string[];
  href?: string;
}

interface SiteContentData {
  projectsPage?: {
    items?: Project[];
    filters?: string[];
  };
}

async function readSiteContent(): Promise<SiteContentData> {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  return readJsonPreferFallback<SiteContentData>(
    filePath,
    tmpDataPath("site-content.json"),
    {}
  );
}

export default async function NosProjets() {
  const content = await readSiteContent();
  const projects = content.projectsPage?.items ?? [];
  const filters = content.projectsPage?.filters ?? [
    "Tous",
    "Identite visuelle",
    "UI/UX",
    "Developpement",
    "Video",
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <ProjectsHero />
      <ProjectsGrid initialProjects={projects} initialFilters={filters} />
    </div>
  );
}