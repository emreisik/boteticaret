# Windows Sunucuya Remote Deploy Script
# Kullanım: .\deploy-remote.ps1

$serverIP = "77.245.158.179"
$serverPort = "2222"
$serverUser = "Administrator"
$serverPass = "P4fLf!DGez@0L1"
$serverPath = "C:\inetpub\wwwroot\boteticaret"

Write-Host "🚀 Windows Sunucuya Deploy Başlatılıyor..." -ForegroundColor Green
Write-Host "📡 Sunucu: $serverIP:$serverPort" -ForegroundColor Yellow

# SSH ile bağlan ve komutları çalıştır
$commands = @"
cd $serverPath
git pull origin master
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
"@

# SSH bağlantısı için plink kullan (PuTTY'den)
# veya OpenSSH kullan
Write-Host "⚠️  SSH ile manuel bağlanıp aşağıdaki komutları çalıştırın:" -ForegroundColor Yellow
Write-Host $commands -ForegroundColor Cyan

Write-Host "`n📝 SSH Bağlantı Komutu:" -ForegroundColor Green
Write-Host "ssh -p $serverPort $serverUser@$serverIP" -ForegroundColor White

