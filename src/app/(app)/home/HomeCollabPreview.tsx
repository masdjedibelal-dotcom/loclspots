import Link from "next/link";
import { cn } from "@/lib/utils";

interface CollabPreview {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  cover_emoji?: string | null;
}

function getCategoryBg(category: string): string {
  const map: Record<string, string> = {
    "Essen & Trinken": "bg-orange-50",
    Outdoor: "bg-green-50",
    Kultur: "bg-purple-50",
    Sport: "bg-blue-50",
    "After Work": "bg-amber-50",
    Sonstiges: "bg-gray-50",
  };
  return map[category] ?? "bg-gray-50";
}

function getCategoryBadge(category: string): string {
  const map: Record<string, string> = {
    "Essen & Trinken": "bg-orange-100 text-orange-700",
    Outdoor: "bg-green-100 text-green-700",
    Kultur: "bg-purple-100 text-purple-700",
    Sport: "bg-blue-100 text-blue-700",
    "After Work": "bg-amber-100 text-amber-700",
    Sonstiges: "bg-gray-100 text-gray-600",
  };
  return map[category] ?? "bg-gray-100 text-gray-600";
}

interface HomeCollabPreviewProps {
  collabs: CollabPreview[];
}

export function HomeCollabPreview({ collabs }: HomeCollabPreviewProps) {
  if (collabs.length === 0) return null;

  return (
    <section className="py-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-forest">
            📍 Entdecke München
          </h2>
          <p className="text-sm text-sage">Kuratierte Listen von Locals</p>
        </div>
        <Link href="/collabs" className="text-sm font-medium text-forest shrink-0">
          Alle anzeigen →
        </Link>
      </div>

      <div
        className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth md:mx-0 md:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {collabs.map((collab) => (
          <Link
            key={collab.id}
            href={`/collabs/${collab.id}`}
            className="flex shrink-0 w-[72vw] min-w-0 snap-start overflow-hidden rounded-2xl border border-warm bg-white transition-shadow hover:shadow-md sm:w-64"
          >
            <div
              className={cn(
                "flex h-28 items-center justify-center text-5xl",
                getCategoryBg(collab.category ?? "")
              )}
            >
              {collab.cover_emoji ?? "📋"}
            </div>
            <div className="p-3">
              {collab.category && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    getCategoryBadge(collab.category ?? "")
                  )}
                >
                  {collab.category}
                </span>
              )}
              <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-forest">
                {collab.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
