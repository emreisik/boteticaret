#!/bin/bash
# SSH Bağlantı Testi
# Kullanım: ./test-ssh.sh

echo "🔌 SSH Bağlantı Testi..."
echo "📡 Sunucu: 77.245.158.179:2222"
echo "👤 Kullanıcı: Administrator"
echo ""

# Bağlantıyı test et
if ssh -o ConnectTimeout=5 -p 2222 Administrator@77.245.158.179 "echo 'Bağlantı başarılı!'" 2>/dev/null; then
    echo "✅ SSH bağlantısı başarılı!"
    echo ""
    echo "🚀 Deploy başlatılıyor..."
    ./deploy-via-ssh.sh
else
    echo "❌ SSH bağlantısı başarısız!"
    echo ""
    echo "Kontrol edin:"
    echo "1. Windows sunucuda SSH servisi çalışıyor mu?"
    echo "2. Firewall'da port 2222 açık mı?"
    echo "3. Sunucu erişilebilir mi?"
    echo ""
    echo "Manuel bağlantı için:"
    echo "ssh Administrator@77.245.158.179 -p 2222"
fi

