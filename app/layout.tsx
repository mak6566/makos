import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'makOS — personal web os',
  description: 'my own personal operating system running in the browser. built from scratch!',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0f14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#0b0f14]" style={{ fontFamily: inter.style.fontFamily }}>
      <body className="antialiased overflow-hidden">
        {children}
      </body>
    </html>
  )
}
