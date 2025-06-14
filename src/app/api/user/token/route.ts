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
  
  console.log('🍪 GET tokens from cookies:', {
    hasToken: !!tokenCookie?.value,
    hasRefreshToken: !!refreshTokenCookie?.value,
    tokenLength: tokenCookie?.value?.length || 0
  })
  
  return NextResponse.json({
    token: tokenCookie?.value || null,
    refreshToken: refreshTokenCookie?.value || null,
  })
}

export async function POST(request: Request) {
  try {
    const { token, refreshToken } = await request.json()
    const cookieStore = await cookies()

    console.log('🍪 POST tokens to cookies:', {
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      tokenLength: token?.length || 0
    })

    // Set token cookie if provided, otherwise delete it
    if (token) {
      cookieStore.set(TOKEN_COOKIE, token, COOKIE_OPTIONS)
      console.log('✅ Token cookie set')
    } else {
      cookieStore.delete(TOKEN_COOKIE)
      console.log('🗑️ Token cookie deleted')
    }

    // Set refresh token cookie if provided, otherwise delete it
    if (refreshToken) {
      cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS)
      console.log('✅ Refresh token cookie set')
    } else {
      cookieStore.delete(REFRESH_TOKEN_COOKIE)
      console.log('🗑️ Refresh token cookie deleted')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('💥 Error setting token cookies:', error)
    return NextResponse.json(
      { error: 'Failed to set tokens' }, 
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()

  console.log('🗑️ Deleting token cookies')
  cookieStore.delete(TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
  
  return NextResponse.json({ success: true })
}