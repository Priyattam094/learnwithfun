import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  to: string;
  label: string;
  Icon: (props: { active: boolean }) => JSX.Element;
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function LessonsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const hiddenPaths = ["/lesson/", "/checkout/", "/admin", "/login"];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  const guestItems: NavItem[] = [
    { to: "/", label: "Home", Icon: HomeIcon },
    { to: "/library", label: "Library", Icon: LibraryIcon },
    { to: "/login", label: "Account", Icon: AccountIcon },
  ];

  const authItems: NavItem[] = [
    { to: "/", label: "Home", Icon: HomeIcon },
    { to: "/library", label: "Library", Icon: LibraryIcon },
    { to: "/my-lessons", label: "My Lessons", Icon: LessonsIcon },
    { to: "/login", label: "Account", Icon: AccountIcon },
  ];

  // Replace /login with a sign-out-aware account tab for logged-in users
  const signedInItems: NavItem[] = [
    { to: "/", label: "Home", Icon: HomeIcon },
    { to: "/library", label: "Library", Icon: LibraryIcon },
    { to: "/my-lessons", label: "My Lessons", Icon: LessonsIcon },
  ];

  const items = user ? signedInItems : guestItems;
  void authItems; // unused but kept for reference

  function isActive(to: string) {
    return to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  }

  return (
    <nav
      className="sm:hidden"
      aria-label="Mobile navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: "var(--z-navbar)",
        background: "rgba(22, 22, 40, 0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-subtle)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch", height: "60px" }}>
        {items.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                textDecoration: "none",
                color: active ? "var(--accent-orange)" : "var(--text-muted)",
                transition: "color var(--transition-fast)",
                position: "relative",
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "32px",
                    height: "2px",
                    background: "var(--accent-orange)",
                    borderRadius: "0 0 2px 2px",
                  }}
                  aria-hidden="true"
                />
              )}
              <item.Icon active={active} />
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: active ? 700 : 600,
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
