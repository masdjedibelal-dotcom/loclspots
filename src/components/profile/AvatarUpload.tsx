"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onUploadComplete?: (url: string) => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

async function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");

      // Seitenverhältnis beibehalten, auf max Größe skalieren
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

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

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  onUploadComplete,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    setPreview(currentAvatarUrl ?? null);
  }, [currentAvatarUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // 1. Format prüfen und konvertieren (HEIC → JPEG)
      const isHeic =
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif");

      let imageFile: File = file;

      if (isHeic) {
        try {
          const heic2any = (await import("heic2any")).default;
          const result = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.85,
          });
          const convertedBlob = Array.isArray(result) ? result[0]! : result;
          imageFile = new File([convertedBlob], "avatar.jpg", { type: "image/jpeg" });
        } catch {
          setError("Bitte wähle ein JPEG oder PNG Bild");
          setUploading(false);
          return;
        }
      }

      // 2. Dateigröße prüfen (vor Komprimierung)
      if (imageFile.size > MAX_SIZE) {
        setError("Bild ist zu groß (max. 10 MB)");
        setUploading(false);
        return;
      }

      if (!imageFile.type.startsWith("image/")) {
        setError("Nur Bilder erlaubt.");
        setUploading(false);
        return;
      }

      // 3. Via Canvas komprimieren + auf 400x400 skalieren
      const compressed = await compressImage(imageFile, 400, 400, 0.85);

      // 4. Upload zu Supabase
      const fileName = `${userId}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressed, {
          contentType: "image/jpeg",
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      // 5. URL speichern
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      setPreview(publicUrl);
      onUploadComplete?.(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload fehlgeschlagen. Bitte versuche es erneut.");
      setPreview(currentAvatarUrl ?? null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 ring-2 ring-forest/20 transition-all hover:ring-forest/60"
        disabled={uploading}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profilbild"
            fill
            className="object-cover"
            unoptimized
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-gray-400">
            👤
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
          <span className="text-xs font-medium text-white">
            {uploading ? "Lädt..." : "Ändern"}
          </span>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-sm font-medium text-forest hover:underline disabled:opacity-70"
        disabled={uploading}
      >
        {uploading ? "Wird hochgeladen..." : "Profilbild ändern"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
