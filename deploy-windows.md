# Windows Sunucuya Deploy Rehberi

## Gereksinimler

1. Windows Server (Windows Server 2019/2022 veya Windows 10/11)
2. Node.js 20.x yüklü
3. Git yüklü
4. PM2 (opsiyonel, process manager için)

## Adım 1: Sunucuya Bağlanma

### PowerShell veya CMD ile:
```powershell
# SSH ile bağlan (eğer OpenSSH yüklüyse)
ssh kullanici@sunucu-ip

# Veya RDP ile bağlanıp terminal aç
```

## Adım 2: Node.js ve Git Kurulumu

```powershell
# Node.js versiyonunu kontrol et
node --version

# Git versiyonunu kontrol et
git --version

# Eğer yoksa:
# Node.js: https://nodejs.org/ adresinden indir
# Git: https://git-scm.com/ adresinden indir
```

## Adım 3: Projeyi Klonlama

```powershell
# Proje klasörüne git
cd C:\inetpub\wwwroot
# veya
cd D:\Projects

# GitHub'dan klonla
git clone https://github.com/emreisik/boteticaret.git

# Proje klasörüne gir
cd boteticaret
```

## Adım 4: Bağımlılıkları Yükleme

```powershell
# Bağımlılıkları yükle
npm install

# Prisma client'ı generate et
npx prisma generate
```

## Adım 5: Environment Variables

```powershell
# .env dosyası oluştur
New-Item -Path .env -ItemType File

# .env dosyasını düzenle (Notepad veya VS Code ile)
notepad .env
```

`.env` dosyasına şunları ekle:
```
DATABASE_URL="file:./dev.db"
TELEGRAM_BOT_TOKEN="8347010025:AAEd4Q58tZipe0VrpVdy7UJOlYqslfj5HT4"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Not:** Production için PostgreSQL kullanıyorsanız:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

## Adım 6: Database Migration

```powershell
# Migration çalıştır
npx prisma migrate deploy

# Veya yeni migration oluştur
npx prisma migrate dev --name init
```

## Adım 7: Build ve Start

### Yöntem 1: Direkt Çalıştırma
```powershell
# Build
npm run build

# Start
npm start
```

### Yöntem 2: PM2 ile (Önerilen)
```powershell
# PM2'yi global yükle
npm install -g pm2

# PM2 ile başlat
pm2 start npm --name "boteticaret" -- start

# PM2 ile bot'u başlat (ayrı process)
pm2 start npm --name "telegram-bot" -- run bot

# PM2 durumunu kontrol et
pm2 status

# PM2 logları
pm2 logs

# PM2'yi Windows servis olarak kur
pm2 startup
pm2 save
```

## Adım 8: Windows Firewall

```powershell
# Port 3000'i aç (Next.js için)
New-NetFirewallRule -DisplayName "Next.js App" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Port 443'i aç (HTTPS için, eğer kullanıyorsanız)
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

## Adım 9: IIS ile Reverse Proxy (Opsiyonel)

Eğer IIS kullanıyorsanız, reverse proxy kurun:

1. IIS'te URL Rewrite modülünü yükleyin
2. `web.config` dosyası oluşturun (proje kökünde)

## Adım 10: Otomatik Deploy Script

`deploy.ps1` script'ini çalıştırın.

