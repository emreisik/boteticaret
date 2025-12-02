import { prisma } from '@/lib/prisma'
import ProductForm from '../../ProductForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getProductAndData(id: number) {
  try {
    const [product, brands, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
      }),
      prisma.brand.findMany({ orderBy: { name: 'asc' } }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ])

    if (!product) {
      return null
    }

    return { product, brands, categories }
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = parseInt(id)
  const data = await getProductAndData(productId)

  if (!data) {
    notFound()
  }

  const { product, brands, categories } = data

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ürün Düzenle</h1>
          <p className="mt-2 text-gray-600">{product.name}</p>
        </div>

        <ProductForm brands={brands} categories={categories} product={product} />
      </div>
    </div>
  )
}

