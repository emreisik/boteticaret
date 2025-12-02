#!/bin/bash
# Windows Sunucuya SSH ile Deploy
# Kullanım: ./deploy-via-ssh.sh

SERVER_IP="77.245.158.179"
SERVER_PORT="2222"
SERVER_USER="Administrator"

echo "🚀 Windows Sunucuya Deploy Başlatılıyor..."
echo "📡 Sunucu: $SERVER_IP:$SERVER_PORT"
echo ""

# SSH ile bağlan ve komutları çalıştır
ssh $SERVER_USER@$SERVER_IP -p $SERVER_PORT << 'ENDSSH'
# Proje klasörüne git
cd C:/inetpub/wwwroot

# Eğer klasör yoksa klonla
if [ ! -d "boteticaret" ]; then
    echo "📥 Proje klonlanıyor..."
    git clone https://github.com/emreisik/boteticaret.git
    cd boteticaret
else
    echo "📥 Proje güncelleniyor..."
    cd boteticaret
    git pull origin master
fi

# Bağımlılıkları yükle
echo "📦 Bağımlılıklar yükleniyor..."
npm install

# Prisma
echo "🗄️ Prisma client generate ediliyor..."
npx prisma generate

# Migration
echo "🔄 Database migration çalıştırılıyor..."
npx prisma migrate deploy

# Build
echo "🔨 Build yapılıyor..."
npm run build

# PM2 ile restart (eğer varsa)
if command -v pm2 &> /dev/null; then
    echo "🔄 PM2 ile restart yapılıyor..."
    pm2 restart boteticaret || pm2 start npm --name "boteticaret" -- start
    pm2 restart telegram-bot || pm2 start npm --name "telegram-bot" -- run bot
else
    echo "⚠️ PM2 bulunamadı. Manuel başlatın: npm start"
fi

echo "✅ Deploy tamamlandı!"
ENDSSH

echo ""
echo "✅ Deploy işlemi tamamlandı!"
echo "🌐 Site: http://$SERVER_IP:3000"

