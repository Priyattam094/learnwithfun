import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLessons } from "../hooks/useLessons";
import { LessonCard } from "../components/lesson/LessonCard";

const subjects = [
  { key: "alphabets", label: "Alphabets", emoji: "🔤", color: "from-violet-400 to-violet-600", desc: "A to Z with pictures & sounds" },
  { key: "numbers", label: "Numbers", emoji: "🔢", color: "from-blue-400 to-blue-600", desc: "Count 1 to 100, addition basics" },
  { key: "colours", label: "Colours", emoji: "🎨", color: "from-pink-400 to-pink-600", desc: "Rainbow colours & colour mixing" },
  { key: "shapes", label: "Shapes", emoji: "🔷", color: "from-orange-400 to-orange-600", desc: "Circles, squares, triangles & more" },
];

export function Home() {
  const navigate = useNavigate();
  const { lessons: freeLessons } = useLessons();
  const preview = freeLessons.filter((l) => l.type === "free").slice(0, 3);

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-violet-500 to-sky-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🎓✨</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Learning is <span className="text-amber-300">Fun</span>!
          </h1>
          <p className="text-xl sm:text-2xl text-violet-100 mb-8 max-w-2xl mx-auto">
            Interactive lessons for kids aged 2–8. Alphabets, Numbers, Colours & Shapes with audio, animation, and stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/library")}
              aria-label="Browse all lessons"
            >
              🚀 Start Learning Free
            </Button>
            <Button
              size="lg"
              className="bg-white text-violet-700 hover:bg-violet-50"
              onClick={() => navigate("/login")}
              aria-label="Create account"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Subject categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">What does your child want to learn?</h2>
        <p className="text-slate-500 text-center mb-8 text-lg">Pick a subject and start exploring</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {subjects.map((s) => (
            <button
              key={s.key}
              onClick={() => navigate(`/library?subject=${s.key}`)}
              aria-label={`Browse ${s.label} lessons`}
              className={`bg-gradient-to-br ${s.color} text-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:scale-105 transition-transform cursor-pointer min-h-[140px] justify-center`}
            >
              <span className="text-5xl">{s.emoji}</span>
              <span className="font-bold text-xl">{s.label}</span>
              <span className="text-sm opacity-90 text-center">{s.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Free lesson previews */}
      {preview.length > 0 && (
        <section className="bg-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Try for Free</h2>
            <p className="text-slate-500 text-center mb-8 text-lg">No sign-up required for free lessons</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {preview.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} hasPurchased={false} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button size="lg" onClick={() => navigate("/library")} aria-label="View all lessons">
                View All Lessons →
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Simple Pricing</h2>
        <p className="text-slate-500 text-center mb-8 text-lg">Affordable packs, no subscription required</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center">
            <div className="text-4xl mb-3">📖</div>
            <div className="text-3xl font-extrabold text-slate-800">₹19</div>
            <div className="text-slate-500 mt-1 mb-4">per lesson pack</div>
            <ul className="text-slate-600 text-left space-y-2 mb-6">
              <li>✅ One subject lesson</li>
              <li>✅ Unlimited access</li>
              <li>✅ Works on mobile</li>
            </ul>
            <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate("/library")} aria-label="Browse lessons">
              Browse Lessons
            </Button>
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-8 text-center text-white">
            <div className="text-4xl mb-3">🌟</div>
            <div className="text-3xl font-extrabold">₹49</div>
            <div className="text-violet-200 mt-1 mb-4">premium pack</div>
            <ul className="text-violet-100 text-left space-y-2 mb-6">
              <li>✅ Full subject bundle</li>
              <li>✅ Audio + animations</li>
              <li>✅ Printable worksheets</li>
            </ul>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate("/library")} aria-label="Get premium packs">
              Get Premium Packs
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
