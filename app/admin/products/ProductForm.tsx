'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Brand = {
  id: string
  name: string
}

type Category = {
  id: string
  name: string
  slug: string
}

type Product = {
  id: string
  name: string
  price: number
  image: string | null
  brandId: string | null
  categoryId: string | null
}

type Variant = {
  id?: string
  color: string
  sizes: string[]
  stock: number
}

type ProductFormProps = {
  brands: Brand[]
  categories: Category[]
  product?: Product
  existingVariants?: Variant[]
}

export default function ProductForm({ brands, categories, product, existingVariants }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null)
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    brandId: product?.brandId || '',
    categoryId: product?.categoryId || '',
  })

  // Variant state - load existing variants if editing
  const [variants, setVariants] = useState<Variant[]>(existingVariants || [])
  const [currentVariant, setCurrentVariant] = useState<Variant>({
    color: '',
    sizes: [''],
    stock: 0,
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addSizeGroup = () => {
    setCurrentVariant({
      ...currentVariant,
      sizes: [...currentVariant.sizes, ''],
    })
  }

  const removeSizeGroup = (index: number) => {
    setCurrentVariant({
      ...currentVariant,
      sizes: currentVariant.sizes.filter((_, i) => i !== index),
    })
  }

  const updateSizeGroup = (index: number, value: string) => {
    const newSizes = [...currentVariant.sizes]
    newSizes[index] = value
    setCurrentVariant({
      ...currentVariant,
      sizes: newSizes,
    })
  }

  const addVariant = () => {
    if (!currentVariant.color.trim()) {
      alert('Lütfen renk girin')
      return
    }

    const validSizes = currentVariant.sizes.filter(s => s.trim() !== '')
    if (validSizes.length === 0) {
      alert('Lütfen en az bir beden grubu girin')
      return
    }

    setVariants([...variants, { ...currentVariant, sizes: validSizes }])
    setCurrentVariant({ color: '', sizes: [''], stock: 0 })
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formElement = e.currentTarget
      const formDataToSend = new FormData(formElement)

      // Add variants to form data (only new ones without ID when editing)
      const variantsToSend = product 
        ? variants.filter(v => !v.id) // Only send new variants when editing
        : variants // Send all variants when creating

      formDataToSend.append('variants', JSON.stringify(variantsToSend))

      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {/* Ürün Adı */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Ürün Adı *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: Laptop Çantası"
          />
        </div>

        {/* Fiyat */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Fiyat (TL) *
          </label>
          <input
            type="text"
            id="price"
            name="price"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: 299.99"
          />
        </div>

        {/* Marka */}
        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-2">
            Marka
          </label>
          <select
            id="brandId"
            name="brandId"
            value={formData.brandId}
            onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Marka Seçin</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Resim */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Ürün Resmi
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {imagePreview && (
            <div className="mt-4 relative h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Varyant Yönetimi */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Varyantlar (Renk ve Beden)
          </h3>

          {/* Current Variant Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renk
              </label>
              <input
                type="text"
                value={currentVariant.color}
                onChange={(e) => setCurrentVariant({ ...currentVariant, color: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Örn: Kırmızı, Mavi"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Beden Grupları
                </label>
                <button
                  type="button"
                  onClick={addSizeGroup}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  + Grup Ekle
                </button>
              </div>
              <div className="space-y-2">
                {currentVariant.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => updateSizeGroup(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Örn: 32-34-36 veya S-M-L"
                    />
                    {currentVariant.sizes.length > 1 && (
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok
              </label>
              <input
                type="number"
                min="0"
                value={currentVariant.stock}
                onChange={(e) => setCurrentVariant({ ...currentVariant, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Örn: 100"
              />
            </div>

            <button
              type="button"
              onClick={addVariant}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Varyant Ekle
            </button>
          </div>

          {/* Added Variants List */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                {product ? 'Tüm Varyantlar' : 'Eklenmiş Varyantlar'} ({variants.length})
              </h4>
              {variants.map((variant, index) => (
                <div key={variant.id || index} className="bg-white border border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {variant.color}
                        {variant.id && <span className="ml-2 text-xs text-gray-500">(Kayıtlı)</span>}
                      </h5>
                      <p className="text-sm text-gray-600">Stok: {variant.stock}</p>
                    </div>
                    {!variant.id && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.sizes.map((size, sIndex) => (
                      <span
                        key={sIndex}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                  {variant.id && (
                    <p className="text-xs text-gray-500 mt-2">
                      Bu varyantı silmek için Varyantlar sayfasını kullanın
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {product && existingVariants && existingVariants.length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Not:</strong> Mevcut varyantları düzenlemek veya silmek için{' '}
                <Link href={`/admin/products/${product.id}/variants`} className="underline font-medium">
                  Varyantlar sayfasını
                </Link>{' '}
                kullanın. Buradan sadece yeni varyant ekleyebilirsiniz.
              </p>
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            {product 
              ? 'Yeni varyantlar eklenecek, mevcut varyantlar korunacaktır.'
              : 'İpucu: Önce ürünü kaydedin, varyantlar otomatik olarak eklenecektir.'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Kaydediliyor...' : (product ? 'Güncelle' : 'Ürün Ekle')}
          </button>
          <Link
            href="/admin/products"
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
          >
            İptal
          </Link>
        </div>
      </div>
    </form>
  )
}
