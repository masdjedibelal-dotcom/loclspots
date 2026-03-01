"use client";

import { Avatar } from "@/components/ui/Avatar";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showDateSeparator?: boolean;
  dateLabel?: string;
}

function formatTime(createdAt: string): string {
  return new Date(createdAt).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({
  message,
  isOwn,
  showDateSeparator,
  dateLabel,
}: MessageBubbleProps) {
  const profile = message.profile;

  return (
    <div className="space-y-2">
      {showDateSeparator && dateLabel && (
        <div className="flex justify-center py-2">
          <span className="rounded-full bg-warm px-3 py-1 text-xs text-sage">
            {dateLabel}
          </span>
        </div>
      )}
      <div
        className={cn(
          "flex gap-3",
          isOwn && "flex-row-reverse"
        )}
      >
        {!isOwn && profile && (
          <Avatar
            avatarUrl={profile.avatar_url}
            displayName={profile.display_name}
            username={profile.username ?? ""}
            size="sm"
          />
        )}
        <div
          className={cn(
            "flex max-w-[85%] flex-col",
            isOwn && "items-end"
          )}
        >
          {!isOwn && profile && (
            <p className="mb-0.5 text-xs text-sage">
              {profile.display_name}
            </p>
          )}
          <div
            className={cn(
              "rounded-2xl px-3 py-2 text-sm",
              isOwn
                ? "rounded-tr-sm bg-forest text-white"
                : "rounded-tl-sm bg-warm text-forest"
            )}
          >
            {message.content}
          </div>
          <p
            className={cn(
              "mt-0.5 text-xs text-sage",
              isOwn && "text-right"
            )}
          >
            {formatTime(message.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
