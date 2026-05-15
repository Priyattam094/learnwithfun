import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import type { Lesson, Subscription } from "../types";

export function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // BUG FIX #2: guard with !profile to prevent premature redirect on reload
    if (!authLoading && !user && !profile) navigate("/login?redirect=/my-lessons");
  }, [user, profile, authLoading]);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      // BUG FIX #7: try/finally ensures spinner always clears even on error
      setIsLoading(true);
      try {
        const [purchasesRes, subRes] = await Promise.all([
          supabase
            .from("purchases")
            .select("lesson_id, lessons(*)")
            .eq("user_id", user!.id),
          supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user!.id)
            .eq("is_active", true)
            .gt("expires_at", new Date().toISOString())
            .maybeSingle(),
        ]);
        const purchased = (purchasesRes.data ?? [])
          .map((p: any) => p.lessons)
          .filter(Boolean);
        setLessons(purchased);
        setSubscription(subRes.data);
      } catch (err) {
        console.error("[Dashboard] fetchData failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  if (authLoading || isLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          {profile?.avatar_url && (
            <img src={profile.avatar_url} alt="" className="w-14 h-14 rounded-full" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Hi, {profile?.full_name ?? "there"}! 👋
            </h1>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>

        {subscription?.is_active && (
          <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-2xl p-5 mb-8 flex items-center gap-4">
            <span className="text-3xl">⭐</span>
            <div>
              <p className="font-bold text-lg">Active Subscription</p>
              <p className="text-violet-200 text-sm">
                {subscription.plan} plan · Expires {new Date(subscription.expires_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-800 mb-4">My Lessons ({lessons.length})</h2>

        {lessons.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-xl mb-4">No lessons yet — browse the library!</p>
            <Button onClick={() => navigate("/library")} aria-label="Browse library">
              Browse Library
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                  {lesson.thumbnail_url ? (
                    <img src={lesson.thumbnail_url} alt={lesson.title} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">📖</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 text-lg mb-3">{lesson.title}</h3>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    aria-label={`Open ${lesson.title}`}
                  >
                    Open Lesson
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
