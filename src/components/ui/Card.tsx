import { type ReactNode, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  glowColor?: string;
  className?: string;
}

export function Card({
  children,
  hoverable = false,
  glowColor,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        transition: "transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)",
        willChange: hoverable ? "transform" : undefined,
      }}
      className={`
        ${hoverable ? `
          cursor-pointer
          hover:translate-y-[-6px]
          hover:border-[var(--border-visible)]
          hover:shadow-[var(--shadow-card-hover)]
        ` : ""}
        ${className}
      `}
      onMouseEnter={(e) => {
        if (hoverable && glowColor) {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `var(--shadow-card-hover), 0 0 20px ${glowColor}`;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
