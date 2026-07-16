"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") as UserRole | null;

  const [role, setRole] = useState<UserRole | null>(
    initialRole === "buyer" || initialRole === "lister" ? initialRole : null
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Listers get a talent row created lazily on their first profile-edit visit,
    // so trial_end_date starts counting from signup — create it now instead.
    if (role === "lister" && data.user) {
      await supabase.from("talents").insert({
        user_id: data.user.id,
        name: "",
        category: "other",
        location: "",
      });
    }

    router.push(role === "lister" ? "/lister/profile-edit" : "/buyer/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-mist">
      <Header />
      <div className="mx-auto flex max-w-md flex-col px-5 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl font-extrabold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink/50">Takes less than a minute.</p>

          {!role ? (
            <div className="mt-7 grid gap-3">
              <p className="text-sm font-semibold text-ink/70">I want to...</p>
              <button
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
            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
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
                  minLength={6}
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

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
