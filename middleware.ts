import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Safe middleware — works with or without Supabase configured
// Protected routes that require authentication
const PROTECTED_ROUTES = ['/admin', '/profile']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow all routes (dev/demo mode)
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  // If Supabase IS configured, protect certain routes
  try {
    const { createServerClient } = await import('@supabase/ssr')
    let response = NextResponse.next({ request })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({ request })
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
    if (isProtected && !user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    return response
  } catch {
    // If anything fails, just continue — never crash the app
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
