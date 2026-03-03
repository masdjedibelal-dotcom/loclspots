"use client";

import { Suspense } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") ?? searchParams.get("redirect") ?? "/home";
  const [state, formAction] = useFormState(login, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="returnUrl" value={returnUrl} />
      <div>
        <h2 className="text-xl font-semibold text-forest">Anmelden</h2>
        <p className="mt-1 text-sm text-sage">
          Willkommen zurück bei LoclSpots
        </p>
      </div>

      {state?.error && (
        <div
          className="rounded-lg border border-peach/50 bg-peach/10 px-4 py-3 text-sm text-peach"
          role="alert"
        >
          {state.error}
        </div>
      )}

      <Input
        label="E-Mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="deine@email.de"
      />

      <Input
        label="Passwort"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      <Button type="submit" className="w-full" variant="primary">
        Anmelden
      </Button>

      <p className="text-center text-sm text-sage">
        Noch kein Konto?{" "}
        <Link
          href={`/register${returnUrl !== "/home" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
          className="font-medium text-forest underline decoration-sage/50 underline-offset-2 hover:decoration-forest"
        >
          Jetzt registrieren
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="animate-pulse rounded-lg bg-warm py-12" />}>
      <LoginForm />
    </Suspense>
  );
}
