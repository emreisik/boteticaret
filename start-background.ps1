# Arka planda uygulamayi baslat
$ErrorActionPreference = "Continue"

Set-Location "C:\Users\Administrator\boteticaret"

# Eski process'leri durdur
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Next.js'i baslat
$job1 = Start-Job -ScriptBlock {
    Set-Location "C:\Users\Administrator\boteticaret"
    npm start
}

# Bot'u baslat
$job2 = Start-Job -ScriptBlock {
    Set-Location "C:\Users\Administrator\boteticaret"
    npm run bot
}

Write-Host "Uygulamalar baslatildi. Job ID'ler:" -ForegroundColor Green
Write-Host "Next.js: $($job1.Id)" -ForegroundColor Cyan
Write-Host "Bot: $($job2.Id)" -ForegroundColor Cyan

Write-Host ""
Write-Host "Durum kontrol etmek icin: Get-Job" -ForegroundColor Gray
Write-Host "Loglar icin: Receive-Job -Id <JobId>" -ForegroundColor Gray

