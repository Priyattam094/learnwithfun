import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable[0]?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0",
        animation: "fadeIn 200ms ease",
      }}
      className="md:items-center md:p-4"
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(13, 13, 26, 0.8)",
          backdropFilter: "blur(12px)",
        }}
        aria-hidden="true"
      />

      {/* Sheet / Dialog */}
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-visible)",
          boxShadow: "var(--shadow-card-hover)",
          width: "100%",
          maxWidth: "480px",
          padding: "32px 24px 40px",
          borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
          animation: "slideUp 350ms var(--transition-spring)",
        }}
        className="md:rounded-[var(--radius-xl)]! md:animation-[slideIn_350ms_var(--transition-spring)]"
      >
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <h2
              id="modal-title"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-visible)",
                background: "var(--bg-surface-2)",
                color: "var(--text-secondary)",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
