import { Telegraf, Context } from 'telegraf'
import { prisma } from './prisma'
import fs from 'fs-extra'
import path from 'path'

// Bot'u lazy load et - sadece runtime'da yükle
let botInstance: Telegraf | null = null

// Yetkili kullanıcı ID'si
const AUTHORIZED_USER_ID = 1682856257

// Kullanıcı yetkisi kontrolü
function isAuthorized(userId?: number): boolean {
  return userId === AUTHORIZED_USER_ID
}

// Son gönderilen fotoğrafları sakla (kullanıcı bazlı)
const userPhotos = new Map<number, string>()
const userBrandLogos = new Map<number, string>()

// Fotoğraf ile ürün ekleme fonksiyonu
async function addProductFromPhoto(ctx: Context, photo: { file_id: string }, commandText: string, bot: Telegraf) {
  try {
    const args = commandText.split(' ').slice(1)
    
    if (args.length < 4) {
      return ctx.reply('Kullanım: /urun <marka> <kategori> <isim> <fiyat>\nÖrnek: /urun Nike Ayakkabı Nike Air Max 5000')
    }

    const [brandName, categoryName, ...nameParts] = args.slice(0, -1)
    const price = parseFloat(args[args.length - 1])
    const productName = nameParts.join(' ')

    if (isNaN(price)) {
      return ctx.reply('Fiyat geçerli bir sayı olmalıdır.')
    }

    // Markayı bul veya oluştur (case-insensitive)
    const allBrands = await prisma.brand.findMany()
    let brand = allBrands.find(b => b.name.toLowerCase() === brandName.toLowerCase())

    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: brandName }
      })
    }

    // Kategoriyi bul veya oluştur
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-')
    let category = await prisma.category.findFirst({
      where: { slug: categorySlug }
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug
        }
      })
    }

    // En yüksek çözünürlüklü fotoğrafı al
    const file = await bot.telegram.getFile(photo.file_id)
    const filePath = file.file_path

    // Fotoğrafı indir
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.ensureDir(uploadsDir)

    const fileName = `${Date.now()}-${photo.file_id}.jpg`
    const localPath = path.join(uploadsDir, fileName)

    // Telegram'dan dosyayı indir
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`
    const response = await fetch(fileUrl)
    const buffer = await response.arrayBuffer()
    await fs.writeFile(localPath, Buffer.from(buffer))

    // Ürünü oluştur
    const product = await prisma.product.create({
      data: {
        name: productName,
        price: price,
        image: `/uploads/${fileName}`,
        brandId: brand.id,
        categoryId: category.id
      }
    })

    ctx.reply(`✅ Ürün başarıyla eklendi!\n\n📦 ${productName}\n💰 ${price} TL\n🏷️ ${brandName}\n📂 ${categoryName}`)
  } catch (error) {
    console.error('Telegram bot error:', error)
    ctx.reply('❌ Bir hata oluştu. Lütfen tekrar deneyin.')
  }
}

// Marka logosu ekleme fonksiyonu
async function addBrandLogo(ctx: Context, photo: { file_id: string }, brandName: string, bot: Telegraf) {
  try {
    // Markayı bul (case-insensitive)
    const allBrands = await prisma.brand.findMany()
    const brand = allBrands.find(b => b.name.toLowerCase() === brandName.toLowerCase())

    if (!brand) {
      return ctx.reply(`❌ "${brandName}" markası bulunamadı. Önce ürün ekleyerek markayı oluşturun.`)
    }

    // En yüksek çözünürlüklü fotoğrafı al
    const file = await bot.telegram.getFile(photo.file_id)
    const filePath = file.file_path

    // Logo klasörünü oluştur
    const brandsDir = path.join(process.cwd(), 'public', 'images', 'brands')
    await fs.ensureDir(brandsDir)

    // Dosya adını marka adına göre oluştur
    const safeBrandName = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const fileName = `${safeBrandName}-${Date.now()}.jpg`
    const localPath = path.join(brandsDir, fileName)

    // Eski logoyu sil (varsa)
    if (brand.logo) {
      const oldLogoPath = path.join(process.cwd(), 'public', brand.logo.replace(/^\//, ''))
      if (await fs.pathExists(oldLogoPath)) {
        await fs.remove(oldLogoPath)
      }
    }

    // Telegram'dan dosyayı indir
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`
    const response = await fetch(fileUrl)
    const buffer = await response.arrayBuffer()
    await fs.writeFile(localPath, Buffer.from(buffer))

    // Marka logosunu güncelle
    await prisma.brand.update({
      where: { id: brand.id },
      data: { logo: `/images/brands/${fileName}` }
    })

    ctx.reply(`✅ ${brandName} markasının logosu başarıyla güncellendi!`)
  } catch (error) {
    console.error('Marka logosu ekleme hatası:', error)
    ctx.reply('❌ Bir hata oluştu. Lütfen tekrar deneyin.')
  }
}

// Bot handler'larını kur
function setupBotHandlers(bot: Telegraf) {
  // Fotoğraf gönderildiğinde (caption ile komut varsa)
  bot.on('photo', async (ctx) => {
    const userId = ctx.from?.id
    if (!userId) return
    
    // Yetkilendirme kontrolü
    if (!isAuthorized(userId)) {
      return ctx.reply('❌ Bu botu kullanma yetkiniz yok.')
    }

    // En yüksek çözünürlüklü fotoğrafı al
    const photo = ctx.message.photo[ctx.message.photo.length - 1]
    userPhotos.set(userId, photo.file_id)
    userBrandLogos.set(userId, photo.file_id)

    // Eğer caption'da komut varsa işle
    const caption = ctx.message.caption
    if (caption && caption.startsWith('/urun')) {
      await addProductFromPhoto(ctx, photo, caption, bot)
      userPhotos.delete(userId)
    } else if (caption && caption.startsWith('/logo')) {
      const brandName = caption.split(' ').slice(1).join(' ')
      if (brandName) {
        await addBrandLogo(ctx, photo, brandName, bot)
        userBrandLogos.delete(userId)
      }
    }
  })

  // Ürün ekleme komutu: /urun <marka> <kategori> <isim> <fiyat>
  bot.command('urun', async (ctx) => {
    const userId = ctx.from?.id
    if (!userId) return
    
    // Yetkilendirme kontrolü
    if (!isAuthorized(userId)) {
      return ctx.reply('❌ Bu botu kullanma yetkiniz yok.')
    }

    // Son gönderilen fotoğrafı kontrol et
    const lastPhotoId = userPhotos.get(userId)
    
    if (!lastPhotoId) {
      return ctx.reply('Lütfen önce bir fotoğraf gönderin, sonra komutu yazın.\n\nVeya fotoğraf gönderirken caption olarak komutu yazabilirsiniz:\n/urun Nike Ayakkabı Nike Air Max 5000')
    }

    // Son fotoğrafı al
    const photo = { file_id: lastPhotoId }
    await addProductFromPhoto(ctx, photo, ctx.message.text, bot)
    userPhotos.delete(userId)
  })

  // Marka listesi
  bot.command('markalar', async (ctx) => {
    const userId = ctx.from?.id
    
    // Yetkilendirme kontrolü
    if (!isAuthorized(userId)) {
      return ctx.reply('❌ Bu botu kullanma yetkiniz yok.')
    }
    
    try {
      const brands = await prisma.brand.findMany({
        orderBy: { name: 'asc' }
      })

      if (brands.length === 0) {
        return ctx.reply('Henüz marka eklenmemiş.')
      }

      const brandList = brands.map(b => `• ${b.name}`).join('\n')
      ctx.reply(`📋 Markalar:\n\n${brandList}`)
    } catch (error) {
      console.error('Error:', error)
      ctx.reply('❌ Bir hata oluştu.')
    }
  })

  // Kategori listesi
  bot.command('kategoriler', async (ctx) => {
    const userId = ctx.from?.id
    
    // Yetkilendirme kontrolü
    if (!isAuthorized(userId)) {
      return ctx.reply('❌ Bu botu kullanma yetkiniz yok.')
    }
    
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
      })

      if (categories.length === 0) {
        return ctx.reply('Henüz kategori eklenmemiş.')
      }

      const categoryList = categories.map(c => `• ${c.name}`).join('\n')
      ctx.reply(`📋 Kategoriler:\n\n${categoryList}`)
    } catch (error) {
      console.error('Error:', error)
      ctx.reply('❌ Bir hata oluştu.')
    }
  })

  // Marka logosu ekleme komutu: /logo <marka>
  bot.command('logo', async (ctx) => {
    const userId = ctx.from?.id
    if (!userId) return
    
    // Yetkilendirme kontrolü
    if (!isAuthorized(userId)) {
      return ctx.reply('❌ Bu botu kullanma yetkiniz yok.')
    }

    const args = ctx.message.text.split(' ').slice(1)
    if (args.length === 0) {
      return ctx.reply('Kullanım: /logo <marka>\nÖrnek: /logo Nike\n\nÖnce bir fotoğraf gönderin, sonra bu komutu yazın.\nVeya fotoğraf gönderirken caption olarak yazabilirsiniz: /logo Nike')
    }

    const brandName = args.join(' ')

    // Son gönderilen fotoğrafı kontrol et
    const lastPhotoId = userBrandLogos.get(userId)
    
    if (!lastPhotoId) {
      return ctx.reply('Lütfen önce bir fotoğraf gönderin, sonra komutu yazın.\n\nVeya fotoğraf gönderirken caption olarak komutu yazabilirsiniz:\n/logo Nike')
    }

    // Son fotoğrafı al
    const photo = { file_id: lastPhotoId }
    await addBrandLogo(ctx, photo, brandName, bot)
    userBrandLogos.delete(userId)
  })

  // Yardım komutu
  bot.command('yardim', (ctx) => {
    ctx.reply(
      `🤖 E-Ticaret Bot Komutları:\n\n` +
      `📦 /urun <marka> <kategori> <isim> <fiyat> - Ürün ekle (fotoğraf ile)\n` +
      `🖼️ /logo <marka> - Marka logosu ekle/güncelle (fotoğraf ile)\n` +
      `📋 /markalar - Tüm markaları listele\n` +
      `📂 /kategoriler - Tüm kategorileri listele\n` +
      `❓ /yardim - Bu yardım mesajını göster\n\n` +
      `Örnek kullanım:\n` +
      `1. Fotoğraf gönder\n` +
      `2. /urun Nike Ayakkabı Nike Air Max 5000\n\n` +
      `Marka logosu için:\n` +
      `1. Logo fotoğrafı gönder\n` +
      `2. /logo Nike`
    )
  })
}

// Bot instance'ı al (lazy load)
export function getBot(): Telegraf {
  if (!botInstance) {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set')
    }
    botInstance = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
    setupBotHandlers(botInstance)
  }
  return botInstance
}

// Default export (polling için)
export default function createBot() {
  return getBot()
}
