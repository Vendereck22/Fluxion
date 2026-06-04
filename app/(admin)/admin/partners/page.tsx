import PartnersManager from "./PartnersManager";
import { LuHandshake } from "react-icons/lu";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

type PartnerLogo = {
  name: string;
  logoSrc: string;
  website?: string;
};

type SiteContent = {
  partners?: {
    badge: string;
    names?: string[];
    logos?: PartnerLogo[];
  };
};

export default async function PartnersCMSPage() {
  const badgeSection = await prisma.cmsSection.findUnique({
    where: { key: "partners" },
  });
  const partners = await prisma.partner.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
  });

  const sectionData =
    badgeSection?.data && typeof badgeSection.data === "object"
      ? (badgeSection.data as { badge?: string })
      : {};

  const partnersData: NonNullable<SiteContent["partners"]> = {
    badge: sectionData.badge ?? "Ils propulsent leur vision avec nous",
    names: partners.map((partner) => partner.name),
    logos: partners.map((partner) => ({
      name: partner.name,
      logoSrc: partner.logoSrc,
      website: partner.website ?? "",
    })),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <LuHandshake className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              GESTION DES PARTENAIRES
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Éditeur CMS : Gérez la liste des logos d'entreprises qui soutiennent Fluxion.
          </p>
        </div>
      </div>

      <PartnersManager initialData={partnersData} />
    </div>
  );
}
