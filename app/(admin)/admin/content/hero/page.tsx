"use client";

import { useState } from "react";
import { ChevronLeft, Save, RotateCcw, LayoutPanelTop } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteContent } from "@/constants/site-content";
import { updateContent } from "@/app/actions/content";

export default function HeroEditorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    badge: siteContent.hero.badge,
    title: siteContent.hero.title,
    description: siteContent.hero.description,
    cta: siteContent.hero.cta,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    
    const result = await updateContent("hero", formData);
    
    setIsSaving(false);
    if (result.success) {
      setSaveStatus("success");
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <LayoutPanelTop size={18} className="text-fluxion-rose" />
              <h1 className="text-2xl font-bold text-slate-900 font-heading">Éditeur : Section Hero</h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">Modifiez le premier contact visuel de vos visiteurs.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200" disabled={isSaving}>
            <RotateCcw size={16} />
            Réinitialiser
          </Button>
          <Button 
            className={`gap-2 border-none shadow-lg transition-all duration-300 ${
              saveStatus === "success" 
                ? "bg-green-600 shadow-green-600/20" 
                : saveStatus === "error"
                ? "bg-red-600 shadow-red-600/20"
                : "bg-fluxion-gradient shadow-fluxion-cobalt/20"
            }`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sauvegarde...
              </span>
            ) : saveStatus === "success" ? (
              <span className="flex items-center gap-2">
                <Save size={16} />
                Enregistré !
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={16} />
                Enregistrer
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Textes de la section</CardTitle>
              <CardDescription>Ces textes apparaissent en haut de la page d'accueil.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge supérieur</Label>
                <Input 
                  id="badge" 
                  name="badge" 
                  value={formData.badge} 
                  onChange={handleChange}
                  className="border-slate-200 focus:border-fluxion-cobalt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre Principal</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  className="border-slate-200 focus:border-fluxion-cobalt text-lg font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Accroche / Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={4}
                  className="border-slate-200 focus:border-fluxion-cobalt resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta">Texte du bouton (CTA)</Label>
                <Input 
                  id="cta" 
                  name="cta" 
                  value={formData.cta} 
                  onChange={handleChange}
                  className="border-slate-200 focus:border-fluxion-cobalt"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Prévisualisation en direct</h3>
            <Card className="border-slate-200 shadow-xl overflow-hidden bg-slate-900 text-white min-h-[400px] flex items-center justify-center p-12 text-center relative">
              <div className="absolute inset-0 bg-fluxion-gradient opacity-10 blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-6 max-w-md">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-fluxion-rose uppercase tracking-[0.2em] animate-pulse border border-white/10">
                  {formData.badge || "Badge"}
                </span>
                <h2 className="text-4xl font-bold tracking-tight font-heading">
                  {formData.title || "Titre de la section"}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {formData.description || "Description courte pour expliquer la proposition de valeur."}
                </p>
                <Button className="bg-fluxion-gradient text-white border-none px-8 py-6 rounded-xl font-bold text-md shadow-lg shadow-fluxion-rose/20">
                  {formData.cta || "Bouton"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
