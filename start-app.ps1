# Windows'ta Uygulamayi Baslat
# Kullanim: .\start-app.ps1

$ErrorActionPreference = "Continue"

Write-Host "Uygulama baslatiliyor..." -ForegroundColor Green

# Proje klasorune git
Set-Location "C:\Users\Administrator\boteticaret"

# Node process'leri kontrol et
$existingProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($existingProcesses) {
    Write-Host "Mevcut Node process'leri durduruluyor..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Uygulamayi baslat (arka planda)
Write-Host "Next.js baslatiliyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\Administrator\boteticaret; npm start" -WindowStyle Minimized

# Bot'u baslat (arka planda)
Write-Host "Telegram bot baslatiliyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\Administrator\boteticaret; npm run bot" -WindowStyle Minimized

Start-Sleep -Seconds 5

# Kontrol et
$port3000 = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($port3000) {
    Write-Host "Uygulama basariyla baslatildi!" -ForegroundColor Green
    Write-Host "Site: http://77.245.158.179:3000" -ForegroundColor Cyan
} else {
    Write-Host "Port 3000 henuz acik degil. Biraz bekleyin..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Processleri gormek icin: Get-Process node" -ForegroundColor Gray
Write-Host "Durdurmak icin: Stop-Process -Name node -Force" -ForegroundColor Gray
