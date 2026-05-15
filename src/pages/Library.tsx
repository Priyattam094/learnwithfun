import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageWrapper } from "../components/layout/PageWrapper";
import { LessonCard, LessonCardSkeleton } from "../components/lesson/LessonCard";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { useLessons } from "../hooks/useLessons";
import { useAuthStore } from "../stores/authStore";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import type { Lesson } from "../types";

const SUBJECTS = ["all", "alphabets", "numbers", "colours", "shapes"] as const;

const subjectLabels: Record<string, string> = {
  all: "All",
  alphabets: "🔤 Alphabets",
  numbers: "🔢 Numbers",
  colours: "🎨 Colours",
  shapes: "🔷 Shapes",
};

type SortOption = "newest" | "price-low" | "free-first";

export function Library() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const subject = params.get("subject") ?? "all";
  const { lessons, isLoading } = useLessons(subject);
  const { user } = useAuthStore();
  const [purchases, setPurchases] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingLesson] = useState<Lesson | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("purchases")
      .select("lesson_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!cancelled) setPurchases((data ?? []).map((p) => p.lesson_id));
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  function handleBuy(lesson: Lesson) {
    navigate(`/checkout/${lesson.id}`);
  }

  function handleLoginPrompt() {
    setShowLoginModal(true);
  }

  // Sort lessons
  const sortedLessons = [...lessons].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "free-first") {
      if (a.type === "free" && b.type !== "free") return -1;
      if (a.type !== "free" && b.type === "free") return 1;
      return 0;
    }
    // newest: default order from hook
    return 0;
  });

  return (
    <PageWrapper>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 40px)",
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Lesson Library
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
            {isLoading ? "Loading lessons..." : `${lessons.length} lessons across 4 subjects`}
          </p>
        </div>

        {/* Filter + Sort row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "36px",
            flexWrap: "wrap",
            position: "sticky",
            top: "64px",
            zIndex: 10,
            background: "var(--bg-base)",
            padding: "16px 0",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {/* Subject filter pills */}
          <div
            className="scroll-hide"
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              flexShrink: 1,
            }}
          >
            {SUBJECTS.map((s) => {
              const active = subject === s;
              return (
                <button
                  key={s}
                  onClick={() => setParams(s === "all" ? {} : { subject: s })}
                  aria-label={`Filter by ${s}`}
                  aria-pressed={active}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "var(--radius-pill)",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all var(--transition-base)",
                    minHeight: "44px",
                    border: active ? "none" : "1px solid var(--border-visible)",
                    background: active
                      ? "linear-gradient(135deg, var(--accent-orange), #FF8C42)"
                      : "var(--bg-surface)",
                    color: active ? "white" : "var(--text-secondary)",
                    boxShadow: active ? "var(--shadow-orange-glow)" : "none",
                  }}
                >
                  {subjectLabels[s]}
                </button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort lessons"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-visible)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              padding: "10px 14px",
              cursor: "pointer",
              minHeight: "44px",
              flexShrink: 0,
              appearance: "none",
              paddingRight: "32px",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A0A0B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="free-first">Free First</option>
          </select>
        </div>

        {/* Lesson grid */}
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
            className="sm:grid-cols-3 lg:grid-cols-4"
            aria-busy="true"
            aria-label="Loading lessons"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <LessonCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedLessons.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ fontSize: "64px" }}>📭</div>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "24px", color: "var(--text-primary)" }}>
              No lessons found
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>Try a different subject filter</p>
            <Button
              variant="ghost"
              onClick={() => setParams({})}
              aria-label="Clear filters"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
            className="sm:grid-cols-3 lg:grid-cols-4 card-grid"
          >
            {sortedLessons.map((lesson, i) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                hasPurchased={purchases.includes(lesson.id)}
                onBuyClick={handleBuy}
                onLoginPrompt={handleLoginPrompt}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Login Modal */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Sign in to continue 👋">
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontFamily: "'Nunito', sans-serif", fontSize: "15px" }}>
          Create a free account to buy and access premium lessons.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button
            size="lg"
            fullWidth
            onClick={() => navigate(`/login?redirect=${pendingLesson ? `/checkout/${pendingLesson.id}` : "/library"}`)}
            aria-label="Sign in or sign up"
          >
            Sign In / Sign Up
          </Button>
          <Button variant="ghost" size="lg" fullWidth onClick={() => setShowLoginModal(false)} aria-label="Continue browsing">
            Continue Browsing
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
