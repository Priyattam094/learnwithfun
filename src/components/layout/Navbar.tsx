import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="font-bold text-xl text-violet-700">Learn with Fun</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/library"
            className="hidden sm:inline-block px-4 py-2 text-slate-600 hover:text-violet-700 font-medium transition-colors"
          >
            Library
          </Link>

          {user ? (
            <>
              <Link
                to="/my-lessons"
                className="hidden sm:inline-block px-4 py-2 text-slate-600 hover:text-violet-700 font-medium transition-colors"
              >
                My Lessons
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-block px-4 py-2 text-slate-600 hover:text-violet-700 font-medium transition-colors"
                >
                  Admin
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { signOut(); navigate("/"); }}
                aria-label="Sign out"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/login")}
              aria-label="Sign in"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
