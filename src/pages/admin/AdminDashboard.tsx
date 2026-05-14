import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function AdminDashboard() {
  const [stats, setStats] = useState({ lessons: 0, purchases: 0, users: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [{ count: lessons }, { count: purchases }, { count: users }] = await Promise.all([
        supabase.from("lessons").select("*", { count: "exact", head: true }),
        supabase.from("purchases").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      setStats({ lessons: lessons ?? 0, purchases: purchases ?? 0, users: users ?? 0 });
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Lessons", value: stats.lessons, emoji: "📚" },
    { label: "Total Purchases", value: stats.purchases, emoji: "💰" },
    { label: "Total Users", value: stats.users, emoji: "👥" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4">
            <span className="text-4xl">{c.emoji}</span>
            <div>
              <p className="text-3xl font-extrabold text-slate-800">{c.value}</p>
              <p className="text-slate-500 text-sm">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
