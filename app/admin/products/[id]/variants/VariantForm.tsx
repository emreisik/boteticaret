'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  productId: string
}

export default function VariantForm({ productId }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [color, setColor] = useState('')
  const [sizeGroups, setSizeGroups] = useState<string[]>([''])
  const [stock, setStock] = useState('')

  const addSizeGroup = () => {
    setSizeGroups([...sizeGroups, ''])
  }

  const removeSizeGroup = (index: number) => {
    setSizeGroups(sizeGroups.filter((_, i) => i !== index))
  }

  const updateSizeGroup = (index: number, value: string) => {
    const newGroups = [...sizeGroups]
    newGroups[index] = value
    setSizeGroups(newGroups)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productId}/variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          color,
          sizes: sizeGroups.filter(s => s.trim() !== ''),
          stock: parseInt(stock) || 0,
        }),
      })

      if (response.ok) {
        setColor('')
        setSizeGroups([''])
        setStock('')
        router.refresh()
        alert('Varyant başarıyla eklendi!')
      } else {
        const error = await response.json()
        alert(error.error || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Error adding variant:', error)
      alert('Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Color */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
          Renk *
        </label>
        <input
          type="text"
          id="color"
          required
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Örn: Kırmızı, Mavi, Siyah"
        />
      </div>

      {/* Size Groups */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Beden Grupları *
          </label>
          <button
            type="button"
            onClick={addSizeGroup}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Grup Ekle
          </button>
        </div>
        <div className="space-y-3">
          {sizeGroups.map((group, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                required
                value={group}
                onChange={(e) => updateSizeGroup(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: 32-34-36 veya 38-40-42"
              />
              {sizeGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSizeGroup(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Her satır bir beden grubudur. Örnek: "32-34-36" veya "S-M-L"
        </p>
      </div>

      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
          Stok Adedi *
        </label>
        <input
          type="number"
          id="stock"
          required
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Örn: 100"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
      >
        {isSubmitting ? 'Ekleniyor...' : 'Varyant Ekle'}
      </button>
    </form>
  )
}

