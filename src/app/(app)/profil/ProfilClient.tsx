"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CollabCard } from "@/components/collabs/CollabCard";
import { logout } from "../actions";
import { updateProfile } from "./actions";
import { useToast } from "@/hooks/useToast";
import type { Profile } from "@/lib/types";
import type { Collab } from "@/lib/types";
import type { Chatroom } from "@/lib/types";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  "Wandern",
  "Lesen",
  "Kochen",
  "Kultur",
  "Sport",
  "Musik",
  "Reisen",
  "Brettspiele",
  "Tanzen",
  "Fotografie",
  "Kino",
  "Sprachen",
  "Kunst",
  "Natur",
] as const;

type TabId = "collabs" | "chatrooms" | "events";

interface ProfilClientProps {
  profile: Profile;
  stats: { collabs: number; chatrooms: number; events: number };
  myCollabs: (Collab & { itemCount: number })[];
  myChatrooms: Chatroom[];
  myEvents: Event[];
  currentUserId: string;
}

export function ProfilClient({
  profile,
  stats,
  myCollabs,
  myChatrooms,
  myEvents,
  currentUserId,
}: ProfilClientProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("collabs");
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [interests, setInterests] = useState<string[]>(profile.interests ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (name: string) => {
    setInterests((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);

    if (!displayName.trim()) {
      setError("Anzeigename darf nicht leer sein.");
      setIsSaving(false);
      return;
    }
    if (bio.length > 280) {
      setError("Bio darf maximal 280 Zeichen haben.");
      setIsSaving(false);
      return;
    }

    const result = await updateProfile({
      display_name: displayName.trim(),
      bio: bio.trim() || null,
      interests,
    });

    setIsSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          Mein Profil
        </h1>
        <p className="mt-1 text-sage">
          Deine Übersicht und Einstellungen
        </p>
      </div>

      {/* Oberer Bereich */}
      <div className="rounded-xl border border-warm bg-cream/30 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar
            avatarUrl={profile.avatar_url}
            displayName={profile.display_name}
            username={profile.username}
            size="xl"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-serif text-2xl font-bold text-forest sm:text-3xl">
              {profile.display_name}
            </h1>
            <p className="text-sage">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-forest">{profile.bio}</p>
            )}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <Badge key={i} variant="green">
                    {i}
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-sage sm:justify-start">
              <span>{stats.collabs} Collabs</span>
              <span>·</span>
              <span>{stats.chatrooms} Chatrooms</span>
              <span>·</span>
              <span>{stats.events} Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bearbeiten-Bereich */}
      <div className="rounded-xl border border-warm bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-forest">Profil bearbeiten</h2>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Bearbeiten
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Abbrechen
            </Button>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 space-y-4">
            {error && (
              <p className="text-sm text-peach" role="alert">
                {error}
              </p>
            )}
            <Input
              label="Anzeigename"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
            />
            <div>
              <Textarea
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={280}
                rows={3}
                placeholder="Stell dich kurz vor..."
              />
              <p className="mt-1 text-right text-xs text-sage">{bio.length}/280</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-forest">
                Interessen
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleInterest(name)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm transition-colors",
                      interests.includes(name)
                        ? "bg-forest text-cream"
                        : "bg-warm text-sage hover:bg-sage/20"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleSave}
              isLoading={isSaving}
              disabled={isSaving}
            >
              Speichern
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-2 border-b border-warm">
          {(
            [
              { id: "collabs" as TabId, label: "Meine Collabs" },
              { id: "chatrooms" as TabId, label: "Meine Chatrooms" },
              { id: "events" as TabId, label: "Meine Events" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-forest text-forest"
                  : "border-transparent text-sage hover:text-forest"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "collabs" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {myCollabs.map((collab) => (
                <CollabCard
                  key={collab.id}
                  collab={collab}
                  itemCount={collab.itemCount}
                />
              ))}
              {myCollabs.length === 0 && (
                <p className="py-8 text-center text-sage">
                  Noch keine Collabs erstellt.
                </p>
              )}
            </div>
          )}

          {activeTab === "chatrooms" && (
            <div className="space-y-2">
              {myChatrooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/chatrooms/${room.id}`}
                  className="flex items-center gap-3 rounded-xl border border-warm p-4 transition-colors hover:border-sage/50"
                >
                  <span className="text-2xl">{room.emoji}</span>
                  <div>
                    <p className="font-medium text-forest">{room.name}</p>
                    <p className="text-xs text-sage">{room.member_count} Mitglieder</p>
                  </div>
                </Link>
              ))}
              {myChatrooms.length === 0 && (
                <p className="py-8 text-center text-sage">
                  Noch keinen Chatrooms beigetreten.
                </p>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-2">
              {myEvents.map((event) => (
                <Link
                  key={event.id}
                  href="/events"
                  className="flex items-center gap-3 rounded-xl border border-warm p-4 transition-colors hover:border-sage/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10 text-sage">
                    📅
                  </div>
                  <div>
                    <p className="font-medium text-forest">{event.title}</p>
                    <p className="text-xs text-sage">
                      {new Date(event.date ?? event.start_datetime ?? event.start_date ?? "").toLocaleDateString("de-DE", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
              {myEvents.length === 0 && (
                <p className="py-8 text-center text-sage">
                  Keine Events angemeldet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-warm pt-8">
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg px-3 py-2 text-sm text-sage transition-colors hover:bg-sage/10 hover:text-peach"
          >
            Abmelden
          </button>
        </form>
      </div>
    </div>
  );
}
