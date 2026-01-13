import type { Metadata } from 'next'
import { InteractiveProvider } from '@arsbreeze/interactive'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
              <div className="container flex h-14 items-center justify-between px-8">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight">
                    Interactive
                  </span>
                </div>
                <ThemeToggle />
              </div>
            </header>
            <div className="flex-1">
              <InteractiveProvider>{children}</InteractiveProvider>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
