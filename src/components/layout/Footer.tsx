import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 24px 32px",
        }}
      >
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "48px",
            marginBottom: "48px",
          }}
          className="md:grid-cols-3"
        >
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontSize: "28px" }}>🎓</span>
              <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: "20px", color: "var(--text-primary)" }}>
                <span style={{ color: "var(--accent-orange)" }}>Learn</span> with Fun
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.7, maxWidth: "260px" }}>
              Making learning joyful for kids aged 2–8. India's favourite interactive learning platform.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              {["📘", "📸", "🐦"].map((icon, i) => (
                <button
                  key={i}
                  aria-label={["Facebook", "Instagram", "Twitter"][i]}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-visible)",
                    background: "var(--bg-surface-2)",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all var(--transition-base)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-orange)";
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-orange-dim)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-visible)";
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface-2)";
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links column */}
          <div>
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "var(--text-primary)",
                marginBottom: "16px",
              }}
            >
              Explore
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { to: "/library", label: "Lesson Library" },
                { to: "/library?subject=alphabets", label: "Alphabets" },
                { to: "/library?subject=numbers", label: "Numbers" },
                { to: "/my-lessons", label: "My Lessons" },
                { to: "/login", label: "Sign In" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--accent-orange)")}
                  onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--text-secondary)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal column */}
          <div>
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "var(--text-primary)",
                marginBottom: "16px",
              }}
            >
              Legal
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Privacy Policy", "Terms of Service", "Refund Policy", "Contact Us"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--accent-orange)")}
                  onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--text-secondary)")}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            © {new Date().getFullYear()} learnwithfun.co.in — Made with ❤️ in India
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {["🔒 Secure Payments", "📱 Mobile-first", "⭐ 4.9 Rating"].map((item) => (
              <span
                key={item}
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  padding: "4px 12px",
                  background: "var(--bg-surface-2)",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
