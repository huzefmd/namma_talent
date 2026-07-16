"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    router.push(profile?.role === "lister" ? "/lister/dashboard" : "/buyer/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-mist">
      <Header />
      <div className="mx-auto flex max-w-md flex-col px-5 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl font-extrabold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/50">Log in to keep booking and hiring.</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-ink/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/70">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
              />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-pop transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          New to Namma Talent?{" "}
          <Link href="/signup" className="font-bold text-brand hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
