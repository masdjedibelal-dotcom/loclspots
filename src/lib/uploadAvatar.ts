import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * HEIC/HEIF → JPEG konvertieren, auf 400px skalieren, komprimieren und zu Supabase hochladen.
 * Gibt die öffentliche URL mit Cache-Busting zurück.
 */
export async function uploadAvatar(
  file: File,
  userId: string,
  supabase: SupabaseClient
): Promise<string> {
  // 1. HEIC/HEIF → JPEG konvertieren (iPhone Standardformat)
  let processedFile: File = file;
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (isHeic) {
    try {
      const heic2any = (await import("heic2any")).default;
      const result = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      const converted = Array.isArray(result) ? result[0] : result;
      if (!converted) throw new Error("HEIC conversion failed");
      processedFile = new File([converted as Blob], "avatar.jpg", { type: "image/jpeg" });
    } catch {
      throw new Error("Bitte wähle ein JPEG oder PNG Bild");
    }
  }

  // 2. Via Canvas auf 400x400 skalieren + komprimieren
  const compressed = await compressToJpeg(processedFile, 400, 0.85);

  // 3. Upload zu Supabase Storage
  const fileName = `${userId}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, compressed, {
      contentType: "image/jpeg",
      upsert: true,
      cacheControl: "3600",
    });

  if (uploadError) throw uploadError;

  // 4. Public URL zurückgeben (Cache-Busting damit neues Bild sofort erscheint)
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return `${publicUrl}?t=${Date.now()}`;
}

/**
 * Canvas-Komprimierung — funktioniert für alle Formate inkl. HEIC nach Konvertierung.
 * Skaliert auf maxSize ( längste Seite ) bei Beibehaltung des Seitenverhältnisses.
 */
async function compressToJpeg(
  file: File,
  maxSize: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}
