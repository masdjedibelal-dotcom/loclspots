"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  onUploadComplete?: (url: string) => void;
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

  // Preview aktualisieren, wenn currentAvatarUrl sich ändert (z.B. nach Refresh)
  useEffect(() => {
    setPreview(currentAvatarUrl ?? null);
  }, [currentAvatarUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Nur Bilder erlaubt");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Maximale Dateigröße: 5 MB");
      return;
    }

    setError(null);
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const compressed = await compressImage(file, 400);

      const filePath = `${userId}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressed, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      await supabase
        .from("profiles")
        .upsert({
          id: userId,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        });

      URL.revokeObjectURL(objectUrl);
      setPreview(publicUrl);
      onUploadComplete?.(publicUrl);
    } catch (err) {
      URL.revokeObjectURL(objectUrl);
      setPreview(currentAvatarUrl ?? null);
      setError("Upload fehlgeschlagen. Bitte nochmal versuchen.");
      console.error(err);
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
        accept="image/*"
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
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

async function compressImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(
        maxSize / img.width,
        maxSize / img.height,
        1
      );
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.85);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}
