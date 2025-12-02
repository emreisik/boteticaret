import { prisma } from '@/lib/prisma'
import ProductForm from '../../ProductForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getProductAndData(id: string) {
  try {
    const [product, brands, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          variants: true,
        },
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
  const data = await getProductAndData(id)

  if (!data) {
    notFound()
  }

  const { product, brands, categories } = data

  // Parse variants for the form
  const existingVariants = product.variants.map(v => ({
    id: v.id,
    color: v.color,
    sizes: JSON.parse(v.sizes),
    stock: v.stock,
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ürünlere Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Ürün Düzenle</h1>
          <p className="mt-2 text-gray-600">{product.name}</p>
          {existingVariants.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {existingVariants.length} varyant mevcut
            </p>
          )}
        </div>

        <ProductForm 
          brands={brands} 
          categories={categories} 
          product={product}
          existingVariants={existingVariants}
        />
      </div>
    </div>
  )
}
