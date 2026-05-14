import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";

export function useAccess(lessonId: string, lessonType: "free" | "premium") {
  const { user } = useAuthStore();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (lessonType === "free") {
      setHasAccess(true);
      setIsLoading(false);
      return;
    }

    if (!user) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    async function checkAccess() {
      setIsLoading(true);

      const [purchaseRes, subRes] = await Promise.all([
        supabase
          .from("purchases")
          .select("id")
          .eq("user_id", user!.id)
          .eq("lesson_id", lessonId)
          .maybeSingle(),
        supabase
          .from("subscriptions")
          .select("expires_at")
          .eq("user_id", user!.id)
          .eq("is_active", true)
          .gt("expires_at", new Date().toISOString())
          .maybeSingle(),
      ]);

      setHasAccess(!!(purchaseRes.data || subRes.data));
      setIsLoading(false);
    }

    checkAccess();
  }, [lessonId, lessonType, user?.id]);

  return { hasAccess, isLoading };
}
