'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteCategoryButton({ 
  categoryId, 
  categoryName, 
  productCount 
}: { 
  categoryId: number
  categoryName: string
  productCount: number
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (productCount > 0) {
      alert(`Bu kategoriye ait ${productCount} ürün var. Önce ürünleri silmelisiniz.`)
      return
    }

    if (!confirm(`"${categoryName}" kategorisini silmek istediğinize emin misiniz?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Kategori silinirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Kategori silinirken bir hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || productCount > 0}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
      title={productCount > 0 ? 'Bu kategoriye ait ürünler var' : ''}
    >
      {isDeleting ? 'Siliniyor...' : 'Sil'}
    </button>
  )
}

