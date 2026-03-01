import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-sage/80 text-white",
  "bg-mint/80 text-white",
  "bg-peach/80 text-white",
  "bg-forest/80 text-white",
  "bg-sage/60 text-forest",
  "bg-peach/60 text-forest",
] as const;

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getInitials(displayName: string): string {
  return displayName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}

function getColorClass(username: string): string {
  const index = hashString(username) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

interface AvatarProps {
  avatarUrl: string | null;
  displayName: string;
  username: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({
  avatarUrl,
  displayName,
  username,
  size = "md",
  className,
}: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        className={cn(
          "rounded-full object-cover shrink-0",
          sizeClass,
          className
        )}
      />
    );
  }

  const initials = getInitials(displayName);
  const colorClass = getColorClass(username);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium",
        colorClass,
        sizeClass,
        className
      )}
      aria-label={displayName}
    >
      {initials}
    </div>
  );
}
