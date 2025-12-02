const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testDB() {
  try {
    await prisma.$connect()
    console.log('✅ Veritabani baglantisi basarili!')
    const brands = await prisma.brand.findMany()
    console.log(`✅ ${brands.length} marka bulundu`)
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Veritabani hatasi:', error.message)
    process.exit(1)
  }
}

testDB()

