import { NextRequest, NextResponse } from 'next/server'
import bot from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' })
}

