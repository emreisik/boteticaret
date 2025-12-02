# Install Windows Task Scheduler task to keep app running
# Run this script as Administrator

$taskName = "BotETicaretApp"
$scriptPath = "C:\Users\Administrator\boteticaret\start-with-keepalive.ps1"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALLING TASK SCHEDULER TASK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Remove existing task if it exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Removing existing task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create action
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`"" -WorkingDirectory "C:\Users\Administrator\boteticaret"

# Create trigger - at system startup
$trigger = New-ScheduledTaskTrigger -AtStartup

# Create settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1)

# Create principal (run as current user)
$principal = New-ScheduledTaskPrincipal -UserId "Administrator" -LogonType Interactive -RunLevel Highest

# Register task
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Bot E-Ticaret Application with Keep-Alive"

Write-Host ""
Write-Host "Task installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Task Name: $taskName" -ForegroundColor Cyan
Write-Host "Script: $scriptPath" -ForegroundColor Cyan
Write-Host "Trigger: At system startup" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start now: Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor Yellow
Write-Host "To check status: Get-ScheduledTask -TaskName '$taskName'" -ForegroundColor Yellow
Write-Host "To remove: Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false" -ForegroundColor Yellow
Write-Host ""

