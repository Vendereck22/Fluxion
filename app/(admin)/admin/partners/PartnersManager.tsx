"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  LuImagePlus,
  LuPlus,
  LuRefreshCw,
  LuSave,
  LuTrash2,
} from "react-icons/lu";
import { updateContent } from "@/app/actions/content";
import { uploadImage } from "@/app/actions/upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";

interface PartnerLogo {
  name: string;
  logoSrc: string;
  website?: string;
}

interface PartnersData {
  badge: string;
  names?: string[];
  logos?: PartnerLogo[];
}

interface PartnersManagerProps {
  initialData: PartnersData;
}

const DEFAULT_LOGO = "/images/partners/apple.svg";

function normalizePartners(data: PartnersData): Required<PartnersData> {
  const logos =
    data.logos && data.logos.length > 0
      ? data.logos
      : (data.names ?? []).map((name) => ({
          name,
          logoSrc: "",
          website: "",
        }));

  return {
    badge: data.badge || "Ils propulsent leur vision avec nous",
    names: logos.map((partner) => partner.name),
    logos,
  };
}

export default function PartnersManager({ initialData }: PartnersManagerProps) {
  const [data, setData] = useState<Required<PartnersData>>(
    normalizePartners(initialData)
  );
  const [draft, setDraft] = useState<PartnerLogo>({
    name: "",
    logoSrc: DEFAULT_LOGO,
    website: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | "draft" | null>(null);
  const [partnerIndexToDelete, setPartnerIndexToDelete] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const payload = useMemo(
    () => ({
      badge: data.badge,
      names: data.logos.map((partner) => partner.name),
      logos: data.logos,
    }),
    [data]
  );

  const handleBadgeChange = (value: string) => {
    setData((prev) => ({ ...prev, badge: value }));
    setStatus("idle");
  };

  const handlePartnerChange = (
    index: number,
    field: keyof PartnerLogo,
    value: string
  ) => {
    setData((prev) => {
      const logos = [...prev.logos];
      logos[index] = { ...logos[index], [field]: value };
      return {
        ...prev,
        names: logos.map((partner) => partner.name),
        logos,
      };
    });
    setStatus("idle");
  };

  const handleRemovePartner = () => {
    if (partnerIndexToDelete === null) return;
    setData((prev) => {
      const logos = prev.logos.filter((_, i) => i !== partnerIndexToDelete);
      return {
        ...prev,
        names: logos.map((partner) => partner.name),
        logos,
      };
    });
    setStatus("idle");
    setPartnerIndexToDelete(null);
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.logoSrc.trim()) return;

    setData((prev) => {
      const logos = [
        ...prev.logos,
        {
          name: draft.name.trim(),
          logoSrc: draft.logoSrc.trim(),
          website: draft.website?.trim() ?? "",
        },
      ];
      return {
        ...prev,
        names: logos.map((partner) => partner.name),
        logos,
      };
    });
    setDraft({ name: "", logoSrc: DEFAULT_LOGO, website: "" });
    setStatus("idle");
  };

  const handleUpload = async (file: File, target: number | "draft") => {
    setUploadingIndex(target);
    setStatus("idle");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImage(formData);
      if (!res.success || !res.url) {
        setStatus("error");
        return;
      }

      if (target === "draft") {
        setDraft((prev) => ({ ...prev, logoSrc: res.url ?? "" }));
      } else {
        handlePartnerChange(target, "logoSrc", res.url);
      }
    } catch {
      setStatus("error");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");

    try {
      const res = await updateContent("partners", payload);
      setStatus(res.success ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <Card className="border-slate-200 bg-white">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-heading">
                Gestion des logos partenaires
              </h4>
              <Badge variant="outline" className="text-[10px]">
                {data.logos.length} logos
              </Badge>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              Configurez les logos visibles dans la section clients / partenaires.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={
              status === "success"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : status === "error"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-slate-900 text-white hover:bg-slate-800"
            }
          >
            {isSaving ? (
              <>
                <LuRefreshCw className="animate-spin" />
                Sauvegarde...
              </>
            ) : status === "success" ? (
              "Modifications publiées"
            ) : (
              <>
                <LuSave />
                Publier
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900">
                En-tête de section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="partner-badge" className="text-[10px] uppercase text-slate-500">
                Badge / accroche
              </Label>
              <Input
                id="partner-badge"
                value={data.badge}
                onChange={(e) => handleBadgeChange(e.target.value)}
                className="h-9"
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Ajouter un logo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPartner} className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="space-y-1.5 md:col-span-3">
                  <Label className="text-[10px] uppercase text-slate-500">Nom</Label>
                  <Input
                    placeholder="Apple"
                    value={draft.name}
                    onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-5">
                  <Label className="text-[10px] uppercase text-slate-500">Logo SVG / image</Label>
                  <Input
                    placeholder="/images/partners/apple.svg"
                    value={draft.logoSrc}
                    onChange={(e) => setDraft((prev) => ({ ...prev, logoSrc: e.target.value }))}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-3">
                  <Label className="text-[10px] uppercase text-slate-500">Site web</Label>
                  <Input
                    placeholder="https://apple.com"
                    value={draft.website}
                    onChange={(e) => setDraft((prev) => ({ ...prev, website: e.target.value }))}
                    className="h-9"
                  />
                </div>
                <div className="flex items-end gap-2 md:col-span-1">
                  <input
                    ref={(node) => {
                      fileInputRefs.current.draft = node;
                    }}
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp,image/gif,image/avif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload(file, "draft");
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    onClick={() => fileInputRefs.current.draft?.click()}
                    disabled={uploadingIndex === "draft"}
                    aria-label="Importer un logo"
                  >
                    {uploadingIndex === "draft" ? (
                      <LuRefreshCw className="animate-spin" />
                    ) : (
                      <LuImagePlus />
                    )}
                  </Button>
                  <Button type="submit" size="icon-lg" aria-label="Ajouter le logo">
                    <LuPlus />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
              Logos partenaires
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {data.logos.map((partner, index) => (
                <Card key={`${partner.name}-${index}`} className="border-slate-200 bg-white">
                  <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[132px_1fr_auto] md:items-center">
                    <div className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                      {partner.logoSrc ? (
                        <Image
                          src={partner.logoSrc}
                          alt={`Logo ${partner.name}`}
                          width={160}
                          height={60}
                          className="max-h-12 w-auto object-contain"
                        />
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Aucun logo
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase text-slate-500">Nom</Label>
                        <Input
                          value={partner.name}
                          onChange={(e) => handlePartnerChange(index, "name", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase text-slate-500">Logo</Label>
                        <Input
                          value={partner.logoSrc}
                          onChange={(e) => handlePartnerChange(index, "logoSrc", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase text-slate-500">Site web</Label>
                        <Input
                          value={partner.website ?? ""}
                          onChange={(e) => handlePartnerChange(index, "website", e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <input
                        ref={(node) => {
                          fileInputRefs.current[String(index)] = node;
                        }}
                        type="file"
                        accept="image/svg+xml,image/png,image/jpeg,image/webp,image/gif,image/avif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleUpload(file, index);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        onClick={() => fileInputRefs.current[String(index)]?.click()}
                        disabled={uploadingIndex === index}
                        aria-label={`Importer le logo ${partner.name}`}
                      >
                        {uploadingIndex === index ? (
                          <LuRefreshCw className="animate-spin" />
                        ) : (
                          <LuImagePlus />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-lg"
                        onClick={() => setPartnerIndexToDelete(index)}
                        aria-label={`Supprimer ${partner.name}`}
                      >
                        <LuTrash2 />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <h3 className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">
            Prévisualisation du site
          </h3>
          <Card className="sticky top-24 border-slate-200 bg-fluxion-blue">
            <CardContent className="space-y-6 p-6">
              <div className="border-b border-white/10 pb-4 text-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-fluxion-rose font-heading">
                  {data.badge || "Ils propulsent leur vision avec nous"}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {data.logos.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-white p-4"
                  >
                    {partner.logoSrc ? (
                      <Image
                        src={partner.logoSrc}
                        alt={`Logo ${partner.name}`}
                        width={180}
                        height={60}
                        className="max-h-10 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xs font-black uppercase text-slate-400">
                        {partner.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-[10px] leading-relaxed text-white/70">
                Les partenaires sont maintenant affichés avec des logos image/SVG.
                Utilisez un fond transparent pour un rendu propre.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={partnerIndexToDelete !== null}
        title="Supprimer ce partenaire ?"
        description={`Le logo ${partnerIndexToDelete !== null ? data.logos[partnerIndexToDelete]?.name : "sélectionné"} sera retiré de la section partenaires. Pensez à publier les modifications pour l'appliquer au site.`}
        onOpenChange={(open) => {
          if (!open) setPartnerIndexToDelete(null);
        }}
        onConfirm={handleRemovePartner}
      />
    </div>
  );
}
