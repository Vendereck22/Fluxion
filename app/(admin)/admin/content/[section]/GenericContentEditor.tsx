"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { updateContent } from "@/app/actions/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type SectionMeta = {
  title: string;
  description: string;
};

function isRecord(value: JsonValue): value is { [key: string]: JsonValue } {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function setAtPath(value: JsonValue, path: Array<string | number>, nextValue: JsonValue): JsonValue {
  if (path.length === 0) return nextValue;

  const [head, ...tail] = path;

  if (Array.isArray(value)) {
    const copy = [...value];
    copy[Number(head)] = setAtPath(copy[Number(head)] ?? "", tail, nextValue);
    return copy;
  }

  if (isRecord(value)) {
    return {
      ...value,
      [String(head)]: setAtPath(value[String(head)] ?? "", tail, nextValue),
    };
  }

  return value;
}

function addArrayItem(value: JsonValue, path: Array<string | number>): JsonValue {
  const target = path.reduce<JsonValue | undefined>((current, key) => {
    if (Array.isArray(current)) return current[Number(key)];
    if (current !== undefined && isRecord(current)) return current[String(key)];
    return undefined;
  }, value);

  const template = Array.isArray(target) && target.length > 0 ? cloneJson(target[0] ?? "") : "";
  const nextArray = Array.isArray(target) ? [...target, template] : [template];
  return setAtPath(value, path, nextArray);
}

function removeArrayItem(value: JsonValue, path: Array<string | number>, index: number): JsonValue {
  const target = path.reduce<JsonValue | undefined>((current, key) => {
    if (Array.isArray(current)) return current[Number(key)];
    if (current !== undefined && isRecord(current)) return current[String(key)];
    return undefined;
  }, value);

  if (!Array.isArray(target)) return value;

  return setAtPath(
    value,
    path,
    target.filter((_, itemIndex) => itemIndex !== index)
  );
}

function labelFromKey(key: string | number) {
  if (typeof key === "number") return `Élément ${key + 1}`;

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function shouldUseTextarea(key: string | number, value: string) {
  const normalized = String(key).toLowerCase();
  return (
    value.length > 80 ||
    normalized.includes("description") ||
    normalized.includes("message") ||
    normalized.includes("answer") ||
    normalized.includes("bio") ||
    normalized.includes("intro")
  );
}

export default function GenericContentEditor({
  section,
  meta,
  initialData,
}: {
  section: string;
  meta: SectionMeta;
  initialData: JsonValue;
}) {
  const [formData, setFormData] = useState<JsonValue>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const updateValue = (path: Array<string | number>, value: JsonValue) => {
    setFormData((prev) => setAtPath(prev, path, value));
    setStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    const result = await updateContent(section, formData);
    setIsSaving(false);
    setStatus(result.success ? "success" : "error");
    if (result.success) {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const renderField = (key: string | number, value: JsonValue, path: Array<string | number>) => {
    if (typeof value === "string") {
      return (
        <div className="space-y-2" key={path.join(".")}>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {labelFromKey(key)}
          </Label>
          {shouldUseTextarea(key, value) ? (
            <Textarea
              value={value}
              onChange={(event) => updateValue(path, event.target.value)}
              rows={4}
              className="resize-none border-slate-200 bg-white text-xs"
            />
          ) : (
            <Input
              value={value}
              onChange={(event) => updateValue(path, event.target.value)}
              className="border-slate-200 bg-white text-xs"
            />
          )}
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div className="space-y-2" key={path.join(".")}>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {labelFromKey(key)}
          </Label>
          <Input
            type="number"
            value={value}
            onChange={(event) => updateValue(path, Number(event.target.value))}
            className="border-slate-200 bg-white text-xs"
          />
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <label key={path.join(".")} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => updateValue(path, event.target.checked)}
          />
          {labelFromKey(key)}
        </label>
      );
    }

    if (Array.isArray(value)) {
      return (
        <Card key={path.join(".")} className="border-slate-200 bg-slate-50">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              {labelFromKey(key)} ({value.length})
            </CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setFormData((prev) => addArrayItem(prev, path));
                setStatus("idle");
              }}
              className="gap-1"
            >
              <Plus size={13} />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {value.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-400">
                Aucun élément pour cette liste.
              </p>
            ) : (
              value.map((item, index) => (
                <div key={`${path.join(".")}-${index}`} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {labelFromKey(index)}
                    </span>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => {
                        setFormData((prev) => removeArrayItem(prev, path, index));
                        setStatus("idle");
                      }}
                      title="Supprimer cet élément"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  {renderField(index, item, [...path, index])}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      );
    }

    if (isRecord(value)) {
      return (
        <Card key={path.join(".")} className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              {labelFromKey(key)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(value).map(([childKey, childValue]) =>
              renderField(childKey, childValue, [...path, childKey])
            )}
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8 pb-20 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-slate-900">
              {meta.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => {
              setFormData(initialData);
              setStatus("idle");
            }}
            className="gap-2 border-slate-200"
          >
            <RotateCcw size={15} />
            Réinitialiser
          </Button>
          <Button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className={`gap-2 text-white ${
              status === "success"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : status === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isSaving ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {isSaving ? "Sauvegarde..." : status === "success" ? "Enregistré" : "Enregistrer"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5">
        {isRecord(formData) ? (
          Object.entries(formData).map(([key, value]) => renderField(key, value, [key]))
        ) : (
          <Card className="border-slate-200 bg-white">
            <CardContent>{renderField(section, formData, [])}</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
