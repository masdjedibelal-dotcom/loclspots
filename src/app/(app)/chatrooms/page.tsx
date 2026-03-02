import { createClient } from "@/lib/supabase/server";
import { getUnreadCounts } from "@/lib/reads";
import { ChatroomsClient } from "./ChatroomsClient";
import type { Chatroom } from "@/lib/types";

export default async function ChatroomsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: chatrooms } = await supabase
    .from("chatroom_with_member_count")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("member_count", { ascending: false });

  const { data: memberships } = await supabase
    .from("chatroom_members")
    .select("chatroom_id")
    .eq("user_id", user.id);

  const memberIds = memberships?.map((m) => m.chatroom_id) ?? [];

  const unreadCounts = await getUnreadCounts(supabase, user.id);
  const unreadByChatroom = Object.fromEntries(
    unreadCounts.map((r) => [r.chatroom_id, r.unread_count])
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          Chatrooms
        </h1>
        <p className="mt-1 text-sage">
          Finde Chatrooms nach Themen und tritt bei. Echte Gespräche, keine
          Algorithmen.
        </p>
      </div>

      <ChatroomsClient
        chatrooms={(chatrooms ?? []) as Chatroom[]}
        memberIds={memberIds}
        unreadCounts={unreadByChatroom}
      />
    </div>
  );
}
