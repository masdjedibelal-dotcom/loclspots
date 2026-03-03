"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { InterestsEditor } from "@/components/profile/InterestsEditor";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ProfileChatrooms } from "@/components/profile/ProfileChatrooms";
import { ProfileCollabs } from "@/components/profile/ProfileCollabs";
import { ProfileEvents } from "@/components/profile/ProfileEvents";
import { createClient } from "@/lib/supabase/client";
import { logout } from "../actions";
import { updateProfile } from "./actions";
import { useToast } from "@/hooks/useToast";
import type { Profile } from "@/lib/types";
import type { Chatroom } from "@/lib/types";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

type TabId = "collabs" | "chatrooms" | "events";

interface ProfilClientProps {
  profile: Profile;
  stats: { collabs: number; chatrooms: number; events: number };
  myChatrooms: Chatroom[];
  myEvents: Event[];
  currentUserId: string;
}

export function ProfilClient({
  profile,
  stats,
  myChatrooms,
  myEvents,
  currentUserId,
}: ProfilClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("collabs");
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [interests, setInterests] = useState<string[]>(profile.interests ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "löschen") return;
    setIsDeleting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht eingeloggt");

      // 1. Profil-Daten löschen (RLS policy: user can delete own profile)
      await supabase.from("profiles").delete().eq("id", user.id);

      // 2. Avatar aus Storage löschen
      await supabase.storage.from("avatars").remove([`${user.id}.jpg`]);

      // 3. Auth-Account löschen (Edge Function)
      const { error: fnError } = await supabase.functions.invoke("delete-user");
      if (fnError) throw fnError;

      // 4. Ausloggen und zur Startseite
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      console.error("Delete error:", err);
      setError("Löschen fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsDeleting(false);
    }
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
    if (interests.length > 15) {
      setError("Maximal 15 Interessen erlaubt.");
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
          <AvatarUpload
            userId={currentUserId}
            currentAvatarUrl={profile.avatar_url}
            onUploadComplete={() => router.refresh()}
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
            <InterestsEditor value={interests} onChange={setInterests} />
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
            <ProfileCollabs
              userId={currentUserId}
              profile={profile}
            />
          )}

          {activeTab === "chatrooms" && (
            <ProfileChatrooms chatrooms={myChatrooms} />
          )}

          {activeTab === "events" && (
            <ProfileEvents events={myEvents} />
          )}
        </div>
      </div>

      {/* Trennlinie */}
      <div className="mt-8 space-y-3 border-t border-sage/20 pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-sage/30 px-4 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage/10 hover:text-forest"
        >
          <span>↩</span> Ausloggen
        </button>
        <button
          type="button"
          onClick={() => {
            setShowDeleteModal(true);
            setError(null);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-red-50"
        >
          Konto löschen
        </button>
      </div>

      {/* Konto löschen Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          onClick={(e) =>
            e.target === e.currentTarget && (setShowDeleteModal(false), setDeleteConfirm(""))
          }
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-modal-title" className="mb-2 text-lg font-semibold text-forest">
              Konto wirklich löschen?
            </h3>
            <p className="mb-6 text-sm text-sage">
              Dein Profil, deine Nachrichten und alle erstellten Collabs werden
              dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>

            {/* Bestätigung per Texteingabe */}
            <p className="mb-2 text-xs text-sage">
              Gib <strong>löschen</strong> ein um zu bestätigen:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="löschen"
              className="mb-4 w-full rounded-xl border border-sage/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
            />

            {error && (
              <p className="mb-4 text-sm text-peach" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                  setError(null);
                }}
                className="flex-1 rounded-xl border border-sage/30 py-2.5 text-sm text-sage transition-colors hover:bg-sage/10"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "löschen" || isDeleting}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isDeleting ? "Wird gelöscht…" : "Konto löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
