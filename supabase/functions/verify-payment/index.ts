import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const secret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0")).join("");

  if (expectedSig !== razorpay_signature) {
    return new Response("Invalid signature", { status: 400, headers: corsHeaders });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", razorpay_order_id)
    .single();

  if (!order) return new Response("Order not found", { status: 404, headers: corsHeaders });

  await supabase.from("orders")
    .update({ status: "paid", razorpay_payment_id })
    .eq("id", order.id);

  await supabase.from("purchases").upsert({
    user_id: order.user_id,
    lesson_id: order.lesson_id,
    amount_paid: order.amount,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
