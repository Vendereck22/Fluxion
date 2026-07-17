"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, Plus, Save, Trash2, Upload } from "lucide-react";
import { updateContent } from "@/app/actions/content";
import { uploadImage } from "@/app/actions/upload";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ServiceItem {
  title: string;
  description: string;
  moreLabel?: string;
  imageSrc?: string;
  gallery?: GalleryImage[];
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

type UploadTarget =
  | { type: "main"; index: number }
  | { type: "gallery"; index: number }
  | null;

const emptyService = (): ServiceItem => ({
  title: "",
  description: "",
  moreLabel: "",
  imageSrc: "",
  gallery: [],
});

export default function ServicesManager({ initialData }: ServicesManagerProps) {
  const [data, setData] = useState<ServicesData>({
    ...initialData,
    items: initialData.items.map((item) => ({
      ...item,
      moreLabel: item.moreLabel ?? "",
      imageSrc: item.imageSrc ?? "",
      gallery: item.gallery ?? [],
    })),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploading, setUploading] = useState<UploadTarget>(null);

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

  const handleGalleryAltChange = (serviceIndex: number, imageIndex: number, alt: string) => {
    const updatedItems = [...data.items];
    const gallery = [...(updatedItems[serviceIndex].gallery ?? [])];
    gallery[imageIndex] = { ...gallery[imageIndex], alt };
    updatedItems[serviceIndex] = { ...updatedItems[serviceIndex], gallery };
    setData((prev) => ({ ...prev, items: updatedItems }));
    setStatus("idle");
  };

  const handleRemoveGalleryImage = (serviceIndex: number, imageIndex: number) => {
    const updatedItems = [...data.items];
    updatedItems[serviceIndex] = {
      ...updatedItems[serviceIndex],
      gallery: updatedItems[serviceIndex].gallery?.filter((_, index) => index !== imageIndex) ?? [],
    };
    setData((prev) => ({ ...prev, items: updatedItems }));
    setStatus("idle");
  };

  const handleAddService = () => {
    setData((prev) => ({ ...prev, items: [...prev.items, emptyService()] }));
    setStatus("idle");
  };

  const handleRemoveService = (index: number) => {
    setData((prev) => ({ ...prev, items: prev.items.filter((_, itemIndex) => itemIndex !== index) }));
    setStatus("idle");
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    target: Exclude<UploadTarget, null>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(target);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImage(formData);
      if (!res.success || !res.url) {
        alert(res.error || "Une erreur est survenue pendant l'upload.");
        return;
      }

      const updatedItems = [...data.items];
      const current = updatedItems[target.index];

      if (target.type === "main") {
        updatedItems[target.index] = { ...current, imageSrc: res.url };
      } else {
        const gallery = current.gallery ?? [];
        updatedItems[target.index] = {
          ...current,
          gallery: [
            ...gallery,
            {
              src: res.url,
              alt: `${current.title || "Service"} - image ${gallery.length + 1}`,
            },
          ],
        };
      }

      setData((prev) => ({ ...prev, items: updatedItems }));
      setStatus("idle");
    } catch {
      alert("Une erreur de communication est survenue.");
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const res = await updateContent("features", data);
      setStatus(res.success ? "success" : "error");
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
            Édition des offres et services
          </h4>
          <p className="text-[10px] text-slate-500 font-inter mt-0.5">
            Gérez les textes, images principales et galeries visibles dans la page Nos services.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddService}
            className="h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            Ajouter
          </button>
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
                Publier
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-slate-200 rounded-xl bg-white p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-100 pb-3">
              En-tête de la section Services
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-inter">
              <label className="space-y-1.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Badge supérieur</span>
                <input
                  name="badge"
                  value={data.badge}
                  onChange={handleBaseChange}
                  className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Label d'action par défaut</span>
                <input
                  name="more"
                  value={data.more}
                  onChange={handleBaseChange}
                  className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                />
              </label>
            </div>

            <label className="block space-y-1.5 text-xs font-inter">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Titre principal de la section</span>
              <input
                name="title"
                value={data.title}
                onChange={handleBaseChange}
                className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none font-bold"
              />
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Services individuels
            </h3>

            {data.items.map((item, index) => (
              <div key={index} className="border border-slate-200 rounded-xl bg-white p-6 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-fluxion-pink-neon uppercase tracking-wider font-inter">
                    Service #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Supprimer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-5">
                  <div className="space-y-3 text-xs font-inter">
                    <label className="block space-y-1.5">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Nom du service</span>
                      <input
                        value={item.title}
                        onChange={(e) => handleItemChange(index, "title", e.target.value)}
                        className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none font-semibold"
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Label rose / CTA</span>
                      <input
                        value={item.moreLabel ?? ""}
                        onChange={(e) => handleItemChange(index, "moreLabel", e.target.value)}
                        placeholder={data.more}
                        className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Description</span>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        rows={4}
                        className="w-full bg-white border border-slate-200 rounded p-3 text-slate-900 resize-none focus:border-fluxion-pink-neon focus:outline-none"
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">URL image principale</span>
                      <input
                        value={item.imageSrc ?? ""}
                        onChange={(e) => handleItemChange(index, "imageSrc", e.target.value)}
                        placeholder="/images/services/... ou URL Cloudinary"
                        className="w-full h-9 bg-white border border-slate-200 rounded px-3 text-slate-900 focus:border-fluxion-pink-neon focus:outline-none"
                      />
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div className="relative h-36 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      {item.imageSrc ? (
                        <Image src={item.imageSrc} alt={item.title || "Service"} fill sizes="180px" className="object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-slate-400">
                          <ImagePlus size={28} />
                          <span className="mt-2 text-[10px] font-bold uppercase">Aucune image</span>
                        </div>
                      )}
                    </div>
                    <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100">
                      {uploading?.type === "main" && uploading.index === index ? (
                        <span className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      Uploader
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleFileUpload(event, { type: "main", index })}
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        Galerie du service
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Utilisée notamment par la section Design sous forme de grille.
                      </p>
                    </div>
                    <label className="flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-slate-800">
                      {uploading?.type === "gallery" && uploading.index === index ? (
                        <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <Upload size={13} />
                      )}
                      Ajouter image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleFileUpload(event, { type: "gallery", index })}
                      />
                    </label>
                  </div>

                  {(item.gallery ?? []).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(item.gallery ?? []).map((image, imageIndex) => (
                        <div key={`${image.src}-${imageIndex}`} className="rounded-lg border border-slate-200 bg-white p-2">
                          <div className="relative h-24 overflow-hidden rounded-md bg-slate-100">
                            <Image src={image.src} alt={image.alt || item.title} fill sizes="180px" className="object-cover" />
                          </div>
                          <input
                            value={image.alt}
                            onChange={(e) => handleGalleryAltChange(index, imageIndex, e.target.value)}
                            className="mt-2 h-8 w-full rounded border border-slate-200 px-2 text-[10px] text-slate-700 focus:border-fluxion-pink-neon focus:outline-none"
                            placeholder="Texte alternatif"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index, imageIndex)}
                            className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-red-50 py-2 text-[10px] font-bold uppercase text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={12} />
                            Retirer
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Aucune image dans la galerie
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Prévisualisation du site</h3>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold text-fluxion-pink-neon uppercase tracking-[0.2em] font-inter">
                {data.badge || "NOS PILIERS"}
              </span>
              <h4 className="text-lg font-heading font-black text-slate-900 uppercase tracking-tight mt-1">
                {data.title || "L'excellence gravée dans chaque pixel"}
              </h4>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {data.items.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-left">
                  <div className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                      {item.imageSrc ? (
                        <Image src={item.imageSrc} alt={item.title || "Service"} fill sizes="56px" className="object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.title}</h5>
                      <p className="mt-1 text-[10px] text-fluxion-pink-neon font-bold">{item.moreLabel || data.more}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed font-inter line-clamp-3">{item.description}</p>
                  {(item.gallery ?? []).length > 0 ? (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {(item.gallery ?? []).length} image(s) galerie
                    </p>
                  ) : null}
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
