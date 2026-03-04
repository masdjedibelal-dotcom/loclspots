"use client";

import { useState } from "react";
import { ClientPagination } from "@/components/ui/ClientPagination";
import { PlaceCardEditorial } from "@/components/collabs/PlaceCardEditorial";
import type { CollabItem } from "@/lib/types";
import type { Place } from "@/lib/types";

import { PAGINATION } from "@/lib/constants";

interface CollabPlacesListProps {
  items: (CollabItem & { place?: Place })[];
}

export function CollabPlacesList({ items }: CollabPlacesListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGINATION.PLACES));
  const from = (currentPage - 1) * PAGINATION.PLACES;
  const pageItems = items.slice(from, from + PAGINATION.PLACES);

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sage">
        Noch keine Orte in dieser Collab.
      </p>
    );
  }

  return (
    <div>
      <h2 className="mb-8 font-serif text-2xl font-bold text-forest">
        Orte in dieser Collab
      </h2>
      <div className="space-y-24">
        {pageItems.map((item, i) => (
          <PlaceCardEditorial
            key={item.id}
            item={item}
            index={from + i}
            reverse={(from + i) % 2 === 1}
          />
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
