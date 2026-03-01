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
  sendMessage: (content: string) => Promise<void>;
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
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chatroom_id=eq.${chatroomId}`,
        },
        async (payload) => {
          const newMessage = payload.new as {
            id: string;
            chatroom_id: string;
            user_id: string;
            content: string;
            created_at: string;
          };

          if (newMessage.user_id === currentUserId) {
            return;
          }

          const profile = await loadProfile(newMessage.user_id);
          const message: Message = {
            ...newMessage,
            profile: profile ?? undefined,
          };

          setMessages((prev) => [...prev, message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatroomId, currentUserId, loadProfile, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
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
      };

      setMessages((prev) => [...prev, tempMessage]);

      const { data: insertedMessage, error: insertError } = await supabase
        .from("messages")
        .insert({
          chatroom_id: chatroomId,
          user_id: currentUserId,
          content: content.trim(),
        })
        .select("id, chatroom_id, user_id, content, created_at")
        .single();

      if (insertError) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(insertError.message);
      } else if (insertedMessage) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...insertedMessage } as Message : m))
        );
      }

      setIsLoading(false);
    },
    [chatroomId, currentUserId, supabase]
  );

  return {
    messages,
    sendMessage,
    isLoading,
    error,
  };
}
