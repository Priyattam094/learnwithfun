import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Lesson } from "../types";

export function useLessons(subject?: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLessons() {
      setIsLoading(true);
      let query = supabase
        .from("lessons")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");

      if (subject && subject !== "all") {
        query = query.eq("subject", subject);
      }

      const { data, error } = await query;
      if (error) setError(error.message);
      else setLessons(data ?? []);
      setIsLoading(false);
    }

    fetchLessons();
  }, [subject]);

  return { lessons, isLoading, error };
}
