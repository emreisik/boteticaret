import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const logoFile = formData.get('logo') as File | null

    if (!name) {
      return NextResponse.json({ error: 'Marka adı gerekli' }, { status: 400 })
    }

    let logoPath: string | null = null

    // Handle logo upload
    if (logoFile && logoFile.size > 0) {
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

    // Create brand
    const brand = await prisma.brand.create({
      data: {
        name,
        logo: logoPath,
      },
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json({ error: 'Marka oluşturulurken hata oluştu' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json({ error: 'Markalar getirilirken hata oluştu' }, { status: 500 })
  }
}

