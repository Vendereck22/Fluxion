"use client";

import { useState } from "react";
import { Inbox, Trash2, Calendar, Phone } from "lucide-react";
import { updateLeadStatus, deleteLead, Lead } from "@/app/actions/leads";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";

interface ArchiveListProps {
  initialLeads: Lead[];
}

export default function ArchiveList({ initialLeads }: ArchiveListProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isUpdating, setIsUpdating] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const handleRestore = async (id: string) => {
    setIsUpdating(true);
    try {
      const res = await updateLeadStatus(id, "new");
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert(res.error || "Une erreur s'est produite.");
      }
    } catch {
      alert("Erreur de communication.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;
    setIsUpdating(true);
    try {
      const res = await deleteLead(leadToDelete.id);
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
        setLeadToDelete(null);
      } else {
        alert(res.error || "Une erreur s'est produite.");
      }
    } catch {
      alert("Erreur de communication.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="font-sans space-y-4">
      {leads.length === 0 ? (
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-12 text-center text-slate-500 text-xs">
          Aucun message dans les archives.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm transition-all duration-300 flex flex-col justify-between h-full hover:border-slate-300"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-black text-sm text-slate-900 tracking-tight uppercase">
                      {lead.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-inter mt-0.5 flex items-center gap-1">
                      <Phone size={10} />
                      {lead.phone || "Téléphone non renseigné"}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-inter font-bold text-[8px] uppercase tracking-wider border border-slate-200">
                    Archivé
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-3 mt-4 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {lead.message}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400 font-bold">
                  <Calendar size={10} />
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestore(lead.id)}
                    disabled={isUpdating}
                    className="h-7 px-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold font-inter text-[9px] uppercase flex items-center gap-1 transition-colors"
                    title="Restaurer dans la boîte de réception"
                  >
                    <Inbox size={10} />
                    Restaurer
                  </button>
                  <button
                    onClick={() => setLeadToDelete(lead)}
                    disabled={isUpdating}
                    className="h-7 w-7 rounded bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-500 flex items-center justify-center transition-colors"
                    title="Supprimer définitivement"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={Boolean(leadToDelete)}
        isLoading={isUpdating}
        title="Supprimer cette archive ?"
        description={`La demande archivée de ${leadToDelete?.name ?? "ce visiteur"} sera supprimée définitivement. Cette action est irréversible.`}
        onOpenChange={(open) => {
          if (!open) setLeadToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
