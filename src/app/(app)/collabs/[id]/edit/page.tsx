import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollabEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: collab } = await supabase
    .from("collabs")
    .select("id, title, creator_id")
    .eq("id", id)
    .single();

  if (!collab || collab.creator_id !== user.id) {
    redirect(`/collabs/${id}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-forest">
        Bearbeiten: {collab.title}
      </h1>
      <p className="text-sage">
        Bearbeitungsformular in Arbeit. Bis dahin:{" "}
        <Link href={`/collabs/${id}`} className="text-forest underline">
          Zurück zur Collab
        </Link>
      </p>
    </div>
  );
}
