// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// const authPaths = ["/auth/login", "/auth/register"];
// const needSessionPaths = ["/checkout/address", "/checkout/summary"];

// export async function middleware(req: NextRequest) {
//   const session: any = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET || "",
//   });

//   if (authPaths.includes(req.nextUrl.pathname)) {
//     if (session) {
//       const params = req.nextUrl.searchParams.get("p");
//       const newUrl = params || "/";
//       return NextResponse.redirect(new URL(newUrl, req.url));
//     }
//   }

//   if (needSessionPaths.includes(req.nextUrl.pathname)) {
//     if (!session) {
//       return NextResponse.redirect(
//         new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url)
//       );
//     }
//   }

//   if (req.nextUrl.pathname.includes("/admin")) {
//     if (!session) {
//       return NextResponse.redirect(
//         new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url)
//       );
//     }
//     const validRoles = ["admin"];
//     if (!validRoles.includes(session?.user.role)) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/checkout/address",
//     "/checkout/summary",
//     "/auth/login",
//     "/auth/register",
//     "/admin/:path*",
//   ],
// };

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, env: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/checkout")) {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url)
      );
    }

    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/admin/user")) {
    const session: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url)
      );
    }

    const validRoles = ["admin", "super-user", "SEO", "client"];

    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/api/admin/user")) {
    const session: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url)
      );
    }

    const validRoles = ["admin", "super-user", "SEO", "client"];

    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }
}
