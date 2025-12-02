# Direct run - no fancy process management
cd C:\Users\Administrator\boteticaret

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING APPLICATION DIRECTLY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop existing
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Set environment
$env:NODE_ENV = "production"

Write-Host "Starting Next.js on port 3000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Run directly - this will keep the window open
& npm start 2>&1 | Tee-Object -FilePath "C:\Users\Administrator\boteticaret\app-output.log" -Append


