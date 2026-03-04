"use client";

import { Suspense } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { register } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function RegisterForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") ?? searchParams.get("redirect") ?? "/home";
  const [state, formAction] = useFormState(register, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="returnUrl" value={returnUrl} />
      <div>
        <h2 className="text-xl font-semibold text-forest">Registrieren</h2>
        <p className="mt-1 text-sm text-sage">
          Werde Teil der LoclSpots Community
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
        autoComplete="new-password"
        required
        minLength={6}
      />

      <Input
        label="Anzeigename"
        name="display_name"
        type="text"
        autoComplete="name"
        required
        placeholder="Max Mustermann"
      />

      <Input
        label="Username"
        name="username"
        type="text"
        autoComplete="username"
        required
        placeholder="maxmustermann"
      />

      <Button type="submit" className="w-full" variant="primary">
        Konto erstellen
      </Button>

      <p className="text-center text-sm text-sage">
        Bereits registriert?{" "}
        <Link
          href={returnUrl !== "/home" ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/login"}
          className="font-medium text-forest underline decoration-sage/50 underline-offset-2 hover:decoration-forest"
        >
          Jetzt anmelden
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="animate-pulse rounded-lg bg-warm py-12" />}>
      <RegisterForm />
    </Suspense>
  );
}
