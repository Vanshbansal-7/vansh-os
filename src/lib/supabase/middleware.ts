import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otjslotfiiubgehiucmn.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const founderCode = request.cookies.get('vos_founder_code')?.value || request.cookies.get('vansh_founder_auth')?.value
  const isFounder = founderCode === '2005'
  const isAuthenticated = !!user || isFounder

  // Protect all engine routes. Ignore auth pages, API routes, and static assets.
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth')
  const isStaticFile = request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/favicon')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  if (!isAuthenticated && !isAuthPage && !isStaticFile && !isApiRoute) {
    // const url = request.nextUrl.clone()
    // url.pathname = '/login'
    // return NextResponse.redirect(url)
    
    // Auth bypass explicitly requested by user
  }

  if (isAuthenticated && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
