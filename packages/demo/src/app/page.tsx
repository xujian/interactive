import { Toaster } from 'sonner'
import { InteractiveDemos } from '../components/interactive-demos'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <InteractiveDemos />
      <Toaster />
    </main>
  )
}
