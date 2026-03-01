"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Place } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_EMOJI: Record<string, string> = {
  food: "🍽️",
  sight: "🏛️",
  restaurant: "🍴",
  bar: "🍷",
  café: "☕",
  cafe: "☕",
  default: "📍",
};

function getKindEmoji(kind: string): string {
  return KIND_EMOJI[kind?.toLowerCase()] ?? KIND_EMOJI.default;
}

interface PlacePickerProps {
  onSelect: (place: Place) => void;
  onClose: () => void;
  alreadySelected: string[];
}

export function PlacePicker({
  onSelect,
  onClose,
  alreadySelected,
}: PlacePickerProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("");
  const [kinds, setKinds] = useState<string[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchKinds = useCallback(async () => {
    try {
      const res = await fetch("/api/places/kinds");
      if (!res.ok) return;
      const data = await res.json();
      setKinds(data.kinds ?? []);
    } catch {
      setKinds([]);
    }
  }, []);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (kindFilter) params.set("kind", kindFilter);
      const res = await fetch(`/api/places?${params}`);
      if (!res.ok) throw new Error("Laden fehlgeschlagen");
      const data = await res.json();
      setPlaces(data.places ?? []);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, kindFilter]);

  useEffect(() => {
    fetchKinds();
  }, [fetchKinds]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleManualAdd = async () => {
    const url = manualUrl.trim();
    const name = manualName.trim() || "Externer Ort (Google Maps)";
    if (!url) {
      setManualError("Bitte gib eine Google Maps URL ein.");
      return;
    }
    if (!url.includes("maps") && !url.includes("goo.gl")) {
      setManualError("Bitte gib eine gültige Google Maps URL ein.");
      return;
    }
    setManualError(null);
    setManualLoading(true);
    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, place_url: url, kind: "external" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fehler");
      const place = data.place as Place;
      onSelect(place);
      onClose();
    } catch (e) {
      setManualError(e instanceof Error ? e.message : "Fehler beim Hinzufügen.");
    } finally {
      setManualLoading(false);
    }
  };

  const isSelected = (id: string) => alreadySelected.includes(id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="place-picker-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-warm p-4">
          <h2 id="place-picker-title" className="font-semibold text-forest">
            Ort hinzufügen
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-sage transition-colors hover:bg-warm hover:text-forest"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Suchzeile */}
        <div className="flex shrink-0 flex-wrap gap-3 border-b border-warm p-4">
          <Input
            placeholder="Suche nach Name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border-warm"
          />
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="rounded-lg border-2 border-warm bg-cream px-3 py-2.5 text-sm text-forest focus:border-sage focus:outline-none"
          >
            <option value="">Alle Kategorien</option>
            {kinds.map((k) => (
              <option key={k} value={k}>
                {getKindEmoji(k)} {k}
              </option>
            ))}
          </select>
        </div>

        {/* Ergebnisliste */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "360px" }}>
          {loading ? (
            <p className="py-12 text-center text-sage">Lade Orte…</p>
          ) : places.length === 0 ? (
            <p className="py-12 text-center text-sage">Keine Orte gefunden.</p>
          ) : (
            <div className="space-y-1">
              {places.map((place) => {
                const selected = isSelected(place.id);
                return (
                  <div
                    key={place.id}
                    className={cn(
                      "flex items-center gap-4 rounded-lg px-3 py-2.5 transition-colors",
                      selected && "cursor-not-allowed opacity-60",
                      !selected && "hover:bg-cream"
                    )}
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-warm">
                      {place.img_url ? (
                        <img
                          src={place.img_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-2xl">
                          {getKindEmoji(place.kind)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-forest">{place.name}</p>
                      <p className="text-xs text-muted">
                        {[place.category ?? place.kind, place.address]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {place.rating && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-sage">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {place.rating}
                          {place.review_count && (
                            <span> ({place.review_count})</span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (!selected) {
                          onSelect(place);
                          onClose();
                        }
                      }}
                      disabled={selected}
                    >
                      <Plus className="mr-1.5 h-4 w-4" />
                      Hinzufügen
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Manuell hinzufügen */}
        <div className="shrink-0 border-t border-warm p-4">
          <p className="mb-3 text-sm font-medium text-forest">
            Ort nicht gefunden? Manuell hinzufügen:
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Ortsname (optional)"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="border-warm sm:max-w-[200px]"
            />
            <Input
              placeholder="Google Maps URL"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1 border-warm"
            />
            <Button
              variant="outline"
              onClick={handleManualAdd}
              disabled={manualLoading || !manualUrl.trim()}
              isLoading={manualLoading}
            >
              Als externen Ort hinzufügen
            </Button>
          </div>
          {manualError && (
            <p className="mt-2 text-sm text-peach">{manualError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
