# Keep-alive script using PowerShell jobs
cd C:\Users\Administrator\boteticaret

$logFile = "C:\Users\Administrator\boteticaret\keep-alive.log"

function Write-Log {
    param($message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] $message"
    Add-Content -Path $logFile -Value $logMessage
    Write-Host $logMessage
}

Write-Log "Keep-alive script started (using jobs)"

while ($true) {
    try {
        # Check if port 3000 is listening
        $listening = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
        
        if (-not $listening) {
            Write-Log "Port 3000 is not listening, restarting..."
            
            # Stop all node processes
            Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
            
            # Remove old jobs
            Get-Job | Remove-Job -Force -ErrorAction SilentlyContinue
            
            Start-Sleep -Seconds 3
            
            # Start new job
            $job = Start-Job -ScriptBlock {
                Set-Location C:\Users\Administrator\boteticaret
                $env:NODE_ENV = "production"
                & npm start 2>&1 | Out-File -FilePath "C:\Users\Administrator\boteticaret\app-output.log" -Append
            }
            
            Write-Log "Started new job with ID: $($job.Id)"
            Start-Sleep -Seconds 20
        } else {
            # Test if site responds
            try {
                $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                Write-Log "Site is healthy - Status: $($response.StatusCode)"
            } catch {
                Write-Log "Site not responding, restarting..."
                
                # Stop all node processes
                Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
                
                # Remove old jobs
                Get-Job | Remove-Job -Force -ErrorAction SilentlyContinue
                
                Start-Sleep -Seconds 3
                
                # Start new job
                $job = Start-Job -ScriptBlock {
                    Set-Location C:\Users\Administrator\boteticaret
                    $env:NODE_ENV = "production"
                    & npm start 2>&1 | Out-File -FilePath "C:\Users\Administrator\boteticaret\app-output.log" -Append
                }
                
                Write-Log "Started new job with ID: $($job.Id)"
                Start-Sleep -Seconds 20
            }
        }
    } catch {
        Write-Log "Error in keep-alive loop: $($_.Exception.Message)"
    }
    
    # Check every 60 seconds
    Start-Sleep -Seconds 60
}


