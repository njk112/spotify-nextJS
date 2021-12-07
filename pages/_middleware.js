import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
	// If logged in, then token exists
	const token = await getToken({ req, secret: process.env.JWT_SECRET });

	const { pathname } = req.nextUrl;
	// If token exists user can access pages
	if (pathname.includes("/api/auth") || token) {
		return NextResponse.next();
	}
	// No token -> go back to login page
	if (pathname !== "/login" && !token) {
		return NextResponse.redirect("/login");
	}
}
