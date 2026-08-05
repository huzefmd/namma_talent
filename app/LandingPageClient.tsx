"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { CATEGORIES, getCategoryEmoji } from "@/lib/constants";

type TalentSuggestion = {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string | null;
};

export default function LandingPageClient() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TalentSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [categoryIndex, setCategoryIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);

  const searchCategories = [
    "photographer",
    "math tutor",
    "wedding designer",
    "web developer",
    "video editor",
    "fitness trainer",
    "makeup artist",
    "graphic designer",
  ];

  /* ROTATING SEARCH PLACEHOLDER */

  useEffect(() => {
    const interval = setInterval(() => {
      setCategoryIndex((currentIndex) => {
        return (currentIndex + 1) % searchCategories.length;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [searchCategories.length]);

  /* DEBOUNCE SEARCH */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q.trim());
    }, 250);

    return () => clearTimeout(timer);
  }, [q]);

  /* SEARCH API */

  useEffect(() => {
    const controller = new AbortController();

    async function searchTalents() {
      if (!debouncedQ) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `/api/talents/search?q=${encodeURIComponent(debouncedQ)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();

        setResults(data.results ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }

    searchTalents();

    return () => controller.abort();
  }, [debouncedQ]);

  /* CLOSE SEARCH DROPDOWN WHEN CLICKING OUTSIDE */

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const suggestionsVisible = open && q.trim().length > 0;

  function selectTalent(talent: TalentSuggestion) {
    setOpen(false);
    setQ(talent.name);
    router.push(`/talent/${talent.id}`);
  }

  return (
    <main className="min-h-screen bg-mist text-ink">
      {/* HERO */}

      <section className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">

            {/* LEFT SIDE */}

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                India&apos;s local talent marketplace
              </div>

              <h1 className="max-w-2xl font-display text-[42px] font-extrabold leading-[0.98] tracking-tight text-ink sm:text-6xl sm:leading-[1.05]">
                Find the right{" "}
                <span className="text-brand">talent</span> for the job.
              </h1>

              <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink/60 sm:text-lg sm:leading-8">
                Discover trusted Photographers, Designers, Tutors, Mechanic
                and skilled professionals near you.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-sm">
                    👨‍💻
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-sm">
                    👩‍🎨
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-sm">
                    🎸
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-sm">
                    +
                  </div>
                </div>

                <p className="text-xs font-medium text-ink/60 sm:text-sm">
                  Connect with talented professionals near you
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/signup?role=lister"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                >
                  I&apos;m a professional
                  <span>→</span>
                </Link>

                <span className="text-xs text-ink/45">
                  List your services and get discovered
                </span>
              </div>
            </div>

            {/* SEARCH CARD */}

            <div ref={rootRef}>
              <div className="rounded-3xl border border-black/[0.08] bg-white p-4 shadow-[0_15px_45px_rgba(0,0,0,0.08)]">

                <div className="mb-4">
                  <p className="text-sm font-bold text-ink">
                    What service do you need?
                  </p>

                  <p className="mt-1 text-xs text-ink/45">
                    Search from verified local professionals
                  </p>
                </div>

                <form
                  action="/buyer/dashboard"
                  onSubmit={() => setOpen(false)}
                >
                  <div className="relative flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-mist px-4 py-3">

                    <Icon
                      name="search"
                      size={19}
                      className="shrink-0 text-ink/40"
                    />

                    <input
                      name="q"
                      value={q}
                      onChange={(event) => {
                        setQ(event.target.value);
                        setOpen(true);
                        setActiveIndex(-1);
                      }}
                      onFocus={() => setOpen(true)}
                      placeholder={`Search for "${searchCategories[categoryIndex]}"`}
                      className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-ink/80 focus:outline-none"
                      autoComplete="off"
                      role="combobox"
                      aria-expanded={suggestionsVisible}
                      aria-controls="talent-suggestions"
                      aria-autocomplete="list"
                      onKeyDown={(event) => {
                        if (!suggestionsVisible) return;

                        if (event.key === "ArrowDown") {
                          event.preventDefault();

                          setActiveIndex((index) =>
                            Math.min(index + 1, results.length - 1)
                          );
                        }

                        if (event.key === "ArrowUp") {
                          event.preventDefault();

                          setActiveIndex((index) =>
                            Math.max(index - 1, 0)
                          );
                        }

                        if (event.key === "Enter") {
                          if (
                            activeIndex >= 0 &&
                            results[activeIndex]
                          ) {
                            event.preventDefault();
                            selectTalent(results[activeIndex]);
                          }
                        }

                        if (event.key === "Escape") {
                          setOpen(false);
                        }
                      }}
                    />

                    {suggestionsVisible && (
                      <div
                        id="talent-suggestions"
                        className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xl"
                      >
                        {loading ? (
                          <div className="px-4 py-4 text-sm text-ink/50">
                            Searching...
                          </div>
                        ) : results.length === 0 ? (
                          <div className="px-4 py-4 text-sm text-ink/50">
                            No matching talent found
                          </div>
                        ) : (
                          <ul className="p-2">
                            {results.map((talent, index) => (
                              <li key={talent.id}>
                                <button
                                  type="button"
                                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${index === activeIndex
                                      ? "bg-brand-50"
                                      : "hover:bg-mist"
                                    }`}
                                  onMouseEnter={() =>
                                    setActiveIndex(index)
                                  }
                                  onClick={() => selectTalent(talent)}
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-50">
                                    {talent.image ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={talent.image}
                                        alt={talent.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <Icon
                                        name="toolbox"
                                        size={17}
                                        className="text-brand"
                                      />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-ink">
                                      {talent.name}
                                    </p>

                                    <p className="truncate text-xs text-ink/50">
                                      {talent.category} · {talent.location}
                                    </p>
                                  </div>

                                  <span className="text-ink/30">
                                    →
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="mt-3 flex w-full items-center justify-center rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.98]"
                  >
                    Search for talent
                  </button>
                </form>

                <div className="mt-3 flex flex-wrap justify-center gap-x-2 gap-y-1 text-[10px] text-ink/45 sm:text-xs">
                  <span>✓ Verified profiles</span>
                  <span>·</span>
                  <span>Direct contact</span>
                  <span>·</span>
                  <span>No bidding wars</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Explore talent
            </p>

            <h2 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">
              Popular services
            </h2>

            <p className="mt-2 text-sm text-ink/50">
              Find the right professional for your next project.
            </p>
          </div>

          <Link
            href="/buyer/dashboard"
            className="hidden text-sm font-bold text-brand hover:underline sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.slice(0, 20).map((category) => (
            <Link
              key={category.slug}
              href={`/buyer/dashboard?category=${category.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white px-3 py-4 transition-all hover:border-brand/30 hover:shadow-card sm:px-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl transition-transform group-hover:scale-105">
                {getCategoryEmoji(category.slug)}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">
                  {category.label}
                </span>

                <span className="mt-0.5 block text-xs text-ink/40">
                  Find professionals
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="border-y border-black/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
            How it works
          </p>

          <h2 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Finding the right talent is simple
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="border-l-2 border-brand pl-5">
              <p className="text-sm font-extrabold text-brand">
                01
              </p>

              <h3 className="mt-4 font-display text-xl font-bold">
                Search
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink/55">
                Tell us what kind of professional or service you are looking
                for.
              </p>
            </div>

            <div className="border-l-2 border-accent pl-5">
              <p className="text-sm font-extrabold text-accent">
                02
              </p>

              <h3 className="mt-4 font-display text-xl font-bold">
                Explore
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink/55">
                Browse profiles, portfolios, categories, and locations.
              </p>
            </div>

            <div className="border-l-2 border-teal-500 pl-5">
              <p className="text-sm font-extrabold text-teal-600">
                03
              </p>

              <h3 className="mt-4 font-display text-xl font-bold">
                Connect
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink/55">
                Contact the professional directly and get your project started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-black/[0.07] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <Icon name="check-circle" size={21} />
            </div>

            <h3 className="mt-5 font-display text-lg font-bold">
              Trusted profiles
            </h3>

            <p className="mt-2 text-sm leading-6 text-ink/55">
              Discover professionals connected to real accounts and genuine
              profiles.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.07] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon name="message" size={21} />
            </div>

            <h3 className="mt-5 font-display text-lg font-bold">
              Connect directly
            </h3>

            <p className="mt-2 text-sm leading-6 text-ink/55">
              Find someone you like and contact them directly without
              unnecessary bidding wars.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.07] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Icon name="rocket" size={21} />
            </div>

            <h3 className="mt-5 font-display text-lg font-bold">
              Get discovered
            </h3>

            <p className="mt-2 text-sm leading-6 text-ink/55">
              Showcase your skills and reach people looking for your services.
            </p>
          </div>

        </div>
      </section>

      {/* PROFESSIONAL CTA */}

      <section className="mx-4 mb-12 overflow-hidden rounded-3xl bg-brand sm:mx-auto sm:mb-16 sm:max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-7 px-6 py-9 sm:flex-row sm:items-center sm:px-12 sm:py-12">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              Are you a professional?
            </p>

            <h2 className="mt-3 max-w-xl font-display text-2xl font-extrabold text-white sm:text-3xl">
              Get discovered by people looking for your skills.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">
              Create your profile, showcase your work, and start connecting
              with potential customers.
            </p>
          </div>

          <Link
            href="/signup?role=lister"
            className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand transition hover:bg-white/90"
          >
            Create your profile →
          </Link>

        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-black/[0.06] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-5">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-display text-lg font-extrabold text-ink">
                Namma<span className="text-brand">Talent</span>
              </p>

              <p className="mt-1 text-xs text-ink/40">
                Find local talent. Get things done.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-ink/50">
              <Link
                href="/terms"
                className="transition hover:text-brand"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-brand"
              >
                Privacy Policy
              </Link>
            </div>

          </div>

          <div className="border-t border-black/[0.06] pt-5">
            <p className="text-center text-xs text-ink/40 sm:text-left">
              © {new Date().getFullYear()} Namma Talent. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

    </main>
  );
}