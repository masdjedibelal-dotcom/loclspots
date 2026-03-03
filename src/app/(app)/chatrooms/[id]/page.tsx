import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/messages";
import { ChatroomMembers } from "@/components/chat/ChatroomMembers";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Chatroom, Profile } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatroomPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: chatroom } = await supabase
    .from("chatroom_with_member_count")
    .select("*")
    .eq("id", id)
    .single();

  if (!chatroom) redirect("/chatrooms");

  const { data: membership } = await supabase
    .from("chatroom_members")
    .select("id")
    .eq("chatroom_id", id)
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/chatrooms");

  const messages = await getMessages(supabase, id, 50);

  const { data: readRow } = await supabase
    .from("message_reads")
    .select("last_read_at")
    .eq("user_id", user.id)
    .eq("chatroom_id", id)
    .single();

  const lastReadAt = readRow?.last_read_at ?? null;

  const { data: members } = await supabase
    .from("chatroom_members")
    .select("user_id")
    .eq("chatroom_id", id)
    .limit(100);

  const memberUserIds = members?.map((m) => m.user_id) ?? [];
  const { data: memberProfiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", memberUserIds);

  const { data: linkedCollabs } = await supabase
    .from("collabs")
    .select("id, title, category, cover_emoji")
    .eq("chatroom_id", id)
    .limit(3);

  const chatroomData = chatroom as Chatroom & {
    name: string;
    description: string | null;
    emoji: string;
    member_count: number;
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4 lg:flex-row lg:gap-6">
      <div className="flex-1 min-w-0 lg:w-[70%]">
        <ChatWindow
          chatroomId={id}
          chatroomName={chatroomData.name}
          chatroomEmoji={chatroomData.emoji}
          memberCount={chatroomData.member_count}
          initialMessages={messages}
          currentUserId={user.id}
          initialLastReadAt={lastReadAt}
        />
      </div>

      <aside className="w-full shrink-0 space-y-6 rounded-xl border border-warm bg-cream/30 p-4 lg:w-[30%] lg:max-w-sm">
        <div>
          <h3 className="font-semibold text-forest">Über diesen Chatroom</h3>
          <p className="mt-2 text-sm text-sage">
            {chatroomData.description ?? "Keine Beschreibung."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-forest">Mitglieder</h3>
          <ChatroomMembers members={memberProfiles ?? []} />
        </div>

        {linkedCollabs && linkedCollabs.length > 0 && (
          <div>
            <h3 className="font-semibold text-forest">Verknüpfte Collabs</h3>
            <div className="mt-3 space-y-2">
              {linkedCollabs.map((collab) => (
                <Link
                  key={collab.id}
                  href={`/collabs/${collab.id}`}
                  className="flex items-center gap-2 rounded-lg border border-warm bg-white p-3 transition-colors hover:border-sage/50"
                >
                  <span className="text-xl">{collab.cover_emoji ?? "📋"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-forest">
                      {collab.title}
                    </p>
                    <p className="text-xs text-sage">{collab.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
