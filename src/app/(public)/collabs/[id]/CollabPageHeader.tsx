"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function CollabPageHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => setIsLoggedIn(!!session));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-sage/15 bg-cream/95 px-6 py-4 backdrop-blur-sm sm:px-12">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link
          href="/"
          className="font-serif text-[20px] font-bold tracking-tight text-forest"
        >
          Locl<span className="text-peach">Spots</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/artikel"
            className="text-[14px] font-medium text-sage hover:text-forest"
          >
            Artikel
          </Link>
          <Link
            href="/collabs"
            className="text-[14px] font-medium text-sage hover:text-forest"
          >
            Alle Collabs
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/chatrooms"
                className="text-[14px] font-medium text-sage hover:text-forest"
              >
                Chatrooms
              </Link>
              <Link
                href="/home"
                className="text-[14px] font-medium text-sage hover:text-forest"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-forest px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-peach"
            >
              Einloggen
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
