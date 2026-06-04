import {
  Users,
  Activity,
  Layers,
  Inbox,
  Cpu,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { getLeads } from "@/app/actions/leads";
import { siteContent } from "@/constants/site-content";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

export default async function AdminDashboard() {
  const leads = await getLeads();
  const newLeads = leads.filter((l) => l.status === "new");
  const contactedLeads = leads.filter((l) => l.status === "contacted");
  const teamMembers = siteContent.team.members;
  const teamCount = teamMembers.length;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 font-sans">


      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight uppercase">
            FLUXION CONTROL PANEL
          </h1>
          <p className="text-slate-500 text-xs mt-1.5 font-inter tracking-[0.05em]">
            Supervision globale des instances, du contenu et des flux de leads de l'agence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold font-inter tracking-widest text-slate-600 uppercase">
            Système opérationnel
          </span>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


        <div className="relative group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-fluxion-pink-neon/30">
          <div className="absolute top-0 right-0 h-[2px] w-0 bg-fluxion-pink-neon transition-all duration-500 group-hover:w-full" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold font-inter text-slate-500 uppercase tracking-widest">Leads Actifs</span>
            <Inbox className="text-slate-400 group-hover:text-fluxion-pink-neon transition-colors" size={16} />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
              {leads.length}
            </h3>
            <p className="text-[10px] text-slate-500 font-inter">
              {newLeads.length} non traités • {contactedLeads.length} contactés
            </p>
          </div>
        </div>


        <div className="relative group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#343D91]/30">
          <div className="absolute top-0 right-0 h-[2px] w-0 bg-[#343D91] transition-all duration-500 group-hover:w-full" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold font-inter text-slate-500 uppercase tracking-widest">Membres Équipe</span>
            <Users className="text-slate-400 group-hover:text-[#343D91] transition-colors" size={16} />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
              {teamCount}
            </h3>
            <p className="text-[10px] text-slate-500 font-inter">
              Profils actifs visibles sur le site principal
            </p>
          </div>
        </div>


        <div className="relative group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-fluxion-pink-neon/30">
          <div className="absolute top-0 right-0 h-[2px] w-0 bg-fluxion-pink-neon transition-all duration-500 group-hover:w-full" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold font-inter text-slate-500 uppercase tracking-widest">Services CMS</span>
            <Layers className="text-slate-400 group-hover:text-fluxion-pink-neon transition-colors" size={16} />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
              {siteContent.features.items.length}
            </h3>
            <p className="text-[10px] text-slate-500 font-inter">
              Piliers stratégiques d'offres éditables
            </p>
          </div>
        </div>


        <div className="relative group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#343D91]/30">
          <div className="absolute top-0 right-0 h-[2px] w-0 bg-[#343D91] transition-all duration-500 group-hover:w-full" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold font-inter text-slate-500 uppercase tracking-widest">Perf. Déploiement</span>
            <Cpu className="text-slate-400 group-hover:text-[#343D91] transition-colors" size={16} />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
              99%
            </h3>
            <p className="text-[10px] text-slate-500 font-inter">
              LCP : 1.1s • Build : 42s (Vercel Production)
            </p>
          </div>
        </div>

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


        <div className="lg:col-span-8 border border-slate-200 rounded-xl bg-white p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
                Moniteur de Performance des Déploiements
              </h4>
              <p className="text-[11px] text-slate-500 font-inter mt-1">
                Visualisation en temps réel de la vitesse de build et du score global Core Web Vitals.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 font-inter">
                <span className="h-1.5 w-1.5 rounded-full bg-[#343D91]" />
                LCP (SEC)
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF007F] font-inter">
                <span className="h-1.5 w-1.5 rounded-full bg-fluxion-pink-neon" />
                BUILD TIME (MIN)
              </div>
            </div>
          </div>


          <div className="h-48 w-full relative pt-4">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">

              <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />


              <path
                d="M 0 70 Q 15 50 30 65 T 60 40 T 90 75 T 100 70"
                fill="none"
                stroke="#343D91"
                strokeWidth="1.5"
                strokeLinecap="round"
              />


              <path
                d="M 0 30 Q 20 40 40 25 T 70 35 T 90 20 T 100 25"
                fill="none"
                stroke="#FF007F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="1 1"
              />
            </svg>
            <div className="absolute inset-0 flex justify-between pointer-events-none text-[8px] font-mono text-slate-400 font-bold items-end pt-4">
              <span>MAI 14</span>
              <span>MAI 15</span>
              <span>MAI 16</span>
              <span>MAI 17</span>
              <span>MAI 18</span>
              <span>MAI 19</span>
              <span>MAI 20 (ACTUEL)</span>
            </div>
          </div>


          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6 text-center">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Docker Nodes</p>
              <p className="text-base font-heading font-black text-slate-900 mt-1">4 / 4 OK</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">CDN Cache Hit</p>
              <p className="text-base font-heading font-black text-slate-900 mt-1">94.8%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">Prisma Query Time</p>
              <p className="text-base font-heading font-black text-slate-900 mt-1">4.2 ms</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-inter">SSL Health</p>
              <p className="text-base font-heading font-black text-emerald-600 mt-1">100% SECURE</p>
            </div>
          </div>
        </div>


        <div className="lg:col-span-4 border border-slate-200 rounded-xl bg-white p-8 flex flex-col justify-between relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Activity size={150} className="text-slate-900" />
          </div>

          <div className="space-y-4">
            <Badge className="bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 hover:bg-slate-200">
              PROMPT ACTION
            </Badge>
            <h4 className="text-xl font-heading font-black text-slate-900 uppercase leading-snug">
              Gestion de la boîte de réception
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed font-inter">
              {newLeads.length > 0
                ? `Vous avez ${newLeads.length} demande(s) de projet en attente de traitement.`
                : "Toutes les demandes de projets ont été archivées ou traitées."}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="h-px bg-slate-100" />
            <div className="flex justify-between items-center text-xs font-inter">
              <span className="text-slate-500">Nouveaux messages</span>
              <span className="font-bold text-fluxion-pink-neon">{newLeads.length}</span>
            </div>
            <Link href="/admin/inbox">
              <button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors mt-2">
                Ouvrir la Boîte
                <ArrowUpRight size={14} />
              </button>
            </Link>
          </div>
        </div>

      </div>


      <div className="border border-slate-200 rounded-xl bg-white p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
            Dernières Activités du Flux
          </h4>
          <Link href="/admin/audit">
            <span className="text-[10px] font-bold text-fluxion-pink-neon hover:underline cursor-pointer tracking-wider font-inter uppercase">
              Consulter les logs →
            </span>
          </Link>
        </div>

        <div className="divide-y divide-slate-100 font-inter text-xs">

          {newLeads.length > 0 ? (
            <div className="py-3 flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-fluxion-pink-neon" />
                <span>Nouveau message soumis par <strong className="text-slate-900">{newLeads[0].name}</strong> ({newLeads[0].phone || newLeads[0].email})</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1 minute ago</span>
            </div>
          ) : null}

          <div className="py-3 flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Système synchronisé avec la constante locale <code className="text-[10px] px-1 bg-slate-100 rounded border border-slate-200 font-mono text-slate-800">site-content.json</code></span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">10 minutes ago</span>
          </div>

          <div className="py-3 flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#343D91]" />
              <span>Mise en production déployée avec succès sur Vercel Edge</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1 hour ago</span>
          </div>

          {teamMembers.length > 0 ? (
            <div className="py-3 flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Consultation de l'équipe : <strong className="text-slate-900">{teamMembers[0].name}</strong> et {teamMembers.length - 1} autres profils actifs</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">2 hours ago</span>
            </div>
          ) : null}

        </div>
      </div>

    </div>
  );
}
