"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, BENGALURU_AREAS, canBeContacted } from "@/lib/constants";
import type { Talent } from "@/lib/types";

function BuyerDashboardInner() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase.from("talents").select("*").not("name", "eq", "");

      if (category) q = q.eq("category", category);
      if (location) q = q.eq("location", location);

      const { data } = await q;
      setTalents((data as Talent[]) ?? []);
      setLoading(false);
    })();
  }, [category, location, supabase]);

  // Rank active/trial profiles above expired ones; text filter applied client-side.
  const visible = talents
    .filter((t) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.bio.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const rank = (s: string) => (s === "expired" ? 1 : 0);
      return rank(a.subscription_status) - rank(b.subscription_status);
    });

  return (
    <main className="min-h-screen bg-mist">
      <Header />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Find talent near you
        </h1>

        {/* Search + area — sticky command bar */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-card sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-mist px-3">
            <Icon name="search" size={17} className="text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or specialty…"
              className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
            />
          </div>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl bg-mist px-3 py-2.5 text-sm font-medium focus:outline-none"
          >
            <option value="">All areas</option>
            {BENGALURU_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Category chip rail */}
        <div className="scroll-thin mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory("")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              category === "" ? "bg-brand text-white" : "bg-white text-ink/60 shadow-card hover:text-ink"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                category === c.slug ? "bg-brand text-white" : "bg-white text-ink/60 shadow-card hover:text-ink"
              }`}
            >
              <Icon name={c.icon} size={14} />
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-10 text-ink/50">Loading talent…</p>
        ) : visible.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white px-6 py-14 text-center shadow-card">
            <p className="font-display text-lg font-bold text-ink">No matches yet</p>
            <p className="mt-1 text-sm text-ink/50">
              Try a different category or area, or check back soon — new talent joins every week.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {visible.map((t) => (
              <Link
                key={t.id}
                href={`/talent/${t.id}`}
                className={`group overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-pop ${
                  t.subscription_status === "expired" ? "opacity-70" : ""
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-50">
                  {t.portfolio_images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.portfolio_images[0]}
                      alt={t.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-brand/50">
                      <Icon name={CATEGORIES.find((c) => c.slug === t.category)?.icon ?? "toolbox"} size={30} />
                    </div>
                  )}
                  {!canBeContacted(t.subscription_status, t.trial_end_date) && (
                    <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-bold text-white">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-display font-bold text-ink">{t.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-brand">
                    {CATEGORIES.find((c) => c.slug === t.category)?.label} · {t.location}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-ink/70">
                      {t.price_range || "Contact for pricing"}
                    </span>
                    <span className="text-xs font-bold text-teal">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={null}>
      <BuyerDashboardInner />
    </Suspense>
  );
}
