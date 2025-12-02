import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const brandId = formData.get('brandId') as string
    const categoryId = formData.get('categoryId') as string
    const imageFile = formData.get('image') as File | null
    const variantsJson = formData.get('variants') as string

    if (!name || !price) {
      return NextResponse.json({ error: 'Ürün adı ve fiyat gerekli' }, { status: 400 })
    }

    let imagePath: string | null = null

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
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

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        image: imagePath || '',
        brandId: brandId || '',
        categoryId: categoryId || '',
      },
    })

    // Create variants if provided
    if (variantsJson) {
      try {
        const variants = JSON.parse(variantsJson)
        if (Array.isArray(variants) && variants.length > 0) {
          await Promise.all(
            variants.map((variant: any) =>
              prisma.productVariant.create({
                data: {
                  productId: product.id,
                  color: variant.color,
                  sizes: JSON.stringify(variant.sizes),
                  stock: variant.stock || 0,
                },
              })
            )
          )
        }
      } catch (error) {
        console.error('Error creating variants:', error)
      }
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Ürün oluşturulurken hata oluştu' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Ürünler getirilirken hata oluştu' }, { status: 500 })
  }
}

