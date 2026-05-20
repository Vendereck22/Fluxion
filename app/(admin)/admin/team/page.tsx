import fs from "fs/promises";
import path from "path";
import TeamManager from "./TeamManager";
import { Users } from "lucide-react";

export const revalidate = 0; // Ensure data is loaded dynamically

export default async function TeamCMSPage() {
  const filePath = path.join(process.cwd(), "constants", "site-content.json");
  let teamMembers = [];
  
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    teamMembers = data.team?.members || [];
  } catch (error) {
    console.error("Failed to read site-content.json for team CMS:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Users className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              GESTION DE L'ÉQUIPE
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            CMS Dynamique : Modifiez les biographies, les rôles et ajoutez des collaborateurs à l'agence.
          </p>
        </div>
      </div>

      {/* Render the Client-Side Team Manager */}
      <TeamManager initialMembers={teamMembers} />
    </div>
  );
}
