import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { PageWrapper } from "../components/layout/PageWrapper";
import { LessonCard, LessonCardSkeleton } from "../components/lesson/LessonCard";
import type { Lesson } from "../types";

export function Dashboard() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user && !profile) navigate("/login");
  }, [user, profile, authLoading]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const { data } = await supabase
        .from("purchases")
        .select("lesson_id, lessons(*)")
        .eq("user_id", user!.id);

      if (!cancelled) {
        setPurchases((data ?? []).flatMap((p) => p.lessons ?? []));
        setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  const firstName = profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <PageWrapper>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--accent-orange)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              {greeting} 👋
            </p>
            <h1
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 4vw, 40px)",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              Welcome back, {firstName}!
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
              {isLoading ? "Loading your lessons..." : `You own ${purchases.length} lesson${purchases.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <button
            onClick={() => navigate("/library")}
            aria-label="Browse more lessons"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-visible)",
              borderRadius: "var(--radius-lg)",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all var(--transition-base)",
              minHeight: "44px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-orange)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-orange)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-visible)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            }}
          >
            + Add More Lessons
          </button>
        </div>

        {/* Stat row */}
        {!isLoading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginBottom: "48px",
            }}
            className="sm:grid-cols-4"
          >
            {[
              { label: "Lessons Owned", value: purchases.length, icon: "📚", color: "var(--accent-orange)" },
              { label: "Subjects", value: new Set(purchases.map((l) => l.subject)).size, icon: "🎓", color: "var(--accent-violet)" },
              { label: "Alphabets", value: purchases.filter((l) => l.subject === "alphabets").length, icon: "🔤", color: "#FF6B35" },
              { label: "Numbers", value: purchases.filter((l) => l.subject === "numbers").length, icon: "🔢", color: "#3B82F6" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "28px" }}>{stat.icon}</span>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "32px",
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lessons grid */}
        <h2
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            color: "var(--text-primary)",
            marginBottom: "24px",
          }}
        >
          Your Lessons
        </h2>

        {isLoading ? (
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}
            className="sm:grid-cols-3 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }).map((_, i) => <LessonCardSkeleton key={i} />)}
          </div>
        ) : purchases.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ fontSize: "64px" }}>🎒</div>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "24px", color: "var(--text-primary)" }}>
              No lessons yet
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
              Browse the library and pick your first lesson
            </p>
            <button
              onClick={() => navigate("/library")}
              style={{
                padding: "14px 28px",
                background: "linear-gradient(135deg, var(--accent-orange), #FF8C42)",
                border: "none",
                borderRadius: "var(--radius-lg)",
                color: "white",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "var(--shadow-orange-glow)",
                minHeight: "48px",
              }}
              aria-label="Browse the library"
            >
              Browse Library →
            </button>
          </div>
        ) : (
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}
            className="sm:grid-cols-3 lg:grid-cols-4"
          >
            {purchases.map((lesson, i) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                hasPurchased
                showOpenOnly
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
