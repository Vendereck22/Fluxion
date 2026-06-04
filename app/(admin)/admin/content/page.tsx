import {
  ArrowRight,
  BadgeInfo,
  BarChart3,
  Compass,
  FileText,
  HelpCircle,
  Layers,
  Mail,
  MessageSquareQuote,
  MousePointerClick,
  PlayCircle,
  Share2,
  Sparkles,
  Type,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const SECTIONS = [
  { id: "brand", title: "Marque", description: "Nom, tagline et descriptions légales.", icon: Type },
  { id: "navigation", title: "Navigation", description: "Liens du menu et bouton CTA.", icon: Compass },
  { id: "hero", title: "Section Hero", description: "Titre principal, accroche et bouton d'action.", icon: Sparkles, specialized: true },
  { id: "features", title: "Piliers (Features)", description: "Les trois piliers de l'excellence Fluxion.", icon: Layers, specialized: true },
  { id: "approach", title: "Méthode", description: "Étapes de l'approche stratégique.", icon: BarChart3 },
  { id: "whyUs", title: "Pourquoi nous", description: "Arguments, chiffres clés et réassurance.", icon: BadgeInfo },
  { id: "process", title: "Processus", description: "Parcours et étapes de collaboration.", icon: MousePointerClick },
  { id: "testimonials", title: "Témoignages", description: "Avis clients et retours d'expérience.", icon: MessageSquareQuote },
  { id: "faq", title: "FAQ", description: "Questions fréquemment posées.", icon: HelpCircle },
  { id: "newsletter", title: "Newsletter", description: "Textes d'inscription à la newsletter.", icon: Mail },
  { id: "finalCta", title: "CTA final", description: "Dernier appel à l'action du site.", icon: MousePointerClick },
  { id: "video", title: "Vidéo", description: "Textes de la section vidéo immersive.", icon: PlayCircle },
  { id: "pages", title: "Pages", description: "Titres et descriptions des pages principales.", icon: FileText },
  { id: "products", title: "Textes produits", description: "Textes généraux autour des produits Fluxion.", icon: Layers },
  { id: "aboutPage", title: "À propos", description: "Qui sommes-nous, mission, vision et équipe.", icon: UsersRound },
  { id: "footer", title: "Footer", description: "Coordonnées, liens et pied de page.", icon: FileText },
  { id: "social", title: "Réseaux sociaux", description: "Plateformes, libellés et liens sociaux.", icon: Share2 },
];

export default function ContentPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-heading tracking-tight">Gestion du Contenu</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Sélectionnez une section pour modifier les textes et les médias de votre site depuis l'administration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((section) => (
          <Link key={section.id} href={`/admin/content/${section.id}`} className="group">
            <Card className="h-full border-slate-200 transition-all duration-300 hover:border-fluxion-cobalt/30 hover:bg-slate-50/70">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-fluxion-gradient group-hover:text-white transition-all duration-500">
                  <section.icon size={20} />
                </div>
                <CardTitle className="text-lg font-bold mt-4 group-hover:text-fluxion-cobalt transition-colors">{section.title}</CardTitle>
                <CardDescription className="text-slate-500 line-clamp-2">{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {section.specialized ? "Éditeur spécialisé" : "Éditeur texte"}
                </div>
                <div className="flex items-center text-xs font-bold text-fluxion-cobalt opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  Modifier
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
