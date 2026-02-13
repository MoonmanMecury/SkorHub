import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'SkorHub - All Your Sports in One Place',
  description: 'SkorHub is the world\'s leading sports streaming directory, providing high-quality links to every major sporting event globally.',
}

import { AuthProvider } from '@/components/providers/AuthProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable} dark`}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background-dark font-sans text-white antialiased selection:bg-primary selection:text-white min-h-screen flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
