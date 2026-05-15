import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      <Navbar />
      <main
        className="flex-1"
        style={{ animation: "pageEnter 300ms ease" }}
      >
        {children}
      </main>
      <Footer />
      <style>{`
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
