"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Talent } from "@/lib/types";

function daysLeft(dateStr: string) {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default function ListerDashboardClient() {
  const router = useRouter();
  const supabase = createClient();
  const [talent, setTalent] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("talents")
        .select("*")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      setTalent((data as Talent) ?? null);
      setLoading(false);
    })();
  }, [router, supabase]);

  if (loading) {
    return (
      <main className="min-h-screen bg-mist">
        <p className="mx-auto max-w-4xl px-5 py-16 text-ink/50">Loading your dashboard…</p>
      </main>
    );
  }

  const statusCopy = {
    trial: {
      label: `Free trial · ${talent ? daysLeft(talent.trial_end_date) : 0} days left`,
      tone: "bg-accent/10 text-accent-dark",
    },
    active: { label: "Active subscription", tone: "bg-teal-50 text-teal-dark" },
    expired: { label: "Subscription expired", tone: "bg-red-100 text-red-700" },
  } as const;

  const status = talent ? statusCopy[talent.subscription_status] : statusCopy.trial;

  return (
    <main className="min-h-screen bg-mist">
      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            {talent?.name || "Your talent profile"}
          </h1>
          <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${status.tone}`}>
            {status.label}
          </span>
        </div>

        {!talent?.name && (
          <div className="mt-6 rounded-2xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent-dark">
            Your profile is incomplete — buyers can't find you yet.{" "}
            <Link href="/lister/profile-edit" className="font-bold underline">
              Finish setting it up
            </Link>
            .
          </div>
        )}

        <div className="mt-7 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <p className="font-display text-3xl font-extrabold text-brand">{talent?.views_count ?? 0}</p>
            <p className="mt-1 text-sm font-medium text-ink/50">Profile views</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <p className="font-display text-3xl font-extrabold text-accent">{talent?.contacts_count ?? 0}</p>
            <p className="mt-1 text-sm font-medium text-ink/50">Contacts received</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/lister/profile-edit"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-ink shadow-card hover:bg-ink/5"
          >
            Edit profile
          </Link>
          {talent?.subscription_status !== "active" && (
            <Link
              href="/lister/subscribe"
              className="rounded-full bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-pop transition-transform hover:scale-[1.02]"
            >
              {talent?.subscription_status === "expired" ? "Renew subscription" : "Upgrade now"}
            </Link>
          )}
          {talent?.id && (
            <Link
              href={`/talent/${talent.id}`}
              className="rounded-full px-6 py-3 text-sm font-bold text-ink/50 hover:text-ink"
            >
              View public profile →
            </Link>
          )}
        </div>

        {talent?.subscription_status === "expired" && (
          <p className="mt-4 text-xs text-ink/40">
            Your profile is still live but ranks lower in search and the contact
            button is hidden from buyers until you subscribe.
          </p>
        )}
      </div>
    </main>
  );
}