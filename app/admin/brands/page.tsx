import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import DeleteBrandButton from './DeleteBrandButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
    return brands
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marka Yönetimi</h1>
            <p className="mt-2 text-gray-600">Toplam {brands.length} marka</p>
          </div>
          <Link
            href="/admin/brands/new"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            + Yeni Marka Ekle
          </Link>
        </div>

        {/* Brands Grid */}
        {brands.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Henüz marka eklenmemiş</p>
            <Link
              href="/admin/brands/new"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              İlk Markayı Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <div key={brand.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-32 bg-gray-100">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Logo Yok
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{brand.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{brand._count.products} ürün</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/brands/${brand.id}/edit`}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-center text-sm"
                    >
                      Düzenle
                    </Link>
                    <DeleteBrandButton brandId={brand.id} brandName={brand.name} productCount={brand._count.products} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Yönetim Paneline Dön
          </Link>
        </div>
      </div>
    </div>
  )
}

