# Keep-alive script - monitors and restarts if needed
cd C:\Users\Administrator\boteticaret

# Log file
$logFile = "C:\Users\Administrator\boteticaret\keep-alive.log"

function Write-Log {
    param($message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] $message"
    Add-Content -Path $logFile -Value $logMessage
    Write-Host $logMessage
}

Write-Log "Keep-alive script started"

while ($true) {
    try {
        # Check if port 3000 is listening (not just any connection)
        $listening = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
        
        if (-not $listening) {
            Write-Log "Port 3000 is not listening, restarting..."
            Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
            Start-Sleep -Seconds 3
            .\start-app-only.ps1
            Start-Sleep -Seconds 30
        } else {
            # Also test if site responds
            try {
                $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
                Write-Log "Port 3000 is open and site responds (Status: $($response.StatusCode))"
            } catch {
                Write-Log "Port 3000 is open but site doesn't respond, restarting..."
                Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
                Start-Sleep -Seconds 3
                .\start-app-only.ps1
                Start-Sleep -Seconds 30
            }
        }
    } catch {
        Write-Log "Error in keep-alive loop: $($_.Exception.Message)"
    }
    
    Start-Sleep -Seconds 60
}

