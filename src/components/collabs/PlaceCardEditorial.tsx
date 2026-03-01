"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, ExternalLink, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { CollabItem } from "@/lib/types";
import type { Place } from "@/lib/types";

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Kochen & Genuss": "from-amber-100 to-orange-50",
  "Sport & Fitness": "from-emerald-100 to-green-50",
  "Outdoor & Natur": "from-teal-100 to-cyan-50",
  "Kultur & Stadtleben": "from-violet-100 to-purple-50",
  "Tanzen & Bewegung": "from-rose-100 to-pink-50",
  default: "from-sage/20 to-mint/10",
};

interface PlaceCardEditorialProps {
  item: CollabItem & { place?: Place };
  index: number;
  reverse?: boolean;
}

function getMapsUrl(item: CollabItem & { place?: Place }): string | null {
  const p = item.place;
  if (p?.lat && p?.lng) {
    return `https://www.google.com/maps?q=${p.lat},${p.lng}`;
  }
  if (p?.place_url) return p.place_url;
  const row = item as Record<string, unknown>;
  if (row.maps_url) return row.maps_url as string;
  return null;
}

function getPlaceName(item: CollabItem & { place?: Place }): string {
  return item.place?.name ?? (item as Record<string, unknown>).name ?? "Ort";
}

function getPlaceCategory(item: CollabItem & { place?: Place }): string | null {
  return item.place?.category ?? null;
}

function getPlacePrice(item: CollabItem & { place?: Place }): string | null {
  return item.place?.price ?? null;
}

function getPlaceRating(item: CollabItem & { place?: Place }): string | null {
  return item.place?.rating ?? null;
}

function getImgUrl(item: CollabItem & { place?: Place }): string | null {
  return item.place?.img_url ?? null;
}

function getAddress(item: CollabItem & { place?: Place }): string | null {
  return item.place?.address ?? null;
}

function getWebsite(item: CollabItem & { place?: Place }): string | null {
  return item.place?.website ?? null;
}

function getInstagram(item: CollabItem & { place?: Place }): string | null {
  return item.place?.instagram_url ?? null;
}

export function PlaceCardEditorial({
  item,
  index,
  reverse = false,
}: PlaceCardEditorialProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const name = getPlaceName(item);
  const imgUrl = getImgUrl(item);
  const category = getPlaceCategory(item);
  const price = getPlacePrice(item);
  const rating = getPlaceRating(item);
  const address = getAddress(item);
  const website = getWebsite(item);
  const instagram = getInstagram(item);
  const mapsUrl = getMapsUrl(item);
  const categoryKey = category ?? "default";
  const gradient =
    CATEGORY_GRADIENTS[categoryKey] ?? CATEGORY_GRADIENTS.default;

  const mediaBlock = imgUrl ? (
    <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-md">
      <img
        src={imgUrl}
        alt={`${name} — ${category ?? "Ort"} in München`}
        className="h-full w-full object-cover"
      />
    </div>
  ) : (
    <div
      className={cn(
        "flex aspect-[16/9] items-center justify-center rounded-xl bg-gradient-to-br shadow-md",
        gradient
      )}
    >
      <span className="text-5xl" role="img" aria-hidden>
        {category?.includes("Essen") || category?.includes("Genuss")
          ? "🍽️"
          : category?.includes("Sport")
            ? "🏃"
            : "📍"}
      </span>
    </div>
  );

  const contentBlock = (
    <div className="flex flex-1 flex-col">
      <span className="mb-2 block font-serif text-4xl font-bold text-forest/20">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className="font-serif text-2xl font-bold text-forest sm:text-3xl">
        {name}
      </h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {category && (
          <Badge variant="green">{category}</Badge>
        )}
        {price && <Badge variant="muted">{price}</Badge>}
        {rating && (
          <span className="text-sm text-sage">★ {rating}</span>
        )}
      </div>
      {item.description && (
        <p className="mt-4 leading-relaxed text-text">{item.description}</p>
      )}
      {address && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-4 w-4 shrink-0" />
          {address}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {website && (
          <a
            href={website.startsWith("http") ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-sage/30 px-3 py-1.5 text-sm font-medium text-forest transition-colors hover:bg-sage/10"
          >
            Website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-sage/30 px-3 py-1.5 text-sm font-medium text-forest transition-colors hover:bg-sage/10"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        )}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-sage/30 px-3 py-1.5 text-sm font-medium text-forest transition-colors hover:bg-sage/10"
          >
            <MapPin className="h-3.5 w-3.5" /> Google Maps
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-6 transition-all duration-700 md:flex-row md:items-center md:gap-12",
        reverse && "md:flex-row-reverse",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className={cn("w-full md:w-[45%]", reverse && "md:order-2")}>
        {mediaBlock}
      </div>
      <div className={cn("w-full md:w-[55%]", reverse && "md:order-1")}>
        {contentBlock}
      </div>
    </div>
  );
}
