import fs from "fs/promises";
import path from "path";
import ServicesManager from "./ServicesManager";
import { Briefcase } from "lucide-react";

export const revalidate = 0; // Disable caching

export default async function ServicesCMSPage() {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  let featuresData = {
    badge: "Nos Piliers",
    title: "L'excellence gravée dans chaque pixel.",
    more: "En savoir plus",
    items: []
  };

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    featuresData = data.features || featuresData;
  } catch (error) {
    console.error("Failed to read site-content.json for services CMS:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
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

      {/* Services Manager Client Component */}
      <ServicesManager initialData={featuresData} />
    </div>
  );
}
