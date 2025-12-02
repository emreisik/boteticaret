import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import ProductVariantSelector from './ProductVariantSelector'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Geri Dön
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Resim Yok
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {product.brand && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Marka: </span>
                  <Link
                    href={`/brand/${product.brand.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {product.brand.name}
                  </Link>
                </div>
              )}

              {product.category && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Kategori: </span>
                  <Link
                    href={`/category/${product.category.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {product.category.name}
                  </Link>
                </div>
              )}

              <div className="text-3xl font-bold text-blue-600 mb-6">
                {product.price.toFixed(2)} TL
              </div>

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Açıklama</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <ProductVariantSelector 
                  variants={product.variants.map(v => ({
                    id: v.id,
                    color: v.color,
                    sizes: JSON.parse(v.sizes),
                    stock: v.stock,
                  }))} 
                />
              )}

              {/* No Variants Message */}
              {(!product.variants || product.variants.length === 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    Bu ürün için henüz varyant eklenmemiş.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
