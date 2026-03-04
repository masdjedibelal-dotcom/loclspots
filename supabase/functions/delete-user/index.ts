// Wird benötigt weil auth.admin.deleteUser() den Service Role Key braucht

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // User aus JWT ermitteln
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser(token);

  if (getUserError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Auth-User löschen (löscht automatisch auch alle Auth-Daten)
  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("OK", { status: 200 });
});
