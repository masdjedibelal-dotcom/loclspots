import { cn } from "@/lib/utils";

type BadgeVariant = "green" | "peach" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-sage/20 text-forest",
  peach: "bg-peach/20 text-peach",
  muted: "bg-warm text-sage",
};

export function Badge({
  children,
  variant = "green",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
