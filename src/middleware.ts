import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware protects /admin routes by checking for authentication
// All /admin routes require authentication, preventing direct URL access
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin route
  if (pathname.startsWith("/admin")) {
    // Check for authentication cookie
    const authCookie = request.cookies.get("learnapt-admin-auth");
    
    // If no auth cookie and not on the login page, allow access to /admin for login
    // The client-side will show the login form
    if (!authCookie || authCookie.value !== "true") {
      // Allow access to /admin root for login form
      if (pathname === "/admin") {
        return NextResponse.next();
      }
      
      // For any other /admin subroutes, redirect to /admin login
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    // Match all /admin routes
    "/admin/:path*",
  ],
};
