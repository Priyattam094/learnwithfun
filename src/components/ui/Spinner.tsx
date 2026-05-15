interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: 20,
  md: 40,
  lg: 80,
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const px = sizeMap[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 80 80"
      fill="none"
      aria-label="Loading"
      role="status"
      className={className}
      style={{ display: "block" }}
    >
      {/* Outer ring */}
      <circle
        cx="40"
        cy="40"
        r="34"
        stroke="var(--bg-surface-2)"
        strokeWidth="6"
      />
      <circle
        cx="40"
        cy="40"
        r="34"
        stroke="var(--accent-orange)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="53 160"
        style={{
          transformOrigin: "center",
          animation: "spin 1.4s linear infinite",
        }}
      />
      {/* Inner pulsing dots */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={40 + 14 * Math.cos((i * 2 * Math.PI) / 3 - Math.PI / 2)}
          cy={40 + 14 * Math.sin((i * 2 * Math.PI) / 3 - Math.PI / 2)}
          r="4"
          fill="var(--accent-orange)"
          style={{
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            opacity: 0.8,
          }}
        />
      ))}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </svg>
  );
}

export function PageLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        zIndex: "var(--z-modal)",
        animation: "fadeIn 200ms ease",
      }}
      aria-busy="true"
      aria-label="Loading page"
    >
      <Spinner size="lg" />
      <p
        style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontSize: "18px",
          color: "var(--text-secondary)",
          fontWeight: 600,
        }}
      >
        Loading...
      </p>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
