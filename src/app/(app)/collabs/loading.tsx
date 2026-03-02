import { CollabCardSkeleton } from "@/components/ui/Skeletons";

export default function CollabsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded bg-warm/60" />
          <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-warm/60" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded-lg bg-warm/60" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CollabCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
