"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ChatroomError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 block text-5xl" role="img" aria-hidden>
        💬
      </span>
      <h1 className="font-serif text-2xl text-forest">Chatroom konnte nicht geladen werden</h1>
      <p className="mt-2 max-w-md text-sage">
        Dieser Chatroom existiert möglicherweise nicht oder du hast keine Berechtigung, ihn zu
        sehen.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Erneut versuchen</Button>
        <Link
          href="/chatrooms"
          className="inline-flex items-center justify-center rounded-lg border-2 border-sage px-4 py-2 text-sm font-medium text-sage transition-colors hover:bg-sage hover:text-white"
        >
          Zu den Chatrooms
        </Link>
      </div>
    </div>
  );
}
