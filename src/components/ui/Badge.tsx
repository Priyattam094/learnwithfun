import { type ReactNode } from "react";

type BadgeVariant = "free" | "premium" | "locked" | "new" | "alphabets" | "numbers" | "colours" | "shapes";

interface BadgeProps {
  variant?: BadgeVariant;
  children?: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  free: "bg-[var(--success)] text-[var(--text-inverse)]",
  premium: "bg-[var(--accent-orange)] text-white",
  locked: "bg-[var(--bg-surface-2)] text-[var(--text-muted)] border border-[var(--border-visible)]",
  new: "bg-[var(--accent-gold)] text-[var(--text-inverse)]",
  alphabets: "bg-[var(--subject-alphabets-dim)] text-[var(--subject-alphabets)] border border-[rgba(255,107,53,0.3)]",
  numbers: "bg-[var(--subject-numbers-dim)] text-[var(--subject-numbers)] border border-[rgba(59,130,246,0.3)]",
  colours: "bg-[var(--subject-colours-dim)] text-[var(--subject-colours)] border border-[rgba(236,72,153,0.3)]",
  shapes: "bg-[var(--subject-shapes-dim)] text-[var(--subject-shapes)] border border-[rgba(245,158,11,0.3)]",
};

const variantIcons: Partial<Record<BadgeVariant, string>> = {
  free: "✦",
  premium: "★",
  locked: "🔒",
  new: "✨",
};

export function Badge({ variant = "free", children, className = "" }: BadgeProps) {
  const icon = variantIcons[variant];

  return (
    <span
      style={{
        animation: "badge-pop 300ms var(--transition-spring) forwards",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 10px",
        borderRadius: "var(--radius-pill)",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.02em",
        fontFamily: "'Nunito', sans-serif",
        whiteSpace: "nowrap",
      }}
      className={`${variantStyles[variant]} ${className}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
