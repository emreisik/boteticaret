# Windows Sunucuya Deploy - Manuel Adımlar

## Sunucu Bilgileri
- **IP:** 77.245.158.179
- **Port:** 33789
- **User:** Administrator
- **Password:** P4fLf!DGez@0L1

## Yöntem 1: RDP ile Bağlanıp Manuel Deploy

### 1. RDP ile Bağlan
```powershell
# Windows'ta RDP aç
mstsc

# Sunucu adresi: 77.245.158.179:33789
# Kullanıcı: Administrator
# Şifre: P4fLf!DGez@0L1
```

### 2. PowerShell veya CMD Aç
Sunucuda PowerShell veya CMD açın.

### 3. Projeyi Klonla
```powershell
cd C:\inetpub\wwwroot
git clone https://github.com/emreisik/boteticaret.git
cd boteticaret
```

### 4. Environment Variables Oluştur
```powershell
# .env dosyası oluştur
New-Item -Path .env -ItemType File -Force

# İçeriğini düzenle
notepad .env
```

`.env` içeriği:
```
DATABASE_URL="file:./dev.db"
TELEGRAM_BOT_TOKEN="8347010025:AAEd4Q58tZipe0VrpVdy7UJOlYqslfj5HT4"
NEXT_PUBLIC_APP_URL="http://77.245.158.179:3000"
```

### 5. Deploy Script'ini Çalıştır
```powershell
# PowerShell ile
.\deploy.ps1

# Veya CMD ile
deploy.bat
```

### 6. Manuel Adımlar (Script çalışmazsa)
```powershell
# Bağımlılıkları yükle
npm install

# Prisma
npx prisma generate
npx prisma migrate deploy

# Build
npm run build

# Start
npm start
```

### 7. PM2 ile (Önerilen)
```powershell
# PM2 yükle
npm install -g pm2

# Uygulamayı başlat
pm2 start npm --name "boteticaret" -- start

# Bot'u başlat
pm2 start npm --name "telegram-bot" -- run bot

# Windows servis olarak kur
pm2 startup
pm2 save
```

### 8. Firewall Ayarları
```powershell
# Port 3000'i aç
New-NetFirewallRule -DisplayName "Next.js App" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

## Yöntem 2: WinSCP ile Dosya Transferi

1. **WinSCP'yi indir:** https://winscp.net/
2. **Bağlan:**
   - Host: 77.245.158.179
   - Port: 33789
   - User: Administrator
   - Password: P4fLf!DGez@0L1
3. **Dosyaları yükle:** Proje klasörünü `C:\inetpub\wwwroot\boteticaret` klasörüne yükle
4. **Terminal aç:** WinSCP'de terminal aç ve yukarıdaki komutları çalıştır

## Yöntem 3: SSH Servisini Aktif Et (Windows Server)

Eğer SSH çalışmıyorsa:

```powershell
# OpenSSH Server'ı yükle
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# SSH servisini başlat
Start-Service sshd

# Otomatik başlatmayı etkinleştir
Set-Service -Name sshd -StartupType 'Automatic'

# Firewall kuralı ekle
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

## Kontrol

Deploy sonrası:
- Site: http://77.245.158.179:3000
- PM2 durumu: `pm2 status`
- Loglar: `pm2 logs`

## Sorun Giderme

### Port 3000 açık değilse:
```powershell
netstat -an | findstr :3000
```

### Node.js yüklü değilse:
- https://nodejs.org/ adresinden Node.js 20.x indir ve yükle

### Git yüklü değilse:
- https://git-scm.com/ adresinden Git indir ve yükle

### PM2 çalışmıyorsa:
```powershell
npm install -g pm2
pm2 install pm2-windows-startup
pm2 startup
```

