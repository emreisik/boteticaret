# Start application with keep-alive monitoring
cd C:\Users\Administrator\boteticaret

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING APPLICATION WITH KEEP-ALIVE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop existing processes and jobs
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Job | Remove-Job -Force -ErrorAction SilentlyContinue
Get-Process powershell -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*keep-alive*' } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Start the application
Write-Host "Starting application..." -ForegroundColor Cyan
$appJob = Start-Job -ScriptBlock {
    Set-Location C:\Users\Administrator\boteticaret
    $env:NODE_ENV = "production"
    & npm start 2>&1 | Out-File -FilePath "C:\Users\Administrator\boteticaret\app-output.log" -Append
}

Write-Host "Application job started with ID: $($appJob.Id)" -ForegroundColor Green
Start-Sleep -Seconds 20

# Check if it's running
$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Write-Host "Application is running on port 3000" -ForegroundColor Green
    
    # Start keep-alive monitor
    Write-Host "Starting keep-alive monitor..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList '-NoExit', '-File', 'C:\Users\Administrator\boteticaret\keep-alive-job.ps1' -WindowStyle Minimized
    
    Start-Sleep -Seconds 3
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  APPLICATION STARTED SUCCESSFULLY" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Application: RUNNING" -ForegroundColor Green
    Write-Host "Keep-alive: ACTIVE" -ForegroundColor Green
    Write-Host ""
    Write-Host "CANLI LINK: http://77.245.158.179:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "The application will automatically restart if it crashes." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Failed to start application - check logs" -ForegroundColor Red
    Get-Content app-output.log -Tail 20
}

