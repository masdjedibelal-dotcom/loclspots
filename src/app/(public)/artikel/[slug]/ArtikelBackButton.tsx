"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ArtikelBackButton() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  if (from === "dashboard") {
    return (
      <Link
        href="/entdecken?tab=artikel"
        className="text-sm font-medium text-sage transition-colors hover:text-forest"
      >
        ← Zurück zu allen Artikeln
      </Link>
    );
  }

  return (
    <Link
      href="/artikel"
      className="text-sm font-medium text-sage transition-colors hover:text-forest"
    >
      ← Zurück zu allen Artikeln
    </Link>
  );
}
