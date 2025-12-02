import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await params

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId },
    })

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Bu kategoriye ait ${productCount} ürün var. Önce ürünleri silmelisiniz.` },
        { status: 400 }
      )
    }

    // Delete category
    await prisma.category.delete({
      where: { id: categoryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Kategori silinirken hata oluştu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await params
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Kategori adı ve slug gerekli' }, { status: 400 })
    }

    // Check if slug already exists (excluding current category)
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id: categoryId },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 })
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Kategori güncellenirken hata oluştu' }, { status: 500 })
  }
}

