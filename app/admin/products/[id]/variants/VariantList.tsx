'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Variant = {
  id: string
  color: string
  sizes: string[]
  stock: number
}

type Props = {
  variants: Variant[]
}

export default function VariantList({ variants }: Props) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (variantId: string) => {
    if (!confirm('Bu varyantı silmek istediğinize emin misiniz?')) {
      return
    }

    setDeletingId(variantId)
    try {
      const response = await fetch(`/api/variants/${variantId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Varyant silinirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Error deleting variant:', error)
      alert('Bir hata oluştu')
    } finally {
      setDeletingId(null)
    }
  }

  if (variants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        Henüz varyant eklenmemiş
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{variant.color}</h3>
              <p className="text-sm text-gray-600">Stok: {variant.stock} adet</p>
            </div>
            <button
              onClick={() => handleDelete(variant.id)}
              disabled={deletingId === variant.id}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Beden Grupları:</p>
            <div className="flex flex-wrap gap-2">
              {variant.sizes.map((size, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

