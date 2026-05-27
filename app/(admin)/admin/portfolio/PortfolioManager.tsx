"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { updateContent } from "@/app/actions/content";

interface PartnersData {
  badge: string;
  names: string[];
}

interface PortfolioManagerProps {
  initialData: PartnersData;
}

export default function PortfolioManager({ initialData }: PortfolioManagerProps) {
  const [data, setData] = useState<PartnersData>(initialData);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleBadgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, badge: e.target.value }));
    setStatus("idle");
  };

  const handlePartnerNameChange = (index: number, val: string) => {
    const updatedNames = [...data.names];
    updatedNames[index] = val;
    setData((prev) => ({ ...prev, names: updatedNames }));
    setStatus("idle");
  };

  const handleRemovePartner = (index: number) => {
    const updatedNames = data.names.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, names: updatedNames }));
    setStatus("idle");
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;
    
    setData((prev) => ({
      ...prev,
      names: [...prev.names, newPartnerName.trim()]
    }));
    setNewPartnerName("");
    setStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const res = await updateContent("partners", data);
      if (res.success) {
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
      
      {/* Action Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
            Gestion du Portfolio & Partenaires
          </h4>
          <p className="text-[10px] text-slate-500 font-inter mt-0.5">
            Configurez la liste des entreprises qui ont fait confiance à l'agence.
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
                Publier le Portfolio
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editing Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Badge block */}
          <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-100 pb-3">
              Section Header
            </h3>
            
            <div className="space-y-1.5 text-xs font-inter">
              <label className="text-slate-500 text-[10px] uppercase font-bold">Texte d'accroche / Badge</label>
              <input
                value={data.badge}
                onChange={handleBadgeChange}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
              />
            </div>
          </div>

          {/* Add Partner Form */}
          <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-100 pb-3">
              Ajouter un partenaire
            </h3>
            
            <form onSubmit={handleAddPartner} className="flex gap-3 text-xs font-inter">
              <input
                placeholder="Ex: TECH_RDC ou GOOGLE"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="flex-1 h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-1"
              >
                <Plus size={12} />
                Ajouter
              </button>
            </form>
          </div>

          {/* Partners list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Liste des entreprises ({data.names.length})</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.names.map((name, index) => (
                <div key={index} className="border border-slate-200 rounded-xl bg-slate-50 p-4 flex items-center justify-between gap-4 shadow-sm">
                  <input
                    value={name}
                    onChange={(e) => handlePartnerNameChange(index, e.target.value)}
                    className="flex-1 bg-transparent text-xs font-bold text-slate-900 focus:border-b focus:border-fluxion-pink-neon focus:outline-none h-7"
                  />
                  <button
                    onClick={() => handleRemovePartner(index)}
                    className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 hover:border-red-200 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Prévisualisation du Site</h3>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading leading-tight">
                {data.badge || "Ils propulsent leur vision avec nous"}
              </h4>
            </div>

            {/* List logos */}
            <div className="flex flex-wrap items-center justify-center gap-6 p-4">
              {data.names.map((name, idx) => (
                <span 
                  key={idx} 
                  className="font-heading font-black text-sm tracking-[0.15em] text-slate-400 hover:text-slate-900 transition-colors duration-300"
                >
                  {name}
                </span>
              ))}
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[10px] text-slate-500 leading-relaxed font-inter">
              💡 Les partenaires s'affichent sous forme de logo textuel élégant dans la section "Partenaires" de votre site web. Le format tout en capitales est recommandé pour un rendu uniforme.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
