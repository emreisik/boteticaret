# Check environment variables and configuration
cd C:\Users\Administrator\boteticaret

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ENVIRONMENT CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check .env file
Write-Host "1. .env file:" -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "   EXISTS" -ForegroundColor Green
    Write-Host "   Content (masked):" -ForegroundColor White
    Get-Content .env | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $key = $matches[1]
            $value = $matches[2]
            if ($key -match "PASSWORD|TOKEN|SECRET") {
                Write-Host "   $key=***MASKED***" -ForegroundColor Gray
            } else {
                Write-Host "   $_" -ForegroundColor Gray
            }
        }
    }
} else {
    Write-Host "   NOT FOUND" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Database connection:" -ForegroundColor Yellow
try {
    node scripts\test-db.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK" -ForegroundColor Green
    } else {
        Write-Host "   FAILED" -ForegroundColor Red
    }
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Build status:" -ForegroundColor Yellow
if (Test-Path .next) {
    Write-Host "   EXISTS" -ForegroundColor Green
} else {
    Write-Host "   NOT FOUND - need to run 'npm run build'" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Node.js version:" -ForegroundColor Yellow
node --version

Write-Host ""
Write-Host "5. npm version:" -ForegroundColor Yellow
npm --version

Write-Host ""
Write-Host "6. Current processes:" -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, StartTime | Format-Table

Write-Host ""
Write-Host "7. Port 3000 status:" -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object State, LocalAddress, LocalPort | Format-Table

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

