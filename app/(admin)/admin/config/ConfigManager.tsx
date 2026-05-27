"use client";

import { useState } from "react";
import { Save, MapPin, Mail, Globe, MessageCircle, Code } from "lucide-react";
import { updateContent } from "@/app/actions/content";

interface FooterData {
  socialBadge: string;
  location: string;
  email: string;
  privacy: string;
  terms: string;
}

interface SocialData {
  badge: string;
  platforms: {
    linkedin: string;
    instagram: string;
    twitter: string;
  };
}

interface ConfigManagerProps {
  initialFooter: FooterData;
  initialSocial: SocialData;
}

export default function ConfigManager({ initialFooter, initialSocial }: ConfigManagerProps) {
  const [footerData, setFooterData] = useState<FooterData>(initialFooter);
  const [socialData, setSocialData] = useState<SocialData>(initialSocial);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFooterChange = (field: keyof FooterData, value: string) => {
    setFooterData({ ...footerData, [field]: value });
    setStatus("idle");
  };

  const handleSocialPlatformChange = (field: keyof SocialData["platforms"], value: string) => {
    setSocialData({
      ...socialData,
      platforms: { ...socialData.platforms, [field]: value }
    });
    setStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const resFooter = await updateContent("footer", footerData);
      const resSocial = await updateContent("social", socialData);

      if (resFooter.success && resSocial.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
            Configuration globale
          </h4>
          <p className="text-[10px] text-slate-500 font-inter mt-0.5">
            Mettez à jour les coordonnées et les réseaux sociaux de l'agence.
          </p>
        </div>
        <div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`h-10 px-6 rounded-lg text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              status === "success"
                ? "bg-emerald-600 text-white"
                : status === "error"
                ? "bg-red-600 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white shadow-md"
            }`}
          >
            {isSaving ? (
              <>
                <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sauvegarde...
              </>
            ) : status === "success" ? (
              "Modifications publiées !"
            ) : (
              <>
                <Save size={14} />
                Enregistrer la configuration
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


        <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-100 pb-3">
            Coordonnées (Pied de page)
          </h3>

          <div className="space-y-4 text-xs font-inter pt-2">
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                <MapPin size={12} /> Localisation
              </label>
              <input
                value={footerData.location}
                onChange={(e) => handleFooterChange("location", e.target.value)}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                <Mail size={12} /> Email de contact
              </label>
              <input
                value={footerData.email}
                onChange={(e) => handleFooterChange("email", e.target.value)}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
              />
            </div>
          </div>
        </div>


        <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-4 shadow-sm h-fit">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-100 pb-3">
            Réseaux Sociaux
          </h3>

          <div className="space-y-4 text-xs font-inter pt-2">
            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                <Globe size={12} /> LinkedIn
              </label>
              <input
                value={socialData.platforms.linkedin}
                onChange={(e) => handleSocialPlatformChange("linkedin", e.target.value)}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                <MessageCircle size={12} /> Twitter / X
              </label>
              <input
                value={socialData.platforms.twitter}
                onChange={(e) => handleSocialPlatformChange("twitter", e.target.value)}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                <Code size={12} /> Instagram
              </label>
              <input
                value={socialData.platforms.instagram}
                onChange={(e) => handleSocialPlatformChange("instagram", e.target.value)}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}