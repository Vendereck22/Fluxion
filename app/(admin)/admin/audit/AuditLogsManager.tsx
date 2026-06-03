"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LuTerminal,
  LuRefreshCw,
  LuSearch,
  LuInfo,
  LuX,
  LuGlobe,
  LuUser,
  LuShieldAlert,
  LuActivity,
  LuLayers,
  LuUserPlus,
  LuUserMinus,
  LuCalendar,
} from "react-icons/lu";
import type { AuditLogEntry } from "@/app/actions/audit";

interface AuditLogsManagerProps {
  initialLogs: AuditLogEntry[];
}

export default function AuditLogsManager({ initialLogs }: AuditLogsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | AuditLogEntry["actionType"]>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [visibleCount, setVisibleCount] = useState(50);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Filter & Search logic
  const filteredLogs = initialLogs.filter((log) => {
    const matchesFilter = activeFilter === "ALL" || log.actionType === activeFilter;
    if (!matchesFilter) return false;

    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      log.userEmail.toLowerCase().includes(query) ||
      log.message.toLowerCase().includes(query) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(query)) ||
      (log.details && log.details.toLowerCase().includes(query)) ||
      log.actionType.toLowerCase().includes(query)
    );
  });

  const displayedLogs = filteredLogs.slice(0, visibleCount);

  // Statistics calculation
  const totalLogs = initialLogs.length;
  const recentLogins = initialLogs.filter(
    (l) => l.actionType === "LOGIN" && l.message.includes("réussie")
  ).length;
  const cmsUpdates = initialLogs.filter((l) => l.actionType === "CMS_UPDATE").length;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const getActionBadge = (type: AuditLogEntry["actionType"]) => {
    switch (type) {
      case "LOGIN":
        return {
          label: "CONNEXION",
          classes: "bg-blue-50 text-blue-700 border-blue-200",
          icon: LuUser,
        };
      case "LOGOUT":
        return {
          label: "DÉCONNEXION",
          classes: "bg-slate-100 text-slate-700 border-slate-200",
          icon: LuUserMinus,
        };
      case "CMS_UPDATE":
        return {
          label: "CMS UPDATE",
          classes: "bg-purple-50 text-purple-700 border-purple-200",
          icon: LuLayers,
        };
      case "USER_CREATE":
        return {
          label: "CREATE USER",
          classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: LuUserPlus,
        };
      case "USER_DELETE":
        return {
          label: "DELETE USER",
          classes: "bg-rose-50 text-rose-700 border-rose-200",
          icon: LuUserMinus,
        };
      default:
        return {
          label: type,
          classes: "bg-slate-50 text-slate-700 border-slate-200",
          icon: LuActivity,
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <LuTerminal className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              AUDIT DES ACTIONS
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Traçabilité complète des connexions, modifications de contenu et gestion des comptes utilisateurs en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <LuRefreshCw size={14} className={isPending ? "animate-spin text-fluxion-pink-neon" : ""} />
            {isPending ? "Rechargement..." : "Rafraîchir"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-fluxion-pink-neon">
            <LuActivity size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Total Événements</p>
            <p className="text-lg font-heading font-black text-slate-900 mt-0.5">{totalLogs}</p>
          </div>
        </div>

        <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#343D91]">
            <LuUser size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Connexions réussies</p>
            <p className="text-lg font-heading font-black text-slate-900 mt-0.5">{recentLogins}</p>
          </div>
        </div>

        <div className="border border-slate-200 bg-white shadow-sm p-6 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-purple-500">
            <LuLayers size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Mises à jour CMS</p>
            <p className="text-lg font-heading font-black text-slate-900 mt-0.5">{cmsUpdates}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {(["ALL", "LOGIN", "LOGOUT", "CMS_UPDATE", "USER_CREATE", "USER_DELETE"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveFilter(tab);
                setVisibleCount(50);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-200 border ${
                activeFilter === tab
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-200/60"
              }`}
            >
              {tab === "ALL" ? "TOUT" : tab.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <LuSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(50);
            }}
            placeholder="Rechercher email, IP, message..."
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-fluxion-pink-neon focus:border-fluxion-pink-neon transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <LuX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden select-text">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 tracking-wider font-inter uppercase select-none">
                <th className="py-4 px-6">Horodatage</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Utilisateur</th>
                <th className="py-4 px-6">Message</th>
                <th className="py-4 px-6">Adresse IP</th>
                <th className="py-4 px-6 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-inter select-none">
                    Aucun enregistrement d'audit trouvé.
                  </td>
                </tr>
              ) : (
                displayedLogs.map((log) => {
                  const badge = getActionBadge(log.actionType);
                  const BadgeIcon = badge.icon;
                  const isFailedLogin = log.actionType === "LOGIN" && log.message.includes("échouée");

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-3 px-6 whitespace-nowrap text-slate-400 font-mono text-[10px]">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold tracking-wider border uppercase ${badge.classes}`}>
                          <BadgeIcon size={10} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-slate-900 font-semibold max-w-[180px] truncate">
                        {log.userEmail}
                      </td>
                      <td className={`py-3 px-6 max-w-[320px] truncate ${isFailedLogin ? "text-red-600 font-semibold" : "text-slate-600"}`}>
                        {log.message}
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-slate-400 font-mono text-[10px]">
                        {log.ipAddress || "127.0.0.1"}
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap text-right select-none">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all inline-flex items-center gap-1"
                          title="Inspecter le log"
                        >
                          <LuInfo size={14} />
                          <span className="text-[10px] font-bold px-0.5">Détails</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Load more button */}
        {filteredLogs.length > visibleCount && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/20 text-center select-none">
            <button
              onClick={() => setVisibleCount((prev) => prev + 50)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
            >
              Voir plus d'enregistrements
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl p-6 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <LuShieldAlert className="text-fluxion-pink-neon" size={18} />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-inter">
                  Inspection de l'événement
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg border border-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
              >
                <LuX size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <LuCalendar size={12} /> Date et Heure
                </span>
                <span className="col-span-2 text-slate-700 font-medium font-mono">
                  {formatDate(selectedLog.timestamp)} <span className="text-[10px] text-slate-400">({selectedLog.timestamp})</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <LuActivity size={12} /> Type d'Action
                </span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider border uppercase ${getActionBadge(selectedLog.actionType).classes}`}>
                    {selectedLog.actionType.replace("_", " ")}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <LuUser size={12} /> Utilisateur
                </span>
                <span className="col-span-2 text-slate-800 font-semibold">
                  {selectedLog.userEmail}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <LuGlobe size={12} /> Adresse IP
                </span>
                <span className="col-span-2 text-slate-700 font-mono">
                  {selectedLog.ipAddress || "127.0.0.1"}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 py-2 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  Description
                </span>
                <span className="text-slate-800 font-medium bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed">
                  {selectedLog.message}
                </span>
              </div>

              {selectedLog.details && (
                <div className="flex flex-col gap-1.5 py-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    Données & Métadonnées
                  </span>
                  <pre className="text-[10px] font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed select-text border border-slate-800 shadow-inner">
                    {selectedLog.details}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Fermer l'inspecteur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
