import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import type { Lesson } from "../../types";

interface LockedOverlayProps {
  lesson: Lesson;
}

export function LockedOverlay({ lesson }: LockedOverlayProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blurred background */}
      {lesson.thumbnail_url && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${lesson.thumbnail_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(32px) brightness(0.2)",
            transform: "scale(1.1)",
          }}
        />
      )}

      {/* Overlay gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(13,13,26,0.6) 0%, rgba(13,13,26,0.95) 70%)",
        }}
      />

      {/* Content card */}
      <div
        style={{
          position: "relative",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-visible)",
          borderRadius: "var(--radius-xl)",
          padding: "48px 40px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          boxShadow: "var(--shadow-card-hover)",
          animation: "slideUp 400ms var(--transition-spring)",
        }}
      >
        {/* Gold lock icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "var(--accent-gold-dim)",
            border: "2px solid var(--accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            margin: "0 auto 24px",
            boxShadow: "var(--shadow-gold-glow)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
          aria-hidden="true"
        >
          🔒
        </div>

        <h2
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: "28px",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          This lesson is locked
        </h2>

        <p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "'Nunito', sans-serif",
            fontSize: "15px",
            lineHeight: 1.7,
            marginBottom: "8px",
          }}
        >
          Buy <strong style={{ color: "var(--text-primary)" }}>{lesson.title}</strong> to unlock full access
        </p>

        {/* Price badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--accent-orange-dim)",
            border: "1px solid var(--border-accent)",
            borderRadius: "var(--radius-pill)",
            padding: "8px 20px",
            margin: "16px 0 32px",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              color: "var(--accent-orange)",
            }}
          >
            ₹{lesson.price / 100}
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>one-time payment</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Button
            size="lg"
            fullWidth
            onClick={() => navigate(`/checkout/${lesson.id}`)}
            aria-label={`Buy ${lesson.title} for ₹${lesson.price / 100}`}
          >
            Buy Now — ₹{lesson.price / 100}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => navigate("/library")}
            aria-label="Browse free lessons"
          >
            ← Browse free lessons
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }
      `}</style>
    </div>
  );
}
