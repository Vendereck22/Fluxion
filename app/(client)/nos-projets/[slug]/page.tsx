import { slugify } from "@/lib/slug";
import ProjectDetail from "@/components/client/projects/ProjectDetail";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectItem = {
  slug?: string;
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  tags?: string[];
};

async function readSiteContent(): Promise<{ projectsPage?: { items?: ProjectItem[] } }> {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as { projectsPage?: { items?: ProjectItem[] } };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const content = await readSiteContent();
  const items = content.projectsPage?.items ?? [];
  const { slug } = await params;

  const project = items.find((p) => {
    const s = p.slug ?? slugify(p.title ?? "");
    return s === slug;
  });

  if (!project) notFound();

  return (
    <ProjectDetail
      project={{
        slug: project.slug ?? slugify(project.title),
        title: project.title,
        description: project.description,
        category: project.category,
        imageSrc: project.imageSrc,
        tags: project.tags ?? [],
      }}
    />
  );
}

export async function generateStaticParams() {
  const content = await readSiteContent();
  const items = content.projectsPage?.items ?? [];
  return items.map((p) => ({
    slug: p.slug ?? slugify(p.title ?? ""),
  }));
}
