import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routes that require an authenticated session.
 * Anything not listed here (landing page, login, signup, buyer browse, talent
 * profiles) is publicly accessible.
 */
const PROTECTED_PREFIXES = [
  "/lister/dashboard",
  "/lister/profile-edit",
  "/lister/subscribe",
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh session if expired — required for Server Components to read a valid session.
  const { data: auth } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // If the user is trying to view a talent profile anonymously, send them to
  // login but remember where they wanted to go. This is the second layer of
  // protection for contact_phone (the server component also gates it).
  if (pathname.startsWith("/talent/") && !auth.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Hard-protect lister-only routes. Buyer dashboard stays open for browsing.
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !auth.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};