import './globals.css'
import type { Metadata } from 'next'
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Event App',
  description: 'Manage and discover events easily.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased bg-white">
        {children}
      </body>
    </html>
  )
}
