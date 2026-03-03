"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
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
        😕
      </span>
      <h1 className="font-serif text-2xl text-forest">Etwas ist schiefgelaufen</h1>
      <p className="mt-2 max-w-md text-sage">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
      </p>
      <Button className="mt-6" onClick={reset}>
        Erneut versuchen
      </Button>
    </div>
  );
}
