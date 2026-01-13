import { Toaster } from 'sonner'
import { InteractiveDemos } from '../components/interactive-demos'

export default function Home() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-8">
      <InteractiveDemos />
      <Toaster />
    </main>
  )
}
