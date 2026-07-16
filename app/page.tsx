import Link from "next/link";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import { CATEGORIES } from "@/lib/constants";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-mist">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 85% 60%, white 0, transparent 35%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide text-white ring-1 ring-white/25">
            <Icon name="bolt" size={14} className="text-white" />
            Verified pros, replies in minutes
          </span>
          <h1 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
            Book trusted local talent, on demand.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85">
            Photographers, designers, tutors, musicians and freelancers near
            you — real profiles, real portfolios, zero bidding wars.
          </p>

          {/* Search bar — Zepto/Urban Company style command bar */}
          <form
            action="/buyer/dashboard"
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-pop sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <Icon name="search" size={18} className="text-ink/40" />
              <input
                name="q"
                placeholder="Search photographers, tutors, DJs…"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:shrink-0"
            >
              Find talent
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/signup?role=lister"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand shadow-card hover:bg-white/90 transition-colors"
            >
              I'm a pro — list my services
            </Link>
            <span className="inline-flex items-center text-xs font-medium text-white/70">
              2 months free for new talent
            </span>
          </div>
        </div>
      </section>

      {/* Category preview — icon rail like a delivery app */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-extrabold text-ink">
            Browse by category
          </h2>
          <Link href="/buyer/dashboard" className="text-sm font-bold text-brand hover:underline">
            See all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {CATEGORIES.slice(0, 20).map((cat) => (
            <Link
              key={cat.slug}
              href={`/buyer/dashboard?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-5 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-pop"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                <Icon name={cat.icon} size={22} />
              </span>
              <span className="text-xs font-semibold text-ink/80">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust strip — Urban-Company-style reassurance bar */}
      <section className="border-y border-black/[0.06] bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-dark">
              <Icon name="check-circle" size={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink">Verified profiles</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                Every pro is tied to a real, verified account — no bots, no fake reviews.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <Icon name="message" size={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink">Direct contact, no fees</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                Message or call pros directly. Browsing and contacting is always free.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon name="rocket" size={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink">Get discovered fast</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                Pros build a profile in minutes and start getting found by people nearby.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-10 text-xs text-ink/40">
        © {new Date().getFullYear()} Namma Talent. All rights reserved.
      </footer>
    </main>
  );
}
