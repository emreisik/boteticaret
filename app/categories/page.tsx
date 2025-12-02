import Link from 'next/link'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kategoriler</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {category.name}
              </h2>
              <p className="text-sm text-gray-500">
                {category._count.products} ürün
              </p>
            </Link>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Henüz kategori eklenmemiş. Telegram bot ile ürün ekleyerek başlayın.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

