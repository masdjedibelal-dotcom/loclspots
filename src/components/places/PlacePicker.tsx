"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Place } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlacePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (place: Place) => void;
  excludeIds?: string[];
}

/** PlacePicker – wird in P-16b erweitert. Jetzt: einfache Liste aus places-Tabelle. */
export function PlacePicker({
  isOpen,
  onClose,
  onSelect,
  excludeIds = [],
}: PlacePickerProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/places?" + new URLSearchParams({ q: search }));
        if (!res.ok) throw new Error("Laden fehlgeschlagen");
        const data = await res.json();
        setPlaces(data.places ?? []);
      } catch {
        setError("Orte konnten nicht geladen werden.");
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [isOpen, search]);

  const filtered = places.filter((p) => !excludeIds.includes(p.id));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest/20 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="place-picker-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-warm bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-warm p-4">
          <h2 id="place-picker-title" className="font-semibold text-forest">
            Ort auswählen
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-sage hover:bg-warm hover:text-forest"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-warm p-3">
          <Input
            placeholder="Suche nach Name oder Kategorie…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-warm"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="py-8 text-center text-sage">Lade Orte…</p>
          ) : error ? (
            <p className="py-8 text-center text-peach">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sage">
              {excludeIds.length === places.length
                ? "Alle passenden Orte sind bereits hinzugefügt."
                : "Keine Orte gefunden."}
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => {
                    onSelect(place);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border border-warm p-3 text-left transition-colors hover:border-sage hover:bg-cream/50"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-warm">
                    {place.img_url ? (
                      <img
                        src={place.img_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xl">
                        📍
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest">{place.name}</p>
                    <p className="text-xs text-sage">
                      {place.category ?? place.kind}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
