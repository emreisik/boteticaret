# Start in background using job
cd C:\Users\Administrator\boteticaret

Write-Host "Stopping existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

Write-Host "Starting application in background..." -ForegroundColor Cyan

# Use PowerShell job to run in background
$job = Start-Job -ScriptBlock {
    Set-Location C:\Users\Administrator\boteticaret
    $env:NODE_ENV = "production"
    & npm start 2>&1 | Out-File -FilePath "C:\Users\Administrator\boteticaret\app-output.log" -Append
}

Write-Host "Job started with ID: $($job.Id)" -ForegroundColor Green
Start-Sleep -Seconds 20

# Check status
Write-Host ""
Write-Host "Checking status..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, StartTime | Format-Table
$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Write-Host "Port 3000 is listening!" -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 10
        Write-Host "Site is responding - Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  APPLICATION RUNNING" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "CANLI LINK: http://77.245.158.179:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "To check logs: Get-Content app-output.log -Tail 20" -ForegroundColor Yellow
        Write-Host "To stop: Get-Job | Remove-Job -Force; Get-Process node | Stop-Process -Force" -ForegroundColor Yellow
    } catch {
        Write-Host "Port is open but site not responding: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Port 3000 is NOT listening - check logs" -ForegroundColor Red
    Write-Host "Last 20 lines of log:" -ForegroundColor Yellow
    Get-Content app-output.log -Tail 20
}
