import ConfigManager from "./ConfigManager";
import { Sliders } from "lucide-react";
import { getContentSection } from "@/app/actions/content";
import { siteContent } from "@/constants/site-content";

export const revalidate = 0;

type FooterData = typeof siteContent.footer;
type SocialData = typeof siteContent.social;

function mergeRecord<T extends Record<string, unknown>>(fallback: T, value: unknown): T {
  return value && typeof value === "object" && !Array.isArray(value)
    ? ({ ...fallback, ...(value as Record<string, unknown>) } as T)
    : fallback;
}

export default async function ConfigPage() {
  const [footerResult, socialResult] = await Promise.all([
    getContentSection("footer"),
    getContentSection("social"),
  ]);

  const footerData = mergeRecord<FooterData>(
    siteContent.footer,
    footerResult.success ? footerResult.data : null
  );
  const socialData = mergeRecord<SocialData>(
    siteContent.social,
    socialResult.success ? socialResult.data : null
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="text-fluxion-pink-neon" size={20} />
            <h1 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              CONFIGURATION SYSTÈME
            </h1>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 font-inter">
            Gestion globale des coordonnées de contact, réseaux sociaux, et options de pied de page.
          </p>
        </div>
      </div>


      <ConfigManager initialFooter={footerData} initialSocial={socialData} />
    </div>
  );
}
