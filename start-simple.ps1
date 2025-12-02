# Simple start script - no hidden windows, just run
cd C:\Users\Administrator\boteticaret

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING APPLICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop existing processes
Write-Host "Stopping existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Set environment
$env:NODE_ENV = "production"
$env:PORT = "3000"
$env:HOSTNAME = "0.0.0.0"

Write-Host "Starting Next.js..." -ForegroundColor Green
Write-Host ""

# Just run npm start - no fancy stuff
npm start


