"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

/** Translate Supabase auth errors into something a real person can read. */
function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "An account with that email already exists. Try logging in instead.";
  }
  if (m.includes("password") && m.includes("6")) {
    return "Password must be at least 6 characters.";
  }
  if (m.includes("rate limit")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  return message;
}

export default function SignupForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") as UserRole | null;
  const nextPath = searchParams.get("next") ?? null;

  const [role, setRole] = useState<UserRole | null>(
    initialRole === "buyer" || initialRole === "lister" ? initialRole : null
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = password.length === 0 || password === confirm;
  const passwordLongEnough = password.length === 0 || password.length >= 6;
  const formValid =
    email.trim().length > 0 && passwordLongEnough && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role || loading) return;

    if (!passwordsMatch) {
      setError("Passwords don't match.");
      return;
    }
    if (!passwordLongEnough) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { role } },
    });

    if (signUpError) {
      setError(friendlyAuthError(signUpError.message));
      setLoading(false);
      return;
    }

    // If Supabase requires email confirmation, data.session will be null.
    if (!data.session) {
      setError(
        "Account created! Check your email to confirm before signing in."
      );
      setLoading(false);
      return;
    }

    if (role === "lister" && data.user) {
      const { error: insertError } = await supabase.from("talents").insert({
        user_id: data.user.id,
        name: "",
        category: "other",
        location: "",
      });
      if (
        insertError &&
        insertError.code !== "23505" &&
        !insertError.message.toLowerCase().includes("duplicate")
      ) {
        setError(`Account created but profile setup failed: ${insertError.message}`);
        setLoading(false);
        return;
      }
    }

    const fallback =
      role === "lister" ? "/lister/profile-edit" : "/buyer/dashboard";
    const target = nextPath && nextPath.startsWith("/") ? nextPath : fallback;

    // Hard navigation so middleware re-evaluates the freshly-set session cookie.
    window.location.replace(target);
  }

  return (
    <main className="min-h-screen bg-mist">
      <div className="mx-auto flex max-w-md flex-col px-5 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink/50">Takes less than a minute.</p>

          {!role ? (
            <div className="mt-7 grid gap-3">
              <p className="text-sm font-semibold text-ink/70">I want to...</p>
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className="group rounded-2xl border-2 border-transparent bg-mist px-5 py-4 text-left transition-all hover:border-brand hover:bg-white"
              >
                <span className="inline-flex items-center gap-2 font-display font-bold text-ink">
                  <Icon name="search" size={17} className="text-brand" />
                  Find Talent
                </span>
                <p className="mt-1 text-sm text-ink/60">
                  I'm looking to hire a photographer, designer, tutor and more.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setRole("lister")}
                className="group rounded-2xl border-2 border-transparent bg-mist px-5 py-4 text-left transition-all hover:border-accent hover:bg-white"
              >
                <span className="inline-flex items-center gap-2 font-display font-bold text-ink">
                  <Icon name="rocket" size={17} className="text-accent" />
                  Join as Talent
                </span>
                <p className="mt-1 text-sm text-ink/60">
                  I offer a skill or service and want to be discovered. 2 months free.
                </p>
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-7 flex flex-col gap-4"
              noValidate
            >
              <button
                type="button"
                onClick={() => setRole(null)}
                className="self-start rounded-full bg-mist px-3 py-1 text-left text-xs font-bold text-brand hover:bg-brand-50"
              >
                ← Signing up as {role === "buyer" ? "a buyer" : "talent"}
              </button>
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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-mist px-4 py-3 text-sm focus:bg-white focus:outline-none ${
                    passwordLongEnough
                      ? "border-black/10 focus:border-brand"
                      : "border-red-400 focus:border-red-500"
                  }`}
                />
                {!passwordLongEnough && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    At least 6 characters.
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-ink/70">
                  Confirm password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border bg-mist px-4 py-3 text-sm focus:bg-white focus:outline-none ${
                    passwordsMatch
                      ? "border-black/10 focus:border-brand"
                      : "border-red-400 focus:border-red-500"
                  }`}
                />
                {!passwordsMatch && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    Passwords don't match.
                  </p>
                )}
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
                disabled={loading || !formValid}
                className="mt-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-pop transition-transform hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}