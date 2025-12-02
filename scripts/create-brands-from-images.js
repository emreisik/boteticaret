const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function createBrandsFromImages() {
  try {
    const brandsDir = path.join(process.cwd(), 'public', 'images', 'brands')
    
    if (!fs.existsSync(brandsDir)) {
      console.log('❌ Brands klasörü bulunamadı:', brandsDir)
      await prisma.$disconnect()
      process.exit(1)
    }

    const files = fs.readdirSync(brandsDir).filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
    })

    if (files.length === 0) {
      console.log('❌ Brands klasöründe görsel dosyası bulunamadı')
      await prisma.$disconnect()
      process.exit(1)
    }

    console.log(`\n📁 ${files.length} görsel dosyası bulundu\n`)
    console.log('========================================')
    console.log('  MARKA OLUSTURMA BASLIYOR')
    console.log('========================================\n')

    let created = 0
    let updated = 0
    let skipped = 0

    for (const file of files) {
      // Dosya adından uzantıyı kaldır
      const fileNameWithoutExt = path.parse(file).name
      
      // Dosya adını marka adına çevir (örn: nike-logo -> Nike)
      const brandName = fileNameWithoutExt
        .split(/[-_\s]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim()

      if (!brandName) {
        console.log(`⏭️  Atlandı: ${file} (geçersiz dosya adı)`)
        skipped++
        continue
      }

      const imagePath = `/images/brands/${file}`

      try {
        // Tüm markaları al ve case-insensitive karşılaştır
        const allBrands = await prisma.brand.findMany()
        const existingBrand = allBrands.find(b => 
          b.name.toLowerCase() === brandName.toLowerCase()
        )

        if (existingBrand) {
          // Marka varsa logo'yu güncelle
          if (existingBrand.logo !== imagePath) {
            await prisma.brand.update({
              where: { id: existingBrand.id },
              data: { logo: imagePath }
            })
            console.log(`✅ Güncellendi: ${brandName} (Logo: ${file})`)
            updated++
          } else {
            console.log(`⏭️  Zaten mevcut: ${brandName}`)
            skipped++
          }
        } else {
          // Yeni marka oluştur
          await prisma.brand.create({
            data: {
              name: brandName,
              logo: imagePath
            }
          })
          console.log(`✨ Oluşturuldu: ${brandName} (Logo: ${file})`)
          created++
        }
      } catch (error) {
        console.error(`❌ Hata (${file}):`, error.message)
      }
    }

    console.log('\n========================================')
    console.log('  SONUÇ')
    console.log('========================================')
    console.log(`✨ Oluşturulan: ${created}`)
    console.log(`✅ Güncellenen: ${updated}`)
    console.log(`⏭️  Atlanan: ${skipped}`)
    console.log(`📊 Toplam: ${files.length}`)
    console.log('========================================\n')

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Hata:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

createBrandsFromImages()

