"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Collab } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Kulinarik: "bg-peach/30",
  Kochen: "bg-peach/30",
  Genuss: "bg-peach/20",
  Kultur: "bg-sage/20",
  Outdoor: "bg-mint/30",
  Sport: "bg-sky-200/80",
  Fitness: "bg-sky-200/80",
  Natur: "bg-mint/30",
  Brettspiele: "bg-warm",
  Sonstiges: "bg-cream",
  default: "bg-warm",
};

function getCategoryBg(category: string): string {
  for (const [key, value] of Object.entries(CATEGORY_COLORS)) {
    if (category.includes(key)) return value;
  }
  return CATEGORY_COLORS.default;
}

interface CollabCardProps {
  collab: Collab;
  itemCount: number;
}

export function CollabCard({ collab, itemCount }: CollabCardProps) {
  const bgClass = getCategoryBg(collab.category ?? "");
  const profile = collab.profile;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-warm bg-white transition-shadow hover:shadow-md">
      <Link href={`/collabs/${collab.id}`} className="flex flex-col flex-1">
        <div
          className={cn(
            "flex h-[120px] flex-col items-center justify-center",
            bgClass
          )}
        >
          <span className="text-5xl" role="img" aria-hidden>
            {collab.cover_emoji ?? "📋"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2">
            <Badge variant="green">{collab.category}</Badge>
          </div>
          <h3 className="line-clamp-2 font-bold text-forest">
            {collab.title}
          </h3>
          {collab.description && (
            <p className="mt-1 line-clamp-3 text-sm text-sage">
              {collab.description}
            </p>
          )}

          <div className="mt-4 flex flex-1 flex-wrap items-end gap-3">
            {profile && (
              <div className="flex items-center gap-2">
                <Avatar
                  avatarUrl={profile.avatar_url}
                  displayName={profile.display_name}
                  username={profile.username ?? ""}
                  size="sm"
                />
                <span className="max-w-[80px] truncate text-xs text-sage">
                  {profile.display_name}
                </span>
              </div>
            )}
            <span className="text-xs text-sage">
              {itemCount} {itemCount === 1 ? "Ort" : "Orte"}
            </span>
            <span className="flex items-center gap-1 text-xs text-sage">
              <Heart className="h-4 w-4" aria-hidden />
              {collab.likes_count}
            </span>
          </div>
        </div>
      </Link>

      {collab.chatroom_id && (
        <div className="border-t border-warm px-4 pb-4 pt-2">
          <Link
            href={`/chatrooms/${collab.chatroom_id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sage/50 px-3 py-1.5 text-sm text-forest transition-colors hover:bg-sage/10"
          >
            💬 Im Chatroom diskutieren
          </Link>
        </div>
      )}
    </div>
  );
}
