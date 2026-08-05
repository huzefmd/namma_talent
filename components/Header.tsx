"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";

export type HeaderRole = "buyer" | "lister" | null;

export default function Header({ initialRole = null }: { initialRole?: HeaderRole }) {
  const router = useRouter();
  const supabase = createClient();

  // Start with the server-resolved role so the first paint is already correct.
  const [role, setRole] = useState<HeaderRole>(initialRole);
  const [checked, setChecked] = useState(true); // server already checked
  const [loggingOut, setLoggingOut] = useState(false);

  // Listen for client-side auth changes (login/logout happening on the page).
  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!data.user) {
        setRole(null);
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (cancelled) return;
      setRole((profile?.role as HeaderRole) ?? null);
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (!session?.user) {
        setRole(null);
      } else {
        // Re-fetch role on sign-in; trust the new session.
        loadUser();
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      // Clear local state and hard-navigate so the server sees the cleared session
      // and any protected routes get redirected by middleware.
      setRole(null);
      setLoggingOut(false);
      window.location.replace("/");
    }
  }

  const loggedIn = role !== null;

  const dashboardHref =
    role === "lister" ? "/lister/dashboard" : "/buyer/dashboard";

  const dashboardLabel = role === "lister" ? "Dashboard" : "Find Talent";

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between gap-3 px-4 sm:h-[82px] sm:px-5">
        {/* LOGO */}
        <div className="min-w-0 flex-1">
          <Logo />
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-2 text-sm font-semibold sm:flex">
          {!checked ? (
            <span className="h-9 w-32 animate-pulse rounded-full bg-ink/[0.05]" />
          ) : loggedIn ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-full px-4 py-2 text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                {dashboardLabel}
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full px-4 py-2 text-ink/50 transition-colors hover:bg-ink/[0.05] hover:text-ink disabled:opacity-50"
              >
                {loggingOut ? "Logging out…" : "Log out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-gradient px-5 py-2.5 text-white shadow-pop transition-transform hover:scale-[1.03] active:scale-95"
              >
                Get started
              </Link>
            </>
          )}
        </nav>

        {/* MOBILE NAVIGATION */}
        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          {!checked ? (
            <span className="h-9 w-20 animate-pulse rounded-full bg-ink/[0.05]" />
          ) : loggedIn ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-sm"
              >
                {dashboardLabel}
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Log out"
                className="rounded-full bg-ink/[0.06] px-3 py-2 text-xs font-bold text-ink/70 shadow-sm transition-colors hover:bg-ink/[0.12] disabled:opacity-50"
              >
                {loggingOut ? "…" : "Log out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-xs font-bold text-ink/70"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-gradient px-4 py-2.5 text-xs font-bold text-white shadow-pop"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}