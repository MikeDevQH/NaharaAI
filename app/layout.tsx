import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nahara AI',
  description: 'Chat with different AI models. Creativity, code help, and more.',
  keywords: ['AI', 'Chatbot', 'Gemini', 'GPT', 'Nahara AI', 'Code Assistant'],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://nahara-ai.vercel.app'),

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nahara-ai.vercel.app',
    siteName: 'Nahara AI',
    title: 'Nahara AI',
    description: 'Chat with multiple AI models. Creativity, code help, and more.',
    images: [
      {
        url: '/NaharaAI-Banner.png',
        width: 1200,
        height: 630,
        alt: 'Nahara AI Banner - Chat with different AI models',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Nahara AI',
    description: 'Your creative and coding AI assistant.',
    images: ['/NaharaAI-Banner.png'],
  },
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
