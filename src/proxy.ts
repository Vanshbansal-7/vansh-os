import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api (API routes — handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - _next/data (RSC data routes)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     * - public assets (svg, png, jpg, jpeg, gif, webp, ico)
     */
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
