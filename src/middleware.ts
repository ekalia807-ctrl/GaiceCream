import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const LOGIN_REQUIRED = ["/pesan", "/riwayat", "/admin"];

function redirectTo(request: NextRequest, path: string, session: NextResponse) {
  const response = NextResponse.redirect(new URL(path, request.url));
  // bawa cookie sesi yang baru disegarkan
  session.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

/**
 * Middleware hanya berjalan di halaman yang butuh sesi login (lihat matcher di bawah).
 * Halaman publik (Home, Katalog, Tentang) tidak lewat sini, jadi tidak ada panggilan
 * ke Supabase dan bisa disajikan dari cache. Peran admin dicek di app/admin/layout.tsx
 * dan dijaga RLS di database.
 */
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

  return response;
}

export const config = {
  matcher: ["/pesan/:path*", "/riwayat/:path*", "/admin/:path*"],
};
