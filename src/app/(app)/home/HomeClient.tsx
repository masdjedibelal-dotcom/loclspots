"use client";

import Link from "next/link";
import type { Chatroom } from "@/lib/types";

interface HomeClientProps {
  displayName: string;
  greeting: string;
  chatrooms: Chatroom[];
}

export function HomeClient({
  displayName,
  greeting,
  chatrooms,
}: HomeClientProps) {
  return (
    <div className="space-y-8">
      {/* Begrüßung */}
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          {greeting}, {displayName}!
        </h1>
        <p className="mt-1 text-sage">
          Was passiert gerade in deiner Community.
        </p>
      </div>

      {/* Chatrooms – 3 Karten, horizontal scrollbar Mobile */}
      {chatrooms.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-forest">
                💬 Aktive Chatrooms
              </h2>
              <p className="text-sm text-sage">
                Wo gerade am meisten los ist
              </p>
            </div>
            <Link
              href="/chatrooms"
              className="shrink-0 text-sm font-medium text-forest"
            >
              Alle anzeigen →
            </Link>
          </div>
          <div
            className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {chatrooms.map((room) => (
              <Link
                key={room.id}
                href={`/chatrooms/${room.id}`}
                className="group flex w-[85vw] shrink-0 snap-start items-start gap-3 rounded-2xl border border-warm bg-white p-4 transition-shadow hover:shadow-md md:w-[340px]"
              >
                <span className="text-3xl" role="img" aria-hidden>
                  {room.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-forest">
                    {room.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-sm text-sage">
                    {room.description ?? ""}
                  </p>
                </div>
                <span className="whitespace-nowrap text-xs font-medium text-forest">
                  Beitreten →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
