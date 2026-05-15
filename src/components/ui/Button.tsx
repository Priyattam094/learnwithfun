import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: `
    bg-gradient-to-r from-[var(--accent-orange)] to-[#FF8C42]
    text-white font-semibold
    hover:brightness-110 hover:scale-[1.02]
    hover:shadow-[var(--shadow-orange-glow)]
    active:scale-[0.97]
  `,
  secondary: `
    bg-transparent border border-[var(--accent-orange)] text-[var(--accent-orange)]
    hover:bg-[var(--accent-orange-dim)] hover:scale-[1.02]
    active:scale-[0.97]
  `,
  ghost: `
    bg-transparent text-[var(--text-primary)]
    border border-[var(--border-visible)]
    hover:bg-[var(--bg-surface-2)] hover:border-[var(--border-accent)]
    active:scale-[0.97]
  `,
  danger: `
    bg-gradient-to-r from-[var(--error)] to-[#FF6070]
    text-white font-semibold
    hover:brightness-110 hover:scale-[1.02]
    active:scale-[0.97]
  `,
};

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-sm min-h-[36px] rounded-[var(--radius-md)]",
  md: "px-6 py-3 text-base min-h-[48px] rounded-[var(--radius-lg)]",
  lg: "px-8 py-4 text-lg min-h-[56px] rounded-[var(--radius-xl)]",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      style={{ willChange: "transform", transition: "transform var(--transition-spring), box-shadow var(--transition-base), brightness var(--transition-fast)" }}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold cursor-pointer
        transition-all
        disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
