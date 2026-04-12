# civicpulse-global/middleware.ts at main · hallamohamad1-design/civicpulse-global · GitHub

**URL:** https://github.com/hallamohamad1-design/civicpulse-global/blob/main/middleware.ts

---

Skip to content
Navigation Menu
Platform
Solutions
Resources
Open Source
Enterprise
Pricing
Sign in
Sign up
hallamohamad1-design
/
civicpulse-global
Public
Notifications
Fork 0
 Star 0
Code
Issues
Pull requests
Actions
Projects
Security and quality
Insights
Files
 main
app
components
lib
.eslintrc.json
.gitignore
README.md
components.json
middleware.ts
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
supabase_migration.sql
supabase_migration_phase2.sql
tailwind.config.ts
tsconfig.json
types_supabase.ts
Breadcrumbs
civicpulse-global
/middleware.ts
Latest commit
Halla
Initial CivicPulse Migration
7449d10
 · 
History
History
File metadata and controls
Code
Blame
Raw
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })


  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )


  const { data: { user } } = await supabase.auth.getUser()


  const protectedRoutes = ['/submit', '/profile', '/admin']
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))


  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }


  return response
}


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}