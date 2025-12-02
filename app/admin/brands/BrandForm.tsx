'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Brand = {
  id: string
  name: string
  logo: string | null
}

type BrandFormProps = {
  brand?: Brand
}

export default function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(brand?.logo || null)
  
  const [formData, setFormData] = useState({
    name: brand?.name || '',
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formElement = e.currentTarget
      const formDataToSend = new FormData(formElement)

      const url = brand ? `/api/brands/${brand.id}` : '/api/brands'
      const method = brand ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (response.ok) {
        router.push('/admin/brands')
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
        {/* Marka Adı */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Marka Adı *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Örn: Nike"
          />
        </div>

        {/* Logo */}
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
            Marka Logosu
          </label>
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {logoPreview && (
            <div className="mt-4 relative h-32 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={logoPreview}
                alt="Preview"
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Kaydediliyor...' : (brand ? 'Güncelle' : 'Marka Ekle')}
          </button>
          <Link
            href="/admin/brands"
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
          >
            İptal
          </Link>
        </div>
      </div>
    </form>
  )
}

