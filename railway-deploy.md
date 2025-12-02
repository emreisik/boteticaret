# Railway Deploy Rehberi

## Adımlar

### 1. Railway'a Giriş
- [Railway](https://railway.app) hesabı oluşturun (GitHub ile giriş yapabilirsiniz)

### 2. Yeni Proje Oluşturma

1. Railway dashboard'a gidin
2. "New Project" butonuna tıklayın
3. "Deploy from GitHub repo" seçin
4. GitHub repository'nizi seçin

### 3. PostgreSQL Database Ekleme

1. Projede "New" butonuna tıklayın
2. "Database" > "Add PostgreSQL" seçin
3. Railway otomatik olarak `DATABASE_URL` environment variable'ını ekler

### 4. Environment Variables

Railway otomatik olarak şunları ekler:
- `DATABASE_URL` (PostgreSQL için)

Manuel eklemeniz gerekenler:
- `TELEGRAM_BOT_TOKEN` = `8347010025:AAEd4Q58tZipe0VrpVdy7UJOlYqslfj5HT4`
- `NEXT_PUBLIC_APP_URL` = Railway URL'iniz (örn: `https://your-app.railway.app`)

### 5. Prisma Schema'yı PostgreSQL için Güncelleme

`prisma/schema.prisma` dosyasında:
```prisma
datasource db {
  provider = "postgresql"  // sqlite yerine postgresql
  url      = env("DATABASE_URL")
}
```

### 6. Migration Çalıştırma

Railway'de service oluşturduktan sonra:
1. Service'e tıklayın
2. "Deployments" sekmesine gidin
3. "View Logs" ile terminal açın
4. Şu komutları çalıştırın:
```bash
npx prisma generate
npx prisma migrate deploy
```

### 7. Bot Service'i (Opsiyonel)

Bot'u ayrı bir service olarak çalıştırmak için:
1. Projede "New" > "Empty Service" ekleyin
2. GitHub repo'yu bağlayın
3. Start command: `npm run bot`
4. Environment variables'ı ekleyin

## Railway CLI ile Deploy

```bash
# Railway CLI yükleyin
npm install -g @railway/cli

# Giriş yapın
railway login

# Projeyi bağlayın
railway link

# Deploy edin
railway up
```

## Önemli Notlar

- Railway PostgreSQL database'i otomatik olarak sağlar
- `DATABASE_URL` otomatik olarak ayarlanır
- Bot'u ayrı bir service olarak çalıştırabilirsiniz
- Railway'de dosya upload için persistent storage gerekir (Blob Storage)

