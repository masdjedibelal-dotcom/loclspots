"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message, Profile } from "@/lib/types";

const TEMP_ID_PREFIX = "temp-";

interface UseChatOptions {
  chatroomId: string;
  initialMessages: Message[];
  currentUserId: string;
}

interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string, replyTo?: Message | null) => Promise<void>;
  handleReaction: (messageId: string, emoji: string) => Promise<void>;
  handleDelete: (messageId: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useChat({
  chatroomId,
  initialMessages,
  currentUserId,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const markAsRead = useCallback(async () => {
    await supabase.from("message_reads").upsert(
      {
        user_id: currentUserId,
        chatroom_id: chatroomId,
        last_read_at: new Date().toISOString(),
      },
      { onConflict: "user_id,chatroom_id" }
    );
  }, [chatroomId, currentUserId, supabase]);

  const loadProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .eq("id", userId)
        .single();
      return data as Profile | null;
    },
    [supabase]
  );

  useEffect(() => {
    const channel = supabase
      .channel(`chatroom:${chatroomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `chatroom_id=eq.${chatroomId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as {
              id: string;
              chatroom_id: string;
              user_id: string;
              content: string;
              created_at: string;
              reactions?: Record<string, string[]>;
              reply_to_id?: string | null;
            };

            if (newMessage.user_id === currentUserId) return;

            const profile = await loadProfile(newMessage.user_id);
            let reply_to: Message["reply_to"] = undefined;
            if (newMessage.reply_to_id) {
              const replyMsg = await supabase
                .from("messages")
                .select("id, content, is_deleted, user_id")
                .eq("id", newMessage.reply_to_id)
                .single();
              const replyData = replyMsg.data;
              if (replyData) {
                const replyProfile = await loadProfile(replyData.user_id);
                reply_to = {
                  id: replyData.id,
                  content: replyData.content,
                  is_deleted: (replyData as { is_deleted?: boolean }).is_deleted,
                  profiles: replyProfile
                    ? { username: replyProfile.username }
                    : undefined,
                };
              }
            }
            const message: Message = {
              ...newMessage,
              profile: profile ?? undefined,
              reply_to,
            };
            setMessages((prev) => [...prev, message]);
          }

          if (payload.eventType === "UPDATE") {
            const updated = payload.new as {
              id: string;
              reactions?: Record<string, string[]>;
              is_deleted?: boolean;
              content?: string;
            };
            setMessages((prev) =>
              prev.map((m) =>
                m.id === updated.id
                  ? {
                      ...m,
                      reactions: updated.reactions ?? m.reactions,
                      is_deleted: updated.is_deleted ?? m.is_deleted,
                      content: updated.content ?? m.content,
                    }
                  : m
              )
            );
          }
        }
      )
      .subscribe();

    markAsRead();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatroomId, currentUserId, loadProfile, markAsRead, supabase]);

  const sendMessage = useCallback(
    async (content: string, replyTo?: Message | null) => {
      if (!content.trim()) return;

      setError(null);
      setIsLoading(true);

      const tempId = `${TEMP_ID_PREFIX}${Date.now()}`;
      const tempMessage: Message = {
        id: tempId,
        chatroom_id: chatroomId,
        user_id: currentUserId,
        content: content.trim(),
        created_at: new Date().toISOString(),
        profile: undefined,
        reply_to_id: replyTo?.id ?? undefined,
        reply_to: replyTo
          ? {
              id: replyTo.id,
              content: replyTo.content,
              is_deleted: replyTo.is_deleted,
              profiles: replyTo.profile
                ? { username: replyTo.profile.username }
                : undefined,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, tempMessage]);

      const { data: insertedMessage, error: insertError } = await supabase
        .from("messages")
        .insert({
          chatroom_id: chatroomId,
          user_id: currentUserId,
          content: content.trim(),
          reply_to_id: replyTo?.id ?? null,
        })
        .select("id, chatroom_id, user_id, content, created_at, reply_to_id")
        .single();

      if (insertError) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(insertError.message);
      } else if (insertedMessage) {
        const inserted = insertedMessage as { reply_to_id?: string | null };
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? ({
                  ...insertedMessage,
                  reply_to: tempMessage.reply_to,
                } as Message)
              : m
          )
        );
      }

      setIsLoading(false);
    },
    [chatroomId, currentUserId, supabase]
  );

  const handleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      const { data: msg } = await supabase
        .from("messages")
        .select("reactions")
        .eq("id", messageId)
        .single();

      const reactions: Record<string, string[]> = { ...(msg?.reactions ?? {}) };
      const users: string[] = reactions[emoji] ?? [];

      const newUsers = users.includes(currentUserId)
        ? users.filter((u) => u !== currentUserId)
        : [...users, currentUserId];

      if (newUsers.length === 0) delete reactions[emoji];
      else reactions[emoji] = newUsers;

      const { error: updateError } = await supabase
        .from("messages")
        .update({ reactions })
        .eq("id", messageId);

      if (!updateError) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
        );
      }
    },
    [currentUserId, supabase]
  );

  const handleDelete = useCallback(
    async (messageId: string) => {
      const { error: updateError } = await supabase
        .from("messages")
        .update({ is_deleted: true, content: "" })
        .eq("id", messageId)
        .eq("user_id", currentUserId);

      if (!updateError) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, is_deleted: true, content: "" }
              : m
          )
        );
      }
    },
    [currentUserId, supabase]
  );

  return {
    messages,
    sendMessage,
    handleReaction,
    handleDelete,
    markAsRead,
    isLoading,
    error,
  };
}
