# Site Başlatma ve Otomatik Yeniden Başlatma

## Sorun
Site sürekli duruyor ve manuel olarak yeniden başlatılması gerekiyor.

## Çözüm

### 1. Manuel Başlatma
```powershell
cd C:\Users\Administrator\boteticaret
.\start-both.ps1
```

### 2. Keep-Alive Script (Önerilen)
Keep-alive script'i sürekli çalışır ve site durursa otomatik olarak yeniden başlatır:

```powershell
cd C:\Users\Administrator\boteticaret
.\keep-alive.ps1
```

Bu script'i arka planda çalıştırmak için:
```powershell
Start-Process powershell -ArgumentList '-WindowStyle Hidden', '-File', 'C:\Users\Administrator\boteticaret\keep-alive.ps1' -WindowStyle Hidden
```

### 3. Windows Task Scheduler
Windows başladığında otomatik olarak başlatmak için Task Scheduler kullanılabilir.

## Durum Kontrolü
```powershell
# Process'leri kontrol et
Get-Process node -ErrorAction SilentlyContinue

# Port 3000'i kontrol et
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

# Siteyi test et
Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing
```

## Notlar
- Keep-alive script her 60 saniyede bir kontrol eder
- Port 3000 kapalıysa otomatik olarak yeniden başlatır
- Windows Task Scheduler ile sistem başladığında otomatik başlatılabilir

