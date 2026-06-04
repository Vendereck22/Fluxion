"use server";

import fs from "fs/promises";
import path from "path";
import { getCurrentUser, verifySession } from "@/app/actions/auth";
import { logAuditEvent } from "@/app/actions/audit";
import { prisma } from "@/lib/prisma";
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} from "@/lib/server/cloudinary";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
};

function hasUnsafeSvgContent(svg: string) {
  return /<script[\s>]/i.test(svg) || /\son\w+=/i.test(svg) || /javascript:/i.test(svg);
}

async function recordMediaAsset(input: {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}) {
  const currentUser = await getCurrentUser();
  const uploadedById =
    currentUser?.id && currentUser.id !== "env-super-admin"
      ? currentUser.id
      : undefined;

  await prisma.mediaAsset.upsert({
    where: { url: input.url },
    create: {
      url: input.url,
      filename: input.filename,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      width: input.width,
      height: input.height,
      uploadedById,
    },
    update: {
      filename: input.filename,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      width: input.width,
      height: input.height,
      uploadedById,
    },
  });

  await logAuditEvent(
    "MEDIA_UPLOAD",
    `Upload média: ${input.filename}`,
    `URL: ${input.url}, Type: ${input.mimeType}, Taille: ${input.sizeBytes} octets`
  );
}

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

    if (mappedExt === ".svg") {
      const svg = buffer.toString("utf-8");
      if (!svg.trim().startsWith("<svg") || hasUnsafeSvgContent(svg)) {
        return { success: false, error: "Le fichier SVG contient du code non autorisé." };
      }
    }

    const fileExt = mappedExt;
    const baseName = path.basename(file.name, fileExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 50);

    if (isCloudinaryConfigured()) {
      const result = await uploadBufferToCloudinary(buffer, {
        folder: "fluxion/admin",
        publicId: `${Date.now()}-${baseName}`,
        resourceType: "image",
      });

      await recordMediaAsset({
        url: result.secure_url,
        filename: `${result.public_id}.${result.format ?? fileExt.replace(".", "")}`,
        mimeType: file.type,
        sizeBytes: file.size,
        width: result.width,
        height: result.height,
      });

      return {
        success: true,
        url: result.secure_url,
      };
    }


    const uploadDir = path.join(process.cwd(), "public", "uploads");


    await fs.mkdir(uploadDir, { recursive: true });


    const filename = `${Date.now()}-${baseName}${fileExt}`;
    const filePath = path.join(uploadDir, filename);


    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    await recordMediaAsset({
      url: publicUrl,
      filename,
      mimeType: file.type,
      sizeBytes: file.size,
    });

    return {
      success: true,
      url: publicUrl
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
