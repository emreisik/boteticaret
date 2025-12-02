# Start both Next.js app and Telegram bot
cd C:\Users\Administrator\boteticaret

# Start Next.js app
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\Users\Administrator\boteticaret; $env:NODE_ENV="production"; npm start' -WindowStyle Hidden

# Wait a bit
Start-Sleep -Seconds 3

# Start Telegram bot
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\Users\Administrator\boteticaret; $env:NODE_ENV="production"; npm run bot' -WindowStyle Hidden

Write-Host "Next.js app ve Telegram bot baslatildi!" -ForegroundColor Green

