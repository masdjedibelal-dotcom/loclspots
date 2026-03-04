"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader() {
  const { user, profile } = useAuth();
  const pathname = usePathname();

  // Auf Chatroom-Detailseite keinen Header zeigen (eigener Header dort)
  if (pathname.startsWith("/chatrooms/")) return null;

  const displayName = profile?.display_name ?? user?.email ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-[#F5F3EE]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/home" className="shrink-0">
          <span className="text-xl font-bold">
            <span className="text-gray-900">Locl</span>
            <span className="text-[#E8651A]">Spots</span>
          </span>
        </Link>

        {/* Rechts: Notifications + Avatar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Benachrichtigungen"
          >
            <Bell className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
          </button>

          <Link href="/profil" className="rounded-full transition-opacity hover:opacity-80">
            <Avatar
              url={profile?.avatar_url}
              name={displayName}
              size="sm"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
