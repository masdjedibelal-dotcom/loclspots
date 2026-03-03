import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppBottomNav } from "@/components/layout/AppBottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name ?? "Nutzer";
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div className="flex min-h-screen min-w-0 bg-cream">
      <AppSidebar displayName={displayName} avatarUrl={avatarUrl} />
      <main className="min-w-0 flex-1 overflow-x-hidden pb-20 lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </div>
      </main>
      <AppBottomNav />
    </div>
  );
}
