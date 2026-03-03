import { EventCardSkeleton } from "@/components/ui/Skeletons";

export default function ProfilLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-warm/60" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-warm/60" />
      </div>

      <div className="rounded-xl border border-warm bg-cream/30 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-warm/60" />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="mx-auto h-7 w-40 animate-pulse rounded bg-warm/60 sm:mx-0" />
            <div className="mx-auto h-4 w-24 animate-pulse rounded bg-warm/60 sm:mx-0" />
            <div className="flex justify-center gap-4 sm:justify-start">
              <div className="h-4 w-20 animate-pulse rounded bg-warm/60" />
              <div className="h-4 w-20 animate-pulse rounded bg-warm/60" />
              <div className="h-4 w-20 animate-pulse rounded bg-warm/60" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-2 border-b border-warm">
          <div className="h-10 w-28 animate-pulse rounded-t bg-warm/60" />
          <div className="h-10 w-32 animate-pulse rounded-t bg-warm/60" />
          <div className="h-10 w-28 animate-pulse rounded-t bg-warm/60" />
        </div>
        <div className="mt-6 space-y-4">
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      </div>
    </div>
  );
}
