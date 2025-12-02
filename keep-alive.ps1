# Keep-alive script - monitors and restarts if needed
cd C:\Users\Administrator\boteticaret

while ($true) {
    $nextApp = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    
    if (-not $nextApp) {
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Port 3000 is not open, restarting..." -ForegroundColor Yellow
        .\start-both.ps1
        Start-Sleep -Seconds 30
    } else {
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Port 3000 is open, OK" -ForegroundColor Green
    }
    
    Start-Sleep -Seconds 60
}

