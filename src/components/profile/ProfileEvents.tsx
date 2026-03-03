"use client";

import { useState } from "react";
import Link from "next/link";
import { ClientPagination } from "@/components/ui/ClientPagination";
import type { Event } from "@/lib/types";

import { PAGINATION } from "@/lib/constants";

interface ProfileEventsProps {
  events: Event[];
}

function formatEventDate(event: Event): string {
  const dt =
    event.start_datetime ??
    event.start_date ??
    (event as unknown as { date?: string }).date;
  if (!dt) return "Datum folgt";
  return new Date(dt).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function ProfileEvents({ events }: ProfileEventsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(events.length / PAGINATION.PROFILE));
  const from = (currentPage - 1) * PAGINATION.PROFILE;
  const pageItems = events.slice(from, from + PAGINATION.PROFILE);

  if (events.length === 0) {
    return (
      <p className="py-8 text-center text-sage">Keine Events angemeldet.</p>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {pageItems.map((event) => (
          <Link
            key={event.id}
            href="/events"
            className="flex items-center gap-3 rounded-xl border border-warm p-4 transition-colors hover:border-sage/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10 text-sage">
              📅
            </div>
            <div>
              <p className="font-medium text-forest">{event.title}</p>
              <p className="text-xs text-sage">{formatEventDate(event)}</p>
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
