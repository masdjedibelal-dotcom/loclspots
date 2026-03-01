import { createClient } from "@supabase/supabase-js";

/**
 * Einfacher Client ohne Cookies — nur für öffentliche, nicht-auth Queries.
 * Verwenden für: generateStaticParams, generateMetadata, öffentliche Page-Components,
 * Sitemaps und alle Seiten die keinen Auth-Kontext brauchen.
 *
 * Regel: createClient() aus server.ts → nur für Auth-Seiten (Dashboard, Profil, etc.)
 *        supabasePublic → für alle öffentlichen Seiten
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
