"use client";

import Link from "next/link";

export function CollabPageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-sage/15 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-12">
        <Link
          href="/home"
          className="shrink-0 font-serif text-[20px] font-bold tracking-tight text-forest hover:text-forest/90"
        >
          Locl<span className="text-peach">Spots</span>
        </Link>
        <Link
          href="/entdecken?tab=collabs"
          className="text-sm font-medium text-sage transition-colors hover:text-forest"
        >
          ← Alle Collabs
        </Link>
      </div>
    </header>
  );
}
