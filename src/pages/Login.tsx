import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/Button";

export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") ?? "/library";

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGoogleLogin() {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirect}` },
    });
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (tab === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate(redirect);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    }
    setIsLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "grid",
        gridTemplateColumns: "1fr",
      }}
      className="lg:grid-cols-2"
    >
      {/* Left — Decorative panel (desktop only) */}
      <div
        className="hidden lg:flex"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255,107,53,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(123,47,190,0.12) 0%, transparent 60%), var(--bg-surface)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
        aria-hidden="true"
      >
        {/* Floating bubbles */}
        {[
          { emoji: "A", color: "#FF6B35", x: "12%", y: "15%", size: 100, delay: "0s" },
          { emoji: "1", color: "#3B82F6", x: "60%", y: "8%", size: 84, delay: "0.5s" },
          { emoji: "🎨", color: "#EC4899", x: "72%", y: "55%", size: 76, delay: "1s" },
          { emoji: "▲", color: "#F59E0B", x: "8%", y: "60%", size: 80, delay: "0.3s" },
          { emoji: "★", color: "#FFD700", x: "42%", y: "75%", size: 60, delay: "0.7s" },
          { emoji: "🎓", color: "#7B2FBE", x: "30%", y: "32%", size: 120, delay: "0.2s" },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: `${b.size}px`,
              height: `${b.size}px`,
              borderRadius: "50%",
              background: `${b.color}22`,
              border: `2px solid ${b.color}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: `${b.size * 0.42}px`,
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800,
              color: b.color,
              animation: `float ${2.8 + i * 0.4}s ease-in-out ${b.delay} infinite alternate`,
            }}
          >
            {b.emoji}
          </div>
        ))}

        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎓</div>
          <h2
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800,
              fontSize: "32px",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            <span style={{ color: "var(--accent-orange)" }}>Learn</span> with Fun
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.7 }}>
            Interactive lessons for kids aged 2–8.
            <br />Made with ❤️ in India.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          minHeight: "100vh",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎓</div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: "24px", color: "var(--text-primary)" }}>
              <span style={{ color: "var(--accent-orange)" }}>Learn</span> with Fun
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                fontSize: "32px",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              {tab === "signin" ? "Welcome back 👋" : "Join the fun 🎉"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontFamily: "'Nunito', sans-serif", fontSize: "15px" }}>
              {tab === "signin" ? "Sign in to continue learning" : "Create your free account"}
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            aria-label="Continue with Google"
            style={{
              width: "100%",
              height: "52px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-visible)",
              background: "white",
              color: "#1F2937",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "24px",
              transition: "all var(--transition-base)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")}
          >
            {/* Google SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.51c-.15.96-.74 2.31-1.87 3.17l-.02.14 2.71 2.1.19.02c1.73-1.6 2.73-3.99 2.73-7.1z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45c-.84.59-1.97 1-3.46 1-2.65 0-4.9-1.74-5.7-4.15l-.13.01-2.82 2.18-.04.13C3.83 17.88 6.73 20 10 20z" fill="#34A853"/>
              <path d="M4.3 12.98A6.01 6.01 0 0 1 3.72 10c0-1.04.18-2.04.56-2.98L4.25 6.9 1.4 4.69l-.11.05C.48 6.37 0 8.11 0 10s.48 3.63 1.29 5.26l3.01-2.28z" fill="#FBBC05"/>
              <path d="M10 3.95c1.84 0 3.08.79 3.79 1.46l2.77-2.7C14.95.99 12.7 0 10 0 6.73 0 3.83 2.12 2.29 5.21l3 2.33C6.1 5.7 8.35 3.95 10 3.95z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-visible)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "'Nunito', sans-serif" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-visible)" }} />
          </div>

          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              background: "var(--bg-surface-2)",
              borderRadius: "var(--radius-lg)",
              padding: "4px",
              marginBottom: "24px",
            }}
          >
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  border: "none",
                  transition: "all var(--transition-base)",
                  background: tab === t ? "var(--bg-card)" : "transparent",
                  color: tab === t ? "var(--accent-orange)" : "var(--text-muted)",
                  boxShadow: tab === t ? "var(--shadow-card)" : "none",
                }}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {tab === "signup" && (
              <div>
                <label
                  htmlFor="fullName"
                  style={{
                    display: "block",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="input-base"
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@email.com"
                className="input-base"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
                required
                minLength={6}
                autoComplete={tab === "signin" ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  background: "var(--error-dim)",
                  border: "1px solid rgba(255,71,87,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  color: "var(--error)",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {message && (
              <div
                role="status"
                style={{
                  background: "var(--success-dim)",
                  border: "1px solid rgba(0,212,138,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  color: "var(--success)",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "14px",
                }}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isLoading}
              aria-label={tab === "signin" ? "Sign in" : "Create account"}
              style={{ marginTop: "8px" }}
            >
              {tab === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontFamily: "'Nunito', sans-serif", fontSize: "14px", color: "var(--text-muted)" }}>
            {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setTab(tab === "signin" ? "signup" : "signin")}
              style={{
                color: "var(--accent-orange)",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "14px",
              }}
            >
              {tab === "signin" ? "Sign up →" : "Sign in →"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
