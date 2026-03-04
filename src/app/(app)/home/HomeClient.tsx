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
    <div className="space-y-6">
      {/* Begrüßung — weniger top-padding da Header da ist */}
      <div className="pt-4 pb-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          {greeting}, {displayName.split(" ")[0] || displayName}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Was passiert gerade in deiner Community.
        </p>
      </div>

      {/* Chatrooms */}
      {chatrooms.length > 0 && (
        <section className="py-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">💬 Chatrooms</h2>
              <p className="text-xs text-gray-500">
                Thematische Gruppen für München ab 30
              </p>
            </div>
            <Link
              href="/chatrooms"
              className="text-sm font-medium text-[#2D5016]"
            >
              Alle →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {chatrooms.map((room) => (
              <Link
                key={room.id}
                href={`/chatrooms/${room.id}`}
                className="rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <div className="mb-2 text-2xl" role="img" aria-hidden>
                  {room.emoji ?? "💬"}
                </div>
                <div className="line-clamp-2 text-sm font-medium text-gray-900">
                  {room.name}
                </div>
                <div className="mt-1 text-xs text-gray-400">{room.category}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
