import { ChatroomCardSkeleton, CollabCardSkeleton } from "@/components/ui/Skeletons";

export default function HomeLoading() {
  return (
    <div className="space-y-10">
      <div>
        <div className="h-8 w-64 animate-pulse rounded bg-warm/60" />
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-warm/60" />
      </div>

      <section>
        <div className="mb-3 flex justify-between">
          <div className="h-5 w-36 animate-pulse rounded bg-warm/60" />
          <div className="h-4 w-24 animate-pulse rounded bg-warm/60" />
        </div>
        <div className="space-y-2">
          <ChatroomCardSkeleton />
          <ChatroomCardSkeleton />
          <ChatroomCardSkeleton />
        </div>
      </section>

      <section>
        <div className="mb-3 flex justify-between">
          <div className="h-5 w-32 animate-pulse rounded bg-warm/60" />
          <div className="h-4 w-24 animate-pulse rounded bg-warm/60" />
        </div>
        <div className="space-y-2">
          <CollabCardSkeleton />
          <CollabCardSkeleton />
          <CollabCardSkeleton />
        </div>
      </section>

      <section>
        <div className="mb-3 flex justify-between">
          <div className="h-5 w-40 animate-pulse rounded bg-warm/60" />
          <div className="h-4 w-24 animate-pulse rounded bg-warm/60" />
        </div>
        <div className="space-y-2">
          <div className="flex gap-4 rounded-xl border border-warm bg-cream/50 p-4">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-warm/60" />
            <div className="flex-1">
              <div className="mb-1 h-5 w-48 animate-pulse rounded bg-warm/60" />
              <div className="h-3 w-24 animate-pulse rounded bg-warm/60" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
