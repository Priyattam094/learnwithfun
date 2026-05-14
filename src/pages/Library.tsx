import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageWrapper } from "../components/layout/PageWrapper";
import { LessonCard } from "../components/lesson/LessonCard";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { useLessons } from "../hooks/useLessons";
import { useAuthStore } from "../stores/authStore";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import type { Lesson } from "../types";

const SUBJECTS = ["all", "alphabets", "numbers", "colours", "shapes"] as const;

export function Library() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const subject = params.get("subject") ?? "all";
  const { lessons, isLoading } = useLessons(subject);
  const { user } = useAuthStore();
  const [purchases, setPurchases] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("purchases")
      .select("lesson_id")
      .eq("user_id", user.id)
      .then(({ data }) => setPurchases((data ?? []).map((p) => p.lesson_id)));
  }, [user?.id]);

  function handleBuy(lesson: Lesson) {
    navigate(`/checkout/${lesson.id}`);
  }

  function handleLoginPrompt() {
    setShowLoginModal(true);
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Lesson Library</h1>
        <p className="text-slate-500 mb-6 text-lg">Browse all subjects — free and premium packs</p>

        {/* Subject filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setParams(s === "all" ? {} : { subject: s })}
              aria-label={`Filter by ${s}`}
              className={`px-5 py-2.5 rounded-xl font-semibold capitalize text-sm transition-colors min-h-[44px] ${
                subject === s
                  ? "bg-violet-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-violet-400 hover:text-violet-600"
              }`}
            >
              {s === "all" ? "All" : `${s.charAt(0).toUpperCase()}${s.slice(1)}`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl">No lessons yet in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                hasPurchased={purchases.includes(lesson.id)}
                onBuyClick={handleBuy}
                onLoginPrompt={handleLoginPrompt}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Sign in to continue">
        <p className="text-slate-600 mb-6">Create a free account to buy and access premium lessons.</p>
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate(`/login?redirect=${pendingLesson ? `/checkout/${pendingLesson.id}` : "/library"}`)}
            aria-label="Sign in"
          >
            Sign In / Sign Up
          </Button>
          <Button variant="ghost" size="lg" className="w-full" onClick={() => setShowLoginModal(false)} aria-label="Continue browsing">
            Continue Browsing
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
