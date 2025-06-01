import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    // Create a response and a Supabase client
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession();

    // Handle public routes that don't need authentication
    const isPublicRoute = req.nextUrl.pathname.startsWith('/auth');
    const isStaticRoute = req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/);
    const isApiRoute = req.nextUrl.pathname.startsWith('/api');

    // If there's an error getting the session, redirect to auth
    if (error) {
      if (!isPublicRoute && !isStaticRoute && !isApiRoute) {
        return NextResponse.redirect(new URL('/auth', req.url));
      }
      return res;
    }

    // If user is not signed in and trying to access protected route
    if (!session && !isPublicRoute && !isStaticRoute && !isApiRoute) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    // If user is signed in and trying to access auth page
    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
  } catch (e) {
    // If there's any error, redirect to auth page for safety
    return NextResponse.redirect(new URL('/auth', req.url));
  }
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 