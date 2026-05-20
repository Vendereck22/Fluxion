import { getLeads } from "@/app/actions/leads";
import InboxList from "./InboxList";
import { Inbox } from "lucide-react";

export const revalidate = 0; // Fresh leads on every visit

export default async function InboxPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              BOÎTE DE RÉCEPTION
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Inbox client : Centralisez et traitez les demandes de projets soumises via le formulaire de contact.
          </p>
        </div>
      </div>

      {/* Inbox List Render */}
      <InboxList initialLeads={leads} />
    </div>
  );
}
