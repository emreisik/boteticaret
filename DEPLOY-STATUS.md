# Deploy Durumu

## Windows Sunucu
- **IP:** 77.245.158.179
- **SSH Port:** 2222
- **User:** Administrator
- **Proje Konumu:** C:\Users\Administrator\boteticaret

## Tamamlanan Adımlar
✅ Proje GitHub'dan klonlandı
✅ Bağımlılıklar yüklendi (npm install)
✅ Prisma client generate edildi
✅ Database migration çalıştırıldı
✅ Build başarılı (npm run build)
✅ .env dosyası oluşturuldu
✅ Firewall kuralı eklendi (Port 3000)
✅ PowerShell start script'leri oluşturuldu

## Çalıştırma

### Manuel Başlatma:
```powershell
cd C:\Users\Administrator\boteticaret
npm start
```

### Arka Planda Başlatma:
```powershell
cd C:\Users\Administrator\boteticaret
.\start-background.ps1
```

### PM2 ile (Eğer çalışıyorsa):
```powershell
pm2 start ecosystem.config.js
pm2 save
```

## Kontrol

### Process Kontrolü:
```powershell
Get-Process node
```

### Port Kontrolü:
```powershell
Test-NetConnection -ComputerName localhost -Port 3000
Get-NetTCPConnection -LocalPort 3000
```

### Site Erişimi:
- Local: http://localhost:3000
- Dışarıdan: http://77.245.158.179:3000

## Sorun Giderme

### Uygulama başlamıyorsa:
1. .env dosyasını kontrol edin
2. Node.js versiyonunu kontrol edin: `node --version`
3. Build'i tekrar yapın: `npm run build`
4. Logları kontrol edin

### Port açık değilse:
1. Firewall kuralını kontrol edin
2. Uygulamanın çalıştığını kontrol edin
3. Başka bir process port 3000'i kullanıyor olabilir

