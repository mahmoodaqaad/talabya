import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from "jose"

export const middleware = async (req: NextRequest) => {

    const token = req.cookies.get('ip_t_s')?.value;

    const { pathname } = req.nextUrl
    let user = null
    try {
      const  { payload } = await jwtVerify(token!, new TextEncoder().encode(process.env.JWT_SECRET!))
            user = payload; 
            console.log("التوكن صحيح والمستخدم هو:", user);
    } catch (error) {
        req.cookies.delete('ip_t_s');
        console.log("التوكن غير صحيح أو منتهي الصلاحية (أي كلام)!",error);
    }
    console.log(user);

    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register');
    const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/api/dashboard');

    if ((!token || !user) && isDashboardRoute) {

        return NextResponse.redirect(new URL('/login', req.url));
    }
    if (!user && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    if (user && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    console.log("auth required");
    return NextResponse.next();

}
export const config = {
    matcher: ['/dashboard/:path*',
        "/login",
        "/signup",
    ]
}   