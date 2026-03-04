import Link from "next/link";

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
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${basePath}?${params.toString()}`;
  };

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 py-8">
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          ← Zurück
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-gray-300">← Zurück</span>
      )}

      <div className="hidden items-center gap-1 sm:flex">
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`d${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={buildUrl(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors ${
                page === currentPage ? "bg-[#2D5016] font-medium text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      <span className="px-3 text-sm text-gray-500 sm:hidden">
        Seite {currentPage} von {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          Weiter →
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-gray-300">Weiter →</span>
      )}
    </div>
  );
}
