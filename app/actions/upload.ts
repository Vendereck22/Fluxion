"use server";

import fs from "fs/promises";
import path from "path";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Aucun fichier fourni." };
    }

    // Basic validation: ensure it's an image
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Le fichier doit être une image." };
    }

    // Limit size to 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { success: false, error: "L'image ne doit pas dépasser 5 Mo." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Path setup: public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate safe, timestamped filename
    const fileExt = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, fileExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 50); // limit length
      
    const filename = `${Date.now()}-${baseName}${fileExt}`;
    const filePath = path.join(uploadDir, filename);

    // Save image to disk
    await fs.writeFile(filePath, buffer);

    // Return static URL served by Next.js
    return { 
      success: true, 
      url: `/uploads/${filename}` 
    };
  } catch (error) {
    console.error("Failed to upload image:", error);
    return { success: false, error: "Une erreur s'est produite lors de l'enregistrement de l'image." };
  }
}
