"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  BookOpen,
  FileText,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/(app)/actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/chatrooms", label: "Chatrooms", icon: MessageCircle },
  { href: "/collabs", label: "Collabs", icon: BookOpen },
  { href: "/artikel", label: "Artikel", icon: FileText },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/profil", label: "Profil", icon: User },
];

interface AppSidebarProps {
  displayName: string;
  avatarUrl: string | null;
}

export function AppSidebar({ displayName, avatarUrl }: AppSidebarProps) {
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="hidden h-screen w-[240px] shrink-0 flex-col border-r border-sage/20 bg-[#F7F3EF] lg:flex">
      <div className="p-4">
        <Link href="/" className="font-serif text-xl tracking-tight">
          <span className="text-forest">Locl</span>
          <span className="text-peach">Spots</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-forest text-white"
                  : "text-sage hover:bg-sage/10 hover:text-forest"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sage/20 p-3">
        <Link
          href="/profil"
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sage/10"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sage/30 text-xs font-medium text-forest">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(displayName)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-forest">
              {displayName}
            </p>
          </div>
        </Link>
        <form action={logout} className="mt-2">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sage transition-colors hover:bg-sage/10 hover:text-forest"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Abmelden
          </button>
        </form>
      </div>
    </aside>
  );
}
