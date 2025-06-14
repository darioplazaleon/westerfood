import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Cookie names
const TOKEN_COOKIE = 'auth_token'
const REFRESH_TOKEN_COOKIE = 'auth_refresh_token'

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

export async function GET() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get(TOKEN_COOKIE)
  const refreshTokenCookie = cookieStore.get(REFRESH_TOKEN_COOKIE)
  
  return NextResponse.json({
    token: tokenCookie?.value || null,
    refreshToken: refreshTokenCookie?.value || null,
  })
}

export async function POST(request: Request) {
  const { token, refreshToken } = await request.json()
  const cookieStore = await cookies()

  // Set token cookie if provided, otherwise delete it
  if (token) {
    cookieStore.set(TOKEN_COOKIE, token, COOKIE_OPTIONS)
  } else {
    cookieStore.delete(TOKEN_COOKIE)
  }

  // Set refresh token cookie if provided, otherwise delete it
  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS)
  } else {
    cookieStore.delete(REFRESH_TOKEN_COOKIE)
  }

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const cookieStore = await cookies()

  cookieStore.delete(TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
  
  return NextResponse.json({ success: true })
}