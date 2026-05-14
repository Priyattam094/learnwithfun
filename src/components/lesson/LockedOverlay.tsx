import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import type { Lesson } from "../../types";

interface LockedOverlayProps {
  lesson: Lesson;
}

export function LockedOverlay({ lesson }: LockedOverlayProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-6 p-8 text-center">
      <div className="text-8xl">🔒</div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">This lesson is locked</h2>
        <p className="text-slate-500 text-lg">Buy <strong>{lesson.title}</strong> to start learning!</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          onClick={() => navigate(`/checkout/${lesson.id}`)}
          aria-label={`Buy ${lesson.title} for ₹${lesson.price / 100}`}
        >
          Buy for ₹{lesson.price / 100}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => navigate("/library")}
          aria-label="Browse free lessons"
        >
          Browse Free Lessons
        </Button>
      </div>
    </div>
  );
}
