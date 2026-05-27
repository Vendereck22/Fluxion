"use server";

import fs from "fs/promises";
import path from "path";
import { verifySession } from "@/app/actions/auth";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export async function uploadImage(formData: FormData) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) {
      return { success: false, error: "Non autorisé." };
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false, error: "Aucun fichier fourni." };
    }


    const mappedExt = ALLOWED_IMAGE_TYPES[file.type];
    if (!mappedExt) {
      return { success: false, error: "Format d'image non supporté." };
    }


    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { success: false, error: "L'image ne doit pas dépasser 5 Mo." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);


    const uploadDir = path.join(process.cwd(), "public", "uploads");


    await fs.mkdir(uploadDir, { recursive: true });


    const fileExt = mappedExt;
    const baseName = path.basename(file.name, fileExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 50);

    const filename = `${Date.now()}-${baseName}${fileExt}`;
    const filePath = path.join(uploadDir, filename);


    await fs.writeFile(filePath, buffer);


    return {
      success: true,
      url: `/uploads/${filename}`
    };
  } catch (error) {
    console.error("Failed to upload image:", error);
    const code = (error as { code?: unknown } | null)?.code;
    if (code === "EROFS" || code === "EPERM" || code === "EACCES") {
      return {
        success: false,
        error:
          "Upload indisponible sur cet hébergement (filesystem en lecture seule).",
      };
    }
    return { success: false, error: "Une erreur s'est produite lors de l'enregistrement de l'image." };
  }
}