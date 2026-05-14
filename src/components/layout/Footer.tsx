import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">
        <p className="font-semibold text-slate-700 mb-1">🎓 Learn with Fun</p>
        <p>Making learning joyful for kids aged 2–8 · India's favourite kids learning app</p>
        <div className="flex justify-center gap-6 mt-4">
          <Link to="/library" className="hover:text-violet-600 transition-colors">Browse Lessons</Link>
          <Link to="/my-lessons" className="hover:text-violet-600 transition-colors">My Lessons</Link>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} learnwithfun.co.in</p>
      </div>
    </footer>
  );
}
