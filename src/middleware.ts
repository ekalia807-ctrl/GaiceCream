import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const LOGIN_REQUIRED = ["/pesan", "/riwayat", "/admin"];

function redirectTo(request: NextRequest, path: string, session: NextResponse) {
  const response = NextResponse.redirect(new URL(path, request.url));
  // bawa cookie sesi yang baru disegarkan
  session.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  const needsLogin = LOGIN_REQUIRED.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (needsLogin && supabase && !user) {
    const next = encodeURIComponent(`${pathname}${search}`);
    return redirectTo(request, `/masuk?next=${next}`, response);
  }

  if (supabase && user && (pathname === "/admin" || pathname.startsWith("/admin/"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") {
      return redirectTo(request, "/?akses=ditolak", response);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
