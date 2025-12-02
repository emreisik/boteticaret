import Link from 'next/link'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'

async function getBrands() {
  return await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })
}

export default async function Home() {
  const brands = await getBrands()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Markalar</h1>
        <div className="space-y-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {brand.logo && (
                    <div className="flex-shrink-0">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {brand.name}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {brand._count.products} ürün
                </p>
              </div>
            </Link>
          ))}
        </div>
        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Henüz marka eklenmemiş. Telegram bot ile ürün ekleyerek başlayın.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

