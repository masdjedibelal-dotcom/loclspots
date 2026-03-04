import { supabasePublic } from "@/lib/supabase/public";
import type { Article } from "@/lib/types";

/** Öffentliche Collab für Startseite */
export interface PublicCollab {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  cover_emoji: string | null;
  likes_count: number;
}

/**
 * Lädt alle öffentlichen und veröffentlichten Artikel,
 * sortiert nach created_at absteigend.
 */
export async function getArticles(): Promise<Article[]> {
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_public", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Article[];
}

/**
 * Lädt Artikel paginiert (für Übersichtsseite).
 * @param offset 0-basierter Startindex
 * @param limit Anzahl pro Seite
 * @param category optional: Kategorie-Filter
 */
export async function getArticlesPaginated(
  offset: number,
  limit: number,
  category?: string | null
): Promise<{ data: Article[]; count: number }> {
  const supabase = supabasePublic;
  let query = supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("is_public", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: (data ?? []) as Article[], count: count ?? 0 };
}

/**
 * Lädt die neuesten N Artikel (is_public + is_published).
 * Für Startseite/Blog-Preview.
 */
export async function getLatestArticles(limit: number = 3): Promise<Article[]> {
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_public", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Article[];
}

/**
 * Lädt alle öffentlichen Collabs für die Startseite (Entdecken-Abschnitt).
 * is_public = true (falls Spalte existiert), sonst alle. Sortiert nach created_at DESC.
 */
export async function getPublicCollabs(): Promise<PublicCollab[]> {
  const supabase = supabasePublic;

  const baseQuery = supabase
    .from("collabs")
    .select("id, title, description, category, cover_emoji, likes_count")
    .order("created_at", { ascending: false });

  const { data: withFilter, error: err1 } = await baseQuery.eq("is_public", true);
  if (!err1) return (withFilter ?? []) as PublicCollab[];

  const { data, error } = await baseQuery;
  if (error) throw error;
  return (data ?? []) as PublicCollab[];
}

/**
 * Lädt die neuesten N öffentlichen Collabs (is_public = true).
 */
export async function getLatestPublicCollabs(limit: number = 4): Promise<PublicCollab[]> {
  const supabase = supabasePublic;
  const baseQuery = supabase
    .from("collabs")
    .select("id, title, description, category, cover_emoji, likes_count")
    .order("created_at", { ascending: false })
    .limit(limit);

  const { data: withFilter, error: err1 } = await baseQuery.eq("is_public", true);
  if (!err1) return (withFilter ?? []) as PublicCollab[];

  const { data, error } = await baseQuery;
  if (error) throw error;
  return (data ?? []).slice(0, limit) as PublicCollab[];
}

/** Öffentliches Event für Landing-Page */
export interface PublicEvent {
  id: string;
  title: string;
  start_date?: string | null;
  start_time?: string | null;
  venue_name?: string | null;
  category?: string | null;
  cover_image_url?: string | null;
}

/**
 * Lädt Highlight-Events für die Landing-Page (highlights = true, nicht abgesagt, zukünftig).
 */
export async function getHighlightEvents(limit: number = 5): Promise<PublicEvent[]> {
  const supabase = supabasePublic;
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("events")
    .select("id, title, start_date, start_time, venue_name, category, cover_image_url")
    .eq("highlights", true)
    .eq("is_cancelled", false)
    .gte("start_date", today)
    .order("start_date", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as PublicEvent[];
}

/**
 * Lädt einen Artikel anhand des Slugs für die Detailseite.
 * Nur public + published Artikel.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  return data as Article | null;
}

/**
 * Alle Slugs für generateStaticParams.
 */
export async function getArticleSlugs(): Promise<string[]> {
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("articles")
    .select("slug")
    .eq("is_public", true)
    .eq("is_published", true);

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

/**
 * 2 weitere Artikel aus gleicher Kategorie (ohne aktuelle ID).
 */
export async function getRelatedArticles(
  currentId: string,
  category: string | null,
  limit: number = 2
): Promise<Article[]> {
  if (!category) return [];
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_public", true)
    .eq("is_published", true)
    .eq("category", category)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Article[];
}
