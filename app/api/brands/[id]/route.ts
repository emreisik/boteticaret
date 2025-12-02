import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brandId = parseInt(params.id)

    // Check if brand has products
    const productCount = await prisma.product.count({
      where: { brandId },
    })

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Bu markaya ait ${productCount} ürün var. Önce ürünleri silmelisiniz.` },
        { status: 400 }
      )
    }

    // Get brand to delete logo file
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    })

    if (!brand) {
      return NextResponse.json({ error: 'Marka bulunamadı' }, { status: 404 })
    }

    // Delete logo file if exists
    if (brand.logo) {
      try {
        const logoPath = path.join(process.cwd(), 'public', brand.logo)
        await unlink(logoPath)
      } catch (error) {
        console.error('Error deleting logo file:', error)
      }
    }

    // Delete brand
    await prisma.brand.delete({
      where: { id: brandId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json({ error: 'Marka silinirken hata oluştu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brandId = parseInt(params.id)
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const logoFile = formData.get('logo') as File | null

    if (!name) {
      return NextResponse.json({ error: 'Marka adı gerekli' }, { status: 400 })
    }

    // Get existing brand
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId },
    })

    if (!existingBrand) {
      return NextResponse.json({ error: 'Marka bulunamadı' }, { status: 404 })
    }

    let logoPath: string | null = existingBrand.logo

    // Handle logo upload if new logo provided
    if (logoFile && logoFile.size > 0) {
      // Delete old logo
      if (existingBrand.logo) {
        try {
          const oldLogoPath = path.join(process.cwd(), 'public', existingBrand.logo)
          await unlink(oldLogoPath)
        } catch (error) {
          console.error('Error deleting old logo:', error)
        }
      }

      // Upload new logo
      const bytes = await logoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const timestamp = Date.now()
      const filename = `${timestamp}-${logoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'brands')
      
      await mkdir(uploadDir, { recursive: true })
      
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)
      
      logoPath = `/uploads/brands/${filename}`
    }

    // Update brand
    const brand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        name,
        logo: logoPath,
      },
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json({ error: 'Marka güncellenirken hata oluştu' }, { status: 500 })
  }
}

