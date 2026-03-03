"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CollabCard } from "@/components/collabs/CollabCard";
import { ClientPagination } from "@/components/ui/ClientPagination";
import type { Collab, Profile } from "@/lib/types";

import { PAGINATION } from "@/lib/constants";

interface ProfileCollabsProps {
  userId: string;
  profile: Profile;
}

export function ProfileCollabs({ userId, profile }: ProfileCollabsProps) {
  const [collabs, setCollabs] = useState<(Collab & { itemCount: number })[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGINATION.PROFILE));
  const from = (currentPage - 1) * PAGINATION.PROFILE;
  const to = from + PAGINATION.PROFILE - 1;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const supabase = createClient();

      // Count
      const { count } = await supabase
        .from("collabs")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", userId);
      setTotalCount(count ?? 0);

      // Daten
      const { data: rawCollabs } = await supabase
        .from("collabs")
        .select("id, title, description, category, chatroom_id, creator_id, cover_emoji, likes_count, created_at")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (!rawCollabs?.length) {
        setCollabs([]);
        setIsLoading(false);
        return;
      }

      // Item-Counts
      const collabIds = rawCollabs.map((c) => c.id);
      const { data: itemCounts } = await supabase
        .from("collab_items")
        .select("collab_id")
        .in("collab_id", collabIds);

      const countMap = new Map<string, number>();
      for (const item of itemCounts ?? []) {
        countMap.set(item.collab_id, (countMap.get(item.collab_id) ?? 0) + 1);
      }

      const enriched = rawCollabs.map((c) => ({
        ...c,
        profile,
        itemCount: countMap.get(c.id) ?? 0,
      })) as (Collab & { itemCount: number })[];

      setCollabs(enriched);
      setIsLoading(false);
    }
    load();
  }, [userId, profile, currentPage]);

  return (
    <div>
      {isLoading ? (
        <p className="py-8 text-center text-sage">Lädt…</p>
      ) : collabs.length === 0 ? (
        <p className="py-8 text-center text-sage">Noch keine Collabs erstellt.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {collabs.map((collab) => (
              <CollabCard key={collab.id} collab={collab} itemCount={collab.itemCount} />
            ))}
          </div>

          {totalPages > 1 && (
            <ClientPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
