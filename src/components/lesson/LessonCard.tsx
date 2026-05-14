import { useNavigate } from "react-router-dom";
import type { Lesson } from "../../types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../stores/authStore";

interface LessonCardProps {
  lesson: Lesson;
  hasPurchased?: boolean;
  onBuyClick?: (lesson: Lesson) => void;
  onLoginPrompt?: () => void;
}

const subjectColors: Record<string, string> = {
  alphabets: "from-violet-400 to-violet-600",
  numbers: "from-blue-400 to-blue-600",
  colours: "from-pink-400 to-pink-600",
  shapes: "from-orange-400 to-orange-600",
};

const subjectEmojis: Record<string, string> = {
  alphabets: "🔤",
  numbers: "🔢",
  colours: "🎨",
  shapes: "🔷",
};

export function LessonCard({ lesson, hasPurchased, onBuyClick, onLoginPrompt }: LessonCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAccessible = lesson.type === "free" || hasPurchased;

  function handleOpen() {
    if (!user) {
      onLoginPrompt?.();
      return;
    }
    navigate(`/lesson/${lesson.id}`);
  }

  function handleBuy() {
    if (!user) {
      onLoginPrompt?.();
      return;
    }
    onBuyClick?.(lesson);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-40 bg-gradient-to-br ${subjectColors[lesson.subject]} flex items-center justify-center relative`}>
        {lesson.thumbnail_url ? (
          <img
            src={lesson.thumbnail_url}
            alt={lesson.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">{subjectEmojis[lesson.subject]}</span>
        )}
        {!isAccessible && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="text-white text-4xl">🔒</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{lesson.title}</h3>
          <Badge variant={lesson.subject}>{lesson.subject}</Badge>
        </div>

        {lesson.description && (
          <p className="text-slate-500 text-sm mb-3 line-clamp-2">{lesson.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          {lesson.type === "free" ? (
            <Badge variant="free">Free</Badge>
          ) : hasPurchased ? (
            <Badge variant="free">Purchased ✓</Badge>
          ) : (
            <Badge variant="premium">₹{lesson.price / 100}</Badge>
          )}

          {isAccessible ? (
            <Button size="sm" onClick={handleOpen} aria-label={`Open ${lesson.title}`}>
              Open
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={handleBuy} aria-label={`Buy ${lesson.title} for ₹${lesson.price / 100}`}>
              Buy ₹{lesson.price / 100}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
