import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nahara AI',
  description: 'Chat with different AI models',
  keywords: ['AI', 'Chat', 'Gemini', 'Model', 'Nahara'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
