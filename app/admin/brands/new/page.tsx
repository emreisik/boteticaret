import BrandForm from '../BrandForm'

export const dynamic = 'force-dynamic'

export default function NewBrandPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yeni Marka Ekle</h1>
          <p className="mt-2 text-gray-600">Marka bilgilerini doldurun</p>
        </div>

        <BrandForm />
      </div>
    </div>
  )
}

