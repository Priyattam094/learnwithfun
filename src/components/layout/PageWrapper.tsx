import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

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
        {/* Bottom nav spacer on mobile */}
        <div className="sm:hidden" style={{ height: "72px" }} aria-hidden="true" />
      </main>
      <div className="hidden sm:block">
        <Footer />
      </div>
      <BottomNav />
      <style>{`
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
