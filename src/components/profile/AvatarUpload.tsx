"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar } from "@/lib/uploadAvatar";

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string | null;
  onSuccess: (url: string) => void;
}

export function AvatarUpload({
  userId,
  currentUrl,
  onSuccess,
}: AvatarUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    setPreview(currentUrl ?? null);
  }, [currentUrl]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);

    try {
      const url = await uploadAvatar(file, userId, supabase);
      URL.revokeObjectURL(blobUrl);

      await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", userId);

      setPreview(url);
      onSuccess(url);
    } catch (err) {
      URL.revokeObjectURL(blobUrl);
      console.error("Upload error:", err);
      setError("Upload fehlgeschlagen. Bitte versuche es erneut.");
      setPreview(currentUrl ?? null);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 transition-opacity hover:opacity-80"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profilbild"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#2D5016]/10 text-3xl text-[#2D5016]">
            👤
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div
              className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"
              aria-hidden
            />
          </div>
        )}

        {!loading && (
          <div className="absolute bottom-0 right-0 rounded-full bg-[#2D5016] p-1.5 shadow-sm">
            <svg
              className="h-3.5 w-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
      </button>

      <p className="text-xs text-gray-400">Tippen um Foto zu ändern</p>

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
