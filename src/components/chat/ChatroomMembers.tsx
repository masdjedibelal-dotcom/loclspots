"use client";

import { useState } from "react";
import { ClientPagination } from "@/components/ui/ClientPagination";
import { Avatar } from "@/components/ui/Avatar";

import { PAGINATION } from "@/lib/constants";

interface MemberProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

interface ChatroomMembersProps {
  members: MemberProfile[];
}

export function ChatroomMembers({ members }: ChatroomMembersProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(members.length / PAGINATION.MEMBERS));
  const from = (currentPage - 1) * PAGINATION.MEMBERS;
  const pageItems = members.slice(from, from + PAGINATION.MEMBERS);

  return (
    <div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pageItems.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col items-center gap-1"
            title={profile.display_name ?? undefined}
          >
            <Avatar
              url={profile.avatar_url}
              name={profile.display_name}
              size="sm"
            />
          </div>
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
