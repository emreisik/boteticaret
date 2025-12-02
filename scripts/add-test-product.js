const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addTestProduct() {
  try {
    // Marka oluştur veya bul
    let brand = await prisma.brand.findFirst({
      where: { name: 'Test Marka' }
    })
    
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: 'Test Marka' }
      })
      console.log('✅ Marka oluşturuldu:', brand.name)
    } else {
      console.log('✅ Marka bulundu:', brand.name)
    }

    // Kategori oluştur veya bul
    let category = await prisma.category.findFirst({
      where: { slug: 'test-kategori' }
    })
    
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Test Kategori',
          slug: 'test-kategori'
        }
      })
      console.log('✅ Kategori oluşturuldu:', category.name)
    } else {
      console.log('✅ Kategori bulundu:', category.name)
    }

    // Ürün oluştur
    const product = await prisma.product.create({
      data: {
        name: 'Test Ürün - Bot ile Eklendi',
        description: 'Telegram bot üzerinden eklenen test ürünü',
        price: 99.99,
        image: '/uploads/test-product.jpg',
        brandId: brand.id,
        categoryId: category.id
      }
    })

    console.log('')
    console.log('========================================')
    console.log('✅ ÜRÜN BAŞARIYLA EKLENDİ!')
    console.log('========================================')
    console.log('📦 Ürün Adı:', product.name)
    console.log('💰 Fiyat:', product.price, 'TL')
    console.log('🏷️ Marka:', brand.name)
    console.log('📂 Kategori:', category.name)
    console.log('========================================')
    console.log('')
    console.log('🌐 Siteyi kontrol edin: http://77.245.158.179:3000')
    console.log('')

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Hata:', error)
    process.exit(1)
  }
}

addTestProduct()

