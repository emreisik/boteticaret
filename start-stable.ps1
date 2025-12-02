# Stable start script with error handling and logging
cd C:\Users\Administrator\boteticaret

$logFile = "C:\Users\Administrator\boteticaret\app-start.log"

function Write-Log {
    param($message, $level = "INFO")
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] [$level] $message"
    Add-Content -Path $logFile -Value $logMessage
    Write-Host $logMessage
}

Write-Log "Starting stable application..."

# Stop existing processes
$existing = Get-Process node -ErrorAction SilentlyContinue
if ($existing) {
    Write-Log "Stopping existing Node.js processes..." "WARN"
    $existing | Stop-Process -Force
    Start-Sleep -Seconds 3
}

# Check database connection
Write-Log "Checking database connection..."
try {
    node scripts\test-db.js 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Database connection OK" "SUCCESS"
    } else {
        Write-Log "Database connection FAILED" "ERROR"
        exit 1
    }
} catch {
    Write-Log "Database check error: $($_.Exception.Message)" "ERROR"
    exit 1
}

# Check if build exists
if (-not (Test-Path .next)) {
    Write-Log "Build not found, building..." "WARN"
    npm run build 2>&1 | Tee-Object -FilePath "$logFile.build" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Build failed!" "ERROR"
        exit 1
    }
    Write-Log "Build completed" "SUCCESS"
}

# Start Next.js app
Write-Log "Starting Next.js application..."
$env:NODE_ENV = "production"
$env:PORT = "3000"
$env:HOSTNAME = "0.0.0.0"

# Start in a new PowerShell window that stays open
$psScript = @"
cd C:\Users\Administrator\boteticaret
`$env:NODE_ENV = 'production'
npm start 2>&1 | Tee-Object -FilePath 'C:\Users\Administrator\boteticaret\app-output.log' -Append
"@

$psScript | Out-File -FilePath "C:\Users\Administrator\boteticaret\run-app.ps1" -Encoding UTF8

Start-Process powershell -ArgumentList '-NoExit', '-File', 'C:\Users\Administrator\boteticaret\run-app.ps1' -WindowStyle Hidden

Start-Sleep -Seconds 15

# Verify it's running
$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Write-Log "Port 3000 is listening" "SUCCESS"
    
    Start-Sleep -Seconds 3
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 10
        Write-Log "Application started successfully - Status: $($response.StatusCode)" "SUCCESS"
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  APPLICATION STARTED SUCCESSFULLY" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "CANLI LINK: http://77.245.158.179:3000" -ForegroundColor Cyan
        Write-Host ""
    } catch {
        Write-Log "Application started but not responding: $($_.Exception.Message)" "ERROR"
    }
} else {
    Write-Log "Port 3000 is not listening - application may have failed to start" "ERROR"
    Write-Host "Check app-output.log for errors" -ForegroundColor Red
}


