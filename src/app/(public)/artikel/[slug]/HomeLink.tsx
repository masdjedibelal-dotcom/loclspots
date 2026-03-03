"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function HomeLink() {
  const { user } = useAuth();

  return (
    <Link
      href={user ? "/home" : "/"}
      className="font-serif text-[20px] font-bold tracking-tight text-forest hover:text-forest/90"
    >
      Locl<span className="text-peach">Spots</span>
    </Link>
  );
}
