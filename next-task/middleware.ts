import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    const { pathname } = request.nextUrl;

    if (!token && pathname.startsWith('/mytasks')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && pathname === '/login' || pathname === '/register') {
        return NextResponse.redirect(new URL('/mytasks', request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/mytasks", '/login', '/register']
}