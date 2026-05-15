import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useAccess } from "../hooks/useAccess";
import { LockedOverlay } from "../components/lesson/LockedOverlay";
import { Spinner } from "../components/ui/Spinner";
import type { Lesson } from "../types";

export function LessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(true);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [error, setError] = useState("");
  const [topBarVisible, setTopBarVisible] = useState(true);
  const [interactionTimer, setInteractionTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { hasAccess, isLoading: accessLoading } = useAccess(
    id ?? "",
    lesson?.type ?? "free"
  );

  // Auto-hide top bar on mobile after inactivity
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

  useEffect(() => {
    if (!lesson || !user || accessLoading || !hasAccess) return;

    let cancelled = false;

    async function fetchSignedUrl() {
      setUrlLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-signed-url`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({ lesson_id: lesson!.id }),
          }
        );
        if (cancelled) return;
        if (res.ok) {
          const { url } = await res.json();
          setSignedUrl(url);
        } else {
          setError("Could not load lesson. Please try again.");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[LessonView] fetchSignedUrl failed:", err);
          setError("Could not load lesson. Please try again.");
        }
      } finally {
        if (!cancelled) setUrlLoading(false);
      }
    }

    fetchSignedUrl();
    const refreshInterval = setInterval(fetchSignedUrl, 9 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(refreshInterval);
    };
  }, [lesson?.id, user?.id, hasAccess, accessLoading]);

  const isLoading = authLoading || lessonLoading || accessLoading || urlLoading;

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
        {/* Skeleton preview */}
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
        {signedUrl && (
          <iframe
            src={signedUrl}
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
