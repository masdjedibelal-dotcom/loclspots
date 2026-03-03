import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// OFFEN (kein Login nötig)
const PUBLIC_ROUTES = [
  /^\/$/,                   // Startseite (Landing)
  /^\/login$/,
  /^\/register$/,
  /^\/artikel$/,            // öffentliche Artikel-Liste
  /^\/artikel\/[^/]+$/,     // öffentliche Artikel-Detail
];

// GESCHLOSSEN (Login erforderlich)
const PROTECTED_ROUTES = [
  "/dashboard",
  "/home",
  "/entdecken",              // Collabs + Artikel im Dashboard
  "/collabs",                // Collab-Liste + Collab-Detailseiten
  "/chatrooms",
  "/events",
  "/profil",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((re) => re.test(pathname));
}

function isProtectedRoute(pathname: string): boolean {
  if (isPublicRoute(pathname)) return false;
  return PROTECTED_ROUTES.some(
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
