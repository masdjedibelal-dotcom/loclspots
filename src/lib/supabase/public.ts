import { createClient } from "@supabase/supabase-js";

/**
 * Public Supabase Client — für öffentliche Server Components OHNE Auth.
 *
 * NICHT den Auth-Client (createServerComponentClient / server.ts) verwenden.
 * STATTDESSEN diesen public client mit direkten Env-Variablen.
 *
 * Verwenden für: öffentliche Pages (artikel, collabs detail), generateStaticParams,
 * generateMetadata, Sitemaps — alle Seiten die keinen Auth-Kontext brauchen.
 *
 * Regel: createClient() aus server.ts → nur für Auth-Seiten (Dashboard, Profil, etc.)
 *        supabasePublic → für alle öffentlichen Seiten
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
