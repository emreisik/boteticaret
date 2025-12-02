'use client'

import { useState } from 'react'

type Variant = {
  id: string
  color: string
  sizes: string[]
  stock: number
}

type Props = {
  variants: Variant[]
}

export default function ProductVariantSelector({ variants }: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSizeGroup, setSelectedSizeGroup] = useState<string | null>(null)

  // Get unique colors
  const colors = Array.from(new Set(variants.map(v => v.color)))

  // Get available variants for selected color
  const availableVariants = selectedColor
    ? variants.filter(v => v.color === selectedColor)
    : []

  // Get size groups for selected color
  const sizeGroups = selectedColor
    ? availableVariants.flatMap(v => v.sizes)
    : []

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSizeGroup) {
      alert('Lütfen renk ve beden seçin')
      return
    }

    // Find the variant
    const variant = variants.find(
      v => v.color === selectedColor && v.sizes.includes(selectedSizeGroup)
    )

    if (!variant || variant.stock === 0) {
      alert('Bu varyant stokta yok')
      return
    }

    alert(`Sepete eklendi:\nRenk: ${selectedColor}\nBeden: ${selectedSizeGroup}`)
  }

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Renk Seçin</h3>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color)
                setSelectedSizeGroup(null)
              }}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                selectedColor === color
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      {selectedColor && sizeGroups.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Beden Seçin</h3>
          <div className="grid grid-cols-1 gap-3">
            {sizeGroups.map((sizeGroup, index) => {
              const variant = variants.find(
                v => v.color === selectedColor && v.sizes.includes(sizeGroup)
              )
              const isOutOfStock = !variant || variant.stock === 0

              return (
                <button
                  key={`${sizeGroup}-${index}`}
                  onClick={() => !isOutOfStock && setSelectedSizeGroup(sizeGroup)}
                  disabled={isOutOfStock}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all text-left ${
                    selectedSizeGroup === sizeGroup
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : isOutOfStock
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{sizeGroup}</span>
                    {isOutOfStock && (
                      <span className="text-xs text-red-600">Stokta Yok</span>
                    )}
                    {!isOutOfStock && variant && (
                      <span className="text-xs text-gray-500">
                        Stok: {variant.stock}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedColor || !selectedSizeGroup}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
          selectedColor && selectedSizeGroup
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Sepete Ekle
      </button>

      {/* Selection Summary */}
      {(selectedColor || selectedSizeGroup) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Seçiminiz:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {selectedColor && <p>Renk: <span className="font-medium">{selectedColor}</span></p>}
            {selectedSizeGroup && <p>Beden: <span className="font-medium">{selectedSizeGroup}</span></p>}
          </div>
        </div>
      )}
    </div>
  )
}

