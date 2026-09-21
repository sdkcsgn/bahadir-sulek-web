import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return new NextResponse(
      "Admin giriş bilgileri tanımlanmamış.",
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization) {
    const [type, credentials] = authorization.split(" ");

    if (type === "Basic" && credentials) {
      try {
        const decoded = atob(credentials);
        const separatorIndex = decoded.indexOf(":");

        if (separatorIndex !== -1) {
          const username = decoded.slice(0, separatorIndex);
          const password = decoded.slice(separatorIndex + 1);

          if (
            username === adminUser &&
            password === adminPassword
          ) {
            return NextResponse.next();
          }
        }
      } catch {
        // Hatalı girişte aşağıdaki 401 cevabına devam eder.
      }
    }
  }

  return new NextResponse(
    "Yönetim paneline giriş yapmalısınız.",
    {
      status: 401,
      headers: {
        "WWW-Authenticate":
          'Basic realm="Bahadir Sulek Admin"',
      },
    }
  );
}

export const config = {
  matcher: ["/admin/:path*"],
};
