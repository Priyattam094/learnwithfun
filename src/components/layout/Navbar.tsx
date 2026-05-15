import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll detection for transparent → blurred navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/library", label: "Library" },
    ...(user ? [{ to: "/my-lessons", label: "My Lessons" }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: "var(--z-navbar)",
          height: "64px",
          background: scrolled
            ? "rgba(13, 13, 26, 0.95)"
            : "rgba(13, 13, 26, 0)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-subtle)" : "none",
          transition: "background 300ms ease, backdrop-filter 300ms ease, border-color 300ms ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label="Learn with Fun — Home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "28px" }}>🎓</span>
            <span
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 800,
                fontSize: "20px",
                color: "var(--text-primary)",
              }}
            >
              <span style={{ color: "var(--accent-orange)" }}>Learn</span> with Fun
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="hidden sm:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  textDecoration: "none",
                  color: isActive(link.to) ? "var(--accent-orange)" : "var(--text-secondary)",
                  background: isActive(link.to) ? "var(--accent-orange-dim)" : "transparent",
                  transition: "all var(--transition-base)",
                  position: "relative",
                }}
              >
                {link.label}
                {isActive(link.to) && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "var(--accent-orange)",
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
            className="hidden sm:flex"
          >
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { signOut(); navigate("/"); }}
                aria-label="Sign out"
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  aria-label="Sign in"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/library")}
                  aria-label="Start learning for free"
                >
                  Start Free →
                </Button>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Overlay — kept for sm+ fallback */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: "var(--z-navbar)",
            display: "flex",
          }}
        >
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(13, 13, 26, 0.8)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            style={{
              position: "relative",
              width: "280px",
              height: "100%",
              background: "var(--bg-surface)",
              borderRight: "1px solid var(--border-visible)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              animation: "slideFromLeft 250ms var(--transition-spring)",
            }}
          >
            {/* Close button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--text-primary)" }}>
                <span style={{ color: "var(--accent-orange)" }}>Learn</span> with Fun
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-visible)",
                  background: "var(--bg-surface-2)",
                  color: "var(--text-secondary)",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  textDecoration: "none",
                  color: isActive(link.to) ? "var(--accent-orange)" : "var(--text-primary)",
                  background: isActive(link.to) ? "var(--accent-orange-dim)" : "transparent",
                  borderLeft: isActive(link.to) ? "3px solid var(--accent-orange)" : "3px solid transparent",
                  transition: "all var(--transition-base)",
                }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ marginTop: "auto" }}>
              {user ? (
                <Button
                  variant="danger"
                  size="md"
                  fullWidth
                  onClick={() => { signOut(); navigate("/"); setMenuOpen(false); }}
                  aria-label="Sign out"
                >
                  Sign Out
                </Button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Button variant="ghost" size="md" fullWidth onClick={() => navigate("/login")} aria-label="Sign in">
                    Sign In
                  </Button>
                  <Button variant="primary" size="md" fullWidth onClick={() => navigate("/library")} aria-label="Start learning">
                    Start Free →
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div style={{ height: "64px" }} />

      <style>{`
        @keyframes slideFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
