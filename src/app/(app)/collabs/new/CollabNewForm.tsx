"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Plus, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StepProgress } from "@/components/ui/StepProgress";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { PlacePicker } from "@/components/collabs/PlacePicker";
import { createCollab } from "./actions";
import { useToast } from "@/hooks/useToast";
import type { Place } from "@/lib/types";
import { cn } from "@/lib/utils";

const EMOJIS = [
  "📍", "📋", "🗺️", "🎭", "🥾", "☕", "🍕", "🎲", "💃", "📚",
  "🎨", "🏃", "🌿", "✈️", "🎵", "🍺", "📸", "🎬", "🏖️", "🛍️",
];
const CATEGORIES = [
  "Essen & Trinken",
  "Outdoor",
  "Kultur",
  "Sport",
  "After Work",
  "Sonstiges",
] as const;

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 200;
const PLACE_DESCRIPTION_MAX = 100;
const PLACES_MIN = 2;
const PLACES_MAX = 20;

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
  const { toast } = useToast();
  const [createdCollabId, setCreatedCollabId] = useState<string | null>(null);
  const [createdIsPublic, setCreatedIsPublic] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlacePicker, setShowPlacePicker] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    cover_emoji: "📍",
  });
  const [chatroomId, setChatroomId] = useState<string>("");

  const [places, setPlaces] = useState<SelectedPlaceItem[]>([]);

  const addPlace = (place: Place) => {
    if (places.some((p) => p.place.id === place.id)) return;
    if (places.length >= PLACES_MAX) return;
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

  const movePlace = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) reorderPlaces(index, index - 1);
    if (direction === "down" && index < places.length - 1)
      reorderPlaces(index, index + 1);
  };

  const validateStep1 = (): string | null => {
    if (!form.title.trim()) return "Bitte gib einen Titel ein.";
    if (form.title.length > TITLE_MAX)
      return `Der Titel darf maximal ${TITLE_MAX} Zeichen haben.`;
    if (form.description.length > DESCRIPTION_MAX)
      return `Die Beschreibung darf maximal ${DESCRIPTION_MAX} Zeichen haben.`;
    if (!form.category) return "Bitte wähle eine Kategorie.";
    return null;
  };

  const validateStep2 = (): string | null => {
    if (places.length < PLACES_MIN)
      return `Bitte füge mindestens ${PLACES_MIN} Orte hinzu.`;
    if (places.length > PLACES_MAX)
      return `Maximal ${PLACES_MAX} Orte erlaubt.`;
    const invalidDesc = places.find(
      (p) => p.description.length > PLACE_DESCRIPTION_MAX
    );
    if (invalidDesc)
      return `Die Beschreibung für "${invalidDesc.place.name}" darf maximal ${PLACE_DESCRIPTION_MAX} Zeichen haben.`;
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

  const handlePublish = async (isDraft: boolean) => {
    setError(null);
    setIsSubmitting(true);

    const err = validateStep2();
    if (err) {
      setError(err);
      setIsSubmitting(false);
      return;
    }

    const result = await createCollab({
      cover_emoji: form.cover_emoji,
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
      chatroom_id: chatroomId || null,
      is_public: !isDraft,
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
      setCreatedCollabId(result.id);
      setCreatedIsPublic(!isDraft);
      toast(
        isDraft ? "Entwurf gespeichert!" : "Collab veröffentlicht!",
        "success"
      );
    }
    setIsSubmitting(false);
  };

  const handleShare = async () => {
    if (!createdCollabId) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/collabs/${createdCollabId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: form.title,
          text: form.description || form.title,
          url,
        });
        toast("Geteilt!", "success");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(url);
          toast("Link in Zwischenablage kopiert", "success");
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast("Link in Zwischenablage kopiert", "success");
    }
  };

  const stepLabels = ["Grundinfos", "Orte", "Vorschau"];

  if (createdCollabId) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <div className="mb-4 text-5xl" role="img" aria-hidden>
          🎉
        </div>
        <h2 className="mb-2 font-serif text-2xl font-semibold text-forest">
          Collab erstellt!
        </h2>
        <p className="mb-8 text-sage">
          {createdIsPublic
            ? "Deine Liste ist jetzt öffentlich sichtbar."
            : "Dein Entwurf wurde gespeichert."}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href={`/collabs/${createdCollabId}`}
            className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest/90"
          >
            Collab ansehen
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-lg border-2 border-sage px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-sage/10"
          >
            Teilen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <StepProgress steps={stepLabels} currentStep={step - 1} />

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
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, cover_emoji: e }))
                  }
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors sm:h-12 sm:w-12 sm:text-2xl",
                    form.cover_emoji === e
                      ? "bg-forest text-cream ring-2 ring-forest"
                      : "bg-warm hover:bg-sage/20"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Input
              label="Titel"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="z.B. Beste Cafés in München"
              maxLength={TITLE_MAX}
              required
            />
            <p className="mt-1 text-right text-xs text-sage">
              {form.title.length}/{TITLE_MAX}
            </p>
          </div>
          <div>
            <Textarea
              label="Beschreibung (optional)"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Worum geht es in dieser Liste?"
              maxLength={DESCRIPTION_MAX}
              rows={3}
            />
            <p className="mt-1 text-right text-xs text-sage">
              {form.description.length}/{DESCRIPTION_MAX}
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest">
              Kategorie
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, category: c }))
                  }
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    form.category === c
                      ? "bg-forest text-white"
                      : "bg-warm text-sage hover:bg-sage/20 hover:text-forest"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
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
            Füge 2–20 Orte hinzu. Ziehe zum Sortieren oder nutze die Pfeile.
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
              <div className="mt-1 flex shrink-0 flex-col items-center gap-0.5 text-sage">
                <GripVertical className="h-5 w-5" aria-hidden />
                <button
                  type="button"
                  onClick={() => movePlace(index, "up")}
                  disabled={index === 0}
                  className="rounded p-0.5 hover:bg-sage/20 disabled:opacity-30"
                  aria-label="Nach oben"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => movePlace(index, "down")}
                  disabled={index === places.length - 1}
                  className="rounded p-0.5 hover:bg-sage/20 disabled:opacity-30"
                  aria-label="Nach unten"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
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
                    disabled={places.length <= PLACES_MIN}
                    className="rounded p-1 text-sage hover:bg-peach/20 hover:text-peach disabled:opacity-50"
                    aria-label="Ort entfernen"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {item.place.category && (
                  <p className="text-xs text-sage">{item.place.category}</p>
                )}
                <div className="mt-2">
                  <Textarea
                    placeholder="Optionale Beschreibung (max 100 Zeichen)"
                    value={item.description}
                    onChange={(e) =>
                      updatePlaceDescription(item.place.id, e.target.value)
                    }
                    maxLength={PLACE_DESCRIPTION_MAX}
                    rows={2}
                    className="border-warm text-sm"
                  />
                  <p className="mt-0.5 text-right text-xs text-sage">
                    {item.description.length}/{PLACE_DESCRIPTION_MAX}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPlacePicker(true)}
            disabled={places.length >= PLACES_MAX}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ort hinzufügen
            {places.length >= PLACES_MAX && ` (max ${PLACES_MAX})`}
          </Button>
        </div>
      )}

      {/* SCHRITT 3 – Vorschau wie /collabs/[id] */}
      {step === 3 && (
        <div className="space-y-8">
          <div className="rounded-xl border border-warm bg-cream/30 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                className="block text-[80px] leading-none"
                role="img"
                aria-hidden
              >
                {form.cover_emoji}
              </span>
              <div>
                <Badge variant="green" className="mb-2">
                  {form.category}
                </Badge>
                <h1 className="font-serif text-2xl font-bold text-forest sm:text-3xl">
                  {form.title}
                </h1>
                {form.description && (
                  <p className="mt-2 text-sage">{form.description}</p>
                )}
              </div>
            </div>
          </div>

          <section>
            <h2 className="mb-4 font-semibold text-forest">Orte</h2>
            <div className="space-y-4">
              {places.map((item, i) => (
                <div
                  key={item.place.id}
                  className="flex gap-4 rounded-xl border border-warm bg-white p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-medium text-white">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-forest">
                      {item.place.name}
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-sage">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {chatroomId && (
            <p className="text-sm text-sage">
              Verknüpfter Chatroom:{" "}
              {chatrooms.find((r) => r.id === chatroomId)?.name}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-sm text-sage underline hover:text-forest"
            >
              Zurück bearbeiten
            </button>
            <div className="flex flex-1 gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => handlePublish(true)}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Entwurf speichern
              </Button>
              <Button
                onClick={() => handlePublish(false)}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Veröffentlichen
              </Button>
            </div>
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
