import fs from "fs/promises";
import path from "path";
import ProjectsManager from "./ProjectsManager";
import { LuLayers } from "react-icons/lu";

export const revalidate = 0;

export default async function ProjectsCMSPage() {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  let projects = [];
  let filters = ["Identite visuelle", "UI/UX", "Developpement", "Video"];

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    projects = data.projectsPage?.items || [];
    
    // Filter out "Tous" since it is a client-side utility filter
    if (data.projectsPage?.filters) {
      filters = data.projectsPage.filters.filter((f: string) => f !== "Tous");
    }
  } catch (error) {
    console.error("Failed to read site-content.json for projects CMS:", error);
  }

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
