import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLessons } from "../hooks/useLessons";
import { LessonCard } from "../components/lesson/LessonCard";
import { useScrollReveal } from "../hooks/useScrollReveal";

const subjects = [
  {
    key: "alphabets",
    label: "Alphabets",
    emoji: "🔤",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
    glow: "rgba(255, 107, 53, 0.35)",
    desc: "A to Z with pictures & sounds",
    lessonsCount: "12+ lessons",
  },
  {
    key: "numbers",
    label: "Numbers",
    emoji: "🔢",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    glow: "rgba(59, 130, 246, 0.35)",
    desc: "Count 1 to 100, addition basics",
    lessonsCount: "10+ lessons",
  },
  {
    key: "colours",
    label: "Colours",
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
    glow: "rgba(236, 72, 153, 0.35)",
    desc: "Rainbow colours & colour mixing",
    lessonsCount: "8+ lessons",
  },
  {
    key: "shapes",
    label: "Shapes",
    emoji: "🔷",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
    glow: "rgba(245, 158, 11, 0.35)",
    desc: "Circles, squares, triangles & more",
    lessonsCount: "8+ lessons",
  },
];

const steps = [
  { icon: "🎁", step: "01", title: "Pick a lesson pack", desc: "Browse our growing library of subjects — alphabets, numbers, colours & shapes." },
  { icon: "💳", step: "02", title: "Pay once, own forever", desc: "One-time payment from ₹19. No subscriptions, no hidden fees." },
  { icon: "🎮", step: "03", title: "Child learns through play", desc: "Interactive audio & animation lessons that kids actually want to watch." },
];

export function Home() {
  const navigate = useNavigate();
  const { lessons: freeLessons } = useLessons();
  const preview = freeLessons.filter((l) => l.type === "free").slice(0, 4);

  const subjectsRef = useScrollReveal<HTMLDivElement>();
  const stepsRef = useScrollReveal<HTMLDivElement>();
  const pricingRef = useScrollReveal<HTMLDivElement>();

  return (
    <PageWrapper>
      {/* ── HERO ── */}
      <section
        className="hero-bg"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
            alignItems: "center",
            paddingTop: "40px",
            paddingBottom: "60px",
          }}
          className="lg:grid-cols-[55fr_45fr]"
        >
          {/* Left — Text */}
          <div style={{ animation: "heroLeft 600ms ease 100ms both" }}>
            {/* Eyebrow badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                background: "var(--accent-gold-dim)",
                border: "1px solid rgba(255,215,0,0.3)",
                borderRadius: "var(--radius-pill)",
                marginBottom: "24px",
                animation: "badge-pop 500ms var(--transition-spring) 300ms both",
              }}
            >
              <span>🎓</span>
              <span
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--accent-gold)",
                  letterSpacing: "0.03em",
                }}
              >
                Trusted by 10,000+ parents across India
              </span>
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(36px, 6vw, 64px)",
                lineHeight: 1.1,
                color: "var(--text-primary)",
                marginBottom: "20px",
              }}
            >
              Learning that feels{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent-orange), #FFD700)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                like playtime.
              </span>
            </h1>

            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(16px, 2.5vw, 20px)",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: "520px",
                marginBottom: "36px",
              }}
            >
              Interactive ABC, 123, Colours & Shapes lessons for kids aged 2–8.{" "}
              <strong style={{ color: "var(--text-primary)" }}>₹19 onwards</strong> — pay once,
              learn forever.
            </p>

            {/* CTA row */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
              <Button
                size="lg"
                onClick={() => navigate("/library")}
                aria-label="Start learning for free"
                rightIcon="→"
                style={{ fontSize: "18px" }}
              >
                Start Free
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => {
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }}
                aria-label="See pricing"
              >
                See Pricing
              </Button>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {["🔒 Secure", "📱 Mobile-first", "⭐ 4.9 rating"].map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Floating bubbles */}
          <div
            style={{
              position: "relative",
              height: "420px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "heroRight 600ms ease 200ms both",
            }}
            aria-hidden="true"
          >
            {[
              { emoji: "A", color: "var(--accent-orange)", x: "10%", y: "10%", size: 96, delay: "0s" },
              { emoji: "1", color: "var(--subject-numbers)", x: "55%", y: "5%", size: 88, delay: "0.4s" },
              { emoji: "🎨", color: "var(--subject-colours)", x: "70%", y: "52%", size: 80, delay: "0.8s" },
              { emoji: "▲", color: "var(--subject-shapes)", x: "5%", y: "58%", size: 84, delay: "0.2s" },
              { emoji: "★", color: "var(--accent-gold)", x: "38%", y: "70%", size: 60, delay: "0.6s" },
              { emoji: "🎓", color: "var(--accent-violet)", x: "28%", y: "28%", size: 110, delay: "0.3s" },
            ].map((bubble, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: bubble.x,
                  top: bubble.y,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), transparent 60%), ${bubble.color}22`,
                  border: `2px solid ${bubble.color}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: `${bubble.size * 0.42}px`,
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 800,
                  color: bubble.color,
                  boxShadow: `0 8px 32px ${bubble.color}33`,
                  animation: `float ${2.5 + i * 0.4}s ease-in-out ${bubble.delay} infinite alternate`,
                }}
              >
                {bubble.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            animation: "bounce 2s ease-in-out infinite",
          }}
          aria-hidden="true"
        >
          <div style={{ width: "24px", height: "40px", borderRadius: "12px", border: "2px solid var(--border-visible)", display: "flex", justifyContent: "center", padding: "6px 0" }}>
            <div style={{ width: "4px", height: "8px", borderRadius: "2px", background: "var(--accent-orange)", animation: "scrollDot 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── SUBJECT CATEGORIES ── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <div ref={subjectsRef} className="reveal">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--accent-orange)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
              WHAT TO LEARN
            </p>
            <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "16px" }}>
              Choose your subject
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "440px", margin: "0 auto" }}>
              Pick a subject and dive into interactive lessons your child will love
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
            className="sm:grid-cols-4"
          >
            {subjects.map((s) => (
              <button
                key={s.key}
                onClick={() => navigate(`/library?subject=${s.key}`)}
                aria-label={`Browse ${s.label} lessons`}
                style={{
                  background: s.gradient,
                  borderRadius: "var(--radius-xl)",
                  padding: "clamp(20px, 4vw, 32px) 20px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  minHeight: "clamp(140px, 20vw, 200px)",
                  justifyContent: "center",
                  transition: "transform var(--transition-spring), box-shadow var(--transition-base)",
                  willChange: "transform",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-8px) scale(1.02)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 16px 40px ${s.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                {/* Background shimmer */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,255,255,0.08)",
                    opacity: 0,
                    transition: "opacity var(--transition-base)",
                  }}
                />
                <span style={{ fontSize: "clamp(40px, 6vw, 56px)", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>{s.emoji}</span>
                <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "clamp(16px, 2.5vw, 22px)", color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
                  {s.lessonsCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE LESSONS PREVIEW ── */}
      {preview.length > 0 && (
        <section
          style={{
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border-subtle)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "80px 0",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
              <div>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--accent-orange)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
                  NO SIGN-UP NEEDED
                </p>
                <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "clamp(24px, 3.5vw, 36px)", color: "var(--text-primary)" }}>
                  Try Before You Buy
                </h2>
              </div>
              <button
                onClick={() => navigate("/library")}
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "14px", color: "var(--accent-orange)", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                See all →
              </button>
            </div>

            {/* Horizontal scroll row on mobile, grid on desktop */}
            <div
              className="scroll-hide"
              style={{
                display: "flex",
                gap: "20px",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                paddingBottom: "8px",
              }}
              role="list"
            >
              {preview.map((lesson, i) => (
                <div
                  key={lesson.id}
                  style={{
                    minWidth: "clamp(260px, 30vw, 320px)",
                    scrollSnapAlign: "start",
                    flexShrink: 0,
                  }}
                  role="listitem"
                >
                  <LessonCard lesson={lesson} hasPurchased={false} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
        <div ref={stepsRef} className="reveal">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--accent-orange)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
              HOW IT WORKS
            </p>
            <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)" }}>
              Simple as 1, 2, 3
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "24px",
              position: "relative",
            }}
            className="md:grid-cols-3"
          >
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-xl)",
                  padding: "36px 28px",
                  position: "relative",
                  textAlign: "center",
                  transition: "transform var(--transition-base), border-color var(--transition-base)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-orange)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    position: "absolute",
                    top: "-16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, var(--accent-orange), #FF8C42)",
                    color: "white",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-pill)",
                  }}
                >
                  {step.step}
                </div>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "20px", color: "var(--text-primary)", marginBottom: "12px" }}>
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div ref={pricingRef} className="reveal">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--accent-orange)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
                PRICING
              </p>
              <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-primary)", marginBottom: "12px" }}>
                Simple, affordable pricing
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                No subscription. Pay once, learn forever.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
              }}
              className="sm:grid-cols-2"
            >
              {/* Starter */}
              <div
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "var(--glass-backdrop)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "40px 32px",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>📖</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "48px", color: "var(--text-primary)" }}>
                  ₹19
                </div>
                <div style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-secondary)", marginTop: "4px", marginBottom: "28px" }}>
                  per lesson pack
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                  {["One subject lesson", "Unlimited access", "Works on all devices"].map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)", fontFamily: "'Nunito', sans-serif", fontSize: "15px" }}>
                      <span style={{ color: "var(--success)", fontWeight: 700 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" size="lg" fullWidth onClick={() => navigate("/library")} aria-label="Browse lessons">
                  Browse Lessons
                </Button>
              </div>

              {/* Premium — highlighted */}
              <div
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "var(--glass-backdrop)",
                  border: "2px solid var(--accent-orange)",
                  borderRadius: "var(--radius-xl)",
                  padding: "40px 32px",
                  position: "relative",
                  boxShadow: "var(--shadow-orange-glow)",
                }}
              >
                {/* Most popular badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "-16px",
                    right: "24px",
                    background: "var(--accent-gold)",
                    color: "var(--text-inverse)",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    padding: "6px 14px",
                    borderRadius: "var(--radius-pill)",
                  }}
                >
                  ⭐ Most Popular
                </div>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>🌟</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "48px", color: "var(--accent-orange)" }}>
                  ₹49
                </div>
                <div style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-secondary)", marginTop: "4px", marginBottom: "28px" }}>
                  premium pack
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                  {["Full subject bundle", "Audio + animations", "Printable worksheets", "Priority support"].map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)", fontFamily: "'Nunito', sans-serif", fontSize: "15px" }}>
                      <span style={{ color: "var(--success)", fontWeight: 700 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button size="lg" fullWidth onClick={() => navigate("/library")} aria-label="Get premium packs">
                  Get Premium Packs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes heroLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes heroRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}</style>
    </PageWrapper>
  );
}
