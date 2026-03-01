"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ChatroomCard } from "@/components/chat/ChatroomCard";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { Chatroom } from "@/lib/types";

interface ChatroomsClientProps {
  chatrooms: Chatroom[];
  memberIds: string[];
}

const CATEGORIES = [
  { value: "all", label: "Alle" },
  { value: "Kultur & Stadtleben", label: "Kultur" },
  { value: "Outdoor & Natur", label: "Outdoor" },
  { value: "Sport & Fitness", label: "Sport" },
  { value: "Brettspiele", label: "Brettspiele" },
  { value: "Neu in der Stadt", label: "Neu in der Stadt" },
  { value: "Tanzen & Bewegung", label: "Tanzen" },
  { value: "Kochen & Genuss", label: "Kochen" },
  { value: "Schwarzes Brett", label: "Sonstiges" },
];

export function ChatroomsClient({
  chatrooms,
  memberIds: memberIdsArray,
}: ChatroomsClientProps) {
  const memberIds = useMemo(
    () => new Set(memberIdsArray),
    [memberIdsArray]
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredChatrooms = useMemo(() => {
    return chatrooms.filter((room) => {
      const matchesSearch =
        !search ||
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        (room.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        room.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || room.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [chatrooms, search, category]);

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
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === cat.value
                ? "bg-forest text-cream"
                : "bg-warm text-sage hover:bg-sage/20 hover:text-forest"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredChatrooms.map((room) => (
          <ChatroomCard
            key={room.id}
            chatroom={room}
            isMember={memberIds.has(room.id)}
            isActive={room.member_count > 0}
          />
        ))}
      </div>

      {filteredChatrooms.length === 0 && (
        <p className="py-12 text-center text-sage">
          Keine Chatrooms gefunden. Versuche einen anderen Suchbegriff oder
          Kategorie.
        </p>
      )}
    </div>
  );
}
