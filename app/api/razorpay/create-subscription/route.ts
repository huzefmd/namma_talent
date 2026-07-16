import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

// Configure your actual plan IDs in the Razorpay dashboard first, then set these env vars.
const PLAN_IDS: Record<string, string | undefined> = {
  monthly: process.env.RAZORPAY_PLAN_ID_MONTHLY,
  annual: process.env.RAZORPAY_PLAN_ID_ANNUAL,
};

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { planType = "monthly" } = await request.json().catch(() => ({}));
  const planId = PLAN_IDS[planType];
  if (!planId) {
    return NextResponse.json(
      { error: `No Razorpay plan configured for '${planType}'` },
      { status: 400 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: planType === "annual" ? 1 : 12,
    notes: { supabase_user_id: auth.user.id },
  });

  await supabase.from("subscriptions").insert({
    user_id: auth.user.id,
    plan_type: planType,
    razorpay_subscription_id: subscription.id,
    status: "created",
  });

  return NextResponse.json({
    subscriptionId: subscription.id,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
