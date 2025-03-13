import './styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NoamX Arena - AI Model Testing Platform',
  description: 'Test, compare, and analyze AI models with our advanced testing platform.',
  keywords: 'AI, artificial intelligence, model testing, GPT, Claude, Gemini, comparison',
  authors: [{ name: 'NoamX Team' }],
  creator: 'NoamX',
  publisher: 'NoamX',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://noamx-arena.com',
    title: 'NoamX Arena - AI Model Testing Platform',
    description: 'Test, compare, and analyze AI models with our advanced testing platform.',
    siteName: 'NoamX Arena',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoamX Arena - AI Model Testing Platform',
    description: 'Test, compare, and analyze AI models with our advanced testing platform.',
    creator: '@NoamXArena',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
