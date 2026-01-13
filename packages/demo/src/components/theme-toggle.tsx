'use client'

import * as React from 'react'
import { Switch } from '@/components/ui/switch'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export const ThemeToggle = () => {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative inline-grid h-7 w-14 items-center">
        <div className="h-full w-full rounded-full bg-input/50" />
      </div>
    )
  }

  return (
    <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium">
      <Switch
        checked={resolvedTheme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        className="peer absolute inset-0 h-[inherit] w-14 data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50"
        thumbClassName="h-7 w-7 !bg-background transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
        aria-label="Toggle theme"
      />
      <span className="pointer-events-none relative flex min-w-7 items-center justify-center transition-all duration-300 peer-data-[state=checked]:text-muted-foreground/50 peer-data-[state=unchecked]:text-foreground">
        <Sun className="size-4" aria-hidden="true" />
      </span>
      <span className="pointer-events-none relative flex min-w-7 items-center justify-center transition-all duration-300 peer-data-[state=unchecked]:text-muted-foreground/50 peer-data-[state=checked]:text-foreground">
        <Moon className="size-4" aria-hidden="true" />
      </span>
    </div>
  )
}

