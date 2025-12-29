import type { Metadata } from 'next'
import { InteractiveProvider } from '@arsbreeze/interactive'
import '@arsbreeze/interactive/styles.css'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Demo App',
  description: 'Demo of @arsbreeze/interactive'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <InteractiveProvider>{children}</InteractiveProvider>
      </body>
    </html>
  )
}
