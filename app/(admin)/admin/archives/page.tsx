import { getLeads } from "@/app/actions/leads";
import ArchiveList from "./ArchiveList";
import { Archive } from "lucide-react";

export const revalidate = 0; // Disable cache

export default async function ArchivesPage() {
  const leads = await getLeads();
  const archivedLeads = leads.filter((l) => l.status === "archived");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              ARCHIVES DE PROJETS
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Registre des anciens leads et demandes clôturées ou archivées.
          </p>
        </div>
      </div>

      {/* Archive List Render */}
      <ArchiveList initialLeads={archivedLeads} />
    </div>
  );
}
