"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CollabsClient } from "../collabs/CollabsClient";
import { ArtikelClient } from "./ArtikelClient";
import { cn } from "@/lib/utils";
import type { Collab } from "@/lib/types";
import type { Article } from "@/lib/types";

interface CollabWithItemCount extends Collab {
  itemCount: number;
}

interface EntdeckenClientProps {
  collabs: CollabWithItemCount[];
  articles: Article[];
  currentUserId: string;
}

type TabId = "collabs" | "artikel";

const TABS: { id: TabId; label: string }[] = [
  { id: "collabs", label: "Collabs" },
  { id: "artikel", label: "Artikel" },
];

export function EntdeckenClient({
  collabs,
  articles,
  currentUserId,
}: EntdeckenClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as TabId) || "collabs";

  const setTab = (newTab: TabId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "collabs") {
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }
    router.push(`/entdecken${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          Entdecken
        </h1>
        <p className="mt-1 text-sage">
          Collabs und Artikel – kuratierte Inhalte von der Community.
        </p>
      </div>

      <div className="flex gap-2 border-b border-sage/20 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-forest text-white"
                : "bg-warm text-sage hover:bg-sage/20 hover:text-forest"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "collabs" ? (
        <CollabsClient collabs={collabs} embedded />
      ) : (
        <ArtikelClient articles={articles} embedded />
      )}
    </div>
  );
}
