import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const body = await request.json()
    const { color, sizes, stock } = body

    if (!color || !sizes || !Array.isArray(sizes) || sizes.length === 0) {
      return NextResponse.json({ error: 'Renk ve beden grupları gerekli' }, { status: 400 })
    }

    // Create variant
    const variant = await prisma.productVariant.create({
      data: {
        productId,
        color,
        sizes: JSON.stringify(sizes),
        stock: stock || 0,
      },
    })

    return NextResponse.json(variant, { status: 201 })
  } catch (error) {
    console.error('Error creating variant:', error)
    return NextResponse.json({ error: 'Varyant oluşturulurken hata oluştu' }, { status: 500 })
  }
}

