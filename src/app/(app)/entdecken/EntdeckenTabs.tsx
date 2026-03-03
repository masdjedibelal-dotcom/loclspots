"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function EntdeckenTabs() {
  const pathname = usePathname();
  const isArtikel = pathname.startsWith("/artikel");

  return (
    <div className="flex gap-2 border-b border-sage/20 pb-4">
      <Link
        href="/entdecken"
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          !isArtikel
            ? "bg-forest text-white"
            : "bg-warm text-sage hover:bg-sage/20 hover:text-forest"
        )}
      >
        Collabs
      </Link>
      <Link
        href="/artikel"
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          isArtikel
            ? "bg-forest text-white"
            : "bg-warm text-sage hover:bg-sage/20 hover:text-forest"
        )}
      >
        Artikel
      </Link>
    </div>
  );
}
