import Link from "next/link";
import { cn } from "@/lib/utils";

function buildHref(
  basePath: string,
  page: number,
  searchParams?: Record<string, string>
): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value != null && value !== "") params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [];
  const show = new Set([
    1,
    totalPages,
    currentPage,
    Math.max(1, currentPage - 1),
    Math.min(totalPages, currentPage + 1),
  ]);
  const sorted = Array.from(show).sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      pages.push("ellipsis");
    }
    pages.push(sorted[i]!);
  }
  return pages;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const page = Math.min(Math.max(1, currentPage), totalPages);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 pt-6"
      aria-label="Pagination"
    >
      {/* Desktop: « [1] [2] [3] ... [8] » */}
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          href={buildHref(basePath, page - 1, searchParams)}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            page <= 1
              ? "pointer-events-none cursor-default text-sage/50"
              : "text-sage hover:bg-sage/10 hover:text-forest"
          )}
          aria-label="Vorherige Seite"
        >
          « Zurück
        </Link>

        {pageNumbers.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="px-1 text-sage">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(basePath, p, searchParams)}
              className={cn(
                "min-w-[2.5rem] rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors",
                p === page
                  ? "border-forest bg-forest text-white"
                  : "border-sage/40 text-sage hover:border-forest hover:bg-forest/10 hover:text-forest"
              )}
            >
              {p}
            </Link>
          )
        )}

        <Link
          href={buildHref(basePath, page + 1, searchParams)}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            page >= totalPages
              ? "pointer-events-none cursor-default text-sage/50"
              : "text-sage hover:bg-sage/10 hover:text-forest"
          )}
          aria-label="Nächste Seite"
        >
          Weiter »
        </Link>
      </div>

      {/* Mobile: « Seite X von Y » Weiter » */}
      <div className="flex items-center gap-4 sm:hidden">
        <Link
          href={buildHref(basePath, page - 1, searchParams)}
          className={cn(
            "text-sm font-medium transition-colors",
            page <= 1
              ? "pointer-events-none cursor-default text-sage/50"
              : "text-sage hover:text-forest"
          )}
        >
          « Zurück
        </Link>
        <span className="text-sm text-sage">
          Seite {page} von {totalPages}
        </span>
        <Link
          href={buildHref(basePath, page + 1, searchParams)}
          className={cn(
            "text-sm font-medium transition-colors",
            page >= totalPages
              ? "pointer-events-none cursor-default text-sage/50"
              : "text-sage hover:text-forest"
          )}
        >
          Weiter »
        </Link>
      </div>
    </nav>
  );
}
