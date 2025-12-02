# Enhanced monitoring script with better error handling
cd C:\Users\Administrator\boteticaret

$logFile = "C:\Users\Administrator\boteticaret\monitor.log"
$maxRestarts = 10
$restartCount = 0

function Write-Log {
    param($message, $level = "INFO")
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] [$level] $message"
    Add-Content -Path $logFile -Value $logMessage
    if ($level -eq "ERROR") {
        Write-Host $logMessage -ForegroundColor Red
    } elseif ($level -eq "WARN") {
        Write-Host $logMessage -ForegroundColor Yellow
    } else {
        Write-Host $logMessage -ForegroundColor Green
    }
}

Write-Log "Monitor script started" "INFO"

while ($true) {
    try {
        # Check if port 3000 is listening
        $listening = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
        
        if (-not $listening) {
            Write-Log "Port 3000 is not listening, restarting..." "WARN"
            $restartCount++
            
            if ($restartCount -gt $maxRestarts) {
                Write-Log "Maximum restart attempts reached ($maxRestarts). Stopping monitor." "ERROR"
                break
            }
            
            # Stop all node processes
            Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
            Start-Sleep -Seconds 5
            
            # Restart application
            .\start-stable.ps1
            Start-Sleep -Seconds 30
            $restartCount = 0  # Reset on successful restart
        } else {
            # Port is listening, verify site responds
            try {
                $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
                if ($response.StatusCode -eq 200) {
                    Write-Log "Application is running and responding (Status: 200)" "INFO"
                    $restartCount = 0  # Reset counter on success
                } else {
                    Write-Log "Application responded with status: $($response.StatusCode)" "WARN"
                }
            } catch {
                Write-Log "Port is open but application not responding: $($_.Exception.Message)" "WARN"
                Write-Log "Restarting application..." "WARN"
                Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
                Start-Sleep -Seconds 5
                .\start-stable.ps1
                Start-Sleep -Seconds 30
            }
        }
    } catch {
        Write-Log "Error in monitor loop: $($_.Exception.Message)" "ERROR"
    }
    
    Start-Sleep -Seconds 30  # Check every 30 seconds
}

