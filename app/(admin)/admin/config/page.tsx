import fs from "fs/promises";
import path from "path";
import ConfigManager from "./ConfigManager";
import { Sliders } from "lucide-react";

export const revalidate = 0;

export default async function ConfigPage() {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");

  let footerData = {
    socialBadge: "Suivez l'agence",
    location: "Kinshasa, RD Congo",
    email: "contact@fluxion.cd",
    privacy: "Confidentialité",
    terms: "Conditions"
  };

  let socialData = {
    badge: "Suivez l'agence",
    platforms: {
      linkedin: "LinkedIn",
      instagram: "Instagram",
      twitter: "Twitter"
    }
  };

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    if (data.footer) footerData = data.footer;
    if (data.social) socialData = data.social;
  } catch (error) {
    console.error("Failed to read site-content.json for config CMS:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              CONFIGURATION SYSTÈME
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Gestion globale des coordonnées de contact, réseaux sociaux, et options de pied de page.
          </p>
        </div>
      </div>


      <ConfigManager initialFooter={footerData} initialSocial={socialData} />
    </div>
  );
}
