"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("Alle");
  const [loginModalCollabId, setLoginModalCollabId] = useState<string | null>(null);

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

  const handleCardClick = (e: React.MouseEvent, collabId: string) => {
    if (isLoggedIn) {
      router.push(`/collabs/${collabId}`);
      return;
    }
    e.preventDefault();
    setLoginModalCollabId(collabId);
  };

  const redirectUrl = loginModalCollabId
    ? `/collabs/${loginModalCollabId}`
    : "/collabs";
  const loginHref = `/login?redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-12">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
              Entdecke München
            </h2>
            <p className="mt-2 text-[18px] font-light leading-relaxed text-muted">
              Kuratierte Orte und Tipps von Locals
            </p>
          </div>
          <Link
            href={isLoggedIn ? "/collabs" : "/register"}
            className="shrink-0 text-[15px] font-medium text-sage transition-colors hover:text-forest"
          >
            Alle anzeigen →
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
            className="scrollbar-hide flex gap-4 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth snap-x snap-mandatory md:px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredCollabs.length === 0 ? (
              <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-sage/30 bg-white/50 py-12 text-muted">
                Keine Collabs in dieser Kategorie
              </div>
            ) : (
              filteredCollabs.map((collab) => (
                <a
                  key={collab.id}
                  href={isLoggedIn ? `/collabs/${collab.id}` : "#"}
                  onClick={(e) => handleCardClick(e, collab.id)}
                  className={cn(
                    "group flex h-[200px] w-[280px] shrink-0 snap-center flex-col overflow-hidden rounded-xl border border-sage/12 bg-white",
                    "transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-forest/10",
                    "md:w-[280px]"
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
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Login-Modal */}
      {loginModalCollabId && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setLoginModalCollabId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="login-modal-title"
              className="font-serif text-lg font-bold text-forest"
            >
              Melde dich an
            </h3>
            <p className="mt-2 text-[14px] text-muted">
              Um Collabs zu entdecken und deine eigenen Listen zu erstellen,
              melde dich bitte an oder registriere dich.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={loginHref}
                className="rounded-full bg-forest py-3 text-center text-[15px] font-semibold text-white transition-colors hover:bg-peach"
              >
                Einloggen
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
                className="rounded-full border-2 border-sage py-3 text-center text-[15px] font-medium text-sage transition-colors hover:bg-sage hover:text-white"
              >
                Registrieren
              </Link>
              <button
                type="button"
                onClick={() => setLoginModalCollabId(null)}
                className="text-[14px] text-muted hover:text-forest"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
