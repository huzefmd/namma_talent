import { createClient } from "@/lib/supabase/server";
import Header, { type HeaderRole } from "./Header";

/**
 * Server-component wrapper around the client <Header />.
 *
 * Resolves the current viewer's role server-side from the session cookie, so
 * the very first HTML the browser receives already has the correct navbar
 * (no flash of "Log in" / "Get started" before client hydration).
 */
export default async function AuthHeader() {
  let role: HeaderRole = null;

  try {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (auth.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", auth.user.id)
        .maybeSingle();

      if (profile?.role === "buyer" || profile?.role === "lister") {
        role = profile.role;
      }
    }
  } catch {
    // If Supabase env vars aren't set or the request fails for any reason,
    // fall back to the logged-out navbar rather than throwing at render time.
    role = null;
  }

  return <Header initialRole={role} />;
}