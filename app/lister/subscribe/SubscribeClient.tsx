"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Talent } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function daysLeft(dateStr: string) {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "₹299",
    period: "/month",
    blurb: "Billed every month, cancel anytime.",
    highlight: false,
  },
  {
    id: "annual",
    label: "Annual",
    price: "₹2,999",
    period: "/year",
    blurb: "Two months free versus paying monthly.",
    highlight: true,
  },
] as const;

export default function SubscribeClient() {
  const router = useRouter();
  const supabase = createClient();
  const [talent, setTalent] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase.from("talents").select("*").eq("user_id", auth.user.id).maybeSingle();
      setTalent((data as Talent) ?? null);
      setLoading(false);
    })();
  }, [router, supabase]);

  async function handleSubscribe(planType: "monthly" | "annual") {
    setCheckoutLoading(planType);
    setError(null);

    try {
      const res = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't start checkout");

      const razorpay = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Namma Talent",
        description: `${planType === "annual" ? "Annual" : "Monthly"} talent subscription`,
        theme: { color: "#5B21B6" },
        handler: () => {
          router.push("/lister/dashboard");
          router.refresh();
        },
      });
      razorpay.open();
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setCheckoutLoading(null);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <main className="min-h-screen bg-mist">
        <div className="mx-auto max-w-3xl px-5 py-10">
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Choose your plan
          </h1>
          <p className="mt-1 text-sm text-ink/50">
            Stay visible to buyers and keep your contact details unlocked.
          </p>

          {!loading && talent?.subscription_status === "trial" && (
            <div className="mt-6 rounded-2xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent-dark">
              You're on a free trial with <strong>{daysLeft(talent.trial_end_date)} days</strong>{" "}
              left. Subscribe now and it'll pick up automatically once your trial ends.
            </div>
          )}
          {!loading && talent?.subscription_status === "expired" && (
            <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Your trial has ended. Your profile is still visible, but ranks lower
              and buyers can't see your contact details until you subscribe.
            </div>
          )}
          {!loading && talent?.subscription_status === "active" && (
            <div className="mt-6 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-dark">
              You already have an active subscription. Thanks for being part of Namma Talent!
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl p-7 shadow-card ${
                  plan.highlight ? "bg-brand-gradient text-white" : "bg-white"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white shadow-pop">
                    BEST VALUE
                  </span>
                )}
                <p className={`font-display text-sm font-bold uppercase tracking-wide ${plan.highlight ? "text-white/80" : "text-brand"}`}>
                  {plan.label}
                </p>
                <p className={`mt-2 font-display text-3xl font-extrabold ${plan.highlight ? "text-white" : "text-ink"}`}>
                  {plan.price}
                  <span className={`text-base font-semibold ${plan.highlight ? "text-white/70" : "text-ink/40"}`}>{plan.period}</span>
                </p>
                <p className={`mt-2 flex-1 text-sm ${plan.highlight ? "text-white/80" : "text-ink/60"}`}>{plan.blurb}</p>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={checkoutLoading !== null || talent?.subscription_status === "active"}
                  className={`mt-6 rounded-full px-5 py-3 text-sm font-bold transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${
                    plan.highlight ? "bg-white text-brand" : "bg-ink text-white"
                  }`}
                >
                  {checkoutLoading === plan.id ? "Opening checkout…" : `Choose ${plan.label}`}
                </button>
              </div>
            ))}
          </div>

          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
        </div>
      </main>
    </>
  );
}