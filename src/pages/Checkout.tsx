import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useRazorpay } from "../hooks/useRazorpay";
import { Button } from "../components/ui/Button";
import { PageWrapper } from "../components/layout/PageWrapper";
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
    if (!authLoading && !user) navigate(`/login?redirect=/checkout/${id}`);
  }, [user, authLoading, id]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setLesson(data));
  }, [id]);

  async function handlePay() {
    if (!lesson || !user) return;
    setError("");
    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
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
        prefill: {
          name: profile?.full_name,
          email: user.email,
        },
        onSuccess: async (response) => {
          const verifyRes = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );

          if (verifyRes.ok) {
            setSuccess(true);
            setTimeout(() => navigate(`/lesson/${lesson.id}`), 2000);
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

  if (authLoading || !lesson) {
    return (
      <PageWrapper>
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </PageWrapper>
    );
  }

  if (success) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment successful!</h2>
          <p className="text-slate-500">Opening your lesson…</p>
          <div className="mt-4"><Spinner /></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {lesson.thumbnail_url && (
            <img
              src={lesson.thumbnail_url}
              alt={lesson.title}
              loading="lazy"
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-slate-500 mb-4">{lesson.description}</p>
            )}
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 mb-6">
              <span className="text-slate-600 font-medium">Total</span>
              <span className="text-2xl font-extrabold text-violet-700">₹{lesson.price / 100}</span>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handlePay}
              isLoading={isProcessing}
              aria-label={`Pay ₹${lesson.price / 100} with Razorpay`}
            >
              💳 Pay ₹{lesson.price / 100} with Razorpay
            </Button>
            <p className="text-slate-400 text-xs text-center mt-3">Secure payment via Razorpay</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
