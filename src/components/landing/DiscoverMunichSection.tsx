"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicCollab } from "@/lib/supabase";

const FILTER_CATEGORIES = [
  "Alle",
  "Essen & Trinken",
  "Outdoor",
  "Kultur",
  "Sport",
  "After Work",
  "Sonstiges",
] as const;

/** Gleiche Logik wie CollabCard CATEGORY_COLORS, als Gradient */
const CATEGORY_GRADIENTS: Record<string, string> = {
  Kulinarik: "from-peach/50 to-peach/10",
  Kochen: "from-peach/50 to-peach/10",
  Genuss: "from-peach/40 to-peach/5",
  Essen: "from-peach/50 to-peach/10",
  Trinken: "from-peach/40 to-peach/10",
  Kultur: "from-sage/40 to-sage/10",
  Outdoor: "from-mint/40 to-mint/10",
  Sport: "from-sky-300/50 to-sky-200/20",
  Fitness: "from-sky-300/50 to-sky-200/20",
  Natur: "from-mint/40 to-mint/10",
  Brettspiele: "from-warm to-warm/60",
  Sonstiges: "from-cream to-warm/30",
  default: "from-warm to-sage/20",
};

function getCategoryGradient(category: string | null): string {
  if (!category) return CATEGORY_GRADIENTS.default;
  for (const [key, value] of Object.entries(CATEGORY_GRADIENTS)) {
    if (key !== "default" && category.includes(key)) return value;
  }
  return CATEGORY_GRADIENTS.default;
}

interface DiscoverMunichSectionProps {
  collabs: PublicCollab[];
}

export function DiscoverMunichSection({ collabs }: DiscoverMunichSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("Alle");

  const filteredCollabs =
    activeFilter === "Alle"
      ? collabs
      : collabs.filter(
          (c) =>
            c.category === activeFilter || c.category?.includes(activeFilter)
        );

  const scrollCarousel = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = 296; // ~280px + gap
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };


  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-12">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
              Entdecke München — kuratierte Orte von Locals
            </h2>
            <p className="mt-2 text-[18px] font-light leading-relaxed text-muted">
              Collabs sind Listen zu Themen — von Community-Mitgliedern erstellt, für alle sichtbar. Die besten Restaurants, Bars, Biergärten, Kulturorte und Geheimtipps in München — direkt verknüpft mit dem passenden Chatroom.
            </p>
          </div>
          <Link
            href="/collabs"
            className="shrink-0 text-[15px] font-medium text-forest transition-colors hover:text-forest"
          >
            Alle Collabs entdecken →
          </Link>
        </div>

        {/* Filter Chips */}
        <div className="mb-8 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide">
          <div className="flex gap-2 whitespace-nowrap">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
                  activeFilter === cat
                    ? "bg-sage text-white"
                    : "border-2 border-sage/40 text-sage hover:border-sage hover:text-forest"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel mit Scroll-Buttons (Desktop) */}
        <div className="relative">
          {/* Scroll Buttons - nur Desktop */}
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg ring-1 ring-sage/20 transition hover:bg-cream md:block"
            aria-label="Nach links scrollen"
          >
            <ChevronLeft className="h-5 w-5 text-forest" />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg ring-1 ring-sage/20 transition hover:bg-cream md:block"
            aria-label="Nach rechts scrollen"
          >
            <ChevronRight className="h-5 w-5 text-forest" />
          </button>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="-mx-4 flex gap-4 overflow-x-auto overflow-y-hidden px-4 pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory md:mx-0 md:px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredCollabs.length === 0 ? (
              <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-sage/30 bg-white/50 py-12 text-muted">
                Keine Collabs in dieser Kategorie
              </div>
            ) : (
              filteredCollabs.map((collab) => (
                <Link
                  key={collab.id}
                  href={`/collabs/${collab.id}`}
                  className={cn(
                    "group flex h-[200px] w-[80vw] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-sage/12 bg-white",
                    "transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-forest/10",
                    "sm:w-72 md:w-[280px]"
                  )}
                >
                  {/* Gradient + Emoji + Kategorie-Badge */}
                  <div
                    className={cn(
                      "relative flex h-[110px] flex-shrink-0 flex-col items-center justify-center bg-gradient-to-br",
                      getCategoryGradient(collab.category)
                    )}
                  >
                    {collab.category && (
                      <span className="absolute left-2.5 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-forest shadow-sm">
                        {collab.category}
                      </span>
                    )}
                    <span className="text-4xl" role="img" aria-hidden>
                      {collab.cover_emoji ?? "📋"}
                    </span>
                  </div>

                  {/* Titel, Beschreibung, Likes */}
                  <div className="flex min-h-0 flex-1 flex-col gap-0.5 border-t border-sage/10 p-3">
                    <h3 className="line-clamp-2 text-[14px] font-semibold leading-tight text-forest group-hover:text-sage">
                      {collab.title}
                    </h3>
                    {collab.description && (
                      <p className="line-clamp-2 min-h-0 flex-1 text-[12px] leading-snug text-muted">
                        {collab.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-1.5 text-[12px] text-sage">
                      <Heart className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span>{collab.likes_count ?? 0}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
