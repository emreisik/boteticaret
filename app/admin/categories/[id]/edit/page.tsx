import { prisma } from '@/lib/prisma'
import CategoryForm from '../../CategoryForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    })
    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategory(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kategori Düzenle</h1>
          <p className="mt-2 text-gray-600">{category.name}</p>
        </div>

        <CategoryForm category={category} />
      </div>
    </div>
  )
}

