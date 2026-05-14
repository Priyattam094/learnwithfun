import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: { user }, error } = await supabase.auth.getUser(
    authHeader.replace("Bearer ", "")
  );
  if (error || !user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const { lesson_id } = await req.json();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("type, storage_path")
    .eq("id", lesson_id)
    .single();

  if (!lesson) return new Response("Lesson not found", { status: 404, headers: corsHeaders });

  if (lesson.type === "premium") {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson_id)
      .maybeSingle();

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("expires_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (!purchase && !subscription) {
      return new Response("Access denied", { status: 403, headers: corsHeaders });
    }
  }

  const path = `${lesson.storage_path}index.html`;
  const { data: signed } = await supabase.storage
    .from("lesson-content")
    .createSignedUrl(path, 600);

  return new Response(JSON.stringify({ url: signed?.signedUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
