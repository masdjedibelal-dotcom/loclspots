"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { joinChatroom } from "@/app/(app)/chatrooms/actions";
import { useToast } from "@/hooks/useToast";
import type { Chatroom } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatroomCardProps {
  chatroom: Chatroom;
  isMember: boolean;
  isActive?: boolean;
  unreadCount?: number;
}

export function ChatroomCard({
  chatroom,
  isMember,
  isActive = true,
  unreadCount = 0,
}: ChatroomCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isJoining, setIsJoining] = React.useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const result = await joinChatroom(chatroom.id);
      if (result?.error) {
        toast(result.error, "error");
        setIsJoining(false);
        return;
      }
      toast("Chatroom beigetreten!", "success");
      router.push(`/chatrooms/${chatroom.id}`);
    } catch {
      toast("Beitritt fehlgeschlagen.", "error");
      setIsJoining(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border-2 border-warm bg-cream/50 p-4 transition-all hover:border-t-4 hover:border-t-mint hover:shadow-md"
      )}
    >
      <span className="mb-3 block text-[32px]" role="img" aria-hidden>
        {chatroom.emoji}
      </span>
      <h3 className="font-semibold text-forest">{chatroom.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-sage">
        {chatroom.description ?? ""}
      </p>
      <div className="mt-3">
        <Badge variant="green">{chatroom.category}</Badge>
      </div>
      <div className="mt-4 flex flex-1 items-end justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-sage">
          <span>{chatroom.member_count} Mitglieder</span>
          {isActive && (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-mint" />
              Live
            </span>
          )}
        </div>
        {isMember ? (
          <Link
            href={`/chatrooms/${chatroom.id}`}
            className="relative inline-flex w-full items-center justify-center rounded-xl border-2 border-sage px-3 py-2 text-sm font-medium text-forest transition-colors hover:bg-sage/10 sm:w-auto"
          >
            Öffnen
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-forest px-1 text-xs font-medium text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={handleJoin}
            isLoading={isJoining}
            disabled={isJoining}
            className="w-full sm:w-auto"
          >
            Beitreten
          </Button>
        )}
      </div>
    </div>
  );
}
