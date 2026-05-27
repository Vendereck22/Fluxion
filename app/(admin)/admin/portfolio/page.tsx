import fs from "fs/promises";
import path from "path";
import PortfolioManager from "./PortfolioManager";
import { FolderGit } from "lucide-react";

export const revalidate = 0;

export default async function PortfolioCMSPage() {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  let partnersData = {
    badge: "Ils propulsent leur vision avec nous",
    names: []
  };

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    partnersData = data.partners || partnersData;
  } catch (error) {
    console.error("Failed to read site-content.json for portfolio CMS:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              GESTION DU PORTFOLIO
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Éditeur CMS : Gérez la liste des logos d'entreprises qui soutiennent Fluxion.
          </p>
        </div>
      </div>


      <PortfolioManager initialData={partnersData} />
    </div>
  );
}