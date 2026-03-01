import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-sage/30 bg-cream/50 py-10 px-6 text-center",
        className
      )}
    >
      {emoji && (
        <span
          className="mb-3 block text-4xl"
          role="img"
          aria-hidden={true}
        >
          {emoji}
        </span>
      )}
      <p className="font-medium text-forest">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-sage">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
