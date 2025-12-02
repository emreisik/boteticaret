# Kalici olarak uygulamayi baslat
$ErrorActionPreference = "Continue"

Set-Location "C:\Users\Administrator\boteticaret"

# Eski process'leri durdur
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Next.js'i baslat - nohup benzeri
$process = Start-Process -FilePath "node" -ArgumentList "node_modules\.bin\next", "start", "-p", "3000" -WorkingDirectory "C:\Users\Administrator\boteticaret" -WindowStyle Hidden -PassThru

Write-Host "Next.js baslatildi. Process ID: $($process.Id)" -ForegroundColor Green

# Bot'u baslat
$botProcess = Start-Process -FilePath "node" -ArgumentList "node_modules\.bin\tsx", "scripts\start-bot.ts" -WorkingDirectory "C:\Users\Administrator\boteticaret" -WindowStyle Hidden -PassThru

Write-Host "Telegram bot baslatildi. Process ID: $($botProcess.Id)" -ForegroundColor Green

Start-Sleep -Seconds 5

# Kontrol et
$port3000 = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($port3000) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  UYGULAMA BASARIYLA BASLATILDI!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Site URL: http://77.245.158.179:3000" -ForegroundColor Cyan
    Write-Host "Local URL: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Process ID'ler:" -ForegroundColor Yellow
    Write-Host "  Next.js: $($process.Id)" -ForegroundColor White
    Write-Host "  Bot: $($botProcess.Id)" -ForegroundColor White
} else {
    Write-Host "Port 3000 henuz acik degil. Biraz bekleyin..." -ForegroundColor Yellow
    Write-Host "Process ID: $($process.Id)" -ForegroundColor Gray
}

