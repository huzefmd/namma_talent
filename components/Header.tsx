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
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", auth.user.id)
          .single();
        setRole((profile?.role as "buyer" | "lister") ?? null);
      }
      setChecked(true);
    })();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Logo />
        <nav className="flex items-center gap-2 text-sm font-semibold">
          {!checked ? null : role === "lister" ? (
            <>
              <Link
                href="/lister/dashboard"
                className="rounded-full px-4 py-2 text-ink/70 hover:bg-ink/[0.05] hover:text-ink transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-ink/50 hover:bg-ink/[0.05] hover:text-ink transition-colors"
              >
                Log out
              </button>
            </>
          ) : role === "buyer" ? (
            <>
              <Link
                href="/buyer/dashboard"
                className="rounded-full px-4 py-2 text-ink/70 hover:bg-ink/[0.05] hover:text-ink transition-colors"
              >
                Find Talent
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-ink/50 hover:bg-ink/[0.05] hover:text-ink transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-ink/70 hover:bg-ink/[0.05] hover:text-ink transition-colors"
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
      </div>
    </header>
  );
}
