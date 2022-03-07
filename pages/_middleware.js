import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
  });

  const { pathname } = req.nextUrl;

  if (token && pathname === "/login") {
    return NextResponse.redirect("/");
  }

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    const redirect =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/login"
        : `https://spotify-client-blue.vercel.app/login`;
    return NextResponse.redirect(redirect);
  }
}
