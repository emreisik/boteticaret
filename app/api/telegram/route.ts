import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds timeout

export async function POST(request: NextRequest) {
  try {
    // Dynamic import - sadece runtime'da yükle
    const { getBot } = await import('@/lib/telegram')
    const body = await request.json()
    const bot = getBot()
    
    // Set timeout for bot handling
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 25000)
    })
    
    await Promise.race([
      bot.handleUpdate(body),
      timeoutPromise
    ])
    
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

