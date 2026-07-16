import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

// Configure this exact URL as a webhook in the Razorpay dashboard, subscribed to:
// subscription.activated, subscription.charged, subscription.halted,
// subscription.cancelled, subscription.completed
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const entity = event.payload?.subscription?.entity;
  if (!entity) return NextResponse.json({ received: true });

  const admin = createAdminClient();
  const razorpaySubId: string = entity.id;
  const userId: string | undefined = entity.notes?.supabase_user_id;

  const statusMap: Record<string, string> = {
    "subscription.activated": "active",
    "subscription.charged": "active",
    "subscription.halted": "halted",
    "subscription.cancelled": "cancelled",
    "subscription.completed": "completed",
  };
  const newStatus = statusMap[event.event] ?? "pending";

  await admin
    .from("subscriptions")
    .update({
      status: newStatus,
      start_date: entity.start_at ? new Date(entity.start_at * 1000).toISOString() : null,
      end_date: entity.end_at ? new Date(entity.end_at * 1000).toISOString() : null,
    })
    .eq("razorpay_subscription_id", razorpaySubId);

  if (userId) {
    const talentStatus = newStatus === "active" ? "active" : "expired";
    await admin.from("talents").update({ subscription_status: talentStatus }).eq("user_id", userId);
  }

  return NextResponse.json({ received: true });
}
