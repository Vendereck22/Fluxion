import path from "path";
import PartnersManager from "./PartnersManager";
import { LuHandshake } from "react-icons/lu";
import { readJsonPreferFallback, tmpDataPath } from "@/lib/server/json-store";

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
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  let partnersData: NonNullable<SiteContent["partners"]> = {
    badge: "Ils propulsent leur vision avec nous",
    names: [],
    logos: [],
  };

  try {
    const data = await readJsonPreferFallback<SiteContent>(
      filePath,
      tmpDataPath("site-content.json"),
      {}
    );
    partnersData = data.partners || partnersData;
  } catch (error) {
    console.error("Failed to read site-content.json for partners CMS:", error);
  }

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
