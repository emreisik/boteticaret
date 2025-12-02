import 'dotenv/config'
import bot from '../lib/telegram'

// Telegram bot'u polling modunda başlat
// Webhook kullanmıyorsanız bu script'i kullanabilirsiniz
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot.launch()
  console.log('Telegram bot başlatıldı!')
  
  // Graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
} else {
  console.error('TELEGRAM_BOT_TOKEN bulunamadı!')
  process.exit(1)
}

