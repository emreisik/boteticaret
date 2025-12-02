#!/bin/bash
# Windows Sunucuya Remote Deploy Script
# Kullanım: ./deploy-remote.sh

SERVER_IP="77.245.158.179"
SERVER_PORT="33789"
SERVER_USER="Administrator"
SERVER_PASS="P4fLf!DGez@0L1"
SERVER_PATH="C:/inetpub/wwwroot/boteticaret"

echo "🚀 Windows Sunucuya Deploy Başlatılıyor..."
echo "📡 Sunucu: $SERVER_IP:$SERVER_PORT"

# SSH ile bağlan ve komutları çalıştır
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd C:/inetpub/wwwroot/boteticaret
git pull origin master
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart boteticaret || npm start
ENDSSH

echo "✅ Deploy tamamlandı!"

