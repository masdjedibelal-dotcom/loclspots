import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CollabNewForm } from "./CollabNewForm";

export default async function CollabNewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: chatrooms } = await supabase
    .from("chatrooms")
    .select("id, name, emoji")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          Neue Collab erstellen
        </h1>
        <p className="mt-1 text-sage">
          Teile deine Lieblingsorte mit der Community.
        </p>
      </div>

      <CollabNewForm chatrooms={chatrooms ?? []} />
    </div>
  );
}
