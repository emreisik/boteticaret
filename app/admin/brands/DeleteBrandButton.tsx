'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteBrandButton({ 
  brandId, 
  brandName, 
  productCount 
}: { 
  brandId: number
  brandName: string
  productCount: number
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (productCount > 0) {
      alert(`Bu markaya ait ${productCount} ürün var. Önce ürünleri silmelisiniz.`)
      return
    }

    if (!confirm(`"${brandName}" markasını silmek istediğinize emin misiniz?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Marka silinirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
      alert('Marka silinirken bir hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || productCount > 0}
      className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
      title={productCount > 0 ? 'Bu markaya ait ürünler var' : ''}
    >
      {isDeleting ? 'Siliniyor...' : 'Sil'}
    </button>
  )
}

