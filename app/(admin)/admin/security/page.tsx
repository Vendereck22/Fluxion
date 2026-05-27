import { ShieldAlert, Fingerprint, Lock, ShieldCheck, Activity } from "lucide-react";

export const revalidate = 0;

export default function SecurityPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">


      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-[#343D91]" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              SÉCURITÉ & ACCÈS
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Surveillance des sessions actives, audits de sécurité et gestion des accès sensibles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


        <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              Sessions Actives
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-inter font-bold text-[8px] uppercase tracking-wider border border-emerald-200">
              Actuel
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded border border-slate-200 text-[#343D91]">
                  <Fingerprint size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 font-inter">Administrateur Principal</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">IP: 192.168.1.1 (Kinshasa, CD)</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                En ligne
              </span>
            </div>
          </div>
        </div>


        <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              État du Système
            </h3>
            <Activity className="text-slate-400" size={16} />
          </div>

          <div className="space-y-4 font-inter text-xs">
            <div className="flex items-center justify-between p-3 border border-slate-100 rounded bg-slate-50">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <ShieldCheck size={14} className="text-emerald-500" /> Authentification JWT
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-100 rounded bg-slate-50">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <Lock size={14} className="text-emerald-500" /> Next.js API Routes CSRF
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">SÉCURISÉ</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-100 rounded bg-slate-50">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <ShieldAlert size={14} className="text-amber-500" /> Télémétrie IP
              </span>
              <span className="text-[10px] text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-200">Alerte Faible</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed pt-2">
            💡 Aucune intrusion ou tentative d'accès non autorisée détectée sur les 30 derniers jours.
          </p>
        </div>

      </div>

    </div>
  );
}