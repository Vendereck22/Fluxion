"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const CONTENT_PATH = path.join(process.cwd(), "constants", "site-content.json");

export async function updateContent(section: string, data: Record<string, unknown>) {
  try {
    // 1. Read the existing content
    const fileContent = await fs.readFile(CONTENT_PATH, "utf-8");
    const content = JSON.parse(fileContent) as Record<string, unknown>;

    // 2. Update the specific section
    const currentSection =
      (content[section] as Record<string, unknown> | undefined) ?? {};
    content[section] = { ...currentSection, ...data };

    // 3. Write back to the file
    await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");

    // 4. Revalidate paths to reflect changes
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/content");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update content:", error);
    return { success: false, error: "Erreur lors de la sauvegarde du contenu." };
  }
}
