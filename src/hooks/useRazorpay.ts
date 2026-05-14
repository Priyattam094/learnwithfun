import { loadRazorpayScript } from "../lib/razorpay";

interface RazorpayOptions {
  orderId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onFailure?: (error: any) => void;
}

export function useRazorpay() {
  async function openCheckout(options: RazorpayOptions) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      options.onFailure?.({ description: "Failed to load Razorpay SDK" });
      return;
    }

    const rzp = new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: options.orderId,
      amount: options.amount,
      currency: options.currency ?? "INR",
      name: options.name ?? "Learn with Fun",
      description: options.description ?? "Lesson Purchase",
      prefill: options.prefill ?? {},
      theme: { color: "#7c3aed" },
      handler: options.onSuccess,
      modal: {
        ondismiss: () => options.onFailure?.({ description: "Payment cancelled" }),
      },
    });

    rzp.on("payment.failed", (response: any) =>
      options.onFailure?.(response.error)
    );
    rzp.open();
  }

  return { openCheckout };
}
