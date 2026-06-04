import { v2 as cloudinary } from "cloudinary";

const cloudinaryUrl = process.env.CLOUDINARY_URL;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudinaryUrl) {
  cloudinary.config({ secure: true });
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured() {
  return Boolean(cloudinaryUrl || (cloudName && apiKey && apiSecret));
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: { folder?: string; publicId?: string; resourceType?: "image" | "raw" | "auto" } = {}
) {
  return new Promise<{ secure_url: string; public_id: string; width?: number; height?: number; format?: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder ?? "fluxion/uploads",
          public_id: options.publicId,
          resource_type: options.resourceType ?? "image",
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary n'a pas retourne de resultat."));
            return;
          }

          resolve(result);
        }
      );

      stream.end(buffer);
    }
  );
}
