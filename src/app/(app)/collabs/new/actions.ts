"use server";

import { createClient } from "@/lib/supabase/server";

interface CollabItemInput {
  place_id: string;
  name: string;
  maps_url: string;
  position: number;
  description: string | null;
}

interface CreateCollabInput {
  cover_emoji: string;
  title: string;
  description: string | null;
  category: string;
  chatroom_id: string | null;
  items: CollabItemInput[];
  is_public: boolean;
}

export async function createCollab(input: CreateCollabInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Du musst eingeloggt sein, um eine Collab zu erstellen." };
  }

  const { data: collab, error: collabError } = await supabase
    .from("collabs")
    .insert({
      title: input.title,
      description: input.description || null,
      category: input.category,
      cover_emoji: input.cover_emoji,
      creator_id: user.id,
      is_public: input.is_public,
    })
    .select("id")
    .single();

  if (collabError) {
    return { error: `Collab konnte nicht erstellt werden: ${collabError.message}` };
  }

  if (!collab?.id) {
    return { error: "Collab konnte nicht erstellt werden." };
  }

  if (input.chatroom_id) {
    const { error: linkError } = await supabase
      .from("collab_chatroom_links")
      .insert({
        collab_id: collab.id,
        chatroom_id: input.chatroom_id,
      });

    if (linkError) {
      await supabase.from("collabs").delete().eq("id", collab.id);
      return { error: `Chatroom-Verknüpfung fehlgeschlagen: ${linkError.message}` };
    }
  }

  if (!input.items.length) {
    await supabase.from("collabs").delete().eq("id", collab.id);
    return { error: "Mindestens ein Ort ist erforderlich." };
  }

  const itemsToInsert = input.items.map((item) => ({
    collab_id: collab.id,
    place_id: item.place_id,
    name: item.name,
    maps_url: item.maps_url,
    position: item.position,
    description: item.description || null,
  }));

  const { error: itemsError } = await supabase
    .from("collab_items")
    .insert(itemsToInsert);

  if (itemsError) {
    await supabase.from("collabs").delete().eq("id", collab.id);
    if (input.chatroom_id) {
      await supabase
        .from("collab_chatroom_links")
        .delete()
        .eq("collab_id", collab.id);
    }
    return { error: `Orte konnten nicht gespeichert werden: ${itemsError.message}` };
  }

  return { id: collab.id };
}
