import ExploreHeader from './explore/_components/ExploreHeader'
import { Toaster } from '@/components/ui/sonner'

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <ExploreHeader />
      <main className="flex-1 [scrollbar-gutter:stable] overflow-y-auto">{children}</main>
      <Toaster />
    </div>
  )
}

export default ExploreLayout
