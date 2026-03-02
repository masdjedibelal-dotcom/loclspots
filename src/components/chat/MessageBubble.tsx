"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

const QUICK_EMOJIS = ["❤️", "😂", "👍", "🔥", "😮", "👎"];

const CHAT_COLORS = [
  { text: "text-rose-600", bg: "bg-rose-50" },
  { text: "text-violet-600", bg: "bg-violet-50" },
  { text: "text-amber-600", bg: "bg-amber-50" },
  { text: "text-teal-600", bg: "bg-teal-50" },
  { text: "text-sky-600", bg: "bg-sky-50" },
  { text: "text-pink-600", bg: "bg-pink-50" },
  { text: "text-orange-600", bg: "bg-orange-50" },
  { text: "text-emerald-600", bg: "bg-emerald-50" },
] as const;

function getUserColor(userId: string) {
  const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CHAT_COLORS[hash % CHAT_COLORS.length];
}

function formatTime(createdAt: string): string {
  return new Date(createdAt).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId: string;
  showDateSeparator?: boolean;
  dateLabel?: string;
  showName?: boolean;
  isFirstUnread?: boolean;
  onReply?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

export function MessageBubble({
  message,
  isOwn,
  currentUserId,
  showDateSeparator,
  dateLabel,
  showName = true,
  isFirstUnread = false,
  onReply,
  onDelete,
  onReaction,
}: MessageBubbleProps) {
  const profile = message.profile;
  const color = !isOwn ? getUserColor(message.user_id) : null;
  const hasActions = onReply || onDelete || onReaction;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <div className="space-y-2">
      {showDateSeparator && dateLabel && (
        <div className="flex justify-center py-2">
          <span className="rounded-full bg-warm px-3 py-1 text-xs text-sage">
            {dateLabel}
          </span>
        </div>
      )}
      {isFirstUnread && (
        <div className="my-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-forest/20" />
          <span className="text-xs font-medium text-forest">Neue Nachrichten</span>
          <div className="h-px flex-1 bg-forest/20" />
        </div>
      )}
      <div
        className={cn(
          "flex gap-2 items-end",
          isOwn ? "flex-row-reverse" : "flex-row"
        )}
      >
        {!isOwn && profile && (
          <Avatar
            url={profile.avatar_url}
            name={profile.display_name}
            size="sm"
          />
        )}

        <div
          className={cn(
            "max-w-[75%] flex flex-col",
            isOwn ? "items-end" : "items-start"
          )}
        >
          {!isOwn && showName && profile && (
            <span
              className={cn(
                "text-xs font-semibold mb-1",
                color?.text ?? "text-sage"
              )}
            >
              {profile.display_name ?? profile.username ?? "Anonym"}
            </span>
          )}

          {message.reply_to && (
            <div
              className="mb-1 max-w-full rounded-lg border-l-2 border-forest bg-black/5 px-3 py-1 text-xs text-gray-500"
            >
              <span className="font-medium">
                {message.reply_to.profiles?.username ?? "?"}
              </span>
              <p className="truncate">
                {message.reply_to.is_deleted
                  ? "Nachricht gelöscht"
                  : message.reply_to.content}
              </p>
            </div>
          )}

          <div
            className={cn(
              "group relative rounded-2xl px-4 py-2 text-sm",
              isOwn
                ? "bg-forest text-white rounded-br-sm"
                : color
                  ? `${color.bg} text-gray-900 rounded-bl-sm`
                  : "bg-warm text-forest rounded-bl-sm",
              message.is_deleted && "opacity-50 italic"
            )}
          >
            {message.is_deleted ? (
              <span className="text-xs">🚫 Nachricht gelöscht</span>
            ) : (
              <>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                {hasActions && (
                  <div
                    className={cn(
                      "absolute bottom-0 hidden items-center gap-1 px-2 group-hover:flex",
                      isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                    )}
                  >
                    {onReaction && (
                      <div className="relative" ref={pickerRef}>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker((v) => !v)}
                          className="text-gray-400 text-lg hover:text-gray-600"
                          aria-label="Reagieren"
                        >
                          😊
                        </button>
                        {showEmojiPicker && (
                          <div
                            className={cn(
                              "absolute bottom-full mb-1 grid grid-cols-3 gap-0.5 rounded-lg border border-warm bg-white p-1 shadow-lg",
                              isOwn ? "left-0" : "right-0"
                            )}
                          >
                            {QUICK_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  onReaction(message.id, emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className="rounded p-1 text-lg hover:bg-warm"
                                aria-label={`Reagieren mit ${emoji}`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {onReply && (
                      <button
                        type="button"
                        onClick={() => onReply(message)}
                        className="text-gray-400 text-sm hover:text-gray-600"
                        aria-label="Antworten"
                      >
                        ↩
                      </button>
                    )}
                    {isOwn && onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(message.id)}
                        className="text-gray-400 text-sm hover:text-red-500"
                        aria-label="Löschen"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {message.reactions &&
            Object.keys(message.reactions).length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {Object.entries(message.reactions).map(
                  ([emoji, users]: [string, string[]]) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() =>
                        onReaction ? onReaction(message.id, emoji) : undefined
                      }
                      className={cn(
                        "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                        users.includes(currentUserId)
                          ? "border-forest/30 bg-forest/10 text-forest"
                          : "border-gray-200 bg-white text-gray-600"
                      )}
                    >
                      {emoji} <span>{users.length}</span>
                    </button>
                  )
                )}
              </div>
            )}

          <span className="mt-0.5 text-[10px] text-gray-400">
            {formatTime(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
