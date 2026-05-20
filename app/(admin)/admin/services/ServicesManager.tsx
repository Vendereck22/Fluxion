"use client";

import { useState } from "react";
import { Save, RefreshCw, Briefcase, Eye } from "lucide-react";
import { updateContent } from "@/app/actions/content";

interface ServiceItem {
  title: string;
  description: string;
}

interface ServicesData {
  badge: string;
  title: string;
  more: string;
  items: ServiceItem[];
}

interface ServicesManagerProps {
  initialData: ServicesData;
}

export default function ServicesManager({ initialData }: ServicesManagerProps) {
  const [data, setData] = useState<ServicesData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setStatus("idle");
  };

  const handleItemChange = (index: number, field: keyof ServiceItem, value: string) => {
    const updatedItems = [...data.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setData((prev) => ({ ...prev, items: updatedItems }));
    setStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const res = await updateContent("features", data);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
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
            Édition des offres et services
          </h4>
          <p className="text-[10px] text-slate-500 font-inter mt-0.5">
            Configurez les piliers de services de l'agence (Next.js, UI/UX, Macbook Pro, etc.)
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
                Publier les Offres
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editing form fields */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main header block */}
          <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-100 pb-3">
              En-tête de la section Services
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-inter">
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase font-bold">Badge supérieur</label>
                <input
                  name="badge"
                  value={data.badge}
                  onChange={handleBaseChange}
                  className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase font-bold">Lien d'action (CTA)</label>
                <input
                  name="more"
                  value={data.more}
                  onChange={handleBaseChange}
                  className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-inter">
              <label className="text-slate-500 text-[10px] uppercase font-bold">Titre principal de la section</label>
              <input
                name="title"
                value={data.title}
                onChange={handleBaseChange}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none font-bold"
              />
            </div>
          </div>

          {/* List items */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Piliers d'offres individuels</h3>
            
            {data.items.map((item, index) => (
              <div key={index} className="border border-slate-200 rounded-xl bg-white p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-fluxion-pink-neon uppercase tracking-wider font-inter">
                    Offre #{index + 1}
                  </span>
                </div>
                
                <div className="space-y-3 text-xs font-inter">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Nom du service</label>
                    <input
                      value={item.title}
                      onChange={(e) => handleItemChange(index, "title", e.target.value)}
                      className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none font-semibold"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-slate-200 rounded p-3 text-slate-900 resize-none focus:border-fluxion-pink-neon focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Prévisualisation du Site</h3>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold text-fluxion-pink-neon uppercase tracking-[0.2em] font-inter">
                {data.badge || "NOS PILIERS"}
              </span>
              <h4 className="text-lg font-heading font-black text-slate-900 uppercase tracking-tight mt-1">
                {data.title || "L'excellence gravée dans chaque pixel"}
              </h4>
            </div>

            {/* List preview items */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {data.items.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5 text-left">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.title}</h5>
                  <p className="text-[10px] text-slate-600 leading-relaxed font-inter">{item.description}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full h-11 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold text-[10px] tracking-wider uppercase">
              {data.more || "En savoir plus"}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
