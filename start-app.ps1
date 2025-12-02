# Windows'ta Uygulamayı Başlat
# Kullanım: .\start-app.ps1

$ErrorActionPreference = "Continue"

Write-Host "🚀 Uygulama başlatılıyor..." -ForegroundColor Green

# Proje klasörüne git
Set-Location "C:\Users\Administrator\boteticaret"

# Node process'leri kontrol et
$existingProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($existingProcesses) {
    Write-Host "⚠️  Mevcut Node process'leri durduruluyor..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Uygulamayı başlat (arka planda)
Write-Host "📦 Next.js başlatılıyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\Administrator\boteticaret; npm start" -WindowStyle Minimized

# Bot'u başlat (arka planda)
Write-Host "🤖 Telegram bot başlatılıyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\Administrator\boteticaret; npm run bot" -WindowStyle Minimized

Start-Sleep -Seconds 5

# Kontrol et
$port3000 = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($port3000) {
    Write-Host "✅ Uygulama başarıyla başlatıldı!" -ForegroundColor Green
    Write-Host "🌐 Site: http://77.245.158.179:3000" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Port 3000 henüz açık değil. Birkaç saniye bekleyin..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Process'leri görmek için: Get-Process node" -ForegroundColor Gray
Write-Host "Durdurmak için: Stop-Process -Name node -Force" -ForegroundColor Gray

