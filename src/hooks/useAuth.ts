"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  display_name?: string | null;
  avatar_url?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user ?? null;
      setUser(u);

      if (u) {
        const { data: p } = await supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", u.id)
          .single();
        setProfile(p ?? null);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          const { data: p } = await supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("id", u.id)
            .single();
          setProfile(p ?? null);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, isLoggedIn: !!user, isLoading };
}
