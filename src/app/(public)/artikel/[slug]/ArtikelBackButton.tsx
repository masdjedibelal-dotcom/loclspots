"use client";

import Link from "next/link";

/**
 * Nur für (public)/artikel/[slug] – Startseiten-Header.
 * App-Artikelseite hat eigenen Back-Link in page.tsx.
 */
export function ArtikelBackButton() {
  return (
    <Link
      href="/artikel"
      className="text-sm font-medium text-sage transition-colors hover:text-forest"
    >
      ← Zurück zu allen Artikeln
    </Link>
  );
}
