# Start only Next.js app (no bot)
cd C:\Users\Administrator\boteticaret

# Check if already running
$existing = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Port 3000 already in use, stopping existing processes..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 3
}

# Start Next.js app
Write-Host "Starting Next.js app..." -ForegroundColor Cyan
$env:NODE_ENV = "production"
$env:PORT = "3000"
$env:HOSTNAME = "0.0.0.0"

# Start in background
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\Users\Administrator\boteticaret; $env:NODE_ENV="production"; $env:PORT="3000"; $env:HOSTNAME="0.0.0.0"; npm start' -WindowStyle Hidden

Start-Sleep -Seconds 10

# Check status
$conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($conn) {
    Write-Host "Port 3000 is open!" -ForegroundColor Green
    $conn | Select-Object LocalAddress, LocalPort, State | Format-Table
    
    Start-Sleep -Seconds 3
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 10
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  SITE CALISIYOR!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
        Write-Host "CANLI LINK: http://77.245.158.179:3000" -ForegroundColor Yellow
        Write-Host ""
    } catch {
        Write-Host "Localhost test failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Port 3000 is not open!" -ForegroundColor Red
    Write-Host "Check logs for errors." -ForegroundColor Yellow
}

