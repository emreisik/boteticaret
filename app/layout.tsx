import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-Ticaret',
  description: 'Telegram bot ile yönetilen e-ticaret sitesi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <a href="/" className="text-xl font-bold text-gray-900">
                Bot E-Ticaret
              </a>
              <a
                href="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Yönetim Paneli
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

