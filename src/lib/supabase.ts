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
 * is_public = true, sortiert nach created_at DESC.
 */
export async function getPublicCollabs(): Promise<PublicCollab[]> {
  const supabase = supabasePublic;

  const { data, error } = await supabase
    .from("collabs")
    .select("id, title, description, category, cover_emoji, likes_count")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as PublicCollab[];
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
