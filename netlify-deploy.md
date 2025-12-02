# Netlify Deploy Rehberi

## Adımlar

### 1. Netlify'a Giriş
- [Netlify](https://www.netlify.com) hesabı oluşturun veya giriş yapın

### 2. Projeyi Deploy Etme

**Yöntem 1: Netlify CLI ile**
```bash
# Netlify CLI'yi yükleyin
npm install -g netlify-cli

# Giriş yapın
netlify login

# Deploy edin
netlify deploy --prod
```

**Yöntem 2: GitHub/GitLab ile**
1. Projenizi GitHub'a push edin
2. Netlify dashboard'a gidin
3. "Add new site" > "Import an existing project"
4. GitHub'ı seçin ve repository'nizi seçin
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### 3. Environment Variables Ayarlama

Netlify dashboard'da:
1. Site settings > Environment variables
2. Şu değişkenleri ekleyin:
   - `DATABASE_URL` = `file:./dev.db` (SQLite için, production'da PostgreSQL kullanın)
   - `TELEGRAM_BOT_TOKEN` = Bot token'ınız
   - `NEXT_PUBLIC_APP_URL` = Netlify URL'iniz (örn: `https://your-site.netlify.app`)

### 4. Database (Önemli!)

**SQLite local'de çalışır, production'da çalışmaz!**

Production için:
1. PostgreSQL database oluşturun (Supabase, Railway, Neon gibi)
2. `DATABASE_URL` environment variable'ını PostgreSQL connection string ile güncelleyin
3. Migration'ları çalıştırın:
   ```bash
   npx prisma migrate deploy
   ```

### 5. Telegram Bot Webhook (Opsiyonel)

Bot'u webhook modunda kullanmak için:
1. Netlify Functions oluşturun (veya bot'u ayrı bir sunucuda çalıştırın)
2. Webhook URL'i ayarlayın:
   ```
   https://your-site.netlify.app/api/telegram
   ```

**Not:** Bot şu an polling modunda çalışıyor. Webhook için ayrı bir endpoint gerekir.

## Önemli Notlar

- SQLite production'da çalışmaz, PostgreSQL kullanın
- Bot polling modunda local'de çalışmalı veya webhook için ayrı endpoint gerekir
- Upload klasörleri (`public/uploads`, `public/images`) Netlify'da kalıcı değildir
- Dosya upload için Netlify Blob Storage veya başka bir servis kullanın

