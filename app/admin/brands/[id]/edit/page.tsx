import { prisma } from '@/lib/prisma'
import BrandForm from '../../BrandForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getBrand(id: string) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
    })
    return brand
  } catch (error) {
    console.error('Error fetching brand:', error)
    return null
  }
}

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const brand = await getBrand(id)

  if (!brand) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marka Düzenle</h1>
          <p className="mt-2 text-gray-600">{brand.name}</p>
        </div>

        <BrandForm brand={brand} />
      </div>
    </div>
  )
}

