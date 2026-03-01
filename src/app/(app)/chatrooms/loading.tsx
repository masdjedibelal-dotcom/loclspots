import { ChatroomCardSkeleton } from "@/components/ui/Skeletons";

export default function ChatroomsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-warm/60" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-warm/60" />
      </div>
      <div className="h-12 w-full max-w-md animate-pulse rounded-lg bg-warm/60" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ChatroomCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
