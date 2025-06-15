import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const TOKEN_COOKIE = "auth_token"
const REFRESH_TOKEN_COOKIE = "auth_refresh_token"

// MEJORADO: Opciones de cookie más específicas
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 60 * 60 * 24 * 30, // 30 days para refresh token
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get(TOKEN_COOKIE)
    const refreshTokenCookie = cookieStore.get(REFRESH_TOKEN_COOKIE)

    console.log("📖 Reading server tokens:", {
      hasToken: !!tokenCookie?.value,
      hasRefreshToken: !!refreshTokenCookie?.value,
    })

    return NextResponse.json({
      token: tokenCookie?.value || null,
      refreshToken: refreshTokenCookie?.value || null,
    })
  } catch (error) {
    console.error("💥 Error reading server tokens:", error)
    return NextResponse.json({ error: "Failed to read tokens" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { token, refreshToken } = await request.json()
    const cookieStore = await cookies()

    console.log("📝 Setting server tokens:", {
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      tokenLength: token?.length || 0,
    })

    // MEJORADO: Manejo más explícito de cookies
    if (token) {
      cookieStore.set(TOKEN_COOKIE, token, COOKIE_OPTIONS)
      console.log("✅ Access token cookie set")
    } else {
      cookieStore.delete(TOKEN_COOKIE)
      console.log("🗑️ Access token cookie deleted")
    }

    if (refreshToken) {
      cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS)
      console.log("✅ Refresh token cookie set")
    } else {
      cookieStore.delete(REFRESH_TOKEN_COOKIE)
      console.log("🗑️ Refresh token cookie deleted")
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Error setting server tokens:", error)
    return NextResponse.json(
      { error: "Failed to set tokens", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()

    cookieStore.delete(TOKEN_COOKIE)
    cookieStore.delete(REFRESH_TOKEN_COOKIE)

    console.log("🗑️ All auth cookies deleted")

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Error deleting server tokens:", error)
    return NextResponse.json({ error: "Failed to delete tokens" }, { status: 500 })
  }
}
