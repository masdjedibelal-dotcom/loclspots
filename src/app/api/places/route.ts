import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PLACES_SELECT =
  "id, kind, name, place_url, category, img_url, lat, lng, address, rating, review_count, price, website, phone, instagram_url, opening_hours_json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const kind = searchParams.get("kind")?.trim() ?? "";

  const supabase = await createClient();

  let query = supabase
    .from("places")
    .select(PLACES_SELECT)
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(q ? 10 : 20);

  if (q) {
    const pattern = `%${q}%`;
    query = query.or(
      `name.ilike.${pattern},category.ilike.${pattern},address.ilike.${pattern}`
    );
  }
  if (kind) {
    query = query.eq("kind", kind);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ places: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  let body: { name: string; place_url: string; kind?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const name = (body.name?.trim() || "Externer Ort").slice(0, 255);
  const place_url = body.place_url?.trim();
  if (!place_url) {
    return NextResponse.json(
      { error: "Google Maps URL ist erforderlich." },
      { status: 400 }
    );
  }

  const { data: place, error } = await supabase
    .from("places")
    .insert({
      kind: body.kind ?? "external",
      name,
      place_url,
    })
    .select(PLACES_SELECT)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ place });
}
