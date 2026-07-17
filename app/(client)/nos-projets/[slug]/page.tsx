import ProjectDetail from "@/components/client/projects/ProjectDetail";
import { notFound } from "next/navigation";
import { getPublicProjects } from "@/lib/server/public-content";

export const revalidate = 1;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const items = await getPublicProjects();
  const { slug } = await params;

  const project = items.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <ProjectDetail
      project={{
        slug: project.slug,
        title: project.title,
        description: project.description,
        category: project.category,
        imageSrc: project.imageSrc,
        tags: project.tags,
      }}
    />
  );
}

export async function generateStaticParams() {
  const items = await getPublicProjects();
  return items.map((p) => ({
    slug: p.slug,
  }));
}
