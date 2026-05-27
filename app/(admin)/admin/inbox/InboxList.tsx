"use client";

import { useState } from "react";
import { Mail, Check, Archive, Trash2, Calendar, Building } from "lucide-react";
import { updateLeadStatus, deleteLead, Lead } from "@/app/actions/leads";

interface InboxListProps {
  initialLeads: Lead[];
}

export default function InboxList({ initialLeads }: InboxListProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (id: string, newStatus: "contacted" | "archived") => {
    setIsUpdating(true);
    try {
      const res = await updateLeadStatus(id, newStatus);
      if (res.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert(res.error || "Une erreur s'est produite.");
      }
    } catch {
      alert("Erreur de communication.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous supprimer définitivement ce lead ?")) return;
    setIsUpdating(true);
    try {
      const res = await deleteLead(id);
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      } else {
        alert(res.error || "Une erreur s'est produite.");
      }
    } catch {
      alert("Erreur de communication.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Inbox only shows new or contacted (non-archived) leads
  const activeLeads = leads.filter(l => l.status !== "archived");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      
      {/* Leads List */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
          Demandes Reçues ({activeLeads.length})
        </h3>
        
        {activeLeads.length === 0 ? (
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-12 text-center text-slate-500 text-xs">
            Aucun message actif dans la boîte de réception.
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {activeLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`border rounded-xl p-5 bg-white cursor-pointer transition-all duration-300 text-left relative overflow-hidden shadow-sm ${
                    isSelected 
                      ? "border-fluxion-pink-neon/50 bg-slate-50 ring-1 ring-fluxion-pink-neon/20" 
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-heading font-black text-sm text-slate-900 tracking-tight uppercase">
                        {lead.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-inter mt-0.5">
                        {lead.company || "Particulier"}
                      </p>
                    </div>

                    {lead.status === "new" ? (
                      <span className="px-2 py-0.5 rounded bg-pink-50 border border-pink-200 text-fluxion-pink-neon font-inter font-bold text-[8px] uppercase tracking-wider">
                        Nouveau
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 font-inter font-bold text-[8px] uppercase tracking-wider">
                        Contacté
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-3">
                    {lead.message}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[9px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[#343D91] font-bold">{lead.budget}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead Details Viewer */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
          Détails de la demande
        </h3>
        
        {selectedLead ? (
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-8 space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-xl font-heading font-black text-slate-900 uppercase tracking-tight">
                  {selectedLead.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-inter mt-1">
                  <span className="flex items-center gap-1">
                    <Building size={12} className="text-slate-400" />
                    {selectedLead.company || "Particulier"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-slate-600 hover:text-fluxion-pink-neon transition-colors hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                {selectedLead.status === "new" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, "contacted")}
                    disabled={isUpdating}
                    className="h-8 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold font-inter text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <Check size={12} />
                    Marquer Contacté
                  </button>
                )}
                <button
                  onClick={() => handleUpdateStatus(selectedLead.id, "archived")}
                  disabled={isUpdating}
                  className="h-8 px-3 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold font-inter text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                  title="Archiver"
                >
                  <Archive size={12} />
                  Archiver
                </button>
                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  disabled={isUpdating}
                  className="h-8 w-8 rounded bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-500 flex items-center justify-center transition-colors"
                  title="Supprimer définitivement"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Structured details cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 bg-slate-50 rounded-lg p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Service demandé</p>
                <p className="text-xs font-bold text-slate-900 mt-1 uppercase">{selectedLead.service}</p>
              </div>
              
              <div className="border border-slate-200 bg-slate-50 rounded-lg p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Budget estimé</p>
                <p className="text-xs font-bold text-[#FF007F] mt-1 font-mono">{selectedLead.budget}</p>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Message</p>
              <div className="border border-slate-200 bg-slate-50 rounded-lg p-5 font-inter text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedLead.message}
              </div>
            </div>

            {/* Email dispatch help banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[10px] text-slate-500 leading-relaxed font-inter flex gap-3 items-start">
              <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                Vous pouvez répondre directement en écrivant à l'adresse <a href={`mailto:${selectedLead.email}`} className="text-slate-900 font-semibold hover:underline">{selectedLead.email}</a>.
              </div>
            </div>

          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm h-[450px] flex flex-col items-center justify-center text-center p-8 text-slate-500 text-xs">
            <Mail className="text-slate-300 mb-3" size={32} />
            <span>Sélectionnez une demande pour voir son contenu et y répondre.</span>
          </div>
        )}
      </div>

    </div>
  );
}
