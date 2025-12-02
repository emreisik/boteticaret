# Simple script to start the application NOW
# This will run until you close the PowerShell window

cd C:\Users\Administrator\boteticaret

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING APPLICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop existing
Write-Host "Stopping existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Set environment
$env:NODE_ENV = "production"
$env:PORT = "3000"

Write-Host "Starting Next.js..." -ForegroundColor Green
Write-Host "This window must stay open for the app to run." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the application." -ForegroundColor Yellow
Write-Host ""
Write-Host "Waiting for app to start..." -ForegroundColor Cyan
Write-Host ""

# Start and wait
& npm start

