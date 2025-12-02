import Link from 'next/link'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getProduct(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true
    }
  })
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Ürün bulunamadı
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
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <Link
                  href={`/brand/${product.brandId}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {product.brand.name}
                </Link>
                <span className="mx-2 text-gray-400">•</span>
                <Link
                  href={`/category/${product.category.slug}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {product.category.name}
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-gray-600 mb-6">{product.description}</p>
              )}
              <div className="border-t pt-6">
                <p className="text-4xl font-bold text-blue-600 mb-6">
                  {product.price.toFixed(2)} TL
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

