"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ChatroomCard } from "@/components/chat/ChatroomCard";
import { Input } from "@/components/ui/Input";
import type { Chatroom } from "@/lib/types";

interface ChatroomsClientProps {
  chatrooms: Chatroom[];
  memberIds: string[];
  unreadCounts?: Record<string, number>;
}

export function ChatroomsClient({
  chatrooms,
  memberIds: memberIdsArray,
  unreadCounts = {},
}: ChatroomsClientProps) {
  const memberIds = useMemo(
    () => new Set(memberIdsArray),
    [memberIdsArray]
  );
  const [search, setSearch] = useState("");

  const categories = useMemo(
    () =>
      chatrooms
        .filter((c) => c.is_category)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [chatrooms]
  );

  const subcategories = useMemo(
    () => chatrooms.filter((c) => !c.is_category),
    [chatrooms]
  );

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return { categories, subcategories };
    const q = search.toLowerCase().trim();
    const matches = (r: Chatroom) =>
      r.name.toLowerCase().includes(q) ||
      (r.description ?? "").toLowerCase().includes(q) ||
      (r.category ?? "").toLowerCase().includes(q);
    const filteredSub = subcategories.filter(matches);
    const categoriesWithMatches = categories.filter(
      (cat) =>
        matches(cat) ||
        filteredSub.some((s) => s.parent_id === cat.id)
    );
    return {
      categories: categoriesWithMatches,
      subcategories: filteredSub,
    };
  }, [search, categories, subcategories]);

  const orphans = useMemo(
    () =>
      filteredBySearch.subcategories.filter((s) => !s.parent_id),
    [filteredBySearch.subcategories]
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sage" />
        <Input
          placeholder="Chatrooms durchsuchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Kategorisierte Chatrooms */}
      {filteredBySearch.categories.map((cat) => {
        const children = filteredBySearch.subcategories
          .filter((s) => s.parent_id === cat.id)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        if (children.length === 0) return null;

        return (
          <div key={cat.id} className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-sage px-4 mb-2">
              {cat.emoji} {cat.name}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {children.map((room) => (
                <ChatroomCard
                  key={room.id}
                  chatroom={room}
                  isMember={memberIds.has(room.id)}
                  isActive={(room.member_count ?? 0) > 0}
                  unreadCount={unreadCounts[room.id] ?? 0}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Alte Chatrooms ohne Kategorie — als Fallback anzeigen */}
      {orphans.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-sage px-4 mb-2">
            Weitere Chatrooms
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {orphans
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((room) => (
                <ChatroomCard
                  key={room.id}
                  chatroom={room}
                  isMember={memberIds.has(room.id)}
                  isActive={(room.member_count ?? 0) > 0}
                  unreadCount={unreadCounts[room.id] ?? 0}
                />
              ))}
          </div>
        </div>
      )}

      {filteredBySearch.categories.length === 0 && orphans.length === 0 && (
        <p className="py-12 text-center text-sage">
          Keine Chatrooms gefunden. Versuche einen anderen Suchbegriff.
        </p>
      )}
    </div>
  );
}
