import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../stores/authStore";

const SUBJECTS = ["alphabets", "numbers", "colours", "shapes"] as const;

interface UploadProgress {
  name: string;
  progress: number;
  done: boolean;
  error?: string;
}

export function UploadLesson() {
  const { } = useAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState<typeof SUBJECTS[number]>("alphabets");
  const [type, setType] = useState<"free" | "premium">("free");
  const [priceRs, setPriceRs] = useState(49);
  const [sortOrder, setSortOrder] = useState(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !subject) { setError("Please fill all required fields."); return; }
    setError("");
    setSuccess("");
    setUploading(true);
    setProgress([]);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data: lesson, error: insertErr } = await supabase
        .from("lessons")
        .insert({
          title,
          description,
          subject,
          type,
          price: type === "premium" ? priceRs * 100 : 0,
          sort_order: sortOrder,
          is_published: false,
        })
        .select()
        .single();

      if (insertErr || !lesson) throw new Error(insertErr?.message ?? "Failed to create lesson");

      const uploads: UploadProgress[] = [];

      if (thumbnail) {
        uploads.push({ name: `Thumbnail`, progress: 0, done: false });
        setProgress([...uploads]);

        const ext = thumbnail.name.split(".").pop();
        const { error: thumbErr } = await supabase.storage
          .from("lesson-content")
          .upload(`thumbnails/${lesson.id}.${ext}`, thumbnail, { upsert: true });

        if (!thumbErr) {
          const { data: { publicUrl } } = supabase.storage
            .from("lesson-content")
            .getPublicUrl(`thumbnails/${lesson.id}.${ext}`);
          await supabase.from("lessons").update({ thumbnail_url: publicUrl }).eq("id", lesson.id);
        }

        uploads[0] = { ...uploads[0], progress: 100, done: true, error: thumbErr?.message };
        setProgress([...uploads]);
      }

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          uploads.push({ name: file.name, progress: 0, done: false });
          setProgress([...uploads]);

          const idx = uploads.length - 1;
          const formData = new FormData();
          formData.append("lesson_id", lesson.id);
          formData.append("file", file);
          formData.append("file_path", file.name);

          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-upload`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${session?.access_token}` },
              body: formData,
            }
          );

          uploads[idx] = { ...uploads[idx], progress: 100, done: true, error: res.ok ? undefined : await res.text() };
          setProgress([...uploads]);
        }
      }

      await supabase
        .from("lessons")
        .update({ storage_path: `lessons/${lesson.id}/` })
        .eq("id", lesson.id);

      setSuccess(`Lesson "${title}" created. Publish it from Manage Lessons.`);
      setTitle(""); setDescription(""); setThumbnail(null); setFiles(null);
    } catch (e: any) {
      setError(e.message);
    }
    setUploading(false);
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Upload New Lesson</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-violet-400" placeholder="e.g. Learning Alphabets A-Z" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none" placeholder="Brief description of this lesson..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value as any)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-violet-400">
              {SUBJECTS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-violet-400" min={0} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
          <div className="flex rounded-xl bg-slate-100 p-1 w-fit">
            {(["free", "premium"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${type === t ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {type === "premium" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
            <input type="number" value={priceRs} onChange={(e) => setPriceRs(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-violet-400" min={1} />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-50 file:text-violet-700 file:font-semibold hover:file:bg-violet-100" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Files (HTML, images, audio, video)</label>
          <input type="file" multiple accept=".html,.png,.jpg,.jpeg,.gif,.webp,.mp3,.mp4" onChange={(e) => setFiles(e.target.files)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-50 file:text-violet-700 file:font-semibold hover:file:bg-violet-100" />
        </div>

        {progress.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            {progress.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 truncate max-w-xs">{p.name}</span>
                  <span className={p.error ? "text-red-500" : "text-emerald-600"}>{p.error ? "✗ Error" : p.done ? "✓ Done" : "Uploading…"}</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${p.error ? "bg-red-400" : "bg-violet-500"}`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-emerald-50 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">{success}</div>}

        <Button type="submit" size="lg" isLoading={uploading} aria-label="Upload lesson">
          Upload Lesson
        </Button>
      </form>
    </div>
  );
}
