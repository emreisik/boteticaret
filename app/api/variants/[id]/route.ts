import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: variantId } = await params

    await prisma.productVariant.delete({
      where: { id: variantId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting variant:', error)
    return NextResponse.json({ error: 'Varyant silinirken hata oluştu' }, { status: 500 })
  }
}

