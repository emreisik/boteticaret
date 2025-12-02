# E-Ticaret - Telegram Bot Entegrasyonu

Next.js ile oluşturulmuş minimal e-ticaret sitesi. Ürünler Telegram bot üzerinden yüklenir.

## Özellikler

- 📱 Telegram bot ile ürün yükleme
- 🏷️ Marka bazlı ürün listeleme
- 📂 Kategori bazlı ürün listeleme
- 🎨 Minimal ve sade tasarım
- 📸 Fotoğraf yükleme desteği

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyası oluşturun:
```bash
cp .env.example .env
```

3. `.env` dosyasını düzenleyin:
```
DATABASE_URL="file:./dev.db"
TELEGRAM_BOT_TOKEN="your_telegram_bot_token_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Veritabanını oluşturun:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Telegram bot token'ınızı alın:
   - [@BotFather](https://t.me/botfather) ile yeni bir bot oluşturun
   - Token'ı `.env` dosyasına ekleyin

6. Telegram bot'u başlatın (webhook kullanmıyorsanız):
```bash
npm run bot
```

Veya webhook kullanmak için:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram"
```

7. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Telegram Bot Kullanımı

### Komutlar

- `/yardim` - Tüm komutları gösterir
- `/urun <marka> <kategori> <isim> <fiyat>` - Ürün ekler (fotoğraf ile birlikte)
- `/logo <marka>` - Marka logosu ekler/günceller (fotoğraf ile birlikte)
- `/markalar` - Tüm markaları listeler
- `/kategoriler` - Tüm kategorileri listeler

### Ürün Ekleme Örneği

**Yöntem 1: Fotoğraf caption'ı ile**
1. Telegram'da botunuza bir fotoğraf gönderin
2. Fotoğrafın caption'ına şu komutu yazın:
```
/urun Nike Ayakkabı Nike Air Max 5000
```

**Yöntem 2: Önce fotoğraf, sonra komut**
1. Telegram'da botunuza bir fotoğraf gönderin
2. Sonra ayrı bir mesaj olarak komutu yazın:
```
/urun Nike Ayakkabı Nike Air Max 5000
```

Bot otomatik olarak:
- Markayı oluşturur (yoksa)
- Kategoriyi oluşturur (yoksa)
- Fotoğrafı indirir ve kaydeder
- Ürünü veritabanına ekler

### Marka Logosu Ekleme

**Yöntem 1: Fotoğraf caption'ı ile**
1. Telegram'da botunuza bir logo fotoğrafı gönderin
2. Fotoğrafın caption'ına şu komutu yazın:
```
/logo Nike
```

**Yöntem 2: Önce fotoğraf, sonra komut**
1. Telegram'da botunuza bir logo fotoğrafı gönderin
2. Sonra ayrı bir mesaj olarak komutu yazın:
```
/logo Nike
```

**Not:** Marka logosu eklemek için önce markanın var olması gerekir (ürün ekleyerek oluşturulabilir).

## Proje Yapısı

```
├── app/
│   ├── api/telegram/     # Telegram webhook endpoint
│   ├── brand/[id]/       # Marka sayfası
│   ├── category/[slug]/  # Kategori sayfası
│   ├── product/[id]/     # Ürün detay sayfası
│   └── page.tsx          # Ana sayfa
├── components/
│   └── Header.tsx        # Header bileşeni
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── telegram.ts       # Telegram bot logic
└── prisma/
    └── schema.prisma     # Veritabanı şeması
```

## Notlar

- Ürün fotoğrafları `public/uploads/` klasörüne kaydedilir
- Marka logoları `public/images/brands/` klasörüne kaydedilir
- Veritabanı SQLite kullanır (geliştirme için)
- Üretim ortamında PostgreSQL kullanılması önerilir

