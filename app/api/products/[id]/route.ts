import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    // Get product to delete image file
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }

    // Delete image file if exists
    if (product.image) {
      try {
        const imagePath = path.join(process.cwd(), 'public', product.image)
        await unlink(imagePath)
      } catch (error) {
        console.error('Error deleting image file:', error)
      }
    }

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Ürün silinirken hata oluştu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const brandId = formData.get('brandId') as string
    const categoryId = formData.get('categoryId') as string
    const imageFile = formData.get('image') as File | null

    if (!name || !price) {
      return NextResponse.json({ error: 'Ürün adı ve fiyat gerekli' }, { status: 400 })
    }

    // Get existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }

    let imagePath: string | null = existingProduct.image

    // Handle image upload if new image provided
    if (imageFile && imageFile.size > 0) {
      // Delete old image
      if (existingProduct.image) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', existingProduct.image)
          await unlink(oldImagePath)
        } catch (error) {
          console.error('Error deleting old image:', error)
        }
      }

      // Upload new image
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const timestamp = Date.now()
      const filename = `${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
      
      await mkdir(uploadDir, { recursive: true })
      
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)
      
      imagePath = `/uploads/products/${filename}`
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price: parseFloat(price),
        image: imagePath,
        brandId: brandId || existingProduct.brandId,
        categoryId: categoryId || existingProduct.categoryId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Ürün güncellenirken hata oluştu' }, { status: 500 })
  }
}

