"use client";

import { CollabCard } from "@/components/collabs/CollabCard";
import type { Collab } from "@/lib/types";

interface CollabWithItemCount extends Collab {
  itemCount: number;
}

interface CollabsClientProps {
  collabs: CollabWithItemCount[];
  /** Eingebettet in Entdecken: nur Grid, keine Filter/Pagination */
  embedded?: boolean;
}

export function CollabsClient({
  collabs,
  embedded = false,
}: CollabsClientProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collabs.map((collab) => (
        <CollabCard
          key={collab.id}
          collab={collab}
          itemCount={collab.itemCount}
        />
      ))}
    </div>
  );
}
