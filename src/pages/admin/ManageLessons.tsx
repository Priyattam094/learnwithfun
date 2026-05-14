import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import type { Lesson } from "../../types";

export function ManageLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    setIsLoading(true);
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .order("sort_order");
    setLessons(data ?? []);
    setIsLoading(false);
  }

  async function togglePublish(lesson: Lesson) {
    setSaving(lesson.id);
    await supabase
      .from("lessons")
      .update({ is_published: !lesson.is_published })
      .eq("id", lesson.id);
    setLessons((prev) =>
      prev.map((l) => l.id === lesson.id ? { ...l, is_published: !l.is_published } : l)
    );
    setSaving(null);
  }

  async function updateField(lessonId: string, field: "price" | "type", value: any) {
    const update = field === "price" ? { price: Number(value) * 100 } : { type: value };
    await supabase.from("lessons").update(update).eq("id", lessonId);
    setLessons((prev) =>
      prev.map((l) => l.id === lessonId ? { ...l, ...update } : l)
    );
  }

  async function deleteLesson(lesson: Lesson) {
    if (!confirm(`Delete "${lesson.title}"? This cannot be undone.`)) return;
    setSaving(lesson.id);

    if (lesson.storage_path) {
      const { data: files } = await supabase.storage
        .from("lesson-content")
        .list(lesson.storage_path);
      if (files) {
        await supabase.storage
          .from("lesson-content")
          .remove(files.map((f) => `${lesson.storage_path}${f.name}`));
      }
    }

    await supabase.from("lessons").delete().eq("id", lesson.id);
    setLessons((prev) => prev.filter((l) => l.id !== lesson.id));
    setSaving(null);
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Lessons ({lessons.length})</h1>
        <Button variant="ghost" size="sm" onClick={fetchLessons} aria-label="Refresh lessons">
          ↻ Refresh
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">📭</div>
          <p>No lessons yet. Upload one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Title", "Subject", "Type", "Price (₹)", "Sort", "Published", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-slate-600 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate">{lesson.title}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{lesson.subject}</td>
                    <td className="px-4 py-3">
                      <select
                        value={lesson.type}
                        onChange={(e) => updateField(lesson.id, "type", e.target.value)}
                        className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400"
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue={lesson.price / 100}
                        onBlur={(e) => updateField(lesson.id, "price", e.target.value)}
                        className="border border-slate-200 rounded-lg px-2 py-1 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-violet-400"
                        min={0}
                        disabled={lesson.type === "free"}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{lesson.sort_order}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublish(lesson)}
                        disabled={saving === lesson.id}
                        aria-label={lesson.is_published ? "Unpublish lesson" : "Publish lesson"}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lesson.is_published ? "bg-emerald-500" : "bg-slate-300"}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lesson.is_published ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteLesson(lesson)}
                        isLoading={saving === lesson.id}
                        aria-label={`Delete ${lesson.title}`}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
