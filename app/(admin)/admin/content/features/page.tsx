"use client";

import { useState } from "react";
import { ChevronLeft, Save, RotateCcw, Layers, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteContent } from "@/constants/site-content";
import { updateContent } from "@/app/actions/content";

export default function FeaturesEditorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    badge: siteContent.features.badge,
    title: siteContent.features.title,
    more: siteContent.features.more,
    items: [...siteContent.features.items],
  });

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveStatus("idle");
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    const result = await updateContent("features", formData);
    setIsSaving(false);
    if (result.success) {
      setSaveStatus("success");
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
              <Layers size={18} className="text-fluxion-mauve" />
              <h1 className="text-2xl font-bold text-slate-900 font-heading">Éditeur : Piliers (Services)</h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">Gérez les trois piliers fondamentaux de votre expertise.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200" disabled={isSaving}>
            <RotateCcw size={16} />
            Réinitialiser
          </Button>
          <Button 
            className={`gap-2 border-none shadow-lg transition-all duration-300 ${
              saveStatus === "success" ? "bg-green-600" : saveStatus === "error" ? "bg-red-600" : "bg-fluxion-gradient"
            }`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Sauvegarde..." : saveStatus === "success" ? "Enregistré !" : "Enregistrer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">En-tête de section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Input name="badge" value={formData.badge} onChange={handleBaseChange} />
                </div>
                <div className="space-y-2">
                  <Label>Texte "En savoir plus"</Label>
                  <Input name="more" value={formData.more} onChange={handleBaseChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Titre Principal</Label>
                <Input name="title" value={formData.title} onChange={handleBaseChange} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Les 3 Piliers</h3>
            {formData.items.map((item, index) => (
              <Card key={index} className="border-slate-200 shadow-sm hover:border-fluxion-mauve/30 transition-colors">
                <CardHeader className="py-4 bg-slate-50/50">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    Pilier #{index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Titre du pilier</Label>
                    <Input 
                      value={item.title} 
                      onChange={(e) => handleItemChange(index, "title", e.target.value)} 
                      className="font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={item.description} 
                      onChange={(e) => handleItemChange(index, "description", e.target.value)} 
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Prévisualisation</h3>
            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 min-h-[500px]">
              <div className="text-center space-y-2 mb-8">
                <span className="text-[10px] font-bold text-fluxion-mauve uppercase tracking-[0.2em]">
                  {formData.badge}
                </span>
                <h4 className="text-lg font-bold text-slate-900 leading-tight">
                  {formData.title}
                </h4>
              </div>
              
              <div className="space-y-4">
                {formData.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                    <h5 className="text-sm font-bold text-slate-900">{item.title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6 bg-slate-900 text-white text-xs font-bold py-5">
                {formData.more}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
