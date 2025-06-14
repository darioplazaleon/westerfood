import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('session')
  if (!userCookie) {
    return NextResponse.json(null)
  }
  return NextResponse.json(JSON.parse(userCookie.value))
}

export async function POST(request: Request) {
  const user = await request.json()
  const cookieStore = await cookies()

  cookieStore.set('session', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const cookieStore = await cookies()

  cookieStore.delete('session')
  return NextResponse.json({ success: true })
}