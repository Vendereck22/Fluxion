import ProjectsHero from "@/components/client/projects/ProjectsHero";
import ProjectsGrid from "@/components/client/projects/ProjectsGrid";

export default function NosProjets() {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <ProjectsHero />
      <ProjectsGrid />
    </div>
  );
}