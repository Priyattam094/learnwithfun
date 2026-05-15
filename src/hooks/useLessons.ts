import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Lesson } from "../types";

export function useLessons(subject?: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // BUG FIX #8: try/finally ensures isLoading always clears;
    // cancellation flag prevents setState on unmounted component
    async function fetchLessons() {
      setIsLoading(true);
      try {
        let query = supabase
          .from("lessons")
          .select("*")
          .eq("is_published", true)
          .order("sort_order");

        if (subject && subject !== "all") {
          query = query.eq("subject", subject);
        }

        const { data, error } = await query;
        if (cancelled) return;
        if (error) {
          console.error("[useLessons] fetch failed:", error.message);
          setError(error.message);
        } else {
          setLessons(data ?? []);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("[useLessons] unexpected error:", err);
          setError(err.message ?? "Failed to load lessons");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchLessons();
    return () => { cancelled = true; };
  }, [subject]);

  return { lessons, isLoading, error };
}
