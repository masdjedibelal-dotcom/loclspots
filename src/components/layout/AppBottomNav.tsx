"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, BookOpen, FileText, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/chatrooms", icon: MessageCircle, label: "Chatrooms" },
  { href: "/entdecken", icon: BookOpen, label: "Entdecken" },
  { href: "/artikel", icon: FileText, label: "Artikel" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/profil", icon: User, label: "Profil" },
];

export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-sage/20 bg-[#F7F3EF] py-2 safe-area-inset-bottom lg:hidden">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
              isActive ? "text-forest" : "text-sage"
            )}
          >
            <Icon className="h-6 w-6" />
          </Link>
        );
      })}
    </nav>
  );
}
