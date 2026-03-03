"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const PRESET_INTERESTS = [
  "Wandern",
  "Bouldern",
  "Radfahren",
  "Laufen",
  "Yoga",
  "Pilates",
  "HYROX",
  "Tennis",
  "Padel",
  "Tanzen",
  "Schwimmen",
  "Eisbaden",
  "Kochen",
  "Backen",
  "Wein",
  "Kaffee",
  "Craft Beer",
  "Kunst",
  "Museen",
  "Theater",
  "Konzerte",
  "Kino",
  "Lesen",
  "Fotografie",
  "Töpfern",
  "Zeichnen",
  "Reisen",
  "Sprachen",
  "Technik",
  "Startups",
  "Brettspiele",
  "Videospiele",
  "Hund",
  "Katze",
] as const;

interface InterestsEditorProps {
  value: string[];
  onChange: (interests: string[]) => void;
}

export function InterestsEditor({ value, onChange }: InterestsEditorProps) {
  const [customInput, setCustomInput] = useState("");

  const toggle = (interest: string) => {
    if (value.includes(interest)) {
      onChange(value.filter((i) => i !== interest));
    } else if (value.length < 15) {
      onChange([...value, interest]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= 15) return;
    onChange([...value, trimmed]);
    setCustomInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-forest">Interessen</label>
        <span className="text-xs text-sage">{value.length}/15</span>
      </div>

      {/* Vordefinierte Chips */}
      <div className="flex flex-wrap gap-2">
        {PRESET_INTERESTS.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => toggle(interest)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors",
              value.includes(interest)
                ? "bg-forest text-white"
                : "border border-sage/40 bg-transparent text-sage hover:border-forest hover:bg-forest/10 hover:text-forest",
              value.length >= 15 &&
                !value.includes(interest) &&
                "cursor-not-allowed opacity-40"
            )}
          >
            {interest}
          </button>
        ))}
      </div>

      {/* Eigenes Interesse hinzufügen */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addCustom())
          }
          placeholder="Eigenes Interesse hinzufügen…"
          maxLength={30}
          className="flex-1 rounded-xl border border-sage/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-forest/30"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim() || value.length >= 15}
          className="rounded-xl bg-forest px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Hinzufügen
        </button>
      </div>

      {/* Ausgewählte (inkl. eigene) mit X zum Entfernen */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {value.map((interest) => (
            <span
              key={interest}
              className="flex items-center gap-1 rounded-full bg-forest/10 px-3 py-1 text-sm text-forest"
            >
              {interest}
              <button
                type="button"
                onClick={() => toggle(interest)}
                className="ml-0.5 transition-colors hover:text-peach"
                aria-label={`${interest} entfernen`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
