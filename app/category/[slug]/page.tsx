import Link from 'next/link'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'

async function getCategoryProducts(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          brand: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  return category
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const category = await getCategoryProducts(params.slug)

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Kategori bulunamadı
            </h1>
            <Link
              href="/categories"
              className="text-blue-600 hover:underline"
            >
              Kategorilere dön
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/categories"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Kategorilere Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 mt-2">{category.description}</p>
          )}
        </div>

        {category.products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Bu kategoride henüz ürün eklenmemiş.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.brand.name}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {product.price.toFixed(2)} TL
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

