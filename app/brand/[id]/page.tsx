import Link from 'next/link'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getBrandProducts(brandId: string) {
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    include: {
      products: {
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  return brand
}

export default async function BrandPage({
  params,
}: {
  params: { id: string }
}) {
  const brand = await getBrandProducts(params.id)

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Marka bulunamadı
            </h1>
            <Link
              href="/"
              className="text-blue-600 hover:underline"
            >
              Ana sayfaya dön
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
            href="/"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Ana Sayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            {brand.name}
          </h1>
          {brand.description && (
            <p className="text-gray-600 mt-2">{brand.description}</p>
          )}
        </div>

        {brand.products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Bu markaya ait henüz ürün eklenmemiş.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brand.products.map((product) => (
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
                    {product.category.name}
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

