"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";

export default function Header() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<"buyer" | "lister" | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: auth } = await supabase.auth.getUser();

      if (auth.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", auth.user.id)
          .single();

        setRole(
          (profile?.role as "buyer" | "lister") ?? null
        );
      }

      setChecked(true);
    }

    loadUser();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/95 backdrop-blur-md">

      <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between gap-3 px-4 sm:h-[82px] sm:px-5">

        {/* LOGO */}

        <div className="min-w-0 flex-1">
          <Logo />
        </div>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-2 text-sm font-semibold sm:flex">

          {!checked ? null : role === "lister" ? (
            <>
              <Link
                href="/lister/dashboard"
                className="rounded-full px-4 py-2 text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-ink/50 transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                Log out
              </button>
            </>
          ) : role === "buyer" ? (
            <>
              <Link
                href="/buyer/dashboard"
                className="rounded-full px-4 py-2 text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                Find Talent
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-ink/50 transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                Log out
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

        <div className="flex shrink-0 items-center sm:hidden">

          {!checked ? null : role === "lister" ? (

            <Link
              href="/lister/dashboard"
              className="rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-sm"
            >
              Dashboard
            </Link>

          ) : role === "buyer" ? (

            <Link
              href="/buyer/dashboard"
              className="rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-sm"
            >
              Find Talent
            </Link>

          ) : (

            <Link
              href="/signup"
              className="rounded-full bg-brand-gradient px-4 py-2.5 text-xs font-bold text-white shadow-pop"
            >
              Get started
            </Link>

          )}

        </div>

      </div>

    </header>
  );
}