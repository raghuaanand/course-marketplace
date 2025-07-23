
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If the user is not logged in, redirect to login page
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Role-based access control
    const role = token.role as string;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/instructor/:path*",
    "/my-courses/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/learn/:path*",
  ],
};
