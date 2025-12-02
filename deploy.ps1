# Windows Deploy Script
# PowerShell ile çalıştır: .\deploy.ps1

Write-Host "🚀 Windows Sunucuya Deploy Başlatılıyor..." -ForegroundColor Green

# Git pull
Write-Host "📥 Git pull yapılıyor..." -ForegroundColor Yellow
git pull origin master

# Bağımlılıkları yükle
Write-Host "📦 Bağımlılıklar yükleniyor..." -ForegroundColor Yellow
npm install

# Prisma generate
Write-Host "🗄️ Prisma client generate ediliyor..." -ForegroundColor Yellow
npx prisma generate

# Migration (eğer varsa)
Write-Host "🔄 Database migration çalıştırılıyor..." -ForegroundColor Yellow
npx prisma migrate deploy

# Build
Write-Host "🔨 Build yapılıyor..." -ForegroundColor Yellow
npm run build

# PM2 ile restart (eğer PM2 kullanıyorsanız)
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    Write-Host "🔄 PM2 ile restart yapılıyor..." -ForegroundColor Yellow
    pm2 restart boteticaret
    pm2 restart telegram-bot
} else {
    Write-Host "⚠️ PM2 bulunamadı. Manuel olarak başlatın: npm start" -ForegroundColor Red
}

Write-Host "✅ Deploy tamamlandı!" -ForegroundColor Green

