interface BadgeProps {
  variant: "free" | "premium" | "locked" | "alphabets" | "numbers" | "colours" | "shapes";
  children: React.ReactNode;
}

const variantClasses = {
  free: "bg-emerald-100 text-emerald-800",
  premium: "bg-amber-100 text-amber-800",
  locked: "bg-slate-100 text-slate-600",
  alphabets: "bg-violet-100 text-violet-800",
  numbers: "bg-blue-100 text-blue-800",
  colours: "bg-pink-100 text-pink-800",
  shapes: "bg-orange-100 text-orange-800",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
