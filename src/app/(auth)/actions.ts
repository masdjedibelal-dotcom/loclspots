"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("returnUrl") as string) || (formData.get("redirect") as string) || "/home";
  const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//")
    ? redirectTo
    : "/home";

  if (!email || !password) {
    return { error: "E-Mail und Passwort sind erforderlich." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Ungültige Anmeldedaten. Bitte überprüfe E-Mail und Passwort." };
    }
    return { error: error.message };
  }

  redirect(safeRedirect);
}

export async function register(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("display_name") as string;
  const username = (formData.get("username") as string)?.toLowerCase().trim();
  const redirectTo = (formData.get("returnUrl") as string) || (formData.get("redirect") as string) || "/home";
  const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//")
    ? redirectTo
    : "/home";

  if (!email || !password || !displayName || !username) {
    return { error: "Alle Felder sind erforderlich." };
  }

  if (username.length < 2) {
    return { error: "Der Username muss mindestens 2 Zeichen haben." };
  }

  if (!/^[a-z0-9_-]+$/.test(username)) {
    return {
      error: "Username darf nur Kleinbuchstaben, Zahlen, Bindestriche und Unterstriche enthalten.",
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, username },
    },
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { error: "Diese E-Mail-Adresse ist bereits registriert." };
    }
    if (authError.message.includes("username") || authError.message.includes("duplicate")) {
      return { error: "Dieser Username ist bereits vergeben." };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Registrierung fehlgeschlagen. Bitte versuche es erneut." };
  }

  // Profil wird per DB-Trigger (handle_new_user) automatisch angelegt
  redirect(safeRedirect);
}
