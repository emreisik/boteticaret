const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function listBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    console.log('\n========================================')
    console.log('  MARKALAR')
    console.log('========================================\n')
    console.log(`Toplam: ${brands.length} marka\n`)
    
    brands.forEach(brand => {
      console.log(`- ${brand.name}`)
      console.log(`  Logo: ${brand.logo || 'Yok'}`)
      console.log(`  Ürün Sayısı: ${brand._count.products}`)
      console.log('')
    })

    console.log('========================================\n')

    await prisma.$disconnect()
  } catch (error) {
    console.error('Hata:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

listBrands()


