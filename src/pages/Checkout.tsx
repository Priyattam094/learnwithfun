import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useRazorpay } from "../hooks/useRazorpay";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import type { Lesson } from "../types";

export function Checkout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { openCheckout } = useRazorpay();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user && !profile) navigate(`/login?redirect=/checkout/${id}`);
  }, [user, profile, authLoading, id]);

  useEffect(() => {
    if (!id) return;
    supabase.from("lessons").select("*").eq("id", id).single().then(({ data }) => setLesson(data));
  }, [id]);

  async function handlePay() {
    if (!lesson || !user) return;
    setError("");
    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ lesson_id: lesson.id, order_type: "lesson" }),
        }
      );

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      await openCheckout({
        orderId: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: "Learn with Fun",
        description: lesson.title,
        prefill: { name: profile?.full_name, email: user.email },
        onSuccess: async (response) => {
          const verifyRes = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify(response),
            }
          );
          if (verifyRes.ok) {
            setSuccess(true);
            setTimeout(() => navigate(`/lesson/${lesson.id}`), 2500);
          } else {
            setError("Payment verification failed. Contact support.");
          }
          setIsProcessing(false);
        },
        onFailure: (err) => {
          setError(err?.description ?? "Payment failed. Please try again.");
          setIsProcessing(false);
        },
      });
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
      setIsProcessing(false);
    }
  }

  // Loading
  if (authLoading || !lesson) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-base)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-success)",
            borderRadius: "var(--radius-xl)",
            padding: "60px 40px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            boxShadow: "var(--shadow-success-glow)",
            animation: "slideUp 400ms var(--transition-spring)",
          }}
        >
          {/* Animated checkmark */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            style={{ margin: "0 auto 24px", display: "block" }}
            aria-label="Payment successful"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="var(--success)"
              strokeWidth="4"
              strokeDasharray="226"
              style={{ animation: "circle-draw 600ms ease forwards" }}
            />
            <path
              d="M24 40 L35 51 L56 29"
              stroke="var(--success)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              style={{ animation: "check-draw 400ms ease 500ms forwards" }}
            />
          </svg>

          <h2
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 700,
              fontSize: "28px",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            You're in! 🎉
          </h2>
          <p style={{ color: "var(--text-secondary)", fontFamily: "'Nunito', sans-serif", fontSize: "15px", marginBottom: "32px" }}>
            <strong style={{ color: "var(--text-primary)" }}>{lesson.title}</strong> is now yours forever.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spinner size="sm" />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "16px" }}>Opening your lesson...</p>
        </div>
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes check-draw {
            from { stroke-dashoffset: 100; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes circle-draw {
            from { stroke-dashoffset: 226; }
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 24px 80px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: "32px",
            padding: "8px 0",
            transition: "color var(--transition-fast)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")}
        >
          ← Back
        </button>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Thumbnail */}
          {lesson.thumbnail_url ? (
            <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
              <img
                src={lesson.thumbnail_url}
                alt={lesson.title}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div
              style={{
                aspectRatio: "16/9",
                background: "linear-gradient(135deg, var(--accent-orange), #FF8C42)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
              }}
            >
              📖
            </div>
          )}

          <div style={{ padding: "28px" }}>
            {/* Lesson info */}
            <h1
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              {lesson.title}
            </h1>
            {lesson.description && (
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px", fontFamily: "'Nunito', sans-serif" }}>
                {lesson.description}
              </p>
            )}

            {/* Benefits list */}
            <div
              style={{
                background: "var(--bg-surface-2)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                marginBottom: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {["Lifetime access", "Works on all devices", "No subscription needed"].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ color: "var(--success)", fontWeight: 700, fontSize: "16px" }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 0",
                borderTop: "1px solid var(--border-subtle)",
                borderBottom: "1px solid var(--border-subtle)",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text-secondary)" }}>
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "32px",
                  color: "var(--accent-orange)",
                }}
              >
                ₹{lesson.price / 100}
              </span>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                style={{
                  background: "var(--error-dim)",
                  border: "1px solid rgba(255,71,87,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  color: "var(--error)",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {/* Pay button */}
            <Button
              size="lg"
              fullWidth
              onClick={handlePay}
              isLoading={isProcessing}
              aria-label={`Pay ₹${lesson.price / 100} with Razorpay`}
              style={{ marginBottom: "16px" }}
            >
              💳 Pay ₹{lesson.price / 100} with Razorpay →
            </Button>

            {/* Trust row */}
            <p
              style={{
                textAlign: "center",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              🔒 Secured by Razorpay · UPI · Cards · Net Banking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
