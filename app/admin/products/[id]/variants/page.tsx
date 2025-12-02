import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import VariantForm from './VariantForm'
import VariantList from './VariantList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getProductWithVariants(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductVariantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductWithVariants(id)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <Link href="/admin/products" className="text-blue-600 hover:text-blue-800">
            Ürünlere Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-gray-900">Varyant Yönetimi</h1>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">{product.name}</span> için renk ve beden varyantları
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Variant Form */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Varyant Ekle</h2>
            <VariantForm productId={product.id} />
          </div>

          {/* Existing Variants */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mevcut Varyantlar ({product.variants.length})
            </h2>
            <VariantList 
              variants={product.variants.map(v => ({
                id: v.id,
                color: v.color,
                sizes: JSON.parse(v.sizes),
                stock: v.stock,
              }))} 
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Varyant Sistemi Nasıl Çalışır?</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Her varyant bir renk içerir (örn: Kırmızı, Mavi)</li>
            <li>• Her varyant birden fazla beden grubu içerebilir (örn: 32-34-36, 38-40-42)</li>
            <li>• Her varyant için ayrı stok tanımlanır</li>
            <li>• Müşteri önce renk, sonra beden seçer</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
