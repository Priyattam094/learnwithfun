import { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../../components/ui/Spinner";

export function AdminLayout() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const navItems = [
    { to: "/admin", label: "Dashboard", emoji: "📊" },
    { to: "/admin/upload", label: "Upload Lesson", emoji: "⬆️" },
    { to: "/admin/lessons", label: "Manage Lessons", emoji: "📋" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="font-bold text-violet-700 text-sm">Learn with Fun</span>
          </Link>
          <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
