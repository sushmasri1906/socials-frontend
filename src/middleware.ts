import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	console.log(pathname);

	// Exclude /login and /register
	if (pathname === "/login" || pathname === "/register") {
		return NextResponse.next(); // Skip middleware for these routes
	}
	const authHeader = request.headers.get("Authorization"); // Example: token in Authorization header
	console.log("skhgsakhgash");
	if (!authHeader) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/profile/:path*", // Profile page and sub-routes
		"/",
		"/posts/:path*", // Posts page and sub-routes
		"/messages/:path*",
		"/search/:path*",
		"/user/:path*",
	],
};
