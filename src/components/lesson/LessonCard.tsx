import { useNavigate } from "react-router-dom";
import type { Lesson } from "../../types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../stores/authStore";

interface LessonCardProps {
  lesson: Lesson;
  hasPurchased?: boolean;
  onBuyClick?: (lesson: Lesson) => void;
  onLoginPrompt?: () => void;
  showOpenOnly?: boolean; // for Dashboard - always shows Open button
  index?: number; // for stagger animation
}

const subjectConfig: Record<string, { gradient: string; glow: string; emoji: string }> = {
  alphabets: {
    gradient: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
    glow: "rgba(255, 107, 53, 0.25)",
    emoji: "🔤",
  },
  numbers: {
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    glow: "rgba(59, 130, 246, 0.25)",
    emoji: "🔢",
  },
  colours: {
    gradient: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
    glow: "rgba(236, 72, 153, 0.25)",
    emoji: "🎨",
  },
  shapes: {
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
    glow: "rgba(245, 158, 11, 0.25)",
    emoji: "🔷",
  },
};

export function LessonCard({
  lesson,
  hasPurchased,
  onBuyClick,
  onLoginPrompt,
  showOpenOnly = false,
  index = 0,
}: LessonCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAccessible = lesson.type === "free" || hasPurchased || showOpenOnly;
  const config = subjectConfig[lesson.subject] ?? subjectConfig.alphabets;

  function handleOpen() {
    if (!user && !showOpenOnly) {
      onLoginPrompt?.();
      return;
    }
    navigate(`/lesson/${lesson.id}`);
  }

  function handleBuy() {
    if (!user) {
      onLoginPrompt?.();
      return;
    }
    onBuyClick?.(lesson);
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        transition: "transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)",
        willChange: "transform",
        display: "flex",
        flexDirection: "column",
        animation: `cardEnter 350ms ease ${index * 60}ms both`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-6px)";
        el.style.boxShadow = `var(--shadow-card-hover), 0 0 20px ${config.glow}`;
        el.style.borderColor = "var(--border-visible)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "var(--shadow-card)";
        el.style.borderColor = "var(--border-subtle)";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          background: config.gradient,
          flexShrink: 0,
        }}
      >
        {lesson.thumbnail_url ? (
          <img
            src={lesson.thumbnail_url}
            alt={lesson.title}
            loading="lazy"
            width={400}
            height={225}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform var(--transition-slow)",
            }}
            onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
            onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            {config.emoji}
          </div>
        )}

        {/* Lock overlay */}
        {!isAccessible && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(13, 13, 26, 0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                fontSize: "32px",
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--accent-orange-dim)",
                border: "2px solid var(--accent-orange)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🔒
            </div>
          </div>
        )}

        {/* Price badge on image — top right */}
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          {lesson.type === "free" ? (
            <Badge variant="free">FREE</Badge>
          ) : hasPurchased ? (
            <Badge variant="free">✓ Owned</Badge>
          ) : (
            <Badge variant="premium">₹{lesson.price / 100}</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        {/* Subject tag */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Badge variant={lesson.subject as any}>
            {config.emoji} {lesson.subject.charAt(0).toUpperCase() + lesson.subject.slice(1)}
          </Badge>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            color: "var(--text-primary)",
            lineHeight: 1.3,
          }}
        >
          {lesson.title}
        </h3>

        {/* Description */}
        {lesson.description && (
          <p
            className="line-clamp-2"
            style={{
              color: "var(--text-secondary)",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            {lesson.description}
          </p>
        )}

        {/* Action button — pushed to bottom */}
        <div style={{ marginTop: "auto", paddingTop: "8px" }}>
          {isAccessible ? (
            <Button
              size="sm"
              fullWidth
              onClick={handleOpen}
              aria-label={`Open ${lesson.title}`}
              style={{
                background: "linear-gradient(135deg, var(--success) 0%, #00F0A0 100%)",
                color: "var(--text-inverse)",
              }}
            >
              Open →
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              fullWidth
              onClick={handleBuy}
              aria-label={`Buy ${lesson.title} for ₹${lesson.price / 100}`}
              leftIcon="🔒"
            >
              Buy ₹{lesson.price / 100}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton card for loading state
export function LessonCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <div
        className="skeleton"
        style={{ aspectRatio: "16/9" }}
      />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="skeleton" style={{ height: "20px", width: "60%", borderRadius: "var(--radius-sm)" }} />
        <div className="skeleton" style={{ height: "16px", width: "90%", borderRadius: "var(--radius-sm)" }} />
        <div className="skeleton" style={{ height: "12px", width: "75%", borderRadius: "var(--radius-sm)" }} />
        <div className="skeleton" style={{ height: "40px", marginTop: "8px", borderRadius: "var(--radius-md)" }} />
      </div>
    </div>
  );
}
