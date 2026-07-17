import ServicesManager from "./ServicesManager";
import { Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function ServicesCMSPage() {
  const featuresSection = await prisma.cmsSection.findUnique({
    where: { key: "features" },
  });
  const serviceFeatures = await prisma.serviceFeature.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
  });
  const sectionData =
    featuresSection?.data && typeof featuresSection.data === "object"
      ? (featuresSection.data as { badge?: string; title?: string; more?: string })
      : {};

  const featuresData = {
    badge: sectionData.badge ?? "Nos Piliers",
    title: sectionData.title ?? "L'excellence gravée dans chaque pixel.",
    more: sectionData.more ?? "En savoir plus",
    items: serviceFeatures.map((item) => ({
      title: item.title,
      description: item.description,
      moreLabel: item.moreLabel ?? "",
      imageSrc: item.imageSrc ?? "",
      gallery: Array.isArray(item.gallery)
        ? (item.gallery as { src: string; alt: string }[])
        : [],
    })),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              SERVICES ET OFFRES
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Éditeur CMS : Ajustez les textes de vos offres Next.js, MacBook Pro et services associés.
          </p>
        </div>
      </div>


      <ServicesManager initialData={featuresData} />
    </div>
  );
}
