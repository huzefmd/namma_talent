"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ContactButton({
  talentId,
  contactPhone,
}: {
  talentId: string;
  contactPhone: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      router.push(`/login?next=/talent/${talentId}`);
      return;
    }

    await supabase.from("contacts").insert({ buyer_id: auth.user.id, talent_id: talentId });
    setRevealed(true);
    setLoading(false);
  }

  if (revealed) {
    return (
      <a
        href={`tel:${contactPhone}`}
        className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-bold text-white shadow-card hover:bg-teal-dark transition-colors"
      >
        Call {contactPhone || "— number not provided"}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-pop transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
    >
      {loading ? "One moment…" : "Show contact details"}
    </button>
  );
}
