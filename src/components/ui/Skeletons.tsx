import { cn } from "@/lib/utils";

const SKELETON_BG = "bg-warm/60";

export function ChatroomCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border-2 border-warm bg-cream/50 p-4">
      <div
        className={cn("mb-3 h-8 w-8 rounded", SKELETON_BG, "animate-pulse")}
      />
      <div className={cn("mb-1 h-5 w-3/4 rounded", SKELETON_BG, "animate-pulse")} />
      <div className={cn("mb-2 h-4 w-full rounded", SKELETON_BG, "animate-pulse")} />
      <div className={cn("mb-3 h-6 w-20 rounded-full", SKELETON_BG, "animate-pulse")} />
      <div className="mt-auto flex items-center justify-between">
        <div className={cn("h-3 w-24 rounded", SKELETON_BG, "animate-pulse")} />
        <div className={cn("h-8 w-20 rounded", SKELETON_BG, "animate-pulse")} />
      </div>
    </div>
  );
}

export function CollabCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-warm bg-white">
      <div
        className={cn(
          "h-[120px] flex items-center justify-center",
          SKELETON_BG,
          "animate-pulse"
        )}
      >
        <div className={cn("h-12 w-12 rounded", "bg-warm/80", "animate-pulse")} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className={cn("mb-2 h-6 w-20 rounded-full", SKELETON_BG, "animate-pulse")} />
        <div className={cn("mb-1 h-5 w-full rounded", SKELETON_BG, "animate-pulse")} />
        <div className={cn("mb-1 h-4 w-4/5 rounded", SKELETON_BG, "animate-pulse")} />
        <div className="mt-4 flex gap-3">
          <div className={cn("h-8 w-8 rounded-full", SKELETON_BG, "animate-pulse")} />
          <div className={cn("h-3 w-16 rounded", SKELETON_BG, "animate-pulse")} />
        </div>
      </div>
    </div>
  );
}

type MessageSkeletonVariant = "short" | "medium" | "long";

const MESSAGE_WIDTHS: Record<MessageSkeletonVariant, string> = {
  short: "w-32",
  medium: "w-48",
  long: "w-64",
};

export function MessageSkeleton({ variant = "medium" }: { variant?: MessageSkeletonVariant }) {
  return (
    <div className="flex gap-3">
      <div className={cn("h-9 w-9 shrink-0 rounded-full", SKELETON_BG, "animate-pulse")} />
      <div className="flex-1">
        <div className={cn("mb-1 h-3 w-16 rounded", SKELETON_BG, "animate-pulse")} />
        <div
          className={cn(
            "h-12 rounded-2xl rounded-tl-sm",
            SKELETON_BG,
            MESSAGE_WIDTHS[variant],
            "animate-pulse"
          )}
        />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-warm bg-white p-4">
      <div className={cn("h-20 w-16 shrink-0 rounded-lg", SKELETON_BG, "animate-pulse")} />
      <div className="min-w-0 flex-1 space-y-2">
        <div className={cn("h-5 w-3/4 rounded", SKELETON_BG, "animate-pulse")} />
        <div className={cn("h-4 w-full rounded", SKELETON_BG, "animate-pulse")} />
        <div className={cn("h-8 w-24 rounded", SKELETON_BG, "animate-pulse")} />
      </div>
    </div>
  );
}
