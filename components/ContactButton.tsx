"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ContactButton({
  talentId,
  contactPhone,
  alreadyLoggedContact = false,
}: {
  talentId: string;
  contactPhone: string;
  alreadyLoggedContact?: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [revealed, setRevealed] = useState(alreadyLoggedContact);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const { data: auth } = await supabase.auth.getUser();

    // Belt-and-braces: even though the server-side redirect should prevent
    // reaching here anonymously, check again before exposing the phone.
    if (!auth.user) {
      router.push(`/login?next=${encodeURIComponent(`/talent/${talentId}`)}`);
      return;
    }

    const { error: insertError } = await supabase
      .from("contacts")
      .insert({ buyer_id: auth.user.id, talent_id: talentId });

    if (insertError) {
      // If the row already exists for this buyer/talent pair, Supabase returns
      // a uniqueness-style error — treat that as success and reveal anyway.
      if (insertError.code !== "23505") {
        setError("Couldn't log the contact. Please try again.");
        setLoading(false);
        return;
      }
    }

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
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-pop transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
      >
        {loading ? "One moment…" : "Show contact details"}
      </button>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}