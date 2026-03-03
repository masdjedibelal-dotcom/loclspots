"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { likeCollab, unlikeCollab } from "@/lib/collab-actions";

interface CollabActionsProps {
  collabId: string;
  creatorId: string;
  likesCount: number;
  chatroom: { id: string; name: string; emoji: string } | null;
}

export function CollabActions({
  collabId,
  creatorId,
  likesCount: initialCount,
  chatroom,
}: CollabActionsProps) {
  const { user, isLoggedIn } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const isCreator = user?.id === creatorId;

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const supabase = createClient();
    const loadLike = async () => {
      const { data } = await supabase
        .from("collab_likes")
        .select("id")
        .eq("collab_id", collabId)
        .eq("user_id", user.id)
        .maybeSingle();
      setLiked(!!data);
    };
    loadLike();
  }, [isLoggedIn, user, collabId]);

  const handleLike = async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    const wasLiked = liked;
    setLiked(!liked);
    setLikesCount((c) => (wasLiked ? c - 1 : c + 1));
    const result = wasLiked
      ? await unlikeCollab(collabId)
      : await likeCollab(collabId);
    if (result?.error) {
      setLiked(wasLiked);
      setLikesCount((c) => (wasLiked ? c + 1 : c - 1));
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button
        type="button"
        onClick={handleLike}
        disabled={!isLoggedIn || isLoading}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 transition-colors ${
          isLoggedIn
            ? "border-2 border-sage text-forest hover:bg-sage hover:text-white"
            : "cursor-default border-2 border-sage/30 text-sage/60"
        } ${liked ? "bg-peach/20 border-peach text-peach" : ""}`}
        title={!isLoggedIn ? "Einloggen um zu liken" : undefined}
      >
        <Heart
          className={`h-5 w-5 ${liked ? "fill-peach text-peach" : ""}`}
          aria-hidden
        />
        <span>{likesCount}</span>
      </button>
      {chatroom && (
        <Link
          href={isLoggedIn ? `/chatrooms/${chatroom.id}` : `/login?returnUrl=${encodeURIComponent(`/chatrooms/${chatroom.id}`)}`}
          className="flex items-center gap-2 rounded-full border-2 border-sage px-5 py-2.5 font-medium text-forest transition-colors hover:bg-sage hover:text-white"
        >
          <span>{chatroom.emoji}</span>
          <span>Zum Chatroom</span>
        </Link>
      )}
      {isCreator && (
        <Link
          href={`/collabs/${collabId}/edit`}
          className="rounded-full border-2 border-sage/50 px-5 py-2.5 text-sm font-medium text-sage transition-colors hover:border-sage hover:text-forest"
        >
          Bearbeiten
        </Link>
      )}
    </div>
  );
}
