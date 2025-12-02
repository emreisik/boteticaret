'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`"${productName}" ürününü silmek istediğinize emin misiniz?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Ürün silinirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ürün silinirken bir hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
    >
      {isDeleting ? 'Siliniyor...' : 'Sil'}
    </button>
  )
}

