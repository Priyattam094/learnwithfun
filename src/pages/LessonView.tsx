import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useAccess } from "../hooks/useAccess";
import { LockedOverlay } from "../components/lesson/LockedOverlay";
import { Spinner } from "../components/ui/Spinner";
import { PageWrapper } from "../components/layout/PageWrapper";
import type { Lesson } from "../types";

export function LessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [error, setError] = useState("");

  const { hasAccess, isLoading: accessLoading } = useAccess(
    id ?? "",
    lesson?.type ?? "free"
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/login?redirect=/lesson/${id}`);
    }
  }, [user, authLoading, id]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setLesson(data));
  }, [id]);

  useEffect(() => {
    if (!lesson || !user || accessLoading) return;
    if (!hasAccess) return;

    setUrlLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-signed-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ lesson_id: lesson.id }),
        }
      );

      if (res.ok) {
        const { url } = await res.json();
        setSignedUrl(url);
      } else {
        setError("Could not load lesson. Please try again.");
      }
      setUrlLoading(false);
    });
  }, [lesson, user, hasAccess, accessLoading]);

  const isLoading = authLoading || !lesson || accessLoading || urlLoading;

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (!hasAccess && lesson) {
    return (
      <PageWrapper>
        <LockedOverlay lesson={lesson} />
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
          <div>
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/library")}
          className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium"
          aria-label="Back to library"
        >
          ← Back to Library
        </button>
        <span className="text-white font-semibold">{lesson?.title}</span>
        <div className="w-24" />
      </div>

      <div className="flex-1 relative" onContextMenu={(e) => e.preventDefault()}>
        {signedUrl && (
          <iframe
            src={signedUrl}
            title={lesson?.title}
            className="w-full h-full min-h-[calc(100vh-56px)]"
            sandbox="allow-scripts allow-same-origin"
            aria-label={`Lesson: ${lesson?.title}`}
          />
        )}
        {/* Watermark */}
        <div
          className="absolute bottom-4 right-4 text-white text-xs pointer-events-none select-none"
          style={{ opacity: 0.1 }}
          aria-hidden="true"
        >
          {user?.email}
        </div>
      </div>
    </div>
  );
}
