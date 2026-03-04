"use client";

import { useState } from "react";
import Link from "next/link";
import { ClientPagination } from "@/components/ui/ClientPagination";
import type { Chatroom } from "@/lib/types";

import { PAGINATION } from "@/lib/constants";

interface ProfileChatroomsProps {
  chatrooms: Chatroom[];
}

export function ProfileChatrooms({ chatrooms }: ProfileChatroomsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(chatrooms.length / PAGINATION.PROFILE));
  const from = (currentPage - 1) * PAGINATION.PROFILE;
  const pageItems = chatrooms.slice(from, from + PAGINATION.PROFILE);

  if (chatrooms.length === 0) {
    return (
      <p className="py-8 text-center text-sage">Noch keinen Chatrooms beigetreten.</p>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {pageItems.map((room) => (
          <Link
            key={room.id}
            href={`/chatrooms/${room.id}`}
            className="flex items-center gap-3 rounded-xl border border-warm p-4 transition-colors hover:border-sage/50"
          >
            <span className="text-2xl">{room.emoji}</span>
            <div>
              <p className="font-medium text-forest">{room.name}</p>
              <p className="text-xs text-sage">{room.member_count} Mitglieder</p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <ClientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
