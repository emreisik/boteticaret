# Forever running script - keeps app alive permanently
cd C:\Users\Administrator\boteticaret

$logFile = "C:\Users\Administrator\boteticaret\forever.log"

function Write-Log {
    param($message, $level = "INFO")
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] [$level] $message"
    Add-Content -Path $logFile -Value $logMessage
    Write-Host $logMessage
}

Write-Log "Forever script started" "INFO"

# Stop all existing node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Infinite loop to keep app running
while ($true) {
    try {
        Write-Log "Starting Next.js application..." "INFO"
        
        # Set environment
        $env:NODE_ENV = "production"
        $env:PORT = "3000"
        $env:HOSTNAME = "0.0.0.0"
        
        # Start the app in foreground (not hidden) - this is the key difference
        # We'll run it in this PowerShell window
        Write-Log "Running npm start..." "INFO"
        
        # Run npm start and capture output
        $process = Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "C:\Users\Administrator\boteticaret" -PassThru -NoNewWindow -RedirectStandardOutput "C:\Users\Administrator\boteticaret\app-stdout.log" -RedirectStandardError "C:\Users\Administrator\boteticaret\app-stderr.log"
        
        Write-Log "Process started with PID: $($process.Id)" "SUCCESS"
        
        # Wait for it to be ready
        Start-Sleep -Seconds 15
        
        # Check if it's running
        $conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
        if ($conn) {
            Write-Log "Port 3000 is listening - app is running" "SUCCESS"
            
            # Monitor the process - if it exits, restart
            while (-not $process.HasExited) {
                Start-Sleep -Seconds 30
                
                # Check if site responds
                try {
                    $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                    Write-Log "Site is responding - Status: $($response.StatusCode)" "SUCCESS"
                } catch {
                    Write-Log "Site not responding, will restart..." "WARN"
                    $process.Kill()
                    break
                }
            }
            
            Write-Log "Process exited, restarting in 5 seconds..." "WARN"
            Start-Sleep -Seconds 5
        } else {
            Write-Log "Port 3000 not listening after 15 seconds, restarting..." "ERROR"
            $process.Kill()
            Start-Sleep -Seconds 5
        }
        
    } catch {
        Write-Log "Error: $($_.Exception.Message)" "ERROR"
        Start-Sleep -Seconds 10
    }
}

