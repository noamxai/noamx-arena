import { Metadata } from 'next'

// Default metadata for the entire site
export const metadata: Metadata = {
  title: {
    default: 'NoamX Arena | AI Model Testing Platform',
    template: '%s | NoamX Arena'
  },
  description: 'Test and compare multiple AI models in real-time with NoamX Arena. The ultimate platform for evaluating AI model performance with interactive visualizations.',
  keywords: ['AI testing', 'model comparison', 'AI models', 'GPT', 'Llama', 'Claude', 'Gemini', 'AI evaluation', 'prompt testing'],
  authors: [{ name: 'NoamX Team' }],
  creator: 'NoamX Arena',
  publisher: 'NoamX Arena',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://noamx-arena.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NoamX Arena | AI Model Testing Platform',
    description: 'Test and compare multiple AI models in real-time with NoamX Arena. The ultimate platform for evaluating AI model performance with interactive visualizations.',
    url: 'https://noamx-arena.com',
    siteName: 'NoamX Arena',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NoamX Arena - AI Model Testing Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoamX Arena | AI Model Testing Platform',
    description: 'Test and compare multiple AI models in real-time with NoamX Arena. The ultimate platform for evaluating AI model performance.',
    images: ['/images/twitter-image.png'],
    creator: '@noamxarena',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'technology',
}
