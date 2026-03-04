"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ChatroomCTAProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "button" | "link";
}

/** CTA für Chatrooms: eingeloggt → /chatrooms, sonst → /login */
export function ChatroomCTA({
  className,
  children = "Chatrooms entdecken",
  variant = "button",
}: ChatroomCTAProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (isLoggedIn) {
      router.push("/chatrooms");
    } else {
      router.push("/login?redirect=/chatrooms");
    }
  };

  const baseStyles =
    "inline-flex items-center justify-center rounded-full border-2 border-sage px-7 py-3.5 text-[16px] font-medium text-sage transition-colors hover:border-forest hover:text-forest";

  if (variant === "link") {
    return (
      <a
        href={isLoggedIn ? "/chatrooms" : "/login"}
        onClick={handleClick}
        className={cn(baseStyles, className)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(baseStyles, "disabled:opacity-70", className)}
    >
      {children}
    </button>
  );
}
