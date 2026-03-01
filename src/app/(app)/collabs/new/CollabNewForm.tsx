"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { PlacePicker } from "@/components/collabs/PlacePicker";
import { createCollab } from "./actions";
import { useToast } from "@/hooks/useToast";
import type { Place } from "@/lib/types";
import { cn } from "@/lib/utils";

const EMOJIS = ["📋", "🗺️", "🎭", "🥾", "☕", "🍕", "🎲", "💃", "📚", "🎨", "🏃", "🌿"];
const CATEGORIES = [
  "Outdoor",
  "Kultur",
  "Sport",
  "After Work",
  "Essen & Trinken",
  "Sonstiges",
] as const;

interface ChatroomOption {
  id: string;
  name: string;
  emoji: string;
}

interface SelectedPlaceItem {
  place: Place;
  description: string;
  position: number;
}

interface CollabNewFormProps {
  chatrooms: ChatroomOption[];
}

export function CollabNewForm({ chatrooms }: CollabNewFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlacePicker, setShowPlacePicker] = useState(false);

  const [emoji, setEmoji] = useState("📋");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [chatroomId, setChatroomId] = useState<string>("");

  const [places, setPlaces] = useState<SelectedPlaceItem[]>([]);

  const addPlace = (place: Place) => {
    if (places.some((p) => p.place.id === place.id)) return;
    setPlaces((prev) => [
      ...prev,
      { place, description: "", position: prev.length },
    ]);
    setShowPlacePicker(false);
  };

  const removePlace = (placeId: string) => {
    setPlaces((prev) => {
      const next = prev.filter((p) => p.place.id !== placeId);
      return next.map((p, i) => ({ ...p, position: i }));
    });
  };

  const updatePlaceDescription = (placeId: string, description: string) => {
    setPlaces((prev) =>
      prev.map((p) =>
        p.place.id === placeId ? { ...p, description } : p
      )
    );
  };

  const reorderPlaces = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setPlaces((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, removed);
      return copy.map((p, i) => ({ ...p, position: i }));
    });
  };

  const validateStep1 = (): string | null => {
    if (!title.trim()) return "Bitte gib einen Titel ein.";
    if (title.length > 80) return "Der Titel darf maximal 80 Zeichen haben.";
    if (description.length > 300)
      return "Die Beschreibung darf maximal 300 Zeichen haben.";
    if (!category) return "Bitte wähle eine Kategorie.";
    return null;
  };

  const validateStep2 = (): string | null => {
    if (places.length === 0) return "Bitte füge mindestens einen Ort hinzu.";
    return null;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setError(err);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    const err = validateStep2();
    if (err) {
      setError(err);
      setIsSubmitting(false);
      return;
    }

    const result = await createCollab({
      cover_emoji: emoji,
      title: title.trim(),
      description: description.trim() || null,
      category,
      chatroom_id: chatroomId || null,
      items: places.map((p, i) => {
        const place = p.place;
        const mapsUrl =
          place.place_url ||
          (place.lat && place.lng
            ? `https://www.google.com/maps?q=${place.lat},${place.lng}`
            : "https://www.google.com/maps");
        return {
          place_id: place.id,
          name: place.name,
          maps_url: mapsUrl,
          position: i,
          description: p.description.trim() || null,
        };
      }),
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
      toast(result.error, "error");
    } else if (result?.id) {
      toast("Collab erfolgreich erstellt!", "success");
      router.push(`/collabs/${result.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Fortschrittsanzeige */}
      <div className="relative">
        <div
          className="absolute left-0 right-0 top-5 h-0.5 -translate-y-1/2 bg-warm"
          style={{
            background: `linear-gradient(90deg, #2D4A3E 0%, #2D4A3E ${(step / 3) * 100}%, #EDE8E1 ${(step / 3) * 100}%, #EDE8E1 100%)`,
          }}
        />
        <div className="relative flex justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white",
                  step >= s ? "bg-forest" : "bg-warm text-sage"
                )}
              >
                {s}
              </div>
              <span className="mt-2 text-xs text-sage">
                {s === 1 && "Grundinfos"}
                {s === 2 && "Orte"}
                {s === 3 && "Vorschau"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-peach/50 bg-peach/10 px-4 py-3 text-sm text-peach">
          {error}
        </div>
      )}

      {/* SCHRITT 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-forest">
              Emoji
            </label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg text-2xl transition-colors",
                    emoji === e
                      ? "bg-forest text-cream ring-2 ring-forest"
                      : "bg-warm hover:bg-sage/20"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Beste Cafés in München"
            maxLength={80}
            required
          />
          <div>
            <Textarea
              label="Beschreibung"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Worum geht es in dieser Liste?"
              maxLength={300}
              rows={3}
            />
            <p className="mt-1 text-right text-xs text-sage">
              {description.length}/300
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest">
              Kategorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border-2 border-warm bg-cream px-3 py-2.5 text-forest focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="">Bitte wählen</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest">
              Chatroom verknüpfen (optional)
            </label>
            <select
              value={chatroomId}
              onChange={(e) => setChatroomId(e.target.value)}
              className="w-full rounded-lg border-2 border-warm bg-cream px-3 py-2.5 text-forest focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="">Kein Chatroom</option>
              {chatrooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.emoji} {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* SCHRITT 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-sage">
            Füge mindestens einen Ort hinzu. Ziehe die Karten zum Sortieren.
          </p>
          {places.map((item, index) => (
            <div
              key={item.place.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", String(index))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
                reorderPlaces(from, index);
              }}
              className="flex items-start gap-3 rounded-xl border border-warm bg-cream/30 p-4 cursor-grab active:cursor-grabbing"
            >
              <div className="mt-1 shrink-0 text-sage">
                <GripVertical className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-warm">
                {item.place.img_url ? (
                  <img
                    src={item.place.img_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg">
                    📍
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-sage">
                    {index + 1}. {item.place.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePlace(item.place.id)}
                    disabled={places.length <= 1}
                    className="rounded p-1 text-sage hover:bg-peach/20 hover:text-peach disabled:opacity-50"
                    aria-label="Ort entfernen"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {item.place.category && (
                  <p className="text-xs text-sage">{item.place.category}</p>
                )}
                <Textarea
                  placeholder="Optionale Beschreibung für diesen Ort…"
                  value={item.description}
                  onChange={(e) =>
                    updatePlaceDescription(item.place.id, e.target.value)
                  }
                  rows={2}
                  className="mt-2 border-warm text-sm"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPlacePicker(true)}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ort hinzufügen
          </Button>
        </div>
      )}

      {/* SCHRITT 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-warm bg-cream/30 p-6">
            <h3 className="font-semibold text-forest">Vorschau</h3>
            <div className="mt-4 flex items-start gap-4">
              <span className="text-5xl">{emoji}</span>
              <div>
                <Badge variant="green" className="mb-1">
                  {category}
                </Badge>
                <h2 className="font-bold text-forest">{title}</h2>
                {description && (
                  <p className="mt-1 text-sm text-sage">{description}</p>
                )}
              </div>
            </div>
            <ul className="mt-6 space-y-2">
              {places.map((item, i) => (
                <li key={item.place.id} className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-xs text-white">
                    {i + 1}
                  </span>
                  <div className="flex h-8 w-8 shrink-0 overflow-hidden rounded">
                    {item.place.img_url ? (
                      <img
                        src={item.place.img_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-warm text-xs">
                        📍
                      </span>
                    )}
                  </div>
                  <span className="text-forest">{item.place.name}</span>
                </li>
              ))}
            </ul>
            {chatroomId && (
              <p className="mt-4 text-sm text-sage">
                Verknüpfter Chatroom:{" "}
                {chatrooms.find((r) => r.id === chatroomId)?.name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-sm text-sage underline hover:text-forest"
            >
              Zurück bearbeiten
            </button>
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Veröffentlichen
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Zurück
          </Button>
          <Button onClick={handleNext}>Weiter</Button>
        </div>
      )}

      {showPlacePicker && (
        <PlacePicker
          onSelect={addPlace}
          onClose={() => setShowPlacePicker(false)}
          alreadySelected={places.map((p) => p.place.id)}
        />
      )}
    </div>
  );
}
