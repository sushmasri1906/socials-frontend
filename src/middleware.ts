import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	console.log(request.url);
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
