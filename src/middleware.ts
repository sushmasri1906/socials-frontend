import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/ig/:path*", // Profile page and sub-routes
		"/",
		"/search/:path*",
		"/messages/:path*",
		"/profile/:path*",
		"/posts/:path*",
		"/user/:path*",
	],
};
