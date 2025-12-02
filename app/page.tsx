import Link from 'next/link'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getBrands() {
  try {
    return await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export default async function Home() {
  const brands = await getBrands()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Markalar</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center"
            >
              {brand.logo ? (
                <div className="w-full h-32 mb-3 flex items-center justify-center bg-gray-50 rounded-lg p-2">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-32 mb-3 flex items-center justify-center bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-2xl font-bold">
                    {brand.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {brand.name}
              </h2>
              <p className="text-sm text-gray-500">
                {brand._count.products} ürün
              </p>
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

