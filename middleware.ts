// middleware.ts
export { default } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token && !PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (token && req.nextUrl.pathname === '/dashboard') {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      )

      const role = payload.role

      if (role === 'organizer') {
        return NextResponse.redirect(new URL('/dashboard/organizer', req.url))
      } else if (role === 'customer') {
        return NextResponse.redirect(new URL('/dashboard/customer', req.url))
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
