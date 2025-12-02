import { prisma } from '@/lib/prisma'
import ProductForm from '../ProductForm'

export const dynamic = 'force-dynamic'

async function getBrandsAndCategories() {
  try {
    const [brands, categories] = await Promise.all([
      prisma.brand.findMany({ orderBy: { name: 'asc' } }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ])
    return { brands, categories }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { brands: [], categories: [] }
  }
}

export default async function NewProductPage() {
  const { brands, categories } = await getBrandsAndCategories()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
          <p className="mt-2 text-gray-600">Ürün bilgilerini doldurun</p>
        </div>

        <ProductForm brands={brands} categories={categories} />
      </div>
    </div>
  )
}

