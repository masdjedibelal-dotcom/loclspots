import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATTERNS = [
  /^\/$/,
  /^\/login$/,
  /^\/register$/,
  /^\/artikel$/,
  /^\/artikel\/[^/]+$/, // /artikel/[slug]
  /^\/collabs$/,
  /^\/collabs\/[^/]+$/, // /collabs/[id] – außer /collabs/new (UUID vs "new" – new wird geprüft)
  /^\/events$/,
  /^\/events\/[^/]+$/, // /events/[id]
];

const PROTECTED_PREFIXES = ["/dashboard", "/home", "/chatrooms", "/entdecken", "/profil"];

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/collabs/new" || /^\/collabs\/[^/]+\/edit$/.test(pathname)) {
    return false;
  }
  return PUBLIC_PATTERNS.some((re) => re.test(pathname));
}

function isProtectedRoute(pathname: string): boolean {
  if (isPublicRoute(pathname)) return false;
  if (pathname === "/collabs/new" || /^\/collabs\/[^/]+\/edit$/.test(pathname)) return true;
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (isProtectedRoute(request.nextUrl.pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("returnUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
