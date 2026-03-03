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

  return (
    <div>
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
