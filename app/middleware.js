import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token") ? .value;
    const path = req.nextUrl.pathname;

    if (!token && path.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};