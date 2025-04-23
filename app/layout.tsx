import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { Analytics } from "@vercel/analytics/react"

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
    siteName: 'Nahara AI – AI Chat Assistant',
    title: 'Nahara AI – Chat with Creative and Coding Assistants',
    description: 'Talk to different AI models in a beautiful interface. Creativity, code help, and more.',
    images: [
      {
        url: '/NaharaAI-Banner.jpg',
        secureUrl: 'https://nahara-ai.vercel.app/NaharaAI-Banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Nahara AI Banner – Talk to AI',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Nahara AI – Talk with smart AI models for creativity and code',
    description: 'Explore multiple AI models for coding, creative writing, and more – all in one place.',
    images: ['/NaharaAI-Banner.jpg'],
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <head>
      <meta name="p:domain_verify" content="ce61a73510bda5204b8975bdebf7d5bf"/>
      </head>
      <body>
      <ThemeProvider>
      {children}
      <Analytics/>
      </ThemeProvider>
      </body>
    </html>
  )
}

