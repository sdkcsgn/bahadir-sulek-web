import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Yetkisiz erişim.", {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Bahadir Sulek Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isWriteApi =
    pathname.startsWith("/api/") &&
    request.method !== "GET";

  // Normal ziyaretçileri engelleme
  if (!isAdmin && !isWriteApi) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword =
    process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse(
      "Admin giriş bilgileri tanımlanmamış.",
      { status: 500 }
    );
  }

  const authorization =
    request.headers.get("authorization");

  if (
    !authorization ||
    !authorization.startsWith("Basic ")
  ) {
    return unauthorized();
  }

  try {
    const decoded = atob(
      authorization.substring(6)
    );

    const separatorIndex =
      decoded.indexOf(":");

    const username =
      separatorIndex >= 0
        ? decoded.substring(0, separatorIndex)
        : decoded;

    const password =
      separatorIndex >= 0
        ? decoded.substring(separatorIndex + 1)
        : "";

    if (
      username === expectedUser &&
      password === expectedPassword
    ) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};