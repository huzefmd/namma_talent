import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import ContactButton from "@/components/ContactButton";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { CATEGORIES, canBeContacted } from "@/lib/constants";
import type { Talent } from "@/lib/types";

export default async function TalentProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: talent } = await supabase
    .from("talents")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!talent) notFound();
  const t = talent as Talent;

  // Fire-and-forget view increment via the admin client (bypasses RLS, no user action needed).
  try {
    const admin = createAdminClient();
    await admin
      .from("talents")
      .update({ views_count: t.views_count + 1 })
      .eq("id", t.id);
  } catch {
    // Non-critical — skip silently if service role key isn't configured yet.
  }

  const category = CATEGORIES.find((c) => c.slug === t.category);
  const active = canBeContacted(t.subscription_status, t.trial_end_date);

  return (
    <main className="min-h-screen bg-mist">
      <Header />
      <div className="mx-auto max-w-4xl px-5 py-8">
        {!active && (
          <div className="mb-6 rounded-2xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent-dark">
            This profile's subscription has lapsed — contact details are hidden until the talent renews.
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-card">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
            <div className="aspect-square w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl bg-brand-50">
              {t.portfolio_images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.portfolio_images[0]} alt={t.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-brand/50">
                  <Icon name={category?.icon ?? "toolbox"} size={40} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand">
                {category?.label} · {t.location}
              </p>
              <h1 className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl">{t.name}</h1>
              <p className="mt-1 text-lg font-bold text-teal-dark">
                {t.price_range || "Contact for pricing"}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">
                {t.bio || "This talent hasn't added a bio yet."}
              </p>

              <div className="mt-6">
                {active ? (
                  <ContactButton talentId={t.id} contactPhone={t.contact_phone} />
                ) : (
                  <span className="inline-block rounded-full bg-ink/10 px-6 py-3 text-sm font-semibold text-ink/40">
                    Contact unavailable
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {t.portfolio_images?.length > 1 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-extrabold text-ink">Portfolio</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {t.portfolio_images.slice(1).map((url) => (
                <div key={url} className="aspect-square overflow-hidden rounded-2xl bg-brand-50 shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Portfolio item" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
