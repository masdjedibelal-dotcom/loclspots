"use client";

import Link from "next/link";
import type { Collab } from "@/lib/types";

function getCategoryBg(category: string): string {
  const map: Record<string, string> = {
    "Essen & Trinken": "bg-orange-50",
    Kulinarik: "bg-orange-50",
    Kochen: "bg-orange-50",
    Genuss: "bg-orange-50",
    Outdoor: "bg-green-50",
    Natur: "bg-green-50",
    Kultur: "bg-purple-50",
    Sport: "bg-blue-50",
    Fitness: "bg-blue-50",
    "After Work": "bg-yellow-50",
    Sonstiges: "bg-gray-50",
  };
  for (const [key, value] of Object.entries(map)) {
    if (category.includes(key)) return value;
  }
  return "bg-gray-50";
}

function getCategoryBadge(category: string): string {
  const map: Record<string, string> = {
    "Essen & Trinken": "bg-orange-100 text-orange-700",
    Kulinarik: "bg-orange-100 text-orange-700",
    Kochen: "bg-orange-100 text-orange-700",
    Genuss: "bg-orange-100 text-orange-700",
    Outdoor: "bg-green-100 text-green-700",
    Natur: "bg-green-100 text-green-700",
    Kultur: "bg-purple-100 text-purple-700",
    Sport: "bg-blue-100 text-blue-700",
    Fitness: "bg-blue-100 text-blue-700",
    "After Work": "bg-yellow-100 text-yellow-700",
    Sonstiges: "bg-gray-100 text-gray-600",
  };
  for (const [key, value] of Object.entries(map)) {
    if (category.includes(key)) return value;
  }
  return "bg-gray-100 text-gray-600";
}

interface CollabCardProps {
  collab: Collab & { photos?: string[] };
  itemCount: number;
}

export function CollabCard({ collab, itemCount }: CollabCardProps) {
  const photos = collab.photos ?? [];
  const placeCount = itemCount;
  const coverEmoji = collab.cover_emoji ?? "📋";

  return (
    <Link
      href={`/collabs/${collab.id}`}
      className="block overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
    >
      {/* Foto-Collage Header */}
      <div className="relative h-32 overflow-hidden bg-gray-100">
        {photos.length >= 3 ? (
          <div className="grid h-full grid-cols-3 gap-0.5">
            {photos.slice(0, 3).map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
            ))}
          </div>
        ) : photos.length === 2 ? (
          <div className="grid h-full grid-cols-2 gap-0.5">
            {photos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
            ))}
          </div>
        ) : photos.length === 1 ? (
          <img
            src={photos[0]}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center text-4xl ${getCategoryBg(collab.category ?? "")}`}
          >
            {coverEmoji}
          </div>
        )}

        {/* Orte-Badge oben rechts */}
        <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {placeCount} {placeCount === 1 ? "Ort" : "Orte"}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryBadge(collab.category ?? "")}`}
        >
          {collab.category}
        </span>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
          {collab.title}
        </h3>
      </div>
    </Link>
  );
}
