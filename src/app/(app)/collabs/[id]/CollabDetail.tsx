"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Pencil, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { likeCollab, unlikeCollab } from "@/lib/collab-actions";
import { deleteCollab } from "./actions";
import type { Collab, CollabItem, Profile } from "@/lib/types";

interface CollabDetailProps {
  collab: Collab;
  items: CollabItem[];
  chatroom: { id: string; name: string; emoji: string } | null;
  currentUserId: string;
  isLiked: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CollabDetail({
  collab,
  items,
  chatroom,
  currentUserId,
  isLiked,
}: CollabDetailProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(collab.likes_count ?? 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const profile = collab.profile as Profile | undefined;
  const isCreator = collab.creator_id === currentUserId;

  const handleLikeToggle = async () => {
    const wasLiked = liked;
    setLiked(!liked);
    setLikesCount((c) => (wasLiked ? c - 1 : c + 1));

    const result = wasLiked
      ? await unlikeCollab(collab.id)
      : await likeCollab(collab.id);

    if (result?.error) {
      setLiked(wasLiked);
      setLikesCount((c) => (wasLiked ? c + 1 : c - 1));
    }
  };

  const handleDelete = async () => {
    await deleteCollab(collab.id);
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero */}
      <div className="rounded-xl border border-warm bg-cream/30 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              className="block text-[80px] leading-none"
              role="img"
              aria-hidden
            >
              {collab.cover_emoji ?? "📋"}
            </span>
            <div>
              <Badge variant="green" className="mb-2">
                {collab.category}
              </Badge>
              <h1 className="font-serif text-2xl font-bold text-forest sm:text-3xl">
                {collab.title}
              </h1>
              {collab.description && (
                <p className="mt-2 text-sage">{collab.description}</p>
              )}
              {profile && (
                <div className="mt-4 flex items-center gap-3">
                  <Avatar
                    url={profile.avatar_url}
                    name={profile.display_name}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-forest">
                      {profile.display_name}
                    </p>
                    <p className="text-xs text-sage">
                      erstellt am {formatDate(collab.created_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLikeToggle}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-warm px-4 py-2 text-forest transition-colors hover:bg-warm"
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-peach text-peach" : ""}`}
              aria-hidden
            />
            <span>{likesCount}</span>
          </button>
        </div>

        {isCreator && (
          <div className="mt-6 flex gap-3 border-t border-warm pt-6">
            <Link href={`/collabs/${collab.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </Button>
          </div>
        )}
      </div>

      {/* 2. Orte-Liste */}
      <section>
        <h2 className="mb-4 font-semibold text-forest">Orte</h2>
        <div className="space-y-4">
          {items
            .sort((a, b) => a.position - b.position)
            .map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-warm bg-white p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-medium text-white">
                  {item.position + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-forest">{item.name}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-sage">{item.description}</p>
                  )}
                  <a
                    href={item.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-forest underline hover:text-sage"
                  >
                    <MapPin className="h-4 w-4" />
                    In Google Maps öffnen
                  </a>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 3. Verknüpfter Chatroom */}
      {chatroom && (
        <section>
          <div className="rounded-xl border border-warm bg-cream/30 p-6">
            <h3 className="mb-3 font-semibold text-forest">
              Gespräche dazu
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{chatroom.emoji}</span>
                <span className="font-medium text-forest">{chatroom.name}</span>
              </div>
              <Link
                href={`/chatrooms/${chatroom.id}`}
                className="shrink-0 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest/90"
              >
                Zum Chatroom →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest/20 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="max-w-sm rounded-xl border border-warm bg-white p-6 shadow-lg">
            <h2 id="delete-dialog-title" className="font-semibold text-forest">
              Collab löschen?
            </h2>
            <p className="mt-2 text-sm text-sage">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Abbrechen
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Löschen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
