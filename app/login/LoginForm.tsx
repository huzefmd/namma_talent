"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/** Translate Supabase auth errors into something a real person can read. */
function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "That email and password didn't match. Try again, or sign up if you're new here.";
  }
  if (m.includes("email not confirmed")) {
    return "Please confirm your email first — check your inbox for the link we sent at signup.";
  }
  if (m.includes("rate limit")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  if (m.includes("user not found")) {
    return "We couldn't find an account with that email. Try signing up instead.";
  }
  return message;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.user) {
      setError(
        signInError
          ? friendlyAuthError(signInError.message)
          : "Something went wrong. Try again."
      );
      setLoading(false);
      return;
    }

    // If we have a safe `next` (only internal paths), honour it; otherwise fall
    // back to the role-based dashboard.
    let redirectTo = nextPath && nextPath.startsWith("/") ? nextPath : null;

    if (!redirectTo) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      redirectTo =
        profile?.role === "lister" ? "/lister/dashboard" : "/buyer/dashboard";
    }

    // Hard navigation so middleware/server components re-evaluate session.
    window.location.replace(redirectTo);
  }

  return (
    <main className="min-h-screen bg-mist">
      <div className="mx-auto flex max-w-md flex-col px-5 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink/50">
            {nextPath
              ? "Log in to continue."
              : "Log in to keep booking and hiring."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col gap-4"
            noValidate
          >
            <div>
              <label className="text-sm font-semibold text-ink/70">Email</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/70">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
              />
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-pop transition-transform hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          New to Namma Talent?{" "}
          <Link
            href="/signup"
            className="font-bold text-brand hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}