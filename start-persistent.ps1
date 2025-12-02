# Persistent start script - keeps processes running
cd C:\Users\Administrator\boteticaret

# Function to start Next.js app
function Start-NextApp {
    $process = Get-Process node -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like '*next start*' -or $_.Path -like '*boteticaret*'
    }
    
    if (-not $process) {
        Write-Host "Starting Next.js app..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\Users\Administrator\boteticaret; $env:NODE_ENV="production"; npm start' -WindowStyle Hidden
        Start-Sleep -Seconds 5
    } else {
        Write-Host "Next.js app already running (PID: $($process.Id))" -ForegroundColor Green
    }
}

# Function to start Telegram bot
function Start-TelegramBot {
    $process = Get-Process node -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like '*bot*' -or $_.Path -like '*start-bot*'
    }
    
    if (-not $process) {
        Write-Host "Starting Telegram bot..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\Users\Administrator\boteticaret; $env:NODE_ENV="production"; npm run bot' -WindowStyle Hidden
        Start-Sleep -Seconds 5
    } else {
        Write-Host "Telegram bot already running (PID: $($process.Id))" -ForegroundColor Green
    }
}

# Start both
Start-NextApp
Start-Sleep -Seconds 3
Start-TelegramBot

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Applications Started" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, StartTime | Format-Table

