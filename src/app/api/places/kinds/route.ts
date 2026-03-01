import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("places")
    .select("kind")
    .not("kind", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const kindSet = new Set<string>();
  for (const row of data ?? []) {
    if (row.kind) kindSet.add(row.kind);
  }
  const kinds = Array.from(kindSet).sort();

  return NextResponse.json({ kinds });
}
