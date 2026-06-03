"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/actions/auth";
import {
  readJsonPreferFallback,
  tmpDataPath,
  writeJsonWithFallback,
} from "@/lib/server/json-store";
import { logAuditEvent } from "@/app/actions/audit";

const CONTENT_PATH = path.join(process.cwd(), "constants", "site-content.json");
const CONTENT_FALLBACK_PATH = tmpDataPath("site-content.json");

const ALLOWED_SECTIONS = new Set([
  "hero",
  "features",
  "partners",
  "footer",
  "social",
  "team",
  "productsPage",
  "projectsPage",
]);

export async function updateContent(section: string, data: unknown) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) {
      return { success: false, error: "Non autorisé." };
    }

    if (!ALLOWED_SECTIONS.has(section)) {
      return { success: false, error: "Section invalide." };
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { success: false, error: "Données invalides pour la mise à jour." };
    }


    const content = await readJsonPreferFallback<Record<string, unknown>>(
      CONTENT_PATH,
      CONTENT_FALLBACK_PATH,
      {}
    );


    const currentSection =
      (content[section] as Record<string, unknown> | undefined) ?? {};
    content[section] = { ...currentSection, ...(data as Record<string, unknown>) };


    const { used } = await writeJsonWithFallback(
      CONTENT_PATH,
      CONTENT_FALLBACK_PATH,
      content
    );


    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/content");

    await logAuditEvent("CMS_UPDATE", `Mise à jour de la section CMS : ${section}`, `Clé de section: ${section}`);

    return { success: true, storage: used };
  } catch (error) {
    console.error("Failed to update content:", error);
    return { success: false, error: "Erreur lors de la sauvegarde du contenu." };
  }
}