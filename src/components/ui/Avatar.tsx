import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  url?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function Avatar({
  url,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const initials = name
    ?.split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-forest/10",
        sizes[size],
        className
      )}
      aria-label={name ?? undefined}
    >
      {url ? (
        <Image
          src={url}
          alt={name ?? "Avatar"}
          fill
          className="object-cover"
          sizes={size === "xl" ? "80px" : size === "lg" ? "56px" : size === "md" ? "40px" : "32px"}
        />
      ) : (
        <span className="font-semibold text-forest">{initials ?? "?"}</span>
      )}
    </div>
  );
}
