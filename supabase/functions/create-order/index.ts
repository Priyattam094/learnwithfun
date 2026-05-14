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

  const { lesson_id, order_type } = await req.json();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("price, title")
    .eq("id", lesson_id)
    .single();

  if (!lesson) return new Response("Lesson not found", { status: 404, headers: corsHeaders });

  const razorpayKey = Deno.env.get("RAZORPAY_KEY_ID")!;
  const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
  const credentials = btoa(`${razorpayKey}:${razorpaySecret}`);

  const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      amount: lesson.price,
      currency: "INR",
      receipt: `order_${user.id.slice(0, 8)}_${Date.now()}`,
    }),
  });

  const razorpayOrder = await razorpayRes.json();
  if (!razorpayOrder.id) {
    return new Response(JSON.stringify({ error: "Razorpay order creation failed", details: razorpayOrder }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await supabase.from("orders").insert({
    user_id: user.id,
    lesson_id,
    order_type: "lesson",
    razorpay_order_id: razorpayOrder.id,
    amount: lesson.price,
    status: "pending",
  });

  return new Response(
    JSON.stringify({
      order_id: razorpayOrder.id,
      amount: lesson.price,
      currency: "INR",
      lesson_title: lesson.title,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
