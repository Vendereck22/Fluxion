"use client";

import { useState, useMemo } from "react";
import {
  Search, Trash2, Send, CheckCircle2, History,
  MailCheck, MailX, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";
import {
  toggleSubscriberStatus, deleteSubscriber, sendNewsletter,
  Subscriber, NewsletterLog
} from "@/app/actions/newsletter";

interface NewsletterManagerProps {
  initialSubscribers: Subscriber[];
  initialLogs: NewsletterLog[];
}

export default function NewsletterManager({
  initialSubscribers,
  initialLogs
}: NewsletterManagerProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [logs, setLogs] = useState<NewsletterLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSubscribers.filter(s => s.status === "active").map(s => s.id)
  );


  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");


  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);


  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s =>
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [subscribers, search]);

  const handleSelectAll = () => {
    const activeFiltered = filteredSubscribers.filter(s => s.status === "active").map(s => s.id);
    setSelectedIds(activeFiltered);
  };

  const handleSelectNone = () => {
    setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleStatus = async (subscriber: Subscriber) => {
    const nextStatus = subscriber.status === "active" ? "unsubscribed" : "active";
    try {
      const res = await toggleSubscriberStatus(subscriber.id, nextStatus);
      if (res.success) {
        setSubscribers(prev =>
          prev.map(s => s.id === subscriber.id ? { ...s, status: nextStatus } : s)
        );

        if (nextStatus === "unsubscribed") {
          setSelectedIds(prev => prev.filter(id => id !== subscriber.id));
        }
      } else {
        alert(res.error || "Une erreur s'est produite.");
      }
    } catch {
      alert("Erreur de connexion serveur.");
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet abonné ?")) return;

    try {
      const res = await deleteSubscriber(id);
      if (res.success) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
        setSelectedIds(prev => prev.filter(item => item !== id));
      } else {
        alert(res.error || "Une erreur s'est produite.");
      }
    } catch {
      alert("Erreur de connexion serveur.");
    }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("Veuillez sélectionner au moins un destinataire actif.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      alert("Le sujet et le message de la newsletter sont obligatoires.");
      return;
    }

    setIsSending(true);
    setStatus("idle");
    setErrorMessage("");

    const recipientEmails = subscribers
      .filter(s => selectedIds.includes(s.id))
      .map(s => s.email);

    try {
      const res = await sendNewsletter(subject, message, recipientEmails);
      if (res.success) {
        setStatus("success");
        setSubject("");
        setMessage("");

        const newLog: NewsletterLog = {
          id: "campaign-" + Math.random().toString(36).substring(2, 11),
          subject: subject.trim(),
          message: message.trim(),
          recipients: recipientEmails,
          sentAt: new Date().toISOString()
        };
        setLogs(prev => [newLog, ...prev]);
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Une erreur s'est produite lors de l'envoi.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Une erreur de communication est survenue.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">


      <div className="lg:col-span-7 space-y-8">


        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-tight">
                Liste des Abonnés ({subscribers.length})
              </h3>
              <p className="text-[10px] text-slate-500 font-inter mt-0.5">
                Sélectionnez les destinataires de votre prochaine campagne.
              </p>
            </div>


            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-fluxion-pink-neon focus:outline-none transition-all"
              />
            </div>
          </div>


          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-lg p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>{selectedIds.length} sélectionné(s)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200/50 transition-colors"
              >
                Tout sélectionner
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={handleSelectNone}
                className="hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200/50 transition-colors"
              >
                Désélectionner tout
              </button>
            </div>
          </div>


          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white max-h-[350px] overflow-y-auto pr-1">
            {filteredSubscribers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Aucun abonné trouvé.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredSubscribers.map((sub) => {
                  const isSelected = selectedIds.includes(sub.id);
                  const isActive = sub.status === "active";

                  return (
                    <div
                      key={sub.id}
                      className={`flex items-center justify-between gap-4 p-3 hover:bg-slate-50/50 transition-colors ${
                        !isActive ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!isActive}
                          onChange={() => handleToggleSelect(sub.id)}
                          className="w-4 h-4 text-fluxion-pink-neon border-slate-300 rounded focus:ring-fluxion-pink-neon disabled:opacity-50 cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 tracking-tight font-inter">{sub.email}</p>
                          <p className="text-[9px] text-slate-400 font-inter mt-0.5">
                            Inscrit le : {new Date(sub.subscribedAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() => handleToggleStatus(sub)}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          }`}
                          title={isActive ? "Suspendre l'abonnement" : "Activer l'abonnement"}
                        >
                          {isActive ? (
                            <>
                              <MailCheck size={10} /> Active
                            </>
                          ) : (
                            <>
                              <MailX size={10} /> Suspendu
                            </>
                          )}
                        </button>


                        <button
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <History className="text-slate-400" size={16} />
            <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-tight">
              Historique des Campagnes ({logs.length})
            </h3>
          </div>

          {logs.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
              Aucune newsletter envoyée pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <div
                    key={log.id}
                    className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden hover:border-slate-300 transition-all duration-200"
                  >

                    <div
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 font-heading truncate max-w-sm sm:max-w-md">
                          {log.subject}
                        </h4>
                        <p className="text-[9px] text-slate-400 font-inter">
                          Envoyé le : {new Date(log.sentAt).toLocaleString("fr-FR")} à {log.recipients.length} destinataire(s)
                        </p>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>


                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-slate-200/60 pt-4 bg-white space-y-3 font-inter text-xs">
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Destinataires :</span>
                          <div className="flex flex-wrap gap-1.5">
                            {log.recipients.map((email, idx) => (
                              <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-600 rounded px-1.5 py-0.5 text-[9px] font-mono">
                                {email}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Message :</span>
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
                            {log.message}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>


      <div className="lg:col-span-5">
        <div className="sticky top-24 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-tight">
              Rédiger une Newsletter
            </h3>
            <p className="text-[10px] text-slate-500 font-inter mt-0.5">
              Envoyez un message personnalisé aux abonnés sélectionnés.
            </p>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-4 font-inter text-xs">


            <div className="flex items-center gap-3 p-3 bg-[#FF007F]/5 border border-[#FF007F]/10 rounded-xl text-slate-800">
              <div className="w-8 h-8 rounded-lg bg-[#FF007F]/10 flex items-center justify-center text-fluxion-pink-neon flex-shrink-0">
                <Send size={14} />
              </div>
              <div>
                <p className="font-bold text-[10px] uppercase text-slate-600 tracking-wider">Cible de diffusion</p>
                <p className="text-xs font-bold text-fluxion-pink-neon mt-0.5">
                  {selectedIds.length === 0
                    ? "Aucun destinataire sélectionné"
                    : `${selectedIds.length} abonné(s) sélectionné(s)`
                  }
                </p>
              </div>
            </div>


            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold">Objet / Sujet</label>
              <input
                type="text"
                placeholder="ex: Lancement de notre nouvelle plateforme !"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                required
              />
            </div>


            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold">Message de la Campagne</label>
              <textarea
                rows={8}
                placeholder="Saisissez le contenu de l'email ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded p-3 text-slate-900 resize-none focus:border-fluxion-pink-neon focus:outline-none leading-relaxed"
                required
              />
            </div>


            {status === "success" && (
              <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 animate-in fade-in">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[10px] uppercase">Newsletter Envoyée !</p>
                  <p className="text-[10px] mt-0.5 text-emerald-600 leading-normal">
                    La campagne a été diffusée avec succès à vos abonnés et enregistrée dans l'historique.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-850 animate-in fade-in">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[10px] uppercase">Erreur lors de l'envoi</p>
                  <p className="text-[10px] mt-0.5 text-red-500 leading-normal">{errorMessage}</p>
                </div>
              </div>
            )}


            <button
              type="submit"
              disabled={isSending || selectedIds.length === 0}
              className={`w-full h-10 rounded-lg text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                selectedIds.length === 0
                  ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 text-white shadow-md cursor-pointer"
              }`}
            >
              {isSending ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Diffusion en cours...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Envoyer la newsletter
                </>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}