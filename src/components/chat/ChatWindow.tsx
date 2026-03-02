"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import type { Message } from "@/lib/types";

interface ChatWindowProps {
  chatroomId: string;
  chatroomName: string;
  chatroomEmoji: string;
  memberCount: number;
  initialMessages: Message[];
  currentUserId: string;
  initialLastReadAt?: string | null;
  onLeave?: () => void;
}

function formatDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Heute";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Gestern";
  }
  return date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function ChatWindow({
  chatroomId,
  chatroomName,
  chatroomEmoji,
  memberCount,
  initialMessages,
  currentUserId,
  initialLastReadAt = null,
  onLeave,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  const { messages, sendMessage, handleReaction, handleDelete, isLoading, error } = useChat({
    chatroomId,
    initialMessages,
    currentUserId,
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleLeave = async () => {
    const { error } = await supabase
      .from("chatroom_members")
      .delete()
      .eq("chatroom_id", chatroomId)
      .eq("user_id", currentUserId);

    if (!error) {
      router.push("/chatrooms");
      onLeave?.();
    }
  };

  let lastDate: string | null = null;
  const lastReadCheck = initialLastReadAt ? new Date(initialLastReadAt) : null;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-warm bg-white lg:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-warm px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{chatroomEmoji}</span>
          <div>
            <h2 className="font-semibold text-forest">{chatroomName}</h2>
            <p className="text-xs text-sage">{memberCount} Mitglieder</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLeave}
          className="rounded-lg px-3 py-2 text-sm text-sage transition-colors hover:bg-sage/10 hover:text-peach"
        >
          Verlassen
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="py-2 text-center">
          <span className="rounded-full bg-warm px-3 py-1 text-xs text-sage">
            🕐 Nachrichten werden nach 24 Stunden automatisch gelöscht
          </span>
        </div>
        <div className="space-y-4">
          {messages.map((message, index) => {
            const msgDate = new Date(message.created_at).toDateString();
            const showDateSeparator = msgDate !== lastDate;
            if (showDateSeparator) lastDate = msgDate;

            const prevMessage = messages[index - 1];
            const showName =
              message.user_id !== currentUserId &&
              (prevMessage?.user_id !== message.user_id || !prevMessage);

            const prevIsBeforeRead =
              !lastReadCheck || new Date(prevMessage?.created_at ?? 0) <= lastReadCheck;
            const thisIsAfterRead =
              lastReadCheck && new Date(message.created_at) > lastReadCheck;
            const isFirstUnread = prevIsBeforeRead && thisIsAfterRead;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.user_id === currentUserId}
                currentUserId={currentUserId}
                showDateSeparator={showDateSeparator}
                dateLabel={
                  showDateSeparator ? formatDateLabel(new Date(message.created_at)) : undefined
                }
                showName={showName}
                isFirstUnread={isFirstUnread}
                onReaction={handleReaction}
                onDelete={handleDelete}
                onReply={(msg) => setReplyTo(msg)}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {error && (
        <p className="px-4 py-2 text-sm text-peach" role="alert">
          {error}
        </p>
      )}

      {/* Input */}
      <div className="sticky bottom-0">
        <MessageInput
          onSend={(content) => {
            sendMessage(content, replyTo);
            setReplyTo(null);
          }}
          disabled={isLoading}
          replyTo={replyTo}
          onClearReply={() => setReplyTo(null)}
        />
      </div>
    </div>
  );
}
