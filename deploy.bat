@echo off
echo 🚀 Windows Sunucuya Deploy Başlatılıyor...

echo 📥 Git pull yapılıyor...
git pull origin master

echo 📦 Bağımlılıklar yükleniyor...
call npm install

echo 🗄️ Prisma client generate ediliyor...
call npx prisma generate

echo 🔄 Database migration çalıştırılıyor...
call npx prisma migrate deploy

echo 🔨 Build yapılıyor...
call npm run build

echo ✅ Deploy tamamlandı!
echo.
echo Manuel başlatmak için: npm start
echo PM2 ile başlatmak için: pm2 start npm --name "boteticaret" -- start
pause

