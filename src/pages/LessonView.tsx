import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useAccess } from "../hooks/useAccess";
import { LockedOverlay } from "../components/lesson/LockedOverlay";
import { Spinner } from "../components/ui/Spinner";
import type { Lesson } from "../types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

function getLessonUrl(lesson: Lesson): string {
  // storage_path is "lessons/{id}/" — main file is index.html
  const path = lesson.storage_path.endsWith("/")
    ? `${lesson.storage_path}index.html`
    : lesson.storage_path;
  return `${SUPABASE_URL}/storage/v1/object/public/lesson-content/${path}`;
}

export function LessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(true);
  const [error, setError] = useState("");
  const [topBarVisible, setTopBarVisible] = useState(true);
  const [interactionTimer, setInteractionTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { hasAccess, isLoading: accessLoading } = useAccess(
    id ?? "",
    lesson?.type ?? "free"
  );

  function resetHideTimer() {
    setTopBarVisible(true);
    if (interactionTimer) clearTimeout(interactionTimer);
    const timer = setTimeout(() => setTopBarVisible(false), 3000);
    setInteractionTimer(timer);
  }

  useEffect(() => {
    return () => { if (interactionTimer) clearTimeout(interactionTimer); };
  }, [interactionTimer]);

  useEffect(() => {
    if (!authLoading && !user && !profile) {
      navigate(`/login?redirect=/lesson/${id}`);
    }
  }, [user, profile, authLoading, id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLessonLoading(true);
    supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError("Lesson not found.");
        setLesson(data);
        setLessonLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const isLoading = authLoading || lessonLoading || accessLoading;
  const lessonUrl = lesson && hasAccess ? getLessonUrl(lesson) : null;

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-base)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
        aria-busy="true"
      >
        <Spinner size="lg" />
        <p
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: "18px",
            color: "var(--text-secondary)",
            fontWeight: 600,
          }}
        >
          Loading your lesson...
        </p>
        <div
          className="skeleton"
          style={{
            width: "min(90vw, 600px)",
            height: "200px",
            borderRadius: "var(--radius-lg)",
            opacity: 0.5,
          }}
        />
      </div>
    );
  }

  // Locked
  if (!hasAccess && lesson) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <LockedOverlay lesson={lesson} />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-base)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>⚠️</div>
          <p
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: "20px",
              color: "var(--error)",
              marginBottom: "24px",
            }}
            role="alert"
          >
            {error}
          </p>
          <button
            onClick={() => navigate("/library")}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              color: "var(--accent-orange)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ← Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
      }}
      onPointerMove={resetHideTimer}
      onPointerDown={resetHideTimer}
    >
      {/* Top bar */}
      <div
        style={{
          background: "rgba(13, 13, 26, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: "var(--z-navbar)",
          transition: "opacity 300ms ease, transform 300ms ease",
          opacity: topBarVisible ? 1 : 0,
          transform: topBarVisible ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <button
          onClick={() => navigate("/library")}
          aria-label="Back to library"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            color: "var(--text-secondary)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "var(--radius-sm)",
            transition: "color var(--transition-fast)",
            minHeight: "44px",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")}
        >
          ← Back to Library
        </button>

        <span
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            color: "var(--text-primary)",
            maxWidth: "50%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {lesson?.title}
        </span>

        <div style={{ width: "80px" }} aria-hidden="true" />
      </div>

      {/* Lesson iframe */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        style={{
          flex: 1,
          position: "relative",
          border: "1px solid var(--border-subtle)",
          margin: "0 16px 16px",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
        className="sm:mx-4 sm:mb-4 mx-0 mb-0 sm:rounded-[var(--radius-lg)] rounded-none"
      >
        {lessonUrl && (
          <iframe
            src={lessonUrl}
            title={lesson?.title ?? "Lesson"}
            style={{ width: "100%", height: "calc(100vh - 88px)", border: "none", display: "block" }}
            sandbox="allow-scripts allow-same-origin"
            aria-label={`Lesson: ${lesson?.title}`}
          />
        )}

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "16px",
            color: "white",
            fontSize: "11px",
            fontFamily: "'Nunito', sans-serif",
            opacity: 0.07,
            pointerEvents: "none",
            userSelect: "none",
          }}
          aria-hidden="true"
        >
          {user?.email}
        </div>
      </div>
    </div>
  );
}
