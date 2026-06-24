import { MAX_GALLERY_FILE_BYTES } from "@/lib/constants";

export const GALLERY_IMAGE_ACCEPT = "image/gif,image/jpeg,image/png,image/webp";

const ALLOWED_MIME_TYPES = new Set([
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const MIME_EXTENSION: Record<string, string> = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function hasAllowedExtension(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext === "gif" || ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp";
}

export function validateGalleryFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type) && !hasAllowedExtension(file.name)) {
    return "Use a GIF, PNG, JPG, or WebP from Heartopia.";
  }

  if (file.size > MAX_GALLERY_FILE_BYTES) {
    return "File must be 8 MB or smaller.";
  }

  return null;
}

export function parseGalleryDataUrl(dataUrl: string): {
  mime: string;
  extension: string;
  buffer: Buffer;
} | null {
  const match = dataUrl.match(/^data:(image\/[a-z0-9+.-]+);base64,(.+)$/i);
  if (!match) return null;

  const mime = match[1].toLowerCase();
  const extension = MIME_EXTENSION[mime];
  if (!extension) return null;

  return {
    mime,
    extension,
    buffer: Buffer.from(match[2], "base64"),
  };
}
