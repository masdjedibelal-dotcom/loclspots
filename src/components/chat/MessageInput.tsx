"use client";

import { useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Message } from "@/lib/types";

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  replyTo?: Message | null;
  onClearReply?: () => void;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Nachricht schreiben…",
  replyTo,
  onClearReply,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  const handleSubmit = () => {
    const el = textareaRef.current;
    if (!el) return;
    const content = el.value.trim();
    if (!content || disabled) return;
    onSend(content);
    el.value = "";
    el.style.height = "auto";
    onClearReply?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.addEventListener("input", adjustHeight);
    return () => el.removeEventListener("input", adjustHeight);
  }, [adjustHeight]);

  return (
    <div className="border-t border-warm bg-cream/50">
      {replyTo && onClearReply && (
        <div className="flex items-center gap-2 border-b border-warm px-4 py-2">
          <div className="flex-1 border-l-2 border-forest pl-2">
            <p className="text-xs font-medium text-forest">
              {replyTo.profile?.display_name ?? replyTo.profile?.username ?? "?"}
            </p>
            <p className="truncate text-sm text-sage">
              {replyTo.is_deleted ? "Nachricht gelöscht" : replyTo.content}
            </p>
          </div>
          <button
            type="button"
            onClick={onClearReply}
            className="text-sage hover:text-forest"
            aria-label="Antwort abbrechen"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex gap-2 p-3">
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        rows={1}
        className="min-h-[44px] max-h-[160px] flex-1 resize-none rounded-xl border-2 border-warm bg-white px-4 py-2.5 text-forest placeholder:text-sage/60 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 disabled:opacity-50"
      />
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={handleSubmit}
        disabled={disabled}
        className="shrink-0 self-end"
        aria-label="Nachricht senden"
      >
        <Send className="h-5 w-5" aria-hidden />
      </Button>
      </div>
    </div>
  );
}
