#!/bin/bash
# Windows Sunucuya SSH Bağlantısı
# Kullanım: ./connect-ssh.sh

echo "🔌 Windows Sunucuya SSH Bağlantısı..."
echo "📡 Sunucu: 77.245.158.179:2222"
echo "👤 Kullanıcı: Administrator"
echo ""
echo "Bağlanılıyor..."

ssh Administrator@77.245.158.179 -p 2222

